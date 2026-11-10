import json, os, pathlib, subprocess, sys, time

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
out_dir = STUDIO / "out" / "no-gravity"
out_dir.mkdir(parents=True, exist_ok=True)
env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("STARTING NO-GRAVITY RENDER PIPELINE (6-Min & Short)")
print("==================================================")
t_start = time.time()

# ----------------- Step 1: Render 6 Chapters -----------------
chapter_files = []
for i in range(1, 7):
    ch_id = f"NoGravity-Ch{i}"
    ch_out = out_dir / f"ch_{i}.mp4"
    chapter_files.append(ch_out)
    
    if ch_out.exists() and ch_out.stat().st_size > 1000000:
        print(f"Chapter {i} already rendered, skipping.")
        continue
        
    print(f"\n--- Rendering Chapter {i}/6: {ch_id} ---")
    t0 = time.time()
    cmd = [
        "npx.cmd", "remotion", "render", "src/index.ts", ch_id,
        str(ch_out), "--concurrency", "4", "--log", "error"
    ]
    subprocess.run(cmd, cwd=STUDIO, check=True, env=env)
    print(f"Chapter {i} rendered in {time.time() - t0:.1f}s ({ch_out.stat().st_size / 1e6:.1f} MB)")

# ----------------- Step 2: Concat 6 Chapters -----------------
concat_txt = out_dir / "concat_list.txt"
with open(concat_txt, "w", encoding="utf-8") as f:
    for cf in chapter_files:
        f.write(f"file '{cf.name}'\n")

raw_master = out_dir / "no_gravity_6m_raw.mp4"
final_master = out_dir / "no_gravity_6m_final.mp4"

print("\n--- Concatenating 6 chapters into master video ---")
cmd_concat = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt),
    "-c", "copy", str(raw_master)
]
subprocess.run(cmd_concat, cwd=out_dir, check=True)

# ----------------- Step 3: Master 6-Min Audio (-14 LUFS) -----------------
print("\n--- Mastering 6-Minute Audio to -14 LUFS ---")
I, TP, LRA = -14.0, -1.5, 11
first = subprocess.run(
    ['ffmpeg', '-hide_banner', '-nostats', '-i', str(raw_master),
     '-af', f'loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json', '-f', 'null', '-'],
    capture_output=True, text=True, encoding='utf-8', errors='ignore'
).stderr
m = json.loads(first[first.rfind('{'):first.rfind('}') + 1])
filt = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
        f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")

cmd_master = [
    'ffmpeg', '-y', '-v', 'error', '-i', str(raw_master), '-c:v', 'copy',
    '-af', filt, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart', str(final_master)
]
subprocess.run(cmd_master, check=True)
print(f"Master 6-Min Video Ready: {final_master}")

# ----------------- Step 4: Render Shorts Version (43s) -----------------
print("\n--- Rendering Shorts Version (43s) ---")
short_raw = out_dir / "short_raw.mp4"
short_mobile = out_dir / "no_gravity_short_mobile.mp4"

cmd_short = [
    "npx.cmd", "remotion", "render", "src/index.ts", "NoGravity-Short",
    str(short_raw), "--concurrency", "4", "--log", "error"
]
subprocess.run(cmd_short, cwd=STUDIO, check=True, env=env)

# Convert to 9:16 Vertical Mobile Format (1080x1920)
print("\n--- Converting Short to 9:16 Vertical Mobile Format ---")
filter_complex = (
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.22[bg];"
    "[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0x38BDF8[fg];"
    "[bg][fg]overlay=0:(H-h)/2[comp];"
    "[comp]drawtext=text='WHAT IF EARTH LOST GRAVITY?':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=220:"
    "box=1:boxcolor=0x0F172A@0.85:boxborderw=18,"
    "drawtext=text='THE 60TH SECOND... 😱':fontcolor=0xFBBF24:fontsize=44:x=(w-text_w)/2:y=1620:"
    "box=1:boxcolor=0x0F172A@0.85:boxborderw=16[outv]"
)
cmd_convert = [
    "ffmpeg", "-y", "-i", str(short_raw),
    "-filter_complex", filter_complex,
    "-map", "[outv]", "-map", "0:a",
    "-c:v", "libx264", "-preset", "fast", "-crf", "19",
    "-c:a", "aac", "-b:a", "256k",
    "-movflags", "+faststart",
    str(short_mobile)
]
subprocess.run(cmd_convert, check=True)

# ----------------- Step 5: Generate Thumbnail (Preserve custom text thumbnail) -----------------
thumb_path = out_dir / "thumbnail.png"
if not thumb_path.exists():
    subprocess.run([
        'ffmpeg', '-y', '-i', str(final_master),
        '-ss', '00:00:25', '-vframes', '1', str(thumb_path)
    ], check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
else:
    print(f"Using high-contrast eye-catching thumbnail: {thumb_path}")

dur_long = float(subprocess.run(
    ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(final_master)],
    capture_output=True, text=True
).stdout.strip())
dur_short = float(subprocess.run(
    ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(short_mobile)],
    capture_output=True, text=True
).stdout.strip())

print(f"\n==================================================")
print(f"ALL RENDERS COMPLETE!")
print(f"Full 6-Min Video: {final_master} ({dur_long:.1f}s, {final_master.stat().st_size/1e6:.1f} MB)")
print(f"Mobile Short:     {short_mobile} ({dur_short:.1f}s, {short_mobile.stat().st_size/1e6:.1f} MB)")
print(f"Thumbnail:        {thumb_path}")
print(f"Total Render Time: {(time.time() - t_start)/60:.1f} minutes")
print(f"==================================================")


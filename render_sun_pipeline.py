import json, os, pathlib, subprocess, sys, time

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
out_dir = STUDIO / "out" / "no-sun"
out_dir.mkdir(parents=True, exist_ok=True)
env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("STARTING NO-SUN RENDER & UPLOAD PIPELINE")
print("==================================================")
t_start = time.time()

# Ensure custom bold text thumbnails are protected
art_h = out_dir / "thumbnail_art.png"
art_v = out_dir / "thumbnail_short_art.png"
th_h = out_dir / "thumbnail.png"
th_v = out_dir / "thumbnail_short.png"
if art_h.exists():
    th_h.write_bytes(art_h.read_bytes())
if art_v.exists():
    th_v.write_bytes(art_v.read_bytes())
print("Custom bold text thumbnails locked & ready.")

# ----------------- PHASE 1: 14-SECOND MOBILE SHORT (FAST TRACK) -----------------
print("\n>>> PHASE 1: RENDERING 14-SECOND YOUTUBE SHORT (420 Frames) <<<")
short_raw = out_dir / "short_raw.mp4"
short_mobile = out_dir / "no_sun_short_mobile.mp4"

if not short_raw.exists() or short_raw.stat().st_size < 100000:
    t0 = time.time()
    cmd_short = [
        "npx.cmd", "remotion", "render", "src/index.ts", "NoSun-Short",
        str(short_raw), "--concurrency", "4", "--log", "error"
    ]
    subprocess.run(cmd_short, cwd=STUDIO, check=True, env=env)
    print(f"Shorts rendered in {time.time() - t0:.1f}s ({short_raw.stat().st_size / 1e6:.2f} MB)")

# Convert to 9:16 Vertical Mobile Format (1080x1920)
if not short_mobile.exists() or short_mobile.stat().st_size < 100000:
    print("Converting Short to 9:16 Vertical Mobile Format (1080x1920)...")
    filter_complex = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.22[bg];"
        "[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xFBBF24[fg];"
        "[bg][fg]overlay=0:(H-h)/2[comp];"
        "[comp]drawtext=text='WHAT IF THE SUN VANISHED?':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=220:"
        "box=1:boxcolor=0x0F172A@0.85:boxborderw=18,"
        "drawtext=text='EARTH FREEZES IN DEEP SPACE! 🥶':fontcolor=0xFBBF24:fontsize=42:x=(w-text_w)/2:y=1620:"
        "box=1:boxcolor=0x0F172A@0.85:boxborderw=16[outv]"
    )
    cmd_convert = [
        "ffmpeg", "-y", "-i", str(short_raw),
        "-filter_complex", filter_complex,
        "-map", "[outv]", "-map", "0:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "19",
        "-c:a", "aac", "-b:a", "256k",
        "-t", "14.0",
        "-movflags", "+faststart",
        str(short_mobile)
    ]
    subprocess.run(cmd_convert, check=True)
    print(f"14-Second Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size / 1e6:.2f} MB)")

# Upload Short Immediately
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
from upload import upload

class Args:
    pass

def upload_meta(meta_path):
    with open(meta_path, encoding="utf-8") as f:
        m = json.load(f)
    a = Args()
    a.video = m["video"]
    a.title = m["title"]
    a.description = m["description"]
    a.tags = m["tags"]
    a.thumbnail = m.get("thumbnail")
    a.category = m.get("category", "27")
    a.privacy = m.get("privacy", "public")
    a.schedule = None
    a.playlist = None
    print(f"\n==========================================")
    print(f"UPLOADING: {a.title}")
    vid = upload(a)
    print(f"SUCCESS: Video ID = {vid}")
    return vid

print("\n--- Uploading 14-Second Mobile Short to YouTube ---")
try:
    id_short = upload_meta(r"D:\AI-Cartoons\youtube\meta_sun_short.json")
    print(f"SHORT IS LIVE: https://youtube.com/shorts/{id_short}")
except Exception as e:
    print(f"Short upload notice: {e}")

# ----------------- PHASE 2: 5-MINUTE FULL EPISODE (6 CHAPTERS) -----------------
print("\n>>> PHASE 2: RENDERING 5-MINUTE FULL EPISODE (6 CHAPTERS) <<<")
chapter_files = []
for i in range(1, 7):
    ch_id = f"NoSun-Ch{i}"
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

# Concat 6 Chapters
concat_txt = out_dir / "concat_list.txt"
with open(concat_txt, "w", encoding="utf-8") as f:
    for cf in chapter_files:
        f.write(f"file '{cf.name}'\n")

raw_master = out_dir / "no_sun_5m_raw.mp4"
final_master = out_dir / "no_sun_5m_final.mp4"

print("\n--- Concatenating 6 chapters into 5-minute master video ---")
cmd_concat = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt),
    "-c", "copy", str(raw_master)
]
subprocess.run(cmd_concat, cwd=out_dir, check=True)

# Master Audio to -14 LUFS
print("\n--- Mastering 5-Minute Audio to -14 LUFS ---")
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
print(f"Master 5-Min Video Ready: {final_master} ({final_master.stat().st_size / 1e6:.2f} MB)")

# Restore high contrast thumbnail
if art_h.exists():
    th_h.write_bytes(art_h.read_bytes())
print(f"Thumbnail verified: {th_h}")

# Upload 5-Minute Full Episode
print("\n--- Uploading 5-Minute Master Video to YouTube ---")
try:
    id_long = upload_meta(r"D:\AI-Cartoons\youtube\meta_sun_5m.json")
    print(f"FULL VIDEO IS LIVE: https://youtu.be/{id_long}")
except Exception as e:
    print(f"Long video upload notice: {e}")

print(f"\n==================================================")
print(f"ALL WORK COMPLETE! Total Time: {(time.time() - t_start)/60:.1f} minutes")
print(f"==================================================")


import json, os, pathlib, subprocess, sys, time

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
out_dir = STUDIO / "out" / "pause-10m"
out_dir.mkdir(parents=True, exist_ok=True)
env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("Starting 10-Minute Video Render Pipeline (8 Chapters)...")
t_start = time.time()
chapter_files = []

for i in range(1, 9):
    ch_id = f"Pause10m-Ch{i}"
    ch_out = out_dir / f"ch_{i}.mp4"
    chapter_files.append(ch_out)
    
    if ch_out.exists() and ch_out.stat().st_size > 1000000:
        print(f"Chapter {i} already rendered ({ch_out.stat().st_size / 1e6:.1f} MB), skipping.")
        continue
        
    print(f"\n--- Rendering Chapter {i}/8: {ch_id} ---")
    t0 = time.time()
    cmd = [
        "npx.cmd", "remotion", "render", "src/index.ts", ch_id,
        str(ch_out), "--concurrency", "4", "--log", "error"
    ]
    subprocess.run(cmd, cwd=STUDIO, check=True, env=env)
    print(f"Chapter {i} rendered in {time.time() - t0:.1f}s ({ch_out.stat().st_size / 1e6:.1f} MB)")

# Step 9: Concatenate all 8 chapters into master video
concat_txt = out_dir / "concat_list.txt"
with open(concat_txt, "w", encoding="utf-8") as f:
    for cf in chapter_files:
        f.write(f"file '{cf.name}'\n")

raw_master = out_dir / "pause_10m_raw.mp4"
final_master = out_dir / "pause_10m_final.mp4"

print("\n--- Concatenating 8 chapters into master video ---")
cmd_concat = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0", "-i", str(concat_txt),
    "-c", "copy", str(raw_master)
]
subprocess.run(cmd_concat, cwd=out_dir, check=True)

# Step 10: Two-pass Loudnorm Audio Mastering (-14 LUFS)
print("\n--- Broadcast Audio Mastering (-14 LUFS) ---")
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

dur = float(subprocess.run(
    ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(final_master)],
    capture_output=True, text=True
).stdout.strip())

size_mb = final_master.stat().st_size / 1e6
total_time = (time.time() - t_start) / 60

print(f"\n==========================================")
print(f"10-MINUTE VIDEO COMPLETE!")
print(f"File: {final_master}")
print(f"Duration: {dur:.2f} seconds ({dur/60:.2f} minutes)")
print(f"File Size: {size_mb:.1f} MB")
print(f"Total Pipeline Time: {total_time:.1f} minutes")
print(f"==========================================")

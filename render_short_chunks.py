import os
import pathlib
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "death-timer"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("🎬 RENDERING DEATH TIMER SHORT IN SAFE CHUNKS")
print("==================================================")

p1 = OUT_DIR / "short_p1.mp4"
p2 = OUT_DIR / "short_p2.mp4"
short_raw = OUT_DIR / "short_raw.mp4"
short_mobile = OUT_DIR / "timer_short_mobile.mp4"

# Part 1: frames 0-480
if not p1.exists() or p1.stat().st_size < 500000:
    print("\n--- Rendering Short Part 1 (frames 0-480) ---")
    cmd_p1 = [
        'npx.cmd', 'remotion', 'render', 'src/index-timer.ts', 'Timer-Short',
        'out/death-timer/short_p1.mp4', '--public-dir=public_timer',
        '--concurrency=1', '--frames=0-480'
    ]
    subprocess.run(cmd_p1, cwd=STUDIO, env=ENV, check=True)
    print(f"Part 1 ready! ({p1.stat().st_size} bytes)")
else:
    print(f"Part 1 already exists! ({p1.stat().st_size} bytes)")

# Part 2: frames 481-950
if not p2.exists() or p2.stat().st_size < 500000:
    print("\n--- Rendering Short Part 2 (frames 481-950) ---")
    cmd_p2 = [
        'npx.cmd', 'remotion', 'render', 'src/index-timer.ts', 'Timer-Short',
        'out/death-timer/short_p2.mp4', '--public-dir=public_timer',
        '--concurrency=1', '--frames=481-950'
    ]
    subprocess.run(cmd_p2, cwd=STUDIO, env=ENV, check=True)
    print(f"Part 2 ready! ({p2.stat().st_size} bytes)")
else:
    print(f"Part 2 already exists! ({p2.stat().st_size} bytes)")

# Concatenate Part 1 & Part 2
print("\n--- Concatenating Parts into short_raw.mp4 ---")
concat_txt = OUT_DIR / "concat_short.txt"
with open(concat_txt, "w", encoding="utf-8") as f:
    f.write(f"file '{p1.name}'\n")
    f.write(f"file '{p2.name}'\n")

cmd_concat = [
    'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
    '-i', str(concat_txt),
    '-c', 'copy',
    str(short_raw)
]
subprocess.run(cmd_concat, check=True)
print(f"short_raw.mp4 concatenated! ({short_raw.stat().st_size} bytes)")

# Format 9:16 vertical short
print("\n--- Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
filter_complex = (
    '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
    '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xEF4444[fg];'
    '[bg][fg]overlay=0:(H-h)/2[comp];'
    '[comp]drawtext=text=\'SEEING EVERYONE\\\'S DEATH TIMER? ⏳💀\':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=230:'
    'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
    'drawtext=text=\'WOULD YOU LOOK AT YOUR OWN TIMER? 👇\':fontcolor=0xFDE047:fontsize=36:x=(w-text_w)/2:y=1610:'
    'box=1:boxcolor=0x0F172A@0.92:boxborderw=16[outv]'
)
cmd_mobile = [
    'ffmpeg', '-y', '-i', str(short_raw),
    '-filter_complex', filter_complex,
    '-map', '[outv]', '-map', '0:a',
    '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '19',
    '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart',
    str(short_mobile)
]
subprocess.run(cmd_mobile, check=True)
print(f"✨ Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")

# Upload to YouTube
print("\n--- 🚀 Uploading Mobile Short to YouTube ---")
try:
    subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_timer_short.py'], check=True)
except Exception as e:
    print(f"Short upload exception: {e}")

print("✅ SHORT PIPELINE COMPLETED!")


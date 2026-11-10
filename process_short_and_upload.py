import pathlib
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "death-timer"

c0 = OUT_DIR / "short_raw_part_0_0_249.mp4"
c1 = OUT_DIR / "short_raw_part_1_250_499.mp4"
c2 = OUT_DIR / "short_raw_part_2_500_749.mp4"
c3a = OUT_DIR / "short_p3a.mp4"
c3b = OUT_DIR / "short_p3b.mp4"

short_raw = OUT_DIR / "short_raw.mp4"
short_mobile = OUT_DIR / "timer_short_mobile.mp4"

print("--- 1. Merging All 5 Chunks into short_raw.mp4 ---")
concat_txt = OUT_DIR / "concat_short_all.txt"
with open(concat_txt, "w", encoding="utf-8") as f:
    for c in [c0, c1, c2, c3a, c3b]:
        f.write(f"file '{c.name}'\n")

cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(short_raw)]
subprocess.run(cmd_concat, check=True)
print(f"Merged short_raw.mp4! Size: {short_raw.stat().st_size} bytes")

print("\n--- 2. Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
filter_complex = (
    '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
    '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xEF4444[fg];'
    '[bg][fg]overlay=0:(H-h)/2[comp];'
    '[comp]drawtext=text=SEEING EVERYONES DEATH TIMER? ⏳💀:fontcolor=white:fontsize=46:x=(w-text_w)/2:y=230:'
    'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
    'drawtext=text=WOULD YOU LOOK AT YOUR OWN TIMER? 👇:fontcolor=0xFDE047:fontsize=36:x=(w-text_w)/2:y=1610:'
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
print(f"✨ Formatted Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")

print("\n--- 3. Uploading Short to YouTube ---")
res = subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_timer_short.py'], check=True)
print("✅ SHORT UPLOAD COMPLETED SUCCESSFULLY!")

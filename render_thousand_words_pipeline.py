import os
import pathlib
import subprocess
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "thousand-words"
OUT_DIR = STUDIO / "out" / "thousand-words"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

# Copy thumbnails to out dir
shutil.copyfile(PUB_DIR / "thumbnail.jpg", OUT_DIR / "thumbnail.jpg")
shutil.copyfile(PUB_DIR / "thumbnail_short.jpg", OUT_DIR / "thumbnail_short.jpg")
print("Copied thumbnails to OUT_DIR.")

print("==================================================")
print("🎬 RENDERING: WHAT IF YOU ONLY HAD 1,000 WORDS LEFT? ⏳🤐")
print("==================================================")

# ----------------------------------------------------
# 1. RENDER VERTICAL SHORT (26.5s, 795 frames)
# ----------------------------------------------------
short_raw = OUT_DIR / "short_raw.mp4"
short_mobile = OUT_DIR / "words_short_mobile.mp4"

print("\n--- 1. Rendering Mobile Short Raw ---")
if not short_raw.exists() or short_raw.stat().st_size < 1000000:
    cmd_short = [
        'npx.cmd', 'remotion', 'render', 'src/index-words.ts', 'Words-Short',
        str(short_raw), '--concurrency', '1', '--log', 'error'
    ]
    subprocess.run(cmd_short, cwd=STUDIO, env=ENV, check=True)
    print(f"Short raw rendered! ({short_raw.stat().st_size} bytes)")
else:
    print(f"Short raw already exists! ({short_raw.stat().st_size} bytes)")

print("\n--- 2. Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
filter_complex = (
    '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
    '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0x06B6D4[fg];'
    '[bg][fg]overlay=0:(H-h)/2[comp];'
    '[comp]drawtext=text=\'ONLY 1,000 WORDS LEFT? ⏳\':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=230:'
    'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
    'drawtext=text=\'WHAT WOULD YOUR FINAL 3 WORDS BE? 👇\':fontcolor=0xFDE047:fontsize=36:x=(w-text_w)/2:y=1610:'
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

# Auto-upload Short immediately
print("\n--- 🚀 Uploading Mobile Short to YouTube ---")
try:
    res_short = subprocess.run(['python', r'D:\AI-Cartoons\upload_words_short.py'], capture_output=True, text=True)
    print("SHORT UPLOAD OUTPUT:\n", res_short.stdout)
    if res_short.stderr:
        print("SHORT UPLOAD STDERR:\n", res_short.stderr)
except Exception as e:
    print(f"Short upload exception: {e}")

# ----------------------------------------------------
# 2. RENDER CHAPTERS 1 TO 5 (FULL 2:45 EPISODE)
# ----------------------------------------------------
CHAPTERS = [
    ('Words-Ch1', 'ch_1.mp4'),
    ('Words-Ch2', 'ch_2.mp4'),
    ('Words-Ch3', 'ch_3.mp4'),
    ('Words-Ch4', 'ch_4.mp4'),
    ('Words-Ch5', 'ch_5.mp4'),
]

rendered_files = []
for comp_id, filename in CHAPTERS:
    out_ch = OUT_DIR / filename
    print(f"\n--- Rendering {comp_id} -> {filename} ---")
    if not out_ch.exists() or out_ch.stat().st_size < 1000000:
        cmd_ch = [
            'npx.cmd', 'remotion', 'render', 'src/index-words.ts', comp_id,
            str(out_ch), '--concurrency', '1', '--log', 'error'
        ]
        subprocess.run(cmd_ch, cwd=STUDIO, env=ENV, check=True)
        print(f"Rendered {filename} ({out_ch.stat().st_size} bytes)")
    else:
        print(f"{filename} already exists! ({out_ch.stat().st_size} bytes)")
    rendered_files.append(out_ch)

# ----------------------------------------------------
# 3. CONCATENATE CHAPTERS & MASTER AUDIO
# ----------------------------------------------------
concat_list = OUT_DIR / "concat_list.txt"
with open(concat_list, "w", encoding="utf-8") as f:
    for rf in rendered_files:
        f.write(f"file '{rf.name}'\n")

main_raw = OUT_DIR / "words_main_raw.mp4"
main_final = OUT_DIR / "words_main_final.mp4"

print("\n--- Concatenating Chapters ---")
cmd_concat = [
    'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
    '-i', str(concat_list),
    '-c', 'copy',
    str(main_raw)
]
subprocess.run(cmd_concat, check=True)

print("\n--- Mastering Full 2:45 Episode to Broadcast -14.0 LUFS ---")
cmd_master = [
    'ffmpeg', '-y', '-i', str(main_raw),
    '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart',
    str(main_final)
]
subprocess.run(cmd_master, check=True)
print(f"\n🎉 FULL 16:9 EPISODE MASTER READY: {main_final} ({main_final.stat().st_size} bytes)")

# ----------------------------------------------------
# 4. ATTEMPT AUTOMATIC FULL EPISODE UPLOAD
# ----------------------------------------------------
print("\n==================================================")
print("🚀 ATTEMPTING FULL EPISODE YOUTUBE UPLOAD")
print("==================================================")
try:
    print("Uploading Full Episode...")
    res_main = subprocess.run(['python', r'D:\AI-Cartoons\upload_words_main.py'], capture_output=True, text=True)
    print("MAIN UPLOAD OUTPUT:\n", res_main.stdout)
    if res_main.stderr:
        print("MAIN UPLOAD STDERR:\n", res_main.stderr)
except Exception as e:
    print(f"Main upload exception: {e}")

print("==================================================")
print("✅ ALL PIPELINE TASKS COMPLETED!")
print("==================================================")



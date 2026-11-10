import os, pathlib, subprocess, sys, time

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "stickman-life"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("🎬 RENDERING: THE LIFE OF A STICKMAN (SHORT FILM)")
print("==================================================")

# Step 1: Render Short first
short_raw = OUT_DIR / "short_raw.mp4"
short_mobile = OUT_DIR / "stickman_short_mobile.mp4"

print("\n--- 1. Rendering Mobile Short Raw ---")
cmd_short = [
    'npx.cmd', 'remotion', 'render', 'src/index.ts', 'Stickman-Short',
    str(short_raw), '--concurrency', '2', '--log', 'error'
]
subprocess.run(cmd_short, cwd=STUDIO, env=ENV, check=True)
print(f"Short raw rendered! ({short_raw.stat().st_size} bytes)")

# Step 2: Format to 9:16 Vertical Mobile Short
print("\n--- 2. Formatting 9:16 Vertical Short with Ambient Blur ---")
filter_complex = (
    '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.22[bg];'
    '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xF59E0B[fg];'
    '[bg][fg]overlay=0:(H-h)/2[comp];'
    '[comp]drawtext=text=\'THE LIFE OF A STICKMAN\':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=240:'
    'box=1:boxcolor=0x0F172A@0.88:boxborderw=18,'
    'drawtext=text=\'LINES FADE... BUT LOVE STAYS 🌸💔\':fontcolor=0xFBBF24:fontsize=42:x=(w-text_w)/2:y=1600:'
    'box=1:boxcolor=0x0F172A@0.88:boxborderw=16[outv]'
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
print(f"✅ Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")

# Step 3: Render Chapters 1 to 5 for Full Film
CHAPTERS = [
    ('Stickman-Ch1', 'ch_1.mp4'),
    ('Stickman-Ch2', 'ch_2.mp4'),
    ('Stickman-Ch3', 'ch_3.mp4'),
    ('Stickman-Ch4', 'ch_4.mp4'),
    ('Stickman-Ch5', 'ch_5.mp4'),
]

rendered_files = []
for comp_id, filename in CHAPTERS:
    out_ch = OUT_DIR / filename
    print(f"\n--- Rendering {comp_id} -> {filename} ---")
    cmd_ch = [
        'npx.cmd', 'remotion', 'render', 'src/index.ts', comp_id,
        str(out_ch), '--concurrency', '2', '--log', 'error'
    ]
    subprocess.run(cmd_ch, cwd=STUDIO, env=ENV, check=True)
    rendered_files.append(out_ch)
    print(f"Rendered {filename} ({out_ch.stat().st_size} bytes)")

# Step 4: Concatenate Chapters
concat_list = OUT_DIR / "concat_list.txt"
with open(concat_list, "w", encoding="utf-8") as f:
    for rf in rendered_files:
        f.write(f"file '{rf.name}'\n")

main_raw = OUT_DIR / "stickman_main_raw.mp4"
main_final = OUT_DIR / "stickman_main_final.mp4"

print("\n--- Concatenating Chapters ---")
cmd_concat = [
    'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
    '-i', str(concat_list),
    '-c', 'copy',
    str(main_raw)
]
subprocess.run(cmd_concat, check=True)

# Step 5: Master Full Film Audio to -14 LUFS
print("\n--- Mastering Full Film to Broadcast -14.0 LUFS ---")
cmd_master = [
    'ffmpeg', '-y', '-i', str(main_raw),
    '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart',
    str(main_final)
]
subprocess.run(cmd_master, check=True)
print(f"✅ Full Short Film Master Ready: {main_final} ({main_final.stat().st_size} bytes)")

# Step 6: Generate Cinematic Thumbnail
thumb_file = OUT_DIR / "thumbnail.jpg"
thumb_short = OUT_DIR / "thumbnail_short.jpg"

# Extract frame 350 from ch2 (Arthur & Lily with glowing heart) for main thumbnail
cmd_thumb = [
    'ffmpeg', '-y', '-ss', '00:00:12', '-i', str(main_final),
    '-vframes', '1', '-q:v', '2',
    str(thumb_file)
]
subprocess.run(cmd_thumb, check=True)

cmd_thumb_short = [
    'ffmpeg', '-y', '-ss', '00:00:08', '-i', str(short_mobile),
    '-vframes', '1', '-q:v', '2',
    str(thumb_short)
]
subprocess.run(cmd_thumb_short, check=True)

print("🎉 ALL RENDERS & THUMBNAILS COMPLETE!")


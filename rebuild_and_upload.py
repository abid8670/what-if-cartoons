import os, pathlib, subprocess, sys, json

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "platform-dog"
YOUTUBE_DIR = pathlib.Path(r"D:\AI-Cartoons\youtube")

print("--- 1. Re-concatenating Chapters 1 to 5 (WITHOUT INTRO) ---")
concat_list = OUT_DIR / "concat_list.txt"
chapters = ['ch_1.mp4', 'ch_2.mp4', 'ch_3.mp4', 'ch_4.mp4', 'ch_5.mp4']

with open(concat_list, "w", encoding="utf-8") as f:
    for ch in chapters:
        f.write(f"file '{ch}'\n")

main_raw = OUT_DIR / "dog_main_raw.mp4"
main_final = OUT_DIR / "dog_main_final.mp4"

cmd_concat = [
    'ffmpeg', '-y', '-f', 'concat', '-safe', '0',
    '-i', str(concat_list),
    '-c', 'copy',
    str(main_raw)
]
subprocess.run(cmd_concat, check=True)
print(f"Concatenated raw video ({main_raw.stat().st_size} bytes)")

print("\n--- 2. Mastering Audio to Broadcast -14.0 LUFS ---")
cmd_master = [
    'ffmpeg', '-y', '-i', str(main_raw),
    '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart',
    str(main_final)
]
subprocess.run(cmd_master, check=True)
print(f"✅ Final Video Ready (NO INTRO): {main_final} ({main_final.stat().st_size} bytes)")

# Update Thumbnail
thumb_file = OUT_DIR / "thumbnail.jpg"
cmd_thumb = [
    'ffmpeg', '-y', '-ss', '00:00:16', '-i', str(main_final),
    '-vframes', '1', '-q:v', '2',
    str(thumb_file)
]
subprocess.run(cmd_thumb, check=True)
print("Updated thumbnail.jpg")

print("\n--- 3. Uploading to YouTube ---")
with open(YOUTUBE_DIR / "meta_dog_main.json", encoding="utf-8") as f:
    meta = json.load(f)

cmd_upload = [
    'python', str(YOUTUBE_DIR / 'upload.py'),
    '--video', str(main_final),
    '--title', meta['title'],
    '--description', meta['description'],
    '--tags', meta['tags'],
    '--thumbnail', str(thumb_file),
    '--category', meta.get('category', '1'),
    '--privacy', meta.get('privacy', 'public')
]
res = subprocess.run(cmd_upload, capture_output=True, text=True)
print("UPLOAD STDOUT:", res.stdout)
print("UPLOAD STDERR:", res.stderr)
if res.returncode == 0:
    print("🎉 RE-UPLOAD SUCCESSFUL!")
else:
    print(f"Exit code: {res.returncode}")


import json
import pathlib
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

YOUTUBE_DIR = pathlib.Path(r"D:\AI-Cartoons\youtube")
META_PATH = YOUTUBE_DIR / "meta_lifespan_main.json"

with open(META_PATH, encoding="utf-8") as f:
    meta = json.load(f)

print(f"Uploading Lifespan Full Film: {meta['title']}...")
print(f"Video file: {meta['video']}")

cmd = [
    'python', str(YOUTUBE_DIR / 'upload.py'),
    '--video', meta['video'],
    '--title', meta['title'],
    '--description', meta['description'],
    '--tags', meta['tags'],
    '--thumbnail', meta['thumbnail'],
    '--category', meta.get('category', '1'),
    '--privacy', meta.get('privacy', 'public')
]

res = subprocess.run(cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
if res.returncode == 0:
    print("SUCCESSFULLY UPLOADED LIFESPAN FULL FILM!")
    for line in res.stdout.splitlines():
        if "UPLOADED: https://youtu.be/" in line:
            url = line.split("UPLOADED: ")[1].strip()
            with open(r"D:\AI-Cartoons\what-if-studio\out\lifespan\uploaded_main.txt", "w", encoding="utf-8") as out_f:
                out_f.write(url)
            print("Saved uploaded URL:", url)
else:
    print(f"FAILED with exit code {res.returncode}")


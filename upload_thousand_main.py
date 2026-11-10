import json
import pathlib
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

YOUTUBE_DIR = pathlib.Path(r"D:\AI-Cartoons\youtube")
META_PATH = YOUTUBE_DIR / "meta_thousand_main.json"

with open(META_PATH, encoding="utf-8") as f:
    meta = json.load(f)

print(f"Uploading Full Episode: {meta['title']}...")
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

res = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", res.stdout)
print("STDERR:", res.stderr)
if res.returncode == 0:
    print("SUCCESSFULLY UPLOADED 1,000 OR 1 FULL EPISODE!")
else:
    print(f"FAILED with exit code {res.returncode}")


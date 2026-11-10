import json, sys
sys.stdout.reconfigure(encoding='utf-8')

src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read()
src = src.split("if __name__")[0]
exec(src)

with open(r"D:\AI-Cartoons\youtube\meta_pause_10m.json", encoding="utf-8") as f:
    m = json.load(f)

class Args:
    pass
a = Args()
a.video = m["video"]
a.title = m["title"]
a.description = m["description"]
a.tags = m["tags"]
a.thumbnail = m["thumbnail"]
a.category = m.get("category", "27")
a.privacy = m.get("privacy", "public")
a.schedule = None
a.playlist = None

print(f"Starting upload for: {a.title}")
print(f"Video file: {a.video}")
print(f"Privacy: {a.privacy}")
vid = upload(a)
print("SUCCESS: FINAL_VIDEO_ID=" + vid)
print(f"Watch URL: https://youtu.be/{vid}")

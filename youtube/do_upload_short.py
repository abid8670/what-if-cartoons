import json, sys
sys.stdout.reconfigure(encoding='utf-8')

src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read()
src = src.split("if __name__")[0]
exec(src)

with open(r"D:\AI-Cartoons\youtube\meta_pause_short.json", encoding="utf-8") as f:
    m = json.load(f)

class Args:
    pass
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

print(f"Starting YouTube Short upload for: {a.title}")
print(f"Video file: {a.video}")
vid = upload(a)
print("SUCCESS: SHORTS_VIDEO_ID=" + vid)
print(f"Shorts URL: https://youtube.com/shorts/{vid}")


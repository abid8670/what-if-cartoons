"""Upload copy-paste episode from metadata JSON."""
import json, sys
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("if __name__")[0]
exec(src)

with open(r"D:\AI-Cartoons\youtube\meta_copy_paste.json", encoding="utf-8") as f:
    m = json.load(f)

class Args:
    pass
a = Args()
a.video = m["video"]
a.title = m["title"]
a.description = m["description"]
a.tags = m["tags"]
a.thumbnail = m["thumbnail"]
a.category = m["category"]
a.privacy = m["privacy"]
a.schedule = None
a.playlist = None

vid = upload(a)
print("FINAL_VIDEO_ID=" + vid)

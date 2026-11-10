import json, sys, time
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, r"D:\AI-Cartoons\youtube")
from upload import upload

class Args:
    pass

def do_upload(meta_file):
    with open(meta_file, encoding="utf-8") as f:
        m = json.load(f)
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
    print(f"\n==========================================")
    print(f"UPLOADING: {a.title}")
    print(f"File: {a.video}")
    print(f"Thumbnail: {a.thumbnail}")
    vid = upload(a)
    print(f"SUCCESS: Video ID = {vid}")
    print(f"Watch URL: https://youtu.be/{vid}")
    return vid

print("Starting Upload Pipeline for No-Gravity Videos...")
id_long = do_upload(r"D:\AI-Cartoons\youtube\meta_gravity_6m.json")
id_short = do_upload(r"D:\AI-Cartoons\youtube\meta_gravity_short.json")

print("\n==========================================")
print("BOTH VIDEOS UPLOADING/UPLOADED SUCCESSFULLY!")
print(f"Full 6-Min Video: https://youtu.be/{id_long}")
print(f"Mobile Short:     https://youtube.com/shorts/{id_short}")
print("==========================================")

import json, sys
sys.stdout.reconfigure(encoding='utf-8')
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

target_id = sys.argv[1] if len(sys.argv) > 1 else "JjkD5aBAtmU"
creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

vid = youtube.videos().list(part="snippet,status,statistics", id=target_id).execute()
if not vid.get("items"):
    print("Video not found:", target_id)
    sys.exit(1)
v = vid["items"][0]
print("VIDEO ID:", v["id"])
print("TITLE:", v["snippet"]["title"])
print("DESC LEN:", len(v["snippet"].get("description", "")))
print("TAG COUNT:", len(v["snippet"].get("tags", [])))
print("TAGS:", ", ".join(v["snippet"].get("tags", [])))
print("CATEGORY:", v["snippet"].get("categoryId"))
print("PRIVACY:", v["status"].get("privacyStatus"))
print("UPLOAD STATUS:", v["status"].get("uploadStatus"))
print("WATCH URL: https://youtu.be/" + v["id"])

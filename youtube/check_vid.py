import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

vid = youtube.videos().list(part="snippet,status,statistics", id="sXBCKgzT9iI").execute()
v = vid["items"][0]
print("VIDEO ID:", v["id"])
print("TITLE:", v["snippet"]["title"].encode("utf-8").decode("utf-8"))
print("DESC LEN:", len(v["snippet"].get("description", "")))
print("TAGS:", v["snippet"].get("tags", []))
print("CATEGORY:", v["snippet"].get("categoryId"))
print("PRIVACY:", v["status"].get("privacyStatus"))
print("VIEWS:", v["statistics"].get("viewCount"))
print("THUMBNAIL:", v["snippet"].get("thumbnails", {}).get("default", {}).get("url"))

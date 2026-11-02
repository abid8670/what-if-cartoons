"""Check channel + video metadata."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

# Channel
ch = youtube.channels().list(part="snippet,brandingSettings,statistics", id="UCwxP0M79OzHSxa0jcVD3z2Q").execute()
c = ch["items"][0]
print("=== CHANNEL ===")
print("ID:", c["id"])
print("Title:", c["snippet"]["title"])
print("Description:", c["snippet"].get("description", "")[:100])
bs = c.get("brandingSettings", {}).get("channel", {})
print("Branding desc len:", len(bs.get("description", "")))
print("Keywords:", bs.get("keywords"))
print("Country:", bs.get("country"))
print("Subs:", c["statistics"].get("subscriberCount"))
print("Videos:", c["statistics"].get("videoCount"))
print()

# Video
vid = youtube.videos().list(part="snippet,status,statistics", id="sXBCKgzT9iI").execute()
v = vid["items"][0]
print("=== VIDEO ===")
print("ID:", v["id"])
print("Title:", v["snippet"]["title"])
print("Description len:", len(v["snippet"].get("description", "")))
print("Tags:", v["snippet"].get("tags", []))
print("Category:", v["snippet"].get("categoryId"))
print("Privacy:", v["status"].get("privacyStatus"))
print("Views:", v["statistics"].get("viewCount"))
print("Likes:", v["statistics"].get("likeCount"))
print("Thumbnail:", v["snippet"].get("thumbnails", {}).get("default", {}).get("url"))

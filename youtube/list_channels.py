"""List channels for the authenticated account."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)
resp = youtube.channels().list(part="snippet,statistics", mine=True).execute()
for ch in resp.get("items", []):
    print("CHANNEL_ID:", ch["id"])
    print("TITLE:", ch["snippet"]["title"])
    print("DESCRIPTION:", ch["snippet"]["description"][:200])
    print("SUBS:", ch["statistics"].get("subscriberCount"))
    print("VIDEOS:", ch["statistics"].get("videoCount"))
    print("---")

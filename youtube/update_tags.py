"""Update video tags (remove tool mentions)."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

VIDEO_ID = "sXBCKgzT9iI"

new_tags = ["what if", "sci-fi", "theory", "what if theory", "alternate reality", "science fiction",
            "impossible scenarios", "stick figure", "ai cartoon", "what if daily", "see the future",
            "60 seconds ahead", "what if cartoon", "mind bending"]

v = youtube.videos().list(part="snippet", id=VIDEO_ID).execute()["items"][0]
body = {
    "id": VIDEO_ID,
    "snippet": {
        "title": v["snippet"]["title"],
        "description": v["snippet"]["description"],
        "tags": new_tags,
        "categoryId": v["snippet"].get("categoryId", "24"),
        "defaultLanguage": "en",
    }
}
try:
    resp = youtube.videos().update(part="snippet", body=body).execute()
    print("SUCCESS: Tags updated!")
    print("New tags:", resp["snippet"].get("tags", []))
except Exception as e:
    print("ERROR:", e)

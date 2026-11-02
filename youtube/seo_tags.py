"""Update video tags with SEO-optimized keywords."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

VIDEO_ID = "sXBCKgzT9iI"

# SEO-optimized tags (mix of broad + long-tail + trending)
seo_tags = [
    "what if",
    "what if theory",
    "sci-fi",
    "science fiction",
    "what if you could",
    "impossible scenarios",
    "alternate reality",
    "mind bending",
    "what if daily",
    "stick figure cartoon",
    "ai cartoon",
    "what if cartoon",
    "see the future",
    "60 seconds ahead",
    "what if time",
    "thought experiment",
    "hypothetical",
    "what if scenario",
    "short video",
    "youtube shorts",
]

v = youtube.videos().list(part="snippet", id=VIDEO_ID).execute()["items"][0]
body = {
    "id": VIDEO_ID,
    "snippet": {
        "title": v["snippet"]["title"],
        "description": v["snippet"]["description"],
        "tags": seo_tags,
        "categoryId": v["snippet"].get("categoryId", "24"),
        "defaultLanguage": "en",
    }
}
try:
    resp = youtube.videos().update(part="snippet", body=body).execute()
    print("SUCCESS: SEO tags updated!")
    print("Tags count:", len(resp["snippet"].get("tags", [])))
    print("Tags:", resp["snippet"].get("tags", []))
except Exception as e:
    print("ERROR:", e)

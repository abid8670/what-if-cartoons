"""Update video description (remove tool mentions)."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

VIDEO_ID = "sXBCKgzT9iI"

new_description = """What if you could see exactly 60 seconds into the future?

In this episode, Pip discovers he can see one minute ahead - and quickly learns that knowing the future isn't as fun as it sounds. From dodging a falling ball to "predicting" a coin flip, things spiral until a real physics fact flips the whole premise on its head.

Would you want this power? Let me know in the comments.

New episode every week. One real fact. One impossible question.

Subscribe for weekly What If theories!
Turn on notifications so you don't miss new drops.

#WhatIf #SciFi #Theory #WhatIfTheory #AlternateReality #ScienceFiction #WhatIfDaily
"""

# Get current video to preserve snippet fields
v = youtube.videos().list(part="snippet", id=VIDEO_ID).execute()["items"][0]
body = {
    "id": VIDEO_ID,
    "snippet": {
        "title": v["snippet"]["title"],
        "description": new_description,
        "tags": v["snippet"].get("tags", []),
        "categoryId": v["snippet"].get("categoryId", "24"),
        "defaultLanguage": "en",
    }
}
try:
    resp = youtube.videos().update(part="snippet", body=body).execute()
    print("SUCCESS: Video description updated!")
    print("New desc length:", len(resp["snippet"].get("description", "")))
except Exception as e:
    print("ERROR:", e)

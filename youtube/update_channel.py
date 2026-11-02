"""Update channel branding (sci-fi theory description)."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

CHANNEL_ID = "UCwxP0M79OzHSxa0jcVD3z2Q"

description = """What If Theory - exploring impossible scenarios, alternate realities, and what if questions that bend the laws of physics, space, and time.

Every episode asks one question: What if the rules were different? From seeing the future to pausing time, from doubled gravity to hearing every sound on Earth - each video takes one real, verified fact and spins it into a mind-bending scenario.

New episode every week. 15-25 seconds. One real fact. One impossible question.

Subscribe for weekly What If theories!
Turn on notifications so you don't miss new drops.

#WhatIf #SciFi #Theory #WhatIfTheory #AlternateReality #ScienceFiction"""

body = {
    "id": CHANNEL_ID,
    "brandingSettings": {
        "channel": {
            "title": "What If Theory",
            "description": description,
            "keywords": "what if,sci-fi,theory,alternate reality,science fiction,what if theory,impossible scenarios,physics,time travel,space",
            "defaultLanguage": "en",
            "country": "PK",
        }
    }
}
try:
    resp = youtube.channels().update(part="brandingSettings", body=body).execute()
    print("SUCCESS: Channel branding updated!")
    bs = resp.get("brandingSettings", {}).get("channel", {})
    print("Title:", bs.get("title"))
    print("Description length:", len(bs.get("description", "")))
    print("Keywords:", bs.get("keywords"))
except Exception as e:
    print("ERROR:", e)

"""Update channel branding (description) via brandingSettings."""
import json, sys
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

CHANNEL_ID = "UCwxP0M79OzHSxa0jcVD3z2Q"

description = """What If Daily - AI-animated What If cartoons. New episode every week. 15-25 seconds. Stick-figure style. One real fact per episode.

Made 100% with free AI tools: OpenCode + GLM-5.3-Flash Free, Remotion, ElevenLabs, Python + FFmpeg.

Subscribe for weekly What If episodes! Turn on notifications.

Links:
- How it's made: https://freshstack.ai/resources/free-ai-animation
- Skill (free, MIT): https://github.com/kelano86/what-if-animation
- GitHub: https://github.com/abid8670/what-if-cartoons

#WhatIf #AIAnimation #FreeAI #Cartoon #WhatIfDaily"""

body = {
    "id": CHANNEL_ID,
    "brandingSettings": {
        "channel": {
            "title": "What If Daily",
            "description": description,
            "keywords": "what if,ai animation,free ai,opencode,remotion,elevenlabs,ai cartoon,stick figure,what if cartoon",
            "defaultLanguage": "en",
            "country": "PK",
        }
    }
}
try:
    resp = youtube.channels().update(part="brandingSettings", body=body).execute()
    print("SUCCESS: Channel branding updated!")
    print("Description length:", len(resp.get("brandingSettings", {}).get("channel", {}).get("description", "")))
except Exception as e:
    print("ERROR:", e)

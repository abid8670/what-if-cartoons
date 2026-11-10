import json, sys
sys.stdout.reconfigure(encoding='utf-8')

sys.path.insert(0, r"D:\AI-Cartoons\youtube")
src = open(r"D:\AI-Cartoons\youtube\upload.py", encoding="utf-8-sig").read().split("def upload")[0]
exec(src)

creds = get_creds()
youtube = build("youtube", "v3", credentials=creds)

VIDEO_ID = "-VTonzzFAYI"

new_title = "What If You Could Copy and Paste Anything? 🍪 #Shorts"

new_description = """What if you could copy and paste anything in real life? 📋

Free cookies forever. Infinite money. Finished homework in one second. Sounds like a dream, right? 

Until the terrifying laws of physics kick in...
According to Einstein's E = mc², creating just ONE 30-gram chocolate chip cookie from pure energy requires 2.7 TRILLION kilojoules (2,700,000,000,000,000 Joules). That's every power plant on planet Earth running at maximum capacity for over 10 minutes straight.

So if energy isn't powering your copies... WHERE are they coming from? 👁️

Drop what you would copy in the comments! 👇

🔔 Subscribe to @WhatIfDaily for weekly mind-bending animated thought experiments!
Turn on notifications so you never miss an episode.

#Shorts #WhatIf #WhatIfTheory #SciFi #Animation #Physics #Emc2 #ThoughtExperiment #MindBending #Cartoon #SciFiStory
"""

new_tags = [
    "copy and paste in real life",
    "what if you could copy and paste anything",
    "what if",
    "what if theory",
    "what if daily",
    "e equals mc squared",
    "e=mc2",
    "duplicating objects",
    "sci fi animation",
    "stick figure animation",
    "youtube shorts",
    "shorts",
    "viral shorts",
    "what if shorts",
    "science fiction",
    "mind bending",
    "impossible scenarios",
    "physics thought experiment",
    "alternate reality",
    "cartoon explainer",
    "thought experiment",
    "sci fi story",
    "science fact"
]

# Fetch current snippet to keep categoryId and other required properties intact
v = youtube.videos().list(part="snippet,status", id=VIDEO_ID).execute()["items"][0]
current_snippet = v["snippet"]

body = {
    "id": VIDEO_ID,
    "snippet": {
        "title": new_title,
        "description": new_description,
        "tags": new_tags,
        "categoryId": current_snippet.get("categoryId", "27"),
        "defaultLanguage": "en"
    }
}

print(f"Updating video {VIDEO_ID} on YouTube...")
resp = youtube.videos().update(part="snippet", body=body).execute()
print("SUCCESS: Video updated!")
print("NEW TITLE:", resp["snippet"]["title"])
print("NEW DESC LENGTH:", len(resp["snippet"]["description"]))
print("TAG COUNT:", len(resp["snippet"].get("tags", [])))
print("WATCH URL: https://youtu.be/" + VIDEO_ID)


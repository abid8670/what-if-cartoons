"""Prepare metadata for copy-paste episode."""
import json

META = {
  "video": r"D:\AI-Cartoons\what-if-studio\out\copy-paste\copy-paste-final.mp4",
  "thumbnail": r"D:\AI-Cartoons\what-if-studio\out\copy-paste\thumbnail.jpg",
  "title": "What If You Could Copy and Paste Anything? 📋",
  "description": """What if you could copy and paste anything in real life?

In this episode, Pip discovers he can copy and paste anything - cookies, homework, even his best friend. Free cookies forever. Done homework in seconds. But then comes the catch: a copy can't come from nothing. One 30g cookie from pure energy needs every power plant on Earth running for over 10 minutes. So where are all those copies coming from?

Would you want this power? Let me know in the comments.

New episode every week. One real fact. One impossible question.

Subscribe for weekly What If theories!
Turn on notifications so you don't miss new drops.

#WhatIf #SciFi #Theory #WhatIfTheory #AlternateReality #ScienceFiction #WhatIfDaily
""",
  "tags": "what if,what if theory,sci-fi,science fiction,what if you could,impossible scenarios,alternate reality,mind bending,what if daily,stick figure cartoon,ai cartoon,what if cartoon,thought experiment,hypothetical,what if scenario,short video,youtube shorts,copy and paste,physics,e equals mc squared",
  "category": "24",
  "privacy": "public",
}

with open(r"D:\AI-Cartoons\youtube\meta_copy_paste.json", "w", encoding="utf-8") as f:
    json.dump(META, f, indent=2, ensure_ascii=False)
print("Metadata saved.")

"""Update meta JSON with new description (no tool mentions)."""
import json
path = r"D:\AI-Cartoons\youtube\meta_one_minute_ahead.json"
with open(path, encoding="utf-8") as f:
    m = json.load(f)

m["description"] = """What if you could see exactly 60 seconds into the future?

In this episode, Pip discovers he can see one minute ahead - and quickly learns that knowing the future isn't as fun as it sounds. From dodging a falling ball to "predicting" a coin flip, things spiral until a real physics fact flips the whole premise on its head.

Would you want this power? Let me know in the comments.

New episode every week. One real fact. One impossible question.

Subscribe for weekly What If theories!
Turn on notifications so you don't miss new drops.

#WhatIf #SciFi #Theory #WhatIfTheory #AlternateReality #ScienceFiction #WhatIfDaily
"""

with open(path, "w", encoding="utf-8") as f:
    json.dump(m, f, indent=2, ensure_ascii=False)
print("meta updated")

import json
path = r"D:\AI-Cartoons\youtube\meta_one_minute_ahead.json"
with open(path, encoding="utf-8") as f:
    m = json.load(f)
m["tags"] = "what if,sci-fi,theory,what if theory,alternate reality,science fiction,impossible scenarios,stick figure,ai cartoon,what if daily,see the future,60 seconds ahead,what if cartoon,mind bending"
with open(path, "w", encoding="utf-8") as f:
    json.dump(m, f, indent=2, ensure_ascii=False)
print("meta tags updated")

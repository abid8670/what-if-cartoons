import json
path = r"D:\AI-Cartoons\youtube\meta_one_minute_ahead.json"
with open(path, encoding="utf-8") as f:
    m = json.load(f)
m["tags"] = "what if,what if theory,sci-fi,science fiction,what if you could,impossible scenarios,alternate reality,mind bending,what if daily,stick figure cartoon,ai cartoon,what if cartoon,see the future,60 seconds ahead,what if time,thought experiment,hypothetical,what if scenario,short video,youtube shorts"
with open(path, "w", encoding="utf-8") as f:
    json.dump(m, f, indent=2, ensure_ascii=False)
print("meta tags updated")

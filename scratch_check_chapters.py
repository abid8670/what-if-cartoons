import json

data = json.load(open(r"D:\AI-Cartoons\what-if-studio\public\no-water\timestamps.json"))
for ch, words in data.items():
    text = " ".join(w["word"] for w in words[:15])
    full_text = " ".join(w["word"] for w in words)
    print(f"\n=== {ch.upper()} ({len(words)} words) ===")
    print(full_text)


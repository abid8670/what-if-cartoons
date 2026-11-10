import sys
sys.stdout.reconfigure(encoding='utf-8')
import edge_tts
import asyncio
import json

async def main():
    text = open(r'D:\AI-Cartoons\scripts\no-water-script.txt', encoding='utf-8').read()
    communicate = edge_tts.Communicate(text, "en-US-ChristopherNeural", rate="+3%", boundary="WordBoundary")
    words = []
    with open(r'D:\AI-Cartoons\what-if-studio\public\no-water\voice_3m.mp3', "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "word": chunk["text"],
                    "offset": chunk["offset"] / 10000000.0,
                    "duration": chunk["duration"] / 10000000.0
                })
    with open(r'D:\AI-Cartoons\what-if-studio\public\no-water\word_timestamps.json', "w", encoding='utf-8') as f:
        json.dump(words, f, indent=2, ensure_ascii=False)
    print(f"Generated audio with {len(words)} word boundaries")
    if words:
        total = words[-1]["offset"] + words[-1]["duration"]
        print(f"Total duration: {total:.2f}s")

asyncio.run(main())

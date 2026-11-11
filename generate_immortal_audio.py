import asyncio
import edge_tts
import json
import os
import pathlib
import sys
import subprocess

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-GuyNeural"
RATE = "+6%"
PITCH = "+0Hz"

PUBLIC_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\immortal")
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "Chapter 1: The Curse of Forever",
        "text": "At twenty-five years old, an anomalous cellular mutation froze Pip's biological clock forever. Zero sickness. Zero aging. Zero pain. When a stray bullet struck his forehead in a robbery, the lead flattened against his skin and dropped like a coin. Pip smiled. He was a god. But immortality does not mean invincibility from time."
    },
    {
        "id": "ch_2",
        "title": "Chapter 2: The Golden Centuries",
        "text": "For three hundred years, life was an endless triumph. Pip mastered sixteen languages, accumulated thirty billion dollars in compound interest, and lived through the rise and fall of empires. He became an astronaut, an architect, and a legendary phantom in history books. But slowly... the world began to change."
    },
    {
        "id": "ch_3",
        "title": "Chapter 3: The Graveyard of Memory",
        "text": "The curse struck in century five. Every woman he loved grew wrinkled and died in his arms. His children, his grandchildren, his closest friends—all turned to dust while his face remained twenty-five. By the year three thousand, nuclear wars and climate collapse stripped Earth of its atmosphere. Pip was left walking through an eighty-billion-ton graveyard of concrete and ash."
    },
    {
        "id": "ch_4",
        "title": "Chapter 4: The Trillion-Year Void",
        "text": "Five billion years later, the Sun swelled into a red giant and incinerated Earth into slag. But Pip did not die. Thrown into the vacuum of space, his lungs starved for air that never came. For three trillion years, Pip drifted in the pitch-black freezing void of deep space. No light. No sound. No warmth. Just absolute, suffocating, eternal isolation."
    },
    {
        "id": "ch_5",
        "title": "Chapter 5: The Monolith & The Final Choice",
        "text": "Trillions of years later, Pip's frozen body collides with an ancient cosmic artifact floating in the void. A glowing ethereal voice echoes directly inside his mind, offering one final escape before the universe goes completely dark."
    },
    {
        "id": "short",
        "title": "Short Narration",
        "text": "What if you were completely immortal? At age twenty-five, Pip's cells stopped aging. Bullets bounce off his skin. For three hundred years, he lived like a god—mastering sciences, earning billions, and outliving entire nations. But by century five, every friend, wife, and child he ever loved died in his arms. Five billion years later, the Sun exploded, and Pip was left floating in the freezing void of deep space for trillions of years completely alone. Until an ancient cosmic artifact offers one final choice. Do you choose Option A: Live eighty normal years and die peacefully? Or Option B: Drift in space until the next universe is born? Comment your choice below!"
    }
]

async def generate_chapter(ch):
    ch_id = ch["id"]
    text = ch["text"]
    out_mp3 = PUBLIC_DIR / f"{ch_id}_raw.mp3"
    words_json = PUBLIC_DIR / f"{ch_id}_words.json"

    print(f"Generating voice for {ch['title']}...")
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)

    words = []
    with open(out_mp3, "wb") as f:
        async for chunk in communicate.stream():
            if chunk["type"] == "audio":
                f.write(chunk["data"])
            elif chunk["type"] == "WordBoundary":
                words.append({
                    "word": chunk["text"],
                    "offset": chunk["offset"] / 10_000_000,
                    "duration": chunk["duration"] / 10_000_000
                })

    with open(words_json, "w", encoding="utf-8") as f:
        json.dump(words, f, indent=2)

    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(out_mp3)]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    duration = float(res.stdout.strip())
    print(f"   Done {ch_id}: {duration:.2f}s ({len(words)} words)")
    return ch_id, duration

async def main():
    durations = {}
    for ch in CHAPTERS:
        cid, dur = await generate_chapter(ch)
        durations[cid] = dur

    durations_path = PUBLIC_DIR / "durations.json"
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2)
    print("\nAll Voiceovers Generated Successfully!")
    print(json.dumps(durations, indent=2))

if __name__ == "__main__":
    asyncio.run(main())


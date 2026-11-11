import asyncio
import edge_tts
import json
import os
import pathlib
import sys
import subprocess
import time

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-GuyNeural"
RATE = "+6%"
PITCH = "+0Hz"

PUBLIC_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\memories")
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "Chapter 1: The Memory Broker",
        "text": "Deep beneath the financial district, an unmarked glass skyscraper houses Mnemosyne Biometrics. Their proposition is simple: memories are neural electrical patterns, and they will pay in cold cash. For his awkward high school graduation, Pip receives two hundred thousand dollars wired directly to his phone. He walked out laughing. He couldn't remember his graduation speech, but his bank account was glowing."
    },
    {
        "id": "ch_2",
        "title": "Chapter 2: The Golden Amnesia",
        "text": "Within six months, selling memories became an obsession. He sold his painful first heartbreak for one million dollars. He sold a childhood broken bone for five hundred thousand. Pip bought a three-story glass penthouse, six luxury supercars, and a diamond watch. He threw rooftop parties every night with celebrities who admired his effortless confidence. Pip felt completely weightless. No regrets. No nostalgia. Just pure wealth."
    },
    {
        "id": "ch_3",
        "title": "Chapter 3: The Empty Mirror",
        "text": "Then came Year Two. One morning, Pip found a framed photograph on his bedside table of an elderly woman holding a baby with Pip's eyes. Warm tears streamed down Pip's cheeks, but when he searched his mind, there was only static. He had sold the memory of his own mother to buy a yacht in Monaco. He stared into the bathroom mirror at a wealthy stranger. He owned thirty million dollars, but he had no idea what his mother's voice sounded like, or why he was crying."
    },
    {
        "id": "ch_4",
        "title": "Chapter 4: The Final Extraction",
        "text": "Desperate to escape the creeping hollow inside his chest, Pip returned to the memory clinic. In the sterile white vault, the chief neurosurgeon slid a black titanium contract across the table: Fifty million dollars in gold bearer bonds for his core identity. Pip's name, his values, his morals, his sense of humor, and his soul. Sell it, and he will walk out as the richest blank slate in human history."
    },
    {
        "id": "ch_5",
        "title": "Chapter 5: The Glass Jar & The Final Choice",
        "text": "Pip stands in the extraction chamber holding the glowing glass canister containing the last remaining fragments of his true self. The neurosurgeon's finger hovers over the transfer switch. Pip must decide his destiny."
    },
    {
        "id": "short",
        "title": "Short Narration",
        "text": "What if you could sell your memories for millions of dollars? Pip found a secret lab that pays cash for your past: $200,000 for high school, $1,000,000 for his first heartbreak. Soon, Pip was living in a luxury penthouse with supercars and $30 million. But one morning, he found a picture of his mother and realized he had sold her memory for a yacht! He had all the money in the world, but couldn't remember who he was. Now the lab offers $50,000,000 for his core soul and identity. Do you choose Option A: Buy back all your memories and live broke but with your soul? Or Option B: Take the $50 Million and live as a blank billionaire? Comment your choice below!"
    }
]

async def generate_chapter_with_retry(ch, max_attempts=5):
    ch_id = ch["id"]
    text = ch["text"]
    out_mp3 = PUBLIC_DIR / f"{ch_id}_raw.mp3"
    words_json = PUBLIC_DIR / f"{ch_id}_words.json"

    if out_mp3.exists() and out_mp3.stat().st_size > 20000:
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(out_mp3)]
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        duration = float(res.stdout.strip())
        print(f"   Cached {ch_id}: {duration:.2f}s")
        return ch_id, duration

    print(f"Generating voice for {ch['title']}...")
    for attempt in range(1, max_attempts + 1):
        try:
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
            print(f"   Done {ch_id}: {duration:.2f}s")
            return ch_id, duration
        except Exception as e:
            print(f"   Attempt {attempt} failed: {e}. Retrying in 2s...")
            await asyncio.sleep(2)

    raise RuntimeError(f"Failed to generate {ch_id} after {max_attempts} attempts.")

async def main():
    durations = {}
    for ch in CHAPTERS:
        cid, dur = await generate_chapter_with_retry(ch)
        durations[cid] = dur

    durations_path = PUBLIC_DIR / "durations.json"
    with open(durations_path, "w", encoding="utf-8") as f:
        json.dump(durations, f, indent=2)
    print("\nAll Voiceovers Generated Successfully!")
    print(json.dumps(durations, indent=2))

if __name__ == "__main__":
    asyncio.run(main())

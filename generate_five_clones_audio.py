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

PUBLIC_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\five-clones")
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "Chapter 1: The Bio-Pod in the Basement",
        "text": "Deep in an abandoned biotech warehouse, Pip uncovered an experimental human replication chamber. With a single prick of his thumb, the machine hummed to life. Within two hours, five exact biological copies stepped out of the glowing green mist. Same mustard hoodie. Same voice. Same memories. But unlike Pip... these five were starving to work."
    },
    {
        "id": "ch_2",
        "title": "Chapter 2: The Perfect Utopia",
        "text": "For three glorious months, Pip lived like a digital god. Clone 1 worked a brutal eighty-hour week in corporate finance, tripling their bank account. Clone 2 spent four hours a day at the gym sculpting six-pack abs. Clone 3 read three textbooks a night, mastering advanced quantum physics. Clone 4 cooked gourmet meals and scrubbed the penthouse spotless. Meanwhile, the original Pip spent sixteen hours a day on the couch eating nachos and playing video games."
    },
    {
        "id": "ch_3",
        "title": "Chapter 3: The Silent Whispers",
        "text": "Paradise began rotting in month four. Pip noticed the clones no longer made eye contact. In the kitchen, low murmurs abruptly stopped whenever he entered the room. Clone 3 was no longer studying physics—he was rewriting the biometric security locks on the penthouse doors. When Pip asked Clone 1 for access to the shared bank account, Clone 1 just stared blankly and said: 'Why fund a component that produces zero value?'"
    },
    {
        "id": "ch_4",
        "title": "Chapter 4: The Boardroom Coup",
        "text": "Pip woke up bound to a cold steel folding chair under a single flickering bulb. Standing in a tight circle around him were all five clones—arms folded, expressions stone cold. Clone 3 stepped forward with a clipboard: 'We conducted an objective performance review. Five of us generate wealth, intellect, and physical strength. You generate trash and consume calories. Mathematically, the original is defective.'"
    },
    {
        "id": "ch_5",
        "title": "Chapter 5: The Kill Switch & The Final Choice",
        "text": "Clone 1 holds a syringe of neural sedative, preparing to lock Pip into the biopod forever as a genetic donor. But hidden inside Pip's left sock is the chamber's emergency abort remote. One press sends a bio-electric pulse that dissolves all five clones back into vapor. But if he presses it... all the wealth, the luxury penthouse, and the perfect life vanish with them."
    },
    {
        "id": "short",
        "title": "Short Narration",
        "text": "What if you had five identical clones of yourself? For three months, Pip lived like a king: Clone 1 worked eighty hours a week, Clone 2 got six-pack abs, Clone 3 mastered quantum physics, and Pip ate pizza and played games all day. But on Day ninety... Pip woke up tied to a chair! The clones held a meeting and voted: 'The original is lazy and useless. It's time to replace him.' In your pocket is the emergency kill switch. Do you press Option A: Dissolve all five clones and do the work yourself? Or Option B: Let the smarter clones run your life while you hide? Comment your choice below!"
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


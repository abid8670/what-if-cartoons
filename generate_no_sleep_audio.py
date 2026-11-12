import asyncio
import json
import os
import pathlib
import sys
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\no-sleep")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "It was marketed as the greatest medical breakthrough in human history: a tiny, bioluminescent blue capsule called Somnex-Nine. One pill permanently rewired the human brain's adenosine receptors, completely eliminating the physiological need for sleep with zero physical exhaustion. When Pip swallowed his first capsule, his fatigue vanished instantly. He worked all day, coded all night, read thirty books in a single week, and felt like a living god. Twenty-four hours of pure, uninterrupted consciousness.",
    "ch_2": "Within three months, taking the pill was no longer optional. Corporations realized that if human beings didn't need to sleep, beds were obsolete. Standard eight-hour jobs expanded into twenty-hour shifts. Schools began holding sixteen-hour classes. Apartments were built without bedrooms, replacing mattresses with upright standing pods. Anyone caught trying to rest was labeled a lazy criminal, and sleeping in public was officially outlawed.",
    "ch_3": "By day one hundred and eighty, scientists realized they had made a catastrophic oversight. The human body might survive without physical rest, but the subconscious mind cannot live without dreams. With no sleep to process raw emotional data, Pip's un-dreamt nightmares began bleeding directly into waking reality. Translucent shadow creatures crept along the edges of his vision, hallway walls warped like breathing lungs, and his own stickman reflection in mirrors started moving independently.",
    "ch_4": "Desperate to escape his waking madness, Pip sought out the shadowy underground economy of Sleep Speakeasies. Hidden beneath the industrial sector, exhausted stickmen paid thousands of dollars in cash to strap themselves into secret padded booths and inhale medical anesthesia for just two hours of sweet, forbidden darkness. But as police sirens echoed above, Pip realized the brutal truth: society had engineered a prison where freedom only existed in a coma.",
    "ch_5": "Pip stood in the rain outside the raid, holding the last dose of the antidote. Now, the choice belongs to you. Option A: Take the pill and join the hyper-speed world, gaining eight extra hours every day, but never sleeping, resting, or dreaming ever again. Or Option B: Reject the pill, sleeping eight hours every night, while society races two times faster and you are left behind in poverty. Tell us your choice in the comments below, and subscribe to What-eif for more impossible stories.",
    "short": "I haven't slept in three hundred and sixty-five days. A medical lab invented a blue pill called Somnex that completely eliminated sleep. At first, it felt like a superpower. I had twenty-four hours of awake energy! But then, corporations made twenty-hour workdays mandatory, and bedrooms were abolished. Worse, because our brains couldn't dream, our worst nightmares started bleeding directly into broad daylight! Shadow monsters began stalking me on the subway... and that's the terrifying reason why..."
}

async def generate_track(key, text):
    audio_path = OUT_DIR / f"{key}_raw.mp3"
    words_path = OUT_DIR / f"{key}_words.json"
    
    if audio_path.exists() and words_path.exists():
        print(f"[{key}] Already generated, skipping.")
        return

    print(f"Generating TTS for [{key}]...")
    for attempt in range(5):
        try:
            communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
            words = []
            with open(audio_path, "wb") as f_audio:
                async for chunk in communicate.stream():
                    if chunk["type"] == "audio":
                        f_audio.write(chunk["data"])
                    elif chunk["type"] == "WordBoundary":
                        words.append({
                            "word": chunk["text"],
                            "offset": chunk["offset"] / 10_000_000,
                            "duration": chunk["duration"] / 10_000_000
                        })
            with open(words_path, "w", encoding="utf-8") as f_words:
                json.dump(words, f_words, indent=2)
            print(f"[{key}] Finished successfully.")
            return
        except Exception as e:
            print(f"[{key}] Error on attempt {attempt+1}: {e}")
            await asyncio.sleep(2 * (attempt + 1))
    raise RuntimeError(f"Failed to generate {key} after 5 attempts.")

async def main():
    for key, text in SCRIPTS.items():
        await generate_track(key, text)
    print("ALL TTS GENERATION COMPLETE!")

if __name__ == "__main__":
    asyncio.run(main())


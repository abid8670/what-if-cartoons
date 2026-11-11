import asyncio
import json
import os
import pathlib
import sys
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\lifespan")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "Pip woke up on a Tuesday morning expecting a normal day. But when he stepped onto the street, glowing neon numbers were floating above everyone's head. His barista had forty-eight years. An old man had three months. Then, Pip looked at a stranger crossing the street. The red timer above him read: twelve seconds. Before Pip could speak, a delivery truck ran the red light.",
    "ch_2": "The numbers were exact, unchangeable lifespans. Pip realized he was the only person alive who could see the cosmic countdown. Driven by conscience, he became an anonymous guardian angel. He yanked pedestrians out of traffic, called ambulances before heart attacks occurred, and saved dozens from freak accidents. But meddling with fate came with an invisible consequence.",
    "ch_3": "Every time Pip cheated death for someone else, the universal ledger had to balance. When he looked in the bathroom mirror that night, his breath stopped. Floating above his own head was a flickering crimson timer. It read: seventy-two hours. Three days left. Saving strangers hadn't destroyed their deaths... it had subtracted their borrowed time directly from his own lifespan.",
    "ch_4": "Desperate to survive, Pip uncovered a shadowy black market of secret lifespan trading. Ultra-wealthy elites with six hours left were offering billions to siphon decades from young, desperate volunteers. Pip faced a horrifying reality: to extend his own life, he would have to steal time from someone else, becoming the very predator he had fought against.",
    "ch_5": "Pip stood at the ultimate crossroads of human existence. Is life precious because it never ends, or because every single second is running out? Now, the choice belongs to you. Option A: Know the exact day and second you die, so you never waste another moment. Or Option B: Remain completely blind to your fate, living with the thrill of uncertainty. Tell us your choice in the comments below, and subscribe to What-eif for more impossible dilemmas.",
    "short": "Pip woke up and saw glowing timers floating above everyone's head. His friend had fifty years. But a stranger crossing the street had six seconds left. Pip yanked him back just as a speeding truck flew past, saving his life! But when Pip looked into the mirror that night, his own clock appeared. It read: two days left. Saving others was stealing his own lifespan. Would you rather know your exact death date, or live completely blind? Drop Option A or B below!"
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


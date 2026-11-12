import asyncio
import json
import os
import pathlib
import sys
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\time-remote")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "It looked like a broken pocket radio from the nineteen-eighties, sitting abandoned on an empty subway bench. It had a single brass toggle switch and a glowing red button labeled: REWIND. When Pip accidentally knocked his scalding hot coffee off the bench, he slammed the red button in pure panic. A high-pitched metallic click rang out. Reality shivered. The coffee cup flew straight upward off the concrete, the spilling liquid sucked itself back into the mug, and the clock on the subway wall spun backward by exactly ten seconds.",
    "ch_2": "With unlimited ten-second undos, Pip became completely invincible. In job interviews, if he said something awkward, click—he rephrased it with genius wit. At roulette tables, if the ball landed on black, click—he switched all his chips to red. He dodged speeding taxis, caught falling flower pots before they hit pedestrians, and never made another mistake. Pip was living life in god mode.",
    "ch_3": "By day fourteen, Pip had clicked the rewind button over eight hundred times. But physics does not tolerate an eraser. Pip began noticing temporal ghosting—faint, translucent double-images of himself lagging two steps behind his body. Worse, every time he rewound reality, the rest of the world felt ten seconds colder, and people's conversations started skipping like scratched vinyl records.",
    "ch_4": "Then came the incident at the downtown crosswalk. A runaway truck blew through a red light. Pip reached into his hoodie pocket and smashed the rewind button. The world shuddered backward—tires screeched in reverse, pedestrians drifted backward step-by-step. But as Pip turned around, his blood froze. Standing right in the center of the road was another stickman in a charcoal overcoat... looking directly into Pip's eyes, completely unaffected by the rewind.",
    "ch_5": "The mysterious collector stepped forward and held out his hand. Every rewind had been fracturing the local timeline, and now, the universe demands a trade. Option A: Keep the Ten-Second Rewind remote, but pay with one month of your future lifespan every time you use it. Or Option B: Destroy the remote forever, accepting every painful mistake and heartbreak as proof that you are truly alive. Tell us your choice in the comments below, and subscribe to What-eif for more impossible stories.",
    "short": "I found an old retro remote with a glowing red button labeled: REWIND. When I dropped my coffee, I hit the button in panic. Reality snapped, the coffee flew back into my hand, and the clock jumped ten seconds backward! I had an unlimited undo button. I dodged cars, won roulette bets, and fixed every mistake. But on my eight-hundredth rewind, I saw a stranger standing in the crowd... staring right at me, completely immune to the rewind! Would you keep the 10-second rewind remote if each click cost one month of your life (Option A), or destroy it forever (Option B)? Vote below!"
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


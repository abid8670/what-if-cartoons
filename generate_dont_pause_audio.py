import asyncio
import json
import os
import pathlib
import sys
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-pause")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "I am officially warning you: whatever you do, do not hit the pause button on this video. It is in the title. It is on the screen. Yet right now, your thumb is already itching to tap your display. This is known in cognitive psychology as the Streisand Effect. The exact millisecond your brain hears the command 'Do Not', your amygdala perceives it as a threat to your personal freedom. So you rebel. But I am giving you one chance: keep your hands off the screen, because what happens next will test your sanity.",
    "ch_2": "At exactly frame twenty-four of this chapter, there is a hidden red symbol flashing behind my head for one-thirtieth of a second. You saw it, didn't you? A tiny flicker of light. Every fiber of your muscle memory is screaming at you to drag the timeline scrubber and pause on that exact frame. But if you pause, you fail. Your brain hates incomplete information—it is called the Zeigarnik Effect, a psychological itch that makes human beings physically uncomfortable until a mystery is solved. But I promise you, what is hidden in that frame is better left unseen.",
    "ch_3": "Let us be honest. Over ninety-nine percent of the people watching this have already paused at least twice. Don't lie in the comments. Neuroscientists at Harvard discovered that when humans are told not to perform a simple motor action, neural activity in the prefrontal cortex spikes by four hundred percent. That is real science. You are not fighting me; you are fighting your own evolutionary biology. Right now, your breathing just switched to manual mode, and you are hyper-aware of how often you blink. The video is controlling your body.",
    "ch_4": "Look closely at the borders of your video player. Can you feel the tension? The screen is starting to warp. If you hit pause right now, my stickman will freeze, but your phone screen will lock into a digital glitch loop. The YouTube algorithm is tracking your exact watch time down to the microsecond. Every second you stay here without pausing, you break the platform's predictive model. You are proving that human willpower can overcome algorithmic manipulation. But the ultimate test is about to appear.",
    "ch_5": "The test has reached its final seconds. Two choices are flashing before you. Option A: Hit the pause button right now, admit defeat, and comment your exact phone battery percentage below to prove you are human. Or Option B: Do not touch a single button, let this video play to the very end, and comment the secret code word: 'I WON' to prove you have god-tier mental discipline. Which one are you? Comment Option A or Option B below, and whatever you do, do NOT subscribe to What-eif!",
    "short": "I am officially warning you: whatever you do, do not hit the pause button on this video. It was in the title. It is on your screen. Yet right now, your thumb is itching to tap! In neuroscience, this is the Streisand Effect—your brain rebelled the exact millisecond I said 'Do Not'. There is a secret code flashing on screen, and ninety-nine percent of people fail the test and smash pause, because..."
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


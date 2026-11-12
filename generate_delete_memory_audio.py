import asyncio
import json
import os
import pathlib
import sys
import edge_tts

VOICE = "en-US-GuyNeural"
RATE = "+6%"
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\delete-memory")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "It started with a cryptic notification on Pip's phone: MindPurge Beta. The terms were impossibly simple. Select any single memory from your brain, tap delete, and one hundred thousand dollars is instantly wired into your account. Skeptical, Pip chose his most embarrassing childhood memory—tripping on stage at his seventh-grade talent show. He pressed delete. A soft digital chime echoed in his skull, his bank account balance surged by one hundred grand, and the memory was completely wiped. He couldn't remember why he ever felt ashamed. Pip smiled in disbelief. Who needs bad memories anyway?",
    "ch_2": "Within thirty days, selling memories became an uncontrollable addiction. Day seven: Pip erased the boring summer he spent washing dishes for another hundred grand. Day fourteen: his high school graduation vanished for another hundred grand. By day thirty, Pip was sitting in a ten-million-dollar glass penthouse with three million dollars in cash and a brand new supercar. He felt like an untouchable king. But at a lavish rooftop party, an old childhood friend hugged him in tears, thanking him for saving his life years ago. Pip stared back with cold, blank eyes. He had no idea who this man was.",
    "ch_3": "By day sixty, the app transformed into a nightmare. MindPurge ran out of minor memories and started demanding Premium Core Memories for five hundred thousand dollars each: his mother's lullaby, the scent of his childhood home, the face of his first true love. When Pip refused, horrific digital static started invading his vision. Hallway walls pixelated into glitching voids. Whenever Pip looked into a bathroom mirror, his stickman face began dissolving into digital static dust. In a panic, Pip tried to delete the app, but a blood-red warning flashed across the screen: Deletion fee, Ten million dollars or One Hundred Core Memories.",
    "ch_4": "Realizing his soul was being stolen, Pip tracked the app's encrypted IP address deep beneath the industrial district. Sneaking past armed biometric sentries, he breached a colossal subterranean vault. What he saw froze his blood. Deleted memories weren't erased at all. Thousands of glowing cyan vials hung from ceiling racks, being auctioned off to ultra-rich elite stickmen who injected real human emotions just to feel alive. And there, in the central glass pedestal, was vial number zero-seven: the glowing memory of his mother's gentle smile.",
    "ch_5": "Suddenly, sirens shrieked and red lasers locked onto Pip's chest! The facility's self-destruct countdown began: ten seconds remaining. Pip slammed his hand against the central console. Two choices flashed on the screen. Option A: Smash the emergency recall valve, restoring every stolen memory and returning to his true identity, but his bank account drops to zero and he leaves broke and forgotten. Or Option B: Hit the escape pod with the ten million dollars in cash, living as a billionaire for the rest of his life, but remaining a total stranger to himself forever. What would you do? Comment Option A or Option B below, and subscribe to What-eif for more impossible stories!",
    "short": "I deleted one memory every day for a hundred thousand dollars. A shadowy tech app called MindPurge paid instant cash for any human memory. Day one, I erased my fifth-grade math test and bought a sports car. Day thirty, I had three million dollars, but I couldn't remember my first pet. By day sixty, my head was glitching with digital static, and I forgot the face of the girl I loved! Desperate to buy them back, I broke into the underground memory vault, only to find the buyers were auctioning human souls... and that's the terrifying reason I'm a billionaire who doesn't remember who I am, because..."
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


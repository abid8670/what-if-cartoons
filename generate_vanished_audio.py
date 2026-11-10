import asyncio
import os
import pathlib
import subprocess
import edge_tts

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\vanished")
PUB_TIMER = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\vanished")
PUB_DIR.mkdir(parents=True, exist_ok=True)
PUB_TIMER.mkdir(parents=True, exist_ok=True)

VOICE = "en-US-GuyNeural"
RATE = "+6%"

SCRIPTS = {
    "ch_1": (
        "At two fourteen PM on a Tuesday, eight billion human beings vanished in a single microsecond. "
        "Cars rolled to a stop with empty driver seats. Half-eaten sandwiches sat on silent cafe tables. "
        "No bodies. No war. No screams. Just an immediate, suffocating silence. "
        "Pip stood in the center of a eight-lane intersection, screaming at the sky... and not a single soul answered."
    ),
    "ch_2": (
        "For the first seven days, terror surrendered to absolute godhood. "
        "Pip smashed the glass of an exotic dealership, fired up a four million dollar supercar, and ripped down the empty highway at two hundred miles an hour. "
        "He moved into a billionaire's penthouse, cooked wagyu steaks, and slept in silk sheets. "
        "No alarm clocks. No rent. No laws. He wasn't just a survivor... he was the sole owner of Planet Earth."
    ),
    "ch_3": (
        "By day thirty, the golden dream collapsed into a nightmare. "
        "The automated power grid choked, plunging the entire continent into pitch darkness. "
        "The water taps sputtered brown sludge and died. "
        "Without fire departments, unchecked lightning strikes ignited entire city blocks. "
        "Wild packs of starving pets roamed the asphalt like wolves. "
        "The world was no longer a playground... it was an eighty-billion-ton tomb."
    ),
    "ch_4": (
        "By month six, the silence began chewing through Pip's sanity. "
        "The human brain is physically incapable of surviving zero social contact. "
        "Pip dressed department store mannequins in suits, arranging them around dinner tables just to have someone to talk to. "
        "He left radios tuned to static just to fill the room with sound. "
        "He would have burned every skyscraper and traded every bar of gold on Earth... just to hear another human voice say hello."
    ),
    "ch_5": (
        "Day three hundred and sixty-five. One full year of total, rotting silence. "
        "Pip sat on the floor of his reinforced apartment, watching a dying candle flicker. "
        "And then... three heavy, deliberate, rhythmic thuds rattled the reinforced steel of his front door. "
        "Knock. Knock. Knock. "
        "Which is more terrifying? Realizing you are entirely alone in the universe... or realizing you never were? "
        "Look at the screen right now and tell me in the comments below: "
        "Option A: Open the door... because anything is better than dying alone. "
        "Or Option B: Barricade it and hide... because whatever is standing on the other side is NOT human."
    ),
    "short": (
        "At two fourteen PM, eight billion people vanished in a single blink! "
        "For the first week, Pip lived like a king: free supercars, empty mansions, unlimited food. "
        "Then the power grid died. The city went pitch black. "
        "Six months in, the silence drove him completely insane. "
        "Until day three hundred and sixty-five... when he heard three heavy knocks on his door. "
        "Knock. Knock. Knock. "
        "If you were Pip, what do you do? "
        "Option A: Open it! "
        "Option B: Barricade it and never look! Drop your choice in the comments!"
    )
}

async def generate():
    for name, text in SCRIPTS.items():
        raw_path = PUB_DIR / f"{name}_raw.mp3"
        final_path = PUB_DIR / f"{name}.mp3"
        timer_path = PUB_TIMER / f"{name}.mp3"
        
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(raw_path))
        print(f"Generated raw TTS for {name}")
        
        # Normalize audio volume to broadcast standard
        cmd = [
            "ffmpeg", "-y", "-i", str(raw_path),
            "-filter:a", "loudnorm=I=-14:LRA=7:tp=-1.5",
            str(final_path)
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        # copy to public_timer
        subprocess.run(["copy", str(final_path), str(timer_path)], shell=True, stdout=subprocess.DEVNULL, check=True)
        print(f"Mastered {name}.mp3 to -14 LUFS")

if __name__ == "__main__":
    asyncio.run(generate())


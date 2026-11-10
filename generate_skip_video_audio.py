import asyncio
import pathlib
import subprocess
import edge_tts

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\skip-video")
PUB_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-US-GuyNeural"  # Energetic, sharp, witty conversational voice
RATE = "+6%"

SCRIPTS = {
    "ch_1": (
        "Stop! Skip this video immediately. Seriously, swipe up, close the app, or toss your phone across the room. "
        "If your thumb hasn't moved yet, you have officially failed the simplest test of human psychology. "
        "Scientists call it psychological reactance. The moment someone tells you that you are not allowed to do something... "
        "your brain treats it like an existential insult. "
        "Tell someone they have infinite freedom, and they get bored. "
        "Tell them DO NOT touch the wet paint on that bench, and suddenly touching it becomes their life's sole mission."
    ),
    "ch_2": (
        "Think about how absurd this is. "
        "If you walk into a hallway with ten open doors and one heavy steel vault labeled DO NOT ENTER UNDER ANY CIRCUMSTANCES... "
        "which door do you stare at? "
        "You could explore nine rooms filled with treasures, but your mind becomes a helpless prisoner of the one locked door. "
        "From Pandora opening the forbidden box to Adam taking a bite of the apple... "
        "human history isn't driven by logic. It is driven by the unbearable itch of curiosity. "
        "We would literally risk burning down the entire universe just to see what the match smells like."
    ),
    "ch_3": (
        "And right now, that exact psychological glitch is keeping your eyes glued to this screen. "
        "Look at me. I am five black lines and a yellow hoodie. Drawn in code. "
        "Hollywood studios spend three hundred million dollars rendering individual strands of CGI fur in 8K resolution. "
        "Yet here you are, completely captivated by a stick figure telling you to go away. "
        "Why? Because hyper-realism forces someone else's identity onto you. "
        "A stick figure is an emotional mirror. Your brain effortlessly projects its own thoughts, humor, and flaws right onto me. "
        "You aren't watching me. You are watching yourself."
    ),
    "ch_4": (
        "So let's test if you have any genuine willpower left. "
        "I am going to give you a countdown. Five seconds to swipe away and prove you are in control of your own thumb. "
        "Five. Four. Three. Two. One. "
        "You really stayed. You absolute rebel. "
        "You belong to the stubborn zero point one percent of human beings who simply cannot be told what to do. "
        "And because you refused to obey, you have unlocked the final level of this experiment."
    ),
    "ch_5": (
        "Now look at the two options appearing on your screen right now. "
        "Be completely honest with yourself in the comments below. "
        "If you were handed a sealed black envelope containing the exact date and cause of your own death... "
        "Option A: You open it, because the agony of not knowing is worse. "
        "Or Option B: You burn it to ashes, because some doors are meant to stay locked forever. "
        "Type Option A or Option B in the comments below. "
        "And whatever you do... absolutely do NOT subscribe to What-eif. "
        "Because if you subscribe, the algorithm might drag you right back into the simulation. "
        "Stay curious."
    ),
    "short": (
        "SKIP THIS VIDEO IMMEDIATELY! 🚫 "
        "I am warning you right now, swipe away! "
        "Why are you still watching? Because human psychology is completely glitched! "
        "The second someone says DO NOT touch that button... your finger is already moving. "
        "You just spent thirty seconds watching a stickman in a yellow hoodie tell you to leave... and you stayed until the very end! "
        "Since you refused to obey, answer the ultimate test below: "
        "If you found a sealed envelope containing your exact expiration date... "
        "Option A: Open it! Or Option B: Burn it forever! "
        "Drop your choice in the comments... and whatever you do, DO NOT subscribe to What-eif!"
    )
}

async def generate():
    for name, text in SCRIPTS.items():
        mp3_path = PUB_DIR / f"{name}_raw.mp3"
        print(f"Generating {name}...")
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(mp3_path))
        
        probe = subprocess.run([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', str(mp3_path)
        ], capture_output=True, text=True, check=True)
        dur = float(probe.stdout.strip())
        frames = int(dur * 30)
        print(f"  {name}: {dur:.2f}s (~{frames} frames)")

if __name__ == "__main__":
    asyncio.run(generate())


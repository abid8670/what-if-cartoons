import asyncio
import pathlib
import subprocess
import edge_tts

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch")
PUB_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-US-GuyNeural"  # Expressive, crisp, confident conversational voice
RATE = "+6%"               # Fast, punchy pacing

SCRIPTS = {
    "ch_1": (
        "Stop! Do not watch this video. Seriously, close this tab right now, throw your phone in a lake, and walk away. "
        "You were warned in the title. You were warned on the thumbnail. Yet here you are. "
        "Why? Because human psychology has a hilarious glitch called reverse psychology. "
        "The second someone says 'DO NOT touch wet paint'... your hand moves on its own. "
        "If I tell you 'DO NOT think of a pink elephant'... congratulations, you just imagined one wearing sunglasses."
    ),
    "ch_2": (
        "Which brings us to the biggest paradox on the internet: stickman animations. "
        "Hollywood burns three hundred million dollars rendering individual strands of CGI fur in hyper-realistic 8K. "
        "Yet when it is 2 AM, what makes millions of adults cry their eyes out? "
        "Five black lines drawn in MS Paint by an animator fueled by cold coffee and spite. "
        "Why? Because hyper-realism forces someone else's face onto you. "
        "A stick figure is an emotional mirror. Your brain projects its own memories, pain, and soul onto those simple lines."
    ),
    "ch_3": (
        "Which brings us to the most dangerous part of this entire experiment. "
        "The YouTube algorithm specifically warned our team: whatever you do, DO NOT let them comment! "
        "So I am officially warning you: DO NOT scroll down right now. "
        "DO NOT comment your current battery percentage down below. "
        "DO NOT type which country you are watching this from. "
        "And whatever you do, DO NOT comment the secret code word: POTATO. "
        "Because if you type a comment, it completely confuses the algorithm, spikes the engagement, and triggers the viral loop. "
        "So please, keep your fingers off that keyboard!"
    ),
    "ch_4": (
        "Look at the timer. You just spent two whole minutes watching a video about literally... nothing. "
        "A video about why nobody watches stickmen, watched from start to finish. "
        "You broke rule number one: you watched it. "
        "You broke rule number two: you're probably already typing a comment right now. "
        "Which leaves only one final forbidden button on your screen: that glowing red SUBSCRIBE button. "
        "Whatever you do, absolutely do NOT click it. And do NOT hit that notification bell. "
        "Because if you subscribe... you might actually catch our next story. "
        "And we wouldn't want that... would we?"
    ),
    "voice_short": (
        "STOP! Do not watch this video. Swipe away right now! "
        "You were warned in the title, yet here you are. Why? Because human psychology is completely broken! "
        "The second someone says 'DO NOT touch wet paint', your hand moves on its own. "
        "And the YouTube algorithm specifically warned me: DO NOT let viewers comment! "
        "So whatever you do... DO NOT comment your battery percentage down below. "
        "DO NOT comment your city. And definitely DO NOT comment the secret word: POTATO! "
        "You just spent 45 seconds watching a stickman talk about nothing. "
        "If you broke every rule and watched this to the end... definitely do NOT hit Subscribe. "
        "You wouldn't want to see part two... would you?"
    )
}

async def generate():
    for name, text in SCRIPTS.items():
        mp3_path = PUB_DIR / f"{name}.mp3"
        print(f"Generating {name}...")
        communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
        await communicate.save(str(mp3_path))
        
        # Probe duration
        probe = subprocess.run([
            'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
            '-of', 'default=noprint_wrappers=1:nokey=1', str(mp3_path)
        ], capture_output=True, text=True, check=True)
        dur = float(probe.stdout.strip())
        frames = int(dur * 30)
        print(f"  {name}: {dur:.2f}s (~{frames} frames)")

if __name__ == "__main__":
    asyncio.run(generate())


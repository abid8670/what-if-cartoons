import asyncio
import pathlib
import subprocess
import edge_tts

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\one-thousand-or-one")
PUB_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-US-ChristopherNeural"  # Deep, warm, soulful narration
RATE = "+0%"                      # Measured, reflective, cinematic emotional pace

SCRIPTS = {
    "ch_1": (
        "Imagine you are given a choice that will forever shape your destiny: "
        "You can have one thousand people who desire you... or just ONE person who truly loves you. "
        "In a modern world driven by dating apps, endless notifications, and the illusion of unlimited options, "
        "most people fall into the trap of numbers. "
        "We convince ourselves that more followers, more matches, and more temporary attention will heal our loneliness. "
        "Psychologists call this the Paradox of Abundance."
    ),
    "ch_2": (
        "At first, the one thousand seem intoxicating. "
        "Glowing neon lights, endless flattery, glamorous strangers whispering sweet words in your ear. "
        "Your ego feels completely invincible. "
        "You think you have conquered loneliness because your phone never stops buzzing. "
        "When you are winning, rich, and buying drinks, all one thousand are laughing right beside you. "
        "A crowd does not comfort you. A crowd only watches."
    ),
    "ch_3": (
        "Then life does what life always does: a sudden tragedy hits. "
        "You lose your job. You fall sick. The cold rain starts pouring down from the midnight sky. "
        "You turn around to ask for help... and suddenly, the neon lights flicker out. "
        "One by one, the one thousand glamorous silhouettes dissolve like mist into the freezing dark. "
        "Because a thousand people never loved you. They only loved what you could give them. "
        "And now, you are standing in the middle of an empty street, soaked to the bone."
    ),
    "ch_4": (
        "Just when you think you are completely broken, you hear footsteps in the puddles. "
        "Through the freezing storm, one person is walking toward you. "
        "Not because of your wealth. Not because you were entertaining. But simply because of who you are. "
        "She holds a bright yellow umbrella over your head, "
        "letting the freezing rain soak her own shoulder just so you can stay warm and dry. "
        "She does not ask for a thousand promises. She just stays."
    ),
    "ch_5": (
        "The ancient philosophers knew a truth that modern society forgot: "
        "A thousand shallow puddles will never quench a thirsty soul. Only one deep well gives life. "
        "Having one thousand people who want you is easy. "
        "Finding the one person who will stand in the freezing rain with you is priceless. "
        "So answer honestly in the comments below: would you choose the one thousand... or the one? "
        "And if you have that one in your life right now, tag them or type 'STAY'. "
        "Subscribe to What If Studio for more stories that touch the human heart."
    ),
    "voice_short": (
        "1,000 OR 1? Which would you choose? "
        "You can have one thousand people who desire you... or just ONE person who truly loves you. "
        "Society tells you to chase the numbers. Endless matches, glamorous strangers, cheap validation. "
        "But watch what happens when the storm hits. "
        "When you lose everything, all one thousand vanish like smoke into the freezing rain. "
        "Because a thousand people never loved you—they only loved the show. "
        "Then through the dark, one person walks toward you with a yellow umbrella. "
        "Getting her own shoulder soaked just to keep you dry. "
        "A thousand shallow puddles will never quench your thirst. "
        "Tell me in the comments: 1,000... or 1? "
        "Subscribe for stories that touch the soul."
    )
}

async def generate():
    for name, text in SCRIPTS.items():
        mp3_path = PUB_DIR / f"{name}.mp3"
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


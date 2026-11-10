import asyncio
import pathlib
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-ChristopherNeural"
RATE = "-4%"
PITCH = "-2Hz"

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "What if one morning... you woke up, rubbed your eyes, and suddenly noticed glowing numbers floating above everyone's head? Green digital clocks ticking down years, months, days, and seconds. At first, Pip thought he was dreaming. But as he stepped out onto the morning sidewalk, he realized the terrifying reality. Every single human being was walking around with their exact remaining lifespan hovering right above their forehead.",
    
    "ch_2": "Down in the subway station, Pip watched the rush hour crowds. Suddenly, the timer above a man in a trenchcoat flickered violently. The numbers turned crimson red and began plummeting down to just twelve seconds! The man stumbled toward the platform edge as a speeding train screeched into the tunnel! Without thinking, Pip lunged forward and yanked him backward. The train roared past. The man was safe... and his timer instantly reset to fifty-eight years. Pip's hands trembled: fate wasn't set in stone. It could be rewritten.",
    
    "ch_3": "Saving a life felt like a miracle. But knowing the countdown soon became a living nightmare. Everywhere Pip walked, he saw invisible tragedies waiting to happen. An old man laughing in a park with only forty-eight hours left. A young couple holding hands, completely unaware that one of them had only four months. Knowing when someone's story ends doesn't make you a hero. It makes you a prisoner of grief that hasn't happened yet.",
    
    "ch_4": "Exhausted and terrified, Pip ran back home to the one person who always grounded him. She opened the door with a warm smile and handed him a cup of hot tea. Pip took a deep breath, looking up into her kind eyes... and his heart stopped. Above her head, a timer was blinking in bright, urgent red: exactly forty-five seconds left. There was no train. No obvious danger. Panic took over. Pip grabbed her hand, threw open the front door, and pulled her outside into the rain just as the heavy concrete balcony above their room collapsed with a deafening crash. They fell to the wet grass. Pip looked up... her timer had turned emerald green: sixty-four years. They were safe.",
    
    "ch_5": "Late that night, Pip stood alone in his bathroom. His trembling hand slowly reached for the cloth hanging over the mirror. For the first time, he considered looking up at his own reflection. Seeing his own countdown clock. But as the fabric began to slip... Pip stopped. He pulled the cloth back down and smiled. Life isn't precious because we know when it ends. It's precious because every single second is an unwritten miracle. If you were standing in front of that mirror right now, would you look? Tell us in the comments: Option A for Yes, or Option B for No. And subscribe to What-eif to cherish every heartbeat.",
    
    "short": "What if you could see everyone's exact death timer floating above their head? When Pip saw a stranger's timer turn crimson red with only five seconds left on a subway platform, he yanked him back just as the train roared past, resetting his life by fifty-eight years! But when he got home, he saw his favorite person's clock blinking red with thirty seconds left! If you could look in a mirror and see your own timer... would you look? Tell us in the comments and subscribe!"
}

async def generate():
    for name, text in SCRIPTS.items():
        out_file = OUT_DIR / f"{name}.mp3"
        print(f"Generating VO: {name} -> {out_file.name}...")
        comm = edge_tts.Communicate(text, voice=VOICE, rate=RATE, pitch=PITCH)
        await comm.save(str(out_file))
        print(f"Saved {name}.mp3 ({out_file.stat().st_size} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())


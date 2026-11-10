import asyncio
import json
import pathlib
import sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-ChristopherNeural"
RATE = "-4%"
PITCH = "-2Hz"

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\mind-reader")
OUT_DIR.mkdir(parents=True, exist_ok=True)
PUB_TIMER = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\mind-reader")
PUB_TIMER.mkdir(parents=True, exist_ok=True)

SCRIPTS = {
    "ch_1": "What if one morning... you woke up, stepped outside, and realized the walls of your own skull had completely dissolved? Every private thought, every embarrassing memory, and every raw judgment was broadcasting out loud like a loudspeaker. At first, Pip thought people were just being rude. But when he internally thought about the barista's ridiculous hat, she immediately glared at him and dropped the coffee pot. Pip froze in absolute terror. They weren't guessing. They could hear every single whisper inside his head.",
    
    "ch_2": "Panicking, Pip rushed into the morning subway, desperate to keep his thoughts quiet. But the human brain is a cruel trap: the more you try NOT to think about something, the louder it screams. Dark anxieties, buried secrets, and intrusive thoughts began flooding the train car. Passengers turned to stare in disgust and horror. A friend waved at him, but before Pip could smile, his subconscious betrayed him: 'I wish you weren't here.' The friend's face shattered. Pip realized the terrifying truth: civilized society only exists because of the polite lies we tell each other.",
    
    "ch_3": "Exhausted and humiliated, Pip fled the city, running until the judgments faded into silence. Up on an abandoned rooftop overlooking the glowing skyline, he finally caught his breath. But true isolation wasn't peace. It was agonizing loneliness. When you can hide nothing, you can trust no one. Pip watched the distant crowds below, realizing that every human carries a dark, messy chaos in their mind... yet they only judged him because his glass was transparent.",
    
    "ch_4": "Just as despair settled in, the door to the rooftop creaked open. It was the one person he feared facing the most. Pip clamped his hands over his ears, screaming in his head for her to leave before his unfiltered mind destroyed everything. But as she sat beside him, she didn't flinch at his chaotic thoughts, his doubts, or his insecurities. Instead, she took a deep breath, looked into his eyes, and smiled. 'My mind is just as terrifying,' she said softly. For the first time, radical honesty wasn't a weapon. It was pure, unconditional acceptance.",
    
    "ch_5": "Pip looked out at the glowing city below. Society teaches us to wear masks, to filter our souls, and to smile when we are bleeding inside. Maybe the curse wasn't that they could read his mind. The curse was living in a world terrified of the raw truth. If everyone could suddenly hear your unfiltered thoughts for just twenty-four hours... would your life be destroyed, or would you finally be truly free? Tell us in the comments: Option A for Destroyed, or Option B for Truly Free. And subscribe to What-eif to cherish every unfiltered heartbeat.",
    
    "short": "What if everyone could hear your unfiltered thoughts out loud? When Pip stepped into a coffee shop, he casually thought about the barista's terrible haircut... and she immediately threw hot coffee at him! In the subway, the harder he tried to stay quiet, the louder his deepest secrets screamed through the train car! If your best friend could hear every thought in your head for just ONE HOUR... would you still be friends? Drop Option A for YES or Option B for NO in the comments, and subscribe to What-eif!"
}

async def generate():
    for name, text in SCRIPTS.items():
        out_file1 = OUT_DIR / f"{name}.mp3"
        out_file2 = PUB_TIMER / f"{name}.mp3"
        print(f"Generating VO: {name} -> {out_file1.name}...")
        comm = edge_tts.Communicate(text, voice=VOICE, rate=RATE, pitch=PITCH)
        await comm.save(str(out_file1))
        # copy to public_timer
        with open(out_file1, 'rb') as f_src, open(out_file2, 'wb') as f_dst:
            f_dst.write(f_src.read())
        print(f"Saved {name}.mp3 ({out_file1.stat().st_size} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())


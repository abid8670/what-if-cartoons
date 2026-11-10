import asyncio
import edge_tts
import pathlib
import json

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\thousand-words")
VOICE = "en-US-ChristopherNeural"
RATE = "-2%"
PITCH = "-1Hz"

SCRIPTS = {
    "ch_1": """The average human speaks roughly sixteen thousand words every single day. We waste them on empty complaints, road rage, and pointless arguments with strangers on the internet. But what if one morning, a glowing digital counter appeared above your head, and it read: exactly one thousand. Not one thousand words per day. One thousand words for the rest of your life.""",
    
    "ch_2": """At first, Pip didn't believe it. He ordered a double espresso—burned five words. He complained about the rainy weather—burned twelve words. He argued with a rude driver in traffic—burned eighty-seven words in thirty seconds. By noon, the glowing number above his head flashed in neon red: four hundred and twelve remaining. For the first time in his life, Pip covered his mouth in terror. Every syllable was literally burning away his future.""",
    
    "ch_3": """Pip went completely silent. He carried a small notepad, but people got impatient and walked away. Yet without words, he began to see the world for what it truly was. He noticed how people talk just to fill the quiet, rarely ever listening. He watched friendships crumble over cheap words, and families drift apart because nobody knew how to sit together in peace. Silence wasn't a prison. It was a mirror.""",
    
    "ch_4": """Months turned into years. Pip guarded his remaining words like bars of pure gold. He used three words to forgive an old friend. He used twelve words to comfort a weeping child at a train station. Soon, only three words remained on his glowing counter. Just three. One rainy evening, he sat beside the girl in the yellow scarf who had loved him unconditionally through the quiet. He took her trembling hand, took a deep breath, and spent his final three words: I love you.""",
    
    "ch_5": """The counter hit zero. Pip smiled. Because he realized words are not meant to fill empty air—they are meant to anchor a soul. In a world drowning in infinite noise, the greatest gift you can offer is your intentional presence. Now be honest with yourself: if your counter dropped to just three words right now, who would you tell, and what would those three words be? Tell me in the comments below. And hit Subscribe to WHAT IF STUDIO, before your words run out.""",
    
    "short": """What if a digital counter appeared above your head, and you only had one thousand words left to speak for the rest of your life? At first, you would waste them on road rage and complaints. But when the counter flashes down to just three words... who would you call, and what would you say? Tell me your final three words in the comments. And subscribe to WHAT IF STUDIO before your counter hits zero!"""
}

async def generate():
    for key, text in SCRIPTS.items():
        out_file = OUT_DIR / f"{key}.mp3"
        print(f"Generating {key} with {VOICE}...")
        comm = edge_tts.Communicate(text, VOICE, rate=RATE, pitch=PITCH)
        await comm.save(str(out_file))
        print(f"Saved {out_file} ({out_file.stat().st_size} bytes)")

if __name__ == "__main__":
    asyncio.run(generate())


import asyncio, json, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-ChristopherNeural"
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\no-sun")
OUT_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "The 8-Minute Illusion",
        "text": (
            "Imagine it is twelve o'clock on a bright, sunny Tuesday afternoon. Pip and Mo are sitting outside at a park bench, "
            "eating lunch, and soaking in the warm golden sunshine. At that exact microsecond, ninety-three million miles away in the "
            "center of the solar system, the Sun completely vanishes into thin air! But down here on Earth, absolutely nobody notices. "
            "The birds keep singing. The flowers stay open. The warm sunlight still shines brightly on your face. "
            "Why? Because the universe has a strict speed limit. Light does not travel instantly, it travels at one hundred and eighty-six thousand "
            "miles per second. For eight minutes and twenty seconds, humanity lives inside a total cosmic illusion, enjoying the warm light "
            "of a ghost star that no longer exists!"
        )
    },
    {
        "id": "ch_2",
        "title": "The Cosmic Slingshot",
        "text": (
            "Then, at minute eight and twenty seconds, the illusion shatters. In less than a blink, the entire blue sky turns pitch black. "
            "Millions of distant stars appear in the middle of the afternoon. But sudden darkness is only the beginning of our nightmare. "
            "Einstein proved that gravity also travels at the exact speed of light. Right now, the invisible gravitational anchor that holds the entire "
            "solar system together suddenly snaps! For four and a half billion years, Earth has been locked in an orbit, hurtling around the Sun at "
            "sixty-seven thousand miles per hour. Without solar gravity pulling us in a curved circle, Newton's first law takes command. "
            "Earth is launched into deep interstellar space like a pebble fired from a cosmic slingshot!"
        )
    },
    {
        "id": "ch_3",
        "title": "The Big Freeze",
        "text": (
            "Without the Sun's massive nuclear engine feeding us warmth, Earth begins bleeding its heat into the freezing vacuum of space. "
            "By the end of Day One, global temperatures drop below freezing, hitting zero degrees Celsius. By Day Three, the thermometer plummets "
            "to minus twenty degrees. Trees and crops wither as photosynthesis grinds to an absolute halt. Power grids overload as billions of heaters "
            "turn on at once. Frost creeps up skyscraper windows like white spiderwebs. But deep beneath the surface, a miracle happens. "
            "The oceans do not freeze completely. Only the top few feet turn into solid ice. This thick sheet of surface ice acts like a giant "
            "winter blanket, trapping liquid water and geothermal heat below, keeping deep ocean life alive!"
        )
    },
    {
        "id": "ch_4",
        "title": "The Underground Sanctuary",
        "text": (
            "By Day Five, the frozen surface of Earth has become a silent, icy desert sitting at minus fifty degrees Celsius. "
            "Anyone caught outside without an astronaut thermal suit would freeze in minutes. But humanity refuses to give up! "
            "Our civilization discovers its greatest secret weapon: geothermal energy. Miles beneath our feet, Earth's radioactive molten core "
            "is burning at six thousand degrees Celsius, hotter than the surface of the Sun itself! In deep underground mines, subway tunnels, "
            "and volcanic regions like Iceland, humans build glowing subterranean sanctuaries. Powered by unlimited geothermal steam turbines "
            "and artificial ultraviolet LED gardens, massive underground cities emerge where humans grow food, drink purified melted snow, "
            "and survive together in the dark!"
        )
    },
    {
        "id": "ch_5",
        "title": "Day Seven: The Golden Return",
        "text": (
            "Now, imagine the clock hits Day Seven. Exactly one hundred and sixty-eight hours have passed in total interstellar isolation. "
            "Earth has traveled over eleven million miles into deep space. And then, without warning, the Sun snaps back into existence! "
            "A blinding wave of light and solar radiation slams into Earth's upper atmosphere. The sky explodes with dancing emerald auroras! "
            "Miles of surface ice crack with the deafening roar of rolling thunder. For the first time in a whole week, the dark horizon bursts into "
            "radiant shades of pink, amber, and gold. The first sunrise in seven days washes over a frozen world!"
        )
    },
    {
        "id": "ch_6",
        "title": "The Miracle Engine & Outro",
        "text": (
            "Seven days without the Sun leaves us with one life-changing lesson. The giant star in our sky is not just a bright light, "
            "it is the miraculous engine behind every breath of air, every drop of rain, and every beat of your heart. Without it, humanity is just "
            "a fragile speck drifting through the freezing void. What would be the very first thing you would do if the Sun suddenly went out? "
            "Let us know in the comments below! If you enjoyed this animated sci-fi adventure, please click the Subscribe button right now and turn "
            "on the notification bell so you never miss another mind-bending cartoon. Thanks for watching, and see you next time!"
        )
    }
]

async def generate():
    total_dur = 0
    print("=== GENERATING 5-MINUTE EPISODE CHAPTER AUDIOS ===")
    for ch in CHAPTERS:
        out_mp3 = OUT_DIR / f"{ch['id']}.mp3"
        comm = edge_tts.Communicate(ch['text'], VOICE, rate="+1%")
        await comm.save(str(out_mp3))
        dur = float(subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(out_mp3)
        ]).decode().strip())
        total_dur += dur
        print(f"Generated {ch['id']} ({ch['title']}): {dur:.2f}s")
    
    print(f"\nTotal 5-Minute Episode Audio Duration: {total_dur:.2f}s ({total_dur/60:.2f} min)")

if __name__ == "__main__":
    asyncio.run(generate())

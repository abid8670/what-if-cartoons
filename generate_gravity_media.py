import asyncio, json, os, pathlib, subprocess, sys, time
import edge_tts

pub_dir = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\no-gravity")
pub_dir.mkdir(parents=True, exist_ok=True)
out_dir = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\src\episodes\no-gravity")
out_dir.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch1_weightless",
        "title": "Chapter 1: The Weightless Morning",
        "text": (
            "It begins on a perfectly ordinary morning. You are standing in your kitchen, pouring milk into a bowl of cereal. "
            "Suddenly, your spoon feels weightless. "
            "The milk stops flowing downward. Instead, it forms shimmering, perfect spheres of white liquid floating right before your eyes. "
            "You look down at your slippers. Your toes are no longer touching the tile floor. "
            "You push lightly off the kitchen counter, and you drift straight toward the ceiling. "
            "Outside the window, your neighbor's cat is floating through the air like a confused furry astronaut, batting at suspended autumn leaves. "
            "Cars parked on the street lose their grip on the asphalt, bobbing like rubber ducks in a bath. "
            "You laugh. It feels like pure magic. Every kid's dream has just come true: gravity has vanished. "
            "What could possibly go wrong?"
        )
    },
    {
        "id": "ch2_playground",
        "title": "Chapter 2: The Playground of Gods",
        "text": (
            "For the first fifteen seconds, the entire planet is convinced this is the coolest glitch in human history. "
            "You drift out your front door into the neighborhood. Your best friend Mo is twenty feet in the air, "
            "doing effortless quadruple backflips between two oak trees, laughing hysterically. "
            "Kids are jumping off two-story rooftops with zero fear, floating down like dandelions. "
            "You push off a brick wall with your sneakers, and you launch yourself fifty feet into the sky. "
            "No engines, no wings, no fatigue—just pure, unadulterated human flight. "
            "A basketball player shoots a ball from half-court; it sails in a perfectly straight infinite line, "
            "never arching downward, drifting over the city skyline. "
            "For thirty glorious seconds, humanity feels like gods."
        )
    },
    {
        "id": "ch3_tangential",
        "title": "Chapter 3: The Tangential Launch",
        "text": (
            "And then... the science kicks in. "
            "Human beings often forget a fundamental cosmic fact: Earth is not standing still. "
            "At the equator, our planet is spinning at an astonishing speed of one thousand and thirty-seven miles per hour—"
            "about sixteen hundred and seventy kilometers every single hour. "
            "Gravity was the only invisible anchor tethering you to the surface. "
            "Without gravity's gravitational grip pulling you downward toward Earth's core, Newton's first law of motion takes over. "
            "An object in motion continues in a straight line at constant velocity. "
            "The spherical ground beneath you curves away, but you keep traveling in a straight tangent line. "
            "To you, it looks like you are suddenly accelerating upward at fifteen feet per second. "
            "Within twenty seconds, you are higher than the trees. "
            "Within forty seconds, you are soaring above skyscrapers. "
            "And there is nothing to grab onto."
        )
    },
    {
        "id": "ch4_blowout",
        "title": "Chapter 4: The Atmospheric Blowout",
        "text": (
            "It gets infinitely worse. "
            "Earth's atmosphere has no lid. The five quadrillion tons of air that allow you to draw breath are held against the vacuum of deep space "
            "by one thing alone: gravity. "
            "The instant gravity disappears, there is nothing holding the atmosphere down. "
            "The trillion cubic meters of air expand violently outward into space, creating a planetary blowout. "
            "Barometric pressure collapses. Within seconds, the moisture on your tongue begins to vaporize. "
            "The nitrogen dissolved in your blood bubbles out like an opened soda can. "
            "Down below, the oceans—holding over one point three billion cubic kilometers of water—detach from the seabed. "
            "Giant walls of water, three miles high, lift into the sky as airborne tsunamis, swallowing bridges and shorelines in floating chaos."
        )
    },
    {
        "id": "ch5_the_fall",
        "title": "Chapter 5: The 60th Second: The Fall",
        "text": (
            "As you drift eight hundred feet above the city, staring into the terrifying beauty of a floating apocalypse, "
            "the timer hits second fifty-seven. "
            "Fifty-eight. "
            "Fifty-nine. "
            "Sixty. "
            "Gravity returns. "
            "At nine point eight meters per second squared, the full gravitational pull of Earth snaps back on. "
            "The five-trillion-ton atmospheric pressure slams back down like a solid hammer. "
            "And everything—every car, every skyscraper brick, every trillion gallons of ocean water, and eight billion human beings "
            "suspended in the sky—instantly transitions from weightless wonder to terminal velocity freefall. "
            "You are eight hundred feet up. "
            "You have precisely seven seconds before you hit the ground at over one hundred and twenty miles per hour."
        )
    },
    {
        "id": "ch6_outro",
        "title": "Chapter 6: The Aftermath & Subscribe",
        "text": (
            "By a miraculous stroke of luck, you plummet directly into a floating swimming pool that slams down into a city park, "
            "cushioning your fall in a towering blast of water. "
            "You crawl onto the muddy grass, gasping for air, bruised but alive. "
            "Around you, the city is silent. Trees stand shattered, cars rest inverted on rooftops, but the ground is firm beneath your knees. "
            "For sixty seconds, we got what we always dreamed of. And it almost wiped out civilization. "
            "Gravity is not a cage. It is the only thing keeping us alive. "
            "If you loved this mind-bending scenario, smash that subscribe button right now and turn on the notification bell! "
            "We explore impossible sci-fi what-if questions every single week. "
            "Leave a comment below telling us: what would you do if gravity stopped right now? "
            "Thanks for watching, and see you next week on What If Theory!"
        )
    }
]

SHORT_SCRIPT = (
    "What if Earth lost gravity for just sixty seconds? "
    "At first, it's pure magic: your feet lift off the floor, coffee floats in mid-air, and kids do backflips over houses. "
    "Until real physics kicks in. "
    "Earth spins at over one thousand miles per hour. Without gravity anchoring you, you launch upward into the sky at fifteen feet per second! "
    "The atmosphere blows out into the vacuum of space, and oceans lift into airborne tsunamis! "
    "Then, second sixty arrives. "
    "Gravity snaps back on. "
    "And everything falling from eight hundred feet hits the ground at terminal velocity! "
    "Subscribe to What If Theory for weekly mind-bending science!"
)

# Save scripts
with open(out_dir / "chapters.json", "w", encoding="utf-8") as f:
    json.dump(CHAPTERS, f, indent=2)

async def generate():
    voice = "en-US-ChristopherNeural"
    print("Generating 6-minute voiceover...")
    total_audio = bytearray()
    
    for i, ch in enumerate(CHAPTERS):
        print(f"Generating Chapter {i+1}: {ch['title']}...")
        comm = edge_tts.Communicate(ch['text'], voice, rate="+2%")
        ch_audio = bytearray()
        async for chunk in comm.stream():
            if chunk['type'] == 'audio':
                ch_audio.extend(chunk['data'])
        (pub_dir / f"ch_{i+1}.mp3").write_bytes(ch_audio)
        total_audio.extend(ch_audio)

    (pub_dir / "voice_6m.mp3").write_bytes(total_audio)
    print(f"Master 6-minute MP3 generated ({len(total_audio)} bytes).")

    print("\nGenerating Shorts voiceover...")
    comm_short = edge_tts.Communicate(SHORT_SCRIPT, voice, rate="+6%")
    short_audio = bytearray()
    async for chunk in comm_short.stream():
        if chunk['type'] == 'audio':
            short_audio.extend(chunk['data'])
    (pub_dir / "voice_short.mp3").write_bytes(short_audio)
    print(f"Shorts MP3 generated ({len(short_audio)} bytes).")

asyncio.run(generate())


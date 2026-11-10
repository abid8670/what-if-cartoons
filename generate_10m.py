import asyncio, json, os, pathlib, sys, time
import edge_tts
import numpy as np

# Complete 10-minute script (8 Chapters, ~1,450 words)
CHAPTERS = [
    {
        "id": "ch1_awakening",
        "title": "Chapter 1: The Awakening",
        "text": (
            "Imagine waking up on a Tuesday morning, completely exhausted. The alarm clock is screeching, "
            "your coffee mug is slipping from your fingers, and you whisper one single, desperate wish: "
            "please, just give me ten more seconds. "
            "You snap your fingers. And then... complete silence. "
            "The screeching alarm cuts out mid-frequency. You look down. Your ceramic coffee mug is suspended "
            "six inches above the tile floor. Dark brown coffee droplets hang like glossy beads of amber in mid-air. "
            "You blink. You wave your hand through the space between the mug and the floor. Nothing falls. "
            "Outside your kitchen window, a sparrow is frozen mid-flap, feathers sharp against the sky. "
            "A drop of condensation on the glass has paused halfway down its trail. "
            "You walk over to the clock on your microwave. The green digital display reads seven-fifteen and "
            "forty-two seconds. The blinking colon between the numbers has frozen solid. "
            "You have just unlocked the fantasy every human being on planet Earth has dreamed about since "
            "the dawn of civilization. You can pause time. And the world is now your personal playground."
        )
    },
    {
        "id": "ch2_exam_cheats",
        "title": "Chapter 2: The First Cheats",
        "text": (
            "At first, the temptation is purely selfish. Who wouldn't exploit it? "
            "An hour later, you are sitting in room four-hundred and two. It is the final calculus exam of the semester. "
            "Your best friend Mo is three desks ahead, sweating bullets, chewing on the eraser of his pencil, "
            "staring blankly at question twelve. The teacher is pacing down the aisle, arms crossed, watching like a hawk. "
            "You feel the panic rising in your throat. You know none of the answers. "
            "Snap. "
            "Instantly, the frantic scratching of pens ceases. The teacher freezes mid-stride, one shoe raised two "
            "inches off the linoleum floor. Mo's worried expression is locked like a marble sculpture. "
            "You stand up. You stretch your legs. The silence is thick, but exhilarating. You casually stroll to the "
            "front of the classroom, pick up the teacher's master answer key, and flip through every single solution. "
            "You walk over to Mo's desk, copy the formulas onto his paper, fill out your own sheet with pristine accuracy, "
            "and walk back to your seat. You rest your chin in your hand, lean back, and snap your fingers again. "
            "The teacher's shoe hits the floor. Mo blinks, rubs his eyes, and looks down at his fully solved paper "
            "in complete disbelief. An instant, undetectable triumph. You just hacked the system."
        )
    },
    {
        "id": "ch3_infinite_wealth",
        "title": "Chapter 3: Infinite Luxury & Wealth",
        "text": (
            "By afternoon, small victories are no longer enough. The power demands a bigger stage. "
            "You walk into the city's premier shopping district. A high-end electronics store is buzzing with customers, "
            "security guards posted at every glass entrance. "
            "Snap. "
            "The bustling crowd turns into a gallery of frozen mannequins. A security guard reaches for his radio, "
            "his hand frozen mid-air. A clerk handing a receipt to a customer stands like a wax statue. "
            "You stroll past the security gates without a sound. You pick up the newest flagship laptop, slip the latest "
            "noise-cancelling headphones over your neck, and pocket stacks of gift cards from the counter. "
            "Next door is an upscale bakery. Freshly baked cinnamon rolls are sitting in the display case, the rising "
            "steam frozen like sculpted cotton candy. You take a bite. "
            "Then you walk into the central bank down the avenue. Cashiers counting hundred-dollar bills are completely motionless. "
            "You open the teller drawers, take whatever cash you want, and slide the drawers shut. "
            "Every product on Earth is now free. Money has lost all meaning. Traffic jams, queues, closing hours—they are "
            "relics of a world you have outgrown. You are living as a ghost king in an empire of paused statues."
        )
    },
    {
        "id": "ch4_hero_complex",
        "title": "Chapter 4: The Hero Complex",
        "text": (
            "With infinite wealth secured, human psychology takes a predictable turn: you decide to become a hero. "
            "At four in the afternoon, you are standing near the busiest intersection downtown. Hundreds of pedestrians "
            "are waiting for the walk signal. Across the street, a mother is holding her little girl's hand. "
            "Suddenly, a screech of tearing metal echoes down the avenue. A twelve-ton concrete mixer truck has suffered "
            "complete brake failure. It blazes through the intersection at fifty miles an hour, heading directly toward the mother and child. "
            "People scream, diving out of the way. The mother turns, horror painted across her face. There are less than two seconds before impact. "
            "Snap. "
            "The screaming stops. The roar of the diesel engine dies into absolute void. "
            "The massive truck is suspended inches above the asphalt, leaning on its front suspension, tires smoking in mid-skid. "
            "You sprint across the pavement. Your heart is pounding in your ears. You reach the mother and child, lift them carefully, "
            "and move them six feet onto the sidewalk, safely behind a concrete barrier. "
            "You step back onto the curb. Snap. "
            "The concrete truck obliterates the empty crosswalk, crashing into the lamppost. The mother opens her eyes, gasping, "
            "looking down at her child, wondering how they are alive. A miracle. "
            "You saved two lives without leaving a single footprint. You don't just feel like a king anymore. You feel like a god."
        )
    },
    {
        "id": "ch5_darkness_trap",
        "title": "Chapter 5: The Darkness Trap",
        "text": (
            "But the laws of physics are not a joke. And the universe never gives away a superpower without charging an unbearable price. "
            "As you experiment with keeping time paused for longer stretches, strange things begin to happen. "
            "You are walking through the city center, enjoying the stillness. Suddenly, the sky dims. The bright afternoon sunlight "
            "flickers, losing its warmth, fading into a murky twilight. Within minutes, the light fails completely. "
            "Pitch blackness swallows everything around you. "
            "Why? Because seeing requires light. "
            "Photons travel at the speed of light—precisely two hundred and ninety-nine million, seven hundred and ninety-two thousand meters per second. "
            "When you pause time, you freeze the progress of time for everything outside your own body. "
            "That means photons stop dead in their tracks. "
            "No new photons are traveling from the sun, from street lamps, or reflecting off buildings. No photons are striking your pupils "
            "or hitting the retina at the back of your eye. "
            "To see anything at all, you must physically push your eyes forward through the stationary cloud of frozen photons, "
            "scooping them up like an insect flying through mist. "
            "The moment you stand still, you are completely, irrevocably blind in absolute darkness."
        )
    },
    {
        "id": "ch6_frozen_air",
        "title": "Chapter 6: The Concrete Atmosphere",
        "text": (
            "If blindness were the only consequence, you might still survive. But the atmospheric chemistry of a paused world is far deadlier. "
            "Under normal conditions, Earth's atmosphere is composed of seventy-eight percent nitrogen and twenty-one percent oxygen. "
            "These gas molecules are constantly vibrating and colliding at five hundred meters per second, creating fluid air that you can push through and breathe. "
            "When time halts, their kinetic velocity drops to absolute zero. "
            "The air around you instantly crystallizes into an impenetrable, rigid lattice. Every single cubic centimeter of empty space becomes as hard as solid quartz glass. "
            "Taking a step forward requires you to shatter millions of immovable molecules with your bare skin, cutting your hands and face. "
            "Worse still: you cannot breathe. "
            "To inhale, your diaphragm must expand, creating a low-pressure vacuum inside your chest so air can rush in. "
            "But frozen air cannot flow. No matter how desperately you gasp, not a single molecule of oxygen will enter your trachea. "
            "You begin to suffocate in broad daylight. "
            "And then comes the cold. Temperature is literally the measure of molecular motion. Zero motion means the entire universe plunges toward Absolute Zero—"
            "minus two hundred and seventy-three point one five degrees Celsius. Frostbite tears through your extremities within seconds."
        )
    },
    {
        "id": "ch7_the_watchers",
        "title": "Chapter 7: The Watchers",
        "text": (
            "Desperate and gasping for breath, you snap your fingers and unfreeze the world, collapsing onto the pavement, your lungs screaming for oxygen. "
            "You swear you will never use the power again. But it is already too late. You forgot about the machines. "
            "Deep underground, atomic clocks at the International Bureau of Weights and Measures monitor time using the steady vibration of cesium atoms. "
            "Above the atmosphere, thirty-one GPS satellites calculate positions based on nanosecond-precise signals. "
            "Every time you paused the world, the internal clocks of your local region desynchronized from the global atomic grid. "
            "Four minutes missing here. Six minutes missing there. "
            "Deep within the National Reconnaissance Office, automated alarm systems triggered. Chronological anomalies were mapped. "
            "Telemetry data pinpointed the exact epicentre of every single time freeze: a four-block radius around your apartment. "
            "As you look out your window, three matte-black surveillance vans pull up to the curb. "
            "Men in tailored tactical suits step out, carrying directional field sensors. "
            "They aren't looking for a criminal. They are hunting the anomaly that broke the flow of time."
        )
    },
    {
        "id": "ch8_the_void",
        "title": "Chapter 8: The Eternal Void",
        "text": (
            "Heavy footsteps echo up your stairwell. Your little sister is standing in the kitchen, terrified by the banging on the door. "
            "Open up! Federal authorities! "
            "The lock splinters. The door kicks wide open. Armed agents flood the doorway, weapons drawn. "
            "There is only one way out. "
            "You reach into your pocket, grab the time-dilation trigger, and slam your thumb down. "
            "Snap. "
            "The muzzle flash of a rifle freezes into a blooming cone of fiery orange crystal. The agents freeze mid-yell. "
            "But as you hit the switch, a sickening mechanical crunch rings out. The circuit sparks, smoking in your palm. "
            "The trigger mechanism snaps in half. "
            "The world freezes... but this time, the unfreeze circuit is dead. "
            "Silence. Absolute, terrifying stillness. "
            "The light begins to drain away into pitch black. The air around you solidifies into ice. "
            "Your sister stands five feet away, an immovable statue, her eyes wide with fear that will never fade. "
            "You are trapped. "
            "No sound will ever travel through this air again. No tomorrow will ever arrive. "
            "You have eternity, but nobody to share it with. "
            "So the next time you wish you could pause time... be careful what you wish for. "
            "Because in a universe frozen forever, who is going to unfreeze you?"
        )
    }
]

out_dir = pathlib.Path("D:/AI-Cartoons/what-if-studio/src/episodes/pause-10m")
out_dir.mkdir(parents=True, exist_ok=True)
pub_dir = pathlib.Path("D:/AI-Cartoons/what-if-studio/public/pause-10m")
pub_dir.mkdir(parents=True, exist_ok=True)

# Save chapter structure
with open(out_dir / "chapters.json", "w", encoding="utf-8") as f:
    json.dump(CHAPTERS, f, indent=2)

print("Saved chapters.json. Starting 10-minute voice generation via Edge-TTS...")

async def generate():
    voice = "en-US-ChristopherNeural"
    total_audio = bytearray()
    chapter_timings = []
    current_time = 0.0
    
    for i, ch in enumerate(CHAPTERS):
        print(f"Generating {ch['title']}...")
        comm = edge_tts.Communicate(ch['text'], voice, rate="+0%", pitch="+0Hz")
        ch_audio = bytearray()
        async for chunk in comm.stream():
            if chunk['type'] == 'audio':
                ch_audio.extend(chunk['data'])
        
        # Save individual chapter audio for reference
        ch_file = pub_dir / f"ch_{i+1}.mp3"
        ch_file.write_bytes(ch_audio)
        
        # We also append to master
        total_audio.extend(ch_audio)
        print(f"Chapter {i+1} audio: {len(ch_audio)} bytes")

    master_mp3 = pub_dir / "voice_10m.mp3"
    master_mp3.write_bytes(total_audio)
    print(f"Master 10-minute MP3 written: {len(total_audio)} bytes")

asyncio.run(generate())


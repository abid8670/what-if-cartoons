import asyncio, json, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-ChristopherNeural"
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\no-water")
PUB_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "The Instant Disappearance",
        "text": (
            "It is a scorching hot Tuesday morning. Pip turns on his kitchen faucet to pour a tall glass of ice water. "
            "But before the liquid even touches the glass, the water stream vanishes in mid-air! Not a single droplet comes out! "
            "Across town, Mo is standing in the shower covered in dry soap, screaming in confusion! "
            "Around the world, people look at their coffee cups, swimming pools, and garden hoses in pure shock. "
            "Every single liquid water molecule on planet Earth has instantly disappeared into thin air: "
            "one point three eight billion cubic kilometers of water, completely wiped off the globe!"
        )
    },
    {
        "id": "ch_2",
        "title": "Minute Five: The Ocean Abyss",
        "text": (
            "Within five minutes, the planetary map changes forever! "
            "Seventy-one percent of the Earth's surface was covered by vast oceans. Now, the Pacific, Atlantic, and Indian Oceans "
            "are transformed into terrifying, miles-deep barren canyons! "
            "Giant cargo container ships, luxury cruise liners, and nuclear submarines plummet thirty-six thousand feet down "
            "to the jagged tectonic rock of the Mariana Trench, snapping their steel hulls in half with deafening thuds! "
            "Millions of whales, sharks, and vibrant coral reefs are left stranded on vast, toxic salt flats. "
            "The ocean floor, hidden in darkness for billions of years, is exposed to open sunlight for the very first time!"
        )
    },
    {
        "id": "ch_3",
        "title": "Hour One: The Volcanic Tectonic Rupture",
        "text": (
            "Things get exponentially worse by hour one. Why? Because water is incredibly heavy! "
            "The world's oceans exerted one point four quintillion metric tons of hydrostatic pressure, pinning down Earth's oceanic crust. "
            "With that colossal weight suddenly lifted, the seabed rebounds upward like a compressed steel spring! "
            "Tectonic plates violently crack open across the Pacific Ring of Fire! "
            "Countless submarine volcanoes and continental fault lines rupture simultaneously, erupting superheated molten lava, "
            "poisonous sulfur clouds, and massive ash plumes directly into the stratosphere! Earth is turning into an active volcanic hellscape!"
        )
    },
    {
        "id": "ch_4",
        "title": "Day One: The Death of Weather",
        "text": (
            "By day one, the entire global climate system completely collapses. "
            "Over ninety-seven percent of all clouds and weather cycles were fueled by ocean evaporation. "
            "With zero water, there are zero clouds, zero rain, and zero humidity anywhere on the planet! "
            "Without white clouds to reflect solar radiation back into space, daytime temperatures skyrocket past sixty degrees Celsius! "
            "Pavement melts, metal cars blister with heat, and the sun bakes the dry land relentlessly. "
            "Then night falls. Without water vapor to trap heat like a blanket, temperatures plunge down to freezing sub-zero! "
            "Earth's atmosphere now swings wildly like the surface of Mercury!"
        )
    },
    {
        "id": "ch_5",
        "title": "Day Three: The Biological Clock",
        "text": (
            "By day three, the human biological countdown runs out. "
            "Your body is sixty percent water, your brain is seventy-five percent water, and your blood is ninety percent water! "
            "Without hydration, Pip and Mo's blood thickens into a sluggish sludge, forcing their hearts to strain violently. "
            "Kidneys shut down, lips crack and bleed, and severe delirium sets in. "
            "Outside, billions of trees, crops, and rainforests dry into brittle kindling. "
            "Global wildfires ignite spontaneously across entire continents, devouring whole forests in firestorms of ash! "
            "Without water, complex animal and plant life cannot survive more than one hundred hours."
        )
    },
    {
        "id": "ch_6",
        "title": "The Red Planet & The Glass of Life",
        "text": (
            "Within a week, planet Earth looks completely unrecognizable: a desolate red desert world wrapped in toxic dust storms, "
            "looking identical to Mars! Pip collapses onto the cracked earth, gasping for breath! "
            "Suddenly, Pip jolts awake in bed! His alarm is buzzing; morning sunlight streams through the bedroom window. "
            "He looks over at his nightstand: a cold, condensation-covered glass of fresh tap water is sitting right there! "
            "Pip grabs the glass with trembling hands, takes a deep, delicious gulp, and smiles in pure gratitude! "
            "Water is not just a drink; it is the single molecule holding Earth's life and sanity together! "
            "If this blew your mind, smash that subscribe button and tap the bell for more weekly animated what-if adventures!"
        )
    }
]

SHORT_SCRIPT = (
    "What if all water on Earth suddenly disappeared? The oceans drop eleven thousand meters, snapping giant cruise ships in half! "
    "Without ocean weight, tectonic plates rupture and volcanic lava floods the planet! "
    "No clouds means sixty-degree heatwaves, and by day three, humanity goes extinct! "
    "Next time you drink water, be grateful! Smash subscribe for more mind-blowing science!"
)

async def generate():
    all_timestamps = {}
    durations = []
    print("=== GENERATING NO WATER CHRISTOPHER NEURAL AUDIOS + TIMESTAMPS ===")
    
    for ch in CHAPTERS:
        out_mp3 = PUB_DIR / f"{ch['id']}.mp3"
        comm = edge_tts.Communicate(ch['text'], VOICE, rate="+3%", boundary="WordBoundary")
        
        words = []
        async for chunk in comm.stream():
            if chunk["type"] == "WordBoundary":
                t = chunk["offset"] / 10_000_000
                words.append({"t": round(t, 2), "word": chunk["text"]})
        
        comm2 = edge_tts.Communicate(ch['text'], VOICE, rate="+3%")
        await comm2.save(str(out_mp3))
        
        dur = float(subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(out_mp3)
        ]).decode().strip())
        
        frames = int(dur * 30) + 15
        durations.append(frames)
        all_timestamps[ch['id']] = words
        print(f"[{ch['id']}] Generated: {dur:.2f}s -> {frames} frames | Words: {len(words)}")
    
    # Short
    short_mp3 = PUB_DIR / "voice_short.mp3"
    comm_s = edge_tts.Communicate(SHORT_SCRIPT, VOICE, rate="+4%", boundary="WordBoundary")
    words_s = []
    async for chunk in comm_s.stream():
        if chunk["type"] == "WordBoundary":
            t = chunk["offset"] / 10_000_000
            words_s.append({"t": round(t, 2), "word": chunk["text"]})
    
    comm_s2 = edge_tts.Communicate(SHORT_SCRIPT, VOICE, rate="+4%")
    await comm_s2.save(str(short_mp3))
    
    dur_s = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(short_mp3)
    ]).decode().strip())
    frames_s = int(dur_s * 30) + 15
    all_timestamps["short"] = words_s
    print(f"[Short] Generated: {dur_s:.2f}s -> {frames_s} frames | Words: {len(words_s)}")
    
    with open(PUB_DIR / "timestamps.json", "w", encoding="utf-8") as f:
        json.dump(all_timestamps, f, indent=2)
    
    print("\n=== NO WATER CHAPTER DURATIONS (FRAMES) ===")
    print(f"WATER_DURATIONS = {durations}")
    print(f"TOTAL FRAMES = {sum(durations)} (~{sum(durations)/30/60:.2f} minutes)")

if __name__ == "__main__":
    asyncio.run(generate())


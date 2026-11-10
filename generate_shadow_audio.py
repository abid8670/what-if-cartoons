import asyncio, json, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-AvaNeural"
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\living-shadow")
PUB_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "The Detached Silhouette",
        "text": (
            "Pip is sitting on his couch, binge-watching cartoons on a Friday night. "
            "He reaches for the TV remote on the coffee table, knocks it over, and it falls onto the rug. "
            "Pip groans, too lazy to bend down. But then, something impossible happens! "
            "The dark silhouette on the wall behind him peels away from the plaster! "
            "A pitch-black shadow hand reaches down across the floor, grabs the remote, and gently places it into Pip's lap! "
            "Pip freezes. He slowly raises his right hand. The shadow doesn't copy him; instead, it crosses its arms, "
            "taps its foot, and winks! Pip screams: his shadow is alive, completely detached, and has a mind of its own!"
        )
    },
    {
        "id": "ch_2",
        "title": "The Ultimate Roommate",
        "text": (
            "Once Pip recovers from the initial shock, he realizes this might be the greatest superpower on planet Earth! "
            "Having a living two-dimensional clone is like having the ultimate personal assistant! "
            "While Pip lounges in bed eating slices of pizza, his autonomous shadow glides across the walls, washing the dirty dishes, "
            "vacuuming the living room carpet, and even solving Pip's impossible advanced calculus homework! "
            "Because shadows have zero physical mass, it never gets tired, never sweats, and never asks for a salary! "
            "Pip thinks he has cracked the secret code to human laziness. But having a sentient shadow comes with a terrifying catch!"
        )
    },
    {
        "id": "ch_3",
        "title": "Multiple Lights & The Darkness Paradox",
        "text": (
            "Things spiral out of control the moment Pip flips on a second desk lamp. "
            "In basic optics, two light sources cast two distinct shadows. "
            "Suddenly, Pip's single helper splits into two separate sentient shadows! "
            "And they do not get along! The two dark figures start brawling on the wallpaper, wrestling over the TV remote control! "
            "In sheer panic, Pip lunges for the light switch and cuts the power. Total darkness floods the room! "
            "Pip sighs in relief: no light means no shadow, right? Wrong! "
            "In absolute darkness, the shadow doesn't disappear; it merges with the entire pitch-black room! "
            "Suddenly, icy cold hands tap Pip right on the back of his neck!"
        )
    },
    {
        "id": "ch_4",
        "title": "The Shadow Rebellion",
        "text": (
            "When Pip flicks the lights back on, his shadow is done taking orders. The rebellion has begun! "
            "Pip tries to walk left toward the kitchen, but his rogue shadow plants its feet and pulls him violently to the right! "
            "Pip tries to wave politely at his neighbor outside the window, but the shadow raises both arms and mocks him! "
            "Even worse, a 2D shadow isn't bound by 3D human anatomy. "
            "It can stretch fifty feet tall, flatten itself to slip under locked bedroom doors, and infiltrate any secret safe in the city! "
            "Pip realizes he is no longer the master: he has become the biological hostage of his own silhouette!"
        )
    },
    {
        "id": "ch_5",
        "title": "The Physics Nightmare: The Photon Vacuum",
        "text": (
            "Now let's examine the terrifying physics of a living shadow! "
            "In real science, a shadow is just an absence of light; it has no energy, no mass, and cannot push matter. "
            "For a shadow to touch objects, grab remotes, and move physical mass, it must actively absorb incoming photons! "
            "That means Pip's shadow acts like a localized microscopic black hole, vacuuming every speck of thermal radiation in the room! "
            "Within minutes, the bedroom temperature plunges below negative forty degrees! "
            "Pip's breath turns into white clouds of vapor, thick frost crystallizes across the windows, and his fingers go numb with hypothermia! "
            "His rogue shadow is literally freezing him to death!"
        )
    },
    {
        "id": "ch_6",
        "title": "The Spotlight Trap & Peace",
        "text": (
            "Shivering and fighting for his life, Pip comes up with a brilliant scientific counterattack! "
            "He wheels in four high-powered ten-thousand-lumen stadium floodlights, creating a seamless three-hundred-sixty-degree omnidirectional beam! "
            "When light floods an object equally from every single angle, there is zero darkness and zero cast shadows! "
            "Trapped inside the blinding halo, the rogue shadow shrinks down, shivering, with nowhere to hide! "
            "Pip looks down and realizes: without him, the shadow cannot exist. And without his shadow, Pip is incomplete! "
            "Pip dims three of the spotlights, extends his hand, and the shadow reconnects to his boots, high-fiving him! "
            "Could you handle a living shadow? Smash that subscribe button and tap the bell for more weekly animated what-if adventures!"
        )
    }
]

SHORT_SCRIPT = (
    "What if your shadow suddenly moved on its own? At first, it's the ultimate roommate: doing your chores and solving your homework! "
    "But turn on two lights, and two rogue shadows start fighting! Even worse, to touch matter, a shadow would have to absorb all light like a black hole, "
    "freezing your room to negative forty degrees! Smash subscribe for more mind-bending what-ifs!"
)

async def generate():
    all_timestamps = {}
    durations = []
    print("=== GENERATING LIVING SHADOW AVA NEURAL AUDIOS + TIMESTAMPS ===")
    
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
    
    print("\n=== LIVING SHADOW CHAPTER DURATIONS (FRAMES) ===")
    print(f"SHADOW_DURATIONS = {durations}")
    print(f"TOTAL FRAMES = {sum(durations)} (~{sum(durations)/30/60:.2f} minutes)")

if __name__ == "__main__":
    asyncio.run(generate())

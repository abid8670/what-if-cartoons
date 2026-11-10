import asyncio, json, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-AvaNeural"
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\quiet-room")
PUB_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "The Ten Thousand Dollar Bet",
        "text": (
            "Deep inside Orfield Laboratories in Minnesota sits the quietest place on planet Earth: "
            "an anechoic chamber so silent, its background noise measures negative 20.6 decibels! "
            "That is far below the threshold of human hearing. Pip offers Mo a ten thousand dollar bet: "
            "just stay inside this room for sixty minutes with the lights off! Mo laughs. "
            "Sixty minutes of peace and quiet? Easiest money in the world! He steps through the bank-vault "
            "steel door onto the suspended wire mesh floor. The vault door slams shut with a terrifying clang. "
            "Absolute silence."
        )
    },
    {
        "id": "ch_2",
        "title": "Minute Five: Silence Turns Loud",
        "text": (
            "For the first two minutes, Mo kicks back and relaxes. But in a normal bedroom, background "
            "ambient noise is around thirty decibels. In this room, zero sound waves bounce off the three-foot "
            "fiberglass foam wedges. Sensing zero sound, your brain panics! The inner ear has an automatic "
            "gain control system. When there is nothing to hear, the auditory cortex turns your microphone "
            "sensitivity to absolute maximum! Suddenly, Mo hears a high-pitched metallic ringing: the sound "
            "of his own nervous system firing!"
        )
    },
    {
        "id": "ch_3",
        "title": "Minute Fifteen: The Blood Symphony",
        "text": (
            "At fifteen minutes, the silence is deafening. Mo begins hearing a rhythmic, violent thud. "
            "Thump, thump, thump! It is his own heart, beating like a war drum in his chest! Next comes a "
            "rhythmic whooshing sound: the pressurized surge of blood rushing through his carotid arteries "
            "straight into his brain. Mo swallows, and it sounds like a thunderstorm in his skull. Even "
            "rotating his eyeballs creates a scraping friction rasp! Your body is not silent; you were just "
            "too distracted by the world to hear it."
        )
    },
    {
        "id": "ch_4",
        "title": "Minute Thirty: Balance & Spatial Chaos",
        "text": (
            "By minute thirty, things turn terrifying. Humans do not just see the world; we subconsciously "
            "echolocate our surroundings through ambient sound reflections. In an anechoic chamber, zero "
            "sound bounces back. Without acoustic feedback, your vestibular system gets completely scrambled. "
            "Mo tries to stand up, but intense vertigo strikes! His knees buckle, the room feels like it is "
            "tilting upside down, and he collapses onto the metal mesh floor. You cannot even stand up in total silence!"
        )
    },
    {
        "id": "ch_5",
        "title": "Minute Forty-Five: Auditory Hallucinations",
        "text": (
            "At forty-five minutes, the sensory deprivation breaks the mind. Deprived of outside stimulation, "
            "the brain becomes desperate for input, so it starts inventing sound out of thin air! Mo hears "
            "phantom whispering, buzzing bumblebees, and distant eerie circus music! His pupils dilate in horror. "
            "His heart races at one hundred and forty beats per minute, hammering his eardrums. Sweat drips from "
            "his forehead as he panics and rushes to the vault door, pounding wildly: let me out!"
        )
    },
    {
        "id": "ch_6",
        "title": "The Escape & The Sound of Life",
        "text": (
            "The vault door swings open! Sweet ambient air and soft fluorescent light flood the chamber. "
            "Mo collapses onto the carpet outside, gasping for breath, clutching his ears! Nobody has ever lasted "
            "longer than forty-five minutes in the dark. We did not evolve for absolute silence; sound is what "
            "anchors human sanity to reality. Next time you complain about traffic noise, be grateful: silence is far "
            "more terrifying! If this blew your mind, smash that subscribe button and tap the bell for more weekly "
            "animated what-if adventures!"
        )
    }
]

SHORT_SCRIPT = (
    "What happens if you sit in the world's quietest room for one hour? At negative twenty decibels, "
    "your brain turns ear sensitivity to maximum. You hear your blood whooshing, your heartbeat like a "
    "sledgehammer, and by minute forty-five, you hallucinate phantom voices! Subscribe for more!"
)

async def generate():
    all_timestamps = {}
    durations = []
    print("=== GENERATING QUIET ROOM AVA NEURAL AUDIOS + TIMESTAMPS ===")
    
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
    
    print("\n=== QUIET ROOM CHAPTER DURATIONS (FRAMES) ===")
    print(f"QUIET_DURATIONS = {durations}")
    print(f"TOTAL FRAMES = {sum(durations)} (~{sum(durations)/30/60:.2f} minutes)")

if __name__ == "__main__":
    asyncio.run(generate())

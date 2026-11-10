import asyncio, json, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-ChristopherNeural"
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\bed-rest")
PUB_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "The Dream Job",
        "text": (
            "Imagine getting paid nineteen thousand dollars just to stay in bed for thirty days straight. "
            "No work. No alarm clocks. Just endless movies, video games, and sleeping. "
            "It sounds like pure paradise, right? Well, this wasn't a fantasy, NASA actually paid healthy "
            "volunteers nineteen thousand dollars to test how human bodies survive long space missions. "
            "Pip jumped at the offer, thinking he had found the easiest money on Earth. On Day One, Pip snuggled "
            "into his soft pillows, ate pizza in bed, and watched movies on a ceiling projector. "
            "But there was one catch: his bed was tilted downward by negative six degrees. "
            "And within forty-eight hours, biology struck back."
        )
    },
    {
        "id": "ch_2",
        "title": "The Silent Melt",
        "text": (
            "By Day Three, Pip's body made a terrifying discovery: without walking or standing, muscles are useless baggage. "
            "Your body begins consuming its own muscle fibers, losing up to one percent of muscle mass every single day! "
            "Even worse, your bones stop absorbing minerals. Without gravity pushing on your skeleton, your bones begin "
            "leaching calcium directly into your bloodstream. All that excess calcium floods your kidneys, creating razor-sharp "
            "kidney stones. Meanwhile, because Pip's head was tilted down, blood pooled in his upper body. His face puffed up "
            "like a bloated fish, his nose clogged completely, and food tasted like dry cardboard!"
        )
    },
    {
        "id": "ch_3",
        "title": "The Brain Glitch",
        "text": (
            "Entering week two, the psychological nightmare begins. Without physical exhaustion, Pip's natural sleep cycle shattered. "
            "At three AM, he was staring with wide, bloodshot eyes at the monotonous ceiling fan. "
            "Because your heart no longer has to pump blood upwards against gravity, it gets lazy and physically shrinks by eight percent! "
            "Your total blood volume drops by twenty percent, making blood vessels narrow. Pip's digestion ground to a painful halt, "
            "leaving him feeling bloated, exhausted, and trapped in an eighty-year-old body."
        )
    },
    {
        "id": "ch_4",
        "title": "The Pressure Prison",
        "text": (
            "By Day Twenty, simple existence became torture. Cobwebs gathered in the corners of the room. "
            "Constant pressure on Pip's hips and tailbone restricted blood flow, developing painful red bedsores. "
            "When scientist Mo walked in with a clipboard, Pip begged with tears in his eyes: "
            "Please, let me just touch my toe to the floor! But Mo shook his head sternly: Stay down, Pip! "
            "With zero exercise and sensory deprivation, Pip's legs had completely atrophied into limp, rubbery spaghetti noodles."
        )
    },
    {
        "id": "ch_5",
        "title": "Day 30: The First Step",
        "text": (
            "Finally, Day Thirty arrived! Confetti cannons fired, and NASA doctors surrounded the bed. "
            "Pip threw off his blanket, smiling triumphantly: Finally, freedom! His bare feet touched the cold hospital floor. "
            "Pip leaned forward and tried to stand up. And that is when disaster struck! "
            "The second Pip stood upright, gravity violently pulled all the blood from his brain down into his feet! "
            "His vision went completely pitch black. His knees buckled like cooked noodles, and Pip collapsed in a heap on the floor! "
            "His legs literally forgot how to hold his own weight!"
        )
    },
    {
        "id": "ch_6",
        "title": "The Recovery & Outro",
        "text": (
            "Pip spent the next sixty days in painful physical therapy just to re-learn how to walk. "
            "Gravity might feel heavy, but it is the invisible gym that keeps our hearts pumping, bones strong, and bodies alive! "
            "What is the longest you have ever stayed in bed? Tell us in the comments! "
            "If you enjoyed this thought experiment, hit that Subscribe button right now and ring the notification bell "
            "for more weekly animated cartoons!"
        )
    }
]

SHORT_SCRIPT = (
    "What if you never left your bed for thirty days? NASA paid nineteen thousand dollars to test this! "
    "By Day Three, your bones dissolve into kidney stones. By Day Thirty, you stand up... and instantly collapse! "
    "Subscribe for more!"
)

async def generate():
    all_timestamps = {}
    total_dur = 0
    print("=== GENERATING BED-REST CHAPTER AUDIOS + TIMESTAMPS ===")
    
    for ch in CHAPTERS:
        out_mp3 = PUB_DIR / f"{ch['id']}.mp3"
        comm = edge_tts.Communicate(ch['text'], VOICE, rate="+3%", boundary="WordBoundary")
        
        words = []
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                # writing stream chunks handled by communicate save or manual
                pass
            elif chunk["type"] == "WordBoundary":
                t = chunk["offset"] / 10_000_000
                words.append({"t": round(t, 2), "word": chunk["text"]})
        
        # Save audio file
        comm2 = edge_tts.Communicate(ch['text'], VOICE, rate="+3%")
        await comm2.save(str(out_mp3))
        
        dur = float(subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=noprint_wrappers=1:nokey=1", str(out_mp3)
        ]).decode().strip())
        
        total_dur += dur
        all_timestamps[ch['id']] = {
            "title": ch['title'],
            "duration": dur,
            "words": words
        }
        print(f"Generated {ch['id']} ({ch['title']}): {dur:.2f}s, {len(words)} word timestamps")
        
    # Save timestamps JSON
    ts_file = PUB_DIR / "timestamps.json"
    with open(ts_file, "w", encoding="utf-8") as f:
        json.dump(all_timestamps, f, indent=2)
    print(f"Saved timestamps to {ts_file}")
    print(f"Total Main Video Audio Duration: {total_dur:.2f}s ({total_dur/60:.2f} minutes)")
    
    # Generate 14-Second Short Audio
    out_short = PUB_DIR / "voice_short.mp3"
    comm_s = edge_tts.Communicate(SHORT_SCRIPT, VOICE, rate="+12%")
    await comm_s.save(str(out_short))
    dur_s = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(out_short)
    ]).decode().strip())
    print(f"Generated Short Audio: {dur_s:.2f}s (Target: ~13s voice + 1s outro = 14s)")

if __name__ == "__main__":
    asyncio.run(generate())


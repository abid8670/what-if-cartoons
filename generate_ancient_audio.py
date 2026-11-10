import asyncio, json, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

VOICE = "en-US-ChristopherNeural"
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\ancient-pleasure")
PUB_DIR.mkdir(parents=True, exist_ok=True)

CHAPTERS = [
    {
        "id": "ch_1",
        "title": "The Prehistoric Myth",
        "text": (
            "When you picture the Stone Age, you probably imagine cold, shivering humans running for their lives "
            "from massive saber-toothed tigers, surviving on raw dirt and pure terror. But anthropology reveals "
            "a shocking secret. Prehistoric humans actually worked LESS than you do today! While you slave away "
            "forty to sixty hours a week at an office desk, hunter-gatherers secured all their food in just fifteen "
            "to twenty hours a week! That left them with four to six hours of pure, uninterrupted free time every "
            "single day. No smartphones, no electricity, no Netflix. So... what on earth did they do for pleasure?"
        )
    },
    {
        "id": "ch_2",
        "title": "The World's First Booze",
        "text": (
            "First up: getting buzzed! Humans did not invent alcohol in a lab, nature handed it to them on a silver platter. "
            "Tens of thousands of years ago, prehistoric foragers stumbled upon wild berries and rotting tree fruit "
            "that had naturally fermented in the sun. Curious cavemen took a bite, and suddenly the cave walls were "
            "spinning in the best way possible! In China, archaeologists discovered nine-thousand-year-old pottery jars "
            "at Jiahu packed with residue of the world’s oldest known cocktail: fermented rice, wild honey, and hawthorn fruit. "
            "And at the eleven-thousand-year-old temple of Gobekli Tepe, researchers uncovered massive stone vats capable of "
            "brewing forty gallons of primitive beer! Ancient humans were throwing wild prehistoric block parties!"
        )
    },
    {
        "id": "ch_3",
        "title": "Stone Age Romance",
        "text": (
            "Now, let us talk about the birds, the bees, and the cave bears. Without birth control or dating apps, "
            "prehistoric romance was deeply primal and surprisingly creative! Anthropologists found that ancient humans "
            "used all kinds of natural aphrodisiacs, from wild ginger and crushed beetle shells to rare mountain herbs. "
            "Even more fascinating: the world’s oldest musical instrument ever found is a forty-thousand-year-old flute "
            "carved from the hollow wing bone of a giant vulture, discovered in Hohle Fels cave in Germany! "
            "Yes, ancient cavemen literally played romantic serenades by the campfire to seduce potential partners. "
            "And sculpted Venus figurines, shell necklaces, and bright red ochre body paint prove that looking attractive "
            "and feeling desirable has been hardwired into human psychology for hundreds of thousands of years!"
        )
    },
    {
        "id": "ch_4",
        "title": "Prehistoric Gaming & Gambling",
        "text": (
            "Long before PlayStation or poker, ancient humans were hopelessly addicted to games. Archaeologists have dug "
            "up five-thousand-year-old animal knucklebones, known as astragaloi, from prehistoric sites worldwide. "
            "Because these ankle bones have four distinct sides when tossed, ancient tribes used them as the earliest dice, "
            "betting their precious flint arrowheads, animal pelts, and dried meat on lucky rolls! "
            "In the ancient city of Ur, royals played the legendary Royal Game of Ur on gorgeous mosaic boards, "
            "a high-stakes strategy game so addictive that ancient cuneiform tablets reveal players betting their family "
            "fortunes! When the sun went down, ancient humans were arguing over who cheated at dice!"
        )
    },
    {
        "id": "ch_5",
        "title": "Cave Cinema & Shadow Stories",
        "text": (
            "Perhaps the greatest pleasure of all was prehistoric cinema. Deep inside dark underground caverns like Chauvet "
            "and Lascaux, artists painted galloping bison and lions with multiple overlapping legs. Why? "
            "Because when you hold a flickering torch near the wall, the dancing shadows create an optical illusion, "
            "making the painted beasts appear to sprint across the rock! Around the campfire, master storytellers would "
            "perform tribal legends, mimicking beast roars and spirit voices while the entire tribe sat mesmerized. "
            "It was human imagination coming alive, lighting up dopamine pathways in the brain and binding the community "
            "together into an unbreakable family."
        )
    },
    {
        "id": "ch_6",
        "title": "The Power of Joy & Outro",
        "text": (
            "Evolutionary biologists believe pleasure was not a luxury, it was a survival necessity! "
            "The joy of sharing food, laughing around a fire, making music, and enjoying intimate connection triggered "
            "oxytocin and serotonin, which kept tribes bonded and stopped them from fighting during brutal ice-age winters. "
            "In a harsh world where a broken tooth could be fatal, human joy was the ultimate shield. "
            "Next time you grab a drink with friends or play a video game, remember: you are carrying on a fifty-thousand-year-old "
            "human tradition of chasing pleasure! What is your favorite way to relax? Tell us in the comments! "
            "If you enjoyed this thought experiment, smash that Subscribe button right now and ring the notification bell "
            "for more weekly animated cartoons!"
        )
    }
]

SHORT_SCRIPT = (
    "What did ancient humans actually do for pleasure? They worked less than you, spent four hours a day partying "
    "with fermented berry booze, played bone flutes, and gambled with animal bones! Subscribe for the full wild story!"
)

async def generate():
    all_timestamps = {}
    total_dur = 0
    print("=== GENERATING ANCIENT PLEASURE CHAPTER AUDIOS + TIMESTAMPS ===")
    
    for ch in CHAPTERS:
        out_mp3 = PUB_DIR / f"{ch['id']}.mp3"
        comm = edge_tts.Communicate(ch['text'], VOICE, rate="+2%", boundary="WordBoundary")
        
        words = []
        async for chunk in comm.stream():
            if chunk["type"] == "audio":
                pass
            elif chunk["type"] == "WordBoundary":
                t = chunk["offset"] / 10_000_000
                words.append({"t": round(t, 2), "word": chunk["text"]})
        
        comm2 = edge_tts.Communicate(ch['text'], VOICE, rate="+2%")
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
        
    ts_file = PUB_DIR / "timestamps.json"
    with open(ts_file, "w", encoding="utf-8") as f:
        json.dump(all_timestamps, f, indent=2)
    print(f"Saved timestamps to {ts_file}")
    print(f"Total Main Video Audio Duration: {total_dur:.2f}s ({total_dur/60:.2f} minutes)")
    
    # 14-Second Short Audio
    out_short = PUB_DIR / "voice_short.mp3"
    comm_s = edge_tts.Communicate(SHORT_SCRIPT, VOICE, rate="+10%")
    await comm_s.save(str(out_short))
    dur_s = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(out_short)
    ]).decode().strip())
    print(f"Generated Short Audio: {dur_s:.2f}s")

if __name__ == "__main__":
    asyncio.run(generate())


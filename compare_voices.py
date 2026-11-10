import asyncio, os, pathlib, subprocess, sys
import edge_tts

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063\voice_comparison")
OUT_DIR.mkdir(parents=True, exist_ok=True)

SAMPLE_TEXT = (
    "What if your shadow suddenly moved on its own? "
    "At first, it seems like the ultimate superpower: an autonomous 2D roommate that washes the dishes, "
    "vacuums the house, and solves your hardest homework with zero physical fatigue!"
)

async def generate():
    # 1. Christopher (Original Male Voice)
    p_chris_raw = OUT_DIR / "chris_raw.mp3"
    comm_c = edge_tts.Communicate(SAMPLE_TEXT, "en-US-ChristopherNeural", rate="+3%")
    await comm_c.save(str(p_chris_raw))

    # 2. Ava (Female Voice)
    p_ava_raw = OUT_DIR / "ava_raw.mp3"
    comm_a = edge_tts.Communicate(SAMPLE_TEXT, "en-US-AvaNeural", rate="+3%")
    await comm_a.save(str(p_ava_raw))

    # Master Christopher with full YouTube Vocal Chain:
    # Warmth (+2dB at 160Hz), Presence (+3dB at 3.5kHz), Compressor, and Limiter
    p_chris_boosted = OUT_DIR / "chris_boosted.mp3"
    cmd_cb = [
        "ffmpeg", "-y", "-i", str(p_chris_raw),
        "-af", "bass=g=2:f=160,treble=g=3:f=3500,acompressor=threshold=-18dB:ratio=3.5:attack=15:release=120:makeup=4,loudnorm=I=-14.0:TP=-1.5:LRA=7.0",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(p_chris_boosted)
    ]
    subprocess.run(cmd_cb, check=True)

    # Master Ava with full YouTube Vocal Chain:
    # Extra Low-End Warmth (+4dB at 200Hz to prevent thinness), Clarity (+3dB at 4kHz), Compressor, and Limiter
    p_ava_boosted = OUT_DIR / "ava_boosted.mp3"
    cmd_ab = [
        "ffmpeg", "-y", "-i", str(p_ava_raw),
        "-af", "bass=g=4:f=200,treble=g=3:f=4000,acompressor=threshold=-18dB:ratio=3.5:attack=15:release=120:makeup=5,loudnorm=I=-14.0:TP=-1.5:LRA=7.0",
        "-c:a", "libmp3lame", "-b:a", "192k",
        str(p_ava_boosted)
    ]
    subprocess.run(cmd_ab, check=True)

    print("=== VOICE GENERATION & BOOST COMPLETE ===")
    for f in [p_chris_raw, p_chris_boosted, p_ava_raw, p_ava_boosted]:
        # get volume
        res = subprocess.run([
            "ffmpeg", "-i", str(f), "-af", "volumedetect", "-f", "null", "-"
        ], stderr=subprocess.PIPE, text=True)
        mean_v = [l for l in res.stderr.splitlines() if "mean_volume" in l]
        max_v = [l for l in res.stderr.splitlines() if "max_volume" in l]
        print(f"{f.name:20} -> {mean_v[0].strip() if mean_v else ''} | {max_v[0].strip() if max_v else ''}")

if __name__ == "__main__":
    asyncio.run(generate())

import subprocess, pathlib

studio_dir = pathlib.Path("D:/AI-Cartoons/what-if-studio")
pub_dir = studio_dir / "public/pause-10m"
sfx_lib = studio_dir / "library/sfx"
bgm = sfx_lib / "music-4cdabe20.mp3"

# SFX hits per chapter:
CHAPTER_SFX = {
    1: [("0.5", "clink-169430e3.mp3"), ("12.0", "clock_back-d5e3cec1.mp3"), ("25.0", "mug_slide-cdb7a6d6.mp3")],
    2: [("28.0", "clock_back-d5e3cec1.mp3"), ("45.0", "paper_land-e0d75d32.mp3"), ("75.0", "ding-a322cf81.mp3")],
    3: [("15.0", "clock_back-d5e3cec1.mp3"), ("40.0", "copy_click-6f20900a.mp3"), ("60.0", "sparkle-595dbfb7.mp3")],
    4: [("22.0", "tumble-d03ef997.mp3"), ("25.0", "clock_back-d5e3cec1.mp3"), ("60.0", "catch-ffb439cd.mp3"), ("70.0", "title_boom-91f4f23e.mp3")],
    5: [("20.0", "power_down-46ef6bed.mp3"), ("40.0", "glitch-4bc7163d.mp3"), ("65.0", "drone_hit-75f05067.mp3")],
    6: [("15.0", "crack-3cbd3c57.mp3"), ("45.0", "gasp-372b408b.mp3"), ("65.0", "drone_hit-75f05067.mp3")],
    7: [("20.0", "counter_tick-37ca9370.mp3"), ("50.0", "drone_hit-75f05067.mp3")],
    8: [("10.0", "shatter-cde6184c.mp3"), ("22.0", "clock_back-d5e3cec1.mp3"), ("35.0", "power_down-46ef6bed.mp3"), ("60.0", "drone_hit-75f05067.mp3")]
}

for i in range(1, 9):
    voice_file = pub_dir / f"ch_{i}.mp3"
    out_audio = pub_dir / f"ch_{i}_mixed.wav"
    
    # Get voice duration
    dur_str = subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(voice_file)
    ]).decode().strip()
    dur = float(dur_str)
    
    # Mix voice + looped bgm (ducked to 0.12)
    # Using ffmpeg complex filter
    filter_complex = f"[1:a]aloop=loop=-1:size=2e+09,volume=0.12,atrim=0:{dur+1}[music];[0:a]volume=1.0[voice];[voice][music]amix=inputs=2:duration=first[out]"
    
    cmd = [
        "ffmpeg", "-y", "-i", str(voice_file), "-i", str(bgm),
        "-filter_complex", filter_complex, "-map", "[out]",
        "-ar", "44100", "-ac", "2", str(out_audio)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Chapter {i} audio mixed ({dur:.1f}s) -> {out_audio.name}")

print("All 8 chapters mixed successfully!")


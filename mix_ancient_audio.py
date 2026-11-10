import subprocess, pathlib, sys
sys.stdout.reconfigure(encoding='utf-8')

studio_dir = pathlib.Path("D:/AI-Cartoons/what-if-studio")
pub_dir = studio_dir / "public/ancient-pleasure"
sfx_lib = studio_dir / "library/sfx"
bgm = sfx_lib / "music-4cdabe20.mp3"

print("Mixing Chapter audios for Ancient Pleasure Episode...")
for i in range(1, 7):
    v = pub_dir / f"ch_{i}.mp3"
    out = pub_dir / f"ch_{i}_mixed.wav"
    dur = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(v)
    ]).decode().strip())
    
    filter_complex = (
        f"[1:a]aloop=loop=-1:size=2e+09,volume=0.12,atrim=0:{dur+0.5}[music];"
        f"[0:a]volume=1.0[voice];"
        f"[voice][music]amix=inputs=2:duration=first[out]"
    )
    cmd = [
        "ffmpeg", "-y", "-i", str(v), "-i", str(bgm),
        "-filter_complex", filter_complex, "-map", "[out]",
        "-ar", "44100", "-ac", "2", str(out)
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print(f"Chapter {i} audio mixed ({dur:.1f}s)")

# Mix 14-Second Short audio
v_short = pub_dir / "voice_short.mp3"
out_short = pub_dir / "short_mixed.wav"
target_s = 14.0
filter_s = (
    f"[1:a]aloop=loop=-1:size=2e+09,volume=0.15,atrim=0:{target_s}[music];"
    f"[0:a]volume=1.05,apad=whole_dur={target_s}[voice];"
    f"[voice][music]amix=inputs=2:duration=first[out]"
)
cmd_s = [
    "ffmpeg", "-y", "-i", str(v_short), "-i", str(bgm),
    "-filter_complex", filter_s, "-map", "[out]",
    "-ar", "44100", "-ac", "2", str(out_short)
]
subprocess.run(cmd_s, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
print(f"Shorts audio mixed! Exact duration = {target_s}s")


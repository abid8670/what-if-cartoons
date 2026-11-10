import json, os, pathlib, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
SFX_DIR = STUDIO / "library" / "sfx"
PUB_DIR = STUDIO / "public" / "quiet-room"

# Generate specialized synthetic sound elements
SYNTH_DIR = PUB_DIR / "synth"
SYNTH_DIR.mkdir(parents=True, exist_ok=True)

# 1. Heartbeat tone (deep 55Hz low pulse)
heartbeat_wav = SYNTH_DIR / "heartbeat.wav"
if not heartbeat_wav.exists():
    cmd_hb = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=f=55:d=0.25,adelay=0|250,amix=inputs=1,aloop=loop=-1:size=24000",
        "-t", "40", "-c:a", "pcm_s16le", str(heartbeat_wav)
    ]
    subprocess.run(cmd_hb, check=True)

# 2. Fast racing heartbeat (140 BPM)
heartbeat_fast_wav = SYNTH_DIR / "heartbeat_fast.wav"
if not heartbeat_fast_wav.exists():
    cmd_hbf = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=f=65:d=0.15,adelay=0|180,amix=inputs=1,aloop=loop=-1:size=15000",
        "-t", "25", "-c:a", "pcm_s16le", str(heartbeat_fast_wav)
    ]
    subprocess.run(cmd_hbf, check=True)

# 3. Tinnitus 4000 Hz pure sine ringing
tinnitus_wav = SYNTH_DIR / "tinnitus.wav"
if not tinnitus_wav.exists():
    cmd_tin = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=f=4000:d=10",
        "-af", "afade=t=in:ss=0:d=2.0,afade=t=out:st=8:d=2.0",
        "-c:a", "pcm_s16le", str(tinnitus_wav)
    ]
    subprocess.run(cmd_tin, check=True)

BGM = SFX_DIR / "music-4cdabe20.mp3"

CHAPTER_SFX = {
    "ch_1": [
        (SFX_DIR / "room_tone-e711a45f.mp3", 0, 0.15),
        (SFX_DIR / "ding-a322cf81.mp3", 12000, 0.35),
        (SFX_DIR / "big_step-3a4b1795.mp3", 23000, 0.4),
        (SFX_DIR / "drone_hit-75f05067.mp3", 29500, 0.5),
        (SFX_DIR / "switch_off-9588c15a.mp3", 29800, 0.45),
        (SFX_DIR / "title_boom-91f4f23e.mp3", 32000, 0.35),
    ],
    "ch_2": [
        (SFX_DIR / "counter_tick-37ca9370.mp3", 500, 0.3),
        (SFX_DIR / "buzzer-0dc58156.mp3", 14000, 0.25),
        (SFX_DIR / "glitch-4bc7163d.mp3", 20000, 0.3),
        (tinnitus_wav, 24000, 0.22),
    ],
    "ch_3": [
        (heartbeat_wav, 2000, 0.45),
        (SFX_DIR / "fall_whoosh-07978690.mp3", 12000, 0.35),
        (SFX_DIR / "gulp-c9154a14.mp3", 20000, 0.4),
        (SFX_DIR / "crack-3cbd3c57.mp3", 24000, 0.3),
    ],
    "ch_4": [
        (SFX_DIR / "pop-99ba70e6.mp3", 3000, 0.3),
        (SFX_DIR / "dizzy-46ba6f40.mp3", 15000, 0.35),
        (SFX_DIR / "tumble-d03ef997.mp3", 22000, 0.35),
        (SFX_DIR / "land-c5089052.mp3", 25000, 0.4),
    ],
    "ch_5": [
        (SFX_DIR / "ghost_shimmer-e61fce51.mp3", 2000, 0.35),
        (SFX_DIR / "power_hum-ae629acb.mp3", 12000, 0.3),
        (heartbeat_fast_wav, 16000, 0.5),
        (SFX_DIR / "big_step-3a4b1795.mp3", 24500, 0.5),
        (SFX_DIR / "big_step-3a4b1795.mp3", 25200, 0.5),
        (SFX_DIR / "big_step-3a4b1795.mp3", 25900, 0.5),
        (SFX_DIR / "gasp-372b408b.mp3", 27000, 0.4),
    ],
    "ch_6": [
        (SFX_DIR / "shades-cdedb72d.mp3", 500, 0.4),
        (SFX_DIR / "gasp-372b408b.mp3", 4000, 0.25),
        (SFX_DIR / "room_tone-e711a45f.mp3", 14000, 0.2),
        (SFX_DIR / "ding-a322cf81.mp3", 28000, 0.45),
        (SFX_DIR / "sparkle-595dbfb7.mp3", 28200, 0.45),
    ],
    "short": [
        (SFX_DIR / "drone_hit-75f05067.mp3", 1000, 0.45),
        (tinnitus_wav, 4000, 0.22),
        (heartbeat_wav, 7000, 0.45),
        (SFX_DIR / "ghost_shimmer-e61fce51.mp3", 12000, 0.35),
        (SFX_DIR / "ding-a322cf81.mp3", 15000, 0.45),
    ]
}

def mix_chapter(cid, sfx_list):
    voice_file = PUB_DIR / f"{cid}.mp3" if cid != "short" else PUB_DIR / "voice_short.mp3"
    out_wav = PUB_DIR / f"{cid}_mixed.wav"
    
    # Get voice duration
    dur = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(voice_file)
    ]).decode().strip())
    
    inputs = ["-i", str(voice_file), "-i", str(BGM)]
    # In Quiet Room, music is very quiet/subtle (0.04) to emphasize silence contrast
    filter_parts = ["[0:a]volume=1.0[v]", f"[1:a]aloop=loop=-1:size=2e+06,atrim=0:{dur+0.5},volume=0.04[bgm]"]
    mix_labels = ["[v]", "[bgm]"]
    
    idx = 2
    for sfx_path, delay_ms, vol in sfx_list:
        if sfx_path.exists():
            inputs.extend(["-i", str(sfx_path)])
            lbl = f"sfx{idx}"
            filter_parts.append(f"[{idx}:a]volume={vol},adelay={delay_ms}|{delay_ms}[{lbl}]")
            mix_labels.append(f"[{lbl}]")
            idx += 1
    
    filter_complex = ";".join(filter_parts) + f";{''.join(mix_labels)}amix=inputs={len(mix_labels)}:duration=first:dropout_transition=2[out]"
    
    cmd = [
        "ffmpeg", "-y",
        *inputs,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-c:a", "pcm_s16le",
        str(out_wav)
    ]
    subprocess.run(cmd, check=True)
    print(f"Mixed {cid} -> {out_wav.name} ({dur:.2f}s, {len(sfx_list)} SFX cues)")

print("=== MIXING QUIET ROOM RICH SOUND EFFECTS & BGM ===")
for cid, sfx_list in CHAPTER_SFX.items():
    mix_chapter(cid, sfx_list)
print("=== ALL SFX TRACKS SUCCESSFULLY MIXED ===")

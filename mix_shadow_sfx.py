import json, os, pathlib, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
SFX_DIR = STUDIO / "library" / "sfx"
PUB_DIR = STUDIO / "public" / "living-shadow"

SYNTH_DIR = PUB_DIR / "synth"
SYNTH_DIR.mkdir(parents=True, exist_ok=True)

# 1. Shadow Detachment Whoosh (eerie filtered whoosh)
whoosh_shadow_wav = SYNTH_DIR / "whoosh_shadow.wav"
if not whoosh_shadow_wav.exists():
    cmd_ws = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anoisesrc=d=2.0:c=pink:r=44100:a=0.5,bandpass=f=400:w=200,afade=t=in:ss=0:d=0.5,afade=t=out:st=1.2:d=0.8",
        "-c:a", "pcm_s16le", str(whoosh_shadow_wav)
    ]
    subprocess.run(cmd_ws, check=True)

# 2. Photon Vacuum Drone (deep 40Hz sub-drone)
drone_vacuum_wav = SYNTH_DIR / "drone_vacuum.wav"
if not drone_vacuum_wav.exists():
    cmd_dv = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=f=42:d=30,lowpass=f=120,volume=0.8",
        "-c:a", "pcm_s16le", str(drone_vacuum_wav)
    ]
    subprocess.run(cmd_dv, check=True)

# 3. Frost / Ice Crackle
frost_wav = SYNTH_DIR / "frost_crackle.wav"
if not frost_wav.exists():
    cmd_fc = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anoisesrc=d=15:c=white:r=44100:a=0.3,highpass=f=3500,volume=0.5",
        "-c:a", "pcm_s16le", str(frost_wav)
    ]
    subprocess.run(cmd_fc, check=True)

# 4. Arc Floodlight Hum (60Hz buzzing hum)
floodlight_hum_wav = SYNTH_DIR / "floodlight_hum.wav"
if not floodlight_hum_wav.exists():
    cmd_fh = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=f=60:d=25,amix=inputs=1,volume=0.4",
        "-c:a", "pcm_s16le", str(floodlight_hum_wav)
    ]
    subprocess.run(cmd_fh, check=True)

BGM = SFX_DIR / "music-4cdabe20.mp3"

CHAPTER_SFX = {
    "ch_1": [
        (SFX_DIR / "room_tone-e711a45f.mp3", 0, 0.15),
        (SFX_DIR / "clink-169430e3.mp3", 7500, 0.45), # remote falls
        (whoosh_shadow_wav, 13000, 0.6),             # shadow peels off wall
        (SFX_DIR / "drone_hit-75f05067.mp3", 15000, 0.4), # shadow grabs remote
        (SFX_DIR / "gasp-372b408b.mp3", 26000, 0.4),  # Pip gasps
        (SFX_DIR / "title_boom-91f4f23e.mp3", 35000, 0.45), # Mind blown!
    ],
    "ch_2": [
        (SFX_DIR / "counter_tick-37ca9370.mp3", 500, 0.25),
        (SFX_DIR / "clink-169430e3.mp3", 10000, 0.4), # dishes
        (SFX_DIR / "power_hum-ae629acb.mp3", 16000, 0.3), # vacuum
        (SFX_DIR / "ding-a322cf81.mp3", 23000, 0.35), # calculus solved
        (SFX_DIR / "sparkle-595dbfb7.mp3", 28000, 0.35),
    ],
    "ch_3": [
        (SFX_DIR / "switch_off-9588c15a.mp3", 3000, 0.5), # switch click
        (whoosh_shadow_wav, 6500, 0.5), # split shadow
        (SFX_DIR / "tumble-d03ef997.mp3", 14000, 0.4), # wrestling scuffle
        (SFX_DIR / "switch_off-9588c15a.mp3", 21000, 0.5), # lights cut
        (drone_vacuum_wav, 22000, 0.35), # eerie darkness
        (SFX_DIR / "ghost_shimmer-e61fce51.mp3", 32000, 0.4), # icy tap on neck
        (SFX_DIR / "gasp-372b408b.mp3", 35000, 0.45), # Pip screams
    ],
    "ch_4": [
        (SFX_DIR / "switch_off-9588c15a.mp3", 1000, 0.4),
        (SFX_DIR / "fall_whoosh-07978690.mp3", 8000, 0.45), # drag Pip
        (SFX_DIR / "laugh-7d80a59f.mp3", 16000, 0.35), # shadow laughs
        (whoosh_shadow_wav, 22000, 0.5), # stretch 50 ft
        (SFX_DIR / "land-c5089052.mp3", 30000, 0.4), # lock slip
    ],
    "ch_5": [
        (drone_vacuum_wav, 2000, 0.45), # photon black hole
        (frost_wav, 14000, 0.35),       # freeze begins
        (SFX_DIR / "shatter-cde6184c.mp3", 24000, 0.3), # frost crystal snap
        (SFX_DIR / "gasp-372b408b.mp3", 32000, 0.4),    # hypothermia shiver
    ],
    "ch_6": [
        (floodlight_hum_wav, 3000, 0.35), # stadium lights on
        (SFX_DIR / "switch_off-9588c15a.mp3", 4000, 0.5),
        (SFX_DIR / "dizzy-46ba6f40.mp3", 18000, 0.35), # trapped shadow
        (SFX_DIR / "pop-99ba70e6.mp3", 32000, 0.4),    # high five
        (SFX_DIR / "ding-a322cf81.mp3", 39000, 0.5),   # bell chime
        (SFX_DIR / "sparkle-595dbfb7.mp3", 40000, 0.45),
    ],
    "short": [
        (whoosh_shadow_wav, 1000, 0.5),
        (SFX_DIR / "clink-169430e3.mp3", 4500, 0.35),
        (SFX_DIR / "switch_off-9588c15a.mp3", 8000, 0.45),
        (drone_vacuum_wav, 11000, 0.35),
        (frost_wav, 14000, 0.35),
        (SFX_DIR / "ding-a322cf81.mp3", 18500, 0.5),
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
    
    # Build filter_complex
    inputs = ["-i", str(voice_file)]
    inputs += ["-stream_loop", "-1", "-i", str(BGM)] # input 1: bgm
    
    filter_parts = []
    # Voice: slight presence boost
    filter_parts.append("[0:a]volume=1.0[voice]")
    
    # BGM: low level ducked under voice
    filter_parts.append(f"[1:a]volume=0.04,afade=t=out:st={dur-1.5}:d=1.5[bgm]")
    
    mix_sources = ["[voice]", "[bgm]"]
    
    in_idx = 2
    for sfx_path, delay_ms, vol in sfx_list:
        if sfx_path.exists():
            inputs += ["-i", str(sfx_path)]
            lbl = f"sfx{in_idx}"
            filter_parts.append(f"[{in_idx}:a]volume={vol},adelay={delay_ms}|{delay_ms}[{lbl}]")
            mix_sources.append(f"[{lbl}]")
            in_idx += 1
    
    mix_cmd = "".join(mix_sources) + f"amix=inputs={len(mix_sources)}:duration=first:dropout_transition=2[outa]"
    filter_complex = ";".join(filter_parts + [mix_cmd])
    
    cmd = [
        "ffmpeg", "-y", *inputs,
        "-filter_complex", filter_complex,
        "-map", "[outa]",
        "-c:a", "pcm_s16le",
        "-t", str(dur + 0.3),
        str(out_wav)
    ]
    subprocess.run(cmd, check=True)
    print(f"[{cid}] SFX Mixed -> {out_wav.name} ({dur:.2f}s, {out_wav.stat().st_size / 1e6:.2f} MB)")

if __name__ == "__main__":
    print("=== MIXING SFX AND SOUND DESIGN FOR LIVING SHADOW ===")
    for cid, sfx_list in CHAPTER_SFX.items():
        mix_chapter(cid, sfx_list)
    print("=== ALL SFX MIXING COMPLETED SUCCESSFULLY ===")

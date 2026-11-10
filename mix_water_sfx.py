import json, os, pathlib, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
SFX_DIR = STUDIO / "library" / "sfx"
PUB_DIR = STUDIO / "public" / "no-water"

SYNTH_DIR = PUB_DIR / "synth"
SYNTH_DIR.mkdir(parents=True, exist_ok=True)

# 1. Tectonic Seismic Rumble (deep 38Hz sub rumble)
tectonic_wav = SYNTH_DIR / "tectonic_rumble.wav"
if not tectonic_wav.exists():
    cmd_tr = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "sine=f=38:d=25,lowpass=f=100,volume=0.85",
        "-c:a", "pcm_s16le", str(tectonic_wav)
    ]
    subprocess.run(cmd_tr, check=True)

# 2. Volcano Magma Rupture
volcano_wav = SYNTH_DIR / "volcano_burst.wav"
if not volcano_wav.exists():
    cmd_vb = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anoisesrc=d=4.0:c=pink:r=44100:a=0.7,bandpass=f=250:w=180,afade=t=in:ss=0:d=0.2,afade=t=out:st=2.5:d=1.5",
        "-c:a", "pcm_s16le", str(volcano_wav)
    ]
    subprocess.run(cmd_vb, check=True)

# 3. Wildfire Roar
fire_wav = SYNTH_DIR / "wildfire_roar.wav"
if not fire_wav.exists():
    cmd_fr = [
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", "anoisesrc=d=20:c=white:r=44100:a=0.35,bandpass=f=1200:w=800,volume=0.5",
        "-c:a", "pcm_s16le", str(fire_wav)
    ]
    subprocess.run(cmd_fr, check=True)

BGM = SFX_DIR / "music-4cdabe20.mp3"

CHAPTER_SFX = {
    "ch_1": [
        (SFX_DIR / "room_tone-e711a45f.mp3", 0, 0.15),
        (SFX_DIR / "bulb_pop-2ea0e2d7.mp3", 6500, 0.5), # faucet vanish pop
        (SFX_DIR / "gasp-372b408b.mp3", 12000, 0.4),    # Mo screams in shower
        (SFX_DIR / "title_boom-91f4f23e.mp3", 26000, 0.5), # Planet-wide disappearance!
    ],
    "ch_2": [
        (SFX_DIR / "drone_hit-75f05067.mp3", 2000, 0.45), # Ocean abyss drop
        (SFX_DIR / "shatter-cde6184c.mp3", 16000, 0.4),    # Ship hulls snap
        (SFX_DIR / "roof_wind-cedc7edc.mp3", 24000, 0.35), # Desert wind across seabed
    ],
    "ch_3": [
        (tectonic_wav, 1000, 0.55), # Hydrostatic pressure release rumble
        (SFX_DIR / "crack-3cbd3c57.mp3", 12000, 0.45), # Tectonic plates crack
        (volcano_wav, 19000, 0.6), # Volcanoes blast lava
    ],
    "ch_4": [
        (SFX_DIR / "counter_tick-37ca9370.mp3", 1000, 0.3),
        (SFX_DIR / "dizzy-46ba6f40.mp3", 14000, 0.35), # 60°C heat wave delirium
        (SFX_DIR / "roof_wind_l-468b7d55.mp3", 27000, 0.4), # Sub-zero night freeze
    ],
    "ch_5": [
        (SFX_DIR / "gulp-c9154a14.mp3", 2000, 0.45), # Dry throat gulp
        (fire_wav, 16000, 0.45), # Wildfires ignite
        (SFX_DIR / "title_boom-91f4f23e.mp3", 28000, 0.4), # Life cannot survive
    ],
    "ch_6": [
        (SFX_DIR / "roof_wind-cedc7edc.mp3", 1000, 0.35), # Mars dust storms
        (SFX_DIR / "ding-a322cf81.mp3", 9000, 0.45),     # Alarm buzzes / awake
        (SFX_DIR / "gulp-c9154a14.mp3", 24000, 0.5),    # Huge refreshing water gulp!
        (SFX_DIR / "sparkle-595dbfb7.mp3", 28000, 0.45), # Relief sparkle
        (SFX_DIR / "ding-a322cf81.mp3", 38000, 0.5),     # Subscribe bell
    ],
    "short": [
        (SFX_DIR / "bulb_pop-2ea0e2d7.mp3", 1000, 0.45),
        (SFX_DIR / "drone_hit-75f05067.mp3", 5000, 0.45),
        (volcano_wav, 9000, 0.5),
        (fire_wav, 13000, 0.4),
        (SFX_DIR / "gulp-c9154a14.mp3", 16000, 0.5),
        (SFX_DIR / "ding-a322cf81.mp3", 18500, 0.5),
    ]
}

def mix_chapter(cid, sfx_list):
    voice_file = PUB_DIR / f"{cid}.mp3" if cid != "short" else PUB_DIR / "voice_short.mp3"
    out_wav = PUB_DIR / f"{cid}_mixed.wav"
    
    dur = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(voice_file)
    ]).decode().strip())
    
    inputs = ["-i", str(voice_file)]
    inputs += ["-stream_loop", "-1", "-i", str(BGM)]
    
    # Broadcast Vocal Chain on Narration: warmth + clarity + compressor
    vocal_chain = "bass=g=2:f=160,treble=g=3:f=3500,acompressor=threshold=-18dB:ratio=3.5:attack=15:release=120:makeup=4,volume=1.0"
    filter_parts = [f"[0:a]{vocal_chain}[voice]"]
    filter_parts.append(f"[1:a]volume=0.035,afade=t=out:st={dur-1.5}:d=1.5[bgm]")
    
    mix_sources = ["[voice]", "[bgm]"]
    
    in_idx = 2
    for sfx_path, delay_ms, vol in sfx_list:
        if sfx_path.exists():
            inputs += ["-i", str(sfx_path)]
            lbl = f"sfx{in_idx}"
            filter_parts.append(f"[{in_idx}:a]volume={vol},adelay={delay_ms}|{delay_ms}[{lbl}]")
            mix_sources.append(f"[{lbl}]")
            in_idx += 1
    
    # normalize=0 so inputs are NOT scaled down by 1/N!
    mix_cmd = "".join(mix_sources) + f"amix=inputs={len(mix_sources)}:duration=first:dropout_transition=0:normalize=0[outa]"
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
    print("=== MIXING SFX AND SOUND DESIGN FOR NO WATER ===")
    for cid, sfx_list in CHAPTER_SFX.items():
        mix_chapter(cid, sfx_list)
    print("=== ALL SFX MIXING COMPLETED SUCCESSFULLY ===")


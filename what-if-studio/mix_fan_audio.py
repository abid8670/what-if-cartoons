import os
import pathlib
import subprocess
import json

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\fan-off-ammi")
SFX_DIR = PUB_DIR / "sfx"
BGM = PUB_DIR / "comedy_bgm.wav"

def get_duration(fpath):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(fpath)]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(json.loads(res.stdout)['format']['duration'])

def mix_chapter(name, voice_file, sfx_events, bgm_offset, total_dur):
    out_file = PUB_DIR / f"{name}_mixed.wav"
    print(f"Mixing {name} -> {out_file} (duration: {total_dur:.2f}s)...")
    
    # Build filter complex
    # Input 0: voice
    # Input 1: BGM
    # Inputs 2+: sfx
    inputs = ['-i', str(voice_file), '-ss', str(bgm_offset), '-t', str(total_dur), '-i', str(BGM)]
    for sfx_path, _ in sfx_events:
        inputs.extend(['-i', str(sfx_path)])
    
    filter_parts = []
    # Voice pad and volume
    filter_parts.append("[0:a]volume=1.0[voice];")
    # BGM ducked
    filter_parts.append("[1:a]volume=0.18,afade=t=out:st={}:d=1.0[bgm];".format(total_dur - 1.0))
    
    mix_sources = ["[voice]", "[bgm]"]
    for idx, (_, delay_sec) in enumerate(sfx_events):
        inp_idx = idx + 2
        delay_ms = int(delay_sec * 1000)
        filter_parts.append(f"[{inp_idx}:a]volume=0.85,adelay={delay_ms}|{delay_ms}[sfx{idx}];")
        mix_sources.append(f"[sfx{idx}]")
    
    mix_count = len(mix_sources)
    filter_parts.append(f"{''.join(mix_sources)}amix=inputs={mix_count}:duration=first:dropout_transition=2[mixed];")
    filter_parts.append("[mixed]loudnorm=I=-14.0:TP=-1.5:LRA=11.0[outa]")
    
    cmd = ['ffmpeg', '-y'] + inputs + [
        '-filter_complex', ''.join(filter_parts),
        '-map', '[outa]',
        '-ar', '48000',
        '-t', str(total_dur),
        str(out_file)
    ]
    subprocess.run(cmd, check=True)
    frames = int(round(total_dur * 30))
    print(f"Mastered {name}: {total_dur:.2f}s ({frames} frames)")
    return {"duration": total_dur, "frames": frames}

durations_meta = {}

# Ch 1: 17.74s voice -> 18.70s (561 frames)
dur_1 = get_duration(PUB_DIR / "ch_1.mp3") + 1.0
durations_meta["ch_1"] = mix_chapter(
    "ch_1", PUB_DIR / "ch_1.mp3",
    [(SFX_DIR / "snore.wav", 0.5), (SFX_DIR / "tip_toe.wav", 13.5)],
    0.0, dur_1
)

# Ch 2: 21.38s voice -> 22.40s (672 frames)
dur_2 = get_duration(PUB_DIR / "ch_2.mp3") + 1.0
durations_meta["ch_2"] = mix_chapter(
    "ch_2", PUB_DIR / "ch_2.mp3",
    [
        (SFX_DIR / "switch_click.wav", 7.2),
        (SFX_DIR / "vine_boom.wav", 7.3),
        (SFX_DIR / "fan_slowdown.wav", 7.6),
        (SFX_DIR / "sizzle.wav", 14.5)
    ],
    dur_1, dur_2
)

# Ch 3: 20.69s voice -> 22.00s (660 frames)
dur_3 = get_duration(PUB_DIR / "ch_3.mp3") + 1.3
durations_meta["ch_3"] = mix_chapter(
    "ch_3", PUB_DIR / "ch_3.mp3",
    [
        (SFX_DIR / "boing.wav", 0.4),
        (SFX_DIR / "vine_boom.wav", 4.8)
    ],
    dur_1 + dur_2, dur_3
)

# Short: 23.78s voice -> 25.00s (750 frames)
dur_short = get_duration(PUB_DIR / "short.mp3") + 1.2
durations_meta["short"] = mix_chapter(
    "short", PUB_DIR / "short.mp3",
    [
        (SFX_DIR / "switch_click.wav", 4.9),
        (SFX_DIR / "vine_boom.wav", 5.0),
        (SFX_DIR / "sizzle.wav", 8.8),
        (SFX_DIR / "boing.wav", 12.2)
    ],
    0.0, dur_short
)

with open(PUB_DIR / "durations.json", "w", encoding="utf-8") as f:
    json.dump(durations_meta, f, indent=2)

print("\nDurations saved to durations.json:")
print(json.dumps(durations_meta, indent=2))


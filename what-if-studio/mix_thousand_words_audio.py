import os
import pathlib
import subprocess
import json

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\thousand-words")
SFX_DIR = PUB_DIR / "sfx"
BGM = PUB_DIR / "emotional_score.wav"

def get_duration(fpath):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(fpath)]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(json.loads(res.stdout)['format']['duration'])

def mix_chapter(name, voice_file, sfx_events, bgm_offset, total_dur):
    out_file = PUB_DIR / f"{name}_mixed.wav"
    print(f"Mixing {name} -> {out_file} (duration: {total_dur:.2f}s)...")
    
    inputs = ['-i', str(voice_file), '-ss', str(bgm_offset), '-t', str(total_dur), '-i', str(BGM)]
    for sfx_path, _ in sfx_events:
        inputs.extend(['-i', str(sfx_path)])
    
    filter_parts = []
    filter_parts.append("[0:a]volume=1.0[voice];")
    filter_parts.append("[1:a]volume=0.22,afade=t=out:st={}:d=1.5[bgm];".format(total_dur - 1.5))
    
    mix_sources = ["[voice]", "[bgm]"]
    for idx, (_, delay_sec) in enumerate(sfx_events):
        inp_idx = idx + 2
        delay_ms = int(delay_sec * 1000)
        filter_parts.append(f"[{inp_idx}:a]volume=0.75,adelay={delay_ms}|{delay_ms}[sfx{idx}];")
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

# Ch 1: 25.15s voice -> 27.50s (825 frames)
dur_1 = get_duration(PUB_DIR / "ch_1.mp3") + 2.35
durations_meta["ch_1"] = mix_chapter(
    "ch_1", PUB_DIR / "ch_1.mp3",
    [(SFX_DIR / "counter_tick.wav", 18.2)],
    0.0, dur_1
)

# Ch 2: 31.85s voice -> 34.20s (1026 frames)
dur_2 = get_duration(PUB_DIR / "ch_2.mp3") + 2.35
durations_meta["ch_2"] = mix_chapter(
    "ch_2", PUB_DIR / "ch_2.mp3",
    [
        (SFX_DIR / "counter_tick.wav", 5.5),
        (SFX_DIR / "counter_tick.wav", 10.8),
        (SFX_DIR / "warning_glitch.wav", 20.8)
    ],
    dur_1, dur_2
)

# Ch 3: 29.42s voice -> 32.00s (960 frames)
dur_3 = get_duration(PUB_DIR / "ch_3.mp3") + 2.58
durations_meta["ch_3"] = mix_chapter(
    "ch_3", PUB_DIR / "ch_3.mp3",
    [
        (SFX_DIR / "heartbeat.wav", 4.5),
        (SFX_DIR / "heart_chime.wav", 26.5)
    ],
    dur_1 + dur_2, dur_3
)

# Ch 4: 34.27s voice -> 36.80s (1104 frames)
dur_4 = get_duration(PUB_DIR / "ch_4.mp3") + 2.53
durations_meta["ch_4"] = mix_chapter(
    "ch_4", PUB_DIR / "ch_4.mp3",
    [
        (SFX_DIR / "rain_rumble.wav", 18.0),
        (SFX_DIR / "heartbeat.wav", 27.5),
        (SFX_DIR / "heart_chime.wav", 32.5)
    ],
    dur_1 + dur_2 + dur_3, dur_4
)

# Ch 5: 31.68s voice -> 34.50s (1035 frames)
dur_5 = get_duration(PUB_DIR / "ch_5.mp3") + 2.82
durations_meta["ch_5"] = mix_chapter(
    "ch_5", PUB_DIR / "ch_5.mp3",
    [
        (SFX_DIR / "counter_tick.wav", 1.2),
        (SFX_DIR / "heart_chime.wav", 22.0)
    ],
    dur_1 + dur_2 + dur_3 + dur_4, dur_5
)

# Short: 25.06s voice -> 26.50s (795 frames)
dur_short = get_duration(PUB_DIR / "short.mp3") + 1.44
durations_meta["short"] = mix_chapter(
    "short", PUB_DIR / "short.mp3",
    [
        (SFX_DIR / "counter_tick.wav", 3.0),
        (SFX_DIR / "warning_glitch.wav", 12.0),
        (SFX_DIR / "heart_chime.wav", 18.0)
    ],
    0.0, dur_short
)

with open(PUB_DIR / "durations.json", "w", encoding="utf-8") as f:
    json.dump(durations_meta, f, indent=2)

print("\nDurations saved to durations.json:")
print(json.dumps(durations_meta, indent=2))


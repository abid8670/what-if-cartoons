import pathlib
import subprocess
import json

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "dont-watch"
SFX_DIR = PUB_DIR / "sfx"
SCORE_WAV = PUB_DIR / "quirky_groove_score.wav"

CHAPTER_CONFIG = {
    'ch_1': {
        'voice': PUB_DIR / 'ch_1.mp3',
        'music_offset': 0.0,
        'music_vol': 0.28,
        'sfx': [
            (SFX_DIR / 'record_scratch.wav', 0.1, 0.45),
            (SFX_DIR / 'whoosh.wav', 1.8, 0.35),
            (SFX_DIR / 'buzzer.wav', 11.5, 0.38),
            (SFX_DIR / 'mouse_click.wav', 19.5, 0.40),
            (SFX_DIR / 'pop.wav', 25.0, 0.42),
        ]
    },
    'ch_2': {
        'voice': PUB_DIR / 'ch_2.mp3',
        'music_offset': 31.5,
        'music_vol': 0.28,
        'sfx': [
            (SFX_DIR / 'sub_drop.wav', 1.2, 0.50),
            (SFX_DIR / 'glitch.wav', 12.0, 0.40),
            (SFX_DIR / 'pop.wav', 18.5, 0.35),
            (SFX_DIR / 'whoosh.wav', 24.5, 0.35),
        ]
    },
    'ch_3': {
        'voice': PUB_DIR / 'ch_3.mp3',
        'music_offset': 65.5,
        'music_vol': 0.30,
        'sfx': [
            (SFX_DIR / 'buzzer.wav', 0.8, 0.42),
            (SFX_DIR / 'keyboard_clatter.wav', 8.5, 0.45),
            (SFX_DIR / 'pop.wav', 14.5, 0.45),
            (SFX_DIR / 'bell_ding.wav', 22.0, 0.45),
            (SFX_DIR / 'keyboard_clatter.wav', 27.0, 0.40),
        ]
    },
    'ch_4': {
        'voice': PUB_DIR / 'ch_4.mp3',
        'music_offset': 100.0,
        'music_vol': 0.30,
        'sfx': [
            (SFX_DIR / 'sub_drop.wav', 0.8, 0.45),
            (SFX_DIR / 'keyboard_clatter.wav', 13.5, 0.38),
            (SFX_DIR / 'bell_ding.wav', 21.0, 0.50),
            (SFX_DIR / 'whoosh.wav', 27.5, 0.35),
            (SFX_DIR / 'pop.wav', 33.0, 0.40),
        ]
    },
    'short': {
        'voice': PUB_DIR / 'voice_short.mp3',
        'music_offset': 0.0,
        'music_vol': 0.30,
        'sfx': [
            (SFX_DIR / 'record_scratch.wav', 0.1, 0.45),
            (SFX_DIR / 'buzzer.wav', 7.0, 0.40),
            (SFX_DIR / 'keyboard_clatter.wav', 14.0, 0.45),
            (SFX_DIR / 'pop.wav', 22.5, 0.45),
            (SFX_DIR / 'sub_drop.wav', 28.5, 0.45),
            (SFX_DIR / 'bell_ding.wav', 34.0, 0.50),
        ]
    }
}

durations = {}

for ch_name, cfg in CHAPTER_CONFIG.items():
    out_wav = PUB_DIR / f"{ch_name}_mixed.wav"
    voice_in = str(cfg['voice'])
    
    probe = subprocess.run([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', voice_in
    ], capture_output=True, text=True, check=True)
    v_dur = float(probe.stdout.strip()) + 1.0  # gentle padding
    
    inputs = ['-i', voice_in, '-ss', str(cfg['music_offset']), '-t', str(v_dur), '-i', str(SCORE_WAV)]
    filter_parts = [
        '[0:a]volume=1.25,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=50[v]',
        f"[1:a]volume={cfg['music_vol']},afade=t=out:st={v_dur-1.2}:d=1.2[m]"
    ]
    mix_sources = ['[v]', '[m]']
    
    sfx_idx = 2
    for sfx_path, sfx_time, sfx_vol in cfg['sfx']:
        inputs.extend(['-i', str(sfx_path)])
        delay_ms = int(sfx_time * 1000)
        filter_parts.append(f"[{sfx_idx}:a]volume={sfx_vol},adelay={delay_ms}|{delay_ms}[sfx{sfx_idx}]")
        mix_sources.append(f"[sfx{sfx_idx}]")
        sfx_idx += 1
        
    num_inputs = len(mix_sources)
    filter_complex = ";".join(filter_parts) + f";{''.join(mix_sources)}amix=inputs={num_inputs}:duration=longest:dropout_transition=2,loudnorm=I=-14.0:TP=-1.5:LRA=11.0[outa]"
    
    cmd = ['ffmpeg', '-y'] + inputs + ['-filter_complex', filter_complex, '-map', '[outa]', '-c:a', 'pcm_s16le', str(out_wav)]
    subprocess.run(cmd, check=True)
    
    probe_out = subprocess.run([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', str(out_wav)
    ], capture_output=True, text=True, check=True)
    final_dur = float(probe_out.stdout.strip())
    frames = int(final_dur * 30)
    durations[ch_name] = {'duration': final_dur, 'frames': frames}
    print(f"Mixed {ch_name}: {final_dur:.2f}s ({frames} frames)")

with open(PUB_DIR / "durations.json", "w") as f:
    json.dump(durations, f, indent=2)
print("Saved durations.json")


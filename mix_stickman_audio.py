import pathlib, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "stickman-life"
SFX_DIR = PUB_DIR / "sfx"
SCORE_WAV = PUB_DIR / "piano_score.wav"

CHAPTER_CONFIG = {
    'ch_1': {
        'voice': PUB_DIR / 'ch_1.mp3',
        'music_offset': 0.0,
        'music_vol': 0.35,
        'sfx': [
            (SFX_DIR / 'pencil_scratch.wav', 1.0, 0.45), # Pencil drawing birth
            (SFX_DIR / 'magic_chime.wav', 16.0, 0.35),   # Butterfly lands on finger
        ]
    },
    'ch_2': {
        'voice': PUB_DIR / 'ch_2.mp3',
        'music_offset': 35.5,
        'music_vol': 0.38,
        'sfx': [
            (SFX_DIR / 'pencil_scratch.wav', 2.5, 0.40), # Lily drawn
            (SFX_DIR / 'magic_chime.wav', 12.0, 0.45),   # Glowing heart shared
        ]
    },
    'ch_3': {
        'voice': PUB_DIR / 'ch_3.mp3',
        'music_offset': 66.5,
        'music_vol': 0.35,
        'sfx': [
            (SFX_DIR / 'eraser_rub.wav', 3.0, 0.55),     # Eraser descends & rubs
            (SFX_DIR / 'heartbeat.wav', 18.0, 0.50),     # Heartbeat during fade
            (SFX_DIR / 'heartbeat.wav', 24.0, 0.50),
        ]
    },
    'ch_4': {
        'voice': PUB_DIR / 'ch_4.mp3',
        'music_offset': 103.5,
        'music_vol': 0.32,
        'sfx': [
            (SFX_DIR / 'rain_ambience.wav', 0.0, 0.35),  # Rain falling on page
            (SFX_DIR / 'magic_chime.wav', 28.0, 0.40),   # Spark on broken lead
        ]
    },
    'ch_5': {
        'voice': PUB_DIR / 'ch_5.mp3',
        'music_offset': 139.5,
        'music_vol': 0.42,
        'sfx': [
            (SFX_DIR / 'pencil_scratch.wav', 4.0, 0.45), # Arthur kneels & draws
            (SFX_DIR / 'magic_chime.wav', 15.0, 0.50),   # Tree bursts into bloom!
            (SFX_DIR / 'magic_chime.wav', 28.0, 0.45),   # Child appears
        ]
    },
    'short': {
        'voice': PUB_DIR / 'voice_short.mp3',
        'music_offset': 0.0,
        'music_vol': 0.38,
        'sfx': [
            (SFX_DIR / 'pencil_scratch.wav', 1.0, 0.40),
            (SFX_DIR / 'magic_chime.wav', 8.0, 0.40),
            (SFX_DIR / 'eraser_rub.wav', 14.0, 0.50),
            (SFX_DIR / 'pencil_scratch.wav', 20.0, 0.40),
            (SFX_DIR / 'magic_chime.wav', 26.0, 0.45),
        ]
    }
}

for ch_name, cfg in CHAPTER_CONFIG.items():
    out_wav = PUB_DIR / f"{ch_name}_mixed.wav"
    voice_in = str(cfg['voice'])
    
    # Extract music slice
    probe = subprocess.run([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', voice_in
    ], capture_output=True, text=True, check=True)
    v_dur = float(probe.stdout.strip()) + 0.8
    
    # Build ffmpeg command with filter_complex
    inputs = ['-i', voice_in, '-ss', str(cfg['music_offset']), '-t', str(v_dur), '-i', str(SCORE_WAV)]
    filter_parts = [
        '[0:a]volume=1.2,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=50[v]',
        f"[1:a]volume={cfg['music_vol']},afade=t=out:st={v_dur-1.5}:d=1.5[m]"
    ]
    mix_sources = ['[v]', '[m]']
    
    sfx_idx = 2
    for sfx_file, start_sec, vol in cfg['sfx']:
        inputs.extend(['-i', str(sfx_file)])
        filter_parts.append(f"[{sfx_idx}:a]adelay={int(start_sec*1000)}|{int(start_sec*1000)},volume={vol}[sfx{sfx_idx}]")
        mix_sources.append(f"[sfx{sfx_idx}]")
        sfx_idx += 1
        
    filter_parts.append(f"{' '.join(mix_sources)}amix=inputs={len(mix_sources)}:duration=longest:dropout_transition=2,loudnorm=I=-14.0:TP=-1.5:LRA=11.0[outa]")
    
    cmd = ['ffmpeg', '-y'] + inputs + ['-filter_complex', ';'.join(filter_parts), '-map', '[outa]', '-c:a', 'pcm_s16le', str(out_wav)]
    subprocess.run(cmd, check=True)
    print(f"Mastered: {out_wav.name} (dur={v_dur:.2f}s)")

print("All 6 audio tracks mixed and mastered to -14 LUFS!")


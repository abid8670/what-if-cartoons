import pathlib, subprocess, sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "platform-dog"
SFX_DIR = PUB_DIR / "sfx"
SCORE_WAV = PUB_DIR / "piano_cello_score.wav"

# 1. First, create the 4-second Branded Intro Audio
intro_wav = PUB_DIR / "intro_mixed.wav"
cmd_intro = [
    'ffmpeg', '-y', '-i', str(SFX_DIR / 'intro_sting.wav'),
    '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
    '-c:a', 'pcm_s16le', str(intro_wav)
]
subprocess.run(cmd_intro, check=True)
print("Created intro_mixed.wav (4.0s)")

CHAPTER_CONFIG = {
    'ch_1': {
        'voice': PUB_DIR / 'ch_1.mp3',
        'music_offset': 0.0,
        'music_vol': 0.35,
        'sfx': [
            (SFX_DIR / 'dog_bark.wav', 2.0, 0.45),        # Happy morning bark
            (SFX_DIR / 'train_whistle.wav', 20.0, 0.40),   # Morning train whistle
            (SFX_DIR / 'train_brake.wav', 23.0, 0.35),     # Train arrives at platform
        ]
    },
    'ch_2': {
        'voice': PUB_DIR / 'ch_2.mp3',
        'music_offset': 36.0,
        'music_vol': 0.35,
        'sfx': [
            (SFX_DIR / 'train_brake.wav', 2.0, 0.40),      # 5:15 PM train halts
            (SFX_DIR / 'clock_tick.wav', 18.0, 0.35),      # Quiet station clock ticking
            (SFX_DIR / 'train_whistle.wav', 24.0, 0.35),   # Train departs without Arthur
        ]
    },
    'ch_3': {
        'voice': PUB_DIR / 'ch_3.mp3',
        'music_offset': 72.0,
        'music_vol': 0.36,
        'sfx': [
            (SFX_DIR / 'winter_wind.wav', 2.0, 0.35),      # Freezing winter wind
            (SFX_DIR / 'intro_sting.wav', 21.0, 0.30),     # Gentle chime for Subscribe CTA
        ]
    },
    'ch_4': {
        'voice': PUB_DIR / 'ch_4.mp3',
        'music_offset': 112.0,
        'music_vol': 0.34,
        'sfx': [
            (SFX_DIR / 'clock_tick.wav', 2.0, 0.35),       # Slow clock ticks
            (SFX_DIR / 'winter_wind.wav', 12.0, 0.25),     # Soft falling snow
        ]
    },
    'ch_5': {
        'voice': PUB_DIR / 'ch_5.mp3',
        'music_offset': 148.0,
        'music_vol': 0.42,
        'sfx': [
            (SFX_DIR / 'train_whistle.wav', 1.0, 0.45),    # Distant golden whistle
            (SFX_DIR / 'train_brake.wav', 4.0, 0.35),      # Golden train arrives
            (SFX_DIR / 'dog_bark.wav', 14.0, 0.50),        # Ecstatic reunion bark!
        ]
    },
    'short': {
        'voice': PUB_DIR / 'voice_short.mp3',
        'music_offset': 0.0,
        'music_vol': 0.38,
        'sfx': [
            (SFX_DIR / 'dog_bark.wav', 1.5, 0.40),
            (SFX_DIR / 'train_brake.wav', 10.0, 0.35),
            (SFX_DIR / 'winter_wind.wav', 18.0, 0.30),
            (SFX_DIR / 'train_whistle.wav', 24.0, 0.40),
            (SFX_DIR / 'dog_bark.wav', 28.0, 0.45),
        ]
    }
}

for ch_name, cfg in CHAPTER_CONFIG.items():
    out_wav = PUB_DIR / f"{ch_name}_mixed.wav"
    voice_in = str(cfg['voice'])
    
    probe = subprocess.run([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', voice_in
    ], capture_output=True, text=True, check=True)
    v_dur = float(probe.stdout.strip()) + 1.2
    
    inputs = ['-i', voice_in, '-ss', str(cfg['music_offset']), '-t', str(v_dur), '-i', str(SCORE_WAV)]
    filter_parts = [
        '[0:a]volume=1.25,highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=50[v]',
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

print("All audio tracks mixed and mastered to broadcast -14 LUFS!")


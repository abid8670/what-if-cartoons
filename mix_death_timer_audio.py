import json
import pathlib
import subprocess
import sys
import numpy as np
import scipy.io.wavfile as wav

sys.stdout.reconfigure(encoding='utf-8')

AUDIO_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer")
SFX_DIR = AUDIO_DIR / "sfx"

SR = 44100

def load_wav_or_mp3(path):
    if str(path).endswith('.mp3'):
        wav_path = path.with_suffix('.tmp.wav')
        subprocess.run(['ffmpeg', '-y', '-i', str(path), '-ar', str(SR), '-ac', '2', str(wav_path)],
                       capture_output=True, check=True)
        sr, data = wav.read(str(wav_path))
        wav_path.unlink(missing_ok=True)
    else:
        sr, data = wav.read(str(path))
    
    if data.ndim == 1:
        data = np.column_stack([data, data])
    if data.dtype == np.int16:
        data = data.astype(np.float32) / 32768.0
    return data

music_full = load_wav_or_mp3(AUDIO_DIR / "tension_score.wav")
sfx_tick = load_wav_or_mp3(SFX_DIR / "digital_tick.wav")
sfx_alarm = load_wav_or_mp3(SFX_DIR / "red_alarm_glitch.wav")
sfx_subway = load_wav_or_mp3(SFX_DIR / "subway_rumble.wav")
sfx_heartbeat = load_wav_or_mp3(SFX_DIR / "heartbeat_fast.wav")
sfx_fate = load_wav_or_mp3(SFX_DIR / "fate_reset.wav")
sfx_crash = load_wav_or_mp3(SFX_DIR / "collapse_crash.wav")

def add_sfx(target, sfx, time_sec, vol=1.0):
    start = int(time_sec * SR)
    end = min(len(target), start + len(sfx))
    sfx_len = end - start
    if sfx_len > 0:
        target[start:end] += sfx[:sfx_len] * vol

CHAPTER_CONFIG = {
    "ch_1": {
        "pre": 0.5, "post": 1.5,
        "sfx": [(1.5, sfx_tick, 0.4), (3.0, sfx_tick, 0.4), (7.5, sfx_tick, 0.5), (15.0, sfx_tick, 0.6)]
    },
    "ch_2": {
        "pre": 0.4, "post": 1.6,
        "sfx": [(0.2, sfx_subway, 0.6), (7.0, sfx_alarm, 0.7), (12.0, sfx_subway, 0.8), (22.0, sfx_fate, 0.75)]
    },
    "ch_3": {
        "pre": 0.5, "post": 1.5,
        "sfx": [(2.0, sfx_tick, 0.35), (10.0, sfx_tick, 0.4), (18.0, sfx_heartbeat, 0.4)]
    },
    "ch_4": {
        "pre": 0.5, "post": 1.8,
        "sfx": [(12.0, sfx_heartbeat, 0.6), (15.0, sfx_alarm, 0.8), (25.0, sfx_crash, 0.9), (34.0, sfx_fate, 0.85)]
    },
    "ch_5": {
        "pre": 0.5, "post": 2.0,
        "sfx": [(4.0, sfx_tick, 0.3), (12.0, sfx_tick, 0.35), (28.0, sfx_fate, 0.65)]
    },
    "short": {
        "pre": 0.3, "post": 1.2,
        "sfx": [(2.0, sfx_tick, 0.4), (6.0, sfx_alarm, 0.75), (12.0, sfx_fate, 0.8), (17.0, sfx_alarm, 0.8)]
    }
}

durations = {}

for ch_name, cfg in CHAPTER_CONFIG.items():
    vo = load_wav_or_mp3(AUDIO_DIR / f"{ch_name}.mp3")
    pre_samples = int(cfg["pre"] * SR)
    post_samples = int(cfg["post"] * SR)
    total_len = pre_samples + len(vo) + post_samples
    
    mixed = np.zeros((total_len, 2), dtype=np.float32)
    
    # 1. Background Music (ducked to 0.25 under VO)
    bgm_chunk = music_full[:total_len].copy()
    bgm_chunk *= 0.22
    # Fade in / out
    fade_len = int(0.5 * SR)
    if total_len > fade_len * 2:
        fade_in = np.linspace(0, 1, fade_len)[:, None]
        fade_out = np.linspace(1, 0, fade_len)[:, None]
        bgm_chunk[:fade_len] *= fade_in
        bgm_chunk[-fade_len:] *= fade_out
    mixed += bgm_chunk
    
    # 2. Voiceover (loud and clear)
    mixed[pre_samples:pre_samples + len(vo)] += vo * 1.05
    
    # 3. Layered SFX
    for sfx_time, sfx_arr, vol in cfg["sfx"]:
        add_sfx(mixed, sfx_arr, cfg["pre"] + sfx_time, vol)
    
    # Write raw mix
    raw_mixed_path = AUDIO_DIR / f"{ch_name}_raw.wav"
    mixed_clamped = np.clip(mixed, -0.98, 0.98)
    wav.write(str(raw_mixed_path), SR, (mixed_clamped * 32767).astype(np.int16))
    
    # Broadcast Master via FFmpeg loudnorm to -14.0 LUFS
    final_mixed_path = AUDIO_DIR / f"{ch_name}_mixed.wav"
    cmd_loudnorm = [
        'ffmpeg', '-y', '-i', str(raw_mixed_path),
        '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
        '-ar', str(SR),
        str(final_mixed_path)
    ]
    subprocess.run(cmd_loudnorm, capture_output=True, check=True)
    raw_mixed_path.unlink(missing_ok=True)
    
    # Probe duration
    cmd_probe = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'json', str(final_mixed_path)]
    probe_res = subprocess.run(cmd_probe, capture_output=True, text=True)
    dur_sec = float(json.loads(probe_res.stdout)['format']['duration'])
    dur_frames = round(dur_sec * 30)
    durations[ch_name] = {
        "seconds": round(dur_sec, 2),
        "frames": dur_frames,
        "file": final_mixed_path.name
    }
    print(f"Mastered {ch_name}_mixed.wav: {dur_sec:.2f}s ({dur_frames} frames @ 30 FPS)")

# Save durations.json
dur_path = AUDIO_DIR / "durations.json"
with open(dur_path, "w", encoding="utf-8") as f:
    json.dump(durations, f, indent=2)
print("Saved durations.json!")


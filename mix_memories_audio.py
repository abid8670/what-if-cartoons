import json
import pathlib
import subprocess
import sys
import numpy as np
import scipy.io.wavfile as wav

sys.stdout.reconfigure(encoding='utf-8')

AUDIO_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\memories")
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

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

DEATH_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer")
DONT_WATCH_SFX = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch\sfx")

music_full = load_wav_or_mp3(DEATH_DIR / "tension_score.wav")
sfx_sub_drop = load_wav_or_mp3(DONT_WATCH_SFX / "sub_drop.wav")
sfx_whoosh = load_wav_or_mp3(DONT_WATCH_SFX / "whoosh.wav")
sfx_heartbeat = load_wav_or_mp3(DEATH_DIR / "sfx" / "heartbeat_fast.wav")

def add_sfx(target, sfx, time_sec, vol=1.0):
    start = int(time_sec * SR)
    end = min(len(target), start + len(sfx))
    sfx_len = end - start
    if sfx_len > 0:
        target[start:end] += sfx[:sfx_len] * vol

CHAPTER_CONFIG = {
    "ch_1": {
        "pre": 0.4, "post": 1.5,
        "sfx": [(0.2, sfx_sub_drop, 0.7), (10.0, sfx_whoosh, 0.6), (18.0, sfx_sub_drop, 0.8)]
    },
    "ch_2": {
        "pre": 0.4, "post": 1.5,
        "sfx": [(0.2, sfx_whoosh, 0.6), (10.0, sfx_whoosh, 0.5), (20.0, sfx_sub_drop, 0.75)]
    },
    "ch_3": {
        "pre": 0.5, "post": 1.5,
        "sfx": [(1.0, sfx_whoosh, 0.6), (12.0, sfx_heartbeat, 0.6), (20.0, sfx_sub_drop, 0.8)]
    },
    "ch_4": {
        "pre": 0.5, "post": 1.5,
        "sfx": [(0.5, sfx_sub_drop, 0.85), (9.0, sfx_heartbeat, 0.65), (17.0, sfx_whoosh, 0.7)]
    },
    "ch_5": {
        "pre": 0.5, "post": 6.5,  # 6.5s post-pad for interactive choice decision card
        "sfx": [(0.2, sfx_heartbeat, 0.65), (6.0, sfx_whoosh, 0.7), (12.0, sfx_sub_drop, 0.9)]
    },
    "short": {
        "pre": 0.2, "post": 1.0,
        "sfx": [(0.1, sfx_whoosh, 0.7), (12.0, sfx_sub_drop, 0.8), (22.0, sfx_heartbeat, 0.6), (32.0, sfx_sub_drop, 0.85)]
    }
}

final_durations = {}

for ch_id, cfg in CHAPTER_CONFIG.items():
    raw_voice_path = AUDIO_DIR / f"{ch_id}_raw.mp3"
    voice = load_wav_or_mp3(raw_voice_path)
    
    pre_samples = int(cfg["pre"] * SR)
    post_samples = int(cfg["post"] * SR)
    total_len = pre_samples + len(voice) + post_samples
    
    mix = np.zeros((total_len, 2), dtype=np.float32)
    mix[pre_samples:pre_samples + len(voice)] += voice * 1.0
    
    # Music bed loop
    m_len = len(music_full)
    for i in range(0, total_len, m_len):
        chunk_len = min(m_len, total_len - i)
        mix[i:i + chunk_len] += music_full[:chunk_len] * 0.18
    
    # Fade in / fade out music
    fade_len = int(0.5 * SR)
    if total_len > fade_len * 2:
        fade_in = np.linspace(0, 1, fade_len)[:, None]
        fade_out = np.linspace(1, 0, fade_len)[:, None]
        mix[:fade_len] *= fade_in
        mix[-fade_len:] *= fade_out
        
    for time_sec, sfx, vol in cfg["sfx"]:
        add_sfx(mix, sfx, time_sec + cfg["pre"], vol)
        
    peak = np.max(np.abs(mix))
    if peak > 0.98:
        mix /= (peak / 0.98)
        
    unnorm_wav = AUDIO_DIR / f"{ch_id}_unnorm.wav"
    wav.write(str(unnorm_wav), SR, (mix * 32767).astype(np.int16))
    
    # Broadcast loudness mastering via loudnorm (-14 LUFS, TP -1.5)
    final_mp3 = AUDIO_DIR / f"{ch_id}.mp3"
    cmd = [
        "ffmpeg", "-y", "-i", str(unnorm_wav),
        "-af", "loudnorm=I=-14.0:TP=-1.5:LRA=11.0",
        "-ar", str(SR), "-b:a", "192k",
        str(final_mp3)
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    unnorm_wav.unlink(missing_ok=True)
    
    # Measure exact duration
    probe_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(final_mp3)]
    res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
    dur = float(res.stdout.strip())
    final_durations[ch_id] = dur
    print(f"Mastered {ch_id}.mp3: {dur:.2f}s (-14 LUFS)")

with open(AUDIO_DIR / "durations.json", "w", encoding="utf-8") as f:
    json.dump(final_durations, f, indent=2)

print("\nFinal Mastered Durations:")
print(json.dumps(final_durations, indent=2))


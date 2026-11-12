import json
import pathlib
import shutil
import subprocess
import sys
import numpy as np
import scipy.io.wavfile as wav

sys.stdout.reconfigure(encoding='utf-8')

AUDIO_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\delete-memory")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\delete-memory")
DEATH_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer")
SFX_DIR = DEATH_DIR / "sfx"
DONT_WATCH_SFX = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch\sfx")
STICKMAN_SFX = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\stickman-life\sfx")
THOUSAND_SFX = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\thousand-words\sfx")

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

music_full = load_wav_or_mp3(DEATH_DIR / "tension_score.wav")
sfx_tick = load_wav_or_mp3(SFX_DIR / "digital_tick.wav")
sfx_heartbeat = load_wav_or_mp3(SFX_DIR / "heartbeat_fast.wav")
sfx_glitch = load_wav_or_mp3(DONT_WATCH_SFX / "glitch.wav")
sfx_alarm = load_wav_or_mp3(SFX_DIR / "red_alarm_glitch.wav")
sfx_click = load_wav_or_mp3(DONT_WATCH_SFX / "mouse_click.wav")
sfx_chime = load_wav_or_mp3(STICKMAN_SFX / "magic_chime.wav")
sfx_ding = load_wav_or_mp3(DONT_WATCH_SFX / "bell_ding.wav")
sfx_eraser = load_wav_or_mp3(STICKMAN_SFX / "eraser_rub.wav")
sfx_sub = load_wav_or_mp3(DONT_WATCH_SFX / "sub_drop.wav")
sfx_whoosh = load_wav_or_mp3(DONT_WATCH_SFX / "whoosh.wav")

def add_sfx(target, sfx, time_sec, vol=0.5):
    idx = int(time_sec * SR)
    if idx < 0 or idx >= len(target):
        return
    l = min(len(sfx), len(target) - idx)
    target[idx:idx+l] += sfx[:l] * vol

chapters_config = {
    "ch_1": {
        "raw": AUDIO_DIR / "ch_1_raw.mp3",
        "pre": 0.4,
        "post": 0.6,
        "music_vol": 0.15,
        "sfx": [
            (3.0, sfx_tick, 0.4),
            (10.5, sfx_click, 0.6),
            (14.0, sfx_eraser, 0.7),
            (17.0, sfx_ding, 0.6),
            (24.0, sfx_whoosh, 0.4)
        ]
    },
    "ch_2": {
        "raw": AUDIO_DIR / "ch_2_raw.mp3",
        "pre": 0.4,
        "post": 0.6,
        "music_vol": 0.16,
        "sfx": [
            (3.0, sfx_chime, 0.5),
            (8.5, sfx_eraser, 0.6),
            (14.0, sfx_ding, 0.5),
            (20.0, sfx_sub, 0.6),
            (26.0, sfx_heartbeat, 0.5)
        ]
    },
    "ch_3": {
        "raw": AUDIO_DIR / "ch_3_raw.mp3",
        "pre": 0.4,
        "post": 0.6,
        "music_vol": 0.18,
        "sfx": [
            (4.0, sfx_tick, 0.4),
            (9.0, sfx_heartbeat, 0.5),
            (14.0, sfx_glitch, 0.7),
            (20.0, sfx_alarm, 0.6),
            (25.0, sfx_sub, 0.6)
        ]
    },
    "ch_4": {
        "raw": AUDIO_DIR / "ch_4_raw.mp3",
        "pre": 0.4,
        "post": 0.6,
        "music_vol": 0.18,
        "sfx": [
            (2.5, sfx_whoosh, 0.5),
            (8.0, sfx_sub, 0.6),
            (15.0, sfx_chime, 0.5),
            (22.0, sfx_heartbeat, 0.6)
        ]
    },
    "ch_5": {
        "raw": AUDIO_DIR / "ch_5_raw.mp3",
        "pre": 0.4,
        "post": 0.8,
        "music_vol": 0.17,
        "sfx": [
            (1.5, sfx_alarm, 0.7),
            (7.0, sfx_heartbeat, 0.6),
            (13.0, sfx_ding, 0.5),
            (19.0, sfx_sub, 0.6)
        ]
    },
    "short": {
        "raw": AUDIO_DIR / "short_raw.mp3",
        # Zero gap for infinite seamless loop!
        "pre": 0.05,
        "post": 0.05,
        "music_vol": 0.18,
        "sfx": [
            (2.0, sfx_click, 0.6),
            (6.5, sfx_eraser, 0.6),
            (11.0, sfx_ding, 0.5),
            (16.0, sfx_glitch, 0.7),
            (22.0, sfx_sub, 0.6),
            (26.0, sfx_heartbeat, 0.6)
        ]
    }
}

final_durations = {}

for ch_id, cfg in chapters_config.items():
    print(f"\nProcessing {ch_id}...")
    voice = load_wav_or_mp3(cfg["raw"])
    voice_len = len(voice)
    
    pre_samples = int(cfg["pre"] * SR)
    post_samples = int(cfg["post"] * SR)
    total_len = pre_samples + voice_len + post_samples
    
    mix = np.zeros((total_len, 2), dtype=np.float32)
    mix[pre_samples:pre_samples+voice_len] += voice * 1.05
    
    m_len = min(len(music_full), total_len)
    mix[:m_len] += music_full[:m_len] * cfg["music_vol"]
    
    fade_len = int(0.15 * SR) if ch_id == "short" else int(0.4 * SR)
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
    
    final_mp3 = AUDIO_DIR / f"{ch_id}.mp3"
    cmd = [
        "ffmpeg", "-y", "-i", str(unnorm_wav),
        "-af", "loudnorm=I=-14.0:TP=-1.5:LRA=11.0",
        "-ar", str(SR), "-b:a", "192k",
        str(final_mp3)
    ]
    subprocess.run(cmd, capture_output=True, check=True)
    unnorm_wav.unlink(missing_ok=True)
    
    # Also sync to public_timer
    shutil.copyfile(final_mp3, PUB_TIMER_DIR / f"{ch_id}.mp3")
    
    probe_cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", str(final_mp3)]
    res = subprocess.run(probe_cmd, capture_output=True, text=True, check=True)
    dur = float(res.stdout.strip())
    final_durations[ch_id] = dur
    print(f"Mastered {ch_id}.mp3: {dur:.2f}s (-14 LUFS)")

with open(AUDIO_DIR / "durations.json", "w", encoding="utf-8") as f:
    json.dump(final_durations, f, indent=2)

with open(PUB_TIMER_DIR / "durations.json", "w", encoding="utf-8") as f:
    json.dump(final_durations, f, indent=2)

# Copy words jsons as well to public_timer
for f in AUDIO_DIR.glob("*_words.json"):
    shutil.copyfile(f, PUB_TIMER_DIR / f.name)

print("\nFinal Mastered Durations:")
print(json.dumps(final_durations, indent=2))


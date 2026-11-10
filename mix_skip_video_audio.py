import json
import pathlib
import subprocess
import sys
import numpy as np
import scipy.io.wavfile as wav

sys.stdout.reconfigure(encoding='utf-8')

AUDIO_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\skip-video")
AUDIO_DIR.mkdir(parents=True, exist_ok=True)
PUB_TIMER = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\skip-video")
PUB_TIMER.mkdir(parents=True, exist_ok=True)

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
QUIET_SYNTH = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\quiet-room\synth")
STICKMAN_SFX = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\stickman-life\sfx")

music_full = load_wav_or_mp3(DEATH_DIR / "tension_score.wav")
sfx_tinnitus = load_wav_or_mp3(QUIET_SYNTH / "tinnitus.wav")
sfx_glitch = load_wav_or_mp3(DONT_WATCH_SFX / "glitch.wav")
sfx_sub_drop = load_wav_or_mp3(DONT_WATCH_SFX / "sub_drop.wav")
sfx_whoosh = load_wav_or_mp3(DONT_WATCH_SFX / "whoosh.wav")
sfx_heartbeat = load_wav_or_mp3(DEATH_DIR / "sfx" / "heartbeat_fast.wav")
sfx_chime = load_wav_or_mp3(STICKMAN_SFX / "magic_chime.wav")

def add_sfx(target, sfx, time_sec, vol=1.0):
    start = int(time_sec * SR)
    end = min(len(target), start + len(sfx))
    sfx_len = end - start
    if sfx_len > 0:
        target[start:end] += sfx[:sfx_len] * vol

CHAPTER_CONFIG = {
    "ch_1": {
        "pre": 0.3, "post": 1.2,
        "sfx": [(0.1, sfx_glitch, 0.7), (2.0, sfx_sub_drop, 0.8), (14.0, sfx_tinnitus, 0.35), (25.0, sfx_whoosh, 0.5)]
    },
    "ch_2": {
        "pre": 0.3, "post": 1.2,
        "sfx": [(0.2, sfx_whoosh, 0.6), (7.0, sfx_heartbeat, 0.5), (15.0, sfx_glitch, 0.7), (24.0, sfx_sub_drop, 0.85)]
    },
    "ch_3": {
        "pre": 0.3, "post": 1.2,
        "sfx": [(1.0, sfx_whoosh, 0.5), (16.0, sfx_tinnitus, 0.35), (28.0, sfx_chime, 0.7)]
    },
    "ch_4": {
        "pre": 0.3, "post": 1.2,
        "sfx": [(0.2, sfx_glitch, 0.6), (8.0, sfx_heartbeat, 0.6), (18.0, sfx_sub_drop, 0.85), (26.0, sfx_chime, 0.7)]
    },
    "ch_5": {
        "pre": 0.3, "post": 1.5,
        "sfx": [(0.5, sfx_chime, 0.8), (10.0, sfx_whoosh, 0.6), (22.0, sfx_glitch, 0.6), (28.0, sfx_sub_drop, 0.75)]
    },
    "short": {
        "pre": 0.2, "post": 1.2,
        "sfx": [(0.1, sfx_glitch, 0.8), (5.0, sfx_sub_drop, 0.85), (16.0, sfx_heartbeat, 0.6), (28.0, sfx_chime, 0.8)]
    }
}

def mix_chapter(key):
    print(f"\n--- Mixing {key} ---")
    raw_path = AUDIO_DIR / f"{key}_raw.mp3"
    voice = load_wav_or_mp3(raw_path)

    cfg = CHAPTER_CONFIG[key]
    pre_samples = int(cfg["pre"] * SR)
    post_samples = int(cfg["post"] * SR)
    total_len = len(voice) + pre_samples + post_samples

    mix = np.zeros((total_len, 2), dtype=np.float32)

    # 1. Background Music (Looping tension score at subtle level)
    music_vol = 0.08
    if len(music_full) > 0:
        loops = int(np.ceil(total_len / len(music_full)))
        music_tiled = np.tile(music_full, (loops, 1))[:total_len]
        mix += music_tiled * music_vol

    # 2. SFX Foley
    for t, sfx_arr, v in cfg["sfx"]:
        add_sfx(mix, sfx_arr, cfg["pre"] + t, v * 0.4)

    # 3. Voice in the center
    mix[pre_samples:pre_samples + len(voice)] += voice * 1.0

    temp_wav = AUDIO_DIR / f"{key}_unmastered.wav"
    wav.write(str(temp_wav), SR, (np.clip(mix, -0.98, 0.98) * 32767).astype(np.int16))

    # Master to broadcast standard -14.0 LUFS
    final_wav = AUDIO_DIR / f"{key}_mixed.wav"
    cmd_master = [
        'ffmpeg', '-y', '-i', str(temp_wav),
        '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
        '-ar', '48000', '-ac', '2',
        str(final_wav)
    ]
    subprocess.run(cmd_master, check=True, capture_output=True)
    temp_wav.unlink(missing_ok=True)

    # Copy to public_timer as well
    subprocess.run(['copy', str(final_wav), str(PUB_TIMER / final_wav.name)], shell=True, check=True)

    probe = subprocess.run([
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', str(final_wav)
    ], capture_output=True, text=True, check=True)
    dur = float(probe.stdout.strip())
    frames = int(dur * 30)
    print(f"✅ {key} Mastered: {dur:.2f}s -> {frames} frames")
    return frames

if __name__ == "__main__":
    durations = {}
    for k in ["ch_1", "ch_2", "ch_3", "ch_4", "ch_5", "short"]:
        durations[k] = mix_chapter(k)
    with open(AUDIO_DIR / "durations.json", "w") as f:
        json.dump(durations, f, indent=2)
    with open(PUB_TIMER / "durations.json", "w") as f:
        json.dump(durations, f, indent=2)
    print("\n🎉 ALL SKIP VIDEO AUDIO FILES MIXED & MASTERED TO -14.0 LUFS!")


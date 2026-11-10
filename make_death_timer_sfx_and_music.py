import numpy as np
import scipy.io.wavfile as wav
import pathlib

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer\sfx")
OUT_DIR.mkdir(parents=True, exist_ok=True)
MUSIC_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer")

SR = 44100

def save_wav(path, data):
    data = np.clip(data, -0.95, 0.95)
    wav.write(str(path), SR, (data * 32767).astype(np.int16))
    print(f"Saved: {path.name} ({path.stat().st_size} bytes)")

# 1. digital_tick.wav (0.12s)
t = np.linspace(0, 0.12, int(SR * 0.12), False)
tick = np.sin(2 * np.pi * 3200 * t) * np.exp(-t * 40)
tick += 0.5 * np.sin(2 * np.pi * 4800 * t) * np.exp(-t * 60)
save_wav(OUT_DIR / "digital_tick.wav", tick)

# 2. red_alarm_glitch.wav (0.6s)
t = np.linspace(0, 0.6, int(SR * 0.6), False)
beep1 = np.sin(2 * np.pi * 880 * t) * (np.sin(2 * np.pi * 10 * t) > 0)
beep2 = np.sin(2 * np.pi * 932 * t) * (np.sin(2 * np.pi * 10 * t) > 0) # Minor 2nd dissonance
glitch = np.random.uniform(-0.15, 0.15, len(t)) * (np.sin(2 * np.pi * 20 * t) > 0.5)
alarm = (beep1 * 0.5 + beep2 * 0.5 + glitch) * np.exp(-t * 1.5)
save_wav(OUT_DIR / "red_alarm_glitch.wav", alarm)

# 3. subway_rumble.wav (3.0s)
t = np.linspace(0, 3.0, int(SR * 3.0), False)
noise = np.random.uniform(-0.5, 0.5, len(t))
# Low-pass filter noise using simple moving average
kernel = np.ones(50) / 50
noise_smooth = np.convolve(noise, kernel, mode='same')
sub = np.sin(2 * np.pi * 55 * t) * 0.6
screech = np.sin(2 * np.pi * (2400 + 400 * np.sin(2 * np.pi * 1.5 * t)) * t) * 0.25 * np.exp(-((t - 1.5)/0.8)**2)
subway = (noise_smooth * 0.5 + sub + screech) * np.minimum(1.0, t * 1.5) * np.minimum(1.0, (3.0 - t) * 1.2)
save_wav(OUT_DIR / "subway_rumble.wav", subway)

# 4. heartbeat_fast.wav (1.0s, 2 quick pulses)
t = np.linspace(0, 1.0, int(SR * 1.0), False)
def pulse(t_arr, center):
    dt = t_arr - center
    env = np.exp(-(dt**2) / (2 * (0.04**2))) * (dt >= 0)
    return (np.sin(2 * np.pi * 50 * dt) + 0.5 * np.sin(2 * np.pi * 95 * dt)) * env
hb = pulse(t, 0.1) * 0.9 + pulse(t, 0.32) * 0.7
hb += pulse(t, 0.6) * 0.9 + pulse(t, 0.82) * 0.7
save_wav(OUT_DIR / "heartbeat_fast.wav", hb)

# 5. fate_reset.wav (1.8s, shimmering chime)
t = np.linspace(0, 1.8, int(SR * 1.8), False)
freqs = [1046.5, 1318.5, 1567.98, 2093.0] # C6, E6, G6, C7
chime = np.zeros(len(t))
for i, f in enumerate(freqs):
    t_del = np.maximum(0, t - i * 0.05)
    chime += np.sin(2 * np.pi * f * t_del) * np.exp(-t_del * 3.0)
save_wav(OUT_DIR / "fate_reset.wav", chime * 0.35)

# 6. collapse_crash.wav (2.2s)
t = np.linspace(0, 2.2, int(SR * 2.2), False)
noise_c = np.random.uniform(-0.8, 0.8, len(t)) * np.exp(-t * 2.5)
sub_c = np.sin(2 * np.pi * 42 * t) * np.exp(-t * 2.0)
crash = (noise_c * 0.7 + sub_c * 0.8)
save_wav(OUT_DIR / "collapse_crash.wav", crash)

# 7. tension_score.wav (210s cinematic music)
dur = 210.0
t_total = np.linspace(0, dur, int(SR * dur), False)
music_l = np.zeros(len(t_total))
music_r = np.zeros(len(t_total))

# Chords: Dm (D, F, A), Bb (Bb, D, F), F (F, A, C), C (C, E, G)
chords = [
    ([146.83, 174.61, 220.00], 73.42),   # Dm, D2 bass
    ([116.54, 146.83, 174.61], 58.27),   # Bb, Bb1 bass
    ([174.61, 220.00, 261.63], 87.31),   # F, F2 bass
    ([130.81, 164.81, 196.00], 65.41),   # C, C2 bass
]
chord_dur = 4.0

for beat in range(int(dur / chord_dur)):
    start_sec = beat * chord_dur
    end_sec = min(dur, start_sec + chord_dur)
    s_idx = int(start_sec * SR)
    e_idx = int(end_sec * SR)
    chord_t = t_total[s_idx:e_idx] - start_sec
    chord_notes, bass_freq = chords[beat % len(chords)]
    
    # Warm bass drone
    bass = np.sin(2 * np.pi * bass_freq * chord_t) * 0.4
    
    # Piano / pad chords
    pad = np.zeros(len(chord_t))
    for f in chord_notes:
        pad += np.sin(2 * np.pi * f * chord_t) * 0.2
        pad += np.sin(2 * np.pi * f * 2 * chord_t) * 0.08
    
    # Pulse envelope
    env = (1 - np.exp(-chord_t * 6)) * np.exp(-chord_t * 0.35)
    
    layer = (bass + pad) * env
    music_l[s_idx:e_idx] += layer * 0.85
    music_r[s_idx:e_idx] += layer * 0.95

# Normalize and convert to stereo
stereo_music = np.column_stack([music_l, music_r])
stereo_music = stereo_music / (np.max(np.abs(stereo_music)) + 1e-6) * 0.45
save_wav(MUSIC_DIR / "tension_score.wav", stereo_music)
print("Finished synthesizing death-timer SFX & score!")


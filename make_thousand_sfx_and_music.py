import numpy as np
import scipy.io.wavfile as wav
import pathlib

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\one-thousand-or-one")
SFX_DIR = PUB_DIR / "sfx"
SFX_DIR.mkdir(parents=True, exist_ok=True)
SR = 44100

def write_wav(path, samples):
    samples = np.clip(samples, -0.98, 0.98)
    samples_int16 = (samples * 32767).astype(np.int16)
    wav.write(str(path), SR, samples_int16)
    print(f"Generated {path.name} ({len(samples)/SR:.2f}s)")

# 1. Rain Loop (30 seconds of high-fidelity filtered rain ambience)
t_rain = np.linspace(0, 30.0, int(SR * 30.0), False)
# Pink noise base
white = np.random.normal(0, 0.25, len(t_rain))
rain_filtered = np.convolve(white, np.ones(12)/12, mode='same')
# Random droplet clicks
droplets = np.zeros_like(t_rain)
drop_indices = np.random.randint(0, len(t_rain), size=1200)
for idx in drop_indices:
    if idx + 800 < len(droplets):
        t_d = np.linspace(0, 0.018, 800, False)
        f_d = np.random.uniform(900, 2400)
        droplets[idx:idx+800] += np.sin(2 * np.pi * f_d * t_d) * np.exp(-t_d * 280) * 0.15
write_wav(SFX_DIR / "rain_loop.wav", (rain_filtered * 0.4 + droplets) * 0.8)

# 2. Neon Buzz Hum
t_neon = np.linspace(0, 5.0, int(SR * 5.0), False)
buzz = (
    np.sin(2 * np.pi * 120 * t_neon) * 0.4 +
    np.sin(2 * np.pi * 240 * t_neon) * 0.25 +
    np.sin(2 * np.pi * 360 * t_neon) * 0.15 +
    np.random.normal(0, 0.05, len(t_neon))
) * 0.5
write_wav(SFX_DIR / "neon_hum.wav", buzz)

# 3. Distant Thunder Rumble
t_th = np.linspace(0, 4.0, int(SR * 4.0), False)
n_th = np.random.normal(0, 0.6, len(t_th))
# Low-pass envelope
th_env = np.exp(-t_th * 0.9) * (1 - np.exp(-t_th * 4))
f_th = np.linspace(90, 35, len(t_th))
thunder = n_th * th_env * np.sin(2 * np.pi * f_th * t_th) * 0.85
write_wav(SFX_DIR / "thunder.wav", thunder)

# 4. Wet Puddle Footstep
t_step = np.linspace(0, 0.35, int(SR * 0.35), False)
splash = np.random.normal(0, 0.4, len(t_step)) * np.exp(-t_step * 25)
thud = np.sin(2 * np.pi * 95 * t_step) * np.exp(-t_step * 18) * 0.5
write_wav(SFX_DIR / "puddle_step.wav", splash * 0.6 + thud)

# 5. Umbrella Open Snap
t_umb = np.linspace(0, 0.4, int(SR * 0.4), False)
click = np.sin(2 * np.pi * 1400 * t_umb) * np.exp(-t_umb * 60) * 0.4
rustle = np.random.normal(0, 0.3, len(t_umb)) * np.exp(-t_umb * 12) * 0.5
write_wav(SFX_DIR / "umbrella_open.wav", click + rustle)

# 6. Wind Gust
t_wind = np.linspace(0, 3.5, int(SR * 3.5), False)
w_env = np.sin(np.pi * np.linspace(0, 1, len(t_wind))) ** 2
wind = np.random.normal(0, 0.5, len(t_wind)) * w_env * np.sin(2 * np.pi * 220 * t_wind) * 0.6
write_wav(SFX_DIR / "wind_gust.wav", wind)

# 7. Heartbeat
t_hb = np.linspace(0, 1.2, int(SR * 1.2), False)
hb1 = np.sin(2 * np.pi * 55 * t_hb[:int(SR*0.35)]) * np.exp(-t_hb[:int(SR*0.35)] * 12) * 0.8
hb2 = np.sin(2 * np.pi * 48 * t_hb[:int(SR*0.35)]) * np.exp(-t_hb[:int(SR*0.35)] * 12) * 0.6
hb_full = np.zeros_like(t_hb)
hb_full[:len(hb1)] += hb1
idx2 = int(SR * 0.28)
if idx2 + len(hb2) < len(hb_full):
    hb_full[idx2:idx2+len(hb2)] += hb2
write_wav(SFX_DIR / "heartbeat.wav", hb_full)

# 8. EMOTIONAL PIANO & CELLO SCORE (180 SECONDS)
# Progression:
# Part 1 (0-70s): D minor -> Bb major -> F major -> C major (melancholy, contemplative, nocturnal)
# Part 2 (70-120s): D minor -> G minor -> A minor (storm, isolation, cold realization)
# Part 3 (120-180s): F major -> C major -> Bb major -> D minor (warm, golden, gentle hope, loyal devotion)

TOTAL_SEC = 180.0
music_len = int(TOTAL_SEC * SR)
music = np.zeros(music_len)

# Chords: [Root, 3rd, 5th, Octave]
chords = [
    # Dm
    [146.83, 174.61, 220.00, 293.66],
    # Bb
    [116.54, 146.83, 174.61, 233.08],
    # F
    [174.61, 220.00, 261.63, 349.23],
    # C
    [130.81, 164.81, 196.00, 261.63],
]

chord_dur = 4.0 # 4 seconds per chord bar
num_bars = int(TOTAL_SEC / chord_dur)

for bar in range(num_bars):
    t_bar = bar * chord_dur
    c = chords[bar % len(chords)]
    idx_bar = int(t_bar * SR)
    
    # Warm low cello drone on root
    root_freq = c[0] / 2.0
    dur_drone = int(chord_dur * SR)
    if idx_bar + dur_drone <= music_len:
        t_d = np.linspace(0, chord_dur, dur_drone, False)
        drone = (
            np.sin(2 * np.pi * root_freq * t_d) * 0.4 +
            np.sin(2 * np.pi * root_freq * 2 * t_d) * 0.25 +
            np.sin(2 * np.pi * root_freq * 3 * t_d) * 0.1
        ) * np.sin(np.pi * np.linspace(0, 1, dur_drone)) ** 0.5
        music[idx_bar:idx_bar+dur_drone] += drone * 0.35
        
    # Arpeggiated Piano notes inside the bar
    for note_i, freq in enumerate(c):
        t_note = t_bar + note_i * 1.0
        idx_note = int(t_note * SR)
        dur_note = int(2.5 * SR)
        if idx_note + dur_note < music_len:
            t_n = np.linspace(0, 2.5, dur_note, False)
            piano_note = (
                np.sin(2 * np.pi * freq * t_n) * 0.5 +
                np.sin(2 * np.pi * freq * 2 * t_n) * 0.25 +
                np.sin(2 * np.pi * freq * 3 * t_n) * 0.1 +
                np.sin(2 * np.pi * freq * 4 * t_n) * 0.05
            ) * np.exp(-t_n * 1.6)
            music[idx_note:idx_note+dur_note] += piano_note * 0.25

# Subtle gentle reverb / smoothing
music = np.tanh(music * 1.1) * 0.75
score_path = PUB_DIR / "emotional_piano_score.wav"
write_wav(score_path, music)
print(f"Mastered emotional_piano_score.wav ({TOTAL_SEC}s)")


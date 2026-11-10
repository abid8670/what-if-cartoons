import numpy as np
import scipy.io.wavfile as wav
import pathlib

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch\sfx")
OUT_DIR.mkdir(parents=True, exist_ok=True)
SR = 44100

def write_wav(name, samples):
    samples = np.clip(samples, -0.98, 0.98)
    samples_int16 = (samples * 32767).astype(np.int16)
    wav.write(str(OUT_DIR / name), SR, samples_int16)
    print(f"Generated {name} ({len(samples)/SR:.2f}s)")

# 1. Record Scratch (vinyl brake)
t = np.linspace(0, 0.45, int(SR * 0.45), False)
freq_mod = np.linspace(600, 40, len(t))
noise = np.random.normal(0, 0.4, len(t))
tone = np.sin(2 * np.pi * freq_mod * t)
env = np.exp(-t * 9)
scratch = (noise * 0.7 + tone * 0.5) * env
# Add rhythmic drag
drag = np.sin(2 * np.pi * 35 * t) * 0.3
write_wav("record_scratch.wav", scratch + drag * env)

# 2. Buzzer Fail (two-tone harsh square)
t_buzz = np.linspace(0, 0.5, int(SR * 0.5), False)
b1 = np.sign(np.sin(2 * np.pi * 140 * t_buzz))
b2 = np.sign(np.sin(2 * np.pi * 147 * t_buzz)) # dissonant tritone-ish
env_buzz = np.ones_like(t_buzz)
env_buzz[-int(SR * 0.05):] = np.linspace(1, 0, int(SR * 0.05))
write_wav("buzzer.wav", (b1 * 0.4 + b2 * 0.4) * env_buzz)

# 3. Mouse Click (crisp tactile snap)
t_clk = np.linspace(0, 0.04, int(SR * 0.04), False)
click = np.random.normal(0, 0.5, len(t_clk)) * np.exp(-t_clk * 250)
click += np.sin(2 * np.pi * 3200 * t_clk) * np.exp(-t_clk * 180) * 0.6
write_wav("mouse_click.wav", click)

# 4. Bubble Pop (bubbly upward chirp)
t_pop = np.linspace(0, 0.12, int(SR * 0.12), False)
f_pop = np.linspace(250, 1100, len(t_pop))
pop = np.sin(2 * np.pi * f_pop * t_pop) * np.exp(-t_pop * 35)
write_wav("pop.wav", pop * 0.8)

# 5. Whoosh Fast (air swoosh)
t_wh = np.linspace(0, 0.35, int(SR * 0.35), False)
n_wh = np.random.normal(0, 0.6, len(t_wh))
# Filter envelope
wh_env = np.sin(np.pi * np.linspace(0, 1, len(t_wh))) ** 2
f_cut = np.sin(np.pi * np.linspace(0, 1, len(t_wh))) * 1200 + 400
# Simple modulation
whoosh = n_wh * wh_env * np.sin(2 * np.pi * f_cut * t_wh) * 0.7
write_wav("whoosh.wav", whoosh)

# 6. Keyboard Clatter (series of fast clicks)
t_kb = np.linspace(0, 1.2, int(SR * 1.2), False)
kb_samples = np.zeros_like(t_kb)
click_times = [0.05, 0.12, 0.22, 0.31, 0.42, 0.51, 0.63, 0.75, 0.84, 0.96, 1.05]
for ct in click_times:
    idx = int(ct * SR)
    dur_c = int(0.03 * SR)
    if idx + dur_c < len(kb_samples):
        c_t = np.linspace(0, 0.03, dur_c, False)
        c_snd = (np.random.normal(0, 0.4, dur_c) + np.sin(2 * np.pi * 2400 * c_t) * 0.4) * np.exp(-c_t * 200)
        kb_samples[idx:idx+dur_c] += c_snd
write_wav("keyboard_clatter.wav", kb_samples * 0.7)

# 7. Bell Ding (pure crystal sine chime with harmonics)
t_bell = np.linspace(0, 1.4, int(SR * 1.4), False)
bell = (
    np.sin(2 * np.pi * 1760 * t_bell) * np.exp(-t_bell * 3.5) * 0.5 +
    np.sin(2 * np.pi * 3520 * t_bell) * np.exp(-t_bell * 6.0) * 0.3 +
    np.sin(2 * np.pi * 5280 * t_bell) * np.exp(-t_bell * 9.0) * 0.15
)
write_wav("bell_ding.wav", bell)

# 8. Sub Drop (deep cinematic impact)
t_sub = np.linspace(0, 1.5, int(SR * 1.5), False)
f_sub = np.linspace(110, 30, len(t_sub))
sub = np.sin(2 * np.pi * f_sub * t_sub) * np.exp(-t_sub * 2.2) * 0.9
write_wav("sub_drop.wav", sub)

# 9. Glitch Zap (digital bitcrushed stutter)
t_gl = np.linspace(0, 0.3, int(SR * 0.3), False)
gl = np.sign(np.sin(2 * np.pi * 440 * t_gl) + np.sin(2 * np.pi * 880 * t_gl)) * 0.3
gl *= np.random.choice([0, 1], size=len(t_gl), p=[0.2, 0.8])
gl += np.random.normal(0, 0.2, len(t_gl)) * np.exp(-t_gl * 6)
write_wav("glitch.wav", gl * 0.6)

# 10. Music Score (160 seconds of quirky, catchy, upbeat pizzicato & bass groove)
# BPM = 124 (beat = 60/124 = 0.48387s)
TOTAL_MUSIC_SEC = 160.0
music_len = int(TOTAL_MUSIC_SEC * SR)
music_track = np.zeros(music_len)
beat_dur = 60.0 / 124.0

# Bass notes: F, Ab, Bb, C (Minor pentatonic playful detective groove)
bass_freqs = [87.31, 103.83, 116.54, 130.81, 103.83, 87.31, 116.54, 98.0]
# Pluck notes
pluck_freqs = [349.23, 415.30, 466.16, 523.25, 622.25, 523.25, 415.30, 349.23]

num_beats = int(TOTAL_MUSIC_SEC / beat_dur)
for b in range(num_beats):
    t_start = b * beat_dur
    idx_start = int(t_start * SR)
    
    # Bass on every beat (staccato punch)
    bf = bass_freqs[b % len(bass_freqs)]
    dur_b = int(beat_dur * 0.7 * SR)
    if idx_start + dur_b < music_len:
        t_b = np.linspace(0, beat_dur * 0.7, dur_b, False)
        # Warm filtered square-saw bass
        bass_note = (
            np.sin(2 * np.pi * bf * t_b) * 0.5 +
            np.sin(2 * np.pi * bf * 2 * t_b) * 0.3 +
            np.sin(2 * np.pi * bf * 3 * t_b) * 0.1
        ) * np.exp(-t_b * 7.0)
        music_track[idx_start:idx_start+dur_b] += bass_note * 0.45
        
    # High pizzicato pluck on off-beats
    if b % 2 == 1:
        pf = pluck_freqs[(b * 3) % len(pluck_freqs)]
        dur_p = int(beat_dur * 0.5 * SR)
        if idx_start + dur_p < music_len:
            t_p = np.linspace(0, beat_dur * 0.5, dur_p, False)
            pluck_note = (
                np.sin(2 * np.pi * pf * t_p) * 0.5 +
                np.sin(2 * np.pi * pf * 2.76 * t_p) * 0.2
            ) * np.exp(-t_p * 14.0)
            music_track[idx_start:idx_start+dur_p] += pluck_note * 0.28
            
    # Hi-hat tick every quarter beat
    for sub_tick in range(4):
        t_sub_tick = t_start + sub_tick * (beat_dur / 4.0)
        idx_tick = int(t_sub_tick * SR)
        dur_tick = int(0.02 * SR)
        if idx_tick + dur_tick < music_len:
            t_k = np.linspace(0, 0.02, dur_tick, False)
            hihat = np.random.normal(0, 0.2, dur_tick) * np.exp(-t_k * 220)
            vol = 0.12 if sub_tick % 2 == 0 else 0.07
            music_track[idx_tick:idx_tick+dur_tick] += hihat * vol

# Gentle master limiter
music_track = np.tanh(music_track * 1.2) * 0.8
music_path = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch\quirky_groove_score.wav")
samples_int16 = (music_track * 32767).astype(np.int16)
wav.write(str(music_path), SR, samples_int16)
print(f"Generated quirky_groove_score.wav ({TOTAL_MUSIC_SEC:.1f}s)")


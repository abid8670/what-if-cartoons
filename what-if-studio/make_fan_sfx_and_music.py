import os
import pathlib
import numpy as np
import scipy.io.wavfile as wavfile

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\fan-off-ammi")
SFX_DIR = PUB_DIR / "sfx"
SFX_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_RATE = 44100

def save_wav(filename, samples):
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)
    wavfile.write(filename, SAMPLE_RATE, int_samples)
    print(f"Saved: {filename} ({len(samples)/SAMPLE_RATE:.2f}s)")

# 1. Funny Cartoon Background Music (Upbeat Pizzicato & Xylophone in C Major)
def gen_comedy_music(duration=75.0):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    # BPM = 130
    bpm = 130
    beat_dur = 60.0 / bpm
    
    # Melody notes: C4, E4, G4, A4, G4, E4, D4, C4 playful progression
    c_maj = [261.63, 329.63, 392.00, 440.00, 392.00, 329.63, 293.66, 261.63]
    music = np.zeros_like(t)
    
    # Walking bass (plucked pizzicato double bass)
    bass_notes = [130.81, 164.81, 196.00, 146.83] # C3, E3, G3, D3
    for i in range(int(duration / beat_dur)):
        t_start = i * beat_dur
        idx_start = int(t_start * SAMPLE_RATE)
        note_dur = beat_dur * 0.8
        note_len = int(note_dur * SAMPLE_RATE)
        if idx_start + note_len > len(t):
            break
        
        # Bass note
        b_freq = bass_notes[i % len(bass_notes)]
        t_note = np.linspace(0, note_dur, note_len, False)
        # Fast plucked envelope
        env_b = np.exp(-t_note * 9.0)
        bass_wave = (np.sin(2 * np.pi * b_freq * t_note) + 0.3 * np.sin(4 * np.pi * b_freq * t_note)) * env_b * 0.28
        music[idx_start:idx_start + note_len] += bass_wave
        
        # Xylophone playful top note on every half beat
        if i % 2 == 0:
            m_freq = c_maj[(i // 2) % len(c_maj)]
            t_m = np.linspace(0, beat_dur * 0.5, int(beat_dur * 0.5 * SAMPLE_RATE), False)
            env_m = np.exp(-t_m * 14.0)
            xylo_wave = (np.sin(2 * np.pi * m_freq * t_m) + 0.5 * np.sin(4 * np.pi * m_freq * t_m)) * env_m * 0.22
            music[idx_start:idx_start + len(xylo_wave)] += xylo_wave

    return music * 0.65

# 2. Snoring Loop
def gen_snore(duration=4.0):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    # Slow breathing cycle (inbreath low buzz, outbreath sigh)
    cycle = 2.0
    phase = (t % cycle) / cycle
    # Inhale: 0.0 to 0.4, Exhale: 0.4 to 0.8, Rest: 0.8 to 1.0
    mod = np.where(phase < 0.4, np.sin(np.pi * phase / 0.4), 
          np.where(phase < 0.8, 0.5 * np.sin(np.pi * (phase - 0.4) / 0.4), 0.0))
    buzz = np.sin(2 * np.pi * 65.0 * t) * (1.0 + 0.8 * np.sin(2 * np.pi * 32.0 * t))
    return buzz * mod * 0.35

# 3. Switch Click (Sharp Snap)
def gen_switch_click():
    dur = 0.15
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    snap = np.sin(2 * np.pi * 1800 * t) * np.exp(-t * 60.0) + (np.random.rand(len(t)) - 0.5) * np.exp(-t * 70.0)
    return snap * 0.9

# 4. Dramatic Vine Boom
def gen_vine_boom():
    dur = 1.8
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    freq = np.linspace(80, 25, len(t))
    env = np.exp(-t * 3.5)
    boom = np.sin(2 * np.pi * freq * t) * env
    # Add subtle sub distortion
    boom = np.clip(boom * 1.5, -0.9, 0.9)
    return boom * 0.85

# 5. Fan Slowdown (Electric whine descending from 400Hz to 0Hz)
def gen_fan_slowdown(duration=4.5):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    freq = 320.0 * np.exp(-t * 0.9)
    # Modulated whirring sound of spinning blades
    blade_rate = 18.0 * np.exp(-t * 0.8)
    whir = np.sin(2 * np.pi * freq * t) * (0.6 + 0.4 * np.sin(2 * np.pi * blade_rate * t))
    wind = (np.random.rand(len(t)) - 0.5) * 0.25 * np.exp(-t * 0.6)
    return (whir + wind) * 0.4

# 6. Heatwave Sizzle (Frying pan sizzling)
def gen_sizzle(duration=3.5):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    noise = np.random.randn(len(t))
    # High frequency crackle
    crackle = np.where(np.random.rand(len(t)) > 0.98, noise * 2.5, noise * 0.2)
    env = np.minimum(t * 1.5, 1.0) * np.exp(-(duration - t) * 0.1)
    return crackle * env * 0.3

# 7. Spring Boing
def gen_boing():
    dur = 0.7
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    f0 = 250.0 + 350.0 * np.sin(2 * np.pi * 9.0 * t)
    wave = np.sin(2 * np.pi * f0 * t) * np.exp(-t * 5.0)
    return wave * 0.6

# 8. Stealth Tip-Toe (Cartoon plink footsteps)
def gen_tip_toe():
    dur = 2.0
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    plinks = np.zeros_like(t)
    steps = [0.1, 0.6, 1.1, 1.6]
    notes = [587.33, 659.25, 698.46, 783.99]
    for step_t, note_f in zip(steps, notes):
        idx = int(step_t * SAMPLE_RATE)
        step_len = int(0.2 * SAMPLE_RATE)
        t_step = np.linspace(0, 0.2, step_len, False)
        plinks[idx:idx + step_len] += np.sin(2 * np.pi * note_f * t_step) * np.exp(-t_step * 25.0) * 0.45
    return plinks

print("Synthesizing SFX and Comedy Music...")
save_wav(str(PUB_DIR / "comedy_bgm.wav"), gen_comedy_music(75.0))
save_wav(str(SFX_DIR / "snore.wav"), gen_snore(4.0))
save_wav(str(SFX_DIR / "switch_click.wav"), gen_switch_click())
save_wav(str(SFX_DIR / "vine_boom.wav"), gen_vine_boom())
save_wav(str(SFX_DIR / "fan_slowdown.wav"), gen_fan_slowdown(4.5))
save_wav(str(SFX_DIR / "sizzle.wav"), gen_sizzle(3.5))
save_wav(str(SFX_DIR / "boing.wav"), gen_boing())
save_wav(str(SFX_DIR / "tip_toe.wav"), gen_tip_toe())
print("All comedy SFX and music generated!")


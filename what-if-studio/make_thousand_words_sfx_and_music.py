import os
import pathlib
import numpy as np
import scipy.io.wavfile as wavfile

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\thousand-words")
SFX_DIR = PUB_DIR / "sfx"
SFX_DIR.mkdir(parents=True, exist_ok=True)
SAMPLE_RATE = 44100

def save_wav(filename, samples):
    samples = np.clip(samples, -1.0, 1.0)
    int_samples = (samples * 32767).astype(np.int16)
    wavfile.write(filename, SAMPLE_RATE, int_samples)
    print(f"Saved: {filename} ({len(samples)/SAMPLE_RATE:.2f}s)")

# 1. Emotional Cinematic Piano & Cello Score (Am - F - C - G progression, 180s)
def gen_emotional_score(duration=180.0):
    t = np.linspace(0, duration, int(SAMPLE_RATE * duration), False)
    music = np.zeros_like(t)
    
    # Chord cycle: Am (220, 261.63, 329.63), F (174.61, 220, 261.63), C (130.81, 164.81, 196.00), G (196.00, 246.94, 293.66)
    chords = [
        ([110.0, 220.0, 261.63, 329.63], [440.0, 523.25, 659.25]), # Am
        ([87.31, 174.61, 220.0, 261.63], [349.23, 440.0, 523.25]),  # F
        ([65.41, 130.81, 164.81, 196.0], [261.63, 329.63, 392.0]),  # C
        ([98.0, 196.0, 246.94, 293.66], [392.0, 493.88, 587.33])    # G
    ]
    chord_dur = 4.0 # 4 seconds per chord
    
    total_chords = int(duration / chord_dur)
    for c_idx in range(total_chords):
        t_start = c_idx * chord_dur
        idx_start = int(t_start * SAMPLE_RATE)
        bass_notes, melody_notes = chords[c_idx % len(chords)]
        
        # Cello / Warm Pad layer (slow attack, sustained)
        t_pad = np.linspace(0, chord_dur, int(chord_dur * SAMPLE_RATE), False)
        env_pad = np.sin(np.pi * t_pad / chord_dur) ** 1.5
        pad_wave = np.zeros_like(t_pad)
        for bn in bass_notes:
            pad_wave += np.sin(2 * np.pi * bn * t_pad) + 0.3 * np.sin(4 * np.pi * bn * t_pad)
        
        if idx_start + len(pad_wave) <= len(music):
            music[idx_start:idx_start + len(pad_wave)] += pad_wave * env_pad * 0.12
            
        # Piano Arpeggios (Gentle falling droplets)
        sub_dur = chord_dur / len(melody_notes)
        for m_idx, mn in enumerate(melody_notes):
            t_m_start = t_start + m_idx * sub_dur
            idx_m = int(t_m_start * SAMPLE_RATE)
            t_note = np.linspace(0, sub_dur * 1.5, int(sub_dur * 1.5 * SAMPLE_RATE), False)
            env_note = np.exp(-t_note * 4.5)
            piano_wave = (np.sin(2 * np.pi * mn * t_note) + 
                          0.4 * np.sin(4 * np.pi * mn * t_note) + 
                          0.15 * np.sin(6 * np.pi * mn * t_note)) * env_note * 0.18
            if idx_m + len(piano_wave) <= len(music):
                music[idx_m:idx_m + len(piano_wave)] += piano_wave
                
    return music * 0.75

# 2. Digital Counter Tick / Chirp
def gen_counter_tick():
    dur = 0.08
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    beep = np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 80.0)
    return beep * 0.6

# 3. Warning Glitch / Red Alert
def gen_warning_glitch():
    dur = 0.6
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    mod = np.sin(2 * np.pi * 40 * t)
    f = 440 + 220 * mod
    glitch = np.sin(2 * np.pi * f * t) * np.exp(-t * 4.0)
    return glitch * 0.7

# 4. Heartbeat
def gen_heartbeat():
    dur = 1.2
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    pulse = np.zeros_like(t)
    for offset in [0.0, 0.28]:
        idx = int(offset * SAMPLE_RATE)
        t_sub = np.linspace(0, 0.2, int(0.2 * SAMPLE_RATE), False)
        env = np.sin(np.pi * t_sub / 0.2) ** 2
        pulse[idx:idx + len(t_sub)] += np.sin(2 * np.pi * 55 * t_sub) * env
    return pulse * 0.85

# 5. Rain & Thunder Ambience (4.0s)
def gen_rain_rumble():
    dur = 4.0
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    noise = np.random.randn(len(t)) * 0.15
    rumble = np.sin(2 * np.pi * 45 * t) * (np.sin(2 * np.pi * 0.5 * t) ** 2) * 0.25
    return (noise + rumble) * 0.6

# 6. Emotional Chime / Resolution
def gen_heart_chime():
    dur = 3.0
    t = np.linspace(0, dur, int(SAMPLE_RATE * dur), False)
    chime = (np.sin(2 * np.pi * 880 * t) + 0.5 * np.sin(2 * np.pi * 1320 * t)) * np.exp(-t * 1.5)
    return chime * 0.5

print("Synthesizing SFX and Soundtrack for Thousand Words...")
save_wav(str(PUB_DIR / "emotional_score.wav"), gen_emotional_score(180.0))
save_wav(str(SFX_DIR / "counter_tick.wav"), gen_counter_tick())
save_wav(str(SFX_DIR / "warning_glitch.wav"), gen_warning_glitch())
save_wav(str(SFX_DIR / "heartbeat.wav"), gen_heartbeat())
save_wav(str(SFX_DIR / "rain_rumble.wav"), gen_rain_rumble())
save_wav(str(SFX_DIR / "heart_chime.wav"), gen_heart_chime())
print("All sound assets generated!")


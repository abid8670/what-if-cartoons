import subprocess, pathlib, sys

sys.stdout.reconfigure(encoding='utf-8')

studio_dir = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
pub_dir = studio_dir / "public/ancient-pleasure"
sfx_lib = studio_dir / "library/sfx"
bgm = sfx_lib / "music-4cdabe20.mp3"

# SFX Cue Map (seconds from chapter start): [(time_sec, sfx_name, volume), ...]
CHAPTER_SFX = {
    1: [
        (0.2, "roof_wind-cedc7edc.mp3", 0.55),     # Cold ice age blizzard wind
        (2.4, "cat_yowl-7cf1658d.mp3", 0.70),      # Saber-tooth snarling roar!
        (3.0, "step-60144e17.mp3", 0.60),          # Running footstep
        (3.6, "step-60144e17.mp3", 0.60),          # Running footstep
        (4.2, "gasp-372b408b.mp3", 0.65),          # Mo screams HELP!
        (6.8, "fall_whoosh-07978690.mp3", 0.50),   # Whoosh transition to modern office
        (8.0, "buzzer-0dc58156.mp3", 0.45),        # Modern burnout buzzer
        (10.5, "clock_back-d5e3cec1.mp3", 0.50),   # 40-60 hours ticking clock
        (16.5, "cookie_crunch-265c6a17.mp3", 0.65),# Roasted mammoth crunch bite
        (22.0, "bulb_pop-2ea0e2d7.mp3", 0.55),     # Free time idea pop!
        (28.5, "switch_off-9588c15a.mp3", 0.55),   # No Netflix switch off
        (33.0, "title_boom-91f4f23e.mp3", 0.75),   # What If Title reveal boom!
    ],
    2: [
        (1.2, "pop-99ba70e6.mp3", 0.50),           # Fermenting berries pop
        (5.2, "gulp-c9154a14.mp3", 0.65),          # Caveman takes a bite & gulps
        (8.0, "dizzy-46ba6f40.mp3", 0.65),         # Dizzy spinning wobble
        (16.0, "clink-169430e3.mp3", 0.55),        # 9,000 yr Jiahu pottery clink
        (24.0, "title_boom-91f4f23e.mp3", 0.65),   # Gobekli Tepe stone vat thud
        (31.5, "clink-169430e3.mp3", 0.60),        # Cheers clinking mugs
        (33.5, "laugh-7d80a59f.mp3", 0.65),        # Prehistoric block party cheers & laughter!
    ],
    3: [
        (1.5, "pop-99ba70e6.mp3", 0.55),           # Prehistoric dating app match flame
        (9.0, "crack-3cbd3c57.mp3", 0.65),         # Pounding stone mortar aphrodisiacs
        (18.0, "ghost_shimmer-e61fce51.mp3", 0.60),# 40,000 yr vulture bone flute melody
        (28.0, "sparkle-595dbfb7.mp3", 0.60),      # Venus of Willendorf sparkle
        (38.0, "laugh-7d80a59f.mp3", 0.55),        # Campfire cuddle warm laughter
    ],
    4: [
        (2.0, "crack-3cbd3c57.mp3", 0.70),         # Knucklebones rattle & toss!
        (6.0, "ding-a322cf81.mp3", 0.60),          # Lucky roll ding!
        (13.0, "select_draw-234903d8.mp3", 0.55),  # Sliding arrowheads and furs
        (22.0, "copy_click-6f20900a.mp3", 0.60),   # Royal Game of Ur board move
        (31.5, "buzzer-0dc58156.mp3", 0.55),       # "You cheated, Mo!" buzzer
        (33.0, "gasp-372b408b.mp3", 0.60),         # Cheating caught gasp!
    ],
    5: [
        (0.5, "room_tone-e711a45f.mp3", 0.50),     # Dark underground cavern atmosphere
        (6.0, "power_hum-ae629acb.mp3", 0.55),     # Flickering torch flame whoosh
        (11.0, "fall_whoosh-07978690.mp3", 0.60),  # Galloping bison animation whoosh!
        (18.5, "cat_yowl-7cf1658d.mp3", 0.65),     # Storyteller roaring beast imitation!
        (26.5, "sparkle-595dbfb7.mp3", 0.70),      # Dopamine fireworks bursting in brain!
    ],
    6: [
        (0.5, "roof_wind-cedc7edc.mp3", 0.60),     # Brutal Ice Age winter blizzard wind
        (7.0, "laugh-7d80a59f.mp3", 0.65),         # Warm tribal laughter & bonding
        (17.0, "clink-169430e3.mp3", 0.60),        # Ancient to modern toast clink
        (26.0, "ding-a322cf81.mp3", 0.70),         # Subscribe bell ringing ding!
    ]
}

# 14-Second Short SFX
SHORT_SFX = [
    (0.5, "roof_wind-cedc7edc.mp3", 0.50),
    (2.0, "cat_yowl-7cf1658d.mp3", 0.65),
    (4.5, "clink-169430e3.mp3", 0.60),
    (7.5, "crack-3cbd3c57.mp3", 0.70),
    (10.5, "ding-a322cf81.mp3", 0.70),
]

print("=== MIXING RICH SOUND EFFECTS + BGM + VOICE FOR ALL CHAPTERS ===")

def mix_chapter(ch_idx, cues, in_voice, out_mixed, max_dur=None):
    dur = float(subprocess.check_output([
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", str(in_voice)
    ]).decode().strip())
    
    if max_dur:
        dur = min(dur, max_dur)
    
    inputs = ["-i", str(in_voice), "-i", str(bgm)]
    filter_parts = [
        f"[0:a]volume=1.0[voice];",
        f"[1:a]aloop=loop=-1:size=2e+09,volume=0.11,atrim=0:{dur+0.5}[music];"
    ]
    mix_labels = ["[voice]", "[music]"]
    
    sfx_count = len(cues)
    for k, (t_sec, sfx_name, vol) in enumerate(cues):
        sfx_path = sfx_lib / sfx_name
        inputs.extend(["-i", str(sfx_path)])
        idx = 2 + k
        delay_ms = int(t_sec * 1000)
        label = f"sfx{k}"
        filter_parts.append(
            f"[{idx}:a]volume={vol},adelay={delay_ms}|{delay_ms}[{label}];"
        )
        mix_labels.append(f"[{label}]")
    
    filter_complex = (
        "".join(filter_parts) +
        f"{''.join(mix_labels)}amix=inputs={len(mix_labels)}:duration=first:dropout_transition=2[out]"
    )
    
    cmd = [
        "ffmpeg", "-y", *inputs,
        "-filter_complex", filter_complex,
        "-map", "[out]",
        "-ar", "44100", "-ac", "2",
        str(out_mixed)
    ]
    subprocess.run(cmd, check=True)
    print(f"Mixed Chapter {ch_idx}: {out_mixed.name} with {sfx_count} SFX cues ({dur:.2f}s)")

# 1. Mix all 6 chapters
for i in range(1, 7):
    v = pub_dir / f"ch_{i}.mp3"
    out = pub_dir / f"ch_{i}_mixed.wav"
    cues = CHAPTER_SFX.get(i, [])
    mix_chapter(i, cues, v, out)

# 2. Mix Short
v_short = pub_dir / "voice_short.mp3"
out_short = pub_dir / "short_mixed.wav"
mix_chapter("Short", SHORT_SFX, v_short, out_short, max_dur=14.0)

print("\nSUCCESS: All chapter audios mixed with rich sound effects!")

import os, pathlib, subprocess, sys

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
BRAIN_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

TESTS = [
    ("DontWatch-Ch1", 150, "test_dont_watch_ch1.png"),
    ("DontWatch-Ch1", 780, "test_dont_watch_ch1_elephant.png"),
    ("DontWatch-Ch2", 250, "test_dont_watch_ch2.png"),
    ("DontWatch-Ch3", 450, "test_dont_watch_ch3_comment.png"),
    ("DontWatch-Ch4", 650, "test_dont_watch_ch4_subscribe.png"),
]

for comp_id, frame, out_name in TESTS:
    out_path = BRAIN_DIR / out_name
    cmd = [
        'npx.cmd', 'remotion', 'still', 'src/index.ts', comp_id,
        str(out_path), f'--frame={frame}', '--log', 'error'
    ]
    print(f"Rendering {comp_id} at frame {frame}...")
    subprocess.run(cmd, cwd=STUDIO, env=ENV, check=True)
    print(f"  Saved {out_name} ({out_path.stat().st_size} bytes)")

print("\nAll test stills rendered successfully!")


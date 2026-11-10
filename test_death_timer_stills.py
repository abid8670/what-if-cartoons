import os
import pathlib
import subprocess
import sys

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

TESTS = [
    ('Timer-Ch1', 200, 'test_timer_ch1.png'),
    ('Timer-Ch2', 600, 'test_timer_ch2.png'),
    ('Timer-Ch3', 400, 'test_timer_ch3.png'),
    ('Timer-Ch4', 500, 'test_timer_ch4.png'),
    ('Timer-Ch5', 800, 'test_timer_ch5.png'),
]

for comp_id, frame_num, out_name in TESTS:
    out_path = BRAIN / out_name
    print(f"Rendering still: {comp_id} @ frame {frame_num} -> {out_name}...")
    cmd = [
        'npx.cmd', 'remotion', 'still', 'src/index-timer.ts', comp_id,
        str(out_path), f'--frame={frame_num}', '--log=error'
    ]
    res = subprocess.run(cmd, cwd=STUDIO, env=ENV, capture_output=True, text=True)
    if res.returncode == 0:
        print(f"✅ Rendered {out_name} ({out_path.stat().st_size} bytes)")
    else:
        print(f"❌ Failed {out_name}:", res.stderr)

print("Finished rendering all test stills!")


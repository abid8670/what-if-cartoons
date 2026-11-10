import os
import subprocess
import sys

brain_dir = r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063"
cwd = r"D:\AI-Cartoons\what-if-studio"

stills = [
    ("Thousand-Ch1", 150, os.path.join(brain_dir, "test_thousand_ch1.png")),
    ("Thousand-Ch2", 200, os.path.join(brain_dir, "test_thousand_ch2.png")),
    ("Thousand-Ch3", 300, os.path.join(brain_dir, "test_thousand_ch3.png")),
    ("Thousand-Ch4", 450, os.path.join(brain_dir, "test_thousand_ch4.png")),
    ("Thousand-Ch5", 500, os.path.join(brain_dir, "test_thousand_ch5.png")),
]

env = os.environ.copy()
env["TEMP"] = r"D:\temp"
env["TMP"] = r"D:\temp"

for comp_id, frame, out_path in stills:
    print(f"Rendering still for {comp_id} at frame {frame} -> {out_path}...")
    cmd = [
        "npx.cmd", "remotion", "still",
        comp_id,
        out_path,
        f"--frame={frame}",
        "--gl=angle"
    ]
    res = subprocess.run(cmd, cwd=cwd, env=env, capture_output=True, text=True)
    if res.returncode != 0:
        print(f"ERROR rendering {comp_id}:\n{res.stderr}\n{res.stdout}")
        sys.exit(1)
    else:
        print(f"SUCCESS: {comp_id} rendered ({os.path.getsize(out_path)} bytes)")

print("ALL STILLS RENDERED PERFECTLY!")


import os
import pathlib
import subprocess
import sys
import shutil

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "death-timer"
OUT_DIR = STUDIO / "out" / "death-timer"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

# Copy thumbnails to out dir
shutil.copyfile(PUB_DIR / "thumbnail.jpg", OUT_DIR / "thumbnail.jpg")
shutil.copyfile(PUB_DIR / "thumbnail_short.jpg", OUT_DIR / "thumbnail_short.jpg")

def render_chunked(comp_id, final_mp4_name, total_frames, split_at=700):
    final_path = OUT_DIR / final_mp4_name
    if final_path.exists() and final_path.stat().st_size > 1000000:
        print(f"✅ {final_mp4_name} already exists ({final_path.stat().st_size} bytes)")
        return final_path

    if total_frames <= split_at:
        print(f"\n--- Rendering {comp_id} (0-{total_frames - 1}) ---")
        cmd = [
            'npx.cmd', 'remotion', 'render', 'src/index-timer.ts', comp_id,
            f'out/death-timer/{final_mp4_name}', '--public-dir=public_timer',
            '--concurrency=1'
        ]
        subprocess.run(cmd, cwd=STUDIO, env=ENV, check=True)
        return final_path

    # Split into 2 chunks
    p1_name = f"{final_mp4_name.replace('.mp4', '')}_p1.mp4"
    p2_name = f"{final_mp4_name.replace('.mp4', '')}_p2.mp4"
    p1_path = OUT_DIR / p1_name
    p2_path = OUT_DIR / p2_name

    mid = total_frames // 2
    if not p1_path.exists() or p1_path.stat().st_size < 500000:
        print(f"\n--- Rendering {comp_id} Part 1 (0-{mid}) ---")
        cmd_p1 = [
            'npx.cmd', 'remotion', 'render', 'src/index-timer.ts', comp_id,
            f'out/death-timer/{p1_name}', '--public-dir=public_timer',
            '--concurrency=1', f'--frames=0-{mid}'
        ]
        subprocess.run(cmd_p1, cwd=STUDIO, env=ENV, check=True)

    if not p2_path.exists() or p2_path.stat().st_size < 500000:
        print(f"\n--- Rendering {comp_id} Part 2 ({mid + 1}-{total_frames - 1}) ---")
        cmd_p2 = [
            'npx.cmd', 'remotion', 'render', 'src/index-timer.ts', comp_id,
            f'out/death-timer/{p2_name}', '--public-dir=public_timer',
            '--concurrency=1', f'--frames={mid + 1}-{total_frames - 1}'
        ]
        subprocess.run(cmd_p2, cwd=STUDIO, env=ENV, check=True)

    # Concat
    concat_txt = OUT_DIR / f"concat_{final_mp4_name.replace('.mp4', '')}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        f.write(f"file '{p1_path.name}'\n")
        f.write(f"file '{p2_path.name}'\n")

    cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(final_path)]
    subprocess.run(cmd_concat, check=True)
    print(f"✨ Merged {final_mp4_name} ({final_path.stat().st_size} bytes)")
    return final_path

print("==================================================")
print("🎬 DEATH TIMER COMPLETE PIPELINE")
print("==================================================")

# 1. RENDER & UPLOAD SHORT
print("\n>>> STEP 1: MOBILE SHORT")
short_mobile = OUT_DIR / "timer_short_mobile.mp4"
if not short_mobile.exists() or short_mobile.stat().st_size < 1000000:
    subprocess.run(['python', '-u', r'D:\AI-Cartoons\render_short_chunks.py'], check=True)
else:
    print("Short mobile already exists!")

# 2. RENDER 5 CHAPTERS
print("\n>>> STEP 2: RENDER 5 CHAPTERS")
ch1 = render_chunked('Timer-Ch1', 'ch_1.mp4', 943, split_at=600)
ch2 = render_chunked('Timer-Ch2', 'ch_2.mp4', 1218, split_at=700)
ch3 = render_chunked('Timer-Ch3', 'ch_3.mp4', 957, split_at=600)
ch4 = render_chunked('Timer-Ch4', 'ch_4.mp4', 1575, split_at=800)
ch5 = render_chunked('Timer-Ch5', 'ch_5.mp4', 1444, split_at=750)

# 3. CONCATENATE CHAPTERS
print("\n>>> STEP 3: CONCATENATE FULL EPISODE")
main_raw = OUT_DIR / "timer_main_raw.mp4"
main_final = OUT_DIR / "timer_main_final.mp4"

concat_all = OUT_DIR / "concat_all_chapters.txt"
with open(concat_all, "w", encoding="utf-8") as f:
    for ch in [ch1, ch2, ch3, ch4, ch5]:
        f.write(f"file '{ch.name}'\n")

cmd_concat_main = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_all), '-c', 'copy', str(main_raw)]
subprocess.run(cmd_concat_main, check=True)

# 4. MASTER AUDIO
print("\n>>> STEP 4: MASTER AUDIO TO BROADCAST -14.0 LUFS")
cmd_master = [
    'ffmpeg', '-y', '-i', str(main_raw),
    '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
    '-c:v', 'copy',
    '-c:a', 'aac', '-b:a', '256k',
    '-movflags', '+faststart',
    str(main_final)
]
subprocess.run(cmd_master, check=True)
print(f"🎉 FULL EPISODE MASTER READY: {main_final} ({main_final.stat().st_size} bytes)")

# 5. UPLOAD TO YOUTUBE
print("\n>>> STEP 5: UPLOAD FULL EPISODE TO YOUTUBE")
try:
    subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_timer_main.py'], check=True)
except Exception as e:
    print(f"Main upload exception: {e}")

print("==================================================")
print("✅ ALL STEPS COMPLETED!")
print("==================================================")


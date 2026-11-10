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
print("✅ Thumbnails copied to OUT_DIR.")

def render_chunks(comp_id, final_name, total_frames, chunk_size=250):
    final_path = OUT_DIR / final_name
    if final_path.exists() and final_path.stat().st_size > 1000000:
        print(f"✅ {final_name} already exists ({final_path.stat().st_size} bytes)")
        return final_path

    chunks = []
    chunk_idx = 0
    for start in range(0, total_frames, chunk_size):
        end = min(total_frames - 1, start + chunk_size - 1)
        chunk_file = OUT_DIR / f"{final_path.stem}_part_{chunk_idx}_{start}_{end}.mp4"
        chunk_idx += 1

        print(f"\n--- [{comp_id}] Rendering frames {start}-{end} ({end - start + 1} frames) ---")
        if not chunk_file.exists() or chunk_file.stat().st_size < 300000:
            cmd = [
                'npx.cmd', 'remotion', 'render', 'src/index-timer.ts', comp_id,
                f"out/death-timer/{chunk_file.name}",
                '--public-dir=public_timer',
                '--concurrency=1',
                f'--frames={start}-{end}'
            ]
            subprocess.run(cmd, cwd=STUDIO, env=ENV, check=True)
            print(f"Rendered chunk: {chunk_file.name} ({chunk_file.stat().st_size} bytes)")
        else:
            print(f"Chunk already exists: {chunk_file.name}")
        chunks.append(chunk_file)

    print(f"\n--- Stitching {len(chunks)} chunks into {final_name} ---")
    concat_txt = OUT_DIR / f"concat_{final_path.stem}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in chunks:
            f.write(f"file '{c.name}'\n")

    cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(final_path)]
    subprocess.run(cmd_concat, check=True)
    print(f"🎉 Fully stitched {final_name} ({final_path.stat().st_size} bytes)")

    # Clean intermediate chunk files
    for c in chunks:
        try:
            c.unlink(missing_ok=True)
        except Exception:
            pass
    try:
        concat_txt.unlink(missing_ok=True)
    except Exception:
        pass

    return final_path

print("==================================================")
print("🎬 SAFE DEATH TIMER COMPLETE RENDER & UPLOAD PIPELINE")
print("==================================================")

# ----------------------------------------------------
# 1. RENDER VERTICAL SHORT (951 frames in 250-frame chunks)
# ----------------------------------------------------
short_raw = OUT_DIR / "short_raw.mp4"
short_mobile = OUT_DIR / "timer_short_mobile.mp4"

if not short_mobile.exists() or short_mobile.stat().st_size < 1000000:
    render_chunks('Timer-Short', 'short_raw.mp4', 951, chunk_size=250)

    print("\n--- Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
    filter_complex = (
        '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
        '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xEF4444[fg];'
        '[bg][fg]overlay=0:(H-h)/2[comp];'
        '[comp]drawtext=text=\'SEEING EVERYONE\\\'S DEATH TIMER? ⏳💀\':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=230:'
        'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
        'drawtext=text=\'WOULD YOU LOOK AT YOUR OWN TIMER? 👇\':fontcolor=0xFDE047:fontsize=36:x=(w-text_w)/2:y=1610:'
        'box=1:boxcolor=0x0F172A@0.92:boxborderw=16[outv]'
    )
    cmd_mobile = [
        'ffmpeg', '-y', '-i', str(short_raw),
        '-filter_complex', filter_complex,
        '-map', '[outv]', '-map', '0:a',
        '-af', 'loudnorm=I=-14.0:TP=-1.5:LRA=11.0',
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '19',
        '-c:a', 'aac', '-b:a', '256k',
        '-movflags', '+faststart',
        str(short_mobile)
    ]
    subprocess.run(cmd_mobile, check=True)
    print(f"✨ Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")

    # Upload Short immediately
    print("\n--- 🚀 Uploading Mobile Short to YouTube ---")
    try:
        subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_timer_short.py'], check=True)
    except Exception as e:
        print(f"Short upload exception: {e}")
else:
    print("Mobile short already completed!")

# ----------------------------------------------------
# 2. RENDER CHAPTERS 1 TO 5 (FULL EPISODE)
# ----------------------------------------------------
print("\n>>> RENDERING CHAPTERS 1 TO 5 <<<")
ch1 = render_chunks('Timer-Ch1', 'ch_1.mp4', 943, chunk_size=250)
ch2 = render_chunks('Timer-Ch2', 'ch_2.mp4', 1218, chunk_size=250)
ch3 = render_chunks('Timer-Ch3', 'ch_3.mp4', 957, chunk_size=250)
ch4 = render_chunks('Timer-Ch4', 'ch_4.mp4', 1575, chunk_size=250)
ch5 = render_chunks('Timer-Ch5', 'ch_5.mp4', 1444, chunk_size=250)

# ----------------------------------------------------
# 3. CONCATENATE CHAPTERS & MASTER AUDIO
# ----------------------------------------------------
main_raw = OUT_DIR / "timer_main_raw.mp4"
main_final = OUT_DIR / "timer_main_final.mp4"

print("\n--- Concatenating All Chapters into timer_main_raw.mp4 ---")
concat_all = OUT_DIR / "concat_all_chapters.txt"
with open(concat_all, "w", encoding="utf-8") as f:
    for ch in [ch1, ch2, ch3, ch4, ch5]:
        f.write(f"file '{ch.name}'\n")

cmd_concat_main = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_all), '-c', 'copy', str(main_raw)]
subprocess.run(cmd_concat_main, check=True)

print("\n--- Mastering Full Episode Audio to Broadcast -14.0 LUFS ---")
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

# ----------------------------------------------------
# 4. UPLOAD FULL EPISODE TO YOUTUBE
# ----------------------------------------------------
print("\n==================================================")
print("🚀 UPLOADING FULL EPISODE TO YOUTUBE")
print("==================================================")
try:
    subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_timer_main.py'], check=True)
except Exception as e:
    print(f"Main upload exception: {e}")

print("==================================================")
print("✅ ALL TASKS FINISHED SUCCESSFULLY!")
print("==================================================")


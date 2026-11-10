import os
import pathlib
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "mind-reader"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

def render_chunk_with_retry(comp_id, chunk_file, start, end, max_attempts=3):
    if chunk_file.exists() and chunk_file.stat().st_size > 300000:
        print(f"Cached: {chunk_file.name} ({chunk_file.stat().st_size} bytes)")
        return

    cmd = [
        'npx.cmd', 'remotion', 'render', 'src/index-mind.ts', comp_id,
        f"out/mind-reader/{chunk_file.name}",
        '--public-dir=public_timer',
        '--concurrency=1',
        f'--frames={start}-{end}'
    ]

    for attempt in range(1, max_attempts + 1):
        try:
            print(f"Rendering [{comp_id}] frames {start}-{end} (attempt {attempt}/{max_attempts})...")
            res = subprocess.run(cmd, cwd=STUDIO, env=ENV, capture_output=True, text=True, encoding='utf-8', errors='ignore')
            if res.returncode == 0 and chunk_file.exists() and chunk_file.stat().st_size > 100000:
                print(f"✅ Rendered: {chunk_file.name} ({chunk_file.stat().st_size} bytes)")
                return
            else:
                print(f"⚠️ Attempt {attempt} failed (code {res.returncode}):\n{res.stderr[-500:] if res.stderr else res.stdout[-500:]}")
                time.sleep(2)
        except Exception as e:
            print(f"⚠️ Attempt {attempt} exception: {e}")
            time.sleep(2)

    raise RuntimeError(f"Failed to render chunk {chunk_file.name} after {max_attempts} attempts!")

def render_safe_chapter(comp_id, out_name, total_frames, chunk_size=200):
    final_path = OUT_DIR / out_name
    if final_path.exists() and final_path.stat().st_size > 2000000:
        print(f"✅ {out_name} already exists and valid ({final_path.stat().st_size} bytes)")
        return final_path

    chunks = []
    chunk_idx = 0
    for start in range(0, total_frames, chunk_size):
        end = min(total_frames - 1, start + chunk_size - 1)
        chunk_file = OUT_DIR / f"{final_path.stem}_ck_{chunk_idx}_{start}_{end}.mp4"
        chunk_idx += 1

        print(f"\n[{comp_id}] Chunk {chunk_idx}: frames {start}-{end} ({end - start + 1} frames)")
        render_chunk_with_retry(comp_id, chunk_file, start, end)
        chunks.append(chunk_file)

    print(f"\n--- Lossless merging {len(chunks)} chunks -> {out_name} ---")
    concat_txt = OUT_DIR / f"concat_{final_path.stem}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        for c in chunks:
            f.write(f"file '{c.resolve().as_posix()}'\n")

    cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(final_path)]
    subprocess.run(cmd_concat, check=True)
    print(f"🎉 Chapter ready: {final_path} ({final_path.stat().st_size} bytes)")

    # Clean chunk files
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

def render_short_pipeline():
    short_raw = render_safe_chapter('Mind-Short', 'mind_short_raw.mp4', 1016, chunk_size=200)
    short_mobile = OUT_DIR / "mind_short_mobile.mp4"

    if not short_mobile.exists() or short_mobile.stat().st_size < 1000000:
        print("\n--- Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
        filter_complex = (
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
            '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0x06B6D4[fg];'
            '[bg][fg]overlay=0:(H-h)/2[comp];'
            '[comp]drawtext=text=IF EVERYONE HEARD YOUR THOUGHTS? 🧠😱:fontcolor=white:fontsize=44:x=(w-text_w)/2:y=230:'
            'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
            'drawtext=text=WOULD YOU STILL HAVE FRIENDS? 👇:fontcolor=0xFDE047:fontsize=36:x=(w-text_w)/2:y=1610:'
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
        print(f"✨ Formatted Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")

    print("\n--- Uploading Mobile Short to YouTube ---")
    try:
        subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_mind_short.py'], check=True)
    except Exception as e:
        print(f"Short upload exception: {e}")

def render_main_film_pipeline():
    print("==================================================")
    print("🎬 RENDERING MIND READER 5 CHAPTERS")
    print("==================================================")
    ch1 = render_safe_chapter('Mind-Ch1', 'ch_1.mp4', 1128, chunk_size=200)
    ch2 = render_safe_chapter('Mind-Ch2', 'ch_2.mp4', 1265, chunk_size=200)
    ch3 = render_safe_chapter('Mind-Ch3', 'ch_3.mp4', 1047, chunk_size=200)
    ch4 = render_safe_chapter('Mind-Ch4', 'ch_4.mp4', 1277, chunk_size=200)
    ch5 = render_safe_chapter('Mind-Ch5', 'ch_5.mp4', 1187, chunk_size=200)

    print("\n==================================================")
    print("🎬 CONCATENATING FULL 3:17 EPISODE")
    print("==================================================")
    main_raw = OUT_DIR / "mind_main_raw.mp4"
    main_final = OUT_DIR / "mind_main_final.mp4"

    concat_all = OUT_DIR / "concat_full_film.txt"
    with open(concat_all, "w", encoding="utf-8") as f:
        for ch in [ch1, ch2, ch3, ch4, ch5]:
            f.write(f"file '{ch.resolve().as_posix()}'\n")

    cmd_concat_main = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_all), '-c', 'copy', str(main_raw)]
    subprocess.run(cmd_concat_main, check=True)

    print("\n--- Mastering Audio to Broadcast -14.0 LUFS ---")
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

    print("\n--- Uploading Full Film to YouTube ---")
    try:
        subprocess.run(['python', '-u', r'D:\AI-Cartoons\upload_mind_main.py'], check=True)
    except Exception as e:
        print(f"Main upload exception: {e}")

if __name__ == "__main__":
    print("==================================================")
    print("🚀 STARTING COMPLETE MIND READER PRODUCTION")
    print("==================================================")
    render_short_pipeline()
    render_main_film_pipeline()
    print("==================================================")
    print("✅ MIND READER PRODUCTION & UPLOADS COMPLETE!")
    print("==================================================")


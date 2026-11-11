import os
import pathlib
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "memories"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {
    **os.environ,
    'TEMP': r'D:\temp',
    'TMP': r'D:\temp',
    'NODE_OPTIONS': '--max-old-space-size=8192'
}

REMOTION_CLI = STUDIO / "node_modules" / "@remotion" / "cli" / "remotion-cli.js"

def render_chunk_with_retry(comp_id, chunk_file, start, end, max_attempts=3):
    if chunk_file.exists() and chunk_file.stat().st_size > 300000:
        print(f"Cached: {chunk_file.name} ({chunk_file.stat().st_size} bytes)")
        return

    cmd = [
        'node', '--max-old-space-size=8192', str(REMOTION_CLI),
        'render', 'src/index-memories.ts', comp_id,
        f"out/memories/{chunk_file.name}",
        '--public-dir=public_timer',
        '--concurrency=1',
        '--jpeg-quality=90',
        '--gl=angle',
        f'--frames={start}-{end}'
    ]

    for attempt in range(1, max_attempts + 1):
        try:
            print(f"Rendering [{comp_id}] frames {start}-{end} with Intel GPU (attempt {attempt}/{max_attempts})...")
            res = subprocess.run(cmd, cwd=STUDIO, env=ENV, capture_output=True, text=True, encoding='utf-8', errors='ignore')
            if res.returncode == 0 and chunk_file.exists() and chunk_file.stat().st_size > 100000:
                print(f"✅ Rendered: {chunk_file.name} ({chunk_file.stat().st_size} bytes)")
                return
            else:
                print(f"⚠️ Attempt {attempt} failed (code {res.returncode}):\n{res.stderr[-400:] if res.stderr else res.stdout[-400:]}")
                time.sleep(2)
        except Exception as e:
            print(f"⚠️ Attempt {attempt} exception: {e}")
            time.sleep(2)

    raise RuntimeError(f"Failed to render chunk {chunk_file.name} after {max_attempts} attempts!")

def render_safe_chapter(comp_id, out_name, total_frames, chunk_size=300):
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
    short_raw = render_safe_chapter('Memories-Short', 'memories_short_raw.mp4', 1271, chunk_size=300)
    short_mobile = OUT_DIR / "memories_short_mobile.mp4"

    if not short_mobile.exists() or short_mobile.stat().st_size < 1000000:
        print("\n--- Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
        filter_complex = (
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
            '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xF59E0B[fg];'
            '[bg][fg]overlay=0:(H-h)/2[comp];'
            "[comp]drawtext=text='WHAT IF YOU COULD SELL MEMORIES?':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=230:"
            'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
            "drawtext=text='OPTION A OR B? (Comment Below)':fontcolor=0xFDE047:fontsize=38:x=(w-text_w)/2:y=1610:"
            'box=1:boxcolor=0x0F172A@0.92:boxborderw=16[outv]'
        )
        cmd_mobile = [
            'ffmpeg', '-y', '-i', str(short_raw),
            '-filter_complex', filter_complex,
            '-map', '[outv]', '-map', '0:a',
            '-c:v', 'libx264', '-crf', '18', '-preset', 'medium',
            '-c:a', 'aac', '-b:a', '192k',
            str(short_mobile)
        ]
        subprocess.run(cmd_mobile, check=True)
        print(f"🎉 9:16 Mobile Short ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")
    else:
        print(f"✅ Mobile Short already exists: {short_mobile} ({short_mobile.stat().st_size} bytes)")

    return short_mobile

def render_main_film_pipeline():
    print("\n=======================================================")
    print("STEP 1: RENDERING 5 EPISODE CHAPTERS")
    print("=======================================================")

    ch1 = render_safe_chapter('Memories-Ch1', 'memories_ch1.mp4', 786, chunk_size=300)
    ch2 = render_safe_chapter('Memories-Ch2', 'memories_ch2.mp4', 940, chunk_size=300)
    ch3 = render_safe_chapter('Memories-Ch3', 'memories_ch3.mp4', 884, chunk_size=300)
    ch4 = render_safe_chapter('Memories-Ch4', 'memories_ch4.mp4', 756, chunk_size=300)
    ch5 = render_safe_chapter('Memories-Ch5', 'memories_ch5.mp4', 597, chunk_size=300)

    final_main = OUT_DIR / "memories_main_final.mp4"
    if not final_main.exists() or final_main.stat().st_size < 5000000:
        print("\n--- Lossless Concatenating All 5 Chapters -> memories_main_final.mp4 ---")
        concat_txt = OUT_DIR / "concat_main.txt"
        with open(concat_txt, "w", encoding="utf-8") as f:
            for ch in [ch1, ch2, ch3, ch4, ch5]:
                f.write(f"file '{ch.resolve().as_posix()}'\n")

        cmd = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(final_main)]
        subprocess.run(cmd, check=True)
        concat_txt.unlink(missing_ok=True)
        print(f"🎉 FULL FILM READY: {final_main} ({final_main.stat().st_size} bytes)")
    else:
        print(f"✅ Final main film already exists: {final_main} ({final_main.stat().st_size} bytes)")

    return final_main

if __name__ == "__main__":
    t0 = time.time()
    print("🚀 STARTING WHAT-EIF EPISODE 15: WHAT IF YOU COULD SELL YOUR MEMORIES?")
    short_vid = render_short_pipeline()
    main_vid = render_main_film_pipeline()
    print(f"\n✨ ALL RENDERS FINISHED IN {time.time() - t0:.1f}s ✨")
    print(f"Full Film: {main_vid}")
    print(f"Mobile Short: {short_vid}")

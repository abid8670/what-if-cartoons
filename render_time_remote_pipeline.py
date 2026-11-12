import os
import pathlib
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "time-remote"
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
        'render', 'src/index-time-remote.ts', comp_id,
        f"out/time-remote/{chunk_file.name}",
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

def render_safe_chapter(comp_id, out_name, total_frames, chunk_size=260):
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

def main():
    print("==================================================")
    print("EPISODE 17: TIME REMOTE (100% STICKMAN + GPU ACCELERATED)")
    print("==================================================")

    # 1. Render Mobile Short (1,099 frames, 9:16 vertical)
    print("\n>>> STEP 1: Rendering Mobile Short (9:16)...")
    render_safe_chapter('TimeRemote-Short', 'time_remote_short_mobile.mp4', 1099, chunk_size=280)

    # 2. Render 5 Chapters of Full Film (16:9)
    print("\n>>> STEP 2: Rendering Chapter 1 (930 frames)...")
    ch1 = render_safe_chapter('TimeRemote-Ch1', 'time_remote_ch1.mp4', 930, chunk_size=260)

    print("\n>>> STEP 3: Rendering Chapter 2 (753 frames)...")
    ch2 = render_safe_chapter('TimeRemote-Ch2', 'time_remote_ch2.mp4', 753, chunk_size=250)

    print("\n>>> STEP 4: Rendering Chapter 3 (709 frames)...")
    ch3 = render_safe_chapter('TimeRemote-Ch3', 'time_remote_ch3.mp4', 709, chunk_size=250)

    print("\n>>> STEP 5: Rendering Chapter 4 (847 frames)...")
    ch4 = render_safe_chapter('TimeRemote-Ch4', 'time_remote_ch4.mp4', 847, chunk_size=280)

    print("\n>>> STEP 6: Rendering Chapter 5 (878 frames)...")
    ch5 = render_safe_chapter('TimeRemote-Ch5', 'time_remote_ch5.mp4', 878, chunk_size=290)

    # 3. Concatenate all 5 chapters losslessly into final full film
    print("\n>>> STEP 7: Merging Full Film (16:9)...")
    main_final = OUT_DIR / "time_remote_main_final.mp4"
    film_concat_txt = OUT_DIR / "concat_full_film.txt"
    with open(film_concat_txt, "w", encoding="utf-8") as f:
        f.write(f"file '{ch1.resolve().as_posix()}'\n")
        f.write(f"file '{ch2.resolve().as_posix()}'\n")
        f.write(f"file '{ch3.resolve().as_posix()}'\n")
        f.write(f"file '{ch4.resolve().as_posix()}'\n")
        f.write(f"file '{ch5.resolve().as_posix()}'\n")

    cmd_film = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(film_concat_txt), '-c', 'copy', str(main_final)]
    subprocess.run(cmd_film, check=True)
    film_concat_txt.unlink(missing_ok=True)

    print(f"\n==================================================")
    print(f"🎉 MASTER DELIVERABLES READY FOR EPISODE 17:")
    print(f"🖥️ Full Film: {main_final} ({main_final.stat().st_size} bytes)")
    short_file = OUT_DIR / "time_remote_short_mobile.mp4"
    print(f"📱 Mobile Short: {short_file} ({short_file.stat().st_size} bytes)")
    print(f"==================================================")

if __name__ == "__main__":
    main()


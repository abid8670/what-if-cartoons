import os
import pathlib
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "five-clones"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

def render_chunk_with_retry(comp_id, chunk_file, start, end, max_attempts=3):
    if chunk_file.exists() and chunk_file.stat().st_size > 300000:
        print(f"Cached: {chunk_file.name} ({chunk_file.stat().st_size} bytes)")
        return

    cmd = [
        'npx.cmd', 'remotion', 'render', 'src/index-clones.ts', comp_id,
        f"out/five-clones/{chunk_file.name}",
        '--concurrency=1',
        '--jpeg-quality=90',
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

def render_safe_chapter(comp_id, out_name, total_frames, chunk_size=250):
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
    short_raw = render_safe_chapter('Clones-Short', 'clones_short_raw.mp4', 1161, chunk_size=250)
    short_mobile = OUT_DIR / "clones_short_mobile.mp4"

    if not short_mobile.exists() or short_mobile.stat().st_size < 1000000:
        print("\n--- Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
        filter_complex = (
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
            '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xF59E0B[fg];'
            '[bg][fg]overlay=0:(H-h)/2[comp];'
            "[comp]drawtext=text='WHAT IF YOU HAD 5 CLONES?':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=230:"
            'box=1:boxcolor=0x0F172A@0.92:boxborderw=18,'
            "drawtext=text='OPTION A OR B? (Comment Below)':fontcolor=0xFDE047:fontsize=38:x=(w-text_w)/2:y=1610:"
            'box=1:boxcolor=0x0F172A@0.92:boxborderw=16[outv]'
        )
        cmd_mobile = [
            'ffmpeg', '-y', '-i', str(short_raw),
            '-filter_complex', filter_complex,
            '-map', '[outv]',
            '-map', '0:a',
            '-c:v', 'libx264', '-preset', 'fast', '-crf', '19',
            '-c:a', 'aac', '-b:a', '192k',
            str(short_mobile)
        ]
        subprocess.run(cmd_mobile, check=True)
        print(f"📱 9:16 Short ready: {short_mobile} ({short_mobile.stat().st_size} bytes)")

def render_full_film_pipeline():
    durations = [768, 878, 808, 823, 722]
    chapter_files = []

    for idx, dur in enumerate(durations, start=1):
        comp_id = f"Clones-Ch{idx}"
        ch_name = f"ch_{idx}.mp4"
        print(f"\n=======================================================")
        print(f"🎬 RENDERING CHAPTER {idx}/{len(durations)}: {comp_id} ({dur} frames)")
        print(f"=======================================================")
        ch_path = render_safe_chapter(comp_id, ch_name, dur, chunk_size=250)
        chapter_files.append(ch_path)

    raw_film = OUT_DIR / "clones_main_raw.mp4"
    final_film = OUT_DIR / "clones_main_final.mp4"

    if not final_film.exists() or final_film.stat().st_size < 10000000:
        print("\n--- Concat All 5 Chapters into Raw Film ---")
        concat_txt = OUT_DIR / "concat_full_film.txt"
        with open(concat_txt, "w", encoding="utf-8") as f:
            for ch in chapter_files:
                f.write(f"file '{ch.resolve().as_posix()}'\n")

        cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(raw_film)]
        subprocess.run(cmd_concat, check=True)
        print(f"✅ Raw film stitched: {raw_film} ({raw_film.stat().st_size} bytes)")

        print("\n--- Broadcast Audio Normalization (-14.0 LUFS) ---")
        cmd_master = [
            'ffmpeg', '-y', '-i', str(raw_film),
            '-filter:a', 'loudnorm=I=-14:LRA=7:tp=-1.5',
            '-c:v', 'copy',
            '-c:a', 'aac', '-b:a', '256k',
            str(final_film)
        ]
        subprocess.run(cmd_master, check=True)
        print(f"🏆 Master 16:9 Film Complete: {final_film} ({final_film.stat().st_size} bytes)")

if __name__ == "__main__":
    t0 = time.time()
    print("🚀 Starting Five Clones Pipeline Render...")
    render_short_pipeline()
    render_full_film_pipeline()
    print(f"\n🎉 ALL RENDER PIPELINES FINISHED in {time.time() - t0:.1f}s!")


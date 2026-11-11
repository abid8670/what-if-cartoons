import os
import pathlib
import subprocess
import sys
import time

sys.stdout.reconfigure(encoding='utf-8', line_buffering=True)

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
OUT_DIR = STUDIO / "out" / "immortal"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ENV = {
    **os.environ,
    'TEMP': r'D:\temp',
    'TMP': r'D:\temp',
    'NODE_OPTIONS': '--max-old-space-size=8192'
}

REMOTION_CLI = STUDIO / "node_modules" / "@remotion" / "cli" / "remotion-cli.js"

def render_safe_chapter(comp_id, out_name, total_frames, split_at=750):
    final_path = OUT_DIR / out_name
    if final_path.exists() and final_path.stat().st_size > 1500000:
        print(f"✅ {out_name} already exists ({final_path.stat().st_size} bytes)")
        return final_path

    if total_frames <= split_at:
        print(f"\n--- Rendering {comp_id} (0-{total_frames - 1}) ---")
        cmd = [
            'node', '--max-old-space-size=8192', str(REMOTION_CLI),
            'render', 'src/index-immortal.ts', comp_id,
            f'out/immortal/{out_name}',
            '--public-dir=public_timer',
            '--concurrency=1',
            '--jpeg-quality=90',
            '--gl=angle'
        ]
        res = subprocess.run(cmd, cwd=STUDIO, env=ENV, check=True)
        print(f"✅ Rendered: {out_name} ({final_path.stat().st_size} bytes)")
        return final_path

    # Split into 2 chunks if > split_at
    p1_name = f"{final_path.stem}_p1.mp4"
    p2_name = f"{final_path.stem}_p2.mp4"
    p1_path = OUT_DIR / p1_name
    p2_path = OUT_DIR / p2_name
    mid = total_frames // 2

    if not p1_path.exists() or p1_path.stat().st_size < 300000:
        print(f"\n--- Rendering {comp_id} Part 1 (0-{mid}) ---")
        cmd_p1 = [
            'node', '--max-old-space-size=8192', str(REMOTION_CLI),
            'render', 'src/index-immortal.ts', comp_id,
            f'out/immortal/{p1_name}',
            '--public-dir=public_timer',
            '--concurrency=1',
            '--jpeg-quality=90',
            '--gl=angle',
            f'--frames=0-{mid}'
        ]
        subprocess.run(cmd_p1, cwd=STUDIO, env=ENV, check=True)

    if not p2_path.exists() or p2_path.stat().st_size < 300000:
        print(f"\n--- Rendering {comp_id} Part 2 ({mid + 1}-{total_frames - 1}) ---")
        cmd_p2 = [
            'node', '--max-old-space-size=8192', str(REMOTION_CLI),
            'render', 'src/index-immortal.ts', comp_id,
            f'out/immortal/{p2_name}',
            '--public-dir=public_timer',
            '--concurrency=1',
            '--jpeg-quality=90',
            '--gl=angle',
            f'--frames={mid + 1}-{total_frames - 1}'
        ]
        subprocess.run(cmd_p2, cwd=STUDIO, env=ENV, check=True)

    print(f"\n--- Lossless merging parts -> {out_name} ---")
    concat_txt = OUT_DIR / f"concat_{final_path.stem}.txt"
    with open(concat_txt, "w", encoding="utf-8") as f:
        f.write(f"file '{p1_path.resolve().as_posix()}'\n")
        f.write(f"file '{p2_path.resolve().as_posix()}'\n")

    cmd_concat = ['ffmpeg', '-y', '-f', 'concat', '-safe', '0', '-i', str(concat_txt), '-c', 'copy', str(final_path)]
    subprocess.run(cmd_concat, check=True)
    print(f"🎉 Chapter ready: {final_path} ({final_path.stat().st_size} bytes)")

    p1_path.unlink(missing_ok=True)
    p2_path.unlink(missing_ok=True)
    concat_txt.unlink(missing_ok=True)
    return final_path

def render_short_pipeline():
    short_raw = render_safe_chapter('Immortal-Short', 'immortal_short_raw.mp4', 1289, split_at=700)
    short_mobile = OUT_DIR / "immortal_short_mobile.mp4"

    if not short_mobile.exists() or short_mobile.stat().st_size < 1000000:
        print("\n--- Formatting 9:16 Vertical Short with Ambient Blur & Badges ---")
        filter_complex = (
            '[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];'
            '[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xF59E0B[fg];'
            '[bg][fg]overlay=0:(H-h)/2[comp];'
            "[comp]drawtext=text='WHAT IF YOU WERE IMMORTAL?':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=230:"
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

    ch1 = render_safe_chapter('Immortal-Ch1', 'immortal_ch1.mp4', 776, split_at=800)
    ch2 = render_safe_chapter('Immortal-Ch2', 'immortal_ch2.mp4', 622, split_at=800)
    ch3 = render_safe_chapter('Immortal-Ch3', 'immortal_ch3.mp4', 720, split_at=800)
    ch4 = render_safe_chapter('Immortal-Ch4', 'immortal_ch4.mp4', 831, split_at=850)
    ch5 = render_safe_chapter('Immortal-Ch5', 'immortal_ch5.mp4', 601, split_at=800)

    final_main = OUT_DIR / "immortal_main_final.mp4"
    if not final_main.exists() or final_main.stat().st_size < 5000000:
        print("\n--- Lossless Concatenating All 5 Chapters -> immortal_main_final.mp4 ---")
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
    print("🚀 STARTING WHAT-EIF EPISODE 14: WHAT IF YOU WERE IMMORTAL?")
    short_vid = render_short_pipeline()
    main_vid = render_main_film_pipeline()
    print(f"\n✨ ALL RENDERS FINISHED IN {time.time() - t0:.1f}s ✨")
    print(f"Full Film: {main_vid}")
    print(f"Mobile Short: {short_vid}")

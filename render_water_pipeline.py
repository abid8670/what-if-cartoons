import json, os, pathlib, subprocess, sys, time, shutil

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
out_dir = STUDIO / "out" / "no-water"
out_dir.mkdir(parents=True, exist_ok=True)
public_dir = STUDIO / "public" / "no-water"

# Ensure thumbnails exist in out directory
for thumb_name in ["thumbnail.jpg", "thumbnail.png", "thumbnail_short.jpg", "thumbnail_short.png"]:
    src_th = public_dir / thumb_name
    dst_th = out_dir / thumb_name
    if src_th.exists() and not dst_th.exists():
        shutil.copy2(src_th, dst_th)

env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("EPISODE 10: WHAT IF ALL WATER DISAPPEARED - PRODUCTION PIPELINE")
print("==================================================")
t_start = time.time()

# 1. Render all 6 chapters
chapter_files = []
for i in range(1, 7):
    comp_id = f"Water-Ch{i}"
    out_file = out_dir / f"ch_{i}.mp4"
    chapter_files.append(out_file)
    print(f"\n--- Rendering Chapter {i}/6: {comp_id} (Concurrency: 2) ---")
    t0 = time.time()
    cmd_ch = [
        "npx.cmd", "remotion", "render", "src/index.ts", comp_id,
        str(out_file), "--concurrency", "2", "--log", "error"
    ]
    subprocess.run(cmd_ch, cwd=STUDIO, check=True, env=env)
    print(f"Chapter {i} rendered in {time.time() - t0:.1f}s ({out_file.stat().st_size / 1e6:.2f} MB)")

# 2. Render Short
short_raw = out_dir / "short_raw.mp4"
print(f"\n--- Rendering Water-Short ---")
t0 = time.time()
cmd_short = [
    "npx.cmd", "remotion", "render", "src/index.ts", "Water-Short",
    str(short_raw), "--concurrency", "2", "--log", "error"
]
subprocess.run(cmd_short, cwd=STUDIO, check=True, env=env)
print(f"Short rendered in {time.time() - t0:.1f}s ({short_raw.stat().st_size / 1e6:.2f} MB)")

# 3. Concatenate chapters into master raw video
raw_main = out_dir / "water_main_raw.mp4"
final_main = out_dir / "water_main_final.mp4"

print("\n--- Concatenating 6 chapters into master video ---")
concat_list = out_dir / "concat_list.txt"
with open(concat_list, "w", encoding="utf-8") as f:
    for cf in chapter_files:
        f.write(f"file '{cf.resolve()}'\n")

cmd_concat = [
    "ffmpeg", "-y", "-f", "concat", "-safe", "0",
    "-i", str(concat_list),
    "-c", "copy",
    str(raw_main)
]
subprocess.run(cmd_concat, check=True)
print(f"Concatenated raw master: {raw_main.stat().st_size / 1e6:.2f} MB")

# 4. Master Audio to -14 LUFS (EBU R128)
print("\n--- Mastering Audio to -14 LUFS (2-Pass EBU R128) ---")
cmd_pass1 = [
    "ffmpeg", "-y", "-i", str(raw_main),
    "-af", "loudnorm=I=-14.0:TP=-1.5:LRA=11.0:print_format=json",
    "-f", "null", "-"
]
p1 = subprocess.run(cmd_pass1, stderr=subprocess.PIPE, text=True)
stats = None
for line in p1.stderr.splitlines():
    if line.strip().startswith("{"):
        idx = p1.stderr.find(line.strip())
        json_str = p1.stderr[idx:p1.stderr.rfind("}") + 1]
        try:
            stats = json.loads(json_str)
            break
        except:
            pass

if stats:
    filter_master = (
        f"loudnorm=I=-14.0:TP=-1.5:LRA=11.0:"
        f"measured_I={stats['input_i']}:measured_TP={stats['input_tp']}:"
        f"measured_LRA={stats['input_lra']}:measured_thresh={stats['input_thresh']}:"
        f"offset={stats['target_offset']}:linear=true"
    )
else:
    filter_master = "loudnorm=I=-14.0:TP=-1.5:LRA=11.0"

cmd_pass2 = [
    "ffmpeg", "-y", "-i", str(raw_main),
    "-c:v", "copy",
    "-af", filter_master,
    "-c:a", "aac", "-b:a", "256k",
    "-movflags", "+faststart",
    str(final_main)
]
subprocess.run(cmd_pass2, check=True)
print(f"Master Video Ready: {final_main} ({final_main.stat().st_size / 1e6:.2f} MB)")

# 5. Format Mobile Short (9:16 Vertical 1080x1920 - Full Uncropped Frame with Ambient BG)
short_mobile = out_dir / "water_short_mobile.mp4"
print(f"\n--- Formatting Mobile Short (1080x1920 Vertical Uncropped Standard) ---")
filter_complex = (
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.22[bg];"
    "[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0x38BDF8[fg];"
    "[bg][fg]overlay=0:(H-h)/2[comp];"
    "[comp]drawtext=text='WHAT IF WATER DISAPPEARED?':fontcolor=white:fontsize=46:x=(w-text_w)/2:y=240:"
    "box=1:boxcolor=0x0F172A@0.85:boxborderw=18,"
    "drawtext=text='THE 72-HOUR EXTINCTION! 💀':fontcolor=0xFBBF24:fontsize=44:x=(w-text_w)/2:y=1600:"
    "box=1:boxcolor=0x0F172A@0.85:boxborderw=16[outv]"
)
cmd_short_mobile = [
    "ffmpeg", "-y", "-i", str(short_raw),
    "-filter_complex", filter_complex,
    "-map", "[outv]", "-map", "0:a",
    "-af", "loudnorm=I=-14.0:TP=-1.5:LRA=11.0",
    "-c:v", "libx264", "-preset", "fast", "-crf", "19",
    "-c:a", "aac", "-b:a", "256k",
    "-movflags", "+faststart",
    str(short_mobile)
]
subprocess.run(cmd_short_mobile, check=True)
print(f"Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size / 1e6:.2f} MB)")

# 6. Upload Full Video & Short to YouTube
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
from upload import upload

class Args:
    pass

def upload_meta(meta_path, title_override=None):
    with open(meta_path, encoding="utf-8") as f:
        m = json.load(f)
    a = Args()
    a.video = m["video"]
    a.title = title_override if title_override else m["title"]
    a.description = m["description"]
    a.tags = m["tags"]
    a.thumbnail = m.get("thumbnail")
    a.category = m.get("category", "27")
    a.privacy = m.get("privacy", "public")
    a.schedule = None
    a.playlist = None
    print(f"\n==========================================")
    print(f"UPLOADING: {a.title}")
    vid = upload(a)
    print(f"SUCCESS: Video ID = {vid}")
    return vid

print("\n--- Uploading Full Video to YouTube ---")
id_main = None
try:
    id_main = upload_meta(r"D:\AI-Cartoons\youtube\meta_water_main.json")
    print(f"FULL VIDEO IS LIVE: https://youtu.be/{id_main}")
except Exception as e:
    print(f"Full video upload notice: {e}")

print("\n--- Uploading Short to YouTube ---")
id_short = None
try:
    id_short = upload_meta(r"D:\AI-Cartoons\youtube\meta_water_short.json")
    print(f"SHORT IS LIVE: https://youtu.be/{id_short}")
except Exception as e:
    print(f"Short upload notice: {e}")

print(f"\nEpisode 10 Total Pipeline Completed in {time.time() - t_start:.1f}s")
if id_main:
    print(f"Main Video: https://youtu.be/{id_main}")
if id_short:
    print(f"Short Video: https://youtu.be/{id_short}")


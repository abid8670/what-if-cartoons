import json, os, pathlib, subprocess, sys, time

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
out_dir = STUDIO / "out" / "ancient-pleasure"
out_dir.mkdir(parents=True, exist_ok=True)
env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("STARTING ANCIENT PLEASURE RENDER & UPLOAD PIPELINE")
print("==================================================")
t_start = time.time()

# Ensure custom bold text thumbnails are protected
art_h = out_dir / "thumbnail_art.png"
art_v = out_dir / "thumbnail_short_art.png"
th_h = out_dir / "thumbnail.png"
th_v = out_dir / "thumbnail_short.png"
if art_h.exists():
    th_h.write_bytes(art_h.read_bytes())
if art_v.exists():
    th_v.write_bytes(art_v.read_bytes())
print("Custom Think Beyond thumbnails locked & ready.")

# ----------------- PHASE 1: 14-SECOND MOBILE SHORT (FAST TRACK) -----------------
print("\n>>> PHASE 1: RENDERING 14-SECOND YOUTUBE SHORT (420 Frames) <<<")
short_raw = out_dir / "short_raw.mp4"
short_mobile = out_dir / "ancient_short_mobile.mp4"

if not short_raw.exists() or short_raw.stat().st_size < 100000:
    t0 = time.time()
    cmd_short = [
        "npx.cmd", "remotion", "render", "src/index.ts", "Ancient-Short",
        str(short_raw), "--concurrency", "4", "--log", "error"
    ]
    subprocess.run(cmd_short, cwd=STUDIO, check=True, env=env)
    print(f"Short rendered in {time.time() - t0:.1f}s ({short_raw.stat().st_size / 1e6:.2f} MB)")

# Convert to 9:16 Vertical Mobile Format (1080x1920)
if not short_mobile.exists() or short_mobile.stat().st_size < 100000:
    print("Converting Short to 9:16 Vertical Mobile Format (1080x1920)...")
    filter_complex = (
        "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.22[bg];"
        "[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0xFBBF24[fg];"
        "[bg][fg]overlay=0:(H-h)/2[comp];"
        "[comp]drawtext=text='WHAT ANCIENT HUMANS DID FOR PLEASURE':fontcolor=white:fontsize=44:x=(w-text_w)/2:y=220:"
        "box=1:boxcolor=0x0F172A@0.85:boxborderw=18,"
        "drawtext=text='THE UNTOLD STONE AGE SECRETS! 🏺':fontcolor=0xFBBF24:fontsize=42:x=(w-text_w)/2:y=1620:"
        "box=1:boxcolor=0x0F172A@0.85:boxborderw=16[outv]"
    )
    cmd_convert = [
        "ffmpeg", "-y", "-i", str(short_raw),
        "-filter_complex", filter_complex,
        "-map", "[outv]", "-map", "0:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "19",
        "-c:a", "aac", "-b:a", "256k",
        "-t", "14.0",
        "-movflags", "+faststart",
        str(short_mobile)
    ]
    subprocess.run(cmd_convert, check=True)
    print(f"14-Second Mobile Short Ready: {short_mobile} ({short_mobile.stat().st_size / 1e6:.2f} MB)")

# Upload Short Immediately
sys.path.insert(0, r"D:\AI-Cartoons\youtube")
from upload import upload

class Args:
    pass

def upload_meta(meta_path):
    with open(meta_path, encoding="utf-8") as f:
        m = json.load(f)
    a = Args()
    a.video = m["video"]
    a.title = m["title"]
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

print("\n--- Uploading 14-Second Mobile Short to YouTube ---")
try:
    id_short = upload_meta(r"D:\AI-Cartoons\youtube\meta_ancient_short.json")
    print(f"SHORT IS LIVE: https://youtube.com/shorts/{id_short}")
except Exception as e:
    print(f"Short upload notice: {e}")

# ----------------- PHASE 2: 4.47-MINUTE FULL EPISODE (6 CHAPTERS) -----------------
print("\n>>> PHASE 2: RENDERING 4.47-MINUTE FULL EPISODE (6 CHAPTERS) <<<")
chapter_files = []
for i in range(1, 7):
    comp_id = f"Ancient-Ch{i}"
    out_file = out_dir / f"ch_{i}.mp4"
    chapter_files.append(out_file)
    if not out_file.exists() or out_file.stat().st_size < 100000:
        print(f"\n--- Rendering Chapter {i}/6: {comp_id} ---")
        t0 = time.time()
        cmd_ch = [
            "npx.cmd", "remotion", "render", "src/index.ts", comp_id,
            str(out_file), "--concurrency", "4", "--log", "error"
        ]
        subprocess.run(cmd_ch, cwd=STUDIO, check=True, env=env)
        print(f"Chapter {i} rendered in {time.time() - t0:.1f}s ({out_file.stat().st_size / 1e6:.1f} MB)")
    else:
        print(f"Chapter {i} already rendered: {out_file} ({out_file.stat().st_size / 1e6:.1f} MB)")

# Concatenate all 6 chapters
raw_main = out_dir / "ancient_main_raw.mp4"
final_main = out_dir / "ancient_pleasure_main_final.mp4"

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

# Master Audio to -14 LUFS (EBU R128)
print("\n--- Mastering Audio to -14 LUFS ---")
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

# Upload Full Video to YouTube
print("\n--- Uploading Full Episode to YouTube ---")
try:
    id_main = upload_meta(r"D:\AI-Cartoons\youtube\meta_ancient_main.json")
    print(f"FULL VIDEO IS LIVE: https://youtu.be/{id_main}")
except Exception as e:
    print(f"Full video upload notice: {e}")

print("\n==================================================")
print(f"ALL WORK COMPLETE! Total Time: {(time.time() - t_start) / 60:.1f} minutes")
print("==================================================")


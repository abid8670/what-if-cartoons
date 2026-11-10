import json, os, pathlib, subprocess, sys, time

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
out_dir = STUDIO / "out" / "quiet-room"
out_dir.mkdir(parents=True, exist_ok=True)
env = {**os.environ, 'TEMP': r'D:\temp', 'TMP': r'D:\temp'}

print("==================================================")
print("EPISODE 8: THE QUIETEST ROOM - MASTER PRODUCTION PIPELINE")
print("==================================================")
t_start = time.time()

# 1. Render all 6 chapters
chapter_files = []
for i in range(1, 7):
    comp_id = f"Quiet-Ch{i}"
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
print(f"\n--- Rendering Quiet-Short ---")
t0 = time.time()
cmd_short = [
    "npx.cmd", "remotion", "render", "src/index.ts", "Quiet-Short",
    str(short_raw), "--concurrency", "2", "--log", "error"
]
subprocess.run(cmd_short, cwd=STUDIO, check=True, env=env)
print(f"Short rendered in {time.time() - t0:.1f}s ({short_raw.stat().st_size / 1e6:.2f} MB)")

# 3. Concatenate chapters into master raw video
raw_main = out_dir / "quiet_main_raw.mp4"
final_main = out_dir / "quiet_room_main_final.mp4"

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

# 5. Format Mobile Short (9:16 Vertical 1080x1920)
short_mobile = out_dir / "quiet_short_mobile.mp4"
print(f"\n--- Formatting Mobile Short (1080x1920 Vertical) ---")
cmd_short_mobile = [
    "ffmpeg", "-y", "-i", str(short_raw),
    "-vf", "crop=608:1080:656:0,scale=1080:1920:flags=lanczos",
    "-af", "loudnorm=I=-14.0:TP=-1.5:LRA=11.0",
    "-c:v", "libx264", "-preset", "medium", "-crf", "18",
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
try:
    id_main = upload_meta(r"D:\AI-Cartoons\youtube\meta_quiet_room_main.json")
    print(f"FULL VIDEO IS LIVE: https://youtu.be/{id_main}")
except Exception as e:
    print(f"Full video upload notice: {e}")

print("\n--- Uploading Short to YouTube ---")
try:
    id_short = upload_meta(r"D:\AI-Cartoons\youtube\meta_quiet_room_short.json")
    print(f"SHORT IS LIVE: https://youtu.be/{id_short}")
except Exception as e:
    print(f"Short upload notice: {e}")

print("\n==================================================")
print(f"ALL WORK COMPLETE! Total Time: {(time.time() - t_start) / 60:.1f} minutes")
print("==================================================")

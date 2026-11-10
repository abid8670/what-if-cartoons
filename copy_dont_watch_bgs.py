import shutil
import glob
import pathlib
from PIL import Image

BRAIN_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch")

MAP = {
    "bg_forbidden_studio": "bg_forbidden_studio.jpg",
    "bg_cgi_lab": "bg_cgi_lab.jpg",
    "bg_algorithm_center": "bg_algorithm_center.jpg",
    "bg_countdown_stage": "bg_countdown_stage.jpg",
}

for prefix, dest_name in MAP.items():
    matches = sorted(BRAIN_DIR.glob(f"{prefix}_*.jpg"), key=lambda p: p.stat().st_mtime, reverse=True)
    if matches:
        src = matches[0]
        dest = PUB_DIR / dest_name
        shutil.copyfile(src, dest)
        im = Image.open(dest)
        print(f"Copied {src.name} -> {dest_name} (Size: {im.size})")
    else:
        print(f"WARNING: No matches found for {prefix}")


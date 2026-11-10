import shutil
import pathlib
from PIL import Image

BRAIN_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\one-thousand-or-one")

MAP = {
    "bg_dilemma_street": "bg_dilemma_street.jpg",
    "bg_neon_crowd_alley": "bg_neon_crowd_alley.jpg",
    "bg_umbrella_warmth": "bg_umbrella_warmth.jpg",
    "thumb_thousand_bg": "thumb_thousand_bg.jpg",
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


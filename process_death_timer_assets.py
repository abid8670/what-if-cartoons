import pathlib
from PIL import Image

BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\death-timer")
PUB_DIR.mkdir(parents=True, exist_ok=True)

ASSETS = {
    "bg_city_street.jpg": ("bg_morning_city_street_png_1793974165765.jpg", (1920, 1080)),
    "bg_subway_platform.jpg": ("bg_subway_platform_png_1793974188124.jpg", (1920, 1080)),
    "bg_park_hospital.jpg": ("bg_park_and_hospital_png_1793974216169.jpg", (1920, 1080)),
    "bg_warm_room.jpg": ("bg_home_warm_room_png_1793974249236.jpg", (1920, 1080)),
    "bg_bathroom_mirror.jpg": ("bg_bathroom_mirror_png_1793974301493.jpg", (1920, 1080)),
    "thumbnail.jpg": ("thumbnail_16x9_1793974175930.jpg", (1280, 720)),
    "thumbnail_short.jpg": ("thumbnail_9x16_1793974202201.jpg", (1080, 1920)),
}

for target_name, (src_name, target_size) in ASSETS.items():
    src_path = BRAIN / src_name
    dest_path = PUB_DIR / target_name
    print(f"Processing {src_name} -> {target_name} ({target_size[0]}x{target_size[1]})...")
    with Image.open(src_path) as img:
        img_resized = img.resize(target_size, Image.Resampling.LANCZOS)
        img_resized.save(dest_path, "JPEG", quality=95)
    print(f"Saved: {dest_path} ({dest_path.stat().st_size} bytes)")

# Also save copies for artifacts view
with Image.open(PUB_DIR / "thumbnail.jpg") as img:
    img.save(BRAIN / "thumb_death_timer_16x9.jpg", "JPEG", quality=95)

with Image.open(PUB_DIR / "thumbnail_short.jpg") as img:
    img.save(BRAIN / "thumb_death_timer_9x16.jpg", "JPEG", quality=95)

print("Finished processing all death-timer assets!")


import pathlib
from PIL import Image

BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
PUB_DIR1 = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\mind-reader")
PUB_DIR2 = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\mind-reader")
PUB_DIR1.mkdir(parents=True, exist_ok=True)
PUB_DIR2.mkdir(parents=True, exist_ok=True)

MAPPING = {
    "bg_coffee_shop.jpg": "cozy_coffee_shop_empty_street_1794033685580.jpg",
    "bg_subway_crowd.jpg": "subway_train_interior_background_1794033667948.jpg",
    "bg_rooftop_night.jpg": "cyberpunk_rooftop_night_bg_1794033670718.jpg",
    "bg_rooftop_sunset.jpg": "rooftop_sunset_background_1794033679346.jpg"
}

for dest_name, src_name in MAPPING.items():
    src_file = BRAIN / src_name
    im = Image.open(src_file).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
    im.save(PUB_DIR1 / dest_name, "JPEG", quality=95)
    im.save(PUB_DIR2 / dest_name, "JPEG", quality=95)
    print(f"Processed: {src_name} -> {dest_name}")

print("All background assets processed successfully!")


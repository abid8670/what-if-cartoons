import shutil
import pathlib
from PIL import Image, ImageDraw, ImageFont

BRAIN_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\thousand-words")

bg_city = BRAIN_DIR / "bg_city_street_morning_1793966642849.jpg"
bg_park = BRAIN_DIR / "bg_rainy_park_bench_1793966661824.jpg"
bg_room = BRAIN_DIR / "bg_warm_room_rain_1793966684279.jpg"
thumb_bg = BRAIN_DIR / "thumb_counter_bg_1793966716611.jpg"

# 1. Resize and save backgrounds to exact 1920x1080
for src, name in [
    (bg_city, "bg_city_street_morning.jpg"),
    (bg_park, "bg_rainy_park_bench.jpg"),
    (bg_room, "bg_warm_room_rain.jpg"),
]:
    with Image.open(src) as img:
        img_1080 = img.resize((1920, 1080), Image.Resampling.LANCZOS)
        img_1080.save(PUB_DIR / name, quality=95)
        print(f"Saved: {name}")

# 2. Create 16:9 Thumbnail (1280x720)
with Image.open(thumb_bg) as img:
    thumb_16_9 = img.resize((1280, 720), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(thumb_16_9)

    font_huge = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 80)
    font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 36)
    font_counter = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 64)

    # Top Dramatic Hook: "ONLY 1,000 WORDS LEFT?"
    for dx, dy in [(-3, -3), (3, -3), (-3, 3), (3, 3), (0, 4), (4, 0)]:
        draw.text((640 + dx, 55 + dy), "ONLY 1,000 WORDS LEFT?", fill="#000000", font=font_huge, anchor="mt")
    draw.text((640, 55), "ONLY 1,000 WORDS LEFT?", fill="#38BDF8", font=font_huge, anchor="mt")

    # Center Glowing Counter Badge: [ 003 ]
    draw.rounded_rectangle([440, 260, 840, 420], radius=24, fill="#020617", outline="#EF4444", width=5)
    draw.text((640, 310), "[ 003 ]", fill="#F87171", font=font_counter, anchor="mm")
    draw.text((640, 375), "FINAL WORDS REMAINING", fill="#FACC15", font=font_sub, anchor="mm")

    # Bottom Hook: "WHAT WOULD YOU SAY? ⏳🤐"
    bbox = draw.textbbox((640, 640), "WHAT WOULD YOU SAY? ⏳🤐", font=font_sub, anchor="mb")
    draw.rectangle([bbox[0] - 25, bbox[1] - 10, bbox[2] + 25, bbox[3] + 10], fill="#0F172A", outline="#FACC15", width=3)
    draw.text((640, 640), "WHAT WOULD YOU SAY? ⏳🤐", fill="#FFFFFF", font=font_sub, anchor="mb")

    # Duration Badge bottom right "2:45"
    draw.rectangle([1140, 660, 1260, 705], fill="#000000", outline="#334155", width=1)
    font_dur = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 26)
    draw.text((1200, 682), "2:45", fill="#FFFFFF", font=font_dur, anchor="mm")

    thumb_16_9.save(PUB_DIR / "thumbnail.jpg", quality=95)
    thumb_16_9.save(BRAIN_DIR / "thumb_thousand_words_16x9.jpg", quality=95)
    print("Saved 16:9 thumbnail.jpg")

# 3. Create 9:16 Vertical Short Thumbnail (1080x1920)
thumb_9_16 = Image.new("RGB", (1080, 1920), "#0B0818")
with Image.open(thumb_bg) as img:
    img_resized = img.resize((1080, 720), Image.Resampling.LANCZOS)
    thumb_9_16.paste(img_resized, (0, 600))

draw_short = ImageDraw.Draw(thumb_9_16)
font_short_huge = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 85)
font_short_sub = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 42)

# Top Card
draw_short.rectangle([60, 220, 1020, 480], fill="#020617", outline="#38BDF8", width=6)
draw_short.text((540, 260), "1,000 WORDS LEFT?", fill="#38BDF8", font=font_short_huge, anchor="mt")
draw_short.text((540, 380), "WHAT IF SPEECH HAD A LIMIT? ⏳", fill="#FDE047", font=font_short_sub, anchor="mt")

# Bottom Card
draw_short.rectangle([80, 1440, 1000, 1680], fill="#020617", outline="#EF4444", width=5)
draw_short.text((540, 1485), "FINAL 3 WORDS...", fill="#EF4444", font=font_short_huge, anchor="mt")
draw_short.text((540, 1595), "Who would you spend them on? 👇", fill="#FFFFFF", font=font_short_sub, anchor="mt")

thumb_9_16.save(PUB_DIR / "thumbnail_short.jpg", quality=95)
thumb_9_16.save(BRAIN_DIR / "thumb_thousand_words_9x16.jpg", quality=95)
print("Saved 9:16 thumbnail_short.jpg")


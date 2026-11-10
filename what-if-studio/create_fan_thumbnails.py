import shutil
import pathlib
from PIL import Image, ImageDraw, ImageFont

BRAIN_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\fan-off-ammi")

bg_src = BRAIN_DIR / "bg_cozy_bedroom_1793946212840.jpg"
thumb_src = BRAIN_DIR / "thumb_fan_ammi_1793946232184.jpg"

# Resize bedroom background to exact 1920x1080
with Image.open(bg_src) as img:
    img_1080 = img.resize((1920, 1080), Image.Resampling.LANCZOS)
    img_1080.save(PUB_DIR / "bg_cozy_bedroom.jpg", quality=95)
print("Saved 1920x1080 bg_cozy_bedroom.jpg")

# Create 16:9 Thumbnail (1280x720) with high-voltage viral typography
with Image.open(thumb_src) as img:
    thumb_16_9 = img.resize((1280, 720), Image.Resampling.LANCZOS)
    draw = ImageDraw.Draw(thumb_16_9)
    
    # Fonts
    font_bold = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 72)
    font_sub = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 38)
    font_urdu = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 46)

    # Top Banner: "PANKHA BAND! 🔌🔥"
    # Shadow
    for dx, dy in [(-3, -3), (3, -3), (-3, 3), (3, 3), (0, 4), (4, 0)]:
        draw.text((640 + dx, 50 + dy), "JAB AMMI PANKHA BAND KAR DEIN!", fill="#000000", font=font_bold, anchor="mt")
    draw.text((640, 50), "JAB AMMI PANKHA BAND KAR DEIN!", fill="#FDE047", font=font_bold, anchor="mt")

    # Bottom Callout: "7:15 AM = 12:00 PM?! ⏰😱"
    bbox = draw.textbbox((640, 630), "7:15 AM = 12:00 PM?! ⏰😱", font=font_sub, anchor="mb")
    draw.rectangle([bbox[0] - 20, bbox[1] - 8, bbox[2] + 20, bbox[3] + 8], fill="#0F172A", outline="#EF4444", width=3)
    draw.text((640, 630), "7:15 AM = 12:00 PM?! ⏰😱", fill="#FFFFFF", font=font_sub, anchor="mb")

    thumb_16_9.save(PUB_DIR / "thumbnail.jpg", quality=95)
    thumb_16_9.save(BRAIN_DIR / "thumb_fan_ammi_16x9.jpg", quality=95)
print("Saved 16:9 thumbnail.jpg")

# Create 9:16 Short Thumbnail (1080x1920)
thumb_9_16 = Image.new("RGB", (1080, 1920), "#0F172A")
with Image.open(thumb_src) as img:
    # Scale center crop or fit
    w_crop = 1080
    h_crop = int(1080 * 9 / 16) # 607
    img_resized = img.resize((1080, 720), Image.Resampling.LANCZOS)
    thumb_9_16.paste(img_resized, (0, 600))

draw_short = ImageDraw.Draw(thumb_9_16)
font_short_title = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 80)
font_short_sub = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 44)

# Top Badge
draw_short.rectangle([60, 220, 1020, 480], fill="#020617", outline="#FACC15", width=6)
draw_short.text((540, 260), "PANKHA BAND!", fill="#EF4444", font=font_short_title, anchor="mt")
draw_short.text((540, 370), "AMMI KA DANGEROUS ALARM ⏰", fill="#FDE047", font=font_short_sub, anchor="mt")

# Bottom Badge
draw_short.rectangle([80, 1450, 1000, 1650], fill="#020617", outline="#EF4444", width=5)
draw_short.text((540, 1490), "\"UTHO! 12 BAJ GAYE!\"", fill="#FFFFFF", font=font_short_title, anchor="mt")
draw_short.text((540, 1580), "Kiya aapke sath hota hai? 👇", fill="#38BDF8", font=font_short_sub, anchor="mt")

thumb_9_16.save(PUB_DIR / "thumbnail_short.jpg", quality=95)
thumb_9_16.save(BRAIN_DIR / "thumb_fan_ammi_9x16.jpg", quality=95)
print("Saved 9:16 thumbnail_short.jpg")


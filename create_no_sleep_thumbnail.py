import os
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\no-sleep")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\no-sleep")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\no-sleep")

OUT_DIR.mkdir(parents=True, exist_ok=True)

def create_main_thumbnail():
    width, height = 1280, 720
    bg_path = PUB_DIR / "bg_empty_bedroom.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=2))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    # Dark cinematic vignette overlay with purple/red tint
    overlay = Image.new("RGBA", (width, height), (12, 6, 20, 130))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Fonts setup
    font_bold = None
    font_badge = None
    font_sub = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 120)
            font_badge = ImageFont.truetype(f_path, 68)
            font_sub = ImageFont.truetype(f_path, 38)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Center-Right: Giant Neon Digital Wall Clock "03:47 AM"
    clock_x, clock_y = 860, 360
    # Red Glow
    for r in range(160, 40, -15):
        alpha = int(45 * (1 - r / 160))
        draw.ellipse([clock_x - r * 1.6, clock_y - r, clock_x + r * 1.6, clock_y + r], fill=(239, 68, 68, alpha))
    
    # Clock Container
    draw.rounded_rectangle([clock_x - 260, clock_y - 95, clock_x + 260, clock_y + 95], radius=24, fill=(20, 10, 15, 220), outline=(239, 68, 68, 255), width=6)
    draw.rounded_rectangle([clock_x - 245, clock_y - 80, clock_x + 245, clock_y + 80], radius=16, outline=(254, 202, 202, 160), width=2)

    # Clock Digits: "03:47 AM"
    digits = "03:47 AM"
    bbox = draw.textbbox((0, 0), digits, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((clock_x - tw / 2, clock_y - 55), digits, font=font_badge, fill=(239, 68, 68))
    
    label = "DAY 365: SLEEP ILLEGAL"
    l_box = draw.textbbox((0, 0), label, font=font_sub)
    lw = l_box[2] - l_box[0]
    draw.text((clock_x - lw / 2, clock_y + 22), label, font=font_sub, fill=(254, 226, 226))

    # Shadow stickman figures lurking in the background
    for sx, sy in [(1150, 450), (680, 420)]:
        # Shadow body
        draw.ellipse([sx - 35, sy - 180, sx + 35, sy - 110], fill=(5, 5, 10, 200))
        draw.polygon([(sx - 40, sy - 100), (sx + 40, sy - 100), (sx + 50, sy + 120), (sx - 50, sy + 120)], fill=(5, 5, 10, 200))
        # Glowing red slit eyes
        draw.ellipse([sx - 15, sy - 150, sx - 5, sy - 142], fill=(239, 68, 68))
        draw.ellipse([sx + 5, sy - 150, sx + 15, sy - 142], fill=(239, 68, 68))

    # Left: Pip Stickman in Mustard Hoodie (#F59E0B)
    px, py = 290, 490
    # Peach rim aura
    for r in range(95, 60, -5):
        alpha = int(35 * (1 - r / 95))
        draw.ellipse([px - r, py - 200 - r, px + r, py - 200 + r], fill=(255, 170, 85, alpha))
    
    # Pip Head (Dark silhouette #1C1A24 with peach rim stroke #FFAA55)
    draw.ellipse([px - 62, py - 262, px + 62, py - 138], fill=(28, 26, 36), outline=(255, 170, 85), width=6)
    
    # Red exhaustion bags under eyes
    draw.arc([px - 32, py - 205, px - 2, py - 175], start=0, end=180, fill=(239, 68, 68), width=3)
    draw.arc([px + 2, py - 205, px + 32, py - 175], start=0, end=180, fill=(239, 68, 68), width=3)

    # Wide manic white eyes
    draw.ellipse([px - 28, py - 215, px - 6, py - 185], fill=(255, 255, 255))
    draw.ellipse([px + 6, py - 215, px + 28, py - 185], fill=(255, 255, 255))
    # Wide crazed smile
    draw.arc([px - 25, py - 185, px + 25, py - 145], start=0, end=180, fill=(255, 255, 255), width=4)

    # Mustard Yellow Hoodie Torso (#F59E0B)
    draw.polygon([(px - 70, py - 130), (px + 70, py - 130), (px + 90, py + 140), (px - 90, py + 140)], fill=(245, 158, 11))
    draw.line([(px - 20, py - 120), (px - 22, py - 20)], fill=(255, 255, 255), width=7)
    draw.line([(px + 20, py - 120), (px + 22, py - 20)], fill=(255, 255, 255), width=7)

    # Arms holding the glowing capsule
    draw.line([(px + 60, py - 90), (px + 140, py - 60)], fill=(28, 26, 36), width=16)
    draw.line([(px - 50, py - 90), (px + 110, py - 50)], fill=(28, 26, 36), width=16)

    # The Glowing Somnex Blue Capsule (Pill)
    pill_x, pill_y = px + 155, py - 60
    # Cyan Aura
    for r in range(50, 15, -8):
        alpha = int(50 * (1 - r / 50))
        draw.ellipse([pill_x - r, pill_y - r, pill_x + r, pill_y + r], fill=(56, 189, 248, alpha))
    # Pill halves: Left Blue, Right White
    draw.rounded_rectangle([pill_x - 30, pill_y - 14, pill_x, pill_y + 14], radius=8, fill=(14, 165, 233), outline=(56, 189, 248), width=2)
    draw.rounded_rectangle([pill_x, pill_y - 14, pill_x + 30, pill_y + 14], radius=8, fill=(248, 250, 252), outline=(56, 189, 248), width=2)

    # Top-Left Clickbait Title: "NO SLEEP."
    text = "NO SLEEP."
    draw.text((45, 35), text, font=font_bold, fill=(0, 0, 0))
    draw.text((43, 33), text, font=font_bold, fill=(0, 0, 0))
    draw.text((40, 30), text, font=font_bold, fill=(254, 224, 71))

    # Sub-badge below title: "💊 ZERO SLEEP FOREVER"
    badge_w, badge_h = 420, 60
    draw.rounded_rectangle([40, 165, 40 + badge_w, 165 + badge_h], radius=12, fill=(239, 68, 68))
    draw.text((60, 172), "💊 ZERO SLEEP FOREVER", font=font_sub, fill=(255, 255, 255))

    out_main = OUT_DIR / "thumbnail.jpg"
    img.convert("RGB").save(out_main, "JPEG", quality=95)
    print("Saved main thumbnail:", out_main)
    img.convert("RGB").save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail.jpg", "JPEG", quality=95)

def create_short_thumbnail():
    width, height = 720, 1280
    bg_path = PUB_DIR / "bg_empty_bedroom.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (12, 6, 20, 130))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    font_bold = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 110)
            font_badge = ImageFont.truetype(f_path, 65)
            font_sub = ImageFont.truetype(f_path, 40)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Top Title
    draw.text((35, 125), "NO SLEEP.", font=font_bold, fill=(0, 0, 0))
    draw.text((30, 120), "NO SLEEP.", font=font_bold, fill=(254, 224, 71))

    # Giant Neon Pill & Clock in center
    cx, cy = 360, 480
    for r in range(160, 40, -15):
        alpha = int(40 * (1 - r / 160))
        draw.ellipse([cx - r * 1.5, cy - r, cx + r * 1.5, cy + r], fill=(56, 189, 248, alpha))
    draw.rounded_rectangle([cx - 260, cy - 85, cx + 260, cy + 85], radius=24, fill=(15, 23, 42, 220), outline=(56, 189, 248), width=6)
    digits = "💊 SOMNEX-9"
    bbox = draw.textbbox((0, 0), digits, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((cx - tw / 2, cy - 50), digits, font=font_badge, fill=(56, 189, 248))
    draw.text((cx - 150, cy + 20), "SLEEP BANNED FOR 365 DAYS", font=font_sub, fill=(224, 242, 254))

    # Pip in Mustard Hoodie at bottom with exhaustion eyes
    px, py = 360, 960
    draw.ellipse([px - 75, py - 275, px + 75, py - 125], fill=(28, 26, 36), outline=(255, 170, 85), width=6)
    draw.ellipse([px - 30, py - 215, px - 10, py - 195], fill=(255, 255, 255))
    draw.ellipse([px + 10, py - 215, px + 30, py - 195], fill=(255, 255, 255))
    draw.arc([px - 32, py - 200, px - 8, py - 170], start=0, end=180, fill=(239, 68, 68), width=3)
    draw.arc([px + 8, py - 200, px + 32, py - 170], start=0, end=180, fill=(239, 68, 68), width=3)
    draw.polygon([(px - 85, py - 125), (px + 85, py - 125), (px + 110, py + 180), (px - 110, py + 180)], fill=(245, 158, 11))
    draw.line([(px - 25, py - 115), (px - 28, py - 10)], fill=(255, 255, 255), width=8)
    draw.line([(px + 25, py - 115), (px + 28, py - 10)], fill=(255, 255, 255), width=8)

    out_short = OUT_DIR / "thumbnail_short.jpg"
    img.convert("RGB").save(out_short, "JPEG", quality=95)
    print("Saved short thumbnail:", out_short)
    img.convert("RGB").save(PUB_DIR / "thumbnail_short.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail_short.jpg", "JPEG", quality=95)

if __name__ == "__main__":
    create_main_thumbnail()
    create_short_thumbnail()
    print("THUMBNAILS CREATED SUCCESSFULLY!")


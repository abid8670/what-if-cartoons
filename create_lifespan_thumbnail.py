import os
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\lifespan")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\lifespan")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\lifespan")

OUT_DIR.mkdir(parents=True, exist_ok=True)

def create_main_thumbnail():
    width, height = 1280, 720
    bg_path = PUB_DIR / "bg_city_street.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=2))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    # Dark cinematic vignette overlay
    overlay = Image.new("RGBA", (width, height), (8, 10, 22, 110))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Giant Holographic Countdown Timer floating in center-right
    timer_x, timer_y = 860, 360
    # Red Glow
    for r in range(160, 40, -15):
        alpha = int(45 * (1 - r / 160))
        draw.ellipse([timer_x - r * 1.6, timer_y - r, timer_x + r * 1.6, timer_y + r], fill=(239, 68, 68, alpha))
    
    # Timer container HUD
    draw.rounded_rectangle([timer_x - 260, timer_y - 90, timer_x + 260, timer_y + 90], radius=24, fill=(15, 23, 42, 210), outline=(239, 68, 68, 255), width=6)
    draw.rounded_rectangle([timer_x - 245, timer_y - 75, timer_x + 245, timer_y + 75], radius=16, outline=(254, 202, 202, 180), width=2)

    # Font setup
    font_bold = None
    font_badge = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 115)
            font_badge = ImageFont.truetype(f_path, 72)
            font_sub = ImageFont.truetype(f_path, 40)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Digits inside timer: "00:00:12"
    digits = "00:00:12"
    bbox = draw.textbbox((0, 0), digits, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((timer_x - tw / 2, timer_y - 50), digits, font=font_badge, fill=(255, 68, 68))
    
    label = "CRITICAL LIFESPAN"
    l_box = draw.textbbox((0, 0), label, font=font_sub)
    lw = l_box[2] - l_box[0]
    draw.text((timer_x - lw / 2, timer_y + 25), label, font=font_sub, fill=(254, 226, 226))

    # Pip Stickman in Mustard Hoodie on Left side
    px, py = 290, 480
    # Peach rim aura
    for r in range(95, 60, -5):
        alpha = int(35 * (1 - r / 95))
        draw.ellipse([px - r, py - 200 - r, px + r, py - 200 + r], fill=(255, 170, 85, alpha))
    
    # Pip Head (Dark silhouette #1C1A24 with peach rim stroke #FFAA55)
    draw.ellipse([px - 62, py - 262, px + 62, py - 138], fill=(28, 26, 36), outline=(255, 170, 85), width=6)
    
    # Shocked white eyes
    draw.ellipse([px - 25, py - 210, px - 5, py - 190], fill=(255, 255, 255))
    draw.ellipse([px + 5, py - 210, px + 25, py - 190], fill=(255, 255, 255))
    # Open shock mouth
    draw.ellipse([px - 14, py - 175, px + 14, py - 150], fill=(255, 255, 255))

    # Mustard Yellow Hoodie Torso (#F59E0B)
    draw.polygon([(px - 70, py - 130), (px + 70, py - 130), (px + 90, py + 140), (px - 90, py + 140)], fill=(245, 158, 11))
    # White drawstrings
    draw.line([(px - 20, py - 120), (px - 22, py - 20)], fill=(255, 255, 255), width=7)
    draw.line([(px + 20, py - 120), (px + 22, py - 20)], fill=(255, 255, 255), width=7)

    # Raised hands (Shock pose)
    draw.line([(px - 70, py - 90), (px - 140, py - 150)], fill=(28, 26, 36), width=16)
    draw.line([(px + 70, py - 90), (px + 140, py - 150)], fill=(28, 26, 36), width=16)
    draw.ellipse([px - 155, py - 165, px - 125, py - 135], fill=(28, 26, 36))
    draw.ellipse([px + 125, py - 165, px + 155, py - 135], fill=(28, 26, 36))

    # Yellow timer above Pip's own head too: "72:00:00"
    draw.rounded_rectangle([px - 90, py - 340, px + 90, py - 290], radius=12, fill=(15, 23, 42, 220), outline=(245, 158, 11), width=4)
    draw.text((px - 70, py - 335), "72:00:00", font=font_sub, fill=(245, 158, 11))

    # High-impact clickbait text in TOP-LEFT: "DEATH CLOCK."
    text = "DEATH CLOCK."
    # Black shadow offset
    draw.text((45, 35), text, font=font_bold, fill=(0, 0, 0))
    draw.text((43, 33), text, font=font_bold, fill=(0, 0, 0))
    # Bright Yellow text
    draw.text((40, 30), text, font=font_bold, fill=(254, 224, 71))

    # Sub-badge below title: "SEE THE TIMER."
    badge_w, badge_h = 360, 60
    draw.rounded_rectangle([40, 165, 40 + badge_w, 165 + badge_h], radius=12, fill=(239, 68, 68))
    draw.text((60, 172), "SEE THE TIMER.", font=font_sub, fill=(255, 255, 255))

    out_main = OUT_DIR / "thumbnail.jpg"
    img.convert("RGB").save(out_main, "JPEG", quality=95)
    print("Saved main thumbnail:", out_main)
    # Also copy to public and public_timer
    img.convert("RGB").save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail.jpg", "JPEG", quality=95)

def create_short_thumbnail():
    width, height = 720, 1280
    bg_path = PUB_DIR / "bg_city_street.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (8, 10, 22, 120))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    font_bold = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 105)
            font_badge = ImageFont.truetype(f_path, 60)
            font_sub = ImageFont.truetype(f_path, 40)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Top Title
    draw.text((35, 125), "DEATH CLOCK.", font=font_bold, fill=(0, 0, 0))
    draw.text((30, 120), "DEATH CLOCK.", font=font_bold, fill=(254, 224, 71))

    # Giant HUD countdown in center
    cx, cy = 360, 480
    for r in range(160, 40, -15):
        alpha = int(40 * (1 - r / 160))
        draw.ellipse([cx - r * 1.5, cy - r, cx + r * 1.5, cy + r], fill=(239, 68, 68, alpha))
    draw.rounded_rectangle([cx - 250, cy - 80, cx + 250, cy + 80], radius=24, fill=(15, 23, 42, 220), outline=(239, 68, 68), width=6)
    digits = "00:00:06"
    bbox = draw.textbbox((0, 0), digits, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((cx - tw / 2, cy - 45), digits, font=font_badge, fill=(255, 68, 68))
    draw.text((cx - 100, cy + 20), "TIME REMAINING", font=font_sub, fill=(254, 226, 226))

    # Pip in Mustard Hoodie at bottom
    px, py = 360, 960
    draw.ellipse([px - 75, py - 275, px + 75, py - 125], fill=(28, 26, 36), outline=(255, 170, 85), width=6)
    draw.ellipse([px - 30, py - 215, px - 10, py - 195], fill=(255, 255, 255))
    draw.ellipse([px + 10, py - 215, px + 30, py - 195], fill=(255, 255, 255))
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


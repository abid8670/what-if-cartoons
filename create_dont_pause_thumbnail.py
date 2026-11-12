import os
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\dont-pause")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-pause")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\dont-pause")

OUT_DIR.mkdir(parents=True, exist_ok=True)

def create_main_thumbnail():
    width, height = 1280, 720
    bg_path = PUB_DIR / "bg_empty_bedroom.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=2))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (12, 8, 18, 140))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    font_bold = None
    font_badge = None
    font_sub = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 120)
            font_badge = ImageFont.truetype(f_path, 60)
            font_sub = ImageFont.truetype(f_path, 34)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Giant Glowing Red Holographic Pause Icon on Right
    pause_x, pause_y = 900, 370
    # Red / Amber Glow
    for r in range(160, 40, -15):
        alpha = int(45 * (1 - r / 160))
        draw.ellipse([pause_x - r * 1.3, pause_y - r * 1.3, pause_x + r * 1.3, pause_y + r * 1.3], fill=(239, 68, 68, alpha))

    # Glowing Red Pause Circle
    draw.ellipse([pause_x - 140, pause_y - 140, pause_x + 140, pause_y + 140], fill=(20, 10, 15, 230), outline=(239, 68, 68), width=8)
    # Pause Bars (⏸️)
    draw.rounded_rectangle([pause_x - 65, pause_y - 80, pause_x - 20, pause_y + 80], radius=10, fill=(239, 68, 68))
    draw.rounded_rectangle([pause_x + 20, pause_y - 80, pause_x + 65, pause_y + 80], radius=10, fill=(239, 68, 68))

    # Caution hazard stripes at top & bottom
    for i in range(0, width, 60):
        draw.polygon([(i, 0), (i + 30, 0), (i + 15, 20), (i - 15, 20)], fill=(245, 158, 11, 200))

    # Left: Pip Stickman in Mustard Hoodie (#F59E0B)
    px, py = 330, 470
    # Peach rim aura
    for r in range(95, 60, -5):
        alpha = int(35 * (1 - r / 95))
        draw.ellipse([px - r, py - 200 - r, px + r, py - 200 + r], fill=(255, 170, 85, alpha))

    # Pip Head (Dark silhouette #1C1A24 with peach rim stroke #FFAA55)
    draw.ellipse([px - 64, py - 264, px + 64, py - 136], fill=(28, 26, 36), outline=(255, 170, 85), width=6)

    # Wide Panicked White Eyes
    draw.ellipse([px - 34, py - 215, px - 10, py - 185], fill=(255, 255, 255))
    draw.ellipse([px + 6, py - 215, px + 30, py - 185], fill=(255, 255, 255))
    draw.ellipse([px - 22, py - 205, px - 14, py - 195], fill=(28, 26, 36))
    draw.ellipse([px + 14, py - 205, px + 22, py - 195], fill=(28, 26, 36))

    # Sweat drops flying
    draw.ellipse([px + 68, py - 230, px + 78, py - 215], fill=(56, 189, 248))
    draw.ellipse([px + 82, py - 210, px + 90, py - 198], fill=(56, 189, 248))

    # Wide Open Screaming Mouth
    draw.ellipse([px - 16, py - 175, px + 16, py - 145], fill=(239, 68, 68), outline=(255, 255, 255), width=2)

    # Mustard Yellow Hoodie Torso (#F59E0B)
    draw.polygon([(px - 72, py - 130), (px + 72, py - 130), (px + 92, py + 145), (px - 92, py + 145)], fill=(245, 158, 11))
    draw.line([(px - 22, py - 120), (px - 24, py - 15)], fill=(255, 255, 255), width=7)
    draw.line([(px + 22, py - 120), (px + 24, py - 15)], fill=(255, 255, 255), width=7)

    # Stickman Arms Desperately Pushing Forward / Warning Stop Gesture
    draw.line([(px - 60, py - 85), (px + 85, py - 70)], fill=(28, 26, 36), width=16)
    draw.line([(px + 60, py - 85), (px + 130, py - 50)], fill=(28, 26, 36), width=16)
    # Open Hands
    draw.ellipse([px + 85, py - 80, px + 105, py - 60], fill=(28, 26, 36))
    draw.ellipse([px + 130, py - 60, px + 150, py - 40], fill=(28, 26, 36))

    # Top Left / Center: Clickbait Headline "DO NOT PAUSE."
    title_text = "DO NOT PAUSE."
    tx, ty = 75, 55
    # Shadow / Outline
    for ox, oy in [(-5, -5), (5, -5), (-5, 5), (5, 5), (0, 7), (7, 0), (-7, 0), (0, -7)]:
        draw.text((tx + ox, ty + oy), title_text, font=font_bold, fill=(0, 0, 0))
    draw.text((tx, ty), title_text, font=font_bold, fill=(239, 68, 68)) # Fiery Red

    # Red/Yellow Pill Badge: "⚠️ 99% FAIL RATE"
    bx, by = 75, 195
    draw.rounded_rectangle([bx, by, bx + 540, by + 80], radius=18, fill=(220, 38, 38), outline=(255, 255, 255), width=5)
    draw.text((bx + 25, by + 8), "⚠️ 99% FAIL RATE", font=font_badge, fill=(255, 255, 255))

    # Save Main Thumbnail
    main_thumb_path = OUT_DIR / "thumbnail.jpg"
    img.convert("RGB").save(main_thumb_path, "JPEG", quality=95)
    img.convert("RGB").save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail.jpg", "JPEG", quality=95)
    print(f"Created Main Thumbnail: {main_thumb_path} ({main_thumb_path.stat().st_size} bytes)")

def create_short_thumbnail():
    width, height = 1080, 1920
    bg_path = PUB_DIR / "bg_empty_bedroom.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (12, 8, 18, 140))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    font_bold = None
    font_badge = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 150)
            font_badge = ImageFont.truetype(f_path, 80)
            break
    if font_bold is None:
        font_bold = font_badge = ImageFont.load_default()

    # Giant Headline at Top
    title = "DO NOT\nPAUSE."
    tx, ty = 140, 220
    for ox, oy in [(-6, -6), (6, -6), (-6, 6), (6, 6), (0, 8)]:
        draw.text((tx + ox, ty + oy), title, font=font_bold, fill=(0, 0, 0), align="center")
    draw.text((tx, ty), title, font=font_bold, fill=(239, 68, 68), align="center")

    # Red Fail Badge
    bx, by = 120, 560
    draw.rounded_rectangle([bx, by, bx + 840, by + 120], radius=24, fill=(220, 38, 38), outline=(255, 255, 255), width=6)
    draw.text((bx + 40, by + 12), "⚠️ 99% WILL FAIL", font=font_badge, fill=(255, 255, 255))

    # Giant Center Pip in Panicked Warning Pose
    px, py = 540, 1260
    for r in range(160, 100, -10):
        alpha = int(40 * (1 - r / 160))
        draw.ellipse([px - r, py - 320 - r, px + r, py - 320 + r], fill=(255, 170, 85, alpha))

    # Pip Head
    draw.ellipse([px - 110, py - 430, px + 110, py - 210], fill=(28, 26, 36), outline=(255, 170, 85), width=9)
    # Eyes
    draw.ellipse([px - 55, py - 350, px - 15, py - 295], fill=(255, 255, 255))
    draw.ellipse([px + 15, py - 350, px + 55, py - 295], fill=(255, 255, 255))
    draw.ellipse([px - 40, py - 335, px - 25, py - 310], fill=(28, 26, 36))
    draw.ellipse([px + 25, py - 335, px + 40, py - 310], fill=(28, 26, 36))
    # Mouth
    draw.ellipse([px - 25, py - 280, px + 25, py - 235], fill=(239, 68, 68), outline=(255, 255, 255), width=3)

    # Hoodie
    draw.polygon([(px - 130, py - 200), (px + 130, py - 200), (px + 160, py + 240), (px - 160, py + 240)], fill=(245, 158, 11))
    draw.line([(px - 35, py - 180), (px - 40, py - 20)], fill=(255, 255, 255), width=10)
    draw.line([(px + 35, py - 180), (px + 40, py - 20)], fill=(255, 255, 255), width=10)

    # Pause Icon in foreground
    draw.ellipse([px - 100, py + 120, px + 100, py + 320], fill=(20, 10, 15, 220), outline=(239, 68, 68), width=8)
    draw.rounded_rectangle([px - 45, py + 165, px - 15, py + 275], radius=6, fill=(239, 68, 68))
    draw.rounded_rectangle([px + 15, py + 165, px + 45, py + 275], radius=6, fill=(239, 68, 68))

    # Save Short Thumbnail
    short_thumb_path = OUT_DIR / "thumbnail_short.jpg"
    img.convert("RGB").save(short_thumb_path, "JPEG", quality=95)
    img.convert("RGB").save(PUB_DIR / "thumbnail_short.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail_short.jpg", "JPEG", quality=95)
    print(f"Created Short Thumbnail: {short_thumb_path} ({short_thumb_path.stat().st_size} bytes)")

if __name__ == "__main__":
    create_main_thumbnail()
    create_short_thumbnail()


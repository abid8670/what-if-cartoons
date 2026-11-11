import os
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\memories")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\memories")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\memories")

OUT_DIR.mkdir(parents=True, exist_ok=True)

def create_main_thumbnail():
    width, height = 1280, 720
    bg_path = PUB_DIR / "bg_biotech_vault.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    # Dark overlay
    overlay = Image.new("RGBA", (width, height), (5, 8, 20, 110))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Glowing memory vial in center-right
    vial_x, vial_y = 780, 360
    # Glow rings
    for r in range(120, 20, -10):
        alpha = int(35 * (1 - r / 120))
        draw.ellipse([vial_x - r, vial_y - r - 40, vial_x + r, vial_y + r + 40], fill=(6, 182, 212, alpha))
    # Glass cylinder
    draw.rectangle([vial_x - 45, vial_y - 120, vial_x + 45, vial_y + 120], fill=(15, 23, 42, 180), outline=(56, 189, 248, 255), width=5)
    # Neural brain electricity core
    draw.ellipse([vial_x - 30, vial_y - 50, vial_x + 30, vial_y + 50], fill=(253, 224, 71, 230))
    draw.ellipse([vial_x - 18, vial_y - 30, vial_x + 18, vial_y + 30], fill=(255, 255, 255, 255))

    # Cash stacks floating
    for cx, cy in [(620, 520), (940, 520), (780, 580)]:
        draw.rectangle([cx - 70, cy - 25, cx + 70, cy + 25], fill=(34, 197, 94, 240), outline=(22, 101, 52, 255), width=3)
        draw.rectangle([cx - 50, cy - 10, cx + 50, cy + 10], fill=(240, 253, 244, 220))

    # Pip Stickman silhouette left side
    pip_x, pip_y = 380, 420
    # Peach rim aura
    draw.ellipse([pip_x - 85, pip_y - 185, pip_x + 85, pip_y - 15], fill=(255, 170, 85, 140))
    # Head
    draw.ellipse([pip_x - 70, pip_y - 170, pip_x + 70, pip_y - 30], fill=(28, 26, 36, 255))
    # Mustard Hoodie body
    draw.polygon([(pip_x - 110, pip_y + 240), (pip_x + 110, pip_y + 240), (pip_x + 75, pip_y - 10), (pip_x - 75, pip_y - 10)], fill=(245, 158, 11, 255))
    # White eyes (shock / realization)
    draw.ellipse([pip_x - 15, pip_y - 115, pip_x + 5, pip_y - 85], fill=(255, 255, 255, 255))
    draw.ellipse([pip_x + 25, pip_y - 115, pip_x + 45, pip_y - 85], fill=(255, 255, 255, 255))

    # Typography (Iflord-style 3-word hook)
    try:
        font_huge = ImageFont.truetype("arialbd.ttf", 94)
        font_sub = ImageFont.truetype("arialbd.ttf", 52)
    except Exception:
        font_huge = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    # Badge 1: SOLD MEMORY.
    tx, ty = 60, 45
    # Black outline shadow
    for ox in [-5, 0, 5]:
        for oy in [-5, 0, 5]:
            draw.text((tx + ox, ty + oy), "SOLD MEMORY.", font=font_huge, fill=(0, 0, 0, 255))
    draw.text((tx, ty), "SOLD MEMORY.", font=font_huge, fill=(245, 158, 11, 255))

    # Badge 2: $50,000,000 CASH
    bx, by = 65, 160
    draw.rectangle([bx - 10, by - 8, bx + 550, by + 68], fill=(15, 23, 42, 230), outline=(34, 197, 94, 255), width=4)
    draw.text((bx + 15, by), "$50,000,000 CASH", font=font_sub, fill=(34, 197, 94, 255))

    out_main = OUT_DIR / "thumbnail.jpg"
    img.convert("RGB").save(out_main, quality=95)
    img.convert("RGB").save(PUB_DIR / "thumbnail.jpg", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail.jpg", quality=95)
    print(f"✅ Generated 16:9 Thumbnail: {out_main} ({out_main.stat().st_size} bytes)")

def create_short_thumbnail():
    width, height = 1080, 1920
    bg_path = PUB_DIR / "bg_luxury_penthouse.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=4))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (5, 8, 20, 130))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Pip Stickman in center
    pip_x, pip_y = 540, 960
    # Peach rim aura
    draw.ellipse([pip_x - 140, pip_y - 280, pip_x + 140, pip_y], fill=(255, 170, 85, 140))
    # Head
    draw.ellipse([pip_x - 110, pip_y - 250, pip_x + 110, pip_y - 30], fill=(28, 26, 36, 255))
    # Mustard Hoodie body
    draw.polygon([(pip_x - 170, pip_y + 360), (pip_x + 170, pip_y + 360), (pip_x + 110, pip_y - 10), (pip_x - 110, pip_y - 10)], fill=(245, 158, 11, 255))
    # Eyes
    draw.ellipse([pip_x - 40, pip_y - 160, pip_x - 10, pip_y - 120], fill=(255, 255, 255, 255))
    draw.ellipse([pip_x + 20, pip_y - 160, pip_x + 50, pip_y - 120], fill=(255, 255, 255, 255))

    # Glowing Memory Jar in hands
    draw.rectangle([pip_x - 60, pip_y + 60, pip_x + 60, pip_y + 220], fill=(15, 23, 42, 200), outline=(56, 189, 248, 255), width=6)
    draw.ellipse([pip_x - 40, pip_y + 100, pip_x + 40, pip_y + 180], fill=(253, 224, 71, 240))

    try:
        font_big = ImageFont.truetype("arialbd.ttf", 90)
        font_sub = ImageFont.truetype("arialbd.ttf", 55)
    except Exception:
        font_big = ImageFont.load_default()
        font_sub = ImageFont.load_default()

    # Top Hook Banner
    draw.rectangle([50, 220, 1030, 370], fill=(15, 23, 42, 230), outline=(245, 158, 11, 255), width=6)
    draw.text((100, 250), "SOLD ALL MEMORY.", font=font_big, fill=(245, 158, 11, 255))

    # Bottom Hook Banner
    draw.rectangle([80, 1520, 1000, 1660], fill=(15, 23, 42, 230), outline=(34, 197, 94, 255), width=6)
    draw.text((130, 1560), "NOW A $50M GHOST!", font=font_sub, fill=(34, 197, 94, 255))

    out_short = OUT_DIR / "thumbnail_short.jpg"
    img.convert("RGB").save(out_short, quality=95)
    img.convert("RGB").save(PUB_DIR / "thumbnail_short.jpg", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail_short.jpg", quality=95)
    print(f"✅ Generated 9:16 Short Thumbnail: {out_short} ({out_short.stat().st_size} bytes)")

if __name__ == "__main__":
    create_main_thumbnail()
    create_short_thumbnail()


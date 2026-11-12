import os
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\delete-memory")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\delete-memory")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\delete-memory")

OUT_DIR.mkdir(parents=True, exist_ok=True)

def create_main_thumbnail():
    width, height = 1280, 720
    bg_path = PUB_DIR / "bg_biotech_vault.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=2))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    # Dark cinematic vignette overlay with cyan/indigo tint
    overlay = Image.new("RGBA", (width, height), (10, 15, 28, 140))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Fonts setup
    font_bold = None
    font_badge = None
    font_sub = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 115)
            font_badge = ImageFont.truetype(f_path, 60)
            font_sub = ImageFont.truetype(f_path, 36)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Center-Right: Giant Glowing Memory Tube with Cyan Neural Pulse
    tube_x, tube_y = 900, 380
    # Cyan Glow
    for r in range(160, 40, -15):
        alpha = int(45 * (1 - r / 160))
        draw.ellipse([tube_x - r * 1.4, tube_y - r * 1.2, tube_x + r * 1.4, tube_y + r * 1.2], fill=(6, 182, 212, alpha))
    
    # Glass Cylinder Container
    draw.rounded_rectangle([tube_x - 170, tube_y - 220, tube_x + 170, tube_y + 220], radius=28, fill=(15, 23, 42, 210), outline=(6, 182, 212, 255), width=6)
    draw.rounded_rectangle([tube_x - 155, tube_y - 205, tube_x + 155, tube_y + 205], radius=20, outline=(165, 243, 252, 140), width=2)

    # Inside Cylinder: Glowing Neural Brain / Cloud
    for i in range(12):
        bx = tube_x + (i % 4 - 1.5) * 40
        by = tube_y + (i // 4 - 1) * 45
        draw.ellipse([bx - 35, by - 35, bx + 35, by + 35], fill=(34, 211, 238, 120))
    # Red Warning Stamp over memory: "DELETED"
    draw.rounded_rectangle([tube_x - 140, tube_y - 35, tube_x + 140, tube_y + 35], radius=12, fill=(239, 68, 68, 230), outline=(255, 255, 255, 255), width=3)
    del_box = draw.textbbox((0, 0), "PURGED", font=font_badge)
    dw = del_box[2] - del_box[0]
    draw.text((tube_x - dw / 2, tube_y - 32), "PURGED", font=font_badge, fill=(255, 255, 255))

    lbl = "MEMORY #07: MOTHER"
    l_box = draw.textbbox((0, 0), lbl, font=font_sub)
    lw = l_box[2] - l_box[0]
    draw.text((tube_x - lw / 2, tube_y + 140), lbl, font=font_sub, fill=(207, 250, 254))

    # Stacks of Cash at Pip's Feet
    for cx, cy in [(420, 620), (490, 600), (560, 630), (360, 640)]:
        draw.rectangle([cx - 45, cy - 20, cx + 45, cy + 20], fill=(16, 185, 129), outline=(5, 150, 105), width=3)
        draw.rectangle([cx - 15, cy - 20, cx + 15, cy + 20], fill=(255, 255, 255, 180))
        draw.text((cx - 8, cy - 12), "$", font=font_sub, fill=(6, 78, 59))

    # Left: Pip Stickman in Mustard Hoodie (#F59E0B)
    px, py = 320, 470
    # Warm Peach Rim Aura (#FFAA55)
    for r in range(95, 60, -5):
        alpha = int(35 * (1 - r / 95))
        draw.ellipse([px - r, py - 200 - r, px + r, py - 200 + r], fill=(255, 170, 85, alpha))
    
    # Pip Head (Dark silhouette #1C1A24 with peach rim stroke #FFAA55)
    draw.ellipse([px - 64, py - 264, px + 64, py - 136], fill=(28, 26, 36), outline=(255, 170, 85), width=6)
    
    # Head Glitch / Pixel static dust on right side of head
    for gx, gy, sz in [
        (px + 45, py - 250, 14), (px + 60, py - 230, 18), (px + 75, py - 260, 12),
        (px + 55, py - 200, 16), (px + 80, py - 180, 14), (px + 95, py - 210, 10),
        (px + 40, py - 160, 15), (px + 70, py - 150, 12), (px + 105, py - 170, 8)
    ]:
        draw.rectangle([gx, gy, gx + sz, gy + sz], fill=(6, 182, 212, 220))

    # Wide Shocked White Eyes with dilated pupils
    draw.ellipse([px - 32, py - 215, px - 8, py - 185], fill=(255, 255, 255))
    draw.ellipse([px + 4, py - 215, px + 28, py - 185], fill=(255, 255, 255))
    draw.ellipse([px - 22, py - 205, px - 14, py - 195], fill=(28, 26, 36))
    draw.ellipse([px + 12, py - 205, px + 20, py - 195], fill=(28, 26, 36))

    # Open Shocked Mouth
    draw.ellipse([px - 14, py - 175, px + 14, py - 150], fill=(239, 68, 68), outline=(255, 255, 255), width=2)

    # Mustard Yellow Hoodie Torso (#F59E0B)
    draw.polygon([(px - 72, py - 130), (px + 72, py - 130), (px + 92, py + 145), (px - 92, py + 145)], fill=(245, 158, 11))
    draw.line([(px - 22, py - 120), (px - 24, py - 15)], fill=(255, 255, 255), width=7)
    draw.line([(px + 22, py - 120), (px + 24, py - 15)], fill=(255, 255, 255), width=7)

    # Stickman Arms holding the Glowing Smartphone
    draw.line([(px - 60, py - 85), (px + 70, py - 40)], fill=(28, 26, 36), width=16)
    draw.line([(px + 60, py - 85), (px + 85, py - 40)], fill=(28, 26, 36), width=16)

    # Glowing Smartphone Screen in Pip's Hands
    phone_x, phone_y = px + 95, py - 35
    draw.rounded_rectangle([phone_x - 45, phone_y - 75, phone_x + 45, phone_y + 75], radius=12, fill=(15, 23, 42), outline=(6, 182, 212), width=4)
    # Red Trash / Delete Button on screen
    draw.rounded_rectangle([phone_x - 32, phone_y - 45, phone_x + 32, phone_y - 5], radius=8, fill=(239, 68, 68))
    draw.text((phone_x - 22, phone_y - 40), "DEL", font=font_sub, fill=(255, 255, 255))
    # Green Cash text
    draw.text((phone_x - 32, phone_y + 10), "+$100K", font=font_sub, fill=(16, 185, 129))

    # Top Left / Center: Clickbait Headline "DELETE MEMORY."
    title_text = "DELETE MEMORY."
    tx, ty = 80, 50
    # Shadow / Outline
    for ox, oy in [(-5, -5), (5, -5), (-5, 5), (5, 5), (0, 7), (7, 0), (-7, 0), (0, -7)]:
        draw.text((tx + ox, ty + oy), title_text, font=font_bold, fill=(0, 0, 0))
    draw.text((tx, ty), title_text, font=font_bold, fill=(250, 204, 21)) # Vivid Yellow

    # Emerald Green Cash Badge: "💰 $100,000 PER MEMORY"
    bx, by = 80, 185
    draw.rounded_rectangle([bx, by, bx + 640, by + 82], radius=18, fill=(16, 185, 129), outline=(255, 255, 255), width=5)
    draw.text((bx + 20, by + 6), "$100,000 PER MEMORY", font=font_badge, fill=(255, 255, 255))

    # Save Thumbnail
    main_thumb_path = OUT_DIR / "thumbnail.jpg"
    img.convert("RGB").save(main_thumb_path, "JPEG", quality=95)
    img.convert("RGB").save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail.jpg", "JPEG", quality=95)
    print(f"Created Main Thumbnail: {main_thumb_path} ({main_thumb_path.stat().st_size} bytes)")

def create_short_thumbnail():
    width, height = 1080, 1920
    bg_path = PUB_DIR / "bg_biotech_vault.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (10, 15, 28, 140))
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
    title = "DELETE\nMEMORY."
    tx, ty = 100, 220
    for ox, oy in [(-6, -6), (6, -6), (-6, 6), (6, 6), (0, 8)]:
        draw.text((tx + ox, ty + oy), title, font=font_bold, fill=(0, 0, 0), align="center")
    draw.text((tx, ty), title, font=font_bold, fill=(250, 204, 21), align="center")

    # Green Cash Badge
    bx, by = 100, 560
    draw.rounded_rectangle([bx, by, bx + 880, by + 120], radius=24, fill=(16, 185, 129), outline=(255, 255, 255), width=6)
    draw.text((bx + 35, by + 12), "$100,000 CASH", font=font_badge, fill=(255, 255, 255))

    # Giant Pip in Center
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
    draw.ellipse([px - 25, py - 280, px + 25, py - 240], fill=(239, 68, 68), outline=(255, 255, 255), width=3)

    # Head Glitch
    for gx, gy, sz in [
        (px + 70, py - 410, 24), (px + 95, py - 380, 28), (px + 120, py - 430, 20),
        (px + 85, py - 330, 25), (px + 130, py - 300, 22), (px + 150, py - 340, 16)
    ]:
        draw.rectangle([gx, gy, gx + sz, gy + sz], fill=(6, 182, 212, 220))

    # Hoodie
    draw.polygon([(px - 130, py - 200), (px + 130, py - 200), (px + 160, py + 240), (px - 160, py + 240)], fill=(245, 158, 11))
    draw.line([(px - 35, py - 180), (px - 40, py - 20)], fill=(255, 255, 255), width=10)
    draw.line([(px + 35, py - 180), (px + 40, py - 20)], fill=(255, 255, 255), width=10)

    # Save Short Thumbnail
    short_thumb_path = OUT_DIR / "thumbnail_short.jpg"
    img.convert("RGB").save(short_thumb_path, "JPEG", quality=95)
    img.convert("RGB").save(PUB_DIR / "thumbnail_short.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail_short.jpg", "JPEG", quality=95)
    print(f"Created Short Thumbnail: {short_thumb_path} ({short_thumb_path.stat().st_size} bytes)")

if __name__ == "__main__":
    create_main_thumbnail()
    create_short_thumbnail()


import os
import pathlib
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\time-remote")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\time-remote")
PUB_TIMER_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\time-remote")

OUT_DIR.mkdir(parents=True, exist_ok=True)

def create_main_thumbnail():
    width, height = 1280, 720
    bg_path = PUB_DIR / "bg_subway_platform.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=2))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    # Dark cinematic vignette overlay with cyan temporal tint
    overlay = Image.new("RGBA", (width, height), (6, 12, 26, 120))
    img = Image.alpha_composite(img, overlay)
    draw = ImageDraw.Draw(img)

    # Fonts setup
    font_bold = None
    font_badge = None
    font_sub = None
    for f_path in ["C:/Windows/Fonts/impact.ttf", "C:/Windows/Fonts/arialbd.ttf"]:
        if os.path.exists(f_path):
            font_bold = ImageFont.truetype(f_path, 115)
            font_badge = ImageFont.truetype(f_path, 68)
            font_sub = ImageFont.truetype(f_path, 38)
            break
    if font_bold is None:
        font_bold = font_badge = font_sub = ImageFont.load_default()

    # Center-Right: Giant Rewind Hologram HUD
    hud_x, hud_y = 860, 360
    # Cyan Glow
    for r in range(160, 40, -15):
        alpha = int(45 * (1 - r / 160))
        draw.ellipse([hud_x - r * 1.6, hud_y - r, hud_x + r * 1.6, hud_y + r], fill=(56, 189, 248, alpha))
    
    # HUD Container
    draw.rounded_rectangle([hud_x - 260, hud_y - 95, hud_x + 260, hud_y + 95], radius=24, fill=(10, 20, 38, 220), outline=(56, 189, 248, 255), width=6)
    draw.rounded_rectangle([hud_x - 245, hud_y - 80, hud_x + 245, hud_y + 80], radius=16, outline=(186, 230, 253, 160), width=2)

    # Text inside HUD: "⏪ -10.00s"
    digits = "⏪ -10.00s"
    bbox = draw.textbbox((0, 0), digits, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((hud_x - tw / 2, hud_y - 55), digits, font=font_badge, fill=(56, 189, 248))
    
    label = "TEMPORAL REVERSAL ACTIVE"
    l_box = draw.textbbox((0, 0), label, font=font_sub)
    lw = l_box[2] - l_box[0]
    draw.text((hud_x - lw / 2, hud_y + 22), label, font=font_sub, fill=(224, 242, 254))

    # Mid-Air Flying Coffee Cup (Rewinding Liquid)
    cup_x, cup_y = 600, 320
    # Cyan speed streaks
    for i in range(4):
        draw.line([(cup_x + 60 + i * 20, cup_y - 30 + i * 15), (cup_x + 120 + i * 20, cup_y - 50 + i * 15)], fill=(56, 189, 248, 200), width=3)
    # White ceramic cup
    draw.polygon([(cup_x - 25, cup_y - 35), (cup_x + 25, cup_y - 35), (cup_x + 18, cup_y + 35), (cup_x - 18, cup_y + 35)], fill=(245, 245, 245), outline=(56, 189, 248), width=3)
    # Sucked back coffee droplet trail
    draw.ellipse([cup_x - 8, cup_y - 60, cup_x + 8, cup_y - 45], fill=(120, 53, 15))
    draw.ellipse([cup_x + 15, cup_y - 80, cup_x + 27, cup_y - 68], fill=(120, 53, 15))

    # Left: Pip Stickman in Mustard Hoodie (#F59E0B)
    px, py = 280, 490
    # Peach rim aura
    for r in range(95, 60, -5):
        alpha = int(35 * (1 - r / 95))
        draw.ellipse([px - r, py - 200 - r, px + r, py - 200 + r], fill=(255, 170, 85, alpha))
    
    # Pip Head (Dark silhouette #1C1A24 with peach rim stroke #FFAA55)
    draw.ellipse([px - 62, py - 262, px + 62, py - 138], fill=(28, 26, 36), outline=(255, 170, 85), width=6)
    
    # Shocked white eyes
    draw.ellipse([px - 26, py - 212, px - 6, py - 188], fill=(255, 255, 255))
    draw.ellipse([px + 6, py - 212, px + 26, py - 188], fill=(255, 255, 255))
    # Open shock mouth
    draw.ellipse([px - 14, py - 175, px + 14, py - 150], fill=(255, 255, 255))

    # Mustard Yellow Hoodie Torso (#F59E0B)
    draw.polygon([(px - 70, py - 130), (px + 70, py - 130), (px + 90, py + 140), (px - 90, py + 140)], fill=(245, 158, 11))
    # White drawstrings
    draw.line([(px - 20, py - 120), (px - 22, py - 20)], fill=(255, 255, 255), width=7)
    draw.line([(px + 20, py - 120), (px + 22, py - 20)], fill=(255, 255, 255), width=7)

    # Arms holding the Remote
    # Arm reaching forward holding remote
    draw.line([(px + 60, py - 90), (px + 130, py - 50)], fill=(28, 26, 36), width=16)
    draw.line([(px - 50, py - 90), (px + 100, py - 40)], fill=(28, 26, 36), width=16)

    # The Retro Rewind Remote in Pip's Hands
    rem_x, rem_y = px + 145, py - 50
    draw.rounded_rectangle([rem_x - 35, rem_y - 50, rem_x + 35, rem_y + 50], radius=10, fill=(30, 41, 59), outline=(148, 163, 184), width=3)
    # Glowing Red REWIND Button
    draw.ellipse([rem_x - 18, rem_y - 30, rem_x + 18, rem_y + 6], fill=(239, 68, 68))
    # Red aura around button
    draw.ellipse([rem_x - 28, rem_y - 40, rem_x + 28, rem_y + 16], outline=(252, 165, 165), width=3)
    # Brass toggle switch
    draw.line([(rem_x, rem_y + 20), (rem_x, rem_y + 35)], fill=(234, 179, 8), width=5)

    # Top-Left Clickbait Title: "DON'T REWIND."
    text = "DON'T REWIND."
    draw.text((45, 35), text, font=font_bold, fill=(0, 0, 0))
    draw.text((43, 33), text, font=font_bold, fill=(0, 0, 0))
    draw.text((40, 30), text, font=font_bold, fill=(56, 189, 248))

    # Sub-badge below title: "⏪ 10 SECONDS ONLY"
    badge_w, badge_h = 380, 60
    draw.rounded_rectangle([40, 165, 40 + badge_w, 165 + badge_h], radius=12, fill=(239, 68, 68))
    draw.text((60, 172), "⏪ 10 SECONDS ONLY", font=font_sub, fill=(255, 255, 255))

    out_main = OUT_DIR / "thumbnail.jpg"
    img.convert("RGB").save(out_main, "JPEG", quality=95)
    print("Saved main thumbnail:", out_main)
    img.convert("RGB").save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
    img.convert("RGB").save(PUB_TIMER_DIR / "thumbnail.jpg", "JPEG", quality=95)

def create_short_thumbnail():
    width, height = 720, 1280
    bg_path = PUB_DIR / "bg_subway_platform.jpg"
    if bg_path.exists():
        img = Image.open(bg_path).convert("RGBA").resize((width, height))
        img = img.filter(ImageFilter.GaussianBlur(radius=3))
    else:
        img = Image.new("RGBA", (width, height), (15, 23, 42, 255))

    overlay = Image.new("RGBA", (width, height), (6, 12, 26, 130))
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
    draw.text((35, 125), "DON'T REWIND.", font=font_bold, fill=(0, 0, 0))
    draw.text((30, 120), "DON'T REWIND.", font=font_bold, fill=(56, 189, 248))

    # Giant HUD countdown in center
    cx, cy = 360, 480
    for r in range(160, 40, -15):
        alpha = int(40 * (1 - r / 160))
        draw.ellipse([cx - r * 1.5, cy - r, cx + r * 1.5, cy + r], fill=(56, 189, 248, alpha))
    draw.rounded_rectangle([cx - 260, cy - 85, cx + 260, cy + 85], radius=24, fill=(10, 20, 38, 220), outline=(56, 189, 248), width=6)
    digits = "⏪ -10.00s"
    bbox = draw.textbbox((0, 0), digits, font=font_badge)
    tw = bbox[2] - bbox[0]
    draw.text((cx - tw / 2, cy - 50), digits, font=font_badge, fill=(56, 189, 248))
    draw.text((cx - 150, cy + 20), "10-SECOND UNDO BUTTON", font=font_sub, fill=(224, 242, 254))

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


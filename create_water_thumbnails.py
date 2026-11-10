import math, os, pathlib, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "no-water"
OUT_DIR = STUDIO / "out" / "no-water"
PUB_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

FONT_PATH = r"C:\Windows\Fonts\impact.ttf"

def draw_text_with_outline(draw, pos, text, font, fill_color="#FFDE00", outline_color="#000000", outline_width=16):
    x, y = pos
    # Thick black stroke outline
    for dx in range(-outline_width, outline_width + 1):
        for dy in range(-outline_width, outline_width + 1):
            if dx*dx + dy*dy <= outline_width*outline_width:
                draw.text((x + dx, y + dy), text, font=font, fill=outline_color, anchor="mm")
    # Main bright yellow/gold fill
    draw.text((x, y), text, font=font, fill=fill_color, anchor="mm")

def create_landscape_thumbnail():
    w, h = 1920, 1080
    im = Image.new("RGBA", (w, h), "#0A0503")
    draw = ImageDraw.Draw(im)

    # 1. Apocalyptic Scorched Sky (Red/Orange dusk gradient)
    for y in range(h - 350):
        t = y / (h - 350)
        r = int(120 * (1 - t) + 220 * t)
        g = int(20 * (1 - t) + 70 * t)
        b = int(10 * (1 - t) + 20 * t)
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Blistering White Sun blasting down
    sun_x, sun_y = w // 2 + 250, 180
    draw.ellipse([(sun_x - 140, sun_y - 140), (sun_x + 140, sun_y + 140)], fill="#FEF08A")
    draw.ellipse([(sun_x - 100, sun_y - 100), (sun_x + 100, sun_y + 100)], fill="#FFFFFF")

    # 2. Vast Cracked Ocean Abyss & Dry Mud Tectonic Bedrock
    draw.polygon([(0, h - 350), (w, h - 350), (w, h), (0, h)], fill="#3B1D0E")
    draw.polygon([(0, h - 280), (w, h - 280), (w, h), (0, h)], fill="#241006")

    # Deep Tectonic Cracks across the dried seabed
    crack_coords = [
        [(200, h - 350), (320, h - 200), (450, h)],
        [(600, h - 350), (520, h - 180), (680, h)],
        [(1100, h - 350), (1250, h - 220), (1150, h)],
        [(1500, h - 350), (1620, h - 190), (1800, h)],
    ]
    for c in crack_coords:
        draw.line(c, fill="#0F0602", width=12)
        draw.line(c, fill="#EF4444", width=3) # Magma glow inside cracks!

    # 3. Giant Stranded Cruise Ship Tilted & Broken in the Dried Ocean Basin
    ship_x, ship_y = w - 540, h - 320
    # Ship Hull
    draw.polygon([
        (ship_x - 220, ship_y + 40),
        (ship_x + 220, ship_y - 40),
        (ship_x + 180, ship_y + 120),
        (ship_x - 180, ship_y + 140)
    ], fill="#1E293B", outline="#475569", width=6)
    # White superstructure decks
    draw.polygon([
        (ship_x - 160, ship_y + 10),
        (ship_x + 140, ship_y - 50),
        (ship_x + 120, ship_y - 110),
        (ship_x - 140, ship_y - 70)
    ], fill="#F8FAFC", outline="#94A3B8", width=4)
    # Giant Snap Crack in middle of ship
    draw.line([(ship_x, ship_y - 120), (ship_x - 20, ship_y + 140)], fill="#000000", width=10)
    draw.line([(ship_x, ship_y - 120), (ship_x - 20, ship_y + 140)], fill="#EF4444", width=3)

    # 4. Pip (Hero Stickman) on Left: Clutching Throat with Dry Cracked Lips, Empty Glass!
    pip_x, pip_y = 480, h - 420
    # Pip Shadow
    draw.ellipse([(pip_x - 120, pip_y + 330), (pip_x + 120, pip_y + 370)], fill=(0, 0, 0, 160))

    # Pip Legs
    draw.line([(pip_x, pip_y + 120), (pip_x - 45, pip_y + 240)], fill="#020617", width=20)
    draw.line([(pip_x - 45, pip_y + 240), (pip_x - 55, pip_y + 340)], fill="#020617", width=20)
    draw.line([(pip_x, pip_y + 120), (pip_x + 55, pip_y + 230)], fill="#020617", width=20)
    draw.line([(pip_x + 55, pip_y + 230), (pip_x + 70, pip_y + 340)], fill="#020617", width=20)

    # Pip Torso
    draw.line([(pip_x, pip_y + 120), (pip_x, pip_y - 20)], fill="#020617", width=22)

    # Pip Arms: One hand clutching throat, other holding EMPTY water glass tilted upside down!
    draw.line([(pip_x, pip_y + 20), (pip_x - 70, pip_y - 40)], fill="#020617", width=18)
    draw.line([(pip_x - 70, pip_y - 40), (pip_x - 15, pip_y - 30)], fill="#020617", width=18) # Clutching throat
    draw.line([(pip_x, pip_y + 20), (pip_x + 110, pip_y + 40)], fill="#020617", width=18)
    draw.line([(pip_x + 110, pip_y + 40), (pip_x + 160, pip_y + 20)], fill="#020617", width=18)

    # The Empty Upside Down Water Glass with single evaporating drop
    gx, gy = pip_x + 180, pip_y + 10
    draw.polygon([(gx - 25, gy - 35), (gx + 25, gy - 35), (gx + 18, gy + 35), (gx - 18, gy + 35)], fill="#BAE6FD", outline="#38BDF8", width=4)
    # Red X through glass
    draw.line([(gx - 20, gy - 20), (gx + 20, gy + 20)], fill="#EF4444", width=6)
    draw.line([(gx - 20, gy + 20), (gx + 20, gy - 20)], fill="#EF4444", width=6)

    # Pip Head (White circle with dark outline)
    draw.ellipse([(pip_x - 75, pip_y - 170), (pip_x + 75, pip_y - 20)], fill="#FFFFFF", outline="#020617", width=14)

    # Terrified / Dehydrated Facial Expression
    draw.ellipse([(pip_x - 45, pip_y - 130), (pip_x - 8, pip_y - 75)], fill="#FFFFFF", outline="#020617", width=4)
    draw.ellipse([(pip_x + 8, pip_y - 130), (pip_x + 45, pip_y - 75)], fill="#FFFFFF", outline="#020617", width=4)
    draw.circle([(pip_x - 22), pip_y - 105], 6, fill="#020617")
    draw.circle([(pip_x + 22), pip_y - 105], 6, fill="#020617")
    # Agonized open screaming mouth with dry tongue
    draw.ellipse([(pip_x - 25, pip_y - 60), (pip_x + 25, pip_y - 25)], fill="#7F1D1D", outline="#020617", width=4)
    draw.ellipse([(pip_x - 12, pip_y - 45), (pip_x + 12, pip_y - 30)], fill="#F87171") # Tongue sticking out

    # 5. Red Danger Callout Badge
    draw.rounded_rectangle([(80, 50), (480, 130)], radius=18, fill="#EF4444", outline="#000000", width=4)
    font_badge = ImageFont.truetype(FONT_PATH, 44)
    draw.text((280, 90), "100% WATER VANISHED!", font=font_badge, fill="#FFFFFF", anchor="mm")

    # 6. MAIN TITLE TYPOGRAPHY (Think Beyond style: Huge bold yellow Impact with 18px black outline)
    font_title = ImageFont.truetype(FONT_PATH, 170)
    font_sub = ImageFont.truetype(FONT_PATH, 95)

    draw_text_with_outline(draw, (w // 2 + 100, 170), "NO WATER!", font_title, fill_color="#FFE600", outline_width=18)
    draw_text_with_outline(draw, (w // 2 + 100, 280), "EARTH DRIED UP", font_sub, fill_color="#FFFFFF", outline_width=12)

    # Save Thumbnail
    im_rgb = im.convert("RGB")
    art_path = PUB_DIR / "thumbnail_art.png"
    png_path = PUB_DIR / "thumbnail.png"
    jpg_path = PUB_DIR / "thumbnail.jpg"
    out_png = OUT_DIR / "thumbnail.png"
    out_jpg = OUT_DIR / "thumbnail.jpg"

    im.save(art_path, "PNG")
    im.save(png_path, "PNG")
    im_rgb.save(jpg_path, "JPEG", quality=92)
    im.save(out_png, "PNG")
    im_rgb.save(out_jpg, "JPEG", quality=92)
    print(f"Landscape Thumbnail Created: {png_path} ({jpg_path.stat().st_size / 1e3:.1f} KB)")

def create_vertical_thumbnail():
    w, h = 1080, 1920
    im = Image.new("RGBA", (w, h), "#0A0503")
    draw = ImageDraw.Draw(im)

    # Scorched sky
    for y in range(h - 600):
        t = y / (h - 600)
        draw.line([(0, y), (w, y)], fill=(int(140*(1-t)+230*t), int(30*(1-t)+80*t), int(15*(1-t)+25*t), 255))

    # Sun
    draw.ellipse([(w//2 - 120, 320), (w//2 + 120, 560)], fill="#FEF08A")
    draw.ellipse([(w//2 - 80, 360), (w//2 + 80, 520)], fill="#FFFFFF")

    # Dry cracked ground
    draw.polygon([(0, h - 600), (w, h - 600), (w, h), (0, h)], fill="#3B1D0E")
    draw.polygon([(0, h - 450), (w, h - 450), (w, h), (0, h)], fill="#241006")
    draw.line([(250, h - 600), (450, h)], fill="#EF4444", width=8)
    draw.line([(750, h - 600), (600, h)], fill="#EF4444", width=8)

    # Top Warning Pill
    draw.rounded_rectangle([(140, 120), (w - 140, 220)], radius=24, fill="#EF4444", outline="#000000", width=6)
    font_pill = ImageFont.truetype(FONT_PATH, 50)
    draw.text((w // 2, 170), "WHAT IF WATER DISAPPEARED?", font=font_pill, fill="#FFFFFF", anchor="mm")

    # Main Headline
    font_main = ImageFont.truetype(FONT_PATH, 160)
    font_sub = ImageFont.truetype(FONT_PATH, 85)
    draw_text_with_outline(draw, (w // 2, 340), "NO", font_main, fill_color="#FFE600", outline_width=18)
    draw_text_with_outline(draw, (w // 2, 480), "WATER!", font_main, fill_color="#FFE600", outline_width=18)
    draw_text_with_outline(draw, (w // 2, 600), "OCEANS DRY TO BONE!", font_sub, fill_color="#FFFFFF", outline_width=12)

    # Pip looking terrified clutching throat
    pip_x, pip_y = w // 2 - 120, h - 850
    draw.line([(pip_x, pip_y + 120), (pip_x - 50, pip_y + 360)], fill="#020617", width=22)
    draw.line([(pip_x, pip_y + 120), (pip_x + 60, pip_y + 360)], fill="#020617", width=22)
    draw.line([(pip_x, pip_y + 120), (pip_x, pip_y - 20)], fill="#020617", width=24)
    draw.line([(pip_x, pip_y + 20), (pip_x - 110, pip_y - 40)], fill="#020617", width=20)
    draw.line([(pip_x, pip_y + 20), (pip_x + 140, pip_y + 20)], fill="#020617", width=20)

    # Head
    draw.ellipse([(pip_x - 85, pip_y - 190), (pip_x + 85, pip_y - 20)], fill="#FFFFFF", outline="#020617", width=16)
    draw.ellipse([(pip_x - 50, pip_y - 145), (pip_x - 10, pip_y - 85)], fill="#FFFFFF", outline="#020617", width=5)
    draw.ellipse([(pip_x + 10, pip_y - 145), (pip_x + 50, pip_y - 85)], fill="#FFFFFF", outline="#020617", width=5)
    draw.circle([(pip_x - 24), pip_y - 115], 6, fill="#020617")
    draw.circle([(pip_x + 24), pip_y - 115], 6, fill="#020617")
    draw.ellipse([(pip_x - 30, pip_y - 70), (pip_x + 30, pip_y - 30)], fill="#7F1D1D", outline="#020617", width=5)

    # Stranded ship behind
    ship_x, ship_y = w // 2 + 220, h - 720
    draw.polygon([(ship_x - 120, ship_y), (ship_x + 120, ship_y - 40), (ship_x + 90, ship_y + 100), (ship_x - 90, ship_y + 110)], fill="#1E293B", outline="#94A3B8", width=5)

    # Bottom Callout Box
    draw.rounded_rectangle([(100, h - 300), (w - 100, h - 140)], radius=24, fill="#1E293B", outline="#FBBF24", width=5)
    font_bot = ImageFont.truetype(FONT_PATH, 56)
    draw_text_with_outline(draw, (w // 2, h - 220), "3 DAYS TO SURVIVE!", font_bot, fill_color="#FBBF24", outline_width=8)

    # Save Vertical Thumbnail
    im_rgb = im.convert("RGB")
    art_path = PUB_DIR / "thumbnail_short_art.png"
    png_path = PUB_DIR / "thumbnail_short.png"
    jpg_path = PUB_DIR / "thumbnail_short.jpg"
    out_png = OUT_DIR / "thumbnail_short.png"
    out_jpg = OUT_DIR / "thumbnail_short.jpg"

    im.save(art_path, "PNG")
    im.save(png_path, "PNG")
    im_rgb.save(jpg_path, "JPEG", quality=92)
    im.save(out_png, "PNG")
    im_rgb.save(out_jpg, "JPEG", quality=92)
    print(f"Vertical Thumbnail Created: {png_path} ({jpg_path.stat().st_size / 1e3:.1f} KB)")

if __name__ == "__main__":
    create_landscape_thumbnail()
    create_vertical_thumbnail()


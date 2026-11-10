import math, os, pathlib, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "living-shadow"
OUT_DIR = STUDIO / "out" / "living-shadow"
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
    im = Image.new("RGBA", (w, h), "#0B0F19")
    draw = ImageDraw.Draw(im)

    # 1. Moody bedroom wall & floor
    wall_color = "#13182C"
    floor_color = "#0B0E18"
    draw.rectangle([(0, 0), (w, h - 280)], fill=wall_color)
    draw.rectangle([(0, h - 280), (w, h)], fill=floor_color)
    # Floor baseboard / trim
    draw.line([(0, h - 280), (w, h - 280)], fill="#334155", width=8)

    # Wall wallpaper subtle stripes
    for x in range(0, w, 60):
        draw.line([(x, 0), (x, h - 280)], fill="#1E243D", width=2)

    # 2. Dramatic overhead single cone light beam shining from top-left
    lamp_x, lamp_y = 350, 60
    light_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_light = ImageDraw.Draw(light_mask)
    # Volumetric golden light beam
    d_light.polygon([
        (lamp_x - 30, lamp_y),
        (lamp_x + 30, lamp_y),
        (w - 200, h - 100),
        (200, h - 100)
    ], fill=(255, 230, 150, 50))
    im = Image.alpha_composite(im, light_mask)
    draw = ImageDraw.Draw(im)

    # Draw the hanging lamp
    draw.line([(lamp_x, 0), (lamp_x, lamp_y)], fill="#64748B", width=6)
    draw.polygon([(lamp_x - 50, lamp_y + 30), (lamp_x + 50, lamp_y + 30), (lamp_x + 20, lamp_y), (lamp_x - 20, lamp_y)], fill="#F59E0B")
    draw.ellipse([(lamp_x - 35, lamp_y + 20), (lamp_x + 35, lamp_y + 40)], fill="#FEF08A")

    # 3. Pip (Stickman Hero) on the left, looking back at his detached shadow in absolute horror
    pip_x, pip_y = 650, h - 420
    # Pip's empty shadow connection at his feet - completely missing!
    # Dashed red circle showing missing shadow anchor
    for angle in range(0, 360, 30):
        rad = math.radians(angle)
        rad_end = math.radians(angle + 18)
        x1 = pip_x + 90 * math.cos(rad)
        y1 = (pip_y + 340) + 25 * math.sin(rad)
        x2 = pip_x + 90 * math.cos(rad_end)
        y2 = (pip_y + 340) + 25 * math.sin(rad_end)
        draw.line([(x1, y1), (x2, y2)], fill="#EF4444", width=5)

    # Pip Legs (trembling in shock)
    draw.line([(pip_x, pip_y + 120), (pip_x - 45, pip_y + 240)], fill="#020617", width=18)
    draw.line([(pip_x - 45, pip_y + 240), (pip_x - 50, pip_y + 335)], fill="#020617", width=18)
    draw.line([(pip_x, pip_y + 120), (pip_x + 55, pip_y + 230)], fill="#020617", width=18)
    draw.line([(pip_x + 55, pip_y + 230), (pip_x + 70, pip_y + 335)], fill="#020617", width=18)

    # Pip Torso
    draw.line([(pip_x, pip_y + 120), (pip_x, pip_y - 20)], fill="#020617", width=20)

    # Pip Arms pointing back in shock and clutching head
    draw.line([(pip_x, pip_y + 20), (pip_x - 110, pip_y - 60)], fill="#020617", width=16) # Left hand to head
    draw.line([(pip_x, pip_y + 20), (pip_x + 140, pip_y + 40)], fill="#020617", width=18) # Right hand pointing in horror
    draw.line([(pip_x + 140, pip_y + 40), (pip_x + 240, pip_y + 10)], fill="#020617", width=18)

    # Pip Head (White circle with dark outline)
    draw.ellipse([(pip_x - 70, pip_y - 160), (pip_x + 70, pip_y - 20)], fill="#FFFFFF", outline="#020617", width=14)

    # Pip Terrified Facial Expression
    # Wide cartoon eyes
    draw.ellipse([(pip_x - 42, pip_y - 125), (pip_x - 6, pip_y - 75)], fill="#FFFFFF", outline="#020617", width=4)
    draw.ellipse([(pip_x + 6, pip_y - 125), (pip_x + 42, pip_y - 75)], fill="#FFFFFF", outline="#020617", width=4)
    # Tiny dilated pupils looking right towards shadow
    draw.ellipse([(pip_x - 18, pip_y - 105), (pip_x - 8, pip_y - 95)], fill="#020617")
    draw.ellipse([(pip_x + 30, pip_y - 105), (pip_x + 40, pip_y - 95)], fill="#020617")
    # Screaming mouth
    draw.ellipse([(pip_x - 26, pip_y - 62), (pip_x + 26, pip_y - 32)], fill="#EF4444", outline="#020617", width=4)
    # Sweat drops
    draw.polygon([(pip_x - 90, pip_y - 130), (pip_x - 75, pip_y - 105), (pip_x - 85, pip_y - 100)], fill="#38BDF8")

    # 4. THE LIVING DETACHED SHADOW on the right wall/floor
    sh_x, sh_y = 1350, h - 450
    # Shadow pool on wall & floor (eerie purple glow outline)
    draw.ellipse([(sh_x - 220, sh_y + 320), (sh_x + 220, sh_y + 380)], fill=(0, 0, 0, 200))
    # Sinister purple aura around the shadow
    aura = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_aura = ImageDraw.Draw(aura)
    d_aura.ellipse([(sh_x - 180, sh_y - 200), (sh_x + 180, sh_y + 320)], fill=(139, 92, 246, 60))
    aura = aura.filter(ImageFilter.GaussianBlur(30))
    im = Image.alpha_composite(im, aura)
    draw = ImageDraw.Draw(im)

    # Living Shadow Stick Figure (Jet black, menacing stance)
    # Shadow Legs (confident wide swagger stance)
    draw.line([(sh_x, sh_y + 110), (sh_x - 80, sh_y + 340)], fill="#000000", width=24)
    draw.line([(sh_x, sh_y + 110), (sh_x + 80, sh_y + 340)], fill="#000000", width=24)
    # Shadow Torso
    draw.line([(sh_x, sh_y + 110), (sh_x, sh_y - 40)], fill="#000000", width=26)
    # Shadow Arms (one arm on hip swaggering, other holding the TV remote teasingly!)
    draw.line([(sh_x, sh_y), (sh_x + 90, sh_y + 50)], fill="#000000", width=20)
    draw.line([(sh_x + 90, sh_y + 50), (sh_x + 50, sh_y + 110)], fill="#000000", width=20)
    # Left arm holding remote up
    draw.line([(sh_x, sh_y), (sh_x - 90, sh_y - 20)], fill="#000000", width=20)
    draw.line([(sh_x - 90, sh_y - 20), (sh_x - 120, sh_y - 80)], fill="#000000", width=20)
    # The stolen TV Remote in shadow's hand
    draw.rectangle([(sh_x - 160, sh_y - 120), (sh_x - 90, sh_y - 75)], fill="#334155", outline="#EF4444", width=3)
    # Red laser beam firing from remote
    draw.line([(sh_x - 160, sh_y - 97), (pip_x + 100, pip_y - 50)], fill="#EF4444", width=4)

    # Shadow Head (Solid pitch black)
    draw.ellipse([(sh_x - 85, sh_y - 210), (sh_x + 85, sh_y - 40)], fill="#000000")

    # Sinister Glowing Eyes on the Shadow! (Bright neon cyan / yellow)
    draw.ellipse([(sh_x - 55, sh_y - 150), (sh_x - 15, sh_y - 110)], fill="#38BDF8")
    draw.ellipse([(sh_x + 15, sh_y - 150), (sh_x + 55, sh_y - 110)], fill="#38BDF8")
    # Evil slit pupils
    draw.line([(sh_x - 35, sh_y - 145), (sh_x - 35, sh_y - 115)], fill="#000000", width=5)
    draw.line([(sh_x + 35, sh_y - 145), (sh_x + 35, sh_y - 115)], fill="#000000", width=5)
    # Menacing glowing grin
    draw.arc([(sh_x - 45, sh_y - 110), (sh_x + 45, sh_y - 60)], start=20, end=160, fill="#38BDF8", width=6)

    # 5. Red Danger Callout: "NOT CONNECTED!" arrow pointing to Pip's feet
    font_callout = ImageFont.truetype(FONT_PATH, 36)
    draw_text_with_outline(draw, (pip_x, h - 80), "WHERE IS MY SHADOW?!", font_callout, fill_color="#EF4444", outline_width=6)

    # 6. Top Badge: "PHYSICS BREAKDOWN"
    draw.rounded_rectangle([(80, 50), (460, 130)], radius=16, fill="#EF4444", outline="#000000", width=4)
    font_badge = ImageFont.truetype(FONT_PATH, 42)
    draw.text((270, 90), "IT MOVES ON ITS OWN!", font=font_badge, fill="#FFFFFF", anchor="mm")

    # 7. MAIN TITLE TYPOGRAPHY (Think Beyond style: Huge bold yellow Impact with 18px black outline)
    font_title = ImageFont.truetype(FONT_PATH, 160)
    font_sub = ImageFont.truetype(FONT_PATH, 90)

    # Position in center-top
    draw_text_with_outline(draw, (w // 2 + 100, 180), "LIVING SHADOW!", font_title, fill_color="#FFE600", outline_width=18)
    draw_text_with_outline(draw, (w // 2 + 100, 290), "SHADOW ESCAPED", font_sub, fill_color="#FFFFFF", outline_width=12)

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
    im = Image.new("RGBA", (w, h), "#0B0F19")
    draw = ImageDraw.Draw(im)

    # Wall and Floor
    draw.rectangle([(0, 0), (w, h - 500)], fill="#13182C")
    draw.rectangle([(0, h - 500), (w, h)], fill="#0B0E18")
    draw.line([(0, h - 500), (w, h - 500)], fill="#334155", width=10)

    # Light cone from ceiling
    light_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_light = ImageDraw.Draw(light_mask)
    d_light.polygon([(w//2 - 60, 0), (w//2 + 60, 0), (w - 80, h - 300), (80, h - 300)], fill=(255, 230, 150, 45))
    im = Image.alpha_composite(im, light_mask)
    draw = ImageDraw.Draw(im)

    # Top Warning Pill
    draw.rounded_rectangle([(140, 140), (w - 140, 240)], radius=24, fill="#EF4444", outline="#000000", width=6)
    font_pill = ImageFont.truetype(FONT_PATH, 52)
    draw.text((w // 2, 190), "WHAT IF IT MOVED?!", font=font_pill, fill="#FFFFFF", anchor="mm")

    # Main Headline
    font_main = ImageFont.truetype(FONT_PATH, 140)
    font_sub = ImageFont.truetype(FONT_PATH, 80)
    draw_text_with_outline(draw, (w // 2, 340), "LIVING", font_main, fill_color="#FFE600", outline_width=18)
    draw_text_with_outline(draw, (w // 2, 470), "SHADOW", font_main, fill_color="#FFE600", outline_width=18)
    draw_text_with_outline(draw, (w // 2, 580), "ESCAPED FROM BODY!", font_sub, fill_color="#FFFFFF", outline_width=12)

    # Center: Pip looking terrified (screaming)
    pip_x, pip_y = 360, h - 750
    draw.line([(pip_x, pip_y + 120), (pip_x - 50, pip_y + 350)], fill="#020617", width=22)
    draw.line([(pip_x, pip_y + 120), (pip_x + 60, pip_y + 350)], fill="#020617", width=22)
    draw.line([(pip_x, pip_y + 120), (pip_x, pip_y - 20)], fill="#020617", width=24)
    draw.line([(pip_x, pip_y + 20), (pip_x - 120, pip_y - 40)], fill="#020617", width=20)
    draw.line([(pip_x, pip_y + 20), (pip_x + 160, pip_y + 60)], fill="#020617", width=20)

    # Pip Head
    draw.ellipse([(pip_x - 80, pip_y - 180), (pip_x + 80, pip_y - 20)], fill="#FFFFFF", outline="#020617", width=16)
    draw.ellipse([(pip_x - 48, pip_y - 140), (pip_x - 8, pip_y - 80)], fill="#FFFFFF", outline="#020617", width=5)
    draw.ellipse([(pip_x + 8, pip_y - 140), (pip_x + 48, pip_y - 80)], fill="#FFFFFF", outline="#020617", width=5)
    draw.ellipse([(pip_x - 22, pip_y - 115), (pip_x - 12, pip_y - 105)], fill="#020617")
    draw.ellipse([(pip_x + 34, pip_y - 115), (pip_x + 44, pip_y - 105)], fill="#020617")
    draw.ellipse([(pip_x - 30, pip_y - 65), (pip_x + 30, pip_y - 30)], fill="#EF4444", outline="#020617", width=5)

    # Living Shadow Standing Right next to Pip
    sh_x, sh_y = 760, h - 780
    draw.line([(sh_x, sh_y + 120), (sh_x - 60, sh_y + 370)], fill="#000000", width=26)
    draw.line([(sh_x, sh_y + 120), (sh_x + 60, sh_y + 370)], fill="#000000", width=26)
    draw.line([(sh_x, sh_y + 120), (sh_x, sh_y - 20)], fill="#000000", width=28)
    draw.line([(sh_x, sh_y + 20), (sh_x - 110, sh_y + 40)], fill="#000000", width=22)
    draw.line([(sh_x, sh_y + 20), (sh_x + 110, sh_y - 50)], fill="#000000", width=22)

    # Shadow Head with Neon Cyan Glowing Eyes
    draw.ellipse([(sh_x - 90, sh_y - 200), (sh_x + 90, sh_y - 20)], fill="#000000")
    draw.ellipse([(sh_x - 60, sh_y - 140), (sh_x - 15, sh_y - 95)], fill="#38BDF8")
    draw.ellipse([(sh_x + 15, sh_y - 140), (sh_x + 60, sh_y - 95)], fill="#38BDF8")
    draw.arc([(sh_x - 50, sh_y - 95), (sh_x + 50, sh_y - 45)], start=10, end=170, fill="#38BDF8", width=8)

    # Bottom Callout Box
    draw.rounded_rectangle([(100, h - 300), (w - 100, h - 140)], radius=24, fill="#1E293B", outline="#FBBF24", width=5)
    font_bot = ImageFont.truetype(FONT_PATH, 54)
    draw_text_with_outline(draw, (w // 2, h - 220), "CAN YOU ESCAPE IT?!", font_bot, fill_color="#FBBF24", outline_width=8)

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

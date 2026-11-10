import math, os, pathlib, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

sys.stdout.reconfigure(encoding='utf-8')

STUDIO = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
PUB_DIR = STUDIO / "public" / "quiet-room"
OUT_DIR = STUDIO / "out" / "quiet-room"
PUB_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

FONT_PATH = r"C:\Windows\Fonts\impact.ttf"

def draw_text_with_outline(draw, pos, text, font, fill_color="#FFDE00", outline_color="#000000", outline_width=14):
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
    im = Image.new("RGBA", (w, h), "#0A0D14")
    draw = ImageDraw.Draw(im)

    # 1. Dark acoustic chamber walls with 3D spiked foam wedges
    # Draw ceiling & side wall perspective lines
    draw.polygon([(0, 0), (w, 0), (w - 280, 180), (280, 180)], fill="#111827")
    draw.polygon([(0, 0), (280, 180), (280, h - 220), (0, h)], fill="#0F172A")
    draw.polygon([(w, 0), (w, h), (w - 280, h - 220), (w - 280, 180)], fill="#0F172A")
    draw.polygon([(280, 180), (w - 280, 180), (w - 280, h - 220), (280, h - 220)], fill="#090D16")

    # 2. Spiked acoustic fiberglass wedges (angled 3D triangles)
    # Left wall wedges
    for y in range(200, h - 240, 70):
        draw.polygon([(280, y), (200, y + 35), (280, y + 70)], fill="#1E293B", outline="#334155", width=2)
        draw.polygon([(200, y + 35), (140, y + 35), (280, y + 70)], fill="#0F172A")

    # Right wall wedges
    for y in range(200, h - 240, 70):
        draw.polygon([(w - 280, y), (w - 200, y + 35), (w - 280, y + 70)], fill="#1E293B", outline="#334155", width=2)
        draw.polygon([(w - 200, y + 35), (w - 140, y + 35), (w - 280, y + 70)], fill="#0F172A")

    # Back wall wedge rows
    for row in range(5):
        y = 220 + row * 110
        for col in range(12):
            x = 340 + col * 105
            draw.polygon([(x, y), (x + 50, y - 40), (x + 100, y)], fill="#1E293B", outline="#334155", width=2)

    # 3. Floating wire mesh floor
    draw.polygon([(0, h), (w, h), (w - 280, h - 220), (280, h - 220)], fill="#0B1120")
    # Wire grid lines
    for i in range(15):
        lx = 280 + i * 90
        draw.line([(lx, h - 220), (int(i * (w / 14)), h)], fill="#38BDF8", width=2)
    for j in range(6):
        gy = h - 220 + j * 36
        gw = int(280 * (1 - j / 6))
        draw.line([(gw, gy), (w - gw, gy)], fill="#1E3A8A", width=2)

    # 4. Vault Door on the left side
    draw.rectangle([(60, 240), (260, h - 220)], fill="#334155", outline="#94A3B8", width=6)
    # Heavy vault wheel
    draw.ellipse([(120, h//2 - 60), (200, h//2 + 20)], fill="#1E293B", outline="#FBBF24", width=5)
    draw.line([(160, h//2 - 70), (160, h//2 + 30)], fill="#FBBF24", width=5)
    draw.line([(110, h//2 - 20), (210, h//2 - 20)], fill="#FBBF24", width=5)
    # Vault window with Pip looking in in shock
    draw.rectangle([(110, 280), (210, 400)], fill="#0284C7", outline="#E2E8F0", width=4)
    # Pip face in window
    draw.ellipse([(135, 305), (185, 355)], fill="#FFFFFF", outline="#0F172A", width=3)
    # Pip eyes wide shock
    draw.ellipse([(145, 320), (155, 335)], fill="#0F172A")
    draw.ellipse([(165, 320), (175, 335)], fill="#0F172A")
    draw.ellipse([(152, 342), (168, 350)], fill="#EF4444")

    # 5. Glowing -20.6 dB HUD badge
    draw.rounded_rectangle([(w - 440, 220), (w - 120, 340)], radius=18, fill="#0F172A", outline="#EF4444", width=4)
    font_db_val = ImageFont.truetype(FONT_PATH, 54)
    font_db_lbl = ImageFont.truetype(FONT_PATH, 24)
    draw_text_with_outline(draw, (w - 280, 260), "-20.6 dB", font_db_val, fill_color="#EF4444", outline_width=6)
    draw.text((w - 280, 310), "WORLD RECORD SILENCE", font=font_db_lbl, fill="#94A3B8", anchor="mm")

    # 6. Dramatic overhead single cone light beam shining down on Mo
    light_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_light = ImageDraw.Draw(light_mask)
    d_light.polygon([(w//2 - 120, 0), (w//2 + 120, 0), (w//2 + 480, h - 140), (w//2 - 480, h - 140)], fill=(255, 230, 160, 45))
    im = Image.alpha_composite(im, light_mask)
    draw = ImageDraw.Draw(im)

    # 7. Mo (Stickman Hero) in center, clutching ears, in agony/shock
    cx, cy = w // 2, h - 380
    # Shadow
    draw.ellipse([(cx - 180, cy + 240), (cx + 180, cy + 280)], fill=(0, 0, 0, 140))

    # Body
    draw.line([(cx, cy + 80), (cx, cy - 20)], fill="#0F172A", width=16)
    draw.rectangle([(cx - 38, cy - 10), (cx + 38, cy + 90)], fill="#15803D", outline="#0F172A", width=8)

    # Legs seated cross-legged on mesh
    draw.line([(cx - 20, cy + 85), (cx - 120, cy + 180)], fill="#0F172A", width=14)
    draw.line([(cx - 120, cy + 180), (cx - 20, cy + 230)], fill="#0F172A", width=14)
    draw.line([(cx + 20, cy + 85), (cx + 120, cy + 180)], fill="#0F172A", width=14)
    draw.line([(cx + 120, cy + 180), (cx + 20, cy + 230)], fill="#0F172A", width=14)
    # Red shoes
    draw.ellipse([(cx - 40, cy + 215), (cx + 5, cy + 245)], fill="#DC2626", outline="#0F172A", width=4)
    draw.ellipse([(cx - 5, cy + 215), (cx + 40, cy + 245)], fill="#DC2626", outline="#0F172A", width=4)

    # Arms clutching head/ears
    draw.line([(cx - 35, cy + 10), (cx - 110, cy - 60)], fill="#0F172A", width=14)
    draw.line([(cx - 110, cy - 60), (cx - 75, cy - 110)], fill="#0F172A", width=14)
    draw.line([(cx + 35, cy + 10), (cx + 110, cy - 60)], fill="#0F172A", width=14)
    draw.line([(cx + 110, cy - 60), (cx + 75, cy - 110)], fill="#0F172A", width=14)
    # Hands over ears
    draw.ellipse([(cx - 95, cy - 130), (cx - 60, cy - 90)], fill="#FED7AA", outline="#0F172A", width=4)
    draw.ellipse([(cx + 60, cy - 130), (cx + 95, cy - 90)], fill="#FED7AA", outline="#0F172A", width=4)

    # Head
    draw.ellipse([(cx - 85, cy - 200), (cx + 85, cy - 30)], fill="#FED7AA", outline="#0F172A", width=8)
    # Hair
    draw.ellipse([(cx - 95, cy - 220), (cx + 95, cy - 130)], fill="#3B1C0B", outline="#0F172A", width=6)
    # Shocked Eyes (Spiral dizzy/panic)
    draw.ellipse([(cx - 50, cy - 145), (cx - 15, cy - 90)], fill="#FFFFFF", outline="#0F172A", width=5)
    draw.ellipse([(cx + 15, cy - 145), (cx + 50, cy - 90)], fill="#FFFFFF", outline="#0F172A", width=5)
    # Pupils tiny panic dots
    draw.ellipse([(cx - 35, cy - 120), (cx - 28, cy - 113)], fill="#0F172A")
    draw.ellipse([(cx + 28, cy - 120), (cx + 35, cy - 113)], fill="#0F172A")
    # Screaming open mouth
    draw.ellipse([(cx - 24, cy - 75), (cx + 24, cy - 40)], fill="#7F1D1D", outline="#0F172A", width=4)
    draw.rectangle([(cx - 16, cy - 72), (cx + 16, cy - 64)], fill="#FFFFFF")

    # Flying blue sweat drops
    sweat_pts = [(-110, -170), (115, -165), (-130, -110), (125, -95), (-80, -230), (85, -220)]
    for sx, sy in sweat_pts:
        draw.ellipse([(cx + sx - 10, cy + sy - 14), (cx + sx + 10, cy + sy + 14)], fill="#38BDF8", outline="#0284C7", width=3)

    # High frequency sound waves / ear ringing lightning around head
    ring_color = "#FACC15"
    for r in [120, 150, 180]:
        draw.arc([(cx - 80 - r, cy - 120 - r//2), (cx - 80, cy - 120 + r//2)], 110, 250, fill=ring_color, width=6)
        draw.arc([(cx + 80, cy - 120 - r//2), (cx + 80 + r, cy - 120 + r//2)], 290, 70, fill=ring_color, width=6)

    # 8. MASTER TITLE: 2 TO 3 WORDS ONLY ("DEADLY SILENCE")
    font_title = ImageFont.truetype(FONT_PATH, 160)
    draw_text_with_outline(draw, (w // 2, 120), "DEADLY SILENCE", font_title, fill_color="#FFDE00", outline_width=18)

    # Save
    out_png = PUB_DIR / "thumbnail.png"
    out_jpg = PUB_DIR / "thumbnail.jpg"
    out_art = PUB_DIR / "thumbnail_art.png"
    im_rgb = im.convert("RGB")
    im.save(out_png, "PNG")
    im.save(out_art, "PNG")
    im_rgb.save(out_jpg, "JPEG", quality=95)
    
    # Also save in out_dir
    im.save(OUT_DIR / "thumbnail.png", "PNG")
    im.save(OUT_DIR / "thumbnail_art.png", "PNG")
    im_rgb.save(OUT_DIR / "thumbnail.jpg", "JPEG", quality=95)
    print(f"Created landscape thumbnail: {out_png}")

def create_vertical_short_thumbnail():
    w, h = 1080, 1920
    im = Image.new("RGBA", (w, h), "#0A0D14")
    draw = ImageDraw.Draw(im)

    # Background acoustic spiked wedges
    for row in range(12):
        y = 350 + row * 115
        for col in range(10):
            x = 80 + col * 105
            draw.polygon([(x, y), (x + 50, y - 40), (x + 100, y)], fill="#1E293B", outline="#334155", width=2)

    # Floating wire mesh floor
    draw.rectangle([(0, h - 500), (w, h)], fill="#0B1120")
    for i in range(12):
        draw.line([(i * 100, h - 500), (i * 100, h)], fill="#38BDF8", width=2)
    for j in range(8):
        draw.line([(0, h - 500 + j * 65), (w, h - 500 + j * 65)], fill="#1E3A8A", width=2)

    # Overhead light beam
    light_mask = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d_light = ImageDraw.Draw(light_mask)
    d_light.polygon([(w//2 - 100, 0), (w//2 + 100, 0), (w//2 + 420, h - 350), (w//2 - 420, h - 350)], fill=(255, 230, 160, 45))
    im = Image.alpha_composite(im, light_mask)
    draw = ImageDraw.Draw(im)

    # Mo clutching head in center
    cx, cy = w // 2, h - 680
    # Shadow
    draw.ellipse([(cx - 160, cy + 220), (cx + 160, cy + 260)], fill=(0, 0, 0, 140))

    # Body
    draw.line([(cx, cy + 60), (cx, cy - 20)], fill="#0F172A", width=18)
    draw.rectangle([(cx - 42, cy - 10), (cx + 42, cy + 85)], fill="#15803D", outline="#0F172A", width=8)

    # Legs seated
    draw.line([(cx - 20, cy + 80), (cx - 130, cy + 170)], fill="#0F172A", width=16)
    draw.line([(cx - 130, cy + 170), (cx - 20, cy + 220)], fill="#0F172A", width=16)
    draw.line([(cx + 20, cy + 80), (cx + 130, cy + 170)], fill="#0F172A", width=16)
    draw.line([(cx + 130, cy + 170), (cx + 20, cy + 220)], fill="#0F172A", width=16)
    draw.ellipse([(cx - 45, cy + 205), (cx + 5, cy + 235)], fill="#DC2626", outline="#0F172A", width=4)
    draw.ellipse([(cx - 5, cy + 205), (cx + 45, cy + 235)], fill="#DC2626", outline="#0F172A", width=4)

    # Arms clutching head
    draw.line([(cx - 40, cy + 10), (cx - 120, cy - 60)], fill="#0F172A", width=16)
    draw.line([(cx - 120, cy - 60), (cx - 85, cy - 115)], fill="#0F172A", width=16)
    draw.line([(cx + 40, cy + 10), (cx + 120, cy - 60)], fill="#0F172A", width=16)
    draw.line([(cx + 120, cy - 60), (cx + 85, cy - 115)], fill="#0F172A", width=16)
    draw.ellipse([(cx - 105, cy - 135), (cx - 65, cy - 95)], fill="#FED7AA", outline="#0F172A", width=4)
    draw.ellipse([(cx + 65, cy - 135), (cx + 105, cy - 95)], fill="#FED7AA", outline="#0F172A", width=4)

    # Head
    draw.ellipse([(cx - 95, cy - 215), (cx + 95, cy - 25)], fill="#FED7AA", outline="#0F172A", width=8)
    draw.ellipse([(cx - 105, cy - 235), (cx + 105, cy - 135)], fill="#3B1C0B", outline="#0F172A", width=6)
    # Shocked Eyes
    draw.ellipse([(cx - 55, cy - 150), (cx - 15, cy - 95)], fill="#FFFFFF", outline="#0F172A", width=5)
    draw.ellipse([(cx + 15, cy - 150), (cx + 55, cy - 95)], fill="#FFFFFF", outline="#0F172A", width=5)
    draw.ellipse([(cx - 38, cy - 125), (cx - 30, cy - 117)], fill="#0F172A")
    draw.ellipse([(cx + 30, cy - 125), (cx + 38, cy - 117)], fill="#0F172A")
    # Screaming open mouth
    draw.ellipse([(cx - 28, cy - 78), (cx + 28, cy - 40)], fill="#7F1D1D", outline="#0F172A", width=4)
    draw.rectangle([(cx - 18, cy - 75), (cx + 18, cy - 66)], fill="#FFFFFF")

    # Flying blue sweat drops
    for sx, sy in [(-120, -180), (125, -175), (-140, -110), (135, -95)]:
        draw.ellipse([(cx + sx - 12, cy + sy - 16), (cx + sx + 12, cy + sy + 16)], fill="#38BDF8", outline="#0284C7", width=3)

    # Ear ringing sparks
    for r in [130, 165, 200]:
        draw.arc([(cx - 90 - r, cy - 125 - r//2), (cx - 90, cy - 125 + r//2)], 110, 250, fill="#FACC15", width=7)
        draw.arc([(cx + 90, cy - 125 - r//2), (cx + 90 + r, cy - 125 + r//2)], 290, 70, fill="#FACC15", width=7)

    # -20.6 dB badge
    draw.rounded_rectangle([(w//2 - 200, cy - 350), (w//2 + 200, cy - 250)], radius=18, fill="#0F172A", outline="#EF4444", width=5)
    font_db = ImageFont.truetype(FONT_PATH, 60)
    draw_text_with_outline(draw, (w // 2, cy - 300), "-20.6 dB SILENCE", font_db, fill_color="#EF4444", outline_width=6)

    # Title: 2 TO 3 WORDS ONLY ("DEADLY SILENCE")
    font_title_short = ImageFont.truetype(FONT_PATH, 140)
    draw_text_with_outline(draw, (w // 2, 220), "DEADLY", font_title_short, fill_color="#FFDE00", outline_width=18)
    draw_text_with_outline(draw, (w // 2, 360), "SILENCE", font_title_short, fill_color="#FFDE00", outline_width=18)

    # Save
    out_s_png = PUB_DIR / "thumbnail_short.png"
    out_s_jpg = PUB_DIR / "thumbnail_short.jpg"
    out_s_art = PUB_DIR / "thumbnail_short_art.png"
    im_rgb = im.convert("RGB")
    im.save(out_s_png, "PNG")
    im.save(out_s_art, "PNG")
    im_rgb.save(out_s_jpg, "JPEG", quality=95)
    
    im.save(OUT_DIR / "thumbnail_short.png", "PNG")
    im.save(OUT_DIR / "thumbnail_short_art.png", "PNG")
    im_rgb.save(OUT_DIR / "thumbnail_short.jpg", "JPEG", quality=95)
    print(f"Created vertical thumbnail: {out_s_png}")

if __name__ == "__main__":
    create_landscape_thumbnail()
    create_vertical_short_thumbnail()

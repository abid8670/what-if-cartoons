import math
import os
import pathlib
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\immortal")
OUT_DIR.mkdir(parents=True, exist_ok=True)
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

FONT_DIR = pathlib.Path(os.environ.get('WINDIR', 'C:\\Windows')) / 'Fonts'
font_path_ariblk = str(FONT_DIR / 'ariblk.ttf')

def get_ariblk(size):
    return ImageFont.truetype(font_path_ariblk, size)

# ==============================================================================
# 1. RENDER 16:9 MASTER THUMBNAIL (1280x720) - EXACT IFLORD STYLE
# ==============================================================================
W, H = 1280, 720
im = Image.new("RGBA", (W, H), (14, 11, 26, 255))
draw = ImageDraw.Draw(im)

# A. Deep Night Gradient Background
for y in range(H):
    ratio = y / float(H)
    r = int(12 + ratio * 15)
    g = int(10 + ratio * 12)
    b = int(24 + ratio * 20)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# B. Distant City Skyline Silhouette with glowing windows
random.seed(101)
city_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(city_overlay)

bx = 0
while bx < W:
    bw = random.randint(45, 95)
    bh = random.randint(180, 360)
    cdraw.rectangle([bx, H - bh, bx + bw, H], fill=(18, 15, 32, 220))
    # Windows
    for wy in range(H - bh + 20, H - 40, 22):
        for wx in range(bx + 8, bx + bw - 12, 16):
            if random.random() < 0.45:
                wcol = random.choice([(253, 224, 71, 140), (245, 158, 11, 160), (96, 165, 250, 100), (255, 255, 255, 120)])
                cdraw.rectangle([wx, wy, wx + 6, wy + 10], fill=wcol)
    bx += bw + random.randint(5, 15)

city_blurred = city_overlay.filter(ImageFilter.GaussianBlur(3.5))
im = Image.alpha_composite(im, city_blurred)

# C. Warm Golden Bokeh Lights in Background
bokeh_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bokeh_layer)
for _ in range(50):
    cx = random.randint(40, W - 80)
    cy = random.randint(180, H - 90)
    rad = random.randint(15, 55)
    bcol = random.choice([
        (245, 158, 11, random.randint(40, 110)),
        (253, 224, 71, random.randint(50, 130)),
        (239, 68, 68, random.randint(30, 90)),
        (168, 85, 247, random.randint(25, 70))
    ])
    bdraw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=bcol)

bokeh_blurred = bokeh_layer.filter(ImageFilter.GaussianBlur(16))
im = Image.alpha_composite(im, bokeh_blurred)

# D. Fine Slanted Rain Streaks
rain_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rdraw = ImageDraw.Draw(rain_layer)
for _ in range(260):
    rx = random.randint(0, W)
    ry = random.randint(0, H - 50)
    rlen = random.randint(20, 50)
    rdraw.line([(rx, ry), (rx + 4, ry + rlen)], fill=(255, 255, 255, random.randint(20, 65)), width=1)
im = Image.alpha_composite(im, rain_layer)

# ==============================================================================
# E. DRAW THE IFLORD-STYLE STICKMAN (Pip) ON THE RIGHT
# ==============================================================================
stick_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(stick_layer)

head_cx, head_cy = 930, 360
head_r = 145

# 1. Warm Golden/Peach Rim Light Behind Head (Crescent highlight on top-right)
rim_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rg_draw = ImageDraw.Draw(rim_glow)
rg_draw.ellipse([head_cx - head_r - 12, head_cy - head_r - 12, head_cx + head_r + 14, head_cy + head_r + 14], fill=(245, 158, 11, 230))
rim_glow_blurred = rim_glow.filter(ImageFilter.GaussianBlur(8))
im = Image.alpha_composite(im, rim_glow_blurred)

# 2. Pip's Dark Round Head
sdraw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(24, 20, 34, 255))

# 3. Pip's Golden/Mustard Hoodie and Body
hoodie_col = (234, 154, 28, 255)
hoodie_shade = (194, 120, 16, 255)
outline_col = (14, 10, 20, 255)

body_left, body_right = 720, 1140
body_top = head_cy + 105

# Hoodie collar rim behind neck
sdraw.rounded_rectangle([head_cx - 110, head_cy + 90, head_cx + 110, head_cy + 185], radius=45, fill=hoodie_shade, outline=outline_col, width=6)

# Main torso
sdraw.rounded_rectangle([body_left, body_top, body_right, H + 50], radius=55, fill=hoodie_col, outline=outline_col, width=7)

# Hoodie center seam & pocket
sdraw.line([(head_cx, body_top + 45), (head_cx, H)], fill=outline_col, width=5)
sdraw.line([(head_cx + 55, body_top + 70), (head_cx + 55, H)], fill=outline_col, width=5)

# White drawstrings
sdraw.rounded_rectangle([head_cx - 50, body_top + 30, head_cx - 40, body_top + 165], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rounded_rectangle([head_cx + 35, body_top + 30, head_cx + 45, body_top + 180], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)

# Neck connector (black)
sdraw.rectangle([head_cx - 26, head_cy + 75, head_cx + 26, head_cy + 130], fill=(24, 20, 34, 255))

# 4. Pip's Iconic Expressive Face (Iflord Style: Calm/unamused horizontal slits looking left at the bullet)
eye_y = head_cy - 8
eye_w, eye_h = 42, 22
# Left Eye
sdraw.rounded_rectangle([head_cx - 95, eye_y - eye_h, head_cx - 95 + eye_w, eye_y + eye_h], radius=10, fill=(255, 255, 255, 255))
sdraw.rectangle([head_cx - 98, eye_y - eye_h - 4, head_cx - 95 + eye_w + 3, eye_y - 2], fill=(24, 20, 34, 255))

# Right Eye
sdraw.rounded_rectangle([head_cx + 10, eye_y - eye_h, head_cx + 10 + eye_w, eye_y + eye_h], radius=10, fill=(255, 255, 255, 255))
sdraw.rectangle([head_cx + 7, eye_y - eye_h - 4, head_cx + 10 + eye_w + 3, eye_y - 2], fill=(24, 20, 34, 255))

# Flat calm mouth dash
sdraw.rounded_rectangle([head_cx - 45, head_cy + 60, head_cx - 15, head_cy + 68], radius=4, fill=(255, 255, 255, 255))

im = Image.alpha_composite(im, stick_layer)

# ==============================================================================
# F. THE FLYING BULLET IN SLOW MOTION (EXACT IFLORD BULLET)
# ==============================================================================
bullet_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bullet_layer)

# Bullet Position: Heading towards Pip's face
bx, by = 480, head_cy - 10
bw, bh = 220, 48

# 1. Sonic Shockwave Rings radiating backwards
for r_offset in [50, 110, 170, 230]:
    rx_c = bx - r_offset
    bdraw.ellipse([rx_c - 18, by - 35, rx_c + 18, by + bh + 35], outline=(255, 255, 255, int(190 - r_offset * 0.7)), width=3)

# 2. Glowing motion blur trail
for dy in [-12, -4, 4, 12]:
    bdraw.line([(bx - 180, by + bh//2 + dy), (bx, by + bh//2 + dy)], fill=(245, 158, 11, 160), width=4)

# 3. Bullet Brass Body (Cartridge/Cylinder)
bdraw.rounded_rectangle([bx, by, bx + bw - 50, by + bh], radius=8, fill=(212, 160, 52, 255), outline=(14, 10, 20, 255), width=4)
# Primer groove ring
bdraw.line([(bx + 20, by), (bx + 20, by + bh)], fill=(150, 100, 30, 255), width=5)

# 4. Bullet Head / Tip (Curved aerodynamic bullet nose)
tip_poly = [
    (bx + bw - 50, by),
    (bx + bw, by + bh // 2),
    (bx + bw - 50, by + bh)
]
bdraw.polygon(tip_poly, fill=(234, 179, 70, 255), outline=(14, 10, 20, 255))
bdraw.line([(bx + bw - 50, by), (bx + bw, by + bh // 2), (bx + bw - 50, by + bh)], fill=(14, 10, 20, 255), width=4)

# 5. Bullet highlight reflection
bdraw.line([(bx + 30, by + 10), (bx + bw - 60, by + 10)], fill=(255, 230, 150, 220), width=5)

# 6. Floating diamond particle sparks (Debris in air around bullet)
for sp_x, sp_y, sp_s in [(bx + bw + 20, by - 15, 8), (bx + bw + 45, by + 30, 12), (bx + bw + 75, by - 5, 7), (bx + bw + 95, by + 45, 10), (bx + 140, by - 25, 9)]:
    bdraw.polygon([(sp_x, sp_y - sp_s), (sp_x + sp_s, sp_y), (sp_x, sp_y + sp_s), (sp_x - sp_s, sp_y)], fill=(254, 240, 202, 230))

im = Image.alpha_composite(im, bullet_layer)

# ==============================================================================
# G. THE CLICKBAIT TEXT: "CAN'T" (White) & "DIE." (Golden Yellow)
# ==============================================================================
font_big = get_ariblk(145)

def render_angled_word(word, font, fill_col, angle=-3.0):
    bbox = font.getbbox(word)
    tw = bbox[2] - bbox[0] + 50
    th = bbox[3] - bbox[1] + 50
    word_img = Image.new("RGBA", (tw + 40, th + 40), (0, 0, 0, 0))
    wdraw = ImageDraw.Draw(word_img)
    ox, oy = 20 - bbox[0], 20 - bbox[1]
    
    # Heavy Black Outline
    for dx in range(-12, 13):
        for dy in range(-12, 13):
            if dx*dx + dy*dy <= 144:
                wdraw.text((ox + dx, oy + dy), word, font=font, fill=(10, 8, 16, 255))
                
    # Extra bottom drop shadow
    for shadow_y in range(12, 22):
        wdraw.text((ox, oy + shadow_y), word, font=font, fill=(0, 0, 0, 255))
        
    # Main Solid Fill
    wdraw.text((ox, oy), word, font=font, fill=fill_col)
    
    return word_img.rotate(-angle, resample=Image.BICUBIC, expand=True)

# Render words
cant_img = render_angled_word("CAN'T", font_big, (255, 255, 255, 255), angle=-3.0)
die_img = render_angled_word("DIE.", font_big, (253, 224, 71, 255), angle=-3.0)

# Paste on left side
im.alpha_composite(cant_img, (60, 90))
im.alpha_composite(die_img, (60, 245))

# ==============================================================================
# H. SAVE THUMBNAILS
# ==============================================================================
thumb_16_9 = im.convert("RGB")
out_path_16_9 = OUT_DIR / "thumbnail.jpg"
thumb_16_9.save(out_path_16_9, "JPEG", quality=95)
thumb_16_9.save(BRAIN / "thumbnail_immortal.jpg", "JPEG", quality=95)

# Render Vertical 9:16 Short Thumbnail
im_vert = Image.new("RGBA", (1080, 1920), (14, 11, 26, 255))
# Scale and center
scale_factor = 1.9
scaled_bg = im.resize((int(W * scale_factor), int(H * scale_factor)), Image.Resampling.LANCZOS)
im_vert.paste(scaled_bg, ((1080 - scaled_bg.width) // 2 + 100, (1920 - scaled_bg.height) // 2))
thumb_vert = im_vert.convert("RGB")
out_path_vert = OUT_DIR / "thumbnail_short.jpg"
thumb_vert.save(out_path_vert, "JPEG", quality=95)

print("SUCCESS: Immortal thumbnails rendered!")
print("Saved 16:9 to", out_path_16_9)
print("Saved 9:16 to", out_path_vert)


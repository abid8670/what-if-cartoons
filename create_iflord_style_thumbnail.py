import math
import os
import pathlib
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\death-timer")
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\death-timer")
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
random.seed(42)
city_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(city_overlay)

# Buildings
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

# Slightly blur the city
city_blurred = city_overlay.filter(ImageFilter.GaussianBlur(3.5))
im = Image.alpha_composite(im, city_blurred)

# C. Warm Golden Bokeh Lights in Background (Blurred circles)
bokeh_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bokeh_layer)
for _ in range(45):
    cx = random.randint(50, W - 100)
    cy = random.randint(200, H - 100)
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
for _ in range(240):
    rx = random.randint(0, W)
    ry = random.randint(0, H - 50)
    rlen = random.randint(20, 50)
    rdraw.line([(rx, ry), (rx + 4, ry + rlen)], fill=(255, 255, 255, random.randint(20, 60)), width=1)
im = Image.alpha_composite(im, rain_layer)

# ==============================================================================
# E. DRAW THE IFLORD-STYLE STICKMAN (Pip) ON THE RIGHT
# ==============================================================================
stick_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(stick_layer)

# Stickman Coordinates: Right side
head_cx, head_cy = 980, 360
head_r = 135

# 1. Warm Golden Rim Light Behind Head (Crescent highlight on top-right)
rim_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rg_draw = ImageDraw.Draw(rim_glow)
rg_draw.ellipse([head_cx - head_r - 12, head_cy - head_r - 12, head_cx + head_r + 14, head_cy + head_r + 14], fill=(245, 158, 11, 230))
rim_glow_blurred = rim_glow.filter(ImageFilter.GaussianBlur(8))
im = Image.alpha_composite(im, rim_glow_blurred)

# 2. Pip's Dark Round Head
# Solid black / deep charcoal circle
sdraw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(24, 20, 34, 255))

# 3. Pip's Golden/Mustard Hoodie and Body
# Mustard yellow body block
hoodie_col = (234, 154, 28, 255)
hoodie_shade = (194, 120, 16, 255)
outline_col = (14, 10, 20, 255)

# Shoulders & Chest
body_left, body_right = 780, 1180
body_top = head_cy + 95

# Hoodie collar rim behind neck
sdraw.rounded_rectangle([head_cx - 105, head_cy + 80, head_cx + 105, head_cy + 170], radius=40, fill=hoodie_shade, outline=outline_col, width=6)

# Main torso
sdraw.rounded_rectangle([body_left, body_top, body_right, H + 50], radius=50, fill=hoodie_col, outline=outline_col, width=7)

# Hoodie pocket & seams
sdraw.line([(head_cx, body_top + 40), (head_cx, H)], fill=outline_col, width=5)

# White drawstrings
sdraw.rounded_rectangle([head_cx - 45, body_top + 30, head_cx - 35, body_top + 160], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rounded_rectangle([head_cx + 35, body_top + 30, head_cx + 45, body_top + 175], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)

# Neck connector (black)
sdraw.rectangle([head_cx - 24, head_cy + 70, head_cx + 24, head_cy + 120], fill=(24, 20, 34, 255))

# 4. Pip's Iconic Expressive Face (Iflord Style: Half-lidded calm / bored / intense look staring left)
# Left eye
eye_y = head_cy - 12
eye_w, eye_h = 38, 24
# Left Eye (white pill / half-ellipse)
sdraw.rounded_rectangle([head_cx - 85, eye_y - eye_h, head_cx - 85 + eye_w, eye_y + eye_h], radius=10, fill=(255, 255, 255, 255))
# Drooping eyelid covering top half
sdraw.rectangle([head_cx - 88, eye_y - eye_h - 4, head_cx - 85 + eye_w + 3, eye_y - 2], fill=(24, 20, 34, 255))

# Right Eye (white pill)
sdraw.rounded_rectangle([head_cx + 15, eye_y - eye_h, head_cx + 15 + eye_w, eye_y + eye_h], radius=10, fill=(255, 255, 255, 255))
# Drooping eyelid
sdraw.rectangle([head_cx + 12, eye_y - eye_h - 4, head_cx + 15 + eye_w + 3, eye_y - 2], fill=(24, 20, 34, 255))

# Flat calm mouth dash
sdraw.rounded_rectangle([head_cx - 40, head_cy + 52, head_cx - 10, head_cy + 60], radius=4, fill=(255, 255, 255, 255))

im = Image.alpha_composite(im, stick_layer)

# ==============================================================================
# F. THE GLOWING CRIMSON DEATH TIMER IN THE MIDDLE (Like the Flying Bullet)
# ==============================================================================
timer_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(timer_layer)

# Position: Floating between text and Pip
tx, ty = 540, 370
tw, th = 340, 95

# Shockwave rings radiating towards Pip (like sonic rings around the bullet in Iflord's thumb)
ring_color = (239, 68, 68, 140)
for r_offset in [40, 90, 140, 190]:
    rx_center = tx + tw // 2 - r_offset
    tdraw.ellipse([rx_center - 16, ty - 25, rx_center + 16, ty + th + 25], outline=(239, 68, 68, int(180 - r_offset * 0.8)), width=3)

# Glowing Trail lines
for dy in [-15, 0, 15]:
    tdraw.line([(tx - 160, ty + th//2 + dy), (tx, ty + th//2 + dy)], fill=(239, 68, 68, 190), width=4)

# Holographic Glowing Crimson Box
tdraw.rounded_rectangle([tx, ty, tx + tw, ty + th], radius=24, fill=(18, 14, 28, 245), outline=(239, 68, 68, 255), width=5)
# Outer neon aura
tdraw.rounded_rectangle([tx - 6, ty - 6, tx + tw + 6, ty + th + 6], radius=30, outline=(239, 68, 68, 100), width=4)

# Clock Text: [ 00:00:03 ]
font_timer = get_ariblk(48)
tdraw.text((tx + tw // 2, ty + th // 2 + 2), "[ 00:00:03 ]", font=font_timer, fill=(255, 60, 60), anchor="mm")

# Floating digital spark diamonds (just like the debris in Iflord's thumb)
for sp_x, sp_y, sp_s in [(tx + tw + 20, ty + 10, 8), (tx + tw + 45, ty + 60, 12), (tx + tw + 65, ty + 25, 6), (tx + tw + 85, ty + 75, 10)]:
    tdraw.polygon([(sp_x, sp_y - sp_s), (sp_x + sp_s, sp_y), (sp_x, sp_y + sp_s), (sp_x - sp_s, sp_y)], fill=(254, 202, 202, 220))

im = Image.alpha_composite(im, timer_layer)

# ==============================================================================
# G. THE 2-WORD PUNCHY CLICKBAIT TEXT ON THE LEFT (EXACT IFLORD LAYOUT)
# ==============================================================================
# In Iflord:
# CAN'T (White, angled)
# DIE. (Yellow, angled)
# In Our Viral Death Timer:
# TIME'S (White, angled -3°)
# UP. (Golden Yellow #FACC15, angled -3°)
text_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))

font_big = get_ariblk(138)

def render_angled_word(word, font, fill_col, angle=-3.5):
    # Render word on tight canvas
    bbox = font.getbbox(word)
    tw = bbox[2] - bbox[0] + 40
    th = bbox[3] - bbox[1] + 40
    word_im = Image.new("RGBA", (tw + 40, th + 40), (0, 0, 0, 0))
    wdraw = ImageDraw.Draw(word_im)
    
    # 3D Drop Shadow
    for sox, soy in [(8, 12), (7, 10), (6, 8), (5, 6)]:
        wdraw.text((20 + sox, 20 + soy), word, font=font, fill=(5, 3, 10, 240), stroke_width=6, stroke_fill=(5, 3, 10, 240))
    # Black stroke
    wdraw.text((20, 20), word, font=font, fill=fill_col, stroke_width=7, stroke_fill=(10, 8, 16, 255))
    
    # Rotate
    rotated = word_im.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    return rotated

word1 = render_angled_word("TIME'S", font_big, (255, 255, 255, 255), angle=-3.5)
word2 = render_angled_word("UP.", font_big, (250, 204, 21, 255), angle=-3.5)

im.paste(word1, (75, 70), word1)
im.paste(word2, (80, 215), word2)

# Save Master 16:9 Thumbnail
final_16_9 = im.convert("RGB")
final_16_9.save(PUB_DIR / "thumbnail.jpg", quality=96)
final_16_9.save(OUT_DIR / "thumbnail.jpg", quality=96)
final_16_9.save(BRAIN / "thumb_iflord_style_16x9.jpg", quality=96)
print("Saved 16:9 Iflord-Style Thumbnail!")

# ==============================================================================
# 2. RENDER 9:16 VERTICAL SHORT THUMBNAIL (1080x1920)
# ==============================================================================
v_w, v_h = 1080, 1920
v_im = Image.new("RGBA", (v_w, v_h), (14, 11, 26, 255))
v_draw = ImageDraw.Draw(v_im)

# Vertical Background Gradient
for y in range(v_h):
    ratio = y / float(v_h)
    r = int(12 + ratio * 16)
    g = int(10 + ratio * 14)
    b = int(24 + ratio * 24)
    v_draw.line([(0, y), (v_w, y)], fill=(r, g, b, 255))

# Vertical Bokeh
v_bokeh = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vb_draw = ImageDraw.Draw(v_bokeh)
for _ in range(60):
    cx = random.randint(40, v_w - 40)
    cy = random.randint(100, v_h - 100)
    rad = random.randint(25, 75)
    bcol = random.choice([(245, 158, 11, 80), (253, 224, 71, 90), (239, 68, 68, 60)])
    vb_draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=bcol)
v_im = Image.alpha_composite(v_im, v_bokeh.filter(ImageFilter.GaussianBlur(22)))

# Slanted Rain
v_rain = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vr_draw = ImageDraw.Draw(v_rain)
for _ in range(350):
    rx = random.randint(0, v_w)
    ry = random.randint(0, v_h)
    rlen = random.randint(25, 65)
    vr_draw.line([(rx, ry), (rx + 4, ry + rlen)], fill=(255, 255, 255, random.randint(25, 70)), width=1)
v_im = Image.alpha_composite(v_im, v_rain)

# Center Stickman (Pip) in Vertical Format
v_stick = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vs_draw = ImageDraw.Draw(v_stick)

vh_cx, vh_cy = 540, 920
vh_r = 170

# Golden Rim
v_rim = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vr_draw_g = ImageDraw.Draw(v_rim)
vr_draw_g.ellipse([vh_cx - vh_r - 16, vh_cy - vh_r - 16, vh_cx + vh_r + 18, vh_cy + vh_r + 18], fill=(245, 158, 11, 230))
v_im = Image.alpha_composite(v_im, v_rim.filter(ImageFilter.GaussianBlur(10)))

# Head
vs_draw.ellipse([vh_cx - vh_r, vh_cy - vh_r, vh_cx + vh_r, vh_cy + vh_r], fill=(24, 20, 34, 255))

# Torso
vs_draw.rounded_rectangle([vh_cx - 240, vh_cy + 120, vh_cx + 240, v_h + 50], radius=60, fill=(234, 154, 28, 255), outline=(14, 10, 20, 255), width=9)
vs_draw.line([(vh_cx, vh_cy + 140), (vh_cx, v_h)], fill=(14, 10, 20, 255), width=6)
# Drawstrings
vs_draw.rounded_rectangle([vh_cx - 60, vh_cy + 130, vh_cx - 48, vh_cy + 300], radius=6, fill=(255, 255, 255, 255), outline=(14, 10, 20, 255), width=3)
vs_draw.rounded_rectangle([vh_cx + 48, vh_cy + 130, vh_cx + 60, vh_cy + 320], radius=6, fill=(255, 255, 255, 255), outline=(14, 10, 20, 255), width=3)

# Face
v_ey = vh_cy - 15
v_ew, v_eh = 48, 30
vs_draw.rounded_rectangle([vh_cx - 110, v_ey - v_eh, vh_cx - 110 + v_ew, v_ey + v_eh], radius=12, fill=(255, 255, 255, 255))
vs_draw.rectangle([vh_cx - 114, v_ey - v_eh - 5, vh_cx - 110 + v_ew + 4, v_ey - 3], fill=(24, 20, 34, 255))

vs_draw.rounded_rectangle([vh_cx + 20, v_ey - v_eh, vh_cx + 20 + v_ew, v_ey + v_eh], radius=12, fill=(255, 255, 255, 255))
vs_draw.rectangle([vh_cx + 16, v_ey - v_eh - 5, vh_cx + 20 + v_ew + 4, v_ey - 3], fill=(24, 20, 34, 255))

vs_draw.rounded_rectangle([vh_cx - 50, vh_cy + 65, vh_cx - 15, vh_cy + 75], radius=5, fill=(255, 255, 255, 255))

v_im = Image.alpha_composite(v_im, v_stick)

# Vertical Glowing HUD (Above Pip's Head)
v_timer = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vt_draw = ImageDraw.Draw(v_timer)
v_tx, v_ty = 300, 560
v_tw, v_th = 480, 120
vt_draw.rounded_rectangle([v_tx, v_ty, v_tx + v_tw, v_ty + v_th], radius=28, fill=(18, 14, 28, 245), outline=(239, 68, 68, 255), width=6)
vt_draw.rounded_rectangle([v_tx - 8, v_ty - 8, v_tx + v_tw + 8, v_ty + v_th + 8], radius=36, outline=(239, 68, 68, 100), width=4)
font_v_timer = get_ariblk(64)
vt_draw.text((v_tx + v_tw // 2, v_ty + v_th // 2 + 2), "[ 00:00:03 ]", font=font_v_timer, fill=(255, 60, 60), anchor="mm")
v_im = Image.alpha_composite(v_im, v_timer)

# Vertical Punchy Text at the top
v_word1 = render_angled_word("TIME'S", get_ariblk(175), (255, 255, 255, 255), angle=-3.5)
v_word2 = render_angled_word("UP.", get_ariblk(175), (250, 204, 21, 255), angle=-3.5)

v_im.paste(v_word1, (160, 180), v_word1)
v_im.paste(v_word2, (170, 360), v_word2)

# Save Vertical Short Thumbnail
final_vert = v_im.convert("RGB")
final_vert.save(PUB_DIR / "thumbnail_short.jpg", quality=96)
final_vert.save(OUT_DIR / "thumbnail_short.jpg", quality=96)
final_vert.save(BRAIN / "thumb_iflord_style_9x16.jpg", quality=96)
print("Saved 9:16 Iflord-Style Thumbnail!")


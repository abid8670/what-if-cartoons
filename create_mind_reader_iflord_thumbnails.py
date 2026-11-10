import math
import os
import pathlib
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\mind-reader")
PUB_DIR.mkdir(parents=True, exist_ok=True)
PUB_TIMER = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\mind-reader")
PUB_TIMER.mkdir(parents=True, exist_ok=True)
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\mind-reader")
OUT_DIR.mkdir(parents=True, exist_ok=True)
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

FONT_DIR = pathlib.Path(os.environ.get('WINDIR', 'C:\\Windows')) / 'Fonts'
font_path_ariblk = str(FONT_DIR / 'ariblk.ttf')

def get_ariblk(size):
    return ImageFont.truetype(font_path_ariblk, size)

def render_angled_word(word, font, fill_col, angle=-3.5):
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
    
    rotated = word_im.rotate(angle, resample=Image.Resampling.BICUBIC, expand=True)
    return rotated

# ==============================================================================
# 1. 16:9 MASTER THUMBNAIL (1280x720) - "THEY KNOW."
# ==============================================================================
W, H = 1280, 720
im = Image.new("RGBA", (W, H), (14, 11, 26, 255))
draw = ImageDraw.Draw(im)

# A. Deep Night Gradient Background
for y in range(H):
    ratio = y / float(H)
    r = int(10 + ratio * 16)
    g = int(8 + ratio * 14)
    b = int(26 + ratio * 24)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# B. Distant City Skyline Silhouette with glowing windows
random.seed(99)
city_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(city_overlay)

bx = 0
while bx < W:
    bw = random.randint(50, 100)
    bh = random.randint(190, 370)
    cdraw.rectangle([bx, H - bh, bx + bw, H], fill=(16, 13, 30, 225))
    for wy in range(H - bh + 25, H - 40, 22):
        for wx in range(bx + 8, bx + bw - 12, 16):
            if random.random() < 0.45:
                wcol = random.choice([(253, 224, 71, 140), (245, 158, 11, 150), (168, 85, 247, 120), (255, 255, 255, 130)])
                cdraw.rectangle([wx, wy, wx + 6, wy + 10], fill=wcol)
    bx += bw + random.randint(6, 16)

im = Image.alpha_composite(im, city_overlay.filter(ImageFilter.GaussianBlur(3.5)))

# C. Warm Golden & Magenta Bokeh Lights
bokeh_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bokeh_layer)
for _ in range(48):
    cx = random.randint(40, W - 80)
    cy = random.randint(180, H - 80)
    rad = random.randint(16, 55)
    bcol = random.choice([
        (245, 158, 11, random.randint(45, 110)),
        (253, 224, 71, random.randint(55, 130)),
        (168, 85, 247, random.randint(35, 95)),
        (6, 182, 212, random.randint(30, 85))
    ])
    bdraw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=bcol)
im = Image.alpha_composite(im, bokeh_layer.filter(ImageFilter.GaussianBlur(16)))

# D. Fine Slanted Rain Streaks
rain_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rdraw = ImageDraw.Draw(rain_layer)
for _ in range(260):
    rx = random.randint(0, W)
    ry = random.randint(0, H - 50)
    rlen = random.randint(20, 50)
    rdraw.line([(rx, ry), (rx + 4, ry + rlen)], fill=(255, 255, 255, random.randint(20, 65)), width=1)
im = Image.alpha_composite(im, rain_layer)

# E. DRAW THE IFLORD-STYLE STICKMAN (Pip) ON THE RIGHT
stick_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(stick_layer)

head_cx, head_cy = 980, 360
head_r = 135

# 1. Warm Golden Rim Light Behind Head
rim_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rg_draw = ImageDraw.Draw(rim_glow)
rg_draw.ellipse([head_cx - head_r - 14, head_cy - head_r - 14, head_cx + head_r + 16, head_cy + head_r + 16], fill=(245, 158, 11, 235))
im = Image.alpha_composite(im, rim_glow.filter(ImageFilter.GaussianBlur(8)))

# 2. Pip's Dark Head
sdraw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(24, 20, 34, 255))

# 3. Pip's Mustard Hoodie
hoodie_col = (234, 154, 28, 255)
hoodie_shade = (194, 120, 16, 255)
outline_col = (14, 10, 20, 255)

body_left, body_right = 780, 1180
body_top = head_cy + 95

sdraw.rounded_rectangle([head_cx - 105, head_cy + 80, head_cx + 105, head_cy + 170], radius=40, fill=hoodie_shade, outline=outline_col, width=6)
sdraw.rounded_rectangle([body_left, body_top, body_right, H + 50], radius=50, fill=hoodie_col, outline=outline_col, width=7)
sdraw.line([(head_cx, body_top + 40), (head_cx, H)], fill=outline_col, width=5)

sdraw.rounded_rectangle([head_cx - 45, body_top + 30, head_cx - 35, body_top + 160], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rounded_rectangle([head_cx + 35, body_top + 30, head_cx + 45, body_top + 175], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rectangle([head_cx - 24, head_cy + 70, head_cx + 24, head_cy + 120], fill=(24, 20, 34, 255))

# 4. Pip's Expressive Face (Shocked / Panicked looking at the broadcast waves)
eye_y = head_cy - 12
eye_w, eye_h = 42, 28
# Wide White Shocked Eyes
sdraw.ellipse([head_cx - 90, eye_y - eye_h, head_cx - 90 + eye_w, eye_y + eye_h], fill=(255, 255, 255, 255))
sdraw.ellipse([head_cx - 72, eye_y - 12, head_cx - 56, eye_y + 8], fill=(24, 20, 34, 255)) # Pupil staring left

sdraw.ellipse([head_cx + 15, eye_y - eye_h, head_cx + 15 + eye_w, eye_y + eye_h], fill=(255, 255, 255, 255))
sdraw.ellipse([head_cx + 33, eye_y - 12, head_cx + 49, eye_y + 8], fill=(24, 20, 34, 255)) # Pupil staring left

# Worried curved mouth
sdraw.arc([head_cx - 45, head_cy + 42, head_cx - 5, head_cy + 75], start=200, end=340, fill=(255, 255, 255, 255), width=5)

im = Image.alpha_composite(im, stick_layer)

# F. THE HOLOGRAPHIC THOUGHT BROADCAST HUD IN THE MIDDLE
prop_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pdraw = ImageDraw.Draw(prop_layer)

px, py = 520, 370
pw, ph = 370, 95

# Sonic/Psychic thought wave rings expanding from Pip's head towards the world
for r_offset in [30, 80, 130, 180, 230]:
    rx_center = px + pw // 2 - r_offset
    pdraw.ellipse([rx_center - 16, py - 25, rx_center + 16, py + ph + 25], outline=(6, 182, 212, int(180 - r_offset * 0.7)), width=3)

# Holographic Glowing Cyan Thought Broadcast Box
pdraw.rounded_rectangle([px, py, px + pw, py + ph], radius=24, fill=(18, 14, 28, 245), outline=(6, 182, 212, 255), width=5)
pdraw.rounded_rectangle([px - 6, py - 6, px + pw + 6, py + ph + 6], radius=30, outline=(6, 182, 212, 100), width=4)

font_prop = get_ariblk(42)
pdraw.text((px + pw // 2, py + ph // 2 + 2), "💭 MIND BROADCAST", font=font_prop, fill=(6, 182, 212), anchor="mm")

# Floating digital spark diamonds
for sp_x, sp_y, sp_s in [(px + pw + 20, py + 10, 8), (px + pw + 45, py + 60, 12), (px + pw + 65, py + 25, 6), (px + pw + 85, py + 75, 10)]:
    pdraw.polygon([(sp_x, sp_y - sp_s), (sp_x + sp_s, sp_y), (sp_x, sp_y + sp_s), (sp_x - sp_s, sp_y)], fill=(165, 243, 252, 220))

im = Image.alpha_composite(im, prop_layer)

# G. THE 2-WORD PUNCHY CLICKBAIT TEXT ON THE LEFT
# THEY (White)
# KNOW. (Yellow)
font_big = get_ariblk(145)

word1 = render_angled_word("THEY", font_big, (255, 255, 255, 255), angle=-3.5)
word2 = render_angled_word("KNOW.", font_big, (250, 204, 21, 255), angle=-3.5)

im.paste(word1, (80, 70), word1)
im.paste(word2, (85, 220), word2)

# Save Master 16:9 Thumbnail
final_16_9 = im.convert("RGB")
final_16_9.save(PUB_DIR / "thumbnail.jpg", quality=96)
final_16_9.save(PUB_TIMER / "thumbnail.jpg", quality=96)
final_16_9.save(OUT_DIR / "thumbnail.jpg", quality=96)
final_16_9.save(BRAIN / "thumb_mind_reader_16x9.jpg", quality=96)
print("Saved 16:9 Mind Reader Master Thumbnail!")

# ==============================================================================
# 2. 9:16 VERTICAL SHORT THUMBNAIL (1080x1920)
# ==============================================================================
v_w, v_h = 1080, 1920
v_im = Image.new("RGBA", (v_w, v_h), (14, 11, 26, 255))
v_draw = ImageDraw.Draw(v_im)

for y in range(v_h):
    ratio = y / float(v_h)
    r = int(10 + ratio * 16)
    g = int(8 + ratio * 14)
    b = int(26 + ratio * 24)
    v_draw.line([(0, y), (v_w, y)], fill=(r, g, b, 255))

v_bokeh = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vb_draw = ImageDraw.Draw(v_bokeh)
for _ in range(65):
    cx = random.randint(40, v_w - 40)
    cy = random.randint(100, v_h - 100)
    rad = random.randint(25, 75)
    bcol = random.choice([(245, 158, 11, 80), (253, 224, 71, 90), (6, 182, 212, 70)])
    vb_draw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=bcol)
v_im = Image.alpha_composite(v_im, v_bokeh.filter(ImageFilter.GaussianBlur(22)))

# Stickman (Pip) Center
v_stick = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vs_draw = ImageDraw.Draw(v_stick)

vh_cx, vh_cy = 540, 930
vh_r = 170

v_rim = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vr_draw_g = ImageDraw.Draw(v_rim)
vr_draw_g.ellipse([vh_cx - vh_r - 16, vh_cy - vh_r - 16, vh_cx + vh_r + 18, vh_cy + vh_r + 18], fill=(245, 158, 11, 230))
v_im = Image.alpha_composite(v_im, v_rim.filter(ImageFilter.GaussianBlur(10)))

vs_draw.ellipse([vh_cx - vh_r, vh_cy - vh_r, vh_cx + vh_r, vh_cy + vh_r], fill=(24, 20, 34, 255))
vs_draw.rounded_rectangle([vh_cx - 240, vh_cy + 120, vh_cx + 240, v_h + 50], radius=60, fill=(234, 154, 28, 255), outline=(14, 10, 20, 255), width=9)
vs_draw.line([(vh_cx, vh_cy + 140), (vh_cx, v_h)], fill=(14, 10, 20, 255), width=6)
vs_draw.rounded_rectangle([vh_cx - 60, vh_cy + 130, vh_cx - 48, vh_cy + 300], radius=6, fill=(255, 255, 255, 255), outline=(14, 10, 20, 255), width=3)
vs_draw.rounded_rectangle([vh_cx + 48, vh_cy + 130, vh_cx + 60, vh_cy + 320], radius=6, fill=(255, 255, 255, 255), outline=(14, 10, 20, 255), width=3)

# Face
v_ey = vh_cy - 15
v_ew, v_eh = 52, 34
vs_draw.ellipse([vh_cx - 110, v_ey - v_eh, vh_cx - 110 + v_ew, v_ey + v_eh], fill=(255, 255, 255, 255))
vs_draw.ellipse([vh_cx - 90, v_ey - 14, vh_cx - 72, v_ey + 10], fill=(24, 20, 34, 255))

vs_draw.ellipse([vh_cx + 20, v_ey - v_eh, vh_cx + 20 + v_ew, v_ey + v_eh], fill=(255, 255, 255, 255))
vs_draw.ellipse([vh_cx + 40, v_ey - 14, vh_cx + 58, v_ey + 10], fill=(24, 20, 34, 255))

vs_draw.arc([vh_cx - 50, vh_cy + 50, vh_cx - 10, vh_cy + 90], start=200, end=340, fill=(255, 255, 255, 255), width=6)

v_im = Image.alpha_composite(v_im, v_stick)

# Vertical HUD
v_prop = Image.new("RGBA", (v_w, v_h), (0, 0, 0, 0))
vp_draw = ImageDraw.Draw(v_prop)
v_tx, v_ty = 260, 560
v_tw, v_th = 560, 120
vp_draw.rounded_rectangle([v_tx, v_ty, v_tx + v_tw, v_ty + v_th], radius=28, fill=(18, 14, 28, 245), outline=(6, 182, 212, 255), width=6)
vp_draw.rounded_rectangle([v_tx - 8, v_ty - 8, v_tx + v_tw + 8, v_ty + v_th + 8], radius=36, outline=(6, 182, 212, 100), width=4)
font_v_prop = get_ariblk(54)
vp_draw.text((v_tx + v_tw // 2, v_ty + v_th // 2 + 2), "💭 MIND BROADCAST", font=font_v_prop, fill=(6, 182, 212), anchor="mm")
v_im = Image.alpha_composite(v_im, v_prop)

# Top 2-Word Punchline
v_word1 = render_angled_word("THEY", get_ariblk(185), (255, 255, 255, 255), angle=-3.5)
v_word2 = render_angled_word("KNOW.", get_ariblk(185), (250, 204, 21, 255), angle=-3.5)

v_im.paste(v_word1, (160, 170), v_word1)
v_im.paste(v_word2, (170, 360), v_word2)

final_vert = v_im.convert("RGB")
final_vert.save(PUB_DIR / "thumbnail_short.jpg", quality=96)
final_vert.save(PUB_TIMER / "thumbnail_short.jpg", quality=96)
final_vert.save(OUT_DIR / "thumbnail_short.jpg", quality=96)
final_vert.save(BRAIN / "thumb_mind_reader_9x16.jpg", quality=96)
print("Saved 9:16 Mind Reader Master Thumbnail!")


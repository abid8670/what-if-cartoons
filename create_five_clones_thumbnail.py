import math
import os
import pathlib
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\five-clones")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\five-clones")
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

FONT_DIR = pathlib.Path(os.environ.get('WINDIR', 'C:\\Windows')) / 'Fonts'
font_path_ariblk = str(FONT_DIR / 'ariblk.ttf')

def get_ariblk(size):
    try:
        return ImageFont.truetype(font_path_ariblk, size)
    except Exception:
        return ImageFont.load_default()

def draw_pip_stickman(layer, x, y, scale=1.0, facing=1, peach_rim=True, is_shocked=False):
    d = ImageDraw.Draw(layer)
    head_r = int(38 * scale)
    head_cy = int(y - 145 * scale)
    
    # Shadow
    d.ellipse([x - int(55 * scale), y - int(12 * scale), x + int(55 * scale), y + int(12 * scale)], fill=(0, 0, 0, 140))
    
    # Legs (Slim dark)
    leg_w = max(4, int(7 * scale))
    hip_y = head_cy + head_r + int(60 * scale)
    d.line([(x - int(16 * scale), hip_y), (x - int(20 * scale), y - int(6 * scale))], fill=(24, 22, 32, 255), width=leg_w)
    d.line([(x + int(16 * scale), hip_y), (x + int(20 * scale), y - int(6 * scale))], fill=(24, 22, 32, 255), width=leg_w)
    
    # Shoes
    shoe_w = int(24 * scale)
    shoe_h = int(12 * scale)
    d.rounded_rectangle([x - int(28 * scale), y - shoe_h, x - int(8 * scale), y], radius=4, fill=(217, 119, 6, 255))
    d.rounded_rectangle([x + int(8 * scale), y - shoe_h, x + int(28 * scale), y], radius=4, fill=(217, 119, 6, 255))
    
    # Mustard Hoodie Torso
    body_w = int(54 * scale)
    body_h = int(72 * scale)
    body_top = head_cy + head_r - int(4 * scale)
    d.rounded_rectangle([x - body_w // 2, body_top, x + body_w // 2, body_top + body_h], radius=int(16 * scale), fill=(245, 158, 11, 255), outline=(217, 119, 6, 255), width=2)
    
    # White drawstrings
    d.line([(x - int(10 * scale), body_top + int(8 * scale)), (x - int(10 * scale), body_top + int(42 * scale))], fill=(255, 255, 255, 255), width=max(2, int(3.5 * scale)))
    d.line([(x + int(10 * scale), body_top + int(8 * scale)), (x + int(10 * scale), body_top + int(42 * scale))], fill=(255, 255, 255, 255), width=max(2, int(3.5 * scale)))
    
    # Arms
    arm_w = max(4, int(8 * scale))
    if is_shocked:
        d.line([(x - body_w // 2, body_top + int(14 * scale)), (x - int(55 * scale), body_top - int(24 * scale))], fill=(245, 158, 11, 255), width=arm_w)
        d.line([(x + body_w // 2, body_top + int(14 * scale)), (x + int(55 * scale), body_top - int(24 * scale))], fill=(245, 158, 11, 255), width=arm_w)
    else:
        d.line([(x - body_w // 2, body_top + int(14 * scale)), (x - int(28 * scale), body_top + int(60 * scale))], fill=(245, 158, 11, 255), width=arm_w)
        d.line([(x + body_w // 2, body_top + int(14 * scale)), (x + int(28 * scale), body_top + int(60 * scale))], fill=(245, 158, 11, 255), width=arm_w)
    
    # Head
    d.ellipse([x - head_r, head_cy - head_r, x + head_r, head_cy + head_r], fill=(28, 26, 36, 255))
    
    # Peach rim light
    if peach_rim:
        rim_w = max(3, int(4.5 * scale))
        d.arc([x - head_r, head_cy - head_r, x + head_r, head_cy + head_r], start=210, end=330, fill=(255, 170, 85, 255), width=rim_w)
    
    # Eyes & Mouth
    if is_shocked:
        eye_r = max(4, int(7 * scale))
        d.ellipse([x - int(14 * scale) - eye_r, head_cy - int(4 * scale) - eye_r, x - int(14 * scale) + eye_r, head_cy - int(4 * scale) + eye_r], fill=(255, 255, 255, 255))
        d.ellipse([x + int(14 * scale) - eye_r, head_cy - int(4 * scale) - eye_r, x + int(14 * scale) + eye_r, head_cy - int(4 * scale) + eye_r], fill=(255, 255, 255, 255))
        d.ellipse([x - int(10 * scale), head_cy + int(14 * scale), x + int(10 * scale), head_cy + int(28 * scale)], fill=(255, 255, 255, 255))
    else:
        eye_w = int(16 * scale)
        d.line([(x - int(20 * scale), head_cy - int(4 * scale)), (x - int(20 * scale) + eye_w, head_cy - int(4 * scale))], fill=(255, 255, 255, 255), width=max(2, int(4 * scale)))
        d.line([(x + int(6 * scale), head_cy - int(4 * scale)), (x + int(6 * scale) + eye_w, head_cy - int(4 * scale))], fill=(255, 255, 255, 255), width=max(2, int(4 * scale)))
        d.line([(x - int(12 * scale), head_cy + int(18 * scale)), (x + int(12 * scale), head_cy + int(18 * scale))], fill=(255, 255, 255, 255), width=max(2, int(3.5 * scale)))

# ==============================================================================
# RENDER 16:9 MASTER THUMBNAIL (1280x720) - "5 CLONES."
# ==============================================================================
W, H = 1280, 720
# Load biolab background
bg_path = PUB_DIR / "bg_biolab_pods.jpg"
if bg_path.exists():
    im = Image.open(bg_path).convert("RGBA").resize((W, H))
else:
    im = Image.new("RGBA", (W, H), (10, 14, 24, 255))

# Dark dramatic tint
dark_tint = Image.new("RGBA", (W, H), (6, 10, 20, 140))
im = Image.alpha_composite(im, dark_tint)

# Emerald biolab mist
bokeh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bokeh)
for _ in range(30):
    cx = random.randint(100, W - 100)
    cy = random.randint(200, H - 50)
    rad = random.randint(30, 110)
    bdraw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=(16, 185, 129, random.randint(35, 75)))

bokeh_blur = bokeh.filter(ImageFilter.GaussianBlur(32))
im = Image.alpha_composite(im, bokeh_blur)

# Draw 5 Clones in Background Formation
clones_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_pip_stickman(clones_layer, x=180, y=600, scale=1.1, facing=1, is_shocked=False)
draw_pip_stickman(clones_layer, x=380, y=615, scale=1.18, facing=1, is_shocked=False)
draw_pip_stickman(clones_layer, x=640, y=575, scale=1.28, facing=1, is_shocked=False)
draw_pip_stickman(clones_layer, x=900, y=615, scale=1.18, facing=-1, is_shocked=False)
draw_pip_stickman(clones_layer, x=1100, y=600, scale=1.1, facing=-1, is_shocked=False)
im = Image.alpha_composite(im, clones_layer)

# Foreground Shocked Pip in Center
fg_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw_pip_stickman(fg_layer, x=640, y=705, scale=1.65, facing=1, is_shocked=True)
im = Image.alpha_composite(im, fg_layer)

# Vignette
vig = Image.new("RGBA", (W, H), (0, 0, 0, 0))
vdraw = ImageDraw.Draw(vig)
for s in range(30):
    a = int(140 * (1.0 - s / 30.0))
    vdraw.rectangle([s * 3, s * 3, W - s * 3, H - s * 3], outline=(0, 0, 0, a), width=3)
im = Image.alpha_composite(im, vig)

# Typography: "5 CLONES." (Top) & "WHO IS REAL?" (Subtitle Badge)
font_big = get_ariblk(130)
font_sub = get_ariblk(44)

text_main = "5 CLONES."
sub_text = "WHO IS REAL?"

text_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(text_layer)

bbox = font_big.getbbox(text_main)
tw = bbox[2] - bbox[0]
tx = 640 - tw // 2
ty = 35

# Drop Glow
glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gdraw = ImageDraw.Draw(glow_layer)
for r in range(16, 0, -2):
    a = int(95 * (1.0 - r / 16.0))
    gdraw.text((tx, ty), text_main, font=font_big, fill=(245, 158, 11, a), stroke_width=r, stroke_fill=(239, 68, 68, a))
im = Image.alpha_composite(im, glow_layer.filter(ImageFilter.GaussianBlur(8)))

# Draw Main Text
tdraw.text((tx, ty), text_main, font=font_big, fill=(255, 255, 255, 255), stroke_width=12, stroke_fill=(16, 12, 24, 255))

# Subtitle Badge: "WHO IS REAL?" placed cleanly below text at y=185
s_bbox = font_sub.getbbox(sub_text)
sw = s_bbox[2] - s_bbox[0]
sh = s_bbox[3] - s_bbox[1]
sx = 640 - sw // 2
sy = 185

tdraw.rounded_rectangle([sx - 26, sy - 8, sx + sw + 26, sy + sh + 12], radius=14, fill=(239, 68, 68, 245), outline=(255, 255, 255, 255), width=3)
tdraw.text((sx, sy), sub_text, font=font_sub, fill=(255, 255, 255, 255))

im = Image.alpha_composite(im, text_layer)

rgb_master = im.convert("RGB")
master_path = OUT_DIR / "thumbnail.jpg"
pub_master_path = PUB_DIR / "thumbnail.jpg"
brain_master = BRAIN / "thumb_five_clones.jpg"

rgb_master.save(master_path, quality=95)
rgb_master.save(pub_master_path, quality=95)
rgb_master.save(brain_master, quality=95)
print(f"Master 16:9 Thumbnail Updated: {master_path}")

# ==============================================================================
# RENDER 9:16 VERTICAL SHORT THUMBNAIL (1080x1920)
# ==============================================================================
SW, SH = 1080, 1920
sim = Image.open(bg_path).convert("RGBA").resize((SW, SH)) if bg_path.exists() else Image.new("RGBA", (SW, SH), (10, 14, 24, 255))
s_tint = Image.new("RGBA", (SW, SH), (6, 10, 20, 140))
sim = Image.alpha_composite(sim, s_tint)

s_clones = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
draw_pip_stickman(s_clones, x=220, y=1050, scale=1.5, facing=1, is_shocked=False)
draw_pip_stickman(s_clones, x=540, y=980, scale=1.75, facing=1, is_shocked=False)
draw_pip_stickman(s_clones, x=860, y=1050, scale=1.5, facing=-1, is_shocked=False)
draw_pip_stickman(s_clones, x=540, y=1420, scale=2.35, facing=1, is_shocked=True)
sim = Image.alpha_composite(sim, s_clones)

s_text = Image.new("RGBA", (SW, SH), (0, 0, 0, 0))
st_draw = ImageDraw.Draw(s_text)
font_s_big = get_ariblk(145)
font_s_sub = get_ariblk(60)

s_bbox = font_s_big.getbbox("5 CLONES!")
st_w = s_bbox[2] - s_bbox[0]
st_draw.text((540 - st_w // 2, 220), "5 CLONES!", font=font_s_big, fill=(245, 158, 11, 255), stroke_width=14, stroke_fill=(16, 12, 24, 255))

card_bbox = font_s_sub.getbbox("OPTION A OR B?")
cw = card_bbox[2] - card_bbox[0]
ch = card_bbox[3] - card_bbox[1]
cx = 540 - cw // 2
cy = 1620
st_draw.rounded_rectangle([cx - 30, cy - 14, cx + cw + 30, cy + ch + 18], radius=18, fill=(239, 68, 68, 240), outline=(255, 255, 255, 255), width=4)
st_draw.text((cx, cy), "OPTION A OR B?", font=font_s_sub, fill=(255, 255, 255, 255))

sim = Image.alpha_composite(sim, s_text)
short_path = OUT_DIR / "thumbnail_short.jpg"
pub_short_path = PUB_DIR / "thumbnail_short.jpg"
sim.convert("RGB").save(short_path, quality=95)
sim.convert("RGB").save(pub_short_path, quality=95)
print(f"Vertical 9:16 Thumbnail Updated: {short_path}")

import math
import os
import pathlib
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\million-button")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\million-button")
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

FONT_DIR = pathlib.Path(os.environ.get('WINDIR', 'C:\\Windows')) / 'Fonts'
font_path_ariblk = str(FONT_DIR / 'ariblk.ttf')

def get_ariblk(size):
    return ImageFont.truetype(font_path_ariblk, size)

# ==============================================================================
# RENDER 16:9 MASTER THUMBNAIL (1280x720) - "PRESS IT?"
# ==============================================================================
W, H = 1280, 720
im = Image.new("RGBA", (W, H), (14, 10, 22, 255))
draw = ImageDraw.Draw(im)

# A. Deep Dramatic Background
for y in range(H):
    ratio = y / float(H)
    r = int(18 + ratio * 15)
    g = int(10 + ratio * 10)
    b = int(24 + ratio * 16)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# B. Penthouse / Vault Room Atmosphere with Golden Cash Fog
bokeh_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bokeh_layer)
for _ in range(40):
    cx = random.randint(30, W - 40)
    cy = random.randint(150, H - 100)
    rad = random.randint(20, 65)
    bcol = random.choice([
        (34, 197, 94, random.randint(25, 75)),   # Emerald cash glow
        (239, 68, 68, random.randint(35, 95)),  # Crimson button hazard glow
        (245, 158, 11, random.randint(30, 80))  # Gold luxury aura
    ])
    bdraw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=bcol)

bokeh_blurred = bokeh_layer.filter(ImageFilter.GaussianBlur(22))
im = Image.alpha_composite(im, bokeh_blurred)

# C. Heavy Dark Wooden Table in the foreground
table_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
tdraw = ImageDraw.Draw(table_layer)
table_top = 460
tdraw.polygon([(0, table_top + 40), (W, table_top), (W, H), (0, H)], fill=(28, 20, 36, 255))
tdraw.line([(0, table_top + 40), (W, table_top)], fill=(65, 45, 80, 255), width=4)
im = Image.alpha_composite(im, table_layer)

# D. The Glowing Mystery Crimson Button Box in Center
box_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
b_draw = ImageDraw.Draw(box_layer)

bx, by = 470, 380
bw, bh = 240, 130

# Red Hazard Underglow on table
btn_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bg_draw = ImageDraw.Draw(btn_glow)
bg_draw.ellipse([bx - 40, by - 10, bx + bw + 40, by + bh + 60], fill=(239, 68, 68, 180))
btn_glow_blurred = btn_glow.filter(ImageFilter.GaussianBlur(16))
im = Image.alpha_composite(im, btn_glow_blurred)

# Box Base (Titanium/Black carbon)
b_draw.rounded_rectangle([bx, by + 40, bx + bw, by + bh + 40], radius=16, fill=(20, 16, 28, 255), outline=(12, 10, 18, 255), width=5)
# Golden plate on front: "+$1,000,000"
b_draw.rounded_rectangle([bx + 25, by + 75, bx + bw - 25, by + 120], radius=8, fill=(34, 197, 94, 255), outline=(12, 10, 18, 255), width=3)
font_cash = get_ariblk(26)
b_draw.text((bx + bw // 2, by + 97), "+$1,000,000", font=font_cash, fill=(255, 255, 255), anchor="mm")

# The Massive Red Button itself (Dome on top)
btn_cx, btn_cy = bx + bw // 2, by + 35
btn_rx, btn_ry = 65, 32
# Button base ring
b_draw.ellipse([btn_cx - btn_rx - 8, btn_cy - btn_ry - 4, btn_cx + btn_rx + 8, btn_cy + btn_ry + 14], fill=(70, 20, 30, 255), outline=(12, 10, 18, 255), width=4)
# Button top red dome
b_draw.ellipse([btn_cx - btn_rx, btn_cy - btn_ry - 18, btn_cx + btn_rx, btn_cy + btn_ry], fill=(239, 68, 68, 255), outline=(12, 10, 18, 255), width=5)
# Shiny glass reflection on button dome
b_draw.ellipse([btn_cx - 35, btn_cy - btn_ry - 12, btn_cx + 15, btn_cy - btn_ry + 2], fill=(255, 180, 180, 220))

# Warning Hazard Rays pulsing out from button
for ray_angle in [-60, -40, -20, 0, 20, 40, 60]:
    rad = math.radians(ray_angle - 90)
    rx1 = btn_cx + int(math.cos(rad) * 75)
    ry1 = btn_cy + int(math.sin(rad) * 45)
    rx2 = btn_cx + int(math.cos(rad) * 140)
    ry2 = btn_cy + int(math.sin(rad) * 90)
    b_draw.line([(rx1, ry1), (rx2, ry2)], fill=(239, 68, 68, 170), width=4)

im = Image.alpha_composite(im, box_layer)

# E. Floating Flying 3D Green Cash Dollars Swirling in the Air
cash_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(cash_layer)

def draw_tilted_dollar(cx, cy, w, h, angle, alpha=230):
    bill = Image.new("RGBA", (w + 20, h + 20), (0, 0, 0, 0))
    bdraw = ImageDraw.Draw(bill)
    ox, oy = 10, 10
    bdraw.rounded_rectangle([ox, oy, ox + w, oy + h], radius=6, fill=(34, 197, 94, alpha), outline=(12, 10, 18, 255), width=3)
    bdraw.ellipse([ox + w//2 - 12, oy + h//2 - 12, ox + w//2 + 12, oy + h//2 + 12], fill=(22, 101, 52, alpha))
    font_s = get_ariblk(18)
    bdraw.text((ox + w//2, oy + h//2), "$", font=font_s, fill=(255, 255, 255, alpha), anchor="mm")
    rot = bill.rotate(angle, resample=Image.BICUBIC, expand=True)
    cash_layer.alpha_composite(rot, (cx - rot.width//2, cy - rot.height//2))

random.seed(777)
for _ in range(14):
    dcx = random.randint(380, 780)
    dcy = random.randint(180, 450)
    draw_tilted_dollar(dcx, dcy, 70, 36, random.randint(-40, 40))

im = Image.alpha_composite(im, cash_layer)

# ==============================================================================
# F. PIP STICKMAN ON THE RIGHT (NERVOUS / TEMPTED / SWEATING HAND OVER BUTTON)
# ==============================================================================
stick_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(stick_layer)

head_cx, head_cy = 960, 340
head_r = 135

# Warm Golden/Peach Rim Light Behind Head (Crescent highlight on top-right)
rim_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rg_draw = ImageDraw.Draw(rim_glow)
rg_draw.ellipse([head_cx - head_r - 12, head_cy - head_r - 12, head_cx + head_r + 14, head_cy + head_r + 14], fill=(245, 158, 11, 230))
rim_glow_blurred = rim_glow.filter(ImageFilter.GaussianBlur(8))
im = Image.alpha_composite(im, rim_glow_blurred)

# Dark Head
sdraw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(24, 20, 34, 255))

# Mustard Hoodie
hoodie_col = (234, 154, 28, 255)
hoodie_shade = (194, 120, 16, 255)
outline_col = (14, 10, 20, 255)

body_left, body_right = 760, 1170
body_top = head_cy + 100

# Collar
sdraw.rounded_rectangle([head_cx - 105, head_cy + 85, head_cx + 105, head_cy + 180], radius=45, fill=hoodie_shade, outline=outline_col, width=6)
# Torso
sdraw.rounded_rectangle([body_left, body_top, body_right, H + 50], radius=55, fill=hoodie_col, outline=outline_col, width=7)
# Seams & Drawstrings
sdraw.line([(head_cx, body_top + 45), (head_cx, H)], fill=outline_col, width=5)
sdraw.rounded_rectangle([head_cx - 48, body_top + 30, head_cx - 38, body_top + 165], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rounded_rectangle([head_cx + 38, body_top + 30, head_cx + 48, body_top + 180], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rectangle([head_cx - 26, head_cy + 75, head_cx + 26, head_cy + 130], fill=(24, 20, 34, 255))

# Pip's Arm reaching out towards the Button!
arm_points = [
    (body_left + 40, body_top + 50),
    (740, 410),
    (670, 350) # Hand hovering right above the button!
]
sdraw.line(arm_points, fill=hoodie_col, width=32)
sdraw.line(arm_points, fill=outline_col, width=6)
# Stickman Black Hand / Finger pointing at button
sdraw.ellipse([640, 335, 685, 380], fill=(24, 20, 34, 255), outline=outline_col, width=4)

# Tempted / Nervous Expression (Intense look staring down at the button)
eye_y = head_cy - 8
# Left eye
sdraw.rounded_rectangle([head_cx - 95, eye_y - 20, head_cx - 50, eye_y + 20], radius=8, fill=(255, 255, 255, 255))
sdraw.rectangle([head_cx - 98, eye_y - 24, head_cx - 48, eye_y - 4], fill=(24, 20, 34, 255))
# Right eye
sdraw.rounded_rectangle([head_cx + 10, eye_y - 20, head_cx + 55, eye_y + 20], radius=8, fill=(255, 255, 255, 255))
sdraw.rectangle([head_cx + 8, eye_y - 24, head_cx + 58, eye_y - 4], fill=(24, 20, 34, 255))

# Nervous trembling flat / worried mouth dash
sdraw.rounded_rectangle([head_cx - 45, head_cy + 55, head_cx - 15, head_cy + 63], radius=4, fill=(255, 255, 255, 255))
sdraw.line([(head_cx - 45, head_cy + 59), (head_cx - 15, head_cy + 59)], fill=outline_col, width=2)

# Giant Sweat Drop
sw_x, sw_y = head_cx - 75, head_cy - 70
sdraw.polygon([(sw_x, sw_y - 18), (sw_x + 12, sw_y + 10), (sw_x - 12, sw_y + 10)], fill=(96, 165, 250, 240))
sdraw.ellipse([sw_x - 12, sw_y - 2, sw_x + 12, sw_y + 18], fill=(96, 165, 250, 240))

im = Image.alpha_composite(im, stick_layer)

# ==============================================================================
# G. THE 2-WORD CLICKBAIT TEXT: "PRESS" (White) & "IT?" (Golden Yellow)
# ==============================================================================
font_big = get_ariblk(150)

def render_angled_word(word, font, fill_col, angle=-3.2):
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
    for shadow_y in range(12, 24):
        wdraw.text((ox, oy + shadow_y), word, font=font, fill=(0, 0, 0, 255))
        
    # Main Solid Fill
    wdraw.text((ox, oy), word, font=font, fill=fill_col)
    
    return word_img.rotate(-angle, resample=Image.BICUBIC, expand=True)

press_img = render_angled_word("PRESS", font_big, (255, 255, 255, 255), angle=-3.2)
it_img = render_angled_word("IT?", font_big, (253, 224, 71, 255), angle=-3.2)

im.alpha_composite(press_img, (55, 75))
im.alpha_composite(it_img, (55, 240))

# ==============================================================================
# H. SAVE OUTPUTS
# ==============================================================================
thumb_16_9 = im.convert("RGB")
out_path_16_9 = OUT_DIR / "thumbnail.jpg"
thumb_16_9.save(out_path_16_9, "JPEG", quality=95)
thumb_16_9.save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
thumb_16_9.save(BRAIN / "thumb_million_button.jpg", "JPEG", quality=95)

# Render Vertical 9:16 Short Thumbnail
im_vert = Image.new("RGBA", (1080, 1920), (14, 10, 22, 255))
scale_factor = 1.95
scaled_bg = im.resize((int(W * scale_factor), int(H * scale_factor)), Image.Resampling.LANCZOS)
im_vert.paste(scaled_bg, ((1080 - scaled_bg.width) // 2 + 100, (1920 - scaled_bg.height) // 2))
thumb_vert = im_vert.convert("RGB")
out_path_vert = OUT_DIR / "thumbnail_short.jpg"
thumb_vert.save(out_path_vert, "JPEG", quality=95)
thumb_vert.save(PUB_DIR / "thumbnail_short.jpg", "JPEG", quality=95)

print("SUCCESS: Million-button thumbnails rendered successfully!")

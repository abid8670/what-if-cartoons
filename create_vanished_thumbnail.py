import math
import os
import pathlib
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\vanished")
PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\vanished")
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

FONT_DIR = pathlib.Path(os.environ.get('WINDIR', 'C:\\Windows')) / 'Fonts'
font_path_ariblk = str(FONT_DIR / 'ariblk.ttf')

def get_ariblk(size):
    return ImageFont.truetype(font_path_ariblk, size)

# ==============================================================================
# RENDER 16:9 MASTER THUMBNAIL (1280x720) - "ALL GONE."
# ==============================================================================
W, H = 1280, 720
im = Image.new("RGBA", (W, H), (10, 8, 20, 255))
draw = ImageDraw.Draw(im)

# A. Deep Eerie Night Sky
for y in range(H):
    ratio = y / float(H)
    r = int(10 + ratio * 14)
    g = int(8 + ratio * 12)
    b = int(22 + ratio * 24)
    draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

# B. Deserted City Skyline (Completely Darkened - No Power)
random.seed(999)
city_overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
cdraw = ImageDraw.Draw(city_overlay)

bx = 0
while bx < W:
    bw = random.randint(50, 110)
    bh = random.randint(200, 420)
    # Dark dead silhouettes of skyscrapers
    cdraw.rectangle([bx, H - bh, bx + bw, H], fill=(14, 12, 26, 240))
    # Broken radio antenna red beacons
    if random.random() < 0.3:
        cdraw.ellipse([bx + bw//2 - 3, H - bh - 6, bx + bw//2 + 3, H - bh], fill=(239, 68, 68, 180))
    bx += bw + random.randint(8, 18)

city_blurred = city_overlay.filter(ImageFilter.GaussianBlur(3))
im = Image.alpha_composite(im, city_blurred)

# C. Cold Moonlight Fog & Ghostly Bokeh
bokeh_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
bdraw = ImageDraw.Draw(bokeh_layer)
for _ in range(35):
    cx = random.randint(30, W - 50)
    cy = random.randint(220, H - 120)
    rad = random.randint(25, 75)
    bcol = random.choice([
        (56, 189, 248, random.randint(20, 60)),  # Cold cyan fog
        (168, 85, 247, random.randint(15, 45)),  # Deep purple aura
        (239, 68, 68, random.randint(20, 50))    # Faint red danger
    ])
    bdraw.ellipse([cx - rad, cy - rad, cx + rad, cy + rad], fill=bcol)

bokeh_blurred = bokeh_layer.filter(ImageFilter.GaussianBlur(24))
im = Image.alpha_composite(im, bokeh_blurred)

# D. The Mysterious Locked Door in the Center-Left (With Light Leaking Underneath)
door_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
ddraw = ImageDraw.Draw(door_layer)

dx, dy = 500, 200
dw, dh = 240, 430

# Golden/Eerie light radiating from under the door onto the ground
floor_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
fg_draw = ImageDraw.Draw(floor_glow)
fg_draw.polygon([
    (dx + 25, dy + dh - 10),
    (dx + dw - 25, dy + dh - 10),
    (dx + dw + 220, H),
    (dx - 220, H)
], fill=(253, 224, 71, 160))
floor_glow_blurred = floor_glow.filter(ImageFilter.GaussianBlur(18))
im = Image.alpha_composite(im, floor_glow_blurred)

# Heavy Locked Reinforced Wooden/Metal Door
ddraw.rounded_rectangle([dx, dy, dx + dw, dy + dh], radius=16, fill=(28, 24, 38, 255), outline=(12, 10, 18, 255), width=7)
# Door Panels
ddraw.rounded_rectangle([dx + 22, dy + 30, dx + dw - 22, dy + 180], radius=10, fill=(38, 32, 52, 255), outline=(12, 10, 18, 255), width=5)
ddraw.rounded_rectangle([dx + 22, dy + 210, dx + dw - 22, dy + dh - 35], radius=10, fill=(38, 32, 52, 255), outline=(12, 10, 18, 255), width=5)
# Frosted top window with dark silhouette hand pressing against glass!
ddraw.rounded_rectangle([dx + 35, dy + 45, dx + dw - 35, dy + 165], radius=8, fill=(80, 70, 100, 255))
# Dark shadow hand/figure outline behind the frosted glass
ddraw.ellipse([dx + dw//2 - 25, dy + 80, dx + dw//2 + 25, dy + 140], fill=(20, 16, 28, 220))
# Door handle & heavy padlock
ddraw.ellipse([dx + dw - 42, dy + dh//2 - 12, dx + dw - 18, dy + dh//2 + 12], fill=(234, 179, 70, 255), outline=(12, 10, 18, 255), width=3)

# Soundwave Knock Rings radiating from the door: *KNOCK... KNOCK...*
for r_off in [40, 85, 135, 190]:
    ddraw.arc([dx + dw//2 - r_off, dy + dh//2 - r_off, dx + dw//2 + r_off, dy + dh//2 + r_off], start=210, end=330, fill=(255, 255, 255, int(210 - r_off*1.0)), width=4)

# "KNOCK KNOCK" Sound Text floating above door
font_knock = get_ariblk(42)
ddraw.text((dx + dw//2, dy - 28), "*KNOCK...*", font=font_knock, fill=(255, 70, 70), anchor="mm")

im = Image.alpha_composite(im, door_layer)

# ==============================================================================
# E. PIP STICKMAN ON THE RIGHT (SHOCKED / HORRIFIED AT THE DOOR)
# ==============================================================================
stick_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sdraw = ImageDraw.Draw(stick_layer)

head_cx, head_cy = 960, 360
head_r = 140

# Warm Golden/Peach Rim Light Behind Head (Crescent highlight on top-right)
rim_glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
rg_draw = ImageDraw.Draw(rim_glow)
rg_draw.ellipse([head_cx - head_r - 14, head_cy - head_r - 14, head_cx + head_r + 16, head_cy + head_r + 16], fill=(245, 158, 11, 230))
rim_glow_blurred = rim_glow.filter(ImageFilter.GaussianBlur(9))
im = Image.alpha_composite(im, rim_glow_blurred)

# Pip's Dark Round Head
sdraw.ellipse([head_cx - head_r, head_cy - head_r, head_cx + head_r, head_cy + head_r], fill=(24, 20, 34, 255))

# Mustard Yellow Hoodie
hoodie_col = (234, 154, 28, 255)
hoodie_shade = (194, 120, 16, 255)
outline_col = (14, 10, 20, 255)

body_left, body_right = 750, 1170
body_top = head_cy + 100

# Collar
sdraw.rounded_rectangle([head_cx - 110, head_cy + 85, head_cx + 110, head_cy + 180], radius=45, fill=hoodie_shade, outline=outline_col, width=6)
# Torso
sdraw.rounded_rectangle([body_left, body_top, body_right, H + 50], radius=55, fill=hoodie_col, outline=outline_col, width=7)
# Pocket & seam
sdraw.line([(head_cx, body_top + 45), (head_cx, H)], fill=outline_col, width=5)
# Drawstrings
sdraw.rounded_rectangle([head_cx - 50, body_top + 30, head_cx - 40, body_top + 165], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
sdraw.rounded_rectangle([head_cx + 35, body_top + 30, head_cx + 45, body_top + 180], radius=5, fill=(255, 255, 255, 255), outline=outline_col, width=2)
# Neck
sdraw.rectangle([head_cx - 26, head_cy + 75, head_cx + 26, head_cy + 130], fill=(24, 20, 34, 255))

# Shocked/Terrified Face (Eyes wide open with pupils shrunk, staring at the door)
eye_y = head_cy - 10
# Left Eye
sdraw.ellipse([head_cx - 95, eye_y - 28, head_cx - 45, eye_y + 28], fill=(255, 255, 255, 255))
sdraw.ellipse([head_cx - 88, eye_y - 12, head_cx - 62, eye_y + 12], fill=(24, 20, 34, 255)) # Pupil staring left at door
# Right Eye
sdraw.ellipse([head_cx + 5, eye_y - 28, head_cx + 55, eye_y + 28], fill=(255, 255, 255, 255))
sdraw.ellipse([head_cx + 12, eye_y - 12, head_cx + 38, eye_y + 12], fill=(24, 20, 34, 255))

# Trembling wavy frown / shocked gasp mouth
sdraw.ellipse([head_cx - 30, head_cy + 52, head_cx - 10, head_cy + 74], fill=(255, 255, 255, 255), outline=outline_col, width=3)
sdraw.ellipse([head_cx - 27, head_cy + 55, head_cx - 13, head_cy + 71], fill=(24, 20, 34, 255)) # Dark hollow mouth gasp

# Giant Sweat Drop on forehead
sw_x, sw_y = head_cx - 75, head_cy - 75
sdraw.polygon([(sw_x, sw_y - 18), (sw_x + 12, sw_y + 10), (sw_x - 12, sw_y + 10)], fill=(96, 165, 250, 240))
sdraw.ellipse([sw_x - 12, sw_y - 2, sw_x + 12, sw_y + 18], fill=(96, 165, 250, 240))

im = Image.alpha_composite(im, stick_layer)

# ==============================================================================
# F. THE 2-WORD CLICKBAIT TEXT: "ALL" (White) & "GONE." (Golden Yellow)
# ==============================================================================
font_big = get_ariblk(155)

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

all_img = render_angled_word("ALL", font_big, (255, 255, 255, 255), angle=-3.2)
gone_img = render_angled_word("GONE.", font_big, (253, 224, 71, 255), angle=-3.2)

im.alpha_composite(all_img, (55, 75))
im.alpha_composite(gone_img, (55, 240))

# ==============================================================================
# G. SAVE OUTPUTS
# ==============================================================================
thumb_16_9 = im.convert("RGB")
out_path_16_9 = OUT_DIR / "thumbnail.jpg"
thumb_16_9.save(out_path_16_9, "JPEG", quality=95)
thumb_16_9.save(PUB_DIR / "thumbnail.jpg", "JPEG", quality=95)
thumb_16_9.save(BRAIN / "thumb_vanished.jpg", "JPEG", quality=95)

# Render Vertical 9:16 Short Thumbnail
im_vert = Image.new("RGBA", (1080, 1920), (10, 8, 20, 255))
scale_factor = 1.95
scaled_bg = im.resize((int(W * scale_factor), int(H * scale_factor)), Image.Resampling.LANCZOS)
im_vert.paste(scaled_bg, ((1080 - scaled_bg.width) // 2 + 100, (1920 - scaled_bg.height) // 2))
thumb_vert = im_vert.convert("RGB")
out_path_vert = OUT_DIR / "thumbnail_short.jpg"
thumb_vert.save(out_path_vert, "JPEG", quality=95)
thumb_vert.save(PUB_DIR / "thumbnail_short.jpg", "JPEG", quality=95)

print("SUCCESS: Vanished thumbnails rendered successfully!")

import math, os, pathlib, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

sys.stdout.reconfigure(encoding='utf-8')

IMPACT_FONT = r"C:\Windows\Fonts\impact.ttf"
ARIAL_BLACK = r"C:\Windows\Fonts\ariblk.ttf"

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\ancient-pleasure")
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\ancient-pleasure")
PUB_DIR.mkdir(parents=True, exist_ok=True)
OUT_DIR.mkdir(parents=True, exist_ok=True)

def draw_text_clean(draw, text, font, pos, text_color, outline_color, stroke_w=18, shadow_offset=(8, 12)):
    x, y = pos
    if shadow_offset:
        sx, sy = x + shadow_offset[0], y + shadow_offset[1]
        draw.text((sx, sy), text, font=font, fill=(0, 0, 0, 240), stroke_width=stroke_w, stroke_fill=(0, 0, 0, 240))
    draw.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_w, stroke_fill=outline_color)

def draw_heart(draw, cx, cy, size, color=(255, 60, 100, 255), outline=(180, 20, 60, 255), rot=0):
    # Vector heart
    points = []
    for deg in range(0, 360, 5):
        rad = math.radians(deg)
        # Heart formula
        hx = 16 * (math.sin(rad) ** 3)
        hy = -(13 * math.cos(rad) - 5 * math.cos(2*rad) - 2 * math.cos(3*rad) - math.cos(4*rad))
        
        # Scale and rotate
        r_rad = math.radians(rot)
        rx = hx * math.cos(r_rad) - hy * math.sin(r_rad)
        ry = hx * math.sin(r_rad) + hy * math.cos(r_rad)
        points.append((cx + rx * (size / 16.0), cy + ry * (size / 16.0)))
    draw.polygon(points, fill=color, outline=outline)

def draw_star(draw, cx, cy, r_out, r_in, color=(255, 230, 0, 255), outline=(180, 140, 0, 255)):
    pts = []
    for i in range(10):
        angle = i * math.pi / 5 - math.pi / 2
        r = r_out if i % 2 == 0 else r_in
        pts.append((cx + r * math.cos(angle), cy + r * math.sin(angle)))
    draw.polygon(pts, fill=color, outline=outline)

def render_artwork_16x9():
    W, H = 1920, 1080
    img = Image.new("RGBA", (W, H), (135, 206, 235, 255))
    draw = ImageDraw.Draw(img)
    
    # Sky Gradient
    for y in range(540):
        t = y / 540.0
        r = int(120 + 80 * t)
        g = int(190 + 50 * t)
        b = int(245 + 10 * t)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
        
    # Fluffy Clouds
    for cx, cy, rw, rh in [(300, 220, 140, 50), (380, 210, 160, 60), (1450, 180, 180, 65), (1560, 200, 140, 55)]:
        draw.ellipse([cx-rw, cy-rh, cx+rw, cy+rh], fill=(255, 255, 255, 220))
        
    # Distant Mountains (Slate Blue)
    pts_mountains = [
        (0, 480), (250, 360), (450, 420), (700, 310), (950, 440),
        (1200, 340), (1450, 420), (1700, 330), (W, 460), (W, 580), (0, 580)
    ]
    draw.polygon(pts_mountains, fill=(110, 145, 185, 255), outline=(90, 120, 160, 255))
    # Green Hills Midground
    draw.ellipse([-100, 430, 900, 720], fill=(76, 175, 80, 255), outline=(56, 142, 60, 255), width=3)
    draw.ellipse([700, 420, 2020, 700], fill=(90, 185, 90, 255), outline=(56, 142, 60, 255), width=3)
    
    # Blue Winding River
    pts_river = [
        (400, 490), (600, 485), (850, 500), (900, 540),
        (650, 535), (420, 520)
    ]
    draw.polygon(pts_river, fill=(66, 165, 245, 255), outline=(30, 136, 229, 255))
    
    # Ground Foreground (Warm Earth / Sand)
    draw.rectangle([0, 520, W, H], fill=(234, 182, 118, 255))
    # Textured ground patches
    for gx, gy, gr in [(200, 600, 80), (600, 750, 120), (1100, 650, 90), (1500, 800, 130), (350, 950, 150)]:
        draw.ellipse([gx-gr, gy-gr*0.4, gx+gr, gy+gr*0.4], fill=(218, 165, 95, 255))
        
    # Grass tufts
    for tx, ty in [(150, 550), (280, 680), (800, 620), (1200, 570), (1650, 720), (400, 850), (950, 920)]:
        draw.line([tx, ty, tx-12, ty-25], fill=(76, 175, 80), width=4)
        draw.line([tx, ty, tx, ty-32], fill=(67, 160, 71), width=5)
        draw.line([tx, ty, tx+14, ty-22], fill=(76, 175, 80), width=4)
        
    # Prehistoric Hut (Left Background: x=180 to 450, y=380 to 530)
    hut_wood = [
        (220, 530), (300, 380), (320, 380), (400, 530)
    ]
    draw.polygon(hut_wood, fill=(160, 110, 60), outline=(90, 50, 20), width=4)
    # Straw roof thatch
    for i in range(7):
        th_y = 390 + i * 20
        th_w = 60 + i * 24
        draw.polygon([(310 - th_w, th_y + 18), (310, th_y - 10), (310 + th_w, th_y + 18)],
                     fill=(210, 170, 90), outline=(130, 90, 40), width=2)
    # Hut entrance door (dark)
    draw.polygon([(290, 530), (310, 450), (330, 530)], fill=(40, 25, 15))
    
    # Campfire (Left Foreground: x=240, y=750)
    # Stone ring around campfire
    for angle in range(0, 360, 40):
        rad = math.radians(angle)
        sx = 250 + int(90 * math.cos(rad))
        sy = 780 + int(45 * math.sin(rad))
        draw.ellipse([sx-24, sy-16, sx+24, sy+16], fill=(130, 130, 135), outline=(70, 70, 75), width=3)
    # Wood logs
    draw.line([190, 790, 310, 755], fill=(101, 67, 33), width=16)
    draw.line([195, 755, 305, 790], fill=(85, 55, 25), width=16)
    # Glowing fire flames
    flames = [
        [(250, 630), (280, 710), (260, 760), (230, 750), (215, 710)],
        [(245, 650), (270, 710), (255, 750), (235, 745), (225, 705)],
        [(248, 680), (262, 725), (252, 750), (240, 745), (235, 720)]
    ]
    draw.polygon(flames[0], fill=(255, 87, 34, 255), outline=(220, 50, 10), width=3)  # Red-Orange
    draw.polygon(flames[1], fill=(255, 179, 0, 255))  # Amber
    draw.polygon(flames[2], fill=(255, 235, 59, 255))  # Bright Yellow core
    # Spark embers
    for ex, ey in [(230, 610), (265, 590), (240, 570), (280, 620)]:
        draw.ellipse([ex-4, ey-4, ex+4, ey+4], fill=(255, 215, 0))

    # Big prehistoric boulder on Right (Caveman leans on this): x=1400 to 1920, y=360 to 950
    draw.polygon([
        (1400, 950), (1350, 650), (1450, 420), (1620, 350),
        (1850, 390), (W, 480), (W, 950)
    ], fill=(175, 175, 180), outline=(100, 100, 105), width=6)
    # Boulder cracks & highlights
    draw.line([1450, 480, 1490, 570], fill=(120, 120, 125), width=4)
    draw.line([1490, 570, 1460, 680], fill=(120, 120, 125), width=4)
    draw.line([1600, 430, 1570, 530], fill=(120, 120, 125), width=3)
    
    # ------------------ CAVEWOMAN (LEFT/CENTER) ------------------
    # Kneeling at (820, 720) facing right towards caveman
    # Fur Boot
    draw.ellipse([540, 720, 680, 820], fill=(220, 180, 130), outline=(60, 30, 10), width=5)
    draw.ellipse([560, 700, 690, 750], fill=(250, 245, 235), outline=(80, 50, 20), width=4) # Fluffy white cuff
    # Bare foot
    draw.ellipse([910, 740, 980, 800], fill=(255, 230, 215), outline=(70, 40, 20), width=4)
    for ti in range(4):
        draw.ellipse([965 + ti*7, 765 + ti*4, 976 + ti*7, 785 + ti*4], fill=(255, 230, 215), outline=(70, 40, 20), width=2)
    # Thighs & Knees (Kneeling posture)
    draw.polygon([(650, 600), (840, 690), (870, 730), (790, 760), (600, 660)],
                 fill=(255, 230, 215), outline=(60, 30, 10), width=5)
    # Leopard / Fur Dress
    dress_pts = [
        (850, 470), (940, 520), (960, 650), (880, 700), (740, 640), (760, 510)
    ]
    draw.polygon(dress_pts, fill=(185, 115, 50), outline=(60, 30, 10), width=5)
    # Jagged dress hem
    for ji in range(5):
        jx = 750 + ji * 40
        draw.polygon([(jx, 650), (jx + 20, 685), (jx + 40, 650)], fill=(185, 115, 50), outline=(60, 30, 10), width=3)
    # Animal spots on dress
    for spx, spy in [(800, 540), (840, 580), (890, 550), (820, 620), (910, 620), (870, 650)]:
        draw.ellipse([spx, spy, spx+18, spy+14], fill=(70, 35, 10))
    # Fur shoulder strap
    draw.line([840, 460, 860, 510], fill=(230, 215, 190), width=14)
    
    # Left Arm reaching towards caveman
    draw.line([870, 510, 980, 620], fill=(255, 230, 215), width=24)
    draw.line([980, 620, 1070, 660], fill=(255, 230, 215), width=20)
    # Hand reaching/tickling caveman
    draw.ellipse([1060, 645, 1095, 675], fill=(255, 230, 215), outline=(60, 30, 10), width=3)
    
    # Hair (Flowing Brunette Waves)
    draw.ellipse([730, 240, 930, 480], fill=(95, 50, 25), outline=(40, 20, 10), width=5)
    draw.ellipse([700, 330, 870, 540], fill=(95, 50, 25), outline=(40, 20, 10), width=5)
    # Prehistoric Bone hairpin in hair
    draw.polygon([(820, 270), (940, 340), (925, 360), (805, 290)], fill=(245, 240, 230), outline=(60, 40, 20), width=3)
    draw.ellipse([795, 265, 830, 300], fill=(245, 240, 230), outline=(60, 40, 20), width=3)
    draw.ellipse([925, 330, 960, 365], fill=(245, 240, 230), outline=(60, 40, 20), width=3)

    # Cavewoman Face
    # Jaw / Head
    draw.ellipse([820, 300, 970, 440], fill=(255, 235, 225), outline=(60, 30, 10), width=5)
    # Cheek Blush (Bright Pink / Red)
    draw.ellipse([850, 360, 915, 405], fill=(255, 80, 120, 200))
    draw.ellipse([915, 355, 965, 395], fill=(255, 80, 120, 200))
    # Seductive Smiling Eyes (Curved happy lashes)
    draw.arc([855, 325, 895, 355], start=190, end=350, fill=(30, 15, 5), width=6)
    draw.arc([910, 320, 950, 350], start=190, end=350, fill=(30, 15, 5), width=6)
    # Eyelashes
    draw.line([855, 335, 845, 325], fill=(30, 15, 5), width=4)
    draw.line([895, 330, 905, 320], fill=(30, 15, 5), width=4)
    # Arched Eyebrows
    draw.arc([850, 305, 895, 325], start=200, end=340, fill=(60, 30, 15), width=5)
    draw.arc([908, 300, 952, 320], start=200, end=340, fill=(60, 30, 15), width=5)
    # Playful Open Mouth with Tongue out
    draw.chord([875, 380, 940, 425], start=0, end=180, fill=(180, 30, 40), outline=(60, 20, 10), width=4)
    # Tongue licking out
    draw.ellipse([895, 405, 935, 445], fill=(255, 105, 140), outline=(150, 30, 50), width=3)
    # Drool glint on tongue
    draw.ellipse([910, 430, 918, 442], fill=(255, 255, 255))
    
    # Bone necklace around neck
    for nxi in range(4):
        draw.ellipse([870 + nxi*14, 445 + nxi*4, 882 + nxi*14, 465 + nxi*4], fill=(245, 240, 230), outline=(60, 30, 10), width=2)

    # ------------------ FLOATING HEARTS & SCENT TRAILS ------------------
    # Hearts floating from cavewoman towards caveman
    draw_heart(draw, 960, 240, 32, color=(255, 64, 129, 240), outline=(180, 20, 80, 255), rot=-15)
    draw_heart(draw, 1050, 280, 42, color=(255, 40, 80, 250), outline=(180, 10, 50, 255), rot=12)
    draw_heart(draw, 1140, 220, 30, color=(255, 80, 140, 240), outline=(180, 20, 80, 255), rot=-25)
    draw_heart(draw, 890, 200, 24, color=(255, 100, 150, 230), outline=(180, 30, 90, 255), rot=20)
    # Floating aroma curly lines
    for ax, ay in [(920, 270), (1010, 310), (1080, 250)]:
        draw.arc([ax-20, ay-30, ax+20, ay+30], start=270, end=90, fill=(255, 255, 255, 180), width=4)

    # ------------------ CAVEMAN (RIGHT / LEANING ON BOULDER) ------------------
    # Caveman Stickman leaning on boulder: Head at (1370, 430)
    # Stick figure body
    draw.line([1370, 500, 1340, 700], fill=(20, 20, 25), width=14)
    # Ragged brown tunic
    tunic_pts = [
        (1310, 520), (1430, 530), (1400, 720), (1280, 710)
    ]
    draw.polygon(tunic_pts, fill=(139, 90, 43), outline=(50, 25, 10), width=5)
    # Rope belt
    draw.line([1290, 640, 1410, 650], fill=(220, 190, 130), width=8)
    # Stick legs stretched out on ground
    draw.line([1310, 700, 1220, 780], fill=(20, 20, 25), width=12)
    draw.line([1220, 780, 1160, 795], fill=(20, 20, 25), width=12)
    # Bare feet
    draw.ellipse([1135, 780, 1175, 815], fill=(255, 230, 215), outline=(50, 25, 10), width=3)
    
    # Left Arm holding the Ancient Clay Booze Jug
    draw.line([1340, 550, 1230, 590], fill=(20, 20, 25), width=12)
    # Ancient Clay Jug / Amphora (x=1170, y=550)
    jug_pts = [
        (1170, 550), (1210, 550), (1230, 600), (1220, 650), (1160, 650), (1150, 600)
    ]
    draw.polygon(jug_pts, fill=(195, 105, 55), outline=(60, 25, 10), width=5)
    # Jug handle
    draw.arc([1135, 565, 1165, 630], start=90, end=270, fill=(60, 25, 10), width=6)
    # Frothy booze foam dripping from mouth of jug
    draw.ellipse([1175, 540, 1205, 560], fill=(255, 250, 210), outline=(160, 110, 30), width=3)
    # Right Arm resting back on boulder
    draw.line([1390, 550, 1470, 620], fill=(20, 20, 25), width=12)
    draw.ellipse([1460, 615, 1490, 645], fill=(255, 255, 255), outline=(20, 20, 25), width=3)
    
    # Caveman Stickman Head (Round white cartoon head)
    draw.ellipse([1300, 340, 1460, 500], fill=(255, 255, 255), outline=(20, 20, 25), width=8)
    # Band-aid on head (X shape)
    draw.line([1390, 365, 1420, 395], fill=(230, 180, 120), width=8)
    draw.line([1420, 365, 1390, 395], fill=(230, 180, 120), width=8)
    # Blushing Red Face (Super drunk / seduced blush!)
    draw.ellipse([1315, 410, 1375, 465], fill=(244, 67, 54, 180))
    draw.ellipse([1385, 410, 1445, 465], fill=(244, 67, 54, 180))
    # Forehead sweat / blush overlay
    draw.ellipse([1330, 375, 1430, 420], fill=(255, 100, 100, 110))

    # Dizzy Spiral / Bloodshot Tired Eyes
    # Left eye
    draw.ellipse([1330, 415, 1370, 450], fill=(255, 245, 245), outline=(180, 30, 30), width=4)
    draw.arc([1335, 420, 1365, 445], start=0, end=300, fill=(180, 30, 30), width=3)
    draw.line([1325, 415, 1375, 420], fill=(20, 20, 25), width=6) # heavy sleepy eyelid
    # Right eye
    draw.ellipse([1390, 415, 1430, 450], fill=(255, 245, 245), outline=(180, 30, 30), width=4)
    draw.arc([1395, 420, 1425, 445], start=60, end=360, fill=(180, 30, 30), width=3)
    draw.line([1385, 415, 1435, 420], fill=(20, 20, 25), width=6) # heavy sleepy eyelid
    
    # Drooling Dazed Mouth
    draw.ellipse([1355, 460, 1410, 485], fill=(180, 30, 30), outline=(20, 20, 25), width=4)
    # Drool drip hanging down from lip!
    draw.ellipse([1390, 475, 1406, 520], fill=(100, 200, 255, 240), outline=(40, 120, 200), width=2)
    draw.ellipse([1393, 515, 1403, 528], fill=(100, 200, 255, 240)) # droplet

    # Dizzy Stars & Swirls circling Caveman's head
    draw_star(draw, 1430, 320, 20, 8, color=(255, 235, 59), outline=(200, 150, 0))
    draw_star(draw, 1470, 350, 16, 7, color=(255, 215, 0), outline=(200, 150, 0))
    draw_star(draw, 1290, 330, 18, 7, color=(255, 235, 59), outline=(200, 150, 0))
    # Dizziness curly ring
    draw.arc([1310, 300, 1450, 350], start=200, end=350, fill=(255, 215, 0), width=4)
    draw.arc([1330, 285, 1430, 330], start=20, end=190, fill=(255, 215, 0), width=3)

    # ------------------ TOP VIGNETTE FOR TEXT CONTRAST ------------------
    vignette = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    v_draw = ImageDraw.Draw(vignette)
    for y in range(300):
        alpha = int(190 * (1.0 - (y / 300.0) ** 1.3))
        v_draw.line([(0, y), (W, y)], fill=(10, 15, 30, alpha))
    img = Image.alpha_composite(img, vignette)
    
    # ------------------ BOLD IMPACT TEXT: "ANCIENT PLEASURE" ------------------
    draw = ImageDraw.Draw(img)
    font_main = ImageFont.truetype(IMPACT_FONT, 160)
    
    text = "ANCIENT PLEASURE"
    bbox = draw.textbbox((0, 0), text, font=font_main, stroke_width=20)
    tw = bbox[2] - bbox[0]
    tx = (W - tw) // 2
    
    draw_text_clean(
        draw, text, font_main, (tx, 55),
        text_color=(255, 235, 0),   # Vibrant Think-Beyond Yellow
        outline_color=(0, 0, 0),     # Thick Black Outline
        stroke_w=20,
        shadow_offset=(10, 14)
    )
    
    return img

def render_artwork_9x16():
    W, H = 1080, 1920
    # Create from 16:9 base by scaling and cropping/re-centering
    base = render_artwork_16x9()
    # High-res vertical composite
    img = Image.new("RGBA", (W, H), (15, 23, 42, 255))
    
    # Background blurred ambiance
    bg = base.resize((W, int(W * 1080 / 1920)))
    bg_tall = base.resize((int(H * 1920 / 1080), H)).crop(((int(H * 1920 / 1080) - W)//2, 0, (int(H * 1920 / 1080) + W)//2, H))
    bg_blur = bg_tall.filter(ImageFilter.GaussianBlur(35))
    img.paste(bg_blur, (0, 0))
    
    # Darken overlay
    dark = Image.new("RGBA", (W, H), (0, 0, 0, 90))
    img = Image.alpha_composite(img, dark)
    
    # Foreground sharp card in middle
    card_w = 1040
    card_h = int(card_w * 1080 / 1920)
    card = base.resize((card_w, card_h), Image.Resampling.LANCZOS)
    card_y = (H - card_h) // 2 - 40
    card_x = (W - card_w) // 2
    img.paste(card, (card_x, card_y))
    
    draw = ImageDraw.Draw(img)
    # Border around card
    draw.rectangle([card_x-6, card_y-6, card_x+card_w+6, card_y+card_h+6], outline=(255, 215, 0), width=6)
    
    # Top Text: ANCIENT PLEASURE
    font_v = ImageFont.truetype(IMPACT_FONT, 108)
    text = "ANCIENT PLEASURE"
    bbox = draw.textbbox((0, 0), text, font=font_v, stroke_width=16)
    tw = bbox[2] - bbox[0]
    draw_text_clean(draw, text, font_v, ((W - tw)//2, 230), text_color=(255, 235, 0), outline_color=(0,0,0), stroke_w=16)
    
    # Bottom Hook: STONE AGE SECRETS! 😱
    font_bot = ImageFont.truetype(IMPACT_FONT, 82)
    btext = "WHAT THEY DID! 🏺"
    bbox_b = draw.textbbox((0, 0), btext, font=font_bot, stroke_width=14)
    btw = bbox_b[2] - bbox_b[0]
    draw_text_clean(draw, btext, font_bot, ((W - btw)//2, 1530), text_color=(255, 255, 255), outline_color=(0,0,0), stroke_w=14)
    
    return img

if __name__ == "__main__":
    print("Generating Think Beyond Style Thumbnails for 'ANCIENT PLEASURE'...")
    h_img = render_artwork_16x9()
    v_img = render_artwork_9x16()
    
    # Save to public and out dirs
    for d in [PUB_DIR, OUT_DIR]:
        h_img.save(d / "thumbnail.png", "PNG")
        h_img.save(d / "thumbnail_art.png", "PNG")
        h_img.convert("RGB").save(d / "thumbnail.jpg", "JPEG", quality=95)
        
        v_img.save(d / "thumbnail_short.png", "PNG")
        v_img.save(d / "thumbnail_short_art.png", "PNG")
        v_img.convert("RGB").save(d / "thumbnail_short.jpg", "JPEG", quality=95)
        
    print(f"SUCCESS: Saved thumbnails to {PUB_DIR} and {OUT_DIR}")


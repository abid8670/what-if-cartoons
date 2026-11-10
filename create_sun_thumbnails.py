import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

sys.stdout.reconfigure(encoding='utf-8')

IMPACT_FONT = r"C:\Windows\Fonts\impact.ttf"
ARIAL_BLACK = r"C:\Windows\Fonts\ariblk.ttf"

def draw_text_clean(draw, text, font, pos, text_color, outline_color, stroke_w=14, shadow_offset=(8, 10)):
    x, y = pos
    if shadow_offset:
        sx, sy = x + shadow_offset[0], y + shadow_offset[1]
        draw.text((sx, sy), text, font=font, fill=(0, 0, 0, 240), stroke_width=stroke_w, stroke_fill=(0, 0, 0, 240))
    draw.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_w, stroke_fill=outline_color)

def create_horizontal_thumbnail(base_path, out_path):
    print(f"Creating Horizontal 16:9 Thumbnail from {base_path}...")
    base = Image.open(base_path).convert("RGBA")
    w, h = base.size
    
    # Enhance contrast & color
    enhancer = ImageEnhance.Contrast(base)
    base = enhancer.enhance(1.25)
    color_enhancer = ImageEnhance.Color(base)
    base = color_enhancer.enhance(1.3)
    
    # Overlay layer for dark contrast gradient
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Left dark gradient for text readability
    for x in range(1200):
        alpha = int(220 * (1.0 - (x / 1200.0) ** 1.3))
        ov_draw.line([(x, 0), (x, h)], fill=(10, 15, 30, alpha))
        
    # Top HUD Bar
    ov_draw.rectangle([(0, 0), (w, 100)], fill=(15, 23, 42, 190))
    ov_draw.line([(0, 100), (w, 100)], fill=(251, 191, 36, 255), width=3)
    
    img = Image.alpha_composite(base, overlay)
    draw = ImageDraw.Draw(img)
    
    font_badge = ImageFont.truetype(ARIAL_BLACK, 32)
    font_hud = ImageFont.truetype(ARIAL_BLACK, 28)
    font_main = ImageFont.truetype(IMPACT_FONT, 135)
    font_sub = ImageFont.truetype(IMPACT_FONT, 115)
    font_pill = ImageFont.truetype(ARIAL_BLACK, 38)
    
    # Top Badges
    draw.text((50, 32), "⚠️ WHAT IF DISASTER", font=font_badge, fill=(255, 215, 0))
    draw.text((520, 36), "|   EPISODE 4", font=font_hud, fill=(148, 163, 184))
    
    # Top Right Alert
    draw.rounded_rectangle([(1380, 20), (1870, 80)], radius=12, fill=(239, 68, 68, 230), outline=(255, 255, 255), width=3)
    draw.text((1415, 32), "☀️ SOLAR STATUS: GONE", font=font_hud, fill=(255, 255, 255))
    
    # Main Text
    # Line 1: THE SUN DISAPPEARED!
    draw_text_clean(
        draw, "THE SUN VANISHED!", font_main, (60, 140),
        text_color=(255, 220, 0), outline_color=(0, 0, 0), stroke_w=16, shadow_offset=(10, 12)
    )
    
    # Line 2: FOR 7 DAYS!
    draw_text_clean(
        draw, "FOR 7 WHOLE DAYS!", font_sub, (60, 290),
        text_color=(255, 255, 255), outline_color=(0, 0, 0), stroke_w=14, shadow_offset=(8, 10)
    )
    
    # Pill 1: Temperature Alert
    px0, py0, px1, py1 = 60, 440, 840, 520
    draw.rounded_rectangle([(px0, py0), (px1, py1)], radius=16, fill=(220, 38, 38, 240), outline=(254, 240, 138), width=4)
    draw.text((px0 + 25, py0 + 16), "DEEP FREEZE AT -50°C! 🥶", font=font_pill, fill=(255, 255, 255))
    
    # Pill 2: Survival Secret
    sx0, sy0, sx1, sy1 = 60, 550, 800, 625
    draw.rounded_rectangle([(sx0, sy0), (sx1, sy1)], radius=14, fill=(15, 23, 42, 220), outline=(56, 189, 248), width=3)
    draw.text((sx0 + 25, sy0 + 16), "🌋 HOW HUMANITY SURVIVES", font=font_pill, fill=(56, 189, 248))
    
    # Bottom Callout
    draw.rounded_rectangle([(60, 930), (840, 1010)], radius=14, fill=(15, 23, 42, 220), outline=(251, 191, 36), width=3)
    draw.text((85, 950), "🚀 EARTH HURLED AT 67,000 MPH!", font=font_badge, fill=(251, 191, 36))
    
    # Outer Border
    draw.rectangle([(0, 0), (w-1, h-1)], outline=(251, 191, 36), width=8)
    
    final_rgb = img.convert("RGB")
    final_rgb.save(out_path, format="PNG", quality=98)
    jpg_path = str(out_path).replace(".png", ".jpg")
    final_rgb.save(jpg_path, format="JPEG", quality=95)
    print(f"Saved: {out_path} and {jpg_path}")

def create_vertical_short_thumbnail(base_path, out_path):
    print(f"Creating Vertical 9:16 Short Thumbnail from {base_path}...")
    base_src = Image.open(base_path).convert("RGBA")
    target_w, target_h = 1080, 1920
    
    bg_blurred = base_src.resize((target_w, target_h)).filter(ImageFilter.GaussianBlur(30))
    bg_dark = ImageEnhance.Brightness(bg_blurred).enhance(0.4)
    
    fg_w = target_w
    fg_h = int(target_w * (1080 / 1920))
    fg_img = base_src.resize((fg_w, fg_h))
    
    pos_y = (target_h - fg_h) // 2 + 50
    bg_dark.paste(fg_img, (0, pos_y), fg_img)
    
    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Vignettes
    for y in range(700):
        alpha = int(220 * (1.0 - (y / 700.0) ** 1.5))
        ov_draw.line([(0, y), (target_w, y)], fill=(10, 15, 30, alpha))
        
    for y in range(target_h - 600, target_h):
        alpha = int(220 * ((y - (target_h - 600)) / 600.0) ** 1.5)
        ov_draw.line([(0, y), (target_w, y)], fill=(10, 15, 30, alpha))
        
    img = Image.alpha_composite(bg_dark, overlay)
    draw = ImageDraw.Draw(img)
    
    font_top_badge = ImageFont.truetype(ARIAL_BLACK, 36)
    font_t1 = ImageFont.truetype(IMPACT_FONT, 120)
    font_t2 = ImageFont.truetype(IMPACT_FONT, 150)
    font_t3 = ImageFont.truetype(IMPACT_FONT, 140)
    font_timer = ImageFont.truetype(ARIAL_BLACK, 44)
    font_danger = ImageFont.truetype(ARIAL_BLACK, 42)
    
    # Top Simulation Badge
    draw.rounded_rectangle([(230, 90), (850, 165)], radius=14, fill=(15, 23, 42, 230), outline=(251, 191, 36), width=3)
    draw.text((260, 108), "⚠️ 7-DAY DISASTER SIM", font=font_top_badge, fill=(251, 191, 36))
    
    # Stacked Text
    draw_text_clean(draw, "WHAT IF", font_t1, (350, 180), (255, 255, 255), (0, 0, 0), stroke_w=14)
    draw_text_clean(draw, "THE SUN", font_t2, (290, 310), (251, 191, 36), (0, 0, 0), stroke_w=16)
    draw_text_clean(draw, "VANISHED?!", font_t3, (210, 460), (239, 68, 68), (0, 0, 0), stroke_w=16)
    
    # Center Timer Pill
    cy0, cy1 = 1260, 1360
    draw.rounded_rectangle([(140, cy0), (940, cy1)], radius=20, fill=(239, 68, 68, 240), outline=(254, 240, 138), width=4)
    draw.text((220, cy0 + 26), "⏱️ 7 DAYS OF DEEP FREEZE", font=font_timer, fill=(255, 255, 255))
    
    # Bottom Survival Pill
    by0, by1 = 1420, 1530
    draw.rounded_rectangle([(110, by0), (970, by1)], radius=20, fill=(15, 23, 42, 230), outline=(56, 189, 248), width=4)
    draw.text((150, by0 + 30), "CAN HUMANITY SURVIVE? 🥶", font=font_danger, fill=(56, 189, 248))
    
    # Outer Border
    draw.rectangle([(0, 0), (target_w-1, target_h-1)], outline=(251, 191, 36), width=10)
    
    final_rgb = img.convert("RGB")
    final_rgb.save(out_path, format="PNG", quality=98)
    jpg_path = str(out_path).replace(".png", ".jpg")
    final_rgb.save(jpg_path, format="JPEG", quality=95)
    print(f"Saved: {out_path} and {jpg_path}")

if __name__ == "__main__":
    base_img = r"D:\AI-Cartoons\what-if-studio\out\no-sun\still_space.png"
    out_h = r"D:\AI-Cartoons\what-if-studio\out\no-sun\thumbnail.png"
    out_v = r"D:\AI-Cartoons\what-if-studio\out\no-sun\thumbnail_short.png"
    
    create_horizontal_thumbnail(base_img, out_h)
    create_vertical_short_thumbnail(base_img, out_v)
    print("ALL NO-SUN THUMBNAILS CREATED SUCCESSFULLY!")


import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

sys.stdout.reconfigure(encoding='utf-8')

IMPACT_FONT = r"C:\Windows\Fonts\impact.ttf"
ARIAL_BLACK = r"C:\Windows\Fonts\ariblk.ttf"

def draw_text_clean(draw, text, font, pos, text_color, outline_color, stroke_w=16, shadow_offset=(8, 10)):
    x, y = pos
    if shadow_offset:
        sx, sy = x + shadow_offset[0], y + shadow_offset[1]
        draw.text((sx, sy), text, font=font, fill=(0, 0, 0, 240), stroke_width=stroke_w, stroke_fill=(0, 0, 0, 240))
    draw.text((x, y), text, font=font, fill=text_color, stroke_width=stroke_w, stroke_fill=outline_color)

def create_horizontal_thumbnail(base_path, out_path):
    print(f"Creating Horizontal 16:9 Thumbnail from {base_path}...")
    base = Image.open(base_path).convert("RGBA")
    w, h = base.size
    
    # Enhance contrast & color for YouTube pop
    base = ImageEnhance.Contrast(base).enhance(1.25)
    base = ImageEnhance.Color(base).enhance(1.35)
    
    # Comic visual enhancements:
    draw_base = ImageDraw.Draw(base)
    # Add comic sweat drops near Pip's head (around x=700, y=560)
    for sx, sy in [(680, 560), (710, 540), (840, 550)]:
        draw_base.ellipse([(sx, sy), (sx + 16, sy + 24)], fill=(56, 189, 248, 240), outline=(255, 255, 255), width=2)
    # Add cartoon red blush cheeks
    draw_base.ellipse([(730, 600), (765, 625)], fill=(239, 68, 68, 160))
    draw_base.ellipse([(800, 600), (835, 625)], fill=(239, 68, 68, 160))
    
    # Dark subtle vignette at top for maximum text pop
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    for y in range(320):
        alpha = int(210 * (1.0 - (y / 320.0) ** 1.4))
        ov_draw.line([(0, y), (w, y)], fill=(10, 15, 30, alpha))
        
    img = Image.alpha_composite(base, overlay)
    draw = ImageDraw.Draw(img)
    
    font_main = ImageFont.truetype(IMPACT_FONT, 155)
    font_badge = ImageFont.truetype(ARIAL_BLACK, 32)
    
    # EXACTLY 3 WORDS (Think Beyond Style)
    # "30 DAYS IN BED"
    # Centered horizontally at top
    text = "30 DAYS IN BED"
    bbox = draw.textbbox((0, 0), text, font=font_main, stroke_width=18)
    tw = bbox[2] - bbox[0]
    tx = (w - tw) // 2
    
    draw_text_clean(
        draw, text, font_main, (tx, 70),
        text_color=(255, 220, 0),   # Vibrant Sun Yellow
        outline_color=(0, 0, 0),     # Heavy Black
        stroke_w=18,
        shadow_offset=(10, 14)
    )
    
    # Single clean curiosity pill at bottom right
    px0, py0, px1, py1 = 1380, 940, 1860, 1020
    draw.rounded_rectangle([(px0, py0), (px1, py1)], radius=16, fill=(220, 38, 38, 240), outline=(254, 240, 138), width=3)
    draw.text((px0 + 35, py0 + 20), "😱 BODY COLLAPSE!", font=font_badge, fill=(255, 255, 255))
    
    # NASA badge at bottom left
    draw.rounded_rectangle([(60, 940), (540, 1020)], radius=16, fill=(15, 23, 42, 230), outline=(56, 189, 248), width=3)
    draw.text((85, 960), "🚀 REAL NASA STUDY", font=font_badge, fill=(56, 189, 248))
    
    # Outer Border
    draw.rectangle([(0, 0), (w-1, h-1)], outline=(255, 220, 0), width=8)
    
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
    
    pos_y = (target_h - fg_h) // 2 + 60
    bg_dark.paste(fg_img, (0, pos_y), fg_img)
    
    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    for y in range(650):
        alpha = int(220 * (1.0 - (y / 650.0) ** 1.5))
        ov_draw.line([(0, y), (target_w, y)], fill=(10, 15, 30, alpha))
        
    for y in range(target_h - 550, target_h):
        alpha = int(220 * ((y - (target_h - 550)) / 550.0) ** 1.5)
        ov_draw.line([(0, y), (target_w, y)], fill=(10, 15, 30, alpha))
        
    img = Image.alpha_composite(bg_dark, overlay)
    draw = ImageDraw.Draw(img)
    
    font_badge = ImageFont.truetype(ARIAL_BLACK, 36)
    font_t1 = ImageFont.truetype(IMPACT_FONT, 135)
    font_t2 = ImageFont.truetype(IMPACT_FONT, 160)
    font_pill = ImageFont.truetype(ARIAL_BLACK, 44)
    
    # Top Simulation Badge
    draw.rounded_rectangle([(240, 90), (840, 165)], radius=14, fill=(15, 23, 42, 230), outline=(255, 220, 0), width=3)
    draw.text((270, 108), "⚠️ NASA EXPERIMENT", font=font_badge, fill=(255, 220, 0))
    
    # Stacked 3 Words
    draw_text_clean(draw, "30 DAYS", font_t1, (300, 190), (255, 255, 255), (0, 0, 0), stroke_w=16)
    draw_text_clean(draw, "IN BED!", font_t2, (290, 330), (255, 220, 0), (0, 0, 0), stroke_w=18)
    
    # Bottom Pill
    by0, by1 = 1420, 1530
    draw.rounded_rectangle([(140, by0), (940, by1)], radius=20, fill=(220, 38, 38, 240), outline=(254, 240, 138), width=4)
    draw.text((180, by0 + 30), "DON'T TRY THIS! 💀", font=font_pill, fill=(255, 255, 255))
    
    # Outer Border
    draw.rectangle([(0, 0), (target_w-1, target_h-1)], outline=(255, 220, 0), width=10)
    
    final_rgb = img.convert("RGB")
    final_rgb.save(out_path, format="PNG", quality=98)
    jpg_path = str(out_path).replace(".png", ".jpg")
    final_rgb.save(jpg_path, format="JPEG", quality=95)
    print(f"Saved: {out_path} and {jpg_path}")

if __name__ == "__main__":
    base_img = r"D:\AI-Cartoons\what-if-studio\out\bed-rest\still_base.png"
    out_h = r"D:\AI-Cartoons\what-if-studio\out\bed-rest\thumbnail.png"
    out_v = r"D:\AI-Cartoons\what-if-studio\out\bed-rest\thumbnail_short.png"
    
    create_horizontal_thumbnail(base_img, out_h)
    create_vertical_short_thumbnail(base_img, out_v)
    
    # Lock backup copies
    import shutil
    shutil.copyfile(out_h, str(out_h).replace("thumbnail.png", "thumbnail_art.png"))
    shutil.copyfile(out_v, str(out_v).replace("thumbnail_short.png", "thumbnail_short_art.png"))
    print("ALL BED-REST THUMBNAILS CREATED & LOCKED!")


import math, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

sys.stdout.reconfigure(encoding='utf-8')

IMPACT_FONT = r"C:\Windows\Fonts\impact.ttf"
ARIAL_BLACK = r"C:\Windows\Fonts\ariblk.ttf"

def draw_text_with_outline_and_shadow(
    draw, text, font, pos, text_color, outline_color, outline_width=12, shadow_offset=(8, 10), shadow_color=(0, 0, 0, 220)
):
    x, y = pos
    # Shadow
    if shadow_offset and shadow_color:
        sx, sy = x + shadow_offset[0], y + shadow_offset[1]
        for dx in range(-outline_width, outline_width + 1):
            for dy in range(-outline_width, outline_width + 1):
                if dx*dx + dy*dy <= outline_width*outline_width:
                    draw.text((sx + dx, sy + dy), text, font=font, fill=shadow_color)
    
    # Outline
    if outline_width > 0 and outline_color:
        for dx in range(-outline_width, outline_width + 1):
            for dy in range(-outline_width, outline_width + 1):
                if dx*dx + dy*dy <= outline_width*outline_width:
                    draw.text((x + dx, y + dy), text, font=font, fill=outline_color)
    
    # Core text
    draw.text((x, y), text, font=font, fill=text_color)

def create_horizontal_thumbnail(base_path, out_path):
    print(f"Creating Horizontal 16:9 Thumbnail from {base_path}...")
    base = Image.open(base_path).convert("RGBA")
    w, h = base.size
    
    # Enhance contrast & color
    enhancer = ImageEnhance.Contrast(base)
    base = enhancer.enhance(1.25)
    color_enhancer = ImageEnhance.Color(base)
    base = color_enhancer.enhance(1.3)
    
    # Overlay layer for sci-fi atmosphere & gradients
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Left dark gradient for text readability
    for x in range(1100):
        alpha = int(210 * (1.0 - (x / 1100.0) ** 1.3))
        ov_draw.line([(x, 0), (x, h)], fill=(10, 15, 30, alpha))
        
    # Bottom subtle vignette
    for y in range(h - 220, h):
        alpha = int(180 * ((y - (h - 220)) / 220.0))
        ov_draw.line([(0, y), (w, y)], fill=(5, 10, 20, alpha))
        
    # Top subtle bar
    ov_draw.rectangle([(0, 0), (w, 110)], fill=(15, 23, 42, 180))
    ov_draw.line([(0, 110), (w, 110)], fill=(56, 189, 248, 255), width=3)
    
    # Merge base + overlay
    img = Image.alpha_composite(base, overlay)
    draw = ImageDraw.Draw(img)
    
    # Fonts
    font_badge = ImageFont.truetype(ARIAL_BLACK, 32)
    font_hud = ImageFont.truetype(ARIAL_BLACK, 28)
    font_main = ImageFont.truetype(IMPACT_FONT, 145)
    font_sub = ImageFont.truetype(IMPACT_FONT, 115)
    font_pill = ImageFont.truetype(ARIAL_BLACK, 40)
    
    # 1. Top Badges
    # Left Telemetry
    draw.text((50, 36), "⚠️ SCIENTIFIC SIMULATION", font=font_badge, fill=(255, 215, 0, 255))
    draw.text((560, 40), "|   EPISODE 3", font=font_hud, fill=(148, 163, 184, 255))
    
    # Right Zero-G Alert Box
    rx0, ry0, rx1, ry1 = 1380, 25, 1870, 85
    draw.rounded_rectangle([(rx0, ry0), (rx1, ry1)], radius=12, fill=(239, 68, 68, 230), outline=(255, 255, 255), width=3)
    draw.text((rx0 + 25, ry0 + 13), "GRAVITY: 0.00 m/s²", font=font_hud, fill=(255, 255, 255, 255))
    
    # 2. Main Title Typography
    # Line 1: "0 GRAVITY"
    text1 = "0 GRAVITY!"
    draw_text_with_outline_and_shadow(
        draw, text1, font_main, (60, 150),
        text_color=(255, 225, 0),       # Electric Yellow
        outline_color=(0, 0, 0),        # Deep Black
        outline_width=16,
        shadow_offset=(10, 12),
        shadow_color=(0, 0, 0, 240)
    )
    
    # Line 2: "FOR 60 SECONDS!"
    text2 = "FOR 60 SECONDS!"
    draw_text_with_outline_and_shadow(
        draw, text2, font_sub, (60, 315),
        text_color=(255, 255, 255),     # Pure Crisp White
        outline_color=(0, 0, 0),        # Deep Black
        outline_width=14,
        shadow_offset=(8, 10),
        shadow_color=(0, 0, 0, 240)
    )
    
    # Line 3: High-CTR Danger Pill
    # "TERMINAL IMPACT: 120 MPH! 💀"
    pill_text = "THE 60TH SECOND CRASH! 😱"
    px0, py0, px1, py1 = 60, 480, 840, 560
    draw.rounded_rectangle([(px0, py0), (px1, py1)], radius=16, fill=(220, 38, 38, 240), outline=(254, 240, 138), width=4)
    draw.text((px0 + 28, py0 + 16), pill_text, font=font_pill, fill=(255, 255, 255))
    
    # Floating milk callout badge
    draw.rounded_rectangle([(60, 930), (740, 1010)], radius=14, fill=(15, 23, 42, 220), outline=(56, 189, 248), width=3)
    draw.text((85, 950), "💧 LIQUIDS BECOME SPHERES", font=font_badge, fill=(56, 189, 248))
    
    # Neon Outer Border around thumbnail for instant feed pop
    border_width = 8
    draw.rectangle([(0, 0), (w-1, h-1)], outline=(56, 189, 248), width=border_width)
    
    # Save high quality PNG & JPG
    final_rgb = img.convert("RGB")
    final_rgb.save(out_path, format="PNG", quality=98)
    jpg_path = str(out_path).replace(".png", ".jpg")
    final_rgb.save(jpg_path, format="JPEG", quality=95)
    print(f"Saved: {out_path} and {jpg_path}")

def create_vertical_short_thumbnail(base_path, out_path):
    print(f"Creating Vertical 9:16 Short Thumbnail from {base_path}...")
    base_src = Image.open(base_path).convert("RGBA")
    
    # Target size: 1080 x 1920
    target_w, target_h = 1080, 1920
    
    # Scale base to fit center nicely
    # Crop base or blur background
    bg_blurred = base_src.resize((target_w, target_h)).filter(ImageFilter.GaussianBlur(30))
    bg_enhancer = ImageEnhance.Brightness(bg_blurred)
    bg_dark = bg_enhancer.enhance(0.4)
    
    # Foreground centered image
    # We want Pip in the center
    fg_w = target_w
    fg_h = int(target_w * (1080 / 1920)) # 607px
    fg_pip = base_src.resize((fg_w, fg_h))
    
    # Composite fg onto dark blurred bg in center
    pos_y = (target_h - fg_h) // 2 + 60
    bg_dark.paste(fg_pip, (0, pos_y), fg_pip)
    
    # Overlay for contrast
    overlay = Image.new("RGBA", (target_w, target_h), (0, 0, 0, 0))
    ov_draw = ImageDraw.Draw(overlay)
    
    # Dark top vignette for text
    for y in range(650):
        alpha = int(220 * (1.0 - (y / 650.0) ** 1.5))
        ov_draw.line([(0, y), (target_w, y)], fill=(10, 15, 30, alpha))
        
    # Dark bottom vignette for bottom CTA
    for y in range(target_h - 600, target_h):
        alpha = int(220 * ((y - (target_h - 600)) / 600.0) ** 1.5)
        ov_draw.line([(0, y), (target_w, y)], fill=(10, 15, 30, alpha))
        
    img = Image.alpha_composite(bg_dark, overlay)
    draw = ImageDraw.Draw(img)
    
    font_top_badge = ImageFont.truetype(ARIAL_BLACK, 36)
    font_short_t1 = ImageFont.truetype(IMPACT_FONT, 125)
    font_short_t2 = ImageFont.truetype(IMPACT_FONT, 155)
    font_short_t3 = ImageFont.truetype(IMPACT_FONT, 150)
    font_timer = ImageFont.truetype(ARIAL_BLACK, 46)
    font_danger = ImageFont.truetype(ARIAL_BLACK, 44)
    
    # Top Simulation Badge
    draw.rounded_rectangle([(240, 90), (840, 165)], radius=14, fill=(15, 23, 42, 230), outline=(56, 189, 248), width=3)
    draw.text((280, 108), "⚠️ WHAT IF DISASTER", font=font_top_badge, fill=(56, 189, 248))
    
    # Stacked Bold Text at Top
    # Line 1: WHAT IF
    draw_text_with_outline_and_shadow(
        draw, "WHAT IF", font_short_t1, (340, 180),
        text_color=(255, 255, 255), outline_color=(0, 0, 0), outline_width=14, shadow_offset=(8, 10)
    )
    # Line 2: GRAVITY
    draw_text_with_outline_and_shadow(
        draw, "GRAVITY", font_short_t2, (260, 310),
        text_color=(56, 189, 248), outline_color=(0, 0, 0), outline_width=16, shadow_offset=(10, 12)
    )
    # Line 3: VANISHED?
    draw_text_with_outline_and_shadow(
        draw, "VANISHED?!", font_short_t3, (190, 460),
        text_color=(250, 204, 21), outline_color=(0, 0, 0), outline_width=16, shadow_offset=(10, 12)
    )
    
    # Center Countdown Pill
    cy0, cy1 = 1260, 1360
    draw.rounded_rectangle([(140, cy0), (940, cy1)], radius=20, fill=(239, 68, 68, 240), outline=(254, 240, 138), width=4)
    draw.text((220, cy0 + 24), "⏱️ 60s ZERO-G FREEFALL", font=font_timer, fill=(255, 255, 255))
    
    # Bottom Crash Pill
    by0, by1 = 1420, 1530
    draw.rounded_rectangle([(100, by0), (980, by1)], radius=20, fill=(15, 23, 42, 230), outline=(239, 68, 68), width=4)
    draw.text((150, by0 + 30), "THE 60TH SECOND IMPACT! 💀", font=font_danger, fill=(254, 240, 138))
    
    # Outer Border
    draw.rectangle([(0, 0), (target_w-1, target_h-1)], outline=(250, 204, 21), width=10)
    
    final_rgb = img.convert("RGB")
    final_rgb.save(out_path, format="PNG", quality=98)
    jpg_path = str(out_path).replace(".png", ".jpg")
    final_rgb.save(jpg_path, format="JPEG", quality=95)
    print(f"Saved: {out_path} and {jpg_path}")

if __name__ == "__main__":
    base_img = r"D:\AI-Cartoons\what-if-studio\out\no-gravity\pip_shock.png"
    out_h = r"D:\AI-Cartoons\what-if-studio\out\no-gravity\thumbnail.png"
    out_v = r"D:\AI-Cartoons\what-if-studio\out\no-gravity\thumbnail_short.png"
    
    create_horizontal_thumbnail(base_img, out_h)
    create_vertical_short_thumbnail(base_img, out_v)
    print("ALL THUMBNAILS CREATED SUCCESSFULLY!")


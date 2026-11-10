import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\death-timer")
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\death-timer")
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

# Source background with stickman
src_thumb = BRAIN / "thumbnail_16x9_1793974175930.jpg"
if not src_thumb.exists():
    src_thumb = PUB_DIR / "thumbnail.jpg"

base_16_9 = Image.open(src_thumb).convert("RGBA").resize((1280, 720), Image.Resampling.LANCZOS)

def get_font(size, bold=True):
    fonts = ["impact.ttf", "arialbd.ttf", "segoeuib.ttf", "tahoma.ttf"]
    for f in fonts:
        try:
            return ImageFont.truetype(f, size)
        except Exception:
            continue
    return ImageFont.load_default()

font_headline = get_font(108, True)
font_sub = get_font(52, True)
font_badge = get_font(30, True)
font_timer = get_font(68, True)

# Helper: Draw heavy 3D text with thick stroke & shadow
def draw_3d_text(draw_ctx, pos, text, font, fill_color, stroke_color, stroke_w=8, shadow_offset=(8, 10), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    # Shadow
    draw_ctx.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color, anchor="mm", stroke_width=stroke_w + 2, stroke_fill=shadow_color)
    # Main text
    draw_ctx.text((x, y), text, font=font, fill=fill_color, anchor="mm", stroke_width=stroke_w, stroke_fill=stroke_color)

# ==============================================================================
# 1. CREATE 16:9 CLICKBAIT THUMBNAIL (1280x720)
# ==============================================================================
overlay = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

# Add dark gradient on top and bottom for supreme text legibility
grad_top = Image.new("RGBA", (1280, 220), (0, 0, 0, 0))
draw_gt = ImageDraw.Draw(grad_top)
for y in range(220):
    alpha = int(180 * (1 - y / 220.0))
    draw_gt.line([(0, y), (1280, y)], fill=(0, 0, 0, alpha))
overlay.paste(grad_top, (0, 0), grad_top)

grad_bot = Image.new("RGBA", (1280, 180), (0, 0, 0, 0))
draw_gb = ImageDraw.Draw(grad_bot)
for y in range(180):
    alpha = int(190 * (y / 180.0))
    draw_gb.line([(0, y), (1280, y)], fill=(0, 0, 0, alpha))
overlay.paste(grad_bot, (0, 720 - 180), grad_bot)

# Top Urgent Warning Badge
draw.rounded_rectangle([390, 25, 890, 75], radius=25, fill=(239, 68, 68, 240), outline=(255, 255, 255, 230), width=3)
draw.text((640, 50), "⚠️ FATAL MISTAKE — DO NOT LOOK!", font=font_badge, fill=(255, 255, 255), anchor="mm")

# Massive 3D Clickbait Headline
draw_3d_text(draw, (640, 150), "HE SAW HIS OWN TIMER...", font_headline, fill_color=(255, 230, 0), stroke_color=(10, 10, 15), stroke_w=10)

# Holographic Glowing Death Timer HUD right above Pip's head (Centered bottom or upper-right)
# Timer Box: Glowing Crimson
hud_box = [370, 590, 910, 680]
draw.rounded_rectangle(hud_box, radius=18, fill=(15, 23, 42, 235), outline=(239, 68, 68, 255), width=4)
# Glow line
draw.rounded_rectangle([hud_box[0] - 4, hud_box[1] - 4, hud_box[2] + 4, hud_box[3] + 4], radius=22, outline=(239, 68, 68, 120), width=3)
# HUD Text
draw_3d_text(draw, (640, 635), "[ 00:00:03 ]", font_timer, fill_color=(255, 50, 50), stroke_color=(0, 0, 0), stroke_w=5, shadow_offset=(4, 5))

final_16_9 = Image.alpha_composite(base_16_9, overlay).convert("RGB")
final_16_9.save(PUB_DIR / "thumbnail.jpg", quality=95)
final_16_9.save(OUT_DIR / "thumbnail.jpg", quality=95)
final_16_9.save(BRAIN / "thumb_clickbait_16x9.jpg", quality=95)
print("Saved 16:9 Clickbait Thumbnail!")

# ==============================================================================
# 2. CREATE 9:16 VERTICAL SHORT CLICKBAIT THUMBNAIL (1080x1920)
# ==============================================================================
src_short = BRAIN / "thumbnail_9x16_1793974202201.jpg"
if not src_short.exists():
    src_short = PUB_DIR / "thumbnail_short.jpg"

base_v = Image.open(src_short).convert("RGBA").resize((1080, 1920), Image.Resampling.LANCZOS)
v_overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(v_overlay)

font_v_title = get_font(120, True)
font_v_sub = get_font(60, True)
font_v_badge = get_font(38, True)
font_v_timer = get_font(80, True)

# Top Bar Badge
v_draw.rounded_rectangle([180, 180, 900, 260], radius=40, fill=(239, 68, 68, 245), outline=(255, 255, 255, 230), width=4)
v_draw.text((540, 220), "⚠️ 12 SECONDS LEFT", font=font_v_badge, fill=(255, 255, 255), anchor="mm")

# Massive Vertical 3D Headline
draw_3d_text(v_draw, (540, 360), "DO NOT LOOK!", font_v_title, fill_color=(255, 230, 0), stroke_color=(10, 10, 20), stroke_w=12)
draw_3d_text(v_draw, (540, 470), "HE SAW HIS OWN DEATH...", font_v_sub, fill_color=(255, 255, 255), stroke_color=(10, 10, 20), stroke_w=8)

# Bottom Callout Box with Glowing Timer
hud_v_box = [160, 1480, 920, 1620]
v_draw.rounded_rectangle(hud_v_box, radius=28, fill=(15, 23, 42, 240), outline=(239, 68, 68, 255), width=5)
v_draw.rounded_rectangle([hud_v_box[0]-6, hud_v_box[1]-6, hud_v_box[2]+6, hud_v_box[3]+6], radius=34, outline=(239, 68, 68, 110), width=4)

draw_3d_text(v_draw, (540, 1550), "[ 00:00:03 ]", font_v_timer, fill_color=(255, 50, 50), stroke_color=(0, 0, 0), stroke_w=6, shadow_offset=(5, 6))

draw_3d_text(v_draw, (540, 1690), "WOULD YOU LOOK? 👇", get_font(46, True), fill_color=(250, 204, 21), stroke_color=(10, 10, 20), stroke_w=7)

final_vert = Image.alpha_composite(base_v, v_overlay).convert("RGB")
final_vert.save(PUB_DIR / "thumbnail_short.jpg", quality=95)
final_vert.save(OUT_DIR / "thumbnail_short.jpg", quality=95)
final_vert.save(BRAIN / "thumb_clickbait_9x16.jpg", quality=95)
print("Saved 9:16 Clickbait Thumbnail!")


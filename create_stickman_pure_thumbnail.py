import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public_timer\death-timer")
OUT_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\death-timer")
BRAIN = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

raw_stickman_still = OUT_DIR / "stickman_thumb_raw.png"
if not raw_stickman_still.exists():
    raw_stickman_still = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\stickman_thumb_raw.png")

print("Loading raw stickman still:", raw_stickman_still)
base_im = Image.open(raw_stickman_still).convert("RGBA")

def get_font(size, bold=True):
    fonts = ["impact.ttf", "arialbd.ttf", "segoeuib.ttf", "tahoma.ttf"]
    for f in fonts:
        try:
            return ImageFont.truetype(f, size)
        except Exception:
            continue
    return ImageFont.load_default()

def draw_3d_text(draw_ctx, pos, text, font, fill_color, stroke_color, stroke_w=8, shadow_offset=(8, 10), shadow_color=(0, 0, 0, 255)):
    x, y = pos
    draw_ctx.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color, anchor="mm", stroke_width=stroke_w + 2, stroke_fill=shadow_color)
    draw_ctx.text((x, y), text, font=font, fill=fill_color, anchor="mm", stroke_width=stroke_w, stroke_fill=stroke_color)

# ==============================================================================
# 1. 16:9 LANDSCAPE THUMBNAIL (1280x720) with EXACT STICKMAN
# ==============================================================================
im_16_9 = base_im.resize((1280, 720), Image.Resampling.LANCZOS)
overlay = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

# Dark gradient at the very top for high text contrast
grad_top = Image.new("RGBA", (1280, 180), (0, 0, 0, 0))
draw_gt = ImageDraw.Draw(grad_top)
for y in range(180):
    alpha = int(210 * (1 - y / 180.0))
    draw_gt.line([(0, y), (1280, y)], fill=(0, 0, 0, alpha))
overlay.paste(grad_top, (0, 0), grad_top)

# Badge at top
font_badge = get_font(26, True)
draw.rounded_rectangle([420, 20, 860, 68], radius=24, fill=(239, 68, 68, 245), outline=(255, 255, 255, 230), width=3)
draw.text((640, 44), "⚠️ FATAL MISTAKE — DO NOT LOOK!", font=font_badge, fill=(255, 255, 255), anchor="mm")

# Giant 3D Clickbait Headline
font_title = get_font(98, True)
draw_3d_text(draw, (640, 126), "HE SAW HIS OWN TIMER...", font_title, fill_color=(255, 230, 0), stroke_color=(10, 10, 15), stroke_w=10)

final_16_9 = Image.alpha_composite(im_16_9, overlay).convert("RGB")
final_16_9.save(PUB_DIR / "thumbnail.jpg", quality=95)
final_16_9.save(OUT_DIR / "thumbnail.jpg", quality=95)
final_16_9.save(BRAIN / "thumb_clickbait_16x9.jpg", quality=95)
print("Saved 16:9 Stickman Clickbait Thumbnail!")

# ==============================================================================
# 2. 9:16 VERTICAL SHORT THUMBNAIL (1080x1920) with EXACT STICKMAN
# ==============================================================================
vert_bg = base_im.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(32))

# Crop the center stickman region from base_im (1920x1080)
# Stickman is centered at x=960, y=620
center_crop = base_im.crop((420, 100, 1500, 1000)).resize((1080, 900), Image.Resampling.LANCZOS)
vert_bg.paste(center_crop, (0, 510))

v_overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(v_overlay)

# Top & bottom vignette bars
v_draw.rectangle([0, 0, 1080, 510], fill=(5, 8, 22, 195))
v_draw.rectangle([0, 1410, 1080, 1920], fill=(5, 8, 22, 215))

# Top Badge
v_draw.rounded_rectangle([200, 160, 880, 240], radius=40, fill=(239, 68, 68, 245), outline=(255, 255, 255, 230), width=4)
v_draw.text((540, 200), "⚠️ 12 SECONDS LEFT", font=get_font(36, True), fill=(255, 255, 255), anchor="mm")

# Headline
draw_3d_text(v_draw, (540, 330), "DO NOT LOOK!", get_font(120, True), fill_color=(255, 230, 0), stroke_color=(10, 10, 20), stroke_w=12)
draw_3d_text(v_draw, (540, 440), "HE SAW HIS OWN DEATH...", get_font(56, True), fill_color=(255, 255, 255), stroke_color=(10, 10, 20), stroke_w=8)

# Bottom Callout Box with Glowing Timer
hud_v_box = [160, 1490, 920, 1630]
v_draw.rounded_rectangle(hud_v_box, radius=28, fill=(15, 23, 42, 240), outline=(239, 68, 68, 255), width=5)
draw_3d_text(v_draw, (540, 1560), "[ 00:00:03 ]", get_font(80, True), fill_color=(255, 50, 50), stroke_color=(0, 0, 0), stroke_w=6, shadow_offset=(5, 6))

draw_3d_text(v_draw, (540, 1710), "WOULD YOU LOOK? 👇", get_font(46, True), fill_color=(250, 204, 21), stroke_color=(10, 10, 20), stroke_w=7)

final_vert = Image.alpha_composite(vert_bg, v_overlay).convert("RGB")
final_vert.save(PUB_DIR / "thumbnail_short.jpg", quality=95)
final_vert.save(OUT_DIR / "thumbnail_short.jpg", quality=95)
final_vert.save(BRAIN / "thumb_clickbait_9x16.jpg", quality=95)
print("Saved 9:16 Stickman Clickbait Thumbnail!")

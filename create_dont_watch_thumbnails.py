import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\dont-watch")
BRAIN_DIR = pathlib.Path(r"C:\Users\Administrator\.gemini\antigravity\brain\692617a3-d555-46ed-a13d-03bbe3809063")

bg_candidates = sorted(BRAIN_DIR.glob("dont_watch_thumb_bg_*.jpg"), key=lambda p: p.stat().st_mtime, reverse=True)
bg_path = bg_candidates[0] if bg_candidates else (PUB_DIR / "bg_forbidden_studio.jpg")

print(f"Using base background: {bg_path.name}")
base_im = Image.open(bg_path).convert("RGBA")

# 1. GENERATE 16:9 THUMBNAIL (1280x720)
im_16_9 = base_im.resize((1280, 720), Image.Resampling.LANCZOS)
overlay = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

# Dark gradient in the upper-center area to make text pop aggressively
for y in range(720):
    alpha = int(140 * (1 - abs(y - 320) / 360) ** 1.5) if abs(y - 320) < 360 else 0
    draw.line([(0, y), (1280, y)], fill=(5, 5, 15, max(0, min(160, alpha))))

# Try to load heavy bold system fonts
def get_font(size, bold=True):
    font_names = [
        "impact.ttf", "arialbd.ttf", "segoeuib.ttf", "montserrat-bold.ttf", "tahoma.ttf"
    ]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except:
            continue
    return ImageFont.load_default()

font_badge = get_font(26, True)
font_title_1 = get_font(78, True)
font_title_2 = get_font(92, True)
font_sub = get_font(34, True)

# Top Caution Hazard Bar
bar_h = 42
for bx in range(-40, 1320, 40):
    draw.polygon([(bx, 0), (bx + 20, 0), (bx + 10, bar_h), (bx - 10, bar_h)], fill=(255, 215, 0, 240))
    draw.polygon([(bx + 20, 0), (bx + 40, 0), (bx + 30, bar_h), (bx + 10, bar_h)], fill=(20, 20, 20, 240))

# Warning Pill Badge
badge_w, badge_h = 480, 48
badge_x = (1280 - badge_w) // 2
badge_y = 65
draw.rounded_rectangle([badge_x, badge_y, badge_x + badge_w, badge_y + badge_h], radius=24, fill=(225, 29, 72, 240), outline=(255, 255, 255, 220), width=3)
draw.text((640, badge_y + badge_h // 2), "🚨 EXPERIMENT: DO NOT CLICK 🚨", font=font_badge, fill=(255, 255, 255), anchor="mm")

# Helper for heavy 3D text with outline and drop shadow
def draw_3d_text(draw_ctx, pos, text, font, fill_color, stroke_color, stroke_w=6, shadow_offset=(8, 10), shadow_color=(0, 0, 0, 250)):
    x, y = pos
    # Shadow
    draw_ctx.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color, anchor="mm", stroke_width=stroke_w, stroke_fill=shadow_color)
    # Main with stroke
    draw_ctx.text((x, y), text, font=font, fill=fill_color, anchor="mm", stroke_width=stroke_w, stroke_fill=stroke_color)

# Headline 1: DON'T WATCH
draw_3d_text(draw, (640, 220), "DON'T WATCH", font_title_1, fill_color=(255, 255, 255), stroke_color=(10, 10, 20), stroke_w=8)

# Headline 2: THIS VIDEO!
draw_3d_text(draw, (640, 315), "THIS VIDEO!", font_title_2, fill_color=(255, 220, 0), stroke_color=(180, 10, 40), stroke_w=9)

# Sub Hook Badge: WHY NOBODY WATCHES STICKMEN
hook_w, hook_h = 660, 56
hook_x = (1280 - hook_w) // 2
hook_y = 405
draw.rounded_rectangle([hook_x, hook_y, hook_x + hook_w, hook_y + hook_h], radius=28, fill=(15, 23, 42, 230), outline=(56, 189, 248, 220), width=3)
draw.text((640, hook_y + hook_h // 2), "WHY NOBODY WATCHES STICKMEN 👁️", font=font_sub, fill=(56, 189, 248), anchor="mm")

# Rubber Stamp: 100% NOTHING INSIDE (slanted)
stamp_im = Image.new("RGBA", (340, 100), (0, 0, 0, 0))
s_draw = ImageDraw.Draw(stamp_im)
font_stamp = get_font(30, True)
s_draw.rectangle([6, 6, 334, 94], outline=(239, 68, 68, 240), width=5)
s_draw.text((170, 50), "100% NOTHING", font=font_stamp, fill=(239, 68, 68, 240), anchor="mm")
stamp_rot = stamp_im.rotate(14, resample=Image.Resampling.BICUBIC, expand=True)
overlay.paste(stamp_rot, (850, 490), stamp_rot)

# Bottom Caution Bar
for bx in range(-40, 1320, 40):
    draw.polygon([(bx, 720 - bar_h), (bx + 20, 720 - bar_h), (bx + 10, 720), (bx - 10, 720)], fill=(255, 215, 0, 240))
    draw.polygon([(bx + 20, 720 - bar_h), (bx + 40, 720 - bar_h), (bx + 30, 720), (bx + 10, 720)], fill=(20, 20, 20, 240))

final_16_9 = Image.alpha_composite(im_16_9, overlay).convert("RGB")
final_16_9.save(PUB_DIR / "thumbnail.jpg", quality=95)
print("Saved 16:9 thumbnail: thumbnail.jpg")

# 2. GENERATE 9:16 VERTICAL THUMBNAIL (1080x1920)
# Use ambient blurred pillarbox background with centered 16:9 art
vert_bg = base_im.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(30))
vert_center = base_im.resize((1080, 608), Image.Resampling.LANCZOS)
vert_bg.paste(vert_center, (0, 656))

vert_overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(vert_overlay)

# Dark overlays top and bottom
v_draw.rectangle([0, 0, 1080, 656], fill=(5, 8, 22, 190))
v_draw.rectangle([0, 1264, 1080, 1920], fill=(5, 8, 22, 210))

font_v_badge = get_font(38, True)
font_v_title1 = get_font(105, True)
font_v_title2 = get_font(120, True)
font_v_sub = get_font(44, True)
font_v_btn = get_font(46, True)

# Top vertical badge
v_draw.rounded_rectangle([190, 200, 890, 280], radius=40, fill=(225, 29, 72, 240), outline=(255, 255, 255, 230), width=4)
v_draw.text((540, 240), "⚠️ DO NOT WATCH ⚠️", font=font_v_badge, fill=(255, 255, 255), anchor="mm")

# Big Title on top
draw_3d_text(v_draw, (540, 390), "DON'T CLICK", font_v_title1, fill_color=(255, 255, 255), stroke_color=(10, 10, 25), stroke_w=10)
draw_3d_text(v_draw, (540, 520), "THIS VIDEO!", font_v_title2, fill_color=(255, 220, 0), stroke_color=(180, 10, 40), stroke_w=12)

# Bottom Callouts
draw_3d_text(v_draw, (540, 1370), "WHY NOBODY WATCHES", font_v_sub, fill_color=(56, 189, 248), stroke_color=(10, 10, 25), stroke_w=6)
draw_3d_text(v_draw, (540, 1445), "STICKMAN VIDEOS", font_v_title1, fill_color=(255, 255, 255), stroke_color=(10, 10, 25), stroke_w=8)

# Giant Forbidden Button
v_draw.rounded_rectangle([200, 1570, 880, 1690], radius=60, fill=(225, 29, 72, 250), outline=(255, 255, 255, 240), width=5)
v_draw.text((540, 1630), "🚫 DO NOT CLICK", font=font_v_btn, fill=(255, 255, 255), anchor="mm")

final_vert = Image.alpha_composite(vert_bg, vert_overlay).convert("RGB")
final_vert.save(PUB_DIR / "thumbnail_short.jpg", quality=95)
print("Saved 9:16 thumbnail: thumbnail_short.jpg")


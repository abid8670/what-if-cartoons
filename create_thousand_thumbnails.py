import pathlib
from PIL import Image, ImageDraw, ImageFont, ImageFilter

PUB_DIR = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\public\one-thousand-or-one")
bg_path = PUB_DIR / "thumb_thousand_bg.jpg"

base_im = Image.open(bg_path).convert("RGBA")

# 1. 16:9 THUMBNAIL (1280x720)
im_16_9 = base_im.resize((1280, 720), Image.Resampling.LANCZOS)
overlay = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

def get_font(size, bold=True):
    font_names = ["impact.ttf", "arialbd.ttf", "segoeuib.ttf", "montserrat-bold.ttf", "tahoma.ttf"]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except:
            continue
    return ImageFont.load_default()

font_title = get_font(110, True)
font_badge = get_font(26, True)
font_time = get_font(24, True)

# Helper for heavy 3D text
def draw_3d_text(draw_ctx, pos, text, font, fill_color, stroke_color, stroke_w=7, shadow_offset=(7, 9), shadow_color=(0, 0, 0, 240)):
    x, y = pos
    draw_ctx.text((x + shadow_offset[0], y + shadow_offset[1]), text, font=font, fill=shadow_color, anchor="mm", stroke_width=stroke_w, stroke_fill=shadow_color)
    draw_ctx.text((x, y), text, font=font, fill=fill_color, anchor="mm", stroke_width=stroke_w, stroke_fill=stroke_color)

# Giant Headline matching reference: "1,000 OR 1?"
draw_3d_text(draw, (640, 115), "1,000 OR 1?", font_title, fill_color=(255, 255, 255), stroke_color=(10, 10, 15), stroke_w=9)

# Duration badge in bottom right: "2:51"
time_w, time_h = 72, 34
time_x, time_y = 1280 - time_w - 20, 720 - time_h - 20
draw.rounded_rectangle([time_x, time_y, time_x + time_w, time_y + time_h], radius=6, fill=(0, 0, 0, 220))
draw.text((time_x + time_w // 2, time_y + time_h // 2), "2:51", font=font_time, fill=(255, 255, 255), anchor="mm")

final_16_9 = Image.alpha_composite(im_16_9, overlay).convert("RGB")
final_16_9.save(PUB_DIR / "thumbnail.jpg", quality=95)
print("Saved 16:9 thumbnail: thumbnail.jpg")

# 2. 9:16 VERTICAL THUMBNAIL (1080x1920)
vert_bg = base_im.resize((1080, 1920), Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(28))
vert_center = base_im.resize((1080, 608), Image.Resampling.LANCZOS)
vert_bg.paste(vert_center, (0, 656))

vert_overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
v_draw = ImageDraw.Draw(vert_overlay)

v_draw.rectangle([0, 0, 1080, 656], fill=(5, 8, 22, 185))
v_draw.rectangle([0, 1264, 1080, 1920], fill=(5, 8, 22, 205))

font_v_title = get_font(130, True)
font_v_sub = get_font(46, True)
font_v_badge = get_font(36, True)

# Top badge
v_draw.rounded_rectangle([220, 240, 860, 315], radius=38, fill=(236, 72, 153, 240), outline=(255, 255, 255, 220), width=4)
v_draw.text((540, 277), "THE ULTIMATE DILEMMA", font=font_v_badge, fill=(255, 255, 255), anchor="mm")

# Headline on top
draw_3d_text(v_draw, (540, 460), "1,000 OR 1?", font_v_title, fill_color=(255, 255, 255), stroke_color=(10, 10, 20), stroke_w=12)

# Bottom callouts
draw_3d_text(v_draw, (540, 1420), "WHO STAYS IN THE RAIN?", font_v_sub, fill_color=(250, 204, 21), stroke_color=(10, 10, 20), stroke_w=7)
draw_3d_text(v_draw, (540, 1510), "TEMPORARY THRILLS VS LOYALTY 💔☔", get_font(34, True), fill_color=(255, 255, 255), stroke_color=(10, 10, 20), stroke_w=6)

final_vert = Image.alpha_composite(vert_bg, vert_overlay).convert("RGB")
final_vert.save(PUB_DIR / "thumbnail_short.jpg", quality=95)
print("Saved 9:16 thumbnail: thumbnail_short.jpg")


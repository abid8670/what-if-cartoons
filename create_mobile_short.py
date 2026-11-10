import subprocess, pathlib, sys

studio = pathlib.Path(r"D:\AI-Cartoons\what-if-studio")
in_video = studio / "out" / "pause" / "pause-final.mp4"
out_video = studio / "out" / "pause" / "pause_mobile_short.mp4"

# 1080x1920 vertical format for YouTube Shorts
# Top: Viral Hook Header
# Middle: Sharp video with cyan border
# Bottom: Suspense callout
filter_complex = (
    # Background: blurred and darkened 1080x1920
    "[0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=28:5,eq=brightness=-0.25[bg];"
    # Foreground: 1080 width with 4px cyan border
    "[0:v]scale=1060:-1,pad=1080:ih+16:10:8:color=0x38BDF8[fg];"
    # Composite foreground onto center
    "[bg][fg]overlay=0:(H-h)/2[comp];"
    # Top card banner
    "[comp]drawtext=text='WHAT IF YOU COULD PAUSE TIME?':fontcolor=white:fontsize=48:x=(w-text_w)/2:y=220:"
    "box=1:boxcolor=0x0F172A@0.85:boxborderw=18,"
    # Bottom card banner
    "drawtext=text='WHO UNFREEZES YOU?':fontcolor=0x38BDF8:fontsize=44:x=(w-text_w)/2:y=1620:"
    "box=1:boxcolor=0x0F172A@0.85:boxborderw=16[outv]"
)

cmd = [
    "ffmpeg", "-y", "-i", str(in_video),
    "-filter_complex", filter_complex,
    "-map", "[outv]", "-map", "0:a",
    "-c:v", "libx264", "-preset", "fast", "-crf", "19",
    "-c:a", "aac", "-b:a", "256k",
    "-movflags", "+faststart",
    str(out_video)
]

print("Rendering 1080x1920 Vertical Mobile Short...")
subprocess.run(cmd, check=True)
print(f"SUCCESS: Rendered {out_video}")


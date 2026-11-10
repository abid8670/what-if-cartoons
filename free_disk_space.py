import os
import shutil
import pathlib

temp_dir = pathlib.Path(os.environ.get("TEMP", r"C:\Users\Administrator\AppData\Local\Temp"))
print(f"Checking {temp_dir}...")

freed = 0
for item in temp_dir.glob("*"):
    try:
        if item.is_file():
            size = item.stat().st_size
            item.unlink()
            freed += size
        elif item.is_dir():
            shutil.rmtree(item, ignore_errors=True)
    except Exception:
        pass

print(f"Freed {freed / (1024*1024):.2f} MB from Temp.")

# Also check puppeteer / chrome cache or remotion cache
remotion_cache = pathlib.Path(r"C:\Users\Administrator\.remotion")
if remotion_cache.exists():
    print(f"Remotion cache exists: {remotion_cache}")

# Check D drive temp
d_temp = pathlib.Path(r"D:\temp")
d_temp.mkdir(parents=True, exist_ok=True)
print(f"D:\\temp ready.")


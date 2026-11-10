import os
import shutil
import pathlib

# Let's check Chrome caches in Administrator
chrome_cache = pathlib.Path(r"C:\Users\Administrator\AppData\Local\Google\Chrome\User Data\Default\Cache")
chrome_code_cache = pathlib.Path(r"C:\Users\Administrator\AppData\Local\Google\Chrome\User Data\Default\Code Cache")
pip_cache = pathlib.Path(r"C:\Users\Administrator\AppData\Local\pip\cache")
npm_cache = pathlib.Path(r"C:\Users\Administrator\AppData\Local\npm-cache")
sw_dist = pathlib.Path(r"C:\Windows\SoftwareDistribution\Download")

cleaned = 0
for target in [chrome_cache, chrome_code_cache, pip_cache, npm_cache, sw_dist]:
    if target.exists():
        print(f"Cleaning {target}...")
        for item in target.glob("*"):
            try:
                if item.is_file():
                    s = item.stat().st_size
                    item.unlink()
                    cleaned += s
                elif item.is_dir():
                    shutil.rmtree(item, ignore_errors=True)
            except Exception:
                pass

print(f"Total cleaned: {cleaned / (1024**3):.2f} GB")

# Check free space on C:
import ctypes
free_bytes = ctypes.c_ulonglong(0)
ctypes.windll.kernel32.GetDiskFreeSpaceExW(ctypes.c_wchar_p("C:\\"), None, None, ctypes.byref(free_bytes))
print(f"C: Free space now: {free_bytes.value / (1024**3):.2f} GB")


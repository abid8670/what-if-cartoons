import os
import shutil
import pathlib

paths_to_clean = [
    pathlib.Path(r"C:\Windows\Temp"),
    pathlib.Path(r"C:\Users\Administrator\AppData\Local\Temp"),
    pathlib.Path(r"C:\Users\Administrator\.remotion"),
    pathlib.Path(r"C:\Users\Administrator\AppData\Local\CrashDumps"),
]

freed_total = 0
for p in paths_to_clean:
    if not p.exists():
        continue
    print(f"Cleaning {p}...")
    for item in p.glob("*"):
        try:
            if item.is_file():
                s = item.stat().st_size
                item.unlink()
                freed_total += s
            elif item.is_dir():
                shutil.rmtree(item, ignore_errors=True)
        except Exception:
            pass

print(f"Total freed: {freed_total / (1024**2):.1f} MB")


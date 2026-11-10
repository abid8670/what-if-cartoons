import os
import pathlib

user_dir = pathlib.Path(r"C:\Users\Administrator")
for item in user_dir.iterdir():
    try:
        if item.is_dir():
            # shallow size + quick rglob
            s = sum(f.stat().st_size for f in item.rglob("*") if f.is_file() and not f.is_symlink())
            if s > 50 * 1024 * 1024:
                print(f"{item.name}: {s / (1024**3):.2f} GB")
    except Exception as e:
        print(f"Skipped {item.name}: {e}")


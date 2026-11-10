import os
import pathlib

for root in [r"C:\Users\Administrator", r"C:\inetpub", r"C:\ProgramData", r"C:\Config.Msi"]:
    p = pathlib.Path(root)
    if not p.exists(): continue
    for child in p.iterdir():
        if child.is_dir():
            try:
                # Get size of top files
                s = sum(f.stat().st_size for f in child.glob("*") if f.is_file())
                if s > 100 * 1024 * 1024:
                    print(f"{child}: {s / (1024**2):.1f} MB (direct files)")
            except Exception:
                pass


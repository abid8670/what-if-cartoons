import os
import pathlib

print("Scanning C: drive for files > 100MB (excluding Windows system files)...")
big_files = []
skip_dirs = {r"C:\Windows\System32", r"C:\Windows\WinSxS", r"C:\$Recycle.Bin", r"C:\System Volume Information"}

for root, dirs, files in os.walk(r"C:\Users"):
    for f in files:
        try:
            fp = os.path.join(root, f)
            s = os.path.getsize(fp)
            if s > 50 * 1024 * 1024: # > 50MB
                big_files.append((fp, s))
        except Exception:
            pass

big_files.sort(key=lambda x: x[1], reverse=True)
for fp, s in big_files[:20]:
    print(f"{s / (1024**2):.1f} MB : {fp}")


import os
import pathlib

c_users = pathlib.Path(r"C:\Users\Administrator")
sizes = {}
for p in c_users.iterdir():
    try:
        if p.is_dir() and not p.name.startswith("."):
            total = sum(f.stat().st_size for f in p.rglob("*") if f.is_file() and not f.is_symlink())
            sizes[p.name] = total
    except Exception:
        pass

for name, size in sorted(sizes.items(), key=lambda x: x[1], reverse=True)[:10]:
    print(f"{name}: {size / (1024**3):.2f} GB")


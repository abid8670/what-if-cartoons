import pathlib

base = pathlib.Path(r"D:\AI-Cartoons")
for p in base.rglob("*"):
    if any(part in p.parts for part in ["node_modules", ".git", ".gemini"]):
        continue
    if p.is_file() and p.suffix.lower() in [".png", ".jpg", ".jpeg", ".svg"]:
        print(f"{p.relative_to(base)} ({p.stat().st_size} bytes)")

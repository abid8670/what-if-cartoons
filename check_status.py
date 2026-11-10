import os, pathlib, glob

out = pathlib.Path(r"D:\AI-Cartoons\what-if-studio\out\no-gravity")
files = list(out.glob("*"))
print(f"Files in {out}: ({len(files)})")
for f in files:
    print(f"  {f.name}: {f.stat().st_size / 1e6:.2f} MB")

tmp = pathlib.Path(r"D:\temp")
tmp_dirs = list(tmp.glob("remotion*"))
print(f"Active remotion temp folders in D:\\temp: {len(tmp_dirs)}")


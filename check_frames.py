import os, pathlib, glob

tmp = pathlib.Path(r"D:\temp")
for d in tmp.glob("remotion*"):
    if d.is_dir():
        # count frames
        jpegs = list(d.glob("**/*.jpeg")) + list(d.glob("**/*.png"))
        print(f"Folder: {d.name}, frames rendered: {len(jpegs)}")


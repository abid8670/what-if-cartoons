import pathlib
from PIL import Image

tmp = pathlib.Path(r"D:\temp\react-motion-renderEw1ohB")
if tmp.exists():
    for fnum in [100, 300, 600, 1000]:
        f = tmp / f"element-{fnum:04d}.jpeg"
        if f.exists():
            im = Image.open(f)
            print(f"{f.name}: size={im.size}, mode={im.mode}")


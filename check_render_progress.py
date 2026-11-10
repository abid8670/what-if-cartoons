import pathlib

tmp = pathlib.Path(r"D:\temp")
for d in tmp.glob("react-motion*"):
    files = list(d.glob("*"))
    print(f"Folder: {d.name}, files count: {len(files)}")
    if files:
        # show last modified 3 files
        s = sorted(files, key=lambda x: x.stat().st_mtime, reverse=True)[:3]
        for f in s:
            print(f"  {f.name} ({f.stat().st_size} bytes)")


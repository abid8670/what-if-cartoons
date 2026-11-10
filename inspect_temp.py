import pathlib

tmp = pathlib.Path(r"D:\temp")
for item in tmp.iterdir():
    if item.is_dir():
        count = sum(1 for _ in item.rglob("*"))
        print(f"Dir: {item.name} ({count} items)")
    else:
        print(f"File: {item.name} ({item.stat().st_size} bytes)")


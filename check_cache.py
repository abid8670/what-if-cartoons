import os
import pathlib

for d in pathlib.Path("C:/").iterdir():
    if d.is_dir():
        try:
            # fast shallow check
            print(f"Checking {d.name}...")
        except Exception:
            pass

# Check npm cache
npm_cache = pathlib.Path(r"C:\Users\Administrator\AppData\Local\npm-cache")
if npm_cache.exists():
    print(f"npm-cache exists: {sum(f.stat().st_size for f in npm_cache.rglob('*') if f.is_file()) / (1024**2):.1f} MB")

# Check pip cache
pip_cache = pathlib.Path(r"C:\Users\Administrator\AppData\Local\pip\cache")
if pip_cache.exists():
    print(f"pip cache exists: {sum(f.stat().st_size for f in pip_cache.rglob('*') if f.is_file()) / (1024**2):.1f} MB")

# Check HuggingFace / torch cache
hf_cache = pathlib.Path(r"C:\Users\Administrator\.cache")
if hf_cache.exists():
    print(f".cache exists: {sum(f.stat().st_size for f in hf_cache.rglob('*') if f.is_file()) / (1024**2):.1f} MB")


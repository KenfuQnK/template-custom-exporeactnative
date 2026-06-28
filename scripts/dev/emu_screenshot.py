import subprocess
import sys
from io import BytesIO

from PIL import Image

device = sys.argv[1] if len(sys.argv) > 1 else "emulator-5554"
out_path = sys.argv[2] if len(sys.argv) > 2 else "emu_screen.png"
max_height = int(sys.argv[3]) if len(sys.argv) > 3 else 1600

raw = subprocess.run(
    ["adb", "-s", device, "exec-out", "screencap", "-p"],
    capture_output=True,
    check=True,
).stdout

img = Image.open(BytesIO(raw))
if img.height > max_height:
    ratio = max_height / img.height
    img = img.resize((int(img.width * ratio), max_height), Image.LANCZOS)

img.save(out_path)
print(f"saved {out_path} ({img.width}x{img.height})")

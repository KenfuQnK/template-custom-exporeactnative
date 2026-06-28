import subprocess
import sys

# Mantén este valor igual al max_height por defecto de emu_screenshot.py.
SCREENSHOT_MAX_HEIGHT = 1600


def get_device_height(device):
    output = subprocess.run(
        ["adb", "-s", device, "shell", "wm", "size"],
        capture_output=True,
        check=True,
        text=True,
    ).stdout
    line = [l for l in output.splitlines() if "size" in l.lower()][-1]
    _, height = line.split(":")[1].strip().split("x")
    return int(height)


device = sys.argv[1]
scale = get_device_height(device) / SCREENSHOT_MAX_HEIGHT

x1 = int(float(sys.argv[2]) * scale)
y1 = int(float(sys.argv[3]) * scale)
x2 = int(float(sys.argv[4]) * scale)
y2 = int(float(sys.argv[5]) * scale)
duration_ms = sys.argv[6] if len(sys.argv) > 6 else "300"

subprocess.run(
    ["adb", "-s", device, "shell", "input", "swipe", str(x1), str(y1), str(x2), str(y2), duration_ms],
    check=True,
)
print(f"swiped device ({x1},{y1}) -> ({x2},{y2})")

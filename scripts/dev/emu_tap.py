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
    # "wm size" puede imprimir "Physical size: WxH" y, si hay un override
    # activo, también "Override size: WxH" después — la última línea es la
    # que de verdad está renderizando, y la que coincide con la captura.
    line = [l for l in output.splitlines() if "size" in l.lower()][-1]
    _, height = line.split(":")[1].strip().split("x")
    return int(height)


device = sys.argv[1]
scale = get_device_height(device) / SCREENSHOT_MAX_HEIGHT

x = float(sys.argv[2]) * scale
y = float(sys.argv[3]) * scale

subprocess.run(["adb", "-s", device, "shell", "input", "tap", str(int(x)), str(int(y))], check=True)
print(f"tapped device coords ({int(x)}, {int(y)})")

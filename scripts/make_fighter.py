"""
Generate an original top-down X-wing-style fighter jet PNG (nose pointing UP),
transparent background. Homage, no trademarked assets. The cursor code rotates it
toward travel direction, so default 'up' makes the afterburner read behind it.
Output: public/assets/fighter.png
"""
from PIL import Image, ImageDraw, ImageFilter
import os

W = H = 512
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

cx = W / 2
HULL = (210, 224, 218, 255)
HULL_DK = (110, 124, 118, 255)
ACCENT = (16, 185, 129, 255)
GLOW = (110, 231, 183, 255)
DARK = (60, 72, 67, 255)

# --- fuselage (nose up) ---
# pointed nose at top, widening to engine block at bottom
d.polygon([
    (cx, 70),            # nose tip
    (cx - 26, 180),
    (cx - 34, 360),
    (cx + 34, 360),
    (cx + 26, 180),
], fill=HULL, outline=HULL_DK)

# cockpit canopy
d.ellipse([cx - 20, 150, cx + 20, 230], fill=(70, 110, 96, 255), outline=HULL_DK, width=3)
d.ellipse([cx - 12, 165, cx + 12, 205], fill=(150, 210, 188, 255))

# nose accent stripe
d.polygon([(cx, 78), (cx - 8, 120), (cx + 8, 120)], fill=ACCENT)

# --- four S-foil wings (X-wing) ---
# upper-left, upper-right, lower-left, lower-right swept wings
def wing(x_dir, y_base, length, sweep):
    bx = cx + x_dir * 28
    d.polygon([
        (bx, y_base - 18),
        (bx + x_dir * length, y_base - 18 - sweep),
        (bx + x_dir * length, y_base + 18 - sweep),
        (bx, y_base + 18),
    ], fill=HULL, outline=HULL_DK)
    # cannon tip
    tipx = bx + x_dir * length
    d.ellipse([tipx - 6, y_base - 22 - sweep, tipx + 6, y_base - 6 - sweep], fill=DARK)
    d.ellipse([tipx - 6, y_base + 6 - sweep, tipx + 6, y_base + 22 - sweep], fill=DARK)

wing(-1, 250, 150, 60)   # upper-left
wing(1, 250, 150, 60)    # upper-right
wing(-1, 320, 150, -40)  # lower-left
wing(1, 320, 150, -40)   # lower-right

# --- engine block + twin thruster glow at the bottom (rear) ---
d.rounded_rectangle([cx - 36, 345, cx + 36, 400], radius=12, fill=HULL_DK)
for ox in (-18, 18):
    ex, ey = cx + ox, 398
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(g)
    gd.ellipse([ex - 40, ey - 30, ex + 40, ey + 60], fill=GLOW)
    g = g.filter(ImageFilter.GaussianBlur(20))
    img.alpha_composite(g)
    d = ImageDraw.Draw(img)
    d.ellipse([ex - 12, ey - 10, ex + 12, ey + 18], fill=(180, 255, 220, 255))

# panel center line
d.line([(cx, 90), (cx, 360)], fill=(90, 104, 98, 120), width=2)

# soft drop shadow
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
shd = ImageDraw.Draw(sh)
shd.ellipse([cx - 120, 120, cx + 120, 420], fill=(0, 0, 0, 60))
sh = sh.filter(ImageFilter.GaussianBlur(30))
out = Image.alpha_composite(sh, img)

dest = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "fighter.png")
out.save(dest)
print("saved", os.path.abspath(dest))

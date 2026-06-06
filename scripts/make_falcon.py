"""
Generate an original top-down 'YT-1300-style' freighter PNG (a Millennium-Falcon
homage) with a transparent background. No trademarked assets used.
Output: public/assets/millennium-falcon.png
"""
from PIL import Image, ImageDraw, ImageFilter
import math, os

W = H = 1024
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(img)

cx, cy = W / 2, H / 2 + 30
HULL = (176, 188, 182, 255)
HULL_DK = (96, 110, 104, 255)
HULL_LT = (214, 230, 222, 255)
PANEL = (70, 84, 78, 255)
GLOW = (52, 211, 153, 255)

def ellipse(c, rx, ry, fill, outline=None, width=0):
    d.ellipse([c[0]-rx, c[1]-ry, c[0]+rx, c[1]+ry], fill=fill, outline=outline, width=width)

# main saucer disc
rx, ry = 360, 300
ellipse((cx, cy), rx, ry, HULL, outline=HULL_DK, width=8)

# subtle radial shading (lighter top-left)
shade = Image.new("RGBA", (W, H), (0, 0, 0, 0))
sd = ImageDraw.Draw(shade)
sd.ellipse([cx-rx*0.7-120, cy-ry*0.7-120, cx+rx*0.3-120, cy+ry*0.3-120], fill=(255, 255, 255, 60))
shade = shade.filter(ImageFilter.GaussianBlur(70))
img.alpha_composite(shade)
d = ImageDraw.Draw(img)

# front mandible prongs (the two forward arms) — pointing right
prong_w = 60
d.polygon([(cx+rx-30, cy-150), (cx+rx+150, cy-120), (cx+rx+150, cy-60), (cx+rx-40, cy-70)], fill=HULL, outline=HULL_DK)
d.polygon([(cx+rx-30, cy+150), (cx+rx+150, cy+120), (cx+rx+150, cy+60), (cx+rx-40, cy+70)], fill=HULL, outline=HULL_DK)
# gap detail between mandibles
d.rectangle([cx+rx-10, cy-30, cx+rx+150, cy+30], fill=(40, 50, 46, 255))

# panel ring lines
for rr in (0.55, 0.78, 0.95):
    d.ellipse([cx-rx*rr, cy-ry*rr, cx+rx*rr, cy+ry*rr], outline=(58, 70, 64, 120), width=3)
# radial panel spokes
for a in range(0, 360, 30):
    ar = math.radians(a)
    d.line([cx+math.cos(ar)*rx*0.5, cy+math.sin(ar)*ry*0.5,
            cx+math.cos(ar)*rx*0.93, cy+math.sin(ar)*ry*0.93],
           fill=(58, 70, 64, 90), width=2)

# central raised dome (sensor dish area)
ellipse((cx, cy), 130, 108, HULL_LT, outline=HULL_DK, width=6)
ellipse((cx, cy), 70, 58, PANEL)
ellipse((cx-18, cy-14), 30, 24, (150, 200, 178, 255))

# off-center cockpit pod (lower-right of disc)
cpx, cpy = cx + 210, cy + 150
ellipse((cpx, cpy), 64, 48, HULL_LT, outline=HULL_DK, width=6)
ellipse((cpx, cpy), 30, 22, (120, 180, 158, 255))

# two emerald engine glows at the rear (left edge)
for off in (-90, 90):
    ex, ey = cx - rx + 6, cy + off
    g = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(g)
    gd.ellipse([ex-70, ey-40, ex+70, ey+40], fill=GLOW)
    g = g.filter(ImageFilter.GaussianBlur(28))
    img.alpha_composite(g)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([ex-8, ey-30, ex+34, ey+30], radius=10, fill=(110, 231, 183, 255))

# faint drop shadow under hull for depth
sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
shd = ImageDraw.Draw(sh)
shd.ellipse([cx-rx, cy-ry+40, cx+rx, cy+ry+40], fill=(0, 0, 0, 70))
sh = sh.filter(ImageFilter.GaussianBlur(40))
out = Image.alpha_composite(sh, img)

os.makedirs(os.path.dirname(__file__).replace("scripts", "public/assets"), exist_ok=True)
dest = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "millennium-falcon.png")
out.save(dest)
print("saved", os.path.abspath(dest))

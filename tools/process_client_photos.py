#!/usr/bin/env python3
"""Turns Mani's selected site photos into the web images the site uses.

  python3 tools/process_client_photos.py "<WhatsApp export folder>" [out_dir]

Needs macOS `sips` plus ImageMagick (`magick`). For each entry below it:
  - straightens (`rot` degrees) and corrects converging verticals (`key`,
    fraction of the width pulled in at the top of the source)
  - crops to (`crop` = left, top, right, bottom as fractions removed)
  - grades tone (see grade()), keeping the real colours of the finishes
  - strips ALL metadata: iPhone originals carry the GPS of clients' homes
  - writes WebP at 640 and 1200 wide (1800 for `big` landscape crops)

Edits are limited to framing and tone. Nothing in a building is painted out.
"""
import glob, os, subprocess, sys, tempfile

# key: (WhatsApp export number, {options})
PHOTOS = {
    # Nedungundram, Mrs. Venkata Lakshmi
    # Card cover: the house front against the clouds, cropped to the facade
    'nedungundram-cover': (204, dict(rot=2, key=.04, crop=(.02, .11, .02, .45), big=True)),
    'nedungundram-1': (204, dict(rot=3, key=.05, crop=(.05, .05, .05, .44), big=True)),
    'nedungundram-2': (182, {}),
    'nedungundram-3': (190, {}),
    'nedungundram-4': (187, {}),
    'nedungundram-5': (158, {}),
    'nedungundram-6': (164, {}),
    'nedungundram-7': (196, dict(crop=(0, .02, 0, 0))),
    'nedungundram-8': (201, {}),
    # Mapedu, Mr. Prabhu
    # Low angle from the corner: the curved balconies climb into the sky
    'mapedu-1': (97, dict(rot=-1.5, crop=(.03, .0, .03, .08))),
    'mapedu-2': (103, {}),
    'mapedu-3': (108, {}),
    'mapedu-4': (110, {}),
    'mapedu-5': (122, {}),
    'mapedu-6': (123, {}),
    # Vandalur, Mrs. Selvi
    'selvi-1': (212, {}),
    'selvi-2': (209, {}),
    'selvi-3': (218, {}),
    'selvi-4': (223, {}),
    'selvi-5': (230, {}),
    'selvi-6': (239, {}),
    'selvi-7': (240, {}),
    # Mudichur, Mr. Ramesh
    'mudichur-1': (80, dict(key=.04, crop=(.0, .04, .0, .14))),
    'mudichur-2': (82, dict(key=.05, crop=(.01, .02, .01, .13))),
    # Thalambur, Mr. Pondhuran
    'thalambur-1': (129, {}),
    'thalambur-2': (127, {}),
    'thalambur-3': (128, {}),
    'thalambur-4': (147, {}),
    'thalambur-5': (154, {}),
    'thalambur-6': (134, {}),
    'thalambur-7': (149, {}),
    # Selaiyur, Mr. Joel
    'selaiyur-1': (94, dict(key=.05, crop=(.0, .0, .0, .33))),
    'selaiyur-2': (93, dict(crop=(.0, .08, .0, .12), night=True)),
    # Vandalur, Mr. Jabamani
    'jabamani-1': (251, dict(crop=(.0, .10, .0, .05), night=True)),
    'jabamani-2': (252, {}),
    'jabamani-3': (262, {}),
    'jabamani-4': (264, {}),
    'jabamani-5': (269, {}),
    'jabamani-6': (257, {}),
    # Porur, Mr. Sathish (3D renders: tone left alone)
    'porur-1': (88, dict(render=True)),
    'porur-2': (85, dict(render=True)),
    'porur-3': (89, dict(render=True)),
    # Crops for the About, Why and Services panels
    'about': (180, dict(key=.03, crop=(0, .20, 0, .24), big=True)),
    'why': (94, dict(key=.05, crop=(0, .12, 0, .31), big=True)),
    'service-construction': (99, dict(key=.10, crop=(.02, .12, .02, .36), big=True)),
    'service-interiors': (187, dict(key=.04, crop=(.02, .02, .02, .24), big=True)),
    'service-renovation': (222, dict(crop=(0, .18, 0, .10), big=True)),
}

# Night shots keep the old light-touch tone, so the lights stay bright.
TONE = ['-channel', 'RGB', '-contrast-stretch', '0.15%x0.1%', '+channel',
        '-sigmoidal-contrast', '2x50%', '-modulate', '101,106,100',
        '-unsharp', '0x0.8+0.35+0.01']


def grade(w, h):
    """Daylight grade, so the photos hold their own on the dark page:
    white walls roll off instead of clipping, mid-tones get depth and a
    little local contrast, colour is lifted and warmed slightly, and a soft
    vignette pulls the eye to the middle. Finishes keep their real colours."""
    return ['-channel', 'RGB', '-contrast-stretch', '0.3%x0.05%', '+channel',
            '(', '+clone', '-colorspace', 'gray', '-fx', 'u>0.75?1-(u-0.75)*0.5:1', ')',
            '-compose', 'Multiply', '-composite',
            '-sigmoidal-contrast', '3.4x48%',
            '-unsharp', '0x24+0.22+0',
            '-modulate', '100,114,100',
            '-channel', 'R', '-evaluate', 'multiply', '1.025',
            '-channel', 'B', '-evaluate', 'multiply', '0.955', '+channel',
            '(', '-size', f'{w}x{h}', "radial-gradient:white-#a8a8a8", '-level', '0,100%,1.8', ')',
            '-compose', 'Multiply', '-composite',
            '-unsharp', '0x0.8+0.35+0.01']


def source(folder, n):
    hits = [f for f in glob.glob(f'{folder}/{n:08d}-*') if f.lower().endswith(('.heic', '.jpg'))]
    if not hits:
        sys.exit(f'missing photo {n}')
    return hits[0]


def size(path):
    out = subprocess.check_output(['magick', 'identify', '-format', '%w %h', path], text=True)
    return map(int, out.split())


def process(folder, out, key, n, o):
    with tempfile.TemporaryDirectory() as tmp:
        base, master = f'{tmp}/base.jpg', f'{tmp}/master.png'
        subprocess.run(['sips', '-s', 'format', 'jpeg', '-s', 'formatOptions', '95', '-Z', '3000',
                        source(folder, n), '--out', base], capture_output=True, check=True)
        subprocess.run(['magick', base, '-auto-orient', '-strip', base], check=True)
        w, h = size(base)
        args = ['magick', base]
        if o.get('rot'):
            args += ['-background', 'black', '-distort', 'SRT', str(o['rot'])]
        if o.get('key'):
            k = o['key'] * w
            args += ['-distort', 'Perspective',
                     f'{k},0 0,0  {w - k},0 {w},0  0,{h} 0,{h}  {w},{h} {w},{h}']
        if o.get('crop'):
            l, t, r, b = o['crop']
            args += ['-crop', f'{int(w * (1 - l - r))}x{int(h * (1 - t - b))}+{int(w * l)}+{int(h * t)}', '+repage']
        subprocess.run(args + ['-strip', master], check=True)
        if o.get('night'):
            subprocess.run(['magick', master, *TONE, master], check=True)
        elif not o.get('render'):
            mw, mh = size(master)
            subprocess.run(['magick', master, *grade(mw, mh), master], check=True)
        cw, _ = size(master)
        for width in ([640, 1200, 1800] if o.get('big') else [640, 1200]):
            if width > cw and width != 640:
                width = cw
            subprocess.run(['magick', master, '-resize', f'{width}x', '-strip', '-quality', '66',
                            '-define', 'webp:method=6', f'{out}/{key}-{width}.webp'], check=True)


if __name__ == '__main__':
    folder = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else 'src/assets/photos'
    os.makedirs(out, exist_ok=True)
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(6) as ex:
        list(ex.map(lambda kv: process(folder, out, kv[0], kv[1][0], kv[1][1]), PHOTOS.items()))
    print(len(PHOTOS), 'photos written to', out)

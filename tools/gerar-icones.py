#!/usr/bin/env python3
"""
Gera o sprite de ícones pixel art do site (assets/img/icons/pixel-icons.png).

Cada ícone é uma célula de 16x16 px. Os ícones coloridos são desenhados em ASCII
(sem contorno) e o script centraliza e adiciona o contorno escuro sozinho, pra
todos ficarem com o mesmo estilo. Os "glifos" (setas, fechar, play...) são
brancos e sem contorno: o CSS os usa como máscara e pinta com currentColor.

Uso:  python tools/gerar-icones.py
Depois cole no css/style.css a lista de índices que o script imprime
(bloco "ÍCONES PIXEL ART") se a ordem ou a quantidade de ícones mudar.
"""
import os
import sys
from PIL import Image

CELL = 16

# ---------------------------------------------------------------- paleta
PAL = {
    "K": "#1a1a1a",  # contorno (mesmo --ink do site)
    "W": "#f5f1e6", "w": "#c6c6c6", "g": "#8b8b8b", "G": "#5b5b5b",
    "R": "#c83c32", "r": "#ee7a6a", "d": "#8a2620",
    "O": "#e8892b", "o": "#f5b95c",
    "Y": "#ffd84a", "y": "#d9a72e",
    "L": "#5d9c3f", "l": "#8fcf5e", "D": "#3f6e2a",
    "B": "#4f7fa8", "b": "#8ec5ea", "N": "#2d4a70",
    "P": "#7a4fb5", "p": "#b490e6", "u": "#2f1d52", "x": "#5a3a8c",
    "T": "#7b5233", "t": "#a97c46", "s": "#553620",
    "Q": "#c9ad6e", "q": "#ecd9a4",
    "S": "#f0c39a", "k": "#c98f66",
    "M": "#e86fa0",
}

# ---------------------------------------------------------------- ícones coloridos
# '.' = transparente. As linhas podem ter larguras diferentes; o script preenche.
COLOR = {}

COLOR["map"] = """
qqqqQqqqqQqqqq
qLLqQqqqqQqqbb
LLLqQRqqRQbbbb
qLLqQqRRqQbbbq
qqLqQqRRqQqbbq
qqqqQRqqRQqqbq
qqqqQqqqqQqqqq
qDqqQqqqqQqqqq
qqqqQqqqqQqqqq
QQQQQQQQQQQQQQ
"""

COLOR["portal"] = """
uuxuuuuuxuuu
xuuuuuuuuuux
uuPPPPpPPPuu
xuPPpPPPPPux
uuPpPPPPpPuu
uuPPPPPPPPxu
xuPPPpPPPPuu
uuPPPPPPpPuu
uuPPpPPPPPux
xuPPPPpPPPuu
uuPpPPPPPPuu
uuPPPPPPpPxu
xuuuuuuuuuux
uuxuuuuuxuuu
"""

COLOR["paw"] = """
...oo....oo...
...oo....oo...
...oO....Oo...
oo..........oo
oo..........oo
oO..oooooo..Oo
...oooooooo...
..oooooooooo..
..oooooooooO..
..ooooooooOO..
..ooo....OOO..
...oo....OO...
"""

COLOR["bread"] = """
...tttttttt...
.ttooooooootto
""".strip("\n")  # substituído abaixo (pão é gerado por código)

COLOR["house"] = """
......RR......
.....RrRR.....
....RrRRRR....
...RrRRRRRR...
..RrRRRRRRRR..
.RrRRRRRRRRRR.
RRRRRRRRRRRRRR
.qqqqqqqqqqqq.
.qbbqqqqTTTqq.
.qbbqqqqTTTqq.
.qqqqqqqTYTqq.
.qqqqqqqTTTqq.
"""

COLOR["mic"] = """
...wwwwww...
...wGwGww...
...wwGwGw...
...wGwGww...
...wwGwGw...
.g.wwwwww.g.
.g.RRRRRR.g.
.g.wwwwww.g.
.gg......gg.
..gggggggg..
.....gg.....
.....gg.....
..gggggggg..
"""

COLOR["backpack"] = """
...tttttt...
..t......t..
.bbbbbbbbbb.
bBBBBBBBBBBN
bBBBBBBBBBBN
bBBBBYYBBBBN
bBBBBBBBBBBN
bBBBBBBBBBBN
bBNNNNNNNNBN
bBNbbbbbbNBN
bBNBBBBBBNBN
bBNBBBBBBNBN
bBNNNNNNNNBN
.NNNNNNNNNN.
"""

COLOR["dove"] = """
..WW..........
.WWWW.....WW..
.WWwWW...WKWWO
.WWwwWW.WWWWLL
WWWwwWWWWWWW..
.WWWwwWWWWWW..
..WWWWWWWWW...
...wwWWWWWw...
.....wwww.....
"""

COLOR["palette"] = """
...tttttttt...
.tttttttttttt.
ttRRttYYtttttt
ttRRttYYtttttt
ttttttttttLLtt
tBBtttttttLLtt
tBBttttttttttt
ttttttttttttt.
.ttttt..ttttt.
..tttt..tttt..
"""

COLOR["handshake"] = """
....SS........
BBBSSSSSSSSRRR
BBBSSSSSSSSRRR
BBBSSSSSSSSRRR
BBBSkSkSkSSRRR
BBB.SkSkSk.RRR
....SSSSSS....
"""

COLOR["camera"] = """
...GGGG...RR..
GGGGGGGGGGGGGG
GwwwwwwwwwwwYG
GggggwwwwgggYG
GggwwbbbbwwggG
GggwbbWbbbwggG
GggwbbbbbbwggG
GggwwbbbbwwggG
GgggwwwwwwgggG
GGGGGGGGGGGGGG
"""

COLOR["chest"] = """
oooooooooooooo
tttttttttttttt
tttttttttttttt
tttttttttttttt
tttttttttttttt
ssssssYYssssss
TTTTTTYKTTTTTT
TTTTTTYYTTTTTT
TTTTTTTTTTTTTT
TTTTTTTTTTTTTT
TTTTTTTTTTTTTT
ssssssssssssss
"""

COLOR["coffee"] = """
...w..w.....
..w..w......
...w..w.....
............
.RRRRRRRR...
.RTTTTTTR...
.RRRRRRRRRR.
.RRRRRRRR.RR
.RRRRRRRR..R
.rRRRRRRR.RR
..rRRRRRRRR.
...wwwwww...
"""

COLOR["ram"] = """
LLLLLLLLLLLLLL
LGGGLGGGLGGGLL
LGGGLGGGLGGGLL
LGGGLGGGLGGGLL
LLLLLLLLLLLLLL
YYYYYYY.YYYYYY
YYYYYYY.YYYYYY
"""

COLOR["spool"] = """
..tttttt..
.tttttttt.
..PPpPPP..
..PpPPpP..
..PPPpPP..
..pPPPPp..
..PPpPPP..
..PpPPpP..
.tttttttt.
..tttttt..
"""

COLOR["floppy"] = """
BBBBBBBBBBB..
BBBBBBBBBBBB.
BBwwwwwwwBBBB
BBwwGGwwwBBBB
BBwwGGwwwBBBB
BBwwwwwwwBBBB
BBBBBBBBBBBBB
BBBBBBBBBBBBB
BBWWWWWWWWWBB
BBWgggggggWBB
BBWWWWWWWWWBB
BBWgggggggWBB
BNNNNNNNNNNNN
"""

COLOR["shield"] = """
wwwwwwwwwwww
wBBBBBBBBBBw
wBBBBBBBBBWw
wBBBBBBBBWBw
wBBBBBBBWBBw
wBBWBBBWBBBw
wBBBWBWBBBBw
.wBBBWBBBBw.
..wBBBBBBBw.
...wBBBBBw..
....wBBBw...
.....www....
"""

COLOR["cassette"] = """
gggggggggggggg
gWWWWWWWWWWWWg
gWRRRRRRRRRRWg
gWWWWWWWWWWWWg
gggggggggggggg
ggKKKKKKKKKKgg
ggKwwKKKKwwKgg
ggKKKKKKKKKKgg
gGGGGGGGGGGGGg
gggggggggggggg
"""

COLOR["note"] = """
..WWWWWWWWW
..WWWWWWWWW
..WW.....WW
..WW.....WW
..WW.....WW
..WW.....WW
WWWW...WWWW
WWWW...WWWW
.WW.....WW.
"""

COLOR["laptop"] = """
..GGGGGGGGGG..
..GbbbbbbbbG..
..GbbbbbbbbG..
..GbBbbbbbbG..
..GbbBbbbbbG..
..GGGGGGGGGG..
WWWWWWWWWWWWWW
wwwwwwwwwwwwww
.gggggggggggg.
"""

COLOR["phone"] = """
GGGGGGGG
GbbbbbbG
GbbbbbbG
GbBbbbbG
GbbBbbbG
GbbbbbbG
GbbbbbbG
GbbbbbbG
GGGGGGGG
GGGWWGGG
GGGGGGGG
"""

COLOR["heart"] = """
.RR...RR.
RrRR.RRRR
RrRRRRRRR
RRRRRRRRR
RRRRRRRRd
.RRRRRdd.
..RRRRd..
...RRd...
....d....
"""

COLOR["cpu"] = None
COLOR["signal"] = None
COLOR["wrench"] = None

# ---------------------------------------------------------------- glifos (brancos, sem contorno)
GLYPH = {}

GLYPH["close"] = None
GLYPH["play"] = None
GLYPH["pause"] = None
GLYPH["prev"] = None
GLYPH["next"] = None
GLYPH["arrow"] = None
GLYPH["ext"] = None
GLYPH["chev-r"] = None
GLYPH["chev-d"] = None
GLYPH["angle-l"] = None
GLYPH["angle-r"] = None


# ---------------------------------------------------------------- helpers
class Canvas:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.px = [["." for _ in range(w)] for _ in range(h)]

    def p(self, x, y, ch):
        if 0 <= x < self.w and 0 <= y < self.h:
            self.px[y][x] = ch

    def r(self, x, y, w, h, ch):
        for j in range(h):
            for i in range(w):
                self.p(x + i, y + j, ch)

    def line(self, x0, y0, x1, y1, ch, thick=1):
        n = max(abs(x1 - x0), abs(y1 - y0))
        for s in range(n + 1):
            x = round(x0 + (x1 - x0) * s / n) if n else x0
            y = round(y0 + (y1 - y0) * s / n) if n else y0
            for t in range(thick):
                self.p(x + t, y, ch)

    def rows(self):
        return ["".join(r) for r in self.px]


def from_ascii(txt):
    rows = [r for r in txt.strip("\n").split("\n") if r != ""]
    w = max(len(r) for r in rows)
    return [r.ljust(w, ".") for r in rows]


def make_bread():
    c = Canvas(14, 9)
    widths = [10, 12, 14, 14, 14, 14, 14, 12, 10]
    for y, w in enumerate(widths):
        x0 = (14 - w) // 2
        for i in range(w):
            ch = "t"
            if y <= 1:
                ch = "o"
            elif y >= 7:
                ch = "T"
            c.p(x0 + i, y, ch)
    for x in (3, 6, 9):
        c.p(x, 2, "T"); c.p(x + 1, 3, "T")
    for x in (3, 6, 9):
        c.p(x + 1, 2, "o")
    return c.rows()


def make_cpu():
    c = Canvas(14, 14)
    c.r(2, 2, 10, 10, "G")
    c.r(4, 4, 6, 6, "g")
    c.r(5, 5, 4, 4, "w")
    c.p(5, 5, "W"); c.p(6, 5, "W")
    for i in (3, 5, 8, 10):
        c.r(i, 0, 1, 2, "Y"); c.r(i, 12, 1, 2, "Y")
        c.r(0, i, 2, 1, "Y"); c.r(12, i, 2, 1, "Y")
    return c.rows()


def make_signal():
    c = Canvas(11, 11)
    for i, h in enumerate((3, 5, 8, 11)):
        c.r(i * 3, 11 - h, 2, h, "L")
        c.r(i * 3, 11 - h, 1, h, "l")
    return c.rows()


def make_wrench():
    c = Canvas(13, 13)
    # cabo diagonal
    c.line(2, 10, 8, 4, "w", 2)
    c.line(3, 11, 9, 5, "g", 1)
    c.r(0, 10, 3, 3, "g"); c.r(1, 11, 1, 1, ".")
    # cabeça (disco) com a boca aberta pra cima e pra direita
    for y in range(0, 8):
        for x in range(5, 13):
            if (x - 9) ** 2 + (y - 3) ** 2 <= 13:
                c.p(x, y, "w")
    for y in range(0, 5):
        for x in range(8, 13):
            if x - 8 >= (4 - y) - 1 and y <= 3 and x >= 9:
                c.p(x, y, ".")
    return c.rows()


# glifos ------------------------------------------------------------
def glyph_canvas():
    return Canvas(CELL, CELL)


def tri_right(c, x0, y0, widths):
    for j, w in enumerate(widths):
        c.r(x0, y0 + j, w, 1, "W")


def tri_left(c, x1, y0, widths):  # x1 = coluna da direita
    for j, w in enumerate(widths):
        c.r(x1 - w + 1, y0 + j, w, 1, "W")


TRI10 = [2, 4, 6, 8, 10, 10, 8, 6, 4, 2]


def make_glyph(name):
    c = glyph_canvas()
    if name == "close":
        for i in range(10):
            for t in range(2):
                c.p(3 + i + t, 3 + i, "W")
                c.p(12 - i - t, 3 + i, "W")
    elif name == "play":
        tri_right(c, 3, 3, TRI10)
    elif name == "pause":
        c.r(3, 3, 3, 10, "W"); c.r(10, 3, 3, 10, "W")
    elif name == "prev":
        c.r(1, 3, 2, 10, "W")
        tri_left(c, 14, 3, TRI10)
    elif name == "next":
        c.r(13, 3, 2, 10, "W")
        tri_right(c, 2, 3, TRI10)
    elif name == "arrow":
        head = [1, 2, 3, 4, 5, 5, 4, 3, 2, 1]
        for j, w in enumerate(head):
            c.r(5, 3 + j, w, 1, "W")
        c.r(1, 7, 9, 2, "W")  # haste (linhas 7-8, centro do desenho) até a ponta
    elif name == "ext":
        c.r(6, 3, 7, 2, "W")
        c.r(11, 3, 2, 8, "W")
        for i in range(8):
            c.r(3 + i, 12 - i, 2, 1, "W")
    elif name == "chev-r":
        for j, w in enumerate([1, 2, 3, 4, 5, 5, 4, 3, 2, 1]):
            c.r(5, 3 + j, w, 1, "W")
    elif name in ("angle-l", "angle-r"):
        for i in range(5):
            for y in (3 + i, 12 - i):
                c.r(4 + i if name == "angle-r" else 10 - i, y, 2, 1, "W")
    elif name == "chev-d":
        for j, w in enumerate([9, 7, 5, 3, 1]):
            c.r(3 + (9 - w) // 2, 5 + j, w, 1, "W")
    return c.rows()


# ---------------------------------------------------------------- render
def outline(grid):
    """grid: lista de strings sem contorno -> matriz 16x16 com contorno 'K' (vizinhança 4)."""
    h, w = len(grid), len(grid[0])
    assert w <= CELL - 2 and h <= CELL - 2, f"sprite grande demais: {w}x{h}"
    ox, oy = (CELL - w) // 2, (CELL - h) // 2
    m = [["." for _ in range(CELL)] for _ in range(CELL)]
    for y in range(h):
        for x in range(w):
            if grid[y][x] != ".":
                m[oy + y][ox + x] = grid[y][x]
    out = [row[:] for row in m]
    for y in range(CELL):
        for x in range(CELL):
            if m[y][x] != ".":
                continue
            for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                nx, ny = x + dx, y + dy
                if 0 <= nx < CELL and 0 <= ny < CELL and m[ny][nx] != ".":
                    out[y][x] = "K"
                    break
    return out


def center_only(grid_rows):
    m = [list(r) for r in grid_rows]
    return m


def to_image(cells, glyph=False):
    img = Image.new("RGBA", (CELL, CELL), (0, 0, 0, 0))
    for y, row in enumerate(cells):
        for x, ch in enumerate(row):
            if ch == ".":
                continue
            hexv = PAL[ch].lstrip("#")
            img.putpixel((x, y), (int(hexv[0:2], 16), int(hexv[2:4], 16), int(hexv[4:6], 16), 255))
    return img


def main():
    generated = {
        "bread": make_bread(), "cpu": make_cpu(), "signal": make_signal(), "wrench": make_wrench(),
    }
    order = []   # (kind, name, image)
    for name, txt in COLOR.items():
        rows = generated[name] if name in generated else from_ascii(txt)
        order.append(("color", name, to_image(outline(rows))))
    for name in GLYPH:
        order.append(("glyph", name, to_image(make_glyph(name))))

    sheet = Image.new("RGBA", (CELL * len(order), CELL), (0, 0, 0, 0))
    for i, (_, _, im) in enumerate(order):
        sheet.paste(im, (i * CELL, 0))

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    dest = os.path.join(root, "assets", "img", "icons")
    os.makedirs(dest, exist_ok=True)
    sheet.save(os.path.join(dest, "pixel-icons.png"), optimize=True)

    print(f"{len(order)} ícones -> assets/img/icons/pixel-icons.png ({sheet.width}x{sheet.height})")
    print("/* índices no sprite (gerado por tools/gerar-icones.py) */")
    print(f".px-icon, .px-glyph{{ --n: {len(order)}; }}")
    for i, (kind, name, _) in enumerate(order):
        cls = "px-icon" if kind == "color" else "px-glyph"
        print(f".{cls}--{name}{{ --i: {i}; }}")

    # folha de contato pra revisar o desenho (opcional): --sheet caminho.png
    if "--sheet" in sys.argv:
        path = sys.argv[sys.argv.index("--sheet") + 1]
        S = 6
        per = 9
        rows_n = (len(order) + per - 1) // per
        pad = 6
        cw = CELL * S + pad
        contact = Image.new("RGBA", (cw * per + pad, cw * rows_n + pad), (26, 26, 26, 255))
        for i, (kind, name, im) in enumerate(order):
            big = im.resize((CELL * S, CELL * S), Image.NEAREST)
            bg = Image.new("RGBA", big.size, (123, 82, 51, 255) if i % 2 == 0 else (198, 198, 198, 255))
            bg.alpha_composite(big)
            contact.paste(bg, (pad + (i % per) * cw, pad + (i // per) * cw))
        contact.save(path)


if __name__ == "__main__":
    main()

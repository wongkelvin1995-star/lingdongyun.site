#!/usr/bin/env python3
"""生成 src/components/HeroArt.astro：发光线框地球 + 两条轨道（lingdongyun.site v3）。

用法（在项目根目录）：python3 scripts/gen-heroart.py   # 默认写入 src/components/HeroArt.astro

Orthographic projection of a unit sphere, camera elevated by ELEV degrees, image rolled by ROLL degrees.
Front (z>0) and back (z<0) halves of each graticule line are emitted separately so the back can be dimmer.
Only the orbit dashes are animated (stroke-dashoffset); everything else is static.
"""
import math
import os
import random
import sys

W, H = 680, 560
CX, CY, R = 340.0, 280.0, 184.0
ELEV = math.radians(22)
ROLL = math.radians(-14)


def rot_roll(x, y):
    c, s = math.cos(ROLL), math.sin(ROLL)
    return x * c - y * s, x * s + y * c


def project(lat, lon, alt=1.0):
    """lat/lon in degrees (lon relative to view centre) -> (X, Y, z)."""
    la, lo = math.radians(lat), math.radians(lon)
    x = math.cos(la) * math.sin(lo) * alt
    y = math.sin(la) * alt
    z = math.cos(la) * math.cos(lo) * alt
    # camera elevation: rotate about x so the north pole leans toward the viewer
    y2 = y * math.cos(ELEV) - z * math.sin(ELEV)
    z2 = y * math.sin(ELEV) + z * math.cos(ELEV)
    rx, ry = rot_roll(x, y2)
    return CX + R * rx, CY - R * ry, z2


def vec(lat, lon):
    la, lo = math.radians(lat), math.radians(lon)
    return (math.cos(la) * math.sin(lo), math.sin(la), math.cos(la) * math.cos(lo))


def proj_vec(v, alt=1.0):
    x, y, z = (c * alt for c in v)
    y2 = y * math.cos(ELEV) - z * math.sin(ELEV)
    z2 = y * math.sin(ELEV) + z * math.cos(ELEV)
    rx, ry = rot_roll(x, y2)
    return CX + R * rx, CY - R * ry, z2


def f(n):
    s = f'{n:.1f}'
    return s[:-2] if s.endswith('.0') else s


def split_paths(points):
    """points: list of (X, Y, z). Return (front_d, back_d) path strings."""
    front, back = [], []
    cur, cur_front = [], None
    for X, Y, z in points:
        is_front = z >= 0
        if cur_front is None:
            cur_front = is_front
        if is_front != cur_front:
            # close the current run at this point for continuity
            cur.append((X, Y))
            (front if cur_front else back).append(cur)
            cur, cur_front = [(X, Y)], is_front
        else:
            cur.append((X, Y))
    if cur:
        (front if cur_front else back).append(cur)

    def d(runs):
        out = []
        for run in runs:
            if len(run) < 2:
                continue
            out.append('M' + ' '.join(f'{f(x)} {f(y)}' for x, y in run))
        return ''.join(out)
    return d(front), d(back)


# graticule ---------------------------------------------------------------
lat_lines = []
for lat in (-60, -30, 0, 30, 60):
    pts = [project(lat, lon) for lon in range(0, 361, 4)]
    lat_lines.append((lat, *split_paths(pts)))
mer_lines = []
for lon in range(0, 180, 30):
    pts = [project(lat, lon) for lat in range(-90, 91, 4)] + [project(lat, lon + 180) for lat in range(90, -91, -4)]
    mer_lines.append((lon, *split_paths(pts)))

# nodes and elevated arcs --------------------------------------------------
NODES = [(30, -44), (44, 4), (14, 34), (-12, -14), (-36, 26)]
EDGES = [(0, 1), (1, 2), (0, 3), (3, 2), (3, 4)]
node_xy = [project(la, lo) for la, lo in NODES]


def slerp(a, b, t):
    dot = max(-1.0, min(1.0, sum(x * y for x, y in zip(a, b))))
    om = math.acos(dot)
    if om < 1e-6:
        return a
    s1 = math.sin((1 - t) * om) / math.sin(om)
    s2 = math.sin(t * om) / math.sin(om)
    return tuple(s1 * x + s2 * y for x, y in zip(a, b))


arcs = []
for i, j in EDGES:
    a, b = vec(*NODES[i]), vec(*NODES[j])
    pts = []
    for k in range(0, 41):
        t = k / 40
        v = slerp(a, b, t)
        alt = 1 + 0.13 * math.sin(math.pi * t)
        X, Y, _ = proj_vec(v, alt)
        pts.append((X, Y))
    arcs.append('M' + ' '.join(f'{f(x)} {f(y)}' for x, y in pts))

# stars -------------------------------------------------------------------
rnd = random.Random(7)
stars = []
while len(stars) < 26:
    x, y = rnd.uniform(12, W - 12), rnd.uniform(12, H - 12)
    if math.hypot(x - CX, y - CY) < R * 1.25:
        continue
    stars.append((x, y, rnd.choice((0.7, 0.9, 1.1, 1.3)), rnd.choice((0.22, 0.32, 0.45, 0.6))))

# orbits ------------------------------------------------------------------
ORBITS = [  # rx, ry, angle(deg), class, satellites (local angle deg)
    (300, 80, -20, 'o1', (58, 152)),
    (232, 58, 24, 'o2', (118,)),
]


def sat_xy(rx, ry, ang, t):
    a, th = math.radians(ang), math.radians(t)
    x, y = rx * math.cos(th), ry * math.sin(th)
    return CX + x * math.cos(a) - y * math.sin(a), CY + x * math.sin(a) + y * math.cos(a)


L = []
w = L.append
w('---')
w('// 首页 Hero 插画：线框地球与两条轨道（v3 夜空蓝）。几何由 scripts/gen-heroart.py 生成，请改脚本后重新生成，不要手改坐标。')
w('// 仅轨道上的虚线缓慢流动；其余元素静止；prefers-reduced-motion 时全部静止。纯装饰，不含文字。')
w('---')
w(f'<svg class="hero-art" viewBox="0 0 {W} {H}" width="{W}" height="{H}" role="img" aria-labelledby="hero-art-title hero-art-desc">')
w('  <title id="hero-art-title">线框地球与轨道示意插画</title>')
w('  <desc id="hero-art-desc">深色背景上，一颗由经纬线构成的发光地球被两条轨道环绕，几个节点之间以弧线相连，表示网络连接的概念，并非产品界面截图。</desc>')
w('  <defs>')
w(f'    <radialGradient id="ha-halo" cx="{f(CX)}" cy="{f(CY)}" r="{f(R * 1.62)}" gradientUnits="userSpaceOnUse">')
w('      <stop offset="0.56" stop-color="#2F7BFF" stop-opacity="0.26" />')
w('      <stop offset="0.72" stop-color="#3D6BFF" stop-opacity="0.09" />')
w('      <stop offset="1" stop-color="#4B3BFF" stop-opacity="0" />')
w('    </radialGradient>')
w(f'    <radialGradient id="ha-disk" cx="{f(CX - R * 0.32)}" cy="{f(CY - R * 0.38)}" r="{f(R * 1.45)}" gradientUnits="userSpaceOnUse">')
w('      <stop offset="0" stop-color="#16295A" />')
w('      <stop offset="0.5" stop-color="#0A1533" />')
w('      <stop offset="1" stop-color="#050913" />')
w('    </radialGradient>')
w(f'    <radialGradient id="ha-fresnel" cx="{f(CX)}" cy="{f(CY)}" r="{f(R)}" gradientUnits="userSpaceOnUse">')
w('      <stop offset="0.74" stop-color="#2F7BFF" stop-opacity="0" />')
w('      <stop offset="1" stop-color="#4C8DFF" stop-opacity="0.28" />')
w('    </radialGradient>')
w(f'    <linearGradient id="ha-rim" x1="{f(CX - R)}" y1="{f(CY - R)}" x2="{f(CX + R * 0.7)}" y2="{f(CY + R)}" gradientUnits="userSpaceOnUse">')
w('      <stop offset="0" stop-color="#B9D6FF" stop-opacity="0.95" />')
w('      <stop offset="0.45" stop-color="#5C9BFF" stop-opacity="0.45" />')
w('      <stop offset="1" stop-color="#2F7BFF" stop-opacity="0.08" />')
w('    </linearGradient>')
w('    <radialGradient id="ha-node" r="0.5">')
w('      <stop offset="0" stop-color="#9CC6FF" stop-opacity="0.75" />')
w('      <stop offset="1" stop-color="#2F7BFF" stop-opacity="0" />')
w('    </radialGradient>')
w('    <clipPath id="ha-front"><rect x="-420" y="0" width="840" height="420" /></clipPath>')
w('  </defs>')
w('')
w('  <!-- 星点与大气光晕 -->')
w('  <g class="ha-stars" fill="#CFE0FF">')
for x, y, r, o in stars:
    w(f'    <circle cx="{f(x)}" cy="{f(y)}" r="{r}" opacity="{o}" />')
w('  </g>')
w(f'  <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(R * 1.62)}" fill="url(#ha-halo)" />')
w('')
w('  <!-- 轨道（完整一圈，位于地球之后） -->')
for rx, ry, ang, cls, _ in ORBITS:
    w(f'  <g transform="translate({f(CX)} {f(CY)}) rotate({ang})">')
    w(f'    <ellipse class="ha-track" rx="{rx}" ry="{ry}" />')
    w(f'    <ellipse class="ha-dash {cls}" rx="{rx}" ry="{ry}" />')
    w('  </g>')
w('')
w('  <!-- 地球 -->')
w(f'  <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(R)}" fill="url(#ha-disk)" opacity="0.96" />')
w('  <g class="ha-grid-back" fill="none">')
for lat, fr, bk in lat_lines:
    if bk:
        w(f'    <path d="{bk}" />')
for lon, fr, bk in mer_lines:
    if bk:
        w(f'    <path d="{bk}" />')
w('  </g>')
w('  <g class="ha-grid" fill="none">')
for lat, fr, bk in lat_lines:
    if fr:
        cls = ' class="eq"' if lat == 0 else ''
        w(f'    <path{cls} d="{fr}" />')
for lon, fr, bk in mer_lines:
    if fr:
        w(f'    <path d="{fr}" />')
w('  </g>')
w(f'  <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(R)}" fill="url(#ha-fresnel)" />')
w(f'  <circle cx="{f(CX)}" cy="{f(CY)}" r="{f(R)}" fill="none" stroke="url(#ha-rim)" stroke-width="1.5" />')
w('')
w('  <!-- 节点与连线 -->')
w('  <g class="ha-arcs" fill="none">')
for d in arcs:
    w(f'    <path d="{d}" />')
w('  </g>')
w('  <g class="ha-nodes">')
for X, Y, z in node_xy:
    w(f'    <circle cx="{f(X)}" cy="{f(Y)}" r="11" fill="url(#ha-node)" />')
    w(f'    <circle cx="{f(X)}" cy="{f(Y)}" r="2.6" fill="#EAF3FF" />')
w('  </g>')
w('')
w('  <!-- 轨道前半段（压在地球之上） -->')
for rx, ry, ang, cls, sats in ORBITS:
    w(f'  <g transform="translate({f(CX)} {f(CY)}) rotate({ang})" clip-path="url(#ha-front)">')
    w(f'    <ellipse class="ha-track" rx="{rx}" ry="{ry}" />')
    w(f'    <ellipse class="ha-dash {cls}" rx="{rx}" ry="{ry}" />')
    w('  </g>')
w('  <g class="ha-sats">')
for rx, ry, ang, cls, sats in ORBITS:
    for t in sats:
        X, Y = sat_xy(rx, ry, ang, t)
        w(f'    <circle cx="{f(X)}" cy="{f(Y)}" r="9" fill="url(#ha-node)" />')
        w(f'    <circle cx="{f(X)}" cy="{f(Y)}" r="3" fill="#FFFFFF" />')
w('  </g>')
w('</svg>')
w('')
w('<style>')
w('  .hero-art { width: 100%; height: auto; overflow: visible; }')
w('  .ha-grid { stroke: #7DB4FF; stroke-width: 1; stroke-opacity: 0.3; }')
w('  .ha-grid .eq { stroke-opacity: 0.55; }')
w('  .ha-grid-back { stroke: #7DB4FF; stroke-width: 1; stroke-opacity: 0.08; }')
w('  .ha-arcs { stroke: #9CC6FF; stroke-width: 1.3; stroke-opacity: 0.75; stroke-linecap: round; }')
w('  .ha-track { fill: none; stroke: #7DB4FF; stroke-opacity: 0.14; stroke-width: 1; }')
w('  .ha-dash { fill: none; stroke: #8FBFFF; stroke-width: 1.6; stroke-linecap: round; }')
w('  .ha-dash.o1 { stroke-dasharray: 3 9; animation: ha-orbit 90s linear infinite; }')
w('  .ha-dash.o2 { stroke-opacity: 0.7; stroke-dasharray: 2 12; animation: ha-orbit 140s linear infinite reverse; }')
w('  /* 位移量是虚线周期（12 / 14）的整数倍，循环处无跳动 */')
w('  .ha-dash.o2 { animation-name: ha-orbit-2; }')
w('  @keyframes ha-orbit { to { stroke-dashoffset: -1200; } }')
w('  @keyframes ha-orbit-2 { to { stroke-dashoffset: -1400; } }')
w('  @media (prefers-reduced-motion: reduce) { .ha-dash.o1, .ha-dash.o2 { animation: none; } }')
w('</style>')

out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'components', 'HeroArt.astro')
with open(out, 'w', encoding='utf-8') as fh:
    fh.write('\n'.join(L) + '\n')
print('wrote', out, sum(len(x) + 1 for x in L), 'bytes')

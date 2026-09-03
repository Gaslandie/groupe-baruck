#!/usr/bin/env python3
"""Extraction et défiligranage des planches PDF « Brouillon PDF » de la Fondation Espoir de Vie.

Usage : python3 dewatermark.py --out <dossier> [--blur 1.2] <pdf1> <pdf2> ...
Dépendances : poppler-utils (pdfimages), numpy, Pillow.

Méthode (Dekel et al., CVPR 2017, adaptée) : le filigrane semi-transparent est identique
sur toutes les pages de même format, sur une lattice carrée. On l'estime à partir des zones
de fond noir (minimum pixel à pixel, médiane le long de la lattice, puis médiane des
observations sur les pages de fond), puis on inverse le fondu normal
c = (obs - 255*alpha) / (1 - alpha), on ré-interpole la chrominance sous les lettres
(perdue par le 4:2:0 JPEG) et on lisse légèrement les traits (ringing JPEG).
Les sous-photos sont ensuite découpées sur les gouttières noires (XY-cut).
"""
import argparse, glob, json, os, re, shutil, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

CONTEXTE_DEFAUT = {
 'livre1-002': ('23 décembre 2015', 'Grôh, département de Hiré, Côte d’Ivoire', 'Noël : distribution de 100 jouets aux enfants du village'),
 'livre1-003': ('23 décembre 2015', 'Grôh, département de Hiré, Côte d’Ivoire', 'Noël : distribution de 100 jouets aux enfants du village'),
 'livre1-004': ('2015', 'Zaroko, département de Hiré, Côte d’Ivoire', 'Fête des mères (1re édition, MCA) et kits scolaires aux orphelins'),
 'livre1-005': ('rentrée scolaire (année non précisée)', 'Zaroko, Côte d’Ivoire', 'Distribution de kits scolaires aux enfants orphelins'),
 'livre1-006': ('rentrée scolaire (année non précisée)', 'Zaroko, Côte d’Ivoire', 'Distribution de kits scolaires aux enfants orphelins'),
 'livre1-007': ('rentrée 2016-2017', 'Quartier Dialogue, Divo, Côte d’Ivoire', 'Kits scolaires et vivres à 200 orphelins'),
 'livre1-008': ('rentrée 2016-2017', 'Quartier Dialogue, Divo, Côte d’Ivoire', 'Kits scolaires et vivres à 200 orphelins'),
 'livre1-009': ('date non précisée', 'Côte d’Ivoire', 'Soutien aux veuves : 500 000 fr pour l’entrepreneuriat et vivres'),
 'livre1-010': ('date non précisée', 'Côte d’Ivoire', 'Dons de vivres et non-vivres à la Fondation Marie Rose Guiro'),
 'livre1-011': ('avant février 2017', 'Orphelinat Espoir de Vie', 'Visite du président fondateur sur le chantier de l’orphelinat'),
 'livre1-012': ('avant février 2017', 'Orphelinat Espoir de Vie', 'Visite de l’orphelinat avant l’ameublement (façade, panneau des droits de l’enfant)'),
 'livre1-013': ('depuis le 11 février 2017', 'Orphelinat Espoir de Vie', 'Accueil des premiers pensionnaires (dortoirs, bureau, cuisine, nourrissons)'),
 'livre2-002': ('15 février 2017', 'Orphelinat Espoir de Vie', 'Inauguration : danses, fanfare, chefs coutumiers, autorités'),
 'livre2-003': ('15 février 2017', 'Orphelinat Espoir de Vie', 'Inauguration : coupure du ruban'),
 'livre2-004': ('février 2017', 'Orphelinat Espoir de Vie', 'Visite des locaux (presse, dortoirs, berceaux)'),
 'livre2-005': ('2017', 'Orphelinat Espoir de Vie', 'Dons de vêtements aux enfants'),
 'livre2-006': ('04 mars 2017', 'Orphelinat Espoir de Vie', 'Repas partagé entre le président fondateur et les enfants'),
 'livre2-007': ('date non précisée', 'Divo, Côte d’Ivoire', 'Remise de 4 000 chaussures aux enfants démunis (avant/après)'),
 'livre2-008': ('date non précisée', 'Divo, Côte d’Ivoire', 'Remise de 4 000 chaussures aux enfants démunis (avant/après)'),
 'livre2-009': ('03 juin 2017', 'Zaroko, Côte d’Ivoire', 'Distribution de 2 000 chaussures aux enfants du village'),
 'livre2-010': ('date non précisée', 'Orphelinat Espoir de Vie', 'Visite d’une ONG française'),
 'livre2-011': ('date non précisée', 'Orphelinat Espoir de Vie', 'Visite d’une ONG française (photo de groupe, remise de kente, repas)'),
 'livre2-012': ('fête des mères (année non précisée)', 'Église M.C.A', 'Dons aux mamans de l’église'),
 'livre2-013': ('date non précisée', 'Burkina Faso', 'Tournée africaine : soutien financier et repas aux enfants de la rue'),
 'livre2-014': ('réveillon de la Saint-Sylvestre (année non précisée)', 'Burkina Faso / N’Zérékoré (encart Guinée)', 'Gâteau d’anniversaire partagé avec les sans-abri ; encart Espoir de Vie Guinée'),
 'livre2-015': ('date non précisée', 'Guinée', 'Espoir de Vie Guinée : santé, alimentation, éducation ; équipes de terrain'),
}

def log(*a): print(*a, flush=True)

# ---------------------------------------------------------------- outils
def box(img, r, H, W):
    """somme sur fenêtre (2r+1)² via sommes cumulées (bords à zéro)"""
    p = np.pad(img, r + 1); c = p.cumsum(0).cumsum(1)
    return c[2*r+1:2*r+1+H, 2*r+1:2*r+1+W] - c[0:H, 2*r+1:2*r+1+W] - c[2*r+1:2*r+1+H, 0:W] + c[0:H, 0:W]

def lattice_fill(img, v1, v2, K=4):
    """médiane le long de la lattice (v1, v2), NaN ignorés"""
    H, W = img.shape; shifts = []
    for i in range(-K, K + 1):
        for j in range(-K, K + 1):
            dy = i * v1[0] + j * v2[0]; dx = i * v1[1] + j * v2[1]
            if abs(dy) >= H or abs(dx) >= W: continue
            sh = np.full((H, W), np.nan, dtype=np.float32)
            ys = slice(max(0, -dy), min(H, H - dy)); xs = slice(max(0, -dx), min(W, W - dx))
            ys2 = slice(max(0, dy), min(H, H + dy)); xs2 = slice(max(0, dx), min(W, W + dx))
            sh[ys, xs] = img[ys2, xs2]; shifts.append(sh)
    with np.errstate(all='ignore'):
        return np.nanmedian(np.stack(shifts), axis=0)

def find_lattice(g):
    """vecteurs de répétition du filigrane par autocorrélation (pics de norme >= 150 px)"""
    H, W = g.shape; gz = g - g.mean()
    F = np.fft.rfft2(gz); ac = np.fft.fftshift(np.fft.irfft2(F * np.conj(F), s=gz.shape))
    cy, cx = H // 2, W // 2; ac[cy - 150:cy + 151, cx - 150:cx + 151] = -np.inf
    peaks = []
    for i in np.argsort(ac.ravel())[::-1][:5000]:
        y, x = divmod(int(i), W); dy, dx = y - cy, x - cx
        if dy < 0 or (dy == 0 and dx < 0): continue
        if any(abs(dy - py) < 12 and abs(dx - px) < 12 for py, px in peaks): continue
        peaks.append((dy, dx))
        if len(peaks) >= 6: break
    peaks.sort(key=lambda p: p[0] ** 2 + p[1] ** 2)
    v1 = peaks[0]; v2 = next(p for p in peaks[1:] if abs(p[0] * v1[1] - p[1] * v1[0]) > 20000)
    return v1, v2

# ---------------------------------------------------------------- estimation alpha
def estimate_alpha(stack, v1, v2, passes=2):
    N, H, W, _ = stack.shape
    g = stack.min(axis=0).astype(np.float32).mean(axis=2)
    alpha = np.nan_to_num(lattice_fill(g, v1, v2), nan=0.0) / 255.0            # passe 0 : médiane de lattice du minimum
    gray = stack.sum(axis=3, dtype=np.float32) / 3.0
    for p in range(passes):
        clean = alpha < (0.08 if p == 0 else 0.06)
        bg = np.zeros((N, H, W), bool)
        for i in range(N):
            dark = (stack[i].max(axis=2) < 8) & clean
            m = Image.fromarray((dark * 255).astype(np.uint8))
            m = m.filter(ImageFilter.MinFilter(7)).filter(ImageFilter.MaxFilter(7))    # ouverture : ombres ponctuelles
            m = m.filter(ImageFilter.MaxFilter(31)).filter(ImageFilter.MinFilter(31))  # fermeture : englobe les lettres
            bg[i] = np.asarray(m) > 127
        cnt = bg.sum(axis=0)
        alpha_bg = np.full((H, W), np.nan, dtype=np.float32)
        for y0 in range(0, H, 50):
            sl = slice(y0, min(H, y0 + 50))
            with np.errstate(all='ignore'):
                med = np.nanmedian(np.where(bg[:, sl], gray[:, sl], np.nan), axis=0)
            alpha_bg[sl] = np.where(cnt[sl] >= 3, med / 255.0, np.nan)
        alpha_bg[alpha_bg > 0.4] = np.nan                                              # traits fins clairs → lattice
        alpha = np.where(np.isnan(alpha_bg), lattice_fill(alpha_bg, v1, v2), alpha_bg)
        alpha = np.nan_to_num(alpha, nan=0.0).astype(np.float32)
        alpha[alpha < 0.03] = 0; alpha = np.clip(alpha, 0, 0.4)
        log(f'  passe {p + 1}: alpha médian sur lettres {np.median(alpha[alpha > 0.1]):.3f}, estimation directe sur {100 * (~np.isnan(alpha_bg)).mean():.1f} % des pixels')
    return alpha

# ---------------------------------------------------------------- restauration
def restore(obs_u8, alpha, blur):
    H, W = alpha.shape; obs = obs_u8.astype(np.float32); a3 = alpha[..., None]
    rest = np.clip((obs - a3 * 255) / (1 - a3), 0, 255)
    glyph = box((alpha > 0.04).astype(np.float32), 2, H, W) > 0
    free = (~glyph).astype(np.float32); den = box(free, 7, H, W)
    R, G, B = rest[..., 0], rest[..., 1], rest[..., 2]
    Y = 0.299 * R + 0.587 * G + 0.114 * B
    Cb = 128 - 0.168736 * R - 0.331264 * G + 0.5 * B; Cr = 128 + 0.5 * R - 0.418688 * G - 0.081312 * B
    fill = lambda ch: np.where(glyph & (den > 0), box(ch * free, 7, H, W) / np.maximum(den, 1), ch)
    Cb, Cr = fill(Cb), fill(Cr)
    out = np.clip(np.stack([Y + 1.402 * (Cr - 128), Y - 0.344136 * (Cb - 128) - 0.714136 * (Cr - 128), Y + 1.772 * (Cb - 128)], axis=2), 0, 255)
    if blur > 0:
        m = (box((alpha > 0.04).astype(np.float32), 3, H, W) > 0).astype(np.float32); m = box(m, 2, H, W) / 25.0
        bl = np.asarray(Image.fromarray(out.astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur)), dtype=np.float32)
        out = out * (1 - m[..., None]) + bl * m[..., None]
    return np.clip(out, 0, 255).astype(np.uint8)

# ---------------------------------------------------------------- découpe
def runs_from(proj, thr, min_gap):
    idx = np.flatnonzero(proj >= thr)
    if idx.size == 0: return []
    runs = []; s = p = int(idx[0])
    for i in idx[1:]:
        i = int(i)
        if i - p > min_gap: runs.append((s, p + 1)); s = i
        p = i
    runs.append((s, p + 1)); return runs

def xy_cut(mask, y0, y1, x0, x1, out, depth=0):
    sub = mask[y0:y1, x0:x1]
    if sub.size == 0 or depth > 12: return
    rr = runs_from(sub.mean(axis=1), 0.02, 4); cc = runs_from(sub.mean(axis=0), 0.02, 4)
    if not rr or not cc: return
    if len(rr) > 1:
        for a, b in rr: xy_cut(mask, y0 + a, y0 + b, x0, x1, out, depth + 1)
    elif len(cc) > 1:
        for a, b in cc: xy_cut(mask, y0, y1, x0 + a, x0 + b, out, depth + 1)
    else: out.append((y0 + rr[0][0], y0 + rr[0][1], x0 + cc[0][0], x0 + cc[0][1]))

def classify(crop):
    h, w = crop.shape[:2]
    white = float((crop.min(axis=2) > 200).mean()); black = float((crop.max(axis=2) < 30).mean())
    if white > 0.4: return 'texte'
    if min(w, h) < 170 and black > 0.25: return 'logo'
    if min(w, h) < 200: return 'petite'
    return 'photo'

# ---------------------------------------------------------------- main
def main():
    ap = argparse.ArgumentParser(); ap.add_argument('pdfs', nargs='+'); ap.add_argument('--out', required=True)
    ap.add_argument('--blur', type=float, default=1.2); ap.add_argument('--contexte', help='JSON {prefixe-page: [date, lieu, action]}')
    args = ap.parse_args(); out = args.out
    pages_dir = os.path.join(out, 'pages'); os.makedirs(pages_dir, exist_ok=True)
    for k, pdf in enumerate(args.pdfs, 1):
        subprocess.run(['pdfimages', '-j', '-p', pdf, os.path.join(pages_dir, f'livre{k}')], check=True)
    contexte = dict(CONTEXTE_DEFAUT)
    if args.contexte: contexte.update({k: tuple(v) for k, v in json.load(open(args.contexte)).items()})
    files = sorted(glob.glob(os.path.join(pages_dir, 'livre*-*.jpg')))
    sizes = {}
    for f in files: sizes.setdefault(Image.open(f).size, []).append(f)
    size, group = max(sizes.items(), key=lambda kv: len(kv[1]))
    skipped = [os.path.basename(f) for s, fs in sizes.items() if s != size for f in fs]
    log(f'{len(files)} pages extraites ; format traité {size} ({len(group)} pages) ; ignorées (format différent, trop peu de pages pour estimer le filigrane) : {skipped}')
    W, H = size
    stack = np.stack([np.asarray(Image.open(f).convert('RGB'), dtype=np.uint8) for f in group])
    v1, v2 = find_lattice(stack.min(axis=0).astype(np.float32).mean(axis=2)); log('lattice du filigrane :', v1, v2)
    alpha = estimate_alpha(stack, v1, v2); np.save(os.path.join(out, 'alpha.npy'), alpha)
    Image.fromarray((alpha / max(alpha.max(), 1e-6) * 255).astype(np.uint8)).save(os.path.join(out, 'alpha-preview.png'))
    for d in ('restored', 'crops', 'web'): shutil.rmtree(os.path.join(out, d), ignore_errors=True); os.makedirs(os.path.join(out, d))
    manifest = []; rows = []
    for i, f in enumerate(group):
        base = os.path.basename(f)[:10]; label = re.sub(r'livre(\d)-(\d+)', r'L\1p\2', base)
        date, lieu, action = contexte.get(base, ('', '', ''))
        clean_page = restore(stack[i], alpha, 0.0)                              # sans lissage : sert à la découpe
        final_page = restore(stack[i], alpha, args.blur) if args.blur > 0 else clean_page
        Image.fromarray(final_page).save(os.path.join(out, 'restored', os.path.basename(f).replace('.jpg', '.png')))
        nb = Image.fromarray(((clean_page.max(axis=2) > 28) * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
        boxes = []; xy_cut((np.asarray(nb) > 127).astype(np.float32), 0, H, 0, W, boxes); k = 0; tiles = []
        for (y0, y1, x0, x1) in sorted(boxes, key=lambda b: (b[0] // 40, b[2])):
            h, w = y1 - y0, x1 - x0
            if h < 90 or w < 90: continue
            crop = final_page[y0:y1, x0:x1]; kind = classify(clean_page[y0:y1, x0:x1]); k += 1; name = f'{label}-{k:02d}'
            entry = {'id': name, 'fichier_web': None, 'page_source': os.path.basename(f), 'boite': [int(x0), int(y0), int(x1), int(y1)],
                     'largeur': int(w), 'hauteur': int(h), 'type': kind, 'date': date, 'lieu': lieu, 'action': action}
            if kind != 'texte':
                im = Image.fromarray(crop); im.save(os.path.join(out, 'crops', name + '.jpg'), quality=93)
                entry['fichier_web'] = f'edv-{name.lower()}.webp'; im.save(os.path.join(out, 'web', entry['fichier_web']), 'WEBP', quality=82, method=6)
                s = 150 / im.height; tiles.append((entry, im.resize((max(1, int(im.width * s)), 150), Image.LANCZOS)))
            manifest.append(entry)
        # planche-contact de la page
        SHEET_W, TH, PAD = 1500, 150, 8; lines = [[]]; cur = 0
        for t in tiles:
            if cur + t[1].width + PAD > SHEET_W and lines[-1]: lines.append([]); cur = 0
            lines[-1].append(t); cur += t[1].width + PAD
        sheet = Image.new('RGB', (SHEET_W, 30 + len(lines) * (TH + 22)), (18, 18, 18)); d = ImageDraw.Draw(sheet)
        d.text((6, 8), f'{label}   {date}  ·  {lieu}  ·  {action}', fill=(240, 200, 80)); yy = 30
        for line in lines:
            xx = 0
            for e, im in line:
                sheet.paste(im, (xx, yy)); d.text((xx + 2, yy + TH + 4), f"{e['id']}  {e['largeur']}x{e['hauteur']}  {e['type'] if e['type'] != 'photo' else ''}", fill=(230, 230, 230)); xx += im.width + PAD
            yy += TH + 22
        rows.append(sheet); log(f'  {label}: {k} régions')
    json.dump(manifest, open(os.path.join(out, 'manifest.json'), 'w'), indent=1, ensure_ascii=False)
    for g in range(0, len(rows), 7):
        part = rows[g:g + 7]; sh = Image.new('RGB', (1500, sum(r.height for r in part)), (18, 18, 18)); yy = 0
        for r in part: sh.paste(r, (0, yy)); yy += r.height
        sh.save(os.path.join(out, f'planche-{g // 7 + 1}.jpg'), quality=85)
    kinds = {}
    for m in manifest: kinds[m['type']] = kinds.get(m['type'], 0) + 1
    log('terminé :', len(manifest), 'régions', kinds, '| poids web :', round(sum(os.path.getsize(os.path.join(out, 'web', x)) for x in os.listdir(os.path.join(out, 'web'))) / 1024), 'Ko')

if __name__ == '__main__': main()

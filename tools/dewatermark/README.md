# dewatermark.py — extraction et défiligranage des planches PDF

Retire le filigrane semi-transparent « Brouillon PDF » incrusté dans les JPEG des livres PDF, puis découpe les
sous-photos. Fonctionne parce que le filigrane est identique sur toutes les pages de même format (lattice 376 px)
et que les planches ont de grandes zones de fond noir : là, le pixel observé vaut directement `alpha × 255`.

Étapes : `pdfimages` → minimum pixel à pixel des pages → lattice par autocorrélation → médiane le long de la lattice →
masque de fond noir par page (morphologie) → alpha = médiane des observations sur les pages de fond →
inversion du fondu normal `c = (obs − 255α)/(1 − α)` → chrominance ré-interpolée sous les lettres (perte 4:2:0) →
lissage 1,2 px limité aux traits (ringing JPEG) → XY-cut sur les gouttières → WebP + manifest + planches-contact.

## Utilisation
```
python3 -m venv --system-site-packages .venv && .venv/bin/pip install numpy   # Pillow et poppler-utils requis
.venv/bin/python tools/dewatermark/dewatermark.py --out /tmp/edv "livre1.pdf" "livre2.pdf" [--blur 1.2] [--contexte ctx.json]
```
Durée ≈ 4 min pour 26 pages. Sortie : `pages/` (JPEG bruts), `alpha.npy` + `alpha-preview.png`, `restored/` (pages
défiligranées PNG), `crops/` (JPEG q93), `web/` (WebP q82), `manifest.json`, `planche-N.jpg` (vignettes avec identifiants).
`planches/` ici = planches-contact du run du 2 septembre 2026, pour la sélection.

Limites : pages de format minoritaire ignorées (trop peu d'exemplaires pour estimer le filigrane) ; photos collées sans
gouttière noire non séparées ; résolution native seulement (≤ 840 px).

(() => {
  const form = document.querySelector('#article-form');
  const dialog = document.querySelector('#media-dialog');
  if (!form || !dialog) return;
  const gallery = form.querySelector('[data-gallery]');
  const add = form.querySelector('[data-gallery-add]');
  const status = dialog.querySelector('#media-picker-status');
  const grid = dialog.querySelector('#media-picker-grid');
  const search = dialog.querySelector('#picker-search');
  const upload = dialog.querySelector('#media-upload-form');
  let target;
  let items = [];
  let busy = false;
  let opener;
  let request;

  function renumber() {
    const rows = [...gallery.children];
    rows.forEach((row, index) => {
      row.querySelector('legend').textContent = `Image ${index + 1}`;
      for (const [selector, key] of [['[data-image-path]', 'src'], ['[data-image-alt]', 'alt'], ['[data-image-caption]', 'caption']]) {
        const input = row.querySelector(selector);
        input.name = `gallery[${index}][${key}]`;
        input.id = `gallery-${index}-${key}`;
        row.querySelector(`[data-${key}-label]`)?.setAttribute('for', input.id);
      }
      row.querySelector('[data-media-up]').disabled = index === 0;
      row.querySelector('[data-media-down]').disabled = index === rows.length - 1;
    });
    add.disabled = rows.length >= 30;
    form.querySelector('[data-gallery-status]').textContent = `${rows.length} image(s) sur 30.`;
  }
  function applyImage(row, item) {
    row.querySelector('[data-image-path]').value = item?.path || '';
    const alt = row.querySelector('[data-image-alt]');
    alt.value = item?.alt || '';
    alt.required = Boolean(item);
    const preview = row.querySelector('[data-preview]');
    if (item) {
      preview.src = item.preview; preview.alt = item.alt;
      preview.width = item.width; preview.height = item.height;
    } else preview.removeAttribute('src');
    row.querySelector('[data-image-preview]').hidden = !item;
    row.querySelector('[data-image-empty]').hidden = Boolean(item);
    row.querySelector('[data-media-remove]').hidden = !item && row.hasAttribute('data-cover');
    form.dispatchEvent(new Event('input', { bubbles: true }));
  }
  function choose(item) {
    let row = target;
    if (!row) {
      if (gallery.children.length >= 30) { status.textContent = 'La galerie contient déjà 30 images.'; return; }
      row = document.querySelector('#gallery-item-template').content.firstElementChild.cloneNode(true);
      gallery.append(row);
    }
    applyImage(row, item); renumber(); dialog.close();
    row.querySelector('[data-image-alt]').focus();
  }
  function render() {
    grid.replaceChildren();
    const needle = search.value.trim().toLocaleLowerCase('fr');
    const filtered = items.filter(item => item.label.toLocaleLowerCase('fr').includes(needle));
    for (const item of filtered) {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'overflow-hidden rounded-lg border border-line bg-ivory p-3 text-left text-caption focus-visible:outline-2 focus-visible:outline-accent';
      const image = document.createElement('img');
      image.src = item.preview; image.alt = ''; image.width = item.width; image.height = item.height; image.loading = 'lazy';
      image.className = 'mb-3 aspect-[4/3] w-full rounded-lg object-cover';
      const label = document.createElement('span'); label.textContent = item.label;
      button.append(image, label); button.addEventListener('click', () => choose(item)); grid.append(button);
    }
    if (!filtered.length) { const empty = document.createElement('p'); empty.textContent = 'Aucune image ne correspond à votre recherche.'; grid.append(empty); }
  }
  async function responseData(response) {
    if (response.status === 401 || response.status === 403) throw new Error('Votre session a changé. Votre texte reste affiché : copiez-le avant de vous reconnecter et de recharger l’article.');
    let data;
    try { data = await response.json(); } catch { throw new Error('Le service d’images ne répond pas. Réessayez sans fermer votre article.'); }
    if (!response.ok) throw new Error(data.error || 'L’image n’a pas pu être importée.');
    return data;
  }
  async function open(row, button) {
    target = row; opener = button; search.value = ''; grid.replaceChildren();
    status.textContent = 'Chargement des images…'; dialog.showModal();
    request?.abort(); request = new AbortController();
    try {
      const data = await responseData(await fetch('/?page=media_api', { signal: request.signal, credentials: 'same-origin' }));
      items = data.items; render(); status.textContent = '';
    } catch (error) { if (error.name !== 'AbortError') status.textContent = error.message; }
  }
  form.addEventListener('click', event => {
    const button = event.target.closest('button'); if (!button) return;
    const row = button.closest('[data-gallery-item], [data-cover]');
    if (button.hasAttribute('data-gallery-add')) open(null, button);
    if (button.hasAttribute('data-media-choose')) open(row, button);
    if (button.hasAttribute('data-media-remove')) {
      if (row.hasAttribute('data-cover')) applyImage(row, null); else { row.remove(); renumber(); add.focus(); }
    }
    if (button.hasAttribute('data-media-up') && row.previousElementSibling) { gallery.insertBefore(row, row.previousElementSibling); renumber(); button.focus(); }
    if (button.hasAttribute('data-media-down') && row.nextElementSibling) { gallery.insertBefore(row.nextElementSibling, row); renumber(); button.focus(); }
  });
  search.addEventListener('input', render);
  dialog.querySelector('[data-media-close]').addEventListener('click', () => { if (!busy) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (busy) event.preventDefault(); });
  dialog.addEventListener('close', () => { request?.abort(); opener?.focus(); });
  upload.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    const file = upload.elements.image.files[0];
    if (!file || file.size > 8 * 1024 * 1024) { status.textContent = 'Choisissez une image de 8 Mo maximum.'; return; }
    const data = new FormData(upload); data.set('csrf', form.elements.csrf.value);
    busy = true; upload.querySelector('button').disabled = true;
    dialog.querySelector('[data-media-close]').disabled = true;
    grid.inert = true; status.textContent = 'Import de l’image en cours…';
    try {
      const result = await responseData(await fetch('/?page=media_api', { method: 'POST', body: data, credentials: 'same-origin' }));
      items.unshift(result.item); upload.reset(); choose(result.item);
    } catch (error) { status.textContent = error.message || 'Import interrompu. Réessayez.'; }
    finally { busy = false; grid.inert = false; upload.querySelector('button').disabled = false; dialog.querySelector('[data-media-close]').disabled = false; }
  });
  renumber();
})();

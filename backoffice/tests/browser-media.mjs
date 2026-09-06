import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function checkMediaPicker({ send, load, origin, profile, session }) {
  const separator = session.cookie.indexOf('=');
  await send('Network.setCookie', { name: session.cookie.slice(0, separator), value: session.cookie.slice(separator + 1), url: origin, httpOnly: true, sameSite: 'Strict' });
  const ready = load();
  await send('Page.navigate', { url: origin + '/?page=edit&id=' + session.articleId }); await ready;
  const evaluate = async expression => {
    const response = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    assert.ok(!response.exceptionDetails, 'Erreur JavaScript dans le sélecteur de médias');
    return response.result.value;
  };
  const until = async expression => {
    for (let i = 0; i < 100; i++) { if (await evaluate(expression)) return; await new Promise(resolve => setTimeout(resolve, 50)); }
    throw new Error('Le sélecteur n’a pas atteint l’état attendu : ' + expression);
  };
  await evaluate(`document.querySelector('[name=title]').value='Texte conservé pendant la sélection'; document.querySelector('[data-cover] [data-media-choose]').click()`);
  await until(`document.querySelectorAll('#media-picker-grid button').length > 1`);
  await evaluate(`document.querySelector('#media-picker-grid button').click()`);
  assert.equal(await evaluate(`document.querySelector('#media-dialog').open`), false);
  assert.equal(await evaluate(`document.querySelector('[name=cover]').type`), 'hidden');
  assert.ok(await evaluate(`document.querySelector('[data-cover] [data-preview]').src.includes('page=image')`));
  for (const index of [0, 1]) {
    await evaluate(`document.querySelector('[data-gallery-add]').click()`);
    await until(`document.querySelectorAll('#media-picker-grid button').length > 1`);
    await evaluate(`document.querySelectorAll('#media-picker-grid button')[${index}].click()`);
  }
  const selected = await evaluate(`Array.from(document.querySelectorAll('[data-gallery] [data-image-path]'), el => el.value)`);
  assert.equal(selected.length, 2);
  await evaluate(`document.querySelector('[data-gallery] [data-media-down]').click()`);
  assert.deepEqual(await evaluate(`Array.from(document.querySelectorAll('[data-gallery] [data-image-path]'), el => el.value)`), [...selected].reverse());
  await evaluate(`document.querySelector('[data-gallery] [data-media-remove]').click()`);
  assert.equal(await evaluate(`document.querySelectorAll('[data-gallery-item]').length`), 1);
  assert.equal(await evaluate(`document.querySelector('[data-gallery] [data-image-path]').name`), 'gallery[0][src]');
  const png = path.join(profile, 'recette.png');
  await fs.writeFile(png, Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l+0AAAAASUVORK5CYII=', 'base64'));
  await evaluate(`document.querySelector('[data-cover] [data-media-choose]').click()`);
  await until(`document.querySelectorAll('#media-picker-grid button').length > 1`);
  const { root } = await send('DOM.getDocument');
  const { nodeId } = await send('DOM.querySelector', { nodeId: root.nodeId, selector: '#picker-file' });
  await send('DOM.setFileInputFiles', { nodeId, files: [png] });
  await evaluate(`document.querySelector('#picker-alt').value='Photo importée depuis Chrome'; document.querySelector('#media-upload-form').requestSubmit()`);
  await until(`!document.querySelector('#media-dialog').open`);
  assert.equal(await evaluate(`document.querySelector('[name=cover_alt]').value`), 'Photo importée depuis Chrome');
  assert.equal(await evaluate(`document.querySelector('[name=title]').value`), 'Texte conservé pendant la sélection');
  assert.equal(await evaluate(`document.querySelector('[name=version]').value`), '3', 'La sélection ne sauvegarde ni ne valide l’article');
  assert.ok(await evaluate(`Array.from(document.querySelectorAll('input[name=cover], input[name$="[src]"]')).every(input => input.type === 'hidden')`));
  console.log('Sélecteur Chrome : choix, galerie ordonnée, retrait et import sans perte de saisie OK');
}

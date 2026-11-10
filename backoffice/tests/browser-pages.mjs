import assert from 'node:assert/strict';

/** Vrai formulaire et scripts, avec un compte de recette et sans capture d’écran. */
export async function checkPages({ send, load, origin, session }) {
  const [name, value] = session.cookie.split('=');
  await send('Network.setCookie', { name, value, url: origin, httpOnly: true, sameSite: 'Strict' });
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true });
    assert.equal(result.exceptionDetails, undefined, JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  let ready = load();
  await send('Page.navigate', { url: origin + '/?page=page_edit&id=groupe' });
  await ready;
  assert.equal(await evaluate('document.querySelectorAll("[name^=fields]").length'), 4);
  assert.equal(await evaluate('Array.from(document.querySelectorAll("[name^=fields]")).every(el => document.querySelector(`label[for="${el.id}"]`) && ["fr", "en"].includes(el.lang))'), true);
  for (const width of [390, 768, 1280]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width === 390 });
    assert.equal(await evaluate('document.documentElement.scrollWidth <= innerWidth'), true, 'aucun défilement horizontal à ' + width);
  }
  await evaluate('document.querySelector("[name=english_reviewed]").checked=true; const el=document.querySelector("[name=\\"fields[meta.title][fr]\\"]"); el.value="Titre navigateur de recette"; el.dispatchEvent(new Event("input", {bubbles:true}));');
  assert.equal(await evaluate('document.querySelector("[data-page-validate]").disabled && !document.querySelector("[name=english_reviewed]").checked && !document.querySelector("#page-unsaved").hidden'), true, 'enregistrement demandé avant validation et relecture remise à zéro');
  ready = load();
  await evaluate('document.querySelector("#page-draft-form").requestSubmit()');
  await ready;
  assert.equal(await evaluate('document.querySelector("[name=\\"fields[meta.title][fr]\\"]").value'), 'Titre navigateur de recette');
  assert.equal(await evaluate('document.querySelector("[data-page-validate]").disabled'), false);
  assert.equal(await evaluate('document.querySelector("[name=english_reviewed]").checked'), false);
  assert.equal(await evaluate('document.querySelector("#page-validate-form").checkValidity()'), false, 'confirmation de relecture obligatoire');
  console.log('Pages Chrome : champs étiquetés, trois largeurs, brouillon rechargé et relecture contrôlée');
}

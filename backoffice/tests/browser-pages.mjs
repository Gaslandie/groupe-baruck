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

export async function checkPageLists({ send, load, origin, session }) {
  const [name,value] = session.cookie.split('=');
  await send('Network.setCookie',{name,value,url:origin,httpOnly:true,sameSite:'Strict'});
  const evaluate = async expression => {
    const result = await send('Runtime.evaluate',{expression,returnByValue:true});
    assert.equal(result.exceptionDetails,undefined,JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  let ready = load();
  await send('Page.navigate',{url:origin+'/?page=page_edit&id=groupe&section=AboutPresence'}); await ready;
  const count = await evaluate('document.querySelector("[data-list-items]").children.length');
  await evaluate('document.querySelector("[data-page-list]").querySelector(":scope > [data-list-add]").click(); const row=document.querySelector("[data-list-items]").lastElementChild; for(const el of row.querySelectorAll("input[lang],textarea[lang]"))el.value=el.lang==="fr"?"PAYS NAVIGATEUR PRIVE":"PRIVATE BROWSER COUNTRY"; row.querySelector("[data-list-add]").click(); const link=row.querySelector("[data-list-items]").lastElementChild; for(const el of link.querySelectorAll("input[lang],textarea[lang]"))el.value=el.lang==="fr"?"Lien de recette":"Test link"; link.querySelector("input:not([type=hidden]):not([lang])").value="/contact/";');
  assert.equal(await evaluate('document.querySelector("[data-list-items]").children.length'),count+1);
  await evaluate('document.querySelector("[data-list-items]").lastElementChild.querySelector(":scope > div:last-child > [data-list-up]").click(); document.querySelector("[data-list-items]").firstElementChild.querySelector(":scope > div:last-child > [data-list-remove]").click();');
  assert.equal(await evaluate('document.querySelector("[data-list-items]").children.length'),count);
  const labels = await evaluate('Array.from(document.querySelectorAll("#page-draft-form input:not([type=hidden]),#page-draft-form textarea,#page-draft-form select")).every(el=>document.querySelector(`label[for="${el.id}"]`))');
  assert.equal(labels,true,'les champs ajoutés gardent leurs étiquettes');
  assert.equal(await evaluate('const ids=Array.from(document.querySelectorAll("[id]")).map(el=>el.id); new Set(ids).size===ids.length'),true,'identifiants uniques après ajout et déplacement');
  for (const width of [390,768,1280]) {
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'formulaire de liste sans débordement à '+width);
  }
  ready=load(); await evaluate('document.querySelector("#page-draft-form").requestSubmit()'); await ready;
  assert.equal(await evaluate('document.querySelectorAll("[data-page-list] > [data-list-items]")[0].children.length'),count);
  assert.equal(await evaluate('Array.from(document.querySelectorAll("input[lang=fr]")).some(el=>el.value==="PAYS NAVIGATEUR PRIVE")'),true,'liste ajoutée et reclassée retrouvée après rechargement');
  assert.equal(await evaluate('Array.from(document.querySelectorAll("input:not([lang])")).some(el=>el.value==="/contact/")'),true,'lien imbriqué conservé après déplacement du pays');
  // Le sélecteur partagé fonctionne aussi depuis une page et après réouverture.
  ready=load(); await send('Page.navigate',{url:origin+'/?page=page_edit&id=groupe&section=portraits'}); await ready;
  for (let index=0; index<2; index++) {
    await evaluate('document.querySelector("[data-media-choose]").click()');
    for (let attempt=0; attempt<80; attempt++) {
      if (await evaluate('document.querySelectorAll("#media-picker-grid button").length>0')) break;
      await new Promise(resolve=>setTimeout(resolve,50));
    }
    assert.equal(await evaluate('document.querySelector("#media-dialog").open'),true);
    assert.equal(await evaluate('document.querySelectorAll("#media-picker-grid button").length>0'),true);
    if (index === 1) {
      await evaluate('document.querySelector("#media-picker-grid button").click()');
      assert.equal(await evaluate('document.querySelector("[data-page-image] [lang=en]").value'), '');
      assert.equal(await evaluate('document.querySelector("[data-page-validate]").disabled'),true,'changer la photo demande un enregistrement et une nouvelle relecture');
    } else await evaluate('document.querySelector("[data-media-close]").click()');
    await new Promise(resolve=>setTimeout(resolve,50));
  }
  console.log('Pages Chrome : listes imbriquées, ajout, ordre, retrait, étiquettes, trois largeurs et réouverture du sélecteur');
}

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

export async function checkPageGalleries({send,load,origin,session}) {
  const [name,value]=session.cookie.split('=');
  await send('Network.setCookie',{name,value,url:origin,httpOnly:true,sameSite:'Strict'});
  const evaluate=async expression=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true});
    assert.equal(response.exceptionDetails,undefined,JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  let ready=load();await send('Page.navigate',{url:origin+'/?page=page_edit&id=espoir-de-vie&section=galeries'});await ready;

  const count=await evaluate('document.querySelector("[data-list-items]").children.length');
  await evaluate('const list=document.querySelector("[data-page-list]");list.querySelector(":scope > [data-list-add]").click();');
  assert.match(await evaluate('document.querySelector("[data-list-items]").lastElementChild.querySelector("[data-page-key]").value'),/^item-[a-f0-9-]{36}$/);
  await evaluate('document.querySelector("[data-list-items]").lastElementChild.querySelector(":scope > div:last-child > [data-list-remove]").click();const fields=document.querySelectorAll("#page-draft-form input[lang],#page-draft-form textarea[lang]");fields[fields.length-1].value="DERNIERE PHOTO PRIVEE";fields[fields.length-1].dispatchEvent(new Event("input",{bubbles:true}));');
  await evaluate(`
    const root=document.querySelector('[data-page-list]');
    const source=root.querySelector('[data-list-items]').firstElementChild;
    for(let index=0;index<3;index++){
      root.querySelector(':scope > [data-list-add]').click();
      const added=root.querySelector('[data-list-items]').lastElementChild;
      const copy=control=>{
        const oldName=control.name.replace(added.dataset.itemPrefix,source.dataset.itemPrefix);
        const original=Array.from(source.querySelectorAll('[name]')).find(item=>item.name===oldName);
        if(original&&!control.hasAttribute('data-page-key'))control.value=original.value;
      };
      for(const control of added.querySelectorAll('input[lang],textarea[lang]'))copy(control);
      const photos=source.querySelectorAll('[data-page-image]');
      const photoList=added.querySelector('[data-page-list]');
      for(let photo=0;photo<photos.length;photo++){
        photoList.querySelector(':scope > [data-list-add]').click();
        for(const control of photoList.querySelector('[data-list-items]').lastElementChild.querySelectorAll('[name]'))copy(control);
      }
    }
  `);
  assert.ok(await evaluate('document.querySelectorAll("#page-draft-form [name]").length>1000'),'les galeries ajoutées dépassent la limite native de PHP');
  const last=await evaluate('JSON.stringify(Array.from(document.querySelectorAll("[data-image-path]")).map(el=>el.value))');
  for(const width of [390,768,1280]){
    await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
    assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'galeries sans débordement horizontal à '+width);
  }
  ready=load();await evaluate('document.querySelector("#page-draft-form").requestSubmit()');await ready;
  assert.equal(await evaluate('document.querySelector("[data-list-items]").children.length'),count+3);
  assert.equal(await evaluate('JSON.stringify(Array.from(document.querySelectorAll("[data-image-path]")).map(el=>el.value))'),last,'toutes les photos sont conservées');
  assert.equal(await evaluate('Array.from(document.querySelectorAll("#page-draft-form input[lang],#page-draft-form textarea[lang]")).some(f=>f.value==="DERNIERE PHOTO PRIVEE")'),true,'la dernière saisie est enregistrée');
  console.log('Galeries Chrome : ajout avec clé unique, retrait et plus de 1 000 champs rechargés sans perte');
}

/** Contrôle de la publication construite, servie seulement sur localhost. */
export async function checkPublishedPages({send,load,origin,session}) {
  const evaluate=async expression=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    assert.equal(response.exceptionDetails,undefined,JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  for(const language of ['', '/en']){
    if(session.editorial){
      let ready=load();await send('Page.navigate',{url:origin+(session.basePath??'')+language+'/actualites/article-bilingue-recette/'});await ready;
      assert.equal(await evaluate('document.querySelector("h1").textContent.trim()'),language?'Approved English title':'Titre français validé');
      if(language)assert.equal(await evaluate('document.querySelector(".article-body strong").textContent'),'Approved English body');
      assert.equal(await evaluate('/BROUILLON NAVIGATEUR|PRIVATE ENGLISH DRAFT/.test(document.body.textContent)'),false);
      ready=load();await send('Page.navigate',{url:origin+(session.basePath??'')+language+'/marque-baruck/'});await ready;
      assert.equal(await evaluate('document.querySelector("#produit-produit-bilingue-valide h3").textContent.trim()'),language?'Approved bilingual product':'Produit bilingue validé');
      assert.equal(await evaluate('document.querySelector("#produit-produit-bilingue-valide img").alt'),language?'Approved product photo':'Photo du produit');
    }
    let ready=load();await send('Page.navigate',{url:origin+(session.basePath??'')+language+'/jeca/'});await ready;
    const galleries=await evaluate('Array.from(document.querySelectorAll("section[id^=edition-]")).map(section=>({id:section.id,count:section.querySelectorAll("button img").length,src:section.querySelector("button img")?.getAttribute("src")}))');
    let offset=0;
    for(const gallery of galleries){
      if(!gallery.count)continue;
      await evaluate(`document.getElementById(${JSON.stringify(gallery.id)}).querySelector('button').click();`);
      const selected=await evaluate(`(async()=>{for(let i=0;i<100;i++){const dialog=document.querySelector('dialog[open]');if(dialog?.querySelector('img'))return {src:dialog.querySelector('img').getAttribute('src'),counter:dialog.querySelector('small').textContent.trim()};await new Promise(resolve=>setTimeout(resolve,20));}throw Error('Galerie non ouverte');})()`);
      assert.equal(selected.src,gallery.src,'la bonne photo s’ouvre après changement d’ordre : '+gallery.id+language);
      assert.equal(selected.counter,`${offset+1} / ${galleries.reduce((sum,item)=>sum+item.count,0)}`);
      await evaluate('(async()=>{document.querySelector("dialog[open] button").click();for(let i=0;i<100;i++){const dialog=document.querySelector("dialog");if(!dialog.open&&!dialog.querySelector("img"))return;await new Promise(resolve=>setTimeout(resolve,20));}throw Error("Photo non refermée");})()');
      offset+=gallery.count;
    }
    ready=load();await send('Page.navigate',{url:origin+(session.basePath??'')+language+'/espoir-de-vie/'});await ready;
    const tabs=await evaluate('Array.from(document.querySelectorAll("[role=tab]")).map(tab=>tab.id)');
    if(tabs.length>1){
      await evaluate('document.querySelector("[role=tab][aria-selected=true]").dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowRight",bubbles:true}))');
      assert.equal(await evaluate('(async()=>{await new Promise(resolve=>setTimeout(resolve,50));return document.querySelector("[role=tab][aria-selected=true]").id})()'),tabs[1]);
      assert.equal(await evaluate('document.activeElement.id'),tabs[1]);
    }
    for(const route of ['studio-photo','hotesses-evenementielles','marque-baruck','actualites','mediatheque','contact','projets-realisations','mentions-legales']){
      ready=load();await send('Page.navigate',{url:origin+(session.basePath??'')+language+'/'+route+'/'});await ready;
      assert.equal(await evaluate('document.querySelectorAll("h1").length'),1,route+' : titre présent après construction');
      for(const width of [390,768,1280]){
        await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
        const size=await evaluate('(async()=>{await document.fonts.ready;await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));return {width:innerWidth,scroll:document.documentElement.scrollWidth,items:Array.from(document.querySelectorAll("body *")).filter(el=>el.getBoundingClientRect().right>innerWidth+1).slice(0,12).map(el=>({tag:el.tagName,classes:el.className,text:el.textContent.slice(0,90),right:el.getBoundingClientRect().right}))}})()');
        assert.ok(size.scroll<=size.width,route+' : largeur '+width+language+' '+JSON.stringify(size));
      }
      if(route==='mediatheque'){
        assert.equal(await evaluate('Array.from(document.querySelectorAll("section[id^=espoir-de-vie-]")).every(section=>section.querySelector("a").getAttribute("href").includes("/espoir-de-vie/#galerie-"))'),true,'galeries reliées à leur page d’origine');
        await evaluate('document.querySelector("#galeries nav li:last-child button").click()');
        assert.equal(await evaluate('(async()=>{await new Promise(r=>setTimeout(r,50));return document.querySelectorAll("#galeries section[id=studio-photo]").length})()'),0,'le filtre masque les autres sources');
      }
      if(route==='marque-baruck'){
        await evaluate('document.querySelector("#collection [role=group] button:nth-child(2)")?.click()');
        assert.equal(await evaluate('(async()=>{await new Promise(r=>setTimeout(r,50));return Array.from(document.querySelectorAll("#catalogue-articles > div")).some(item=>item.hidden)})()'),true,'catalogue filtré après les changements de libellés');
      }
      if(route==='contact')assert.equal(await evaluate('document.querySelectorAll("iframe[src*=google]").length'),0,'aucune carte sans consentement');
    }
  }
  console.log('Publication Chrome FR/EN : huit pages à trois largeurs, filtres, consentement carte, galeries et clavier');
}

export async function checkRemainingPages({send,load,origin,session}) {
  const [name,value]=session.cookie.split('=');
  await send('Network.setCookie',{name,value,url:origin,httpOnly:true,sameSite:'Strict'});
  const evaluate=async expression=>{
    const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
    assert.equal(response.exceptionDetails,undefined,JSON.stringify(response.exceptionDetails));
    return response.result.value;
  };
  for(const {id,key,section} of session.sections){
    let ready=load();await send('Page.navigate',{url:origin+'/?page=page_edit&id='+id+'&section='+section});await ready;
    for(const width of [390,768,1280]){
      await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});
      assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,id+' à '+width);
    }
    const control='[name='+JSON.stringify(`fields[${key}][fr]`)+']';
    await evaluate(`const field=document.querySelector(${JSON.stringify(control)});field.value=${JSON.stringify('SAISIE NAVIGATEUR PRIVEE '+id)};field.dispatchEvent(new Event('input',{bubbles:true}));`);
    assert.equal(await evaluate('document.querySelector("[data-page-validate]").disabled'),true);
    ready=load();await evaluate('document.querySelector("#page-draft-form").requestSubmit()');await ready;
    assert.equal(await evaluate(`document.querySelector(${JSON.stringify(control)}).value`),'SAISIE NAVIGATEUR PRIVEE '+id);
  }
  let ready=load();await send('Page.navigate',{url:origin+'/?page=page_edit&id=studio-photo&section='+session.studioSection});await ready;
  const first=await evaluate('document.querySelector("[data-list-items] [data-list-items] [lang=fr]").value');
  await evaluate(`const nested=document.querySelector('[data-list-items] [data-page-list]');nested.querySelector('[data-list-down]').click();nested.querySelector(':scope > [data-list-add]').click();nested.querySelector('[data-list-items]').lastElementChild.querySelector('[data-list-remove]').click();`);
  ready=load();await evaluate('document.querySelector("#page-draft-form").requestSubmit()');await ready;
  assert.notEqual(await evaluate('document.querySelector("[data-list-items] [data-list-items] [lang=fr]").value'),first);
  console.log('Étape 5 Chrome : huit formulaires enregistrés et rechargés, trois largeurs, tarifs imbriqués et brouillons privés');
}

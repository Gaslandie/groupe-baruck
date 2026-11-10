import assert from 'node:assert/strict';
export async function checkEditorial({send,load,origin,session}){
 const[name,value]=session.cookie.split('=');await send('Network.setCookie',{name,value,url:origin,httpOnly:true,sameSite:'Strict'});
 const evaluate=async expression=>{const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});assert.equal(response.exceptionDetails,undefined,JSON.stringify(response.exceptionDetails));return response.result.value;};
 const until=async expression=>{for(let i=0;i<100;i++){if(await evaluate(expression))return;await new Promise(r=>setTimeout(r,40));}assert.fail('État non obtenu : '+expression);};
 let ready=load();await send('Page.navigate',{url:origin+'/?page=edit&id='+session.articleId});await ready;
 await until('document.querySelector("[data-editorial-validate]").disabled');
 assert.equal(await evaluate('document.querySelectorAll("[data-markdown-toolbar] button").length'),10);
 for(const width of [390,768,1280]){await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'éditeur article à '+width);}
 await evaluate(`document.querySelector('#body').value='Texte exemple';document.querySelector('#body').setSelectionRange(0,5);document.querySelector('[data-for=body] [data-format=bold]').click()`);
 assert.equal(await evaluate('document.querySelector("#body").value'),'**Texte** exemple');
 await evaluate(`document.querySelector('#body').setSelectionRange(0,0);document.querySelector('[data-for=body] [data-format=heading]').click();document.querySelector('[data-for=body] [data-format=list]').click()`);
 assert.match(await evaluate('document.querySelector("#body").value'),/^- ## /);
 await evaluate(`document.querySelector('#body').value='Lien';document.querySelector('#body').setSelectionRange(0,4);document.querySelector('[data-for=body] [data-format=link]').click();document.querySelector('#editorial-link-url').value='javascript:alert(1)';document.querySelector('#editorial-link-dialog form').requestSubmit()`);
 assert.equal(await evaluate('document.querySelector("#editorial-link-dialog").open'),true);
 await evaluate(`document.querySelector('#editorial-link-url').value='/contact/';document.querySelector('#editorial-link-dialog form').requestSubmit()`);
 assert.equal(await evaluate('document.querySelector("#body").value'),'[Lien](/contact/)');
 await evaluate(`document.querySelector('#editorial-preview').open=true;document.querySelector('#body').value=${JSON.stringify('## Intertitre\n\n**Gras** et *italique*.\n\n- Premier\n- Second\n\n<img src=x onerror="window.__previewProbe=1">\n\n[Malice](javascript:alert(1))')};document.querySelector('#body').dispatchEvent(new Event('input',{bubbles:true}))`);
 await until('document.querySelector("[data-preview-output] strong")');
 assert.equal(await evaluate('document.querySelector("[data-preview-output] strong").textContent'),'Gras');
 assert.equal(await evaluate('document.querySelectorAll("[data-preview-output] li").length'),2);
 assert.equal(await evaluate('document.querySelectorAll("[data-preview-output] [onerror],[data-preview-output] script,[data-preview-output] iframe,[data-preview-output] a[href^=javascript]").length'),0);
 assert.equal(await evaluate('window.__previewProbe===undefined'),true);
 await evaluate(`document.querySelector('#preview-language').value='en';document.querySelector('#preview-language').dispatchEvent(new Event('change'))`);
 await until('document.querySelector("[data-preview-output]").textContent.includes("Approved English title")');
 await evaluate(`document.querySelector('[name=english_reviewed]').click()`);
 assert.equal(await evaluate('document.querySelector("[data-editorial-validate]").disabled'),false);
 await evaluate(`document.querySelector('#body').value='BROUILLON NAVIGATEUR FR';document.querySelector('#body').dispatchEvent(new Event('input',{bubbles:true}))`);
 assert.equal(await evaluate('document.querySelector("[name=english_reviewed]").checked'),false);
 ready=load();await evaluate('document.querySelector("#article-form").requestSubmit(document.querySelector("button[name=status][value=draft]"))');await ready;
 assert.equal(await evaluate('document.querySelector("#body").value'),'BROUILLON NAVIGATEUR FR');
 assert.equal(await evaluate('document.getElementsByName("english[title]")[0].value'),'Approved English title');
 // Les descriptions anglaises suivent les lignes lors d’un changement d’ordre.
 ready=load();await send('Page.navigate',{url:origin+'/?page=product&id='+session.productId});await ready;
 await until('document.querySelector("[data-editorial-validate]").disabled');
 for(const width of [390,768,1280]){await send('Emulation.setDeviceMetricsOverride',{width,height:900,deviceScaleFactor:1,mobile:width===390});assert.equal(await evaluate('document.documentElement.scrollWidth<=innerWidth'),true,'éditeur produit à '+width);}
 await evaluate(`document.querySelector('[data-gallery-add]').click()`);await until('document.querySelectorAll("#media-picker-grid button").length>1');
 await evaluate(`document.querySelectorAll('#media-picker-grid button')[1].click()`);
 await evaluate(`const rows=document.querySelectorAll('[data-gallery-item]');rows[0].querySelector('[name^="english["]').value='First English image';rows[1].querySelector('[name^="english["]').value='Second English image';rows[1].querySelector('[data-media-up]').click()`);
 assert.equal(await evaluate('document.getElementsByName("english[images][0][alt]")[0].value'),'Second English image');
 ready=load();await evaluate('document.querySelector("#product-form").requestSubmit(document.querySelector("button[name=status][value=draft]"))');await ready;
 assert.equal(await evaluate('document.getElementsByName("english[images][0][alt]")[0].value'),'Second English image');
 console.log('Éditorial Chrome : mise en forme, lien refusé puis ajouté, aperçu sûr FR/EN, brouillon, relecture, photos classées et trois largeurs');
}

import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {test} from 'node:test';

// Chaque processus relit les mêmes modules que le build. Seule leur copie mémoire
// du contenu est changée : aucun fichier client n’est réécrit par ces essais.
function check(language, patches, assertions) {
  const result=spawnSync(process.execPath,['--disable-warning=MODULE_TYPELESS_PACKAGE_JSON','--input-type=module','-e',`
    import assert from 'node:assert/strict';
    import fs from 'node:fs';
    import {registerHooks} from 'node:module';
    registerHooks({resolve(specifier,context,nextResolve){
      if(specifier.startsWith('@/'))return nextResolve(new URL('./src/'+specifier.slice(2)+'.ts',import.meta.url).href,context);
      if(specifier.startsWith('@content/'))return nextResolve(new URL('./content/'+specifier.slice(9),import.meta.url).href,context);
      if(specifier.startsWith('.')&&!/\\.[a-z]+$/.test(specifier))return nextResolve(specifier+'.ts',context);
      return nextResolve(specifier,context);
    }});
    const {default:pages}=await import('./content/pages.json',{with:{type:'json'}});
    for(const {page,key,value} of JSON.parse(fs.readFileSync(0,'utf8')))pages[page].values[key]=value;
    ${assertions}
  `],{input:JSON.stringify(patches),encoding:'utf8',env:{...process.env,NEXT_PUBLIC_SITE_LANGUAGE:language}});
  assert.equal(result.status,0,result.stderr);
}

test('la Médiathèque reprend les photos, légendes et liens des trois pages d’origine',()=>{
  for(const language of ['fr','en'])check(language,[],`
    const {mediaCollections}=await import('./src/data/mediatheque.ts');
    const {jecaGalleries}=await import('./src/data/jeca.ts');
    const {edvGalleryCategories}=await import('./src/data/edv-galerie.ts');
    const {studioGallery}=await import('./src/data/services.ts');
    for(const gallery of jecaGalleries){
      const c=mediaCollections.find(c=>c.id==='jeca-'+gallery.id);
      assert.equal(c.href,'/jeca/#'+gallery.id);
      assert.deepEqual(c.photos,gallery.photos.map(({layout,...photo})=>photo));
    }
    for(const gallery of edvGalleryCategories){
      const c=mediaCollections.find(c=>c.id==='espoir-de-vie-'+gallery.id);
      assert.equal(c.href,'/espoir-de-vie/#galerie-'+gallery.id);
      assert.equal(c.title,gallery.title);
      assert.deepEqual(c.photos.map(p=>p.src),gallery.photos.map(p=>p.src));
    }
    assert.deepEqual(mediaCollections.find(c=>c.id==='studio-photo').photos.map(p=>p.caption),studioGallery.map(p=>p.caption));
    assert.equal(new Set(mediaCollections.map(c=>c.id)).size,mediaCollections.length);
  `);
});

test('renommer, retirer et vider les listes ne casse ni les pages ni l’assistant',()=>{
  check('fr',[
    {page:'studio-photo',key:'data.studioFaq',value:[{key:'rendez-vous',question:{fr:'Question renommée',en:'Renamed question'},answer:{fr:'Réponse modifiée',en:'Edited answer'}}]},
    {page:'contact',key:'data.contactNeeds',value:[]},
    {page:'espoir-de-vie',key:'data.timeline',value:[]},
    {page:'espoir-de-vie',key:'data.galleries',value:[]},
    {page:'jeca',key:'data.editions',value:[]},
    {page:'studio-photo',key:'data.studioGallery',value:[]},
    {page:'studio-photo',key:'data.studioPriceGroups',value:[]},
  ],`
    const {assistantNodes}=await import('./src/data/assistant.ts');
    assert.ok(Object.values(assistantNodes).some(n=>JSON.stringify(n.messages).includes('Réponse modifiée')));
    assert.ok(assistantNodes['studio-identite'].messages[0].length > 0,'une question retirée donne une réponse de repli');
    const {mediaCollections}=await import('./src/data/mediatheque.ts');
    assert.deepEqual(mediaCollections,[]);
  `);
});

test('les coordonnées restent partagées et les objets envoyés au formulaire restent fixes',()=>{
  check('en',[{page:'contact',key:'data.subjectLabels',value:{subject0:{fr:'Réserver une photo',en:'Book a photo'},subject1:{fr:'Équipe',en:'Team'},subject2:{fr:'Forum',en:'Forum'},subject3:{fr:'Actions',en:'Actions'},subject4:{fr:'Projet',en:'Project'},subject5:{fr:'Autre',en:'Other'}}}],`
    const {contactSubjects,contactSubjectLabels,contactFaq}=await import('./src/data/contact.ts');
    const {contacts,hqAddress}=await import('./src/data/site.ts');
    assert.equal(contactSubjectLabels[0],'Book a photo');
    assert.equal(contactSubjects[0],'Photography studio');
    assert.ok(contactFaq.some(v=>v.answer.includes(hqAddress)));
    assert.ok(contactFaq.some(v=>v.answer.includes(contacts.email.value)));
    const {formatPageText}=await import('./src/lib/page-format.ts');
    assert.equal(formatPageText('Adresse : {adresse}',{adresse:'A < B'}),'Adresse : A < B');
    assert.equal(formatPageText('{constructor}',{}),'{constructor}');
  `);
});

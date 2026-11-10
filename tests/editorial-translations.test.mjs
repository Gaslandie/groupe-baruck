import test from 'node:test';
import assert from 'node:assert/strict';
import {englishProjection,validateEnglish,applyEnglish,editorialEnglish} from '../src/lib/editorial-translations.ts';
const source={title:'Titre',excerpt:'Résumé',body:'Texte',date:'2026-11-10',category:'jeca',cover:'/images/cover.jpg',coverAlt:'Couverture',gallery:[{src:'/images/a.jpg',alt:'Photo',caption:'Légende'}],groupsTitle:'Groupe',groupsIntro:'',groups:[{label:'Passage',note:'Guinée',photos:[{src:'/images/b.jpg',alt:'Portrait'}],video:{src:'/videos/a.mp4',poster:'/images/c.jpg'}}]};
const en={title:'Title',excerpt:'Summary',body:'## Heading\n\n**Bold** and *italic*.\n\n[Contact](/contact/)',coverAlt:'Cover',gallery:[{alt:'Image',caption:'Caption'}],groupsTitle:'Group',groupsIntro:'',groups:[{label:'Session',note:'Guinea',photos:[{alt:'Portrait',caption:''}]}]};
test('les traductions remplacent les textes et conservent tous les fichiers, dates et identifiants',()=>{
 const validated=validateEnglish(source,en,'article');
 const result=applyEnglish(source,validated);
 assert.equal(result.title,'Title');assert.equal(result.date,source.date);assert.equal(result.category,'jeca');
 assert.equal(result.gallery[0].src,source.gallery[0].src);assert.equal(result.gallery[0].caption,'Caption');assert.deepEqual(result.groups[0].video,source.groups[0].video);
 assert.equal(result.groups[0].photos[0].src,source.groups[0].photos[0].src);
 assert.deepEqual(editorialEnglish({...source,translations:{en}},'article'),en);
 assert.equal(editorialEnglish(source,'article'),undefined,'les anciens contenus restent lisibles');
});
test('anglais incomplet, structure forgée, HTML et liens actifs sont refusés',()=>{
 for(const change of [
  v=>v.title='',v=>delete v.excerpt,v=>v.gallery=[],v=>v.gallery[0].src='/images/autre.jpg',v=>v.groups[0].video={src:'/videos/autre.mp4'},
  v=>v.body='<script>alert(1)</script>',v=>v.body='[Lien](javascript:alert(1))',v=>v.body='[Lien](//evil.test)',v=>v.body='![Image](https://evil.test/p.png)',v=>v.body='![Image](/images/../secret.png)',v=>v.excerpt='<img src=x onerror=alert(1)>',v=>v.groupsIntro='Only English',v=>v.title='\ud800',
 ]){const broken=structuredClone(en);change(broken);assert.throws(()=>validateEnglish(source,broken,'article'));}
 assert.throws(()=>editorialEnglish({...source,translations:{en,de:{}}},'article'));
 const code=structuredClone(en);code.body='`<script>alert(1)</script>`';assert.doesNotThrow(()=>validateEnglish(source,code,'article'));
});
test('produit : le nom et les descriptions suivent les photos dans le même ordre',()=>{
 const product={id:'sac',name:'Sac',category:'sacs',images:[{src:'/images/a.jpg',alt:'Face'},{src:'/images/b.jpg',alt:'Dos'}]};
 const english={name:'Bag',images:[{alt:'Front'},{alt:'Back'}]};
 assert.deepEqual(englishProjection(product,'product'),{name:'Sac',images:[{alt:'Face'},{alt:'Dos'}]});
 const result=applyEnglish(product,validateEnglish(product,english,'product'));
 assert.equal(result.id,'sac');assert.equal(result.images[1].alt,'Back');assert.equal(result.images[1].src,'/images/b.jpg');
 english.images.reverse();assert.equal(applyEnglish(product,validateEnglish(product,english,'product')).images[0].alt,'Back');
});

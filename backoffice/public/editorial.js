import {marked} from './marked.esm.js';
const form=document.querySelector('[data-editorial-form]');
const dataElement=document.querySelector('#editorial-preview-data');
if(form && dataElement){
 const config=JSON.parse(dataElement.textContent);
 const review=form.querySelector('[data-english-reviewed]');
 const validate=form.querySelector('[data-editorial-validate]');
 const details=document.querySelector('#editorial-preview');
 const language=document.querySelector('#preview-language');
 const output=document.querySelector('[data-preview-output]');
 const status=document.querySelector('[data-preview-status]');
 const dialog=document.querySelector('#editorial-link-dialog');
 let linkTarget,linkRange,opener,timer;
 const control=name=>form.elements.namedItem(name);
 const value=name=>control(name)?.value || '';
 const decode=value=>value.replace(/&(#x[0-9a-f]+|#[0-9]+|amp|lt|gt|quot|apos);/gi,(all,key)=>{const names={amp:'&',lt:'<',gt:'>',quot:'"',apos:"'"};if(key[0]!=='#')return names[key.toLowerCase()]||all;const point=key[1].toLowerCase()==='x'?parseInt(key.slice(2),16):Number(key.slice(1));return point>0&&point<=0x10ffff&&!(point>=0xd800&&point<=0xdfff)?String.fromCodePoint(point):all;});
 const element=(tag,text)=>{const node=document.createElement(tag);if(text!==undefined)node.textContent=text;return node;};
 function safeLink(href){return typeof href==='string' && !/[\x00-\x20\\]/.test(href) && ((href.startsWith('/')&&!href.startsWith('//')) || /^(https?:\/\/|mailto:|tel:|#)/i.test(href));}
 function insert(textarea,start,end,text,selectStart=0,selectEnd=text.length){
  textarea.setRangeText(text,start,end,'end');textarea.focus();textarea.setSelectionRange(start+selectStart,start+selectEnd);textarea.dispatchEvent(new Event('input',{bubbles:true}));
 }
 for(const toolbar of form.querySelectorAll('[data-markdown-toolbar]')){
  const textarea=document.getElementById(toolbar.dataset.for);
  toolbar.addEventListener('pointerdown',event=>{if(event.target.closest('button'))event.preventDefault();});
  toolbar.addEventListener('click',event=>{
   const button=event.target.closest('[data-format]');if(!button)return;
   const start=textarea.selectionStart,end=textarea.selectionEnd,selected=textarea.value.slice(start,end),kind=button.dataset.format;
   if(kind==='link'){
    linkTarget=textarea;linkRange=[start,end];opener=button;
    dialog.querySelector('#editorial-link-label').value=selected;
    dialog.querySelector('#editorial-link-url').value='';dialog.querySelector('[data-link-error]').textContent='';dialog.showModal();dialog.querySelector('#editorial-link-label').focus();return;
   }
   if(kind==='bold'||kind==='italic'){
    const marker=kind==='bold'?'**':'*',text=selected || (textarea.lang==='en'?'Text':'Texte');insert(textarea,start,end,marker+text+marker,marker.length,marker.length+text.length);return;
   }
   const from=textarea.value.lastIndexOf('\n',Math.max(0,start-1))+1;
   const after=textarea.value.indexOf('\n',end),to=after<0?textarea.value.length:after;
   const lines=textarea.value.slice(from,to) || (textarea.lang==='en'?'Text':'Texte');
   const result=lines.split('\n').map(line=>kind==='heading'?'## '+line.replace(/^#{1,6}\s+/, ''):'- '+line.replace(/^[-*+]\s+/, '')).join('\n');
   insert(textarea,from,to,result);
  });
  textarea.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&['b','i'].includes(event.key.toLowerCase())){event.preventDefault();toolbar.querySelector('[data-format='+(event.key.toLowerCase()==='b'?'bold':'italic')+']').click();}});
 }
 dialog?.querySelector('form').addEventListener('submit',event=>{
  event.preventDefault();const label=dialog.querySelector('#editorial-link-label').value.trim(),href=dialog.querySelector('#editorial-link-url').value.trim();
  if(!safeLink(href)||/[\[\]\r\n]/.test(label)||/[()]/.test(href)){dialog.querySelector('[data-link-error]').textContent='Utilisez un texte sans crochets et une adresse /…, #…, https://…, mailto: ou tel: sans espace ni parenthèse.';return;}
  const target=linkTarget,range=linkRange;opener=target;dialog.close();insert(target,...range,`[${label}](${href})`);
 });
 dialog?.querySelector('[data-link-cancel]').addEventListener('click',()=>dialog.close());
 dialog?.addEventListener('close',()=>opener?.focus());
 // Aucun HTML de Marked n’est injecté. Chaque token passe par une liste d’éléments autorisés.
 function markdown(source){
  let count=0;
  function nodes(tokens,depth=0){
   const fragment=document.createDocumentFragment();
   for(const token of tokens||[]){
    if(++count>10000||depth>32)throw Error('Texte trop complexe pour cet aperçu.');
    let node;
    const inline=tag=>{const n=element(tag);n.append(nodes(token.tokens||[{type:'text',text:token.text||''}],depth+1));return n;};
    switch(token.type){
     case 'space':case 'def':continue;
     case 'heading':node=inline('h'+Math.min(6,Math.max(2,token.depth)));node.className='font-display text-title font-bold';break;
     case 'paragraph':node=inline('p');break;
     case 'strong':node=inline('strong');break;
     case 'em':node=inline('em');break;
     case 'del':node=inline('s');break;
     case 'text':node=token.tokens?inline('span'):document.createTextNode(decode(token.text||''));break;
     case 'escape':case 'html':node=document.createTextNode(decode(token.text||token.raw||''));break;
     case 'codespan':node=element('code',token.text);break;
     case 'code':node=element('pre');node.className='max-w-full overflow-auto whitespace-pre-wrap rounded-lg bg-paper p-4';node.append(element('code',token.text));break;
     case 'br':node=element('br');break;
     case 'hr':node=element('hr');break;
     case 'link':node=inline(safeLink(token.href)?'a':'span');if(safeLink(token.href)){node.href=token.href;node.className='underline underline-offset-4';node.target='_blank';node.rel='noreferrer';}break;
     case 'image':node=photo(config.catalog[token.href],token.text||'', '');break;
     case 'blockquote':node=inline('blockquote');node.className='border-l border-line pl-4';break;
     case 'list':node=element(token.ordered?'ol':'ul');node.className=(token.ordered?'list-decimal':'list-disc')+' space-y-2 pl-7';if(token.ordered&&token.start)node.start=token.start;for(const item of token.items){const li=element('li');li.append(nodes(item.tokens,depth+1));node.append(li);}break;
     case 'table':{
      node=element('div');node.className='max-w-full overflow-auto';const table=element('table');table.className='w-full border-collapse text-left';
      const row=(cells,tag)=>{const tr=element('tr');for(const cell of cells){const td=element(tag);td.className='border border-line p-3';td.append(nodes(cell.tokens,depth+1));tr.append(td);}return tr;};
      const head=element('thead');head.append(row(token.header,'th'));const body=element('tbody');for(const cells of token.rows)body.append(row(cells,'td'));table.append(head,body);node.append(table);break;
     }
     default:node=document.createTextNode(token.raw||token.text||'');
    }
    fragment.append(node);
   }
   return fragment;
  }
  return nodes(marked.lexer(source,{gfm:true}));
 }
 function photo(src,alt,caption){
  const figure=element('figure');figure.className='m-0 min-w-0 space-y-2';
  if(src && /^\/\?page=image&/.test(src)) {const image=element('img');image.src=src;image.alt=alt;image.loading='lazy';const size=config.dimensions[src] || Array.from(form.querySelectorAll('[data-preview]')).find(image=>image.getAttribute('src')===src);if(size){image.width=size.width;image.height=size.height;}image.className='max-h-[420px] max-w-full object-contain';figure.append(image);}
  else figure.append(element('p',alt||'Image non choisie ou non autorisée dans cet aperçu.'));
  if(caption)figure.append(element('figcaption',caption));return figure;
 }
 function render(){
  if(!details.open)return;
  const en=language.value==='en',prefix=en?'english[':'',get=(fr,key=fr)=>value(en?prefix+key+']':fr);
  output.replaceChildren();status.textContent='';
  try{
   const title=get(config.kind==='product'?'name':'title');output.append(element('h2',title||'Titre à compléter'));
   output.firstChild.className='font-display text-title-lg font-bold';
   if(config.kind==='article'){
    output.append(element('p',get('excerpt')));
    const body=element('div');body.className='space-y-4';body.append(markdown(get('body')));output.append(body);
    const cover=form.querySelector('[data-cover] [data-preview]');if(value('cover'))output.append(photo(cover?.getAttribute('src'),get('cover_alt','coverAlt'),''));
   }
   const field=config.kind==='product'?'images':'gallery';
   for(const [index,row]of [...form.querySelectorAll('[data-gallery-item]')].entries()){
    if(!row.querySelector('[data-image-path]').value)continue;
    const alt=en?value(`english[${field}][${index}][alt]`):row.querySelector('[data-image-alt]').value;
    const caption=en?value(`english[${field}][${index}][caption]`):row.querySelector('[data-image-caption]')?.value||'';
    output.append(photo(row.querySelector('[data-preview]')?.getAttribute('src'),alt,caption));
   }
   if(config.groups.length){
    output.append(element('h3',en?value('english[groupsTitle]'):details.dataset.groupsTitle||''));
    output.append(element('p',en?value('english[groupsIntro]'):details.dataset.groupsIntro||''));
    config.groups.forEach((group,index)=>{
     const base=`english[groups][${index}]`,section=element('section');section.className='min-w-0 space-y-4 border-t border-line pt-5';
     section.append(element('h3',en?value(base+'[label]'):group.label),element('p',en?value(base+'[note]'):group.note||''));
     if(group.video)section.append(photo(group.video.preview,'Affiche de la vidéo','Vidéo conservée : '+group.video.src.split('/').at(-1)));
     group.photos.forEach((image,i)=>section.append(photo(image.preview,en?value(base+`[photos][${i}][alt]`):image.alt,en?value(base+`[photos][${i}][caption]`):image.caption||'')));
     output.append(section);
    });
   }
   if(en && !title)status.textContent='La version anglaise est encore à compléter.';
  }catch(error){status.textContent='L’aperçu n’a pas pu afficher ce texte. Votre saisie est conservée. '+error.message;}
 }
 output.addEventListener('click',event=>{const link=event.target.closest('a');if(link){event.preventDefault();status.textContent='Lien de l’article : '+link.getAttribute('href');}});
 const sync=()=>{if(validate)validate.disabled=!review?.checked;};sync();
 form.addEventListener('input',event=>{if(event.target!==review){if(review)review.checked=false;}sync();clearTimeout(timer);timer=setTimeout(render,150);});
 form.addEventListener('change',sync);language.addEventListener('change',render);details.addEventListener('toggle',render);
 form.querySelector('[data-open-editorial-preview]')?.addEventListener('click',()=>{details.open=true;details.scrollIntoView({block:'start',behavior:'auto'});details.querySelector('summary').focus({preventScroll:true});render();});
 // Les longues traductions de galeries passent dans un seul champ JSON, sans la limite PHP de 1 000 variables.
 window.addEventListener('pageshow',()=>{for(const input of form.querySelectorAll('[name^="english["]'))input.disabled=false;form.querySelector('[name=english_json]')?.remove();sync();});
 form.addEventListener('submit',()=>{
  const english={},controls=[...form.querySelectorAll('[name^="english["]')];
  for(const input of controls){const keys=[...input.name.matchAll(/\[([^\]]+)\]/g)].map(match=>match[1]);let target=english;keys.forEach((key,i)=>{if(i===keys.length-1)target[key]=input.value;else target=target[key]??=(/^\d+$/.test(keys[i+1])?[]:{});});}
  if(config.kind==='article'){english.gallery??=[];english.groups??=[];}
  let field=form.querySelector('[name=english_json]');if(!field){field=element('input');field.type='hidden';field.name='english_json';form.append(field);}field.value=JSON.stringify(english);for(const input of controls)input.disabled=true;
 });
}

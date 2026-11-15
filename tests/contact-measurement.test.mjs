import test from 'node:test';
import assert from 'node:assert/strict';
import {contactAction, contactPage, contactActivity} from '../src/lib/contact-measurement.ts';
import fs from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

test('contact links: no destination or message in the classification', () => {
  for (const [href, action] of [['tel:+224600000000','phone'], ['mailto:test@example.test?body=private','email'], ['https://wa.me/224600000000?text=private','whatsapp'], ['https://api.whatsapp.com/send?phone=1','whatsapp']]) assert.equal(contactAction(href), action);
  for (const href of ['/contact/', 'https://wa.me.evil.test/', 'https://evil.test/?next=wa.me', 'javascript:alert(1)', 'http://wa.me/1']) assert.equal(contactAction(href), null);
});

test('browser collector: minimal payload, no tracking when disabled, duplicate and cleanup handling', async () => {
  const code = ts.transpileModule(fs.readFileSync('src/components/layout/Audience.tsx','utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const mount = (endpoint, beaconFails = false) => {
    const events = new Map(); const sent = []; const fetched = []; let cleanup;
    class Element { closest() { return {href:'https://wa.me/224600000000?text=private-message'}; } }
    const exports = {};
    const context = {
      exports, process:{env:{NEXT_PUBLIC_AUDIENCE_URL:endpoint,NEXT_PUBLIC_BASE_PATH:'/groupe-baruck/en'}},
      require: name => name === 'react' ? {useEffect: effect => {cleanup=effect();}} : name === 'next/navigation' ? {usePathname:()=>'/groupe-baruck/en/studio-photo/'} : {contactAction,contactPage,contactActivity},
      Element, Blob, Date, Map, JSON,
      document:{referrer:'https://google.com/',addEventListener:(name,fn)=>events.set(name,fn),removeEventListener:name=>events.delete(name)},
      window:{location:{origin:'https://groupebaruck.com'},innerWidth:390},
      navigator:{sendBeacon:(endpoint,body)=>{ if(beaconFails) throw Error('blocked'); sent.push(body); return true; }},
      fetch:(endpoint,options)=>{fetched.push(options); return Promise.reject(Error('offline'));},
    };
    vm.runInNewContext(code,context); exports.Audience();
    const click = (overrides={}) => events.get('click')?.({target:new Element(),type:'click',button:0,isTrusted:true,defaultPrevented:false,...overrides});
    return {events,sent,fetched,click,cleanup};
  };
  const disabled=mount(''); disabled.click(); assert.equal(disabled.sent.length,0); assert.equal(disabled.events.size,0);
  const enabled=mount('https://example.test/collect.php');
  enabled.click({isTrusted:false}); enabled.click({defaultPrevented:true});
  assert.equal(enabled.sent.length,1,'only the existing page view');
  enabled.click(); enabled.click();
  assert.equal(enabled.sent.length,2);
  assert.deepEqual(JSON.parse(await enabled.sent[1].text()),{e:'whatsapp',p:'/studio-photo/',a:'studio-photo'});
  enabled.cleanup(); assert.equal(enabled.events.size,0);
  const blocked=mount('https://example.test/collect.php',true);
  assert.doesNotThrow(()=>blocked.click());
  assert.equal(blocked.fetched.length,2);
  assert.equal(blocked.fetched[1].credentials,'omit');
  await new Promise(resolve=>setImmediate(resolve));
});

test('same service context in French, English and the backup base path', () => {
  for (const [path, base] of [['/studio-photo/',''], ['/en/studio-photo/',''], ['/groupe-baruck/en/studio-photo/','/groupe-baruck'], ['/groupe-baruck/en/studio-photo/','/groupe-baruck/en']]) {
    assert.equal(contactPage(path, base), '/studio-photo/');
    assert.equal(contactActivity(contactPage(path, base)), 'studio-photo');
  }
  assert.equal(contactActivity('/contact/'), 'groupe');
  assert.equal(contactActivity('/hotesses-evenementielles/'), 'hotesses-evenementielles');
  for (const path of ['/contact/?email=private', '/contact/#private', '/../../private', '/x'.repeat(256), '//example.test/']) assert.equal(contactPage(path), null);
});

// Régression : soumission HTML native dans un profil Chrome éphémère.
// BARUCK_TEST_CHROME=/usr/bin/google-chrome npm run backoffice:test:mysql
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
if (!process.argv[2] || !/^http:\/\/127\.0\.0\.1:[0-9]+\/?$/.test(process.argv[2])) throw Error('Origine de recette locale requise');
const profile=await fs.mkdtemp(path.join(os.tmpdir(),'baruck-browser-'));
const chrome=spawn(process.env.BARUCK_TEST_CHROME || '/usr/bin/google-chrome',['--headless=new','--disable-gpu','--disable-background-networking','--no-first-run','--no-default-browser-check','--remote-debugging-port=0','--user-data-dir='+profile,'about:blank'],{stdio:'ignore'});
let socket;
try {
 let port;
 for(let i=0;i<100;i++){try{port=(await fs.readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];break;}catch{await new Promise(r=>setTimeout(r,100));}}
 if(!port)throw Error('Chrome indisponible');
 const tabs=await (await fetch('http://127.0.0.1:'+port+'/json/list')).json();
 socket=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
 await new Promise(r=>socket.addEventListener('open',r,{once:true}));
 let id=0;const pending=new Map();let loaded;
 socket.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const cb=pending.get(m.id);pending.delete(m.id);if (m.error) cb.reject(Error(m.error.message)); else cb.resolve(m.result);}if(m.method==='Page.loadEventFired'&&loaded){loaded();loaded=null;}});
 const send=(method,params={})=>new Promise((resolve,reject)=>{const next=++id;pending.set(next,{resolve,reject});socket.send(JSON.stringify({id:next,method,params}));});
 const load=()=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Chargement expiré')),15000);loaded=()=>{clearTimeout(timer);resolve();};});
 await send('Page.enable');
 let ready=load();await send('Page.navigate',{url:process.argv[2]});await ready;
 ready=load();await send('Runtime.evaluate',{expression:`document.querySelector('[name=email]').value='kkkk@dddd';document.querySelector('[name=password]').value='Recette12abc!';if(document.querySelector('[name=name]'))document.querySelector('[name=name]').value='Recette navigateur';document.querySelector('form').submit();`});await ready;
 const result=await send('Runtime.evaluate',{expression:'document.body.innerText',returnByValue:true});
 const text=result.result.value;
 assert.ok(!text.includes('La session du formulaire a expiré'), 'La soumission native doit conserver son origine et sa session');
 assert.ok(text.includes('adresse e-mail complète et valide'), 'La requête doit atteindre la validation serveur de création du compte');
 console.log('Formulaire natif Chrome : origine, session et validation serveur OK');
} finally {socket?.close();if(chrome.exitCode===null){const stopped=new Promise(r=>chrome.once('exit',r));chrome.kill();await stopped;}await fs.rm(profile,{recursive:true,force:true});}

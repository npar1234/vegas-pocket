// Network first for the page (so edits show up), cache as the offline fallback.
const CACHE='vegas-pocket-20261114-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('vegas-pocket-')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin)return;
  e.respondWith((async()=>{
    const c=await caches.open(CACHE);
    try{const r=await fetch(e.request);if(r.ok)c.put(e.request,r.clone());return r;}
    catch(err){return (await c.match(e.request,{ignoreSearch:true}))||(await c.match('./index.html'))||Response.error();}
  })());
});

const CACHE='must-final-v1';
const FILES=['./','./index.html','./manifest.json','./?v2'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.map(k=>{if(k!==CACHE)return caches.delete(k)}))));self.clients.claim();});

/* ▶▶▶ INÍCIO TRECHO — sw.js (Cache do App Shell do Hub) ◀◀◀ */
const CACHE_NAME = 'photoprint-hub-v1';
const ASSETS = [
  './index.html',
  './celular.html',
  './quiosque.html',
  './style.css',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => {
    return Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Ignora a API (sempre dados frescos)
  if (e.request.url.includes('workers.dev')) return;
  
  e.respondWith(
    caches.match(e.request).then((cached) => {
      return cached || fetch(e.request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, res.clone());
          return res;
        });
      });
    })
  );
});
/* ◀◀◀ FIM TRECHO — sw.js ▶▶▶ */

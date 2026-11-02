/* ===== INÍCIO sw.js (PHOTO PRINT) ===== */
// Troque este número a CADA atualização dos arquivos para o app buscar a versão nova
const VERSAO = 'v3';
const CACHE = 'photoprint-' + VERSAO;

// Telas conhecidas (as que não existirem são ignoradas sem dar erro)
const BASE = [
  './',
  './index.html',
  './painel.html',
  './galeria.html',
  './celular.html',
  './quiosque.html',
  './telao.html',
  './webcam.html',
  './botoeira.html',
  './manifest-hub.json',
  './manifest-painel.json',
  './manifest-galeria.json',
  './manifest-celular.json',
  './manifest-quiosque.json',
  './manifest-telao.json',
  './manifest-webcam.json',
  './manifest-botoeira.json',
  './icon-hub-192.png',
  './icon-painel-192.png',
  './icon-galeria-192.png',
  './icon-celular-192.png',
  './icon-quiosque-192.png',
  './icon-telao-192.png',
  './icon-webcam-192.png',
  './icon-botoeira-192.png',
  './icon-hub-512.png',
  './icon-painel-512.png',
  './icon-galeria-512.png',
  './icon-celular-512.png',
  './icon-quiosque-512.png',
  './icon-telao-512.png',
  './icon-webcam-512.png',
  './icon-botoeira-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(BASE.map((u) => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k.startsWith('photoprint-') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // nunca mexe em POST/PUT
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;        // API (Worker) e fotos (R2) passam direto, sem cache

  // Rede primeiro; se estiver sem internet, usa o que está guardado
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) {
          const copia = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copia));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
  );
});
/* ===== FIM sw.js ===== */

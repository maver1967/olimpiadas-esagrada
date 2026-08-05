const CACHE_NAME = 'olimpiadas-esagrada-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/team.html',
  '/projector.html',
  '/css/style.css',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-First strategy per forzare sempre l'ultima versione online
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/admin.html') || event.request.url.includes('/api/')) {
    return event.respondWith(fetch(event.request));
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

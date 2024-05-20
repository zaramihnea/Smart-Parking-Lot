const CACHE_NAME = 'smart-parking-lot-cache';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon_win.ico',
  '/favicon_mac.icns'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
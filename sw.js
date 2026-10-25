// MUST 92KG V6.1 CLOUD - Service Worker
const CACHE_NAME = 'must-92kg-v61-cloud';
const FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore-compat.js',
  'https://www.gstatic.com/firebasejs/10.7.0/firebase-database-compat.js'
];

// Install - Cache files
self.addEventListener('install', event => {
  console.log('[SW V6.1] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW V6.1] Caching files');
        return cache.addAll(FILES_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate - Clean old caches
self.addEventListener('activate', event => {
  console.log('[SW V6.1] Activating...');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          console.log('[SW V6.1] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch - Serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Skip Firebase requests - always go network for cloud
  if (event.request.url.includes('firestore.googleapis.com') ||
      event.request.url.includes('firebaseio.com') ||
      event.request.url.includes('firebase')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached or fetch
        return response || fetch(event.request)
          .then(fetchRes => {
            // Cache new requests (images, videos)
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchRes.clone());
              return fetchRes;
            });
          });
      })
      .catch(() => {
        // Offline fallback
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      })
  );
});

console.log('🔥 SW V6.1 CLOUD Loaded - MUST APP PAUL - KISASA');

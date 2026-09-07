const CACHE_NAME = 'next-gb-pro-v1';
const urlsToCache = [
  './index.html',
  './manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap'
];

// Instalación: Guarda los archivos esenciales en el caché
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activación: Limpia cachés antiguos si actualizas la versión
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch: Sirve la app desde el caché cuando no hay internet
self.addEventListener('fetch', event => {
  // Excluimos las llamadas a APIs externas (VIN y Tasa del Dólar) para que siempre intenten buscar datos frescos
  if (event.request.url.includes('api.whatsapp.com') || event.request.url.includes('vpic.nhtsa.dot.gov') || event.request.url.includes('open.er-api.com')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
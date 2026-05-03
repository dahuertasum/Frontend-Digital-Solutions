const CACHE_NAME = "ds-cache-v1";

const urlsToCache = [
  "/",
  "./index.html",
  "/manifest.json"
];

// Instalar
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cacheando archivos...");
      return cache.addAll(urlsToCache);
    })
  );
});

// Activar
self.addEventListener("activate", (event) => {
  console.log("Service Worker activado");
});

// Interceptar requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
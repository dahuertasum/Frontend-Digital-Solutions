const CACHE_NAME = "ds-cache-v2";

const urlsToCache = [
  "/",
  "/index.html",
  "/login.html",
  "/registro.html",
  "/css/style.css",
  "/js/app.js",
  "/js/cart.js",
  "/manifest.json"
];

// 🔹 INSTALAR
self.addEventListener("install", (event) => {
  console.log("🛠 Service Worker instalado");

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log("📦 Cacheando archivos...");
        return cache.addAll(urlsToCache);
      })
  );
});

// 🔹 ACTIVAR (limpia caches viejos)
self.addEventListener("activate", (event) => {
  console.log("⚡ Service Worker activado");

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("🗑 Eliminando cache viejo:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 🔹 FETCH (estrategia: cache first)
self.addEventListener("fetch", (event) => {

  event.respondWith(
    caches.match(event.request)
      .then((response) => {

        // ✔ Si está en cache → lo devuelve
        if (response) {
          return response;
        }

        // ❌ Si no está → lo busca en red
        return fetch(event.request)
          .then((networkResponse) => {

            // Guardar copia en cache (opcional pero pro)
            return caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });

          })
          .catch(() => {
            // 📴 fallback offline
            return caches.match("/index.html");
          });

      })
  );

});
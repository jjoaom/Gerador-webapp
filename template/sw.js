const CACHE_NAME = "v2"; // Atualize o número da versão do cache

// Lista de arquivos a serem armazenados em cache
const cacheFiles = [
  "index.php",
  "index.js",
  // Adicione mais arquivos aqui conforme necessário
];

// Instale o Service Worker
self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        // Adicione a flag de instalação ao cache
        return cache.addAll(cacheFiles)
                    .then(() => cache.put('appInstalled', new Response('true')));
      })
  );
});

// Gerencie solicitações de recursos
self.addEventListener("fetch", (event) => {
  if (event.request.method === "GET") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const clonedResponse = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });

          return response;
        })
        .catch(() => {
          return caches.match(event.request);
        })
    );
  } else {
    event.respondWith(fetch(event.request));
  }
});

// Atualize o cache quando um novo Service Worker for ativado
self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(thisCacheName) {
          if (thisCacheName !== CACHE_NAME) {
            return caches.delete(thisCacheName);
          }
        })
      );
    })
  );
});

// Evento de ativação do aplicativo
self.addEventListener('appinstalled', (event) => {
  // Quando o aplicativo é instalado, remova a flag de instalação do cache
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.delete('appInstalled');
    })
  );
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.open("pregnant-cache-v1").then(async (cache) => {
      try {
        const networkResponse = await fetch(event.request);
        if (event.request.method === "GET") {
          cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        const cachedResponse = await cache.match(event.request);
        return cachedResponse || new Response("Offline", { status: 503 });
      }
    }),
  );
});

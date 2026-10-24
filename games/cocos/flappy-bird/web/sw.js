const CACHE = "homerun-cocos-flappy-bird-web-1";
self.addEventListener("install", (event) =>
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      await cache.addAll(["loader.html", "loader.js"]);
      await self.skipWaiting();
    })(),
  ),
);
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || !url.href.startsWith(self.registration.scope)) return;
  if (event.request.headers.get("X-HomeRun-Download") === "1") return;
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const lookup = new URL(url);
      lookup.search = "";
      const response = await cache.match(lookup.href);
      if (response) return response;
      if (/\/\d+\.\d+\.\d+\/[a-f0-9]{32}\//.test(url.pathname))
        return new Response("Game file has not been verified", { status: 503 });
      return fetch(event.request);
    })(),
  );
});

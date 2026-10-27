// Service worker mínimo: permite instalar la app y abrirla sin conexión.
// Siempre intenta la red primero, así los cambios nuevos se ven de inmediato.
// Los precios (datos.json) nunca se guardan aquí: la app los pide siempre a GitHub.
const CACHE = "tarifario-v58";
const ARCHIVOS = ["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((claves) => Promise.all(claves.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const pedido = e.request;
  if (pedido.method !== "GET") return;
  const url = new URL(pedido.url);
  if (url.origin !== self.location.origin) return;        // GitHub API, fuentes: sin tocar
  if (url.pathname.endsWith("/datos.json")) return;       // los precios van directo a la red
  e.respondWith(
    fetch(pedido, { cache: "no-cache" })
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(CACHE).then((c) => c.put(pedido, copia)).catch(() => {});
        }
        return respuesta;
      })
      .catch(() => caches.match(pedido).then((r) => r || caches.match("index.html")))
  );
});

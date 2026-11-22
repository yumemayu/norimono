const scope = new URL(self.registration.scope);
const prefix = 'offline:' + scope.pathname + ':';
const live = prefix + 'visited';
const pack = prefix + 'games-shared-footer-v1';
const marker = new URL('offline-ready', scope).href;
const files = [
  "assets/bus-berry.webp",
  "assets/bus-gold.webp",
  "assets/bus-mint.webp",
  "assets/delivery-blue.webp",
  "assets/delivery.webp",
  "assets/game-language.js",
  "assets/norimono-layout.css",
  "assets/go-air-panorama.webp",
  "assets/go-air-snow.webp",
  "assets/go-air-sunset.webp",
  "assets/go-ambulance.webp",
  "assets/go-dump.webp",
  "assets/go-excavator.webp",
  "assets/go-fire-engine.webp",
  "assets/go-garbage-truck.webp",
  "assets/go-helicopter.webp",
  "assets/go-ladder-truck.webp",
  "assets/go-mixer.webp",
  "assets/go-shinkansen-blue.webp",
  "assets/go-shinkansen-green.webp",
  "assets/go-shinkansen-red.webp",
  "assets/go-shinkansen-yellow.webp",
  "assets/helicopter-mint.webp",
  "assets/helicopter.webp",
  "assets/plane.webp",
  "assets/police.webp",
  "assets/scenery.svg",
  "assets/shinkansen.svg",
  "assets/toddler-controls.css",
  "assets/toddler-controls.js",
  "assets/train-game-links.css",
  "assets/train-game-links.js",
  "delivery/index.html",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "index.html",
  "manifest.webmanifest",
  "offline.js",
  "town/index.html",
  "train-bento/index.html",
  "train-gacha/index.html",
  "train-pairs/index.html",
  "train-switch/index.html",
  "vehicle-book/index.html"
];
let preparing;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function savedPack() {
  const names = await caches.keys();
  for (const name of [pack, ...names.filter(name => name.startsWith(prefix + 'games-') && name !== pack).reverse()]) {
    if (!names.includes(name)) continue;
    const cache = await caches.open(name);
    if (await cache.match(marker)) return cache;
  }
  return null;
}
async function saveGames(report) {
  const cache = await caches.open(pack);
  if (await cache.match(marker)) return true;
  let next = 0, done = 0, failed = false;
  await Promise.all(Array.from({length: 6}, async () => {
    while (!failed && next < files.length) {
      const url = new URL(files[next++], scope);
      try {
        const response = await fetch(url, {cache: 'reload'});
        if (!response.ok || response.redirected) throw new Error(url.pathname);
        await cache.put(url, response);
        if (++done % 8 === 0 || done === files.length) report(done + '/' + files.length);
      } catch { failed = true; }
    }
  }));
  if (failed) return false;
  await cache.put(marker, new Response('ready'));
  const names = await caches.keys();
  await Promise.all(names.filter(name => name.startsWith(prefix + 'games-') && name !== pack).map(name => caches.delete(name)));
  return true;
}
self.addEventListener('message', event => {
  const port = event.ports[0];
  if (!port) return;
  if (event.data?.type === 'offline-status') {
    event.waitUntil(savedPack().then(cache => port.postMessage({ready: !!cache})));
  } else if (event.data?.type === 'prepare-offline') {
    preparing ||= saveGames(progress => port.postMessage({progress})).finally(() => { preparing = null; });
    event.waitUntil(preparing.then(ready => port.postMessage({ready}), () => port.postMessage({ready:false})));
  }
});
self.addEventListener('fetch', event => {
  const request = event.request, url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  const fallback = new URL(url);
  fallback.search = '';
  if (fallback.pathname.endsWith('/')) fallback.pathname += 'index.html';
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && !response.redirected && response.status === 200) {
        try { await (await caches.open(live)).put(request, response.clone()); } catch {}
      }
      return response;
    } catch {
      const saved = await savedPack();
      const offline = await saved?.match(fallback);
      if (offline) return offline;
      const recent = await caches.open(live);
      const hit = await recent.match(request) || await recent.match(request, {ignoreSearch:true});
      if (hit) return hit;
      if (request.mode === 'navigate') {
        return new Response('Offline · このページはまだ保存されていません。オンラインでゲーム集から保存してください。', {
          status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}
        });
      }
      return Response.error();
    }
  })());
});

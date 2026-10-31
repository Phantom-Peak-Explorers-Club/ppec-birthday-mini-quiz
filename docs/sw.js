const CACHE_NAME = 'ppec-mini-quiz-v7';
const CACHE_PREFIX = 'ppec-mini-quiz-';
const pictures = [
  'Copper', 'Dr Winter', 'Hogwood', 'Leadbelly', 'Littlefield', 'Lovehart',
  'Miramaze', 'Nethersole', 'Rexford', 'Rockbolt Theatre', 'Sherlock Bones', 'Sparks'
];
const files = [
  './', './index.html', './style.css', './app.js', './what-trail.js',
  './manifest.webmanifest', './assets/jonabot-jr.png',
  './assets/app-icon-180.png', './assets/app-icon-192.png', './assets/app-icon-512.png',
  ...['anagrams', 'catchphrase', 'missing-vowels', 'what-trail']
    .map(name => `./assets/game-logos/${name}.png`),
  ...pictures.map(name => `./assets/catchphrase/${encodeURIComponent(name)}.jpg`)
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME)
    .then(cache => cache.addAll(files.map(file => new URL(file, self.registration.scope))))
    .then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;

  if (request.mode === 'navigate' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(async () => (await caches.match(request, {ignoreSearch: true})) ||
      (await caches.match(new URL('./', scope))) || (await caches.match(new URL('./index.html', scope)))));
    return;
  }

  event.respondWith(caches.match(request, {ignoreSearch: true}).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});

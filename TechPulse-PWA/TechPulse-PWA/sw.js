/* TechPulse PWA - Service Worker */
const CACHE_NAME = 'techpulse-v1';
const OFFLINE_URL = '/offline.html';

// 预缓存核心资源
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icon-192.png',
  '/assets/icon-512.png'
];

// 安装事件 - 预缓存
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 网络请求拦截 - Network First 策略（API 请求）+ Cache First（静态资源）
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API 请求：Network First，失败时返回缓存
  if (url.pathname.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // 静态资源：Cache First，回退到网络
  if (url.origin === location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;
        return fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        });
      }).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // 其他跨域请求（图片等）直接放行
  event.respondWith(fetch(event.request));
});

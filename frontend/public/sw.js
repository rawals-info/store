// Service Worker for Taj Petha - safer caching strategy
// Version bump to invalidate previous caches
const CACHE_VERSION = 'v4';
const RUNTIME_CACHE = `taj-petha-runtime-${CACHE_VERSION}`;
const STATIC_CACHE = `taj-petha-static-${CACHE_VERSION}`;

// Only cache immutable static assets; avoid caching HTML/app data blindly
const STATIC_ASSETS = [
  '/manifest.json',
  '/hero_image.webp',
  '/logo.png',
  '/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('taj-petha-') && ![STATIC_CACHE, RUNTIME_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// Helper to detect navigation requests (HTML)
function isNavigationRequest(request) {
  return request.mode === 'navigate' || (request.headers && request.headers.get('accept')?.includes('text/html'));
}

// Skip cross-origin requests entirely
function isCrossOrigin(request) {
  try {
    const url = new URL(request.url);
    return url.origin !== self.location.origin;
  } catch (_) {
    return true;
  }
}

// Runtime fetch handling
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (isCrossOrigin(request)) {
    return; // do not interfere with third-party requests
  }

  // Avoid caching Next.js data routes and APIs
  const url = new URL(request.url);
  // Completely bypass Next.js internals so headers and caching are handled by the platform/CDN
  if (
    url.pathname.startsWith('/_next/') ||
    url.pathname.startsWith('/api/')
  ) {
    return; // let the network handle it
  }

  // Always network for navigation (do not cache HTML) to avoid stale HTML referencing old chunks
  if (isNavigationRequest(request)) {
    event.respondWith(
      fetch(request)
        .catch(() => caches.match(request))
    );
    return;
  }

  // For first-party images and fonts (excluding Next internals), use cache-first
  if (/\.(?:png|jpg|jpeg|gif|svg|webp|ico|woff2?|ttf|eot)$/i.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((networkResponse) => {
          const copy = networkResponse.clone();
          caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
          return networkResponse;
        });
      })
    );
    return;
  }

  // Default: pass-through
});
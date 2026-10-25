// 讓網頁版在沒有網路時也能開啟：先用快取，背景再更新（下次開啟就是新版）。
var CACHE = 'teacher-notes-1.7.0-mvnt4n6o';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.png', 'icon-192.png', 'icon-512-maskable.png', 'apple-touch-icon.png', 'icon.svg', 'vendor/jspdf.umd.min.js', 'vendor/html2canvas.min.js'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k.indexOf('teacher-notes-') === 0 && k !== CACHE; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  // 只處理本站的檔案；Google 登入、雲端硬碟、字型都直接連網
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(e.request, { ignoreSearch: true }).then(function (hit) {
        var net = fetch(e.request).then(function (res) {
          if (res.ok) c.put(e.request, res.clone());
          return res;
        });
        if (hit) { net.catch(function () {}); return hit; }
        return net;
      });
    })
  );
});

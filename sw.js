// 讓網頁版在沒有網路時也能開啟：先用快取，背景再更新（下次開啟就是新版）。
// 只快取這裡明列的靜態檔（#92）：其他同源 GET 一律直接連網，不寫進快取；帶查詢參數的網址也不算白名單，不同參數不會互相命中。
var CACHE = 'teacher-notes-1.9.1-mvwk70k7';
var SHELL = ['./', 'index.html', 'manifest.webmanifest', 'icon.png', 'icon-192.png', 'icon-512-maskable.png', 'apple-touch-icon.png', 'icon.svg', 'vendor/jspdf.umd.min.js', 'vendor/html2canvas.min.js'];
// 按下功能才下載的元件（拍照辨識、PDF）：不在安裝時下載，用過一次後離線也能用。清單由 web/build.js 組建時填入
var LAZY = ["vendor/ocr/chi_tra.traineddata", "vendor/ocr/NOTICE.md", "vendor/ocr/tesseract-core-simd-lstm.wasm.js", "vendor/ocr/tesseract.min.js", "vendor/ocr/worker.min.js", "vendor/ocr/licenses/tesseract.js-core.LICENSE", "vendor/ocr/licenses/tesseract.js.LICENSE.md", "vendor/pdf/LICENSE", "vendor/pdf/NOTICE.md", "vendor/pdf/pdf.min.js", "vendor/pdf/pdf.worker.min.js", "vendor/pdf/cmaps/Adobe-CNS1-0.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-1.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-2.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-3.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-4.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-5.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-6.bcmap", "vendor/pdf/cmaps/Adobe-CNS1-UCS2.bcmap", "vendor/pdf/cmaps/B5-H.bcmap", "vendor/pdf/cmaps/B5-V.bcmap", "vendor/pdf/cmaps/B5pc-H.bcmap", "vendor/pdf/cmaps/B5pc-V.bcmap", "vendor/pdf/cmaps/CNS-EUC-H.bcmap", "vendor/pdf/cmaps/CNS-EUC-V.bcmap", "vendor/pdf/cmaps/CNS1-H.bcmap", "vendor/pdf/cmaps/CNS1-V.bcmap", "vendor/pdf/cmaps/CNS2-H.bcmap", "vendor/pdf/cmaps/CNS2-V.bcmap", "vendor/pdf/cmaps/ETen-B5-H.bcmap", "vendor/pdf/cmaps/ETen-B5-V.bcmap", "vendor/pdf/cmaps/ETenms-B5-H.bcmap", "vendor/pdf/cmaps/ETenms-B5-V.bcmap", "vendor/pdf/cmaps/ETHK-B5-H.bcmap", "vendor/pdf/cmaps/ETHK-B5-V.bcmap", "vendor/pdf/cmaps/HKdla-B5-H.bcmap", "vendor/pdf/cmaps/HKdla-B5-V.bcmap", "vendor/pdf/cmaps/HKdlb-B5-H.bcmap", "vendor/pdf/cmaps/HKdlb-B5-V.bcmap", "vendor/pdf/cmaps/HKgccs-B5-H.bcmap", "vendor/pdf/cmaps/HKgccs-B5-V.bcmap", "vendor/pdf/cmaps/HKm314-B5-H.bcmap", "vendor/pdf/cmaps/HKm314-B5-V.bcmap", "vendor/pdf/cmaps/HKm471-B5-H.bcmap", "vendor/pdf/cmaps/HKm471-B5-V.bcmap", "vendor/pdf/cmaps/HKscs-B5-H.bcmap", "vendor/pdf/cmaps/HKscs-B5-V.bcmap", "vendor/pdf/cmaps/LICENSE", "vendor/pdf/cmaps/UniCNS-UCS2-H.bcmap", "vendor/pdf/cmaps/UniCNS-UCS2-V.bcmap", "vendor/pdf/cmaps/UniCNS-UTF16-H.bcmap", "vendor/pdf/cmaps/UniCNS-UTF16-V.bcmap", "vendor/pdf/cmaps/UniCNS-UTF32-H.bcmap", "vendor/pdf/cmaps/UniCNS-UTF32-V.bcmap", "vendor/pdf/cmaps/UniCNS-UTF8-H.bcmap", "vendor/pdf/cmaps/UniCNS-UTF8-V.bcmap"];

var PATHS = {};
SHELL.concat(LAZY).forEach(function (p) { PATHS[new URL(p, location.href).pathname] = 1; });
var PAGES = {};
['./', 'index.html'].forEach(function (p) { PAGES[new URL(p, location.href).pathname] = 1; });

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
  if (url.search || !PATHS[url.pathname]) {
    // App 本身用查詢參數開啟（例如 ?mode=local）：有網路走網路，離線才回外殼；回應都不寫進快取
    if (e.request.mode === 'navigate' && PAGES[url.pathname]) {
      e.respondWith(fetch(e.request).catch(function () {
        return caches.open(CACHE).then(function (c) { return c.match('index.html'); });
      }));
    }
    return;
  }
  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(e.request).then(function (hit) {
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

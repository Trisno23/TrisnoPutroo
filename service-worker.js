
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("tni-cache-v1").then((cache) => {
      return cache.addAll([
        "./",
        "./index.html",
        "./css/style.css",
        "./js/main.js",
        "./manifest.json",
        "./pages/cek.html",
        "./pages/detail.html",
        "./pages/tentang.html",
        "./pages/detail_persyaratan.html",
        "./pages/faq.html",
        "./pages/jalur_ad.html",
        "./pages/jalur_al.html",
        "./pages/jalur_au.html",
        "./pages/ringkasan_jalur.html",
        "./pages/simulasi_fisik.html",
        "./pages/tahapan_seleksi.html",
        "./js/cekSyarat.js",
        "./assets/icon.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

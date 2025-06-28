// main.js

let deferredPrompt;

// 1. Buat tombol dan beri ID agar bisa diatur dari CSS
const installBtn = document.createElement("button");
installBtn.id = "installBtn";
installBtn.textContent = "📲 Instal Aplikasi";
installBtn.style.display = "none"; // awalnya tetap disembunyikan
document.body.appendChild(installBtn);

// 2. Register Service Worker
if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
        navigator.serviceWorker.register("service-worker.js")
            .then(res => console.log("✅ Service Worker registered", res.scope))
            .catch(err => console.log("❌ SW registration failed", err));
    });
}

// 3. Tangkap event 'beforeinstallprompt'
window.addEventListener('beforeinstallprompt', (e) => {
    console.log('📦 beforeinstallprompt event fired.');
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = 'block'; // tampilkan tombol dari CSS
    console.log('Install button shown.');
});

// 4. Saat tombol diklik
installBtn.addEventListener('click', async () => {
    console.log('🟢 Custom install button clicked.');
    installBtn.style.display = 'none';

    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`User response to the install prompt: ${outcome}`);
        deferredPrompt = null;

        if (outcome === 'accepted') {
            console.log('✅ PWA installed.');
        } else {
            console.log('❌ PWA install dismissed.');
        }
    }
});

// 5. Tangani event appinstalled
window.addEventListener('appinstalled', () => {
    installBtn.style.display = 'none';
    console.log('🎉 PWA installed successfully.');
});


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(console.error);
  });
}

let deferredPrompt;
const installBtn = document.createElement('button');
installBtn.id = 'btn-pwa-install';
installBtn.innerHTML = '<i class="fas fa-download"></i> Instalar App';
installBtn.style.display = 'none';
document.body.appendChild(installBtn);

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'flex';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  if (outcome === 'accepted') installBtn.style.display = 'none';
  deferredPrompt = null;
});

// Suporte iOS
const isIos = () => /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
if (isIos() && !isInStandaloneMode()) {
  setTimeout(() => {
    const toast = document.createElement('div');
    toast.style = "position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.9);border:1px solid var(--accent);color:var(--accent);padding:12px 20px;border-radius:20px;font-size:12px;font-weight:bold;z-index:9999;text-align:center;width:90%;max-width:300px;";
    toast.innerHTML = 'Para instalar: toque em <b>Compartilhar</b> e depois em <b>Adicionar à Tela de Início</b>.';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 8000);
  }, 3000);
}

(() => {
  const install = document.querySelector('#pwa-install');
  const save = document.querySelector('#pwa-save');
  const guide = document.querySelector('#pwa-guide');
  const status = document.querySelector('#pwa-status');
  const root = new URL('./', document.currentScript.src);
  const standalone = matchMedia('(display-mode: standalone)');
  const copy = {
    ja: { install: 'ホーム画面に追加', save: 'オフラインであそぶ準備', ready: 'オフラインであそべます', failed: '保存できませんでした。ネットにつないでもう一度お試しください。', busy: 'ゲームを保存中', unsupported: 'このブラウザではオフライン保存を使えません。', ios: 'Safariでゲーム集を開き、共有 →「ホーム画面に追加」→「追加」。表示される場合は「Webアプリとして開く」をオンにします。', browser: 'ChromeやEdgeのメニューから「アプリをインストール」または「ホーム画面に追加」を選びます。アプリ内ブラウザの場合は、まずSafariまたはChromeで開いてください。' },
    en: { install: 'Add to home screen', save: 'Save games for offline', ready: 'Ready to play offline', failed: 'Could not save the games. Connect to the internet and try again.', busy: 'Saving games', unsupported: 'Offline saving is unavailable in this browser.', ios: 'Open the games in Safari, tap Share, then Add to Home Screen and Add. Turn on Open as Web App if offered.', browser: 'In Chrome or Edge, use Install app or Add to Home screen from the browser menu. From an in-app browser, open the page in Safari or Chrome first.' }
  };
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let promptEvent, installed = false, state = '', progress = '';
  function render() {
    const t = copy[document.documentElement.lang.startsWith('ja') ? 'ja' : 'en'];
    install.textContent = t.install;
    install.hidden = installed || standalone.matches || navigator.standalone === true;
    install.setAttribute('aria-expanded', String(!guide.hidden));
    save.textContent = t.save;
    save.disabled = state === 'busy' || state === 'unsupported';
    guide.textContent = ios ? t.ios : t.browser;
    status.textContent = state ? t[state] + (progress ? ' ' + progress : '') : '';
  }
  new MutationObserver(render).observe(document.documentElement, { attributeFilter: ['lang'] });
  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    promptEvent = event;
  });
  window.addEventListener('appinstalled', () => {
    installed = true;
    guide.hidden = true;
    render();
  });
  install.addEventListener('click', async () => {
    if (promptEvent) {
      const event = promptEvent;
      promptEvent = null;
      try { await event.prompt(); return; } catch {}
    }
    guide.hidden = !guide.hidden;
    render();
  });
  if (!('serviceWorker' in navigator)) {
    state = 'unsupported';
    render();
    return;
  }
  const registration = navigator.serviceWorker.register(new URL('sw.js', root), { updateViaCache: 'none' });
  function workerReady() {
    return Promise.race([
      registration.then(() => navigator.serviceWorker.ready),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Worker timed out')), 10000))
    ]);
  }
  async function request(type, onProgress) {
    const reg = await workerReady();
    return new Promise((resolve, reject) => {
      const channel = new MessageChannel();
      let timer;
      const resetTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(() => { channel.port1.close(); reject(new Error('Offline request timed out')); }, 90000);
      };
      resetTimer();
      channel.port1.onmessage = ({data}) => {
        if (data.progress) {
          resetTimer();
          onProgress?.(data.progress);
          return;
        }
        clearTimeout(timer); channel.port1.close();
        resolve(data.ready);
      };
      reg.active.postMessage({ type }, [channel.port2]);
    });
  }
  save.addEventListener('click', async () => {
    state = 'busy';
    render();
    try {
      state = await request('prepare-offline', count => { progress = count; render(); }) ? 'ready' : 'failed';
    } catch { state = 'failed'; }
    progress = '';
    render();
  });
  render();
  request('offline-status').then(ready => {
    if (!state && ready) { state = 'ready'; render(); }
  }).catch(() => {});
})();

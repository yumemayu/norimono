(() => {
  const nav = document.querySelector('nav.hiiro-links');
  if (!nav) return;

  const base = new URL('../', document.currentScript.src);
  const currentPath = location.pathname.replace(/index\.html$/, '').replace(/\/$/, '');
  const games = [
    ['./', '🚃', 'のりもの しゅっぱつ！', 'Vehicles, Go!', '#ffedb6'],
    ['vehicle-book/', '📖', 'のりものずかん', 'Vehicle Book', '#d4eee1'],
    ['train-gacha/', '🎁', 'でんしゃガチャ', 'Surprise Trains', '#f7dce8'],
    ['train-bento/', '🍱', 'でんしゃのおべんとうばこ', 'Train Bento Box', '#fce2ca'],
    ['train-pairs/', '🚆', 'でんしゃペア', 'Train Pairs', '#d7ecfa'],
    ['delivery/', '📦', 'のりもの おとどけ便', 'Vehicle Delivery', '#ffe6c3'],
    ['train-switch/', '🚦', 'しんごう、どっち？', 'Switch the Tracks!', '#f6ebbe'],
    ['town/', '🏘️', 'のりもの まちさんぽ', 'Vehicle Town Stroll', '#dcebd0'],
  ];

  const linkLabels = [];
  for (const [path, icon, ja, en, color] of games) {
    const destination = new URL(path, base);
    if (destination.pathname.replace(/\/$/, '') === currentPath) continue;
    const link = document.createElement('a');
    link.href = destination.href;
    link.style.setProperty('--banner-color', color);
    const symbol = document.createElement('span');
    symbol.className = 'banner-icon';
    symbol.setAttribute('aria-hidden', 'true');
    symbol.textContent = icon;
    const label = document.createElement('span');
    link.append(symbol, label);
    nav.append(link);
    linkLabels.push({ label, ja, en });
  }

  function updateLanguage() {
    const english = document.documentElement.lang === 'en';
    nav.setAttribute('aria-label', english ? 'More vehicle games' : 'ほかの のりものゲーム');
    for (const { label, ja, en } of linkLabels) label.textContent = english ? en : ja;
  }
  new MutationObserver(updateLanguage).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['lang'],
  });
  updateLanguage();
})();

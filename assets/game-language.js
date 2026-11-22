(() => {
  const key = 'norimono-lang';
  const button = document.querySelector('#game-language');
  const translations = new Map(Object.entries({
    'のりもの おとどけ便': 'Vehicle Delivery',
    'しんごう、どっち？': 'Switch the Tracks!',
    'のりもの まちさんぽ': 'Vehicle Town Stroll',
    'ゲームをきりかえる': 'Switch games',
    '🏠 のりもの一覧': '🏠 Vehicle games',
    'ほかの のりものゲーム': 'More vehicle games',
    'のりもの しゅっぱつ！': 'Ready, Set, Go!',
    'のりものずかん': 'Vehicle Book',
    'でんしゃガチャ': 'Train Gacha',
    'でんしゃのおべんとうばこ': 'Train Bento Box',
    'でんしゃペア': 'Train Pairs',
    'ご要望を送る': 'Send feedback',
    'トラック': 'Truck',
    'ヘリコプター': 'Helicopter',
    'ひこうき': 'Airplane',
    'クロワッサン': 'Croissant',
    'おてがみ': 'Letter',
    'プレゼント': 'Gift',
    'まちの パンやさんへ。どうろを はしって とどけよう': 'Drive to the town bakery.',
    'しまの ともだちへ。ちいさな ひろばに おりよう': 'Land in the small clearing to visit your island friend.',
    'とおくの くうこうへ。ながい かっそうろに おりよう': 'Land on the long runway at the airport.',
    'もういちど。どうろを はしって とどけよう': 'Try again. Which vehicle can drive on the road?',
    'もういちど。ちいさな ひろばに おりよう': 'Try again. Which vehicle can land in the small clearing?',
    'もういちど。ながい かっそうろに おりよう': 'Try again. Which vehicle can land on the long runway?',
    'クロワッサンを はこぶ のりものを えらぼう。どうろを はしって とどけよう': 'Pick a vehicle to deliver the croissant by road.',
    'おてがみを はこぶ のりものを えらぼう。ちいさな ひろばに おりよう': 'Pick a vehicle that can deliver the letter to the small clearing.',
    'プレゼントを はこぶ のりものを えらぼう。ながい かっそうろに おりよう': 'Pick a vehicle that can deliver the gift and land on the long runway.',
    'パンやさんが オープン！': 'The bakery is open!',
    'おてがみが ついたよ！': 'The letter arrived!',
    'プレゼントが ついたよ！': 'The gift arrived!',
    '🎉 ぜんぶの にもつが とどいたよ！': '🎉 All the packages arrived!',
    'つぎの おとどけ': 'Next delivery',
    'もういちど': 'Play again',
    '🔊 おと': '🔊 Sound',
    '🔇 おと': '🔇 Sound',
    'きいろの えき': 'Yellow station',
    'あおの えき': 'Blue station',
    '分かれ道を切り替える': 'Switch the tracks',
    'きいろ': 'Yellow',
    'あお': 'Blue',
    'しゅっぱつ': 'Go!',
    'ぜんぶの でんしゃが ついたよ！': 'All the trains arrived!',
    'ぴったりの えきに ついたよ！': 'You reached the right station!',
    'つぎの でんしゃ': 'Next train',
    'まちをえらぶ': 'Choose a town',
    'くるまがはしるまち': 'Town map with moving vehicles',
    'くるまを タップしてね': 'Tap a vehicle',
    'のりものを タップしてね': 'Tap a vehicle',
    'えきまえ': 'Station Town',
    'うみべ': 'Seaside',
    'やまのまち': 'Mountain Town',
    'かわべのまち': 'Riverside Town',
    'はじめのまち': 'First Town',
    'バス': 'Bus',
    'パトカー': 'Police car',
    'しょうぼうしゃ': 'Fire engine',
    'きゅうきゅうしゃ': 'Ambulance',
    'バスを おいかけるよ': 'Following the bus',
    'パトライトが ひかるよ': 'The police lights are flashing',
    'あかい ランプが ひかるよ': 'The red lights are flashing',
    'ライトが ひかるよ': 'The lights are on',
    'おおきく': 'Bigger',
    'もとの大きさ': 'Reset size',
    'おと オフ': 'Sound off',
    'おと オン': 'Sound on',
    'しょうぼうしょから しゅつどう': 'Dispatch the fire engine',
    'しょうぼうしゃが しゅつどうするよ': 'The fire engine is on its way!',
    'きいろい しんかんせん': 'Yellow Shinkansen',
    'でんしゃ': 'Train'
  }));
  const patterns = [
    [/^とどいた にもつ +(.+)$/, (_, count) => 'Packages delivered  ' + count],
    [/^ついた でんしゃ +(.+)$/, (_, count) => 'Trains arrived  ' + count],
    [/^(.+)を のせよう！$/, (_, name) => 'Load the ' + (translations.get(name) ?? name).toLowerCase() + '!'],
    [/^(.+)で しゅっぱつ！$/, (_, name) => 'Let’s go by ' + (translations.get(name) ?? name).toLowerCase() + '!'],
    [/^([☀☁]) (きいろ|あお)の しんかんせん$/, (_, icon, color) => icon + ' ' + translations.get(color) + ' Shinkansen'],
    [/^([☀☁]) (きいろ|あお)の えきを タップ！$/, (_, icon, color) => icon + ' Tap the ' + translations.get(color).toLowerCase() + ' station!'],
    [/^([☀☁]) (きいろ|あお)の えきを さがそう$/, (_, icon, color) => icon + ' Find the ' + translations.get(color).toLowerCase() + ' station'],
    [/^(.+) · もういちど タップで もどる$/, (_, message) => translate(message) + ' · Tap again to go back'],
    [/^(.+)を おいかけるよ$/, (_, name) => 'Following the ' + (translations.get(name) ?? name).toLowerCase()]
  ];

  function translate(value) {
    const phrase = value.trim();
    const exact = translations.get(phrase);
    if (exact) return value.replace(phrase, exact);
    for (const [pattern, render] of patterns) {
      if (pattern.test(phrase)) return value.replace(phrase, phrase.replace(pattern, render));
    }
    return value;
  }

  let english = false;
  const original = new WeakMap();
  function localize(node, read, write) {
    const value = read();
    const saved = original.get(node);
    const source = saved?.rendered === value ? saved.source : value;
    const rendered = english ? translate(source) : source;
    if (rendered !== source) original.set(node, { source, rendered });
    else original.delete(node);
    if (rendered !== value) write(rendered);
  }

  function scan(node) {
    const element = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    if (element?.closest('.hiiro-links')) return;
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest('script, style, #game-language')) return;
      localize(node, () => node.data, value => { node.data = value; });
    } else if (node.nodeType === Node.ELEMENT_NODE && !node.matches('script, style, #game-language')) {
      for (const name of ['aria-label', 'alt', 'title']) {
        const attribute = node.getAttributeNode(name);
        if (attribute) localize(attribute, () => attribute.value, value => { attribute.value = value; });
      }
      for (const child of node.childNodes) scan(child);
    }
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      if (record.type === 'childList') {
        for (const node of record.addedNodes) scan(node);
      } else if (record.type === 'attributes') {
        if (record.target.closest('.hiiro-links')) continue;
        const attribute = record.target.getAttributeNode(record.attributeName);
        if (attribute) localize(attribute, () => attribute.value, value => { attribute.value = value; });
      } else {
        scan(record.target);
      }
    }
  });
  function apply() {
    try { english = localStorage.getItem(key) === 'en'; } catch {}
    render();
  }
  function render() {
    document.documentElement.lang = english ? 'en' : 'ja';
    button.textContent = english ? 'にほんご' : 'English';
    button.lang = english ? 'ja' : 'en';
    scan(document.querySelector('title'));
    scan(document.querySelector('main'));
  }
  button.addEventListener('click', () => {
    english = !english;
    try { localStorage.setItem(key, english ? 'en' : 'ja'); } catch {}
    render();
  });
  window.addEventListener('storage', event => {
    if (event.key === key || event.key === null) apply();
  });
  apply();
  observer.observe(document.querySelector('main'), {
    subtree: true, childList: true, characterData: true, attributes: true,
    attributeFilter: ['aria-label', 'alt', 'title']
  });
})();

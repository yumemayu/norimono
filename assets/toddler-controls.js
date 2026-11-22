// Feedback never queues audio or blocks another tap.
(()=>{let active,timer;document.addEventListener('pointerdown',event=>{const button=event.target.closest('button');if(!button||button.disabled||event.button!==0)return;active?.classList.remove('hiiro-tapped');clearTimeout(timer);active=button;button.classList.add('hiiro-tapped');timer=setTimeout(()=>button.classList.remove('hiiro-tapped'),280);},true);})();

const norimonoAudio = (() => {
  let level = 1;
  const outputs = new Map();
  const audio = {
    get volume() { return level; },
    output(context) {
      if (!outputs.has(context)) {
        const gain = context.createGain();
        gain.gain.value = level;
        gain.connect(context.destination);
        outputs.set(context, gain);
      }
      return outputs.get(context);
    },
  };

  const main=document.querySelector('main'),nav=document.querySelector('nav.hiiro-links');
  if(!main||!nav)return audio;
  const settings=document.createElement('details');
  settings.className='parent-settings';
  const summary=document.createElement('summary');
  summary.id='parent-settings-label';
  const body=document.createElement('div');
  body.className='parent-settings-body';
  settings.append(summary,body);
  nav.before(settings);
  let volumeCaption;
  const language=document.querySelector('#lang,#language,#game-language');
  if(language)body.append(language);
  const soundGroup=document.querySelector('.sound');
  if(soundGroup)body.append(soundGroup);
  else { const sound=document.querySelector('#sound');if(sound)body.append(sound); }

  if (main.hasAttribute('data-game-audio')) {
    const label = document.createElement('label');
    label.className = 'parent-volume';
    const caption = document.createElement('span');
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = '0';
    slider.max = '100';
    slider.value = '100';
    slider.id = 'parent-volume';
    const value = document.createElement('output');
    value.htmlFor = slider.id;
    value.textContent = '100%';
    slider.addEventListener('input', () => {
      level = Number(slider.value) / 100;
      value.textContent = slider.value + '%';
      for (const output of outputs.values()) output.gain.value = level;
    });
    label.append(caption, slider, value);
    body.append(label);
    volumeCaption = caption;
  }
  const update=()=>{
    const en=document.documentElement.lang==='en';
    if (volumeCaption) volumeCaption.textContent = en ? 'Volume' : 'おんりょう';
    summary.textContent=en?'⚙ Grown-up settings':'⚙ おとなの せってい';
  };
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  update();
  return audio;
})();

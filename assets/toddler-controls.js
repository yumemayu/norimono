// Feedback never queues audio or blocks another tap.
(()=>{let active,timer;document.addEventListener('pointerdown',event=>{const button=event.target.closest('button');if(!button||button.disabled||event.button!==0)return;active?.classList.remove('hiiro-tapped');clearTimeout(timer);active=button;button.classList.add('hiiro-tapped');timer=setTimeout(()=>button.classList.remove('hiiro-tapped'),280);},true);})();

(()=> {
  const main=document.querySelector('main'),nav=document.querySelector('nav.hiiro-links');
  if(!main||!nav)return;
  const settings=document.createElement('details');
  settings.className='parent-settings';
  const summary=document.createElement('summary');
  summary.id='parent-settings-label';
  const body=document.createElement('div');
  body.className='parent-settings-body';
  settings.append(summary,body);
  nav.before(settings);
  const language=document.querySelector('#lang,#language');
  if(language)body.append(language);
  const soundGroup=document.querySelector('.sound');
  if(soundGroup)body.append(soundGroup);
  else { const sound=document.querySelector('#sound');if(sound)body.append(sound); }
  const speed=document.querySelector('#speed-label')?.parentElement;
  if(speed)body.append(speed);
  const mode=document.querySelector('#mode');
  if(mode)body.append(mode);
  const update=()=>{
    const en=document.documentElement.lang==='en';
    summary.textContent=en?'⚙ Grown-up settings':'⚙ おとなの せってい';
    nav.setAttribute('aria-label',en?'More vehicle games':'ほかの のりものゲーム');
  };
  new MutationObserver(update).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  update();
})();

function getThemePref(){ try{ return localStorage.getItem('theme-pref') || 'auto'; }catch(e){ return 'auto'; } }
function setThemePref(p){ try{ localStorage.setItem('theme-pref', p); }catch(e){} applyTheme(p); renderThemeBtn(); }
function applyTheme(p){
  if(p==='light') document.documentElement.setAttribute('data-theme','light');
  else if(p==='dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
}
function cycleTheme(){
  const cur = getThemePref();
  setThemePref(cur==='auto' ? 'light' : cur==='light' ? 'dark' : 'auto');
}
function renderThemeBtn(){
  const p = getThemePref();
  const label = p==='auto' ? '🖥️ Auto' : p==='light' ? '☀️ Lys' : '🌙 Mørk';
  let btn = document.getElementById('themebtn');
  if(!btn){
    btn = document.createElement('button');
    btn.id = 'themebtn';
    btn.className = 'themebtn';
    btn.type = 'button';
    btn.onclick = cycleTheme;
    document.body.appendChild(btn);
  }
  btn.textContent = label;
  btn.title = 'Skift mellem lys, mørk og automatisk (system) tilstand';
}
applyTheme(getThemePref());
renderThemeBtn();

// ---------- global søgning (floating knap + overlay, uafhængig af render()) ----------
function scrollToSearchTarget(id){
  let el;
  try{ el = document.querySelector('[data-search-id="'+id+'"]'); }catch(e){ return; }
  if(!el) return;
  try{ el.scrollIntoView({behavior:'smooth', block:'center'}); }catch(e){}
  try{
    el.classList.add('search-flash');
    setTimeout(()=>{ try{ el.classList.remove('search-flash'); }catch(e){} }, 1800);
  }catch(e){}
}
function renderSearchResults(query){
  const results = document.getElementById('searchresults');
  if(!results) return;
  const q = (query||'').trim().toLowerCase();
  if(!q){
    results.innerHTML = `<div class="searchempty">Begynd at skrive for at søge i begreber &amp; teorier, modeller, opgaver og Hjemmesidens skridt.</div>`;
    return;
  }
  const terms = q.split(/\s+/).filter(Boolean);
  const matches = SEARCH_INDEX.filter(e=>terms.every(t=>e.text.includes(t))).slice(0,40);
  if(!matches.length){
    results.innerHTML = `<div class="searchempty">Intet fundet for "${esc(query)}".</div>`;
    return;
  }
  const typeLabel = {begreb:'Begreber & teorier', model:'Modeller', opgave:'Opgaver', skridt:'Hjemmesiden — skridt'};
  const order = ['begreb','model','opgave','skridt'];
  let htm = '';
  order.forEach(ty=>{
    const group = matches.filter(r=>r.type===ty);
    if(!group.length) return;
    htm += `<div class="searchgroup-label">${esc(typeLabel[ty])}</div>`;
    group.forEach(r=>{
      const i = SEARCH_INDEX.indexOf(r);
      htm += `<button class="searchresult" onclick="goSearchResult(${i})">
        <span class="srtitle">${r.icon} ${esc(r.title)}</span>
        <span class="srmeta">${esc(r.meta)}</span>
        ${r.snippet?`<span class="srsnippet">${esc(r.snippet)}</span>`:''}
      </button>`;
    });
  });
  results.innerHTML = htm;
}
function onSearchInput(v){ renderSearchResults(v); }
function goSearchResult(i){
  const r = SEARCH_INDEX[i];
  if(!r) return;
  closeSearch();
  r.go();
}
function openSearch(){
  const ov = document.getElementById('searchoverlay');
  if(ov) ov.hidden = false;
  const inp = document.getElementById('searchinput');
  if(inp){ inp.value=''; inp.focus(); }
  renderSearchResults('');
}
function closeSearch(){
  const ov = document.getElementById('searchoverlay');
  if(ov) ov.hidden = true;
}
function initSearchUI(){
  if(document.getElementById('searchoverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'searchoverlay';
  overlay.className = 'searchoverlay';
  overlay.hidden = true;
  overlay.onclick = function(e){ if(e.target===overlay) closeSearch(); };
  overlay.innerHTML = `
    <div class="searchpanel" onclick="event.stopPropagation()">
      <div class="searchbar">
        <span>🔍</span>
        <input id="searchinput" type="text" placeholder="Søg i begreber, teorier, modeller, opgaver og skridt …" oninput="onSearchInput(this.value)" onkeydown="if(event.key==='Escape')closeSearch()">
        <button class="searchclose" type="button" onclick="closeSearch()" aria-label="Luk søgning">✕</button>
      </div>
      <div id="searchresults" class="searchresults"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const btn = document.createElement('button');
  btn.id = 'searchbtn';
  btn.className = 'searchbtn';
  btn.type = 'button';
  btn.textContent = '🔍 Søg';
  btn.onclick = openSearch;
  document.body.appendChild(btn);

  document.addEventListener('keydown', function(e){
    const tag = document.activeElement && document.activeElement.tagName;
    if(e.key==='/' && tag!=='INPUT' && tag!=='TEXTAREA'){
      e.preventDefault(); openSearch();
    } else if(e.key==='Escape'){
      closeSearch();
    }
  });
}
initSearchUI();

render();

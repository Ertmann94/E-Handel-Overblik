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
        <span class="srtitle">${esc(r.title)}</span>
        <span class="srmeta">${esc(r.meta)}</span>
        ${r.snippet?`<span class="srsnippet">${esc(r.snippet)}</span>`:''}
      </button>`;
    });
  });
  results.innerHTML = htm;
}
function onSearchInput(v){
  renderSearchResults(v);
  updateSearchResultsVisibility();
}
function goSearchResult(i){
  const r = SEARCH_INDEX[i];
  if(!r) return;
  clearSearch();
  r.go();
}
function clearSearch(){
  const inp = document.getElementById('searchinput');
  if(inp) inp.value = '';
  renderSearchResults('');
  hideSearchResults();
}
function showSearchResults(){
  const results = document.getElementById('searchresults');
  if(results) results.hidden = false;
}
function hideSearchResults(){
  const results = document.getElementById('searchresults');
  if(results) results.hidden = true;
}
function updateSearchResultsVisibility(){
  const inp = document.getElementById('searchinput');
  if(inp && (document.activeElement===inp || inp.value.trim())) showSearchResults();
  else hideSearchResults();
}
// Søgningen er en altid-åben boks øverst på siden, lige over semester-kortet,
// så den ligger samme sted på startsiden og alle undersider (den indsættes
// uden for #app og overlever derfor render()-kald ved sideskift).
function initSearchUI(){
  if(document.getElementById('searchbar-top')) return;
  const bar = document.createElement('div');
  bar.id = 'searchbar-top';
  bar.className = 'searchbar-top';
  bar.innerHTML = `
    <div class="searchbar-top-input">
      <span class="searchicon" aria-hidden="true">🔍</span>
      <input id="searchinput" type="text" placeholder="Søg i begreber, teorier, modeller, opgaver, skridt …" autocomplete="off"
        oninput="onSearchInput(this.value)"
        onfocus="updateSearchResultsVisibility()"
        onkeydown="if(event.key==='Escape'){clearSearch(); this.blur();}">
      <button class="searchclear" type="button" onclick="clearSearch()" aria-label="Ryd søgning" title="Ryd søgning">×</button>
    </div>
    <div id="searchresults" class="searchresults searchresults-float" hidden></div>
  `;
  const sitehead = document.getElementById('sitehead');
  const app = document.getElementById('app');
  if(sitehead && sitehead.parentNode) sitehead.parentNode.insertBefore(bar, sitehead);
  else if(app && app.parentNode) app.parentNode.insertBefore(bar, app);
  else document.body.appendChild(bar);
  renderSearchResults('');

  document.addEventListener('click', function(e){
    if(!bar.contains(e.target)) hideSearchResults();
  });
  document.addEventListener('keydown', function(e){
    const tag = document.activeElement && document.activeElement.tagName;
    if(e.key==='/' && tag!=='INPUT' && tag!=='TEXTAREA'){
      e.preventDefault();
      const inp = document.getElementById('searchinput');
      if(inp) inp.focus();
    }
  });
}

// ---------- farvetemaer: kun to, hver med sin egen faste lys/mørk-tilstand ----------
// Orange er altid lys, Grøn er altid mørk — der er derfor ingen separat lys/mørk-knap;
// temavalget afgør tilstanden.
const THEMES = [
  {key:'espresso', label:'Orange (lys)', icon:'☀️', accent:'#d66a4c', accentRgb:'214,106,76',
    bg:'#fbf2ea', fg:'#2c1c10', fgDim:'#8e715a'},
  {key:'charcoal', label:'Grøn (mørk)', icon:'🌙', accent:'#2fb8a6', accentRgb:'47,184,166',
    bg:'#141a1f', fg:'#e7eef0', fgDim:'#8fa3a8'},
];
let currentThemeKey = 'charcoal';
function applyTheme(key){
  const t = THEMES.find(x=>x.key===key) || THEMES[0];
  currentThemeKey = t.key;
  const r = document.documentElement.style;
  r.setProperty('--bg', t.bg);
  r.setProperty('--fg', t.fg);
  r.setProperty('--fg-dim', t.fgDim);
  r.setProperty('--accent', t.accent);
  r.setProperty('--accent-rgb', t.accentRgb);
  try{ localStorage.setItem('theme', key); }catch(e){}
  document.querySelectorAll('.theme-swatch').forEach(b=>b.classList.toggle('active', b.dataset.theme===t.key));
}
function initTheme(){
  let savedTheme='charcoal';
  try{ savedTheme = localStorage.getItem('theme') || 'charcoal'; }catch(e){}
  applyTheme(savedTheme);
}

// ---------- header: vigtige datoer + genveje til eksamenskravene ----------
const SESSIONS = [
  {date:'2026-09-03', mkey:'m1', topic:'Opstart: Bæredygtighed + Projekt'},
  {date:'2026-09-07', mkey:'m1', topic:'Opstart: Design Thinking + Projekt'},
  {date:'2026-09-09', mkey:'m1', topic:'Opstart: Strategi- og forretningsudvikling'},
  {date:'2026-09-14', mkey:'m5', topic:'Metode: Videnskabsteori, problemformulering og introduktion'},
  {date:'2026-09-16', mkey:'m2', topic:'Digital forretningsforståelse: Strategi og trends'},
  {date:'2026-09-21', mkey:'m4', topic:'Customer Experience: Intro til CX + emotionelle kundetyper'},
  {date:'2026-09-28', mkey:'m2', topic:'Digital forretningsforståelse: Økonomi og kampagner'},
  {date:'2026-09-30', mkey:'m3', topic:'E-handelsteknologier: Shopify'},
  {date:'2026-10-05', mkey:'m5', topic:'Metode: 3 videnskabsteoretiske paradigmer og undersøgelsesdesign'},
  {date:'2026-10-08', mkey:'m4', topic:'Customer Experience: Kunderejsen, loyalitet, transformationsøkonomi'},
  {date:'2026-10-19', mkey:'m5', topic:'Metode: Kvalitative og kvantitative metoder'},
  {date:'2026-10-21', mkey:'m3', topic:'E-handelsteknologier: Optimering og 3. part (sidste undervisning)'},
  {date:'2026-11-02', mkey:'m2', topic:'Digital forretningsforståelse: Lovgivning'},
  {date:'2026-11-04', mkey:'m4', topic:'Customer Experience: Omnichannel, data, CX-trends'},
  {date:'2026-11-09', mkey:'m7', topic:'Eksamen: selvstændig projektperiode starter'},
];
function fmtDM(iso){ const [,mo,d] = iso.split('-'); return d+'/'+mo; }
function getNextSession(){
  const today = new Date(); today.setHours(0,0,0,0);
  for(const s of SESSIONS){ if(new Date(s.date+'T00:00:00') >= today) return s; }
  return null;
}
function goHeaderDeadline(tkey, idx){ openTab('m7', tkey); scrollToSearchTarget('task-m7-'+idx); }

// Semestret regnet fra første undervisningsgang til sidste mundtlige eksamensdag.
const SEMESTER_START = '2026-09-03T00:00:00';
const SEMESTER_END = '2026-12-11T23:59:59';
function semesterPct(){
  const start = new Date(SEMESTER_START), end = new Date(SEMESTER_END), now = new Date();
  if(now<=start) return 0;
  if(now>=end) return 100;
  return Math.round((now-start)/(end-start)*100);
}
function renderSiteHead(){
  const next = getNextSession();
  const nextTxt = next ? `${fmtDM(next.date)} — ${esc(next.topic)}` : 'Ingen flere undervisningsgange';
  const swatches = THEMES.map(t=>`<button class="theme-swatch" data-theme="${t.key}" title="${esc(t.label)}" style="--sw-bg:${t.bg};--sw-fg:${t.fg};--sw-accent:${t.accent}" onclick="applyTheme('${t.key}')">${t.icon}</button>`).join('');
  const pct = semesterPct();
  const ring = progressRing(pct, 100, {size:96, stroke:9, color:'--accent'});
  return `
    <div class="sitehead-row">
      <div class="sitehead-titlewrap">
        <div class="sitehead-logo"><img src="dania-logo.png" alt="Dania Erhvervsakademi"></div>
        <h1 class="sitehead-title">E-handel 1. semester – 2026</h1>
      </div>
      <div class="sitehead-controls">
        <div class="sitehead-themes">${swatches}</div>
      </div>
    </div>
    <div class="sitehead-grid">
      <div class="sitehead-info">
        <div class="sitehead-infoitem"><i></i><div><strong>Næste undervisning</strong><span>${nextTxt}</span></div></div>
        <div class="sitehead-infoitem"><i></i><div><strong>Sidste dag for teknisk Shopify-hjælp</strong><span>21. oktober (sidste undervisning i E-handelsteknologier)</span></div></div>
        <div class="sitehead-infoitem"><i></i><div><strong>Brugertest / tænke-højt-test</strong><span>26.-30. oktober (uge 44 — obligatorisk eksamensbilag)</span></div></div>
      </div>
      <div class="sitehead-progress">
        <div class="sitehead-ringbadge">${ring}</div>
        <div class="sitehead-progress-text"><strong>${pct}%</strong>af semestret gået</div>
      </div>
      <div class="sitehead-deadlines">
        <button class="deadlinepill" onclick="openWebProject()"><span>🌐 Hjemmeside klar</span><span class="ddate">før 13/11</span></button>
        <button class="deadlinepill" onclick="openReportRequirements()"><span>📝 Skriftlig rapport</span><span class="ddate">13/11 kl. 12</span></button>
        <button class="deadlinepill" onclick="goHeaderDeadline('opgaver',6)"><span>🤓 Mundtlig eksamen</span><span class="ddate">30/11–11/12</span></button>
      </div>
    </div>
  `;
}
function initSiteHead(){
  const head = document.createElement('div');
  head.id = 'sitehead';
  head.className = 'sitehead';
  head.innerHTML = renderSiteHead();
  const app = document.getElementById('app');
  app.parentNode.insertBefore(head, app);
  initTheme();
}
initSiteHead();
initSearchUI();

render();

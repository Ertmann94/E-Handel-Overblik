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
        <input id="searchinput" type="text" placeholder="Søg i begreber, teorier, modeller, opgaver og skridt …" oninput="onSearchInput(this.value)" onkeydown="if(event.key==='Escape')closeSearch()">
        <button class="searchclose" type="button" onclick="closeSearch()" aria-label="Luk søgning">×</button>
      </div>
      <div id="searchresults" class="searchresults"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const btn = document.createElement('button');
  btn.id = 'searchbtn';
  btn.className = 'searchbtn';
  btn.type = 'button';
  btn.textContent = 'Søg';
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

// ---------- farvetemaer (baggrund, tekst, highlight — kort/creme-elementer forbliver uændrede) ----------
// Hver tema har et mørkt og et lyst sæt af bg/fg/fg-dim; accenten er den samme i begge, da
// den altid bruges enten oven på creme-kort (uændret) eller som gennemsigtig glød/kant i headeren.
const THEMES = [
  {key:'midnight', label:'Midnight Gold', accent:'#c9a227', accentRgb:'201,162,39',
    dark:{bg:'#0c1930', fg:'#f3ead8', fgDim:'#aab6d4'}, light:{bg:'#faf6ec', fg:'#20170a', fgDim:'#8a7a52'}},
  {key:'charcoal', label:'Charcoal Teal', accent:'#2fb8a6', accentRgb:'47,184,166',
    dark:{bg:'#141a1f', fg:'#e7eef0', fgDim:'#8fa3a8'}, light:{bg:'#eef7f5', fg:'#0f2623', fgDim:'#5f8c84'}},
  {key:'plum', label:'Plum Rose Gold', accent:'#d98bae', accentRgb:'217,139,174',
    dark:{bg:'#241331', fg:'#f3e7f0', fgDim:'#b79bc4'}, light:{bg:'#faf1f6', fg:'#2e1526', fgDim:'#8f6a82'}},
  {key:'espresso', label:'Espresso Terracotta', accent:'#d66a4c', accentRgb:'214,106,76',
    dark:{bg:'#231913', fg:'#f2e8dd', fgDim:'#b89d85'}, light:{bg:'#fbf2ea', fg:'#2c1c10', fgDim:'#8e715a'}},
  {key:'denim', label:'Dania Rød', accent:'#cb142a', accentRgb:'203,20,42',
    dark:{bg:'#152233', fg:'#eef2f7', fgDim:'#8fa5c2'}, light:{bg:'#eef3fa', fg:'#15233a', fgDim:'#64799c'}},
];
let currentThemeKey = 'midnight';
let currentMode = 'dark';
function applyTheme(key){
  currentThemeKey = key;
  const t = THEMES.find(x=>x.key===key) || THEMES[0];
  const tone = currentMode==='light' ? t.light : t.dark;
  const r = document.documentElement.style;
  r.setProperty('--bg', tone.bg);
  r.setProperty('--fg', tone.fg);
  r.setProperty('--fg-dim', tone.fgDim);
  r.setProperty('--accent', t.accent);
  r.setProperty('--accent-rgb', t.accentRgb);
  try{ localStorage.setItem('theme', key); }catch(e){}
  document.querySelectorAll('.theme-swatch').forEach(b=>b.classList.toggle('active', b.dataset.theme===key));
}
function setMode(mode){
  currentMode = mode;
  try{ localStorage.setItem('mode', mode); }catch(e){}
  applyTheme(currentThemeKey);
  const btn = document.getElementById('modetoggle');
  if(btn) btn.textContent = mode==='light' ? '☀️' : '🌙';
}
function toggleMode(){ setMode(currentMode==='light' ? 'dark' : 'light'); }
function initTheme(){
  let savedTheme='midnight', savedMode='dark';
  try{ savedTheme = localStorage.getItem('theme') || 'midnight'; savedMode = localStorage.getItem('mode') || 'dark'; }catch(e){}
  currentMode = savedMode;
  applyTheme(savedTheme);
  const btn = document.getElementById('modetoggle');
  if(btn) btn.textContent = savedMode==='light' ? '☀️' : '🌙';
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
  const swatches = THEMES.map(t=>`<button class="theme-swatch" data-theme="${t.key}" title="${esc(t.label)}" style="--sw-bg:${t.dark.bg};--sw-accent:${t.accent}" onclick="applyTheme('${t.key}')"></button>`).join('');
  const pct = semesterPct();
  const ring = progressRing(pct, 100, {size:96, stroke:9, color:'--accent'});
  return `
    <div class="sitehead-row">
      <div class="sitehead-titlewrap">
        <div class="sitehead-logo"><img src="dania-logo.png" alt="Dania Erhvervsakademi"></div>
        <h1 class="sitehead-title">E-handel 1. semester – 2026</h1>
      </div>
      <div class="sitehead-controls">
        <button id="modetoggle" class="modetoggle" title="Skift mellem lys og mørk tilstand" onclick="toggleMode()">🌙</button>
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
        <button class="deadlinepill" onclick="goHeaderDeadline('opgaver',2)"><span>🌐 Hjemmeside klar</span><span class="ddate">før 13/11</span></button>
        <button class="deadlinepill" onclick="goHeaderDeadline('opgaver',5)"><span>📝 Skriftlig rapport</span><span class="ddate">13/11 kl. 12</span></button>
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

render();

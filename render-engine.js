function saveOurs(id, val){ try{ localStorage.setItem('ours:'+id, val); }catch(e){} }
function renderConcept(st){
  const id = st.id;
  const c = CONCEPT_DEFS[id];
  if(!c) return `<div class="topbar"><button class="backbtn" onclick="closeConcept()">← Tilbage</button></div><div class="empty">Begrebet blev ikke fundet.</div>`;
  const meta = CONCEPT_META[id] || {};
  const moduleKeys = [...new Set(c.entries.map(e=>e.module))];
  const tagsHtml = moduleKeys.length ? `<div class="modtags">${moduleKeys.map(modTag).join('')}</div>` : '';
  let modelHtml = '';
  if(meta.modelRef){
    const mod = DATA[meta.modelRef.m];
    const mo = mod && mod.modeller && mod.modeller[meta.modelRef.i];
    if(mo) modelHtml = `<figure class="concept-figure">${mo.svg}<figcaption>${esc(mo.name)}</figcaption></figure>`;
  }
  const defsHtml = c.entries.map(e=>`<p>${esc(e.desc)}</p>`).join('');
  let oursHtml = '';
  if(meta.ours){
    let saved=''; try{ saved = localStorage.getItem('ours:'+id) || ''; }catch(e){}
    oursHtml = `<div class="oursbox">
      <h3>Vores ${esc(c.title)}</h3>
      <p class="ourshint">Jeres egen besvarelse til webshop-projektet — gemmes kun i denne browser.</p>
      <textarea class="ourstext" oninput="saveOurs('${id}', this.value)" placeholder="Skriv jeres eget indhold her …">${esc(saved)}</textarea>
    </div>`;
  }
  return `
    <div class="topbar"><button class="backbtn" onclick="closeConcept()">← Tilbage</button></div>
    <div class="modulehead"><h1 style="font-size:21px">${esc(c.title)}</h1></div>
    <div class="panel">${tagsHtml}${modelHtml}<div class="prose">${defsHtml}</div>${oursHtml}</div>
  `;
}

// ---------- engine ----------
let state = {mode:'subject', screen:'home', mkey:null, tkey:null, openModel:null};

// Lille modul-tag: viser hvilket fag et element hører til, og hopper til
// det fags hovedmenu (modul-skærmen) når man trykker på det.
function modTag(mkey){
  const mod = MODULES.find(x=>x.key===mkey);
  if(!mod) return '';
  return `<button class="modtag" style="color:var(--${mod.color});border-color:var(--${mod.color});background:var(--${mod.color}-bg)" onclick="goToModuleHome('${mkey}')">${mod.icon} ${esc(mod.name)}</button>`;
}
function goToModuleHome(mkey){
  const mod = MODULES.find(x=>x.key===mkey);
  if(mod && mod.custom==='webproject'){ openWebProject(); return; }
  state = {mode:'subject', screen:'module', mkey, tkey:null, openModel:null}; render();
}
function modeToggle(active){
  return `<div class="modetoggle">
    <button class="modebtn${active==='subject'?' active':''}" onclick="goHome()">📚 Efter fagmodul</button>
    <button class="modebtn${active==='topic'?' active':''}" onclick="goTopicHome()">🧩 Efter stoftype</button>
  </div>`;
}

function renderHome(){
  const tiles = MODULES.map(m=>{
    if(m.locked){
      return `<button class="tile locked" disabled aria-disabled="true">
        <div class="badge" style="--tile-bg:var(--bg);--tile-accent:var(--locked)">${m.icon}</div>
        <h3>${esc(m.name)}</h3>
        <span class="lockchip">🔒 ${esc(m.status)}</span>
      </button>`;
    }
    const openFn = m.custom==='webproject' ? 'openWebProject()' : `openModule('${m.key}')`;
    const glowClass = m.custom==='webproject' ? ' tile-glow' : '';
    return `<button class="tile${glowClass}" style="--tile-bg:var(--${m.color}-bg);--tile-accent:var(--${m.color})" onclick="${openFn}">
      <div class="badge">${m.icon}</div>
      <h3>${esc(m.name)}</h3>
      <div class="meta"><span>${esc(m.ects)}</span><span>·</span><span>${esc(m.status)}</span></div>
    </button>`;
  }).join('');
  return `
    ${modeToggle('subject')}
    <div class="hero">
      <h1>E-Handel — 1. semester</h1>
      <p>Fem fagmoduler fra læseplanen, Hjemmesiden, hvor I bygger selve webshoppen i praksis, og Eksamen med krav, formalia og datoer. Hele semestret er høstet fra Moodle (opdateret 13. oktober). Vælg et modul for at se opsummering, teorier, fagbegreber, modeller, opgaver og links.</p>
    </div>
    <div class="gridhome">${tiles}</div>
  `;
}
function renderTopicHome(){
  const tiles = TABS.map(t=>`<button class="tile" style="--tile-bg:var(--bg-alt);--tile-accent:var(--accent)" onclick="openTopicTab('${t.key}')">
    <div class="badge">${t.icon}</div>
    <h3>${esc(t.label)}</h3>
    <div class="meta"><span>${esc(t.hint)}</span></div>
  </button>`).join('');
  return `
    ${modeToggle('topic')}
    <div class="hero">
      <h1>E-Handel — efter stoftype</h1>
      <p>Samme kategorier som under hvert fag, men samlet på tværs af hele semestret. Hvert element viser hvilke(t) fag det hører til — tryk på et fag for at komme til dets hovedmenu.</p>
    </div>
    <div class="gridhome">${tiles}</div>
  `;
}
function renderModule(key){
  const m = MODULES.find(x=>x.key===key);
  const subs = TABS.map(t=>`<button class="subtile" style="--tile-accent:var(--${m.color})" onclick="openTab('${m.key}','${t.key}')">
    <span class="icon">${t.icon}</span>
    <h4>${t.label}</h4>
    <p>${esc(t.hint)}</p>
  </button>`).join('');
  return `
    <div class="topbar"><button class="backbtn" onclick="goHome()">← Alle fag</button></div>
    <div class="modulehead">
      <div class="badge" style="background:var(--${m.color}-bg);color:var(--${m.color})">${m.icon}</div>
      <div><h1>${esc(m.name)}</h1><div class="meta">${esc(m.ects)} · ${esc(m.status)}</div></div>
    </div>
    ${m.flag?`<div class="flagbox">⚠️ ${esc(m.flag)}</div>`:''}
    <div class="gridsub">${subs}</div>
  `;
}
function modelDetail(mo,idx){
  return `<div class="modeldetail open">
    <figure>${mo.svg}<figcaption>${esc(mo.name)}</figcaption></figure>
    <div class="desc">${esc(mo.desc)}</div>
    <button class="closedetail" onclick="toggleModel(${idx})">Luk model</button>
  </div>`;
}
// Bygger selve indholdet for ét fag + én kategori. Genbruges både af den
// normale per-fag visning (renderTab) og af "efter stoftype"-visningen
// (renderTopicTab), så de to tilstande altid viser identisk indhold.
function renderTabBody(m, tkey){
  if(tkey==='opsummering'||tkey==='teorier'){
    return `<div class="legend">
      <span><i style="background:var(--term-bg)"></i> fagbegreb</span>
      ${tkey==='opsummering'?'<span><i style="background:var(--concept-bg)"></i> teori / model</span>':''}
      <span>· klik på et highlightet ord for at læse mere</span>
    </div><div class="prose">${linkify(m[tkey])}</div>`;
  } else if(tkey==='fagbegreber'){
    return `<dl class="deflist">${m.fagbegreber.map(([t,d])=>{
      const cid = conceptId(t);
      const clickable = !!CONCEPT_DEFS[cid];
      const attrs = clickable?` onclick="openConcept('${cid}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'){openConcept('${cid}')}"`:'';
      return `<div class="defitem${clickable?' clickable':''}"${attrs}><dt>${esc(t)}${clickable?'<span class="chevron">Læs mere →</span>':''}</dt><dd>${esc(d)}</dd></div>`;
    }).join('')}</dl>`;
  } else if(tkey==='modeller'){
    let body = `<div class="modelgrid">${m.modeller.map((mo,i)=>`<button class="modelcard" data-search-id="model-${m.key}-${i}" onclick="toggleModel(${i})"><div class="mini">${mo.svg}</div><h4>${esc(mo.name)}</h4></button>`).join('')}</div>`;
    if(state.openModel!=null && m.modeller[state.openModel]) body += modelDetail(m.modeller[state.openModel], state.openModel);
    return body;
  } else if(tkey==='opgaver'){
    const tagLabel={hand:'Aflevering',must:'Skal gøres',free:'Frivillig'};
    const handIdx = m.opgaver.map((o,i)=>i).filter(i=>m.opgaver[i].type==='hand');
    const handDone = handIdx.filter(i=>isChecked(m.key+':opg:'+i)).length;
    const ring = progressRing(handDone, handIdx.length, {size:60,stroke:6,color:'--'+m.color});
    return `<div class="opgprogress-row">
      ${ring}
      <div class="opgprogress-text"><strong>${handDone} af ${handIdx.length}</strong> afleveringer klaret<br>Kryds en opgave af når den er lavet.</div>
    </div>
    <div class="tasklegend">
      <span><span class="tag hand">Aflevering</span></span>
      <span><span class="tag must">Skal gøres</span></span>
      <span><span class="tag free">Frivillig</span></span>
    </div>
    <div class="tasklist">${m.opgaver.map((o,i)=>{
      const id=m.key+':opg:'+i, done=isChecked(id);
      return `
      <div class="task${done?' done':''}" data-search-id="task-${m.key}-${i}">
        <label class="taskcheck"><input type="checkbox" ${done?'checked':''} onchange="toggleChecked('${id}')" aria-label="Markér '${esc(o.title)}' som klaret"></label>
        <div class="date">${esc(o.date)}</div>
        <div class="body"><div class="title">${esc(o.title)}</div><div class="desc">${esc(o.desc)}</div></div>
        <span class="tag ${o.type}">${tagLabel[o.type]}</span>
      </div>`;
    }).join('')}</div>`;
  } else if(tkey==='links'){
    return `<div class="linklist">${m.links.map(l=>`
      <div class="linkitem">
        ${l.url?`<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.title)}</a>`:`<span class="plain">${esc(l.title)}</span><span class="nolink">intet link fundet</span>`}
        <span class="desc">${esc(l.desc)}</span>
      </div>`).join('')}</div>`;
  }
  return '';
}
function renderTab(mkey,tkey){
  const m = MODULES.find(x=>x.key===mkey);
  const tdef = TABS.find(t=>t.key===tkey);
  const body = renderTabBody(m, tkey);
  return `
    <div class="topbar"><button class="backbtn" onclick="openModule('${mkey}')">← ${esc(m.name)}</button><span class="crumbs">${esc(m.name)} / ${esc(tdef.label)}</span></div>
    <div class="modulehead">
      <div class="badge" style="background:var(--${m.color}-bg);color:var(--${m.color});width:38px;height:38px;font-size:17px">${tdef.icon}</div>
      <h1 style="font-size:20px">${esc(tdef.label)}</h1>
    </div>
    <div class="panel">${body}</div>
  `;
}
function modelDetailGlobal(f){
  return `<div class="modeldetail open">
    <figure>${f.mo.svg}<figcaption>${esc(f.mo.name)}</figcaption></figure>
    <div class="modtags">${modTag(f.m.key)}</div>
    <div class="desc">${esc(f.mo.desc)}</div>
    <button class="closedetail" onclick="toggleGlobalModel('${f.key}')">Luk model</button>
  </div>`;
}
function renderTopicTab(tkey){
  const tdef = TABS.find(t=>t.key===tkey);
  const unlocked = MODULES.filter(m=>!m.locked && !m.custom);
  let content;
  if(tkey==='fagbegreber'){
    const ids = Object.keys(CONCEPT_DEFS).sort((a,b)=>CONCEPT_DEFS[a].title.localeCompare(CONCEPT_DEFS[b].title,'da'));
    content = `<div class="panel"><dl class="deflist">${ids.map(id=>{
      const c = CONCEPT_DEFS[id];
      const tagsHtml = [...new Set(c.entries.map(e=>e.module))].map(modTag).join('');
      return `<div class="defitem clickable" onclick="openConcept('${id}')" role="button" tabindex="0" onkeydown="if(event.key==='Enter'){openConcept('${id}')}">
        <dt>${esc(c.title)}<span class="chevron">Læs mere →</span></dt>
        <dd>${esc(c.entries[0].desc)}</dd>
        <div class="modtags" onclick="event.stopPropagation()">${tagsHtml}</div>
      </div>`;
    }).join('')}</dl></div>`;
  } else if(tkey==='modeller'){
    const flat = [];
    unlocked.forEach(m=>(m.modeller||[]).forEach((mo,i)=>flat.push({m,mo,key:m.key+':'+i})));
    const openKey = state.openGlobalModel;
    const openEntry = openKey ? flat.find(f=>f.key===openKey) : null;
    content = `<div class="panel">
      <div class="modelgrid">${flat.map(f=>`
        <div class="modelcard-wrap">
          <button class="modelcard" onclick="toggleGlobalModel('${f.key}')"><div class="mini">${f.mo.svg}</div><h4>${esc(f.mo.name)}</h4></button>
          <div class="modtags">${modTag(f.m.key)}</div>
        </div>`).join('')}</div>
      ${openEntry ? modelDetailGlobal(openEntry) : ''}
    </div>`;
  } else {
    content = unlocked.map(m=>`
      <div class="topicsection">
        <div class="topicsection-head">${modTag(m.key)}</div>
        <div class="panel">${renderTabBody(m, tkey)}</div>
      </div>
    `).join('');
  }
  return `
    <div class="topbar"><button class="backbtn" onclick="goTopicHome()">← Stoftyper</button><span class="crumbs">Efter stoftype / ${esc(tdef.label)}</span></div>
    <div class="modulehead">
      <div class="badge" style="background:var(--bg-alt);color:var(--fg);width:38px;height:38px;font-size:17px">${tdef.icon}</div>
      <h1 style="font-size:20px">${esc(tdef.label)} — hele semestret</h1>
    </div>
    ${content}
  `;
}
// ---------- "Det store hjemmesideprojekt" (kronologisk tjekliste + detaljesider) ----------
function renderWebProjectHome(){
  const mod = DATA.m6;
  const steps = mod.steps;
  const doneCount = steps.filter((s,i)=>isChecked('m6shop:step:'+i)).length;
  const ring = progressRing(doneCount, steps.length, {size:72,stroke:7,color:'--m6'});
  const items = steps.map((s,i)=>{
    const id = 'm6shop:step:'+i;
    const done = isChecked(id);
    return `<div class="weblist-item${done?' done':''}">
      <div class="weblist-left">
        <label class="taskcheck" onclick="event.stopPropagation()"><input type="checkbox" ${done?'checked':''} onchange="toggleChecked('${id}')" aria-label="Markér '${esc(s.title)}' som klaret"></label>
        <div class="weblist-num">${i+1}</div>
      </div>
      <button class="weblist-row" data-tip="${esc(s.hover)}" onclick="openWebStep(${i})">
        <span class="weblist-title">${esc(s.title)}</span>
        <span class="weblist-arrow">→</span>
      </button>
    </div>`;
  }).join('');
  return `
    <div class="topbar"><button class="backbtn" onclick="goHome()">← Alle fag</button></div>
    <div class="modulehead">
      <div class="badge" style="background:var(--m6-bg);color:var(--m6)">${mod.icon}</div>
      <div><h1>${esc(mod.name)}</h1><div class="meta">${esc(mod.ects)} · ${esc(mod.status)}</div></div>
    </div>
    ${mod.flag?`<div class="flagbox">📋 ${esc(mod.flag)} <button class="modtag" style="color:var(--m7);border-color:var(--m7);background:var(--m7-bg);margin:8px 0 0" onclick="openModule('m7')">🎓 Gå til Eksamen</button></div>`:''}
    <div class="webprogress-row">
      ${ring}
      <div class="webprogress-text"><strong>${doneCount} af ${steps.length}</strong> skridt klaret<br>Kryds et skridt af, når det er lavet på jeres rigtige hjemmeside. Tryk på et skridt for at se en fuld, trin-for-trin Shopify-guide samt de teorier/modeller det bygger på.</div>
    </div>
    <div class="weblist">${items}</div>
  `;
}
function renderWebProjectStep(idx){
  const mod = DATA.m6;
  const steps = mod.steps;
  const s = steps[idx];
  if(!s) return `<div class="topbar"><button class="backbtn" onclick="openWebProject()">← ${esc(mod.name)}</button></div><div class="empty">Skridtet blev ikke fundet.</div>`;
  const id = 'm6shop:step:'+idx;
  const done = isChecked(id);
  const prevIdx = idx>0 ? idx-1 : null;
  const nextIdx = idx<steps.length-1 ? idx+1 : null;
  const conceptsHtml = (s.concepts||[]).map(cid=>{
    const c = CONCEPT_DEFS[cid];
    if(!c) return '';
    return `<button class="modtag" style="color:var(--m6);border-color:var(--m6);background:var(--m6-bg)" onclick="openConcept('${cid}')">${esc(c.title)}</button>`;
  }).join('');
  return `
    <div class="topbar"><button class="backbtn" onclick="openWebProject()">← ${esc(mod.name)}</button><span class="crumbs">${esc(mod.name)} / Skridt ${idx+1} af ${steps.length}</span></div>
    <div class="modulehead">
      <div class="badge" style="background:var(--m6-bg);color:var(--m6)">${idx+1}</div>
      <h1 style="font-size:20px">${esc(s.title)}</h1>
    </div>
    <div class="panel">
      <label class="stepdonecheck">
        <input type="checkbox" ${done?'checked':''} onchange="toggleChecked('${id}')">
        <span>Markér dette skridt som klaret</span>
      </label>
      <div class="prose">${linkify(s.detail)}</div>
      <h3 class="manual-head">Sådan gør du i Shopify — trin for trin</h3>
      <ol class="manual-list">${(s.manual||[]).map(step=>`<li>${linkify(step)}</li>`).join('')}</ol>
      ${conceptsHtml?`<div class="oursbox"><h3>Relaterede begreber, teorier og modeller</h3><div class="modtags">${conceptsHtml}</div></div>`:''}
    </div>
    <div class="webstepnav">
      ${prevIdx!=null?`<button class="backbtn" onclick="openWebStep(${prevIdx})">← ${esc(steps[prevIdx].title)}</button>`:'<span></span>'}
      ${nextIdx!=null?`<button class="backbtn" onclick="openWebStep(${nextIdx})">${esc(steps[nextIdx].title)} →</button>`:'<span></span>'}
    </div>
  `;
}
function openWebProject(){ state = {mode:'subject', screen:'webproject', mkey:'m6', tkey:null, openModel:null}; render(); }
function openWebStep(i){ state = {mode:'subject', screen:'webprojectStep', mkey:'m6', stepIdx:i}; render(); }

function render(){
  const app = document.getElementById('app');
  if(!app) return;
  try{
    if(state.screen==='home') app.innerHTML = renderHome();
    else if(state.screen==='module') app.innerHTML = renderModule(state.mkey);
    else if(state.screen==='webproject') app.innerHTML = renderWebProjectHome();
    else if(state.screen==='webprojectStep') app.innerHTML = renderWebProjectStep(state.stepIdx);
    else if(state.screen==='concept') app.innerHTML = renderConcept(state);
    else if(state.screen==='topicHome') app.innerHTML = renderTopicHome();
    else if(state.screen==='topicTab') app.innerHTML = renderTopicTab(state.tkey);
    else app.innerHTML = renderTab(state.mkey, state.tkey);
  }catch(e){ app.innerHTML = `<div class="empty">Der opstod en fejl i visningen.</div>`; }
}
function goHome(){ state={mode:'subject', screen:'home',mkey:null,tkey:null,openModel:null}; render(); }
function openModule(key){ state={mode:'subject', screen:'module',mkey:key,tkey:null,openModel:null}; render(); }
function openTab(mkey,tkey){ state={mode:'subject', screen:'tab',mkey,tkey,openModel:null}; render(); }
function toggleModel(i){ state.openModel = (state.openModel===i)?null:i; render(); }
function goTopicHome(){ state={mode:'topic', screen:'topicHome', tkey:null, openModel:null, openGlobalModel:null}; render(); }
function openTopicTab(tkey){ state={mode:'topic', screen:'topicTab', tkey, openModel:null, openGlobalModel:null}; render(); }
function toggleGlobalModel(key){ state.openGlobalModel = (state.openGlobalModel===key)?null:key; render(); }

// ---------- lys/mørk/automatisk tilstand ----------
// Siden følger som udgangspunkt systemets indstilling (ingen data-theme sat),
// men brugeren kan tvinge lys eller mørk tilstand via knappen nederst til højre.
// Valget gemmes i denne browser og overlever genindlæsning af artifactet.

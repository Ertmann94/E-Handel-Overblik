// ---------- Whiteboard: personlige noter + filer, gemt lokalt i browseren (IndexedDB) ----------
// Alt her er privat for denne ene browser — der er ingen server, så ingen andre med
// adgang til siden kan se dine noter eller filer, uanset hvor mange der besøger samme link.

let WB_ITEMS = [];
let wbNextId = 1;
let wbDB = null;
let wbErrorMsg = '';
let wbSuccessMsg = '';
const WB_COLORS = ['yellow','pink','blue','green'];
let wbColorCounter = 0;
const wbSaveTimers = {};

function wbOpenDB(){
  return new Promise((resolve,reject)=>{
    if(!window.indexedDB){ reject(new Error('no indexeddb')); return; }
    const req = indexedDB.open('ehandel_whiteboard_v1', 1);
    req.onupgradeneeded = (e)=>{
      const db = e.target.result;
      if(!db.objectStoreNames.contains('items')) db.createObjectStore('items', {keyPath:'id'});
    };
    req.onsuccess = ()=>resolve(req.result);
    req.onerror = ()=>reject(req.error);
  });
}
function wbSaveItem(item){
  if(!wbDB) return;
  try{ wbDB.transaction('items','readwrite').objectStore('items').put(item); }catch(e){}
}
function wbDeleteFromDB(id){
  if(!wbDB) return;
  try{ wbDB.transaction('items','readwrite').objectStore('items').delete(id); }catch(e){}
}
function wbLoadAll(){
  return new Promise((resolve)=>{
    if(!wbDB){ resolve([]); return; }
    try{
      const req = wbDB.transaction('items','readonly').objectStore('items').getAll();
      req.onsuccess = ()=>resolve(req.result||[]);
      req.onerror = ()=>resolve([]);
    }catch(e){ resolve([]); }
  });
}
async function wbInit(){
  try{ wbDB = await wbOpenDB(); WB_ITEMS = await wbLoadAll(); }catch(e){ WB_ITEMS = []; }
  wbNextId = 1 + WB_ITEMS.reduce((m,i)=>Math.max(m,i.id||0),0);
  initWhiteboardOverlay();
  renderWhiteboardAreas();
}

// ---------- forslags-motor: matcher note-/filnavns-tekst mod begrebstitler ----------
function wbNormalize(s){
  return (s+'').toLowerCase().replace(/æ/g,'ae').replace(/ø/g,'o').replace(/å/g,'aa').replace(/[^a-z0-9 ]/g,' ');
}
function wbSuggestConcepts(text, limit){
  limit = limit||6;
  const norm = wbNormalize(text);
  const tokens = new Set(norm.split(/\s+/).filter(w=>w.length>=3));
  if(!tokens.size) return [];
  const scored = Object.keys(CONCEPT_DEFS).map(id=>{
    const title = CONCEPT_DEFS[id].title;
    const titleNorm = wbNormalize(title);
    const titleTokens = titleNorm.split(/\s+/).filter(w=>w.length>=3);
    let score = 0;
    titleTokens.forEach(t=>{ if(tokens.has(t)) score += 1; });
    tokens.forEach(t=>{ if(titleNorm.includes(t)) score += 0.5; });
    return {id, title, score};
  }).filter(s=>s.score>0).sort((a,b)=>b.score-a.score).slice(0,limit);
  return scored;
}

// ---------- drafts / published ----------
function wbDrafts(){ return WB_ITEMS.filter(i=>i.status==='draft'); }
function wbPublishedFor(conceptId){ return WB_ITEMS.filter(i=>i.status==='published' && i.tags.includes(conceptId)); }

function wbNewNote(){
  const item = {id: wbNextId++, kind:'note', text:'', tags:[], status:'draft',
    color: WB_COLORS[wbColorCounter++ % WB_COLORS.length], createdAt: Date.now(), publishedAt:null,
    fileName:null, fileType:null, fileSize:0, fileBlob:null};
  WB_ITEMS.push(item); wbSaveItem(item); renderWhiteboardAreas();
  requestAnimationFrame(()=>{ const el = document.querySelector('[data-wid="'+item.id+'"] textarea'); if(el) el.focus(); });
}
function wbHandleFiles(fileList){
  const files = Array.from(fileList||[]);
  const MAX = 20*1024*1024;
  let oversized = 0;
  files.forEach(file=>{
    if(file.size > MAX){ oversized++; return; }
    const item = {id: wbNextId++, kind:'file', text:'', fileName:file.name, fileType:file.type||'', fileSize:file.size, fileBlob:file,
      tags:[], status:'draft', color:null, createdAt: Date.now(), publishedAt:null};
    WB_ITEMS.push(item); wbSaveItem(item);
  });
  wbErrorMsg = oversized ? (oversized+' fil(er) blev ikke tilføjet — maks. filstørrelse er 20 MB.') : '';
  renderWhiteboardAreas();
}
function wbRemoveItem(id){
  WB_ITEMS = WB_ITEMS.filter(i=>i.id!==id);
  wbDeleteFromDB(id);
  renderWhiteboardAreas();
}
function wbUpdateNoteText(id, text){
  const item = WB_ITEMS.find(i=>i.id===id); if(!item) return;
  item.text = text;
  clearTimeout(wbSaveTimers[id]);
  wbSaveTimers[id] = setTimeout(()=>{ wbSaveItem(item); wbRefreshSuggestions(id); }, 450);
}
function wbFlushSave(id){
  clearTimeout(wbSaveTimers[id]);
  const item = WB_ITEMS.find(i=>i.id===id); if(item) wbSaveItem(item);
}
function wbAddTag(id, conceptId){
  const item = WB_ITEMS.find(i=>i.id===id); if(!item || item.tags.includes(conceptId)) return;
  item.tags.push(conceptId); wbSaveItem(item);
  wbClearError();
  const tagsEl = document.getElementById('wbtags-'+id); if(tagsEl) tagsEl.innerHTML = wbRenderTagChipsInner(item);
  wbRefreshSuggestions(id);
}
function wbRemoveTag(id, conceptId){
  const item = WB_ITEMS.find(i=>i.id===id); if(!item) return;
  item.tags = item.tags.filter(t=>t!==conceptId); wbSaveItem(item);
  const tagsEl = document.getElementById('wbtags-'+id); if(tagsEl) tagsEl.innerHTML = wbRenderTagChipsInner(item);
  wbRefreshSuggestions(id);
}
function wbRefreshSuggestions(id){
  const item = WB_ITEMS.find(i=>i.id===id); if(!item) return;
  const el = document.getElementById('wbsuggest-'+id);
  if(el) el.innerHTML = wbRenderSuggestionsInner(item);
}
function wbClearError(){
  if(wbErrorMsg){ wbErrorMsg=''; const el=document.getElementById('wberror'); if(el) el.remove(); }
}
function wbManualSearch(id, query){
  const box = document.getElementById('wbresults-'+id); if(!box) return;
  const q = (query||'').trim().toLowerCase();
  if(q.length<2){ box.innerHTML=''; return; }
  const item = WB_ITEMS.find(i=>i.id===id);
  const matches = Object.keys(CONCEPT_DEFS).filter(cid=>
    CONCEPT_DEFS[cid].title.toLowerCase().includes(q) && !(item && item.tags.includes(cid))
  ).slice(0,8);
  box.innerHTML = matches.length ? matches.map(cid=>
    '<button type="button" onclick="wbPickManual('+id+',\''+cid+'\')">'+esc(CONCEPT_DEFS[cid].title)+'</button>'
  ).join('') : '<div class="wb-manualempty">Intet fundet</div>';
}
function wbPickManual(id, conceptId){
  wbAddTag(id, conceptId);
  const input = document.getElementById('wbsearch-'+id); if(input) input.value='';
  const box = document.getElementById('wbresults-'+id); if(box) box.innerHTML='';
}
function wbPublishAll(){
  const drafts = wbDrafts();
  wbSuccessMsg = '';
  if(!drafts.length){ wbErrorMsg = 'Der er ingen noter eller filer at uploade endnu.'; renderWhiteboardAreas(); return; }
  const untagged = drafts.filter(d=>d.tags.length===0);
  if(untagged.length){
    wbErrorMsg = untagged.length+' note(r)/fil(er) mangler mindst én side at høre til — tilføj en tag (forslag eller søg manuelt) før du uploader.';
    renderWhiteboardAreas();
    return;
  }
  const now = Date.now();
  drafts.forEach(d=>{ d.status='published'; d.publishedAt=now; wbSaveItem(d); });
  wbErrorMsg = '';
  wbSuccessMsg = drafts.length+' note(r)/fil(er) er nu integreret på deres sider.';
  renderWhiteboardAreas();
  setTimeout(()=>{ wbSuccessMsg=''; renderWhiteboardAreas(); }, 4500);
}
function wbDownloadFile(id){
  const item = WB_ITEMS.find(i=>i.id===id); if(!item || !item.fileBlob) return;
  const url = URL.createObjectURL(item.fileBlob);
  const a = document.createElement('a'); a.href=url; a.download=item.fileName||'fil';
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); }, 1000);
}
function wbFileIcon(type){
  type = type||'';
  if(/pdf/.test(type)) return '📕';
  if(/word|msword|officedocument\.word/.test(type)) return '📘';
  if(/sheet|excel/.test(type)) return '📗';
  if(/image/.test(type)) return '🖼️';
  if(/presentation|powerpoint/.test(type)) return '📙';
  return '📄';
}
function wbFmtSize(bytes){
  if(bytes<1024) return bytes+' B';
  if(bytes<1024*1024) return Math.round(bytes/1024)+' KB';
  return (bytes/1024/1024).toFixed(1)+' MB';
}
function wbFmtDateTime(ts){
  if(!ts) return '';
  const d = new Date(ts);
  const dd = String(d.getDate()).padStart(2,'0');
  const mm = String(d.getMonth()+1).padStart(2,'0');
  const hh = String(d.getHours()).padStart(2,'0');
  const mi = String(d.getMinutes()).padStart(2,'0');
  return dd+'.'+mm+' kl. '+hh+':'+mi;
}

// ---------- rendering ----------
function wbRenderTagChipsInner(item){
  return item.tags.map(cid=>{
    const c = CONCEPT_DEFS[cid]; if(!c) return '';
    return '<span class="wb-tag">'+esc(c.title)+'<button type="button" onclick="wbRemoveTag('+item.id+',\''+cid+'\')" aria-label="Fjern tag">×</button></span>';
  }).join('');
}
function wbRenderTagChips(item){
  return '<div class="wb-tags" id="wbtags-'+item.id+'">'+wbRenderTagChipsInner(item)+'</div>';
}
function wbRenderSuggestionsInner(item){
  const base = item.kind==='note' ? item.text : item.fileName;
  const suggestions = wbSuggestConcepts(base).filter(s=>!item.tags.includes(s.id));
  return suggestions.map(s=>
    '<button type="button" class="wb-tag wb-tag-suggest" onclick="wbAddTag('+item.id+',\''+s.id+'\')">+ '+esc(s.title)+'</button>'
  ).join('');
}
function wbRenderSuggestions(item){
  return '<div class="wb-suggest-row" id="wbsuggest-'+item.id+'">'+wbRenderSuggestionsInner(item)+'</div>';
}
function wbRenderManualAdd(item){
  return '<div class="wb-manualadd">'+
    '<input type="text" placeholder="Søg side manuelt…" oninput="wbManualSearch('+item.id+', this.value)" id="wbsearch-'+item.id+'">'+
    '<div class="wb-manualresults" id="wbresults-'+item.id+'"></div>'+
  '</div>';
}
function wbRenderPostit(item){
  return '<div class="postit postit-'+(item.color||'yellow')+'" data-wid="'+item.id+'">'+
    '<button type="button" class="wb-delete" onclick="wbRemoveItem('+item.id+')" aria-label="Slet note">×</button>'+
    '<textarea class="postit-text" placeholder="Skriv din note…" oninput="wbUpdateNoteText('+item.id+', this.value)" onblur="wbFlushSave('+item.id+')">'+esc(item.text)+'</textarea>'+
    wbRenderTagChips(item)+wbRenderSuggestions(item)+wbRenderManualAdd(item)+
  '</div>';
}
function wbRenderFileCard(item){
  return '<div class="filecard" data-wid="'+item.id+'">'+
    '<button type="button" class="wb-delete" onclick="wbRemoveItem('+item.id+')" aria-label="Slet fil">×</button>'+
    '<div class="filecard-icon">'+wbFileIcon(item.fileType)+'</div>'+
    '<div class="filecard-name">'+esc(item.fileName)+'</div>'+
    '<div class="filecard-size">'+wbFmtSize(item.fileSize)+'</div>'+
    wbRenderTagChips(item)+wbRenderSuggestions(item)+wbRenderManualAdd(item)+
  '</div>';
}
function wbDragOver(e){ e.preventDefault(); e.currentTarget.classList.add('dragover'); }
function wbDragLeave(e){ e.currentTarget.classList.remove('dragover'); }
function wbDrop(e){ e.preventDefault(); e.currentTarget.classList.remove('dragover'); wbHandleFiles(e.dataTransfer.files); }

function wbRenderBoard(){
  const drafts = wbDrafts();
  const cards = drafts.map(d=> d.kind==='note' ? wbRenderPostit(d) : wbRenderFileCard(d)).join('');
  return '<div class="whiteboard-toolbar">'+
      '<button type="button" onclick="wbNewNote()">+ Ny note</button>'+
      '<button type="button" onclick="document.getElementById(\'wbfileinput\').click()">📎 Tilføj fil</button>'+
      '<input type="file" id="wbfileinput" multiple style="display:none" onchange="wbHandleFiles(this.files); this.value=\'\';">'+
      '<button type="button" class="wb-upload-btn" onclick="wbPublishAll()">⬆ Upload til dashboard</button>'+
    '</div>'+
    (wbErrorMsg ? '<div class="wb-error" id="wberror">'+esc(wbErrorMsg)+'</div>' : '')+
    (wbSuccessMsg ? '<div class="wb-success">'+esc(wbSuccessMsg)+'</div>' : '')+
    '<div class="whiteboard-dropzone" id="wbdropzone" ondragover="wbDragOver(event)" ondragleave="wbDragLeave(event)" ondrop="wbDrop(event)">'+
      '<div class="whiteboard-board">'+
        (cards || '<div class="wb-empty">Ingen noter endnu i dag — klik "+ Ny note", eller træk en fil herind.</div>')+
      '</div>'+
    '</div>';
}
function renderWhiteboardAreas(){
  if(typeof render === 'function') render();
  const ov = document.getElementById('wboverlay-board');
  if(ov) ov.innerHTML = wbRenderBoard();
}

// ---------- hjem-sektion + flydende knap/overlay (persisterer uden for #app) ----------
function renderWhiteboardHomeSection(){
  return '<div class="whiteboard-section" id="whiteboard-home">'+
    '<div class="whiteboard-head">'+
      '<h2>📋 Whiteboard — dagens noter</h2>'+
      '<p class="whiteboard-hint">Skriv noter eller træk filer herind under undervisningen. Tilføj en side-tag til hver, og tryk "Upload til dashboard" når du er færdig — så bliver de integreret de rigtige steder på sitet. Kun synligt for dig i denne browser.</p>'+
    '</div>'+
    wbRenderBoard()+
  '</div>';
}
function renderMyNotesSection(conceptId){
  const items = wbPublishedFor(conceptId);
  if(!items.length) return '';
  const cards = items.map(it=>{
    if(it.kind==='note'){
      return '<div class="mynote-card">'+
        '<div class="mynote-text">'+esc(it.text)+'</div>'+
        '<div class="mynote-meta"><span>Skrevet ind som note d. '+wbFmtDateTime(it.publishedAt)+'</span>'+
        '<button type="button" class="mynote-del" onclick="wbRemoveItem('+it.id+')">Slet</button></div>'+
      '</div>';
    }
    return '<div class="myfile-chip" onclick="wbDownloadFile('+it.id+')">'+
      '<span class="myfile-icon">'+wbFileIcon(it.fileType)+'</span>'+
      '<span class="myfile-name">'+esc(it.fileName)+'</span>'+
      '<span class="myfile-meta">Uploadet d. '+wbFmtDateTime(it.publishedAt)+'</span>'+
      '<button type="button" class="mynote-del" onclick="event.stopPropagation(); wbRemoveItem('+it.id+')">Slet</button>'+
    '</div>';
  }).join('');
  return '<div class="mynotes-section">'+
    '<h3 class="mynotes-heading">📌 Mine noter &amp; filer</h3>'+
    '<p class="mynotes-hint">Personligt for denne browser — andre med adgang til siden ser ikke dine noter.</p>'+
    cards+
  '</div>';
}
function initWhiteboardOverlay(){
  if(document.getElementById('wboverlay')) return;
  const overlay = document.createElement('div');
  overlay.id = 'wboverlay';
  overlay.className = 'wboverlay';
  overlay.hidden = true;
  overlay.onclick = function(e){ if(e.target===overlay) closeWhiteboardOverlay(); };
  overlay.innerHTML =
    '<div class="wboverlay-panel" onclick="event.stopPropagation()">'+
      '<div class="wboverlay-head"><h2>📋 Whiteboard — dagens noter</h2>'+
      '<button class="searchclose" type="button" onclick="closeWhiteboardOverlay()" aria-label="Luk whiteboard">×</button></div>'+
      '<p class="whiteboard-hint">Skriv noter eller træk filer herind. Tilføj en side-tag til hver, og tryk "Upload til dashboard" når du er færdig.</p>'+
      '<div id="wboverlay-board">'+wbRenderBoard()+'</div>'+
    '</div>';
  document.body.appendChild(overlay);

  const fab = document.createElement('button');
  fab.id = 'wbfab';
  fab.className = 'wbfab';
  fab.type = 'button';
  fab.title = 'Åbn whiteboard';
  fab.textContent = '📋';
  fab.onclick = openWhiteboardOverlay;
  document.body.appendChild(fab);

  document.addEventListener('keydown', function(e){ if(e.key==='Escape') closeWhiteboardOverlay(); });
  wbUpdateFabVisibility();
}
function openWhiteboardOverlay(){
  const ov = document.getElementById('wboverlay'); if(ov) ov.hidden=false;
  const board = document.getElementById('wboverlay-board'); if(board) board.innerHTML = wbRenderBoard();
}
function closeWhiteboardOverlay(){ const ov = document.getElementById('wboverlay'); if(ov) ov.hidden=true; }
function wbUpdateFabVisibility(){
  const fab = document.getElementById('wbfab');
  const isHome = (typeof state !== 'undefined') && state.screen === 'home';
  if(fab) fab.hidden = isHome;
  if(isHome) closeWhiteboardOverlay();
}

wbInit();

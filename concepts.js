const MODULES = [DATA.m1, DATA.m2, DATA.m3, DATA.m4, DATA.m5, DATA.m6, DATA.m7];
const TABS = [
  {key:'opsummering', label:'Opsummering', icon:'📝', hint:'Sammendrag af fagets indhold'},
  {key:'teorier', label:'Teorier', icon:'🧠', hint:'De centrale teorier'},
  {key:'fagbegreber', label:'Fagbegreber', icon:'📖', hint:'Begreber og definitioner'},
  {key:'modeller', label:'Modeller', icon:'🗺️', hint:'Klikbare modeller'},
  {key:'opgaver', label:'Opgaver', icon:'✅', hint:'Datoer: afleveringer, opgaver, frivilligt'},
  {key:'links', label:'Links', icon:'🔗', hint:'Kilder og links'},
];

// ---------- concept registry (clickable fagbegreber/teorier/highlights) ----------
// Every fagbegreb across alle moduler bliver automatisk til en klikbar "side".
// Samme begreb (fx samme ord highlightet i både Opsummering og Teorier, eller i flere moduler)
// peger på samme id, så det altid fører til samme side.
function slugify(s){
  return (s+'').toLowerCase()
    .replace(/æ/g,'ae').replace(/ø/g,'o').replace(/å/g,'aa')
    .replace(/\(.*?\)/g,'')
    .replace(/\bog\b/g,' ')
    .replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'');
}
// Manuelle alias: dækker de steder hvor det samme begreb staves/forkortes
// forskelligt (fx "SMART-mål" vs. "SMART", "STP-modellen" vs. "STP", "B2C/B2B/C2C/C2B"
// vs. "B2C, B2B, C2C og C2B") så de altid lander på samme side.
const CONCEPT_ALIAS = {
  'smart-maal':'smart','job-to-be-done':'jobs-to-be-done',
  'triple-layered-bmc':'triple-layered-business-model-canvas',
  'stp':'stp-modellen','vaerdikaede':'vaerdikaeden',
  'operationel-effektivitet':'operationel-effektivitet-vs-strategisk-positionering',
  'strategisk-positionering':'operationel-effektivitet-vs-strategisk-positionering',
  'what-is-strategy':'operationel-effektivitet-vs-strategisk-positionering',
  '3-positioneringskilder':'porters-3-positioneringskilder',
  'trade-offs':'trade-offs-fit','fit':'trade-offs-fit',
  'desirable':'desirable-viable-feasible','viable':'desirable-viable-feasible','feasible':'desirable-viable-feasible',
  'divergent':'divergent-vs-konvergent-taenkning','konvergent':'divergent-vs-konvergent-taenkning',
  'mission-vision':'mission-vs-vision',
  'empathize-define-ideate-prototype-test':'de-5-dt-faser',
  'tredobbelte-bundlinje':'den-tredobbelte-bundlinje-3-p-er',
  'brundtland-rapportens':'brundtland-rapporten',
  'key-resources':'key-resources-key-processes','key-processes':'key-resources-key-processes',
  'b2c-variabler':'b2c-segmenteringsvariabler','b2b-variabler':'b2b-segmenteringsvariabler',
  'asek-model':'asek-modellen','kpi-er':'kpi','tabel-3-1':'nogletal',
  'prismarkedsforing':'30-dages-normalprisperiode-30-10-reglen',
  'sca':'sca-3d-secure','ncik':'ncik-whois',
  'open-source':'open-source-vs-closed-source','closed-source':'open-source-vs-closed-source',
  'temaer':'tema','wireframes':'wireframe',
  'waterfall-metode':'waterfall-metoden','waterfall':'waterfall-metoden',
  'planlaegning-design-udvikling-test-lancering':'waterfall-metoden',
  'webudviklingsprocessens':'waterfall-metoden',
  'touch-points':'touch-point','emotionelle-arketyper':'kundemagneterne',
  'litteratursogning':'systematisk-vs-usystematisk-litteratursogning',
  'usystematisk':'systematisk-vs-usystematisk-litteratursogning',
  'systematisk':'systematisk-vs-usystematisk-litteratursogning',
  'kildekritik':'kildekritik-trovaerdighed-objektivitet-praecision-relevans',
  'videnskabsteoretiske-paradigmer':'paradigmer',
  'sandhedsteorier':'korrespondens-kohaerens-pragmatisk-sandhedsteori',
  'korrespondensteorien':'korrespondens-kohaerens-pragmatisk-sandhedsteori',
  'kohaerensteorien':'korrespondens-kohaerens-pragmatisk-sandhedsteori',
  'pragmatiske-sandhedsbegreb':'korrespondens-kohaerens-pragmatisk-sandhedsteori',
  'deduktion':'induktion-deduktion-abduktion','induktion':'induktion-deduktion-abduktion','abduktion':'induktion-deduktion-abduktion',
  'undersogelsesdesign':'statisk-vs-dynamisk-undersogelsesdesign',
  'in-house-re-commerce':'re-commerce',
  'isbjerg-metafor':'kritisk-realisme','strata':'kritisk-realisme','emergens':'kritisk-realisme',
  'hermeneutiske-cirkel':'hermeneutik','ideografisk':'hermeneutik',
  // Begreber fra "Det store hjemmesideprojekt" (m6): den slug der opstår når
  // selve titlen highlightes inline i teksten, mappes til det id begrebet
  // faktisk er registreret under.
  // Høst 13/10 (resten af semestret)
  'forbrugeraftaleloven':'de-5-centrale-love-for-nethandel','e-handelsloven':'de-5-centrale-love-for-nethandel','markedsforingsloven':'de-5-centrale-love-for-nethandel',
  'for-omkring-efter-salget':'nettjek','gdpr':'gdpr-de-7-principper','cookievejledning':'cookiesamtykke',
  'god-markedsforingsskik':'god-markedsforingsskik-vildledning-aggressiv-handelspraksis',
  'uanmodet-henvendelse':'markedsforingslovens-10-10-stk-2',
  'gron-markedsforing':'miljomarkedsforing-greenwashing','greenwashing':'miljomarkedsforing-greenwashing',
  'anbefalinger-om-miljomarkedsforing':'miljomarkedsforing-greenwashing','dokumentationskravet':'miljomarkedsforing-greenwashing',
  'retningslinjer-for-prismarkedsforing':'30-dages-normalprisperiode-30-10-reglen',
  'konverteringsraten':'konverteringsoptimering','haarde-konverteringer':'haard-vs-blod-konvertering','blode-konverteringer':'haard-vs-blod-konvertering',
  'klaviyo':'klaviyo-flows','flows':'klaviyo-flows','retoriske-septagram':'det-retoriske-septagram','appelformerne':'etos-patos-logos','appelformer':'etos-patos-logos',
  'ens-betingelser':'omnichannel-praeferencer','omnichannel-vaerdikaede':'omnichannel-vaerdikaeden',
  'validitet':'validitet-reliabilitet','reliabilitet':'validitet-reliabilitet','konfidensinterval':'konfidensinterval-fejlmargen',
  'taenke-hojt-test':'think-aloud-test','harvard-referencing':'harvard-referencing-system','normalsider':'normalside-anslag',
  'etablerings-driftsbudget':'etablerings-driftsbudget-for-aar-1',
};
function conceptId(s){ const sl = slugify(s); return CONCEPT_ALIAS[sl] || sl; }

// Sparsom meta-info: hvilke begreber har en tilhørende model-tegning, og hvilke
// skal have et "Vores ..."-afsnit (kun dem hvor opgaverne konkret beder grupperne
// om at lave deres eget — resten er ren uddybning af definitionen).
const CONCEPT_META = {
  'swot-tows':{modelRef:{m:'m1',i:0}},
  'pestle':{modelRef:{m:'m1',i:1}, ours:true},
  'porters-five-forces':{modelRef:{m:'m1',i:2}, ours:true},
  'business-model-canvas':{modelRef:{m:'m1',i:3}, ours:true},
  'value-proposition-canvas':{modelRef:{m:'m1',i:4}, ours:true},
  'doughnutokonomi':{modelRef:{m:'m1',i:5}},
  'design-thinking':{modelRef:{m:'m1',i:6}},
  'de-5-dt-faser':{modelRef:{m:'m1',i:6}},
  'customer-value-proposition':{modelRef:{m:'m1',i:7}},
  'profit-formula':{modelRef:{m:'m1',i:7}},
  'key-resources-key-processes':{modelRef:{m:'m1',i:7}},
  'smart':{modelRef:{m:'m5',i:2}, ours:true},
  'asek-modellen':{modelRef:{m:'m2',i:0}},
  'peso-modellen':{modelRef:{m:'m2',i:1}},
  'balanced-scorecard':{modelRef:{m:'m2',i:2}},
  'stp-modellen':{modelRef:{m:'m2',i:3}},
  'vaerdikaeden':{modelRef:{m:'m2',i:4}},
  '4-hjorne-modellen':{modelRef:{m:'m2',i:5}},
  'etablerings-drifts-likviditetsbudget':{ours:true},
  'waterfall-metoden':{modelRef:{m:'m3',i:0}},
  'b2c-b2b-c2c-c2b':{modelRef:{m:'m3',i:1}},
  'multi-channel':{modelRef:{m:'m3',i:2}},
  'cross-channel':{modelRef:{m:'m3',i:2}},
  'omnichannel':{modelRef:{m:'m3',i:2}},
  'kunderejsen':{ours:true},
  'customer-churn-rate-customer-retention-rate':{modelRef:{m:'m4',i:0}},
  'problemformulering':{modelRef:{m:'m5',i:3}, ours:true},
  'paradigmer':{modelRef:{m:'m5',i:0}},
  'induktion-deduktion-abduktion':{modelRef:{m:'m5',i:1}},
  'hermeneutik':{modelRef:{m:'m5',i:4}},
  'statisk-vs-dynamisk-undersogelsesdesign':{modelRef:{m:'m5',i:5}, ours:true},
  'nettjek':{modelRef:{m:'m2',i:6}},
  'de-5-centrale-love-for-nethandel':{modelRef:{m:'m2',i:6}},
  'gdpr-de-7-principper':{modelRef:{m:'m2',i:7}},
  'det-retoriske-septagram':{modelRef:{m:'m3',i:3}},
  'digital-retorik':{modelRef:{m:'m3',i:3}},
  'klaviyo-flows':{modelRef:{m:'m3',i:4}},
  'flows-vs-kampagnemails':{modelRef:{m:'m3',i:4}},
  'omnichannel-vaerdikaeden':{modelRef:{m:'m4',i:1}},
  'kanalintegration':{modelRef:{m:'m4',i:1}},
  'validitet-reliabilitet':{modelRef:{m:'m5',i:6}, ours:true},
  'objektive-kvalitetskriterier':{modelRef:{m:'m5',i:6}},
  'subjektive-kvalitetskriterier':{modelRef:{m:'m5',i:6}},
  'feasibility-study':{modelRef:{m:'m7',i:0}, ours:true},
  'think-aloud-test':{ours:true},
};

const CONCEPT_DEFS = {};
function registerConcept(id, title, desc, mkey){
  if(!CONCEPT_DEFS[id]) CONCEPT_DEFS[id] = {title, entries:[]};
  if(!CONCEPT_DEFS[id].entries.some(e=>e.desc===desc)) CONCEPT_DEFS[id].entries.push({module:mkey, desc});
}
MODULES.forEach(m=>{
  if(m.locked || !m.fagbegreber) return;
  m.fagbegreber.forEach(([t,d])=>{ registerConcept(conceptId(t), t, d, m.key); });
});
registerConcept('paradigmer', 'De fire videnskabsteoretiske paradigmer',
  'De fire paradigmer — positivisme, kritisk realisme, social konstruktivisme og hermeneutik — repræsenterer forskellige grundsyn på virkelighed, viden og sandhed (formål, ontologi og sandhedsbegreb). Se de enkelte paradigmer i Fagbegreber-listen for uddybning, eller sammenlign dem alle fire i modellen herunder.', 'm5');

// Praktiske hjemmeside-begreber (m6) registreres direkte.
// Registreres direkte (frem for via m.fagbegreber), så siden kan holde sin egen,
// enkle visning (kronologisk tjekliste) og stadig gøre begreberne klikbare og
// søgbare under "Efter stoftype → Fagbegreber".
registerConcept('seo-grundopsaetning', 'SEO-grundopsætning',
  'De tekniske og indholdsmæssige grundsten for søgemaskineoptimering: meta-titler/-beskrivelser, sitemap, permalinks, alt-tekst og intern linkbygning.', 'm6');
registerConcept('cookiebot', 'Cookiebot (cookiedeklaration)',
  'Et værktøj der scanner siden for cookies, viser et samtykkebanner hvor besøgende reelt kan vælge/fravælge kategorier, og automatisk genererer en cookiedeklaration — en opdateret liste over hvilke cookies siden sætter, og hvad de bruges til.', 'm6');

// ---------- global søgeindeks ----------
// Samler alt det klikbare på tværs af hele artifactet — begreber/teorier
// (CONCEPT_DEFS), modeller, opgaver og Hjemmesidens skridt — i én flad liste,
// så søgefeltet kan finde det og sende brugeren direkte til den rette side.
// Bygges én gang, her, efter al data og alle begreber er registreret ovenfor.
function buildSearchIndex(){
  const idx = [];
  Object.keys(CONCEPT_DEFS).forEach(id=>{
    const c = CONCEPT_DEFS[id];
    const modNames = [...new Set(c.entries.map(e=>e.module))].map(mk=>{ const mm=MODULES.find(x=>x.key===mk); return mm?mm.name:mk; });
    idx.push({
      type:'begreb', icon:'📖', title:c.title, meta:modNames.join(', '), snippet:c.entries[0]?c.entries[0].desc:'',
      text:(c.title+' '+c.entries.map(e=>e.desc).join(' ')+' '+modNames.join(' ')).toLowerCase(),
      go:()=>openConcept(id),
    });
  });
  MODULES.forEach(m=>{
    (m.modeller||[]).forEach((mo,i)=>{
      idx.push({
        type:'model', icon:'🗺️', title:mo.name, meta:m.name, snippet:mo.desc,
        text:(mo.name+' '+mo.desc+' '+m.name).toLowerCase(),
        go:()=>{ openTab(m.key,'modeller'); toggleModel(i); scrollToSearchTarget('model-'+m.key+'-'+i); },
      });
    });
    (m.opgaver||[]).forEach((o,i)=>{
      idx.push({
        type:'opgave', icon:'✅', title:o.title, meta:m.name+' · '+o.date, snippet:o.desc,
        text:(o.title+' '+o.desc+' '+m.name+' '+o.date).toLowerCase(),
        go:()=>{ openTab(m.key,'opgaver'); scrollToSearchTarget('task-'+m.key+'-'+i); },
      });
    });
  });
  if(DATA.m6 && DATA.m6.steps){
    DATA.m6.steps.forEach((s,i)=>{
      const plain = (s.detail||'').replace(/<[^>]+>/g,' ');
      idx.push({
        type:'skridt', icon:'🌐', title:s.title, meta:'Hjemmesiden · Skridt '+(i+1), snippet:s.hover,
        text:(s.title+' '+s.hover+' '+plain).toLowerCase(),
        go:()=>openWebStep(i),
      });
    });
  }
  return idx;
}
const SEARCH_INDEX = buildSearchIndex();

// Gør hvert highlightet ord/udtryk i Opsummering/Teorier klikbart, hvis det
// matcher et registreret begreb — ellers forbliver det en almindelig markering.
// Viser samtidig den korte definition som hover-tooltip (data-tip), så man kan
// se den hurtige forklaring uden at klikke ind på den fulde, uddybende side.
function linkify(html){
  return html.replace(/<mark class="(term|concept)">([^<]*)<\/mark>/g, (full, cls, text)=>{
    const id = conceptId(text);
    if(CONCEPT_DEFS[id]){
      const tip = CONCEPT_DEFS[id].entries[0] ? CONCEPT_DEFS[id].entries[0].desc : '';
      return `<mark class="${cls} mark-link" tabindex="0" data-tip="${esc(tip)}" onclick="openConcept('${id}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openConcept('${id}')}">${text}</mark>`;
    }
    return full;
  });
}
// Lange, eksamensklare uddybninger pr. begreb (vises på selve begrebssiden).
// Udfyldes i concept-long-mX.js-filerne; begreber uden en lang uddybning
// falder tilbage til de korte definitioner fra fagbegreb-listerne.
const CONCEPT_LONG = {};
// Kort "svar til eksamen" (1-4 sætninger) der vises øverst på begrebssiden,
// over den lange uddybning — udfyldes i concept-summary-mX.js-filerne.
const CONCEPT_SUMMARY = {};
function openConcept(id){ state = {screen:'concept', id, back: state}; render(); }
function closeConcept(){ state = state.back || {screen:'home',mkey:null,tkey:null,openModel:null}; render(); }

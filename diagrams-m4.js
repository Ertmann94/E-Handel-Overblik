function diagOmniVC(){
  const W=590,H=300;
  let s=boxL(10,10,520,46,'Støtteaktivitet: digitale teknologier (fx RFID, mobil, AR/VR, analytics)','',"var(--bg)",{tfs:10.5,maxChars:80});
  const acts=['Kundeservice','Kunde-sporbarhed','Ordre-afvikling','Transaktioner','Produkt- & pris-info','Promotions','Retur-logistik','Analytics','Datasikkerhed & privatliv','Svindel-bekæmpelse'];
  const bw=98,bh=78,gap=7;
  acts.forEach((t,i)=>{ const col=i%5,row=(i/5|0); s+=boxL(10+col*(bw+gap),76+row*(bh+10),bw,bh,'Integreret '+t.toLowerCase(),'',"var(--m4-bg)",{tfs:9.5,maxChars:13}); });
  s+=`<polygon points="538,76 580,160 538,242" style="fill:var(--m4-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(553,163,'Værdi',{fs:10,weight:700,maxChars:8});
  s+=textBlock(265,280,'10 kanalintegrerende primæraktiviteter (Iftikhar, Pourzolfaghar & Helfert, 2020)',{fs:10,opacity:.7,maxChars:90});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagCXMap(){
  const W=480,H=320,cx=240,cy=160;
  let s='';
  s+=circleLabel(cx,cy,64,'CX-måling','',"var(--m4-bg)",{tfs:13,maxChars:9});
  s+=box(cx-220,20,150,64,'Kvalitative metoder','spørgeskema, interviews, fokusgrupper',"var(--bg)",{tfs:10,maxChars:15});
  s+=box(cx+70,20,150,64,'Kvantitative KPI\'er','churn, retention, konvertering',"var(--bg)",{tfs:10,maxChars:15});
  s+=box(cx-75,236,150,64,'Datakilder & værktøjer','CRM, analytics, reviews, heatmaps',"var(--bg)",{tfs:10,maxChars:16});
  s+=arrowPath(`M ${cx-80} 70 L ${cx-30} ${cy-30}`);
  s+=arrowPath(`M ${cx+80} 70 L ${cx+30} ${cy-30}`);
  s+=arrowPath(`M ${cx} ${cy+64} L ${cx} 236`);
  return svgWrap(`0 0 ${W} ${H}`,s);
}

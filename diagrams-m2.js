function diagNettjek(){
  const W=600,H=230,bw=176,gap=26;
  const cols=[['Før salget','informationspligt, oplysninger før køb, nyhedsbreve, handelsvilkår'],['Omkring salget','aftaleindgåelse, betaling, oplysninger ved købet'],['Efter salget','ordrebekræftelse, faktura, levering, fortrydelsesret, reklamation, kundeservice']];
  let s='';
  cols.forEach((c,i)=>{ const x=10+i*(bw+gap); s+=boxL(x,20,bw,130,c[0],c[1],"var(--m2-bg)",{tfs:13,maxChars:16,smaxChars:24}); if(i<cols.length-1) s+=arrowH(x+bw,85,x+bw+gap); });
  s+=textBlock(W/2,190,'Forbrugeraftaleloven · E-handelsloven · Markedsføringsloven · Aftaleloven · Købeloven',{fs:10,opacity:.7,maxChars:90});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagGDPR7(){
  const W=500,H=440,cx=250,cy=220,R=170;
  const p=['Ansvarlighed','Formåls-begrænsning','Data-minimering','Lovlighed, rimelighed, gennemsigtighed','Rigtighed','Integritet & fortrolighed','Opbevarings-begrænsning'];
  let s=circleLabel(cx,cy,58,'GDPR','7 principper',"var(--card)",{tfs:14});
  p.forEach((t,i)=>{ const a=-Math.PI/2+i*2*Math.PI/7; const x=cx+R*Math.cos(a), y=cy+R*Math.sin(a); s+=boxL(x-66,y-30,132,60,t,'',"var(--m2-bg)",{tfs:10,maxChars:18}); });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagASEK(){
  const W=360,H=360,cx=180,cy=180,r=140;
  const steps=[['Analyse','marked & konkurrenter'],['Strategi','mål & retning'],['Eksekvering','kampagner & kanaler'],['Kontrol','måling & opfølgning']];
  let s='';
  const pos=[[cx,cy-r+40],[cx+r-40,cy],[cx,cy+r-40],[cx-r+40,cy]];
  steps.forEach((t,i)=>{ s+=box(pos[i][0]-65,pos[i][1]-38,130,76,t[0],t[1],"var(--m2-bg)",{tfs:12.5,maxChars:12}); });
  s+=arrowPath(`M ${cx+45} ${cy-100} A ${r-40} ${r-40} 0 0 1 ${cx+100} ${cy-45}`);
  s+=arrowPath(`M ${cx+100} ${cy+45} A ${r-40} ${r-40} 0 0 1 ${cx+45} ${cy+100}`);
  s+=arrowPath(`M ${cx-45} ${cy+100} A ${r-40} ${r-40} 0 0 1 ${cx-100} ${cy+45}`);
  s+=arrowPath(`M ${cx-100} ${cy-45} A ${r-40} ${r-40} 0 0 1 ${cx-45} ${cy-100}`);
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagPESO(){
  const W=420,H=300,cw=210,ch=150;
  let s='';
  s+=box(2,2,cw-4,ch-4,'Paid','betalt medie (annoncer)',"var(--m2-bg)",{tfs:13});
  s+=box(cw+2,2,cw-4,ch-4,'Earned','omtale, PR, anmeldelser',"var(--m2-bg)",{tfs:13});
  s+=box(2,ch+2,cw-4,ch-4,'Shared','sociale medier, deling',"var(--m2-bg)",{tfs:13});
  s+=box(cw+2,ch+2,cw-4,ch-4,'Owned','eget website, egen e-mailliste',"var(--m2-bg)",{tfs:13});
  s+=`<line x1="${cw}" y1="0" x2="${cw}" y2="${H}" stroke="currentColor" stroke-width="2"/><line x1="0" y1="${ch}" x2="${W}" y2="${ch}" stroke="currentColor" stroke-width="2"/>`;
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagBSC(){
  const W=420,H=340,cx=210,cy=170;
  let s='';
  s+=circleLabel(cx,cy,62,'Vision &','strategi',"var(--card)",{tfs:12});
  s+=box(cx-80,10,160,70,'Finansielt','ejernes perspektiv',"var(--m2-bg)",{tfs:12,maxChars:14});
  s+=box(cx-80,260,160,70,'Lærings & vækst','udvikling, kompetencer',"var(--m2-bg)",{tfs:12,maxChars:14});
  s+=box(10,cy-38,160,76,'Kunder','kundeperspektiv',"var(--m2-bg)",{tfs:12,maxChars:14});
  s+=box(250,cy-38,160,76,'Interne processer','effektivitet, kvalitet',"var(--m2-bg)",{tfs:12,maxChars:14});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagSTP(){
  const W=420,H=260;
  let s='';
  s+=`<polygon points="10,20 410,20 330,100 90,100" style="fill:var(--m2-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(210,64,'Segmentering',{fs:13,weight:700});
  s+=`<polygon points="90,110 330,110 270,180 150,180" style="fill:var(--m2-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(210,149,'Targeting',{fs:13,weight:700});
  s+=`<polygon points="150,190 270,190 240,240 180,240" style="fill:var(--m2-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(210,219,'Positionering',{fs:11.5,weight:700});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagValueChain(){
  const W=575,H=260;
  let s='';
  s+=box(10,10,535,50,'Støtteaktiviteter: infrastruktur · HR · teknologiudvikling · indkøb','',"var(--card)",{tfs:11,maxChars:60});
  const prim=['Indgående logistik','Produktion','Udgående logistik','Marketing & salg','Service'];
  const bw=88,gap=6;
  prim.forEach((t,i)=>{ s+=box(10+i*(bw+gap),100,bw,90,t,'',"var(--m2-bg)",{tfs:10,maxChars:11}); });
  s+=`<polygon points="498,100 555,145 498,190" style="fill:var(--m2-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(518,149,'Margin',{fs:10,weight:700,maxChars:8});
  s+=textBlock(250,220,'Primære aktiviteter',{fs:11,opacity:.7});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diag4Corner(){
  const W=420,H=380;
  let s='';
  s+=box(140,10,140,60,'Kunde / kortholder','',"var(--m2-bg)",{tfs:12,maxChars:14});
  s+=box(140,310,140,60,'Forretning / sælger','',"var(--m2-bg)",{tfs:12,maxChars:14});
  s+=box(10,160,140,60,'PSP + Kortindløser','(Acquirer)',"var(--card)",{tfs:11,maxChars:13});
  s+=box(270,160,140,60,'Kortudsteder','(Issuer)',"var(--card)",{tfs:11,maxChars:13});
  s+=circleLabel(210,190,46,'Scheme Owner','Visa/MC/Dankort',"var(--m2-bg)",{tfs:10.5,maxChars:12});
  s+=arrowV(210,70,160); s+=arrowV(210,220,310);
  s+=arrowH(150,190,164); s+=arrowH(270,190,256);
  return svgWrap(`0 0 ${W} ${H}`,s);
}

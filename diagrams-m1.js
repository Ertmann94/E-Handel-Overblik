function diagSWOT(){
  const W=420,H=300,cw=210,ch=150;
  let s='';
  s+=box(2,2,cw-4,ch-4,'Styrker','interne, positive',"var(--m1-bg)",{tfs:14});
  s+=box(cw+2,2,cw-4,ch-4,'Svagheder','interne, negative',"var(--m1-bg)",{tfs:14});
  s+=box(2,ch+2,cw-4,ch-4,'Muligheder','eksterne, positive',"var(--m1-bg)",{tfs:14});
  s+=box(cw+2,ch+2,cw-4,ch-4,'Trusler','eksterne, negative',"var(--m1-bg)",{tfs:14});
  s+=`<line x1="${cw}" y1="0" x2="${cw}" y2="${H}" stroke="currentColor" stroke-width="2"/><line x1="0" y1="${ch}" x2="${W}" y2="${ch}" stroke="currentColor" stroke-width="2"/>`;
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagPESTLE(){
  const items=[['Politiske','love, skat, stabilitet'],['Økonomiske','konjunktur, rente, købekraft'],['Sociokulturelle','demografi, værdier, trends'],['Teknologiske','innovation, digitalisering'],['Lovgivningsmæssige','regulering, forbrugerret'],['Miljømæssige','bæredygtighed, ressourcer']];
  const W=460,H=320,cw=220,ch=100;
  let s='';
  items.forEach((it,i)=>{
    const col=i%2, row=(i/2|0);
    s+=box(10+col*(cw+10),10+row*(ch+8),cw,ch-8,it[0],it[1],"var(--m1-bg)",{tfs:13});
  });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagFiveForces(){
  const W=460,H=380;
  let s='';
  s+=box(140,150,180,80,'Konkurrence-intensitet','blandt eksisterende udbydere',"var(--m1-bg)",{tfs:12.5});
  s+=box(140,10,180,70,'Nye udbydere','trussel / indgangsbarrierer',"var(--card)",{tfs:11.5});
  s+=box(140,300,180,70,'Substitutter','trussel fra erstatningsprodukter',"var(--card)",{tfs:11.5});
  s+=box(10,150,120,80,'Leverandører','forhandlingsstyrke',"var(--card)",{tfs:11});
  s+=box(330,150,120,80,'Kunder','forhandlingsstyrke',"var(--card)",{tfs:11});
  s+=arrowV(230,80,150);
  s+=arrowV(230,300,230);
  s+=arrowH(130,190,140);
  s+=arrowH(330,190,320); // placeholder reversed below fix
  return svgWrap(`0 0 ${W} ${H}`,s.replace('<line x1="330" y1="190" x2="320" y2="190"','<line x1="330" y1="190" x2="327" y2="190"'));
}
function diagBMC(){
  const W=480,H=300;
  let s='';
  // key partners | key activities+key resources (stacked) | value prop | cust relations+channels(stacked) | cust segments
  s+=box(2,2,92,296,'Nøgle-partnere','leverandører, alliancer',"var(--m1-bg)",{tfs:11,maxChars:11});
  s+=box(96,2,92,145,'Nøgle-aktiviteter','',"var(--m1-bg)",{tfs:11,maxChars:11});
  s+=box(96,149,92,149,'Nøgle-ressourcer','',"var(--m1-bg)",{tfs:11,maxChars:11});
  s+=box(190,2,100,296,'Værditilbud','(value proposition)',"var(--card)",{tfs:12.5,maxChars:12});
  s+=box(292,2,92,145,'Kunde-relationer','',"var(--m1-bg)",{tfs:11,maxChars:11});
  s+=box(292,149,92,149,'Kanaler','',"var(--m1-bg)",{tfs:11,maxChars:11});
  s+=box(386,2,92,296,'Kunde-segmenter','',"var(--m1-bg)",{tfs:11,maxChars:10});
  return svgWrap(`0 0 ${W} ${H}`,s)+`<!--cost/revenue omitted at this scale, see description-->`;
}
function diagVPC(){
  const W=480,H=300;
  let s='';
  s+=textBlock(120,28,'Kundeprofil',{fs:13,weight:700,maxChars:14});
  s+=`<circle cx="120" cy="165" r="100" style="fill:var(--m1-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=circleLabel(120,115,34,'Jobs','',"var(--card)",{tfs:9.5});
  s+=circleLabel(80,195,34,'Pains','',"var(--card)",{tfs:9.5});
  s+=circleLabel(160,195,34,'Gains','',"var(--card)",{tfs:9.5});
  s+=textBlock(375,28,'Værdikort',{fs:13,weight:700,maxChars:14});
  s+=box(270,45,210,205,'','',"var(--m1-bg)",{r:14});
  s+=box(285,65,80,60,'Produkter & services','',"var(--card)",{tfs:9,maxChars:10});
  s+=box(370,65,95,60,'Pain relievers','',"var(--card)",{tfs:9,maxChars:11});
  s+=box(327,135,95,60,'Gain creators','',"var(--card)",{tfs:9,maxChars:11});
  s+=arrowH(230,165,270);
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagDoughnut(){
  const W=340,H=380,cx=170,cy=190;
  let s='';
  s+=`<circle cx="${cx}" cy="${cy}" r="160" style="fill:var(--m1-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=`<circle cx="${cx}" cy="${cy}" r="110" style="fill:var(--card)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=`<circle cx="${cx}" cy="${cy}" r="55" style="fill:var(--m1-bg)" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(cx,cy+2,'Socialt',{fs:11,weight:700,maxChars:10});
  s+=textBlock(cx,cy+16,'fundament',{fs:11,weight:700,maxChars:10});
  s+=textBlock(cx,48,'Økologisk loft',{fs:10.5,weight:700,maxChars:16});
  s+=textBlock(cx,64,'(planetære grænser)',{fs:8.5,opacity:.68,maxChars:20});
  s+=textBlock(cx,H-18,'hvidt bånd = sikkert & retfærdigt rum',{fs:9,opacity:.65,maxChars:34});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagDTFlow(){
  const steps=['Empathize','Define','Ideate','Prototype','Test'];
  const W=560,H=160,bw=90,gap=20;
  let s='';
  steps.forEach((t,i)=>{
    const x=10+i*(bw+gap);
    s+=box(x,50,bw,60,t,'',"var(--m1-bg)",{tfs:12});
    if(i<steps.length-1) s+=arrowH(x+bw,80,x+bw+gap);
  });
  s+=arrowPath(`M ${10+30} 110 C 100 155, ${W-140} 155, ${W-70} 110`);
  s+=textBlock(W/2,150,'iteration / tilbageløb',{fs:9.5,opacity:.65,maxChars:30});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagBM4(){
  const W=420,H=320;
  let s='';
  s+=box(10,10,170,80,'Profit formula','revenue, cost, margin, resource velocity',"var(--card)",{tfs:10.5,maxChars:16});
  s+=box(240,10,170,80,'Key resources','mennesker, teknologi, brand',"var(--card)",{tfs:10.5,maxChars:16});
  s+=box(110,120,200,80,'Customer Value Proposition','jobbet der skal udføres — kernen alle 4 spiller sammen om',"var(--m1-bg)",{tfs:12,maxChars:20,smaxChars:26});
  s+=box(125,250,170,60,'Key processes','regler, metrics, normer',"var(--card)",{tfs:10.5,maxChars:16});
  s+=arrowPath('M 95 90 L 170 120');
  s+=arrowPath('M 325 90 L 250 120');
  s+=arrowPath('M 210 250 L 210 200');
  return svgWrap(`0 0 ${W} ${H}`,s);
}

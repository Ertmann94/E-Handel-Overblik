function diagQuality(){
  const W=520,H=316,lw=110,cw=200,rh=120;
  let s='';
  s+=boxL(10+lw,10,cw-6,40,'Validitet','',"var(--m5-bg)",{tfs:12.5});
  s+=boxL(10+lw+cw,10,cw-6,40,'Reliabilitet','',"var(--m5-bg)",{tfs:12.5});
  const rows=[['Objektive','typisk kvantitativ · positivisme',['Kausalitet, målings-, intern, objektivitets-, ekstern og prædikativ validitet','Repeterbarhed og reproducerbarhed']],['Subjektive','typisk kvalitativ · hermeneutik / soc. konstr.',['Credibilitet og transferabilitet','Confirmabilitet og dependabilitet']]];
  rows.forEach((r,i)=>{ const y=58+i*(rh+8); s+=boxL(10,y,lw-6,rh,r[0],r[1],"var(--m5-bg)",{tfs:12,maxChars:12,smaxChars:15}); r[2].forEach((t,j)=>{ s+=boxL(10+lw+j*cw,y,cw-6,rh,t,'',"var(--card)",{tfs:10,maxChars:24}); }); });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagParadigm(){
  const cols=['Kritisk realisme','Positivisme','Social konstruktivisme','Hermeneutik'];
  const rows=[
    ['Formål',['Afdække skjulte strukturer','Finde kausale sammenhænge','Forstå hvordan betydning skabes','Forstå menneskeskabt mening']],
    ['Ontologi',['Realistisk, processuel','Realistisk, universel','Konstruktivistisk','Realistisk, kontekstuel']],
    ['Sandhed',['Korrespondens','Korrespondens','Kohærens','Kohærens']],
  ];
  const labelW=78,colW=120,rowH=62,x0=10+labelW,y0=10;
  const W=x0+4*colW+10, H=250;
  let s='';
  cols.forEach((c,i)=>{ s+=box(x0+i*colW,y0,colW-4,50,c,'',"var(--m5-bg)",{tfs:10,maxChars:12}); });
  rows.forEach((r,ri)=>{
    const y=y0+56+ri*rowH;
    s+=textBlock(10+labelW-10,y+rowH/2-6+4,r[0],{fs:10.5,weight:700,anchor:'end',opacity:.75,maxChars:11});
    r[1].forEach((txt,ci)=>{
      s+=box(x0+ci*colW,y,colW-4,rowH-6,txt,'',"var(--card)",{tfs:9,maxChars:13});
    });
  });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagIDA(){
  const W=560,H=300;
  let s='';
  function row(y,label,steps){
    let g=textBlock(60,y+5,label,{fs:11,weight:700,anchor:'start',maxChars:14});
    let x=140;
    steps.forEach((t,i)=>{
      g+=box(x,y-18,90,36,t,'',"var(--m5-bg)",{tfs:9.5,maxChars:11});
      if(i<steps.length-1) g+=arrowH(x+90,y,x+100);
      x+=100;
    });
    return g;
  }
  s+=row(40,'Deduktion',['Teori','Hypotese','Data','Resultat']);
  s+=row(130,'Induktion',['Empiri','Mønstre','Teori']);
  s+=row(220,'Abduktion',['Undren','Fortolkning','Ny indsigt']);
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagSMART(){
  const rows=[['S','Specific','specifik og afgrænset'],['M','Measurable','målbar'],['A','Achievable','opnåelig'],['R','Relevant','relevant for formålet'],['T','Time-bound','tidsbegrænset']];
  const W=400,H=300;
  let s='';
  rows.forEach((r,i)=>{
    const y=10+i*58;
    s+=circleLabel(34,y+28,24,r[0],'',"var(--m5-bg)",{tfs:16});
    s+=`<text x="70" y="${y+22}" font-size="13" font-weight="700" fill="currentColor">${esc(r[1])}</text>`;
    s+=`<text x="70" y="${y+40}" font-size="10.5" fill="currentColor" opacity=".7">${esc(r[2])}</text>`;
  });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagProblemFlow(){
  const steps=['Rammesætning','Baggrund','Ejer','Stilling','Formulering','Undersøgelsesspørgsmål','Afgrænsning'];
  const W=560,H=220,bw=120,gap=18;
  let s='';
  const row1=steps.slice(0,4), row2=steps.slice(4);
  row1.forEach((t,i)=>{
    const x=10+i*(bw+gap);
    s+=box(x,10,bw,60,t,'',"var(--m5-bg)",{tfs:10.5,maxChars:12});
    if(i<row1.length-1) s+=arrowH(x+bw,40,x+bw+gap);
  });
  { const sx=10+3*(bw+gap)+bw/2, ex=10+bw/2;
    s+=arrowPath(`M ${sx} 70 L ${sx} 100 L ${ex} 100 L ${ex} 140`); }
  row2.forEach((t,i)=>{
    const x=10+i*(bw+gap);
    s+=box(x,140,bw,60,t,'',"var(--m5-bg)",{tfs:10.5,maxChars:12});
    if(i<row2.length-1) s+=arrowH(x+bw,170,x+bw+gap);
  });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagHermCircle(){
  const W=340,H=340,cx=170,cy=170,r=130;
  let s='';
  s+=`<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="currentColor" stroke-width="1.3" stroke-dasharray="5 6"/>`;
  s+=arrowPath(`M ${cx+r-10} ${cy} A ${r-10} ${r-10} 0 1 1 ${cx-r+10} ${cy-1}`);
  s+=circleLabel(cx,cy-r,40,'Helhed','',"var(--m5-bg)",{tfs:12});
  s+=circleLabel(cx,cy+r,40,'Dele','',"var(--m5-bg)",{tfs:12});
  s+=circleLabel(cx,cy,56,'Fortolkning','',"var(--card)",{tfs:10.5,maxChars:11});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagDesignTypes(){
  const W=460,H=260;
  let s='';
  s+=box(165,10,130,50,'Undersøgelses-design','',"var(--m5-bg)",{tfs:11,maxChars:13});
  s+=box(20,120,180,50,'Statisk','survey, case, observation',"var(--card)",{tfs:11,maxChars:13});
  s+=box(260,120,180,50,'Dynamisk','tidsrække, eksperiment',"var(--card)",{tfs:11,maxChars:13});
  s+=arrowPath(`M 200 60 L 110 120`);
  s+=arrowPath(`M 260 60 L 350 120`);
  s+=textBlock(230,210,'metodetriangulering: kombinér flere design/datakilder',{fs:9.5,opacity:.65,maxChars:40});
  return svgWrap(`0 0 ${W} ${H}`,s);
}

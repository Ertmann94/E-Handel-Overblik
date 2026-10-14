function diagSeptagram(){
  const W=460,H=440,cx=230,cy=220,R=165;
  const p=['Afsender','Modtager','Omstændig-heder','Sprog','Emne','Genre','Medie'];
  const pts=p.map((t,i)=>{ const a=-Math.PI/2+i*2*Math.PI/7; return [cx+R*Math.cos(a), cy+R*Math.sin(a)]; });
  let s=`<polygon points="${pts.map(q=>q.join(',')).join(' ')}" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".45"/>`;
  s+=circleLabel(cx,cy,66,'Retorisk situation','',"var(--card)",{tfs:12,maxChars:10});
  p.forEach((t,i)=>{ s+=circleLabel(pts[i][0],pts[i][1],42,t,'',"var(--m3-bg)",{tfs:10.5,maxChars:9}); });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagKlaviyoFlows(){
  const W=600,H=260,bw=170,gap=35;
  const cols=[['Før købet','Welcome · Viewed Product · Viewed Category · Searched Site'],['Under købet','Added to Cart · Abandoned Checkout · Back in Stock'],['Efter købet','Post Purchase · Winback · Fødselsdag · VIP']];
  let s='';
  cols.forEach((c,i)=>{ const x=10+i*(bw+gap); s+=boxL(x,30,bw,150,c[0],c[1],"var(--m3-bg)",{tfs:13,maxChars:16,smaxChars:22}); if(i<cols.length-1) s+=arrowH(x+bw,105,x+bw+gap); });
  s+=textBlock(W/2,225,'kampagnemails (brede segmenter) + flows (adfærdsbaserede) = komplet e-mailstrategi',{fs:10,opacity:.7,maxChars:90});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagWebDev4(){
  const steps=[['Planlægning',''],['Design',''],['Udvikling',''],['Test & lancering','']];
  const W=520,H=140,bw=104,gap=28;
  let s='';
  steps.forEach((t,i)=>{
    const x=10+i*(bw+gap);
    s+=box(x,40,bw,60,t[0],'',"var(--m3-bg)",{tfs:12,maxChars:11});
    if(i<steps.length-1) s+=arrowH(x+bw,70,x+bw+gap);
  });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagB2X(){
  const W=420,H=320,cw=200,ch=150;
  let s='';
  s+=textBlock(210,16,'Sælger: Business →  ← Consumer',{fs:10.5,opacity:.7,maxChars:40});
  s+=box(10,30,cw,ch,'B2C','Business→Consumer (fx Amazon)',"var(--m3-bg)",{tfs:13,maxChars:13});
  s+=box(cw+20,30,cw,ch,'B2B','Business→Business',"var(--m3-bg)",{tfs:13,maxChars:13});
  s+=box(10,ch+40,cw,ch,'C2B','Consumer→Business (fx guru.com)',"var(--m3-bg)",{tfs:13,maxChars:13});
  s+=box(cw+20,ch+40,cw,ch,'C2C','Consumer→Consumer (fx eBay, Uber, Airbnb)',"var(--m3-bg)",{tfs:13,maxChars:13});
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagOmnichannel(){
  const W=520,H=220;
  let s='';
  function chans(x,n,connected){
    let g='';
    const labels=['Web','Butik','App','Social'].slice(0,n);
    labels.forEach((l,i)=>{ g+=box(x,10+i*48,90,38,l,'',"var(--m3-bg)",{tfs:10,maxChars:8}); });
    if(connected==='backend'){
      g+=box(x+110,80,90,56,'Fælles','backend',"var(--card)",{tfs:10,maxChars:9});
      labels.forEach((l,i)=>{ g+=arrowH(x+90,29+i*48,x+110); });
    } else if(connected==='some'){
      g+=arrowPath(`M ${x+90} 29 L ${x+90} 77`);
      g+=arrowPath(`M ${x+90} 125 L ${x+90} 173`);
    }
    return g;
  }
  s+=chans(10,4,'none');
  s+=textBlock(55,215,'Multi-channel (siloopdelt)',{fs:10,opacity:.7,maxChars:22});
  s+=chans(230,4,'backend');
  s+=textBlock(320,215,'Omnichannel (ét kundebillede)',{fs:10,opacity:.7,maxChars:24});
  return svgWrap(`0 0 ${W} ${H}`,s);
}

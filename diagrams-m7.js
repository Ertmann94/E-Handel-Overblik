function diagFeasibility(){
  const W=600,H=280,bw=170,gap=34;
  const st=[['Trin 1 · Omfang','mål, spørgsmål, informanter, undersøgelsesdesign'],['Trin 2 · Marked & koncept','Five Forces, BMC, VPC, kunderejse'],['Trin 3 · Strategi','forretningsmodel, pris, budget, SMART/KPI, emotionel kundetype'],['Trin 4 · Webshop & test','wireframes, Shopify, tænke-højt-test (3 personer)'],['Trin 6 · Risici & muligheder','SWOT → samlet vurdering: feasible?']];
  let s='';
  st.slice(0,3).forEach((t,i)=>{ const x=10+i*(bw+gap); s+=boxL(x,10,bw,100,t[0],t[1],"var(--m7-bg)",{tfs:11.5,maxChars:18,smaxChars:24}); if(i<2) s+=arrowH(x+bw,60,x+bw+gap); });
  s+=arrowPath(`M ${10+2*(bw+gap)+bw/2} 110 L ${10+2*(bw+gap)+bw/2} 140 L ${10+bw/2+100} 140 L ${10+bw/2+100} 160`);
  st.slice(3).forEach((t,i)=>{ const x=110+i*(bw+gap); s+=boxL(x,160,bw,100,t[0],t[1],"var(--m7-bg)",{tfs:11.5,maxChars:18,smaxChars:24}); if(i<1) s+=arrowH(x+bw,210,x+bw+gap); });
  return svgWrap(`0 0 ${W} ${H}`,s);
}
function diagOral(){
  const W=560,H=150,x0=10,tw=540;
  const parts=[['Præsentation','10 min · nye perspektiver',10],['Eksamination','15 min · bredt i læringsmålene',15],['Votering','5 min',5]];
  let s='',x=x0;
  parts.forEach(p=>{ const w=tw*p[2]/30; s+=boxL(x,30,w-4,70,p[0],p[1],"var(--m7-bg)",{tfs:12,maxChars:Math.max(8,w/8|0),smaxChars:Math.max(8,w/6.5|0),r:6}); x+=w; });
  s+=textBlock(W/2,125,'30 minutter i alt — tiden starter når du lukkes ind (inkl. ID-tjek og rundvisning i lokalet)',{fs:10,opacity:.7,maxChars:100});
  return svgWrap(`0 0 ${W} ${H}`,s);
}

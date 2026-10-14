function h(strings,...vals){return strings.reduce((a,s,i)=>a+s+(vals[i]??''),'');}
function esc(s){return (s+'').replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));}

// ---------- checkbox state (flueben), persisted per browser ----------
function isChecked(id){ try{ return localStorage.getItem('chk:'+id)==='1'; }catch(e){ return false; } }
function setChecked(id,val){ try{ localStorage.setItem('chk:'+id, val?'1':'0'); }catch(e){} }
function toggleChecked(id,ev){ if(ev&&ev.stopPropagation) ev.stopPropagation(); setChecked(id, !isChecked(id)); render(); }

// ---------- circular progress indicator ----------
function progressRing(done,total,opts={}){
  const size=opts.size||64, stroke=opts.stroke||7, r=(size-stroke)/2, c=2*Math.PI*r;
  const color=opts.color||'--accent';
  const frac = total>0 ? Math.max(0,Math.min(1,done/total)) : 0;
  const pct = Math.round(frac*100);
  const offset = c*(1-frac);
  return `<div class="progressring" style="width:${size}px;height:${size}px">
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(--border)" stroke-width="${stroke}"/>
      <circle cx="${size/2}" cy="${size/2}" r="${r}" fill="none" stroke="var(${color})" stroke-width="${stroke}" stroke-linecap="round" stroke-dasharray="${c}" stroke-dashoffset="${offset}" transform="rotate(-90 ${size/2} ${size/2})"/>
    </svg>
    <div class="progressring-label" style="font-size:${size<56?11:13}px">${pct}%</div>
  </div>`;
}

// ---------- SVG building blocks (currentColor, viewBox-scaled) ----------
function svgWrap(viewBox, inner){
  return `<svg viewBox="${viewBox}" role="img" aria-label="diagram" xmlns="http://www.w3.org/2000/svg" style="color:var(--ink)">
    <defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="currentColor"/>
    </marker></defs>
    ${inner}
  </svg>`;
}

// ---------- drawing primitives ----------
function wrap(text,maxChars){
  const words=(text+'').split(' ');
  let lines=[],cur='';
  words.forEach(w=>{
    if((cur+' '+w).trim().length>maxChars && cur){lines.push(cur.trim());cur=w;}
    else cur=(cur+' '+w).trim();
  });
  if(cur)lines.push(cur);
  return lines;
}
function textBlock(x,y,text,opts={}){
  const fs=opts.fs||11, lh=opts.lh||13, weight=opts.weight||400, anchor=opts.anchor||'middle',
        maxChars=opts.maxChars||16, opacity=opts.opacity||1, lines=wrap(text,maxChars);
  const total=(lines.length-1)*lh;
  return `<text x="${x}" y="${y-total/2}" text-anchor="${anchor}" font-size="${fs}" font-weight="${weight}" fill="currentColor" opacity="${opacity}">`+
    lines.map((l,i)=>`<tspan x="${x}" dy="${i===0?0:lh}">${esc(l)}</tspan>`).join('')+
  `</text>`;
}
function box(x,y,w,hh,title,sub,bg,opts={}){
  const r=opts.r??10;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${r}" style="fill:${bg}" stroke="currentColor" stroke-width="1.3"/>`;
  const tfs=opts.tfs||12.5, tlh=tfs+2.5, sfs=opts.sfs||10, slh=sfs+2.5;
  const titleLines=wrap(title,opts.maxChars||(w/7|0));
  const subLines=sub?wrap(sub,opts.smaxChars||(w/6|0)):[];
  const titleH=titleLines.length*tlh, gap=sub?6:0, subH=subLines.length*slh;
  const totalH=titleH+gap+subH, startY=y+hh/2-totalH/2;
  s+=textBlock(x+w/2,startY+tlh-4,title,{fs:tfs,weight:700,maxChars:opts.maxChars||(w/7|0)});
  if(sub) s+=textBlock(x+w/2,startY+titleH+gap+slh-4,sub,{fs:sfs,opacity:.72,maxChars:opts.smaxChars||(w/6|0)});
  return s;
}
function arrowH(x1,y,x2){return `<line x1="${x1}" y1="${y}" x2="${x2-7}" y2="${y}" stroke="currentColor" stroke-width="1.4" marker-end="url(#arrow)"/>`;}
function arrowV(x,y1,y2){return `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2-7}" stroke="currentColor" stroke-width="1.4" marker-end="url(#arrow)"/>`;}
function arrowPath(d){return `<path d="${d}" fill="none" stroke="currentColor" stroke-width="1.4" marker-end="url(#arrow)"/>`;}
function circleLabel(cx,cy,r,title,sub,bg,opts={}){
  let s=`<circle cx="${cx}" cy="${cy}" r="${r}" style="fill:${bg}" stroke="currentColor" stroke-width="1.3"/>`;
  s+=textBlock(cx,cy-(sub?7:0)+4,title,{fs:opts.tfs||12,weight:700,maxChars:opts.maxChars||14});
  if(sub) s+=textBlock(cx,cy+17,sub,{fs:9.5,opacity:.72,maxChars:13});
  return s;
}
function boxL(x,y,w,hh,title,sub,bg,opts={}){
  const tfs=opts.tfs||12, sfs=opts.sfs||10, tl=wrap(title,opts.maxChars||(w/7|0)), sl=sub?wrap(sub,opts.smaxChars||(w/5.6|0)):[];
  const tlh=tfs+3, slh=sfs+3, total=tl.length*tlh+(sl.length?6+sl.length*slh:0);
  let yy=y+hh/2-total/2+tfs;
  let s=`<rect x="${x}" y="${y}" width="${w}" height="${hh}" rx="${opts.r??10}" style="fill:${bg}" stroke="currentColor" stroke-width="1.3"/>`;
  tl.forEach(l=>{ s+=`<text x="${x+w/2}" y="${yy}" text-anchor="middle" font-size="${tfs}" font-weight="700" fill="currentColor">${esc(l)}</text>`; yy+=tlh; });
  if(sl.length){ yy+=6-tlh+slh; sl.forEach(l=>{ s+=`<text x="${x+w/2}" y="${yy}" text-anchor="middle" font-size="${sfs}" fill="currentColor" opacity=".72">${esc(l)}</text>`; yy+=slh; }); }
  return s;
}

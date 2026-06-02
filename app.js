const slides=[...document.querySelectorAll('.slide')];
const stage=document.getElementById('stage');
let i=0;
const pad=n=>String(n).padStart(2,'0');
function show(n){
  i=Math.max(0,Math.min(slides.length-1,n));
  slides.forEach((s,k)=>{s.classList.toggle('active',k===i);s.classList.toggle('past',k<i)});
  stage.dataset.mode=slides[i].dataset.type||'content';
  document.getElementById('pager').textContent=pad(i+1)+' / '+pad(slides.length);
  try{history.replaceState(null,'','#'+(i+1))}catch(e){}
}
const next=()=>show(i+1), prev=()=>show(i-1);
document.addEventListener('keydown',e=>{
  if(['ArrowRight','ArrowDown',' ','PageDown'].includes(e.key)){e.preventDefault();next()}
  else if(['ArrowLeft','ArrowUp','PageUp'].includes(e.key)){e.preventDefault();prev()}
  else if(e.key==='Home')show(0); else if(e.key==='End')show(slides.length-1);
  else if(e.key==='f'||e.key==='F')toggleFs();
  else if(e.key==='h'||e.key==='H')document.body.classList.toggle('hideaids');
});
stage.addEventListener('click',e=>{
  if(e.target.closest('.timer'))return;
  const r=stage.getBoundingClientRect();
  if(e.clientX>r.left+r.width*0.5)next();else prev();
});
function toggleFs(){if(!document.fullscreenElement)document.documentElement.requestFullscreen?.();else document.exitFullscreen?.();}

// decorative squircle grid
const bg=document.getElementById('bg');
const radii=['40%','50%','46% 46% 10% 46%','10% 46% 46% 46%','46% 10% 46% 46%','50% 50% 14% 14%','14% 14% 50% 50%','38%'];
if(bg)for(let t=0;t<16;t++){
  const d=document.createElement('div');d.className='tile';
  d.style.borderRadius=radii[Math.floor(Math.random()*radii.length)];
  const g=120+Math.floor(Math.random()*60);
  d.style.background='linear-gradient('+g+'deg,#272727,#0c0c0c)';
  d.style.animationDelay=(t*0.04+Math.random()*0.12).toFixed(2)+'s';
  bg.appendChild(d);
}

// release "wall"
const wall=document.getElementById('wall');
if(wall)[[2,'M1'],[3,'M2'],[5,'M3'],[7,'M4'],[10,'M5']].forEach(([h,label],c)=>{
  const col=document.createElement('div');col.className='col';
  for(let p=0;p<h;p++){const x=document.createElement('div');x.className='person';x.style.animationDelay=(c*0.12+p*0.05)+'s';col.appendChild(x)}
  const lab=document.createElement('span');lab.textContent=label;col.appendChild(lab);wall.appendChild(col);
});

// presenter timer (optional — only wires up if the markup is present)
const T=document.getElementById('timer'),Tv=document.getElementById('timerVal'),Ts=document.getElementById('timerSeg');
if(T&&Tv&&Ts){
  let secs=0,running=false,iv=null;const BUDGET=300;
  const fmt=s=>Math.floor(s/60)+':'+String(s%60).padStart(2,'0');
  const tick=()=>{secs++;Tv.textContent=fmt(secs);T.classList.toggle('over',secs>BUDGET);Ts.textContent=secs>BUDGET?('+'+fmt(secs-BUDGET)+' over'):(fmt(BUDGET-secs)+' left')};
  T.addEventListener('click',()=>{running=!running;T.classList.toggle('run',running);if(running)iv=setInterval(tick,1000);else clearInterval(iv)});
  T.addEventListener('dblclick',()=>{clearInterval(iv);running=false;secs=0;Tv.textContent='0:00';Ts.textContent='5:00 budget';T.classList.remove('run','over')});
}

const _h=parseInt((location.hash||'').slice(1),10);
show(_h>0?_h-1:0);

/* Looping canvas scenes modelled on the in-game look.
   WoP: growth -> automation -> blueprint -> rocket transport between planets.
   WM: robot reaction -> defeat -> magic drop -> collection -> cast -> fan stops -> passage. */
'use strict';
window.NXAnim = (() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const pop = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
const lerp = (a, b, k) => a + (b - a) * k;
const TAU = Math.PI * 2;
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }

/* ================= World of Plant ================= */
const OUT = '#1f3324';
function sunflower(c, x, y, r) {
  c.fillStyle = '#f4c542'; c.strokeStyle = OUT; c.lineWidth = Math.max(1, r * .14);
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8; c.beginPath(); c.ellipse(x + Math.cos(a) * r * .62, y + Math.sin(a) * r * .62, r * .42, r * .24, a, 0, TAU); c.fill(); c.stroke(); }
  c.fillStyle = '#b36b1f'; c.beginPath(); c.arc(x, y, r * .42, 0, TAU); c.fill(); c.stroke();
}
function tulip(c, x, y, r) {
  c.fillStyle = '#a77bd6'; c.strokeStyle = OUT; c.lineWidth = Math.max(1, r * .14);
  for (const dx of [-.42, .42, 0]) { c.beginPath(); c.ellipse(x + dx * r, y - (dx ? 0 : r * .15), r * .34, r * .62, dx * .5, 0, TAU); c.fill(); c.stroke(); }
}
function star(c, x, y, r) {
  c.fillStyle = '#6fa7d9'; c.strokeStyle = OUT; c.lineWidth = Math.max(1, r * .14); c.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * TAU / 8 - Math.PI / 2, d = i % 2 ? r * .38 : r; c.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); }
  c.closePath(); c.fill(); c.stroke(); c.fillStyle = '#d6ecff'; c.beginPath(); c.arc(x, y, r * .2, 0, TAU); c.fill();
}
const FL = [sunflower, tulip, star];
function drawFlower(c, kind, x, y, r, k) { if (k <= 0) return; c.save(); c.translate(x, y); c.scale(pop(k), pop(k)); FL[kind](c, 0, 0, r); c.restore(); }
function emitter(c, x, y, s, t) {
  c.strokeStyle = OUT; c.lineWidth = s * .09;
  c.fillStyle = '#f0a43a'; c.beginPath(); c.moveTo(x - s * .45, y + s * .5); c.lineTo(x, y - s * .35); c.lineTo(x + s * .45, y + s * .5); c.closePath(); c.fill(); c.stroke();
  c.fillStyle = '#4fb3e8'; c.beginPath(); c.arc(x, y - s * .42, s * .16, 0, TAU); c.fill(); c.stroke();
  c.strokeStyle = `rgba(79,179,232,${.5 + .5 * Math.sin(t * 6)})`; c.lineWidth = s * .07;
  for (const d of [1, -1]) { c.beginPath(); c.arc(x, y - s * .42, s * .34, d > 0 ? -.7 : Math.PI - .7, d > 0 ? .7 : Math.PI + .7); c.stroke(); }
}
function battery(c, x, y, s) {
  c.strokeStyle = OUT; c.lineWidth = s * .09; c.fillStyle = '#8fd14f';
  c.beginPath(); c.roundRect(x - s * .32, y - s * .45, s * .64, s * .9, s * .1); c.fill(); c.stroke();
  c.fillStyle = OUT; c.fillRect(x - s * .12, y - s * .56, s * .24, s * .1);
  c.beginPath(); c.moveTo(x + s * .06, y - s * .3); c.lineTo(x - s * .14, y + s * .04); c.lineTo(x, y + s * .04); c.lineTo(x - s * .06, y + s * .3); c.lineTo(x + s * .14, y - s * .06); c.lineTo(x, y - s * .06); c.closePath(); c.fill();
}

function panel(c,x,y,w,h,fill,stroke,r=12){c.fillStyle=fill;c.beginPath();c.roundRect(x,y,w,h,r);c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1.5;c.stroke();}}
function text(c,value,x,y,size=20,color='#edf2dc',align='left'){c.font=`600 ${size}px "Noto Sans KR",sans-serif`;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(value,x,y);}
function circle(c,x,y,r,fill,stroke){c.fillStyle=fill;c.beginPath();c.arc(x,y,r,0,TAU);c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=2;c.stroke();}}
function planet(c,x,y,r,active,seed){
 const g=c.createRadialGradient(x-r*.3,y-r*.4,0,x+r*.3,y+r*.3,r*1.5);g.addColorStop(0,active?'#78a965':'#334d52');g.addColorStop(1,active?'#284c37':'#17252e');circle(c,x,y,r,g,active?'#93c77f':'#547785');
 c.save();c.beginPath();c.arc(x,y,r-2,0,TAU);c.clip();const random=rnd(seed);for(let i=0;i<24;i++){const px=x+(random()-.5)*r*2,py=y+(random()-.5)*r*2;circle(c,px,py,r*(.035+random()*.08),active?'#b8d39125':'#6994a51a');}c.restore();
}
function rocket(c,x,y,angle,scale=1){
 c.save();c.translate(x,y);c.rotate(angle);c.scale(scale,scale);const flame=c.createLinearGradient(-35,0,-12,0);flame.addColorStop(0,'#f09c3c00');flame.addColorStop(1,'#ffd179');c.fillStyle=flame;c.beginPath();c.moveTo(-14,-8);c.lineTo(-43,0);c.lineTo(-14,8);c.fill();
 c.fillStyle='#e6efde';c.strokeStyle='#263d32';c.lineWidth=2;c.beginPath();c.moveTo(24,0);c.quadraticCurveTo(5,-17,-15,-10);c.lineTo(-15,10);c.quadraticCurveTo(5,17,24,0);c.fill();c.stroke();circle(c,7,0,5,'#72c8e4','#2e5968');c.fillStyle='#d9aa51';c.beginPath();c.moveTo(-6,-10);c.lineTo(-22,-18);c.lineTo(-17,-4);c.moveTo(-6,10);c.lineTo(-22,18);c.lineTo(-17,4);c.fill();c.restore();
}
function bezier(a,b,d,e,k){const s=1-k;return [s*s*s*a[0]+3*s*s*k*b[0]+3*s*k*k*d[0]+k*k*k*e[0],s*s*s*a[1]+3*s*s*k*b[1]+3*s*k*k*d[1]+k*k*k*e[1]];}
function flight(c,points,k,complete){
 c.save();c.strokeStyle=complete?'#a7d99d':'#6a9bac66';c.lineWidth=3;c.setLineDash(complete?[]:[7,9]);c.beginPath();c.moveTo(...points[0]);c.bezierCurveTo(...points[1],...points[2],...points[3]);c.stroke();c.restore();
 if(k>0&&k<1){const p=bezier(...points,k),q=bezier(...points,Math.min(.999,k+.005));rocket(c,p[0],p[1],Math.atan2(q[1]-p[1],q[0]-p[0]),.9);}
}
function wopScene(){
 // These are distinct placement cells: devices never share a flower's position.
 const flowers=[];for(let row=0;row<4;row++)for(let col=0;col<4;col++){if((row===1&&col===1)||(row===2&&col===2))continue;flowers.push({x:130+col*50,y:180+row*50,kind:(col+row)%3});}
 const devices=[{x:180,y:230,type:'emitter',at:4.7},{x:230,y:280,type:'battery',at:5.8}];
 const routes=[[[337,181],[388,65],[475,61],[544,137]],[[661,298],[750,325],[754,381],[693,399]]];
 function population(c,cx,cy,scale,t,start,copy=false){c.save();c.translate(cx,cy);c.scale(scale,scale);c.translate(-210,-270);
  flowers.forEach((f,i)=>{const birth=copy?start+i*.08:.35+i*.17;drawFlower(c,f.kind,f.x,f.y,14,seg(t,birth,birth+.4));});
  devices.forEach(d=>{const birth=copy?start+1.4:d.at,k=seg(t,birth,birth+.4);if(k<=0)return;c.save();c.translate(d.x,d.y);c.scale(pop(k),pop(k));if(d.type==='emitter')emitter(c,0,0,32,t);else battery(c,0,0,30);c.restore();});c.restore();
 }
 return {duration:20,layout:{flowers,devices,flowerRadius:14,deviceRadius:23},steps:[[0,'꽃 깨우기'],[4.5,'생산 자동화'],[8,'배치 저장'],[10.5,'로켓 운송'],[15,'행성 연결'],[18,'생산 확장']],draw(c,W,H,t){
  c.save();c.scale(W/800,H/500);c.fillStyle='#0e1c19';c.fillRect(0,0,800,500);const rand=rnd(41);for(let i=0;i<52;i++)circle(c,rand()*800,rand()*500,.7+rand(),`rgba(210,233,209,${.1+rand()*.4})`);
  const connected=t>=14.5,last=t>=18.1;
  if(t>9.8)flight(c,routes[0],seg(t,10.5,14.5),connected);
  if(connected)flight(c,routes[1],seg(t,15.1,18.1),last);
  planet(c,210,270,164,true,6);planet(c,620,211,108,connected,12);planet(c,650,413,46,last,19);
  text(c,'첫 번째 정원',210,79,22,'#d5e7c8','center');text(c,connected?'새 행성 · 연결됨':'새 행성',620,65,21,connected?'#cce9b6':'#96afb7','center');text(c,last?'다음 행성 연결':'다음 행성',703,418,14,last?'#cce9b6':'#8fa5a8');
  population(c,210,270,1,t,0);
  if(connected)population(c,620,211,.59,t,14.5,true);
  if(last){sunflower(c,637,406,8);star(c,665,423,8);emitter(c,659,393,14,t);}
  if(t<4.4){const x=130+Math.sin(t*.9)*48,y=230+Math.cos(t*1.1)*45;for(let j=0;j<3;j++){const k=(t*.8+j/3)%1;c.strokeStyle=`rgba(246,242,178,${.6*(1-k)})`;c.lineWidth=2;c.beginPath();c.arc(x,y,18+k*90,0,TAU);c.stroke();}c.fillStyle='#f4f6dc';c.beginPath();c.moveTo(x,y);c.lineTo(x+18,y+17);c.lineTo(x+7,y+21);c.closePath();c.fill();}
  if(t>5){const k=(t-5)%1.7/1.7;c.strokeStyle=`rgba(104,207,239,${.65*(1-k)})`;c.lineWidth=3;c.beginPath();c.arc(180,230,25+75*k,0,TAU);c.stroke();}
  if(t>8&&t<11){c.save();c.strokeStyle='#a6d9ff';c.fillStyle='#6eaff414';c.lineWidth=2;c.setLineDash([7,5]);c.fillRect(106,155,228,204);c.strokeRect(106,155,228,204);c.restore();}
  const label=t<4.5?'커서로 생산 시작':t<8?'장치로 반복 생산':t<10.5?'블루프린트 저장':t<14.5?'로켓으로 설계 운송':t<18?'새 행성에서 시공':'행성을 연결해 생산 확장';
  panel(c,35,453,410,32,'#16291fef','#4c7155',10);text(c,label,240,469,18,'#d6e9be','center');
  panel(c,18,18,199,37,'#16291fef','#506d48',10);text(c,'에너지 '+Math.max(0,Math.floor(t*51-(t>4.7?120:0)-(t>5.8?80:0))).toLocaleString('ko-KR'),33,37,19,'#ecd58b');
  c.restore();
 }};
}

/* Wordless Mage is rendered directly at display resolution. The rune is the
   original transparent in-game asset; it is never baked into a tiny canvas. */
const stopRune=new Image();stopRune.src='./assets/showcase/stop-rune.png';
function rune(c,x,y,size){
 if(stopRune.complete&&stopRune.naturalWidth){c.save();c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(stopRune,x-size/2,y-size/2,size,size);c.restore();return;}
 circle(c,x,y,size*.45,'#26383b','#d5b366');text(c,'✋',x,y,size*.47,'#f1dec0','center');
}
function mage(c,x,y,t,walking,attack){
 const stride=walking?Math.sin(t*10)*7:0;c.save();c.translate(x,y);c.lineWidth=3;c.strokeStyle='#11191e';c.fillStyle='#66637a';
 panel(c,-17+stride,-14,13,14,'#333748','#11191e',3);panel(c,5-stride,-14,13,14,'#333748','#11191e',3);
 c.fillStyle='#4c4e63';c.beginPath();c.moveTo(-17,-64);c.quadraticCurveTo(-24,-30,-29,-12);c.lineTo(25,-12);c.quadraticCurveTo(15,-34,13,-64);c.closePath();c.fill();c.stroke();
 circle(c,-1,-68,20,'#53566b','#171f26');c.fillStyle='#d8c6b3';c.beginPath();c.ellipse(6,-65,9,13,.1,0,TAU);c.fill();circle(c,10,-68,2,'#1a2025');c.strokeStyle='#bca477';c.lineWidth=5;c.beginPath();c.moveTo(-17,-31);c.lineTo(15,-31);c.stroke();
 c.strokeStyle='#a98456';c.lineWidth=5;c.beginPath();c.moveTo(29,-8);c.lineTo(29+attack*38,-76);c.stroke();circle(c,29+attack*38,-79,6,'#d4c38c','#65513b');c.restore();
}
function robot(c,x,y,t,alert,dying){
 c.save();c.translate(x,y);c.globalAlpha=1-dying;
 if(dying>0){c.translate(dying*18,-Math.sin(dying*Math.PI)*15);c.rotate(dying*.5);}
 panel(c,-21,-12,15,12,'#4f5659','#16202a',4);panel(c,7,-12,15,12,'#4f5659','#16202a',4);panel(c,-26,-55,52,44,'#4a5760','#17232c',12);panel(c,-33,-45,9,25,'#78847a','#192b31',3);panel(c,25,-45,9,25,'#78847a','#192b31',3);panel(c,-18,-52,36,14,alert?'#d89662':'#d8c17a','#252b28',4);circle(c,-8,-45,3,'#fbf2bf');circle(c,8,-45,3,'#fbf2bf');c.strokeStyle='#c0a66b';c.lineWidth=4;c.beginPath();c.moveTo(0,-55);c.lineTo(0,-70);c.stroke();circle(c,0,-74,5,alert?'#f68a68':'#d0ba76');c.restore();
}
function wmScene(){
 const FLOOR=406,RX=298,FX=637,FY=252,FR=111;
 function stateAt(t){return {robotAlive:t<5.6,attack:seg(t,4.15,4.65)*(1-seg(t,4.9,5.25)),defeated:t>=5.1,drop:t>=5.5&&t<7.8,collected:t>=7.8,fanStopped:t>=14.2};}
 return {duration:19,steps:[[0,'로봇 반응'],[4.1,'로봇 처치'],[5.8,'마법 획득'],[9,'선택·발동'],[13,'팬 정지'],[14.8,'통과']],stateAt,draw(c,W,H,t){
  c.save();c.scale(W/800,H/500);c.imageSmoothingEnabled=true;const state=stateAt(t);
  const bg=c.createLinearGradient(0,0,0,500);bg.addColorStop(0,'#17232a');bg.addColorStop(1,'#0e171d');c.fillStyle=bg;c.fillRect(0,0,800,500);
  const rand=rnd(8);for(let row=0;row<10;row++)for(let col=-1;col<15;col++){const x=col*62+(row%2)*31,y=row*43;panel(c,x+2,y+2,58,39,rand()>.5?'#263137':'#212b32','#111c22',3);}
  for(const x of [79,405]){panel(c,x,50,56,175,'#3e4b48','#192b2e',25);panel(c,x+8,60,40,154,'#1b343d','#46574d',19);c.strokeStyle='#65736766';c.lineWidth=3;c.beginPath();c.moveTo(x+28,64);c.lineTo(x+28,211);c.stroke();}
  panel(c,0,FLOOR,800,94,'#18292c','#58695a',0);for(let i=0;i<13;i++)panel(c,i*64+2,FLOOR+15,60,36,'#26383b','#14252a',3);
  panel(c,FX-FR-14,FY,14,FLOOR-FY,'#53615b','#202b2b',3);panel(c,FX+FR,FY,14,FLOOR-FY,'#53615b','#202b2b',3);
  c.fillStyle='#101b20';c.beginPath();c.arc(FX,FY,FR,Math.PI,0);c.lineTo(FX+FR,FLOOR);c.lineTo(FX-FR,FLOOR);c.closePath();c.fill();c.strokeStyle='#687568';c.lineWidth=12;c.beginPath();c.arc(FX,FY,FR+6,Math.PI,0);c.stroke();
  const slow=seg(t,13,14.2),spin=t<13?t*5:13*5+(t-13)*5*(1-slow/2),endAngle=-Math.PI/2;
  const settle=Math.ceil((65+Math.PI/2)/TAU)*TAU-Math.PI/2;const angle=t<13?t*5:lerp(65,settle,ease(slow));
  for(let i=0;i<3;i++){c.save();c.translate(FX,FY);c.rotate(angle+i*TAU/3);c.fillStyle=state.fanStopped?'#85a8ae':'#697e81';c.strokeStyle='#293c45';c.lineWidth=3;c.beginPath();c.moveTo(8,-8);c.lineTo(FR-13,-22);c.lineTo(FR-5,-5);c.lineTo(FR-17,14);c.lineTo(8,8);c.closePath();c.fill();c.stroke();c.restore();}circle(c,FX,FY,17,'#c0a769','#394950');
  if(!state.fanStopped){const alpha=1-slow;for(let i=0;i<5;i++){const x=FX-75-((t*100+i*43)%140),y=267+i*24;c.strokeStyle=`rgba(164,209,216,${alpha*.6})`;c.lineWidth=2;c.beginPath();c.moveTo(x,y);c.bezierCurveTo(x-20,y-8,x-50,y+8,x-65,y);c.stroke();}}
  let mx=t<1.9?lerp(90,216,ease(seg(t,0,1.9))):t<4.1?216:t<5.4?lerp(216,241,ease(seg(t,4.1,4.65))):t<9?lerp(241,397,ease(seg(t,7.8,9))):t<14.8?397:lerp(397,767,ease(seg(t,14.8,18.3)));
  const walking=t<1.9||(t>7.8&&t<9)||(t>14.8&&t<18.3);
  const death=seg(t,4.65,5.6);if(state.robotAlive)robot(c,RX,FLOOR,t,t>1.9,death);
  if(t>2&&t<5.1){panel(c,249,192,98,107,'#15252ceF','#cfb676',15);rune(c,298,237,77);text(c,'정지',298,282,16,'#ecdca4','center');}
  if(t>1.9&&t<2.6)text(c,'!',RX,310,27,'#f0c85f','center');
  mage(c,mx,FLOOR,t,walking,state.attack);
  if(state.attack>0){c.save();c.translate(mx+34,FLOOR-48);c.rotate(-.45+state.attack*1.2);c.strokeStyle='#f6e6ac';c.lineWidth=8;c.beginPath();c.arc(0,0,58,-1.3,1.1);c.stroke();c.strokeStyle='#72cddd';c.lineWidth=3;c.beginPath();c.arc(0,0,70,-1.3,1.1);c.stroke();c.restore();}
  if(t>4.65&&t<5.65){const k=seg(t,4.65,5.65);for(let i=0;i<9;i++){const a=i*TAU/9;c.save();c.globalAlpha=1-k;c.translate(RX+Math.cos(a)*k*59,FLOOR-35+Math.sin(a)*k*39);c.rotate(k*6+i);c.fillStyle=i%2?'#d4bc78':'#7295a1';c.fillRect(-4,-4,8,8);c.restore();}text(c,'처치',RX+87,FLOOR-82-k*10,20,`rgba(240,220,161,${1-k})`,'center');}
  if(state.drop){const k=ease(seg(t,6.1,7.8)),x=lerp(RX,60,k),y=lerp(FLOOR-50,456,k)-Math.sin(k*Math.PI)*81;circle(c,x,y,39,'#bad2b01c');rune(c,x,y,76);}
  // HUD and wheel have dedicated lanes, outside the character and fan silhouettes.
  for(let i=0;i<3;i++){panel(c,19+i*80,422,70,68,i===0&&state.collected?'#385258':'#15262c',i===0&&state.collected?'#dbc184':'#4c615f',11);if(i===0&&state.collected)rune(c,54+i*80,456,63);}
  text(c,'마법 슬롯',273,456,17,'#adbfbc');
  if(t>=9&&t<12){const k=seg(t,9,9.45)*(1-seg(t,11.6,12)),cy=225;c.save();c.globalAlpha=k;circle(c,mx,cy,61,'#182a32ef','#caaf6e');for(let i=0;i<3;i++){const a=-Math.PI/2+i*TAU/3;c.strokeStyle='#bfa05c';c.lineWidth=2;c.beginPath();c.moveTo(mx,cy);c.lineTo(mx+Math.cos(a)*60,cy+Math.sin(a)*60);c.stroke();}rune(c,mx+24,cy-10,59);text(c,'정지 선택',mx,cy+83,19,'#e6d49f','center');c.restore();}
  if(t>10.6&&t<12.1){const k=seg(t,10.6,11.1);c.save();c.strokeStyle='#dbe8c9';c.lineWidth=2;c.setLineDash([6,7]);c.beginPath();c.moveTo(mx+30,FLOOR-65);c.lineTo(lerp(mx+30,FX,k),lerp(FLOOR-65,FY,k));c.stroke();c.restore();}
  if(t>=12.1&&t<13){const k=seg(t,12.1,13);rune(c,lerp(mx+30,FX,k),lerp(FLOOR-65,FY,k)-Math.sin(k*Math.PI)*18,67);}
  if(t>=13){c.save();const k=seg(t,13,13.8);c.globalAlpha=.8;circle(c,FX,FY,22+k*68,'#91cbd315','#acd3d1');c.restore();rune(c,FX,100,82);text(c,'정지 적용',FX,155,18,'#e7d29c','center');}
  text(c,'WORDLESS MAGE',24,28,20,'#dbc58d');c.restore();
 }};
}

/* Playback can be paused, replayed or inspected at a named step. */
function mount(root,scene){
 const cv=root.querySelector('canvas'),ctx=cv.getContext('2d'),dpr=Math.min(2,devicePixelRatio||1),marks=[...root.querySelectorAll('[data-phase]')],bar=root.querySelector('.nx-anim-bar i'),toggle=root.querySelector('[data-anim-toggle]'),caption=root.querySelector('[data-anim-caption]');
 let W=0,H=0,t=reduce?scene.duration-2:0,last=0,raf=0,visible=false,paused=reduce,disposed=false,lastPhase=-1;
 function paint(){if(!W||disposed)return;ctx.save();scene.draw(ctx,W,H,t);ctx.restore();let phase=0;scene.steps.forEach(([at],i)=>{if(t>=at)phase=i;});if(phase!==lastPhase){marks.forEach((mark,i)=>{mark.classList.toggle('on',i===phase);mark.querySelector('button')?.setAttribute('aria-pressed',String(i===phase));});if(caption)caption.textContent=scene.steps[phase][1];lastPhase=phase;}if(bar)bar.style.width=t/scene.duration*100+'%';if(toggle){toggle.textContent=paused?'재생':'일시정지';toggle.setAttribute('aria-pressed',String(paused));}}
 function schedule(){if(!disposed&&visible&&!paused&&!raf)raf=requestAnimationFrame(frame);}
 function frame(now){raf=0;if(!root.isConnected){dispose();return;}if(!visible||paused)return;t=(t+Math.min(.05,(now-(last||now))/1000))%scene.duration;last=now;paint();schedule();}
 const size=()=>{const r=cv.getBoundingClientRect();W=r.width;H=r.height;cv.width=Math.round(W*dpr);cv.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);paint();};
 function onClick(event){if(event.target.closest('[data-anim-toggle]')){paused=!paused;last=0;paint();schedule();return;}if(event.target.closest('[data-anim-replay]')){t=0;paused=false;last=0;paint();schedule();return;}const jump=event.target.closest('[data-anim-jump]');if(jump){const at=Number(jump.dataset.animJump),index=scene.steps.findIndex(row=>row[0]===at),next=scene.steps[index+1]?.[0]??scene.duration;t=(at+next)/2;paused=true;paint();}}
 const io=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;last=0;schedule();},{threshold:.12}),ro=new ResizeObserver(size);io.observe(cv);ro.observe(cv);root.addEventListener('click',onClick);size();
 function dispose(){disposed=true;if(raf)cancelAnimationFrame(raf);io.disconnect();ro.disconnect();root.removeEventListener('click',onClick);}
 return dispose;
}
return {wopScene,wmScene,mount};
})();

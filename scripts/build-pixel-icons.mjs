import fs from 'node:fs';
import vm from 'node:vm';

// Native 32px sprites: integer cells, small palettes, no smoothing or texture.
const N=32,root=new URL('../public/assets/history/',import.meta.url);
function sprite(draw){
 const a=Array.from({length:N},()=>Array(N).fill(null));
 const pixel=(x,y,c)=>{if(x>=0&&x<N&&y>=0&&y<N)a[y][x]=c;};
 const box=(x,y,w,h,c)=>{for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)pixel(i,j,c);};
 const oval=(cx,cy,rx,ry,c)=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++)if(((x+.5-cx)/rx)**2+((y+.5-cy)/ry)**2<=1)pixel(x,y,c);};
 const poly=(p,c)=>{for(let y=0;y<N;y++)for(let x=0;x<N;x++){let on=false;for(let i=0,j=p.length-1;i<p.length;j=i++){const [xi,yi]=p[i],[xj,yj]=p[j];if((yi>y+.5)!==(yj>y+.5)&&x+.5<(xj-xi)*(y+.5-yi)/(yj-yi)+xi)on=!on;}if(on)pixel(x,y,c);}};
 draw({a,pixel,box,oval,poly});
 const out=a.map(r=>[...r]);
 for(let y=1;y<N-1;y++)for(let x=1;x<N-1;x++)if(a[y][x])for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]])if(!out[y+dy][x+dx])out[y+dy][x+dx]='#29333b';
 let body='<rect width="32" height="32" fill="#fff"/>';
 for(let y=0;y<N;y++)for(let x=0;x<N;){const c=out[y][x],start=x;while(x<N&&out[y][x]===c)x++;if(c)body+=`<rect x="${start}" y="${y}" width="${x-start}" height="1" fill="${c}"/>`;}
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" shape-rendering="crispEdges">${body}</svg>\n`;
}
const icons={
 wop:({a,box,oval,poly})=>{
  oval(15,23,9,6,'#669c58');
  for(let y=23;y<30;y++)for(let x=0;x<32;x++)if(a[y][x])a[y][x]='#42774d';
  box(9,19,4,2,'#a2c67b');box(17,22,4,2,'#a2c67b');box(12,26,4,1,'#83ad65');
  box(14,11,2,10,'#42774d');poly([[14,19],[9,18],[8,15],[12,16]],'#80b266');poly([[16,17],[20,13],[22,14],[19,18]],'#a2c67b');
  oval(15,6,3,4,'#edc458');oval(10,9,4,3,'#edc458');oval(12,13,3,4,'#dba84a');oval(18,13,3,4,'#edc458');oval(20,9,4,3,'#f3d979');oval(15,10,3,3,'#8c6542');box(14,8,2,2,'#b58a4c');
  poly([[25,12],[29,10],[29,14],[25,18],[23,16]],'#dce7df');box(26,13,2,2,'#5d94ac');poly([[23,17],[26,18],[22,21]],'#d89459');
 },
 'wordless-mage':({a,box,oval})=>{
  const brass='#b79b58',ivory='#e7e5d7';
  oval(16,16,10,10,brass);
  for(const [x,y,w,h]of[[13,3,6,6],[13,23,6,6],[3,13,6,6],[23,13,6,6],[6,6,6,6],[20,6,6,6],[6,20,6,6],[20,20,6,6]])box(x,y,w,h,brass);
  oval(16,16,8,8,ivory);
  for(const [x,y,w,h]of[[14,4,4,7],[14,21,4,7],[4,14,7,4],[21,14,7,4],[7,7,5,5],[20,7,5,5],[7,20,5,5],[20,20,5,5]])box(x,y,w,h,ivory);
  for(let y=17;y<29;y++)for(let x=3;x<29;x++)if(a[y][x]===ivory)a[y][x]='#aeb2aa';
  oval(16,16,5,5,null);
 },
 galactica:({poly,box})=>{
  // side-on starfighter: swept wings, cockpit canopy, engine glow
  poly([[7,14],[15,13],[11,4],[6,4]],'#80aaba');poly([[7,18],[15,19],[11,28],[6,28]],'#5d7f90');
  box(5,4,7,2,'#dce5e8');box(5,26,7,2,'#a9b8c0');box(12,4,3,1,'#29333b');box(12,27,3,1,'#29333b');
  poly([[3,13],[21,12],[30,16],[21,20],[3,19]],'#dce5e8');poly([[3,16],[30,16],[21,20],[3,19]],'#9fb4bf');
  poly([[15,13],[21,12],[24,15],[16,15]],'#345c78');box(19,13,2,1,'#7ac5d0');box(8,16,10,1,'#e05a4f');
  box(2,13,3,7,'#4b5d68');box(0,14,2,5,'#ff9b3d');box(0,15,1,3,'#ffe07a');
 },
 'triple-showdown':({poly,box})=>{
  poly([[4,9],[15,5],[21,24],[10,28]],'#4d79b3');poly([[18,5],[29,9],[23,28],[12,24]],'#608f57');
  poly([[9,8],[23,8],[23,28],[9,28]],'#c19b49');box(10,9,12,17,'#edd186');
  poly([[16,13],[20,18],[16,23],[12,18]],'#976c3f');box(11,10,2,2,'#fff1c0');box(20,24,1,2,'#976c3f');
  poly([[6,14],[10,12],[12,16],[8,18]],'#afc9df');poly([[24,13],[27,15],[25,18],[22,17]],'#b3cba1');
 },
 'lone-lantern':({box,oval,poly})=>{
  oval(16,8,5,5,'#65909b');oval(16,8,3,3,null);box(10,12,12,3,'#416675');
  poly([[11,15],[21,15],[24,27],[8,27]],'#65909b');poly([[13,16],[19,16],[21,25],[11,25]],'#a6d4ca');
  poly([[16,16],[19,21],[18,24],[14,24],[13,22],[15,20]],'#eff1c5');box(8,26,16,3,'#416675');box(15,15,1,3,'#416675');
 },
 defair:({poly,oval})=>{
  poly([[21,4],[25,3],[21,8],[22,12],[26,13],[30,9],[29,15],[25,19],[21,19],[10,29],[6,29],[3,26],[3,22],[16,11],[16,7]],'#48bfe6');
  poly([[19,16],[23,18],[10,29],[6,29],[4,27],[7,25]],'#3d6dc0');oval(7,25,2,2,'#e1e6dc');
 }
};
for(const [name,draw]of Object.entries(icons))fs.writeFileSync(new URL(name+'-pixel.svg',root),sprite(draw));
const file=new URL('../public/data/showcase-data.js',import.meta.url),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(file,'utf8'),ctx);const d=ctx.window.SHOWCASE_DATA;
for(const h of d.intro.profile.history)for(const m of h.marks||[])m.src=m.src.replace(/-game\.svg$/,'-pixel.svg');
for(const p of d.cases.projects)p.logo=p.logo.replace(/-game\.svg$/,'-pixel.svg');
fs.writeFileSync(file,'window.SHOWCASE_DATA = '+JSON.stringify(d,null,2)+';\n');

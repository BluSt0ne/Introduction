/* Project Archive: buildless, relative URLs, no account or backend dependency. */
'use strict';
let DATA=window.ARCHIVE_DATA;
if(new URLSearchParams(location.search).get('draft')==='1'){
 try { const saved=JSON.parse(localStorage.getItem('project-archive-draft-v1')); if(saved&&saved.schemaVersion===1&&Array.isArray(saved.documents)&&Array.isArray(saved.resources)&&Array.isArray(saved.releases)&&Array.isArray(saved.projects))DATA=saved; } catch {}
 const banner=document.createElement('div');banner.className='draft-banner';banner.textContent='로컬 초안 미리보기 · 이 브라우저에만 저장된 내용이며 아직 공유되지 않았습니다.';document.querySelector('.workspace').prepend(banner);
}
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const norm=v=>String(v??'').normalize('NFKC').toLocaleLowerCase('ko');
const safeURL=v=>{const raw=String(v||'').trim();if(!raw||raw.startsWith('//')||raw.startsWith('\\')||/[\u0000-\u001f]/.test(raw))return '';try{const u=new URL(raw,location.href);if(u.protocol==='blob:'&&new URLSearchParams(location.search).get('draft')==='1'&&u.origin===new URL(location.href).origin)return raw;return ['http:','https:','file:'].includes(u.protocol)?raw:'';}catch{return '';}};
const href=v=>esc(safeURL(v));
const project=id=>DATA.projects.find(p=>p.id===id);
const prettyDate=d=>d?d.replaceAll('-','.'): '미기록';
const size=b=>b>=1048576?(b/1048576).toFixed(1)+' MB':Math.round(b/1024)+' KB';
const mark=id=>`<span class="project-mark ${esc(id)}">${esc(project(id)?.short==='WOP'?'P':'W')}</span>`;
const projectText=id=>id==='site'?'<span class="project-text">아카이브</span>':`<span class="project-text">${mark(id)}${esc(project(id)?.short||id)}</span>`;
const linkDoc=(d,label='웹에서 읽기')=>`<button class="button" data-open-doc="${esc(d.id)}">${label}</button>`;
const routeURL=(path,params={})=>{const p=new URLSearchParams(Object.entries(params).filter(([,v])=>v&&v!=='all'));return '#'+path+(p.size?'?'+p:'');};
let state={page:'overview',project:'all',kind:'all',};
let lastFocus=null;
let BRIEFS=Object.fromEntries(DATA.projects.map(p=>[p.id,p.brief||window.ARCHIVE_DATA.projects.find(base=>base.id===p.id)?.brief]));
const ICON_PATHS={
 home:'<path d="m3 11 9-8 9 8M5 10v11h5v-6h4v6h5V10"/>',
 book:'<path d="M12 5c-3-2-6-2-10-1v15c4-1 7-1 10 1 3-2 6-2 10-1V4c-4-1-7-1-10 1Zm0 0v15"/>',
 cursor:'<path d="m5 3 14 10-7 1-3 7Z"/><path d="m13 14 4 6"/>',
 gear:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3Z"/><circle cx="12" cy="12" r="3"/>',
 flower:'<path d="M12 8c-5-7-10 0-5 4-7 2-2 9 3 5 1 7 9 4 7-2 7-1 4-9-2-7 2-6-6-7-3 0Z"/><circle cx="12" cy="12" r="2"/>',
 blueprint:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2Zm6-2v16m6-14v16"/>',
 grid:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18m6-18v18"/>',
 planet:'<circle cx="12" cy="12" r="7"/><ellipse cx="12" cy="12" rx="12" ry="3.5" transform="rotate(-30 12 12)"/>',
 upgrade:'<path d="M4 20v-5h4v5m2 0V9h4v11m2 0V3h4v17M3 21h18"/>',
 flame:'<path d="M13 2c2 7-5 7-4 12-3-1-3-4-3-4-6 8 1 14 6 12 9-2 10-12 1-20Z"/>',
 robot:'<rect x="4" y="6" width="16" height="15" rx="3"/><path d="M12 6V2m-2 0h4M1 11h3m16 0h3M8 17h8"/><circle cx="8" cy="11" r="1"/><circle cx="16" cy="11" r="1"/>',
 rocket:'<path d="M9 15c-1-5 2-11 11-12 0 9-6 12-11 12Zm0-6-5 1-2 6 7-1m6 0-1 5-6 2 1-7M5 19l-2 2"/><circle cx="15" cy="8" r="2"/>',
 controls:'<path d="M7 7h10c4 0 7 14 3 14-2 0-3-5-5-5H9c-2 0-3 5-5 5C0 21 3 7 7 7Z"/><path d="M7 10v5m-2-2h5m6-2h.1m2 3h.1"/>',
 magic:'<path d="m4 21 12-12 3 3L7 24M5 3v5M2.5 5.5h5M18 1v5m-2.5-2.5h5M21 17v5m-2.5-2.5h5"/>',
 box:'<path d="m12 2 10 5v11l-10 5-10-5V7Zm0 10L2 7m10 5L22 7m-10 5v11M7 4.5l10 5"/>',
 wind:'<path d="M2 8h12c6 0 6-7 1-7M2 12h17c5 0 5 6 1 6M2 16h9c5 0 5 7 0 6"/>',
 stage:'<path d="M4 21V3m0 1h15l-3 4 3 4H4M2 21h9"/>',
 heart:'<path d="M12 21S1 14 1 7c0-6 9-8 11-2 2-6 11-4 11 2 0 7-11 14-11 14Z"/>',
 waste:'<path d="m3 20 3-9 5 2 4-9 6 16Z"/><path d="m6 11 5-7 4 4m-4 5 3 7"/>',
 conveyor:'<rect x="2" y="11" width="20" height="8" rx="4"/><circle cx="6" cy="15" r="1.5"/><circle cx="12" cy="15" r="1.5"/><circle cx="18" cy="15" r="1.5"/><path d="M7 11V4h9v7M5 19v3m14-3v3"/>',
 stone:'<path d="m5 21-2-8 6-9 7 1 6 11-4 5Zm-2-8 9 2 4-10m-4 10 6 6"/>',
 monument:'<path d="M5 21V6l7-4 7 4v15M3 21h18M9 7h6m-6 5h6m-6 4h6"/>',
 power:'<path d="M12 2v10M6 5a9 9 0 1 0 12 0"/>',
 hatch:'<path d="M2 5h20M5 5v11m14-11v11M5 16l5 5m9-5-5 5M2 3v4m20-4v4"/>',
 ladder:'<path d="M6 2v20M18 2v20M6 6h12M6 12h12M6 18h12"/>',
 weight:'<path d="M9 7a3 3 0 1 1 6 0M5 8h14l3 14H2Z"/><path d="M9 15h6m-3-3v6"/>',
 damage:'<path d="m14 1-10 13h7l-1 9 10-13h-7Z"/>'
};
function pictogram(name){return `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICON_PATHS[name]||ICON_PATHS.book}</svg>`;}
function docTopic(d){if(d.id.endsWith('overview'))return 'book';const n=Number(d.id.split('-')[1]);return ({1:'cursor',2:'gear',3:'flower',4:'blueprint',5:'grid',6:'planet',7:'upgrade',8:'flame',9:'robot',10:'rocket',11:'upgrade',12:'controls',13:'magic',14:'box',15:'robot',16:'wind',17:'stage',18:'heart',19:'magic',20:'robot',21:'robot',22:'box',23:'waste',24:'conveyor',25:'monument',26:'power',27:'hatch',28:'stone',29:'ladder',30:'weight',31:'damage'})[n]||'book';}
function docIcon(d){return `<span class="topic-icon ${esc(d.project)}" data-topic="${docTopic(d)}">${pictogram(docTopic(d))}</span>`;}
function titleBlock(title,description,kicker='PROJECT ARCHIVE'){return `<div class="page-title"><span class="eyebrow">${kicker}</span><h1>${title}</h1>${description?`<p>${description}</p>`:''}</div>`;}
function layoutNumber(value,fallback,min,max){const n=Number(value);return Number.isFinite(n)?Math.min(max,Math.max(min,n)):fallback;}
function coverImageStyle(row){const l=row.coverLayout;if(!l)return '';return `object-fit:${l.fit==='contain'?'contain':'cover'};object-position:${layoutNumber(l.positionX,50,0,100)}% ${layoutNumber(l.positionY,50,0,100)}%`;}
function heroFrameStyle(p){return p.coverLayout?`--hero-width:${layoutNumber(p.coverLayout.heroWidth,p.id==='ww'?67:47,25,80)}%`:'';}
function documentVideoSource(value){
 const raw=safeURL(value);if(!raw)return null;let url;try{url=new URL(raw,location.href);}catch{return null;}
 const host=url.hostname.toLowerCase(),parts=url.pathname.split('/').filter(Boolean);let id='';
 if(host==='youtu.be')id=parts[0]||'';
 else if(['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host))id=parts[0]==='watch'?url.searchParams.get('v')||'':['embed','shorts','live'].includes(parts[0])?parts[1]||'':'';
 if(/^[\w-]{11}$/.test(id))return {embed:true,src:'https://www.youtube-nocookie.com/embed/'+id};
 if(['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(host)){const video=parts.find(part=>/^\d+$/.test(part));if(video)return {embed:true,src:'https://player.vimeo.com/video/'+video};return null;}
 if(['youtu.be','youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host))return null;
 return {embed:false,src:raw};
}
function inlineVideo(b,sectionIndex,blockIndex){const source=documentVideoSource(b.src);if(!source)return '';const l=b.layout||{},width=layoutNumber(l.width,100,10,100),offset=layoutNumber(l.offsetX,0,0,100-width),height=layoutNumber(l.height,0,0,1000),top=layoutNumber(l.spaceTop,0,0,200);return `<figure id="doc-block-${sectionIndex}-${blockIndex}" class="doc-inline-video" style="width:${width}%;margin-left:${offset}%;margin-top:${top}px">${source.embed?`<iframe src="${esc(source.src)}" title="${esc(b.title||'동영상')}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowfullscreen style="${height?'height:'+height+'px':''}"></iframe>`:`<video controls playsinline preload="metadata" ${b.title?`aria-label="${esc(b.title)}"`:''} src="${href(source.src)}" style="${height?'height:'+height+'px;':''}object-fit:${l.fit==='cover'?'cover':'contain'}">동영상을 재생할 수 없습니다.</video>`}${b.title?`<h4>${esc(b.title)}</h4>`:''}${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`;}
function inlineLink(b,sectionIndex,blockIndex){const raw=safeURL(b.url);if(!raw)return '';try{if(!['http:','https:'].includes(new URL(raw,location.href).protocol))return '';}catch{return '';}return `<a id="doc-block-${sectionIndex}-${blockIndex}" class="doc-link-card" href="${esc(raw)}" target="_blank" rel="noopener noreferrer"><span class="doc-link-symbol" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="m10 13 4-4m-6 6-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m2 3 1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0"/></svg></span><span><strong>${esc(b.label||b.url)}</strong>${b.description?`<small>${esc(b.description)}</small>`:''}<span class="doc-link-url">${esc(b.url)}</span></span></a>`;}

function inlineImage(b,sectionIndex=0,blockIndex=0){const src=href(b.src);if(!src)return '';const l=b.layout||{},width=layoutNumber(l.width,100,10,100),offset=layoutNumber(l.offsetX,0,0,100-width),height=layoutNumber(l.height,0,0,1000),top=layoutNumber(l.spaceTop,0,0,200);return `<figure id="doc-image-${sectionIndex}-${blockIndex}" class="doc-inline-image" style="width:${width}%;margin-left:${offset}%;margin-top:${top}px"><img src="${src}" alt="${esc(b.alt||'')}" width="640" height="360" loading="lazy" style="height:${height?height+'px':'auto'};object-fit:${l.fit==='cover'?'cover':'contain'};object-position:${layoutNumber(l.positionX,50,0,100)}% ${layoutNumber(l.positionY,50,0,100)}%">${b.caption?`<figcaption>${esc(b.caption)}</figcaption>`:''}</figure>`;}
let appliedPreviewRevision=null;
function applyLivePreview(payload,hydrate=false){
 if(payload?.type!=='archive-live-preview'||(payload.revision&&payload.revision===appliedPreviewRevision))return false;
 const incoming=payload.data,route=String(payload.route||'overview');
 if(!incoming||incoming.schemaVersion!==1||!Array.isArray(incoming.projects)||!Array.isArray(incoming.documents)||!Array.isArray(incoming.resources)||!Array.isArray(incoming.releases)||!incoming.site)return false;
 if(!/^(overview|ai-development|documents(?:\?project=[\w-]+)?|(?:project|document)\/[\w-]+)$/.test(route))return false;
 appliedPreviewRevision=payload.revision;DATA=incoming;
 BRIEFS=Object.fromEntries(DATA.projects.map(p=>[p.id,p.brief||window.ARCHIVE_DATA.projects.find(base=>base.id===p.id)?.brief]));
 const finish=()=>{
  if(DATA!==incoming)return;
  document.querySelectorAll('dialog[open]').forEach(d=>d.close());history.replaceState(null,'','#'+route);
  let style=document.getElementById('live-draft-css');if(!style){style=document.createElement('style');style.id='live-draft-css';document.head.append(style);}style.textContent=typeof payload.css==='string'?payload.css:'';
  render();
  if(typeof payload.focus==='string'&&/^\d+-\d+$/.test(payload.focus))(document.getElementById('doc-image-'+payload.focus)||document.getElementById('doc-block-'+payload.focus))?.scrollIntoView?.({block:'center'});
  const banner=document.querySelector('.draft-banner');if(banner)banner.textContent='실시간 미리보기 · 편집 도구와 자동 동기화 중 · 공개 반영 전';
  if(new URLSearchParams(location.search).get('embedded')==='1')window.parent.postMessage({type:'archive-preview-applied',revision:payload.revision},new URL(location.href).origin);
 };
 if(hydrate)restoreDraftMedia().catch(()=>{}).finally(finish);else finish();
 return true;
}
function initLivePreview(){
 if(new URLSearchParams(location.search).get('draft')!=='1')return;
 const embedded=new URLSearchParams(location.search).get('embedded')==='1';
 if(embedded){
  document.body.classList.add('embedded-preview');
  window.addEventListener('message',event=>{if(event.source===window.parent&&event.origin===new URL(location.href).origin)applyLivePreview(event.data);});
  window.parent.postMessage({type:'archive-preview-ready'},new URL(location.href).origin);
 }else{
  const channel=typeof window.BroadcastChannel==='function'?new window.BroadcastChannel('project-archive-live-preview'):null;
  if(channel){channel.onmessage=event=>applyLivePreview(event.data);channel.postMessage({type:'archive-preview-request'});}
  window.addEventListener('storage',event=>{if(event.key!=='project-archive-live-preview-v1'||!event.newValue||channel)return;try{applyLivePreview(JSON.parse(event.newValue),true);}catch{}});
  try{const snapshot=JSON.parse(localStorage.getItem('project-archive-live-preview-v1'));if(snapshot&&Date.now()-snapshot.updatedAt<86400000)applyLivePreview(snapshot,true);}catch{}
 }
}

function overview(){
 return `<section class="collection-heading"><span class="eyebrow">${esc(DATA.site.kicker||'GAME DESIGN & DEVELOPMENT')}</span><h1>${esc(DATA.site.heading||'Projects')}<span class="heading-dot">.</span></h1></section>
 <section class="project-grid" aria-label="프로젝트">${DATA.projects.map(p=>`<a class="project-card ${p.id}" href="#project/${p.id}"><div class="project-visual"><img src="${href(p.cover)}" style="${coverImageStyle(p)}" alt="${esc(p.name)} 플레이 화면" fetchpriority="high"><span class="project-label">${p.id==='wop'?'GROW & AUTOMATE':'OBSERVE & CAST'}</span></div><div class="project-card-body"><span class="card-genre">${esc(p.genre)}${p.developmentPeriod?` · ${esc(p.developmentPeriod)}`:''}</span><h2>${esc(p.name)}</h2><p>${esc(p.cardText||'')}</p><span class="card-cta">프로젝트 보기 <span aria-hidden="true">+</span></span></div></a>`).join('')}</section>`;
}
const projectShot={};
function projectPresentation(p){const base=window.ARCHIVE_DATA.projects.find(row=>row.id===p.id);return {gallery:p.gallery??base?.gallery??[],markdown:p.productionMarkdown??base?.productionMarkdown??''};}
function galleryVideo(src){const v=documentVideoSource(src);return v&&v.embed?v:null;}
function galleryThumb(row,p){const v=galleryVideo(row.src);if(!v)return href(row.src);const yt=v.src.match(/youtube-nocookie\.com\/embed\/([\w-]{11})/);return yt?esc('https://i.ytimg.com/vi/'+yt[1]+'/hqdefault.jpg'):href(p.cover);}
function projectGallery(p){
 const shots=projectPresentation(p).gallery;if(!shots.length)return '';
 // every shot is shown in order; a YouTube/Vimeo link plays inline instead of opening as an image
 const item=(shot,i)=>{const video=galleryVideo(shot.src);const media=video?`<div class="screen-video"><iframe src="${esc(video.src)}" title="${esc(shot.title||'플레이 영상')}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="fullscreen; picture-in-picture" allowfullscreen></iframe></div>`:`<button class="screen-enlarge" type="button" data-md-image="${href(shot.src)}" data-md-alt="${esc(shot.title)}" aria-label="${esc(shot.title)} 확대"><img src="${href(shot.src)}" alt="${esc(shot.title)}" loading="lazy"><span>크게 보기 ↗</span></button>`;return `<figure class="project-screen${video?' is-video':''}">${media}<figcaption>${shots.length>1?`<span class="screen-num">${String(i+1).padStart(2,'0')}</span>`:''}<h3>${esc(shot.title)}</h3>${shot.caption?`<p>${esc(shot.caption)}</p>`:''}</figcaption></figure>`;};
 return `<section class="project-screen-section" id="screens"><div class="brief-heading"><h2>플레이 화면</h2><span>${shots.length}장</span></div><div class="screen-all${shots.length>1?' multi':''}">${shots.map(item).join('')}</div></section>`;
}
function projectProduction(p){const sections=parseAIMarkdown(projectPresentation(p).markdown);return `<section class="project-production" id="production"><div class="brief-heading"><h2>작업 방법과 순서</h2><span>${sections.length} STEPS</span></div><div class="production-timeline">${sections.map((section,index)=>`<article class="production-step"><span class="production-number">${String(index+1).padStart(2,'0')}</span><div class="production-content"><h3>${esc(section.title.replace(/^\d+\.\s*/,''))}</h3><div class="ai-markdown">${renderMarkdownBody(section.lines)}</div></div></article>`).join('')}</div></section>`;}
function projectPage(id){const p=project(id),b=BRIEFS[id];if(!p||!b)return empty('프로젝트를 찾을 수 없습니다.');return `<article class="project-page ${id}"><section class="project-page-hero"><div class="hero-copy"><span class="eyebrow">${esc(b.label)}${p.developmentPeriod?` · ${esc(p.developmentPeriod)}`:''}</span><h1>${b.title.map(t=>`<span>${esc(t)}</span>`).join('')}</h1><p class="lead">${esc(b.tagline)}</p></div><div class="hero-image" style="${heroFrameStyle(p)}"><img src="${href(p.cover)}" style="${coverImageStyle(p)}" alt="${esc(p.name)} 플레이 화면"></div><span class="hero-emblem" aria-hidden="true">${id==='wop'?'✳':'◇'}</span></section>
 <nav class="subnav" aria-label="프로젝트 내 이동"><a href="#" data-scroll="concept">게임 소개</a><a href="#" data-scroll="screens">플레이 화면</a><a href="#" data-scroll="flow">플레이 흐름</a><a href="#" data-scroll="ownership">직접 맡은 일</a><a href="#" data-scroll="production">작업 순서</a></nav>
 <section class="brief-section concept-section" id="concept"><h2>게임 소개</h2><div><p class="concept-line">${esc(b.concept)}</p><ul class="concept-points">${b.points.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></div></section>
 ${projectGallery(p)}
 <section class="brief-section" id="flow"><div class="brief-heading"><h2>플레이 흐름</h2></div><div class="play-flow">${b.steps.map(([title,desc],i)=>`<div class="flow-step"><span class="step-num">${String(i+1).padStart(2,'0')}</span><h3>${esc(title)}</h3><p>${esc(desc)}</p></div>`).join('')}</div></section>
 <section class="project-ownership" id="ownership"><div class="brief-heading"><h2>직접 맡은 일</h2><span>DESIGN · DIRECTION · PLAYTEST</span></div><ul class="ai-roles">${(DATA.site.aiDevelopment?.responsibilities||window.ARCHIVE_DATA.site.aiDevelopment.responsibilities).map(text=>`<li>${esc(text)}</li>`).join('')}</ul><p>게임의 방향과 최종 판단은 직접 맡고, AI를 구현·수정·사운드 제작에 활용했습니다.</p></section>
 <section class="brief-section" id="build"><div class="brief-heading"><h2>제작 방식</h2><a class="button quiet" href="#ai-development">AI 활용 과정</a></div><div class="build-grid">${b.build.map(([title,desc])=>`<div class="build-item"><h3>${esc(title)}</h3><p>${esc(desc)}</p></div>`).join('')}</div></section>
 ${projectProduction(p)}<div class="project-bottom-links"><a class="button" href="#project/${id==='wop'?'ww':'wop'}">${id==='wop'?'Wordless Mage':'World of Plant'} 보기 →</a><a class="button" href="#ai-development">AI와 작업한 방법 →</a></div></article>`;}

let aiActiveSection=0,aiActiveStep=0;
function parseAIMarkdown(value){
 const sections=[];let current=null,fenced=false;
 for(const line of String(value||'').replace(/^\uFEFF/,'').replace(/\r\n?/g,'\n').split('\n')){
  if(/^\s*```/.test(line))fenced=!fenced;
  const heading=!fenced&&line.match(/^##\s+(.+)$/);
  if(heading){current={title:heading[1].trim(),lines:[]};sections.push(current);}
  else if(current)current.lines.push(line);
  else if(!/^#\s/.test(line)&&line.trim()){current={title:'내용',lines:[line]};sections.push(current);}
 }
 // A short introductory sentence belongs to the page header, not an extra tab.
 if(sections.length>1&&sections[0].title==='내용')sections.shift();
 return sections;
}
function markdownURL(value){const raw=String(value||'').trim();if(/^file:/i.test(raw))return '';return safeURL(raw);}
function markdownInline(value){
 const text=String(value||''),pattern=/\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;let html='',last=0;
 for(const m of text.matchAll(pattern)){
  html+=esc(text.slice(last,m.index));
  if(m[1]){const url=markdownURL(m[2]);html+=url?`<a href="${esc(url)}" ${/^https?:/i.test(url)?'target="_blank" rel="noopener noreferrer"':''}>${esc(m[1])}</a>`:esc(m[1]);}
  else html+=m[3]?`<strong>${esc(m[3])}</strong>`:`<code>${esc(m[4])}</code>`;
  last=m.index+m[0].length;
 }
 return html+esc(text.slice(last));
}
function markdownCells(line){return line.trim().replace(/^\|/,'').replace(/\|$/,'').split(/(?<!\\)\|/).map(cell=>cell.trim().replace(/\\\|/g,'|'));}
function renderMarkdownBody(lines){
 let html='',i=0;
 const special=line=>/^\s*(?:#{1,6}\s|```|[-*]\s|\d+\.\s|>\s?|!\[|\|)/.test(line);
 while(i<lines.length){
  const line=lines[i].trim();if(!line){i++;continue;}
  if(/^```/.test(line)){const code=[];i++;while(i<lines.length&&!/^\s*```/.test(lines[i]))code.push(lines[i++]);i++;html+=`<pre><code>${esc(code.join('\n'))}</code></pre>`;continue;}
  const image=line.match(/^!\[([^\]]*)\]\(([^\s)]+)\)$/);
  if(image){const src=markdownURL(image[2]);if(src)html+=`<figure class="ai-figure"><button type="button" data-md-image="${esc(src)}" data-md-alt="${esc(image[1])}" aria-label="${esc(image[1]||'이미지')} 확대"><img src="${esc(src)}" alt="${esc(image[1])}" loading="lazy"><span aria-hidden="true">확대 ↗</span></button><figcaption>${esc(image[1])}</figcaption></figure>`;i++;continue;}
  const heading=line.match(/^#{1,6}\s+(.+)$/);if(heading){html+=`<h4>${markdownInline(heading[1])}</h4>`;i++;continue;}
  if(line.startsWith('|')&&i+1<lines.length&&/^\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i+1].trim())){
   const headers=markdownCells(line),rows=[];i+=2;while(i<lines.length&&lines[i].trim().startsWith('|'))rows.push(markdownCells(lines[i++]));
   html+=`<div class="doc-table-scroll"><table class="doc-content-table"><thead><tr>${headers.map(cell=>`<th scope="col">${markdownInline(cell)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${headers.map((_,j)=>`<td>${markdownInline(row[j]||'')}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;continue;
  }
  if(/^[-*]\s/.test(line)||/^\d+\.\s/.test(line)){const ordered=/^\d+\./.test(line),tag=ordered?'ol':'ul',items=[];while(i<lines.length&&(ordered?/^\s*\d+\.\s/:/^\s*[-*]\s/).test(lines[i]))items.push(lines[i++].replace(/^\s*(?:[-*]|\d+\.)\s+/,''));html+=`<${tag}>${items.map(item=>`<li>${markdownInline(item)}</li>`).join('')}</${tag}>`;continue;}
  if(line.startsWith('>')){const quote=[];while(i<lines.length&&/^\s*>/.test(lines[i]))quote.push(lines[i++].replace(/^\s*>\s?/,''));html+=`<blockquote>${quote.map(markdownInline).join('<br>')}</blockquote>`;continue;}
  const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!special(lines[i]))paragraph.push(lines[i++].trim());html+=`<p>${markdownInline(paragraph.join(' '))}</p>`;
 }
 return html;
}
function markdownSubsections(lines){
 const groups=[];let current=null,fenced=false;
 for(const line of lines){if(/^\s*```/.test(line))fenced=!fenced;const heading=!fenced&&line.match(/^###\s+(.+)$/);if(heading){current={title:heading[1],lines:[]};groups.push(current);}else{if(!current){current={title:'',lines:[]};groups.push(current);}current.lines.push(line);}}
 return groups;
}
function aiSectionBody(section){
 const groups=markdownSubsections(section.lines);
 if(section.title==='협업 흐름'){
  const steps=groups.filter(g=>g.title);
  return `<ol class="ai-flow-list" aria-label="개발 단계">${steps.map((step,index)=>`<li><span class="ai-flow-num">${String(index+1).padStart(2,'0')}</span><div><h3>${esc(step.title.replace(/^\d+\.\s*/,''))}</h3>${renderMarkdownBody(step.lines)}</div></li>`).join('')}</ol>`;
 }
 return groups.map(group=>group.title?`<section class="ai-sub"><h3>${esc(group.title)}</h3>${renderMarkdownBody(group.lines)}</section>`:renderMarkdownBody(group.lines)).join('');
}
// every section is laid out in order on one page: nothing has to be clicked open
function aiMarkdownPage(a){
 const sections=parseAIMarkdown(a.markdown);if(!sections.length)return titleBlock(esc(a.title),esc(a.intro),'GAME DESIGN × AI');
 const theme=title=>/World of Plant/i.test(title)?'wop':/Wordless Mage/i.test(title)?'ww':'shared',n=String(sections.length).padStart(2,'0');
 return `<article class="ai-page ai-interactive ai-all" data-ai-theme="shared">${titleBlock(esc(a.title),esc(a.intro),'GAME DESIGN × AI')}<div class="ai-tool-pills" aria-label="사용한 도구">${a.tools.map(([name])=>`<span>${esc(name)}</span>`).join('')}</div>${sections.map((section,index)=>`<section class="ai-section-panel ai-interactive" data-ai-theme="${theme(section.title)}" id="ai-section-${index}"><header class="ai-panel-heading"><span>${String(index+1).padStart(2,'0')} / ${n}</span><h2>${esc(section.title)}</h2></header><div class="ai-markdown">${aiSectionBody(section)}</div></section>`).join('')}</article>`;
}
function selectAISection(index){aiActiveSection=index;aiActiveStep=0;render();document.querySelector(`[data-ai-section="${index}"]`)?.focus();}
document.addEventListener('click',event=>{
 const shotIndex=event.target.closest('[data-gallery-index]');if(shotIndex){projectShot[shotIndex.dataset.galleryProject]=Number(shotIndex.dataset.galleryIndex);render();document.querySelector('[data-gallery-project=\"'+shotIndex.dataset.galleryProject+'\"][data-gallery-index=\"'+shotIndex.dataset.galleryIndex+'\"]')?.focus();return;}const tab=event.target.closest('[data-ai-section]');if(tab){selectAISection(Number(tab.dataset.aiSection));return;}
 const step=event.target.closest('[data-ai-step]');if(step){aiActiveStep=Number(step.dataset.aiStep);render();document.querySelector(`[data-ai-step="${aiActiveStep}"]`)?.focus();return;}
 const shot=event.target.closest('[data-md-image]');if(shot){lastFocus=document.activeElement;$('#resource-title').textContent=shot.dataset.mdAlt||'이미지';$('#resource-body').innerHTML=`<div class="resource-full-image"><img src="${href(shot.dataset.mdImage)}" alt="${esc(shot.dataset.mdAlt)}"></div>`;$('#resource-dialog').showModal();}
});
document.addEventListener('keydown',event=>{
 const tab=event.target.closest('[data-ai-section]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
 event.preventDefault();const count=parseAIMarkdown((DATA.site.aiDevelopment||window.ARCHIVE_DATA.site.aiDevelopment).markdown).length;
 selectAISection(event.key==='Home'?0:event.key==='End'?count-1:(Number(tab.dataset.aiSection)+(event.key==='ArrowRight'?1:-1)+count)%count);
});

function aiDevelopment(){const a={...window.ARCHIVE_DATA.site.aiDevelopment,...DATA.site.aiDevelopment};if(a.markdown?.trim())return aiMarkdownPage(a);if(!a.title)return empty('AI 활용 내용을 준비 중입니다.');return `<article class="ai-page">${titleBlock(esc(a.title),esc(a.intro),'DESIGN & DEVELOPMENT')}<section class="ai-ownership"><h2>직접 담당한 일</h2><ul class="ai-roles">${a.responsibilities.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></section><section class="ai-section"><h2>도구별 활용</h2><div class="ai-tools">${a.tools.map(([name,text],i)=>`<article class="ai-tool"><span class="step-num">0${i+1}</span><h3>${esc(name)}</h3><p>${esc(text)}</p></article>`).join('')}</div></section><section class="ai-section"><h2>개발 흐름</h2><div class="play-flow">${a.steps.map(([title,text],i)=>`<article class="flow-step"><span class="step-num">0${i+1}</span><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div></section><div class="ai-projects">${DATA.projects.map(p=>`<a class="button" href="#project/${esc(p.id)}">${mark(p.id)}${esc(p.name)}</a>`).join('')}</div></article>`;}
function projectTabs(includeSite=false){return `<div class="filter-tabs" role="group" aria-label="프로젝트 필터">${[['all','전체'],['wop','WOP'],['ww','WW'],...(includeSite?[['site','아카이브']]:[])].map(([id,label])=>`<button data-filter-project="${id}" class="${state.project===id?'selected':''}" aria-pressed="${state.project===id}">${label}</button>`).join('')}</div>`;}
function empty(title='표시할 항목이 없습니다.',desc='다른 분류를 선택해 주세요.'){return `<div class="empty"><h2>${title}</h2><p>${desc}</p><button class="button" data-reset>필터 초기화</button></div>`;}
function matchDoc(d){return(state.project==='all'||d.project===state.project)&&(state.kind==='all'||d.kind===state.kind);}
const DOCUMENT_KINDS=['종합 기획서','시스템 기획서','콘텐츠 기획서'];
function documentCover(d){return safeURL(d.cover)||(d.images||[]).map(id=>DATA.resources.find(r=>r.id===id)).map(r=>safeURL(r?.preview)).find(Boolean)||safeURL(project(d.project)?.cover);}
function documentCard(d){return `<article class="doc-entry ${esc(d.project)}"><button class="document-open" data-open-doc="${esc(d.id)}"><span class="document-cover"><img style="${coverImageStyle(d)}" src="${href(documentCover(d))}" alt="${esc(d.title)} 대표 이미지" loading="lazy" width="640" height="360"></span><span class="document-card-caption">${docIcon(d)}<span class="doc-entry-text"><b>${esc(d.title)}</b></span><span class="entry-plus" aria-hidden="true">+</span></span></button></article>`;}
function documentGroups(docs){return DOCUMENT_KINDS.map(kind=>{const own=docs.filter(d=>d.kind===kind);return own.length?`<section class="document-kind-group" data-document-kind="${esc(kind)}"><header class="document-kind-heading"><h3>${esc(kind.replace(' 기획서',''))}</h3><span>${own.length}</span></header><div class="document-card-grid">${own.map(documentCard).join('')}</div></section>`:'';}).join('');}
function documents(){const docs=DATA.documents.filter(matchDoc);const groups=DATA.projects.filter(p=>state.project==='all'||p.id===state.project);return titleBlock('기획 문서','','DOCUMENTS')+`<div class="document-filters"><div class="library-project-tabs" role="group" aria-label="프로젝트 선택">${[['all','전체'],...DATA.projects.map(p=>[p.id,p.name])].map(([id,label])=>`<button data-filter-project="${esc(id)}" class="${esc(id)} ${state.project===id?'selected':''}" aria-pressed="${state.project===id}">${esc(label)}</button>`).join('')}</div><div class="document-kind-tabs" role="group" aria-label="문서 분류">${[['all','전체'],...DOCUMENT_KINDS.map(kind=>[kind,kind.replace(' 기획서','')])].map(([kind,label])=>`<button data-filter-kind="${esc(kind)}" class="${state.kind===kind?'selected':''}" aria-pressed="${state.kind===kind}">${esc(label)}</button>`).join('')}</div></div>`+(docs.length?`<div class="document-collections ${groups.length===1?'single-project':''}">${groups.map(p=>{const own=docs.filter(d=>d.project===p.id);if(!own.length)return '';return `<section class="document-collection ${esc(p.id)}" aria-labelledby="library-${esc(p.id)}"><header class="collection-project-header"><div><span class="collection-project-symbol">${pictogram(p.id==='wop'?'flower':'magic')}</span><h2 id="library-${esc(p.id)}">${esc(p.name)}</h2></div><span>${own.length}개</span></header>${documentGroups(own)}</section>`}).join('')}</div>`:empty());}
function resources(){const items=DATA.resources.filter(r=>(state.project==='all'||r.projects.includes(state.project))&&(state.kind==='all'||r.type===state.kind));const types=[...new Set(DATA.resources.map(r=>r.type))];return titleBlock('리소스 목록','','RESOURCES')+`<p class="notice">기획 문서에 수록된 이미지</p><div class="filters">${projectTabs()}<label class="select-wrap"><select id="kind-filter" aria-label="리소스 유형"><option value="all">모든 유형</option>${types.map(k=>`<option ${state.kind===k?'selected':''}>${esc(k)}</option>`).join('')}</select></label><span class="result-count">${items.length}개 리소스</span></div>`+(items.length?`<div class="resource-grid">${items.map(r=>`<button class="resource-card" data-open-resource="${r.id}"><div class="resource-img">${r.preview?`<img src="${href(r.preview)}" alt="${esc(r.name)}" loading="lazy">`:`<span style="display:grid;place-items:center;height:100%">${esc(r.type)}</span>`}</div><div class="resource-info"><h2>${esc(r.name)}</h2><div class="resource-meta"><span>${r.projects.map(p=>project(p)?.short||p).join(' · ')} · ${esc(r.type)}</span><span>${r.width&&r.height?r.width+' × '+r.height:esc(r.version||'버전 미기록')}</span></div></div></button>`).join('')}</div>`:empty());}
function changelog(){const releases=[...DATA.releases].filter(r=>(state.project==='all'||r.project===state.project)).sort((a,b)=>b.date.localeCompare(a.date));return titleBlock('변경 기록','','CHANGELOG')+`<div class="filters">${projectTabs(true)}<span class="result-count">${releases.length}개 기록</span></div>`+(releases.length?`<div class="timeline">${releases.map(r=>`<article class="release"><div class="release-kicker"><span class="release-version">${esc(r.version)}</span>${projectText(r.project)}<time datetime="${esc(r.date)}">${prettyDate(r.date)}</time></div><h2>${esc(r.title)}</h2><p>${esc(r.summary)}</p><ul class="change-list">${r.changes.map(c=>`<li><span class="change-type ${c.type==='수정'?'fix':c.type==='변경'?'edit':''}">${esc(c.type)}</span>${esc(c.text)}</li>`).join('')}</ul></article>`).join('')}</div>`:empty('아직 기록된 게임 버전이 없습니다.','확인된 변경 내역을 기록 관리에서 추가하면 이곳에 표시됩니다.'));}
function docContent(d){return `<div class="doc-toolbar"><span>${esc(d.kind)}${d.pages?' · '+d.pages+'페이지':''}</span><div class="toolbar-actions"><a class="button" href="#document/${d.id}" data-close-all>별도 페이지로 보기</a><button class="button" data-copy-doc="${d.id}">문서 링크 복사</button></div></div><div class="doc-body">${d.cover?`<div class="document-cover doc-cover-header"><img src="${href(d.cover)}" style="${coverImageStyle(d)}" alt="${esc(d.title)} 대표 이미지"></div>`:''}${d.images.length?`<div class="doc-image-strip">${d.images.slice(0,4).map(id=>{const r=DATA.resources.find(r=>r.id===id);return r?`<button data-open-resource="${id}" aria-label="${esc(r.name)} 크게 보기"><img src="${href(r.preview)}" alt="${esc(r.name)}" loading="lazy"></button>`:''}).join('')}</div>`:''}${d.sections.map((s,si)=>`<section class="doc-section"><h3>${esc(s.title)}</h3>${s.blocks.map((b,i)=>{if(b.type==='image')return inlineImage(b,si,i);if(b.type==='video')return inlineVideo(b,si,i);if(b.type==='link')return inlineLink(b,si,i);if(b.type==='text'&&b.variant==='heading')return `<h4 id="doc-block-${si}-${i}" class="authored-heading">${esc(b.text)}</h4>`;if(b.type==='table')return `<div id="doc-block-${si}-${i}" class="doc-table-scroll"><table class="doc-content-table"><thead><tr>${b.rows[0].map(c=>`<th scope="col">${esc(c)}</th>`).join('')}</tr></thead><tbody>${b.rows.slice(1).map(row=>`<tr>${row.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;if(d.format==='PPTX'&&!b.variant&&i===0&&norm(b.text).includes(norm(project(d.project).name)))return '';return `<p id="doc-block-${si}-${i}" class="${(!b.variant&&/^(기획 의도|기획 배경|기대 효과|핵심 규칙|문서 범위|예외 처리|확인 항목|화면 표시|연결 규칙|정의|\d+\.\s)/.test(b.text)&&b.text.length<70)?'content-heading':''}">${esc(b.text)}</p>`;}).join('')}</section>`).join('')}</div>`;}
function documentPage(id){const d=DATA.documents.find(d=>d.id===id);if(!d)return empty('문서를 찾을 수 없습니다.');return `<article class="document-page"><a class="back-link" href="${routeURL('documents',{project:d.project})}">기획 문서 목록</a>${titleBlock(esc(d.title),esc(project(d.project).name)+' · '+esc(d.kind),'DOCUMENT')}${docContent(d)}</article>`;}
function render(){const raw=location.hash.slice(1)||'overview';if(/^(documents|document)(?:[/?]|$)/.test(raw)){const old=DATA.documents.find(d=>d.id===raw.split('/')[1]?.split('?')[0]);history.replaceState(null,'','#'+(old?'project/'+old.project:'overview'));return render();}const [path,query]=raw.split('?');const parts=path.split('/');const params=new URLSearchParams(query);state={page:parts[0],project:params.get('project')||'all',kind:params.get('kind')||'all'};document.body.dataset.theme=(state.page==='project'?parts[1]:state.project)==='wop'?'wop':(state.page==='project'?parts[1]:state.project)==='ww'?'mage':'archive';$('#updated').textContent=prettyDate(DATA.site.updated);const email=$('.contact-email');if(email){const address=DATA.site.contactEmail||'';email.textContent=address;email.setAttribute('href','mailto:'+address);}const navPage=['project','overview'].includes(state.page)?'overview':state.page==='document'?'documents':state.page;document.querySelectorAll('[data-nav]').forEach(a=>{const active=a.dataset.nav===navPage;a.classList.toggle('active',active);if(active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});document.querySelectorAll('[data-project]').forEach(a=>a.classList.toggle('active',state.page==='project'&&a.dataset.project===parts[1]));const labels={'ai-development':'AI 활용',overview:'프로젝트',project:project(parts[1])?.name||'프로젝트',documents:'기획 문서',document:'기획 문서 / '+(DATA.documents.find(d=>d.id===parts[1])?.title||''),resources:'리소스 목록',changelog:'변경 기록'};$('#breadcrumb').textContent=labels[state.page]||'프로젝트';document.title=(state.page==='overview'?'WOP & WW':labels[state.page]||'프로젝트')+' · Game Archive';const views={'ai-development':aiDevelopment,overview,project:()=>projectPage(parts[1]),documents,resources,changelog,document:()=>documentPage(parts[1])};$('#main').innerHTML=(views[state.page]||overview)();}
function filter(patch){const next={project:state.project,kind:state.kind,...patch};location.hash=routeURL(state.page,next);}
function openDoc(id){const d=DATA.documents.find(d=>d.id===id);if(!d)return;lastFocus=document.activeElement;$('#dialog-kicker').textContent=project(d.project).name+' / '+d.kind;$('#dialog-title').textContent=d.title;$('#dialog-body').innerHTML=docContent(d);$('#document-dialog').showModal();$('#document-dialog').scrollTop=0;}
function openResource(id){const r=DATA.resources.find(r=>r.id===id);if(!r)return;$('#resource-title').textContent=r.name;const sourceDocs=(r.sourceDocs||[]).map(id=>DATA.documents.find(d=>d.id===id)).filter(Boolean);$('#resource-body').innerHTML=`${r.preview?`<div class="resource-full-image"><img src="${href(r.preview)}" alt="${esc(r.name)}"></div>`:''}<div class="resource-details"><dl class="resource-fields">${[['프로젝트',r.projects.map(id=>project(id)?.name||id).join(' · ')],['유형',r.type],['크기',r.width&&r.height?r.width+' × '+r.height:'미기록'],['파일',r.bytes?size(r.bytes):'미기록'],['버전',r.version||'미기록'],['이용 조건',r.license||'미기록']].map(([k,v])=>`<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl><p>${esc(r.note||'')}</p>${r.source?`<p>출처: ${esc(r.source)}</p>`:''}${sourceDocs.length?`<p>사용된 기획 문서</p><div class="hero-actions">${sourceDocs.map(d=>`<a class="button" href="#document/${d.id}" data-close-all>${esc(project(d.project).short+' · '+d.title)}</a>`).join('')}</div>`:''}</div>`;$('#resource-dialog').showModal();}
function toast(message){$('.toast')?.remove();const el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.textContent=message;document.body.append(el);setTimeout(()=>el.remove(),2500);}
async function copyDoc(id){const url=new URL(location.href);url.hash='document/'+id;try{await navigator.clipboard.writeText(url.href);toast('문서 링크를 복사했습니다.');}catch{toast('주소창의 링크를 복사해 주세요.');location.hash='document/'+id;}}
document.addEventListener('click',e=>{if(e.target.closest('.skip-link')){e.preventDefault();$('#main').focus();return;}const doc=e.target.closest('[data-open-doc]');if(doc){openDoc(doc.dataset.openDoc);return;}const resource=e.target.closest('[data-open-resource]');if(resource){openResource(resource.dataset.openResource);return;}const kf=e.target.closest('[data-filter-kind]');if(kf){filter({kind:kf.dataset.filterKind});return;}const pf=e.target.closest('[data-filter-project]');if(pf){filter({project:pf.dataset.filterProject});return;}const reset=e.target.closest('[data-reset]');if(reset){filter({project:'all',kind:'all',});return;}const copy=e.target.closest('[data-copy-doc]');if(copy){copyDoc(copy.dataset.copyDoc);return;}const scroll=e.target.closest('[data-scroll]');if(scroll){e.preventDefault();document.getElementById(scroll.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'});return;}if(e.target.closest('[data-close-all]')){document.querySelectorAll('dialog[open]').forEach(d=>d.close());}});
$('#close-dialog').addEventListener('click',()=>$('#document-dialog').close());$('#close-resource').addEventListener('click',()=>$('#resource-dialog').close());$('#resource-dialog').addEventListener('close',()=>lastFocus?.focus());$('#document-dialog').addEventListener('close',()=>lastFocus?.focus());
for(const dlg of document.querySelectorAll('dialog'))dlg.addEventListener('click',e=>{if(e.target===dlg){const r=dlg.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dlg.close();}});
document.addEventListener('change',e=>{if(e.target.id==='kind-filter')filter({kind:e.target.value});});
window.addEventListener('hashchange',()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());render();window.scrollTo({top:0,behavior:'instant'});});
async function restoreDraftMedia(){if(new URLSearchParams(location.search).get('draft')!=='1'||!('indexedDB'in window))return;const db=await new Promise((resolve,reject)=>{const req=window.indexedDB.open('project-archive-editor',1);req.onupgradeneeded=()=>req.result.createObjectStore('assets',{keyPath:'path'});req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});const assets=await new Promise((resolve,reject)=>{const req=db.transaction('assets').objectStore('assets').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});for(const asset of assets){if(!asset.type?.startsWith('image/')&&!asset.type?.startsWith('video/'))continue;const url=URL.createObjectURL(new Blob([asset.bytes],{type:asset.type}));if(DATA.site.aiDevelopment?.markdown)DATA.site.aiDevelopment.markdown=DATA.site.aiDevelopment.markdown.replaceAll(']('+asset.path+')',']('+url+')');for(const p of DATA.projects){if(p.cover===asset.path)p.cover=url;for(const shot of p.gallery||[])if(shot.src===asset.path)shot.src=url;if(p.productionMarkdown)p.productionMarkdown=p.productionMarkdown.replaceAll(']('+asset.path+')',']('+url+')');}for(const d of DATA.documents){if(d.cover===asset.path)d.cover=url;for(const s of d.sections)for(const b of s.blocks)if((b.type==='image'||b.type==='video')&&b.src===asset.path)b.src=url;}for(const r of DATA.resources)if(r.preview===asset.path)r.preview=url;}db.close();}
if(new URLSearchParams(location.search).get('draft')==='1')restoreDraftMedia().catch(()=>{}).finally(render);else render();

initLivePreview();

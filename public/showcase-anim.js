/* Looping canvas scenes modelled on the in-game look.
   WoP: cursor wave grows flowers -> energy -> devices installed -> blueprint copied to the next plot.
   WM (pixel art): robot reacts with a stop sign -> sign taken as magic -> aim from the wheel -> fan stops -> pass. */
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

function wopScene() {
  const r = rnd(11);
  // flower slots in the left plot (normalized 0..1 in plot space)
  const slots = [];
  for (let gy = 0; gy < 4; gy++) for (let gx = 0; gx < 5; gx++) slots.push({ x: .12 + gx * .19 + (r() - .5) * .07, y: .16 + gy * .22 + (r() - .5) * .07, k: (gx + gy * 2) % 3 });
  const devices = [{ type: 'emitter', x: .405, y: .49, t: 4.4 }, { type: 'battery', x: .215, y: .27, t: 5.5 }];
  const firstWave = [0, 1, 5, 6, 2, 10, 11, 7, 3, 15], autoWave = [4, 8, 9, 12, 13, 14, 16, 17, 18, 19];
  const bloomAt = i => { const a = firstWave.indexOf(i); if (a >= 0) return .3 + a * .3; return 4.9 + autoWave.indexOf(i) * .14; };
  const ENERGY_GAIN = 37, COST = [120, 80];
  return {
    duration: 12,
    steps: [[0, '꽃 기르기'], [1.6, '에너지 수집'], [3.6, '장치 설치'], [6.5, '블루프린트']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), fr = S * .028;
      // plots
      const A = { x: 0, y: 0, w: W * .6, h: H }, B = { x: W * .6, y: 0, w: W * .4, h: H };
      c.fillStyle = '#5f9a52'; c.fillRect(0, 0, W, H);
      const rr = rnd(3); for (let i = 0; i < 70; i++) { c.fillStyle = `rgba(${rr() > .5 ? '255,255,255' : '0,40,0'},.05)`; c.beginPath(); c.arc(rr() * W, rr() * H, S * (.01 + rr() * .03), 0, TAU); c.fill(); }
      c.fillStyle = 'rgba(40,70,30,.18)'; c.fillRect(B.x, 0, B.w, H);
      c.strokeStyle = '#173022'; c.lineWidth = S * .008; c.beginPath(); c.moveTo(W * .63, 0); c.lineTo(W * .59, H * .55); c.lineTo(W * .62, H); c.moveTo(W * .59, H * .55); c.lineTo(W, H * .48); c.stroke();
      const P = (o, p) => [o.x + p.x * o.w, o.y + p.y * o.h];
      const plotA = { x: W * .02, y: H * .1, w: W * .54, h: H * .72 }, plotB = { x: W * .64, y: H * .08, w: W * .33, h: H * .38 };

      // energy bookkeeping
      let energy = 0; slots.forEach((s, i) => { const tb = bloomAt(i); energy += clamp((t - tb - .4) * 2) * ENERGY_GAIN * (1 + Math.max(0, Math.floor((t - tb) / 1.6))); });
      devices.forEach((d, i) => { if (t > d.t) energy -= COST[i]; });
      energy = Math.max(0, Math.round(energy));

      // waves: cursor (early) + emitter (after install)
      const cursorOn = t < 3.4, curP = [plotA.x + plotA.w * (.25 + .22 * Math.sin(t * 1.3)), plotA.y + plotA.h * (.35 + .2 * Math.sin(t * 2.1))];
      const ring = (x, y, k, rad, col) => { if (k <= 0 || k >= 1) return; c.strokeStyle = `rgba(${col},${.8 * (1 - k)})`; c.lineWidth = S * .005; c.beginPath(); c.arc(x, y, k * rad, 0, TAU); c.stroke(); };
      for (let w = 0; w < 6; w++) { const tw = w * .55; if (tw < 3.4) ring(plotA.x + plotA.w * (.25 + .22 * Math.sin(tw * 1.3)), plotA.y + plotA.h * (.35 + .2 * Math.sin(tw * 2.1)), seg(t, tw, tw + 1), S * .22, '255,255,235'); }
      const e0 = P(plotA, devices[0]);
      if (t > 4.5) for (let w = 0; w < 8; w++) { const tw = 4.5 + w * 1.1; ring(e0[0], e0[1], seg(t, tw, tw + 1.3), S * .32, '79,179,232'); }

      // flowers in plot A
      slots.forEach((s, i) => { const [x, y] = P(plotA, s); drawFlower(c, s.k, x, y, fr, seg(t, bloomAt(i), bloomAt(i) + .45)); });
      // energy motes
      slots.forEach((s, i) => { const tb = bloomAt(i); for (let n = 0; n < 4; n++) { const m = seg(t, tb + .2 + n * 1.6, tb + 1 + n * 1.6); if (m <= 0 || m >= 1) continue; const [x, y] = P(plotA, s); c.fillStyle = `rgba(255,226,120,${1 - m * .6})`; c.beginPath(); c.arc(lerp(x, W * .08, ease(m)), lerp(y, H * .07, ease(m)), S * .007, 0, TAU); c.fill(); } });

      // devices
      devices.forEach((d, i) => {
        const [x, y] = P(plotA, d), k = seg(t, d.t, d.t + .35), drag = seg(t, d.t - .8, d.t);
        if (drag > 0 && k <= 0) { // ghost following cursor
          const gx = lerp(W * (.32 + i * .1), x, ease(drag)), gy = lerp(H * .9, y, ease(drag));
          c.globalAlpha = .55; d.type === 'emitter' ? emitter(c, gx, gy, S * .07, t) : battery(c, gx, gy, S * .065); c.globalAlpha = 1;
        }
        if (k > 0) { c.save(); c.translate(x, y); c.scale(pop(k), pop(k)); d.type === 'emitter' ? emitter(c, 0, 0, S * .07, t) : battery(c, 0, 0, S * .065); c.restore(); }
        const f = seg(t, d.t, d.t + 1.1); if (f > 0 && f < 1) { c.font = `700 ${Math.round(S * .03)}px "DM Sans",sans-serif`; c.fillStyle = `rgba(255,120,100,${1 - f})`; c.textAlign = 'center'; c.fillText('-' + COST[i], x, y - S * .07 - f * S * .05); c.textAlign = 'start'; }
      });

      // blueprint: selection drag -> saved -> ghost copy -> built
      const sel = seg(t, 6.5, 7.4), sx = plotA.x - W * .005, sy = plotA.y - H * .02;
      if (sel > 0 && t < 8.4) {
        const w = plotA.w * ease(sel) + W * .01, h = plotA.h * ease(sel) + H * .04;
        c.fillStyle = `rgba(80,160,255,${.15 * (1 - seg(t, 8, 8.4))})`; c.fillRect(sx, sy, w, h);
        c.setLineDash([S * .012, S * .008]); c.strokeStyle = `rgba(150,205,255,${1 - seg(t, 8, 8.4)})`; c.lineWidth = S * .004; c.strokeRect(sx, sy, w, h); c.setLineDash([]);
      }
      const toast = seg(t, 7.5, 7.8) * (1 - seg(t, 9.2, 9.5));
      if (toast > 0) {
        c.globalAlpha = toast; const tw = S * .32, th = S * .06, tx = W * .42 - tw / 2, ty = H * .05;
        c.fillStyle = 'rgba(18,30,40,.92)'; c.beginPath(); c.roundRect(tx, ty, tw, th, th * .3); c.fill(); c.strokeStyle = '#8cc8ff'; c.lineWidth = 1.5; c.stroke();
        c.font = `600 ${Math.round(th * .42)}px "Noto Sans KR",sans-serif`; c.fillStyle = '#cfe8ff'; c.textBaseline = 'middle'; c.textAlign = 'center'; c.fillText('블루프린트 저장됨', W * .42, ty + th / 2 + 1); c.textAlign = 'start'; c.textBaseline = 'alphabetic'; c.globalAlpha = 1;
      }
      const ghostK = seg(t, 8, 8.7);
      if (ghostK > 0) {
        const items = [...slots.map((s, i) => ({ ...s, kind: 'f', i })), ...devices.map((d, i) => ({ ...d, kind: d.type, i: 20 + i }))];
        items.forEach((it, j) => {
          const [x, y] = P(plotB, it), sc = .62, tb = 8.8 + j * .07, built = seg(t, tb, tb + .35);
          if (built <= 0) { c.globalAlpha = .55 * ghostK; c.save(); c.translate(x, y); c.scale(sc, sc); c.fillStyle = 'rgba(120,190,255,.6)'; c.strokeStyle = '#cfe8ff'; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.strokeRect(-fr * 1.1, -fr * 1.1, fr * 2.2, fr * 2.2); c.setLineDash([]); c.restore(); c.globalAlpha = 1; return; }
          c.save(); c.translate(x, y); c.scale(sc, sc);
          if (it.kind === 'f') drawFlower(c, it.k, 0, 0, fr, built); else { c.scale(pop(built), pop(built)); it.kind === 'emitter' ? emitter(c, 0, 0, S * .07, t) : battery(c, 0, 0, S * .065); }
          c.restore();
        });
        const e1 = P(plotB, devices[0]); if (t > 10.5) for (let w = 0; w < 2; w++) ring(e1[0], e1[1], seg(t, 10.5 + w * 1.1, 11.8 + w * 1.1), S * .2, '79,179,232');
      }

      // cursor
      if (cursorOn || (t > 3.6 && t < 6)) {
        let [x, y] = curP; if (!cursorOn) { const dI = t < 4.4 ? 0 : 1, d = devices[dI], drag = seg(t, d.t - .8, d.t); const [dx, dy] = P(plotA, d); x = lerp(W * (.32 + dI * .1), dx, ease(drag)) + S * .03; y = lerp(H * .9, dy, ease(drag)) + S * .03; }
        c.fillStyle = '#fff'; c.strokeStyle = OUT; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + S * .03, y + S * .026); c.lineTo(x + S * .012, y + S * .03); c.lineTo(x, y + S * .045); c.closePath(); c.fill(); c.stroke();
      }
      if (sel > 0 && sel < 1) { const x = sx + plotA.w * ease(sel), y = sy + plotA.h * ease(sel); c.fillStyle = '#fff'; c.strokeStyle = OUT; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, y); c.lineTo(x + S * .03, y + S * .026); c.lineTo(x + S * .012, y + S * .03); c.lineTo(x, y + S * .045); c.closePath(); c.fill(); c.stroke(); }

      // HUD
      c.fillStyle = 'rgba(20,28,24,.85)'; c.beginPath(); c.roundRect(W * .02, H * .03, S * .2, S * .07, S * .015); c.fill();
      c.font = `700 ${Math.round(S * .032)}px "DM Sans",sans-serif`; c.fillStyle = '#ffe27a'; c.textBaseline = 'middle'; c.fillText('⚡ ' + energy.toLocaleString('ko-KR'), W * .035, H * .03 + S * .036); c.textBaseline = 'alphabetic';
      // toolbar
      const tbW = S * .44, tbH = S * .085, tbx = W / 2 - tbW / 2, tby = H - tbH - H * .025;
      c.fillStyle = 'rgba(20,28,24,.88)'; c.beginPath(); c.roundRect(tbx, tby, tbW, tbH, S * .012); c.fill();
      const active = t > 3.6 && t < 6 ? (t < 4.4 ? 1 : 2) : t > 6.3 && t < 8 ? 3 : -1;
      for (let i = 0; i < 4; i++) {
        const cw = tbH * .78, cx = tbx + S * .015 + i * (cw + S * .02), cy = tby + tbH * .11;
        c.fillStyle = i === active ? '#cfe6a0' : '#a9c78a'; c.strokeStyle = i === active ? '#fff' : OUT; c.lineWidth = i === active ? 2 : 1;
        c.beginPath(); c.roundRect(cx, cy, cw, cw, S * .008); c.fill(); c.stroke();
        c.save(); c.translate(cx + cw / 2, cy + cw / 2);
        if (i === 0) sunflower(c, 0, 0, cw * .26); else if (i === 1) emitter(c, 0, 0, cw * .5, t); else if (i === 2) battery(c, 0, 0, cw * .5);
        else { c.strokeStyle = '#2a6ab0'; c.lineWidth = 1.5; c.setLineDash([2, 2]); c.strokeRect(-cw * .28, -cw * .28, cw * .56, cw * .56); c.setLineDash([]); }
        c.restore();
      }
    }
  };
}

/* ================= Wordless Mage (pixel art) ================= */
function wmScene() {
  const LW = 256, LH = 160, FLOOR = 128;
  const off = document.createElement('canvas'); off.width = LW; off.height = LH; const p = off.getContext('2d');
  const R = (x, y, w, h, col) => { p.fillStyle = col; p.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };
  // static background, painted once
  const bg = document.createElement('canvas'); bg.width = LW; bg.height = LH; const b = bg.getContext('2d');
  (() => {
    const rr = rnd(5); b.fillStyle = '#26221f'; b.fillRect(0, 0, LW, LH);
    for (let y = 0; y < FLOOR; y += 6) for (let x = (y / 6 % 2) * 6 - 6; x < LW; x += 12) { b.fillStyle = rr() > .5 ? '#2c2723' : '#231f1c'; b.fillRect(x + 1, y + 1, 10, 4); }
    for (const px of [62, 150]) { b.fillStyle = '#2f4545'; b.fillRect(px, 0, 7, FLOOR); b.fillStyle = '#3e5c5a'; b.fillRect(px + 1, 0, 1, FLOOR); for (let y = 8; y < FLOOR; y += 16) { b.fillStyle = '#243535'; b.fillRect(px, y, 7, 1); } }
    // gothic window
    const wx = 22, wy = 34; b.fillStyle = '#3a312b'; b.fillRect(wx - 2, wy - 2, 22, 50); b.fillStyle = '#1d3436'; b.fillRect(wx, wy + 6, 18, 40);
    for (let i = 0; i < 9; i++) { b.fillStyle = '#1d3436'; b.fillRect(wx + i, wy + 6 - Math.round(Math.sqrt(81 - (i - 9) * (i - 9)) * .7), 18 - 2 * i, 2); }
    b.fillStyle = '#2b4a4b'; b.fillRect(wx + 8, wy + 6, 2, 40); b.fillStyle = '#3a312b'; b.fillRect(wx, wy + 26, 18, 1);
    // floor
    b.fillStyle = '#3a3f3c'; b.fillRect(0, FLOOR, LW, 3); b.fillStyle = '#4b524e'; b.fillRect(0, FLOOR, LW, 1);
    for (let x = 4; x < LW; x += 18) { b.fillStyle = '#b08a40'; b.fillRect(x, FLOOR + 1, 1, 1); }
    for (let y = FLOOR + 3; y < LH; y += 7) for (let x = (Math.floor(y / 7) % 2) * 8 - 8; x < LW; x += 16) { b.fillStyle = rr() > .5 ? '#1e2221' : '#1a1d1c'; b.fillRect(x + 1, y + 1, 14, 5); }
  })();
  const FX = 206, FY = 80, FR = 47;
  function hearts() { for (let i = 0; i < 5; i++) { const x = 5 + i * 9, y = 5; R(x + 1, y, 2, 1, '#d9413a'); R(x + 4, y, 2, 1, '#d9413a'); R(x, y + 1, 7, 2, '#d9413a'); R(x + 1, y + 3, 5, 1, '#b82f2a'); R(x + 2, y + 4, 3, 1, '#b82f2a'); R(x + 3, y + 5, 1, 1, '#8f2320'); R(x + 1, y + 1, 1, 1, '#ff8a7a'); } }
  function gearHand(cx, cy, s, col = '#b08a40') { // stop-hand magic icon in a gear
    for (let i = 0; i < 8; i++) { const a = i * TAU / 8; R(cx + Math.cos(a) * s * .9 - 1, cy + Math.sin(a) * s * .9 - 1, 2, 2, col); }
    p.fillStyle = col; p.beginPath(); p.arc(cx, cy, s * .75, 0, TAU); p.fill(); p.fillStyle = '#2b2622'; p.beginPath(); p.arc(cx, cy, s * .55, 0, TAU); p.fill();
    R(cx - 2, cy - 2, 4, 4, '#e8dcc0'); for (let i = 0; i < 4; i++) R(cx - 2 + i, cy - 4, 1, 2, '#e8dcc0'); R(cx + 2, cy - 1, 1, 2, '#e8dcc0');
  }
  function mage(x, walk, t, facing = 1) {
    x = Math.round(x); const y = FLOOR, step = walk ? Math.round(Math.sin(t * 10)) : 0;
    R(x - 3 + step, y - 5, 2, 5, '#3a3542'); R(x + 1 - step, y - 5, 2, 5, '#3a3542'); // legs
    R(x - 5, y - 17, 10, 13, '#2b2a33'); R(x - 6, y - 8, 12, 4, '#2b2a33'); R(x - 5, y - 10, 10, 1, '#5a4a3a'); // robe + belt
    R(x - 4, y - 23, 8, 7, '#2b2a33'); R(x - 2 + facing, y - 21, 3, 3, '#d8c8b0'); R(x - 1 + facing, y - 20, 1, 1, '#2b2a33'); // hood + face
    const sx = x + 6 * facing; R(sx, y - 18, 1, 18, '#7a5533'); R(sx - (facing > 0 ? 0 : 1), y - 20, 2, 2, '#a07a4a'); // staff
  }
  function robot(x, t, alert) {
    const y = FLOOR, bob = Math.round(Math.sin(t * 3)) * (alert ? 0 : 1);
    R(x - 5, y - 4, 3, 4, '#2c2f31'); R(x + 3, y - 4, 3, 4, '#2c2f31');
    p.fillStyle = '#3a3d40'; p.beginPath(); p.arc(x, y - 10 + bob, 7, 0, TAU); p.fill();
    R(x - 7, y - 10 + bob, 14, 2, '#b08a40'); R(x - 9, y - 11 + bob, 3, 5, '#2f3234'); R(x + 7, y - 11 + bob, 3, 5, '#2f3234');
    R(x - 6, y - 15 + bob, 5, 3, '#f2c84a'); R(x - 6, y - 15 + bob, 2, 1, '#fff3b0');
    R(x, y - 19 + bob, 1, 3, '#7a7f82'); R(x - 1, y - 20 + bob, 3, 1, alert ? '#ff5a4a' : '#b08a40');
  }
  return {
    duration: 12,
    steps: [[0, '로봇 반응'], [3.4, '마법 획득'], [5.8, '조준·정지'], [8.6, '통과']],
    draw(c, W, H, t) {
      p.drawImage(bg, 0, 0);
      // stone ring of the fan vent
      for (let i = 0; i < 22; i++) { const a = Math.PI + i * Math.PI / 21; const x = FX + Math.cos(a) * (FR + 4), y = FY + Math.sin(a) * (FR + 4); R(x - 4, y - 4, 8, 8, i % 2 ? '#4a4540' : '#3f3a36'); R(x - 4, y - 4, 8, 1, '#5a544e'); }
      R(FX - FR - 8, FY, 8, FLOOR - FY, '#3f3a36'); R(FX + FR, FY, 8, FLOOR - FY, '#3f3a36');
      p.fillStyle = '#141313'; p.beginPath(); p.arc(FX, FY, FR, Math.PI, 0); p.rect(FX - FR, FY, FR * 2, FLOOR - FY); p.fill();
      // fan blades
      const SP = 8, target = -Math.PI / 2, a0 = target - (SP * 7.6 + SP * .5);
      const ang = t < 7.6 ? a0 + SP * t : t < 8.6 ? a0 + SP * 7.6 + SP * ((t - 7.6) - (t - 7.6) ** 2 / 2) : target;
      const stop = seg(t, 7.6, 8.6);
      p.save(); p.beginPath(); p.rect(FX - FR, FY - FR, FR * 2, FLOOR - FY + FR); p.clip();
      if (stop < 1) { p.fillStyle = `rgba(110,118,120,${.18 * (1 - stop)})`; p.beginPath(); p.arc(FX, FY, FR - 4, 0, TAU); p.fill(); }
      for (let k = 0; k < 3; k++) { const a = ang + k * TAU / 3; p.save(); p.translate(FX, FY); p.rotate(a); p.fillStyle = stop >= 1 ? '#6f7a80' : '#5d6266'; p.beginPath(); p.moveTo(4, -3); p.lineTo(FR - 6, -6); p.lineTo(FR - 3, 0); p.lineTo(FR - 6, 5); p.lineTo(4, 3); p.closePath(); p.fill(); p.fillStyle = '#7f878b'; p.fillRect(6, -2, FR - 14, 1); p.restore(); }
      p.restore();
      p.fillStyle = '#b08a40'; p.beginPath(); p.arc(FX, FY, 5, 0, TAU); p.fill(); R(FX - 1, FY - 1, 2, 2, '#e0c070');
      if (stop > 0 && t < 10) { const k = seg(t, 8.6, 10); p.globalAlpha = 1 - k; gearHand(FX, FY - 16, 7, '#d9b96e'); p.globalAlpha = 1; }
      // wind swirls
      const wind = 1 - seg(t, 7.6, 8.2);
      if (wind > 0) for (let i = 0; i < 10; i++) {
        const y = 52 + (i * 29 % 70), sp = 70 + (i % 3) * 20, x = FX - FR + 6 - ((t * sp + i * 41) % 130);
        p.strokeStyle = `rgba(220,225,225,${.55 * wind})`; p.lineWidth = 1; p.beginPath(); p.moveTo(x + 14, y); p.lineTo(x + 4, y); p.arc(x + 4, y - 2, 2, Math.PI / 2, Math.PI * 1.5, false); p.stroke();
      }
      // mage path
      let mx; const RX = 92;
      if (t < 1.6) mx = lerp(14, 60, ease(t / 1.6));
      else if (t < 4.6) mx = 60;
      else if (t < 5.8) mx = lerp(60, 118, seg(t, 4.6, 5.8)) - Math.sin(t * 9) * 1.2;
      else if (t < 8.6) mx = 118;
      else mx = lerp(118, 272, ease(seg(t, 8.6, 11.2)));
      const walking = t < 1.6 || (t > 4.6 && t < 5.8) || (t > 8.6 && t < 11.2);
      // robot (stands on a raised block, reacts to the mage)
      R(RX - 12, FLOOR - 1, 24, 1, '#4b524e');
      const alert = t > 1.6;
      robot(RX, t, alert && t < 3.6);
      if (t > 1.6 && t < 2.1) { R(RX - 1, FLOOR - 32, 2, 6, '#f2c84a'); R(RX - 1, FLOOR - 25, 2, 2, '#f2c84a'); }
      if (t > 2.1 && t < 3.6) { // speech bubble with stop-hand sign
        const bx = RX, by = FLOOR - 36; R(bx - 12, by - 10, 24, 20, '#1d1a18'); R(bx - 12, by - 10, 24, 1, '#b08a40'); R(bx - 12, by + 9, 24, 1, '#b08a40'); R(bx - 12, by - 10, 1, 20, '#b08a40'); R(bx + 11, by - 10, 1, 20, '#b08a40'); R(bx - 1, by + 10, 3, 3, '#1d1a18');
        gearHand(bx, by, 7);
      }
      // slots (bottom-left HUD)
      for (let i = 0; i < 3; i++) { const x = 5 + i * 17, y = LH - 19, on = i === 0 && t > 4.6; R(x, y, 15, 15, on ? '#b08a40' : '#5a544e'); R(x + 1, y + 1, 13, 13, on ? '#3d6f8f' : '#242b2b'); if (on) gearHand(x + 7.5, y + 7.5, 5); }
      // icon travelling into the slot
      if (t > 3.4 && t < 4.6) { const k = ease(seg(t, 3.4, 4.6)); const x = lerp(RX, 12.5, k), y = lerp(FLOOR - 36, LH - 11.5, k) - Math.sin(k * Math.PI) * 18; gearHand(x, y, 7, '#d9b96e'); }
      mage(mx, walking, t);
      // radial wheel + aim
      const wheel = seg(t, 5.8, 6.2) * (1 - seg(t, 7.3, 7.6));
      if (wheel > 0) {
        const cx = mx, cy = FLOOR - 44, rad = 15 * wheel;
        p.fillStyle = '#b08a40'; p.beginPath(); p.arc(cx, cy, rad + 1.5, 0, TAU); p.fill();
        for (let s = 0; s < 3; s++) { p.fillStyle = s === 0 ? '#3d6f8f' : '#1f2b2b'; p.beginPath(); p.moveTo(cx, cy); p.arc(cx, cy, rad, -Math.PI / 2 + s * TAU / 3, -Math.PI / 2 + (s + 1) * TAU / 3); p.closePath(); p.fill(); }
        if (wheel > .9) gearHand(cx + 7, cy - 4, 4.5);
      }
      const aim = seg(t, 6.3, 7.0);
      if (aim > 0 && t < 7.6) { p.fillStyle = '#e8e8e8'; const x0 = mx + 6, y0 = FLOOR - 18; for (let i = 0; i < 40 * aim; i++) { const k = i / 40; if (i % 3 !== 2) p.fillRect(Math.round(lerp(x0, FX, k)), Math.round(lerp(y0, FY, k)), 1, 1); } }
      const bolt = seg(t, 7.0, 7.6); if (bolt > 0 && bolt < 1) { const x = lerp(mx + 6, FX, bolt), y = lerp(FLOOR - 18, FY, bolt); R(x - 2, y - 2, 4, 4, '#f2e6b0'); R(x - 1, y - 1, 2, 2, '#fff'); }
      if (t > 7.6 && t < 8.2) { const k = seg(t, 7.6, 8.2); p.strokeStyle = `rgba(217,185,110,${1 - k})`; p.lineWidth = 2; p.beginPath(); p.arc(FX, FY, 6 + k * 30, 0, TAU); p.stroke(); }
      hearts();
      c.imageSmoothingEnabled = false; c.drawImage(off, 0, 0, W, H);
    }
  };
}

/* ================= player ================= */
function mount(root, scene) {
  const cv = root.querySelector('canvas'), ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const marks = [...root.querySelectorAll('[data-phase]')], bar = root.querySelector('.nx-anim-bar i');
  let W = 0, H = 0, t = 0, last = 0, raf = 0, visible = false;
  const size = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint(); };
  function paint() {
    if (!W) return;
    ctx.save(); scene.draw(ctx, W, H, t); ctx.restore();
    const fade = Math.max(seg(t, scene.duration - .5, scene.duration), 1 - seg(t, 0, .35));
    if (fade > 0 && !reduce) { ctx.fillStyle = `rgba(12,18,16,${fade})`; ctx.fillRect(0, 0, W, H); }
    let cur = 0; scene.steps.forEach(([s], i) => { if (t >= s) cur = i; });
    marks.forEach((m, i) => m.classList.toggle('on', i === cur));
    if (bar) bar.style.width = (t / scene.duration * 100) + '%';
  }
  function frame(now) {
    raf = 0; if (!visible) return;
    t += Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (t > scene.duration) t = 0;
    paint(); raf = requestAnimationFrame(frame);
  }
  if (!reduce) new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf) { last = 0; raf = requestAnimationFrame(frame); } }, { threshold: .15 }).observe(cv);
  else t = scene.duration - 1.2;
  new ResizeObserver(size).observe(cv);
  size();
}
return { wopScene, wmScene, mount };
})();

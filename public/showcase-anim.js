/* Two looping canvas scenes in a simplified, diagrammatic style that matches the site.
   WoP: flowers -> energy -> devices -> blueprint -> rocket -> new planet.
   WM:  robot reacts -> defeated -> magic dropped and collected -> fan stopped -> pass. */
'use strict';
window.NXAnim = (() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const pop = k => k <= 0 ? 0 : k >= 1 ? 1 : 1 + 2.2 * Math.pow(k - 1, 3) + 1.2 * Math.pow(k - 1, 2);
const lerp = (a, b, k) => a + (b - a) * k;
const TAU = Math.PI * 2;
const FONT = '"DM Sans","Noto Sans KR",sans-serif';
const INK = '#e6eee4', MUTED = '#a1b3a4', LINE = '#304035', ACC = '#c2dc89', SUN = '#f2d27a', BLUE = '#8cc8ff', GOLD = '#d9b96e';
const a = (hex, al) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${n >> 8 & 255},${n & 255},${al})`; };
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
function label(c, txt, x, y, size, col, align = 'left') { c.font = `500 ${Math.round(size)}px ${FONT}`; c.fillStyle = col; c.textAlign = align; c.textBaseline = 'middle'; c.fillText(txt, x, y); c.textAlign = 'left'; c.textBaseline = 'alphabetic'; }
function arrowCursor(c, x, y, s) { c.fillStyle = INK; c.beginPath(); c.moveTo(x, y); c.lineTo(x + s * .7, y + s * .62); c.lineTo(x + s * .28, y + s * .68); c.lineTo(x, y + s); c.closePath(); c.fill(); }

/* ================= World of Plant ================= */
const PET = [ACC, '#e9b7c6', '#a9cce6'];
function bloom(c, x, y, r, col, k) {
  if (k <= 0) return; const g = pop(k);
  c.fillStyle = a(col, .9); for (let i = 0; i < 5; i++) { const an = i * TAU / 5 - Math.PI / 2; c.beginPath(); c.arc(x + Math.cos(an) * r * .55 * g, y + Math.sin(an) * r * .55 * g, r * .38 * g, 0, TAU); c.fill(); }
  c.fillStyle = SUN; c.beginPath(); c.arc(x, y, r * .26 * g, 0, TAU); c.fill();
}
/* emitter tower: base, mast, beacon and pulsing signal arcs */
function emitter(c, x, y, s, k, t, col = ACC) {
  if (k <= 0) return; const g = pop(k);
  c.save(); c.translate(x, y); c.scale(g, g);
  c.strokeStyle = col; c.lineWidth = 1.6; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(-s * .42, s * .5); c.lineTo(-s * .14, -s * .18); c.lineTo(s * .14, -s * .18); c.lineTo(s * .42, s * .5); c.stroke();
  c.beginPath(); c.moveTo(-s * .28, s * .18); c.lineTo(s * .28, s * .18); c.stroke();
  c.fillStyle = col; c.beginPath(); c.arc(0, -s * .34, s * .12, 0, TAU); c.fill();
  const p = .4 + .6 * (.5 + .5 * Math.sin(t * 5));
  c.strokeStyle = a(col, p); c.lineWidth = 1.3;
  for (const r of [.3, .48]) { c.beginPath(); c.arc(0, -s * .34, s * r, -2.4, -.75); c.stroke(); }
  c.restore();
}
/* battery: upright cell with a bolt */
function battery(c, x, y, s, k, col = SUN) {
  if (k <= 0) return; const g = pop(k);
  c.save(); c.translate(x, y); c.scale(g, g);
  c.strokeStyle = col; c.lineWidth = 1.6; c.lineJoin = 'round';
  c.beginPath(); c.roundRect(-s * .26, -s * .4, s * .52, s * .86, s * .1); c.stroke();
  c.fillStyle = col; c.fillRect(-s * .1, -s * .5, s * .2, s * .08);
  c.beginPath(); c.moveTo(s * .05, -s * .26); c.lineTo(-s * .12, s * .06); c.lineTo(0, s * .06); c.lineTo(-s * .05, s * .3); c.lineTo(s * .12, -s * .02); c.lineTo(0, -s * .02); c.closePath(); c.fill();
  c.restore();
}
/* rocket drawn nose-up, rotated by ang (0 = up) */
function rocket(c, x, y, ang, s, flame) {
  c.save(); c.translate(x, y); c.rotate(ang); c.lineJoin = 'round';
  if (flame > 0) { const f = s * (.35 + .25 * Math.random()) * flame; c.fillStyle = a(SUN, .9); c.beginPath(); c.moveTo(-s * .16, s * .5); c.quadraticCurveTo(0, s * .5 + f * 2, s * .16, s * .5); c.fill(); c.fillStyle = a('#ff8a5a', .9); c.beginPath(); c.moveTo(-s * .08, s * .5); c.quadraticCurveTo(0, s * .5 + f, s * .08, s * .5); c.fill(); }
  c.fillStyle = '#1b252a'; c.strokeStyle = INK; c.lineWidth = 1.5;
  // fins
  c.beginPath(); c.moveTo(-s * .2, s * .15); c.lineTo(-s * .42, s * .52); c.lineTo(-s * .2, s * .42); c.closePath(); c.fill(); c.stroke();
  c.beginPath(); c.moveTo(s * .2, s * .15); c.lineTo(s * .42, s * .52); c.lineTo(s * .2, s * .42); c.closePath(); c.fill(); c.stroke();
  // body + nose
  c.beginPath(); c.moveTo(0, -s * .62); c.quadraticCurveTo(s * .26, -s * .3, s * .2, s * .48); c.lineTo(-s * .2, s * .48); c.quadraticCurveTo(-s * .26, -s * .3, 0, -s * .62); c.closePath(); c.fill(); c.stroke();
  c.strokeStyle = BLUE; c.lineWidth = 1.4; c.beginPath(); c.arc(0, -s * .1, s * .09, 0, TAU); c.stroke();
  c.restore();
}

/* galaxy view: a spiral of planets, lit one after another outward from home */
const GAL = (() => {
  const r = rnd(21), pts = [];
  for (let tries = 0; pts.length < 64 && tries < 4000; tries++) {
    const arm = tries % 3, d = .12 + Math.pow(r(), .8) * .88, an = arm * TAU / 3 + d * 4.2 + (r() - .5) * .55;
    const x = Math.cos(an) * d, y = Math.sin(an) * d * .62, s = .55 + r() * .6;
    if (Math.hypot(x, y / .62) < .1) continue;
    if (pts.some(p => Math.hypot(p.x - x, p.y - y) < .075)) continue;
    pts.push({ x, y, s, d, kind: pts.length % 3, j: r() });
  }
  pts.forEach(p => { p.lit = 15.4 + p.d * 6.5 + p.j * .6; });
  pts.forEach(p => { let best = { x: 0, y: 0 }, bd = Math.hypot(p.x, p.y); pts.forEach(q => { if (q.lit < p.lit - 1.3) { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d < bd) { bd = d; best = q; } } }); p.src = best; });
  const dust = []; for (let i = 0; i < 420; i++) { const arm = i % 3, d = Math.pow(r(), .7), an = arm * TAU / 3 + d * 4.2 + (r() - .5) * .8; dust.push([Math.cos(an) * d, Math.sin(an) * d * .62, r()]); }
  return { pts, dust };
})();
function galaxy(c, W, H, S, t, P0, P1, LW, ORB) {
  const out = { gained: 0, pulse: 0 };
  const show = seg(t, 13.2, 15.2); if (show <= 0) return out;
  const CX = W * .6, CY = H * .56, RAD = W * 2.9;
  c.save(); c.globalAlpha = show;
  const core = c.createRadialGradient(CX, CY, 0, CX, CY, RAD * .5); core.addColorStop(0, a(ACC, .1)); core.addColorStop(1, a(ACC, 0));
  c.fillStyle = core; c.beginPath(); c.arc(CX, CY, RAD * .5, 0, TAU); c.fill();
  GAL.dust.forEach(([x, y, k]) => { c.fillStyle = a(INK, .15 + .35 * k); c.beginPath(); c.arc(CX + x * RAD, CY + y * RAD, (.5 + k) * LW, 0, TAU); c.fill(); });
  GAL.pts.forEach(p => {
    const x = CX + p.x * RAD, y = CY + p.y * RAD, r = S * .09 * p.s;
    const lit = p.lit, g = seg(t, lit, lit + 1.2);
    if (g > 0) {
      const halo = c.createRadialGradient(x, y, r * .6, x, y, r * (2.6 + .3 * Math.sin(t * 2 + p.j * 6)));
      halo.addColorStop(0, a(ACC, .45 * g)); halo.addColorStop(1, a(ACC, 0));
      c.fillStyle = halo; c.beginPath(); c.arc(x, y, r * 3, 0, TAU); c.fill();
    }
    c.fillStyle = g > 0 ? a(ACC, .2 + .5 * g) : a(MUTED, .12); c.beginPath(); c.arc(x, y, r, 0, TAU); c.fill();
    c.strokeStyle = a(g > 0 ? ACC : MUTED, .35 + .5 * g); c.lineWidth = 1.2 * LW; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    if (g > 0 && g < 1) { c.strokeStyle = a(SUN, .8 * (1 - g)); c.lineWidth = 1.4 * LW; c.beginPath(); c.arc(x, y, r * (1 + g * 2.2), 0, TAU); c.stroke(); }
  });
  // tiny rockets: each planet is reached from the nearest planet that was already running
  GAL.pts.forEach(p => {
    const k = seg(t, p.lit - 1.2, p.lit); if (k <= 0 || k >= 1) return;
    const A = [CX + p.src.x * RAD, CY + p.src.y * RAD], B = [CX + p.x * RAD, CY + p.y * RAD], u = ease(k);
    const x = lerp(A[0], B[0], u), y = lerp(A[1], B[1], u);
    for (let i = 1; i < 5; i++) { const uu = Math.max(0, u - i * .04); c.fillStyle = a(SUN, .5 * (1 - i / 5)); c.beginPath(); c.arc(lerp(A[0], B[0], uu), lerp(A[1], B[1], uu), (1.4 - i * .2) * LW, 0, TAU); c.fill(); }
    rocket(c, x, y, Math.atan2(B[0] - A[0], -(B[1] - A[1])), S * .018 * LW, 1);
  });
  // energy from every running planet flows to the store
  GAL.pts.forEach(p => {
    if (t < p.lit + .4) return;
    const x = CX + p.x * RAD, y = CY + p.y * RAD;
    for (let n = 0; n < 8; n++) {
      const t0 = p.lit + .4 + p.j * 1.5 + n * 1.6; if (t0 > t) break; const k = seg(t, t0, t0 + 1.3);
      if (k >= 1) { out.gained++; out.pulse = Math.max(out.pulse, 1 - seg(t, t0 + 1.3, t0 + 1.6)); continue; }
      const u = ease(k), mx = lerp(x, ORB.x, u) + Math.sin(u * Math.PI) * (y - ORB.y) * .15, my = lerp(y, ORB.y, u) - Math.sin(u * Math.PI) * (x - ORB.x) * .15;
      c.fillStyle = a(SUN, .95); c.beginPath(); c.arc(mx, my, 2.2 * LW, 0, TAU); c.fill();
      c.fillStyle = a(SUN, .2); c.beginPath(); c.arc(mx, my, 5.5 * LW, 0, TAU); c.fill();
    }
  });
  c.restore();
  return out;
}

function wopScene() {
  const slots = []; for (let i = 0; i < 10; i++) { const an = i * 2.399, d = .25 + .62 * Math.sqrt((i + .5) / 10); slots.push({ x: Math.cos(an) * d, y: Math.sin(an) * d, c: PET[i % 3] }); }
  const devs = [{ x: -.12, y: -.12, t: 4.2, kind: 'emitter' }, { x: .05, y: .3, t: 5.2, kind: 'battery' }];
  const bt = i => .3 + i * .28;
  // the copy on the new planet: devices first, then the emitter wave wakes the flowers by distance — same rule as home
  const COPY_DEV = 10.9, COPY_WAVE = 11.3, WAVE_SPEED = 1.15;
  const copyBloom = i => COPY_WAVE + Math.hypot(slots[i].x - devs[0].x, slots[i].y - devs[0].y) / WAVE_SPEED;
  const SPEND = [[3.5, 0, 10], [4.5, 1, 8], [6.75, 'pad', 14]]; // all rocket energy lands (by ~8.1s) before lift-off at 8.3s
  const MAX = 40;
  return {
    duration: 24,
    // positions in planet-radius units, used by scripts/test.mjs to keep devices off the flowers
    layout: { flowers: slots.map(s => ({ x: s.x * .8, y: s.y * .8 })), devices: devs.map(d => ({ x: d.x * .8, y: d.y * .8 })), flowerRadius: .12, deviceRadius: .17 },
    steps: [[0, '꽃 기르기'], [1.2, '에너지 수집'], [3.5, '장치 설치'], [6.0, '블루프린트'], [7.6, '로켓 발사'], [10.2, '같은 구조로 가동'], [13.2, '은하 전체로 확장']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), fr = S * .026;
      c.fillStyle = '#111a15'; c.fillRect(0, 0, W, H);
      c.fillStyle = a(MUTED, .1); for (let x = S * .03; x < W; x += S * .04) for (let y = S * .03; y < H; y += S * .04) c.fillRect(x, y, 1, 1);
      const P0 = { x: W * .36, y: H * .58, r: Math.min(W * .21, H * .33) }, P1 = { x: W * .83, y: H * .6, r: Math.min(W * .14, H * .23) };
      // camera: after the copy runs, pull back to the galaxy
      const Z = lerp(1, .13, ease(seg(t, 13.0, 16.0))), CX = W * .6, CY = H * .56;
      const toWorld = (x, y) => [CX + (x - CX) / Z, CY + (y - CY) / Z];
      const ORBs = { x: W * .02 + S * .06, y: H * .04 + S * .06, r: S * .05 };
      const [ox, oy] = toWorld(ORBs.x, ORBs.y), ORB = { x: ox, y: oy, r: ORBs.r / Z };
      c.save(); c.translate(CX, CY); c.scale(Z, Z); c.translate(-CX, -CY);
      const LW = 1 / Z;
      const gx = galaxy(c, W, H, S, t, P0, P1, LW, ORB);
      const at = (p, s) => [p.x + s.x * p.r * .8, p.y + s.y * p.r * .8];
      const sc = P1.r / P0.r, green = seg(t, 11.3, 12.6);
      [[P0, 1], [P1, green]].forEach(([p, g]) => { c.fillStyle = a(ACC, .03 + .05 * g); c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); c.strokeStyle = a(g > 0 ? ACC : MUTED, .3 + .3 * g); c.lineWidth = 1.2 * LW; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.stroke(); });

      // energy motes: every bloomed flower on either planet feeds the store
      const sources = [...slots.map((s, i) => ({ p: P0, s, b: bt(i) })), ...slots.map((s, i) => ({ p: P1, s, b: copyBloom(i) }))];
      let gained = 0, pulse = 0;
      sources.forEach(({ p, s, b }) => {
        const [x, y] = at(p, s);
        for (let n = 0; n < 12; n++) {
          const t0 = b + .45 + n * 1.8; if (t0 > t) break; const k = seg(t, t0, t0 + .95);
          if (k >= 1) { gained++; pulse = Math.max(pulse, 1 - seg(t, t0 + .95, t0 + 1.3)); continue; }
          const u = ease(k), cx = (x + ORB.x) / 2, cy = Math.min(y, ORB.y) + H * .05;
          const mx = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * cx + u * u * ORB.x, my = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * cy + u * u * ORB.y;
          const mf = 1 - seg(t, 13.0, 14.5); if (mf <= 0) continue;
          c.fillStyle = a(SUN, .95 * mf); c.beginPath(); c.arc(mx, my, S * .006 * LW, 0, TAU); c.fill();
          c.fillStyle = a(SUN, .18 * mf); c.beginPath(); c.arc(mx, my, S * .014 * LW, 0, TAU); c.fill();
        }
      });
      const pad = [P0.x + P0.r * .78, P0.y - P0.r * .62];
      let spent = 0;
      SPEND.forEach(([ts, target, n]) => {
        const tp = target === 'pad' ? pad : at(P0, devs[target]);
        for (let i = 0; i < n; i++) { const t0 = ts + i * .06, k = seg(t, t0, t0 + .55); if (k <= 0) continue; spent++; if (k >= 1) continue; const u = ease(k); c.fillStyle = a(SUN, .9); c.beginPath(); c.arc(lerp(ORB.x, tp[0], u), lerp(ORB.y, tp[1], u), S * .006, 0, TAU); c.fill(); }
      });
      const ring = (x, y, k, R, col) => { if (k <= 0 || k >= 1) return; c.strokeStyle = a(col, .6 * (1 - k)); c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, k * R, 0, TAU); c.stroke(); };
      // home: cursor waves, then the emitter keeps pulsing
      const cur = tt => [P0.x + P0.r * .35 * Math.sin(tt * 1.3), P0.y + P0.r * .3 * Math.sin(tt * 2.1)];
      for (let w = 0; w < 6; w++) { const tw = w * .55; if (tw < 3.0) { const [x, y] = cur(tw); ring(x, y, seg(t, tw, tw + 1), P0.r * .9, INK); } }
      const e0 = at(P0, devs[0]); if (t > 4.4) for (let w = 0; w < 10; w++) { const tw = 4.4 + w * 1.1; ring(e0[0], e0[1], seg(t, tw, tw + 1.3), P0.r * 1.1, ACC); }
      slots.forEach((s, i) => { const [x, y] = at(P0, s); bloom(c, x, y, fr, s.c, seg(t, bt(i), bt(i) + .45)); });
      devs.forEach(d => { const [x, y] = at(P0, d), k = seg(t, d.t, d.t + .35); d.kind === 'emitter' ? emitter(c, x, y, S * .06, k, t) : battery(c, x, y, S * .055, k); });
      if (t < 3.0) { const [x, y] = cur(t); arrowCursor(c, x, y, S * .035); }

      // blueprint: capture the whole layout, then fold it into the rocket
      const sel = seg(t, 6.0, 6.7), fold = seg(t, 7.0, 7.7);
      if (sel > 0 && fold < 1) {
        const half = lerp(P0.r * 1.05, S * .025, ease(fold)), cx = lerp(P0.x, pad[0], ease(fold)), cy = lerp(P0.y, pad[1], ease(fold));
        c.fillStyle = a(BLUE, .08); c.strokeStyle = BLUE; c.lineWidth = 1.4;
        c.beginPath(); c.roundRect(cx - half, cy - half, half * 2 * ease(sel), half * 2 * ease(sel), 4); c.fill(); c.stroke();
        // the captured layout travels with the frame
        c.save(); c.translate(cx, cy); const ks = half / (P0.r * 1.05); c.scale(ks, ks); c.globalAlpha = .9 * ease(sel);
        c.fillStyle = BLUE; slots.forEach(s => { c.beginPath(); c.arc(s.x * P0.r * .8, s.y * P0.r * .8, fr * .35, 0, TAU); c.fill(); });
        devs.forEach(d => { c.strokeStyle = BLUE; c.lineWidth = 2 / Math.max(ks, .2); c.strokeRect(d.x * P0.r * .8 - fr * .5, d.y * P0.r * .8 - fr * .5, fr, fr); });
        c.restore();
      }
      // rocket: appears on the pad, lifts off vertically, arcs over and lands on the new planet
      const land = [P1.x - P1.r * .45, P1.y - P1.r * .92];
      if (t > 7.5 && t < 10.6) {
        const app = seg(t, 7.5, 7.8), lift = ease(seg(t, 8.3, 8.9)), fly = ease(seg(t, 8.9, 10.2)), touch = seg(t, 10.2, 10.6);
        const L = [pad[0], pad[1] - H * .12 * lift];
        const C = [(L[0] + land[0]) / 2, Math.min(L[1], land[1]) - H * .18];
        const q = (u, i) => (1 - u) * (1 - u) * L[i] + 2 * (1 - u) * u * C[i] + u * u * land[i];
        let x = fly > 0 ? q(fly, 0) : L[0], y = fly > 0 ? q(fly, 1) : L[1];
        let ang = 0; if (fly > 0 && fly < 1) { const dx = q(Math.min(1, fly + .02), 0) - x, dy = q(Math.min(1, fly + .02), 1) - y; ang = Math.atan2(dx, -dy) * Math.sin(fly * Math.PI); }
        c.globalAlpha = 1 - touch; rocket(c, x, y - S * .03, ang, S * .06 * pop(app), t > 8.2 && t < 10.2 ? 1 : 0); c.globalAlpha = 1;
      }
      // rocket fully charged: one pulse on the pad right before lift-off
      ring(pad[0], pad[1] - S * .03, seg(t, 8.05, 8.45), S * .06, SUN);
      // new planet: identical layout, same automation rule
      if (t > 10.2) {
        ring(land[0], land[1], seg(t, 10.2, 10.8), S * .07, SUN);
        const ghost = seg(t, 10.3, 10.7);
        slots.forEach((s, i) => { const [x, y] = at(P1, s), k = seg(t, copyBloom(i), copyBloom(i) + .45); if (k <= 0) { c.strokeStyle = a(BLUE, .7 * ghost); c.lineWidth = 1; c.beginPath(); c.arc(x, y, fr * sc * .45, 0, TAU); c.stroke(); } else bloom(c, x, y, fr * sc, s.c, k); });
        const e1 = at(P1, devs[0]); if (t > COPY_WAVE) for (let w = 0; w < 4; w++) { const tw = COPY_WAVE + w * 1.1; ring(e1[0], e1[1], seg(t, tw, tw + 1.3), P1.r * 1.1, ACC); }
        devs.forEach((d, i) => { const [x, y] = at(P1, d), k = seg(t, COPY_DEV + i * .15, COPY_DEV + i * .15 + .35); if (k <= 0) { c.strokeStyle = a(BLUE, .7 * ghost); c.lineWidth = 1; c.strokeRect(x - fr * sc * .5, y - fr * sc * .5, fr * sc, fr * sc); } else d.kind === 'emitter' ? emitter(c, x, y, S * .06 * sc, k, t) : battery(c, x, y, S * .055 * sc, k); });
      }
      c.restore();
      // energy store (top-left)
      gained += gx.gained; pulse = Math.max(pulse, gx.pulse);
      const level = clamp((gained - spent) / MAX);
      c.save(); c.beginPath(); c.arc(ORBs.x, ORBs.y, ORBs.r, 0, TAU); c.clip();
      c.fillStyle = a(SUN, .08); c.fillRect(ORBs.x - ORBs.r, ORBs.y - ORBs.r, ORBs.r * 2, ORBs.r * 2);
      const top = ORBs.y + ORBs.r - level * ORBs.r * 2;
      c.fillStyle = a(SUN, .75); c.beginPath(); c.moveTo(ORBs.x - ORBs.r, ORBs.y + ORBs.r);
      for (let x = -1; x <= 1.001; x += .1) c.lineTo(ORBs.x + x * ORBs.r, top + Math.sin(x * 4 + t * 3) * ORBs.r * .06);
      c.lineTo(ORBs.x + ORBs.r, ORBs.y + ORBs.r); c.closePath(); c.fill(); c.restore();
      c.shadowColor = SUN; c.shadowBlur = 8 + 18 * level + 14 * pulse; c.strokeStyle = a(SUN, .55 + .4 * pulse); c.lineWidth = 1.5;
      c.beginPath(); c.arc(ORBs.x, ORBs.y, ORBs.r * (1 + .06 * pulse), 0, TAU); c.stroke(); c.shadowBlur = 0;

    }
  };
}

/* ================= Wordless Mage ================= */
/* in-game magic icons: stop hand, warning sign */
function handIcon(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.fillStyle = col;
  const u = s / 10;
  c.beginPath(); c.roundRect(-3.2 * u, -.6 * u, 6.4 * u, 5.4 * u, 2 * u); c.fill();
  [[-3.1, -4.2], [-1.5, -5.2], [.1, -5.0], [1.7, -4.0]].forEach(([fx, fy]) => { c.beginPath(); c.roundRect(fx * u, fy * u, 1.3 * u, (-.2 - fy) * u + 1 * u, .65 * u); c.fill(); });
  c.save(); c.translate(3 * u, 1.4 * u); c.rotate(-.7); c.beginPath(); c.roundRect(-.65 * u, -2.8 * u, 1.3 * u, 3.2 * u, .65 * u); c.fill(); c.restore();
  c.restore();
}
function warnIcon(c, x, y, s, col) {
  c.save(); c.translate(x, y); c.strokeStyle = col; c.fillStyle = col; c.lineWidth = Math.max(1.4, s * .09); c.lineJoin = 'round';
  c.beginPath(); c.moveTo(0, -s * .5); c.lineTo(s * .52, s * .42); c.lineTo(-s * .52, s * .42); c.closePath(); c.stroke();
  c.fillRect(-s * .045, -s * .18, s * .09, s * .34); c.beginPath(); c.arc(0, s * .27, s * .055, 0, TAU); c.fill();
  c.restore();
}
function wmScene() {
  const DEBRIS = [[-1, 1.1, .5], [1, 1.3, -.4], [-.6, 1.6, .9], [.7, 1.0, -.8], [.2, 1.8, .3]];
  // bubble border split into pieces: x0,y0,x1,y1 (half-size units), velocity, spin
  const SHARDS = [[-1, -1, 0, -1, -.6, -1.1, .8], [0, -1, 1, -1, .7, -1.2, -.6], [1, -1, 1, 0, 1.2, -.5, .9], [1, 0, 1, 1, 1.1, .2, -.7], [1, 1, 0, 1, .6, .6, .5], [0, 1, -1, 1, -.5, .7, -.9], [-1, 1, -1, 0, -1.2, .3, .6], [-1, 0, -1, -1, -1.1, -.6, -.5]];
  return {
    duration: 14.5,
    // story order, checked by scripts/test.mjs
    stateAt: t => ({ robotAlive: t < 2.95, defeated: t >= 2.95, drop: t >= 2.95 && t < 5.6, collected: t >= 5.6, consumed: t >= 6.75, fanStopped: t >= 9.0 }),
    steps: [[0, '로봇 반응'], [2.3, '낙하 장치'], [2.95, '마법 획득'], [6.2, '팬 정지'], [9.2, '통과']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), G = H * .82, CEIL = H * .1;
      c.fillStyle = '#10171b'; c.fillRect(0, 0, W, H);
      const IMPACT = 2.95, shake = t > IMPACT && t < IMPACT + .3 ? (1 - seg(t, IMPACT, IMPACT + .3)) * S * .006 : 0;
      c.save(); c.translate(Math.sin(t * 90) * shake, Math.cos(t * 70) * shake);
      c.fillStyle = a(MUTED, .1); for (let x = S * .03; x < W; x += S * .04) for (let y = S * .03; y < G; y += S * .04) c.fillRect(x, y, 1, 1);
      c.strokeStyle = a(GOLD, .5); c.lineWidth = 1.2; c.beginPath(); c.moveTo(-10, G); c.lineTo(W + 10, G); c.stroke();
      // fan: set into a doorway, blades sweep across the walkway itself
      const FX = W * .76, R = S * .13, FY = G - R * 1.04, DW = R * 1.32, TOP = FY - R * 1.14;
      const T0 = 8.0, SP = 8, target = -Math.PI / 2, a0 = target - (SP * T0 + SP * .5);
      const ang = t < T0 ? a0 + SP * t : t < T0 + 1 ? a0 + SP * T0 + SP * ((t - T0) - (t - T0) ** 2 / 2) : target;
      const st = seg(t, T0, T0 + 1), fcol = st >= 1 ? GOLD : MUTED, spin = 1 - seg(t, T0, T0 + .9);
      // wall above the passage (lintel), with a hazard edge and a ceiling run on both sides
      c.fillStyle = '#18222a'; c.fillRect(FX - DW, -10, DW * 2, TOP + 10);
      c.strokeStyle = a(MUTED, .45); c.lineWidth = 1;
      for (let y = CEIL * .4; y < TOP - 4; y += S * .035) { c.beginPath(); c.moveTo(FX - DW, y); c.lineTo(FX + DW, y); c.stroke(); }
      for (let y = CEIL * .4, r = 0; y < TOP - S * .035; y += S * .035, r++) for (let x = FX - DW + (r % 2 ? S * .03 : S * .06); x < FX + DW; x += S * .06) { c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + S * .035); c.stroke(); }
      c.save(); c.beginPath(); c.rect(FX - DW, TOP - S * .016, DW * 2, S * .016); c.clip();
      c.fillStyle = '#2a2414'; c.fillRect(FX - DW, TOP - S * .016, DW * 2, S * .016); c.fillStyle = a(SUN, .75);
      for (let x = FX - DW - S * .02; x < FX + DW; x += S * .028) { c.beginPath(); c.moveTo(x, TOP); c.lineTo(x + S * .014, TOP); c.lineTo(x + S * .03, TOP - S * .016); c.lineTo(x + S * .016, TOP - S * .016); c.closePath(); c.fill(); }
      c.restore();
      c.strokeStyle = a(MUTED, .7); c.lineWidth = 1.4; c.strokeRect(FX - DW, -10, DW * 2, TOP + 10);
      // floor slot under the blades
      c.fillStyle = '#0b1013'; c.fillRect(FX - R * 1.02, G, R * 2.04, S * .012);
      // housing ring hung from the lintel by a bracket
      c.strokeStyle = a(MUTED, .75); c.lineWidth = S * .008; c.beginPath(); c.moveTo(FX - R * .16, TOP); c.lineTo(FX, FY - R * .1); c.lineTo(FX + R * .16, TOP); c.stroke();
      c.strokeStyle = a(st > 0 ? GOLD : MUTED, .55 + .4 * st); c.lineWidth = 2; c.beginPath(); c.arc(FX, FY, R, 0, TAU); c.stroke();
      // spinning: blurred sweep across the whole opening
      if (spin > 0) {
        c.fillStyle = a(INK, .07 * spin); c.beginPath(); c.arc(FX, FY, R * .96, 0, TAU); c.fill();
        for (let g = 1; g <= 4; g++) for (let k = 0; k < 3; k++) { const an = ang - g * .16 + k * TAU / 3; blade(an, a(INK, .12 * spin * (1 - g / 5))); }
      }
      function blade(an, col) {
        const ca = Math.cos(an), sa = Math.sin(an), px = -sa, py = ca, r0 = R * .12, r1 = R * .94, w0 = R * .07, w1 = R * .17;
        c.fillStyle = col; c.beginPath();
        c.moveTo(FX + ca * r0 + px * w0, FY + sa * r0 + py * w0); c.lineTo(FX + ca * r1 + px * w1, FY + sa * r1 + py * w1);
        c.quadraticCurveTo(FX + ca * R * 1.0, FY + sa * R * 1.0, FX + ca * r1 - px * w1 * .4, FY + sa * r1 - py * w1 * .4);
        c.lineTo(FX + ca * r0 - px * w0, FY + sa * r0 - py * w0); c.closePath(); c.fill();
      }
      for (let k = 0; k < 3; k++) blade(ang + k * TAU / 3, st >= 1 ? GOLD : '#b9c6bb');
      c.fillStyle = '#10171b'; c.strokeStyle = fcol; c.lineWidth = 1.4; c.beginPath(); c.arc(FX, FY, R * .12, 0, TAU); c.fill(); c.stroke();
      if (t > T0 && t < 10.2) { c.globalAlpha = 1 - seg(t, 9.4, 10.2); handIcon(c, FX, FY - R * .42, S * .05, GOLD); c.globalAlpha = 1; }
      // stop-magic duration: a ring timer above the fan, running down like the in-game one
      if (t > T0 + .9) {
        const show = seg(t, T0 + .9, T0 + 1.2), left = Math.max(0, 1 - (t - (T0 + 1)) / 6.2), low = left < .3, blink = low ? (Math.sin(t * 14) > 0 ? 1 : .35) : 1;
        const col = low ? '#ff6b5a' : GOLD, rr = S * .034, cx = FX, cy = TOP - S * .016 - rr - S * .02;
        c.globalAlpha = show; c.fillStyle = '#0d1418'; c.beginPath(); c.arc(cx, cy, rr + S * .006, 0, TAU); c.fill();
        c.strokeStyle = a(MUTED, .3); c.lineWidth = S * .007; c.beginPath(); c.arc(cx, cy, rr, 0, TAU); c.stroke();
        c.strokeStyle = col; c.lineCap = 'round'; c.beginPath(); c.arc(cx, cy, rr, -Math.PI / 2, -Math.PI / 2 + TAU * left); c.stroke(); c.lineCap = 'butt';
        c.globalAlpha = show * blink; handIcon(c, cx, cy, rr * 1.05, col);
        c.globalAlpha = 1;
      }
      const wind = 1 - seg(t, T0, T0 + .5);
      if (wind > 0) for (let i = 0; i < 10; i++) { const y = FY - R * .8 + (i * 37 % 100) / 100 * R * 1.6, sp = W * (.35 + (i % 3) * .1), x = FX - R - ((t * sp + i * 97) % (W * .45)); c.strokeStyle = a(INK, .28 * wind); c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + S * .04, y); c.stroke(); }

      // drop device
      const RX = W * .44, rr = S * .032, ry = G - rr, BTN = W * .2;
      const wh = S * .07, ww = S * .08, fallK = seg(t, 2.55, IMPACT), restY = G - rr * .55 - wh;
      const bounce = t > IMPACT ? Math.max(0, Math.sin(seg(t, IMPACT, IMPACT + .28) * Math.PI)) * S * .018 : 0;
      // after the robot is gone the weight settles onto the floor
      const settle = seg(t, IMPACT + .3, IMPACT + .5), floorY = G - wh;
      const wy = (t < IMPACT ? lerp(CEIL + S * .03, restY, fallK * fallK) : lerp(restY, floorY, settle * settle)) - bounce - (settle >= 1 ? Math.max(0, Math.sin(seg(t, IMPACT + .5, IMPACT + .7) * Math.PI)) * S * .006 : 0);
      c.strokeStyle = a(MUTED, .6); c.lineWidth = 2; c.beginPath(); c.moveTo(RX - ww, CEIL); c.lineTo(RX + ww, CEIL); c.stroke();
      if (t < 2.55) { const sway = Math.sin(t * 2.2) * S * .004; c.strokeStyle = a(MUTED, .6); c.lineWidth = 1; c.beginPath(); c.moveTo(RX, CEIL); c.lineTo(RX + sway, wy); c.stroke(); }
      else if (t < 3.2) { const k = seg(t, 2.55, 3.2); c.strokeStyle = a(MUTED, .6 * (1 - k)); c.lineWidth = 1; c.beginPath(); c.moveTo(RX, CEIL); c.lineTo(RX, CEIL + S * .03 * (1 - k)); c.stroke(); }
      if (t > 2.6 && t < IMPACT) { c.strokeStyle = a(INK, .35); c.lineWidth = 1; for (const dx of [-.3, 0, .3]) { c.beginPath(); c.moveTo(RX + dx * ww, wy - S * .02); c.lineTo(RX + dx * ww, wy - S * .06); c.stroke(); } }
      c.fillStyle = '#26323a'; c.strokeStyle = INK; c.lineWidth = 1.5; c.beginPath(); c.moveTo(RX - ww * .38, wy); c.lineTo(RX + ww * .38, wy); c.lineTo(RX + ww * .5, wy + wh); c.lineTo(RX - ww * .5, wy + wh); c.closePath(); c.fill(); c.stroke();
      // impact: dust and debris
      if (t > IMPACT && t < IMPACT + .7) {
        const k = seg(t, IMPACT, IMPACT + .7);
        c.fillStyle = a(INK, .25 * (1 - k)); for (const d of [-1, 1]) for (let j = 0; j < 3; j++) { c.beginPath(); c.arc(RX + d * (ww * .5 + k * S * (.05 + j * .03)), G - S * .008 - j * S * .006 * k, S * (.006 + .01 * k), 0, TAU); c.fill(); }
        DEBRIS.forEach(([dx, up, sp]) => { const x = RX + dx * S * .14 * k, y = G - S * .01 - (up * k - 1.6 * k * k) * S * .12; c.save(); c.translate(x, y); c.rotate(sp * k * 8); c.fillStyle = a(INK, 1 - k * .6); c.fillRect(-S * .006, -S * .004, S * .012, S * .008); c.restore(); });
      }
      // wall button
      const pressed = t > 2.3 && t < 3.2, by = G - S * .12;
      c.fillStyle = '#1b252a'; c.strokeStyle = pressed ? SUN : a(MUTED, .7); c.lineWidth = 1.4; c.beginPath(); c.roundRect(BTN - S * .016, by - S * .016, S * .032, S * .032, 4); c.fill(); c.stroke();
      c.fillStyle = pressed ? SUN : a(MUTED, .7); c.beginPath(); c.arc(BTN + (pressed ? S * .003 : 0), by, S * .007, 0, TAU); c.fill();
      if (pressed) { const k = seg(t, 2.3, 2.9); c.strokeStyle = a(SUN, 1 - k); c.lineWidth = 1.2; c.beginPath(); c.arc(BTN, by, S * (.02 + k * .04), 0, TAU); c.stroke(); }
      // robot: patrols, notices the mage, gets flattened and stays as a wreck
      const flat = t < IMPACT ? 1 : lerp(1, .32, ease(seg(t, IMPACT, IMPACT + .12)));
      const patrol = t < 1.3 ? Math.sin(t * 2) * S * .012 : Math.sin(1.3 * 2) * S * .012;
      const turned = t > 1.3 ? -1 : (Math.cos(t * 2) > 0 ? 1 : -1);
      if (t < IMPACT + .35) {
      c.save(); c.translate(RX + patrol, G); c.scale(1 + (1 - flat) * .55, flat);
      c.globalAlpha = t < IMPACT ? 1 : 1 - seg(t, IMPACT + .1, IMPACT + .35);
      c.strokeStyle = INK; c.lineWidth = 1.5 / Math.max(flat, .5); c.fillStyle = '#1b252a'; c.beginPath(); c.arc(0, -rr, rr, 0, TAU); c.fill(); c.stroke();
      const eyeOn = t < IMPACT || (t < IMPACT + .4 && Math.sin(t * 60) > 0);
      if (eyeOn) { c.fillStyle = t > 1.3 ? '#ff8a7a' : SUN; c.fillRect(turned < 0 ? -rr * .75 : rr * .05, -rr * 1.35, rr * .7, rr * .22); }
      c.restore();
      }
      if (t > 1.3 && t < 2.3) { const k = seg(t, 1.3, 1.5); warnIcon(c, RX + patrol, ry - rr * 2.1 - S * .01 * (1 - k), S * .05 * pop(k), '#ff8a7a'); }
      // speech bubble: holds the stop sign until the robot is crushed, then shatters and frees it
      const BX = RX + patrol + S * .075, BY = ry - rr * 2.6, BW = S * .065;
      if (t > 1.7 && t < IMPACT) { const k = seg(t, 1.7, 1.9), bw = BW * pop(k); c.strokeStyle = GOLD; c.lineWidth = 1.4; c.fillStyle = '#10171b'; c.beginPath(); c.roundRect(BX - bw / 2, BY - bw / 2, bw, bw, 6); c.fill(); c.stroke(); c.beginPath(); c.moveTo(BX - S * .012 - bw * .2, BY + bw / 2); c.lineTo(BX - bw * .32, BY + bw / 2 + S * .012); c.lineTo(BX - bw * .05, BY + bw / 2); c.fill(); c.stroke(); handIcon(c, BX, BY, bw * .62, GOLD); }
      if (t >= IMPACT && t < IMPACT + .8) {
        const k = seg(t, IMPACT, IMPACT + .8), h = BW / 2;
        c.globalAlpha = 1 - k; c.strokeStyle = GOLD; c.lineWidth = 1.4;
        SHARDS.forEach(([x0, y0, x1, y1, vx, vy, rot]) => { const cx = BX + (x0 + x1) / 2 * h + vx * k * S * .09, cy = BY + (y0 + y1) / 2 * h + (vy * k + 1.4 * k * k) * S * .09; c.save(); c.translate(cx, cy); c.rotate(rot * k * 6); c.beginPath(); c.moveTo((x0 - x1) / 2 * h, (y0 - y1) / 2 * h); c.lineTo((x1 - x0) / 2 * h, (y1 - y0) / 2 * h); c.stroke(); c.restore(); });
        c.fillStyle = a(GOLD, .5 * (1 - k)); for (let i = 0; i < 8; i++) { const an = i * TAU / 8 + .3; c.beginPath(); c.arc(BX + Math.cos(an) * k * S * .08, BY + Math.sin(an) * k * S * .08, S * .004, 0, TAU); c.fill(); }
        c.globalAlpha = 1;
      }
      // magic slots (top-left)
      const sl = S * .05, slot0 = [W * .04 + sl / 2, H * .05 + sl / 2];
      const used = seg(t, 6.6, 6.75);
      for (let i = 0; i < 3; i++) {
        const x = W * .04 + i * (sl + S * .012), y = H * .05, on = i === 0 && t > 5.6 && t < 6.75, flash = i === 0 ? Math.max(0, 1 - Math.abs(t - 6.75) / .25) : 0;
        c.strokeStyle = on || flash > 0 ? GOLD : a(MUTED, .4); c.lineWidth = on ? 1.6 : 1; c.fillStyle = on ? a(GOLD, .12) : a(GOLD, .18 * flash);
        c.beginPath(); c.roundRect(x, y, sl, sl, 4); c.fill(); c.stroke();
        if (on) { c.globalAlpha = 1 - used; handIcon(c, x + sl / 2, y + sl / 2, sl * .62 * (1 - used * .4), GOLD); c.globalAlpha = 1; }
      }
      // the freed stop sign drifts down from where the bubble was, then goes to the slot
      if (t >= IMPACT && t < 5.6) {
        const k = ease(seg(t, IMPACT + .15, 3.9)), bob = t > 3.9 ? Math.sin(t * 5) * S * .006 : 0, spin = Math.sin(seg(t, IMPACT, 3.9) * Math.PI * 2) * .25;
        let x = BX + S * .02 * k, y = lerp(BY, G - S * .04, k) + bob;
        const fly = ease(seg(t, 5.0, 5.6)); if (fly > 0) { x = lerp(x, slot0[0], fly); y = lerp(y, slot0[1], fly) - Math.sin(fly * Math.PI) * H * .08; }
        c.save(); c.translate(x, y); c.rotate(fly > 0 ? 0 : spin); c.shadowColor = GOLD; c.shadowBlur = 12 + 10 * (1 - seg(t, IMPACT, IMPACT + .5)); handIcon(c, 0, 0, S * .042, GOLD); c.restore(); c.shadowBlur = 0;
      }
      // mage
      let mx;
      if (t < 1.4) mx = lerp(W * .05, BTN - S * .03, ease(t / 1.4));
      else if (t < 4.2) mx = BTN - S * .03;
      else if (t < 5.0) mx = lerp(BTN - S * .03, RX + S * .06, ease(seg(t, 4.2, 5.0)));
      else if (t < 6.2) mx = RX + S * .06;
      else if (t < 7.2) mx = lerp(RX + S * .06, W * .5, seg(t, 6.2, 7.2));
      else if (t < 9.2) mx = W * .5;
      else mx = lerp(W * .5, W * 1.08, ease(seg(t, 9.2, 11.8)));
      const walk = t < 1.4 || (t > 4.2 && t < 5.0) || (t > 6.2 && t < 7.2) || (t > 9.2 && t < 11.8), bob = walk ? Math.abs(Math.sin(t * 9)) * S * .004 : 0;
      const mh = S * .1, my = G - bob, tip = [mx + mh * .3, my - mh * .74];
      c.strokeStyle = INK; c.lineWidth = 1.5; c.fillStyle = '#1b252a';
      c.beginPath(); c.moveTo(mx - mh * .22, my); c.lineTo(mx, my - mh * .78); c.lineTo(mx + mh * .22, my); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(mx, my - mh * .86, mh * .12, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(tip[0], my); c.lineTo(tip[0], tip[1]); c.stroke();
      c.fillStyle = (t > 7.3 && t < 7.5) ? '#fff' : GOLD; c.beginPath(); c.arc(tip[0], tip[1], mh * .05, 0, TAU); c.fill();
      // the stop magic leaves its slot and is consumed into the staff
      const use = seg(t, 6.6, 7.0);
      if (use > 0 && use < 1) {
        const u = ease(use), x = lerp(slot0[0], tip[0], u), y = lerp(slot0[1], tip[1], u) - Math.sin(u * Math.PI) * H * .1;
        for (let i = 1; i < 6; i++) { const uu = Math.max(0, u - i * .05); c.fillStyle = a(GOLD, .4 * (1 - i / 6)); c.beginPath(); c.arc(lerp(slot0[0], tip[0], uu), lerp(slot0[1], tip[1], uu) - Math.sin(uu * Math.PI) * H * .1, S * .006, 0, TAU); c.fill(); }
        c.shadowColor = GOLD; c.shadowBlur = 14; handIcon(c, x, y, S * .036 * (1 - u * .5), GOLD); c.shadowBlur = 0;
      }
      // cast: magic circle at the staff, gathering sparks, a glowing projectile with a trail, burst on the fan
      const circ = seg(t, 6.9, 7.1) * (1 - seg(t, 7.5, 7.8));
      if (circ > 0) {
        const cr = S * .05 * ease(circ);
        c.save(); c.translate(tip[0], tip[1]); c.globalAlpha = circ;
        c.strokeStyle = GOLD; c.lineWidth = 1.3; c.beginPath(); c.arc(0, 0, cr, 0, TAU); c.stroke();
        c.rotate(t * 2.5); c.strokeStyle = a(GOLD, .7); c.lineWidth = 1; c.beginPath(); c.arc(0, 0, cr * .68, 0, TAU); c.stroke();
        for (let i = 0; i < 6; i++) { c.rotate(TAU / 6); c.beginPath(); c.moveTo(cr * .68, 0); c.lineTo(cr, 0); c.stroke(); }
        c.restore();
        for (let i = 0; i < 10; i++) { const k = (t * 1.6 + i / 10) % 1, an = i * 2.4; c.fillStyle = a(GOLD, (1 - k) * circ); c.beginPath(); c.arc(tip[0] + Math.cos(an) * S * .09 * (1 - k), tip[1] + Math.sin(an) * S * .09 * (1 - k), S * .004, 0, TAU); c.fill(); }
        c.globalAlpha = circ; c.shadowColor = GOLD; c.shadowBlur = 18; c.fillStyle = '#fff6d8'; c.beginPath(); c.arc(tip[0], tip[1], S * .008, 0, TAU); c.fill(); c.shadowBlur = 0; c.globalAlpha = 1;
      }
      const bo = seg(t, 7.4, 8.0);
      if (bo > 0 && bo < 1) {
        const P = u => [lerp(tip[0], FX, u), lerp(tip[1], FY, u) - Math.sin(u * Math.PI) * S * .04];
        for (let i = 1; i < 9; i++) { const [x, y] = P(Math.max(0, ease(bo) - i * .025)); c.fillStyle = a(GOLD, .55 * (1 - i / 9)); c.beginPath(); c.arc(x, y, S * (.012 - i * .001), 0, TAU); c.fill(); }
        const [x, y] = P(ease(bo)); c.shadowColor = GOLD; c.shadowBlur = 20; handIcon(c, x, y, S * .032, GOLD); c.shadowBlur = 0;
      }
      if (t > T0 && t < T0 + .8) {
        const k = seg(t, T0, T0 + .8);
        c.fillStyle = a('#fff6d8', .5 * (1 - k) * (1 - k)); c.beginPath(); c.arc(FX, FY, R * .35 * (1 + k), 0, TAU); c.fill();
        c.strokeStyle = a(GOLD, 1 - k); c.lineWidth = 1.5; c.beginPath(); c.arc(FX, FY, R * (.15 + k * .9), 0, TAU); c.stroke();
        c.strokeStyle = a(GOLD, .8 * (1 - k)); c.lineWidth = 1.2; for (let i = 0; i < 10; i++) { const an = i * TAU / 10 + .2; c.beginPath(); c.moveTo(FX + Math.cos(an) * R * (.2 + k * .5), FY + Math.sin(an) * R * (.2 + k * .5)); c.lineTo(FX + Math.cos(an) * R * (.3 + k * .75), FY + Math.sin(an) * R * (.3 + k * .75)); c.stroke(); }
      }
      c.restore();
    }
  };
}

/* ================= player ================= */
function mount(root, scene) {
  if (!root) return () => {};
  const cv = root.querySelector('canvas'), ctx = cv.getContext('2d');
  const marks = [...root.querySelectorAll('[data-phase]')], bar = root.querySelector('.nx-anim-bar i');
  let W = 0, H = 0, t = 0, last = 0, raf = 0, visible = false, alive = true;
  const size = () => { const dpr = Math.min(3, Math.max(2, devicePixelRatio || 1)), r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); ctx.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0); paint(); };
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
    raf = 0; if (!visible || !alive) return;
    t += Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (t > scene.duration) t = 0;
    paint(); raf = requestAnimationFrame(frame);
  }
  const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !raf && !reduce) { last = 0; raf = requestAnimationFrame(frame); } }, { threshold: .15 });
  io.observe(cv);
  if (reduce) t = scene.duration - 1.6;
  const ro = new ResizeObserver(size); ro.observe(cv);
  size();
  return () => { alive = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
}
return { wopScene, wmScene, mount };
})();

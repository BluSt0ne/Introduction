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
function device(c, x, y, s, k, col = ACC) {
  if (k <= 0) return; const g = pop(k);
  c.strokeStyle = col; c.lineWidth = 1.6; c.fillStyle = a(col, .12);
  c.beginPath(); c.roundRect(x - s * g / 2, y - s * g / 2, s * g, s * g, s * .22 * g); c.fill(); c.stroke();
  c.fillStyle = col; c.beginPath(); c.arc(x, y, s * .14 * g, 0, TAU); c.fill();
}
function rocket(c, x, y, ang, s) {
  c.save(); c.translate(x, y); c.rotate(ang);
  c.fillStyle = INK; c.beginPath(); c.moveTo(s, 0); c.quadraticCurveTo(s * .2, -s * .42, -s * .6, -s * .3); c.lineTo(-s * .6, s * .3); c.quadraticCurveTo(s * .2, s * .42, s, 0); c.fill();
  c.fillStyle = BLUE; c.beginPath(); c.roundRect(-s * .35, -s * .16, s * .5, s * .32, 2); c.fill();
  c.restore();
}
function wopScene() {
  const slots = []; for (let i = 0; i < 10; i++) { const an = i * 2.399, d = .25 + .62 * Math.sqrt((i + .5) / 10); slots.push({ x: Math.cos(an) * d, y: Math.sin(an) * d, c: PET[i % 3] }); }
  const devs = [{ x: -.15, y: .12, t: 4.2 }, { x: .32, y: -.28, t: 5.2 }];
  const bt = i => .3 + i * .28, bt2 = i => 10.4 + i * .12;
  const SPEND = [[3.5, devs[0], 10], [4.5, devs[1], 8], [7.6, null, 16]];
  const MAX = 40;
  return {
    duration: 13.5,
    steps: [[0, '꽃 기르기'], [1.2, '에너지 수집'], [3.5, '장치 설치'], [6.0, '블루프린트'], [7.6, '로켓 발사'], [10.0, '새 행성']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), fr = S * .026;
      c.fillStyle = '#111a15'; c.fillRect(0, 0, W, H);
      c.fillStyle = a(MUTED, .1); for (let x = S * .03; x < W; x += S * .04) for (let y = S * .03; y < H; y += S * .04) c.fillRect(x, y, 1, 1);
      const P0 = { x: W * .27, y: H * .56, r: Math.min(W * .21, H * .34) }, P1 = { x: W * .82, y: H * .62, r: Math.min(W * .12, H * .2) };
      const ORB = { x: W * .58, y: H * .22, r: S * .055 };
      const at = (p, s) => [p.x + s.x * p.r * .8, p.y + s.y * p.r * .8];
      const green = seg(t, 10.0, 11.2);
      [[P0, 1], [P1, green]].forEach(([p, g]) => { c.fillStyle = a(ACC, .03 + .05 * g); c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.fill(); c.strokeStyle = a(g > 0 ? ACC : MUTED, .3 + .3 * g); c.lineWidth = 1.2; c.beginPath(); c.arc(p.x, p.y, p.r, 0, TAU); c.stroke(); });

      // energy motes: flower -> orb
      const sources = [...slots.map((s, i) => ({ p: P0, s, b: bt(i) })), ...slots.slice(0, 7).map((s, i) => ({ p: P1, s, b: bt2(i), small: 1 }))];
      let gained = 0, pulse = 0;
      sources.forEach(({ p, s, b }) => {
        const [x, y] = at(p, s);
        for (let n = 0; n < 12; n++) {
          const t0 = b + .45 + n * 1.8, k = seg(t, t0, t0 + .95); if (t0 > t) break;
          if (k >= 1) { gained++; pulse = Math.max(pulse, 1 - seg(t, t0 + .95, t0 + 1.3)); continue; }
          const u = ease(k), cx = (x + ORB.x) / 2, cy = Math.min(y, ORB.y) - H * .1;
          const mx = (1 - u) * (1 - u) * x + 2 * (1 - u) * u * cx + u * u * ORB.x, my = (1 - u) * (1 - u) * y + 2 * (1 - u) * u * cy + u * u * ORB.y;
          c.fillStyle = a(SUN, .95); c.beginPath(); c.arc(mx, my, S * .006, 0, TAU); c.fill();
          c.fillStyle = a(SUN, .18); c.beginPath(); c.arc(mx, my, S * .014, 0, TAU); c.fill();
        }
      });
      // spending: orb -> device / rocket
      const pad = [P0.x + P0.r * .72, P0.y - P0.r * .72];
      let spent = 0;
      SPEND.forEach(([ts, d, n]) => {
        const target = d ? at(P0, d) : pad;
        for (let i = 0; i < n; i++) {
          const t0 = ts + i * .06, k = seg(t, t0, t0 + .55); if (k <= 0) continue; spent++; if (k >= 1) continue;
          const u = ease(k); c.fillStyle = a(SUN, .9); c.beginPath(); c.arc(lerp(ORB.x, target[0], u), lerp(ORB.y, target[1], u), S * .006, 0, TAU); c.fill();
        }
      });
      // orb
      const level = clamp((gained - spent) / MAX);
      c.save(); c.beginPath(); c.arc(ORB.x, ORB.y, ORB.r, 0, TAU); c.clip();
      c.fillStyle = a(SUN, .08); c.fillRect(ORB.x - ORB.r, ORB.y - ORB.r, ORB.r * 2, ORB.r * 2);
      const top = ORB.y + ORB.r - level * ORB.r * 2, wave = Math.sin(t * 3) * ORB.r * .06;
      c.fillStyle = a(SUN, .75); c.beginPath(); c.moveTo(ORB.x - ORB.r, ORB.y + ORB.r);
      for (let x = -1; x <= 1.001; x += .1) c.lineTo(ORB.x + x * ORB.r, top + Math.sin(x * 4 + t * 3) * ORB.r * .05 + wave * x);
      c.lineTo(ORB.x + ORB.r, ORB.y + ORB.r); c.closePath(); c.fill(); c.restore();
      c.shadowColor = SUN; c.shadowBlur = 8 + 18 * level + 14 * pulse; c.strokeStyle = a(SUN, .55 + .4 * pulse); c.lineWidth = 1.5;
      c.beginPath(); c.arc(ORB.x, ORB.y, ORB.r * (1 + .06 * pulse), 0, TAU); c.stroke(); c.shadowBlur = 0;

      // waves
      const ring = (x, y, k, R, col) => { if (k <= 0 || k >= 1) return; c.strokeStyle = a(col, .6 * (1 - k)); c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, k * R, 0, TAU); c.stroke(); };
      const cur = tt => [P0.x + P0.r * .35 * Math.sin(tt * 1.3), P0.y + P0.r * .3 * Math.sin(tt * 2.1)];
      for (let w = 0; w < 6; w++) { const tw = w * .55; if (tw < 3.0) { const [x, y] = cur(tw); ring(x, y, seg(t, tw, tw + 1), P0.r * .9, INK); } }
      const e0 = at(P0, devs[0]); if (t > 4.4) for (let w = 0; w < 9; w++) { const tw = 4.4 + w * 1.1; ring(e0[0], e0[1], seg(t, tw, tw + 1.3), P0.r * 1.1, ACC); }
      // flowers + devices
      slots.forEach((s, i) => { const [x, y] = at(P0, s); bloom(c, x, y, fr, s.c, seg(t, bt(i), bt(i) + .45)); });
      devs.forEach(d => { const [x, y] = at(P0, d); device(c, x, y, S * .05, seg(t, d.t, d.t + .35)); });
      if (t < 3.0) { const [x, y] = cur(t); arrowCursor(c, x, y, S * .035); }
      // blueprint: square sweep -> folds into a card on the pad
      const sel = seg(t, 6.0, 6.7), fold = seg(t, 7.0, 7.6), card = S * .06;
      if (sel > 0 && t < 7.8) {
        const half = lerp(P0.r * 1.05, card / 2, ease(fold)), cx = lerp(P0.x, pad[0], ease(fold)), cy = lerp(P0.y, pad[1], ease(fold));
        c.fillStyle = a(BLUE, .08); c.strokeStyle = BLUE; c.lineWidth = 1.4;
        c.beginPath(); c.roundRect(cx - half, cy - half, half * 2 * ease(sel), half * 2 * ease(sel), 4); c.fill(); c.stroke();
      }
      // rocket: waits on pad, flies to the new planet
      if (t > 7.6 && t < 10.0) {
        const A = pad, B = [P1.x - P1.r * .7, P1.y - P1.r * .7], C = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - H * .05];
        const u = ease(seg(t, 8.3, 10.0)), q = (u, i) => (1 - u) * (1 - u) * A[i] + 2 * (1 - u) * u * C[i] + u * u * B[i];
        const x = q(u, 0), y = q(u, 1), ang = u > 0 ? Math.atan2(q(Math.min(1, u + .02), 1) - y, q(Math.min(1, u + .02), 0) - x) : -Math.PI / 4;
        for (let i = 1; i < 8 && u > 0; i++) { const uu = Math.max(0, u - i * .016); c.fillStyle = a(SUN, .45 * (1 - i / 8)); c.beginPath(); c.arc(q(uu, 0), q(uu, 1), 2.2 - i * .2, 0, TAU); c.fill(); }
        rocket(c, x, y, ang, S * .035);
      }
      // new planet
      if (t > 10.0) {
        ring(P1.x - P1.r * .7, P1.y - P1.r * .7, seg(t, 10.0, 10.6), S * .07, SUN);
        slots.slice(0, 7).forEach((s, i) => { const [x, y] = at(P1, s), k = seg(t, bt2(i), bt2(i) + .4); if (k <= 0) { c.strokeStyle = a(BLUE, .7); c.lineWidth = 1; c.beginPath(); c.arc(x, y, fr * .4, 0, TAU); c.stroke(); } else bloom(c, x, y, fr * .6, s.c, k); });
        devs.forEach((d, i) => { const [x, y] = at(P1, d); device(c, x, y, S * .03, seg(t, 11.3 + i * .2, 11.7 + i * .2)); });
      }
    }
  };
}

/* ================= Wordless Mage ================= */
function stopIcon(c, x, y, s, col) { c.fillStyle = col; c.fillRect(x - s * .32, y - s * .38, s * .22, s * .76); c.fillRect(x + s * .1, y - s * .38, s * .22, s * .76); }
function wmScene() {
  return {
    duration: 14.5,
    steps: [[0, '로봇 반응'], [2.6, '처치'], [4.0, '마법 획득'], [6.4, '팬 정지'], [9.6, '통과']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), G = H * .8;
      c.fillStyle = '#10171b'; c.fillRect(0, 0, W, H);
      c.fillStyle = a(MUTED, .1); for (let x = S * .03; x < W; x += S * .04) for (let y = S * .03; y < G; y += S * .04) c.fillRect(x, y, 1, 1);
      c.strokeStyle = a(GOLD, .5); c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, G); c.lineTo(W, G); c.stroke();
      const sl = S * .05, slot0 = [W * .05 + sl / 2, H * .07 + sl / 2];
      for (let i = 0; i < 3; i++) { const x = W * .05 + i * (sl + S * .012), y = H * .07, on = i === 0 && t > 6.0; c.strokeStyle = on ? GOLD : a(MUTED, .4); c.lineWidth = on ? 1.6 : 1; c.fillStyle = on ? a(GOLD, .12) : 'transparent'; c.beginPath(); c.roundRect(x, y, sl, sl, 4); c.fill(); c.stroke(); if (on) stopIcon(c, x + sl / 2, y + sl / 2, sl * .5, GOLD); }
      // fan
      const FX = W * .75, R = Math.min((G - H * .08) / 2 * .95, W * .2), FY = G - R - H * .02;
      const T0 = 8.6, SP = 8, target = -Math.PI / 2, a0 = target - (SP * T0 + SP * .5);
      const ang = t < T0 ? a0 + SP * t : t < T0 + 1 ? a0 + SP * T0 + SP * ((t - T0) - (t - T0) ** 2 / 2) : target;
      const st = seg(t, T0, T0 + 1), fcol = st >= 1 ? GOLD : MUTED;
      c.strokeStyle = a(st > 0 ? GOLD : MUTED, .5 + .4 * st); c.lineWidth = 1.4; c.beginPath(); c.arc(FX, FY, R, 0, TAU); c.stroke();
      c.strokeStyle = fcol; c.lineWidth = S * .012; c.lineCap = 'round';
      for (let k = 0; k < 3; k++) { const an = ang + k * TAU / 3; c.beginPath(); c.moveTo(FX + Math.cos(an) * R * .14, FY + Math.sin(an) * R * .14); c.lineTo(FX + Math.cos(an) * R * .88, FY + Math.sin(an) * R * .88); c.stroke(); }
      c.lineCap = 'butt'; c.fillStyle = '#10171b'; c.strokeStyle = fcol; c.lineWidth = 1.4; c.beginPath(); c.arc(FX, FY, R * .1, 0, TAU); c.fill(); c.stroke();
      const wind = 1 - seg(t, T0, T0 + .5);
      if (wind > 0) for (let i = 0; i < 12; i++) { const y = FY - R * .8 + (i * 37 % 100) / 100 * R * 1.6, sp = W * (.35 + (i % 3) * .1), x = FX - R - ((t * sp + i * 97) % (W * .5)); c.strokeStyle = a(INK, .3 * wind); c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + S * .04, y); c.stroke(); }
      // robot: react -> defeated -> drops magic
      const RX = W * .38, rr = S * .032, ry = G - rr, down = ease(seg(t, 3.3, 3.9));
      if (down < 1) {
        c.save(); c.globalAlpha = 1 - down * .75; c.translate(RX, ry + down * rr * .4); c.rotate(down * 1.2);
        c.strokeStyle = INK; c.lineWidth = 1.5; c.fillStyle = '#1b252a'; c.beginPath(); c.arc(0, 0, rr, 0, TAU); c.fill(); c.stroke();
        const alert = t > 1.6; c.fillStyle = alert ? '#ff8a7a' : SUN; c.fillRect(-rr * .7, -rr * .35, rr * .7, rr * .22);
        c.restore();
      } else { c.strokeStyle = a(INK, .3); c.lineWidth = 1.5; c.beginPath(); c.arc(RX, ry + rr * .4, rr, Math.PI, TAU); c.stroke(); }
      if (t > 1.5 && t < 2.3) { const k = seg(t, 1.5, 2.3); c.strokeStyle = a('#ff8a7a', 1 - k); c.lineWidth = 1.4; c.beginPath(); c.arc(RX, ry, rr * (1.2 + k * 1.4), 0, TAU); c.stroke(); }
      if (t > 2.0 && t < 3.0) { const bx = RX, by = ry - rr * 2.6, bw = S * .07; c.strokeStyle = GOLD; c.lineWidth = 1.4; c.fillStyle = '#10171b'; c.beginPath(); c.roundRect(bx - bw / 2, by - bw / 2, bw, bw, 6); c.fill(); c.stroke(); stopIcon(c, bx, by, bw * .5, GOLD); }
      // dropped magic: falls, bobs, then flies to slot
      let drop = null;
      if (t > 3.9 && t < 6.0) {
        const fall = ease(seg(t, 3.9, 4.4)), bob = Math.sin(t * 5) * S * .006;
        let x = RX + rr * 1.6, y = lerp(ry - rr, G - S * .04, fall) + (fall >= 1 ? bob : 0);
        const fly = ease(seg(t, 5.3, 6.0)); if (fly > 0) { x = lerp(x, slot0[0], fly); y = lerp(y, slot0[1], fly) - Math.sin(fly * Math.PI) * H * .08; }
        drop = [x, y]; c.shadowColor = GOLD; c.shadowBlur = 12; stopIcon(c, x, y, S * .035, GOLD); c.shadowBlur = 0;
      }
      // mage
      let mx;
      if (t < 1.6) mx = lerp(W * .06, W * .2, ease(t / 1.6));
      else if (t < 4.4) mx = W * .2;
      else if (t < 5.3) mx = lerp(W * .2, RX + rr * .4, ease(seg(t, 4.4, 5.3)));
      else if (t < 6.4) mx = RX + rr * .4;
      else if (t < 7.4) mx = lerp(RX + rr * .4, W * .5, seg(t, 6.4, 7.4));
      else if (t < 9.6) mx = W * .5;
      else mx = lerp(W * .5, W * 1.08, ease(seg(t, 9.6, 12.4)));
      const walk = t < 1.6 || (t > 4.4 && t < 5.3) || (t > 6.4 && t < 7.4) || (t > 9.6 && t < 12.4), bob = walk ? Math.abs(Math.sin(t * 9)) * S * .004 : 0;
      const mh = S * .1, my = G - bob, tip = [mx + mh * .3, my - mh * .74];
      c.strokeStyle = INK; c.lineWidth = 1.5; c.fillStyle = '#1b252a';
      c.beginPath(); c.moveTo(mx - mh * .22, my); c.lineTo(mx, my - mh * .78); c.lineTo(mx + mh * .22, my); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(mx, my - mh * .86, mh * .12, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(tip[0], my); c.lineTo(tip[0], tip[1]); c.stroke();
      const flash = (t > 2.6 && t < 2.8) || (t > 8.0 && t < 8.2);
      c.fillStyle = flash ? '#fff' : GOLD; c.beginPath(); c.arc(tip[0], tip[1], mh * .05, 0, TAU); c.fill();
      // attack on robot
      const atk = seg(t, 2.7, 3.3); if (atk > 0 && atk < 1) { c.fillStyle = INK; c.shadowColor = INK; c.shadowBlur = 10; c.beginPath(); c.arc(lerp(tip[0], RX, atk), lerp(tip[1], ry, atk), S * .009, 0, TAU); c.fill(); c.shadowBlur = 0; }
      if (t > 3.3 && t < 3.8) { const k = seg(t, 3.3, 3.8); c.strokeStyle = a(INK, 1 - k); c.lineWidth = 1.2; c.beginPath(); c.arc(RX, ry, rr * (1 + k * 1.5), 0, TAU); c.stroke(); }
      // aim + cast on fan
      const aim = seg(t, 7.4, 8.0);
      const bo = seg(t, 8.1, 8.6); if (bo > 0 && bo < 1) { c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; c.beginPath(); c.arc(lerp(tip[0], FX, bo), lerp(tip[1], FY, bo), S * .01, 0, TAU); c.fill(); c.shadowBlur = 0; }
      if (t > T0 && t < T0 + .7) { const k = seg(t, T0, T0 + .7); c.strokeStyle = a(GOLD, 1 - k); c.lineWidth = 1.5; c.beginPath(); c.arc(FX, FY, R * (.15 + k * .9), 0, TAU); c.stroke(); }
    }
  };
}

/* ================= player ================= */
function mount(root, scene) {
  if (!root) return () => {};
  const cv = root.querySelector('canvas'), ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const marks = [...root.querySelectorAll('[data-phase]')], bar = root.querySelector('.nx-anim-bar i');
  let W = 0, H = 0, t = 0, last = 0, raf = 0, visible = false, alive = true;
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

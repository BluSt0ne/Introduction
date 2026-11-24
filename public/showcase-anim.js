/* Two looping canvas scenes in a simplified, diagrammatic style that matches the site.
   WoP: cursor wave grows flowers -> energy -> devices -> blueprint copied to the next area.
   WM:  robot reacts with a stop signal -> signal becomes magic -> fan stops -> pass. */
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
function wopScene() {
  const r = rnd(9), slots = [];
  for (let gy = 0; gy < 4; gy++) for (let gx = 0; gx < 5; gx++) slots.push({ x: .1 + gx * .2 + (r() - .5) * .06, y: .12 + gy * .25 + (r() - .5) * .06, c: PET[(gx + gy) % 3] });
  const devs = [{ x: .4, y: .5, t: 4.3 }, { x: .2, y: .25, t: 5.3 }];
  const first = [0, 1, 5, 6, 2, 10, 11, 7, 3, 15], auto = [4, 8, 9, 12, 13, 14, 16, 17, 18, 19];
  const bt = i => { const p = first.indexOf(i); return p >= 0 ? .3 + p * .3 : 4.8 + auto.indexOf(i) * .14; };
  return {
    duration: 12,
    steps: [[0, '꽃 기르기'], [1.6, '에너지 수집'], [3.6, '장치 설치'], [6.5, '블루프린트']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), fr = S * .024;
      c.fillStyle = '#111a15'; c.fillRect(0, 0, W, H);
      c.fillStyle = a(MUTED, .12); for (let x = S * .03; x < W; x += S * .04) for (let y = S * .03; y < H; y += S * .04) c.fillRect(x, y, 1, 1);
      const A = { x: W * .05, y: H * .2, w: W * .5, h: H * .66 }, B = { x: W * .66, y: H * .2, w: W * .29, h: H * .38 };
      const P = (o, p) => [o.x + p.x * o.w, o.y + p.y * o.h];
      c.strokeStyle = LINE; c.lineWidth = 1; c.setLineDash([2, 4]); c.strokeRect(A.x - S * .02, A.y - S * .03, A.w + S * .04, A.h + S * .06); c.strokeRect(B.x - S * .02, B.y - S * .03, B.w + S * .04, B.h + S * .06); c.setLineDash([]);
      label(c, 'AREA 01', A.x - S * .02, A.y - S * .06, S * .02, MUTED); label(c, 'AREA 02', B.x - S * .02, B.y - S * .06, S * .02, MUTED);
      // energy
      let en = 0; slots.forEach((s, i) => { const b = bt(i); if (t > b + .4) en += 30 * (1 + Math.floor((t - b - .4) / 1.5)); }); devs.forEach((d, i) => { if (t > d.t) en -= [120, 80][i]; });
      label(c, Math.max(0, en).toLocaleString('ko-KR'), W * .95, H * .07, S * .03, SUN, 'right'); label(c, 'ENERGY', W * .95 - S * .14, H * .07, S * .018, MUTED, 'right');
      const ring = (x, y, k, R, col) => { if (k <= 0 || k >= 1) return; c.strokeStyle = a(col, .7 * (1 - k)); c.lineWidth = 1.2; c.beginPath(); c.arc(x, y, k * R, 0, TAU); c.stroke(); };
      const cur = tt => [A.x + A.w * (.28 + .2 * Math.sin(tt * 1.3)), A.y + A.h * (.35 + .2 * Math.sin(tt * 2.1))];
      for (let w = 0; w < 6; w++) { const tw = w * .55; if (tw < 3.4) { const [x, y] = cur(tw); ring(x, y, seg(t, tw, tw + 1), S * .2, INK); } }
      const e0 = P(A, devs[0]); if (t > 4.4) for (let w = 0; w < 8; w++) { const tw = 4.4 + w * 1.1; ring(e0[0], e0[1], seg(t, tw, tw + 1.3), S * .3, ACC); }
      slots.forEach((s, i) => { const [x, y] = P(A, s); if (t < bt(i)) { c.fillStyle = a(MUTED, .35); c.beginPath(); c.arc(x, y, 1.6, 0, TAU); c.fill(); } bloom(c, x, y, fr, s.c, seg(t, bt(i), bt(i) + .45)); });
      slots.forEach((s, i) => { for (let n = 0; n < 4; n++) { const b = bt(i) + .2 + n * 1.5, m = seg(t, b, b + .9); if (m <= 0 || m >= 1) continue; const [x, y] = P(A, s); c.fillStyle = a(SUN, 1 - m * .5); c.beginPath(); c.arc(lerp(x, W * .95 - S * .05, ease(m)), lerp(y, H * .07, ease(m)), 1.8, 0, TAU); c.fill(); } });
      devs.forEach((d, i) => { const [x, y] = P(A, d), k = seg(t, d.t, d.t + .35); device(c, x, y, S * .05, k); const f = seg(t, d.t, d.t + 1); if (f > 0 && f < 1) label(c, '−' + [120, 80][i], x, y - S * .05 - f * S * .03, S * .022, a('#ff8a7a', 1 - f), 'center'); });
      // cursor
      if (t < 3.4) { const [x, y] = cur(t); arrowCursor(c, x, y, S * .035); }
      else if (t < 5.6) { const i = t < 4.3 ? 0 : 1, d = devs[i], k = ease(seg(t, d.t - .7, d.t)); const [dx, dy] = P(A, d); arrowCursor(c, lerp(W * .3, dx, k) + S * .02, lerp(H * .95, dy, k) + S * .02, S * .035); }
      // blueprint
      const sel = seg(t, 6.5, 7.3), fade = 1 - seg(t, 8, 8.4);
      if (sel > 0 && fade > 0) {
        const x0 = A.x - S * .02, y0 = A.y - S * .03, w = (A.w + S * .04) * ease(sel), h = (A.h + S * .06) * ease(sel);
        c.fillStyle = a(BLUE, .08 * fade); c.fillRect(x0, y0, w, h); c.strokeStyle = a(BLUE, fade); c.lineWidth = 1.4; c.setLineDash([5, 4]); c.strokeRect(x0, y0, w, h); c.setLineDash([]);
        if (sel < 1) arrowCursor(c, x0 + w, y0 + h, S * .035);
      }
      const tag = seg(t, 7.4, 7.7) * (1 - seg(t, 9.6, 10));
      if (tag > 0) { const x = B.x + B.w / 2, y = B.y + B.h + S * .09, tw = S * .2, th = S * .045; c.globalAlpha = tag; c.strokeStyle = BLUE; c.lineWidth = 1; c.beginPath(); c.roundRect(x - tw / 2, y - th / 2, tw, th, th / 2); c.stroke(); label(c, 'BLUEPRINT SAVED', x, y + 1, S * .017, BLUE, 'center'); c.globalAlpha = 1; }
      const gk = seg(t, 8, 8.6);
      if (gk > 0) {
        const items = [...slots.map(s => ({ ...s, f: 1 })), ...devs.map(d => ({ ...d, f: 0 }))];
        // travelling copy
        if (gk < 1) { c.strokeStyle = a(BLUE, .8); c.setLineDash([4, 4]); c.lineWidth = 1.2; const x = lerp(A.x, B.x, ease(gk)), y = lerp(A.y, B.y, ease(gk)), w = lerp(A.w, B.w, ease(gk)), h = lerp(A.h, B.h, ease(gk)); c.strokeRect(x, y, w, h); c.setLineDash([]); }
        else items.forEach((it, j) => {
          const [x, y] = P(B, it), tb = 8.7 + j * .07, k = seg(t, tb, tb + .35);
          if (k <= 0) { c.strokeStyle = a(BLUE, .7); c.lineWidth = 1; c.beginPath(); c.arc(x, y, fr * .55, 0, TAU); c.stroke(); return; }
          it.f ? bloom(c, x, y, fr * .58, it.c, k) : device(c, x, y, S * .03, k);
        });
        const e1 = P(B, devs[0]); if (t > 10.3) for (let w = 0; w < 2; w++) ring(e1[0], e1[1], seg(t, 10.3 + w * 1, 11.6 + w * 1), S * .17, ACC);
      }
    }
  };
}

/* ================= Wordless Mage ================= */
function stopIcon(c, x, y, s, col) { c.fillStyle = col; c.fillRect(x - s * .32, y - s * .38, s * .22, s * .76); c.fillRect(x + s * .1, y - s * .38, s * .22, s * .76); }
function wmScene() {
  return {
    duration: 12,
    steps: [[0, '로봇 반응'], [3.4, '마법 획득'], [5.8, '조준·정지'], [8.6, '통과']],
    draw(c, W, H, t) {
      const S = Math.min(W, H * 1.6), G = H * .8;
      c.fillStyle = '#10171b'; c.fillRect(0, 0, W, H);
      c.fillStyle = a(MUTED, .1); for (let x = S * .03; x < W; x += S * .04) for (let y = S * .03; y < G; y += S * .04) c.fillRect(x, y, 1, 1);
      c.strokeStyle = a(GOLD, .5); c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, G); c.lineTo(W, G); c.stroke();
      // slots
      const sl = S * .05;
      for (let i = 0; i < 3; i++) { const x = W * .05 + i * (sl + S * .012), y = H * .07, on = i === 0 && t > 4.6; c.strokeStyle = on ? GOLD : a(MUTED, .4); c.lineWidth = on ? 1.6 : 1; c.fillStyle = on ? a(GOLD, .12) : 'transparent'; c.beginPath(); c.roundRect(x, y, sl, sl, 4); c.fill(); c.stroke(); if (on) stopIcon(c, x + sl / 2, y + sl / 2, sl * .5, GOLD); }
      label(c, 'MAGIC', W * .05 + 3 * (sl + S * .012) + S * .01, H * .07 + sl / 2, S * .018, MUTED);
      // fan
      const FX = W * .72, R = (G - H * .08) / 2 * .95, FY = G - R - H * .02;
      const SP = 8, target = -Math.PI / 2, a0 = target - (SP * 7.6 + SP * .5);
      const ang = t < 7.6 ? a0 + SP * t : t < 8.6 ? a0 + SP * 7.6 + SP * ((t - 7.6) - (t - 7.6) ** 2 / 2) : target;
      const st = seg(t, 7.6, 8.6), fcol = st >= 1 ? GOLD : MUTED;
      c.strokeStyle = a(st > 0 ? GOLD : MUTED, .5 + .4 * st); c.lineWidth = 1.4; c.beginPath(); c.arc(FX, FY, R, 0, TAU); c.stroke();
      if (st < 1) { c.fillStyle = a(MUTED, .06 * (1 - st)); c.beginPath(); c.arc(FX, FY, R, 0, TAU); c.fill(); }
      c.strokeStyle = fcol; c.lineWidth = S * .012; c.lineCap = 'round';
      for (let k = 0; k < 3; k++) { const an = ang + k * TAU / 3; c.beginPath(); c.moveTo(FX + Math.cos(an) * R * .14, FY + Math.sin(an) * R * .14); c.lineTo(FX + Math.cos(an) * R * .88, FY + Math.sin(an) * R * .88); c.stroke(); }
      c.lineCap = 'butt'; c.fillStyle = '#10171b'; c.strokeStyle = fcol; c.lineWidth = 1.4; c.beginPath(); c.arc(FX, FY, R * .1, 0, TAU); c.fill(); c.stroke();
      label(c, st >= 1 ? 'FAN · STOPPED' : 'FAN', FX, FY - R - S * .03, S * .018, st >= 1 ? GOLD : MUTED, 'center');
      // wind
      const wind = 1 - seg(t, 7.6, 8.1);
      if (wind > 0) for (let i = 0; i < 12; i++) { const y = FY - R * .8 + (i * 37 % 100) / 100 * R * 1.6, sp = W * (.35 + (i % 3) * .1), x = FX - R - ((t * sp + i * 97) % (W * .55)); c.strokeStyle = a(INK, .35 * wind); c.lineWidth = 1; c.beginPath(); c.moveTo(x, y); c.lineTo(x + S * .04, y); c.stroke(); }
      // robot
      const RX = W * .34, rr = S * .032, ry = G - rr;
      c.strokeStyle = INK; c.lineWidth = 1.5; c.fillStyle = '#1b252a'; c.beginPath(); c.arc(RX, ry, rr, 0, TAU); c.fill(); c.stroke();
      const alert = t > 1.6 && t < 3.6; c.fillStyle = alert ? '#ff8a7a' : SUN; c.fillRect(RX - rr * .7, ry - rr * .35, rr * .7, rr * .22);
      label(c, 'ROBOT', RX, G + S * .03, S * .016, MUTED, 'center');
      if (t > 1.6 && t < 2.1) label(c, '!', RX, ry - rr * 2.2, S * .045, SUN, 'center');
      if (t > 2.1 && t < 3.5) { const bx = RX, by = ry - rr * 2.6, bw = S * .07; c.strokeStyle = GOLD; c.lineWidth = 1.4; c.fillStyle = '#10171b'; c.beginPath(); c.roundRect(bx - bw / 2, by - bw / 2, bw, bw, 6); c.fill(); c.stroke(); c.beginPath(); c.moveTo(bx - 4, by + bw / 2); c.lineTo(bx, by + bw / 2 + 6); c.lineTo(bx + 4, by + bw / 2); c.fill(); c.stroke(); stopIcon(c, bx, by, bw * .5, GOLD); }
      if (t > 3.4 && t < 4.6) { const k = ease(seg(t, 3.4, 4.6)); const x = lerp(RX, W * .05 + sl / 2, k), y = lerp(ry - rr * 2.6, H * .07 + sl / 2, k) - Math.sin(k * Math.PI) * H * .08; c.shadowColor = GOLD; c.shadowBlur = 12; stopIcon(c, x, y, S * .04, GOLD); c.shadowBlur = 0; }
      // mage path
      let mx; if (t < 1.6) mx = lerp(W * .06, W * .2, ease(t / 1.6)); else if (t < 4.6) mx = W * .2; else if (t < 5.8) mx = lerp(W * .2, W * .46, seg(t, 4.6, 5.8)); else if (t < 8.6) mx = W * .46; else mx = lerp(W * .46, W * 1.06, ease(seg(t, 8.6, 11.2)));
      const walk = t < 1.6 || (t > 4.6 && t < 5.8) || (t > 8.6 && t < 11.2), bob = walk ? Math.abs(Math.sin(t * 9)) * S * .004 : 0;
      const mh = S * .1, my = G - bob;
      c.strokeStyle = INK; c.lineWidth = 1.5; c.fillStyle = '#1b252a';
      c.beginPath(); c.moveTo(mx - mh * .22, my); c.lineTo(mx, my - mh * .78); c.lineTo(mx + mh * .22, my); c.closePath(); c.fill(); c.stroke();
      c.beginPath(); c.arc(mx, my - mh * .86, mh * .12, 0, TAU); c.fill(); c.stroke();
      c.beginPath(); c.moveTo(mx + mh * .3, my); c.lineTo(mx + mh * .3, my - mh * .7); c.stroke();
      c.fillStyle = (t > 6.9 && t < 7.2) ? '#fff' : GOLD; c.beginPath(); c.arc(mx + mh * .3, my - mh * .74, mh * .05, 0, TAU); c.fill();
      // aim + bolt
      const aim = seg(t, 6.0, 6.8);
      if (aim > 0 && t < 7.6) { c.strokeStyle = a(INK, .8); c.lineWidth = 1; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(mx + mh * .3, my - mh * .74); c.lineTo(lerp(mx + mh * .3, FX, aim), lerp(my - mh * .74, FY, aim)); c.stroke(); c.setLineDash([]); }
      const bo = seg(t, 7.0, 7.6); if (bo > 0 && bo < 1) { c.fillStyle = GOLD; c.shadowColor = GOLD; c.shadowBlur = 14; c.beginPath(); c.arc(lerp(mx + mh * .3, FX, bo), lerp(my - mh * .74, FY, bo), S * .01, 0, TAU); c.fill(); c.shadowBlur = 0; }
      if (t > 7.6 && t < 8.3) { const k = seg(t, 7.6, 8.3); c.strokeStyle = a(GOLD, 1 - k); c.lineWidth = 1.5; c.beginPath(); c.arc(FX, FY, R * (.15 + k * .9), 0, TAU); c.stroke(); }
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

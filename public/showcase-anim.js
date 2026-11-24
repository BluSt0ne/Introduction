/* Two looping canvas scenes for the overview page.
   WoP: grow flowers -> save blueprint -> launch rocket -> spread to other planets.
   WM:  defeat robot -> take its word as magic -> stop the giant fan -> walk through. */
'use strict';
window.NXAnim = (() => {
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (t, a, b) => clamp((t - a) / (b - a));
const ease = k => k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
const lerp = (a, b, k) => a + (b - a) * k;
const rgb = (h, k = 1) => { const n = parseInt(h.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255]; };
const mixc = (a, b, k) => { const A = rgb(a), B = rgb(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], k))).join(',')})`; };
function rnd(seed) { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; }
const TAU = Math.PI * 2;

function flower(ctx, x, y, r, col, k, t) {
  if (k <= 0) return;
  const g = ease(clamp(k)), R = r * g, sw = Math.sin(t * 1.6 + x) * r * .12;
  ctx.strokeStyle = 'rgba(70,120,60,.9)'; ctx.lineWidth = Math.max(1, r * .18);
  ctx.beginPath(); ctx.moveTo(x, y + r * 1.1 * g); ctx.lineTo(x + sw, y); ctx.stroke();
  ctx.fillStyle = col;
  for (let p = 0; p < 5; p++) { const a = p * TAU / 5 + t * .3; ctx.beginPath(); ctx.arc(x + sw + Math.cos(a) * R * .55, y + Math.sin(a) * R * .55, R * .42, 0, TAU); ctx.fill(); }
  ctx.fillStyle = '#fff4c8'; ctx.beginPath(); ctx.arc(x + sw, y, R * .28, 0, TAU); ctx.fill();
}

/* ---------------- World of Plant ---------------- */
const FCOL = ['#c2dc89', '#f2d27a', '#e99bb4', '#9fd3e6'];
function wopScene() {
  const r = rnd(7), stars = Array.from({ length: 90 }, () => [r(), r(), r() * 1.2 + .3, r() * TAU]);
  // flower slots on a disc, in polar coords (unit radius)
  const slots = []; for (let i = 0; i < 16; i++) { const a = i * 2.399, d = .25 + .62 * Math.sqrt((i + .5) / 16); slots.push([Math.cos(a) * d, Math.sin(a) * d * .9, FCOL[i % 4]]); }
  return {
    duration: 13.5,
    steps: [[0, '꽃 키우기'], [3.6, '블루프린트 저장'], [6, '로켓 발사'], [8.4, '다른 행성으로']],
    draw(ctx, W, H, t) {
      const M = Math.min(W, H * 1.6);
      // sky
      const bg = ctx.createRadialGradient(W * .3, H * .6, 0, W * .3, H * .6, W);
      bg.addColorStop(0, '#1b3326'); bg.addColorStop(1, '#0c1612'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      for (const [x, y, s, p] of stars) { ctx.fillStyle = `rgba(230,238,228,${.25 + .35 * Math.sin(t * 1.3 + p) ** 2})`; ctx.beginPath(); ctx.arc(x * W, y * H, s, 0, TAU); ctx.fill(); }

      const P = [
        { x: W * .27, y: H * .6, r: M * .17, from: '#3f7d4a', to: '#3f7d4a', t0: 0 },
        { x: W * .66, y: H * .3, r: M * .095, from: '#6b5a50', to: '#3f7d4a', t0: 8.6 },
        { x: W * .86, y: H * .72, r: M * .075, from: '#5a5560', to: '#3f7d4a', t0: 10.9 }
      ];
      // routes
      ctx.setLineDash([3, 6]); ctx.lineWidth = 1;
      [[0, 1, 6.2], [1, 2, 9.6]].forEach(([a, b, t0]) => { const k = seg(t, t0, t0 + .6); if (!k) return; ctx.strokeStyle = `rgba(194,220,137,${.35 * k})`; ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.quadraticCurveTo((P[a].x + P[b].x) / 2, Math.min(P[a].y, P[b].y) - H * .15, P[b].x, P[b].y); ctx.stroke(); });
      ctx.setLineDash([]);

      // planets
      P.forEach((p, i) => {
        const green = i === 0 ? 1 : seg(t, p.t0 + .3, p.t0 + 1.6);
        ctx.save(); ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, TAU); ctx.clip();
        ctx.fillStyle = mixc(p.from, p.to, green); ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
        ctx.strokeStyle = 'rgba(255,255,255,.06)'; ctx.lineWidth = 1;
        const step = p.r / 4; for (let g = -p.r; g <= p.r; g += step) { ctx.beginPath(); ctx.moveTo(p.x + g, p.y - p.r); ctx.lineTo(p.x + g, p.y + p.r); ctx.moveTo(p.x - p.r, p.y + g); ctx.lineTo(p.x + p.r, p.y + g); ctx.stroke(); }
        const sh = ctx.createRadialGradient(p.x - p.r * .4, p.y - p.r * .45, p.r * .1, p.x, p.y, p.r * 1.05);
        sh.addColorStop(0, 'rgba(255,255,240,.18)'); sh.addColorStop(.7, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,0,.45)');
        ctx.fillStyle = sh; ctx.fillRect(p.x - p.r, p.y - p.r, p.r * 2, p.r * 2); ctx.restore();
        ctx.strokeStyle = `rgba(194,220,137,${.25 + .35 * green})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r + 3, 0, TAU); ctx.stroke();
      });

      // home planet: cursor waves wake flowers
      const H0 = P[0], fr = H0.r * .13;
      const cur = t < 3.6 ? [H0.x + Math.cos(t * 1.7) * H0.r * .45, H0.y + Math.sin(t * 2.3) * H0.r * .35] : null;
      if (cur) {
        for (let w = 0; w < 6; w++) { const tw = w * .6, k = seg(t, tw, tw + 1.1); if (k > 0 && k < 1) { ctx.strokeStyle = `rgba(194,220,137,${.7 * (1 - k)})`; ctx.lineWidth = 1.3; ctx.beginPath(); ctx.arc(H0.x + Math.cos(tw * 1.7) * H0.r * .45, H0.y + Math.sin(tw * 2.3) * H0.r * .35, k * H0.r * .9, 0, TAU); ctx.stroke(); } }
      }
      let bloomed = 0;
      slots.forEach(([sx, sy, c], i) => {
        const tb = .3 + i * .19, k = seg(t, tb, tb + .5); if (k > 0) bloomed++;
        const x = H0.x + sx * H0.r, y = H0.y + sy * H0.r;
        if (k <= 0) { ctx.fillStyle = 'rgba(30,50,30,.6)'; ctx.beginPath(); ctx.arc(x, y, 1.6, 0, TAU); ctx.fill(); }
        flower(ctx, x, y, fr, c, k, t);
        // energy mote
        const m = seg(t, tb + .2, tb + 1.1); if (m > 0 && m < 1) { ctx.fillStyle = `rgba(242,210,122,${1 - m})`; ctx.beginPath(); ctx.arc(lerp(x, W * .06, ease(m)), lerp(y, H * .1, ease(m)), 2.2, 0, TAU); ctx.fill(); }
      });
      if (cur) { ctx.fillStyle = '#e6eee4'; ctx.strokeStyle = '#0c1612'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(cur[0], cur[1]); ctx.lineTo(cur[0] + 10, cur[1] + 9); ctx.lineTo(cur[0] + 4, cur[1] + 10); ctx.lineTo(cur[0], cur[1] + 15); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      // energy readout
      ctx.font = `600 ${Math.round(M * .028)}px "DM Sans","Noto Sans KR",sans-serif`; ctx.fillStyle = '#f2d27a'; ctx.textBaseline = 'top';
      ctx.fillText('⚡ ' + Math.round(bloomed * 37 * (1 + seg(t, 8.6, 12) * 2)).toLocaleString('ko-KR'), W * .04, H * .06);

      // blueprint: scan + card
      const scan = seg(t, 3.6, 4.6);
      if (scan > 0 && scan < 1) { const sx = H0.x - H0.r + scan * H0.r * 2; ctx.strokeStyle = 'rgba(120,190,255,.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx, H0.y - H0.r); ctx.lineTo(sx, H0.y + H0.r); ctx.stroke(); }
      if (t > 3.6 && t < 7) {
        ctx.strokeStyle = `rgba(120,190,255,${.7 * (1 - seg(t, 6.2, 7))})`; ctx.lineWidth = 1; ctx.setLineDash([3, 3]);
        slots.forEach(([sx, sy], i) => { if (H0.x + sx * H0.r < H0.x - H0.r + scan * H0.r * 2) ctx.strokeRect(H0.x + sx * H0.r - fr * 1.2, H0.y + sy * H0.r - fr * 1.2, fr * 2.4, fr * 2.4); });
        ctx.setLineDash([]);
      }
      const card = { w: M * .2, h: M * .14 };
      const cIn = seg(t, 4.5, 5.2), cOut = seg(t, 6.0, 6.5);
      const launch = [H0.x + H0.r * .72, H0.y - H0.r * .72];
      if (cIn > 0 && cOut < 1) {
        const cx = lerp(lerp(H0.x, W * .43, ease(cIn)), launch[0], ease(cOut)), cy = lerp(lerp(H0.y, H * .17, ease(cIn)), launch[1], ease(cOut));
        const s = lerp(lerp(.2, 1, ease(cIn)), .15, ease(cOut));
        ctx.save(); ctx.translate(cx, cy); ctx.scale(s, s);
        ctx.fillStyle = '#1d4a7a'; ctx.strokeStyle = '#8cc8ff'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.roundRect(-card.w / 2, -card.h / 2, card.w, card.h, 6); ctx.fill(); ctx.stroke();
        ctx.strokeStyle = 'rgba(140,200,255,.25)'; ctx.lineWidth = 1;
        for (let g = -card.w / 2 + 8; g < card.w / 2; g += 8) { ctx.beginPath(); ctx.moveTo(g, -card.h / 2); ctx.lineTo(g, card.h / 2); ctx.stroke(); }
        for (let g = -card.h / 2 + 8; g < card.h / 2; g += 8) { ctx.beginPath(); ctx.moveTo(-card.w / 2, g); ctx.lineTo(card.w / 2, g); ctx.stroke(); }
        ctx.fillStyle = '#cfe8ff'; slots.forEach(([sx, sy]) => { ctx.beginPath(); ctx.arc(sx * card.w * .38, sy * card.h * .4 + 4, 2, 0, TAU); ctx.fill(); });
        ctx.font = `700 ${Math.round(card.h * .13)}px "DM Sans",sans-serif`; ctx.fillStyle = '#8cc8ff'; ctx.fillText('BLUEPRINT', -card.w / 2 + 7, -card.h / 2 + 5);
        ctx.restore();
      }

      // rockets
      const rocket = (a, b, t0, t1) => {
        const k = seg(t, t0, t1); if (k <= 0 || k >= 1) return;
        const A = a === 0 ? launch : [P[a].x + P[a].r * .6, P[a].y + P[a].r * .6], B = [P[b].x - P[b].r * .5, P[b].y + (b === 1 ? P[b].r * .6 : -P[b].r * .6)];
        const C = [(A[0] + B[0]) / 2, Math.min(A[1], B[1]) - H * .15], u = ease(k);
        const q = (u, i) => (1 - u) * (1 - u) * A[i] + 2 * (1 - u) * u * C[i] + u * u * B[i];
        const x = q(u, 0), y = q(u, 1), dx = q(Math.min(1, u + .02), 0) - x, dy = q(Math.min(1, u + .02), 1) - y, ang = Math.atan2(dy, dx);
        for (let i = 1; i < 14; i++) { const uu = Math.max(0, u - i * .012); ctx.fillStyle = `rgba(255,${150 + i * 6},80,${.5 * (1 - i / 14)})`; ctx.beginPath(); ctx.arc(q(uu, 0), q(uu, 1), 3.2 - i * .18, 0, TAU); ctx.fill(); }
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang); const L = M * .045;
        ctx.fillStyle = '#e6eee4'; ctx.beginPath(); ctx.moveTo(L * .6, 0); ctx.quadraticCurveTo(L * .1, -L * .28, -L * .45, -L * .2); ctx.lineTo(-L * .45, L * .2); ctx.quadraticCurveTo(L * .1, L * .28, L * .6, 0); ctx.fill();
        ctx.fillStyle = '#e99bb4'; ctx.beginPath(); ctx.moveTo(-L * .3, -L * .2); ctx.lineTo(-L * .6, -L * .38); ctx.lineTo(-L * .45, 0); ctx.lineTo(-L * .6, L * .38); ctx.lineTo(-L * .3, L * .2); ctx.fill();
        ctx.fillStyle = '#5c9bd6'; ctx.beginPath(); ctx.arc(L * .12, 0, L * .1, 0, TAU); ctx.fill(); ctx.restore();
      };
      rocket(0, 1, 6.3, 8.5); rocket(1, 2, 9.6, 10.9);

      // spreading on other planets
      [[1, 8.5], [2, 10.9]].forEach(([pi, t0]) => {
        const p = P[pi], puff = seg(t, t0, t0 + .6);
        if (puff > 0 && puff < 1) { ctx.strokeStyle = `rgba(242,210,122,${1 - puff})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (.3 + puff * 1.1), 0, TAU); ctx.stroke(); }
        const n = pi === 1 ? 10 : 8;
        for (let i = 0; i < n; i++) {
          const [sx, sy, c] = slots[i], x = p.x + sx * p.r, y = p.y + sy * p.r, tb = t0 + .4 + i * .12;
          const ghost = seg(t, t0 + .2, t0 + .5); if (ghost > 0 && t < tb + .4) { ctx.strokeStyle = `rgba(120,190,255,${.7 * ghost})`; ctx.setLineDash([2, 2]); ctx.strokeRect(x - p.r * .09, y - p.r * .09, p.r * .18, p.r * .18); ctx.setLineDash([]); }
          flower(ctx, x, y, p.r * .1, c, seg(t, tb, tb + .5), t);
        }
      });
    }
  };
}

/* ---------------- Wordless Mage ---------------- */
function wmScene() {
  const GOLD = '#d9b96e';
  return {
    duration: 12.4,
    steps: [[0, '로봇 쓰러뜨리기'], [2.6, '대사를 마법으로'], [4.4, '팬 멈추기'], [8.0, '지나가기']],
    draw(ctx, W, H, t) {
      const g = H * .8, M = H;
      const bg = ctx.createRadialGradient(W * .8, 0, 0, W * .8, 0, W);
      bg.addColorStop(0, '#1d3439'); bg.addColorStop(1, '#0d1417'); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
      // back wall bricks
      ctx.strokeStyle = 'rgba(217,185,110,.06)'; ctx.lineWidth = 1;
      for (let y = H * .14, row = 0; y < g; y += H * .08, row++) for (let x = (row % 2) * W * .04; x < W; x += W * .08) ctx.strokeRect(x, y, W * .08, H * .08);
      // ceiling + floor
      ctx.fillStyle = '#1a2327'; ctx.fillRect(0, 0, W, H * .12); ctx.fillRect(0, g, W, H - g);
      ctx.strokeStyle = 'rgba(217,185,110,.35)'; ctx.beginPath(); ctx.moveTo(0, H * .12); ctx.lineTo(W, H * .12); ctx.moveTo(0, g); ctx.lineTo(W, g); ctx.stroke();

      // door
      const dX = W * .935, dW = W * .055, dH = H * .3, open = seg(t, 10.2, 10.8);
      ctx.fillStyle = '#121a1d'; ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(dX - dW / 2, g); ctx.lineTo(dX - dW / 2, g - dH + dW / 2); ctx.arc(dX, g - dH + dW / 2, dW / 2, Math.PI, 0); ctx.lineTo(dX + dW / 2, g); ctx.closePath(); ctx.fill(); ctx.stroke();
      if (open > 0) { ctx.fillStyle = `rgba(242,220,150,${.75 * open})`; ctx.fill(); }

      // fan
      const R = H * .34, fx = W * .655, fy = g - R - H * .01;
      const SP = 9, target = -Math.PI / 2, a0 = target - (SP * 7 + SP * .5);
      const ang = t < 7 ? a0 + SP * t : t < 8 ? a0 + SP * 7 + SP * ((t - 7) - (t - 7) ** 2 / 2) : target;
      const frozen = seg(t, 7, 8);
      ctx.strokeStyle = '#3c4a4f'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(fx, H * .12); ctx.lineTo(fx, fy - R * .15); ctx.stroke();
      ctx.strokeStyle = frozen ? mixc('#55656b', GOLD, frozen) : '#55656b'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, R + 5, 0, TAU); ctx.stroke();
      if (t < 7.6) { // motion blur disc
        ctx.fillStyle = `rgba(160,180,185,${.12 * (1 - frozen)})`; ctx.beginPath(); ctx.arc(fx, fy, R, 0, TAU); ctx.fill();
      }
      for (let b = 0; b < 3; b++) {
        const a = ang + b * TAU / 3;
        ctx.save(); ctx.translate(fx, fy); ctx.rotate(a);
        ctx.fillStyle = mixc('#7c8a8f', '#c9b27a', frozen); ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(R * .12, -R * .05); ctx.quadraticCurveTo(R * .6, -R * .2, R * .98, -R * .1); ctx.quadraticCurveTo(R * 1.02, R * .02, R * .95, R * .08); ctx.quadraticCurveTo(R * .5, R * .1, R * .12, R * .05); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.restore();
      }
      ctx.fillStyle = '#2a3438'; ctx.beginPath(); ctx.arc(fx, fy, R * .14, 0, TAU); ctx.fill(); ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.stroke();
      if (frozen) { // clock ring
        ctx.strokeStyle = `rgba(217,185,110,${.8 * frozen})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(fx, fy, R * .22, -Math.PI / 2, -Math.PI / 2 + TAU * frozen); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy - R * .16); ctx.moveTo(fx, fy); ctx.lineTo(fx + R * .1, fy); ctx.stroke();
      }
      // wind
      const wind = 1 - seg(t, 7, 7.5);
      if (wind > 0) for (let i = 0; i < 16; i++) {
        const y = H * .2 + (i * 37 % 100) / 100 * (g - H * .24), sp = W * (.5 + (i % 4) * .12), x = fx - R * .6 - ((t * sp + i * 97) % (W * .55));
        ctx.strokeStyle = `rgba(180,210,215,${.35 * wind})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + W * .05, y); ctx.stroke();
      }

      // robot
      const rx = W * .36, fall = ease(seg(t, 2.0, 2.6)), hit = t > 1.4 && t < 2.0 ? Math.sin(t * 60) * 3 : 0;
      ctx.save(); ctx.translate(rx + hit + H * .045, g); ctx.rotate(fall * 1.45); ctx.translate(-H * .045, 0);
      const rh = H * .17, rw = H * .09, flash = t > 1.4 && t < 2 && Math.sin(t * 40) > 0;
      ctx.fillStyle = flash ? '#f2e6c8' : '#7d878c'; ctx.fillRect(0, -rh * .55, rw, rh * .55);
      ctx.fillStyle = flash ? '#fff' : '#959fa4'; ctx.fillRect(rw * .1, -rh, rw * .8, rh * .4);
      ctx.fillStyle = fall > .5 ? '#3a3a3a' : '#ff6b5a'; ctx.beginPath(); ctx.arc(rw * .5, -rh * .8, rw * .1, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#959fa4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(rw * .5, -rh); ctx.lineTo(rw * .5, -rh * 1.15); ctx.stroke();
      ctx.fillStyle = '#d9b96e'; ctx.beginPath(); ctx.arc(rw * .5, -rh * 1.17, 2.5, 0, TAU); ctx.fill();
      ctx.restore();
      if (t > 2.2 && t < 3) for (let i = 0; i < 8; i++) { const k = seg(t, 2.2, 3), a = i * .8; ctx.fillStyle = `rgba(255,200,120,${1 - k})`; ctx.beginPath(); ctx.arc(rx + H * .1 + Math.cos(a) * k * H * .12, g - H * .05 - Math.abs(Math.sin(a)) * k * H * .14, 2, 0, TAU); ctx.fill(); }

      // speech bubble -> word -> slot
      const fs = Math.round(H * .055);
      ctx.font = `700 ${fs}px "Noto Sans KR",sans-serif`; ctx.textBaseline = 'middle'; ctx.textAlign = 'center';
      const slot = [W * .06, H * .06];
      if (t < 2.4) {
        const bx = rx + H * .05, by = g - H * .3;
        ctx.fillStyle = '#e8dfc8'; ctx.beginPath(); ctx.roundRect(bx - H * .1, by - H * .05, H * .2, H * .1, 8); ctx.fill();
        ctx.beginPath(); ctx.moveTo(bx - 5, by + H * .05); ctx.lineTo(bx, by + H * .08); ctx.lineTo(bx + 5, by + H * .05); ctx.fill();
        ctx.fillStyle = '#1a2327'; ctx.fillText('멈춰!', bx, by + 1);
      } else if (t < 4.2) {
        const k = ease(seg(t, 2.6, 4.0)), sx = rx + H * .05, sy = g - H * .3;
        const x = lerp(sx, slot[0] + H * .04, k), y = lerp(sy, slot[1] + H * .04, k) - Math.sin(k * Math.PI) * H * .12;
        ctx.shadowColor = GOLD; ctx.shadowBlur = 16; ctx.fillStyle = GOLD; ctx.fillText('멈춰', x, y); ctx.shadowBlur = 0;
      }
      // slots UI
      for (let i = 0; i < 3; i++) {
        const x = slot[0] + i * H * .1, y = slot[1], s = H * .08, on = i === 0 && t > 4.0;
        ctx.fillStyle = 'rgba(16,23,27,.85)'; ctx.strokeStyle = on ? GOLD : 'rgba(217,185,110,.3)'; ctx.lineWidth = on ? 2 : 1;
        ctx.beginPath(); ctx.roundRect(x, y, s, s, 5); ctx.fill(); ctx.stroke();
        if (on) { ctx.fillStyle = GOLD; ctx.fillRect(x + s * .3, y + s * .25, s * .13, s * .5); ctx.fillRect(x + s * .57, y + s * .25, s * .13, s * .5);
          ctx.font = `600 ${Math.round(H * .032)}px "Noto Sans KR",sans-serif`; ctx.fillText('정지', x + s / 2, y + s + H * .03); }
      }
      ctx.textAlign = 'start';

      // mage position
      let mx;
      if (t < .8) mx = lerp(W * .06, W * .16, ease(t / .8));
      else if (t < 4.4) mx = W * .16;
      else if (t < 5.6) mx = lerp(W * .16, W * .41, seg(t, 4.4, 5.6)) - Math.sin(t * 7) * W * .006;
      else if (t < 8) mx = W * .41;
      else mx = lerp(W * .41, W * .92, ease(seg(t, 8, 10.6)));
      const walking = (t < .8) || (t > 4.4 && t < 5.6) || (t > 8 && t < 10.6);
      const gone = seg(t, 10.6, 11);
      // attack bolt
      const bk = seg(t, .8, 1.4); if (bk > 0 && bk < 1) { const x = lerp(mx + H * .06, rx, bk); ctx.fillStyle = '#bfe3ff'; ctx.shadowColor = '#bfe3ff'; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(x, g - H * .1, H * .018, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
      // aim + stop bolt
      const aim = seg(t, 5.6, 6.4), sk = seg(t, 6.4, 7.0);
      if (aim > 0 && t < 7) { ctx.strokeStyle = `rgba(217,185,110,${.8 * aim})`; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(mx + H * .06, g - H * .12); ctx.lineTo(lerp(mx + H * .06, fx, aim), lerp(g - H * .12, fy, aim)); ctx.stroke(); ctx.setLineDash([]); }
      if (sk > 0 && sk < 1) { ctx.fillStyle = GOLD; ctx.shadowColor = GOLD; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(lerp(mx + H * .06, fx, sk), lerp(g - H * .12, fy, sk), H * .022, 0, TAU); ctx.fill(); ctx.shadowBlur = 0; }
      if (sk >= 1 && t < 7.6) { const k = seg(t, 7, 7.6); ctx.strokeStyle = `rgba(217,185,110,${1 - k})`; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(fx, fy, R * (.2 + k), 0, TAU); ctx.stroke(); }

      // mage
      if (gone < 1) {
        ctx.save(); ctx.globalAlpha = 1 - gone; const mh = H * .14, bob = walking ? Math.abs(Math.sin(t * 9)) * mh * .04 : 0;
        const flap = (t > 4.4 && t < 7) ? Math.sin(t * 20) * mh * .05 : 0;
        ctx.translate(mx, g - bob);
        ctx.strokeStyle = '#2c3a5c'; ctx.lineWidth = mh * .07; ctx.beginPath();
        const leg = walking ? Math.sin(t * 9) * mh * .08 : 0; ctx.moveTo(-mh * .08, -mh * .2); ctx.lineTo(-mh * .08 + leg, 0); ctx.moveTo(mh * .08, -mh * .2); ctx.lineTo(mh * .08 - leg, 0); ctx.stroke();
        ctx.fillStyle = '#3e5488'; ctx.beginPath(); ctx.moveTo(-mh * .22 - flap, -mh * .15); ctx.lineTo(0, -mh * .72); ctx.lineTo(mh * .2, -mh * .15); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = GOLD; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-mh * .2 - flap, -mh * .17); ctx.lineTo(mh * .19, -mh * .17); ctx.stroke();
        ctx.fillStyle = '#f0d9b5'; ctx.beginPath(); ctx.arc(mh * .02, -mh * .74, mh * .11, 0, TAU); ctx.fill();
        ctx.fillStyle = '#2c3a5c'; ctx.beginPath(); ctx.moveTo(-mh * .17, -mh * .8); ctx.lineTo(mh * .02, -mh * 1.12); ctx.lineTo(mh * .2, -mh * .8); ctx.closePath(); ctx.fill();
        ctx.fillStyle = GOLD; ctx.fillRect(-mh * .17, -mh * .82, mh * .37, mh * .04);
        ctx.strokeStyle = '#8a6a3a'; ctx.lineWidth = mh * .04; ctx.beginPath(); ctx.moveTo(mh * .2, -mh * .1); ctx.lineTo(mh * .3, -mh * .62); ctx.stroke();
        const glow = (t > .7 && t < .9) || (t > 6.2 && t < 6.5); ctx.fillStyle = glow ? '#fff' : '#bfe3ff'; ctx.beginPath(); ctx.arc(mh * .31, -mh * .66, mh * (glow ? .07 : .045), 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
  };
}

/* ---------------- player ---------------- */
function mount(root, scene) {
  const cv = root.querySelector('canvas'), ctx = cv.getContext('2d'), dpr = Math.min(2, devicePixelRatio || 1);
  const stepBtns = [...root.querySelectorAll('[data-step]')], bar = root.querySelector('.nx-anim-bar i'), playBtn = root.querySelector('[data-anim-play]');
  let W = 0, H = 0, t = 0, last = 0, raf = 0, visible = false, playing = !reduce;
  const size = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); paint(); };
  function paint() {
    if (!W) return;
    ctx.save(); scene.draw(ctx, W, H, t); ctx.restore();
    const fade = Math.max(seg(t, scene.duration - .5, scene.duration), 1 - seg(t, 0, .35));
    if (fade > 0) { ctx.fillStyle = `rgba(12,20,18,${fade})`; ctx.fillRect(0, 0, W, H); }
    let cur = 0; scene.steps.forEach(([s], i) => { if (t >= s) cur = i; });
    stepBtns.forEach((b, i) => b.setAttribute('aria-current', i === cur ? 'step' : 'false'));
    if (bar) bar.style.width = (t / scene.duration * 100) + '%';
  }
  function frame(now) {
    raf = 0; if (!visible || !playing) return;
    t += Math.min(.05, (now - (last || now)) / 1000); last = now;
    if (t > scene.duration) t = 0;
    paint(); raf = requestAnimationFrame(frame);
  }
  const go = () => { if (!raf && visible && playing) { last = 0; raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([en]) => { visible = en.isIntersecting; go(); }, { threshold: .2 }).observe(cv);
  new ResizeObserver(size).observe(cv);
  stepBtns.forEach((b, i) => b.addEventListener('click', () => { t = scene.steps[i][0] + .4; paint(); go(); }));
  playBtn?.addEventListener('click', () => { playing = !playing; playBtn.textContent = playing ? '일시정지' : '재생'; playBtn.setAttribute('aria-pressed', !playing); go(); });
  if (reduce) { t = scene.steps[scene.steps.length - 1][0] + 2.5; playBtn && (playBtn.textContent = '재생'); }
  size();
}
return { wopScene, wmScene, mount };
})();

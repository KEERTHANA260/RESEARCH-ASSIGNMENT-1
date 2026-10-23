/*CORE-START*/
function mulberry32(a) { return function () { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function makeData(n, seed) {
  const r = mulberry32(seed), set = new Set(), a = new Int32Array(n);
  let i = 0;
  while (i < n) { const v = 100000000 + Math.floor(r() * 900000000); if (!set.has(v)) { set.add(v); a[i++] = v; } }
  return { a: a, set: set };
}
function mergeSort(src0) {
  const n = src0.length; let src = Int32Array.from(src0), dst = new Int32Array(n), cmp = 0;
  for (let w = 1; w < n; w *= 2) {
    for (let lo = 0; lo < n; lo += 2 * w) {
      const mid = Math.min(lo + w, n), hi = Math.min(lo + 2 * w, n);
      let i = lo, j = mid, k = lo;
      while (i < mid && j < hi) { cmp++; if (src[i] <= src[j]) dst[k++] = src[i++]; else dst[k++] = src[j++]; }
      while (i < mid) dst[k++] = src[i++];
      while (j < hi) dst[k++] = src[j++];
    }
    const t = src; src = dst; dst = t;
  }
  return { sorted: src, cmp: cmp };
}
function isPrime(x) { if (x < 2) return false; if (x % 2 === 0) return x === 2; for (let i = 3; i * i <= x; i += 2) if (x % i === 0) return false; return true; }
function nextPrime(x) { while (!isPrime(x)) x++; return x; }
function buildHash(a) {
  const n = a.length, m = nextPrime(n), heads = new Int32Array(m).fill(-1), next = new Int32Array(n);
  for (let i = 0; i < n; i++) { const h = a[i] % m; next[i] = heads[h]; heads[h] = i; }
  return { m: m, heads: heads, next: next };
}
function chainStats(h) {
  let max = 0, nonempty = 0;
  for (let b = 0; b < h.m; b++) { let p = h.heads[b], L = 0; while (p !== -1) { L++; p = h.next[p]; } if (L) nonempty++; if (L > max) max = L; }
  return { max: max, nonempty: nonempty };
}
function linearFast(a, k) { for (let i = 0; i < a.length; i++) if (a[i] === k) return i; return -1; }
function linearCnt(a, k) { let c = 0; for (let i = 0; i < a.length; i++) { c++; if (a[i] === k) return [i, c]; } return [-1, c]; }
function bsFast(a, lo, hi, k) { if (lo > hi) return -1; const mid = (lo + hi) >> 1, v = a[mid]; if (k === v) return mid; return k < v ? bsFast(a, lo, mid - 1, k) : bsFast(a, mid + 1, hi, k); }
function bsCnt(a, lo, hi, k, st) {
  if (lo > hi) return -1;
  const mid = (lo + hi) >> 1, v = a[mid]; st.c++;
  if (st.steps) st.steps.push({ lo: lo, hi: hi, mid: mid, v: v });
  if (k === v) return mid;
  return k < v ? bsCnt(a, lo, mid - 1, k, st) : bsCnt(a, mid + 1, hi, k, st);
}
function hashFast(h, a, k) { let p = h.heads[k % h.m]; while (p !== -1) { if (a[p] === k) return p; p = h.next[p]; } return -1; }
function hashCnt(h, a, k) { let c = 0, p = h.heads[k % h.m]; while (p !== -1) { c++; if (a[p] === k) return [p, c]; p = h.next[p]; } return [-1, c]; }
function mergeSorted(A, B) {
  const out = new Int32Array(A.length + B.length); let i = 0, j = 0, k = 0;
  while (i < A.length && j < B.length) out[k++] = A[i] <= B[j] ? A[i++] : B[j++];
  while (i < A.length) out[k++] = A[i++];
  while (j < B.length) out[k++] = B[j++];
  return out;
}
/*CORE-END*/

let sink = 0;
const $ = (id) => document.getElementById(id);
const fmtInt = (v) => Math.round(v).toLocaleString('en-US');
const fmtNum = (v, d) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
function fmtTime(us) { if (us >= 1000) return fmtNum(us / 1000, us >= 10000 ? 1 : 2) + ' ms'; if (us >= 10) return fmtNum(us, 1) + ' µs'; return fmtNum(us, 2) + ' µs'; }
function fmtMs(ms) { return ms >= 100 ? fmtNum(ms, 0) + ' ms' : ms >= 10 ? fmtNum(ms, 1) + ' ms' : fmtNum(ms, 2) + ' ms'; }
function fmtCmp(v) { return v >= 100 ? fmtInt(v) : v >= 10 ? fmtNum(v, 1) : fmtNum(v, 2); }
const tick = () => new Promise((r) => setTimeout(r, 20));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const FIRST = ['Aarav', 'Diya', 'Karthik', 'Meera', 'Ishaan', 'Ananya', 'Rohan', 'Priya', 'Vikram', 'Lakshmi', 'Arjun', 'Sneha', 'Nikhil', 'Kavya', 'Sanjay', 'Divya'];
const LAST = ['Raman', 'Iyer', 'Nair', 'Krishnan', 'Menon', 'Subramanian', 'Pillai', 'Venkatesh', 'Reddy', 'Chandran', 'Gupta', 'Sharma', 'Das', 'Banerjee', 'Joshi', 'Kulkarni'];
const PROG = ['B.Tech Computer Science', 'B.Tech Electronics', 'B.Tech Mechanical', 'B.Sc Physics', 'B.Com Honours', 'BBA', 'M.Sc Data Science', 'MBA'];
function recordOf(k) {
  const h = Math.imul(k, 2654435761) >>> 0, h2 = Math.imul(h ^ (h >>> 15), 2246822519) >>> 0;
  return { name: FIRST[h & 15] + ' ' + LAST[(h >>> 4) & 15], program: PROG[(h >>> 8) & 7], year: 2018 + ((h >>> 12) % 8), cgpa: (6 + ((h2 >>> 5) % 400) / 100).toFixed(2) };
}

function timePerCall(fn, minMs) {
  let reps = 1; minMs = minMs || 5;
  for (;;) {
    const t0 = performance.now();
    for (let i = 0; i < reps; i++) fn();
    const dt = performance.now() - t0;
    if (dt >= minMs || reps >= 4194304) return dt * 1000 / reps;
    reps *= reps < 8 ? 8 : 4;
  }
}
function timeList(fn, qs, minMs) {
  let calls = 0; const t0 = performance.now();
  do { for (let i = 0; i < qs.length; i++) sink ^= fn(qs[i]); calls += qs.length; } while (performance.now() - t0 < minMs);
  return (performance.now() - t0) * 1000 / calls;
}

/* ---------- measurement ---------- */
const cache = {};
function measureSize(n, q) {
  const rnd = mulberry32(7 + n);
  const d = makeData(n, 2026 + n), a = d.a, set = d.set;
  const rep = n <= 10000 ? 5 : (n <= 100000 ? 3 : 1);
  let sortMs = Infinity, sorted = null, sortCmp = 0, buildMs = Infinity, h = null;
  for (let r = 0; r < rep; r++) { const t = performance.now(); const o = mergeSort(a); const dt = performance.now() - t; if (dt < sortMs) sortMs = dt; sorted = o.sorted; sortCmp = o.cmp; }
  for (let r = 0; r < rep; r++) { const t = performance.now(); const hh = buildHash(a); const dt = performance.now() - t; if (dt < buildMs) buildMs = dt; h = hh; }
  const cs = chainStats(h);
  const qs = new Int32Array(q), isHit = new Uint8Array(q), pos = new Int32Array(q);
  for (let i = 0; i < q; i++) {
    if (i % 2 === 0) { const p = Math.floor(rnd() * n); qs[i] = a[p]; isHit[i] = 1; pos[i] = p; }
    else { let v; do { v = 100000000 + Math.floor(rnd() * 900000000); } while (set.has(v)); qs[i] = v; }
  }
  let checks = 0, bad = 0;
  const cn = Math.min(q, 600), cl = Math.min(q, Math.max(30, Math.floor(3e7 / n)));
  for (let i = 0; i < cn; i++) {
    const k = qs[i], e = isHit[i] === 1;
    if (i < cl) { checks++; if ((linearFast(a, k) !== -1) !== e) bad++; }
    checks += 2;
    if ((bsFast(sorted, 0, n - 1, k) !== -1) !== e) bad++;
    if ((hashFast(h, a, k) !== -1) !== e) bad++;
  }
  const ql = Math.min(q, Math.max(20, Math.floor(3e7 / n)));
  const qLin = qs.subarray(0, ql);
  const linUs = timeList((k) => linearFast(a, k), qLin, 40);
  const binUs = timeList((k) => bsFast(sorted, 0, n - 1, k), qs, 40);
  const hashUs = timeList((k) => hashFast(h, a, k), qs, 40);
  let nh = 0, nm = 0, lh = 0, bh = 0, bm = 0, bmax = 0, hh2 = 0, hm = 0, hmax = 0;
  for (let i = 0; i < q; i++) {
    const k = qs[i], st = { c: 0 }; bsCnt(sorted, 0, n - 1, k, st);
    const hc = hashCnt(h, a, k)[1];
    if (st.c > bmax) bmax = st.c; if (hc > hmax) hmax = hc;
    if (isHit[i]) { nh++; lh += pos[i] + 1; bh += st.c; hh2 += hc; } else { nm++; bm += st.c; hm += hc; }
  }
  const kNew = Math.min(10000, Math.max(100, Math.floor(n / 10)));
  const fresh = new Set(); const nb = new Int32Array(kNew);
  for (let i = 0; i < kNew; ) { const v = 100000000 + Math.floor(rnd() * 900000000); if (!set.has(v) && !fresh.has(v)) { fresh.add(v); nb[i++] = v; } }
  let mergeMs = Infinity;
  for (let r = 0; r < rep; r++) { const t = performance.now(); const sb = Int32Array.from(nb).sort(); const mg = mergeSorted(sorted, sb); const dt = performance.now() - t; if (dt < mergeMs) mergeMs = dt; sink ^= mg[0]; }
  return { n: n, q: q, ql: ql, sortMs: sortMs, sortCmp: sortCmp, buildMs: buildMs, m: h.m, alpha: n / h.m, maxChain: cs.max, linUs: linUs, binUs: binUs, hashUs: hashUs,
    cLinHit: lh / nh, cLinMiss: n, cBinHit: bh / nh, cBinMiss: bm / nm, cBinMax: bmax, cHashHit: hh2 / nh, cHashMiss: hm / nm, cHashMax: hmax,
    checks: checks, bad: bad, kNew: kNew, mergeMs: mergeMs, mergeNs: mergeMs * 1e6 / (n + kNew) };
}

/* ---------- database panel ---------- */
let S = null;
async function buildDataset(n) {
  $('ds-build').disabled = true; $('ds-status').textContent = 'Building ' + fmtInt(n) + ' records…';
  await tick();
  const d = makeData(n, 2026 + n);
  let t0 = performance.now(); const ms = mergeSort(d.a); const sortMs = performance.now() - t0;
  t0 = performance.now(); const h = buildHash(d.a); const buildMs = performance.now() - t0;
  const cs = chainStats(h);
  S = { n: n, a: d.a, set: d.set, sorted: ms.sorted, h: h, pre: { sortMs: sortMs, sortCmp: ms.cmp, buildMs: buildMs, m: h.m, alpha: n / h.m, maxChain: cs.max } };
  const st = $('ds-stats');
  st.innerHTML =
    '<div class="stat"><span>Records stored</span><b>' + fmtInt(n) + '</b><small>unsorted, unique</small></div>' +
    '<div class="stat"><span>Sort for binary search</span><b>' + fmtMs(sortMs) + '</b><small>' + fmtInt(ms.cmp) + ' comparisons (merge sort)</small></div>' +
    '<div class="stat"><span>Hash table build</span><b>' + fmtMs(buildMs) + '</b><small>' + fmtInt(n) + ' insertions</small></div>' +
    '<div class="stat"><span>Hash table shape</span><b>m = ' + fmtInt(h.m) + '</b><small>load factor ' + fmtNum(n / h.m, 3) + ', longest chain ' + cs.max + '</small></div>';
  $('ds-status').textContent = 'Ready. Preprocessing times above come from a single run in this browser.';
  $('ds-build').disabled = false;
  if (!$('key-in').value || !S.set.has(+$('key-in').value)) $('key-in').value = String(S.a[Math.floor(S.n * 0.37)]);
  runLookup();
}

/* ---------- lookup ---------- */
function card(color, cls, name, tag, body) {
  return '<article class="card" style="--c:' + color + '"><header><span class="sw ' + cls + '"></span><h3>' + name + '</h3></header><p class="tag">' + tag + '</p>' + body + '</article>';
}
function runLookup() {
  if (!S) return;
  const raw = $('key-in').value.trim();
  const msg = $('lk-msg');
  if (!/^\d{9}$/.test(raw) || +raw < 100000000) {
    msg.innerHTML = '<p class="msg err">Enter a 9-digit registration number between 100000000 and 999999999.</p>';
    return;
  }
  msg.innerHTML = '';
  const k = +raw, n = S.n, a = S.a, sorted = S.sorted, h = S.h;
  const lin = linearCnt(a, k);
  const st = { c: 0, steps: [] }; const bi = bsCnt(sorted, 0, n - 1, k, st);
  const ha = hashCnt(h, a, k);
  const linT = timePerCall(() => { sink ^= linearFast(a, k); });
  const binT = timePerCall(() => { sink ^= bsFast(sorted, 0, n - 1, k); });
  const hashT = timePerCall(() => { sink ^= hashFast(h, a, k); });
  const found = lin[0] !== -1;
  const res = (ok, txt) => '<p class="big' + (ok ? '' : ' miss') + '">' + (ok ? txt : 'Not found') + '</p>';
  const dl = (rows) => '<dl class="kv">' + rows.map((r) => '<dt>' + r[0] + '</dt><dd>' + r[1] + '</dd>').join('') + '</dl>';
  const log2 = Math.floor(Math.log2(n)) + 1;
  $('lk-cards').innerHTML =
    card('var(--c-lin)', '', 'Linear search', 'Iterative · brute force', res(found, 'Record ' + fmtInt(lin[0] + 1) + ' of ' + fmtInt(n)) + dl([['Comparisons', fmtInt(lin[1])], ['Time per search', fmtTime(linT)], ['Preprocessing', 'none'], ['Worst case', fmtInt(n) + ' comparisons']])) +
    card('var(--c-bin)', 'circle', 'Binary search', 'Recursive · decrease and conquer', res(bi !== -1, 'Sorted position ' + fmtInt(bi + 1)) + dl([['Comparisons', fmtInt(st.c)], ['Time per search', fmtTime(binT)], ['Preprocessing', fmtMs(S.pre.sortMs) + ' sort'], ['Worst case', log2 + ' comparisons']])) +
    card('var(--c-hash)', 'tri', 'Hash table search', 'Iterative · chain walk', res(ha[0] !== -1, 'Bucket ' + fmtInt(k % h.m) + ', chain slot ' + ha[1]) + dl([['Comparisons', fmtInt(ha[1])], ['Time per search', fmtTime(hashT)], ['Preprocessing', fmtMs(S.pre.buildMs) + ' build'], ['Expected', '≈ 1.5 per hit']]));
  const rec = $('lk-record');
  if (found) {
    const r = recordOf(k);
    rec.innerHTML = '<h3 style="margin-bottom:8px">Student record</h3><div class="record">' +
      '<div class="stat"><span>Name</span><b style="font-family:var(--font-body)">' + esc(r.name) + '</b></div>' +
      '<div class="stat"><span>Programme</span><b style="font-family:var(--font-body);font-size:14px">' + esc(r.program) + '</b></div>' +
      '<div class="stat"><span>Admitted</span><b>' + r.year + '</b></div>' +
      '<div class="stat"><span>CGPA</span><b>' + r.cgpa + '</b></div></div><p class="note" style="margin-top:8px">Names and grades are generated from the registration number for this demo.</p>';
  } else rec.innerHTML = '<p class="msg">No student with registration number ' + k + ' in this database. Linear search had to check all ' + fmtInt(n) + ' records to be sure.</p>';
  const steps = st.steps;
  $('lk-trace').innerHTML = '<h3 style="margin-bottom:8px">Binary search trace: each call halves the range (' + steps.length + ' call' + (steps.length === 1 ? '' : 's') + ')</h3><div class="scroll"><table><thead><tr><th>Call</th><th class="num">lo</th><th class="num">hi</th><th class="num">mid</th><th class="num">R[mid]</th><th>Remaining range</th><th>Decision</th></tr></thead><tbody>' +
    steps.map((s, i) => {
      const dec = s.v === k ? 'match' : (k < s.v ? 'go left' : 'go right');
      const left = (s.lo / n * 100).toFixed(3), w = Math.max(0.4, (s.hi - s.lo + 1) / n * 100).toFixed(3);
      return '<tr><td class="num">' + (i + 1) + '</td><td class="num">' + fmtInt(s.lo) + '</td><td class="num">' + fmtInt(s.hi) + '</td><td class="num">' + fmtInt(s.mid) + '</td><td class="num">' + s.v + '</td><td><div class="track"><i style="left:' + left + '%;width:' + w + '%"></i></div></td><td>' + dec + '</td></tr>';
    }).join('') + '</tbody></table></div>';
}
function setCase(c) {
  if (!S) return; const rnd = Math.random;
  let k;
  if (c === 'random') k = S.a[Math.floor(rnd() * S.n)];
  else if (c === 'missing') { do { k = 100000000 + Math.floor(rnd() * 900000000); } while (S.set.has(k)); }
  else if (c === 'first') k = S.a[0];
  else if (c === 'last') k = S.a[S.n - 1];
  else k = S.sorted[(S.n - 1) >> 1];
  $('key-in').value = String(k); runLookup();
}

/* ---------- charts ---------- */
function shape(kind, x, y, color, extra) {
  if (kind === 'circle') return '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + color + '"' + extra + '>';
  if (kind === 'square') return '<rect x="' + (x - 4) + '" y="' + (y - 4) + '" width="8" height="8" fill="' + color + '"' + extra + '>';
  return '<polygon points="' + x + ',' + (y - 5.5) + ' ' + (x - 5) + ',' + (y + 4) + ' ' + (x + 5) + ',' + (y + 4) + '" fill="' + color + '"' + extra + '>';
}
function shapeEnd(kind) { return kind === 'circle' ? '</circle>' : kind === 'square' ? '</rect>' : '</polygon>'; }
function chartSVG(o) {
  const W = 760, H = 350, x0 = 72, x1 = 590, y0 = 86, y1 = 300;
  const xs = Array.from(new Set(o.series.flatMap((s) => s.pts.map((p) => p.x)))).sort((p, q) => p - q);
  if (xs.length < 2) return '<p class="msg">Select at least two sizes to draw growth charts.</p>';
  const lx0 = Math.log10(xs[0]), lx1 = Math.log10(xs[xs.length - 1]);
  const X = (v) => x0 + (Math.log10(v) - lx0) / (lx1 - lx0) * (x1 - x0);
  const ys = o.series.flatMap((s) => s.pts.concat(s.pred || [])).map((p) => p.y).filter((v) => v > 0);
  const dmin = Math.floor(Math.log10(Math.min.apply(null, ys))); let dmax = Math.ceil(Math.log10(Math.max.apply(null, ys))); if (dmax <= dmin) dmax = dmin + 1;
  const span = dmax - dmin, Y = (v) => y1 - (Math.log10(v) - dmin) / span * (y1 - y0);
  let g = '';
  for (let d = dmin; d <= dmax; d++) { const y = Y(Math.pow(10, d)); g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y + '" y2="' + y + '" stroke="var(--line)"/><text class="t2" x="' + (x0 - 8) + '" y="' + (y + 4) + '" text-anchor="end" font-size="12">' + o.yFmt(Math.pow(10, d)) + '</text>'; }
  g += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + y1 + '" y2="' + y1 + '" stroke="var(--ink-2)" stroke-opacity="0.5"/>';
  xs.forEach((n) => { g += '<text class="t2" x="' + X(n) + '" y="' + (y1 + 18) + '" text-anchor="middle" font-size="12">' + fmtInt(n) + '</text>'; });
  g += '<text class="t2" x="' + ((x0 + x1) / 2) + '" y="' + (H - 6) + '" text-anchor="middle" font-size="12">Number of records in the database</text>';
  const labels = [];
  o.series.forEach((s) => {
    (s.pred || []).forEach((p) => { g += '<circle cx="' + X(p.x) + '" cy="' + Y(p.y) + '" r="8.5" fill="none" stroke="' + s.color + '" stroke-width="1.5"><title>' + s.name + ', ' + fmtInt(p.x) + ' records: predicted ' + fmtCmp(p.y) + '</title></circle>'; });
    g += '<path d="' + s.pts.map((p, i) => (i ? 'L' : 'M') + X(p.x) + ',' + Y(p.y)).join(' ') + '" fill="none" stroke="' + s.color + '" stroke-width="2.5"' + (s.dash ? ' stroke-dasharray="6 4"' : '') + '/>';
    s.pts.forEach((p) => { g += shape(s.shape, X(p.x), Y(p.y), s.color, '') + '<title>' + s.name + ', ' + fmtInt(p.x) + ' records: ' + o.valFmt(p.y) + '</title>' + shapeEnd(s.shape); });
    const last = s.pts[s.pts.length - 1]; labels.push({ y: Y(last.y), name: s.name, val: o.valFmt(last.y), color: s.color });
  });
  labels.sort((p, q) => p.y - q.y);
  for (let i = 1; i < labels.length; i++) if (labels[i].y < labels[i - 1].y + 32) labels[i].y = labels[i - 1].y + 32;
  labels.forEach((l) => { g += '<text class="t1" x="' + (x1 + 16) + '" y="' + (l.y - 1) + '" font-size="13" font-weight="600">' + l.name + '</text><text class="t2" x="' + (x1 + 16) + '" y="' + (l.y + 14) + '" font-size="12">' + l.val + '</text>'; });
  return '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(o.title) + '"><text class="t1" x="4" y="24" font-size="16" font-weight="600">' + esc(o.title) + '</text><text class="t2" x="4" y="46" font-size="12.5">' + esc(o.sub) + '</text>' + g + '</svg>';
}
const SER = [
  { key: 'lin', name: 'Linear', color: 'var(--c-lin)', shape: 'circle' },
  { key: 'bin', name: 'Binary', color: 'var(--c-bin)', shape: 'square' },
  { key: 'hash', name: 'Hash', color: 'var(--c-hash)', shape: 'tri', dash: true }
];

/* ---------- benchmark ---------- */
let rows = [];
function renderBench() {
  const R = rows.slice().sort((p, q) => p.n - q.n);
  if (!R.length) return;
  const tkey = { lin: 'linUs', bin: 'binUs', hash: 'hashUs' };
  const ckey = { lin: 'cLinHit', bin: 'cBinHit', hash: 'cHashHit' };
  const pred = { lin: (r) => (r.n + 1) / 2, bin: (r) => Math.log2(r.n) - 1, hash: (r) => 1 + r.alpha / 2 - r.alpha / (2 * r.n) };
  const mk = (kmap, withPred) => SER.map((s) => ({ name: s.name, color: s.color, shape: s.shape, dash: s.dash, pts: R.map((r) => ({ x: r.n, y: r[kmap[s.key]] })), pred: withPred ? R.map((r) => ({ x: r.n, y: pred[s.key](r) })) : null }));
  const growth = R.length > 1 ? R[R.length - 1].linUs / R[0].linUs : 1;
  $('chart-time').innerHTML = chartSVG({ title: 'Time per search by database size', sub: 'Average microseconds per search, log scales, half hits and half misses' + (R.length > 1 ? ' · linear grew ×' + fmtInt(growth) : ''), series: mk(tkey, false), yFmt: (v) => v >= 1000 ? fmtInt(v) : (v < 1 ? String(v) : fmtInt(v)), valFmt: fmtTime });
  $('chart-cmp').innerHTML = chartSVG({ title: 'Comparisons per successful search', sub: 'Measured (filled) and predicted by the derived formulas (hollow rings), log scales', series: mk(ckey, true), yFmt: (v) => fmtInt(v), valFmt: fmtCmp });
  $('tbl-search').innerHTML = '<table><thead><tr><th class="num">Records</th><th class="num">Linear</th><th class="num">Binary</th><th class="num">Hash</th><th class="num">Hit: L / B / H comparisons</th><th class="num">Miss: L / B / H comparisons</th><th class="num">Result checks</th></tr></thead><tbody>' +
    R.map((r) => '<tr><td class="num">' + fmtInt(r.n) + '</td><td class="num">' + fmtTime(r.linUs) + '</td><td class="num">' + fmtTime(r.binUs) + '</td><td class="num">' + fmtTime(r.hashUs) + '</td><td class="num">' + fmtCmp(r.cLinHit) + ' / ' + fmtCmp(r.cBinHit) + ' / ' + fmtCmp(r.cHashHit) + '</td><td class="num">' + fmtCmp(r.cLinMiss) + ' / ' + fmtCmp(r.cBinMiss) + ' / ' + fmtCmp(r.cHashMiss) + '</td><td class="num">' + (r.bad === 0 ? r.checks + ' agree' : '<b style="color:var(--bad)">' + r.bad + ' mismatches</b>') + '</td></tr>').join('') + '</tbody></table>';
  $('tbl-pre').innerHTML = '<table><thead><tr><th class="num">Records</th><th class="num">Sort time</th><th class="num">Sort comparisons</th><th class="num">n·log₂n − n + 1</th><th class="num">Hash build</th><th class="num">Buckets m</th><th class="num">Longest chain</th><th class="num">Merge in new records</th></tr></thead><tbody>' +
    R.map((r) => '<tr><td class="num">' + fmtInt(r.n) + '</td><td class="num">' + fmtMs(r.sortMs) + '</td><td class="num">' + fmtInt(r.sortCmp) + '</td><td class="num">' + fmtInt(r.n * Math.log2(r.n) - r.n + 1) + '</td><td class="num">' + fmtMs(r.buildMs) + '</td><td class="num">' + fmtInt(r.m) + '</td><td class="num">' + r.maxChain + '</td><td class="num">' + fmtMs(r.mergeMs) + ' (' + fmtInt(r.kNew) + ' new)</td></tr>').join('') + '</tbody></table>';
  renderTheory();
}
let benchBusy = false, benchStarted = false;
async function runBench() {
  if (benchBusy) return; benchBusy = true; benchStarted = true;
  const sizes = Array.from(document.querySelectorAll('input[name=bsz]:checked')).map((e) => +e.value).sort((p, q) => p - q);
  const q = Math.max(200, Math.min(20000, +$('bq').value || 2000));
  $('bench-run').disabled = true; rows = [];
  if (!sizes.length) { $('bench-status').textContent = 'Select at least one database size.'; $('bench-run').disabled = false; benchBusy = false; return; }
  for (const n of sizes) {
    $('bench-status').textContent = 'Measuring ' + fmtInt(n) + ' records (' + (sizes.indexOf(n) + 1) + ' of ' + sizes.length + ')…';
    await tick();
    const r = measureSize(n, q); cache[n] = r; rows.push(r); renderBench(); await tick();
  }
  const bad = rows.reduce((s, r) => s + r.bad, 0), chk = rows.reduce((s, r) => s + r.checks, 0);
  $('bench-status').textContent = 'Done. ' + fmtInt(chk) + ' result checks across the three algorithms, ' + (bad === 0 ? 'all agreed with the stored data.' : bad + ' mismatches found.');
  $('bench-run').disabled = false; benchBusy = false;
  if (!$('p-load').hidden) renderLoad();
}

/* ---------- Day-4 load ---------- */
async function renderLoad() {
  const n = +$('ld-size').value, rate = Math.max(1, +$('ld-rate').value || 50000), kNew = Math.max(1, +$('ld-new').value || 10000);
  let r = cache[n];
  if (!r) {
    $('ld-status').textContent = 'Measuring ' + fmtInt(n) + ' records on this device…'; $('ld-out').innerHTML = '';
    await tick(); r = measureSize(n, 2000); cache[n] = r;
  }
  $('ld-status').textContent = 'Timings measured in this browser for ' + fmtInt(n) + ' records.';
  const perSec = rate / 3600, gapMs = 1000 / perSec;
  const opts = [
    { name: 'Linear search', sw: '<span class="sw" style="--c:var(--c-lin)"></span>', c: 'var(--c-lin)', us: r.linUs, pre: 'none', preMs: 0, be: 0, note: 'Rescans the table for every request' },
    { name: 'Binary search, daily merge', sw: '<span class="sw circle" style="--c:var(--c-bin)"></span>', c: 'var(--c-bin)', us: r.binUs, preMs: r.mergeNs * (n + kNew) / 1e6, be: r.sortMs * 1000 / Math.max(1e-9, r.linUs - r.binUs), note: 'Full re-sort would take ' + fmtMs(r.sortMs) },
    { name: 'Hash table', sw: '<span class="sw tri" style="--c:var(--c-hash)"></span>', c: 'var(--c-hash)', us: r.hashUs, preMs: r.buildMs, be: r.buildMs * 1000 / Math.max(1e-9, r.linUs - r.hashUs), note: 'Rebuilt once a day; unordered' }
  ].map((o) => { o.cpu = perSec * 3600 * o.us * 1e-6; o.util = perSec * o.us * 1e-6; return o; });
  const barW = (u) => Math.max(0.5, Math.min(100, (Math.log10(Math.max(u, 1e-7)) + 7) / 7 * 100));
  const pct = (u) => u >= 0.01 ? fmtNum(u * 100, u >= 0.1 ? 1 : 2) + '%' : fmtNum(u * 100, 4) + '%';
  const lin = opts[0], bin = opts[1], hs = opts[2];
  let verdict, warn = false;
  if (lin.util < 0.02) verdict = ['Linear search is enough at this load', 'It uses ' + pct(lin.util) + ' of one core, so the extra structure is not needed.'];
  else if (bin.util < 0.1) verdict = ['Keep binary search and merge new records once a day', 'Binary search uses ' + pct(bin.util) + ' of one core with ' + fmtTime(bin.us) + ' per search. The daily merge takes about ' + fmtMs(bin.preMs) + ', against ' + fmtMs(r.sortMs) + ' for a full re-sort. Hash search would save about ' + fmtNum((bin.cpu - hs.cpu), 2) + ' s of processor time per hour and loses ordered lookups.'];
  else { verdict = ['Switch to a hash table at this load', 'Binary search would use ' + pct(bin.util) + ' of one core, while hashing needs ' + pct(hs.util) + '.']; warn = true; }
  if (lin.util >= 0.02 && lin.util >= 1) warn = true;
  $('ld-out').innerHTML =
    '<div class="stats"><div class="stat"><span>Arrival rate</span><b>' + fmtNum(perSec, 1) + ' per second</b><small>one search every ' + fmtNum(gapMs, gapMs >= 10 ? 0 : 1) + ' ms on average</small></div>' +
    '<div class="stat"><span>Searches per day</span><b>' + fmtInt(rate * 24) + '</b><small>if the rate holds all day</small></div>' +
    '<div class="stat"><span>Records</span><b>' + fmtInt(n) + '</b><small>+ ' + fmtInt(kNew) + ' added once a day</small></div></div>' +
    '<div class="scroll"><table><thead><tr><th>Option</th><th class="num">Time per search</th><th class="num">Processor time per hour</th><th>Share of one core (log scale)</th><th class="num">Burst headroom</th><th class="num">Daily preprocessing</th><th class="num">Repaid after</th></tr></thead><tbody>' +
    opts.map((o, i) => '<tr' + (i === 1 ? ' class="pick"' : '') + '><td>' + o.sw + ' ' + o.name + '<div class="note">' + o.note + '</div></td><td class="num">' + fmtTime(o.us) + '</td><td class="num">' + (o.cpu >= 10 ? fmtInt(o.cpu) : fmtNum(o.cpu, o.cpu >= 0.1 ? 2 : 3)) + ' s</td><td><div style="display:flex;align-items:center;gap:8px"><div style="width:140px"><div class="bar" style="--c:' + o.c + ';width:' + barW(o.util) + '%"></div></div><span class="mono">' + pct(o.util) + '</span></div></td><td class="num">' + (o.util > 0 ? '×' + fmtInt(1 / o.util) : '–') + '</td><td class="num">' + (o.preMs ? fmtMs(o.preMs) : 'none') + '</td><td class="num">' + (o.be ? fmtInt(Math.ceil(o.be)) + ' searches' : '–') + '</td></tr>').join('') + '</tbody></table></div>' +
    '<div class="verdict' + (warn ? ' warn' : '') + '"><h3>' + verdict[0] + '</h3><p>' + verdict[1] + '</p></div>' +
    '<p class="hint">Updates arrive once a day, so the sorted array or hash table stays valid for 24 hours and is shared read-only by every request. Burst headroom is how many times the average rate one core can absorb. The daily merge cost is estimated from the merge speed measured at this size.</p>';
}

/* ---------- theory ---------- */
function renderTheory() {
  const R = rows.slice().sort((p, q) => p.n - q.n);
  const box = $('th-table');
  if (!R.length) { box.innerHTML = '<p class="msg">Run the benchmark to fill this table.</p>'; $('th-extra').innerHTML = ''; return; }
  const dev = (o, p) => { const d = (o - p) / p * 100; return (d >= 0 ? '+' : '') + fmtNum(d, 1) + '%'; };
  box.innerHTML = '<table><thead><tr><th class="num">Records</th><th class="num">Linear observed (predicted)</th><th class="num">Binary observed (predicted)</th><th class="num">Hash observed (predicted)</th><th class="num">Sort comparisons vs formula</th></tr></thead><tbody>' +
    R.map((r) => {
      const pl = (r.n + 1) / 2, pb = Math.log2(r.n) - 1, ph = 1 + r.alpha / 2 - r.alpha / (2 * r.n), ps = r.n * Math.log2(r.n) - r.n + 1;
      return '<tr><td class="num">' + fmtInt(r.n) + '</td><td class="num">' + fmtCmp(r.cLinHit) + ' (' + fmtCmp(pl) + ') ' + dev(r.cLinHit, pl) + '</td><td class="num">' + fmtCmp(r.cBinHit) + ' (' + fmtCmp(pb) + ') ' + dev(r.cBinHit, pb) + '</td><td class="num">' + fmtCmp(r.cHashHit) + ' (' + fmtCmp(ph) + ') ' + dev(r.cHashHit, ph) + '</td><td class="num">' + dev(r.sortCmp, ps) + '</td></tr>';
    }).join('') + '</tbody></table>';
  const last = R[R.length - 1], first = R[0];
  let ex = '<p class="hint">Comparison counts follow the formulas, with small differences from random sampling of the searches. Time grows differently from comparison counts: the hash search time rose ×' + fmtNum(last.hashUs / first.hashUs, 1) + ' and the binary search time ×' + fmtNum(last.binUs / first.binUs, 1) + ' from ' + fmtInt(first.n) + ' to ' + fmtInt(last.n) + ' records, although their comparison counts barely change. Larger tables no longer fit in the processor cache, and the comparison count does not see that cost.</p>';
  if (last.linUs > last.binUs) ex += '<p class="hint" style="margin-top:8px">At ' + fmtInt(last.n) + ' records, sorting for binary search is repaid after about ' + fmtInt(Math.ceil(last.sortMs * 1000 / (last.linUs - last.binUs))) + ' searches, and building the hash table after about ' + fmtInt(Math.ceil(last.buildMs * 1000 / (last.linUs - last.hashUs))) + '.</p>';
  $('th-extra').innerHTML = ex;
}

/* ---------- wiring ---------- */
const tabs = ['lookup', 'benchmark', 'load', 'theory'];
function showTab(t) {
  if (tabs.indexOf(t) < 0) t = 'lookup';
  tabs.forEach((x) => { $('p-' + x).hidden = x !== t; $('t-' + x).setAttribute('aria-selected', x === t ? 'true' : 'false'); });
  if (t === 'benchmark' && !benchStarted) runBench();
  if (t === 'load') renderLoad();
  if (t === 'theory') { if (!rows.length && !benchStarted) { renderTheory(); } else renderTheory(); }
}
document.querySelectorAll('.tabs button').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));
document.querySelectorAll('.cases button').forEach((b) => b.addEventListener('click', () => setCase(b.dataset.case)));
$('go').addEventListener('click', runLookup);
$('key-in').addEventListener('keydown', (e) => { if (e.key === 'Enter') runLookup(); });
$('key-in').addEventListener('input', (e) => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 9); });
$('ds-build').addEventListener('click', () => buildDataset(+$('ds-size').value));
$('bench-run').addEventListener('click', () => { benchBusy = false; runBench(); });
['ld-rate', 'ld-size', 'ld-new'].forEach((id) => $(id).addEventListener('change', renderLoad));
renderTheory();
(async function start() {
  await buildDataset(+$('ds-size').value);
  const hsh = (location.hash || '').replace('#', '');
  if (tabs.indexOf(hsh) > 0) showTab(hsh);
})();

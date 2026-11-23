/* Aplikasi Panitia — Benteng Spirit Run */
(function () {
  'use strict';
  const BSR = window.BSR, X = window.BSR_EKSPOR;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rp = n => 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');
  const angka = n => (Number(n) || 0).toLocaleString('id-ID');
  const JK = ['Putra', 'Putri'];
  // nomor dada selalu 3 digit: 1 → 001
  const nd = n => (n == null || n === '') ? '' : (/^\d+$/.test(String(n)) ? String(n).padStart(3, '0') : String(n));

  /* ---------------- Ikon ---------------- */
  const P = {
    home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    chart: '<path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6" rx="1"/><rect x="12" y="8" width="3" height="10" rx="1"/><rect x="17" y="5" width="3" height="13" rx="1"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>',
    shirt: '<path d="M20.4 6.6 16 3a4 4 0 0 1-8 0L3.6 6.6a1 1 0 0 0-.2 1.3l1.8 2.7a1 1 0 0 0 1.3.3L8 10v10a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V10l1.5.9a1 1 0 0 0 1.3-.3l1.8-2.7a1 1 0 0 0-.2-1.3z"/>',
    relay: '<path d="M4 17h3l3-7 4 9 3-6h3"/><circle cx="6" cy="6" r="2"/>',
    timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    hash: '<path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18"/>',
    form: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
    down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
    xls: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 12l5 6M13 12l-5 6"/>',
    pdf: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 17v-4h1.5a1.5 1.5 0 0 1 0 3H8"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12a9 9 0 0 1 15.5-6.2L21 8M21 3v5h-5M3 21v-5h5"/>',
    menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    link: '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>',
    shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    ext: '<path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    wa: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.2-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
    save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
    flag: '<path d="M4 22V4a1 1 0 0 1 1-1h12l-2 4 2 4H5"/>',
  };
  const ic = n => '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || '') + '</svg>';

  /* ---------------- State ---------------- */
  const S = { set: null, reg: [], est: [], seri: [], form: null };
  const UI = {
    f: { q: '', kat: '', jk: '', status: '', page: 1, sort: 'ts', dir: 'asc' }, sel: new Set(),
    seri: { key: '', babak: 'Penyisihan' }, bib: { kat: '', jk: '', q: '', est: true }, estKat: '',
  };
  window.BSR_INFO = () => ({
    acara: (S.set && S.set.nama_acara) || 'BENTENG SPIRIT RUN 2026',
    penyelenggara: (S.set && S.set.penyelenggara) || 'Pengurus Cabang PASI Kota Tangerang',
    tanggal: (S.set && S.set.tanggal) || '', lokasi: (S.set && S.set.lokasi) || '',
    ketua: (S.set && S.set.ketua_panitia) || '', referee: (S.set && S.set.referee) || '',
  });

  /* ---------------- Helper UI ---------------- */
  function toast(msg, tipe) {
    const t = document.createElement('div');
    t.className = 'toast ' + (tipe || ''); t.textContent = msg; t.setAttribute('role', 'status');
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), tipe === 'err' ? 6500 : 3200);
  }
  let busyN = 0;
  function busy(on, msg) {
    busyN += on ? 1 : -1;
    const el = $('#loading');
    if (busyN > 0) { el.classList.remove('hidden'); $('#loading-msg').textContent = msg || 'Memproses…'; } else el.classList.add('hidden');
  }
  async function act(msg, fn) {
    busy(true, msg);
    try { return await fn(); } catch (e) { toast(e.message || String(e), 'err'); console.error(e); return undefined; } finally { busy(false); }
  }
  function dialog(o) {
    const d = $('#dlg');
    d.className = o.wide ? 'wide' : '';
    d.innerHTML = '<form method="dialog" class="dlg-head"><h2>' + esc(o.title) + '</h2><button class="btn btn-ghost btn-icon" value="x" aria-label="Tutup">' + ic('x') + '</button></form>' +
      '<div class="dlg-body">' + o.body + '</div>' + (o.foot === false ? '' : '<div class="dlg-foot">' + (o.foot || '<button class="btn" data-close>Tutup</button>') + '</div>');
    $$('[data-close]', d).forEach(b => b.onclick = () => d.close());
    d.showModal();
    return d;
  }
  function konfirmasi(judul, pesan, tombol, bahaya) {
    return new Promise(ok => {
      const d = dialog({ title: judul, body: '<p>' + pesan + '</p>', foot: '<button class="btn" data-close>Batal</button><button class="btn ' + (bahaya ? 'btn-danger' : 'btn-brand') + '" id="ya">' + esc(tombol || 'Ya') + '</button>' });
      let jawab = false;
      $('#ya', d).onclick = () => { jawab = true; d.close(); };
      d.addEventListener('close', () => ok(jawab), { once: true });
    });
  }
  function menuEkspor(id, items) {
    return '<div class="split-btn"><button class="btn" data-menu="' + id + '" aria-haspopup="true">' + ic('down') + 'Ekspor</button><div class="menu-pop" id="' + id + '">' +
      items.map(it => it === '-' ? '<hr>' : '<button data-x="' + it[0] + '">' + ic(it[2] || 'xls') + esc(it[1]) + '</button>').join('') + '</div></div>';
  }
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-menu]');
    $$('.menu-pop.open').forEach(m => { if (!b || m.id !== b.dataset.menu) m.classList.remove('open'); });
    if (b) { $('#' + b.dataset.menu).classList.toggle('open'); e.stopPropagation(); }
  });
  function bindEkspor(map) {
    $$('.menu-pop [data-x]').forEach(b => b.onclick = async () => {
      b.closest('.menu-pop').classList.remove('open');
      const fn = map[b.dataset.x];
      if (fn) await act('Menyiapkan file…', fn);
    });
  }
  const tglID = s => { if (!s || !/^\d{4}-\d{2}-\d{2}/.test(s)) return s || ''; const [y, m, d] = s.slice(0, 10).split('-'); return d + '/' + m + '/' + y; };
  const umur = s => { if (!/^\d{4}-\d{2}-\d{2}/.test(s || '')) return ''; const b = new Date(s), n = new Date(); let u = n.getFullYear() - b.getFullYear(); if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) u--; return u >= 0 && u < 100 ? u : ''; };
  const waLink = t => { let n = String(t || '').replace(/\D/g, ''); if (!n) return ''; if (n[0] === '0') n = '62' + n.slice(1); else if (n[0] === '8') n = '62' + n; return 'https://wa.me/' + n; };
  const tsID = s => { const d = new Date(s); return isNaN(d) ? (s || '') : d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }); };
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[a[i], a[j]] = [a[j], a[i]]; } return a; };

  /* ---------------- Waktu lomba ---------------- */
  function parseW(s) {
    s = String(s || '').trim().replace(/,/g, '.');
    if (!s) return null;
    let m;
    if ((m = s.match(/^(\d+):(\d{1,2})(?:[.:](\d{1,3}))?$/))) return +m[1] * 60 + +m[2] + (m[3] ? +('0.' + m[3]) : 0);
    if ((m = s.match(/^(\d+)\.(\d{2})\.(\d{1,3})$/))) return +m[1] * 60 + +m[2] + +('0.' + m[3]);
    if (/^\d+(\.\d+)?$/.test(s)) return parseFloat(s);
    return null;
  }
  function fmtW(sec) {
    if (sec == null || isNaN(sec)) return '';
    if (sec < 60) return sec.toFixed(2);
    const m = Math.floor(sec / 60), r = sec - m * 60;
    return m + ':' + (r < 10 ? '0' : '') + r.toFixed(2);
  }
  function normW(s) {
    const t = String(s || '').trim().toUpperCase();
    if (!t) return '';
    if (/^(DNS|DNF|DQ|DSQ)$/.test(t)) return t === 'DSQ' ? 'DQ' : t;
    const v = parseW(t);
    return v == null ? null : fmtW(v);
  }

  /* ---------------- Olah data ---------------- */
  const kunciNama = s => String(s || '').toUpperCase().replace(/['’`]/g, '').replace(/\s+/g, ' ').trim();
  const kunciKat = s => String(s || '').toLowerCase().replace(/\s+/g, ' ').trim();
  let KAT = {}, KATE = {};
  function siapkan() {
    KAT = {}; (S.set.kategori || []).forEach(k => KAT[kunciKat(k.nama)] = k);
    KATE = {}; (S.set.kategori_estafet || []).forEach(k => KATE[kunciKat(k.nama)] = k);
    const hitung = {}, nama = {};
    S.reg.forEach((r, i) => {
      r.idx = i;
      r.jkN = /putri/i.test(r.jk) ? 'Putri' : /putra/i.test(r.jk) ? 'Putra' : '-';
      r.kats = String(r.kategori || '').split(',').map(x => x.trim()).filter(Boolean).map(x => (KAT[kunciKat(x)] || { nama: x }).nama);
      r.key = kunciNama(r.nama);
      r.bibCalc = null; r.dupSama = false;
      if (!r.valid || !r.key) return;
      const ks = r.kats.join(', ');
      hitung[ks] = (hitung[ks] || 0) + 1;
      const prev = nama[r.key];
      if (!prev) {
        const k = KAT[kunciKat(r.kats[0])];
        if (k) r.bibCalc = Number(k.awal) + hitung[ks] - 1;
        nama[r.key] = { bib: r.bibCalc, cats: new Set(r.kats) };
      } else if (r.kats.some(c => prev.cats.has(c))) {
        r.dupSama = true;
      } else {
        r.bibCalc = prev.bib; r.kats.forEach(c => prev.cats.add(c));
      }
    });
    S.reg.forEach(r => {
      r.bib = r.valid ? (r.dadaSheet != null ? r.dadaSheet : r.bibCalc) : null;
      const k = KAT[kunciKat(r.kats[0])];
      r.warna = k ? k.warna : '';
      r.lewat = !!(k && r.bib != null && (r.bib < k.awal || r.bib > k.akhir));
    });
    S.est.forEach(t => { t.kategori = (KATE[kunciKat(t.kategori)] || { nama: t.kategori }).nama; });
    hitungBadge();
  }
  const bibHtml = r => r.bib != null ? '<span class="bib ' + esc(r.warna) + '">' + nd(r.bib) + '</span>' : '<span class="bib none" title="' + (r.valid ? 'Duplikat kategori / belum ada nomor' : 'Belum divalidasi') + '">—</span>';
  // atlet unik tervalidasi per kategori & jk
  function peserta(kat, jk) {
    const seen = new Set();
    return S.reg.filter(r => r.valid && !r.dupSama && r.kats.includes(kat) && r.jkN === jk && !seen.has(r.key) && seen.add(r.key))
      .map(r => ({ dada: nd(r.bib), nama: r.nama, klub: r.klub, reg: r }));
  }
  function timEstafet(kat) { return S.est.filter(t => t.kategori === kat && t.valid).map(t => ({ dada: '', nama: t.tim || t.klub, klub: t.klub })); }
  function daftarNomor() {
    const out = [];
    (S.set.kategori || []).forEach(k => JK.forEach(j => out.push({ key: k.nama + '|' + j, kat: k.nama, jk: j, label: k.nama + ' • ' + j, estafet: false })));
    (S.set.kategori_estafet || []).forEach(k => out.push({ key: 'Estafet ' + k.nama + '|-', kat: 'Estafet ' + k.nama, jk: '-', label: 'Estafet ' + k.nama, estafet: true, katE: k.nama }));
    return out;
  }
  const nomorDari = key => daftarNomor().find(n => n.key === key);
  const entriNomor = n => n.estafet ? timEstafet(n.katE) : peserta(n.kat, n.jk);
  const barisSeri = (kat, jk, babak) => S.seri.filter(r => r.kategori === kat && r.jk === jk && r.babak === babak).sort((a, b) => a.seri - b.seri || a.lintasan - b.lintasan);
  function urutkanHasil(rows) {
    return rows.map(r => ({ r, t: parseW(r.waktu) })).sort((a, b) => (a.t == null) - (b.t == null) || (a.t - b.t) || a.r.seri - b.r.seri).map((x, i, arr) => {
      let rank = null;
      if (x.t != null) { rank = i + 1; if (i > 0 && arr[i - 1].t === x.t) rank = arr[i - 1].rank; }
      x.rank = rank; return x;
    });
  }
  function urutanTengah(n) { const c = Math.ceil(n / 2), o = [c]; for (let d = 1; o.length < n; d++) { if (c + d <= n) o.push(c + d); if (c - d >= 1 && o.length < n) o.push(c - d); } return o; }
  function juara(n) {
    const fin = barisSeri(n.kat, n.jk, 'Final'), pen = barisSeri(n.kat, n.jk, 'Penyisihan');
    const adaFinal = fin.some(r => parseW(r.waktu) != null);
    const sumber = adaFinal ? fin : pen;
    const h = urutkanHasil(sumber).filter(x => x.t != null).slice(0, 3);
    return { status: adaFinal ? 'Final' : (h.length ? 'Sementara' : 'Menunggu'), list: h };
  }

  function normUkuran(u) {
    let s = String(u || '').toUpperCase().replace(/\s+/g, ' ').trim();
    if (!s) return '(Kosong)';
    if (/ANAK|KIDS/.test(s)) { s = s.replace(/ANAK/, 'ANAK'); return s.replace(/\s*KIDS/, ' KIDS').trim(); }
    if (/^DEWASA/.test(s)) return s.replace(/^DEWASA\s*-?\s*/, 'DEWASA - ');
    const m = s.match(/^(XXS|XS|S|M|L|XL|XXL|2XL|3XL)(\s*DEWASA)?$/);
    if (m) return 'DEWASA - ' + (m[1] === '2XL' ? 'XXL' : m[1]);
    return s;
  }
  const urutUkuran = ['XXS ANAK', 'S KIDS', 'M KIDS', 'L KIDS', 'XL KIDS', 'XL2 KIDS', 'XXL KIDS', 'DEWASA - XS', 'DEWASA - S', 'DEWASA - M', 'DEWASA - L', 'DEWASA - XL', 'DEWASA - XXL'];
  const idxUkuran = u => { const i = urutUkuran.indexOf(u); return i < 0 ? 99 : i; };

  function hitungBadge() {
    const n = S.reg.filter(r => !r.valid).length;
    const b = $('#badge-valid'); if (b) { b.textContent = n; b.classList.toggle('hidden', !n); }
  }

  /* ---------------- Muat data ---------------- */
  async function muat(pesan) {
    const d = await act(pesan || 'Mengambil data dari spreadsheet…', () => BSR.call('muat'));
    if (!d) return false;
    S.set = d.pengaturan; S.reg = d.pendaftar || []; S.est = d.estafet || []; S.seri = d.seri || []; if (d.form) S.form = d.form;
    siapkan();
    $('#acara-nama').textContent = S.set.nama_acara;
    const sy = $('#sync');
    sy.className = 'sync' + (BSR.demo ? ' demo' : '');
    sy.innerHTML = '<i></i>' + (BSR.demo ? 'Mode demo (data contoh)' : 'Tersinkron ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    return true;
  }
  async function perbaruiReg(p) { const r = await p; if (r) { S.reg = r; siapkan(); render(); } return r; }

  /* ================================================================== */
  /*  HALAMAN                                                            */
  /* ================================================================== */
  const HAL = {};
  const judulHal = { dasbor: 'Dasbor', pendaftar: 'Pendaftar & Validasi', rekap: 'Rekap Pendaftaran', duplikasi: 'Cek Duplikasi', baju: 'Data Baju Atlet', estafet: 'Estafet', seri: 'Seri & Catatan Waktu', podium: 'Podium Juara', nomor: 'Nomor Dada & Race Pack', form: 'Google Form', pengaturan: 'Pengaturan' };

  function render() {
    if (!S.set) return;
    let h = (location.hash || '#dasbor').slice(1);
    if (!HAL[h]) h = 'dasbor';
    $$('.nav-link[data-page]').forEach(a => a.setAttribute('aria-current', a.dataset.page === h ? 'page' : 'false'));
    $('#where').textContent = judulHal[h];
    document.title = judulHal[h] + ' — ' + S.set.nama_acara;
    HAL[h]($('#content'));
    $('#side').classList.remove('open'); $('#scrim').classList.remove('show');
  }

  const head = (judul, sub, kanan) => '<div class="page-head"><div><h1>' + esc(judul) + '</h1>' + (sub ? '<p>' + sub + '</p>' : '') + '</div><div class="toolbar">' + (kanan || '') + '</div></div>';
  const kosong = (pesan, ikon) => '<div class="empty">' + ic(ikon || 'search') + esc(pesan) + '</div>';

  /* ---------- DASBOR ---------- */
  function statistik() {
    const valid = S.reg.filter(r => r.valid);
    const unik = new Set(valid.map(r => r.key));
    const slot = valid.filter(r => !r.dupSama).reduce((s, r) => s + r.kats.length, 0);
    const multi = {}; valid.forEach(r => { if (!r.dupSama) multi[r.key] = (multi[r.key] || 0) + r.kats.length; });
    const timValid = S.est.filter(t => t.valid).length;
    return {
      total: S.reg.length, valid: valid.length, pending: S.reg.length - valid.length, unik: unik.size, slot,
      putra: new Set(valid.filter(r => r.jkN === 'Putra').map(r => r.key)).size, putri: new Set(valid.filter(r => r.jkN === 'Putri').map(r => r.key)).size,
      multi: Object.values(multi).filter(n => n > 1).length, tim: S.est.length, timValid,
      dana: slot * Number(S.set.biaya || 0) + timValid * 0,
    };
  }
  HAL.dasbor = el => {
    const st = statistik();
    const rows = (S.set.kategori || []).map(k => {
      const a = peserta(k.nama, 'Putra').length, b = peserta(k.nama, 'Putri').length; return { k, a, b };
    });
    const max = Math.max(1, ...rows.map(r => r.a + r.b));
    const L = Number(S.set.lintasan_penyisihan) || 6;
    const seriTotal = rows.reduce((s, r) => s + Math.ceil(r.a / L) + Math.ceil(r.b / L), 0);
    const baru = S.reg.slice().sort((x, y) => String(y.ts).localeCompare(String(x.ts))).slice(0, 7);
    el.innerHTML = head(S.set.nama_acara, esc([S.set.tanggal, S.set.lokasi].filter(Boolean).join(' • ')),
      '<a class="btn" href="daftar.html" target="_blank" rel="noopener">' + ic('ext') + 'Halaman daftar</a><button class="btn btn-brand" id="ekspor-semua">' + ic('xls') + 'Ekspor semua (Excel)</button>') +
      '<div class="kpis">' +
      kpi('Atlet unik tervalidasi', angka(st.unik), angka(st.putra) + ' putra • ' + angka(st.putri) + ' putri', 'hl') +
      kpi('Slot lomba', angka(st.slot), 'pendaftaran per kategori') +
      kpi('Menunggu validasi', angka(st.pending), 'dari ' + angka(st.total) + ' data masuk', st.pending ? 'warn' : '') +
      kpi('Multi-kategori', angka(st.multi), 'atlet ikut > 1 lomba') +
      kpi('Tim estafet', angka(st.tim), angka(st.timValid) + ' tervalidasi') +
      kpi('Estimasi dana masuk', rp(st.dana).replace(' ', ' '), rp(S.set.biaya) + ' × slot valid', 'sm') +
      '</div>' +
      '<div class="cols-2-1"><div class="card"><div class="card-head"><h2>Peserta per kategori</h2><span class="muted small">≈ ' + seriTotal + ' seri penyisihan (' + L + ' lintasan)</span></div>' +
      '<div class="legend"><span><i style="background:var(--tartan)"></i>Putra</span><span><i style="background:#FFD23F"></i>Putri</span></div><div class="bars">' +
      rows.map(r => '<div class="bar-row"><span class="nowrap" title="' + esc(r.k.nama) + '">' + esc(r.k.nama) + '</span><div class="bar-track" role="img" aria-label="' + esc(r.k.nama) + ': ' + r.a + ' putra, ' + r.b + ' putri"><div class="bar-a" style="width:' + (r.a / max * 100) + '%"></div><div class="bar-b" style="width:' + (r.b / max * 100) + '%"></div></div><b class="num" style="text-align:right">' + (r.a + r.b) + '</b></div>').join('') +
      '</div></div>' +
      '<div class="card"><div class="card-head"><h2>Pendaftar terbaru</h2><a href="#pendaftar" class="small">Lihat semua</a></div>' +
      (baru.length ? '<div class="stack" style="gap:10px">' + baru.map(r => '<div style="display:flex;gap:10px;align-items:center;justify-content:space-between"><div style="min-width:0"><div class="name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(r.nama) + '</div><div class="sub-line">' + esc(r.kats.join(', ')) + ' • ' + esc(r.klub) + '</div></div>' + (r.valid ? '<span class="tag ok">Valid</span>' : '<span class="tag warn">Menunggu</span>') + '</div>').join('') + '</div>' : kosong('Belum ada pendaftar.')) +
      '</div></div>' +
      '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Langkah hari lomba</h2></div><div class="cols">' +
      langkah('1', 'Validasi pembayaran', st.pending + ' data menunggu dicek buktinya.', '#pendaftar', 'Buka pendaftar') +
      langkah('2', 'Cetak nomor dada & race pack', 'PDF nomor dada siap cetak, daftar ambil per klub.', '#nomor', 'Nomor dada') +
      langkah('3', 'Susun seri & start list', 'Seri otomatis ' + L + ' lintasan, klub dipisah.', '#seri', 'Seri & waktu') +
      langkah('4', 'Isi waktu → final → podium', 'Final ' + (S.set.lintasan_final || 8) + ' waktu terbaik, podium otomatis.', '#podium', 'Podium') +
      '</div></div>';
    $('#ekspor-semua').onclick = () => act('Menyusun workbook lengkap…', eksporSemua);
  };
  const kpi = (lbl, val, sub, cls) => '<div class="kpi ' + (cls || '') + '"><div class="lbl">' + esc(lbl) + '</div><div class="val">' + val + '</div><div class="sub">' + esc(sub || '') + '</div></div>';
  const langkah = (n, j, t, href, b) => '<div style="display:flex;gap:12px"><span class="rank" style="background:var(--brand);color:var(--on-brand);flex:none">' + n + '</span><div><b>' + esc(j) + '</b><p class="muted small" style="margin:2px 0 6px">' + esc(t) + '</p><a class="small" href="' + href + '">' + esc(b) + ' →</a></div></div>';

  /* ---------- PENDAFTAR ---------- */
  function saringReg() {
    const f = UI.f, q = f.q.toLowerCase();
    let list = S.reg.filter(r =>
      (!f.kat || r.kats.includes(f.kat)) && (!f.jk || r.jkN === f.jk) &&
      (!f.status || (f.status === 'valid' ? r.valid : f.status === 'menunggu' ? !r.valid : f.status === 'masalah' ? (r.dupSama || r.lewat || (r.valid && r.bib == null)) : true)) &&
      (!q || (r.nama + ' ' + r.klub + ' ' + (r.bib == null ? '' : r.bib + ' ' + nd(r.bib)) + ' ' + r.telp + ' ' + r.nik).toLowerCase().includes(q)));
    const k = f.sort, d = f.dir === 'asc' ? 1 : -1;
    const val = r => k === 'bib' ? (r.bib == null ? 1e9 : r.bib) : k === 'ts' ? r.idx : String(r[k] || '').toLowerCase();
    list.sort((a, b) => (val(a) > val(b) ? 1 : val(a) < val(b) ? -1 : 0) * d);
    return list;
  }
  HAL.pendaftar = el => {
    const f = UI.f;
    const list = saringReg();
    const per = 100, hal = Math.max(1, Math.ceil(list.length / per));
    if (f.page > hal) f.page = hal;
    const tampil = list.slice((f.page - 1) * per, f.page * per);
    const opsiKat = '<option value="">Semua kategori</option>' + S.set.kategori.map(k => '<option' + (f.kat === k.nama ? ' selected' : '') + '>' + esc(k.nama) + '</option>').join('');
    const th = (k, l, cls) => '<th class="sortable ' + (cls || '') + '" data-sort="' + k + '"' + (f.sort === k ? ' data-dir="' + f.dir + '"' : '') + '>' + l + '</th>';
    el.innerHTML = head('Pendaftar & Validasi', angka(S.reg.length) + ' data dari Google Form & web • nomor dada dibuat otomatis setelah pembayaran divalidasi',
      '<button class="btn btn-brand" id="tambah">' + ic('plus') + 'Tambah atlet</button>' +
      menuEkspor('m-reg', [['xlsLengkap', 'Excel — data lengkap (dengan NIK & HP)', 'xls'], ['xlsAman', 'Excel — tanpa data pribadi', 'xls'], '-', ['pdfPeserta', 'PDF — daftar peserta per kategori', 'pdf'], ['pdfBelum', 'PDF — daftar belum validasi', 'pdf']])) +
      '<div class="card" style="padding:14px;margin-bottom:12px"><div class="toolbar">' +
      '<label class="search"><span class="sr">Cari</span>' + ic('search') + '<input class="input" id="q" placeholder="Cari nama, klub, no. dada, HP, NIK…" value="' + esc(f.q) + '"></label>' +
      '<select class="input" id="fkat" style="max-width:210px" aria-label="Kategori">' + opsiKat + '</select>' +
      '<div class="seg" id="fjk">' + ['', 'Putra', 'Putri'].map(j => '<button aria-pressed="' + (f.jk === j) + '" data-v="' + j + '">' + (j || 'Semua') + '</button>').join('') + '</div>' +
      '<div class="seg" id="fst">' + [['', 'Semua'], ['menunggu', 'Menunggu'], ['valid', 'Valid'], ['masalah', 'Perlu dicek']].map(s => '<button aria-pressed="' + (f.status === s[0]) + '" data-v="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>' +
      '</div><div class="toolbar" id="bulk" style="margin-top:10px' + (UI.sel.size ? '' : ';display:none') + '"><b>' + UI.sel.size + ' dipilih</b><button class="btn btn-sm btn-brand" id="b-valid">' + ic('check') + 'Validasi</button><button class="btn btn-sm" id="b-batal">Batalkan validasi</button><button class="btn btn-sm btn-ghost" id="b-clear">Kosongkan pilihan</button></div></div>' +
      '<div class="table-wrap"><table class="t wide"><thead><tr><th class="c"><input type="checkbox" id="all" aria-label="Pilih semua di halaman ini"></th>' + th('bib', 'No. Dada', 'c') + th('nama', 'Atlet') + th('klub', 'Club / Sekolah') + th('kategori', 'Kategori') + '<th>Baju</th><th>Kontak</th><th class="c">Bukti</th>' + th('ts', 'Status') + '<th class="r">Aksi</th></tr></thead><tbody>' +
      (tampil.length ? tampil.map(r => '<tr data-id="' + esc(r.id) + '"><td class="c"><input type="checkbox" class="sel" ' + (UI.sel.has(r.id) ? 'checked' : '') + ' aria-label="Pilih ' + esc(r.nama) + '"></td>' +
        '<td class="c">' + bibHtml(r) + (r.lewat ? '<div class="sub-line" style="color:var(--bad)">di luar rentang</div>' : '') + '</td>' +
        '<td><div class="name">' + esc(r.nama) + '</div><div class="sub-line">' + esc(r.jkN) + ' • ' + esc(tglID(r.tgl)) + (umur(r.tgl) !== '' ? ' (' + umur(r.tgl) + ' th)' : '') + '</div></td>' +
        '<td>' + esc(r.klub) + '</td><td>' + r.kats.map(esc).join('<br>') + (r.dupSama ? '<div><span class="tag bad">Daftar ganda</span></div>' : '') + '</td>' +
        '<td class="nowrap">' + esc(r.ukuran) + '</td>' +
        '<td class="nowrap">' + (r.telp ? '<a href="' + waLink(r.telp) + '" target="_blank" rel="noopener" title="Chat WhatsApp">' + esc(r.telp) + '</a>' : '<span class="muted">—</span>') + '<div class="sub-line">NIK ' + esc(r.nik ? r.nik.slice(0, 6) + '••••' + r.nik.slice(-2) : '—') + '</div></td>' +
        '<td class="c">' + (r.bukti ? '<a class="btn btn-sm btn-icon" href="' + esc(r.bukti) + '" target="_blank" rel="noopener" title="Lihat bukti bayar" aria-label="Lihat bukti bayar">' + ic('eye') + '</a>' : '<span class="muted">—</span>') + '</td>' +
        '<td><button class="btn btn-sm tgl ' + (r.valid ? '' : 'btn-accent') + '" title="Klik untuk mengubah">' + (r.valid ? '<span class="tag ok">' + ic('check') + 'Valid</span>' : 'Validasi') + '</button><div class="sub-line">' + esc(tsID(r.ts)) + '</div></td>' +
        '<td class="r nowrap"><button class="btn btn-sm btn-icon ubah" aria-label="Ubah ' + esc(r.nama) + '">' + ic('edit') + '</button><button class="btn btn-sm btn-icon btn-danger hapus" aria-label="Hapus ' + esc(r.nama) + '">' + ic('trash') + '</button></td></tr>').join('')
        : '<tr><td colspan="10">' + kosong('Tidak ada data yang cocok dengan saringan.') + '</td></tr>') +
      '</tbody></table></div>' +
      '<div class="toolbar" style="justify-content:space-between;margin-top:12px"><span class="muted small">Menampilkan ' + (tampil.length ? ((f.page - 1) * per + 1) + '–' + ((f.page - 1) * per + tampil.length) : 0) + ' dari ' + angka(list.length) + '</span>' +
      '<div class="toolbar"><button class="btn btn-sm" id="prev" ' + (f.page <= 1 ? 'disabled' : '') + '>‹ Sebelumnya</button><span class="small">Hal ' + f.page + '/' + hal + '</span><button class="btn btn-sm" id="next" ' + (f.page >= hal ? 'disabled' : '') + '>Berikutnya ›</button></div></div>';

    let tq;
    $('#q').oninput = e => { clearTimeout(tq); tq = setTimeout(() => { f.q = e.target.value; f.page = 1; HAL.pendaftar(el); const i = $('#q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 250); };
    $('#fkat').onchange = e => { f.kat = e.target.value; f.page = 1; HAL.pendaftar(el); };
    $$('#fjk button').forEach(b => b.onclick = () => { f.jk = b.dataset.v; f.page = 1; HAL.pendaftar(el); });
    $$('#fst button').forEach(b => b.onclick = () => { f.status = b.dataset.v; f.page = 1; HAL.pendaftar(el); });
    $$('th[data-sort]').forEach(t => t.onclick = () => { if (f.sort === t.dataset.sort) f.dir = f.dir === 'asc' ? 'desc' : 'asc'; else { f.sort = t.dataset.sort; f.dir = 'asc'; } HAL.pendaftar(el); });
    $('#prev').onclick = () => { f.page--; HAL.pendaftar(el); };
    $('#next').onclick = () => { f.page++; HAL.pendaftar(el); };
    $('#all').onchange = e => { tampil.forEach(r => e.target.checked ? UI.sel.add(r.id) : UI.sel.delete(r.id)); HAL.pendaftar(el); };
    $$('.sel').forEach(c => c.onchange = () => { const id = c.closest('tr').dataset.id; c.checked ? UI.sel.add(id) : UI.sel.delete(id); const b = $('#bulk'); b.style.display = UI.sel.size ? '' : 'none'; b.querySelector('b').textContent = UI.sel.size + ' dipilih'; });
    $('#b-clear').onclick = () => { UI.sel.clear(); HAL.pendaftar(el); };
    const massal = async v => { const ids = [...UI.sel]; if (!ids.length) return; if (!(await konfirmasi(v ? 'Validasi pembayaran' : 'Batalkan validasi', (v ? 'Tandai ' : 'Batalkan ') + ids.length + ' pendaftar sebagai ' + (v ? '<b>sudah bayar</b>' : '<b>belum bayar</b>') + '? Nomor dada akan menyesuaikan.', v ? 'Ya, validasi' : 'Ya, batalkan'))) return; await perbaruiReg(act('Menyimpan validasi…', () => BSR.call('setValid', { ids, valid: v }))); UI.sel.clear(); render(); toast('Validasi tersimpan ke spreadsheet.', 'ok'); };
    $('#b-valid').onclick = () => massal(true);
    $('#b-batal').onclick = () => massal(false);
    $$('tr[data-id]').forEach(tr => {
      const r = S.reg.find(x => x.id === tr.dataset.id);
      $('.tgl', tr).onclick = async () => { const ok = await perbaruiReg(act(r.valid ? 'Membatalkan validasi…' : 'Memvalidasi…', () => BSR.call('setValid', { id: r.id, valid: !r.valid }))); if (ok) toast((r.valid ? 'Divalidasi: ' : 'Dibatalkan: ') + r.nama, 'ok'); };
      $('.ubah', tr).onclick = () => formAtlet(r);
      $('.hapus', tr).onclick = async () => { if (await konfirmasi('Hapus pendaftar', 'Hapus <b>' + esc(r.nama) + '</b> (' + esc(r.kategori) + ') dari spreadsheet? Baris akan dihapus dan tidak bisa dibatalkan dari web.', 'Hapus', true)) { await perbaruiReg(act('Menghapus…', () => BSR.call('hapus', { id: r.id }))); toast('Data dihapus.', 'ok'); } };
    });
    $('#tambah').onclick = () => formAtlet(null);
    bindEkspor({
      xlsLengkap: () => X.excel('Data Pendaftar Lengkap - ' + S.set.nama_acara, [defPendaftar(list, true)]),
      xlsAman: () => X.excel('Data Pendaftar - ' + S.set.nama_acara, [defPendaftar(list, false)]),
      pdfPeserta: () => X.pdf('Daftar Peserta - ' + S.set.nama_acara, Object.assign({ orientasi: 'landscape', judul: 'Daftar Peserta per Kategori', sub: 'Atlet dengan pembayaran tervalidasi' }, defPesertaBlok())),
      pdfBelum: () => { const b = defPendaftar(S.reg.filter(r => !r.valid), false); return X.pdf('Belum Validasi - ' + S.set.nama_acara, { orientasi: 'landscape', judul: 'Daftar Pendaftar Belum Divalidasi', sub: 'Mohon segera konfirmasi pembayaran ke panitia', blok: [b.blok[0]] }); },
    });
  };

  function formAtlet(r) {
    const a = r || { nama: '', klub: '', jk: 'Putra', tgl: '', kats: [], ukuran: '', telp: '', nik: '', bukti: '' };
    const d = dialog({
      title: r ? 'Ubah data atlet' : 'Tambah atlet', wide: true,
      body: '<form id="fa"><div class="grid-2">' +
        '<label class="field"><span>Nama atlet</span><input class="input" name="nama" required value="' + esc(a.nama) + '"></label>' +
        '<label class="field"><span>Club / asal sekolah</span><input class="input" name="klub" required value="' + esc(a.klub) + '"></label>' +
        '<label class="field"><span>Jenis kelamin</span><select class="input" name="jk">' + JK.map(j => '<option' + ((r ? r.jkN : a.jk) === j ? ' selected' : '') + '>' + j + '</option>').join('') + '</select></label>' +
        '<label class="field"><span>Tanggal lahir</span><input class="input" type="date" name="tgl" value="' + esc(/^\d{4}-\d{2}-\d{2}$/.test(a.tgl) ? a.tgl : '') + '"></label>' +
        '<label class="field"><span>Ukuran baju</span><select class="input" name="ukuran"><option value="">— pilih —</option>' + S.set.ukuran.map(u => '<option' + (String(a.ukuran).toLowerCase() === u.toLowerCase() ? ' selected' : '') + '>' + esc(u) + '</option>').join('') + (a.ukuran && !S.set.ukuran.some(u => u.toLowerCase() === String(a.ukuran).toLowerCase()) ? '<option selected>' + esc(a.ukuran) + '</option>' : '') + '</select></label>' +
        '<label class="field"><span>No. telepon / WA</span><input class="input" name="telp" inputmode="tel" value="' + esc(a.telp) + '"></label>' +
        '<label class="field"><span>NIK</span><input class="input" name="nik" inputmode="numeric" maxlength="16" value="' + esc(a.nik) + '"></label>' +
        '<label class="field"><span>Link bukti bayar (opsional)</span><input class="input" name="bukti" value="' + esc(a.bukti) + '"></label>' +
        '</div><fieldset class="field" style="border:0;padding:0"><span>Kategori perlombaan</span><div class="toolbar" style="gap:6px 16px">' +
        S.set.kategori.map(k => '<label class="check"><input type="checkbox" name="kat" value="' + esc(k.nama) + '"' + ((r ? r.kats : a.kats).includes(k.nama) ? ' checked' : '') + '>' + esc(k.nama) + '</label>').join('') +
        '</div></fieldset>' + (r ? '' : '<p class="note small">Data baru masuk ke tab <b>Form Responses 1</b> dengan status belum divalidasi.</p>') + '</form>',
      foot: '<button class="btn" data-close>Batal</button><button class="btn btn-brand" id="simpan-atlet">' + ic('save') + 'Simpan</button>',
    });
    $('#simpan-atlet', d).onclick = async () => {
      const fm = $('#fa', d);
      if (!fm.reportValidity()) return;
      const v = Object.fromEntries(new FormData(fm));
      v.kategori = $$('input[name=kat]:checked', fm).map(c => c.value);
      if (!v.kategori.length) { toast('Pilih minimal satu kategori.', 'err'); return; }
      if (r) v.id = r.id;
      const res = await act('Menyimpan ke spreadsheet…', () => BSR.call(r ? 'ubah' : 'tambah', v));
      if (res === undefined) return;
      d.close();
      if (r) { S.reg = res; siapkan(); render(); } else { const l = await act('Memuat ulang…', () => BSR.call('pendaftar')); if (l) { S.reg = l; siapkan(); render(); } }
      toast('Tersimpan.', 'ok');
    };
  }

  /* --- definisi ekspor --- */
  function defPendaftar(list, lengkap) {
    const kolom = [{ h: 'No', w: 5, pw: 9, align: 'center' }, { h: 'Waktu Daftar', w: 17 }, { h: 'No. Dada', w: 9, align: 'center', tebal: true, teks: true }, { h: 'Nama Atlet', w: 32, tebal: true }, { h: 'Club / Sekolah', w: 32 }, { h: 'L/P', w: 7, align: 'center' }, { h: 'Tgl Lahir', w: 12, align: 'center' }, { h: 'Umur', w: 6, align: 'center' }, { h: 'Kategori', w: 22 }, { h: 'Ukuran Baju', w: 14 }];
    if (lengkap) kolom.push({ h: 'No. Telp', w: 15, teks: true }, { h: 'NIK', w: 19, teks: true }, { h: 'Link Bukti Bayar', w: 40 });
    kolom.push({ h: 'Status Bayar', w: 13, align: 'center' });
    const baris = list.map((r, i) => {
      const b = [i + 1, tsID(r.ts), nd(r.bib), r.nama, r.klub, r.jkN, tglID(r.tgl), umur(r.tgl), r.kats.join(', '), r.ukuran];
      if (lengkap) b.push(r.telp, r.nik, r.bukti);
      b.push(r.valid ? (r.dupSama ? 'Valid (ganda)' : 'Valid') : 'Menunggu');
      return b;
    });
    return { nama: lengkap ? 'Pendaftar Lengkap' : 'Pendaftar', judul: 'Data Pendaftar Atlet', sub: angka(list.length) + ' data • diekspor ' + new Date().toLocaleString('id-ID'), blok: [{ kolom, baris }] };
  }
  function defPesertaBlok() {
    const kolom = [{ h: 'No', w: 5, pw: 10, align: 'center' }, { h: 'No. Dada', w: 9, pw: 18, align: 'center', tebal: true, teks: true }, { h: 'Nama Atlet', w: 34, tebal: true }, { h: 'Club / Sekolah', w: 34 }, { h: 'Tgl Lahir', w: 12, pw: 24, align: 'center' }, { h: 'Ukuran Baju', w: 14, pw: 28 }];
    const blok = [];
    S.set.kategori.forEach(k => JK.forEach(j => {
      const p = peserta(k.nama, j).sort((a, b) => (+a.dada || 1e9) - (+b.dada || 1e9));
      if (!p.length) return;
      blok.push({ judul: k.nama + ' — ' + j, kanan: p.length + ' atlet', kolom, baris: p.map((x, i) => [i + 1, x.dada, x.nama, x.klub, tglID(x.reg.tgl), x.reg.ukuran]) });
    }));
    return { blok };
  }

  /* ---------- REKAP ---------- */
  function defRekapKategori() {
    const L = Number(S.set.lintasan_penyisihan) || 6, T = Number(S.set.tim_estafet_per_seri) || 4;
    const baris = S.set.kategori.map(k => { const a = peserta(k.nama, 'Putra').length, b = peserta(k.nama, 'Putri').length; return [k.nama, nd(k.awal) + '–' + nd(k.akhir), a, b, a + b, Math.ceil(a / L), Math.ceil(b / L), (a + b) > (k.akhir - k.awal + 1) ? 'Melebihi kuota!' : (k.akhir - k.awal + 1) - (a + b) + ' sisa']; });
    const ea = S.est.filter(t => t.valid && /putra/i.test(t.kategori)).length, eb = S.est.filter(t => t.valid && /putri/i.test(t.kategori)).length;
    baris.push(['Estafet (tim)', '910–997', ea, eb, ea + eb, Math.ceil(ea / T), Math.ceil(eb / T), (ea + eb) * 4 + ' pelari']);
    const sum = i => baris.reduce((s, r) => s + (Number(r[i]) || 0), 0);
    return {
      nama: 'Rekap Kategori', judul: 'Rekap Pendaftaran per Kategori', sub: 'Hanya pendaftar dengan pembayaran tervalidasi • estimasi seri: ' + L + ' lintasan (estafet ' + T + ' tim)',
      blok: [{ kolom: [{ h: 'Kategori Perlombaan', w: 26, pw: 48, tebal: true }, { h: 'Rentang No. Dada', w: 15, align: 'center' }, { h: 'Putra', w: 9, align: 'center' }, { h: 'Putri', w: 9, align: 'center' }, { h: 'Total Slot', w: 11, align: 'center', tebal: true }, { h: 'Seri Putra', w: 10, align: 'center' }, { h: 'Seri Putri', w: 10, align: 'center' }, { h: 'Kuota', w: 16, align: 'center' }], baris, total: ['TOTAL KESELURUHAN', '', sum(2), sum(3), sum(4), sum(5), sum(6), ''] }],
    };
  }
  function rekapKlub() {
    const m = {};
    S.reg.forEach(r => {
      const k = String(r.klub || '(tanpa nama)').toUpperCase().replace(/\s+/g, ' ').trim();
      const o = m[k] || (m[k] = { klub: k, atlet: new Set(), slot: 0, pa: new Set(), pi: new Set(), pending: 0 });
      if (!r.valid) { o.pending++; return; }
      if (r.dupSama) return;
      o.atlet.add(r.key); o.slot += r.kats.length; (r.jkN === 'Putri' ? o.pi : o.pa).add(r.key);
    });
    S.est.forEach(t => { const k = String(t.klub || '').toUpperCase().replace(/\s+/g, ' ').trim(); const o = m[k] || (m[k] = { klub: k, atlet: new Set(), slot: 0, pa: new Set(), pi: new Set(), pending: 0 }); o.tim = (o.tim || 0) + (t.valid ? 1 : 0); });
    return Object.values(m).map(o => ({ klub: o.klub, atlet: o.atlet.size, pa: o.pa.size, pi: o.pi.size, slot: o.slot, tim: o.tim || 0, pending: o.pending, biaya: o.slot * Number(S.set.biaya || 0) })).sort((a, b) => b.atlet - a.atlet || a.klub.localeCompare(b.klub));
  }
  function defRekapKlub() {
    const l = rekapKlub();
    const baris = l.map((o, i) => [i + 1, o.klub, o.atlet, o.pa, o.pi, o.slot, o.tim, o.pending, o.biaya]);
    const sum = i => baris.reduce((s, r) => s + r[i], 0);
    return { nama: 'Rekap Klub', judul: 'Rekap per Club / Sekolah', sub: l.length + ' club/sekolah • biaya = slot valid × ' + rp(S.set.biaya), blok: [{ kolom: [{ h: 'No', w: 5, pw: 10, align: 'center' }, { h: 'Club / Sekolah', w: 40, tebal: true }, { h: 'Atlet', w: 8, align: 'center' }, { h: 'Putra', w: 8, align: 'center' }, { h: 'Putri', w: 8, align: 'center' }, { h: 'Slot Lomba', w: 10, align: 'center' }, { h: 'Tim Estafet', w: 10, align: 'center' }, { h: 'Belum Valid', w: 10, align: 'center' }, { h: 'Biaya (Rp)', w: 15, align: 'right', fmt: '#,##0' }], baris: baris.map(r => r.slice(0, 8).concat([r[8]])), total: ['', 'TOTAL', sum(2), sum(3), sum(4), sum(5), sum(6), sum(7), sum(8)] }] };
  }
  HAL.rekap = el => {
    const a = defRekapKategori(), b = defRekapKlub();
    const tabel = (d, rpCol) => '<div class="table-wrap free"><table class="t"><thead><tr>' + d.kolom.map(k => '<th class="' + (k.align === 'center' ? 'c' : k.align === 'right' ? 'r' : '') + '">' + esc(k.h) + '</th>').join('') + '</tr></thead><tbody>' +
      (d.baris.length ? d.baris.map(r => '<tr>' + r.map((v, i) => '<td class="' + (d.kolom[i].align === 'center' ? 'c num' : d.kolom[i].align === 'right' ? 'r num' : '') + (d.kolom[i].tebal ? ' name' : '') + '">' + (i === rpCol ? rp(v) : esc(v)) + '</td>').join('') + '</tr>').join('') : '<tr><td colspan="9">' + kosong('Belum ada data.') + '</td></tr>') +
      '</tbody>' + (d.total ? '<tfoot><tr>' + d.total.map((v, i) => '<td class="' + (d.kolom[i].align === 'center' ? 'c' : d.kolom[i].align === 'right' ? 'r' : '') + '">' + (i === rpCol && v !== '' ? rp(v) : esc(v)) + '</td>').join('') + '</tr></tfoot>' : '') + '</table></div>';
    el.innerHTML = head('Rekap Pendaftaran', 'Dihitung otomatis dari pendaftar tervalidasi (sama seperti tab REKAP PENDAFTARAN).',
      menuEkspor('m-rek', [['xls', 'Excel — rekap kategori + klub', 'xls'], ['pdf', 'PDF — rekap kategori + klub', 'pdf']])) +
      '<div class="stack"><div class="card"><div class="card-head"><h2>Distribusi kategori & seri</h2></div>' + tabel(a.blok[0]) + '</div>' +
      '<div class="card"><div class="card-head"><h2>Rekap per club / sekolah</h2><span class="muted small">' + b.blok[0].baris.length + ' club</span></div>' + tabel(b.blok[0], 8) + '</div></div>';
    bindEkspor({
      xls: () => X.excel('Rekap Pendaftaran - ' + S.set.nama_acara, [a, b]),
      pdf: () => X.pdf('Rekap Pendaftaran - ' + S.set.nama_acara, { judul: 'Rekap Pendaftaran', sub: 'Pendaftar tervalidasi per ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), blok: [Object.assign({ judul: 'Distribusi Kategori & Seri' }, a.blok[0]), Object.assign({ judul: 'Rekap per Club / Sekolah' }, b.blok[0], { baris: b.blok[0].baris.map(r => r.slice(0, 8).concat([angka(r[8])])), total: b.blok[0].total.slice(0, 8).concat([angka(b.blok[0].total[8])]) })], ttd: 'satu' }),
    });
  };

  /* ---------- DUPLIKASI ---------- */
  function cekDup() {
    const byName = {};
    S.reg.forEach(r => { (byName[r.key] = byName[r.key] || []).push(r); });
    const multi = [], ganda = [], nik = [];
    Object.values(byName).forEach(arr => {
      const v = arr.filter(r => r.valid);
      const kats = [...new Set(v.flatMap(r => r.kats))];
      if (kats.length > 1) {
        const r0 = v.find(r => r.bib != null) || v[0];
        const est = S.est.filter(t => t.pelari.some(p => kunciNama(p) === arr[0].key)).map(t => 'Estafet ' + t.kategori);
        multi.push({ bib: r0.bib, nama: r0.nama, klub: r0.klub, kats: kats.concat(est), n: kats.length + est.length });
      }
      const perKat = {};
      arr.forEach(r => r.kats.forEach(k => (perKat[k] = perKat[k] || []).push(r)));
      Object.entries(perKat).forEach(([k, rs]) => { if (rs.length > 1) ganda.push({ nama: rs[0].nama, kat: k, rows: rs }); });
    });
    const byNik = {};
    S.reg.forEach(r => { if (r.nik && r.nik.length >= 10) (byNik[r.nik] = byNik[r.nik] || []).push(r); });
    Object.entries(byNik).forEach(([n, rs]) => { const names = [...new Set(rs.map(r => r.key))]; if (names.length > 1) nik.push({ nik: n, rows: rs }); });
    // atlet estafet yang juga ikut perorangan
    return { multi: multi.sort((a, b) => b.n - a.n || a.nama.localeCompare(b.nama)), ganda, nik };
  }
  HAL.duplikasi = el => {
    const d = cekDup();
    el.innerHTML = head('Cek Duplikasi', 'Mendeteksi atlet multi-kategori, pendaftaran ganda di kategori yang sama, dan NIK yang dipakai nama berbeda.',
      menuEkspor('m-dup', [['xls', 'Excel — hasil audit', 'xls'], ['pdf', 'PDF — hasil audit', 'pdf']])) +
      '<div class="kpis">' + kpi('Atlet unik', angka(new Set(S.reg.filter(r => r.valid).map(r => r.key)).size), 'tervalidasi') + kpi('Multi-kategori', angka(d.multi.length), 'boleh, untuk cek baju & jadwal', d.multi.length ? 'warn' : '') + kpi('Daftar ganda', angka(d.ganda.length), 'nama sama, kategori sama', d.ganda.length ? 'bad' : '') + kpi('NIK bentrok', angka(d.nik.length), 'NIK sama, nama beda', d.nik.length ? 'bad' : '') + '</div>' +
      '<div class="stack">' +
      '<div class="card"><div class="card-head"><h2>Pendaftaran ganda (perlu dihapus salah satu)</h2></div>' + (d.ganda.length ? '<div class="table-wrap free"><table class="t"><thead><tr><th>Nama</th><th>Kategori</th><th>Data masuk</th><th class="r">Aksi</th></tr></thead><tbody>' +
        d.ganda.map(g => g.rows.map((r, i) => '<tr data-id="' + esc(r.id) + '">' + (i === 0 ? '<td rowspan="' + g.rows.length + '" class="name">' + esc(g.nama) + '</td><td rowspan="' + g.rows.length + '">' + esc(g.kat) + '</td>' : '') + '<td>' + esc(tsID(r.ts)) + ' • ' + esc(r.klub) + ' • ' + (r.valid ? '<span class="tag ok">Valid</span>' : '<span class="tag warn">Menunggu</span>') + ' ' + bibHtml(r) + '</td><td class="r"><button class="btn btn-sm btn-danger hapus">' + ic('trash') + 'Hapus baris ini</button></td></tr>').join('')).join('') +
        '</tbody></table></div>' : kosong('Tidak ada pendaftaran ganda. Mantap!', 'check')) + '</div>' +
      '<div class="card"><div class="card-head"><h2>Atlet multi-kategori</h2><span class="muted small">Termasuk estafet</span></div>' + (d.multi.length ? '<div class="table-wrap"><table class="t"><thead><tr><th class="c">No. Dada</th><th>Nama</th><th>Club / Sekolah</th><th>Kategori diikuti</th><th class="c">Jumlah</th></tr></thead><tbody>' +
        d.multi.map(m => '<tr><td class="c">' + (m.bib != null ? '<b class="num">' + nd(m.bib) + '</b>' : '—') + '</td><td class="name">' + esc(m.nama) + '</td><td>' + esc(m.klub) + '</td><td>' + m.kats.map(esc).join(', ') + '</td><td class="c"><span class="tag ' + (m.n > 2 ? 'bad' : 'warn') + '">' + m.n + ' kategori</span></td></tr>').join('') + '</tbody></table></div>' : kosong('Tidak ada atlet multi-kategori.')) + '</div>' +
      '<div class="card"><div class="card-head"><h2>NIK sama dengan nama berbeda</h2></div>' + (d.nik.length ? '<div class="table-wrap free"><table class="t"><thead><tr><th>NIK</th><th>Nama-nama</th></tr></thead><tbody>' + d.nik.map(n => '<tr><td class="mono">' + esc(n.nik) + '</td><td>' + n.rows.map(r => esc(r.nama) + ' <span class="muted small">(' + esc(r.kats.join(', ')) + ')</span>').join('<br>') + '</td></tr>').join('') + '</tbody></table></div>' : kosong('Tidak ada NIK bentrok.', 'check')) + '</div></div>';
    $$('tr[data-id] .hapus').forEach(b => b.onclick = async () => {
      const r = S.reg.find(x => x.id === b.closest('tr').dataset.id);
      if (await konfirmasi('Hapus data ganda', 'Hapus baris <b>' + esc(r.nama) + '</b> yang masuk ' + esc(tsID(r.ts)) + '?', 'Hapus', true)) await perbaruiReg(act('Menghapus…', () => BSR.call('hapus', { id: r.id })));
    });
    const blok = () => [
      { judul: 'Pendaftaran Ganda', kolom: [{ h: 'Nama', w: 32, tebal: true }, { h: 'Kategori', w: 20 }, { h: 'Club', w: 30 }, { h: 'Waktu Daftar', w: 18 }, { h: 'Status', w: 12, align: 'center' }], baris: d.ganda.flatMap(g => g.rows.map(r => [r.nama, g.kat, r.klub, tsID(r.ts), r.valid ? 'Valid' : 'Menunggu'])) },
      { judul: 'Atlet Multi-Kategori', kolom: [{ h: 'No. Dada', w: 10, align: 'center', teks: true }, { h: 'Nama', w: 32, tebal: true }, { h: 'Club / Sekolah', w: 30 }, { h: 'Kategori Diikuti', w: 45 }, { h: 'Jumlah', w: 9, align: 'center' }], baris: d.multi.map(m => [nd(m.bib), m.nama, m.klub, m.kats.join(', '), m.n]) },
      { judul: 'NIK Sama, Nama Berbeda', kolom: [{ h: 'NIK', w: 20, teks: true }, { h: 'Nama', w: 32 }, { h: 'Kategori', w: 30 }], baris: d.nik.flatMap(n => n.rows.map(r => [n.nik, r.nama, r.kats.join(', ')])) },
    ];
    bindEkspor({
      xls: () => X.excel('Cek Duplikasi - ' + S.set.nama_acara, blok().map(b => ({ nama: b.judul, judul: b.judul, blok: [{ kolom: b.kolom, baris: b.baris }] }))),
      pdf: () => X.pdf('Cek Duplikasi - ' + S.set.nama_acara, { judul: 'Audit Duplikasi Pendaftaran', blok: blok() }),
    });
  };

  /* ---------- BAJU ---------- */
  function dataBaju() {
    const total = {}, perKlub = {}, multi = [];
    const per = {};
    S.reg.forEach(r => {
      if (!r.valid || r.dupSama) return;
      const u = normUkuran(r.ukuran), n = r.kats.length;
      total[u] = (total[u] || 0) + n;
      const k = String(r.klub || '').toUpperCase().trim();
      (perKlub[k] = perKlub[k] || {})[u] = (perKlub[k][u] || 0) + n;
      const o = per[r.key] || (per[r.key] = { nama: r.nama, klub: r.klub, ukuran: [], kat: [] });
      r.kats.forEach(c => { o.ukuran.push(u); o.kat.push(c); });
    });
    Object.values(per).forEach(o => { if (o.kat.length > 1) multi.push(o); });
    const indiv = new Set(Object.keys(per));
    const hanyaEst = [];
    S.est.filter(t => t.valid).forEach(t => t.pelari.filter(Boolean).forEach(p => { if (!indiv.has(kunciNama(p))) hanyaEst.push({ nama: p, klub: t.klub, kat: 'Estafet ' + t.kategori }); }));
    const ukuran = Object.keys(total).sort((a, b) => idxUkuran(a) - idxUkuran(b) || a.localeCompare(b));
    return { total, perKlub, multi, hanyaEst, ukuran };
  }
  HAL.baju = el => {
    const b = dataBaju(), k1 = S.set.baju_kloter1 || {};
    const tot = b.ukuran.reduce((s, u) => s + b.total[u], 0);
    const kids = b.ukuran.filter(u => /KIDS|ANAK/.test(u)).reduce((s, u) => s + b.total[u], 0);
    el.innerHTML = head('Data Baju Atlet', '1 baju per kategori lomba perorangan yang tervalidasi. Peserta hanya-estafet tidak mendapat baju.',
      '<button class="btn btn-brand" id="simpan-k1">' + ic('save') + 'Simpan kloter 1 ke sheet</button>' + menuEkspor('m-baju', [['xls', 'Excel — rekap baju lengkap', 'xls'], ['pdf', 'PDF — rekap cetak baju', 'pdf'], ['pdfKlub', 'PDF — pembagian baju per klub', 'pdf']])) +
      '<div class="kpis">' + kpi('Total baju', angka(tot), 'semua ukuran', 'hl') + kpi('Ukuran anak (Kids)', angka(kids), '') + kpi('Ukuran dewasa', angka(tot - kids), '') + kpi('Dapat > 1 baju', angka(b.multi.length), 'atlet multi-kategori') + kpi('Hanya estafet', angka(b.hanyaEst.length), 'tidak dapat baju') + '</div>' +
      '<div class="cols"><div class="card"><div class="card-head"><h2>Rekap cetak per kloter</h2><span class="muted small">Kloter 1 tersambung ke tab DATA BAJU ATLET</span></div><div class="table-wrap free"><table class="t"><thead><tr><th>Ukuran</th><th class="c">Total data</th><th class="c">Kloter 1 (sudah cetak)</th><th class="c">Kloter 2 (akan cetak)</th></tr></thead><tbody>' +
      b.ukuran.map(u => { const s = Number(k1[u] || 0); return '<tr><td class="name">' + esc(u) + '</td><td class="c num">' + b.total[u] + '</td><td class="c"><input class="input input-sm num k1" data-u="' + esc(u) + '" type="number" min="0" value="' + s + '" style="width:90px;text-align:center" aria-label="Kloter 1 ' + esc(u) + '"></td><td class="c num"><b style="color:' + (b.total[u] - s > 0 ? 'var(--warn)' : 'var(--ok)') + '">' + Math.max(0, b.total[u] - s) + '</b></td></tr>'; }).join('') +
      '</tbody><tfoot><tr><td>TOTAL</td><td class="c">' + tot + '</td><td class="c">' + b.ukuran.reduce((s, u) => s + Number(k1[u] || 0), 0) + '</td><td class="c">' + b.ukuran.reduce((s, u) => s + Math.max(0, b.total[u] - Number(k1[u] || 0)), 0) + '</td></tr></tfoot></table></div></div>' +
      '<div class="card"><div class="card-head"><h2>Peserta dapat lebih dari 1 baju</h2></div>' + (b.multi.length ? '<div class="table-wrap" style="max-height:420px"><table class="t"><thead><tr><th>Nama</th><th class="c">Baju</th><th>Ukuran</th></tr></thead><tbody>' + b.multi.map(m => '<tr><td><div class="name">' + esc(m.nama) + '</div><div class="sub-line">' + esc(m.klub) + ' • ' + esc(m.kat.join(', ')) + '</div></td><td class="c num">' + m.kat.length + '</td><td>' + esc(m.ukuran.join(', ')) + '</td></tr>').join('') + '</tbody></table></div>' : kosong('Tidak ada.')) + '</div></div>';
    $('#simpan-k1').onclick = async () => {
      const k = {}; $$('.k1').forEach(i => { if (+i.value) k[i.dataset.u] = +i.value; });
      const r = await act('Menyimpan…', () => BSR.call('simpanPengaturan', { baju_kloter1: k }));
      if (r) { S.set = r; HAL.baju(el); toast('Kloter 1 tersimpan ke tab DATA BAJU ATLET.', 'ok'); }
    };
    const kolom = [{ h: 'Ukuran Baju', w: 20, tebal: true }, { h: 'Total Data', w: 12, align: 'center' }, { h: 'Kloter 1 (Sudah Dicetak)', w: 18, align: 'center' }, { h: 'Kloter 2 (Akan Dicetak)', w: 18, align: 'center' }];
    const baris = b.ukuran.map(u => [u, b.total[u], Number(k1[u] || 0), Math.max(0, b.total[u] - Number(k1[u] || 0))]);
    const total = ['TOTAL', tot, baris.reduce((s, r) => s + r[2], 0), baris.reduce((s, r) => s + r[3], 0)];
    const klubBlok = () => Object.keys(b.perKlub).sort().map(k => ({ judul: k || '(tanpa nama)', kanan: Object.values(b.perKlub[k]).reduce((s, n) => s + n, 0) + ' baju', kolom: [{ h: 'Ukuran', w: 20 }, { h: 'Jumlah', w: 10, align: 'center' }, { h: 'Paraf Penerima', w: 20 }], baris: Object.keys(b.perKlub[k]).sort((x, y) => idxUkuran(x) - idxUkuran(y)).map(u => [u, b.perKlub[k][u], '']) }));
    bindEkspor({
      xls: () => X.excel('Data Baju Atlet - ' + S.set.nama_acara, [
        { nama: 'Rekap Cetak Baju', judul: 'Rekap Kebutuhan Kaos / Jersey Atlet', sub: 'Kids: ' + kids + ' • Dewasa: ' + (tot - kids) + ' • Total: ' + tot, blok: [{ kolom, baris, total }] },
        { nama: 'Per Klub', judul: 'Pembagian Baju per Club / Sekolah', blok: klubBlok() },
        { nama: 'Lebih dari 1 Baju', judul: 'Peserta Dapat Lebih dari 1 Baju', blok: [{ kolom: [{ h: 'Nama Atlet', w: 32, tebal: true }, { h: 'Club / Sekolah', w: 30 }, { h: 'Jumlah Baju', w: 11, align: 'center' }, { h: 'Ukuran', w: 30 }, { h: 'Kategori Lomba', w: 36 }], baris: b.multi.map(m => [m.nama, m.klub, m.kat.length, m.ukuran.join(', '), m.kat.join(', ')]) }] },
        { nama: 'Hanya Estafet', judul: 'Hanya Ikut Estafet — Tidak Dapat Baju', blok: [{ kolom: [{ h: 'Nama Atlet', w: 32 }, { h: 'Club / Sekolah', w: 32 }, { h: 'Kategori Estafet', w: 22 }], baris: b.hanyaEst.map(x => [x.nama, x.klub, x.kat]) }] },
      ]),
      pdf: () => X.pdf('Rekap Cetak Baju - ' + S.set.nama_acara, { judul: 'Rekap Kebutuhan Kaos / Jersey Atlet', sub: 'Kids: ' + kids + ' • Dewasa: ' + (tot - kids) + ' • Total: ' + tot, blok: [{ kolom, baris, total }, { judul: 'Peserta Dapat Lebih dari 1 Baju', kolom: [{ h: 'Nama Atlet' }, { h: 'Club / Sekolah' }, { h: 'Jml', align: 'center', pw: 12 }, { h: 'Ukuran' }], baris: b.multi.map(m => [m.nama, m.klub, m.kat.length, m.ukuran.join(', ')]) }], ttd: 'satu' }),
      pdfKlub: () => X.pdf('Pembagian Baju per Klub - ' + S.set.nama_acara, { judul: 'Pembagian Baju per Club / Sekolah', blok: klubBlok(), utuh: true }),
    });
  };

  /* ---------- ESTAFET ---------- */
  function autoBibEstafet() {
    const byName = {}; S.reg.forEach(r => { if (r.bib != null && !byName[r.key]) byName[r.key] = r.bib; });
    const dipakai = new Set(S.reg.filter(r => r.bib != null).map(r => String(r.bib)));
    S.est.forEach(t => t.dada.forEach(d => d && dipakai.add(String(d))));
    let n = 0;
    S.est.forEach(t => {
      const k = KATE[kunciKat(t.kategori)];
      t.pelari.forEach((p, i) => {
        if (!p || t.dada[i]) return;
        const kn = kunciNama(p);
        if (byName[kn] != null) { t.dada[i] = nd(byName[kn]); n++; return; }
        if (!k) return;
        for (let x = Number(k.awal); x <= Number(k.akhir); x++) if (!dipakai.has(String(x))) { t.dada[i] = nd(x); dipakai.add(String(x)); n++; return; }
      });
    });
    return n;
  }
  HAL.estafet = el => {
    const kat = UI.estKat;
    const list = S.est.filter(t => !kat || t.kategori === kat);
    el.innerHTML = head('Estafet', angka(S.est.length) + ' tim • ' + angka(S.est.filter(t => t.valid).length) + ' tervalidasi. Tim dari halaman daftar & Google Form estafet otomatis masuk ke sini.',
      '<button class="btn" id="auto-bib">' + ic('hash') + 'Isi nomor dada otomatis</button><button class="btn btn-brand" id="tambah-tim">' + ic('plus') + 'Tambah tim</button>' +
      menuEkspor('m-est', [['xls', 'Excel — formulir estafet per kategori', 'xls'], ['pdf', 'PDF — daftar tim estafet', 'pdf']])) +
      '<div class="card" style="padding:14px;margin-bottom:12px"><div class="seg" id="ekat">' + [''].concat(S.set.kategori_estafet.map(k => k.nama)).map(k => '<button aria-pressed="' + (kat === k) + '" data-v="' + esc(k) + '">' + (k || 'Semua') + ' <span class="muted">' + S.est.filter(t => !k || t.kategori === k).length + '</span></button>').join('') + '</div></div>' +
      '<div class="table-wrap"><table class="t wide"><thead><tr><th>Kategori</th><th>Sekolah / Klub & Tim</th><th>Pelari 1</th><th>Pelari 2</th><th>Pelari 3</th><th>Pelari 4</th><th>Cadangan</th><th>Pelatih</th><th>Status</th><th class="r">Aksi</th></tr></thead><tbody>' +
      (list.length ? list.map(t => '<tr data-id="' + esc(t.id) + '"><td class="nowrap"><b>' + esc(t.kategori) + '</b><div class="sub-line">' + esc(t.sumber || '') + '</div></td><td><div class="name">' + esc(t.klub) + '</div><div class="sub-line">' + esc(t.tim) + '</div></td>' +
        [0, 1, 2, 3, 4].map(i => '<td>' + (t.pelari[i] ? esc(t.pelari[i]) + '<div class="sub-line">' + (t.dada[i] ? 'No. ' + esc(t.dada[i]) : '—') + '</div>' : '<span class="muted">—</span>') + '</td>').join('') +
        '<td>' + esc(t.pelatih) + (t.wa ? '<div class="sub-line"><a href="' + waLink(t.wa) + '" target="_blank" rel="noopener">' + esc(t.wa) + '</a></div>' : '') + '</td>' +
        '<td><button class="btn btn-sm tgl ' + (t.valid ? '' : 'btn-accent') + '">' + (t.valid ? '<span class="tag ok">Valid</span>' : 'Validasi') + '</button></td>' +
        '<td class="r nowrap"><button class="btn btn-sm btn-icon ubah" aria-label="Ubah tim">' + ic('edit') + '</button><button class="btn btn-sm btn-icon btn-danger hapus" aria-label="Hapus tim">' + ic('trash') + '</button></td></tr>').join('')
        : '<tr><td colspan="10">' + kosong('Belum ada tim estafet di kategori ini.', 'relay') + '</td></tr>') + '</tbody></table></div>';
    const simpan = async (pesan) => { const r = await act(pesan || 'Menyimpan estafet…', () => BSR.call('simpanEstafet', { rows: S.est })); if (r) { S.est = r; siapkan(); HAL.estafet(el); toast('Data estafet tersimpan.', 'ok'); } };
    $$('#ekat button').forEach(b => b.onclick = () => { UI.estKat = b.dataset.v; HAL.estafet(el); });
    $('#auto-bib').onclick = async () => { const n = autoBibEstafet(); if (!n) { toast('Semua pelari sudah punya nomor dada.'); return; } await simpan('Mengisi ' + n + ' nomor dada…'); };
    $('#tambah-tim').onclick = () => formTim(null, simpan);
    $$('tr[data-id]').forEach(tr => {
      const t = S.est.find(x => x.id === tr.dataset.id);
      $('.tgl', tr).onclick = () => { t.valid = !t.valid; simpan(); };
      $('.ubah', tr).onclick = () => formTim(t, simpan);
      $('.hapus', tr).onclick = async () => { if (await konfirmasi('Hapus tim', 'Hapus tim <b>' + esc(t.tim) + '</b> (' + esc(t.kategori) + ')?', 'Hapus', true)) { S.est = S.est.filter(x => x !== t); simpan(); } };
    });
    const blok = () => S.set.kategori_estafet.map(k => ({ judul: 'Estafet ' + k.nama, kanan: S.est.filter(t => t.kategori === k.nama).length + ' tim', kolom: [{ h: 'No', w: 5, pw: 8, align: 'center' }, { h: 'Sekolah / Klub', w: 26, tebal: true }, { h: 'Nama Tim', w: 18 }, { h: 'Pelari 1', w: 24 }, { h: 'Pelari 2', w: 24 }, { h: 'Pelari 3', w: 24 }, { h: 'Pelari 4', w: 24 }, { h: 'Cadangan', w: 22 }, { h: 'Pelatih / Official', w: 20 }, { h: 'No. WA', w: 15, teks: true }, { h: 'Status', w: 10, align: 'center' }],
      baris: S.est.filter(t => t.kategori === k.nama).map((t, i) => [i + 1, t.klub, t.tim].concat(t.pelari.map((p, j) => p ? p + (t.dada[j] ? ' (' + t.dada[j] + ')' : '') : '')).concat([t.pelatih, t.wa, t.valid ? 'Valid' : 'Menunggu'])) }));
    bindEkspor({
      xls: () => X.excel('Formulir Estafet - ' + S.set.nama_acara, [{ nama: 'Estafet', judul: 'Formulir Pendaftaran Resmi Lari Estafet', sub: 'Angka dalam kurung = nomor dada pelari', orientasi: 'landscape', blok: blok() }]),
      pdf: () => X.pdf('Daftar Tim Estafet - ' + S.set.nama_acara, { orientasi: 'landscape', judul: 'Daftar Tim Lari Estafet', sub: 'Angka dalam kurung = nomor dada pelari', font: 7.8, blok: blok().map(b => Object.assign({}, b, { kolom: b.kolom.filter(k => k.h !== 'No. WA'), baris: b.baris.map(r => r.filter((_, i) => i !== 9)) })), ttd: 'satu' }),
    });
  };
  function formTim(t, simpan) {
    const a = t || { kategori: UI.estKat || S.set.kategori_estafet[0].nama, klub: '', tim: '', pelari: ['', '', '', '', ''], dada: ['', '', '', '', ''], pelatih: '', wa: '', valid: true, sumber: 'Panitia' };
    const d = dialog({
      title: t ? 'Ubah tim estafet' : 'Tambah tim estafet', wide: true,
      body: '<form id="ft"><div class="grid-3"><label class="field"><span>Kategori</span><select class="input" name="kategori">' + S.set.kategori_estafet.map(k => '<option' + (a.kategori === k.nama ? ' selected' : '') + '>' + esc(k.nama) + '</option>').join('') + '</select></label>' +
        '<label class="field"><span>Sekolah / klub</span><input class="input" name="klub" required value="' + esc(a.klub) + '"></label><label class="field"><span>Nama tim / regu</span><input class="input" name="tim" value="' + esc(a.tim) + '"></label></div>' +
        [0, 1, 2, 3, 4].map(i => '<div class="grid-2" style="grid-template-columns:3fr 1fr"><label class="field"><span>' + (i < 4 ? 'Pelari ' + (i + 1) : 'Pelari cadangan') + '</span><input class="input" name="p' + i + '" ' + (i < 4 ? 'required' : '') + ' value="' + esc(a.pelari[i]) + '"></label><label class="field"><span>No. dada</span><input class="input" name="d' + i + '" inputmode="numeric" value="' + esc(a.dada[i]) + '"></label></div>').join('') +
        '<div class="grid-2"><label class="field"><span>Pelatih / official</span><input class="input" name="pelatih" value="' + esc(a.pelatih) + '"></label><label class="field"><span>No. WA</span><input class="input" name="wa" value="' + esc(a.wa) + '"></label></div>' +
        '<label class="check"><input type="checkbox" name="valid" ' + (a.valid ? 'checked' : '') + '> Pembayaran sudah divalidasi</label></form>',
      foot: '<button class="btn" data-close>Batal</button><button class="btn btn-brand" id="ok">' + ic('save') + 'Simpan</button>',
    });
    $('#ok', d).onclick = () => {
      const f = $('#ft', d); if (!f.reportValidity()) return;
      const v = Object.fromEntries(new FormData(f));
      const o = t || { id: Math.random().toString(36).slice(2, 10), sumber: 'Panitia', ts: new Date().toISOString() };
      Object.assign(o, { kategori: v.kategori, klub: v.klub.trim(), tim: (v.tim || v.klub).trim(), pelari: [0, 1, 2, 3, 4].map(i => v['p' + i].trim()), dada: [0, 1, 2, 3, 4].map(i => v['d' + i].trim()), pelatih: v.pelatih, wa: v.wa, valid: !!v.valid });
      if (!t) S.est.push(o);
      d.close(); simpan();
    };
  }

  /* ---------- SERI & WAKTU ---------- */
  function susunSeri(entries, lanes, mode) {
    let list = entries.slice();
    if (mode === 'dada') list.sort((a, b) => (+a.dada || 1e9) - (+b.dada || 1e9));
    else if (mode === 'acak') shuffle(list);
    else {
      const g = {}; shuffle(list).forEach(e => (g[String(e.klub).toUpperCase()] = g[String(e.klub).toUpperCase()] || []).push(e));
      list = Object.values(g).sort((a, b) => b.length - a.length).flat();
    }
    const nH = Math.ceil(list.length / lanes);
    const heats = Array.from({ length: nH }, () => []);
    list.forEach((e, i) => heats[i % nH].push(e));
    return heats.flatMap((h, hi) => {
      const ln = urutanTengah(lanes).slice(0, h.length);
      if (mode !== 'dada') shuffle(ln);
      return h.map((e, j) => ({ seri: hi + 1, lintasan: ln[j], dada: e.dada, nama: e.nama, klub: e.klub, waktu: '', ket: '' }));
    });
  }
  let simpanTunda = null;
  HAL.seri = el => {
    const opsi = daftarNomor();
    if (!UI.seri.key || !nomorDari(UI.seri.key)) UI.seri.key = opsi[0].key;
    const n = nomorDari(UI.seri.key), babak = UI.seri.babak;
    const entri = entriNomor(n);
    const L = n.estafet ? (Number(S.set.tim_estafet_per_seri) || 4) : babak === 'Final' ? (Number(S.set.lintasan_final) || 8) : (Number(S.set.lintasan_penyisihan) || 6);
    const rows = barisSeri(n.kat, n.jk, babak);
    const pen = barisSeri(n.kat, n.jk, 'Penyisihan');
    const hasil = urutkanHasil(rows);
    const nFinal = Number(S.set.lintasan_final) || 8;
    const status = k => { const r = barisSeri(k.kat, k.jk, 'Penyisihan'), f = barisSeri(k.kat, k.jk, 'Final'); return f.length ? (f.some(x => parseW(x.waktu) != null) ? '✓ ' : '◐ ') : r.length ? '• ' : ''; };
    el.innerHTML = head('Seri & Catatan Waktu', 'Start list per seri, isi waktu langsung dari lapangan, final otomatis ' + nFinal + ' waktu terbaik.',
      menuEkspor('m-seri', [['startPdf', 'PDF — start list nomor ini', 'pdf'], ['hasilPdf', 'PDF — hasil nomor ini', 'pdf'], ['xls', 'Excel — start list & hasil nomor ini', 'xls'], '-', ['semuaPdf', 'PDF — buku start list SEMUA nomor', 'pdf'], ['semuaXls', 'Excel — start list SEMUA nomor', 'xls']])) +
      '<div class="card" style="padding:14px;margin-bottom:14px"><div class="toolbar"><label class="field" style="margin:0;min-width:260px;flex:1;max-width:380px"><span>Nomor lomba</span><select class="input" id="snomor">' + opsi.map(o => '<option value="' + esc(o.key) + '"' + (o.key === UI.seri.key ? ' selected' : '') + '>' + status(o) + esc(o.label) + ' (' + entriNomor(o).length + ')</option>').join('') + '</select></label>' +
      '<div class="field" style="margin:0"><span>Babak</span><div class="seg" id="sbabak">' + ['Penyisihan', 'Final'].map(b => '<button aria-pressed="' + (babak === b) + '" data-v="' + b + '">' + b + '</button>').join('') + '</div></div>' +
      '<span class="muted small" style="margin-left:auto">' + entri.length + (n.estafet ? ' tim' : ' atlet') + ' tervalidasi • ' + L + ' lintasan/seri</span></div><p class="muted small" style="margin:8px 0 0">• = seri sudah dibuat &nbsp; ◐ = final dibuat &nbsp; ✓ = final ada waktu. Format waktu: <code>12.34</code> atau <code>2:15.30</code>, atau ketik <code>DNS</code>/<code>DNF</code>/<code>DQ</code>.</p></div>' +
      (rows.length ? '<div class="toolbar" style="margin-bottom:12px"><button class="btn btn-brand" id="simpan-w">' + ic('save') + 'Simpan waktu</button><span class="muted small" id="status-w">Waktu tersimpan otomatis.</span><span style="flex:1"></span>' +
        (babak === 'Penyisihan' ? '<button class="btn" id="buat-final">' + ic('flag') + 'Buat final (' + nFinal + ' terbaik)</button>' : '') +
        '<button class="btn" id="acak">' + ic('shuffle') + 'Susun ulang</button><button class="btn btn-danger" id="hapus-seri">' + ic('trash') + 'Hapus babak</button></div>' +
        '<div class="heats">' + [...new Set(rows.map(r => r.seri))].map(s => '<div class="heat"><div class="heat-head"><span>' + (babak === 'Final' ? 'FINAL' : 'Seri ' + s) + '</span><span class="small">' + esc(n.label) + '</span></div><table><thead><tr><th>Lint</th><th>No</th><th>' + (n.estafet ? 'Tim' : 'Nama') + '</th><th style="text-align:right">Waktu</th></tr></thead><tbody>' +
          rows.filter(r => r.seri === s).map(r => { const hi = hasil.find(x => x.r === r); return '<tr draggable="true" data-i="' + S.seri.indexOf(r) + '"><td class="ln">' + r.lintasan + '</td><td class="num"><b>' + esc(r.dada || '—') + '</b></td><td><div class="name" style="font-size:.84rem">' + esc(r.nama) + '</div><div class="sub-line">' + esc(r.klub) + '</div></td><td class="time"><input value="' + esc(r.waktu) + '" inputmode="decimal" aria-label="Waktu ' + esc(r.nama) + '">' + (hi && hi.rank ? '<div class="sub-line" style="text-align:right">#' + hi.rank + '</div>' : '') + '</td></tr>'; }).join('') +
          '</tbody></table></div>').join('') + '</div>' +
        '<div class="card" style="margin-top:16px"><div class="card-head"><h2>Hasil ' + (babak === 'Final' ? 'final' : 'penyisihan') + '</h2><span class="muted small">' + (babak === 'Penyisihan' ? nFinal + ' teratas lolos final' : 'Juara 1–3 tampil di Podium') + '</span></div><div class="table-wrap free"><table class="t"><thead><tr><th class="c">#</th><th class="c">No</th><th>' + (n.estafet ? 'Tim' : 'Nama') + '</th><th>Club / Sekolah</th><th class="c">Seri</th><th class="r">Waktu</th><th>Ket.</th></tr></thead><tbody>' +
        hasil.map(x => '<tr><td class="c">' + (x.rank ? '<span class="rank ' + (babak === 'Final' ? ['', 'g', 's', 'b'][x.rank] || '' : '') + '">' + x.rank + '</span>' : '—') + '</td><td class="c num">' + esc(nd(x.r.dada)) + '</td><td class="name">' + esc(x.r.nama) + '</td><td>' + esc(x.r.klub) + '</td><td class="c">' + x.r.seri + '</td><td class="r num"><b>' + esc(x.r.waktu || '—') + '</b></td><td>' + (babak === 'Penyisihan' && x.rank && x.rank <= nFinal ? '<span class="tag ok">Lolos final</span>' : babak === 'Final' && x.rank && x.rank <= 3 ? '<span class="medal m' + x.rank + '"><i></i>' + ['', 'Emas', 'Perak', 'Perunggu'][x.rank] + '</span>' : '') + '</td></tr>').join('') +
        '</tbody></table></div></div>'
        : '<div class="card">' + (babak === 'Final'
          ? (pen.length ? '<div class="empty">' + ic('flag') + 'Final belum dibuat.<br><br><button class="btn btn-brand" id="buat-final">' + ic('flag') + 'Buat final dari ' + nFinal + ' waktu terbaik penyisihan</button></div>' : kosong('Buat seri penyisihan dan isi waktunya dulu.', 'timer'))
          : (entri.length ? '<div class="empty">' + ic('timer') + '<b style="color:var(--text)">' + entri.length + (n.estafet ? ' tim' : ' atlet') + '</b> siap dibagi ke <b style="color:var(--text)">' + Math.ceil(entri.length / L) + ' seri</b>.<div class="toolbar" style="justify-content:center;margin-top:16px"><select class="input" id="mode" style="max-width:260px" aria-label="Cara menyusun"><option value="klub">Pisahkan teman se-klub (disarankan)</option><option value="acak">Acak penuh</option><option value="dada">Urut nomor dada</option></select><button class="btn btn-brand" id="buat-seri">' + ic('timer') + 'Buat seri penyisihan</button></div>' +
            (entri.length <= nFinal && !n.estafet ? '<p class="small" style="margin-top:12px">Peserta ≤ ' + nFinal + ': bisa langsung lomba final. <button class="btn btn-sm" id="langsung-final">Langsung final</button></p>' : '') + '</div>'
            : kosong('Belum ada peserta tervalidasi di nomor ini.', 'users'))) + '</div>');

    $('#snomor').onchange = e => { UI.seri.key = e.target.value; HAL.seri(el); };
    $$('#sbabak button').forEach(b => b.onclick = () => { UI.seri.babak = b.dataset.v; HAL.seri(el); });
    const simpanBabak = async (bk, list, pesan) => {
      const r = await act(pesan || 'Menyimpan…', () => BSR.call('simpanSeri', { kategori: n.kat, jk: n.jk, babak: bk, rows: list }));
      if (r) { S.seri = r; HAL.seri(el); }
      return r;
    };
    const bs = $('#buat-seri');
    if (bs) bs.onclick = () => simpanBabak('Penyisihan', susunSeri(entri, L, $('#mode').value), 'Menyusun seri…').then(r => r && toast('Seri penyisihan dibuat.', 'ok'));
    const lf = $('#langsung-final');
    if (lf) lf.onclick = () => simpanBabak('Final', susunSeri(entri, nFinal, 'acak').map(r => Object.assign(r, { seri: 1 })), 'Menyusun final…').then(r => { if (r) { UI.seri.babak = 'Final'; HAL.seri(el); toast('Final langsung dibuat.', 'ok'); } });
    const bf = $('#buat-final');
    if (bf) bf.onclick = async () => {
      const h = urutkanHasil(pen).filter(x => x.t != null);
      if (!h.length) { toast('Isi waktu penyisihan dulu.', 'err'); return; }
      if (barisSeri(n.kat, n.jk, 'Final').length && !(await konfirmasi('Ganti final', 'Final sudah ada. Susun ulang dari hasil penyisihan terbaru? Waktu final yang sudah diisi akan terhapus.', 'Susun ulang', true))) return;
      const top = h.slice(0, nFinal), ln = urutanTengah(nFinal);
      const r = await simpanBabak('Final', top.map((x, i) => ({ seri: 1, lintasan: ln[i], dada: x.r.dada, nama: x.r.nama, klub: x.r.klub, waktu: '', ket: 'Q' + (i + 1) })), 'Menyusun final…');
      if (r) { UI.seri.babak = 'Final'; HAL.seri(el); toast('Final berisi ' + top.length + ' waktu terbaik.', 'ok'); }
    };
    const ac = $('#acak');
    if (ac) ac.onclick = async () => {
      const isi = rows.some(r => r.waktu);
      if (!(await konfirmasi('Susun ulang', 'Susun ulang ' + babak.toLowerCase() + ' ' + esc(n.label) + ' dengan peserta tervalidasi terbaru?' + (isi ? ' <b>Waktu yang sudah diisi akan hilang.</b>' : ''), 'Susun ulang', isi))) return;
      if (babak === 'Final') { const h = urutkanHasil(pen).filter(x => x.t != null).slice(0, nFinal); const ln = urutanTengah(nFinal); await simpanBabak('Final', (h.length ? h.map((x, i) => ({ seri: 1, lintasan: ln[i], dada: x.r.dada, nama: x.r.nama, klub: x.r.klub, waktu: '', ket: '' })) : susunSeri(entri, nFinal, 'acak').map(r => Object.assign(r, { seri: 1 })))); }
      else await simpanBabak('Penyisihan', susunSeri(entri, L, 'klub'));
    };
    const hs = $('#hapus-seri');
    if (hs) hs.onclick = async () => { if (await konfirmasi('Hapus babak', 'Hapus semua seri & waktu ' + babak.toLowerCase() + ' ' + esc(n.label) + '?', 'Hapus', true)) simpanBabak(babak, [], 'Menghapus…'); };

    // input waktu + simpan otomatis
    const statusW = t => { const s = $('#status-w'); if (s) s.textContent = t; };
    const simpanWaktu = async () => {
      clearTimeout(simpanTunda); simpanTunda = null;
      statusW('Menyimpan…');
      try { const r = await BSR.call('simpanSeri', { kategori: n.kat, jk: n.jk, babak, rows: barisSeri(n.kat, n.jk, babak) }); S.seri = r; statusW('Tersimpan ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' })); }
      catch (e) { statusW('Gagal menyimpan — klik Simpan waktu'); toast(e.message, 'err'); }
    };
    $$('.heat tr[data-i]').forEach(tr => {
      const r = S.seri[+tr.dataset.i];
      const inp = $('input', tr);
      inp.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); const all = $$('.heat .time input'); const i = all.indexOf(inp); (all[i + 1] || inp).focus(); } };
      inp.onchange = () => {
        const v = normW(inp.value);
        if (v === null) { toast('Format waktu tidak dikenali: ' + inp.value, 'err'); inp.value = r.waktu; return; }
        r.waktu = v; inp.value = v;
        statusW('Belum tersimpan…');
        clearTimeout(simpanTunda); simpanTunda = setTimeout(() => simpanWaktu().then(() => { const f = document.activeElement; const idx = f && f.closest && f.closest('tr[data-i]') ? f.closest('tr[data-i]').dataset.i : null; HAL.seri(el); if (idx != null) { const ni = $('.heat tr[data-i="' + idx + '"] input'); if (ni) ni.focus(); } }), 1400);
      };
      // tukar posisi dengan seret
      tr.ondragstart = e => { e.dataTransfer.setData('text/plain', tr.dataset.i); };
      tr.ondragover = e => { e.preventDefault(); tr.classList.add('drag-over'); };
      tr.ondragleave = () => tr.classList.remove('drag-over');
      tr.ondrop = e => {
        e.preventDefault(); tr.classList.remove('drag-over');
        const a = S.seri[+e.dataTransfer.getData('text/plain')], b = r;
        if (!a || a === b) return;
        ['dada', 'nama', 'klub', 'waktu', 'ket'].forEach(k => { const t = a[k]; a[k] = b[k]; b[k] = t; });
        simpanWaktu().then(() => HAL.seri(el));
      };
    });
    const sw = $('#simpan-w'); if (sw) sw.onclick = () => simpanWaktu().then(() => HAL.seri(el));

    bindEkspor({
      startPdf: () => X.pdf('Start List ' + n.label + ' ' + babak, Object.assign({ judul: 'Start List ' + n.label + ' — ' + babak, sub: babak === 'Penyisihan' ? (S.set.lintasan_final || 8) + ' waktu terbaik berhak ke final' : 'Babak final', utuh: true, tinggiBaris: 8, ttd: false }, defStart(n, babak))),
      hasilPdf: () => X.pdf('Hasil ' + n.label + ' ' + babak, Object.assign({ judul: 'Hasil ' + n.label + ' — ' + babak, ttd: 'dua' }, defHasil(n, babak))),
      xls: () => X.excel('Seri ' + n.label + ' - ' + babak, [Object.assign({ nama: 'Start List', judul: 'Start List ' + n.label + ' — ' + babak }, defStart(n, babak)), Object.assign({ nama: 'Hasil', judul: 'Hasil ' + n.label + ' — ' + babak }, defHasil(n, babak))]),
      semuaPdf: () => {
        const blok = []; daftarNomor().forEach(o => ['Penyisihan', 'Final'].forEach(b => { if (barisSeri(o.kat, o.jk, b).length) defStart(o, b).blok.forEach(x => blok.push(Object.assign({}, x, { judul: o.label + ' — ' + x.judul }))); }));
        if (!blok.length) throw new Error('Belum ada seri yang dibuat.');
        return X.pdf('Buku Start List - ' + S.set.nama_acara, { judul: 'Buku Start List Seluruh Nomor', blok, utuh: true, tinggiBaris: 7.5 });
      },
      semuaXls: () => {
        const sh = []; daftarNomor().forEach(o => ['Penyisihan', 'Final'].forEach(b => { if (barisSeri(o.kat, o.jk, b).length) sh.push(Object.assign({ nama: (o.label + (b === 'Final' ? ' F' : '')).replace(/[•]/g, '').slice(0, 31), judul: 'Start List ' + o.label + ' — ' + b }, defStart(o, b))); }));
        if (!sh.length) throw new Error('Belum ada seri yang dibuat.');
        return X.excel('Start List Semua Nomor - ' + S.set.nama_acara, sh);
      },
    });
  };
  function defStart(n, babak) {
    const rows = barisSeri(n.kat, n.jk, babak);
    const kolom = [{ h: 'Lintasan', w: 9, pw: 18, align: 'center', tebal: true }, { h: 'No. Dada', w: 9, pw: 18, align: 'center', tebal: true, teks: true }, { h: n.estafet ? 'Nama Tim' : 'Nama Atlet', w: 34, tebal: true }, { h: 'Club / Sekolah', w: 34 }, { h: 'Waktu', w: 12, pw: 26, align: 'center' }, { h: 'Ket.', w: 8, pw: 16, align: 'center' }];
    return {
      blok: [...new Set(rows.map(r => r.seri))].map(s => {
        const rs = rows.filter(r => r.seri === s);
        const max = Math.max(...rs.map(r => r.lintasan));
        const lane = []; for (let i = 1; i <= max; i++) { const r = rs.find(x => x.lintasan === i); lane.push(r ? [i, nd(r.dada), r.nama, r.klub, '', ''] : [i, '-', 'Kosong', '-', '', '']); }
        return { judul: babak === 'Final' ? 'Final' : 'Seri ' + s, kanan: rs.length + (n.estafet ? ' tim' : ' atlet'), kolom, baris: lane };
      }),
    };
  }
  function defHasil(n, babak) {
    const h = urutkanHasil(barisSeri(n.kat, n.jk, babak)), nf = Number(S.set.lintasan_final) || 8;
    return {
      blok: [{
        kolom: [{ h: 'Peringkat', w: 10, pw: 20, align: 'center', tebal: true }, { h: 'No. Dada', w: 9, pw: 18, align: 'center', teks: true }, { h: n.estafet ? 'Nama Tim' : 'Nama Atlet', w: 34, tebal: true }, { h: 'Club / Sekolah', w: 34 }, { h: 'Seri', w: 6, pw: 12, align: 'center' }, { h: 'Waktu', w: 11, pw: 22, align: 'center', tebal: true }, { h: 'Keterangan', w: 14, pw: 26, align: 'center' }],
        baris: h.map(x => [x.rank || '-', nd(x.r.dada), x.r.nama, x.r.klub, x.r.seri, x.r.waktu || '-', babak === 'Penyisihan' ? (x.rank && x.rank <= nf ? 'Lolos Final' : '') : (x.rank && x.rank <= 3 ? ['', 'Emas', 'Perak', 'Perunggu'][x.rank] : '')]),
      }],
    };
  }

  /* ---------- PODIUM ---------- */
  function dataPodium() {
    const out = [], medali = {};
    daftarNomor().forEach(n => {
      const j = juara(n);
      [0, 1, 2].forEach(i => {
        const x = j.list[i];
        out.push({ n, pos: i + 1, x, status: j.status });
        if (x && j.status === 'Final') { const k = String(x.r.klub || '').toUpperCase().trim(); const m = medali[k] || (medali[k] = [0, 0, 0]); m[i]++; }
      });
    });
    const klasemen = Object.entries(medali).map(([k, m]) => ({ klub: k, e: m[0], p: m[1], b: m[2], t: m[0] + m[1] + m[2] })).sort((a, b) => b.e - a.e || b.p - a.p || b.b - a.b || a.klub.localeCompare(b.klub));
    return { out, klasemen };
  }
  HAL.podium = el => {
    const d = dataPodium();
    const nama = ['Juara 1 (Emas)', 'Juara 2 (Perak)', 'Juara 3 (Perunggu)'];
    const tampil = d.out.filter(o => o.status !== 'Menunggu' || o.pos === 1);
    el.innerHTML = head('Podium Juara', 'Otomatis dari waktu babak final. Bila final belum ada waktu, ditampilkan hasil sementara penyisihan.',
      menuEkspor('m-pod', [['pdf', 'PDF — rekap resmi podium juara', 'pdf'], ['xls', 'Excel — podium + klasemen medali', 'xls'], ['pdfK', 'PDF — klasemen medali klub', 'pdf']])) +
      '<div class="cols-2-1"><div class="card"><div class="card-head"><h2>Rekapitulasi juara</h2></div><div class="table-wrap"><table class="t"><thead><tr><th>Nomor lomba</th><th>Peringkat</th><th class="c">No</th><th>Nama</th><th>Club / Sekolah</th><th class="r">Waktu</th><th>Status</th></tr></thead><tbody>' +
      tampil.map(o => '<tr><td class="nowrap">' + (o.pos === 1 ? '<b>' + esc(o.n.label) + '</b>' : '') + '</td>' + (o.status === 'Menunggu' ? '<td colspan="5" class="muted">Menunggu hasil lomba</td>' : '<td><span class="medal m' + o.pos + '"><i></i>' + nama[o.pos - 1] + '</span></td><td class="c num">' + esc(o.x ? nd(o.x.r.dada) : '') + '</td><td class="name">' + esc(o.x ? o.x.r.nama : '—') + '</td><td>' + esc(o.x ? o.x.r.klub : '') + '</td><td class="r num"><b>' + esc(o.x ? o.x.r.waktu : '') + '</b></td>') + '<td>' + (o.pos === 1 || o.status !== 'Menunggu' ? '<span class="tag ' + (o.status === 'Final' ? 'ok' : o.status === 'Sementara' ? 'warn' : 'neutral') + '">' + (o.status === 'Final' ? 'Resmi (final)' : o.status === 'Sementara' ? 'Sementara' : 'Menunggu final') + '</span>' : '') + '</td></tr>').join('') +
      '</tbody></table></div></div><div class="card"><div class="card-head"><h2>Klasemen medali klub</h2></div>' + (d.klasemen.length ? '<div class="table-wrap free"><table class="t"><thead><tr><th class="c">#</th><th>Club</th><th class="c">🥇</th><th class="c">🥈</th><th class="c">🥉</th><th class="c">Total</th></tr></thead><tbody>' + d.klasemen.map((k, i) => '<tr><td class="c">' + (i + 1) + '</td><td class="name">' + esc(k.klub) + '</td><td class="c num">' + k.e + '</td><td class="c num">' + k.p + '</td><td class="c num">' + k.b + '</td><td class="c num"><b>' + k.t + '</b></td></tr>').join('') + '</tbody></table></div>' : kosong('Klasemen muncul setelah ada waktu final.', 'trophy')) + '</div></div>';
    const kolom = [{ h: 'Kategori Lomba', w: 26, pw: 40, tebal: true }, { h: 'Peringkat / Medali', w: 18, pw: 30 }, { h: 'No. Dada', w: 9, pw: 16, align: 'center', teks: true }, { h: 'Nama Lengkap Atlet', w: 32, tebal: true }, { h: 'Asal Sekolah / Klub', w: 30 }, { h: 'Catatan Waktu', w: 12, pw: 20, align: 'center' }, { h: 'Status Hasil', w: 16, pw: 30, align: 'center' }];
    const baris = d.out.map(o => [o.pos === 1 ? o.n.label : '', nama[o.pos - 1], o.x ? nd(o.x.r.dada) : '', o.x ? o.x.r.nama : '', o.x ? o.x.r.klub : '', o.x ? o.x.r.waktu : '', o.status === 'Final' ? 'Resmi' : o.status === 'Sementara' ? 'Sementara' : 'Menunggu Final']);
    const kl = { kolom: [{ h: 'Peringkat', w: 10, pw: 18, align: 'center' }, { h: 'Club / Sekolah', w: 40, tebal: true }, { h: 'Emas', w: 8, align: 'center' }, { h: 'Perak', w: 8, align: 'center' }, { h: 'Perunggu', w: 10, align: 'center' }, { h: 'Total', w: 8, align: 'center', tebal: true }], baris: d.klasemen.map((k, i) => [i + 1, k.klub, k.e, k.p, k.b, k.t]) };
    bindEkspor({
      pdf: () => X.pdf('Podium Juara - ' + S.set.nama_acara, { orientasi: 'landscape', judul: 'Lembar Rekapitulasi Resmi Podium Juara & Medali', blok: [{ kolom, baris }], ttd: 'dua' }),
      xls: () => X.excel('Podium Juara - ' + S.set.nama_acara, [{ nama: 'Podium Juara', judul: 'Rekapitulasi Resmi Podium Juara & Medali', blok: [{ kolom, baris }], tanpaFilter: true }, { nama: 'Klasemen Medali', judul: 'Klasemen Perolehan Medali Club', blok: [kl] }]),
      pdfK: () => X.pdf('Klasemen Medali - ' + S.set.nama_acara, { judul: 'Klasemen Perolehan Medali Club', blok: [kl], ttd: 'satu' }),
    });
  };

  /* ---------- NOMOR DADA ---------- */
  function daftarBib() {
    const out = [], seen = new Set();
    S.reg.forEach(r => {
      if (r.bib == null || seen.has(r.bib + '|' + r.key)) return;
      seen.add(r.bib + '|' + r.key);
      const semua = S.reg.filter(x => x.key === r.key && x.valid && !x.dupSama).flatMap(x => x.kats);
      out.push({ no: r.bib, noT: nd(r.bib), nama: r.nama, klub: r.klub, kategori: [...new Set(semua)].join(' + '), kat0: r.kats[0], jk: r.jkN, warna: r.warna, ukuran: [...new Set(S.reg.filter(x => x.key === r.key && x.valid && !x.dupSama).map(x => x.ukuran))].join(', ') });
    });
    if (UI.bib.est) {
      const ada = new Set(out.map(o => String(o.no)));
      S.est.filter(t => t.valid).forEach(t => t.pelari.forEach((p, i) => {
        const no = t.dada[i]; if (!p || !no || ada.has(String(no))) return; ada.add(String(no));
        const k = KATE[kunciKat(t.kategori)];
        out.push({ no: +no || no, noT: nd(no), nama: p, klub: t.klub, kategori: 'Estafet ' + t.kategori, kat0: 'Estafet ' + t.kategori, jk: /putri/i.test(t.kategori) ? 'Putri' : 'Putra', warna: k ? k.warna : '', ukuran: '-' });
      }));
    }
    return out.sort((a, b) => (+a.no || 0) - (+b.no || 0));
  }
  HAL.nomor = el => {
    const f = UI.bib;
    const semua = daftarBib();
    const list = semua.filter(b => (!f.kat || b.kat0 === f.kat || b.kategori.includes(f.kat)) && (!f.jk || b.jk === f.jk) && (!f.q || (b.noT + ' ' + b.no + ' ' + b.nama + ' ' + b.klub).toLowerCase().includes(f.q.toLowerCase())));
    const katOpt = S.set.kategori.map(k => k.nama).concat(S.set.kategori_estafet.map(k => 'Estafet ' + k.nama));
    const tampil = list.slice(0, 48);
    el.innerHTML = head('Nomor Dada & Race Pack', 'Nomor dada siap cetak (2 per A4, potong jadi A5), warna sesuai tabel REFERENSI NOMOR DADA.',
      '<button class="btn btn-brand" id="cetak-bib">' + ic('pdf') + 'PDF nomor dada (' + list.length + ')</button>' + menuEkspor('m-bib', [['rp', 'PDF — daftar ambil race pack per klub', 'pdf'], ['rpx', 'Excel — daftar ambil race pack', 'xls'], ['ref', 'PDF — tabel acuan nomor dada', 'pdf']])) +
      '<div class="card" style="padding:14px;margin-bottom:14px"><div class="toolbar"><label class="search">' + ic('search') + '<span class="sr">Cari</span><input class="input" id="bq" placeholder="Cari nomor, nama, klub…" value="' + esc(f.q) + '"></label>' +
      '<select class="input" id="bkat" style="max-width:230px" aria-label="Kategori"><option value="">Semua kategori</option>' + katOpt.map(k => '<option' + (f.kat === k ? ' selected' : '') + '>' + esc(k) + '</option>').join('') + '</select>' +
      '<div class="seg" id="bjk">' + ['', 'Putra', 'Putri'].map(j => '<button aria-pressed="' + (f.jk === j) + '" data-v="' + j + '">' + (j || 'Semua') + '</button>').join('') + '</div>' +
      '<label class="check"><input type="checkbox" id="best" ' + (f.est ? 'checked' : '') + '> Sertakan pelari estafet</label></div></div>' +
      '<div class="cols-2-1"><div class="card"><div class="card-head"><h2>Pratinjau</h2><span class="muted small">' + (list.length > 48 ? '48 dari ' + list.length : list.length) + ' nomor</span></div>' +
      (tampil.length ? '<div style="display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(170px,1fr))">' + tampil.map(b => { const w = X.warnaBib(b.warna); const bg = 'rgb(' + w.bg.join(',') + ')', fg = 'rgb(' + w.fg.join(',') + ')'; return '<div style="border:1.5px solid var(--line);border-radius:10px;overflow:hidden;background:#fff;color:#111;text-align:center"><div style="background:' + bg + ';color:' + fg + ';font-size:.62rem;font-weight:800;padding:4px 6px;letter-spacing:.04em">' + esc(S.set.nama_acara) + '</div><div style="font-size:2.3rem;font-weight:800;line-height:1.15;padding:6px 0 0" class="num">' + esc(b.noT) + '</div><div style="font-size:.62rem;font-weight:800;color:' + fg + ';background:' + bg + ';margin:2px 10px;border-radius:4px;padding:1px 4px">' + esc((b.kategori + ' • ' + b.jk).toUpperCase()) + '</div><div style="font-size:.72rem;font-weight:700;padding:4px 6px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(b.nama) + '</div><div style="font-size:.62rem;color:#555;padding:0 6px 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + esc(b.klub) + '</div></div>'; }).join('') + '</div>' : kosong('Belum ada nomor dada. Validasi pembayaran dulu.', 'hash')) + '</div>' +
      '<div class="card"><div class="card-head"><h2>Acuan nomor dada</h2></div><div class="table-wrap free"><table class="t"><thead><tr><th>Kategori</th><th class="c">Rentang</th><th class="c">Terpakai</th></tr></thead><tbody>' +
      S.set.kategori.map(k => { const n = semua.filter(b => b.no >= k.awal && b.no <= k.akhir).length; const q = k.akhir - k.awal + 1; return '<tr><td><span class="bib ' + esc(k.warna) + '" style="min-width:14px;height:14px;padding:0;margin-right:6px;vertical-align:-2px"></span>' + esc(k.nama) + '</td><td class="c num">' + k.awal + '–' + k.akhir + '</td><td class="c num"><span class="tag ' + (n > q * 0.9 ? 'warn' : 'neutral') + '">' + n + '/' + q + '</span></td></tr>'; }).join('') +
      S.set.kategori_estafet.map(k => { const n = semua.filter(b => b.no >= k.awal && b.no <= k.akhir).length; return '<tr><td><span class="bib ' + esc(k.warna) + '" style="min-width:14px;height:14px;padding:0;margin-right:6px;vertical-align:-2px"></span>Estafet ' + esc(k.nama) + '</td><td class="c num">' + k.awal + '–' + k.akhir + '</td><td class="c num"><span class="tag neutral">' + n + '/' + (k.akhir - k.awal + 1) + '</span></td></tr>'; }).join('') +
      '</tbody></table></div></div></div>';
    let tq;
    $('#bq').oninput = e => { clearTimeout(tq); tq = setTimeout(() => { f.q = e.target.value; HAL.nomor(el); const i = $('#bq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 250); };
    $('#bkat').onchange = e => { f.kat = e.target.value; HAL.nomor(el); };
    $$('#bjk button').forEach(b => b.onclick = () => { f.jk = b.dataset.v; HAL.nomor(el); });
    $('#best').onchange = e => { f.est = e.target.checked; HAL.nomor(el); };
    $('#cetak-bib').onclick = () => act('Membuat ' + list.length + ' nomor dada…', () => X.nomorDada('Nomor Dada ' + (f.kat || 'Semua') + (f.jk ? ' ' + f.jk : '') + ' - ' + S.set.nama_acara, list.map(b => Object.assign({}, b, { no: b.noT }))));
    const rpBlok = () => {
      const g = {}; list.forEach(b => (g[String(b.klub).toUpperCase().trim()] = g[String(b.klub).toUpperCase().trim()] || []).push(b));
      return Object.keys(g).sort().map(k => ({ judul: k, kanan: g[k].length + ' atlet', kolom: [{ h: 'No', w: 5, pw: 9, align: 'center' }, { h: 'No. Dada', w: 9, pw: 17, align: 'center', tebal: true, teks: true }, { h: 'Nama Atlet', w: 32, tebal: true }, { h: 'Kategori', w: 28 }, { h: 'Ukuran Baju', w: 16, pw: 26 }, { h: 'Paraf', w: 12, pw: 22 }], baris: g[k].map((b, i) => [i + 1, b.noT, b.nama, b.kategori, b.ukuran, '']) }));
    };
    bindEkspor({
      rp: () => X.pdf('Race Pack per Klub - ' + S.set.nama_acara, { judul: 'Daftar Pengambilan Race Pack per Club / Sekolah', sub: 'Nomor dada + baju • paraf saat pengambilan', blok: rpBlok(), utuh: true, tinggiBaris: 7 }),
      rpx: () => X.excel('Race Pack per Klub - ' + S.set.nama_acara, [{ nama: 'Race Pack', judul: 'Daftar Pengambilan Race Pack per Club / Sekolah', blok: rpBlok() }]),
      ref: () => X.pdf('Acuan Nomor Dada - ' + S.set.nama_acara, { judul: 'Tabel Acuan & Standarisasi Nomor Dada', blok: [{ kolom: [{ h: 'Kategori Perlombaan', tebal: true }, { h: 'Nomor Awal', align: 'center' }, { h: 'Nomor Akhir', align: 'center' }, { h: 'Total Kuota', align: 'center' }, { h: 'Warna Identitas', align: 'center' }, { h: 'Terpakai', align: 'center' }], baris: S.set.kategori.map(k => [k.nama, nd(k.awal), nd(k.akhir), k.akhir - k.awal + 1, k.warna, semua.filter(b => b.no >= k.awal && b.no <= k.akhir).length]).concat(S.set.kategori_estafet.map(k => ['Estafet ' + k.nama, nd(k.awal), nd(k.akhir), k.akhir - k.awal + 1, k.warna, semua.filter(b => b.no >= k.awal && b.no <= k.akhir).length])) }] }),
    });
  };

  /* ---------- GOOGLE FORM ---------- */
  HAL.form = el => {
    if (!S.form) {
      el.innerHTML = head('Google Form', 'Membaca form yang tersambung ke spreadsheet…') + '<div class="card"><div class="empty"><div class="spinner" style="margin:0 auto 10px"></div>Membaca Google Form… (±10 detik)</div></div>';
      BSR.call('formInfo').then(r => { S.form = r; if ((location.hash || '').slice(1) === 'form') HAL.form(el); }).catch(e => { S.form = { terhubung: [], utamaError: e.message }; HAL.form(el); });
      return;
    }
    const F = S.form;
    const linkDaftar = new URL('daftar.html', location.href).href;
    el.innerHTML = head('Google Form', 'Buat Google Form baru yang jawabannya langsung masuk ke spreadsheet ini, atau atur form yang sudah tersambung.', '<button class="btn" id="seg-form">' + ic('refresh') + 'Segarkan</button>') +
      '<div class="cols-2-1"><div class="stack"><div class="card"><div class="card-head"><h2>Form yang tersambung ke spreadsheet</h2></div>' +
      (F.terhubung && F.terhubung.length ? '<div class="stack" style="gap:10px">' + F.terhubung.map(f => '<div style="border:1px solid var(--line);border-radius:12px;padding:12px 14px;display:flex;gap:12px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:200px"><div class="name">' + esc(f.judul) + '</div><div class="sub-line">Tab jawaban: <b>' + esc(f.sheet) + '</b></div></div>' +
        '<label class="switch"><input type="checkbox" class="fbuka" data-sheet="' + esc(f.sheet) + '" ' + (f.buka ? 'checked' : '') + '>' + (f.buka ? 'Menerima jawaban' : 'Ditutup') + '</label>' +
        '<a class="btn btn-sm" href="' + esc(f.publikUrl) + '" target="_blank" rel="noopener">' + ic('ext') + 'Buka form</a><a class="btn btn-sm" href="' + esc(f.editUrl) + '" target="_blank" rel="noopener">' + ic('edit') + 'Edit</a><button class="btn btn-sm fpilihan" data-sheet="' + esc(f.sheet) + '" title="Samakan pilihan kategori & ukuran dengan Pengaturan">' + ic('refresh') + 'Perbarui pilihan</button></div>').join('') + '</div>'
        : kosong('Belum ada Google Form yang tersambung.', 'form')) + (F.utamaError ? '<p class="note warn small" style="margin-top:10px">' + esc(F.utamaError) + '</p>' : '') + '</div>' +
      '<div class="card"><div class="card-head"><h2>Halaman pendaftaran web</h2></div><p class="muted">Alternatif Google Form: atlet daftar perorangan, kolektif (satu klub sekaligus), atau tim estafet — bukti bayar diunggah ke Google Drive dan datanya masuk ke tab <b>Form Responses 1</b>.</p><div class="toolbar"><input class="input" readonly value="' + esc(linkDaftar) + '" id="ld" style="flex:1;min-width:220px"><button class="btn" id="salin-ld">' + ic('copy') + 'Salin tautan</button><a class="btn btn-brand" href="daftar.html" target="_blank" rel="noopener">' + ic('ext') + 'Buka</a></div></div></div>' +
      '<div class="card"><div class="card-head"><h2>Buat Google Form baru</h2></div><form id="fform">' +
      '<div class="field"><span>Jenis form</span><div class="seg" id="fjenis"><button type="button" aria-pressed="true" data-v="perorangan">Pendaftaran perorangan</button><button type="button" aria-pressed="false" data-v="estafet">Pendaftaran estafet</button></div></div>' +
      '<label class="field"><span>Judul form</span><input class="input" name="judul" required value="Pendaftaran ' + esc(S.set.nama_acara) + '"></label>' +
      '<label class="field"><span>Deskripsi</span><textarea class="input" name="deskripsi">' + esc(S.set.nama_acara + '\n' + [S.set.tanggal, S.set.lokasi].filter(Boolean).join(' — ') + '\nBiaya ' + rp(S.set.biaya) + ' per kategori.') + '</textarea></label>' +
      '<fieldset class="field" style="border:0;padding:0" id="fkat"><span>Kategori yang dibuka</span><div class="toolbar" style="gap:6px 14px">' + S.set.kategori.map(k => '<label class="check"><input type="checkbox" name="kat" value="' + esc(k.nama) + '" checked>' + esc(k.nama) + '</label>').join('') + '</div><label class="check" style="margin-top:8px"><input type="checkbox" name="multi"> Boleh pilih lebih dari satu kategori</label></fieldset>' +
      '<p class="note small">Form dibuat di Google Drive Bos, jawabannya otomatis masuk ke <b>tab baru di spreadsheet ini</b> dan langsung terbaca di menu Pendaftar' + ' (estafet → menu Estafet). <br><b>Catatan Google:</b> pertanyaan <i>unggah file</i> tidak bisa dibuat otomatis — setelah form jadi, klik <b>Edit</b> → <b>+</b> → jenis <b>Upload file</b> → judul <i>Unggah Bukti Pembayaran</i>.</p>' +
      '<button class="btn btn-brand" style="width:100%;margin-top:12px" id="buat-form">' + ic('form') + 'Buat Google Form</button></form><div id="hasil-form"></div></div></div>';
    let jenis = 'perorangan';
    $$('#fjenis button').forEach(b => b.onclick = () => {
      jenis = b.dataset.v; $$('#fjenis button').forEach(x => x.setAttribute('aria-pressed', x === b));
      $('#fkat').innerHTML = '<span>Kategori yang dibuka</span><div class="toolbar" style="gap:6px 14px">' + (jenis === 'estafet' ? S.set.kategori_estafet.map(k => k.nama) : S.set.kategori.map(k => k.nama)).map(k => '<label class="check"><input type="checkbox" name="kat" value="' + esc(k) + '" checked>' + esc(k) + '</label>').join('') + '</div>' + (jenis === 'estafet' ? '' : '<label class="check" style="margin-top:8px"><input type="checkbox" name="multi"> Boleh pilih lebih dari satu kategori</label>');
      $('[name=judul]').value = (jenis === 'estafet' ? 'Pendaftaran Estafet ' : 'Pendaftaran ') + S.set.nama_acara;
    });
    $('#salin-ld').onclick = () => { navigator.clipboard.writeText(linkDaftar).then(() => toast('Tautan disalin.', 'ok'), () => { $('#ld').select(); }); };
    $('#seg-form').onclick = async () => { const r = await act('Membaca form…', () => BSR.call('formInfo')); if (r) { S.form = r; HAL.form(el); } };
    $$('.fbuka').forEach(c => c.onchange = async () => { const r = await act(c.checked ? 'Membuka form…' : 'Menutup form…', () => BSR.call('aturForm', { sheet: c.dataset.sheet, buka: c.checked })); if (r) { S.form = r; HAL.form(el); toast(c.checked ? 'Form dibuka.' : 'Form ditutup.', 'ok'); } else c.checked = !c.checked; });
    $$('.fpilihan').forEach(b => b.onclick = async () => { const r = await act('Memperbarui pilihan…', () => BSR.call('aturForm', { sheet: b.dataset.sheet, perbaruiPilihan: true })); if (r) { S.form = r; toast('Pilihan kategori & ukuran sudah sama dengan Pengaturan.', 'ok'); } });
    $('#buat-form').onclick = async e => {
      e.preventDefault();
      const f = $('#fform'); if (!f.reportValidity()) return;
      const kategori = $$('input[name=kat]:checked', f).map(c => c.value);
      if (!kategori.length) { toast('Pilih minimal satu kategori.', 'err'); return; }
      const r = await act('Membuat Google Form… (±10 detik)', () => BSR.call('buatForm', { jenis, judul: f.judul.value, deskripsi: f.deskripsi.value, kategori, multiKategori: !!(f.multi && f.multi.checked), ukuran: S.set.ukuran }));
      if (!r) return;
      S.form = r.form;
      const set = await BSR.call('muat').catch(() => null);
      if (set) { S.set = set.pengaturan; S.reg = set.pendaftar; S.est = set.estafet; siapkan(); }
      HAL.form(el);
      $('#hasil-form').innerHTML = '<div class="note" style="margin-top:14px"><b>Form "' + esc(r.judul) + '" berhasil dibuat' + (r.demo ? ' (simulasi mode demo)' : '') + '.</b><br>Jawaban masuk ke tab <b>' + esc(r.sheet) + '</b>.<div class="toolbar" style="margin-top:10px"><a class="btn btn-sm btn-brand" href="' + esc(r.publikUrl) + '" target="_blank" rel="noopener">' + ic('ext') + 'Tautan untuk peserta</a><a class="btn btn-sm" href="' + esc(r.editUrl) + '" target="_blank" rel="noopener">' + ic('edit') + 'Edit / tambah unggah bukti</a></div></div>';
      toast('Google Form dibuat & tersambung.', 'ok');
    };
  };

  /* ---------- PENGATURAN ---------- */
  HAL.pengaturan = el => {
    const s = S.set;
    const katRow = (k, i, est) => '<tr><td><input class="input input-sm" data-f="nama" value="' + esc(k.nama) + '" aria-label="Nama kategori"></td><td><input class="input input-sm num" type="number" data-f="awal" value="' + k.awal + '" style="width:84px" aria-label="Nomor awal"></td><td><input class="input input-sm num" type="number" data-f="akhir" value="' + k.akhir + '" style="width:84px" aria-label="Nomor akhir"></td><td><select class="input input-sm" data-f="warna" aria-label="Warna">' + ['Kuning', 'Merah', 'Biru', 'Abu-abu'].map(w => '<option' + (k.warna === w ? ' selected' : '') + '>' + w + '</option>').join('') + '</select></td><td class="r"><button type="button" class="btn btn-sm btn-icon btn-danger hapus-kat" aria-label="Hapus kategori">' + ic('trash') + '</button></td></tr>';
    el.innerHTML = head('Pengaturan', 'Tersimpan di tab APP_PENGATURAN spreadsheet. Data lama Bos tidak diubah.', '<button class="btn btn-brand" id="simpan-set">' + ic('save') + 'Simpan pengaturan</button>') +
      '<div class="cols"><div class="card"><h2>Acara</h2>' +
      fld('nama_acara', 'Nama acara', s.nama_acara) + fld('penyelenggara', 'Penyelenggara', s.penyelenggara) +
      '<div class="grid-2">' + fld('tanggal', 'Hari / tanggal', s.tanggal) + fld('lokasi', 'Lokasi', s.lokasi) + fld('ketua_panitia', 'Nama ketua panitia (tanda tangan)', s.ketua_panitia) + fld('referee', 'Nama referee / juri utama', s.referee) + '</div>' +
      '<label class="switch" style="margin-top:6px"><input type="checkbox" id="buka" ' + (s.pendaftaran_buka ? 'checked' : '') + '>Pendaftaran web dibuka</label></div>' +
      '<div class="card"><h2>Biaya & lomba</h2><div class="grid-2">' + fld('biaya', 'Biaya per kategori (Rp)', s.biaya, 'number') + fld('lintasan_penyisihan', 'Lintasan per seri penyisihan', s.lintasan_penyisihan, 'number') + fld('lintasan_final', 'Jumlah finalis', s.lintasan_final, 'number') + fld('tim_estafet_per_seri', 'Tim estafet per seri', s.tim_estafet_per_seri, 'number') + '</div>' +
      '<label class="field"><span>Info pembayaran (tampil di halaman daftar & Google Form)</span><textarea class="input" data-k="info_bayar">' + esc(s.info_bayar) + '</textarea></label>' +
      '<label class="field"><span>Pilihan ukuran baju (pisahkan dengan koma)</span><textarea class="input" data-k="ukuran" style="min-height:70px">' + esc(s.ukuran.join(', ')) + '</textarea></label></div></div>' +
      '<div class="cols" style="margin-top:16px"><div class="card"><div class="card-head"><h2>Kategori & rentang nomor dada</h2><button class="btn btn-sm" id="tambah-kat">' + ic('plus') + 'Kategori</button></div><div class="table-wrap free"><table class="t" id="tkat"><thead><tr><th>Kategori</th><th>Awal</th><th>Akhir</th><th>Warna</th><th></th></tr></thead><tbody>' + s.kategori.map((k, i) => katRow(k, i)).join('') + '</tbody></table></div><p class="muted small" style="margin-top:8px">Nama kategori harus sama persis dengan pilihan di Google Form (mis. <code>Kelas 3-4 - 60M</code>).</p></div>' +
      '<div class="card"><div class="card-head"><h2>Kategori estafet</h2><button class="btn btn-sm" id="tambah-est">' + ic('plus') + 'Kategori</button></div><div class="table-wrap free"><table class="t" id="test"><thead><tr><th>Kategori</th><th>Awal</th><th>Akhir</th><th>Warna</th><th></th></tr></thead><tbody>' + s.kategori_estafet.map((k, i) => katRow(k, i, true)).join('') + '</tbody></table></div></div></div>' +
      '<div class="cols" style="margin-top:16px"><div class="card"><h2>Sumber data</h2><label class="field"><span>Tab pendaftaran perorangan yang dibaca (satu per baris)</span><textarea class="input" data-k="sheet_pendaftaran">' + esc((s.sheet_pendaftaran || []).join('\n')) + '</textarea></label><label class="field"><span>Tab Google Form estafet (satu per baris)</span><textarea class="input" data-k="sheet_estafet_form" style="min-height:60px">' + esc((s.sheet_estafet_form || []).join('\n')) + '</textarea></label><button class="btn btn-sm" id="impor-est">' + ic('refresh') + 'Impor ulang dari tab ESTAFET lama</button></div>' +
      '<div class="card"><h2>Koneksi & keamanan</h2>' + (BSR.demo ? '<p class="note warn small">Sedang <b>mode demo</b>: data contoh fiktif, tidak tersambung ke spreadsheet.</p>' : '') +
      '<label class="field"><span>Alamat mesin Apps Script (URL /exec)</span><input class="input" id="api" value="' + esc(BSR.apiUrl()) + '" placeholder="https://script.google.com/macros/s/…/exec"></label><div class="toolbar"><button class="btn btn-sm" id="simpan-api">' + ic('link') + 'Simpan alamat di perangkat ini</button></div>' +
      '<hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><div class="toolbar"><input class="input" id="pin-baru" type="password" placeholder="PIN baru (min. 4)" style="max-width:220px" autocomplete="new-password" aria-label="PIN baru"><button class="btn btn-sm" id="ganti-pin">Ganti PIN panitia</button></div>' +
      '<hr style="border:0;border-top:1px solid var(--line);margin:16px 0"><div class="toolbar"><button class="btn btn-sm" id="tema">' + ic('moon') + 'Ganti tema terang/gelap</button><button class="btn btn-sm btn-danger" id="keluar2">' + ic('out') + 'Keluar</button></div></div></div>';
    const tabelKat = (id) => $$('#' + id + ' tbody tr').map(tr => ({ nama: $('[data-f=nama]', tr).value.trim(), awal: +$('[data-f=awal]', tr).value, akhir: +$('[data-f=akhir]', tr).value, warna: $('[data-f=warna]', tr).value })).filter(k => k.nama);
    const bindHapus = () => $$('.hapus-kat').forEach(b => b.onclick = () => b.closest('tr').remove());
    bindHapus();
    $('#tambah-kat').onclick = () => { $('#tkat tbody').insertAdjacentHTML('beforeend', katRow({ nama: '', awal: 0, akhir: 0, warna: 'Merah' })); bindHapus(); };
    $('#tambah-est').onclick = () => { $('#test tbody').insertAdjacentHTML('beforeend', katRow({ nama: '', awal: 0, akhir: 0, warna: 'Merah' })); bindHapus(); };
    $('#simpan-set').onclick = async () => {
      const v = {};
      $$('[data-k]').forEach(i => v[i.dataset.k] = i.type === 'number' ? Number(i.value) : i.value);
      v.ukuran = String(v.ukuran).split(',').map(x => x.trim()).filter(Boolean);
      v.sheet_pendaftaran = String(v.sheet_pendaftaran).split('\n').map(x => x.trim()).filter(Boolean);
      v.sheet_estafet_form = String(v.sheet_estafet_form).split('\n').map(x => x.trim()).filter(Boolean);
      v.pendaftaran_buka = $('#buka').checked;
      v.kategori = tabelKat('tkat'); v.kategori_estafet = tabelKat('test');
      const bad = v.kategori.concat(v.kategori_estafet).find(k => !(k.akhir >= k.awal));
      if (bad) { toast('Rentang nomor "' + bad.nama + '" tidak benar.', 'err'); return; }
      const r = await act('Menyimpan pengaturan…', () => BSR.call('simpanPengaturan', v));
      if (r) { S.set = r; siapkan(); $('#acara-nama').textContent = r.nama_acara; HAL.pengaturan(el); toast('Pengaturan tersimpan.', 'ok'); }
    };
    $('#impor-est').onclick = async () => { if (await konfirmasi('Impor estafet', 'Ganti data estafet aplikasi dengan isi tab <b>ESTAFET</b> lama? Tim yang daftar lewat web akan tertimpa.', 'Impor', true)) { const r = await act('Mengimpor…', () => BSR.call('imporEstafetLama')); if (r) { S.est = r; siapkan(); toast(r.length + ' tim diimpor.', 'ok'); } } };
    $('#simpan-api').onclick = () => { BSR.setApiUrl($('#api').value); toast('Alamat disimpan. Silakan keluar lalu masuk lagi.', 'ok'); };
    $('#ganti-pin').onclick = async () => { const p = $('#pin-baru').value; if (p.length < 4) { toast('PIN minimal 4 karakter.', 'err'); return; } if (await act('Mengganti PIN…', () => BSR.call('gantiPin', { pin: p }))) { $('#pin-baru').value = ''; toast('PIN diganti. Bagikan PIN baru ke panitia.', 'ok'); } };
    $('#tema').onclick = gantiTema;
    $('#keluar2').onclick = keluar;
  };
  const fld = (k, l, v, type) => '<label class="field"><span>' + esc(l) + '</span><input class="input" data-k="' + k + '" ' + (type ? 'type="' + type + '"' : '') + ' value="' + esc(v == null ? '' : v) + '"></label>';

  /* ---------- Ekspor semua ---------- */
  async function eksporSemua() {
    const sh = [defRekapKategori(), defRekapKlub(), defPendaftar(S.reg, true)];
    const b = dataBaju();
    sh.push({ nama: 'Data Baju', judul: 'Rekap Kebutuhan Kaos / Jersey', blok: [{ kolom: [{ h: 'Ukuran', w: 20 }, { h: 'Jumlah', w: 10, align: 'center' }], baris: b.ukuran.map(u => [u, b.total[u]]), total: ['TOTAL', b.ukuran.reduce((s, u) => s + b.total[u], 0)] }] });
    sh.push({ nama: 'Estafet', judul: 'Tim Estafet', blok: [{ kolom: [{ h: 'Kategori', w: 14 }, { h: 'Sekolah / Klub', w: 28 }, { h: 'Tim', w: 18 }, { h: 'Pelari 1', w: 24 }, { h: 'Pelari 2', w: 24 }, { h: 'Pelari 3', w: 24 }, { h: 'Pelari 4', w: 24 }, { h: 'Cadangan', w: 22 }, { h: 'Pelatih', w: 18 }, { h: 'Status', w: 10 }], baris: S.est.map(t => [t.kategori, t.klub, t.tim].concat(t.pelari.map((p, j) => p ? p + (t.dada[j] ? ' (' + t.dada[j] + ')' : '') : '')).concat([t.pelatih, t.valid ? 'Valid' : 'Menunggu'])) }] });
    const p = dataPodium();
    sh.push({ nama: 'Podium', judul: 'Podium Juara', tanpaFilter: true, blok: [{ kolom: [{ h: 'Nomor Lomba', w: 26 }, { h: 'Peringkat', w: 10, align: 'center' }, { h: 'No. Dada', w: 9, align: 'center', teks: true }, { h: 'Nama', w: 32 }, { h: 'Club', w: 30 }, { h: 'Waktu', w: 11, align: 'center' }, { h: 'Status', w: 12 }], baris: p.out.map(o => [o.n.label, o.pos, o.x ? nd(o.x.r.dada) : '', o.x ? o.x.r.nama : '', o.x ? o.x.r.klub : '', o.x ? o.x.r.waktu : '', o.status]) }] });
    await X.excel('Rekap Lengkap - ' + S.set.nama_acara, sh);
  }

  /* ================================================================== */
  /*  LOGIN & SHELL                                                      */
  /* ================================================================== */
  function gantiTema() {
    const r = document.documentElement;
    const gelap = r.dataset.theme !== 'light';
    r.dataset.theme = gelap ? 'light' : 'dark';
    BSR.ls.set('bsr_tema', r.dataset.theme);
  }
  function keluar() { BSR.setToken(null); BSR.setDemo(false); location.replace('login.html?keluar=1'); }
  BSR.onSessionEnd = () => { tampilLogin('Sesi panitia habis. Masukkan PIN lagi.'); };

  // Layar masuk ada di halaman terpisah: login.html
  function tampilLogin(pesan) {
    location.replace('login.html' + (pesan ? '?pesan=' + encodeURIComponent(pesan) : ''));
  }

  async function mulai() {
    const lg = $('#login'); if (lg) lg.classList.add('hidden');
    $('#app').classList.remove('hidden');
    if (await muat()) render();
    else if (!BSR.demo) tampilLogin('Gagal memuat data. Periksa alamat mesin & PIN.');
  }

  function shell() {
    const nav = [
      ['Utama'], ['dasbor', 'Dasbor', 'home'], ['pendaftar', 'Pendaftar & Validasi', 'users', '<span class="badge hidden" id="badge-valid"></span>'], ['rekap', 'Rekap', 'chart'], ['duplikasi', 'Cek Duplikasi', 'copy'], ['baju', 'Data Baju', 'shirt'], ['estafet', 'Estafet', 'relay'],
      ['Hari lomba'], ['nomor', 'Nomor Dada', 'hash'], ['seri', 'Seri & Waktu', 'timer'], ['podium', 'Podium Juara', 'trophy'],
      ['Sistem'], ['form', 'Google Form', 'form'], ['pengaturan', 'Pengaturan', 'gear'],
    ];
    $('#side').innerHTML = '<div class="brand"><div class="brand-mark">' + ic('relay') + '</div><div><b id="acara-nama">Benteng Spirit Run</b><span>Panel panitia</span></div></div>' +
      nav.map(n => n.length === 1 ? '<div class="nav-group">' + n[0] + '</div>' : '<a class="nav-link" href="#' + n[0] + '" data-page="' + n[0] + '">' + ic(n[2]) + n[1] + (n[3] || '') + '</a>').join('') +
      '<div class="side-foot"><button class="nav-link" id="muat-ulang">' + ic('refresh') + 'Muat ulang data</button><button class="nav-link" id="tema-side">' + ic('moon') + 'Tema terang/gelap</button><button class="nav-link" id="keluar">' + ic('out') + 'Keluar</button></div>';
    $('#burger').innerHTML = ic('menu');
    $('#burger').onclick = () => { $('#side').classList.add('open'); $('#scrim').classList.add('show'); };
    $('#scrim').onclick = () => { $('#side').classList.remove('open'); $('#scrim').classList.remove('show'); };
    $('#muat-ulang').onclick = async () => { if (await muat('Memuat ulang data…')) { render(); toast('Data terbaru dari spreadsheet.', 'ok'); } };
    $('#topbar-reload').innerHTML = ic('refresh');
    $('#topbar-reload').onclick = () => $('#muat-ulang').click();
    $('#tema-side').onclick = gantiTema;
    $('#keluar').onclick = keluar;
    window.addEventListener('hashchange', render);
    window.addEventListener('beforeunload', e => { if (simpanTunda) { e.preventDefault(); e.returnValue = ''; } });
  }

  // mulai
  const t = BSR.ls.get('bsr_tema'); if (t) document.documentElement.dataset.theme = t;
  shell();
  if (/[?&]demo=1/.test(location.search)) { BSR.setDemo(true); BSR.setToken('demo'); }
  if (/[?&]pinbaru=1/.test(location.search)) setTimeout(() => toast('PIN panitia baru tersimpan. Bagikan hanya ke panitia.', 'ok'), 800);
  if (BSR.token() || BSR.demo) mulai(); else tampilLogin();
})();

/* Penghubung web ↔ mesin Apps Script, plus mode demo (data fiktif, hanya di browser). */
(function () {
  const BSR = (window.BSR = window.BSR || {});
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) { } },
  };
  const ss = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? sessionStorage.removeItem(k) : sessionStorage.setItem(k, v); } catch (e) { } },
  };
  BSR.ls = ls;
  BSR.apiUrl = () => (ls.get('bsr_api') || (window.BSR_CONFIG && window.BSR_CONFIG.api) || '').trim();
  BSR.setApiUrl = u => ls.set('bsr_api', u ? String(u).trim() : null);
  BSR.token = () => ss.get('bsr_token');
  BSR.setToken = t => ss.set('bsr_token', t);
  BSR.demo = ss.get('bsr_demo') === '1';
  BSR.setDemo = on => { BSR.demo = !!on; ss.set('bsr_demo', on ? '1' : null); };

  BSR.call = async function (action, data) {
    if (BSR.demo) return Demo.call(action, data || {});
    const url = BSR.apiUrl();
    if (!url) throw new Error('Alamat mesin (Apps Script) belum diatur. Buka menu Pengaturan atau pakai Mode Demo.');
    let res;
    try {
      res = await fetch(url, { method: 'POST', body: JSON.stringify({ action, data: data || {}, token: BSR.token() }), redirect: 'follow' });
    } catch (e) {
      throw new Error('Tidak bisa terhubung ke mesin Google. Periksa internet atau alamat Apps Script.');
    }
    let j;
    try { j = await res.json(); } catch (e) { throw new Error('Jawaban mesin tidak terbaca. Pastikan deployment Apps Script aksesnya "Siapa saja".'); }
    if (!j.ok) {
      if (j.error === 'SESI_HABIS') { BSR.setToken(null); if (BSR.onSessionEnd) BSR.onSessionEnd(); throw new Error('Sesi habis, silakan masuk lagi.'); }
      throw new Error(j.error || 'Terjadi kesalahan.');
    }
    return j.data;
  };

  /* ================= MODE DEMO ================= */
  const Demo = (BSR.Demo = {});
  const rnd = (() => { let s = 20261212; return () => ((s = (s * 1103515245 + 12345) % 2147483648) / 2147483648); })();
  const pick = a => a[Math.floor(rnd() * a.length)];
  const DEPAN_A = ['Raka', 'Bima', 'Dafa', 'Arkan', 'Fathan', 'Galih', 'Haikal', 'Ilham', 'Juna', 'Kenzo', 'Laksa', 'Malik', 'Naufal', 'Omar', 'Pandu', 'Rafa', 'Satria', 'Tegar', 'Umar', 'Wira', 'Yudha', 'Zidan'];
  const DEPAN_I = ['Alya', 'Bunga', 'Citra', 'Dinda', 'Elsa', 'Farah', 'Gita', 'Hana', 'Intan', 'Jihan', 'Kirana', 'Laras', 'Maya', 'Nadia', 'Olivia', 'Putri', 'Qiana', 'Rani', 'Salsa', 'Tiara', 'Vania', 'Zahra'];
  const BELAKANG = ['Pratama', 'Saputra', 'Wijaya', 'Ramadhan', 'Hidayat', 'Kusuma', 'Maulana', 'Permana', 'Santoso', 'Nugraha', 'Firdaus', 'Anggraini', 'Lestari', 'Rahmawati', 'Setiawan', 'Syahputra'];
  const KLUB = ['Contoh Atletik Club', 'SD Negeri Contoh 1', 'SD Teladan Contoh', 'SMP Negeri Contoh 3', 'SMA Contoh Nusantara', 'TK Ceria Contoh', 'Klub Lari Demo', 'Akademi Atletik Demo', 'SD Islam Contoh', 'SMP Harapan Contoh'];
  const KAT = [
    { nama: 'TK - 30M', awal: 1, akhir: 120, warna: 'Kuning', ket: 'TK Putra & Putri', n: 26, umur: 5, baju: ['S Kids', 'M Kids'] },
    { nama: 'Kelas 1-2 - 60M', awal: 121, akhir: 256, warna: 'Merah', ket: 'SD Kelas 1 & 2', n: 28, umur: 7, baju: ['M Kids', 'L Kids'] },
    { nama: 'Kelas 3-4 - 60M', awal: 257, akhir: 415, warna: 'Merah', ket: 'SD Kelas 3 & 4', n: 30, umur: 9, baju: ['L Kids', 'XL Kids'] },
    { nama: 'Kelas 5-6 - 60M', awal: 416, akhir: 591, warna: 'Merah', ket: 'SD Kelas 5 & 6', n: 32, umur: 11, baju: ['XL Kids', 'XL2 Kids', 'Dewasa - XS'] },
    { nama: 'SD - 800M', awal: 592, akhir: 621, warna: 'Merah', ket: 'SD Jarak Menengah', n: 10, umur: 11, baju: ['XL Kids', 'Dewasa - XS'] },
    { nama: 'SMP - 80M', awal: 622, akhir: 763, warna: 'Biru', ket: 'SMP 80M', n: 26, umur: 13, baju: ['Dewasa - S', 'Dewasa - M'] },
    { nama: 'SMP - 800M', awal: 764, akhir: 805, warna: 'Biru', ket: 'SMP 800M', n: 10, umur: 13, baju: ['Dewasa - S', 'Dewasa - M'] },
    { nama: 'SMA - 100M', awal: 806, akhir: 887, warna: 'Abu-abu', ket: 'SMA 100M', n: 16, umur: 16, baju: ['Dewasa - M', 'Dewasa - L'] },
    { nama: 'SMA - 800M', awal: 888, akhir: 909, warna: 'Abu-abu', ket: 'SMA 800M', n: 8, umur: 16, baju: ['Dewasa - M', 'Dewasa - L', 'Dewasa - XL'] },
  ];

  function buatDemo() {
    const set = {
      nama_acara: 'BENTENG SPIRIT RUN 2026', penyelenggara: 'Pengurus Cabang PASI Kota Tangerang',
      tanggal: 'Sabtu, 12 Desember 2026', lokasi: 'Lapangan Ahmad Yani, Kota Tangerang', ketua_panitia: '', referee: '',
      biaya: 160000, info_bayar: 'Transfer ke rekening panitia (contoh — isi di Pengaturan).', pendaftaran_buka: true,
      lintasan_penyisihan: 6, lintasan_final: 8, tim_estafet_per_seri: 4,
      sheet_pendaftaran: ['Form Responses 1'], sheet_estafet_form: [],
      kategori: KAT.map(k => ({ nama: k.nama, awal: k.awal, akhir: k.akhir, warna: k.warna, ket: k.ket })),
      kategori_estafet: [
        { nama: 'SD Putra', awal: 910, akhir: 923, warna: 'Merah' }, { nama: 'SD Putri', awal: 924, akhir: 934, warna: 'Merah' },
        { nama: 'SMP Putra', awal: 935, akhir: 967, warna: 'Biru' }, { nama: 'SMP Putri', awal: 968, akhir: 975, warna: 'Biru' },
        { nama: 'SMA Putra', awal: 976, akhir: 994, warna: 'Abu-abu' }, { nama: 'SMA Putri', awal: 995, akhir: 997, warna: 'Abu-abu' }],
      ukuran: ['XXS Anak', 'S Kids', 'M Kids', 'L Kids', 'XL Kids', 'XL2 Kids', 'XXL Kids', 'Dewasa - XS', 'Dewasa - S', 'Dewasa - M', 'Dewasa - L', 'Dewasa - XL', 'Dewasa - XXL'],
      baju_kloter1: {},
    };
    const reg = [];
    let row = 4, t0 = Date.UTC(2026, 9, 17, 1, 0, 0);
    const dipakai = new Set();
    KAT.forEach(k => {
      for (let i = 0; i < k.n; i++) {
        const putri = rnd() < 0.42;
        let nama;
        do { nama = (putri ? pick(DEPAN_I) : pick(DEPAN_A)) + ' ' + pick(BELAKANG) + (rnd() < 0.3 ? ' ' + pick(BELAKANG) : ''); } while (dipakai.has(nama));
        dipakai.add(nama);
        const th = 2026 - k.umur - (rnd() < 0.5 ? 1 : 0);
        reg.push({
          ts: new Date(t0 += 3600e3 * (2 + rnd() * 20)).toISOString(), nama: nama.toUpperCase(), klub: pick(KLUB), jk: putri ? 'Putri' : 'Putra',
          tgl: th + '-' + String(1 + Math.floor(rnd() * 12)).padStart(2, '0') + '-' + String(1 + Math.floor(rnd() * 28)).padStart(2, '0'),
          kategori: k.nama, bukti: 'https://drive.google.com/', ukuran: pick(k.baju), telp: '08' + String(Math.floor(1e9 + rnd() * 8e9)),
          nik: '3671' + String(Math.floor(1e11 + rnd() * 8e11)), valid: rnd() < 0.86, dadaSheet: null,
        });
      }
    });
    // beberapa atlet ikut 2 kategori (contoh multi-kategori) + satu dobel daftar
    const sd = reg.filter(r => r.kategori === 'Kelas 5-6 - 60M').slice(0, 4);
    sd.forEach(r => reg.push(Object.assign({}, r, { kategori: 'SD - 800M', ts: new Date(t0 += 7200e3).toISOString() })));
    const smp = reg.filter(r => r.kategori === 'SMP - 80M').slice(0, 3);
    smp.forEach(r => reg.push(Object.assign({}, r, { kategori: 'SMP - 800M', ts: new Date(t0 += 7200e3).toISOString() })));
    reg.push(Object.assign({}, reg[5], { ts: new Date(t0 += 3600e3).toISOString(), valid: false }));
    reg.forEach(r => { r.sheet = 'Form Responses 1'; r.id = 'Form Responses 1!' + row++; });
    const est = [];
    [['SD Putra', 3], ['SD Putri', 2], ['SMP Putra', 3], ['SMP Putri', 1], ['SMA Putra', 2]].forEach(([kat, n]) => {
      for (let i = 0; i < n; i++) {
        const putri = /Putri/.test(kat);
        const p = [0, 1, 2, 3, 4].map(() => ((putri ? pick(DEPAN_I) : pick(DEPAN_A)) + ' ' + pick(BELAKANG)).toUpperCase());
        const kl = pick(KLUB);
        est.push({ id: Math.random().toString(36).slice(2, 10), kategori: kat, klub: kl, tim: kl + (i ? ' ' + String.fromCharCode(65 + i) : ''), pelari: [p[0], p[1], p[2], p[3], i % 2 ? p[4] : ''], pelatih: 'Coach ' + pick(DEPAN_A), wa: '0812' + Math.floor(1e7 + rnd() * 8e7), dada: ['', '', '', '', ''], valid: rnd() < 0.85, sumber: 'Demo', ts: '' });
      }
    });
    return { set, reg, est, seri: [], form: { terhubung: [{ sheet: 'Form Responses 1', judul: 'Pendaftaran Benteng Spirit Run 2026 (contoh)', editUrl: '#', publikUrl: '#', buka: true, id: 'demo' }] } };
  }

  let D = null;
  const salin = o => JSON.parse(JSON.stringify(o));
  const tunda = (v, ms) => new Promise(r => setTimeout(() => r(salin(v)), ms || 180));
  function cekBuka() { if (!D.set.pendaftaran_buka) throw new Error('Pendaftaran sudah ditutup panitia.'); }
  function tambahReg(a, bukti) {
    const last = D.reg.length ? Number(D.reg[D.reg.length - 1].id.split('!')[1]) : 3;
    D.reg.push(Object.assign({ ts: new Date().toISOString(), valid: false, dadaSheet: null, sheet: 'Form Responses 1', id: 'Form Responses 1!' + (last + 1) }, a, { bukti: bukti || a.bukti || '' }));
  }
  function bersih(d) {
    const kats = (Array.isArray(d.kategori) ? d.kategori : String(d.kategori || '').split(',')).map(s => s.trim()).filter(Boolean);
    if (!String(d.nama || '').trim()) throw new Error('Nama atlet wajib diisi.');
    if (!kats.length) throw new Error('Pilih kategori perlombaan.');
    return { nama: String(d.nama).trim(), klub: String(d.klub || '').trim(), jk: d.jk, tgl: d.tgl || '', kategori: kats.join(', '), ukuran: d.ukuran || '', telp: d.telp || '', nik: d.nik || '', bukti: d.bukti || '' };
  }
  Demo.call = async function (a, d) {
    if (!D) D = buatDemo();
    switch (a) {
      case 'info': return tunda({ nama_acara: D.set.nama_acara, penyelenggara: D.set.penyelenggara, tanggal: D.set.tanggal, lokasi: D.set.lokasi, biaya: D.set.biaya, info_bayar: D.set.info_bayar, pendaftaran_buka: D.set.pendaftaran_buka, kategori: D.set.kategori.map(k => k.nama), kategori_estafet: D.set.kategori_estafet.map(k => k.nama), ukuran: D.set.ukuran });
      case 'login': return tunda({ token: 'demo' });
      case 'muat': return tunda({ pengaturan: D.set, pendaftar: D.reg, estafet: D.est, seri: D.seri, form: D.form }, 450);
      case 'pendaftar': return tunda(D.reg);
      case 'setValid': (d.ids || [d.id]).forEach(id => { const r = D.reg.find(x => x.id === id); if (r) r.valid = !!d.valid; }); return tunda(D.reg);
      case 'tambah': tambahReg(bersih(d)); return tunda({ ok: true });
      case 'ubah': { const r = D.reg.find(x => x.id === d.id); if (r) Object.assign(r, bersih(d)); return tunda(D.reg); }
      case 'hapus': D.reg = D.reg.filter(x => x.id !== d.id); return tunda(D.reg);
      case 'simpanPengaturan': Object.assign(D.set, d); return tunda(D.set);
      case 'gantiPin': return tunda(true);
      case 'estafet': return tunda(D.est);
      case 'simpanEstafet': D.est = d.rows || []; return tunda(D.est);
      case 'imporEstafetLama': return tunda(D.est);
      case 'simpanSeri': D.seri = D.seri.filter(r => !(r.kategori === d.kategori && r.jk === d.jk && (!d.babak || r.babak === d.babak)))
        .concat((d.rows || []).map(r => Object.assign({ kategori: d.kategori, jk: d.jk, babak: d.babak || 'Penyisihan' }, r)));
        return tunda(D.seri);
      case 'formInfo': return tunda(D.form);
      case 'aturForm': D.form.terhubung.forEach(f => { if (d.buka !== undefined && (!d.sheet || d.sheet === f.sheet)) f.buka = !!d.buka; }); return tunda(D.form);
      case 'buatForm': {
        const sheet = (d.jenis === 'estafet' ? 'Form Estafet ' : 'Form Daftar ') + new Date().toLocaleTimeString('id-ID').slice(0, 5);
        D.form.terhubung.push({ sheet, judul: d.judul, editUrl: '#', publikUrl: '#', buka: true, id: 'demo2' });
        return tunda({ judul: d.judul, editUrl: '#', publikUrl: '#', sheet, form: D.form, demo: true }, 900);
      }
      case 'daftar': cekBuka(); tambahReg(bersih(d), 'https://drive.google.com/'); return tunda({ nama: d.nama, kategori: [].concat(d.kategori).join(', ') }, 700);
      case 'daftarKolektif': {
        cekBuka();
        const list = (d.atlet || []).filter(x => x && x.nama);
        list.forEach(x => tambahReg(bersih(Object.assign({}, x, { klub: d.klub })), 'https://drive.google.com/'));
        const slot = list.reduce((s, x) => s + [].concat(x.kategori).length, 0);
        return tunda({ jumlah: list.length, slot, biaya: slot * D.set.biaya }, 800);
      }
      case 'daftarEstafet': cekBuka(); D.est.push({ id: Math.random().toString(36).slice(2, 10), kategori: d.kategori, klub: d.klub, tim: d.tim || d.klub, pelari: d.pelari, pelatih: d.pelatih, wa: d.wa, dada: ['', '', '', '', ''], valid: false, sumber: 'Web', ts: new Date().toISOString() }); return tunda({ ok: true }, 600);
      default: throw new Error('Aksi demo tidak dikenal: ' + a);
    }
  };
})();

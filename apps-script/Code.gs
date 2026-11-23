/**
 * SISTEM PERLOMBAAN ATLETIK — BENTENG SPIRIT RUN
 * Mesin (backend) Google Apps Script untuk web panitia.
 *
 * CARA PASANG (sekali saja):
 * 1. Buka spreadsheet → menu Ekstensi → Apps Script.
 * 2. Klik + → Skrip, beri nama AplikasiWeb, tempel seluruh file ini, simpan.
 * 3. Pilih fungsi "setupAplikasiWeb" lalu klik Jalankan (izinkan akses yang diminta).
 * 4. PIN panitia: PIN pertama yang diketik di layar masuk web otomatis menjadi PIN panitia
 *    (atau isi PIN_AWAL di bawah sebelum menjalankan setup).
 * 5. Terapkan → Deployment baru → Jenis: Aplikasi web
 *      - Jalankan sebagai: Saya
 *      - Yang memiliki akses: Siapa saja
 *    Salin URL yang berakhiran /exec lalu tempel di web (menu Pengaturan) atau beri ke Karyawan AI.
 */

const PIN_AWAL = '';  // opsional; kosongkan agar PIN dibuat dari layar masuk web
const SHEET_DAFTAR = 'Form Responses 1';
const SHEET_REF = 'REFERENSI NOMOR DADA';
const SHEET_ESTAFET_LAMA = 'ESTAFET';
const APP = { set: 'APP_PENGATURAN', est: 'APP_ESTAFET', seri: 'APP_SERI', log: 'APP_LOG' };
const KOLOM_SERI = ['Kategori', 'Jenis Kelamin', 'Babak', 'Seri', 'Lintasan', 'No. Dada', 'Nama', 'Klub', 'Waktu', 'Keterangan'];
const KOLOM_EST = ['ID', 'Kategori', 'Nama Sekolah / Klub', 'Nama Tim', 'Pelari 1', 'Pelari 2', 'Pelari 3', 'Pelari 4', 'Cadangan',
  'Pelatih / Official', 'No. WA', 'Dada 1', 'Dada 2', 'Dada 3', 'Dada 4', 'Dada Cadangan', 'Validasi', 'Sumber', 'Waktu Daftar'];
const MIME_BUKTI = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

/* ------------------------------------------------------------------ */
/*  PINTU MASUK                                                        */
/* ------------------------------------------------------------------ */
function doGet() {
  return json_({ ok: true, app: 'BSR', data: publikInfo_() });
}

function doPost(e) {
  let out;
  try {
    const req = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const aksi = String(req.action || '');
    const data = req.data || {};
    if (PUBLIK[aksi]) {
      out = PUBLIK[aksi](data);
    } else if (ADMIN[aksi]) {
      cekToken_(req.token);
      out = ADMIN[aksi](data);
    } else {
      throw new Error('Aksi tidak dikenal: ' + aksi);
    }
    out = { ok: true, data: out };
  } catch (err) {
    out = { ok: false, error: String((err && err.message) || err) };
  }
  return json_(out);
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

/* ------------------------------------------------------------------ */
/*  SETUP                                                              */
/* ------------------------------------------------------------------ */
function setupAplikasiWeb() {
  if (PIN_AWAL && String(PIN_AWAL).length >= 4) PropertiesService.getScriptProperties().setProperty('ADMIN_PIN', String(PIN_AWAL));
  const ss = ss_();
  PropertiesService.getScriptProperties().setProperty('SS_ID', ss.getId());
  sheet_(APP.set, ['Kunci', 'Nilai (JSON)']);
  const est = sheet_(APP.est, KOLOM_EST);
  sheet_(APP.seri, KOLOM_SERI);
  sheet_(APP.log, ['Waktu', 'Aksi', 'Keterangan']);
  if (est.getLastRow() < 2) imporEstafetLama_();
  const p = pengaturan_();
  simpanPengaturan_(p);
  folderBukti_();
  Logger.log('Setup selesai. Sheet aplikasi siap di: ' + ss.getName());
}

/* ------------------------------------------------------------------ */
/*  AKSI PUBLIK (tanpa PIN)                                            */
/* ------------------------------------------------------------------ */
const PUBLIK = {
  info: () => publikInfo_(),
  login: d => login_(d),
  daftar: d => daftarPerorangan_(d),
  daftarKolektif: d => daftarKolektif_(d),
  daftarEstafet: d => daftarEstafet_(d),
};

/* ------------------------------------------------------------------ */
/*  AKSI ADMIN (wajib token dari PIN)                                  */
/* ------------------------------------------------------------------ */
const ADMIN = {
  muat: () => ({
    pengaturan: pengaturan_(),
    pendaftar: bacaPendaftar_(),
    estafet: bacaEstafet_(),
    seri: bacaSeri_(),
    form: infoForm_(),
  }),
  pendaftar: () => bacaPendaftar_(),
  setValid: d => setValid_(d.ids || [d.id], !!d.valid),
  tambah: d => { const p = pengaturan_(); return tulisPendaftar_(bersihkanAtlet_(d, p, false), ''); },
  ubah: d => ubahPendaftar_(d),
  hapus: d => hapusPendaftar_(d.id),
  simpanPengaturan: d => { simpanPengaturan_(Object.assign(pengaturan_(), d)); return pengaturan_(); },
  gantiPin: d => {
    const pin = String(d.pin || '');
    if (pin.length < 4) throw new Error('PIN minimal 4 karakter.');
    PropertiesService.getScriptProperties().setProperty('ADMIN_PIN', pin);
    return true;
  },
  estafet: () => bacaEstafet_(),
  simpanEstafet: d => simpanEstafet_(d.rows || []),
  imporEstafetLama: () => { imporEstafetLama_(); return bacaEstafet_(); },
  simpanSeri: d => simpanSeri_(d),
  buatForm: d => buatForm_(d),
  formInfo: () => infoForm_(),
  aturForm: d => aturForm_(d),
};

/* ------------------------------------------------------------------ */
/*  AUTENTIKASI                                                        */
/* ------------------------------------------------------------------ */
function login_(d) {
  const cache = CacheService.getScriptCache();
  const gagal = Number(cache.get('gagal') || 0);
  if (gagal >= 15) throw new Error('Terlalu banyak percobaan PIN. Coba lagi 10 menit lagi.');
  const pin = PropertiesService.getScriptProperties().getProperty('ADMIN_PIN');
  let baru = false;
  if (!pin) {
    // PIN pertama yang diketik panitia menjadi PIN resmi
    const p = String(d.pin || '');
    if (p.length < 4) throw new Error('PIN panitia belum dibuat. Ketik PIN baru minimal 4 karakter.');
    const l = kunci_();
    try {
      if (!PropertiesService.getScriptProperties().getProperty('ADMIN_PIN')) PropertiesService.getScriptProperties().setProperty('ADMIN_PIN', p);
    } finally { l.releaseLock(); }
    baru = true;
  } else if (String(d.pin || '') !== pin) {
    cache.put('gagal', String(gagal + 1), 600);
    throw new Error('PIN salah.');
  }
  const token = Utilities.getUuid();
  cache.put('t_' + token, '1', 21600);
  log_('login', baru ? 'PIN panitia dibuat' : 'Panitia masuk');
  return { token: token, pinBaru: baru };
}

function cekToken_(token) {
  if (!token || !CacheService.getScriptCache().get('t_' + token)) {
    throw new Error('SESI_HABIS');
  }
  CacheService.getScriptCache().put('t_' + token, '1', 21600);
}

/* ------------------------------------------------------------------ */
/*  UTILITAS SHEET                                                     */
/* ------------------------------------------------------------------ */
function ss_() {
  // Script ini ditempel lewat Ekstensi → Apps Script di spreadsheet lomba (container-bound),
  // jadi spreadsheet dikenali otomatis tanpa menulis ID di kode.
  const aktif = SpreadsheetApp.getActiveSpreadsheet();
  if (aktif) return aktif;
  const id = PropertiesService.getScriptProperties().getProperty('SS_ID');
  if (!id) throw new Error('Spreadsheet tidak dikenali. Jalankan setupAplikasiWeb() dari editor Apps Script spreadsheet lomba.');
  return SpreadsheetApp.openById(id);
}

function sheet_(nama, header) {
  const ss = ss_();
  let sh = ss.getSheetByName(nama);
  if (!sh) {
    sh = ss.insertSheet(nama);
    sh.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold')
      .setBackground('#0f6b3a').setFontColor('#ffffff');
    sh.setFrozenRows(1);
  }
  return sh;
}

function log_(aksi, ket) {
  try { sheet_(APP.log, ['Waktu', 'Aksi', 'Keterangan']).appendRow([new Date(), aksi, ket]); } catch (e) { }
}

let TZ_ = null;
function tz_() {
  if (TZ_) return TZ_;
  let t = '';
  try { t = ss_().getSpreadsheetTimeZone(); } catch (e) { }
  if (!t) { try { t = Session.getScriptTimeZone(); } catch (e) { } }
  TZ_ = t || 'Asia/Jakarta';
  return TZ_;
}

function tgl_(v) {
  if (v instanceof Date) return Utilities.formatDate(v, tz_(), 'yyyy-MM-dd');
  return v == null ? '' : String(v).trim();
}

function teks_(v) {
  if (v == null) return '';
  if (typeof v === 'number') return String(Math.round(v) === v ? v : v).replace(/\.0+$/, '');
  return String(v).trim();
}

function kunci_(lock) {
  const l = LockService.getScriptLock();
  l.waitLock(30000);
  return l;
}

/* ------------------------------------------------------------------ */
/*  PENGATURAN                                                         */
/* ------------------------------------------------------------------ */
function pengaturanAwal_() {
  return {
    nama_acara: 'BENTENG SPIRIT RUN 2026',
    penyelenggara: 'Pengurus Cabang PASI Kota Tangerang',
    tanggal: 'Sabtu, 12 Desember 2026',
    lokasi: 'Lapangan Ahmad Yani, Kota Tangerang',
    ketua_panitia: '',
    referee: '',
    biaya: 160000,
    info_bayar: 'Transfer ke rekening panitia (isi di Pengaturan).',
    pendaftaran_buka: true,
    lintasan_penyisihan: 6,
    lintasan_final: 8,
    tim_estafet_per_seri: 4,
    sheet_pendaftaran: [SHEET_DAFTAR],
    sheet_estafet_form: [],
    kategori: kategoriDariRef_(),
    kategori_estafet: [
      { nama: 'SD Putra', awal: 910, akhir: 923, warna: 'Merah' },
      { nama: 'SD Putri', awal: 924, akhir: 934, warna: 'Merah' },
      { nama: 'SMP Putra', awal: 935, akhir: 967, warna: 'Biru' },
      { nama: 'SMP Putri', awal: 968, akhir: 975, warna: 'Biru' },
      { nama: 'SMA Putra', awal: 976, akhir: 994, warna: 'Abu-abu' },
      { nama: 'SMA Putri', awal: 995, akhir: 997, warna: 'Abu-abu' },
    ],
    ukuran: ['XXS Anak', 'S Kids', 'M Kids', 'L Kids', 'XL Kids', 'XL2 Kids', 'XXL Kids',
      'Dewasa - XS', 'Dewasa - S', 'Dewasa - M', 'Dewasa - L', 'Dewasa - XL', 'Dewasa - XXL'],
    baju_kloter1: {},
  };
}

function kategoriDariRef_() {
  const bawaan = [
    ['TK - 30M', 1, 120, 'Kuning'], ['Kelas 1-2 - 60M', 121, 256, 'Merah'], ['Kelas 3-4 - 60M', 257, 415, 'Merah'],
    ['Kelas 5-6 - 60M', 416, 591, 'Merah'], ['SD - 800M', 592, 621, 'Merah'], ['SMP - 80M', 622, 763, 'Biru'],
    ['SMP - 800M', 764, 805, 'Biru'], ['SMA - 100M', 806, 887, 'Abu-abu'], ['SMA - 800M', 888, 909, 'Abu-abu'],
  ];
  try {
    const sh = ss_().getSheetByName(SHEET_REF);
    if (sh) {
      const v = sh.getRange(5, 1, 9, 7).getValues().filter(r => r[0] && Number(r[1]) >= 0 && Number(r[2]) > 0);
      if (v.length >= 5) return v.map(r => ({ nama: String(r[0]).trim(), awal: Number(r[1]), akhir: Number(r[2]), warna: String(r[4] || ''), ket: String(r[6] || '') }));
    }
  } catch (e) { }
  return bawaan.map(r => ({ nama: r[0], awal: r[1], akhir: r[2], warna: r[3], ket: '' }));
}

function pengaturan_() {
  const p = pengaturanAwal_();
  const sh = ss_().getSheetByName(APP.set);
  if (sh && sh.getLastRow() > 1) {
    sh.getRange(2, 1, sh.getLastRow() - 1, 2).getValues().forEach(r => {
      if (!r[0]) return;
      try { p[r[0]] = JSON.parse(r[1]); } catch (e) { p[r[0]] = r[1]; }
    });
  }
  return p;
}

function simpanPengaturan_(p) {
  const sh = sheet_(APP.set, ['Kunci', 'Nilai (JSON)']);
  const rows = Object.keys(p).map(k => [k, JSON.stringify(p[k])]);
  if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 2).clearContent();
  sh.getRange(2, 1, rows.length, 2).setValues(rows);
}

function publikInfo_() {
  const p = pengaturan_();
  return {
    nama_acara: p.nama_acara, penyelenggara: p.penyelenggara, tanggal: p.tanggal, lokasi: p.lokasi,
    biaya: p.biaya, info_bayar: p.info_bayar, pendaftaran_buka: p.pendaftaran_buka,
    kategori: p.kategori.map(k => k.nama), kategori_estafet: p.kategori_estafet.map(k => k.nama), ukuran: p.ukuran,
  };
}

/* ------------------------------------------------------------------ */
/*  PENDAFTAR                                                          */
/* ------------------------------------------------------------------ */
function petaKolom_(header) {
  const h = header.map(x => String(x || '').toLowerCase().trim());
  const cari = (...kata) => h.findIndex(x => kata.some(k => x.indexOf(k) >= 0));
  return {
    ts: 0,
    nama: cari('nama atlet', 'nama lengkap'),
    klub: cari('club', 'klub', 'asal sekolah'),
    jk: cari('jenis kelamin'),
    tgl: cari('tanggal lahir'),
    kategori: cari('kategori'),
    bukti: cari('bukti'),
    ukuran: cari('ukuran'),
    telp: cari('tlp', 'telp', 'whatsapp', 'nomor hp'),
    nik: cari('nik'),
    valid: cari('validasi'),
    dada: cari('no. dada', 'nomor dada'),
  };
}

function bacaPendaftar_() {
  const p = pengaturan_();
  const ss = ss_();
  const out = [];
  (p.sheet_pendaftaran || [SHEET_DAFTAR]).forEach(nama => {
    const sh = ss.getSheetByName(nama);
    if (!sh || sh.getLastRow() < 2) return;
    const v = sh.getRange(1, 1, sh.getLastRow(), sh.getLastColumn()).getValues();
    const k = petaKolom_(v[0]);
    if (k.nama < 0) return;
    for (let r = 1; r < v.length; r++) {
      const b = v[r];
      const nm = teks_(b[k.nama]);
      if (!nm) continue;
      out.push({
        id: nama + '!' + (r + 1),
        sheet: nama,
        ts: b[0] instanceof Date ? b[0].toISOString() : teks_(b[0]),
        nama: nm,
        klub: k.klub >= 0 ? teks_(b[k.klub]) : '',
        jk: k.jk >= 0 ? teks_(b[k.jk]) : '',
        tgl: k.tgl >= 0 ? tgl_(b[k.tgl]) : '',
        kategori: k.kategori >= 0 ? teks_(b[k.kategori]) : '',
        bukti: k.bukti >= 0 ? teks_(b[k.bukti]) : '',
        ukuran: k.ukuran >= 0 ? teks_(b[k.ukuran]) : '',
        telp: k.telp >= 0 ? teks_(b[k.telp]) : '',
        nik: k.nik >= 0 ? teks_(b[k.nik]) : '',
        valid: k.valid >= 0 ? b[k.valid] === true || String(b[k.valid]).toUpperCase() === 'TRUE' : false,
        dadaSheet: k.dada >= 0 && b[k.dada] !== '' && !isNaN(Number(b[k.dada])) ? Number(b[k.dada]) : null,
      });
    }
  });
  return out;
}

function lokasi_(id) {
  const i = String(id).lastIndexOf('!');
  const sh = ss_().getSheetByName(String(id).slice(0, i));
  const row = Number(String(id).slice(i + 1));
  if (!sh || !(row > 1)) throw new Error('Data tidak ditemukan. Muat ulang halaman.');
  const k = petaKolom_(sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]);
  return { sh: sh, row: row, k: k };
}

function setValid_(ids, valid) {
  const l = kunci_();
  try {
    ids.forEach(id => {
      const x = lokasi_(id);
      if (x.k.valid < 0) throw new Error('Kolom "Validasi Pembayaran" tidak ada di ' + x.sh.getName());
      x.sh.getRange(x.row, x.k.valid + 1).setValue(valid);
    });
    SpreadsheetApp.flush();
  } finally { l.releaseLock(); }
  log_('validasi', ids.length + ' data → ' + valid);
  return bacaPendaftar_();
}

function bersihkanAtlet_(d, p, ketat) {
  const nama = String(d.nama || '').trim().replace(/\s+/g, ' ');
  if (nama.length < 2 || nama.length > 90) throw new Error('Nama atlet wajib diisi (2–90 huruf).');
  const klub = String(d.klub || '').trim().slice(0, 120);
  if (!klub) throw new Error('Nama club / asal sekolah wajib diisi.');
  const jk = /putri/i.test(d.jk) ? 'Putri' : /putra/i.test(d.jk) ? 'Putra' : '';
  if (!jk) throw new Error('Pilih jenis kelamin.');
  const kats = (Array.isArray(d.kategori) ? d.kategori : String(d.kategori || '').split(','))
    .map(s => String(s).trim()).filter(Boolean);
  const daftarKat = p.kategori.map(k => k.nama);
  if (!kats.length) throw new Error('Pilih kategori perlombaan.');
  if (ketat && kats.some(k => daftarKat.indexOf(k) < 0)) throw new Error('Kategori tidak dikenal.');
  const telp = String(d.telp || '').replace(/[^\d+]/g, '');
  if (ketat && (telp.length < 9 || telp.length > 15)) throw new Error('Nomor telepon tidak valid.');
  const nik = String(d.nik || '').replace(/\D/g, '');
  if (ketat && nik.length !== 16) throw new Error('NIK harus 16 angka.');
  const ukuran = String(d.ukuran || '').trim();
  if (ketat && p.ukuran.indexOf(ukuran) < 0) throw new Error('Pilih ukuran baju.');
  const tgl = String(d.tgl || '').trim();
  if (ketat && !/^\d{4}-\d{2}-\d{2}$/.test(tgl)) throw new Error('Tanggal lahir tidak valid.');
  return { nama: nama, klub: klub, jk: jk, kategori: kats.join(', '), telp: telp, nik: nik, ukuran: ukuran, tgl: tgl, bukti: String(d.bukti || '') };
}

function tulisPendaftar_(a, bukti) {
  const l = kunci_();
  try {
    const sh = ss_().getSheetByName(SHEET_DAFTAR);
    const lebar = sh.getLastColumn();
    const k = petaKolom_(sh.getRange(1, 1, 1, lebar).getValues()[0]);
    // baris kosong pertama sesudah data terakhir (kolom Timestamp & Nama)
    const n = Math.max(sh.getLastRow(), 2);
    const a1 = sh.getRange(1, 1, n, Math.max(k.nama + 1, 2)).getValues();
    let akhir = 1;
    for (let i = a1.length - 1; i >= 0; i--) { if (a1[i][0] !== '' || a1[i][k.nama] !== '') { akhir = i + 1; break; } }
    const row = akhir + 1;
    const set = (idx, val) => { if (idx >= 0) sh.getRange(row, idx + 1).setValue(val); };
    set(0, new Date());
    set(k.nama, a.nama);
    set(k.klub, a.klub);
    set(k.jk, a.jk);
    if (k.tgl >= 0 && a.tgl) { const t = a.tgl.split('-'); set(k.tgl, new Date(Number(t[0]), Number(t[1]) - 1, Number(t[2]))); }
    set(k.kategori, a.kategori);
    set(k.bukti, bukti || a.bukti || '');
    set(k.ukuran, a.ukuran);
    if (k.telp >= 0) sh.getRange(row, k.telp + 1).setNumberFormat('@').setValue(a.telp);
    if (k.nik >= 0) sh.getRange(row, k.nik + 1).setNumberFormat('@').setValue(a.nik);
    if (k.valid >= 0) {
      const c = sh.getRange(row, k.valid + 1);
      if (!c.getDataValidation()) c.insertCheckboxes();
      c.setValue(false);
    }
    if (k.dada >= 0 && row > 2) {
      const c = sh.getRange(row, k.dada + 1);
      const atas = sh.getRange(row - 1, k.dada + 1);
      if (!c.getFormula() && atas.getFormula()) atas.copyTo(c, SpreadsheetApp.CopyPasteType.PASTE_FORMULA, false);
    }
    SpreadsheetApp.flush();
    return { id: SHEET_DAFTAR + '!' + row };
  } finally { l.releaseLock(); }
}

function ubahPendaftar_(d) {
  const p = pengaturan_();
  const a = bersihkanAtlet_(d, p, false);
  const l = kunci_();
  try {
    const x = lokasi_(d.id);
    const set = (idx, val) => { if (idx >= 0) x.sh.getRange(x.row, idx + 1).setValue(val); };
    set(x.k.nama, a.nama); set(x.k.klub, a.klub); set(x.k.jk, a.jk); set(x.k.kategori, a.kategori); set(x.k.ukuran, a.ukuran);
    if (x.k.tgl >= 0 && /^\d{4}-\d{2}-\d{2}$/.test(a.tgl)) { const t = a.tgl.split('-'); set(x.k.tgl, new Date(+t[0], +t[1] - 1, +t[2])); }
    if (x.k.telp >= 0) x.sh.getRange(x.row, x.k.telp + 1).setNumberFormat('@').setValue(a.telp);
    if (x.k.nik >= 0) x.sh.getRange(x.row, x.k.nik + 1).setNumberFormat('@').setValue(a.nik);
    if (d.bukti !== undefined) set(x.k.bukti, String(d.bukti));
    SpreadsheetApp.flush();
  } finally { l.releaseLock(); }
  log_('ubah', d.id + ' ' + a.nama);
  return bacaPendaftar_();
}

function hapusPendaftar_(id) {
  const l = kunci_();
  try {
    const x = lokasi_(id);
    const nama = x.k.nama >= 0 ? x.sh.getRange(x.row, x.k.nama + 1).getValue() : '';
    x.sh.deleteRow(x.row);
    log_('hapus', id + ' ' + nama);
  } finally { l.releaseLock(); }
  return bacaPendaftar_();
}

/* ------------------------------------------------------------------ */
/*  PENDAFTARAN PUBLIK                                                 */
/* ------------------------------------------------------------------ */
function folderBukti_() {
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty('FOLDER_BUKTI');
  if (id) { try { return DriveApp.getFolderById(id); } catch (e) { } }
  const f = DriveApp.createFolder('Bukti Pembayaran - ' + pengaturan_().nama_acara);
  props.setProperty('FOLDER_BUKTI', f.getId());
  return f;
}

function simpanBukti_(b, label) {
  if (!b || !b.base64) throw new Error('Unggah bukti pembayaran (foto/PDF).');
  const mime = String(b.mime || '');
  if (MIME_BUKTI.indexOf(mime) < 0) throw new Error('Bukti harus berupa foto (JPG/PNG/WEBP) atau PDF.');
  const bytes = Utilities.base64Decode(String(b.base64));
  if (bytes.length > 5 * 1024 * 1024) throw new Error('Ukuran bukti maksimal 5 MB.');
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'application/pdf': 'pdf' }[mime];
  const nama = (label || 'bukti').replace(/[^\w\- ]+/g, '').slice(0, 60) + ' - ' +
    Utilities.formatDate(new Date(), tz_(), 'yyyyMMdd-HHmmss') + '.' + ext;
  const f = folderBukti_().createFile(Utilities.newBlob(bytes, mime, nama));
  return 'https://drive.google.com/open?id=' + f.getId();
}

function cekBuka_() {
  const p = pengaturan_();
  if (!p.pendaftaran_buka) throw new Error('Pendaftaran sudah ditutup panitia.');
  return p;
}

function daftarPerorangan_(d) {
  const p = cekBuka_();
  const a = bersihkanAtlet_(d, p, true);
  const link = simpanBukti_(d.bukti, a.nama);
  tulisPendaftar_(a, link);
  log_('daftar', a.nama + ' (' + a.kategori + ')');
  return { nama: a.nama, kategori: a.kategori };
}

function daftarKolektif_(d) {
  const p = cekBuka_();
  const klub = String(d.klub || '').trim();
  if (!klub) throw new Error('Nama club / sekolah wajib diisi.');
  const list = (d.atlet || []).filter(x => x && String(x.nama || '').trim());
  if (!list.length) throw new Error('Isi minimal satu atlet.');
  if (list.length > 80) throw new Error('Maksimal 80 atlet sekali kirim.');
  const bersih = list.map((x, i) => {
    try { return bersihkanAtlet_(Object.assign({}, x, { klub: klub }), p, true); }
    catch (e) { throw new Error('Baris ' + (i + 1) + ': ' + e.message); }
  });
  const link = simpanBukti_(d.bukti, 'Kolektif ' + klub);
  bersih.forEach(a => tulisPendaftar_(a, link));
  const slot = bersih.reduce((s, a) => s + a.kategori.split(',').length, 0);
  log_('kolektif', klub + ' — ' + bersih.length + ' atlet; official ' + String(d.official || '') + ' ' + String(d.wa || ''));
  return { jumlah: bersih.length, slot: slot, biaya: slot * Number(p.biaya || 0) };
}

function daftarEstafet_(d) {
  const p = cekBuka_();
  const kat = String(d.kategori || '');
  if (p.kategori_estafet.map(k => k.nama).indexOf(kat) < 0) throw new Error('Pilih kategori estafet.');
  const pel = (d.pelari || []).map(x => String(x || '').trim().slice(0, 90));
  if (pel.slice(0, 4).some(x => !x)) throw new Error('Isi nama keempat pelari.');
  if (!String(d.klub || '').trim()) throw new Error('Nama sekolah / klub wajib diisi.');
  const l = kunci_();
  try {
    const sh = sheet_(APP.est, KOLOM_EST);
    const row = sh.getLastRow() + 1;
    sh.getRange(row, 1, 1, KOLOM_EST.length).setNumberFormat('@').setValues([[
      Utilities.getUuid().slice(0, 8), kat, String(d.klub).trim().slice(0, 120), String(d.tim || d.klub).trim().slice(0, 120),
      pel[0], pel[1], pel[2], pel[3], pel[4] || '', String(d.pelatih || '').slice(0, 90), String(d.wa || '').replace(/[^\d+]/g, ''),
      '', '', '', '', '', false, 'Web', new Date().toISOString()]]);
  } finally { l.releaseLock(); }
  log_('estafet', d.klub + ' — ' + kat);
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/*  ESTAFET                                                            */
/* ------------------------------------------------------------------ */
function bacaEstafet_() {
  sinkronFormEstafet_();
  const sh = sheet_(APP.est, KOLOM_EST);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, KOLOM_EST.length).getValues().filter(r => r[1] || r[2]).map(r => ({
    id: teks_(r[0]), kategori: teks_(r[1]), klub: teks_(r[2]), tim: teks_(r[3]),
    pelari: [teks_(r[4]), teks_(r[5]), teks_(r[6]), teks_(r[7]), teks_(r[8])],
    pelatih: teks_(r[9]), wa: teks_(r[10]),
    dada: [teks_(r[11]), teks_(r[12]), teks_(r[13]), teks_(r[14]), teks_(r[15])],
    valid: r[16] === true || String(r[16]).toUpperCase() === 'TRUE', sumber: teks_(r[17]),
    ts: r[18] instanceof Date ? r[18].toISOString() : teks_(r[18]),
  }));
}

function simpanEstafet_(rows) {
  const l = kunci_();
  try {
    const sh = sheet_(APP.est, KOLOM_EST);
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, KOLOM_EST.length).clearContent();
    if (rows.length) {
      const v = rows.map(t => [t.id || Utilities.getUuid().slice(0, 8), t.kategori, t.klub, t.tim]
        .concat((t.pelari || []).concat(['', '', '', '', '']).slice(0, 5))
        .concat([t.pelatih || '', t.wa || ''])
        .concat((t.dada || []).concat(['', '', '', '', '']).slice(0, 5))
        .concat([!!t.valid, t.sumber || '', t.ts || '']));
      sh.getRange(2, 1, v.length, KOLOM_EST.length).setNumberFormat('@').setValues(v);
    }
  } finally { l.releaseLock(); }
  return bacaEstafet_();
}

function imporEstafetLama_() {
  const sh = ss_().getSheetByName(SHEET_ESTAFET_LAMA);
  if (!sh) return;
  const v = sh.getRange(8, 2, Math.max(sh.getLastRow() - 7, 1), 16).getValues();
  const rows = [];
  v.forEach(r => {
    if (!r[1] || !r[3]) return; // C kosong / E kosong
    if (String(r[1]).toLowerCase().indexOf('nama sekolah') >= 0) return;
    rows.push({
      kategori: String(r[3]).trim(), klub: teks_(r[1]), tim: teks_(r[2]) || teks_(r[1]),
      pelari: [teks_(r[4]), teks_(r[5]), teks_(r[6]), teks_(r[7]), teks_(r[8])],
      pelatih: teks_(r[9]), wa: teks_(r[10]),
      dada: [teks_(r[11]), teks_(r[12]), teks_(r[13]), teks_(r[14]), teks_(r[15])],
      valid: true, sumber: 'Sheet ESTAFET', ts: '',
    });
  });
  if (rows.length) simpanEstafet_(rows);
}

function sinkronFormEstafet_() {
  const p = pengaturan_();
  const daftar = p.sheet_estafet_form || [];
  if (!daftar.length) return;
  const props = PropertiesService.getScriptProperties();
  const ss = ss_();
  daftar.forEach(nama => {
    const sh = ss.getSheetByName(nama);
    if (!sh || sh.getLastRow() < 2) return;
    const sudah = Number(props.getProperty('EST_' + nama) || 1);
    if (sh.getLastRow() <= sudah) return;
    const head = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0].map(x => String(x).toLowerCase());
    const c = kata => head.findIndex(h => h.indexOf(kata) >= 0);
    const baru = sh.getRange(sudah + 1, 1, sh.getLastRow() - sudah, head.length).getValues();
    const est = sheet_(APP.est, KOLOM_EST);
    baru.forEach(r => {
      const g = i => (i >= 0 ? teks_(r[i]) : '');
      if (!g(c('sekolah')) && !g(c('pelari 1'))) return;
      est.appendRow([Utilities.getUuid().slice(0, 8), g(c('kategori')), g(c('sekolah')), g(c('nama tim')),
        g(c('pelari 1')), g(c('pelari 2')), g(c('pelari 3')), g(c('pelari 4')), g(c('cadangan')),
        g(c('pelatih')), g(c('whatsapp')), '', '', '', '', '', false, 'Google Form',
        r[0] instanceof Date ? r[0].toISOString() : '']);
    });
    props.setProperty('EST_' + nama, String(sh.getLastRow()));
  });
}

/* ------------------------------------------------------------------ */
/*  SERI, WAKTU, FINAL                                                 */
/* ------------------------------------------------------------------ */
function bacaSeri_() {
  const sh = sheet_(APP.seri, KOLOM_SERI);
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, KOLOM_SERI.length).getDisplayValues().filter(r => r[0]).map(r => ({
    kategori: r[0], jk: r[1], babak: r[2], seri: Number(r[3]) || 1, lintasan: Number(r[4]) || 0,
    dada: r[5], nama: r[6], klub: r[7], waktu: r[8], ket: r[9],
  }));
}

/** d = {kategori, jk, babak, rows:[...]} → ganti semua baris untuk kunci tsb. babak kosong = semua babak */
function simpanSeri_(d) {
  const l = kunci_();
  try {
    const semua = bacaSeri_().filter(r => !(r.kategori === d.kategori && r.jk === d.jk && (!d.babak || r.babak === d.babak)));
    (d.rows || []).forEach(r => semua.push({
      kategori: d.kategori, jk: d.jk, babak: r.babak || d.babak || 'Penyisihan', seri: r.seri, lintasan: r.lintasan,
      dada: r.dada || '', nama: r.nama || '', klub: r.klub || '', waktu: r.waktu || '', ket: r.ket || '',
    }));
    const sh = sheet_(APP.seri, KOLOM_SERI);
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, KOLOM_SERI.length).clearContent();
    if (semua.length) {
      sh.getRange(2, 1, semua.length, KOLOM_SERI.length).setNumberFormat('@').setValues(
        semua.map(r => [r.kategori, r.jk, r.babak, String(r.seri), String(r.lintasan), String(r.dada), r.nama, r.klub, String(r.waktu), r.ket]));
    }
  } finally { l.releaseLock(); }
  return bacaSeri_();
}

/* ------------------------------------------------------------------ */
/*  GOOGLE FORM                                                        */
/* ------------------------------------------------------------------ */
function infoForm_() {
  const ss = ss_();
  const out = { terhubung: [] };
  try {
    const url = ss.getFormUrl();
    if (url) {
      const f = FormApp.openByUrl(url);
      out.utama = { judul: f.getTitle(), editUrl: f.getEditUrl(), publikUrl: f.getPublishedUrl(), buka: f.isAcceptingResponses() };
    }
  } catch (e) { out.utamaError = String(e.message || e); }
  ss.getSheets().forEach(sh => {
    try {
      const u = sh.getFormUrl();
      if (u) {
        const f = FormApp.openByUrl(u);
        out.terhubung.push({ sheet: sh.getName(), judul: f.getTitle(), editUrl: f.getEditUrl(), publikUrl: f.getPublishedUrl(), buka: f.isAcceptingResponses(), id: f.getId() });
      }
    } catch (e) { }
  });
  return out;
}

/** Buka / tutup form & perbarui pilihan kategori + ukuran pada form yang terhubung */
function aturForm_(d) {
  const p = pengaturan_();
  const hasil = [];
  ss_().getSheets().forEach(sh => {
    let u; try { u = sh.getFormUrl(); } catch (e) { }
    if (!u) return;
    if (d.sheet && d.sheet !== sh.getName()) return;
    const f = FormApp.openByUrl(u);
    if (d.buka !== undefined) f.setAcceptingResponses(!!d.buka);
    if (d.perbaruiPilihan) {
      f.getItems().forEach(it => {
        const t = it.getTitle().toLowerCase();
        const pilihan = t.indexOf('kategori estafet') >= 0 ? p.kategori_estafet.map(k => k.nama)
          : t.indexOf('kategori') >= 0 ? p.kategori.map(k => k.nama)
            : t.indexOf('ukuran') >= 0 ? p.ukuran : null;
        if (!pilihan) return;
        const tipe = it.getType();
        if (tipe === FormApp.ItemType.MULTIPLE_CHOICE) it.asMultipleChoiceItem().setChoiceValues(pilihan);
        else if (tipe === FormApp.ItemType.CHECKBOX) it.asCheckboxItem().setChoiceValues(pilihan);
        else if (tipe === FormApp.ItemType.LIST) it.asListItem().setChoiceValues(pilihan);
      });
    }
    hasil.push(sh.getName());
  });
  log_('aturForm', JSON.stringify(d));
  return infoForm_();
}

/**
 * d = {jenis:'perorangan'|'estafet', judul, deskripsi, multiKategori, kategori:[], ukuran:[]}
 * Form baru otomatis tersambung ke spreadsheet ini (tab baru) dan langsung terbaca web.
 */
function buatForm_(d) {
  const p = pengaturan_();
  const judul = String(d.judul || ('Pendaftaran ' + p.nama_acara)).slice(0, 120);
  const form = FormApp.create(judul);
  form.setDescription(String(d.deskripsi || (p.nama_acara + ' — ' + p.tanggal + ' — ' + p.lokasi)));
  form.setCollectEmail(false);
  form.setProgressBar(false);
  form.setConfirmationMessage('Terima kasih! Pendaftaran sudah kami terima. Panitia akan memvalidasi pembayaran dan mengumumkan nomor dada.');

  const wajib = (it) => it.setRequired(true);
  if (d.jenis === 'estafet') {
    wajib(form.addTextItem().setTitle('Nama Sekolah / Klub'));
    wajib(form.addTextItem().setTitle('Nama Tim / Regu'));
    wajib(form.addMultipleChoiceItem().setTitle('Kategori Estafet').setChoiceValues(d.kategori && d.kategori.length ? d.kategori : p.kategori_estafet.map(k => k.nama)));
    [1, 2, 3, 4].forEach(i => wajib(form.addTextItem().setTitle('Pelari ' + i)));
    form.addTextItem().setTitle('Pelari Cadangan');
    wajib(form.addTextItem().setTitle('Nama Pelatih / Official'));
    wajib(form.addTextItem().setTitle('No. Kontak / WhatsApp').setValidation(
      FormApp.createTextValidation().setHelpText('Isi angka saja, 9–15 digit.').requireTextMatchesPattern('^[0-9+ -]{9,18}$').build()));
  } else {
    wajib(form.addTextItem().setTitle('Nama Atlet').setHelpText('Tulis nama lengkap sesuai akta/KK.'));
    wajib(form.addTextItem().setTitle('Nama Club / Asal Sekolah'));
    wajib(form.addMultipleChoiceItem().setTitle('Jenis Kelamin').setChoiceValues(['Putra', 'Putri']));
    wajib(form.addDateItem().setTitle('Tanggal Lahir'));
    const kats = d.kategori && d.kategori.length ? d.kategori : p.kategori.map(k => k.nama);
    if (d.multiKategori) wajib(form.addCheckboxItem().setTitle('Kategori Perlombaan').setChoiceValues(kats));
    else wajib(form.addMultipleChoiceItem().setTitle('Kategori Perlombaan').setChoiceValues(kats));
    form.addSectionHeaderItem().setTitle('Pembayaran')
      .setHelpText(String(p.info_bayar || '') + '\nBiaya: Rp ' + Number(p.biaya || 0).toLocaleString('id-ID') + ' per kategori.');
    wajib(form.addListItem().setTitle('Ukuran Baju/Jersey').setChoiceValues(d.ukuran && d.ukuran.length ? d.ukuran : p.ukuran));
    wajib(form.addTextItem().setTitle('Nomor Tlp Aktif').setValidation(
      FormApp.createTextValidation().setHelpText('Isi angka saja, 9–15 digit.').requireTextMatchesPattern('^[0-9+]{9,15}$').build()));
    wajib(form.addTextItem().setTitle('Masukan NIK').setValidation(
      FormApp.createTextValidation().setHelpText('NIK harus 16 angka.').requireTextMatchesPattern('^[0-9]{16}$').build()));
  }

  const ss = ss_();
  const sebelum = ss.getSheets().map(s => s.getSheetId());
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();
  Utilities.sleep(1500);
  const baru = ss_().getSheets().filter(s => sebelum.indexOf(s.getSheetId()) < 0)[0];
  let namaSheet = '';
  if (baru) {
    namaSheet = (d.jenis === 'estafet' ? 'Form Estafet ' : 'Form Daftar ') + Utilities.formatDate(new Date(), tz_(), 'dd-MM HHmm');
    try { baru.setName(namaSheet); } catch (e) { namaSheet = baru.getName(); }
    if (d.jenis !== 'estafet') {
      // kolom tambahan agar sama dengan Form Responses 1
      const lebar = baru.getLastColumn();
      baru.getRange(1, lebar + 1, 1, 2).setValues([['Validasi Pembayaran', 'No. Dada']]);
      baru.getRange(2, lebar + 1, 1000, 1).insertCheckboxes();
    }
  }
  const p2 = pengaturan_();
  if (namaSheet) {
    if (d.jenis === 'estafet') p2.sheet_estafet_form = (p2.sheet_estafet_form || []).concat([namaSheet]);
    else p2.sheet_pendaftaran = (p2.sheet_pendaftaran || [SHEET_DAFTAR]).concat([namaSheet]);
    simpanPengaturan_(p2);
  }
  log_('buatForm', judul + ' → ' + namaSheet);
  return { judul: judul, editUrl: form.getEditUrl(), publikUrl: form.getPublishedUrl(), sheet: namaSheet, form: infoForm_() };
}

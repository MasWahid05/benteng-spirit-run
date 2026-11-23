/* Halaman pendaftaran publik */
(function () {
  'use strict';
  const BSR = window.BSR;
  const $ = (s, el) => (el || document).querySelector(s);
  const $$ = (s, el) => Array.from((el || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const rp = n => 'Rp ' + Math.round(Number(n) || 0).toLocaleString('id-ID');
  const IC = {
    up: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  };
  let INFO = null, tab = 'perorangan';
  const bukti = {};

  function toast(m, t) { const e = document.createElement('div'); e.className = 'toast ' + (t || ''); e.textContent = m; $('#toasts').appendChild(e); setTimeout(() => e.remove(), t === 'err' ? 7000 : 3500); }
  function busy(on, m) { $('#loading').classList.toggle('hidden', !on); if (m) $('#loading-msg').textContent = m; }

  // perkecil foto agar cepat terkirim (maks 1600px, JPEG)
  async function bacaBukti(file) {
    if (!file) return null;
    if (file.type === 'application/pdf') {
      if (file.size > 5 * 1024 * 1024) throw new Error('PDF maksimal 5 MB.');
      return { mime: 'application/pdf', base64: await keBase64(file), nama: file.name, pratinjau: null };
    }
    if (!/^image\//.test(file.type)) throw new Error('Bukti harus foto atau PDF.');
    const url = URL.createObjectURL(file);
    try {
      const img = new Image(); img.src = url; await img.decode();
      const s = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
      const c = document.createElement('canvas'); c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      const data = c.toDataURL('image/jpeg', 0.82);
      return { mime: 'image/jpeg', base64: data.split(',')[1], nama: file.name, pratinjau: data };
    } finally { URL.revokeObjectURL(url); }
  }
  function keBase64(file) { return new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.onerror = no; r.readAsDataURL(file); }); }

  const field = (name, label, attrs) => '<label class="field"><span>' + label + '</span><input class="input" name="' + name + '" ' + (attrs || '') + '></label>';
  const dropZone = id => '<div class="sec">Bukti pembayaran</div>' + (INFO.info_bayar ? '<p class="note small" style="margin-bottom:10px">' + esc(INFO.info_bayar) + '</p>' : '') +
    '<label class="drop" id="drop-' + id + '">' + IC.up + '<div style="flex:1"><b id="dropt-' + id + '">Unggah foto / PDF bukti transfer</b><div class="small muted">JPG, PNG, atau PDF • maks. 5 MB</div></div><input type="file" accept="image/*,application/pdf" class="sr" id="file-' + id + '"></label>';
  function bindDrop(id) {
    const z = $('#drop-' + id), inp = $('#file-' + id);
    const pakai = async f => {
      try { busy(true, 'Menyiapkan bukti…'); bukti[id] = await bacaBukti(f); $('#dropt-' + id).textContent = '✓ ' + f.name; const old = $('img', z); if (old) old.remove(); if (bukti[id].pratinjau) z.insertAdjacentHTML('afterbegin', '<img alt="Pratinjau bukti" src="' + bukti[id].pratinjau + '">'); }
      catch (e) { bukti[id] = null; toast(e.message, 'err'); } finally { busy(false); }
    };
    inp.onchange = () => inp.files[0] && pakai(inp.files[0]);
    z.ondragover = e => { e.preventDefault(); z.classList.add('over'); };
    z.ondragleave = () => z.classList.remove('over');
    z.ondrop = e => { e.preventDefault(); z.classList.remove('over'); if (e.dataTransfer.files[0]) pakai(e.dataTransfer.files[0]); };
  }
  const setuju = '<label class="check" style="margin-top:14px;font-weight:500;align-items:flex-start"><input type="checkbox" name="setuju" required style="margin-top:3px"> <span>Data yang saya isi benar. Saya setuju data dipakai panitia untuk keperluan lomba (verifikasi, nomor dada, hasil).</span></label>';
  const ukuranOpt = () => '<option value="">— pilih ukuran —</option>' + INFO.ukuran.map(u => '<option>' + esc(u) + '</option>').join('');

  function render() {
    $$('.tabs button').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === tab));
    const P = $('#panel');
    if (!INFO.pendaftaran_buka) { P.innerHTML = '<div class="done"><h2>Pendaftaran sudah ditutup</h2><p class="muted">Terima kasih atas antusiasmenya. Hubungi panitia untuk informasi lebih lanjut.</p></div>'; return; }
    if (tab === 'perorangan') {
      P.innerHTML = '<h2>Pendaftaran perorangan</h2><p class="muted small">Satu formulir untuk satu atlet. Boleh pilih lebih dari satu kategori.</p><form id="f1" novalidate>' +
        '<div class="sec">Data atlet</div>' + field('nama', 'Nama lengkap atlet (sesuai akta/KK)', 'required autocomplete="off" maxlength="90"') +
        field('klub', 'Nama club / asal sekolah', 'required maxlength="120"') +
        '<div class="grid-2"><div class="field"><span>Jenis kelamin</span><div class="chips">' + ['Putra', 'Putri'].map(j => '<label class="chip"><input type="radio" name="jk" value="' + j + '" required><span>' + j + '</span></label>').join('') + '</div></div>' +
        field('tgl', 'Tanggal lahir', 'type="date" required max="' + new Date().toISOString().slice(0, 10) + '"') + '</div>' +
        '<div class="sec">Kategori lomba</div><div class="chips">' + INFO.kategori.map(k => '<label class="chip"><input type="checkbox" name="kategori" value="' + esc(k) + '"><span>' + esc(k) + '</span></label>').join('') + '</div>' +
        '<div class="sec">Kontak & baju</div><div class="grid-2"><label class="field"><span>Ukuran baju / jersey</span><select class="input" name="ukuran" required>' + ukuranOpt() + '</select></label>' +
        field('telp', 'Nomor HP / WA aktif (orang tua)', 'type="tel" inputmode="tel" required placeholder="08…"') + '</div>' +
        field('nik', 'NIK atlet (16 angka, dari KK)', 'inputmode="numeric" required maxlength="16" pattern="[0-9]{16}"') +
        dropZone('1') + '<div class="total"><span>Total biaya</span><b id="tot1">' + rp(0) + '</b></div>' + setuju +
        '<button class="btn btn-brand" style="width:100%;min-height:50px;margin-top:16px;font-size:1rem">Kirim pendaftaran</button></form>';
      const f = $('#f1');
      const hit = () => $('#tot1').textContent = rp($$('[name=kategori]:checked', f).length * INFO.biaya);
      $$('[name=kategori]', f).forEach(c => c.onchange = hit);
      $('[name=nik]', f).oninput = e => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16);
      bindDrop('1');
      f.onsubmit = async e => {
        e.preventDefault();
        const kat = $$('[name=kategori]:checked', f).map(c => c.value);
        if (!f.checkValidity()) { f.reportValidity(); return; }
        if (!kat.length) { toast('Pilih minimal satu kategori lomba.', 'err'); return; }
        if (!bukti['1']) { toast('Unggah bukti pembayaran dulu.', 'err'); return; }
        const v = Object.fromEntries(new FormData(f));
        await kirim('daftar', { nama: v.nama, klub: v.klub, jk: v.jk, tgl: v.tgl, kategori: kat, ukuran: v.ukuran, telp: v.telp, nik: v.nik, bukti: bukti['1'] },
          r => '<b>' + esc(r.nama) + '</b> terdaftar di <b>' + esc(r.kategori) + '</b>.');
      };
    } else if (tab === 'kolektif') {
      P.innerHTML = '<h2>Pendaftaran kolektif</h2><p class="muted small">Untuk pelatih/official yang mendaftarkan banyak atlet sekaligus dengan satu bukti transfer. Atlet yang ikut 2 kategori cukup centang keduanya.</p><form id="f2" novalidate>' +
        '<div class="sec">Club / sekolah</div>' + field('klub', 'Nama club / asal sekolah', 'required maxlength="120"') +
        '<div class="grid-2">' + field('official', 'Nama official / penanggung jawab', 'required') + field('wa', 'No. WhatsApp official', 'type="tel" inputmode="tel" required') + '</div>' +
        '<div class="sec">Daftar atlet</div><div id="rows"></div><button type="button" class="btn" id="add" style="width:100%">' + IC.plus + 'Tambah atlet</button>' +
        dropZone('2') + '<div class="total"><span id="ringkas2">0 atlet • 0 slot</span><b id="tot2">' + rp(0) + '</b></div>' + setuju +
        '<button class="btn btn-brand" style="width:100%;min-height:50px;margin-top:16px;font-size:1rem">Kirim pendaftaran kolektif</button></form>';
      const f = $('#f2'), rows = $('#rows');
      let n = 0;
      const tambah = () => {
        n++;
        rows.insertAdjacentHTML('beforeend', '<div class="rowk" data-r="' + n + '"><span class="no">Atlet</span><button type="button" class="btn btn-sm btn-icon btn-ghost del" aria-label="Hapus atlet">' + IC.x + '</button>' +
          '<div class="grid-2" style="margin-top:6px">' + field('nama', 'Nama lengkap', 'required maxlength="90"') + '<div class="field"><span>Jenis kelamin</span><div class="chips">' + ['Putra', 'Putri'].map(j => '<label class="chip"><input type="radio" name="jk' + n + '" value="' + j + '" required><span>' + j + '</span></label>').join('') + '</div></div>' +
          field('tgl', 'Tanggal lahir', 'type="date" required') + '<label class="field"><span>Ukuran baju</span><select class="input" name="ukuran" required>' + ukuranOpt() + '</select></label>' +
          field('telp', 'No. HP / WA', 'type="tel" inputmode="tel" required') + field('nik', 'NIK (16 angka)', 'inputmode="numeric" maxlength="16" pattern="[0-9]{16}" required') + '</div>' +
          '<div class="field"><span>Kategori</span><div class="chips">' + INFO.kategori.map(k => '<label class="chip"><input type="checkbox" name="kat" value="' + esc(k) + '"><span>' + esc(k) + '</span></label>').join('') + '</div></div></div>');
        nomori();
      };
      const nomori = () => {
        $$('.rowk', rows).forEach((r, i) => { $('.no', r).textContent = 'Atlet ' + (i + 1); $('.del', r).onclick = () => { if ($$('.rowk', rows).length > 1) { r.remove(); nomori(); } }; $$('[name=kat]', r).forEach(c => c.onchange = hit); $('[name=nik]', r).oninput = e => e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16); });
        hit();
      };
      const hit = () => { const a = $$('.rowk', rows).length, s = $$('[name=kat]:checked', rows).length; $('#ringkas2').textContent = a + ' atlet • ' + s + ' slot'; $('#tot2').textContent = rp(s * INFO.biaya); };
      $('#add').onclick = tambah; tambah();
      bindDrop('2');
      f.onsubmit = async e => {
        e.preventDefault();
        if (!f.checkValidity()) { f.reportValidity(); return; }
        const atlet = $$('.rowk', rows).map(r => ({ nama: $('[name=nama]', r).value, jk: ($('input[type=radio]:checked', r) || {}).value, tgl: $('[name=tgl]', r).value, ukuran: $('[name=ukuran]', r).value, telp: $('[name=telp]', r).value, nik: $('[name=nik]', r).value, kategori: $$('[name=kat]:checked', r).map(c => c.value) }));
        const kurang = atlet.findIndex(a => !a.kategori.length);
        if (kurang >= 0) { toast('Atlet ' + (kurang + 1) + ' belum memilih kategori.', 'err'); return; }
        if (!bukti['2']) { toast('Unggah bukti pembayaran dulu.', 'err'); return; }
        await kirim('daftarKolektif', { klub: f.klub.value, official: f.official.value, wa: f.wa.value, atlet, bukti: bukti['2'] },
          r => '<b>' + r.jumlah + ' atlet</b> (' + r.slot + ' slot lomba) dari <b>' + esc(f.klub.value) + '</b> terdaftar. Total biaya <b>' + rp(r.biaya) + '</b>.');
      };
    } else {
      P.innerHTML = '<h2>Pendaftaran tim estafet</h2><p class="muted small">Satu tim terdiri dari 4 pelari + 1 cadangan (opsional). Pembayaran estafet dikonfirmasi oleh official ke panitia.</p><form id="f3" novalidate>' +
        '<div class="sec">Tim</div>' + field('klub', 'Nama sekolah / club', 'required maxlength="120"') +
        '<div class="grid-2">' + field('tim', 'Nama tim / regu', 'maxlength="120" placeholder="Boleh sama dengan sekolah"') +
        '<label class="field"><span>Kategori estafet</span><select class="input" name="kategori" required><option value="">— pilih —</option>' + INFO.kategori_estafet.map(k => '<option>' + esc(k) + '</option>').join('') + '</select></label></div>' +
        '<div class="sec">Pelari</div><div class="grid-2">' + [1, 2, 3, 4].map(i => field('p' + i, 'Pelari ' + i, 'required maxlength="90"')).join('') + field('p5', 'Pelari cadangan (opsional)', 'maxlength="90"') + '</div>' +
        '<div class="sec">Pelatih</div><div class="grid-2">' + field('pelatih', 'Nama pelatih / official', 'required') + field('wa', 'No. WhatsApp', 'type="tel" inputmode="tel" required') + '</div>' + setuju +
        '<button class="btn btn-brand" style="width:100%;min-height:50px;margin-top:16px;font-size:1rem">Kirim tim estafet</button></form>';
      const f = $('#f3');
      f.onsubmit = async e => {
        e.preventDefault();
        if (!f.checkValidity()) { f.reportValidity(); return; }
        const v = Object.fromEntries(new FormData(f));
        await kirim('daftarEstafet', { klub: v.klub, tim: v.tim || v.klub, kategori: v.kategori, pelari: [v.p1, v.p2, v.p3, v.p4, v.p5], pelatih: v.pelatih, wa: v.wa },
          () => 'Tim <b>' + esc(v.tim || v.klub) + '</b> terdaftar di estafet <b>' + esc(v.kategori) + '</b>.');
      };
    }
  }

  async function kirim(aksi, data, pesan) {
    busy(true, 'Mengirim pendaftaran… jangan tutup halaman');
    try {
      const r = await BSR.call(aksi, data);
      Object.keys(bukti).forEach(k => delete bukti[k]);
      $('#panel').innerHTML = '<div class="done"><div class="ok">' + IC.ok + '</div><h2>Pendaftaran terkirim!</h2><p>' + pesan(r) + '</p><p class="muted small">Panitia akan memeriksa bukti pembayaran. Nomor dada diumumkan setelah validasi.</p><button class="btn btn-brand" id="lagi">Daftar lagi</button></div>';
      $('#lagi').onclick = render;
      window.scrollTo({ top: $('.wrapf').offsetTop - 20, behavior: 'smooth' });
    } catch (e) { toast(e.message, 'err'); } finally { busy(false); }
  }

  async function mulai() {
    if (!BSR.apiUrl()) { BSR.demo = true; $('#note-top').innerHTML = '<p class="note warn small" style="margin-top:12px"><b>Pratinjau:</b> halaman belum tersambung ke spreadsheet panitia, data tidak benar-benar tersimpan.</p>'; }
    else BSR.demo = false;
    try { INFO = await BSR.call('info'); }
    catch (e) { $('#panel').innerHTML = '<div class="done"><h2>Halaman belum siap</h2><p class="muted">' + esc(e.message) + '</p></div>'; return; }
    const nm = String(INFO.nama_acara || 'BENTENG SPIRIT RUN');
    const i = nm.lastIndexOf(' ');
    $('#h-nama').innerHTML = i > 0 ? esc(nm.slice(0, i)) + ' <span>' + esc(nm.slice(i + 1)) + '</span>' : esc(nm);
    $('#h-org').textContent = INFO.penyelenggara;
    document.title = 'Pendaftaran ' + nm;
    $('#facts').innerHTML = [['Tanggal', INFO.tanggal], ['Lokasi', INFO.lokasi], ['Biaya', rp(INFO.biaya) + ' / kategori']].filter(x => x[1]).map(x => '<div><span>' + x[0] + '</span><b>' + esc(x[1]) + '</b></div>').join('');
    $$('.tabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; render(); });
    render();
  }
  mulai();
})();

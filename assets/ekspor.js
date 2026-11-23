/* Ekspor Excel (ExcelJS) & PDF (jsPDF + AutoTable) — rapi, berkop, siap cetak A4. */
(function () {
  const X = (window.BSR_EKSPOR = {});
  const LIB = {
    excel: ['https://cdn.jsdelivr.net/npm/exceljs@4.4.0/dist/exceljs.min.js'],
    pdf: ['https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js'],
  };
  const muat = {};
  function script(src) {
    if (muat[src]) return muat[src];
    return (muat[src] = new Promise((ok, gagal) => {
      const s = document.createElement('script');
      s.src = src; s.onload = ok; s.onerror = () => { delete muat[src]; gagal(new Error('Gagal memuat pustaka ekspor. Periksa internet.')); };
      document.head.appendChild(s);
    }));
  }
  async function siap(jenis) { for (const s of LIB[jenis]) await script(s); }

  const HIJAU = '0F6B3A', HIJAU_RGB = [15, 107, 58], KUNING_RGB = [245, 196, 0];
  const info = () => (window.BSR_INFO ? window.BSR_INFO() : { acara: 'BENTENG SPIRIT RUN 2026', penyelenggara: 'Pengurus Cabang PASI Kota Tangerang', tanggal: '', lokasi: '', ketua: '', referee: '' });
  const stamp = () => {
    const d = new Date();
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + ' ' + d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };
  const namaFile = s => String(s).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim();
  function unduh(blob, nama) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = nama;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  X.unduh = unduh;

  /* ======================= EXCEL ======================= */
  // sheets: [{nama, judul, sub, orientasi, blok:[{judul, kolom:[{h,w,align,teks}], baris:[[]], total:[] }]}]
  X.excel = async function (file, sheets) {
    await siap('excel');
    const I = info();
    const wb = new window.ExcelJS.Workbook();
    wb.creator = I.penyelenggara; wb.created = new Date();
    const garis = { style: 'thin', color: { argb: 'FFC9D3CD' } };
    const kotak = { top: garis, left: garis, bottom: garis, right: garis };
    const dipakai = new Set();
    sheets.forEach(sh => {
      let nm = namaFile(sh.nama).slice(0, 31) || 'Data';
      let k = 2; while (dipakai.has(nm.toLowerCase())) nm = nm.slice(0, 28) + ' ' + k++;
      dipakai.add(nm.toLowerCase());
      const blok = sh.blok || [{ kolom: sh.kolom, baris: sh.baris, total: sh.total }];
      const lebar = Math.max(...blok.map(b => b.kolom.length));
      const ws = wb.addWorksheet(nm, {
        views: [{ showGridLines: false }],
        pageSetup: { paperSize: 9, orientation: sh.orientasi || (lebar > 7 ? 'landscape' : 'portrait'), fitToPage: true, fitToWidth: 1, fitToHeight: 0, horizontalCentered: true, margins: { left: 0.4, right: 0.4, top: 0.5, bottom: 0.6, header: 0.2, footer: 0.3 } },
        headerFooter: { oddFooter: '&L&8' + I.acara + ' — dicetak ' + stamp() + '&R&8Halaman &P dari &N' },
      });
      // lebar kolom: ambil terbesar antar blok
      for (let c = 0; c < lebar; c++) {
        const w = Math.max(...blok.map(b => (b.kolom[c] && b.kolom[c].w) || 0), 8);
        ws.getColumn(c + 1).width = w;
      }
      const judul = (r, teks, opt) => {
        ws.mergeCells(r, 1, r, lebar);
        const c = ws.getCell(r, 1); c.value = teks;
        c.font = Object.assign({ name: 'Calibri', size: 11 }, opt.font || {});
        c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        if (opt.fill) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opt.fill } };
        ws.getRow(r).height = opt.h || 18;
      };
      judul(1, I.acara, { font: { size: 15, bold: true, color: { argb: 'FFFFFFFF' } }, fill: 'FF' + HIJAU, h: 26 });
      judul(2, I.penyelenggara + (I.tanggal ? '  •  ' + I.tanggal : '') + (I.lokasi ? '  •  ' + I.lokasi : ''), { font: { size: 9.5, color: { argb: 'FF1D1800' } }, fill: 'FFF5C400', h: 17 });
      judul(3, sh.judul || nm, { font: { size: 13, bold: true, color: { argb: 'FF0F1A14' } }, h: 24 });
      let r = 4;
      if (sh.sub) { judul(4, sh.sub, { font: { size: 9.5, italic: true, color: { argb: 'FF5B6B63' } } }); r = 5; }
      r++;
      let headPertama = 0;
      blok.forEach((b, bi) => {
        if (b.judul) {
          ws.mergeCells(r, 1, r, b.kolom.length);
          const c = ws.getCell(r, 1);
          c.value = b.judul; c.font = { bold: true, size: 11, color: { argb: 'FF0F6B3A' } };
          c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE6F2EA' } };
          c.alignment = { vertical: 'middle', indent: 1 };
          ws.getRow(r).height = 20; r++;
        }
        const hr = ws.getRow(r);
        b.kolom.forEach((k, i) => {
          const c = hr.getCell(i + 1);
          c.value = k.h; c.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 10 };
          c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF' + HIJAU } };
          c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }; c.border = kotak;
        });
        hr.height = 22;
        if (!headPertama) headPertama = r;
        const awalData = r + 1;
        r++;
        (b.baris || []).forEach((row, ri) => {
          const xr = ws.getRow(r);
          b.kolom.forEach((k, i) => {
            const c = xr.getCell(i + 1);
            let v = row[i];
            if (v === undefined || v === null) v = '';
            if (k.teks) { c.value = String(v); c.numFmt = '@'; } else c.value = v;
            if (k.fmt) c.numFmt = k.fmt;
            c.border = kotak;
            c.font = { size: 10, bold: !!k.tebal };
            c.alignment = { horizontal: k.align || (typeof v === 'number' ? 'center' : 'left'), vertical: 'middle', wrapText: !!k.wrap };
            if (ri % 2 === 1) c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4F8F5' } };
          });
          xr.height = 18; r++;
        });
        if (!(b.baris || []).length) {
          ws.mergeCells(r, 1, r, b.kolom.length);
          const c = ws.getCell(r, 1); c.value = 'Belum ada data'; c.alignment = { horizontal: 'center' }; c.font = { italic: true, color: { argb: 'FF5B6B63' } }; c.border = kotak; r++;
        }
        if (b.total) {
          const tr = ws.getRow(r);
          b.kolom.forEach((k, i) => {
            const c = tr.getCell(i + 1); c.value = b.total[i] == null ? '' : b.total[i];
            c.font = { bold: true, size: 10 }; c.border = kotak;
            c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFF4C2' } };
            c.alignment = { horizontal: k.align || (typeof b.total[i] === 'number' ? 'center' : 'left'), vertical: 'middle' };
            if (k.fmt) c.numFmt = k.fmt;
          });
          r++;
        }
        if (blok.length === 1 && (b.baris || []).length > 1 && !sh.tanpaFilter) {
          ws.autoFilter = { from: { row: awalData - 1, column: 1 }, to: { row: r - 1 - (b.total ? 1 : 0), column: b.kolom.length } };
        }
        r += bi < blok.length - 1 ? 1 : 0;
      });
      if (blok.length === 1 && headPertama) {
        ws.views = [{ state: 'frozen', ySplit: headPertama, showGridLines: false }];
        ws.pageSetup.printTitlesRow = headPertama + ':' + headPertama;
      }
      if (sh.catatan) {
        r++;
        ws.mergeCells(r, 1, r, lebar);
        const c = ws.getCell(r, 1); c.value = sh.catatan; c.font = { italic: true, size: 9, color: { argb: 'FF5B6B63' } }; c.alignment = { wrapText: true };
        ws.getRow(r).height = 30;
      }
    });
    const buf = await wb.xlsx.writeBuffer();
    unduh(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), namaFile(file) + '.xlsx');
  };

  /* ======================= PDF ======================= */
  let kopData = null;
  async function kop() {
    if (kopData) return kopData;
    try {
      const img = new Image();
      img.src = 'assets/kop.jpg';
      await img.decode();
      const cv = document.createElement('canvas');
      cv.width = img.naturalWidth; cv.height = img.naturalHeight;
      cv.getContext('2d').drawImage(img, 0, 0);
      kopData = { url: cv.toDataURL('image/jpeg', 0.92), rasio: img.naturalHeight / img.naturalWidth };
    } catch (e) { kopData = { url: null, rasio: 0 }; }
    return kopData;
  }

  function dokumen(orientasi) {
    const { jsPDF } = window.jspdf;
    return new jsPDF({ orientation: orientasi || 'portrait', unit: 'mm', format: 'a4', compress: true });
  }

  async function kepala(doc, judul, sub) {
    const W = doc.internal.pageSize.getWidth();
    const k = await kop();
    let y = 8;
    if (k.url) {
      const w = Math.min(W - 20, 190), h = w * k.rasio;
      doc.addImage(k.url, 'JPEG', (W - w) / 2, y, w, h);
      y += h + 2;
    } else {
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13);
      doc.text(info().penyelenggara.toUpperCase(), W / 2, y + 6, { align: 'center' });
      y += 12;
    }
    const I = info();
    doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(15, 26, 20);
    doc.text(I.acara, W / 2, y + 5, { align: 'center' });
    doc.setFontSize(11.5); doc.setTextColor(...HIJAU_RGB);
    const jl = doc.splitTextToSize(String(judul).toUpperCase(), W - 30);
    doc.text(jl, W / 2, y + 11, { align: 'center' });
    y += 11 + (jl.length - 1) * 5;
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(91, 107, 99);
    const meta = [I.tanggal, I.lokasi].filter(Boolean).join('  •  ');
    if (meta) { doc.text(meta, W / 2, y + 5, { align: 'center' }); y += 5; }
    if (sub) { const sl = doc.splitTextToSize(sub, W - 30); doc.text(sl, W / 2, y + 5, { align: 'center' }); y += 5 * sl.length; }
    doc.setTextColor(0);
    return y + 5;
  }

  function kaki(doc, judul) {
    const n = doc.internal.getNumberOfPages();
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= n; i++) {
      doc.setPage(i);
      doc.setDrawColor(...KUNING_RGB); doc.setLineWidth(0.8); doc.line(10, H - 11, W - 10, H - 11);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(91, 107, 99);
      doc.text(info().acara + ' — ' + judul, 10, H - 6.5);
      doc.text('Dicetak ' + stamp() + '   •   Halaman ' + i + ' dari ' + n, W - 10, H - 6.5, { align: 'right' });
      if (i > 1) {
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...HIJAU_RGB);
        doc.text(info().acara + '  •  ' + String(judul).toUpperCase(), 10, 8);
      }
    }
    doc.setTextColor(0);
  }

  function tandaTangan(doc, y, ttd) {
    const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
    if (y + 42 > H - 14) { doc.addPage(); y = 18; }
    const I = info();
    const kolom = ttd === 'dua' ? [{ jab: 'Referee / Juri Utama', nama: I.referee }, { jab: 'Ketua Panitia', nama: I.ketua }] : [{ jab: 'Ketua Panitia', nama: I.ketua }];
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
    const tgl = 'Tangerang, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    kolom.forEach((k, i) => {
      const x = kolom.length === 1 ? W - 60 : (i === 0 ? 45 : W - 60);
      if (i === kolom.length - 1) doc.text(tgl, x, y + 6, { align: 'center' });
      doc.text(k.jab + ',', x, y + 11, { align: 'center' });
      doc.setFont('helvetica', 'bold');
      doc.text(k.nama ? k.nama : '( ..................................... )', x, y + 34, { align: 'center' });
      doc.setFont('helvetica', 'normal');
    });
    return y + 40;
  }

  // opsi: {orientasi, judul, sub, blok:[{judul, kolom:[{h,w(mm),align}], baris, total}], ttd:false|'satu'|'dua', catatan, utuh:true}
  X.pdf = async function (file, o) {
    await siap('pdf');
    const doc = dokumen(o.orientasi);
    const H = doc.internal.pageSize.getHeight();
    let y = await kepala(doc, o.judul, o.sub);
    const blok = o.blok || [{ kolom: o.kolom, baris: o.baris, total: o.total }];
    blok.forEach((b, i) => {
      const perkiraan = 8 + 7 * Math.min((b.baris || []).length + 1, o.utuh ? 12 : 4);
      if (i > 0 && y + perkiraan > H - 16) { doc.addPage(); y = 14; }
      if (b.judul) {
        doc.setFillColor(230, 242, 234); doc.roundedRect(10, y, doc.internal.pageSize.getWidth() - 20, 7, 1.2, 1.2, 'F');
        doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...HIJAU_RGB);
        doc.text(String(b.judul), 13, y + 4.9);
        if (b.kanan) doc.text(String(b.kanan), doc.internal.pageSize.getWidth() - 13, y + 4.9, { align: 'right' });
        doc.setTextColor(0); y += 8.5;
      }
      const colStyles = {};
      b.kolom.forEach((k, ci) => { colStyles[ci] = { halign: k.align || 'left' }; if (k.pw) colStyles[ci].cellWidth = k.pw; if (k.tebal) colStyles[ci].fontStyle = 'bold'; });
      const body = (b.baris || []).map(r => r.map(v => (v == null ? '' : String(v))));
      if (!body.length) body.push([{ content: 'Belum ada data', colSpan: b.kolom.length, styles: { halign: 'center', textColor: [120, 130, 125], fontStyle: 'italic' } }]);
      doc.autoTable({
        startY: y, head: [b.kolom.map(k => ({ content: k.h, styles: { halign: 'center' } }))], body,
        foot: b.total ? [b.total.map((v, ci) => ({ content: v == null ? '' : String(v), styles: { halign: (b.kolom[ci] && b.kolom[ci].align) || 'left' } }))] : undefined,
        theme: 'grid', margin: { left: 10, right: 10, top: 14, bottom: 16 },
        styles: { font: 'helvetica', fontSize: o.font || 8.6, cellPadding: o.padding || 1.8, lineColor: [201, 211, 205], lineWidth: 0.15, textColor: [15, 26, 20], valign: 'middle', minCellHeight: o.tinggiBaris || 0 },
        headStyles: { fillColor: HIJAU_RGB, textColor: 255, fontStyle: 'bold', fontSize: (o.font || 8.6) - 0.2 },
        footStyles: { fillColor: [255, 244, 194], textColor: [15, 26, 20], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [244, 248, 245] },
        columnStyles: colStyles, rowPageBreak: 'avoid', showHead: 'everyPage', showFoot: 'lastPage',
        pageBreak: o.utuh && i > 0 ? 'auto' : 'auto',
      });
      y = doc.lastAutoTable.finalY + 6;
    });
    if (o.catatan) {
      doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(91, 107, 99);
      const t = doc.splitTextToSize(o.catatan, doc.internal.pageSize.getWidth() - 20);
      if (y + t.length * 4 > H - 16) { doc.addPage(); y = 14; }
      doc.text(t, 10, y); y += t.length * 4 + 2; doc.setTextColor(0);
    }
    if (o.ttd) y = tandaTangan(doc, y, o.ttd);
    kaki(doc, o.judul);
    doc.save(namaFile(file) + '.pdf');
  };

  /* ======================= NOMOR DADA ======================= */
  const WARNA = {
    'kuning': { bg: [255, 212, 0], fg: [20, 20, 20] }, 'merah': { bg: [215, 38, 46], fg: [255, 255, 255] },
    'biru': { bg: [31, 95, 191], fg: [255, 255, 255] }, 'abu-abu': { bg: [110, 118, 128], fg: [255, 255, 255] },
  };
  X.warnaBib = w => WARNA[String(w || '').toLowerCase()] || { bg: HIJAU_RGB, fg: [255, 255, 255] };

  // list: [{no, nama, klub, kategori, jk, warna}] → 2 nomor per halaman A4 (setiap nomor A5 mendatar)
  X.nomorDada = async function (file, list) {
    await siap('pdf');
    const doc = dokumen('portrait');
    const W = 210, Hh = 148.5;
    const I = info();
    list.forEach((b, i) => {
      if (i > 0 && i % 2 === 0) doc.addPage();
      const y0 = (i % 2) * Hh;
      const w = X.warnaBib(b.warna);
      // garis potong
      if (i % 2 === 1) { doc.setDrawColor(180); doc.setLineDashPattern([2, 2], 0); doc.line(0, Hh, W, Hh); doc.setLineDashPattern([], 0); }
      const m = 8, x = m, y = y0 + m, bw = W - 2 * m, bh = Hh - 2 * m;
      doc.setDrawColor(30); doc.setLineWidth(0.4); doc.roundedRect(x, y, bw, bh, 5, 5, 'S');
      // pita atas
      doc.setFillColor(...w.bg); doc.roundedRect(x, y, bw, 24, 5, 5, 'F'); doc.rect(x, y + 12, bw, 12, 'F');
      doc.setTextColor(...w.fg); doc.setFont('helvetica', 'bold'); doc.setFontSize(17);
      doc.text(I.acara, x + bw / 2, y + 11, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5);
      doc.text([I.penyelenggara, I.tanggal].filter(Boolean).join('  •  '), x + bw / 2, y + 18.5, { align: 'center' });
      // lubang peniti
      doc.setDrawColor(120); doc.setLineWidth(0.3);
      [[x + 7, y + 31], [x + bw - 7, y + 31], [x + 7, y + bh - 7], [x + bw - 7, y + bh - 7]].forEach(([cx, cy]) => doc.circle(cx, cy, 2.2, 'S'));
      // nomor besar
      doc.setTextColor(15, 15, 15); doc.setFont('helvetica', 'bold');
      const no = String(b.no);
      doc.setFontSize(no.length >= 4 ? 120 : 150);
      doc.text(no, x + bw / 2, y + 88, { align: 'center' });
      // kategori
      doc.setFillColor(...w.bg); doc.roundedRect(x + 14, y + 96, bw - 28, 11, 3, 3, 'F');
      doc.setTextColor(...w.fg); doc.setFontSize(13);
      doc.text((b.kategori + (b.jk ? ' • ' + b.jk : '')).toUpperCase(), x + bw / 2, y + 103.6, { align: 'center' });
      // nama & klub
      doc.setTextColor(15, 15, 15); doc.setFontSize(12.5);
      doc.text(doc.splitTextToSize(String(b.nama || ''), bw - 30)[0], x + bw / 2, y + 115, { align: 'center' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9.5); doc.setTextColor(80);
      doc.text(doc.splitTextToSize(String(b.klub || ''), bw - 30)[0], x + bw / 2, y + 121, { align: 'center' });
    });
    if (!list.length) { doc.setFontSize(14); doc.text('Belum ada nomor dada.', 20, 30); }
    doc.save(namaFile(file) + '.pdf');
  };
})();

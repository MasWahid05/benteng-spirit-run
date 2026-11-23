# Sistem Perlombaan Atletik — Benteng Spirit Run

Web panitia + halaman pendaftaran yang tersambung langsung ke Google Spreadsheet lomba.

## Pasang mesin Google (sekali saja, ±5 menit)
1. Buka spreadsheet lomba → menu **Ekstensi → Apps Script**.
2. Klik **+ → Skrip**, beri nama **AplikasiWeb**, tempel seluruh isi file [`apps-script/Code.gs`](apps-script/Code.gs), lalu **Simpan**.
3. PIN panitia dibuat saat pertama kali masuk web: PIN yang diketik pertama kali menjadi PIN panitia.
4. Pilih fungsi **setupAplikasiWeb** → **Jalankan** → izinkan akses (Spreadsheet, Drive, Form).
5. **Terapkan → Deployment baru → Aplikasi web**
   - Jalankan sebagai: **Saya**
   - Yang memiliki akses: **Siapa saja**
6. Salin URL yang berakhiran `/exec`, tempel di layar masuk web (atau isi `assets/config.js`).

Setelah kode Apps Script diubah, pakai **Terapkan → Kelola deployment → Edit → Versi baru** agar URL tetap sama.

## Yang dibuat di spreadsheet
Tab lama Bos **tidak diubah**, kecuali `Form Responses 1` (centang validasi, pendaftar baru dari web).
Tab baru: `APP_PENGATURAN`, `APP_ESTAFET`, `APP_SERI`, `APP_LOG`, dan tab jawaban tiap Google Form baru.
Bukti bayar dari web disimpan di folder Drive **Bukti Pembayaran - (nama acara)**.

## Halaman
- `index.html` — halaman promosi · `login.html` — masuk panitia · `panel.html` — panel panitia (PIN): dasbor, pendaftar & validasi, rekap, cek duplikasi, data baju, estafet,
  nomor dada & race pack, seri & waktu, final, podium, Google Form, pengaturan. Ekspor Excel & PDF di tiap menu.
- `daftar.html` — pendaftaran publik: perorangan, kolektif (klub/sekolah), dan tim estafet.

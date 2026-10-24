# ✈️ SiKonsul - Sistem Antrean & Boarding Pass Konsultasi Laporan Praktikum

Aplikasi web modern untuk manajemen antrean konsultasi laporan praktikum dengan sistem **Self Check-In bergaya Boarding Pass Pesawat**, deteksi keterlambatan & sanksi otomatis, serta integrasi notifikasi langsung ke WhatsApp Dosen / Asisten Praktikum.

---

## 🌟 Fitur Utama

1. **Portal Mahasiswa Praktikan (Super Cepat & Tanpa Ribet)**:
   - Mahasiswa cukup memasukkan **Nama Lengkap** & **NIM / Kelompok**.
   - Memilih slot jadwal konsultasi yang masih tersedia kuotanya.
   - Mengeluarkan tiket **Boarding Pass Konsultasi** unik (`PASS-XXXX`) lengkap dengan QR Code dan nomor antrean.

2. **Sistem Check-In Mandiri (Airline Style)**:
   - Seperti check-in pesawat, **mahasiswa sendiri yang wajib melakukan check-in** melalui link tiketnya.
   - Pintu check-in memiliki jendela waktu (misal: aktif 2 jam sebelum sesi s/d jam mulai).
   - Efek suara chime bandara (*Airport 2-tone chime*) saat check-in berhasil.
   - Status terverifikasi dan waktu check-in tercatat rapi secara presisi.

3. **Sistem Sanksi & Keterlambatan Otomatis**:
   - Asisten dapat mengatur **batas waktu toleransi** (contoh: 5 menit setelah jadwal mulai).
   - Jika praktikan tidak check-in hingga batas waktu, sistem otomatis menandai status **TERLAMBAT / KENA SANKSI**.
   - Tiket tiket berubah warna merah mencolok dan menampilkan sanksi praktikum (misal: *Pengurangan nilai asistensi 20% & giliran dipindah ke nomor antrean terakhir*).
   - Asisten memiliki wewenang untuk mencabut atau mengampuni sanksi jika ada dispensasi resmi.

4. **Notifikasi Langsung ke WhatsApp Asisten**:
   - Notifikasi saat ada praktikan baru yang booking jadwal.
   - Notifikasi saat praktikan melakukan Check-In mandiri (siap konsultasi).
   - Notifikasi saat praktikan terlambat / terkena sanksi.
   - **Mode 1**: Link instan `wa.me` (langsung terbuka di WhatsApp dengan pesan terformat rapi).
   - **Mode 2**: Pengiriman otomatis di latar belakang melalui **Fonnte API Token** (tanpa perlu klik manual).

5. **Portal & Dashboard Asisten (`/admin.html`)**:
   - **Live Scoreboard**: Total booking, yang sudah check-in, yang menunggu, dan yang kena sanksi.
   - **Bulk Slot Generator**: Buat 5-20 sesi konsultasi otomatis sekaligus hanya dalam 1 detik.
   - **Panggilan Antrean Suara**: Fitur panggil nama praktikan bersuara (*Text-to-Speech*).
   - **1-Click Salin Rekap**: Format teks siap kirim ke grup WhatsApp atau lembar absensi.

---

## 🚀 Cara Menjalankan Aplikasi

### Opsi 1: Klik Dua Kali File Batch
Cukup klik ganda file:
```
start.bat
```

### Opsi 2: Lewat Terminal / Command Prompt
```bash
cd "C:\Users\ASUS\.gemini\antigravity\scratch\sikonsul-app"
node server.js
```

---

## 🌐 Alamat Akses Website

- **Halaman Mahasiswa (Booking & Tiket)**:
  `http://localhost:3000`
- **Panel Asisten / Dosen**:
  `http://localhost:3000/admin.html`
  - **Kata Sandi Bawaan**: `admin` *(dapat diubah di pengaturan)*
- **Link untuk Dibagikan ke Grup WhatsApp Mahasiswa**:
  `http://<IP-Lokal-Komputer>:3000` (contoh: `http://192.168.1.120:3000`)
  *(Sistem otomatis mendeteksi dan menampilkan link ini di dashboard admin)*

---

## 📱 Cara Setting Notifikasi WhatsApp

1. Masuk ke **Portal Asisten** (`http://localhost:3000/admin.html`).
2. Masukkan password `admin`.
3. Buka tab **Pengaturan WA & Notifikasi**.
4. Masukkan nomor WhatsApp Anda (format: `0812xxxx` atau `62812xxxx`).
5. Klik **Kirim Pesan Tes ke WA Saya** untuk menguji.
6. *(Opsional)* Jika ingin WA terkirim otomatis di latar belakang, masukkan token gratis dari [Fonnte.com](https://fonnte.com).

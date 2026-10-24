const express = require('express');
const cors = require('cors');
const path = require('path');
const os = require('os');
const db = require('./config/database');
const whatsapp = require('./services/whatsapp');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Helper to get local IP for LAN sharing
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

function getBaseUrl(req) {
  const settings = db.getSettings();
  if (settings && settings.publicUrl && settings.publicUrl.startsWith('http')) {
    return settings.publicUrl.replace(/\/$/, '');
  }
  const host = req.get('host') || `localhost:${PORT}`;
  const protocol = req.protocol || 'http';
  return `${protocol}://${host}`;
}

// -------------------------------------------------------------
// PUBLIC API (UNTUK MAHASISWA / PRAKTIKAN)
// -------------------------------------------------------------

// Info umum praktikum & pengaturan check-in
app.get('/api/public/info', (req, res) => {
  const settings = db.getSettings();
  res.json({
    labTitle: settings.labTitle,
    adminName: settings.adminName,
    checkInWindowMinutes: settings.checkInWindowMinutes,
    lateToleranceMinutes: settings.lateToleranceMinutes,
    defaultSanction: settings.defaultSanction,
    serverTime: new Date().toISOString()
  });
});

// Daftar slot jadwal yang tersedia untuk dipilih
app.get('/api/public/slots', (req, res) => {
  const slots = db.getSlots().filter(s => s.isActive !== false);
  const bookings = db.getBookings().filter(b => b.checkInStatus !== 'CANCELLED');

  // Urutkan slot berdasarkan tanggal dan jam
  slots.sort((a, b) => {
    const timeA = new Date(`${a.date}T${a.startTime}`);
    const timeB = new Date(`${b.date}T${b.startTime}`);
    return timeA - timeB;
  });

  const slotsWithQuota = slots.map(slot => {
    const bookedCount = bookings.filter(b => b.slotId === slot.id).length;
    const quota = slot.quota || 1;
    const remaining = Math.max(0, quota - bookedCount);
    return {
      ...slot,
      bookedCount,
      remainingQuota: remaining,
      isFull: remaining <= 0
    };
  });

  // Periksa apakah slot memiliki syarat buka hanya jika slot sebelumnya penuh
  const processedSlots = slotsWithQuota.map(slot => {
    if (slot.unlockWhenSlotFull) {
      const target = slotsWithQuota.find(s => s.id === slot.unlockWhenSlotFull);
      if (target && !target.isFull) {
        return {
          ...slot,
          isLocked: true,
          lockedReason: `Terkunci: Sesi ini baru terbuka otomatis jika kuota sesi ${target.startTime} WIB telah penuh (saat ini masih sisa ${target.remainingQuota} kuota).`,
          targetRemaining: target.remainingQuota
        };
      }
    }
    return {
      ...slot,
      isLocked: false
    };
  });

  res.json(processedSlots);
});

// Mahasiswa mengisi form pendaftaran (hanya nama + pilih slot)
app.post('/api/public/book', async (req, res) => {
  try {
    const { slotId, studentName, studentNim, studentWa } = req.body;

    if (!slotId || !studentName || studentName.trim().length === 0) {
      return res.status(400).json({ error: "Nama lengkap dan pilihan jadwal wajib diisi." });
    }

    const { booking, slot } = db.createBooking({
      slotId,
      studentName,
      studentNim,
      studentWa
    });

    const settings = db.getSettings();
    const appUrl = getBaseUrl(req);

    // Format notifikasi WA untuk Asisten/Dosen
    const adminMessage = whatsapp.buildNewBookingMessage({
      booking,
      slot,
      settings,
      appUrl
    });

    // Otomatis kirim notifikasi ke WA Admin
    const waResult = await whatsapp.sendNotification(settings.adminWa, adminMessage, settings);

    // Format pesan konfirmasi untuk mahasiswa
    const studentMessage = whatsapp.buildStudentConfirmationMessage({
      booking,
      slot,
      appUrl
    });
    const studentWaMeUrl = booking.studentWa 
      ? whatsapp.generateWaMeLink(booking.studentWa, studentMessage) 
      : null;

    res.json({
      success: true,
      booking,
      slot,
      adminWaMeUrl: waResult.waMeUrl,
      studentWaMeUrl,
      boardingPassUrl: `/boarding-pass.html?code=${booking.bookingCode}`
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ambil data Boarding Pass berdasarkan kode booking
app.get('/api/public/booking/:code', (req, res) => {
  const booking = db.getBookingByCode(req.params.code);
  if (!booking) {
    return res.status(404).json({ error: "Boarding pass tidak ditemukan. Periksa kembali kode tiket Anda." });
  }

  const slot = db.getSlots().find(s => s.id === booking.slotId);
  const settings = db.getSettings();

  res.json({
    booking,
    slot,
    settings: {
      checkInWindowMinutes: settings.checkInWindowMinutes,
      lateToleranceMinutes: settings.lateToleranceMinutes,
      defaultSanction: settings.defaultSanction,
      adminName: settings.adminName,
      adminWa: settings.adminWa,
      labTitle: settings.labTitle
    },
    serverTime: new Date().toISOString()
  });
});

// SISTEM CHECK-IN MANDIRI OLEH MAHASISWA
app.post('/api/public/checkin', async (req, res) => {
  try {
    const { bookingCode } = req.body;
    if (!bookingCode) {
      return res.status(400).json({ error: "Kode tiket diperlukan." });
    }

    const { booking, slot, isLate, alreadyDone } = db.performCheckIn(bookingCode);
    const settings = db.getSettings();

    // Buat pesan notifikasi WA ke asisten
    const adminMessage = whatsapp.buildCheckInMessage({
      booking,
      slot,
      settings,
      isLate
    });

    // Kirim notifikasi ke WhatsApp Asisten
    const waResult = await whatsapp.sendNotification(settings.adminWa, adminMessage, settings);

    res.json({
      success: true,
      booking,
      slot,
      isLate,
      alreadyDone: !!alreadyDone,
      adminWaMeUrl: waResult.waMeUrl,
      message: isLate 
        ? "Check-in berhasil, namun Anda tercatat TERLAMBAT dan dikenakan sanksi praktikum." 
        : "Check-in BERHASIL! Silakan bersiap di lokasi konsultasi sesuai jadwal."
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN API (UNTUK ASISTEN / DOSEN)
// -------------------------------------------------------------

// Verifikasi login asisten
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body;
  const settings = db.getSettings();
  if (password === (settings.adminPassword || 'admin')) {
    res.json({ success: true, token: 'auth-token-' + Date.now() });
  } else {
    res.status(401).json({ error: "Kata sandi salah. Silakan coba lagi." });
  }
});

// Data dashboard lengkap untuk Admin
app.get('/api/admin/overview', (req, res) => {
  const slots = db.getSlots();
  const bookings = db.getBookings();
  const settings = db.getSettings();

  // Combine bookings with their slot data
  const enrichedBookings = bookings.map(b => {
    const slot = slots.find(s => s.id === b.slotId) || {};
    return {
      ...b,
      slotDate: slot.date || '',
      slotStartTime: slot.startTime || '',
      slotEndTime: slot.endTime || '',
      slotLocation: slot.location || 'Lokasi belum ditentukan'
    };
  });

  // Urutkan bookings berdasarkan slot date dan jam
  enrichedBookings.sort((a, b) => {
    const tA = new Date(`${a.slotDate}T${a.slotStartTime || '00:00'}`);
    const tB = new Date(`${b.slotDate}T${b.slotStartTime || '00:00'}`);
    return tA - tB;
  });

  const stats = {
    totalBookings: bookings.filter(b => b.checkInStatus !== 'CANCELLED').length,
    checkedIn: bookings.filter(b => b.checkInStatus === 'CHECKED_IN').length,
    pending: bookings.filter(b => b.checkInStatus === 'PENDING').length,
    lateOrSanctioned: bookings.filter(b => b.checkInStatus === 'LATE' || b.sanctionStatus === 'APPLIED').length,
    completed: bookings.filter(b => b.checkInStatus === 'COMPLETED').length,
    totalSlots: slots.length
  };

  res.json({
    stats,
    slots,
    bookings: enrichedBookings,
    settings,
    serverTime: new Date().toISOString()
  });
});

// Tambah slot jadwal konsultasi baru (Single atau Bulk Generator)
app.post('/api/admin/slots', (req, res) => {
  try {
    const { date, startTime, endTime, location, quota, notes, isBulk, intervalMinutes, count } = req.body;

    if (!date || !location) {
      return res.status(400).json({ error: "Tanggal dan lokasi wajib diisi." });
    }

    // Bulk Slot Generator (bikin beberapa slot berurutan otomatis)
    if (isBulk && intervalMinutes && count) {
      const generated = [];
      let [currentH, currentM] = startTime.split(':').map(Number);

      for (let i = 0; i < Number(count); i++) {
        const startStr = `${String(currentH).padStart(2, '0')}:${String(currentM).padStart(2, '0')}`;
        
        let endTotalMin = currentH * 60 + currentM + Number(intervalMinutes);
        let endH = Math.floor(endTotalMin / 60) % 24;
        let endM = endTotalMin % 60;
        const endStr = `${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;

        const newSlot = db.saveSlot({
          date,
          startTime: startStr,
          endTime: endStr,
          location: location.trim(),
          quota: Number(quota) || 1,
          notes: notes || "",
          isActive: true
        });
        generated.push(newSlot);

        currentH = endH;
        currentM = endM;
      }

      return res.json({ success: true, count: generated.length, slots: generated });
    }

    // Single slot
    if (!startTime || !endTime) {
      return res.status(400).json({ error: "Jam mulai dan jam selesai wajib diisi." });
    }

    const saved = db.saveSlot({
      date,
      startTime,
      endTime,
      location: location.trim(),
      quota: Number(quota) || 1,
      notes: notes || "",
      isActive: true
    });

    res.json({ success: true, slot: saved });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit slot jadwal
app.put('/api/admin/slots/:id', (req, res) => {
  try {
    const { date, startTime, endTime, location, quota, notes, isActive } = req.body;
    const updated = db.saveSlot({
      id: req.params.id,
      date,
      startTime,
      endTime,
      location,
      quota: Number(quota) || 1,
      notes,
      isActive: isActive !== undefined ? isActive : true
    });
    res.json({ success: true, slot: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Hapus slot jadwal
app.delete('/api/admin/slots/:id', (req, res) => {
  try {
    db.deleteSlot(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update status konsultasi mahasiswa (Panggil, Selesai, Batalkan)
app.patch('/api/admin/bookings/:id/status', (req, res) => {
  try {
    const { status, notes } = req.body;
    const updated = db.updateBookingStatus(req.params.id, status, notes);
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Kelola Sanksi Mahasiswa (Berikan sanksi, ubah sanksi, atau batalkan/ampuni sanksi)
app.patch('/api/admin/bookings/:id/sanction', (req, res) => {
  try {
    const { sanctionStatus, sanctionApplied } = req.body;
    const updated = db.updateSanction(req.params.id, { sanctionStatus, sanctionApplied });
    res.json({ success: true, booking: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ambil & Update Pengaturan Asisten (Nomor WA, Sanksi, Toleransi, Password)
app.get('/api/admin/settings', (req, res) => {
  res.json(db.getSettings());
});

app.post('/api/admin/settings', (req, res) => {
  try {
    const updated = db.updateSettings(req.body);
    res.json({ success: true, settings: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Test kirim WhatsApp ke nomor admin
app.post('/api/admin/whatsapp/test', async (req, res) => {
  try {
    const settings = db.getSettings();
    const testMessage = `🔔 *TES NOTIFIKASI SIKONSUL BERHASIL* 🔔\n\nHalo *${settings.adminName}*! Sistem notifikasi WhatsApp untuk jadwal antrian konsul laporan telah terhubung dengan baik.\n\nSistem siap menerima booking dan check-in mandiri dari praktikan! 🚀`;

    const result = await whatsapp.sendNotification(settings.adminWa, testMessage, settings);
    res.json({ success: true, result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Ambil link jaringan lokal & informasi sharing untuk dibagikan ke grup WA
app.get('/api/admin/network-info', (req, res) => {
  const localIp = getLocalIp();
  const port = PORT;
  const localUrl = `http://localhost:${port}`;
  const networkUrl = `http://${localIp}:${port}`;
  const settings = db.getSettings();
  const shareUrl = settings.publicUrl || networkUrl;

  res.json({
    localUrl,
    networkUrl,
    shareUrl: shareUrl,
    shareText: `Halo rekan-rekan praktikan! 📢\nSilakan pilih jadwal antrean konsultasi laporan pada link resmi berikut:\n🔗 ${shareUrl}\n\nSetelah memilih jadwal, Anda akan mendapatkan tiket Boarding Pass digital. Mohon lakukan *Check-in Mandiri* pada link tiket sebelum jadwal konsultasi dimulai! ✈️`
  });
});

// -------------------------------------------------------------
// BACKGROUND PROCESS: AUTO LATE CHECKER
// -------------------------------------------------------------
// Mengecek setiap 60 detik jika ada mahasiswa yang melewati batas toleransi dan belum check-in
setInterval(async () => {
  try {
    const settings = db.getSettings();
    if (!settings.autoLateCheck) return;

    const slots = db.getSlots();
    const bookings = db.getBookings();
    const now = new Date();
    const toleranceMinutes = settings.lateToleranceMinutes || 5;

    for (const booking of bookings) {
      if (booking.checkInStatus === 'PENDING') {
        const slot = slots.find(s => s.id === booking.slotId);
        if (!slot) continue;

        const [startH, startM] = slot.startTime.split(':').map(Number);
        const slotDate = new Date(slot.date);
        slotDate.setHours(startH, startM, 0, 0);

        // Batas toleransi terlambat
        const deadline = new Date(slotDate.getTime() + toleranceMinutes * 60 * 1000);

        if (now > deadline) {
          console.log(`[AutoLate] Booking ${booking.bookingCode} (${booking.studentName}) melewati batas toleransi. Memberikan sanksi otomatis...`);
          booking.checkInStatus = 'LATE';
          booking.sanctionStatus = 'APPLIED';
          booking.sanctionApplied = settings.defaultSanction || "Terlambat Check-In melebihi batas waktu toleransi.";
          
          db.write(db.read()); // save changes

          // Notifikasi sanksi ke WA asisten
          const sanctionMsg = whatsapp.buildSanctionAlertMessage({ booking, slot, settings });
          await whatsapp.sendNotification(settings.adminWa, sanctionMsg, settings);
        }
      }
    }
  } catch (err) {
    console.error('[AutoLate Error]:', err.message);
  }
}, 60000);

// Start server
app.listen(PORT, '0.0.0.0', () => {
  const localIp = getLocalIp();
  console.log('========================================================');
  console.log(`🚀 SiKonsul - Sistem Antrean & Check-in Konsultasi Laporan`);
  console.log(`🌐 Akses Lokal:   http://localhost:${PORT}`);
  console.log(`📱 Akses Grup WA: http://${localIp}:${PORT}`);
  console.log(`🔐 Panel Asisten: http://localhost:${PORT}/admin.html`);
  console.log('========================================================');
});

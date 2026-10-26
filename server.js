// SiKonsul All-in-One Standalone Server (Production Cloud Ready)
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------------------------------------------------
// DATABASE ENGINE (PERSISTENT & AUTO-INITIALIZED)
// -------------------------------------------------------------
const DB_DIR = path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

const defaultData = {
  "settings": {
    "adminName": "Asisten Praktikum",
    "adminWa": "6285323085893",
    "labTitle": "Konsultasi Laporan Praktikum INSTIPER",
    "publicUrl": "https://potter-risks-library-classic.trycloudflare.com",
    "checkInWindowMinutes": 120,
    "lateToleranceMinutes": 10,
    "defaultSanction": "Nilai asistensi laporan dikurangi 20% & Konsultasi dipindahkan ke nomor antrean terakhir",
    "whatsappProvider": "wa_me",
    "fonnteToken": "",
    "adminPassword": "admin",
    "autoLateCheck": true
  },
  "slots": [
    {
      "id": "slot-instiper-1600",
      "date": "2026-10-26",
      "startTime": "16:00",
      "endTime": "18:00",
      "location": "Perpustakaan INSTIPER Yogyakarta",
      "quota": 15,
      "notes": "Sesi Utama (16:00 - 18:00 WIB). Wajib bawa draf laporan praktikum dan check-in mandiri.",
      "isActive": true,
      "createdAt": "2026-10-24T03:36:00.000Z"
    },
    {
      "id": "slot-instiper-1900",
      "date": "2026-10-26",
      "startTime": "19:00",
      "endTime": "21:00",
      "location": "Perpustakaan INSTIPER Yogyakarta",
      "quota": 15,
      "notes": "Sesi Tambahan: Terbuka otomatis setelah kuota sesi 16:00 WIB penuh (15/15).",
      "unlockWhenSlotFull": "slot-instiper-1600",
      "isActive": true,
      "createdAt": "2026-10-24T03:41:00.000Z"
    }
  ],
  "bookings": [
    {
      "id": "book-1792814231713-ezqx",
      "bookingCode": "PASS-4618",
      "queueNumber": 1,
      "slotId": "slot-instiper-1600",
      "studentName": "Muhammad Fahmi Asyauqi",
      "studentNim": "25242009(Kelompok 3)",
      "studentWa": "083867372585",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T03:57:11.713Z"
    },
    {
      "id": "book-1792814243370-msrv",
      "bookingCode": "PASS-6786",
      "queueNumber": 2,
      "slotId": "slot-instiper-1600",
      "studentName": "Echa Susilawati",
      "studentNim": "25244010/Kelompok 7",
      "studentWa": "082244204742",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T03:57:23.370Z"
    },
    {
      "id": "book-1792814244460-mvrf",
      "bookingCode": "PASS-6677",
      "queueNumber": 3,
      "slotId": "slot-instiper-1600",
      "studentName": "Dio Erlangga",
      "studentNim": "25242037/ kelompok 3",
      "studentWa": "08228436792",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T03:57:24.460Z"
    },
    {
      "id": "book-1792814254602-6d3l",
      "bookingCode": "PASS-3056",
      "queueNumber": 4,
      "slotId": "slot-instiper-1600",
      "studentName": "Harun Jihadi Hanifah Nasution",
      "studentNim": "25241005/ kelompok 3",
      "studentWa": "082143759745",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T03:57:34.602Z"
    },
    {
      "id": "book-1792814310849-qoc8",
      "bookingCode": "PASS-2297",
      "queueNumber": 5,
      "slotId": "slot-instiper-1600",
      "studentName": "Dio Erlangga",
      "studentNim": "25242037 / kelompok 3",
      "studentWa": "082284736792",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T03:58:30.849Z"
    },
    {
      "id": "book-1792814393795-zl4l",
      "bookingCode": "PASS-2493",
      "queueNumber": 6,
      "slotId": "slot-instiper-1600",
      "studentName": "Dio Slavian Tarigan",
      "studentNim": "25242014/kelompok 7",
      "studentWa": "082249017381",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T03:59:53.795Z"
    },
    {
      "id": "book-1792814468268-znx8",
      "bookingCode": "PASS-6501",
      "queueNumber": 7,
      "slotId": "slot-instiper-1600",
      "studentName": "Febrian Al Khadafi",
      "studentNim": "25242018 / Kelompok 3",
      "studentWa": "085840255228",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T04:01:08.268Z"
    },
    {
      "id": "book-1792814670372-116n",
      "bookingCode": "PASS-9972",
      "queueNumber": 8,
      "slotId": "slot-instiper-1600",
      "studentName": "Wilman Riswanto Panjaitan",
      "studentNim": "25241018/3",
      "studentWa": "",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T04:04:30.372Z"
    },
    {
      "id": "book-1792820416306-k33b",
      "bookingCode": "PASS-9995",
      "queueNumber": 9,
      "slotId": "slot-instiper-1600",
      "studentName": "Nickyta Fainaya Br Damanik",
      "studentNim": "25243004/Kelompok 4",
      "studentWa": "082180988495",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T05:40:16.306Z"
    },
    {
      "id": "book-1792820437741-bidz",
      "bookingCode": "PASS-3812",
      "queueNumber": 10,
      "slotId": "slot-instiper-1600",
      "studentName": "Maria Evta Tabita Siregar",
      "studentNim": "25242026/7",
      "studentWa": "081267563721",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T05:40:37.741Z"
    },
    {
      "id": "book-1792820453725-eo8v",
      "bookingCode": "PASS-1360",
      "queueNumber": 11,
      "slotId": "slot-instiper-1600",
      "studentName": "Ayu Wandayani",
      "studentNim": "25241016/03",
      "studentWa": "082283119459",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T05:40:53.725Z"
    },
    {
      "id": "book-1792820467742-41c6",
      "bookingCode": "PASS-5598",
      "queueNumber": 12,
      "slotId": "slot-instiper-1600",
      "studentName": "Marantius algo",
      "studentNim": "25244009",
      "studentWa": "0895326196217",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T05:41:07.742Z"
    },
    {
      "id": "book-1792820660107-oinc",
      "bookingCode": "PASS-4296",
      "queueNumber": 13,
      "slotId": "slot-instiper-1600",
      "studentName": "Ikhsan Kurniawan",
      "studentNim": "25242004/ 07",
      "studentWa": "082280574954",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T05:44:20.107Z"
    },
    {
      "id": "book-1792820769405-8tyr",
      "bookingCode": "PASS-8272",
      "queueNumber": 14,
      "slotId": "slot-instiper-1600",
      "studentName": "Azril padila Ramadhan",
      "studentNim": "25241013/kelompok7",
      "studentWa": "082286537230",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T05:46:09.405Z"
    },
    {
      "id": "book-1792821606280-vmgb",
      "bookingCode": "PASS-6419",
      "queueNumber": 15,
      "slotId": "slot-instiper-1600",
      "studentName": "Maxy Auto Marend",
      "studentNim": "25242027",
      "studentWa": "081545487355",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T06:00:06.280Z"
    },
    {
      "id": "book-1792821885362-prb3",
      "bookingCode": "PASS-8532",
      "queueNumber": 1,
      "slotId": "slot-instiper-1900",
      "studentName": "Maulani nur Irfansyah",
      "studentNim": "25242022/7",
      "studentWa": "085283210173",
      "checkInStatus": "PENDING",
      "checkInTime": null,
      "sanctionApplied": null,
      "sanctionStatus": "NONE",
      "createdAt": "2026-10-24T06:04:45.362Z"
    }
  ]
};

const KVDB_URL = "https://kvdb.io/6gwT5eZrZogiMHiKWimNab/db";
let memoryDb = defaultData;

// Auto-sync from cloud database
try {
  axios.get(KVDB_URL, { timeout: 4000 }).then(res => {
    if (res.data && res.data.bookings) {
      memoryDb = res.data;
    }
  }).catch(() => {});
} catch (e) {}

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch (e) {}
  return memoryDb;
}

function writeDb(data) {
  memoryDb = data;
  try {
    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    try {
      fs.writeFileSync(path.join(__dirname, "db.json"), JSON.stringify(data, null, 2), "utf-8");
    } catch (err) {}
  }

  // Sync to permanent cloud database
  try {
    axios.post(KVDB_URL, data, { timeout: 5000 }).catch(() => {});
  } catch (err) {}
  return true;
}

// Initialize db file if missing
if (!fs.existsSync(DB_PATH)) {
  writeDb(defaultData);
}

// -------------------------------------------------------------
// WHATSAPP NOTIFICATION SERVICE
// -------------------------------------------------------------
const whatsapp = {
  formatPhone(phone) {
    if (!phone) return '';
    let clean = phone.replace(/[^0-9]/g, '');
    if (clean.startsWith('0')) clean = '62' + clean.slice(1);
    else if (clean.startsWith('+62')) clean = clean.slice(1);
    else if (!clean.startsWith('62')) clean = '62' + clean;
    return clean;
  },
  generateWaMeLink(phone, message) {
    return 'https://wa.me/' + this.formatPhone(phone) + '?text=' + encodeURIComponent(message);
  },
  buildNewBookingMessage({ booking, slot, settings, appUrl }) {
    return '?? *[SIKONSUL] BOOKING JADWAL BARU* ??\n\n' +
      'Halo *' + (settings.adminName || 'Asisten Praktikum') + '*,\n' +
      'Ada mahasiswa yang baru saja mengambil antrean konsultasi laporan:\n\n' +
      '?? *Nama*: ' + booking.studentName + '\n' +
      '?? *NIM*: ' + (booking.studentNim || '-') + '\n' +
      '?? *Hari/Tanggal*: ' + slot.date + '\n' +
      '? *Pukul*: ' + slot.startTime + ' - ' + slot.endTime + ' WIB\n' +
      '?? *Lokasi*: ' + slot.location + '\n' +
      '?? *No. Boarding Pass*: *' + booking.bookingCode + '*\n\n' +
      '?? *Catatan*: Mahasiswa diwajibkan melakukan *Check-in Mandiri* sebelum sesi dimulai.\n' +
      '?? *Cek Antrean Admin*: ' + appUrl + '/admin.html';
  },
  buildCheckInMessage({ booking, slot, settings, isLate }) {
    const statusIcon = isLate ? '??' : '??';
    const statusTitle = isLate ? '*CHECK-IN TERLAMBAT / KENA SANKSI*' : '*MAHASISWA TELAH CHECK-IN!*';
    let msg = statusIcon + ' *[SIKONSUL] ' + statusTitle + '* ' + statusIcon + '\n\n' +
      'Mahasiswa berikut baru saja melakukan check-in mandiri:\n\n' +
      '?? *Nama*: ' + booking.studentName + '\n' +
      '?? *NIM*: ' + (booking.studentNim || '-') + '\n' +
      '?? *Jadwal*: ' + slot.date + ' (' + slot.startTime + ' - ' + slot.endTime + ' WIB)\n' +
      '?? *Lokasi*: ' + slot.location + '\n' +
      '?? *Kode Tiket*: *' + booking.bookingCode + '*\n' +
      '?? *Waktu Check-In*: ' + new Date(booking.checkInTime).toLocaleTimeString('id-ID') + ' WIB\n';
    if (isLate) {
      msg += '\n? *STATUS: TERLAMBAT*\n?? *Sanksi Terapan*: ' + (booking.sanctionApplied || settings.defaultSanction) + '\n';
    } else {
      msg += '\n? *STATUS: TEPAT WAKTU (READY TO CONSULT)*\n';
    }
    return msg;
  },
  buildSanctionAlertMessage({ booking, slot, settings }) {
    return '?? *[SIKONSUL] PERINGATAN KETERLAMBATAN & SANKSI* ??\n\n' +
      'Mahasiswa belum melakukan check-in hingga batas waktu konsultasi:\n\n' +
      '?? *Nama*: ' + booking.studentName + '\n' +
      '?? *NIM*: ' + (booking.studentNim || '-') + '\n' +
      '?? *Jadwal*: ' + slot.date + ' (' + slot.startTime + ' - ' + slot.endTime + ' WIB)\n' +
      '?? *Lokasi*: ' + slot.location + '\n' +
      '?? *Kode Tiket*: *' + booking.bookingCode + '*\n' +
      '? *Kondisi*: Tidak hadir / Melewati batas toleransi check-in\n' +
      '?? *Sanksi*: ' + (booking.sanctionApplied || settings.defaultSanction) + '\n\n' +
      'Status di antrean telah diubah menjadi TERLAMBAT / KENA SANKSI.';
  },
  buildStudentConfirmationMessage({ booking, slot, appUrl }) {
    return '?? *BOARDING PASS KONSULTASI LAPORAN* ??\n\n' +
      'Halo *' + booking.studentName + '*,\n' +
      'Jadwal konsultasi laporan praktikum Anda telah terdaftar:\n\n' +
      '?? *Kode Booking*: *' + booking.bookingCode + '*\n' +
      '?? *Tanggal*: ' + slot.date + '\n' +
      '? *Waktu*: ' + slot.startTime + ' - ' + slot.endTime + ' WIB\n' +
      '?? *Lokasi*: ' + slot.location + '\n' +
      '?? *Catatan*: ' + (slot.notes || 'Bawa draf laporan lengkap') + '\n\n' +
      '?? *PENTING - ATURAN CHECK-IN AIRLINE STYLE*:\n' +
      '1. Anda *WAJIB* melakukan Check-in Mandiri melalui link boarding pass sebelum jadwal dimulai.\n' +
      '2. Praktikan yang tidak check-in atau terlambat akan dikenakan sanksi praktikum otomatis.\n\n' +
      '?? *Buka Boarding Pass & Cek In di sini*:\n' +
      appUrl + '/boarding-pass.html?code=' + booking.bookingCode;
  },
  async sendNotification(phone, message, settings) {
    const cleanPhone = this.formatPhone(phone);
    const waMeUrl = this.generateWaMeLink(cleanPhone, message);
    if (settings && settings.fonnteToken && settings.fonnteToken.trim().length > 5) {
      try {
        const res = await axios.post('https://api.fonnte.com/send', {
          target: cleanPhone,
          message: message,
          countryCode: '62'
        }, { headers: { Authorization: settings.fonnteToken.trim() }, timeout: 8000 });
        return { success: true, provider: 'fonnte', data: res.data, waMeUrl };
      } catch (err) {
        return { success: false, error: err.message, waMeUrl };
      }
    }
    return { success: true, provider: 'wa_me', waMeUrl };
  }
};

// -------------------------------------------------------------
// EMBEDDED STATIC ASSETS (Zero 404 Guaranteed)
// -------------------------------------------------------------
const ASSET_CSS = "/* Custom Styles for SiKonsul */\n@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap');\n\n:root {\n  --primary: #2563eb;\n  --primary-dark: #1d4ed8;\n  --airline-blue: #0f172a;\n  --accent-gold: #f59e0b;\n}\n\nbody {\n  font-family: 'Plus Jakarta Sans', sans-serif;\n}\n\n.font-mono {\n  font-family: 'JetBrains Mono', monospace;\n}\n\n/* Airline Boarding Pass Ticket Styling */\n.boarding-pass-card {\n  position: relative;\n  background: #ffffff;\n  border-radius: 24px;\n  box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.12), 0 0 1px 1px rgba(0, 0, 0, 0.05);\n  overflow: hidden;\n}\n\n/* Perforation Notch effect */\n.ticket-notch-left, .ticket-notch-right {\n  position: absolute;\n  top: 68%;\n  width: 28px;\n  height: 28px;\n  background-color: #f1f5f9;\n  border-radius: 50%;\n  z-index: 10;\n}\n\n.ticket-notch-left {\n  left: -14px;\n}\n\n.ticket-notch-right {\n  right: -14px;\n}\n\n.ticket-divider-line {\n  position: absolute;\n  top: 70%;\n  left: 20px;\n  right: 20px;\n  border-top: 2px dashed #cbd5e1;\n  z-index: 5;\n}\n\n/* Barcode simulation */\n.barcode-strip {\n  background: repeating-linear-gradient(\n    90deg,\n    #1e293b,\n    #1e293b 2px,\n    transparent 2px,\n    transparent 5px,\n    #1e293b 5px,\n    #1e293b 8px,\n    transparent 8px,\n    transparent 9px,\n    #1e293b 9px,\n    #1e293b 13px,\n    transparent 13px,\n    transparent 16px\n  );\n  height: 48px;\n  width: 100%;\n}\n\n/* Pulsing radar for live check-in */\n@keyframes pulse-ring {\n  0% {\n    transform: scale(0.95);\n    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.7);\n  }\n  70% {\n    transform: scale(1);\n    box-shadow: 0 0 0 16px rgba(37, 99, 235, 0);\n  }\n  100% {\n    transform: scale(0.95);\n    box-shadow: 0 0 0 0 rgba(37, 99, 235, 0);\n  }\n}\n\n.pulse-checkin {\n  animation: pulse-ring 2s infinite cubic-bezier(0.4, 0, 0.6, 1);\n}\n\n/* Confetti & animations */\n@keyframes slideDownFade {\n  from {\n    opacity: 0;\n    transform: translateY(-10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n\n.animate-slide-down {\n  animation: slideDownFade 0.3s ease-out forwards;\n}\n\n/* Scrollbar beautification */\n::-webkit-scrollbar {\n  width: 8px;\n  height: 8px;\n}\n\n::-webkit-scrollbar-track {\n  background: #f1f5f9;\n}\n\n::-webkit-scrollbar-thumb {\n  background: #cbd5e1;\n  border-radius: 4px;\n}\n\n::-webkit-scrollbar-thumb:hover {\n  background: #94a3b8;\n}\n";
const ASSET_STUDENT_JS = "// Student Booking Page Logic\n\nlet selectedSlotId = null;\nlet slotsData = [];\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  if (window.lucide) {\n    lucide.createIcons();\n  }\n  loadPublicInfo();\n  loadSlots();\n  setupEventListeners();\n});\n\nasync function loadPublicInfo() {\n  try {\n    const res = await fetch('/api/public/info');\n    if (!res.ok) return;\n    const data = await res.json();\n    if (data.labTitle) {\n      document.getElementById('headerLabTitle').textContent = data.labTitle;\n      document.getElementById('heroTitle').textContent = `Jadwal ${data.labTitle}`;\n    }\n  } catch (err) {\n    console.error('Error loading public info:', err);\n  }\n}\n\nasync function loadSlots() {\n  const loadingEl = document.getElementById('slotsLoading');\n  const containerEl = document.getElementById('slotsContainer');\n  const noSlotsEl = document.getElementById('noSlotsState');\n\n  try {\n    const res = await fetch('/api/public/slots');\n    slotsData = await res.json();\n\n    loadingEl.classList.add('hidden');\n\n    if (!slotsData || slotsData.length === 0) {\n      noSlotsEl.classList.remove('hidden');\n      containerEl.classList.add('hidden');\n      return;\n    }\n\n    noSlotsEl.classList.add('hidden');\n    containerEl.classList.remove('hidden');\n    renderSlotsGroupedByDate(slotsData, containerEl);\n  } catch (err) {\n    loadingEl.innerHTML = `\n      <p class=\"text-xs text-rose-500 font-medium\">Gagal memuat jadwal. Silakan segarkan halaman.</p>\n    `;\n    console.error('Error fetching slots:', err);\n  }\n}\n\nfunction formatDateIndo(dateStr) {\n  try {\n    const d = new Date(dateStr + 'T00:00:00');\n    return d.toLocaleDateString('id-ID', {\n      weekday: 'long',\n      day: 'numeric',\n      month: 'long',\n      year: 'numeric'\n    });\n  } catch (e) {\n    return dateStr;\n  }\n}\n\nfunction renderSlotsGroupedByDate(slots, container) {\n  container.innerHTML = '';\n\n  // Group slots by date\n  const grouped = {};\n  slots.forEach(slot => {\n    if (!grouped[slot.date]) {\n      grouped[slot.date] = [];\n    }\n    grouped[slot.date].push(slot);\n  });\n\n  const dates = Object.keys(grouped).sort();\n\n  dates.forEach(dateKey => {\n    const dateSlots = grouped[dateKey];\n\n    const groupDiv = document.createElement('div');\n    groupDiv.className = 'space-y-2.5 pt-1';\n\n    const header = document.createElement('div');\n    header.className = 'flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 px-1';\n    header.innerHTML = `\n      <i data-lucide=\"calendar-days\" class=\"w-4 h-4 text-blue-600\"></i>\n      <span>${formatDateIndo(dateKey)}</span>\n      <span class=\"text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-semibold ml-auto\">\n        ${dateSlots.length} Sesi\n      </span>\n    `;\n    groupDiv.appendChild(header);\n\n    const grid = document.createElement('div');\n    grid.className = 'grid grid-cols-1 sm:grid-cols-2 gap-3';\n\n    dateSlots.forEach(slot => {\n      const isFull = slot.isFull;\n      const isLocked = slot.isLocked;\n      const isSelected = selectedSlotId === slot.id;\n\n      const card = document.createElement('div');\n      card.className = `relative p-4 rounded-2xl border transition-all select-none ${\n        isLocked\n          ? 'bg-slate-50 border-amber-200 border-dashed cursor-not-allowed opacity-85'\n          : isFull\n          ? 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'\n          : isSelected\n          ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-600/30 shadow-md shadow-blue-500/10 cursor-pointer'\n          : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-sm cursor-pointer'\n      }`;\n\n      let badgeHtml = '';\n      if (isLocked) {\n        badgeHtml = `\n          <span class=\"text-[10px] font-bold uppercase bg-amber-100 text-amber-800 px-2.5 py-1 rounded-lg flex items-center gap-1 border border-amber-200\">\n            <i data-lucide=\"lock\" class=\"w-3 h-3 text-amber-600\"></i>\n            Terkunci\n          </span>\n        `;\n      } else if (isFull) {\n        badgeHtml = `<span class=\"text-[10px] font-bold uppercase bg-rose-100 text-rose-700 px-2 py-1 rounded-lg\">Penuh</span>`;\n      } else {\n        badgeHtml = `\n          <span class=\"text-[10px] font-bold uppercase ${\n            isSelected ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-800'\n          } px-2.5 py-1 rounded-lg flex items-center gap-1\">\n            <span class=\"w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-emerald-500'}\"></span>\n            Sisa: ${slot.remainingQuota}\n          </span>\n        `;\n      }\n\n      card.innerHTML = `\n        <div class=\"flex items-start justify-between gap-2\">\n          <div>\n            <div class=\"flex items-center gap-2\">\n              <span class=\"text-base font-extrabold ${isLocked ? 'text-slate-600' : 'text-slate-900'} font-mono tracking-tight\">\n                ${slot.startTime} - ${slot.endTime}\n              </span>\n              <span class=\"text-[11px] font-semibold text-slate-400 uppercase\">WIB</span>\n              ${!isLocked && slot.unlockWhenSlotFull ? `\n                <span class=\"text-[10px] font-bold uppercase bg-purple-100 text-purple-700 px-2 py-0.5 rounded-md\">\n                  Sesi Tambahan\n                </span>\n              ` : ''}\n            </div>\n            <div class=\"flex items-center gap-1.5 text-xs text-slate-600 mt-1 font-medium\">\n              <i data-lucide=\"map-pin\" class=\"w-3.5 h-3.5 text-blue-600 flex-shrink-0\"></i>\n              <span class=\"line-clamp-1\">${slot.location}</span>\n            </div>\n          </div>\n          <div>\n            ${badgeHtml}\n          </div>\n        </div>\n\n        ${isLocked ? `\n          <div class=\"mt-2.5 pt-2 border-t border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-1.5 font-medium bg-amber-50/50 p-2 rounded-xl\">\n            <i data-lucide=\"info\" class=\"w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5\"></i>\n            <span>${slot.lockedReason}</span>\n          </div>\n        ` : slot.notes ? `\n          <div class=\"mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-start gap-1.5\">\n            <i data-lucide=\"info\" class=\"w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5\"></i>\n            <span class=\"line-clamp-2\">${slot.notes}</span>\n          </div>\n        ` : ''}\n\n        ${isSelected ? `\n          <div class=\"absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md\">\n            <i data-lucide=\"check\" class=\"w-4 h-4\"></i>\n          </div>\n        ` : ''}\n      `;\n\n      if (!isFull && !isLocked) {\n        card.addEventListener('click', () => {\n          selectedSlotId = slot.id;\n          renderSlotsGroupedByDate(slotsData, container);\n          updateSubmitButtonState();\n        });\n      }\n\n      grid.appendChild(card);\n    });\n\n    groupDiv.appendChild(grid);\n    container.appendChild(groupDiv);\n  });\n\n  if (window.lucide) {\n    lucide.createIcons();\n  }\n}\n\nfunction updateSubmitButtonState() {\n  const nameInput = document.getElementById('studentName');\n  const btn = document.getElementById('btnSubmitBooking');\n\n  const hasName = nameInput.value.trim().length > 0;\n  const hasSlot = selectedSlotId !== null;\n\n  if (hasName && hasSlot) {\n    btn.disabled = false;\n    btn.className = 'w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 transition-all flex items-center justify-center gap-3 cursor-pointer transform active:scale-[0.99]';\n    btn.innerHTML = `\n      <span>Ambil Antrean & Terbitkan Boarding Pass</span>\n      <i data-lucide=\"plane-takeoff\" class=\"w-5 h-5\"></i>\n    `;\n  } else {\n    btn.disabled = true;\n    btn.className = 'w-full py-4 px-6 rounded-2xl bg-slate-300 text-slate-500 font-bold text-base shadow-sm transition-all flex items-center justify-center gap-3 cursor-not-allowed';\n    btn.innerHTML = `\n      <span>${!hasName ? 'Isi Nama Praktikan Terlebih Dahulu' : 'Pilih Jadwal Terlebih Dahulu'}</span>\n      <i data-lucide=\"arrow-right\" class=\"w-5 h-5\"></i>\n    `;\n  }\n\n  if (window.lucide) {\n    lucide.createIcons();\n  }\n}\n\nfunction setupEventListeners() {\n  const nameInput = document.getElementById('studentName');\n  nameInput.addEventListener('input', updateSubmitButtonState);\n\n  const btnSubmit = document.getElementById('btnSubmitBooking');\n  btnSubmit.addEventListener('click', handleBookingSubmit);\n\n  // Search Ticket\n  const btnSearchPass = document.getElementById('btnSearchPass');\n  const inputSearchCode = document.getElementById('inputSearchCode');\n\n  const doSearch = () => {\n    const code = inputSearchCode.value.trim().toUpperCase();\n    if (code) {\n      window.location.href = `/boarding-pass.html?code=${encodeURIComponent(code)}`;\n    }\n  };\n\n  btnSearchPass.addEventListener('click', doSearch);\n  inputSearchCode.addEventListener('keypress', (e) => {\n    if (e.key === 'Enter') doSearch();\n  });\n\n  // Modal close\n  document.getElementById('modalBtnClose').addEventListener('click', () => {\n    document.getElementById('successModal').classList.add('hidden');\n    window.location.reload();\n  });\n}\n\nasync function handleBookingSubmit() {\n  const nameInput = document.getElementById('studentName');\n  const nimInput = document.getElementById('studentNim');\n  const waInput = document.getElementById('studentWa');\n  const btn = document.getElementById('btnSubmitBooking');\n\n  if (!selectedSlotId || !nameInput.value.trim()) {\n    alert('Mohon isi nama lengkap dan pilih salah satu jadwal.');\n    return;\n  }\n\n  btn.disabled = true;\n  btn.innerHTML = `\n    <div class=\"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin\"></div>\n    <span>Menerbitkan Boarding Pass...</span>\n  `;\n\n  try {\n    const res = await fetch('/api/public/book', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({\n        slotId: selectedSlotId,\n        studentName: nameInput.value.trim(),\n        studentNim: nimInput.value.trim(),\n        studentWa: waInput.value.trim()\n      })\n    });\n\n    const data = await res.json();\n\n    if (!res.ok) {\n      alert(data.error || 'Terjadi kesalahan saat pendaftaran.');\n      updateSubmitButtonState();\n      return;\n    }\n\n    // Tampilkan modal sukses\n    showSuccessModal(data);\n  } catch (err) {\n    alert('Koneksi terputus. Pastikan server aktif.');\n    updateSubmitButtonState();\n    console.error(err);\n  }\n}\n\nfunction showSuccessModal(data) {\n  const modal = document.getElementById('successModal');\n  const modalStudentName = document.getElementById('modalStudentName');\n  const modalBookingCode = document.getElementById('modalBookingCode');\n  const modalBtnBoardingPass = document.getElementById('modalBtnBoardingPass');\n  const modalBtnNotifyAdmin = document.getElementById('modalBtnNotifyAdmin');\n\n  modalStudentName.textContent = data.booking.studentName;\n  modalBookingCode.textContent = data.booking.bookingCode;\n  modalBtnBoardingPass.href = data.boardingPassUrl;\n\n  if (data.adminWaMeUrl) {\n    modalBtnNotifyAdmin.href = data.adminWaMeUrl;\n    modalBtnNotifyAdmin.classList.remove('hidden');\n  } else {\n    modalBtnNotifyAdmin.classList.add('hidden');\n  }\n\n  modal.classList.remove('hidden');\n\n  if (window.lucide) {\n    lucide.createIcons();\n  }\n}\n";
const ASSET_BOARDING_JS = "// Boarding Pass & Self Check-in Engine\n\nlet bookingData = null;\nlet countdownTimer = null;\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  const urlParams = new URLSearchParams(window.location.search);\n  const code = urlParams.get('code');\n\n  if (!code) {\n    showError('Kode booking tidak ditemukan di URL. Silakan kembali ke halaman utama.');\n    return;\n  }\n\n  loadBoardingPass(code);\n  setupActions();\n});\n\n// Synthesize authentic Airport Boarding 2-tone chime using Web Audio API\nfunction playAirportChime() {\n  try {\n    const AudioContext = window.AudioContext || window.webkitAudioContext;\n    if (!AudioContext) return;\n    const ctx = new AudioContext();\n\n    const now = ctx.currentTime;\n    const osc1 = ctx.createOscillator();\n    const osc2 = ctx.createOscillator();\n    const gain = ctx.createGain();\n\n    osc1.type = 'sine';\n    osc2.type = 'sine';\n\n    // First tone (high: F5 ~ 698Hz)\n    osc1.frequency.setValueAtTime(698.46, now);\n    // Second tone (chime down: C5 ~ 523Hz)\n    osc2.frequency.setValueAtTime(523.25, now + 0.35);\n\n    gain.gain.setValueAtTime(0, now);\n    gain.gain.linearRampToValueAtTime(0.3, now + 0.05);\n    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);\n\n    osc1.connect(gain);\n    osc2.connect(gain);\n    gain.connect(ctx.destination);\n\n    osc1.start(now);\n    osc1.stop(now + 0.35);\n\n    osc2.start(now + 0.35);\n    osc2.stop(now + 0.9);\n  } catch (e) {\n    console.log('Audio chime not supported:', e);\n  }\n}\n\nasync function loadBoardingPass(code) {\n  const loadingEl = document.getElementById('passLoading');\n  const errorEl = document.getElementById('passError');\n  const contentEl = document.getElementById('boardingPassContent');\n\n  try {\n    const res = await fetch(`/api/public/booking/${encodeURIComponent(code)}`);\n    const data = await res.json();\n\n    if (!res.ok) {\n      loadingEl.classList.add('hidden');\n      errorEl.classList.remove('hidden');\n      document.getElementById('passErrorMessage').textContent = data.error || 'Tiket tidak ditemukan.';\n      return;\n    }\n\n    bookingData = data;\n    loadingEl.classList.add('hidden');\n    contentEl.classList.remove('hidden');\n\n    renderTicket(data);\n    startLiveCheckInCountdown();\n  } catch (err) {\n    loadingEl.classList.add('hidden');\n    errorEl.classList.remove('hidden');\n    console.error('Error loading pass:', err);\n  }\n}\n\nfunction renderTicket(data) {\n  const { booking, slot, settings } = data;\n\n  // Header\n  document.getElementById('bpLabTitle').textContent = settings.labTitle || 'Konsultasi Praktikum';\n  document.getElementById('bpCode').textContent = booking.bookingCode;\n  document.getElementById('stubCode').textContent = booking.bookingCode;\n\n  // Passenger\n  document.getElementById('bpStudentName').textContent = booking.studentName;\n  document.getElementById('bpStudentNim').textContent = booking.studentNim ? `NIM: ${booking.studentNim}` : 'Praktikan';\n  document.getElementById('bpQueueNumber').textContent = `#${String(booking.queueNumber || 1).padStart(2, '0')}`;\n\n  // Slot Details\n  document.getElementById('bpLocation').querySelector('span').textContent = slot.location || 'Ruang Konsultasi';\n  document.getElementById('bpDate').textContent = formatDateIndo(slot.date);\n  document.getElementById('bpTime').textContent = `${slot.startTime} - ${slot.endTime} WIB`;\n\n  // WhatsApp Admin button link\n  const adminWa = settings.adminWa || '';\n  const waMsg = encodeURIComponent(\n    `Halo Asisten Praktikum! Saya *${booking.studentName}* pemegang tiket *${booking.bookingCode}* untuk jadwal konsul ${slot.date} (${slot.startTime} WIB) di ${slot.location}.`\n  );\n  document.getElementById('btnWhatsAppAdmin').href = `https://wa.me/${adminWa}?text=${waMsg}`;\n\n  // Generate QR Code\n  generateQrCode(window.location.href);\n\n  // Render Status and Check-In Controls\n  updateCheckInState();\n}\n\nfunction formatDateIndo(dateStr) {\n  try {\n    const d = new Date(dateStr + 'T00:00:00');\n    return d.toLocaleDateString('id-ID', {\n      day: 'numeric',\n      month: 'short',\n      year: 'numeric'\n    });\n  } catch (e) {\n    return dateStr;\n  }\n}\n\nfunction generateQrCode(url) {\n  const container = document.getElementById('qrcode');\n  container.innerHTML = '';\n  new QRCode(container, {\n    text: url,\n    width: 72,\n    height: 72,\n    colorDark: '#0f172a',\n    colorLight: '#ffffff',\n    correctLevel: QRCode.CorrectLevel.M\n  });\n}\n\nfunction updateCheckInState() {\n  if (!bookingData) return;\n\n  const { booking, slot, settings } = bookingData;\n  const statusBanner = document.getElementById('statusBanner');\n  const checkInActions = document.getElementById('checkInActions');\n  const sanctionBox = document.getElementById('sanctionBox');\n  const sanctionText = document.getElementById('sanctionText');\n  const stubStatus = document.getElementById('stubStatus');\n\n  const now = new Date();\n  const [startH, startM] = slot.startTime.split(':').map(Number);\n  const slotDate = new Date(slot.date);\n  slotDate.setHours(startH, startM, 0, 0);\n\n  const windowMinutes = settings.checkInWindowMinutes || 120;\n  const toleranceMinutes = settings.lateToleranceMinutes || 5;\n\n  const openTime = new Date(slotDate.getTime() - windowMinutes * 60 * 1000);\n  const deadlineTime = new Date(slotDate.getTime() + toleranceMinutes * 60 * 1000);\n\n  const isBeforeOpen = now < openTime;\n  const isPastDeadline = now > deadlineTime;\n  const isAlreadyCheckedIn = booking.checkInStatus === 'CHECKED_IN';\n  const isCompleted = booking.checkInStatus === 'COMPLETED';\n  const isLateOrSanctioned = booking.checkInStatus === 'LATE' || booking.sanctionStatus === 'APPLIED';\n\n  // 1. KASUS SUDAH SELESAI\n  if (isCompleted) {\n    statusBanner.className = 'p-4 rounded-2xl bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium flex items-center gap-3';\n    statusBanner.innerHTML = `\n      <i data-lucide=\"check-circle-2\" class=\"w-5 h-5 text-emerald-400 flex-shrink-0\"></i>\n      <div>\n        <p class=\"font-bold text-white\">Sesi Konsultasi Telah Selesai</p>\n        <p class=\"text-xs text-slate-400\">Terima kasih telah berkonsultasi tepat waktu.</p>\n      </div>\n    `;\n    checkInActions.innerHTML = `\n      <div class=\"p-3.5 bg-slate-100 rounded-xl text-center text-xs font-semibold text-slate-500\">\n        Konsultasi ini telah ditandai selesai oleh asisten praktikum.\n      </div>\n    `;\n    stubStatus.textContent = 'SELESAI';\n    sanctionBox.classList.add('hidden');\n    if (window.lucide) lucide.createIcons();\n    return;\n  }\n\n  // 2. KASUS SUDAH CHECK-IN (BERHASIL & TEPAT WAKTU)\n  if (isAlreadyCheckedIn) {\n    statusBanner.className = 'p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm font-medium flex items-center gap-3';\n    statusBanner.innerHTML = `\n      <div class=\"w-8 h-8 rounded-xl bg-emerald-500 text-slate-900 flex items-center justify-center flex-shrink-0 font-bold\">\n        <i data-lucide=\"check\" class=\"w-5 h-5\"></i>\n      </div>\n      <div>\n        <p class=\"font-bold text-white\">Check-In Berhasil! (Ready to Consult)</p>\n        <p class=\"text-xs text-emerald-300\">Waktu Check-In: ${new Date(booking.checkInTime).toLocaleTimeString('id-ID')} WIB. Silakan bersiap di lokasi.</p>\n      </div>\n    `;\n\n    checkInActions.innerHTML = `\n      <div class=\"p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-1\">\n        <div class=\"inline-flex items-center gap-1.5 text-emerald-700 font-bold text-xs uppercase tracking-wider\">\n          <i data-lucide=\"shield-check\" class=\"w-4 h-4\"></i>\n          <span>Check-in Mandiri Terverifikasi</span>\n        </div>\n        <p class=\"text-xs text-slate-600\">Nama Anda telah muncul di layar Asisten sebagai mahasiswa yang siap konsultasi.</p>\n      </div>\n    `;\n\n    stubStatus.textContent = 'CHECKED-IN';\n    stubStatus.className = 'text-emerald-700 font-bold';\n    sanctionBox.classList.add('hidden');\n    if (window.lucide) lucide.createIcons();\n    return;\n  }\n\n  // 3. KASUS TERLAMBAT / TERKENA SANKSI\n  if (isLateOrSanctioned || isPastDeadline) {\n    statusBanner.className = 'p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 text-sm font-medium flex items-center gap-3';\n    statusBanner.innerHTML = `\n      <div class=\"w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center flex-shrink-0\">\n        <i data-lucide=\"alert-triangle\" class=\"w-5 h-5\"></i>\n      </div>\n      <div>\n        <p class=\"font-bold text-white\">Status: Terlambat / Dikenakan Sanksi</p>\n        <p class=\"text-xs text-rose-300\">Anda melewati batas waktu toleransi check-in (${toleranceMinutes} menit).</p>\n      </div>\n    `;\n\n    sanctionBox.classList.remove('hidden');\n    sanctionText.textContent = booking.sanctionApplied || settings.defaultSanction;\n\n    checkInActions.innerHTML = `\n      <button id=\"btnLateCheckIn\" type=\"button\"\n        class=\"w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2\">\n        <i data-lucide=\"alert-circle\" class=\"w-4 h-4\"></i>\n        <span>Tetap Lapor Hadir (Dengan Sanksi)</span>\n      </button>\n      <p class=\"text-[11px] text-center text-slate-400\">Tekan tombol di atas untuk memberitahu asisten bahwa Anda terlambat datang.</p>\n    `;\n\n    const btnLate = document.getElementById('btnLateCheckIn');\n    if (btnLate) {\n      btnLate.addEventListener('click', () => performSelfCheckIn(true));\n    }\n\n    stubStatus.textContent = 'TERLAMBAT';\n    stubStatus.className = 'text-rose-700 font-bold';\n    if (window.lucide) lucide.createIcons();\n    return;\n  }\n\n  // 4. KASUS CHECK-IN BELUM DIBUKA\n  if (isBeforeOpen) {\n    const diffMs = openTime.getTime() - now.getTime();\n    const diffH = Math.floor(diffMs / (1000 * 60 * 60));\n    const diffM = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));\n    const timeRemainingStr = `${diffH > 0 ? diffH + ' jam ' : ''}${diffM} menit`;\n\n    statusBanner.className = 'p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-sm font-medium flex items-center gap-3';\n    statusBanner.innerHTML = `\n      <i data-lucide=\"clock\" class=\"w-5 h-5 text-amber-400 flex-shrink-0\"></i>\n      <div>\n        <p class=\"font-bold text-white\">Pintu Check-In Belum Dibuka</p>\n        <p class=\"text-xs text-amber-300\">Check-in baru dibuka ${windowMinutes} menit sebelum jadwal (pukul ${openTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB).</p>\n      </div>\n    `;\n\n    checkInActions.innerHTML = `\n      <button type=\"button\" disabled\n        class=\"w-full py-4 px-4 rounded-2xl bg-slate-200 text-slate-400 font-bold text-sm flex items-center justify-center gap-2 cursor-not-allowed\">\n        <i data-lucide=\"lock\" class=\"w-4 h-4\"></i>\n        <span>Check-in Dibuka dalam ${timeRemainingStr}</span>\n      </button>\n      <p class=\"text-[11px] text-center text-slate-400\">Halaman ini akan otomatis membuka tombol saat waktunya tiba.</p>\n    `;\n\n    stubStatus.textContent = 'MENUNGGU';\n    sanctionBox.classList.add('hidden');\n    if (window.lucide) lucide.createIcons();\n    return;\n  }\n\n  // 5. KASUS PINTU CHECK-IN SEDANG DIBUKA! (READY TO SELF CHECK-IN)\n  const diffMs = deadlineTime.getTime() - now.getTime();\n  const diffMin = Math.floor(diffMs / (1000 * 60));\n  const diffSec = Math.floor((diffMs % (1000 * 60)) / 1000);\n\n  statusBanner.className = 'p-4 rounded-2xl bg-blue-500/15 border border-blue-500/40 text-blue-200 text-sm font-medium flex items-center gap-3 animate-pulse';\n  statusBanner.innerHTML = `\n    <div class=\"w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0\">\n      <i data-lucide=\"bell-ring\" class=\"w-5 h-5\"></i>\n    </div>\n    <div>\n      <p class=\"font-bold text-white\">Pintu Check-In Sedang Dibuka!</p>\n      <p class=\"text-xs text-blue-300\">Sisa waktu sebelum toleransi habis: <strong class=\"text-white\">${diffMin}m ${diffSec}s</strong></p>\n    </div>\n  `;\n\n  checkInActions.innerHTML = `\n    <button id=\"btnPerformCheckIn\" type=\"button\"\n      class=\"pulse-checkin w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-3 transform active:scale-95 cursor-pointer\">\n      <i data-lucide=\"plane-takeoff\" class=\"w-6 h-6\"></i>\n      <span>CEK IN SEKARANG (CHECK-IN MANDIRI)</span>\n    </button>\n    <p class=\"text-[11px] text-center text-slate-500\">\n      ⚠️ <em>Praktikan wajib menekan tombol di atas secara mandiri untuk konfirmasi kehadiran.</em>\n    </p>\n  `;\n\n  const btnCheckIn = document.getElementById('btnPerformCheckIn');\n  if (btnCheckIn) {\n    btnCheckIn.addEventListener('click', () => performSelfCheckIn(false));\n  }\n\n  stubStatus.textContent = 'SIAP CHECK-IN';\n  sanctionBox.classList.add('hidden');\n  if (window.lucide) lucide.createIcons();\n}\n\nfunction startLiveCheckInCountdown() {\n  if (countdownTimer) clearInterval(countdownTimer);\n  countdownTimer = setInterval(() => {\n    updateCheckInState();\n  }, 1000);\n}\n\nasync function performSelfCheckIn(isLateMode = false) {\n  if (!bookingData) return;\n\n  const btn = document.getElementById(isLateMode ? 'btnLateCheckIn' : 'btnPerformCheckIn');\n  if (btn) {\n    btn.disabled = true;\n    btn.innerHTML = `\n      <div class=\"w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin\"></div>\n      <span>Memproses Check-in...</span>\n    `;\n  }\n\n  try {\n    const res = await fetch('/api/public/checkin', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ bookingCode: bookingData.booking.bookingCode })\n    });\n\n    const data = await res.json();\n\n    if (!res.ok) {\n      alert(data.error || 'Gagal melakukan check-in.');\n      updateCheckInState();\n      return;\n    }\n\n    // Play Authentic Airport Chime\n    playAirportChime();\n\n    // Reload booking data from server\n    await loadBoardingPass(bookingData.booking.bookingCode);\n\n    // If waMeUrl exists and not late, give user option to notify aslab\n    if (data.adminWaMeUrl && confirm('Check-In Berhasil! Apakah Anda ingin mengirim notifikasi konfirmasi langsung ke WhatsApp Asisten sekarang?')) {\n      window.open(data.adminWaMeUrl, '_blank');\n    }\n  } catch (err) {\n    alert('Koneksi terputus saat check-in. Silakan coba lagi.');\n    console.error(err);\n    updateCheckInState();\n  }\n}\n\nfunction setupActions() {\n  // Print button\n  document.getElementById('btnPrintPass').addEventListener('click', () => {\n    window.print();\n  });\n\n  // Share Ticket link button\n  document.getElementById('btnShareTicket').addEventListener('click', () => {\n    if (navigator.clipboard) {\n      navigator.clipboard.writeText(window.location.href);\n      alert('Tautan Boarding Pass berhasil disalin ke clipboard!');\n    } else {\n      prompt('Salin tautan ini:', window.location.href);\n    }\n  });\n}\n\nfunction showError(msg) {\n  document.getElementById('passLoading').classList.add('hidden');\n  document.getElementById('passError').classList.remove('hidden');\n  document.getElementById('passErrorMessage').textContent = msg;\n}\n";
const ASSET_ADMIN_JS = "// Admin Portal Logic\n\nlet adminOverview = null;\nlet networkInfo = null;\nlet currentTab = 'tab-queue';\n\ndocument.addEventListener('DOMContentLoaded', () => {\n  if (window.lucide) lucide.createIcons();\n  checkAuth();\n  setupTabs();\n  setupEventListeners();\n});\n\n// Authentication\nfunction checkAuth() {\n  const token = localStorage.getItem('sikonsul_admin_token');\n  const modal = document.getElementById('loginModal');\n\n  if (!token) {\n    modal.classList.remove('hidden');\n  } else {\n    modal.classList.add('hidden');\n    loadDashboard();\n    loadNetworkInfo();\n  }\n}\n\nasync function handleLogin() {\n  const passwordInput = document.getElementById('adminPasswordInput');\n  const errorEl = document.getElementById('loginError');\n  const password = passwordInput.value.trim();\n\n  try {\n    const res = await fetch('/api/admin/login', {\n      method: 'POST',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ password })\n    });\n\n    const data = await res.json();\n    if (!res.ok) {\n      errorEl.textContent = data.error || 'Kata sandi salah.';\n      errorEl.classList.remove('hidden');\n      return;\n    }\n\n    localStorage.setItem('sikonsul_admin_token', data.token);\n    document.getElementById('loginModal').classList.add('hidden');\n    loadDashboard();\n    loadNetworkInfo();\n  } catch (err) {\n    errorEl.textContent = 'Gagal menghubungi server.';\n    errorEl.classList.remove('hidden');\n  }\n}\n\nfunction handleLogout() {\n  localStorage.removeItem('sikonsul_admin_token');\n  window.location.reload();\n}\n\n// Tab Switching\nfunction setupTabs() {\n  const tabButtons = document.querySelectorAll('.admin-tab-btn');\n  tabButtons.forEach(btn => {\n    btn.addEventListener('click', () => {\n      const targetTab = btn.getAttribute('data-tab');\n\n      tabButtons.forEach(b => {\n        b.classList.remove('active', 'text-blue-600', 'bg-blue-50', 'border-blue-200');\n        b.classList.add('text-slate-600');\n      });\n\n      btn.classList.add('active', 'text-blue-600', 'bg-blue-50', 'border-blue-200');\n      btn.classList.remove('text-slate-600');\n\n      document.querySelectorAll('.tab-content').forEach(content => {\n        content.classList.add('hidden');\n      });\n\n      const activeContent = document.getElementById(targetTab);\n      if (activeContent) activeContent.classList.remove('hidden');\n      currentTab = targetTab;\n    });\n  });\n}\n\n// Load Network Information for sharing to WhatsApp Group\nasync function loadNetworkInfo() {\n  try {\n    const res = await fetch('/api/admin/network-info');\n    networkInfo = await res.json();\n    document.getElementById('displayShareUrl').textContent = networkInfo.networkUrl;\n  } catch (err) {\n    console.error('Error loading network info:', err);\n  }\n}\n\n// Load All Dashboard Data\nasync function loadDashboard() {\n  try {\n    const res = await fetch('/api/admin/overview');\n    if (!res.ok) throw new Error('Failed to fetch overview');\n    adminOverview = await res.json();\n\n    updateStatsAndBadges(adminOverview);\n    renderQueueTable(adminOverview.bookings);\n    renderSlotsTable(adminOverview.slots, adminOverview.bookings);\n    renderSanctionsTable(adminOverview.bookings);\n    populateSettings(adminOverview.settings);\n\n    if (window.lucide) lucide.createIcons();\n  } catch (err) {\n    console.error('Error loading dashboard:', err);\n  }\n}\n\nfunction updateStatsAndBadges(data) {\n  const { stats, settings } = data;\n\n  document.getElementById('adminLabSubtitle').textContent = settings.labTitle || 'Konsultasi Praktikum';\n\n  document.getElementById('statTotalBookings').textContent = stats.totalBookings || 0;\n  document.getElementById('statCheckedIn').textContent = stats.checkedIn || 0;\n  document.getElementById('statPending').textContent = stats.pending || 0;\n  document.getElementById('statLate').textContent = stats.lateOrSanctioned || 0;\n\n  document.getElementById('badgeQueueCount').textContent = stats.totalBookings || 0;\n  document.getElementById('badgeSlotsCount').textContent = data.slots.length || 0;\n  document.getElementById('badgeSanctionsCount').textContent = stats.lateOrSanctioned || 0;\n}\n\n// Render Queue Table\nfunction renderQueueTable(bookings) {\n  const tbody = document.getElementById('queueTableBody');\n  const emptyState = document.getElementById('queueEmptyState');\n  const filter = document.getElementById('filterStatus').value;\n\n  tbody.innerHTML = '';\n\n  let filtered = bookings || [];\n  if (filter !== 'ALL') {\n    filtered = filtered.filter(b => b.checkInStatus === filter);\n  }\n\n  if (filtered.length === 0) {\n    emptyState.classList.remove('hidden');\n    return;\n  }\n  emptyState.classList.add('hidden');\n\n  filtered.forEach(b => {\n    const tr = document.createElement('tr');\n    tr.className = 'hover:bg-slate-50/70 transition-colors';\n\n    let statusBadge = '';\n    if (b.checkInStatus === 'CHECKED_IN') {\n      statusBadge = `\n        <span class=\"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800\">\n          <span class=\"w-1.5 h-1.5 rounded-full bg-emerald-600\"></span>\n          Sudah Check-In\n        </span>\n        <span class=\"block text-[10px] text-slate-400 mt-0.5\">\n          ${b.checkInTime ? new Date(b.checkInTime).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB' : ''}\n        </span>\n      `;\n    } else if (b.checkInStatus === 'LATE') {\n      statusBadge = `\n        <span class=\"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800\">\n          <i data-lucide=\"alert-triangle\" class=\"w-3 h-3 text-rose-600\"></i>\n          Terlambat\n        </span>\n      `;\n    } else if (b.checkInStatus === 'COMPLETED') {\n      statusBadge = `\n        <span class=\"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-200 text-slate-700\">\n          <i data-lucide=\"check-check\" class=\"w-3 h-3 text-slate-600\"></i>\n          Selesai Konsul\n        </span>\n      `;\n    } else {\n      statusBadge = `\n        <span class=\"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800\">\n          <span class=\"w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse\"></span>\n          Menunggu Check-In\n        </span>\n      `;\n    }\n\n    let sanctionInfo = '-';\n    if (b.sanctionStatus === 'APPLIED') {\n      sanctionInfo = `\n        <span class=\"text-rose-700 font-bold block\">${b.sanctionApplied || 'Kena Sanksi'}</span>\n      `;\n    } else if (b.sanctionStatus === 'WAIVED') {\n      sanctionInfo = `<span class=\"text-slate-400 line-through\">Sanksi Dibatalkan</span>`;\n    }\n\n    tr.innerHTML = `\n      <td class=\"py-3.5 px-4 font-mono font-bold text-slate-900\">\n        <span class=\"text-blue-600 bg-blue-50 px-2 py-1 rounded-lg\">#${String(b.queueNumber || 1).padStart(2, '0')}</span>\n        <span class=\"block text-[10px] text-slate-400 mt-1\">${b.bookingCode}</span>\n      </td>\n      <td class=\"py-3.5 px-4\">\n        <p class=\"font-bold text-slate-900 text-sm\">${b.studentName}</p>\n        <p class=\"text-slate-500 font-mono text-[11px]\">${b.studentNim ? 'NIM: ' + b.studentNim : 'Praktikan'}</p>\n        ${b.studentWa ? `<p class=\"text-[10px] text-emerald-600 font-mono\">WA: ${b.studentWa}</p>` : ''}\n      </td>\n      <td class=\"py-3.5 px-4\">\n        <p class=\"font-bold text-slate-800\">${b.slotDate}</p>\n        <p class=\"text-blue-700 font-mono font-semibold\">${b.slotStartTime} - ${b.slotEndTime} WIB</p>\n        <p class=\"text-slate-500 text-[11px] flex items-center gap-1 mt-0.5\">\n          <i data-lucide=\"map-pin\" class=\"w-3 h-3 text-slate-400\"></i>\n          ${b.slotLocation}\n        </p>\n      </td>\n      <td class=\"py-3.5 px-4\">\n        ${statusBadge}\n      </td>\n      <td class=\"py-3.5 px-4 max-w-xs text-[11px]\">\n        ${sanctionInfo}\n      </td>\n      <td class=\"py-3.5 px-4 text-right space-x-1\">\n        <!-- Call Button -->\n        <button onclick=\"callStudent('${b.studentName}', '${b.slotLocation}')\" title=\"Panggil Antrean\"\n          class=\"p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition inline-flex items-center\">\n          <i data-lucide=\"volume-2\" class=\"w-4 h-4\"></i>\n        </button>\n\n        <!-- Mark Completed -->\n        ${b.checkInStatus !== 'COMPLETED' ? `\n          <button onclick=\"updateBookingStatus('${b.id}', 'COMPLETED')\" title=\"Tandai Selesai\"\n            class=\"p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition inline-flex items-center\">\n            <i data-lucide=\"check\" class=\"w-4 h-4\"></i>\n          </button>\n        ` : ''}\n\n        <!-- Open Boarding Pass -->\n        <a href=\"/boarding-pass.html?code=${b.bookingCode}\" target=\"_blank\" title=\"Buka Tiket\"\n          class=\"p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition inline-flex items-center\">\n          <i data-lucide=\"external-link\" class=\"w-4 h-4\"></i>\n        </a>\n      </td>\n    `;\n\n    tbody.appendChild(tr);\n  });\n\n  if (window.lucide) lucide.createIcons();\n}\n\n// Voice synthesis announcement for calling students\nfunction callStudent(name, location) {\n  try {\n    if ('speechSynthesis' in window) {\n      const text = `Panggilan untuk praktikan ${name}, silakan memasuki ruang konsultasi di ${location}.`;\n      const utterance = new SpeechSynthesisUtterance(text);\n      utterance.lang = 'id-ID';\n      utterance.rate = 0.95;\n      window.speechSynthesis.speak(utterance);\n    } else {\n      alert(`Memanggil: ${name} ke ${location}`);\n    }\n  } catch (e) {\n    alert(`Memanggil: ${name}`);\n  }\n}\n\n// Update status (e.g. mark completed)\nasync function updateBookingStatus(id, status) {\n  try {\n    const res = await fetch(`/api/admin/bookings/${id}/status`, {\n      method: 'PATCH',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ status })\n    });\n    if (res.ok) {\n      loadDashboard();\n    }\n  } catch (err) {\n    console.error('Error updating status:', err);\n  }\n}\n\n// Render Slots Table\nfunction renderSlotsTable(slots, bookings) {\n  const tbody = document.getElementById('slotsTableBody');\n  document.getElementById('totalSlotsCount').textContent = `Total: ${slots.length} Jadwal`;\n  tbody.innerHTML = '';\n\n  slots.forEach(s => {\n    const activeCount = bookings.filter(b => b.slotId === s.id && b.checkInStatus !== 'CANCELLED').length;\n    const isFull = activeCount >= (s.quota || 1);\n\n    const tr = document.createElement('tr');\n    tr.className = 'hover:bg-slate-50 transition-colors';\n    tr.innerHTML = `\n      <td class=\"py-3 px-4 font-semibold text-slate-900\">${s.date}</td>\n      <td class=\"py-3 px-4 font-mono font-bold text-blue-700\">${s.startTime} - ${s.endTime} WIB</td>\n      <td class=\"py-3 px-4 text-slate-700 font-medium\">${s.location}</td>\n      <td class=\"py-3 px-4\">\n        <span class=\"inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${\n          isFull ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'\n        }\">\n          ${activeCount} / ${s.quota || 1} Terisi\n        </span>\n      </td>\n      <td class=\"py-3 px-4 text-slate-500 text-[11px] max-w-xs truncate\">${s.notes || '-'}</td>\n      <td class=\"py-3 px-4 text-right\">\n        <button onclick=\"deleteSlot('${s.id}')\" class=\"p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition\" title=\"Hapus Jadwal\">\n          <i data-lucide=\"trash-2\" class=\"w-4 h-4\"></i>\n        </button>\n      </td>\n    `;\n    tbody.appendChild(tr);\n  });\n\n  if (window.lucide) lucide.createIcons();\n}\n\nasync function deleteSlot(id) {\n  if (!confirm('Yakin ingin menghapus slot jadwal ini?')) return;\n  try {\n    const res = await fetch(`/api/admin/slots/${id}`, { method: 'DELETE' });\n    const data = await res.json();\n    if (!res.ok) {\n      alert(data.error || 'Gagal menghapus slot.');\n      return;\n    }\n    loadDashboard();\n  } catch (err) {\n    alert('Terjadi kesalahan jaringan.');\n  }\n}\n\n// Render Sanctions Table\nfunction renderSanctionsTable(bookings) {\n  const tbody = document.getElementById('sanctionsTableBody');\n  const empty = document.getElementById('sanctionsEmptyState');\n  tbody.innerHTML = '';\n\n  const sanctioned = bookings.filter(b => b.checkInStatus === 'LATE' || b.sanctionStatus === 'APPLIED' || b.sanctionStatus === 'WAIVED');\n\n  if (sanctioned.length === 0) {\n    empty.classList.remove('hidden');\n    return;\n  }\n  empty.classList.add('hidden');\n\n  sanctioned.forEach(b => {\n    const isWaived = b.sanctionStatus === 'WAIVED';\n\n    const tr = document.createElement('tr');\n    tr.className = 'hover:bg-slate-50 transition-colors';\n    tr.innerHTML = `\n      <td class=\"py-3 px-4\">\n        <p class=\"font-bold text-slate-900\">${b.studentName}</p>\n        <p class=\"text-[11px] text-slate-500 font-mono\">${b.studentNim || '-'}</p>\n      </td>\n      <td class=\"py-3 px-4 font-mono text-xs\">\n        ${b.slotDate} (${b.slotStartTime} WIB)\n      </td>\n      <td class=\"py-3 px-4 text-[11px] text-rose-700 font-semibold max-w-xs\">\n        ${b.sanctionApplied || 'Terlambat check-in'}\n      </td>\n      <td class=\"py-3 px-4\">\n        <span class=\"px-2.5 py-1 rounded-full text-[10px] font-bold ${isWaived ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-800'}\">\n          ${isWaived ? 'Sanksi Dicabut' : 'Sanksi Berlaku'}\n        </span>\n      </td>\n      <td class=\"py-3 px-4 text-right\">\n        ${!isWaived ? `\n          <button onclick=\"waiveSanction('${b.id}')\" class=\"px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold rounded-lg text-xs transition\">\n            Ampuni / Cabut Sanksi\n          </button>\n        ` : `\n          <span class=\"text-slate-400 text-xs\">Telah Diampuni</span>\n        `}\n      </td>\n    `;\n    tbody.appendChild(tr);\n  });\n\n  if (window.lucide) lucide.createIcons();\n}\n\nasync function waiveSanction(id) {\n  if (!confirm('Cabut sanksi untuk mahasiswa ini?')) return;\n  try {\n    const res = await fetch(`/api/admin/bookings/${id}/sanction`, {\n      method: 'PATCH',\n      headers: { 'Content-Type': 'application/json' },\n      body: JSON.stringify({ sanctionStatus: 'WAIVED' })\n    });\n    if (res.ok) loadDashboard();\n  } catch (err) {\n    console.error(err);\n  }\n}\n\n// Populate Settings Form\nfunction populateSettings(settings) {\n  if (!settings) return;\n\n  document.getElementById('settingAdminWa').value = settings.adminWa || '';\n  document.getElementById('settingAdminName').value = settings.adminName || '';\n  document.getElementById('settingLabTitle').value = settings.labTitle || '';\n  document.getElementById('settingFonnteToken').value = settings.fonnteToken || '';\n\n  document.getElementById('configLateTolerance').value = settings.lateToleranceMinutes || 5;\n  document.getElementById('configCheckInWindow').value = settings.checkInWindowMinutes || 120;\n  document.getElementById('configDefaultSanction').value = settings.defaultSanction || '';\n  document.getElementById('configAutoLateCheck').checked = settings.autoLateCheck !== false;\n}\n\n// Event Listeners Setup\nfunction setupEventListeners() {\n  document.getElementById('btnLogin').addEventListener('click', handleLogin);\n  document.getElementById('adminPasswordInput').addEventListener('keypress', (e) => {\n    if (e.key === 'Enter') handleLogin();\n  });\n  document.getElementById('btnLogout').addEventListener('click', handleLogout);\n\n  // Filter change\n  document.getElementById('filterStatus').addEventListener('change', () => {\n    if (adminOverview) renderQueueTable(adminOverview.bookings);\n  });\n\n  document.getElementById('btnRefreshQueue').addEventListener('click', () => {\n    loadDashboard();\n  });\n\n  // Single vs Bulk Slot Toggle\n  const modeSingleBtn = document.getElementById('modeSingleBtn');\n  const modeBulkBtn = document.getElementById('modeBulkBtn');\n  const singleTiming = document.getElementById('singleTimingContainer');\n  const bulkTiming = document.getElementById('bulkTimingContainer');\n  let isBulkMode = false;\n\n  modeSingleBtn.addEventListener('click', () => {\n    isBulkMode = false;\n    modeSingleBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-900');\n    modeBulkBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-900');\n    singleTiming.classList.remove('hidden');\n    bulkTiming.classList.add('hidden');\n    document.getElementById('btnSaveSlotText').textContent = 'Tambahkan Jadwal';\n  });\n\n  modeBulkBtn.addEventListener('click', () => {\n    isBulkMode = true;\n    modeBulkBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-900');\n    modeSingleBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-900');\n    singleTiming.classList.add('hidden');\n    bulkTiming.classList.remove('hidden');\n    document.getElementById('btnSaveSlotText').textContent = 'Generate Semua Jadwal Sekaligus';\n  });\n\n  // Form Add Slot Submit\n  document.getElementById('formAddSlot').addEventListener('submit', async (e) => {\n    e.preventDefault();\n    const date = document.getElementById('slotDate').value;\n    const location = document.getElementById('slotLocation').value.trim();\n    const notes = document.getElementById('slotNotes').value.trim();\n\n    let payload = { date, location, notes, isBulk: isBulkMode };\n\n    if (isBulkMode) {\n      payload.startTime = document.getElementById('bulkStartTime').value;\n      payload.intervalMinutes = document.getElementById('bulkInterval').value;\n      payload.count = document.getElementById('bulkCount').value;\n      payload.quota = document.getElementById('bulkQuota').value;\n    } else {\n      payload.startTime = document.getElementById('slotStartTime').value;\n      payload.endTime = document.getElementById('slotEndTime').value;\n      payload.quota = document.getElementById('slotQuota').value;\n    }\n\n    try {\n      const res = await fetch('/api/admin/slots', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify(payload)\n      });\n      const data = await res.json();\n      if (!res.ok) {\n        alert(data.error || 'Gagal menambahkan jadwal.');\n        return;\n      }\n      alert(isBulkMode ? `Berhasil membuat ${data.count} slot jadwal sekaligus!` : 'Jadwal berhasil ditambahkan!');\n      loadDashboard();\n    } catch (err) {\n      alert('Terjadi kesalahan jaringan.');\n    }\n  });\n\n  // Save Sanction Config\n  document.getElementById('btnSaveSanctionConfig').addEventListener('click', async () => {\n    const lateToleranceMinutes = Number(document.getElementById('configLateTolerance').value);\n    const checkInWindowMinutes = Number(document.getElementById('configCheckInWindow').value);\n    const defaultSanction = document.getElementById('configDefaultSanction').value.trim();\n    const autoLateCheck = document.getElementById('configAutoLateCheck').checked;\n\n    try {\n      const res = await fetch('/api/admin/settings', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({\n          lateToleranceMinutes,\n          checkInWindowMinutes,\n          defaultSanction,\n          autoLateCheck\n        })\n      });\n      if (res.ok) {\n        alert('Aturan sanksi & keterlambatan berhasil diperbarui!');\n        loadDashboard();\n      }\n    } catch (err) {\n      alert('Gagal menyimpan aturan.');\n    }\n  });\n\n  // Save General & WA Settings\n  document.getElementById('btnSaveGeneralSettings').addEventListener('click', async () => {\n    const adminWa = document.getElementById('settingAdminWa').value.trim();\n    const adminName = document.getElementById('settingAdminName').value.trim();\n    const labTitle = document.getElementById('settingLabTitle').value.trim();\n    const fonnteToken = document.getElementById('settingFonnteToken').value.trim();\n\n    try {\n      const res = await fetch('/api/admin/settings', {\n        method: 'POST',\n        headers: { 'Content-Type': 'application/json' },\n        body: JSON.stringify({ adminWa, adminName, labTitle, fonnteToken })\n      });\n      if (res.ok) {\n        alert('Pengaturan WhatsApp & identitas berhasil disimpan!');\n        loadDashboard();\n      }\n    } catch (err) {\n      alert('Gagal menyimpan pengaturan.');\n    }\n  });\n\n  // Test WA Notification Button\n  document.getElementById('btnTestWaNotification').addEventListener('click', async () => {\n    try {\n      const res = await fetch('/api/admin/whatsapp/test', { method: 'POST' });\n      const data = await res.json();\n      if (!res.ok) {\n        alert(data.error || 'Gagal melakukan tes kirim WhatsApp.');\n        return;\n      }\n\n      if (data.result && data.result.waMeUrl) {\n        alert('Membuka WhatsApp untuk mengirim pesan uji coba...');\n        window.open(data.result.waMeUrl, '_blank');\n      } else {\n        alert('Notifikasi tes berhasil dikirim via API!');\n      }\n    } catch (err) {\n      alert('Gagal mengirim pesan uji coba.');\n    }\n  });\n\n  // Copy WhatsApp announcement to share to student group\n  document.getElementById('btnCopyWaAnnouncement').addEventListener('click', () => {\n    if (!networkInfo) return;\n    if (navigator.clipboard) {\n      navigator.clipboard.writeText(networkInfo.shareText);\n      alert('Teks pengumuman & link pendaftaran berhasil disalin!\\nSilakan langsung paste (Ctrl+V) ke grup WhatsApp praktikum Anda.');\n    } else {\n      prompt('Salin teks pengumuman berikut:', networkInfo.shareText);\n    }\n  });\n\n  // Copy Daily Recap for WhatsApp / Notes\n  document.getElementById('btnCopyDailyRecap').addEventListener('click', () => {\n    if (!adminOverview || !adminOverview.bookings) return;\n\n    let recap = `📋 *REKAP KONSULTASI LAPORAN PRAKTIKUM* 📋\\n`;\n    recap += `📅 Tanggal: ${new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}\\n`;\n    recap += `👤 Asisten: ${adminOverview.settings.adminName || '-'}\\n\\n`;\n\n    adminOverview.bookings.forEach((b, idx) => {\n      const statusIcon = b.checkInStatus === 'CHECKED_IN' ? '✅' : b.checkInStatus === 'LATE' ? '❌' : '⏳';\n      recap += `${idx + 1}. [${statusIcon}] ${b.studentName} (${b.studentNim || '-'}) | ${b.slotStartTime || '-'} WIB | ${b.slotLocation || '-'}\\n`;\n      if (b.sanctionStatus === 'APPLIED') {\n        recap += `   ⚠️ Sanksi: ${b.sanctionApplied}\\n`;\n      }\n    });\n\n    if (navigator.clipboard) {\n      navigator.clipboard.writeText(recap);\n      alert('Rekap konsultasi berhasil disalin ke clipboard!');\n    } else {\n      prompt('Salin rekap ini:', recap);\n    }\n  });\n\n  // Auto-refresh dashboard every 15 seconds\n  setInterval(() => {\n    if (localStorage.getItem('sikonsul_admin_token')) {\n      loadDashboard();\n    }\n  }, 15000);\n}\n";

app.get('/css/style.css', (req, res) => {
  res.type('text/css').send(ASSET_CSS);
});
app.get('/js/student.js', (req, res) => {
  res.type('application/javascript').send(ASSET_STUDENT_JS);
});
app.get('/js/boarding.js', (req, res) => {
  res.type('application/javascript').send(ASSET_BOARDING_JS);
});
app.get('/js/admin.js', (req, res) => {
  res.type('application/javascript').send(ASSET_ADMIN_JS);
});

// Serve static directory if present
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// HTML Page Routes
function serveHtml(filename, res) {
  const publicPath = path.join(__dirname, 'public', filename);
  const rootPath = path.join(__dirname, filename);
  if (fs.existsSync(publicPath)) {
    return res.sendFile(publicPath);
  }
  if (fs.existsSync(rootPath)) {
    return res.sendFile(rootPath);
  }
  res.status(404).send('Halaman ' + filename + ' tidak ditemukan.');
}

app.get('/', (req, res) => serveHtml('index.html', res));
app.get('/index.html', (req, res) => serveHtml('index.html', res));
app.get('/boarding-pass.html', (req, res) => serveHtml('boarding-pass.html', res));
app.get('/admin', (req, res) => serveHtml('admin.html', res));
app.get('/admin.html', (req, res) => serveHtml('admin.html', res));

function getBaseUrl(req) {
  const db = readDb();
  if (db.settings && db.settings.publicUrl && db.settings.publicUrl.startsWith('http')) {
    return db.settings.publicUrl.replace(/\/$/, '');
  }
  const host = req.get('host') || ('localhost:' + PORT);
  const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  return protocol + '://' + host;
}

// -------------------------------------------------------------
// PUBLIC API (MAHASISWA)
// -------------------------------------------------------------
app.get('/api/public/info', (req, res) => {
  const db = readDb();
  const settings = db.settings;
  res.json({
    labTitle: settings.labTitle,
    adminName: settings.adminName,
    checkInWindowMinutes: settings.checkInWindowMinutes,
    lateToleranceMinutes: settings.lateToleranceMinutes,
    defaultSanction: settings.defaultSanction,
    serverTime: new Date().toISOString()
  });
});

app.get('/api/public/slots', (req, res) => {
  const db = readDb();
  const slots = (db.slots || []).filter(s => s.isActive !== false);
  const bookings = (db.bookings || []).filter(b => b.checkInStatus !== 'CANCELLED');

  slots.sort((a, b) => new Date(a.date + 'T' + a.startTime) - new Date(b.date + 'T' + b.startTime));

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

  const processedSlots = slotsWithQuota.map(slot => {
    if (slot.unlockWhenSlotFull) {
      const target = slotsWithQuota.find(s => s.id === slot.unlockWhenSlotFull);
      if (target && !target.isFull) {
        return {
          ...slot,
          isLocked: true,
          lockedReason: 'Terkunci: Sesi ini baru terbuka otomatis jika kuota sesi ' + target.startTime + ' WIB telah penuh (saat ini masih sisa ' + target.remainingQuota + ' kuota).',
          targetRemaining: target.remainingQuota
        };
      }
    }
    return { ...slot, isLocked: false };
  });

  res.json(processedSlots);
});

app.post('/api/public/book', async (req, res) => {
  try {
    const { slotId, studentName, studentNim, studentWa } = req.body;
    if (!slotId || !studentName || studentName.trim().length === 0) {
      return res.status(400).json({ error: 'Nama lengkap dan pilihan jadwal wajib diisi.' });
    }

    const db = readDb();
    const slot = db.slots.find(s => s.id === slotId);
    if (!slot) return res.status(400).json({ error: 'Jadwal tidak ditemukan.' });

    if (slot.unlockWhenSlotFull) {
      const target = db.slots.find(s => s.id === slot.unlockWhenSlotFull);
      if (target) {
        const targetBookings = db.bookings.filter(b => b.slotId === target.id && b.checkInStatus !== 'CANCELLED');
        if (targetBookings.length < (target.quota || 1)) {
          const remaining = (target.quota || 1) - targetBookings.length;
          return res.status(400).json({
            error: 'Jadwal jam ' + slot.startTime + ' WIB belum dapat diambil. Sesi ini baru terbuka otomatis setelah kuota sesi ' + target.startTime + ' WIB terisi penuh (masih sisa ' + remaining + ' kuota).'
          });
        }
      }
    }

    const activeBookings = db.bookings.filter(b => b.slotId === slotId && b.checkInStatus !== 'CANCELLED');
    if (activeBookings.length >= (slot.quota || 1)) {
      return res.status(400).json({ error: 'Slot jadwal ini sudah penuh, silakan pilih jadwal lainnya.' });
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const bookingCode = 'PASS-' + randomCode;
    const queueNumber = activeBookings.length + 1;

    const newBooking = {
      id: 'book-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      bookingCode,
      queueNumber,
      slotId,
      studentName: studentName.trim(),
      studentNim: (studentNim || '').trim(),
      studentWa: (studentWa || '').trim(),
      checkInStatus: 'PENDING',
      checkInTime: null,
      sanctionApplied: null,
      sanctionStatus: 'NONE',
      createdAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    writeDb(db);

    const settings = db.settings;
    const appUrl = getBaseUrl(req);

    const adminMessage = whatsapp.buildNewBookingMessage({ booking: newBooking, slot, settings, appUrl });
    const waResult = await whatsapp.sendNotification(settings.adminWa, adminMessage, settings);

    const studentMessage = whatsapp.buildStudentConfirmationMessage({ booking: newBooking, slot, appUrl });
    const studentWaMeUrl = newBooking.studentWa ? whatsapp.generateWaMeLink(newBooking.studentWa, studentMessage) : null;

    res.json({
      success: true,
      booking: newBooking,
      slot,
      adminWaMeUrl: waResult.waMeUrl,
      studentWaMeUrl,
      boardingPassUrl: '/boarding-pass.html?code=' + newBooking.bookingCode
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/public/booking/:code', (req, res) => {
  const db = readDb();
  const booking = db.bookings.find(b => b.bookingCode.toUpperCase() === req.params.code.toUpperCase());
  if (!booking) {
    return res.status(404).json({ error: 'Boarding pass tidak ditemukan. Periksa kembali kode tiket Anda.' });
  }
  const slot = db.slots.find(s => s.id === booking.slotId);
  res.json({ booking, slot, settings: db.settings, serverTime: new Date().toISOString() });
});

app.post('/api/public/checkin', async (req, res) => {
  try {
    const { bookingCode } = req.body;
    if (!bookingCode) return res.status(400).json({ error: 'Kode tiket diperlukan.' });

    const db = readDb();
    const booking = db.bookings.find(b => b.bookingCode.toUpperCase() === bookingCode.toUpperCase());
    if (!booking) return res.status(404).json({ error: 'Kode tiket tidak ditemukan.' });

    if (booking.checkInStatus === 'CHECKED_IN') {
      return res.json({ success: true, booking, slot: db.slots.find(s => s.id === booking.slotId), alreadyDone: true });
    }

    const slot = db.slots.find(s => s.id === booking.slotId);
    if (!slot) return res.status(400).json({ error: 'Slot jadwal tidak ditemukan.' });

    const now = new Date();
    const settings = db.settings;
    const [startH, startM] = slot.startTime.split(':').map(Number);
    const slotDate = new Date(slot.date);
    slotDate.setHours(startH, startM, 0, 0);

    const minutesDiff = (slotDate.getTime() - now.getTime()) / (1000 * 60);
    const windowMinutes = settings.checkInWindowMinutes || 120;
    if (minutesDiff > windowMinutes) {
      const openTime = new Date(slotDate.getTime() - windowMinutes * 60 * 1000);
      return res.status(400).json({
        error: 'Check-in belum dibuka. Check-in baru bisa dilakukan mulai pukul ' + openTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB.'
      });
    }

    const tolerance = settings.lateToleranceMinutes || 5;
    const isLate = minutesDiff < -tolerance;

    if (isLate) {
      booking.checkInStatus = 'LATE';
      booking.sanctionStatus = 'APPLIED';
      booking.sanctionApplied = settings.defaultSanction || 'Terlambat Check-In melebihi batas toleransi.';
      booking.checkInTime = now.toISOString();
    } else {
      booking.checkInStatus = 'CHECKED_IN';
      booking.checkInTime = now.toISOString();
    }

    writeDb(db);

    const adminMessage = whatsapp.buildCheckInMessage({ booking, slot, settings, isLate });
    const waResult = await whatsapp.sendNotification(settings.adminWa, adminMessage, settings);

    res.json({
      success: true,
      booking,
      slot,
      isLate,
      adminWaMeUrl: waResult.waMeUrl,
      message: isLate ? 'Check-in tercatat TERLAMBAT dan dikenakan sanksi praktikum.' : 'Check-in BERHASIL! Silakan bersiap di lokasi konsultasi.'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// -------------------------------------------------------------
// ADMIN API (ASISTEN)
// -------------------------------------------------------------
app.post('/api/admin/login', (req, res) => {
  const db = readDb();
  if (req.body.password === (db.settings.adminPassword || 'admin')) {
    res.json({ success: true, token: 'token-' + Date.now() });
  } else {
    res.status(401).json({ error: 'Kata sandi salah.' });
  }
});

app.get('/api/admin/overview', (req, res) => {
  const db = readDb();
  const slots = db.slots || [];
  const bookings = db.bookings || [];

  const enriched = bookings.map(b => {
    const s = slots.find(slot => slot.id === b.slotId) || {};
    return {
      ...b,
      slotDate: s.date || '',
      slotStartTime: s.startTime || '',
      slotEndTime: s.endTime || '',
      slotLocation: s.location || 'Lokasi belum ditentukan'
    };
  });

  const stats = {
    totalBookings: bookings.filter(b => b.checkInStatus !== 'CANCELLED').length,
    checkedIn: bookings.filter(b => b.checkInStatus === 'CHECKED_IN').length,
    pending: bookings.filter(b => b.checkInStatus === 'PENDING').length,
    lateOrSanctioned: bookings.filter(b => b.checkInStatus === 'LATE' || b.sanctionStatus === 'APPLIED').length,
    completed: bookings.filter(b => b.checkInStatus === 'COMPLETED').length,
    totalSlots: slots.length
  };

  res.json({ stats, slots, bookings: enriched, settings: db.settings, serverTime: new Date().toISOString() });
});

app.post('/api/admin/slots', (req, res) => {
  const db = readDb();
  const newSlot = {
    id: 'slot-' + Date.now(),
    date: req.body.date,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    location: req.body.location,
    quota: Number(req.body.quota) || 1,
    notes: req.body.notes || '',
    isActive: true,
    createdAt: new Date().toISOString()
  };
  db.slots.push(newSlot);
  writeDb(db);
  res.json({ success: true, slot: newSlot });
});

app.delete('/api/admin/slots/:id', (req, res) => {
  const db = readDb();
  db.slots = db.slots.filter(s => s.id !== req.params.id);
  writeDb(db);
  res.json({ success: true });
});

app.patch('/api/admin/bookings/:id/status', (req, res) => {
  const db = readDb();
  const b = db.bookings.find(item => item.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking tidak ditemukan' });
  b.checkInStatus = req.body.status;
  writeDb(db);
  res.json({ success: true, booking: b });
});

app.patch('/api/admin/bookings/:id/sanction', (req, res) => {
  const db = readDb();
  const b = db.bookings.find(item => item.id === req.params.id);
  if (!b) return res.status(404).json({ error: 'Booking tidak ditemukan' });
  b.sanctionStatus = req.body.sanctionStatus;
  writeDb(db);
  res.json({ success: true, booking: b });
});

app.post('/api/admin/settings', (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

app.get('/api/admin/network-info', (req, res) => {
  const db = readDb();
  const shareUrl = db.settings.publicUrl || ('http://localhost:' + PORT);
  res.json({
    shareUrl,
    shareText: 'Halo rekan-rekan praktikan! ??\nSilakan pilih jadwal antrean konsultasi laporan pada link resmi:\n?? ' + shareUrl + '\n\nSetelah memilih jadwal, Anda akan mendapatkan tiket Boarding Pass digital. Mohon lakukan *Check-in Mandiri* pada link tiket sebelum jadwal konsultasi dimulai! ??'
  });
});

app.post('/api/admin/whatsapp/test', async (req, res) => {
  const db = readDb();
  const testMsg = '?? *TES NOTIFIKASI SIKONSUL BERHASIL* ??\n\nHalo *' + db.settings.adminName + '*! Notifikasi WhatsApp telah terhubung.';
  const result = await whatsapp.sendNotification(db.settings.adminWa, testMsg, db.settings);
  res.json({ success: true, result });
});

// Auto Late Checker (every 60s)
setInterval(() => {
  try {
    const db = readDb();
    if (!db.settings.autoLateCheck) return;
    const now = new Date();
    const tolerance = db.settings.lateToleranceMinutes || 5;
    let changed = false;

    db.bookings.forEach(b => {
      if (b.checkInStatus === 'PENDING') {
        const slot = db.slots.find(s => s.id === b.slotId);
        if (slot) {
          const [startH, startM] = slot.startTime.split(':').map(Number);
          const deadline = new Date(slot.date);
          deadline.setHours(startH, startM, 0, 0);
          deadline.setMinutes(deadline.getMinutes() + tolerance);
          if (now > deadline) {
            b.checkInStatus = 'LATE';
            b.sanctionStatus = 'APPLIED';
            b.sanctionApplied = db.settings.defaultSanction || 'Terlambat check-in';
            changed = true;
          }
        }
      }
    });

    if (changed) writeDb(db);
  } catch (e) {}
}, 60000);

app.listen(PORT, '0.0.0.0', () => {
  console.log('?? SiKonsul Server Running on Port ' + PORT);
});

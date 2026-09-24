import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'database.json');

// Default initial order config
const DEFAULT_PRESETS = [
  {
    id: 'preset-1',
    name: 'Regional 3 / Zona 10 / PHKT DOBS',
    pemesan: 'Regional 3 / Zona 10 / PHKT DOBS',
    sekolah: 'SMP 5 Penajam',
    wilayah: 'Kab. Penajam Paser Utara | Kalimantan Timur',
  },
  {
    id: 'preset-2',
    name: 'Regional 4 / Zona 11 / PHKT BSB',
    pemesan: 'Regional 4 / Zona 11 / PHKT BSB',
    sekolah: 'SMP 2 Babulu',
    wilayah: 'Kab. Penajam Paser Utara | Kalimantan Timur',
  },
  {
    id: 'preset-3',
    name: 'Regional 1 / Zona 1 / Pertamina Hulu Rokan',
    pemesan: 'Regional 1 / Zona 1 / Pertamina Hulu Rokan',
    sekolah: 'SDN Minas Barat',
    wilayah: 'Kab. Siak | Riau',
  },
  {
    id: 'preset-4',
    name: 'Regional 2 / Zona 7 / Pertamina EP Jatibarang',
    pemesan: 'Regional 2 / Zona 7 / Pertamina EP',
    sekolah: 'SMPN 1 Balongan',
    wilayah: 'Kab. Indramayu | Jawa Barat',
  },
];

const DEFAULT_CONFIG = {
  namaPemesan: 'Regional 3 / Zona 10 / PHKT DOBS',
  nomorPO: 'PO-QC-2026-001',
  tanggal: new Date().toISOString().split('T')[0],
  namaPetugasQC: '',
  themeColor: 'merah',
  customLogoUrl: '',
  namaSekolahHeader: '',
  wilayahAlamat: '',
  selectedPresetId: 'preset-1',
  presets: DEFAULT_PRESETS,
  atkLayout: 'opsi-a',
  identityStyle: 'opsi-1',
  showCutGuides: true,
};

// Initial sample students
const SAMPLE_STUDENTS = [
  {
    id: 'sample-1',
    code: 'SMP-001',
    regional: 'Regional 3/Zona 10/ PHKT DOBS',
    no: 1,
    namaSekolah: 'SMP 5 Penajam',
    jenjang: 'SMP',
    nama: 'Citra Aprilia Putri',
    jenisKelamin: 'P',
    kelas: '7',
    ukBajuMP: '9',
    pjgBajuMP: 'Panjang',
    ukBawahanMP: '10',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Rok',
    siagaPenggalang: 'Penggalang',
    ukBajuPP: '9',
    pjgBajuPP: 'Panjang',
    ukBawahanPP: '10',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Rok',
    sepatu: '38',
  },
  {
    id: 'sample-2',
    code: 'SMP-002',
    regional: 'Regional 3/Zona 10/ PHKT DOBS',
    no: 2,
    namaSekolah: 'SMP 5 Penajam',
    jenjang: 'SMP',
    nama: 'Rizky Pratama Wijaya',
    jenisKelamin: 'L',
    kelas: '7',
    ukBajuMP: '10',
    pjgBajuMP: 'Pendek',
    ukBawahanMP: '11',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Celana',
    siagaPenggalang: 'Penggalang',
    ukBajuPP: '10',
    pjgBajuPP: 'Pendek',
    ukBawahanPP: '11',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Celana',
    sepatu: '40',
  },
  {
    id: 'sample-3',
    code: 'SDN-001',
    regional: 'Regional 3/Zona 10/ PHKT DOBS',
    no: 3,
    namaSekolah: 'SDN 001 Sepaku',
    jenjang: 'SD',
    nama: 'Ahmad Fauzi',
    jenisKelamin: 'L',
    kelas: '2',
    ukBajuMP: '7',
    pjgBajuMP: 'Pendek',
    ukBawahanMP: '7',
    pjgBawahanMP: 'Pendek',
    rokCelanaMP: 'Celana',
    siagaPenggalang: 'Siaga',
    ukBajuPP: '7',
    pjgBajuPP: 'Pendek',
    ukBawahanPP: '7',
    pjgBawahanPP: 'Pendek',
    rokCelanaPP: 'Celana',
    sepatu: '32',
  },
  {
    id: 'sample-4',
    code: 'SDN-002',
    regional: 'Regional 3/Zona 10/ PHKT DOBS',
    no: 4,
    namaSekolah: 'SDN 001 Sepaku',
    jenjang: 'SD',
    nama: 'Leni Yundari',
    jenisKelamin: 'P',
    kelas: '1',
    ukBajuMP: '6',
    pjgBajuMP: 'Panjang',
    ukBawahanMP: '6',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Rok',
    siagaPenggalang: 'Siaga',
    ukBajuPP: '6',
    pjgBajuPP: 'Panjang',
    ukBawahanPP: '6',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Rok',
    sepatu: '31',
  },
  {
    id: 'sample-5',
    code: 'SMP-003',
    regional: 'Regional 4/Zona 11/ PHKT BSB',
    no: 1,
    namaSekolah: 'SMP 2 Babulu',
    jenjang: 'SMP',
    nama: 'Dimas Satria',
    jenisKelamin: 'L',
    kelas: '8',
    ukBajuMP: '11',
    pjgBajuMP: 'Pendek',
    ukBawahanMP: '12',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Celana',
    siagaPenggalang: 'Penggalang',
    ukBajuPP: '11',
    pjgBajuPP: 'Pendek',
    ukBawahanPP: '12',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Celana',
    sepatu: '41',
  },
  {
    id: 'sample-6',
    code: 'SMP-004',
    regional: 'Regional 4/Zona 11/ PHKT BSB',
    no: 2,
    namaSekolah: 'SMP 2 Babulu',
    jenjang: 'SMP',
    nama: 'Putri Ayu Wandira',
    jenisKelamin: 'P',
    kelas: '9',
    ukBajuMP: '12',
    pjgBajuMP: 'Panjang',
    ukBawahanMP: '12',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Rok',
    siagaPenggalang: 'Penggalang',
    ukBajuPP: '12',
    pjgBajuPP: 'Panjang',
    ukBawahanPP: '12',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Rok',
    sepatu: '39',
  }
];

interface DatabaseSchema {
  students: any[];
  orderConfig: any;
  updatedAt: string;
}

// Ensure database file exists
function getDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const data = JSON.parse(content);
      return {
        students: Array.isArray(data.students) ? data.students : SAMPLE_STUDENTS,
        orderConfig: data.orderConfig || DEFAULT_CONFIG,
        updatedAt: data.updatedAt || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('Error reading database file, using defaults:', err);
  }

  // Initialize fresh database
  const initialData: DatabaseSchema = {
    students: SAMPLE_STUDENTS,
    orderConfig: DEFAULT_CONFIG,
    updatedAt: new Date().toISOString(),
  };
  saveDatabase(initialData);
  return initialData;
}

// Atomic database write
function saveDatabase(data: DatabaseSchema): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    data.updatedAt = new Date().toISOString();
    const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DB_FILE);
    return true;
  } catch (err) {
    console.error('Error saving database file:', err);
    return false;
  }
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '20mb' }));

  // Support embedding in iframe for external parent websites
  app.use((_req, res, next) => {
    res.removeHeader('X-Frame-Options');
    res.setHeader('Content-Security-Policy', "frame-ancestors *;");
    next();
  });

  // API Routes
  // 1. Get all data
  app.get('/api/data', (_req, res) => {
    const db = getDatabase();
    res.json({
      success: true,
      students: db.students,
      orderConfig: db.orderConfig,
      updatedAt: db.updatedAt,
    });
  });

  // 2. Save or Append Students
  app.post('/api/students', (req, res) => {
    const { students, append } = req.body;
    if (!Array.isArray(students)) {
      return res.status(400).json({ success: false, error: 'students must be an array' });
    }

    const db = getDatabase();
    if (append) {
      // Append mode: avoid duplicate IDs
      const existingIds = new Set(db.students.map((s) => s.id));
      const newItems = students.filter((s) => !existingIds.has(s.id));
      db.students = [...db.students, ...newItems];
    } else {
      // Replace mode
      db.students = students;
    }

    saveDatabase(db);
    res.json({
      success: true,
      count: db.students.length,
      updatedAt: db.updatedAt,
      students: db.students,
    });
  });

  // 3. Add or Update a single student
  app.put('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const updated = req.body;
    const db = getDatabase();

    const idx = db.students.findIndex((s) => s.id === id);
    if (idx >= 0) {
      db.students[idx] = { ...db.students[idx], ...updated, id };
    } else {
      db.students.unshift({ ...updated, id });
    }

    saveDatabase(db);
    res.json({ success: true, student: db.students[idx >= 0 ? idx : 0], updatedAt: db.updatedAt });
  });

  // 4. Delete single student
  app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    const db = getDatabase();
    db.students = db.students.filter((s) => s.id !== id);
    saveDatabase(db);
    res.json({ success: true, count: db.students.length, updatedAt: db.updatedAt });
  });

  // 5. Delete bulk students
  app.post('/api/students/delete-bulk', (req, res) => {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ success: false, error: 'ids must be an array' });
    }
    const idSet = new Set(ids);
    const db = getDatabase();
    db.students = db.students.filter((s) => !idSet.has(s.id));
    saveDatabase(db);
    res.json({ success: true, count: db.students.length, updatedAt: db.updatedAt });
  });

  // 6. Delete region
  app.delete('/api/regions/:regionName', (req, res) => {
    const { regionName } = req.params;
    const decoded = decodeURIComponent(regionName).trim();
    const db = getDatabase();
    db.students = db.students.filter((s) => (s.regional || '').trim() !== decoded);
    saveDatabase(db);
    res.json({ success: true, count: db.students.length, updatedAt: db.updatedAt });
  });

  // 7. Clear all students
  app.delete('/api/students/all', (_req, res) => {
    const db = getDatabase();
    db.students = [];
    saveDatabase(db);
    res.json({ success: true, count: 0, updatedAt: db.updatedAt });
  });

  // 8. Reset to sample
  app.post('/api/reset', (_req, res) => {
    const db = getDatabase();
    db.students = SAMPLE_STUDENTS;
    db.orderConfig = DEFAULT_CONFIG;
    saveDatabase(db);
    res.json({
      success: true,
      students: db.students,
      orderConfig: db.orderConfig,
      updatedAt: db.updatedAt,
    });
  });

  // 9. Update order configuration
  app.put('/api/config', (req, res) => {
    const newConfig = req.body;
    const db = getDatabase();
    db.orderConfig = { ...db.orderConfig, ...newConfig };
    saveDatabase(db);
    res.json({ success: true, orderConfig: db.orderConfig, updatedAt: db.updatedAt });
  });

  // 10. Health check
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', serverTime: new Date().toISOString() });
  });

  // Vite development middleware or static production serve
  const isProduction = process.env.NODE_ENV === 'production';
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (Database enabled, cross-device ready)`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

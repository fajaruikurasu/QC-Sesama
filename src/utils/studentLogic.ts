import { StudentData, StudentQCItems, QCSectionItem } from '../types';

/**
 * Builds the exact QC items for a student based on school level (SD/SMP),
 * gender (L/P), sizes, and pramuka level (Siaga/Penggalang).
 */
export function generateStudentQCItems(
  student: StudentData
): StudentQCItems {
  const jenjang = (student.jenjang || '').toUpperCase().trim();
  const isSMP = jenjang.includes('SMP') || jenjang.includes('MTS') || (parseInt(student.kelas, 10) >= 7);
  const isSD = !isSMP;
  
  const rawGender = (student.jenisKelamin || '').toUpperCase().trim();
  const isPerempuan = rawGender.startsWith('P') || rawGender.includes('PUTRI') || rawGender.includes('FEMALE');
  const isLaki = !isPerempuan;
  const genderPramuka = isPerempuan ? 'Perempuan' : 'Laki-laki';

  const rawPramuka = (student.siagaPenggalang || '').toLowerCase().trim();
  const isSiaga = rawPramuka.includes('siaga') || (isSD && parseInt(student.kelas, 10) <= 4);
  const pramukaLevel = isSiaga ? 'Siaga' : 'Penggalang';

  // ----------------------------------------------------
  // 1. SERAGAM NASIONAL (PUTIH / MERAH / BIRU)
  // ----------------------------------------------------
  const lenganMP = student.pjgBajuMP || 'Panjang';
  const ukBajuMP = student.ukBajuMP || 'Standar';
  const bajuMPLabel = `1 pcs Baju Lengan ${lenganMP} - Uk. ${ukBajuMP}`;

  const jenisBawahanMP = student.rokCelanaMP || (isPerempuan ? 'Rok' : 'Celana');
  const pjgBawahanMP = student.pjgBawahanMP || 'Panjang';
  const ukBawahanMP = student.ukBawahanMP || 'Standar';
  const bawahanMPLabel = `1 pcs ${jenisBawahanMP} ${pjgBawahanMP} - Uk. ${ukBawahanMP}`;

  const topiNasional = isSMP ? '1 pcs Topi SMP' : '1 pcs Topi SD';
  const dasiNasional = isSMP 
    ? '1 pcs Dasi SMP' 
    : (isPerempuan ? '1 pcs Dasi SD Perempuan' : '1 pcs Dasi SD Laki-laki');
  const ikatPinggangNasional = isSMP ? '1 pcs Ikat Pinggang Hitam SMP' : '1 pcs Ikat Pinggang Hitam SD';

  const nasional: QCSectionItem[] = [
    {
      id: 'baju-mp',
      label: bajuMPLabel,
    },
    {
      id: 'bawahan-mp',
      label: bawahanMPLabel,
    },
    {
      id: 'topi-nasional',
      label: topiNasional,
    },
    {
      id: 'dasi-nasional',
      label: dasiNasional,
    },
    {
      id: 'sabuk-nasional',
      label: ikatPinggangNasional,
    },
  ];

  // ----------------------------------------------------
  // 2. SERAGAM PRAMUKA (SIAGA / PENGGALANG)
  // ----------------------------------------------------
  const lenganPP = student.pjgBajuPP || 'Panjang';
  const ukBajuPP = student.ukBajuPP || 'Standar';
  const bajuPPLabel = `1 pcs Baju Lengan ${lenganPP} - Uk. ${ukBajuPP}`;

  const jenisBawahanPP = student.rokCelanaPP || (isPerempuan ? 'Rok' : 'Celana');
  const pjgBawahanPP = student.pjgBawahanPP || 'Panjang';
  const ukBawahanPP = student.ukBawahanPP || 'Standar';
  const bawahanPPLabel = `1 pcs ${jenisBawahanPP} ${pjgBawahanPP} - Uk. ${ukBawahanPP}`;

  // Penutup kepala:
  // Siaga -> Topi Siaga Laki-laki / Perempuan
  // Penggalang -> Baret (Laki-laki) / Topi Boni (Perempuan)
  let penutupKepalaPramuka = '';
  if (isSiaga) {
    penutupKepalaPramuka = isPerempuan ? '1 pcs Topi Siaga Perempuan' : '1 pcs Topi Siaga Laki-laki';
  } else {
    penutupKepalaPramuka = isPerempuan ? '1 pcs Topi Boni' : '1 pcs Baret';
  }

  // Emblem:
  // Hanya ada untuk Penggalang, Siaga tidak ada
  let emblemPenggalang = '';
  if (!isSiaga) {
    emblemPenggalang = isPerempuan ? '1 pcs Emblem Topi Boni' : '1 pcs Emblem Baret';
  }

  const ringKacu = isSiaga ? '1 pcs Ring Kacu Siaga' : '1 pcs Ring Kacu Penggalang';

  const pramuka: QCSectionItem[] = [
    {
      id: 'baju-pp',
      label: bajuPPLabel,
    },
    {
      id: 'bawahan-pp',
      label: bawahanPPLabel,
    },
    {
      id: 'topi-pramuka',
      label: penutupKepalaPramuka,
    },
  ];

  // Jika Penggalang, tambahkan Emblem
  if (!isSiaga && emblemPenggalang) {
    pramuka.push({
      id: 'emblem-pramuka',
      label: emblemPenggalang,
    });
  }

  pramuka.push(
    {
      id: 'kacu-pramuka',
      label: '1 pcs Kacu Pramuka',
    },
    {
      id: 'ring-kacu',
      label: ringKacu,
    },
    {
      id: 'sabuk-pramuka',
      label: '1 pcs Ikat Pinggang Pramuka',
    }
  );

  // ----------------------------------------------------
  // 3. PERLENGKAPAN SEKOLAH & ATK (OPSI 3B)
  // Kuantitas di awal: 1 pasang Sepatu, 1 pasang Kaos Kaki,
  // 2 pcs Pensil, 2 pcs Pulpen, lainnya 1 pcs.
  // ----------------------------------------------------
  const sepatuLabel = student.sepatu 
    ? `1 pasang Sepatu - Uk. ${student.sepatu}` 
    : '1 pasang Sepatu Sekolah';

  const atk: QCSectionItem[] = [
    {
      id: 'sepatu',
      label: sepatuLabel,
    },
    {
      id: 'kaos-kaki',
      label: '1 pasang Kaos Kaki',
    },
    {
      id: 'tas-sekolah',
      label: '1 pcs Tas Sekolah',
    },
    {
      id: 'buku',
      label: '1 pcs Buku Tulis',
    },
    {
      id: 'tumbler',
      label: '1 pcs Tumbler Minum',
    },
    {
      id: 'tempat-pensil',
      label: '1 pcs Tempat Pensil',
    },
    {
      id: 'pensil',
      label: '2 pcs Pensil',
    },
    {
      id: 'pulpen',
      label: '2 pcs Pulpen',
    },
    {
      id: 'penghapus',
      label: '1 pcs Penghapus',
    },
    {
      id: 'rautan',
      label: '1 pcs Rautan',
    },
    {
      id: 'penggaris',
      label: '1 pcs Penggaris',
    },
  ];

  return { nasional, pramuka, atk };
}

/**
 * Extracts a short, meaningful prefix from a Unit Operasi/Regional string.
 * e.g. "Regional 3/Zona 10/ PHKT DOBS" -> "DOBS"
 *      "Regional 4/Zona 11/ PHKT Limau Field" -> "LIMAF"
 *      "Regional 2/ PHE BSB" -> "BSB"
 */
export function extractRegionalCode(regional: string): string {
  if (!regional) return '';
  const upper = regional.toUpperCase();

  // Try to find keyword PHKT or PHE, then take all words after it
  const phktMatch = upper.match(/PHKT\s+(.+)$/);
  const pheMatch = upper.match(/PHE\s+(.+)$/);
  const match = phktMatch || pheMatch;
  if (match) {
    // Join all words after the keyword, remove non-alphanumeric, take first 5 chars
    const afterKeyword = match[1].replace(/[^A-Z0-9]/g, '');
    return afterKeyword.slice(0, 5);
  }

  // Fallback: take last word/segment separated by "/" or space
  const segments = upper.split(/[\/\s]+/).filter(s => s.length > 1 && !/^\d+$/.test(s));
  if (segments.length > 0) {
    return segments[segments.length - 1].replace(/[^A-Z0-9]/g, '').slice(0, 5);
  }
  return '';
}

/**
 * Creates a clean alphanumeric student code based on Unit Operasi / Regional.
 * e.g. regional="Regional 3/Zona 10/ PHKT DOBS", index=0 -> "DOBS-001"
 *      regional="Regional 4/Zona 11/ PHKT Limau Field", index=0 -> "LIMAF-001"
 * Falls back to school name prefix if regional is empty.
 */
export function generateStudentCode(regional: string, schoolName: string, index: number): string {
  const numStr = String(index + 1).padStart(3, '0');
  const regionalCode = extractRegionalCode(regional);
  if (regionalCode) {
    return `${regionalCode}-${numStr}`;
  }
  // Fallback: strip common school prefixes (SD, SMP, SDN, SMPN) and use remaining
  const cleanedSchool = schoolName
    .toUpperCase()
    .replace(/\b(SDN?|SMPN?|NEGERI|MADRASAH|MTS)\b/g, '')
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 5);
  const prefix = cleanedSchool || 'QC';
  return `${prefix}-${numStr}`;
}

// ----------------------------------------------------------------
// VALIDATION
// ----------------------------------------------------------------

export interface ValidationIssue {
  rowIndex: number;
  studentName: string;
  field: string;
  fieldKey: string;
  value: string;
  reason: string;
}

/**
 * Validates parsed students against expected data formats.
 * Returns a list of issues found (empty array = all valid).
 */
export function validateStudents(students: StudentData[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  const isValidSize = (v: string) => /^\d{1,3}$/.test(v.trim()) && parseInt(v) >= 4 && parseInt(v) <= 60;
  const isValidShoeSize = (v: string) => /^\d{2,3}$/.test(v.trim()) && parseInt(v) >= 20 && parseInt(v) <= 50;
  const isValidLengan = (v: string) => /^(panjang|pendek)$/i.test(v.trim());
  const isValidRokCelana = (v: string) => /^(rok|celana)$/i.test(v.trim());
  const isValidPramuka = (v: string) => /^(siaga|penggalang)$/i.test(v.trim());

  students.forEach((s, i) => {
    const add = (field: string, fieldKey: string, value: string, reason: string) => {
      issues.push({ rowIndex: i, studentName: s.nama || `Baris ${i + 1}`, field, fieldKey, value, reason });
    };

    if (s.ukBajuMP && !isValidSize(s.ukBajuMP))
      add('Ukuran Baju MP', 'ukBajuMP', s.ukBajuMP, 'Harus berupa angka (mis: 9, 10, 12)');
    if (s.pjgBajuMP && !isValidLengan(s.pjgBajuMP))
      add('Lengan Baju MP', 'pjgBajuMP', s.pjgBajuMP, 'Harus "Panjang" atau "Pendek"');
    if (s.ukBawahanMP && !isValidSize(s.ukBawahanMP))
      add('Ukuran Bawahan MP', 'ukBawahanMP', s.ukBawahanMP, 'Harus berupa angka (mis: 10, 11, 12)');
    if (s.pjgBawahanMP && !isValidLengan(s.pjgBawahanMP))
      add('Panjang Bawahan MP', 'pjgBawahanMP', s.pjgBawahanMP, 'Harus "Panjang" atau "Pendek"');
    if (s.rokCelanaMP && !isValidRokCelana(s.rokCelanaMP))
      add('Jenis Bawahan MP', 'rokCelanaMP', s.rokCelanaMP, 'Harus "Rok" atau "Celana"');
    if (s.siagaPenggalang && !isValidPramuka(s.siagaPenggalang))
      add('Siaga/Penggalang', 'siagaPenggalang', s.siagaPenggalang, 'Harus "Siaga" atau "Penggalang"');
    if (s.ukBajuPP && !isValidSize(s.ukBajuPP))
      add('Ukuran Baju PP', 'ukBajuPP', s.ukBajuPP, 'Harus berupa angka (mis: 9, 10, 12)');
    if (s.pjgBajuPP && !isValidLengan(s.pjgBajuPP))
      add('Lengan Baju PP', 'pjgBajuPP', s.pjgBajuPP, 'Harus "Panjang" atau "Pendek"');
    if (s.ukBawahanPP && !isValidSize(s.ukBawahanPP))
      add('Ukuran Bawahan PP', 'ukBawahanPP', s.ukBawahanPP, 'Harus berupa angka (mis: 10, 11, 12)');
    if (s.pjgBawahanPP && !isValidLengan(s.pjgBawahanPP))
      add('Panjang Bawahan PP', 'pjgBawahanPP', s.pjgBawahanPP, 'Harus "Panjang" atau "Pendek"');
    if (s.rokCelanaPP && !isValidRokCelana(s.rokCelanaPP))
      add('Jenis Bawahan PP', 'rokCelanaPP', s.rokCelanaPP, 'Harus "Rok" atau "Celana"');
    if (s.sepatu && !isValidShoeSize(s.sepatu))
      add('Ukuran Sepatu', 'sepatu', s.sepatu, 'Harus 2-3 digit angka (mis: 32, 38, 40)');
  });

  return issues;
}


export type HeaderOption = 'auto' | 'has-header' | 'no-header';

export interface ParseExcelResult {
  students: StudentData[];
  detectedHeader: boolean;
  headerMode: HeaderOption;
  rawLineCount: number;
  parsedStudentCount: number;
  headersFound: string[];
}

/**
 * Intelligent and flexible parser for pasting Excel TSV or CSV data.
 * Supports auto-detection of headers, explicit with-header, or explicit no-header.
 * Fixes column disambiguation between 'Nama' and 'Nama Sekolah'.
 */
export function parseExcelPaste(
  rawText: string,
  headerOption: HeaderOption = 'auto'
): StudentData[] {
  return parseExcelPasteDetailed(rawText, headerOption).students;
}

export function parseExcelPasteDetailed(
  rawText: string,
  headerOption: HeaderOption = 'auto'
): ParseExcelResult {
  if (!rawText || !rawText.trim()) {
    return {
      students: [],
      detectedHeader: false,
      headerMode: headerOption,
      rawLineCount: 0,
      parsedStudentCount: 0,
      headersFound: [],
    };
  }

  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  if (lines.length === 0) {
    return {
      students: [],
      detectedHeader: false,
      headerMode: headerOption,
      rawLineCount: 0,
      parsedStudentCount: 0,
      headersFound: [],
    };
  }

  // Determine separator (tab, comma, or semicolon)
  const firstLine = lines[0];
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;

  let separator = '\t';
  if (tabCount >= 1) {
    separator = '\t';
  } else if (semiCount > commaCount && semiCount >= 1) {
    separator = ';';
  } else if (commaCount >= 1) {
    separator = ',';
  }

  // Parse lines into clean cell tokens
  const rows = lines.map(line => {
    if (separator === '\t') {
      return line.split('\t').map(c => c.trim().replace(/^"(.*)"$/, '$1'));
    }
    return line.split(separator).map(c => c.trim().replace(/^"(.*)"$/, '$1'));
  });

  // Known keywords for header detection
  const isHeaderKeyword = (token: string): boolean => {
    const t = token.toLowerCase().trim();
    if (!t) return false;
    return (
      t === 'no' || t === 'no.' || t === 'nomor' || t === '#' || t === 'num' ||
      t === 'nama' || t === 'nama siswa' || t === 'nama murid' || t === 'nama lengkap' ||
      t === 'nama peserta' || t === 'nama peserta didik' || t === 'nama anak' ||
      t === 'nama sekolah' || t === 'sekolah' || t === 'nama madrasah' || t === 'madrasah' ||
      t === 'jenjang' || t === 'jenjang sekolah' || t === 'tingkat' ||
      t === 'jenis kelamin' || t === 'gender' || t === 'jk' || t === 'l/p' || t === 'sex' ||
      t === 'kelas' || t === 'kls' || t === 'grade' || t === 'class' ||
      t.includes('ukuran baju') || t.includes('baju panjang') || t.includes('uk baju') ||
      t.includes('rok/celana') || t.includes('bawahan') || t.includes('jenis bawahan') ||
      t.includes('siaga') || t.includes('penggalang') || t.includes('pramuka') ||
      t.includes('unit operasi') || t.includes('regional') || t.includes('zona') || t.includes('wilayah') ||
      t === 'sepatu' || t.includes('ukuran sepatu') || t.includes('seragam nasional') ||
      t.includes('seragam pramuka') || t.includes('perlengkapan') || t.includes('atk') ||
      t.includes('panjang/pendek') || t.includes('pjg/pdk')
    );
  };

  // Check if a row looks like a table header or title row
  const isHeaderOrTitleRow = (rowTokens: string[]): boolean => {
    const cleanTokens = rowTokens.map(c => c.trim()).filter(c => c.length > 0);
    if (cleanTokens.length === 0) return true;

    // Check if it has a title keyword (e.g. "DAFTAR", "REKAPITULASI", "CHECKLIST", "LAPORAN")
    const titleRegex = /^(daftar|rekapitulasi|rekap|laporan|data siswa|checklist|tabel|form|surat)/i;
    if (cleanTokens.length <= 3 && cleanTokens.some(t => titleRegex.test(t))) {
      return true;
    }

    // Count how many cells match header keywords
    const headerMatches = cleanTokens.filter(t => isHeaderKeyword(t)).length;
    const matchRatio = headerMatches / cleanTokens.length;

    // If more than 30% of cells or at least 2 cells match known header keywords
    if (headerMatches >= 2 || (cleanTokens.length === 1 && headerMatches === 1)) {
      return true;
    }
    if (cleanTokens.length > 3 && matchRatio >= 0.3) {
      return true;
    }

    return false;
  };

  // Partition rows into header rows and data rows
  let headerRows: string[][] = [];
  let dataRows: string[][] = [];

  if (headerOption === 'no-header') {
    // Explicitly no headers: all non-empty rows are treated as data
    dataRows = rows.filter(r => r.some(c => c.trim().length > 0));
  } else if (headerOption === 'has-header') {
    // Explicitly has headers: first row (and any subsequent consecutive header rows) are headers
    let inHeader = true;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (inHeader) {
        if (i === 0 || isHeaderOrTitleRow(row)) {
          headerRows.push(row);
        } else {
          inHeader = false;
          if (row.some(c => c.trim().length > 0)) dataRows.push(row);
        }
      } else {
        if (row.some(c => c.trim().length > 0)) dataRows.push(row);
      }
    }
  } else {
    // 'auto' mode: intelligently find header rows at the top
    let inHeader = true;
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      if (inHeader && i < 4 && isHeaderOrTitleRow(row)) {
        headerRows.push(row);
      } else {
        inHeader = false;
        if (row.some(c => c.trim().length > 0)) {
          dataRows.push(row);
        }
      }
    }

    // Safety check: if all rows were classified as headers, treat rows from 1 onwards as data
    if (dataRows.length === 0 && rows.length > 1) {
      headerRows = [rows[0]];
      dataRows = rows.slice(1).filter(r => r.some(c => c.trim().length > 0));
    }
  }

  const hasHeader = headerRows.length > 0;

  // Flatten and combine tokens from header rows to build comprehensive column headers
  const maxCols = Math.max(...rows.map(r => r.length), 0);
  const combinedHeaderTokens: string[] = [];
  for (let col = 0; col < maxCols; col++) {
    const colWords: string[] = [];
    for (const hRow of headerRows) {
      if (hRow[col] && hRow[col].trim()) {
        colWords.push(hRow[col].toLowerCase().trim());
      }
    }
    combinedHeaderTokens.push(colWords.join(' '));
  }

  // Column index variables
  let colNama = -1;
  let colSekolah = -1;
  let colJenjang = -1;
  let colRegional = -1;
  let colNo = -1;
  let colGender = -1;
  let colKelas = -1;
  let colUkBajuMP = -1;
  let colPjgBajuMP = -1;
  let colUkBawahanMP = -1;
  let colPjgBawahanMP = -1;
  let colRokCelanaMP = -1;
  let colSiaga = -1;
  let colUkBajuPP = -1;
  let colPjgBajuPP = -1;
  let colUkBawahanPP = -1;
  let colPjgBawahanPP = -1;
  let colRokCelanaPP = -1;
  let colSepatu = -1;

  if (hasHeader) {
    // 1. colSekolah: School name (must match sekolah/madrasah/school)
    colSekolah = combinedHeaderTokens.findIndex(h =>
      h.includes('nama sekolah') || h.includes('nama madrasah') || h.includes('asal sekolah') ||
      h === 'sekolah' || h === 'madrasah' || h === 'school' || h.includes('nama instansi') ||
      h.includes('unit sekolah')
    );

    // 2. colNama: Student Name (CRITICAL: MUST NOT match school or instansi or regional!)
    // First try exact matches
    const exactStudentTokens = [
      'nama siswa', 'nama murid', 'nama lengkap', 'nama peserta', 'nama peserta didik',
      'nama anak', 'nama penerima', 'nama calon siswa', 'student name', 'siswa', 'murid',
      'nama siswa/i', 'nama siswa / siswi'
    ];
    colNama = combinedHeaderTokens.findIndex(h => exactStudentTokens.includes(h));

    // If still not found, search for 'nama' that explicitly does NOT contain school/instansi
    if (colNama === -1) {
      colNama = combinedHeaderTokens.findIndex((h, idx) => {
        if (idx === colSekolah) return false;
        const hasName = h === 'nama' || h.startsWith('nama ') || h.endsWith(' nama') || h.includes('nama');
        const isNotSchool = !h.includes('sekolah') && !h.includes('madrasah') && !h.includes('school') &&
                            !h.includes('instansi') && !h.includes('lembaga') && !h.includes('petugas') &&
                            !h.includes('pemesan') && !h.includes('qc') && !h.includes('pt');
        return hasName && isNotSchool;
      });
    }

    // 3. colRegional: Unit Operasi / Regional / Zona
    colRegional = combinedHeaderTokens.findIndex(h =>
      h.includes('unit operasi') || h.includes('regional') || h.includes('zona') ||
      h.includes('wilayah') || h.includes('area') || h.includes('cabang')
    );

    // 4. colNo: Nomor / No / #
    colNo = combinedHeaderTokens.findIndex(h =>
      h === 'no' || h === 'no.' || h === 'nomor' || h === '#' || h === 'num' || h === 'no urut'
    );

    // 5. colJenjang: Jenjang / Tingkat (SD/SMP)
    colJenjang = combinedHeaderTokens.findIndex(h =>
      h.includes('jenjang') || h.includes('tingkat sekolah') || (h.includes('tingkat') && !h.includes('kelas'))
    );

    // 6. colGender: Jenis Kelamin / Gender / JK / L/P
    colGender = combinedHeaderTokens.findIndex(h =>
      h.includes('jenis kelamin') || h.includes('gender') || h === 'jk' || h === 'l/p' || h === 'sex'
    );

    // 7. colKelas: Kelas / Grade / Class
    colKelas = combinedHeaderTokens.findIndex(h =>
      h === 'kelas' || h.includes('tingkat kelas') || h === 'kls' || h === 'grade' || h === 'class'
    );

    // 8. Uniform National (MP)
    colUkBajuMP = combinedHeaderTokens.findIndex(h =>
      (h.includes('ukuran baju') || h.includes('uk baju') || (h.includes('ukuran') && h.includes('baju'))) &&
      (h.includes('mp') || !h.includes('pp'))
    );
    colPjgBajuMP = combinedHeaderTokens.findIndex(h =>
      (h.includes('panjang/pendek') || h.includes('pjg/pdk') || h.includes('lengan')) &&
      h.includes('baju') &&
      (h.includes('mp') || !h.includes('pp'))
    );
    colUkBawahanMP = combinedHeaderTokens.findIndex(h =>
      (h.includes('ukuran') || h.includes('uk')) &&
      (h.includes('rok') || h.includes('celana') || h.includes('bawahan')) &&
      (h.includes('mp') || !h.includes('pp'))
    );
    colPjgBawahanMP = combinedHeaderTokens.findIndex(h =>
      (h.includes('panjang') || h.includes('pendek') || h.includes('pjg')) &&
      (h.includes('rok') || h.includes('celana') || h.includes('bawahan')) &&
      (h.includes('mp') || !h.includes('pp'))
    );
    colRokCelanaMP = combinedHeaderTokens.findIndex(h =>
      (h.includes('rok/celana') || h.includes('rok / celana') || h.includes('jenis bawahan')) &&
      (h.includes('mp') || !h.includes('pp'))
    );

    // 9. Pramuka (PP)
    colSiaga = combinedHeaderTokens.findIndex(h =>
      h.includes('siaga') || h.includes('penggalang') || (h.includes('pramuka') && !h.includes('baju') && !h.includes('celana'))
    );
    colUkBajuPP = combinedHeaderTokens.findIndex(h =>
      (h.includes('ukuran') || h.includes('uk')) &&
      h.includes('baju') &&
      (h.includes('pp') || h.includes('pramuka'))
    );
    colPjgBajuPP = combinedHeaderTokens.findIndex(h =>
      (h.includes('panjang') || h.includes('pendek') || h.includes('pjg') || h.includes('lengan')) &&
      (h.includes('pp') || h.includes('pramuka'))
    );
    colUkBawahanPP = combinedHeaderTokens.findIndex(h =>
      (h.includes('ukuran') || h.includes('uk')) &&
      (h.includes('rok') || h.includes('celana') || h.includes('bawahan')) &&
      (h.includes('pp') || h.includes('pramuka'))
    );
    colPjgBawahanPP = combinedHeaderTokens.findIndex(h =>
      (h.includes('panjang') || h.includes('pendek') || h.includes('pjg')) &&
      (h.includes('rok') || h.includes('celana') || h.includes('bawahan')) &&
      (h.includes('pp') || h.includes('pramuka'))
    );
    colRokCelanaPP = combinedHeaderTokens.findIndex(h =>
      (h.includes('rok/celana') || h.includes('rok / celana')) &&
      (h.includes('pp') || h.includes('pramuka'))
    );

    // 10. Sepatu
    colSepatu = combinedHeaderTokens.findIndex(h =>
      h.includes('sepatu') || h.includes('shoe')
    );
  }

  // ------------------------------------------------------------------------
  // CONTENT-BASED PROFILING: When headers are missing or columns unmapped
  // ------------------------------------------------------------------------
  if (dataRows.length > 0 && (colNama === -1 || colSekolah === -1 || colGender === -1 || colKelas === -1)) {
    const colCount = Math.max(...dataRows.map(r => r.length), 0);

    // Profile each column based on actual data
    const columnProfiles: {
      index: number;
      schoolScore: number;
      nameScore: number;
      regionalScore: number;
      jenjangScore: number;
      genderScore: number;
      classScore: number;
      shoeScore: number;
      numericScore: number;
    }[] = [];

    for (let c = 0; c < colCount; c++) {
      let schoolScore = 0;
      let nameScore = 0;
      let regionalScore = 0;
      let jenjangScore = 0;
      let genderScore = 0;
      let classScore = 0;
      let shoeScore = 0;
      let numericScore = 0;

      for (const row of dataRows) {
        const val = (row[c] || '').trim();
        if (!val) continue;

        const valUpper = val.toUpperCase();

        if (/^\d+$/.test(val)) {
          numericScore++;
          const num = parseInt(val, 10);
          if (num >= 1 && num <= 12) classScore++;
          if (num >= 28 && num <= 45) shoeScore++;
        }

        if (
          valUpper === 'L' || valUpper === 'P' || valUpper === 'LAKI-LAKI' ||
          valUpper === 'PEREMPUAN' || valUpper === 'PUTRA' || valUpper === 'PUTRI'
        ) {
          genderScore++;
        }

        if (valUpper === 'SD' || valUpper === 'SMP' || valUpper === 'MTS' || valUpper === 'SMA' || valUpper === 'SMK') {
          jenjangScore++;
        }

        if (
          valUpper.includes('REGIONAL') || valUpper.includes('ZONA') ||
          valUpper.includes('PHKT') || valUpper.includes('WILAYAH')
        ) {
          regionalScore++;
        }

        if (
          valUpper.includes('SMP ') || valUpper.includes('SDN ') || valUpper.includes('SD ') ||
          valUpper.includes('MTS ') || valUpper.includes('SEKOLAH') || valUpper.includes('MADRASAH')
        ) {
          schoolScore++;
        }

        // Student name heuristic: 2 or more capitalized words, letters and spaces, not school keyword
        if (
          /^[A-Za-z\s.'`-]+$/.test(val) &&
          val.length >= 3 &&
          !valUpper.includes('SMP') && !valUpper.includes('SD') &&
          !valUpper.includes('MTS') && !valUpper.includes('REGIONAL') &&
          !valUpper.includes('ZONA') && valUpper !== 'L' && valUpper !== 'P' &&
          valUpper !== 'PANJANG' && valUpper !== 'PENDEK' &&
          valUpper !== 'ROK' && valUpper !== 'CELANA' &&
          valUpper !== 'SIAGA' && valUpper !== 'PENGGALANG'
        ) {
          nameScore++;
        }
      }

      columnProfiles.push({
        index: c,
        schoolScore,
        nameScore,
        regionalScore,
        jenjangScore,
        genderScore,
        classScore,
        shoeScore,
        numericScore,
      });
    }

    // Assign unmapped columns based on highest scoring columns
    if (colSekolah === -1) {
      const bestSchool = [...columnProfiles].sort((a, b) => b.schoolScore - a.schoolScore)[0];
      if (bestSchool && bestSchool.schoolScore > 0) colSekolah = bestSchool.index;
    }

    if (colRegional === -1) {
      const bestReg = [...columnProfiles].sort((a, b) => b.regionalScore - a.regionalScore)[0];
      if (bestReg && bestReg.regionalScore > 0) colRegional = bestReg.index;
    }

    if (colGender === -1) {
      const bestGender = [...columnProfiles].sort((a, b) => b.genderScore - a.genderScore)[0];
      if (bestGender && bestGender.genderScore > 0) colGender = bestGender.index;
    }

    if (colJenjang === -1) {
      const bestJenjang = [...columnProfiles].sort((a, b) => b.jenjangScore - a.jenjangScore)[0];
      if (bestJenjang && bestJenjang.jenjangScore > 0) colJenjang = bestJenjang.index;
    }

    if (colNama === -1) {
      // Best name candidate that is NOT already assigned to school or regional
      const availableForName = columnProfiles.filter(p => p.index !== colSekolah && p.index !== colRegional);
      const bestName = availableForName.sort((a, b) => b.nameScore - a.nameScore)[0];
      if (bestName && bestName.nameScore > 0) colNama = bestName.index;
    }
  }

  // Final fallback mapping for standard 19-column layout if still -1
  // Layout: 0:Regional, 1:No, 2:Sekolah, 3:Jenjang, 4:Nama, 5:Gender, 6:Kelas
  if (colRegional === -1) colRegional = 0;
  if (colNo === -1) colNo = 1;
  if (colSekolah === -1) colSekolah = 2;
  if (colJenjang === -1) colJenjang = 3;
  if (colNama === -1) colNama = 4;
  if (colGender === -1) colGender = 5;
  if (colKelas === -1) colKelas = 6;

  // ------------------------------------------------------------------------
  // PROCESS EACH DATA ROW TO PRODUCE STUDENTS (NEVER DROP A ROW)
  // ------------------------------------------------------------------------
  const parsedStudents: StudentData[] = [];
  let lastRegional = 'Regional 3/Zona 10/ PHKT DOBS';
  let lastSekolah = 'SMP 5 Penajam';
  let lastJenjang = 'SMP';

  dataRows.forEach((row, idx) => {
    // Skip empty lines
    if (row.every(c => !c || c.trim() === '')) return;

    // Helper to safely get cell by index
    const getCell = (colIdx: number): string => {
      if (colIdx >= 0 && row[colIdx] !== undefined && row[colIdx].trim() !== '') {
        return row[colIdx].trim();
      }
      return '';
    };

    // 1. School name
    let namaSekolah = getCell(colSekolah);
    if (!namaSekolah) {
      namaSekolah = lastSekolah;
    } else {
      lastSekolah = namaSekolah;
    }

    // 2. Student Name (with smart anti-school protection)
    let nama = getCell(colNama);

    // If name is identical to school name or empty, find another valid text cell in this row
    if (!nama || nama.toLowerCase() === namaSekolah.toLowerCase()) {
      for (let i = 0; i < row.length; i++) {
        if (i === colSekolah || i === colRegional || i === colJenjang || i === colGender || i === colKelas) continue;
        const cell = (row[i] || '').trim();
        if (
          cell &&
          cell.toLowerCase() !== namaSekolah.toLowerCase() &&
          !/^\d+$/.test(cell) &&
          !cell.toLowerCase().includes('regional') &&
          !cell.toLowerCase().includes('zona') &&
          cell.length >= 2
        ) {
          nama = cell;
          break;
        }
      }
    }

    // Absolute fallback: name should NEVER be empty so row is never lost
    if (!nama) {
      nama = `Siswa #${idx + 1}`;
    }

    // 3. Regional
    let regional = getCell(colRegional);
    if (!regional || /^\d+$/.test(regional)) {
      regional = lastRegional;
    } else {
      lastRegional = regional;
    }

    // 4. Jenjang (SD or SMP)
    let jenjang = getCell(colJenjang).toUpperCase();
    if (!jenjang) {
      if (namaSekolah.toUpperCase().includes('SMP') || namaSekolah.toUpperCase().includes('MTS')) {
        jenjang = 'SMP';
      } else if (namaSekolah.toUpperCase().includes('SD')) {
        jenjang = 'SD';
      } else {
        jenjang = lastJenjang;
      }
    } else {
      jenjang = (jenjang.includes('SMP') || jenjang.includes('MTS')) ? 'SMP' : 'SD';
      lastJenjang = jenjang;
    }

    // 5. Gender (L / P)
    const rawGender = getCell(colGender).toUpperCase();
    const gender = (rawGender.startsWith('P') || rawGender.includes('PUTRI') || rawGender.includes('FEMALE')) ? 'P' : 'L';

    // 6. Nomor urut
    let noStr = getCell(colNo);
    let noVal = parseInt(noStr, 10);
    if (isNaN(noVal)) {
      noVal = parsedStudents.length + 1;
    }

    // 7. Kelas
    let kelas = getCell(colKelas);
    if (!kelas || !/^\d+$/.test(kelas)) {
      kelas = jenjang === 'SMP' ? '7' : '1';
    }

    // 8. Uniform National (MP)
    const ukBajuMP = getCell(colUkBajuMP) || (colUkBajuMP >= 0 ? '9' : (row[7] || '9'));
    const pjgBajuMP = getCell(colPjgBajuMP) || (colPjgBajuMP >= 0 ? 'Panjang' : (row[8] || 'Panjang'));
    const ukBawahanMP = getCell(colUkBawahanMP) || (colUkBawahanMP >= 0 ? '10' : (row[9] || '10'));
    const pjgBawahanMP = getCell(colPjgBawahanMP) || (colPjgBawahanMP >= 0 ? 'Panjang' : (row[10] || 'Panjang'));
    const rokCelanaMP = getCell(colRokCelanaMP) || (colRokCelanaMP >= 0 ? (gender === 'P' ? 'Rok' : 'Celana') : (row[11] || (gender === 'P' ? 'Rok' : 'Celana')));

    // 9. Pramuka (PP)
    let siagaPenggalang = getCell(colSiaga);
    if (!siagaPenggalang) {
      const kelasNum = parseInt(kelas, 10);
      if (jenjang === 'SMP' || (!isNaN(kelasNum) && kelasNum >= 5)) {
        siagaPenggalang = 'Penggalang';
      } else {
        siagaPenggalang = 'Siaga';
      }
    }

    const ukBajuPP = getCell(colUkBajuPP) || (colUkBajuPP >= 0 ? ukBajuMP : (row[13] || ukBajuMP));
    const pjgBajuPP = getCell(colPjgBajuPP) || (colPjgBajuPP >= 0 ? pjgBajuMP : (row[14] || pjgBajuMP));
    const ukBawahanPP = getCell(colUkBawahanPP) || (colUkBawahanPP >= 0 ? ukBawahanMP : (row[15] || ukBawahanMP));
    const pjgBawahanPP = getCell(colPjgBawahanPP) || (colPjgBawahanPP >= 0 ? pjgBawahanMP : (row[16] || pjgBawahanMP));
    const rokCelanaPP = getCell(colRokCelanaPP) || (colRokCelanaPP >= 0 ? rokCelanaMP : (row[17] || rokCelanaMP));

    // 10. Sepatu
    const sepatu = getCell(colSepatu) || (colSepatu >= 0 ? (jenjang === 'SMP' ? '39' : '33') : (row[18] || (jenjang === 'SMP' ? '39' : '33')));

    const code = generateStudentCode(regional, namaSekolah, noVal - 1 >= 0 ? noVal - 1 : idx);

    parsedStudents.push({
      id: `std-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`,
      code,
      regional,
      no: noVal,
      namaSekolah,
      jenjang,
      nama,
      jenisKelamin: gender,
      kelas,
      ukBajuMP,
      pjgBajuMP,
      ukBawahanMP,
      pjgBawahanMP,
      rokCelanaMP,
      siagaPenggalang,
      ukBajuPP,
      pjgBajuPP,
      ukBawahanPP,
      pjgBawahanPP,
      rokCelanaPP,
      sepatu,
    });
  });

  return {
    students: parsedStudents,
    detectedHeader: hasHeader,
    headerMode: headerOption,
    rawLineCount: lines.length,
    parsedStudentCount: parsedStudents.length,
    headersFound: hasHeader && headerRows.length > 0 ? headerRows[0] : [],
  };
}

export interface RegionStat {
  name: string;
  count: number;
  schools: string[];
}

/**
 * Groups students by their Unit Operasi/Regional and calculates counts and unique schools.
 */
export function getRegionStats(students: StudentData[]): RegionStat[] {
  const map = new Map<string, { count: number; schools: Set<string> }>();
  students.forEach(s => {
    const reg = (s.regional || 'Tanpa Region').trim();
    if (!map.has(reg)) {
      map.set(reg, { count: 0, schools: new Set() });
    }
    const entry = map.get(reg)!;
    entry.count += 1;
    if (s.namaSekolah) entry.schools.add(s.namaSekolah.trim());
  });

  return Array.from(map.entries())
    .map(([name, data]) => ({
      name,
      count: data.count,
      schools: Array.from(data.schools),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * 8 Realistic Sample Students matching both SD & SMP, Boys & Girls, Siaga & Penggalang.
 */
export const SAMPLE_STUDENTS: StudentData[] = [
  {
    id: 'smp5-001',
    code: 'SMP5-001',
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
    id: 'smp5-002',
    code: 'SMP5-002',
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
    id: 'sd01-003',
    code: 'SD01-003',
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
    id: 'sd01-004',
    code: 'SD01-004',
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
    id: 'sd02-005',
    code: 'SD02-005',
    regional: 'Regional 3/Zona 10/ PHKT DOBS',
    no: 5,
    namaSekolah: 'SDN 002 Penajam',
    jenjang: 'SD',
    nama: 'Bagas Aditya',
    jenisKelamin: 'L',
    kelas: '5',
    ukBajuMP: '8',
    pjgBajuMP: 'Pendek',
    ukBawahanMP: '8',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Celana',
    siagaPenggalang: 'Penggalang',
    ukBajuPP: '8',
    pjgBajuPP: 'Panjang',
    ukBawahanPP: '8',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Celana',
    sepatu: '35',
  },
  {
    id: 'sd02-006',
    code: 'SD02-006',
    regional: 'Regional 3/Zona 10/ PHKT DOBS',
    no: 6,
    namaSekolah: 'SDN 002 Penajam',
    jenjang: 'SD',
    nama: 'Nabila Syahrani',
    jenisKelamin: 'P',
    kelas: '5',
    ukBajuMP: '8',
    pjgBajuMP: 'Panjang',
    ukBawahanMP: '9',
    pjgBawahanMP: 'Panjang',
    rokCelanaMP: 'Rok',
    siagaPenggalang: 'Penggalang',
    ukBajuPP: '8',
    pjgBajuPP: 'Panjang',
    ukBawahanPP: '9',
    pjgBawahanPP: 'Panjang',
    rokCelanaPP: 'Rok',
    sepatu: '36',
  },
  {
    id: 'smp2-007',
    code: 'SMP2-007',
    regional: 'Regional 4/Zona 11/ PHKT BSB',
    no: 7,
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
    id: 'smp2-008',
    code: 'SMP2-008',
    regional: 'Regional 4/Zona 11/ PHKT BSB',
    no: 8,
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
  },
];

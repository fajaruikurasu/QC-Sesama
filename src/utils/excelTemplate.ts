import * as XLSX from 'xlsx';

export const EXCEL_TEMPLATE_COLUMNS = [
  'Unit Operasi/ Regional',
  'No',
  'Nama Sekolah',
  'Jenjang Sekolah',
  'Nama',
  'Jenis Kelamin',
  'Kelas',
  'Ukuran Baju (MP)',
  'Baju Panjang/Pendek (MP)',
  'Ukuran Rok/Celana(MP)',
  'Rok/Panjang/Pendek (MP)',
  'Rok/Celana(MP)',
  'Siaga/ Penggalang',
  'Ukuran Baju (PP)',
  'Baju Panjang/Pendek (PP)',
  'Ukuran Rok/Celana (PP)',
  'Rok/CelanaPanjang/Pendek (PP)',
  'Rok/Celana(PP)',
  'Sepatu',
];

export const SAMPLE_TEMPLATE_ROWS = [
  [
    'Regional 3/Zona 10/ PHKT DOBS',
    1,
    'SMP 5 Penajam',
    'SMP',
    'Citra Aprilia Putri',
    'P',
    '7',
    '9',
    'Panjang',
    '10',
    'Panjang',
    'Rok',
    'Penggalang',
    '9',
    'Panjang',
    '10',
    'Panjang',
    'Rok',
    '38',
  ],
  [
    'Regional 3/Zona 10/ PHKT DOBS',
    2,
    'SMP 5 Penajam',
    'SMP',
    'Rizky Pratama Wijaya',
    'L',
    '7',
    '10',
    'Pendek',
    '11',
    'Panjang',
    'Celana',
    'Penggalang',
    '10',
    'Pendek',
    '11',
    'Panjang',
    'Celana',
    '40',
  ],
  [
    'Regional 3/Zona 10/ PHKT DOBS',
    3,
    'SDN 001 Sepaku',
    'SD',
    'Ahmad Fauzi',
    'L',
    '2',
    '7',
    'Pendek',
    '7',
    'Pendek',
    'Celana',
    'Siaga',
    '7',
    'Pendek',
    '7',
    'Pendek',
    'Celana',
    '32',
  ],
  [
    'Regional 4/Zona 11/ PHKT BSB',
    1,
    'SMP 2 Babulu',
    'SMP',
    'Dimas Satria',
    'L',
    '8',
    '11',
    'Pendek',
    '12',
    'Panjang',
    'Celana',
    'Penggalang',
    '11',
    'Pendek',
    '12',
    'Panjang',
    'Celana',
    '41',
  ],
];

export function downloadExcelTemplate(format: 'xlsx' | 'csv' = 'xlsx') {
  const data = [EXCEL_TEMPLATE_COLUMNS, ...SAMPLE_TEMPLATE_ROWS];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Siswa QC');

  if (format === 'csv') {
    XLSX.writeFile(wb, 'Template_Label_Dus_Siswa_Pertamina.csv');
  } else {
    XLSX.writeFile(wb, 'Template_Label_Dus_Siswa_Pertamina.xlsx');
  }
}

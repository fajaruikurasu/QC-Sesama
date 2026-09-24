export type DesignTheme = 'enterprise' | 'operational-qc' | 'eco-modern';

export interface StudentData {
  id: string;
  code: string; // e.g. SMP5-001
  regional: string; // e.g. Regional 3/Zona 10/ PHKT DOBS
  no: number | string;
  namaSekolah: string;
  jenjang: 'SD' | 'SMP' | string;
  nama: string;
  jenisKelamin: 'L' | 'P' | string; // L = Laki-laki / Putra, P = Perempuan / Putri
  kelas: string;
  ukBajuMP: string;
  pjgBajuMP: string; // Panjang / Pendek
  ukBawahanMP: string;
  pjgBawahanMP: string; // Panjang / Pendek
  rokCelanaMP: string; // Rok / Celana
  siagaPenggalang: 'Siaga' | 'Penggalang' | string;
  ukBajuPP: string;
  pjgBajuPP: string; // Panjang / Pendek
  ukBawahanPP: string;
  pjgBawahanPP: string; // Panjang / Pendek
  rokCelanaPP: string; // Rok / Celana
  sepatu: string;
  catatanKhusus?: string;
}

export interface MasterPreset {
  id: string;
  name: string;
  pemesan: string;
  sekolah: string;
  wilayah: string;
}

export interface OrderConfig {
  namaPemesan: string; // e.g. "CSR PHKT DOBS 2026" / "Dinas Pendidikan"
  nomorPO: string; // e.g. "PO-2026-QC-088"
  tanggal: string;
  namaPetugasQC: string;
  themeColor?: string;
  customLogoUrl?: string;
  namaSekolahHeader?: string;
  wilayahAlamat?: string;
  selectedPresetId?: string;
  presets?: MasterPreset[];
  atkMode?: 'grouped' | 'itemized'; // optional backward compatibility
  atkLayout?: 'opsi-a' | 'opsi-b' | 'opsi-c'; // Opsi A, B, C for 2-column ATK
  identityStyle?: 'opsi-1' | 'opsi-2' | 'opsi-3'; // Visual options for student identity
  reworkLayout?: 'opsi-1' | 'opsi-2' | 'opsi-3'; // Opsi 1, 2, 3 for Rework Section Layout
  defectLayout?: 'opsi-1' | 'opsi-2' | 'opsi-3' | 'opsi-4'; // Visual layout options for Defect Codes
  showCutGuides: boolean;
}

export interface QCSectionItem {
  id: string;
  label: string;
  spec?: string;
}

export interface StudentQCItems {
  nasional: QCSectionItem[];
  pramuka: QCSectionItem[];
  atk: QCSectionItem[];
}

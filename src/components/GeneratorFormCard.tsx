import React, { useState, useRef } from 'react';
import { OrderConfig, MasterPreset, StudentData } from '../types';
import { parseExcelPasteDetailed, HeaderOption } from '../utils/studentLogic';
import * as XLSX from 'xlsx';
import {
  Building2,
  Settings,
  Download,
  Table,
  Upload,
  Image,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
  Sparkles
} from 'lucide-react';

interface GeneratorFormCardProps {
  orderConfig: OrderConfig;
  onUpdateConfig: (newConfig: Partial<OrderConfig>) => void;
  onSaveData: (students: StudentData[], append: boolean) => void;
  onOpenPresets: () => void;
  onDownloadTemplate: () => void;
  onOpenColumnOrder: () => void;
}

export const GeneratorFormCard: React.FC<GeneratorFormCardProps> = ({
  orderConfig,
  onUpdateConfig,
  onSaveData,
  onOpenPresets,
  onDownloadTemplate,
  onOpenColumnOrder,
}) => {
  const [pasteContent, setPasteContent] = useState('');
  const [headerOption, setHeaderOption] = useState<HeaderOption>('auto');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  // Logo upload handler (Base64)
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpdateConfig({ customLogoUrl: base64 });
      setSuccessMsg('Logo header berhasil diunggah.');
      setTimeout(() => setSuccessMsg(''), 4000);
    };
    reader.readAsDataURL(file);
  };

  const handleClearLogo = () => {
    onUpdateConfig({ customLogoUrl: '' });
    if (logoInputRef.current) logoInputRef.current.value = '';
    setSuccessMsg('Logo header telah dihapus.');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  // Preset Selection handler
  const handlePresetSelect = (presetId: string) => {
    onUpdateConfig({ selectedPresetId: presetId });
    if (!presetId) return;

    const found = orderConfig.presets?.find((p) => p.id === presetId);
    if (found) {
      onUpdateConfig({
        namaPemesan: found.pemesan,
        namaSekolahHeader: found.sekolah,
        wilayahAlamat: found.wilayah,
      });
      setSuccessMsg(`Preset "${found.name}" diterapkan ke formulir.`);
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  // Process pasted Excel rows
  const handleProcessPaste = () => {
    if (!pasteContent.trim()) {
      setErrorMsg('Area teks paste masih kosong. Salin tabel dari Excel lalu tempelkan di sini.');
      return;
    }

    const res = parseExcelPasteDetailed(pasteContent, headerOption);
    if (res.students.length === 0) {
      setErrorMsg('Tidak dapat menemukan baris data siswa yang valid. Pastikan format tabel sesuai.');
      return;
    }

    onSaveData(res.students, true);
    setPasteContent('');
    setErrorMsg('');
    setSuccessMsg(`Berhasil memproses ${res.students.length} data siswa dari tabel Excel!`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  // Handle direct file upload (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = event.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const tsv = XLSX.utils.sheet_to_csv(sheet, { FS: '\t' });

        const res = parseExcelPasteDetailed(tsv, 'auto');
        if (res.students.length > 0) {
          onSaveData(res.students, true);
          setErrorMsg('');
          setSuccessMsg(`Berhasil membaca file "${file.name}" (${res.students.length} siswa ditambahkan)!`);
          setTimeout(() => setSuccessMsg(''), 5000);
        } else {
          setErrorMsg('File terbaca, namun tidak ada baris data siswa yang sesuai.');
        }
      } catch (err) {
        console.error('File parse error:', err);
        setErrorMsg('Gagal membaca file Excel. Pastikan format file adalah .xlsx atau .csv');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 max-w-5xl mx-auto transition">
      {/* Card Title */}
      <h2 className="text-[#ED1B24] font-bold text-lg border-b border-slate-100 pb-3 mb-5">
        Generator Label Dus Kargo
      </h2>

      {/* Alert Messages */}
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="space-y-4 text-xs">
        {/* ROW 1: Tema Warna, Ganti Logo, Pratinjau Logo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Col 1: Tema Warna Utama */}
          <div className="md:col-span-4">
            <label className="block font-semibold text-slate-700 mb-1">
              Tema Warna Utama (Semua Dus):
            </label>
            <select
              value={orderConfig.themeColor || 'merah'}
              onChange={(e) =>
                onUpdateConfig({
                  themeColor: e.target.value as 'merah' | 'biru' | 'hijau' | 'hitam',
                })
              }
              className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-800 font-medium focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
            >
              <option value="merah">Merah (Default)</option>
              <option value="biru">Biru (Pertamina Blue)</option>
              <option value="hijau">Hijau (Pertamina Green)</option>
              <option value="hitam">Hitam (Monokrom Standar)</option>
            </select>
          </div>

          {/* Col 2: Ganti Logo Header */}
          <div className="md:col-span-5">
            <label className="block font-semibold text-slate-700 mb-1">
              Ganti Logo Header (Opsional):
            </label>
            <input
              ref={logoInputRef}
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200 cursor-pointer border border-slate-300 rounded-lg p-1"
            />
          </div>

          {/* Col 3: Pratinjau Logo & Simpan */}
          <div className="md:col-span-3">
            <label className="block font-semibold text-slate-700 mb-1">
              Pratinjau Logo:
            </label>
            <div className="flex items-center space-x-2">
              <div className="w-14 h-9 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-center p-1 shrink-0 overflow-hidden">
                {orderConfig.customLogoUrl ? (
                  <img
                    src={orderConfig.customLogoUrl}
                    alt="Logo Header"
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <Image className="w-4 h-4 text-slate-300" />
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setSuccessMsg('Pengaturan header tersimpan.');
                  setTimeout(() => setSuccessMsg(''), 2500);
                }}
                className="flex-1 py-2 px-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold flex items-center justify-center gap-1 shadow-xs transition"
                title="Simpan pengaturan logo header"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Header</span>
              </button>
              {orderConfig.customLogoUrl && (
                <button
                  type="button"
                  onClick={handleClearLogo}
                  className="p-2 text-slate-400 hover:text-red-600 rounded-lg border border-slate-200"
                  title="Hapus logo kustom"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ROW 2: Pemesan / Unit Operasi (Master Preset Auto-fill) */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <span>🏢 Pemesan / Unit Operasi (Master Preset Auto-fill):</span>
            </label>
            <button
              type="button"
              onClick={onOpenPresets}
              className="text-[#005BAA] hover:text-[#004080] font-semibold flex items-center gap-1 text-[11px]"
            >
              <Settings className="w-3 h-3" />
              <span>Kelola Master Preset</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
            <div className="md:col-span-5">
              <select
                value={orderConfig.selectedPresetId || ''}
                onChange={(e) => handlePresetSelect(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 font-medium focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
              >
                <option value="">-- Preset Kosong (Klik Kelola untuk Tambah) --</option>
                {orderConfig.presets?.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-7">
              <input
                type="text"
                value={orderConfig.namaPemesan || ''}
                onChange={(e) => onUpdateConfig({ namaPemesan: e.target.value })}
                placeholder="Nama Pemesan / Unit Operasi..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 font-medium focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Pilih preset untuk auto-fill Nama Sekolah / Tujuan & Wilayah di bawah. Semua field tetap dapat diedit manual.
          </p>
        </div>

        {/* ROW 3: Nama Sekolah / Header Utama & Wilayah */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Nama Sekolah / Header Utama (Opsional):
            </label>
            <input
              type="text"
              value={orderConfig.namaSekolahHeader || ''}
              onChange={(e) => onUpdateConfig({ namaSekolahHeader: e.target.value })}
              placeholder="Contoh: SDN NGLANGGERAN / KANTOR PUSAT"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Wilayah / Keterangan Alamat (Opsional):
            </label>
            <input
              type="text"
              value={orderConfig.wilayahAlamat || ''}
              onChange={(e) => onUpdateConfig({ wilayahAlamat: e.target.value })}
              placeholder="Contoh: Kab. Gunung Kidul | Prov. D.I. Yogyakarta"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-800 focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
            />
          </div>
        </div>

        {/* Dashed Divider */}
        <hr className="border-t border-dashed border-slate-200 my-5" />

        {/* ROW 4: Upload File & Paste dari Excel */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Column 1: Upload File Data */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800">
                1. Upload File Data (CSV / Excel):
              </label>
              <button
                type="button"
                onClick={onDownloadTemplate}
                className="text-[#005BAA] hover:underline font-semibold flex items-center gap-1 text-[11px]"
              >
                <Download className="w-3 h-3" />
                <span>Unduh Format Template Excel</span>
              </button>
            </div>
            <div className="border border-slate-300 rounded-lg p-2.5 bg-slate-50/60">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx, .xls, .csv"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-slate-700 file:border file:border-slate-300 hover:file:bg-slate-50 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-2">
                Mendukung spreadsheet .xlsx dari Microsoft Excel, LibreOffice, atau berkas .csv
              </p>
            </div>
          </div>

          {/* Column 2: Paste dari Excel */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="font-bold text-slate-800">
                2. Paste dari Excel:
              </label>
              <button
                type="button"
                onClick={onOpenColumnOrder}
                className="text-[#005BAA] hover:underline font-semibold flex items-center gap-1 text-[11px]"
              >
                <Table className="w-3 h-3" />
                <span>Lihat Urutan Kolom</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={pasteContent}
              onChange={(e) => setPasteContent(e.target.value)}
              placeholder="Copy tabel dari Excel lalu paste di sini..."
              className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-800 font-mono text-[11px] focus:ring-1 focus:ring-[#ED1B24] focus:outline-none resize-y"
            />

            <button
              type="button"
              onClick={handleProcessPaste}
              className="w-full mt-2 py-2.5 px-4 bg-[#0B132B] hover:bg-black text-white font-bold rounded-lg text-xs shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Proses Data Paste</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState, useMemo } from 'react';
import { parseExcelPasteDetailed, getRegionStats, RegionStat, HeaderOption } from '../utils/studentLogic';
import { StudentData, DesignTheme } from '../types';
import { THEME_CONFIGS } from '../utils/themeStyles';
import { ConfirmDialog, ConfirmDialogConfig } from './ConfirmDialog';
import {
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building2,
  Save,
  Trash2,
  RotateCcw,
  Check,
  School,
  ArrowRight,
  TableProperties,
  LayoutGrid,
  Table,
  List,
  Printer
} from 'lucide-react';

interface InputExcelViewProps {
  existingStudents: StudentData[];
  onSaveData: (students: StudentData[], append: boolean) => void;
  onDeleteRegion: (regionName: string) => void;
  onClearAll: () => void;
  onNavigateToManage: (regionFilter?: string) => void;
  onNavigateToPreview: (regionToSelect?: string) => void;
  theme?: DesignTheme;
}

const SAMPLE_EXCEL_PASTE = `Unit Operasi/ Regional\tNo\tNama Sekolah\tJenjang Sekolah\tNama\tJenis Kelamin\tKelas\tUkuran Baju (MP)\tBaju Panjang/Pendek (MP)\tUkuran Rok/Celana(MP)\tRok/Panjang/Pendek (MP)\tRok/Celana(MP)\tSiaga/ Penggalang\tUkuran Baju (PP)\tBaju Panjang/Pendek (PP)\tUkuran Rok/Celana (PP)\tRok/CelanaPanjang/Pendek (PP)\tRok/Celana(PP)\tSepatu
Regional 3/Zona 10/ PHKT DOBS\t1\tSMP 5 Penajam\tSMP\tCitra Aprilia Putri\tP\t7\t9\tPanjang\t10\tPanjang\tRok\tPenggalang\t9\tPanjang\t10\tPanjang\tRok\t38
Regional 3/Zona 10/ PHKT DOBS\t2\tSMP 5 Penajam\tSMP\tRizky Pratama Wijaya\tL\t7\t10\tPendek\t11\tPanjang\tCelana\tPenggalang\t10\tPendek\t11\tPanjang\tCelana\t40
Regional 3/Zona 10/ PHKT DOBS\t3\tSDN 001 Sepaku\tSD\tAhmad Fauzi\tL\t2\t7\tPendek\t7\tPendek\tCelana\tSiaga\t7\tPendek\t7\tPendek\tCelana\t32
Regional 3/Zona 10/ PHKT DOBS\t4\tSDN 001 Sepaku\tSD\tLeni Yundari\tP\t1\t6\tPanjang\t6\tPanjang\tRok\tSiaga\t6\tPanjang\t6\tPanjang\tRok\t31
Regional 4/Zona 11/ PHKT BSB\t1\tSMP 2 Babulu\tSMP\tDimas Satria\tL\t8\t11\tPendek\t12\tPanjang\tCelana\tPenggalang\t11\tPendek\t12\tPanjang\tCelana\t41
Regional 4/Zona 11/ PHKT BSB\t2\tSMP 2 Babulu\tSMP\tPutri Ayu Wandira\tP\t9\t12\tPanjang\t12\tPanjang\tRok\tPenggalang\t12\tPanjang\t12\tPanjang\tRok\t39`;

export const InputExcelView: React.FC<InputExcelViewProps> = ({
  existingStudents,
  onSaveData,
  onDeleteRegion,
  onClearAll,
  onNavigateToManage,
  onNavigateToPreview,
  theme = 'enterprise',
}) => {
  const themeCfg = THEME_CONFIGS[theme];
  const [pasteContent, setPasteContent] = useState('');
  const [headerOption, setHeaderOption] = useState<HeaderOption>('auto');
  const [appendMode, setAppendMode] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [unitViewMode, setUnitViewMode] = useState<'grid' | 'table' | 'compact'>('grid');
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Real-time parsing of pasted content with flexible header option
  const parseResult = useMemo(() => {
    return parseExcelPasteDetailed(pasteContent, headerOption);
  }, [pasteContent, headerOption]);

  const parsedPreview = parseResult.students;

  // Detected regions from currently pasted content
  const detectedRegions: RegionStat[] = useMemo(() => {
    return getRegionStats(parsedPreview);
  }, [parsedPreview]);

  // Existing saved regions stats
  const savedRegionStats = useMemo(() => {
    return getRegionStats(existingStudents);
  }, [existingStudents]);

  const handleUseSample = () => {
    setPasteContent(SAMPLE_EXCEL_PASTE);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleSave = () => {
    if (parsedPreview.length === 0) {
      setErrorMsg('Belum ada data siswa yang valid terdeteksi. Silakan salin & tempel baris dari Excel.');
      return;
    }

    const count = parsedPreview.length;
    const regionCount = detectedRegions.length;
    const modeDesc = appendMode
      ? `Tambahkan ke data yang sudah ada (Total data di sistem akan menjadi ${existingStudents.length + count} siswa)`
      : `Gantikan semua data sebelumnya (${existingStudents.length} siswa lama akan digantikan oleh ${count} data baru ini)`;

    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Simpan Data Siswa',
      message: `Apakah Anda yakin ingin menyimpan ${count} data siswa dari ${regionCount} Unit Operasi ke dalam sistem?`,
      subMessage: `Mode Penyimpanan: ${modeDesc}`,
      confirmLabel: 'Ya, Simpan Data',
      cancelLabel: 'Batal',
      confirmVariant: 'primary',
      icon: 'save',
      onConfirm: () => {
        onSaveData(parsedPreview, appendMode);
        setPasteContent('');
        setErrorMsg('');
        setSuccessMsg(
          `Berhasil menyimpan ${count} siswa dari ${regionCount} Unit Operasi / Regional ke dalam sistem!`
        );
        setTimeout(() => {
          setSuccessMsg('');
        }, 6000);
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* ----------------- TOP BANNER & EXCEL FORMAT GUIDE ----------------- */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-neutral-200">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-blue-50 text-[#005BAC] rounded-xl border border-blue-200 shadow-xs">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-neutral-500">
                  Format Spreadsheet Excel (TSV / CSV)
                </span>
              </div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight mt-0.5">
                Input Data Siswa dari Excel
              </h2>
              <p className="text-xs text-neutral-500">
                Salin seluruh baris tabel dari spreadsheet Excel dan tempelkan ke area di bawah ini.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleUseSample}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Tempel Data Contoh (2 Region)</span>
            </button>

            {pasteContent && (
              <button
                type="button"
                onClick={() => {
                  setPasteContent('');
                  setErrorMsg('');
                }}
                className="inline-flex items-center space-x-1 px-3 py-2 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-red-50 text-neutral-600 hover:text-red-600 border border-neutral-200 transition cursor-pointer"
              >
                <span>Bersihkan Kotak</span>
              </button>
            )}
          </div>
        </div>

        {/* Format Columns Reference */}
        <div className="bg-blue-50/40 rounded-xl p-3 border border-blue-100 text-xs">
          <div className="font-bold text-neutral-800 mb-1 flex items-center justify-between">
            <span className="flex items-center space-x-1.5 text-[#005BAC]">
              <span>Format Standar 19 Kolom Excel:</span>
            </span>
            <span className="text-[11px] font-normal text-neutral-500 hidden sm:inline">
              Otomatis mendeteksi nomor baris, ukuran baju, celana/rok, & sepatu
            </span>
          </div>
          <div className="text-[11px] font-mono text-neutral-600 bg-white p-2 rounded-lg border border-neutral-200 overflow-x-auto whitespace-nowrap">
            Unit Operasi/ Regional | No | Nama Sekolah | Jenjang Sekolah | Nama | Jenis Kelamin | Kelas | Ukuran Baju (MP) | Baju Panjang/Pendek (MP) | Ukuran Rok/Celana(MP) | Rok/Panjang/Pendek (MP) | Rok/Celana(MP) | Siaga/ Penggalang | Ukuran Baju (PP) | Baju Panjang/Pendek (PP) | Ukuran Rok/Celana (PP) | Rok/CelanaPanjang/Pendek (PP) | Rok/Celana(PP) | Sepatu
          </div>
        </div>
      </div>

      {/* ----------------- TEXTAREA INPUT & LIVE PARSING ----------------- */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-bold text-neutral-800 uppercase tracking-wider flex items-center space-x-1.5">
            <span>Area Tempel (Paste) Spreadsheet:</span>
          </label>

          {/* Flexible Header Mode Toggle */}
          <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs">
            <span className="text-[11px] font-semibold text-neutral-600 px-2 flex items-center space-x-1">
              <TableProperties className="w-3.5 h-3.5" />
              <span>Baris Kepala (Header):</span>
            </span>
            <button
              type="button"
              onClick={() => setHeaderOption('auto')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                headerOption === 'auto'
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Cerdas mendeteksi apakah baris 1 adalah header atau langsung data siswa"
            >
              ⚡ Otomatis
            </button>
            <button
              type="button"
              onClick={() => setHeaderOption('has-header')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                headerOption === 'has-header'
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Baris 1 diabaikan sebagai judul kolom (Header)"
            >
              📋 Ada Header
            </button>
            <button
              type="button"
              onClick={() => setHeaderOption('no-header')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                headerOption === 'no-header'
                  ? 'bg-white text-neutral-900 shadow-xs border border-neutral-200'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
              title="Semua baris adalah data siswa (termasuk baris 1)"
            >
              📄 Tanpa Header
            </button>
          </div>
        </div>

        <textarea
          rows={8}
          value={pasteContent}
          onChange={(e) => {
            setPasteContent(e.target.value);
            setErrorMsg('');
          }}
          placeholder={`Contoh tempel (paste) data dari Excel:\nRegional 3/Zona 10/ PHKT DOBS\t1\tSMP 5 Penajam\tSMP\tCitra Aprilia Putri\tP\t7\t9\tPanjang\t10\tPanjang\tRok\tPenggalang\t9\tPanjang\t10\tPanjang\tRok\t38\nRegional 4/Zona 11/ PHKT BSB\t1\tSMP 2 Babulu\tSMP\tDimas Satria\tL\t8\t11\tPendek\t12\tPanjang\tCelana\tPenggalang\t11\tPendek\t12\tPanjang\tCelana\t41`}
          className="w-full font-mono text-xs p-3.5 border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900 bg-neutral-50/50 leading-relaxed"
        />

        {/* Live Parsing Status Badge */}
        {pasteContent && (
          <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
            <div className="flex items-center space-x-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  parsedPreview.length > 0 ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="font-semibold text-neutral-700">
                {parseResult.detectedHeader ? (
                  <span className="text-emerald-700">
                    ✓ Baris 1 terdeteksi sebagai <b>Kepala Tabel (Header)</b> dan dilewati
                  </span>
                ) : (
                  <span className="text-blue-700">
                    ✓ Baris 1 terdeteksi sebagai <b>Data Siswa Pertama</b> (Semua {parsedPreview.length} baris dihitung)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center space-x-3 text-neutral-600">
              <span>
                Baris Teks: <b>{parseResult.rawLineCount}</b>
              </span>
              <span>•</span>
              <span>
                Siswa Terbaca:{' '}
                <b className="text-emerald-700">{parsedPreview.length} Siswa</b>
              </span>
              <span>•</span>
              <span>
                Region: <b>{detectedRegions.length} Region</b>
              </span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center space-x-2 text-xs text-red-700 bg-red-50 border border-red-200 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => onNavigateToManage()}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition"
              >
                Lihat di Tab Kelola Data →
              </button>
            </div>
          </div>
        )}

        {/* ----------------- PRATINJAU DATA SISWA YANG TERDETEKSI ----------------- */}
        {parsedPreview.length > 0 && (
          <div className="mt-6 pt-5 border-t border-neutral-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Pratinjau Hasil Pembacaan Kolom Siswa:</span>
              </h3>
              <span className="text-xs text-neutral-500 font-medium">
                Nama siswa dan sekolah berhasil dipetakan secara akurat:
              </span>
            </div>

            {/* Quick Validation Table of Parsed Students */}
            <div className="border border-neutral-200 rounded-lg overflow-hidden bg-white">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-neutral-100 text-neutral-700 font-bold border-b border-neutral-200">
                  <tr>
                    <th className="p-2 w-12 text-center">No</th>
                    <th className="p-2">Nama Siswa (Benar)</th>
                    <th className="p-2">Nama Sekolah</th>
                    <th className="p-2">Jenjang / Kelas</th>
                    <th className="p-2">JK</th>
                    <th className="p-2">Unit Operasi / Regional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 font-medium">
                  {parsedPreview.slice(0, 5).map((s, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50">
                      <td className="p-2 text-center text-neutral-500 font-mono">{s.no}</td>
                      <td className="p-2 font-bold text-neutral-900">
                        <span className="text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                          {s.nama}
                        </span>
                      </td>
                      <td className="p-2 text-neutral-700">{s.namaSekolah}</td>
                      <td className="p-2 text-neutral-600">
                        {s.jenjang} / Kelas {s.kelas}
                      </td>
                      <td className="p-2">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            s.jenisKelamin === 'P'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-blue-50 text-blue-700'
                          }`}
                        >
                          {s.jenisKelamin === 'P' ? 'PUTRI' : 'PUTRA'}
                        </span>
                      </td>
                      <td className="p-2 text-neutral-500 text-[11px] truncate max-w-xs">
                        {s.regional}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {parsedPreview.length > 5 && (
                <div className="p-2 text-center text-[11px] text-neutral-500 bg-neutral-50 border-t border-neutral-200">
                  ... dan {parsedPreview.length - 5} siswa lainnya siap disimpan.
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <h3 className="text-sm font-bold text-neutral-900 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Ringkasan Region yang Ditempel:</span>
              </h3>
              <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full font-medium">
                Total: <b>{parsedPreview.length} Siswa</b> dari <b>{detectedRegions.length} Region</b>
              </span>
            </div>

            {/* Region breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {detectedRegions.map((reg) => (
                <div
                  key={reg.name}
                  className="bg-neutral-50 rounded-lg p-3 border border-neutral-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-xs font-bold text-neutral-900">
                      <Building2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="truncate">{reg.name}</span>
                    </div>
                    <div className="mt-2 text-xs text-neutral-600 space-y-0.5">
                      <div className="flex items-center justify-between">
                        <span>Jumlah Siswa:</span>
                        <span className="font-mono font-bold text-neutral-900 bg-white px-1.5 py-0.2 rounded border border-neutral-200">
                          {reg.count}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Jumlah Sekolah:</span>
                        <span className="font-medium text-neutral-800">
                          {reg.schools.length} Sekolah
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-neutral-200/80 text-[11px] text-neutral-500 truncate">
                    Sekolah: {reg.schools.join(', ')}
                  </div>
                </div>
              ))}
            </div>

            {/* Mode Penyimpanan (Append vs Replace) */}
            <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 space-y-3">
              <div className="text-xs font-bold text-neutral-800">
                Pilih Metode Penyimpanan:
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <label
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                    appendMode
                      ? 'bg-white border-neutral-900 ring-2 ring-neutral-900/10'
                      : 'bg-neutral-100/50 border-neutral-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="saveMode"
                    checked={appendMode}
                    onChange={() => setAppendMode(true)}
                    className="mt-0.5 text-neutral-900 focus:ring-neutral-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Tambahkan ke Data yang Sudah Ada (Rekomendasi)
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Sangat cocok untuk input bertahap per region. Data region lama tidak akan hilang, melainkan digabung.
                    </p>
                  </div>
                </label>

                <label
                  className={`flex items-start space-x-3 p-3 rounded-lg border cursor-pointer transition ${
                    !appendMode
                      ? 'bg-white border-neutral-900 ring-2 ring-neutral-900/10'
                      : 'bg-neutral-100/50 border-neutral-200 hover:bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="saveMode"
                    checked={!appendMode}
                    onChange={() => setAppendMode(false)}
                    className="mt-0.5 text-neutral-900 focus:ring-neutral-900"
                  />
                  <div>
                    <div className="text-xs font-bold text-neutral-900">
                      Gantikan Semua Data Sebelumnya (Reset & Replace)
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5">
                      Menghapus semua data yang tersimpan sebelumnya dan hanya menyimpan data baru yang ada di kotak di atas.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-neutral-200">
                <div className="text-xs text-neutral-500">
                  Data siap disimpan: <b className="text-neutral-900">{parsedPreview.length} Siswa</b> dari <b className="text-neutral-900">{detectedRegions.length} Unit Operasi</b>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-black text-xs text-white bg-[#ED1C24] hover:bg-[#c9141b] active:scale-[0.98] shadow-md hover:shadow-lg transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    Simpan Data Siswa ke Sistem →
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- DAFTAR REGION TERSIMPAN DI SISTEM ----------------- */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
          <div>
            <h3 className="text-base font-bold text-neutral-900 flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-neutral-700" />
              <span>Daftar Unit Operasi / Regional Tersimpan di Sistem</span>
            </h3>
            <p className="text-xs text-neutral-500">
              Data yang tersimpan di memori browser Anda saat ini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Selector */}
            {savedRegionStats.length > 0 && (
              <div className="flex items-center space-x-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setUnitViewMode('grid')}
                  title="Tampilan Grid Kartu"
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    unitViewMode === 'grid'
                      ? 'bg-white text-[#005BAC] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Grid Kartu</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUnitViewMode('table')}
                  title="Tampilan Tabel Data"
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    unitViewMode === 'table'
                      ? 'bg-white text-[#005BAC] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Table className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Tabel</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUnitViewMode('compact')}
                  title="Tampilan Baris Ringkas"
                  className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    unitViewMode === 'compact'
                      ? 'bg-white text-[#005BAC] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Baris Ringkas</span>
                </button>
              </div>
            )}

            <span className="text-xs font-semibold px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded-md border border-neutral-200">
              Total: <b>{existingStudents.length}</b> siswa
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-900 rounded-md border border-emerald-200">
              <b>{savedRegionStats.length}</b> region
            </span>

            {existingStudents.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs text-red-600 hover:bg-red-50 rounded-md border border-red-200 transition ml-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Semua</span>
              </button>
            )}
          </div>
        </div>

        {existingStudents.length > 0 && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-[#005BAC] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold text-neutral-900">
                  Data Siswa Sudah Tersedia di Sistem
                </div>
                <p className="text-[11px] text-neutral-600">
                  Terdapat <b>{existingStudents.length} siswa</b> di <b>{savedRegionStats.length} unit operasi</b>. Anda dapat langsung memeriksa data atau mencetak lembar QC.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                type="button"
                onClick={() => onNavigateToManage('all')}
                className="px-3.5 py-2 text-xs font-bold text-[#005BAC] bg-white hover:bg-blue-50 border border-blue-200 rounded-xl transition shadow-xs cursor-pointer"
              >
                Periksa & Filter Data →
              </button>
              <button
                type="button"
                onClick={() => onNavigateToPreview('all')}
                className="px-4 py-2 text-xs font-black text-white bg-[#ED1C24] hover:bg-[#c9141b] rounded-xl transition shadow-xs cursor-pointer"
              >
                Pratinjau & Cetak Lembar A4 →
              </button>
            </div>
          </div>
        )}

        {savedRegionStats.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-lg border border-dashed border-neutral-300">
            <p className="text-xs text-neutral-500 font-medium">
              Belum ada data region yang tersimpan di sistem.
            </p>
            <p className="text-[11px] text-neutral-400 mt-1">
              Gunakan area tempel di atas atau klik &quot;Gunakan Data Contoh&quot; untuk memulai.
            </p>
          </div>
        ) : unitViewMode === 'table' ? (
          /* ---------------- MODE TABEL DATA ---------------- */
          <div className="overflow-x-auto rounded-xl border border-neutral-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase text-[10px] font-bold">
                <tr>
                  <th className="px-4 py-3">Unit Operasi / Regional</th>
                  <th className="px-3 py-3 text-center">Jumlah Siswa</th>
                  <th className="px-3 py-3 text-center">Sekolah</th>
                  <th className="px-4 py-3">Daftar Sekolah</th>
                  <th className="px-3 py-3 text-center">Estimasi Kertas</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {savedRegionStats.map((reg) => {
                  const sheetsCount = Math.ceil(reg.count / 4);
                  return (
                    <tr key={reg.name} className="hover:bg-blue-50/40 transition">
                      <td className="px-4 py-3 font-bold text-neutral-900">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          <span>{reg.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="font-bold text-[#005BAC] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 font-mono">
                          {reg.count} Siswa
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-neutral-700 font-medium">
                        {reg.schools.length}
                      </td>
                      <td className="px-4 py-3 text-neutral-600 max-w-xs truncate" title={reg.schools.join(', ')}>
                        {reg.schools.join(', ')}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="text-[11px] font-bold text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-md border border-neutral-200">
                          {sheetsCount} Lembar A4
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          <button
                            type="button"
                            onClick={() => onNavigateToManage(reg.name)}
                            className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg transition cursor-pointer"
                          >
                            Kelola
                          </button>
                          <button
                            type="button"
                            onClick={() => onNavigateToPreview(reg.name)}
                            className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer"
                          >
                            Cetak A4 →
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRegion(reg.name)}
                            title={`Hapus data ${reg.name}`}
                            className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : unitViewMode === 'compact' ? (
          /* ---------------- MODE BARIS RINGKAS ---------------- */
          <div className="space-y-2">
            {savedRegionStats.map((reg) => {
              const sheetsCount = Math.ceil(reg.count / 4);
              return (
                <div
                  key={reg.name}
                  className="bg-neutral-50/80 hover:bg-blue-50/40 rounded-xl p-3 border border-neutral-200 hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <h4 className="text-xs font-bold text-neutral-900 truncate">
                        {reg.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-0.5 truncate pl-4">
                      Sekolah: {reg.schools.join(', ')}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pl-4 md:pl-0 shrink-0">
                    <span className="text-xs font-bold text-[#005BAC] bg-white px-2 py-0.5 rounded-lg border border-neutral-200 font-mono">
                      {reg.count} Siswa
                    </span>
                    <span className="text-xs text-neutral-600 bg-white px-2 py-0.5 rounded-lg border border-neutral-200">
                      {reg.schools.length} Sekolah
                    </span>
                    <span className="text-xs text-neutral-600 bg-white px-2 py-0.5 rounded-lg border border-neutral-200">
                      {sheetsCount} Lembar A4
                    </span>

                    <button
                      type="button"
                      onClick={() => onNavigateToManage(reg.name)}
                      className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-neutral-900 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-lg transition ml-1 cursor-pointer"
                    >
                      Kelola
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigateToPreview(reg.name)}
                      className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition cursor-pointer"
                    >
                      Cetak A4 →
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteRegion(reg.name)}
                      title={`Hapus semua data di ${reg.name}`}
                      className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ---------------- MODE GRID KARTU (DEFAULT) ---------------- */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedRegionStats.map((reg) => (
              <div
                key={reg.name}
                className="bg-neutral-50 rounded-xl p-4 border border-neutral-200 hover:border-neutral-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <h4 className="text-xs font-bold text-neutral-900 leading-tight">
                        {reg.name}
                      </h4>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteRegion(reg.name)}
                      title={`Hapus semua data di ${reg.name}`}
                      className="p-1 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-white p-2.5 rounded-lg border border-neutral-200">
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase font-semibold">
                        Siswa
                      </div>
                      <div className="text-sm font-bold text-neutral-900">
                        {reg.count}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-500 uppercase font-semibold">
                        Sekolah
                      </div>
                      <div className="text-sm font-bold text-neutral-900">
                        {reg.schools.length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 text-[11px] text-neutral-500 truncate">
                    Sekolah: {reg.schools.join(', ')}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-200/80 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigateToManage(reg.name)}
                    className="text-xs font-semibold text-neutral-700 hover:text-neutral-900 flex items-center space-x-1 hover:underline cursor-pointer"
                  >
                    <span>Kelola Data Siswa</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigateToPreview(reg.name)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2 py-1 rounded transition cursor-pointer"
                  >
                    Cetak A4 →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Double confirmation dialog for saving data */}
      <ConfirmDialog
        config={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};

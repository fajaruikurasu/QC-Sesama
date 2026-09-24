import { useState, useMemo } from 'react';
import { StudentData, OrderConfig, DesignTheme } from '../types';
import { THEME_CONFIGS } from '../utils/themeStyles';
import { A4PrintSheet } from './A4PrintSheet';
import { A6Card } from './A6Card';
import {
  Printer,
  Building2,
  Plus,
  X,
  Layers,
  Grid,
  Scissors,
  CheckCircle,
  CheckCircle2,
  CheckSquare,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { getRegionStats } from '../utils/studentLogic';

interface PrintPreviewViewProps {
  students: StudentData[];
  orderConfig: OrderConfig;
  onUpdateOrderConfig: (config: OrderConfig) => void;
  selectedPreviewRegions: string[];
  onSelectPreviewRegions: (regions: string[]) => void;
  selectedStudentIds: Set<string>;
  onToggleSelectStudent: (id: string) => void;
  onSelectAllStudentsInActiveRegions: () => void;
  onDeselectAllStudentsInActiveRegions: () => void;
  onInspectStudent: (student: StudentData) => void;
  onEditStudent: (student: StudentData) => void;
  onTriggerPrint: (scope: 'all' | 'selected' | 'single', customListOrSingle?: StudentData[] | StudentData) => void;
  onNavigateToInput: () => void;
  theme?: DesignTheme;
}

export const PrintPreviewView: React.FC<PrintPreviewViewProps> = ({
  students,
  orderConfig,
  onUpdateOrderConfig,
  selectedPreviewRegions,
  onSelectPreviewRegions,
  selectedStudentIds,
  onToggleSelectStudent,
  onSelectAllStudentsInActiveRegions,
  onDeselectAllStudentsInActiveRegions,
  onInspectStudent,
  onEditStudent,
  onTriggerPrint,
  onNavigateToInput,
  theme = 'enterprise',
}) => {
  const themeCfg = THEME_CONFIGS[theme];
  // View mode within Preview tab: 'a4-sheets' vs 'cards-grid'
  const [viewMode, setViewMode] = useState<'a4-sheets' | 'cards-grid'>('a4-sheets');
  // Print scope: 'all' (all in selected regions) vs 'selected' (checked only)
  const [printScope, setPrintScope] = useState<'all' | 'selected'>('all');
  // Dropdown helper for "+ Tambah Regional Lain"
  const [isAddingMoreRegion, setIsAddingMoreRegion] = useState(false);

  // Grouped stats of all students
  const allRegionStats = useMemo(() => {
    return getRegionStats(students);
  }, [students]);

  // Regions that are NOT yet selected
  const availableUnselectedRegions = useMemo(() => {
    const selectedSet = new Set(selectedPreviewRegions);
    return allRegionStats.filter((r) => !selectedSet.has(r.name));
  }, [allRegionStats, selectedPreviewRegions]);

  // Multi-region selection helpers
  const isNoneSelected = selectedPreviewRegions.includes('__NONE__');
  const isAllSelected =
    selectedPreviewRegions.length === 0 ||
    (!isNoneSelected && selectedPreviewRegions.length === allRegionStats.length);

  // Check if a specific region is currently included in the print queue
  const isRegionActive = (regionName: string) => {
    if (isNoneSelected) return false;
    if (selectedPreviewRegions.length === 0) return true;
    return selectedPreviewRegions.includes(regionName);
  };

  // Filter students by selected preview regions (Default to ALL students if empty)
  const activeRegionStudents = useMemo(() => {
    if (isNoneSelected) return [];
    if (selectedPreviewRegions.length === 0) return students;
    const set = new Set(selectedPreviewRegions);
    return students.filter((s) => set.has((s.regional || 'Tanpa Region').trim()));
  }, [students, selectedPreviewRegions, isNoneSelected]);

  // Students that are selected via checkbox in active regions
  const checkedStudentsInActiveRegions = useMemo(() => {
    return activeRegionStudents.filter((s) => selectedStudentIds.has(s.id));
  }, [activeRegionStudents, selectedStudentIds]);

  // Printable student list based on printScope
  const printableList = useMemo(() => {
    if (printScope === 'selected') {
      return checkedStudentsInActiveRegions;
    }
    return activeRegionStudents;
  }, [printScope, checkedStudentsInActiveRegions, activeRegionStudents]);

  // Split into chunks of 4 for A4 sheets (2x2 grid)
  const a4Sheets = useMemo(() => {
    const chunks: StudentData[][] = [];
    for (let i = 0; i < printableList.length; i += 4) {
      chunks.push(printableList.slice(i, i + 4));
    }
    return chunks;
  }, [printableList]);

  const allActiveChecked =
    activeRegionStudents.length > 0 &&
    activeRegionStudents.every((s) => selectedStudentIds.has(s.id));

  // Handler: Toggle a single region in the multi-select queue
  const handleToggleRegion = (regionName: string) => {
    if (selectedPreviewRegions.length === 0) {
      // Previously all were active by default. Toggling this off leaves all others active!
      const remaining = allRegionStats
        .map((r) => r.name)
        .filter((name) => name !== regionName);
      onSelectPreviewRegions(remaining.length === 0 ? ['__NONE__'] : remaining);
    } else if (isNoneSelected) {
      // Previously none were active. Toggling this turns on only this region!
      onSelectPreviewRegions([regionName]);
    } else if (selectedPreviewRegions.includes(regionName)) {
      // Deselecting this region
      const remaining = selectedPreviewRegions.filter((name) => name !== regionName);
      onSelectPreviewRegions(remaining.length === 0 ? ['__NONE__'] : remaining);
    } else {
      // Adding this region to the combined queue
      const updated = [...selectedPreviewRegions, regionName];
      if (updated.length === allRegionStats.length) {
        onSelectPreviewRegions([]); // reset to all by default
      } else {
        onSelectPreviewRegions(updated);
      }
    }
  };

  // Handler: Select ONLY this single region
  const handleSelectOnlyRegion = (regionName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectPreviewRegions([regionName]);
  };

  // Handler: Select all regions at once
  const handleSelectAllRegions = () => {
    onSelectPreviewRegions([]);
  };

  // Handler: Deselect all regions
  const handleClearSelectedRegions = () => {
    onSelectPreviewRegions(['__NONE__']);
  };

  // Active region count calculation
  const activeRegionCount = useMemo(() => {
    if (isNoneSelected) return 0;
    if (selectedPreviewRegions.length === 0) return allRegionStats.length;
    return selectedPreviewRegions.length;
  }, [isNoneSelected, selectedPreviewRegions, allRegionStats]);

  return (
    <div className="space-y-6">
      {/* ----------------- BANNER & MULTI-REGION SELECTION ----------------- */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-red-50 text-[#ED1C24] rounded-xl border border-red-200 shadow-xs">
              <Printer className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-neutral-500">
                  Format Cetak Kertas A4 (2×2 Kartu A6)
                </span>
              </div>
              <h2 className="text-xl font-black text-neutral-900 tracking-tight mt-0.5">
                Pratinjau & Cetak Lembar QC A4
              </h2>
              <p className="text-xs text-neutral-500">
                Pilih satu, gabungan beberapa, atau seluruh Unit Operasi untuk dicetak sekaligus dalam antrean.
              </p>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-2">
            <div className="bg-neutral-50 px-3.5 py-2 rounded-xl border border-neutral-200 text-xs">
              <span className="text-neutral-500">Siap Cetak: </span>
              <b className="text-neutral-900">{printableList.length} Siswa</b>
              <span className="text-neutral-400 mx-1.5">•</span>
              <b className="text-[#005BAC]">{a4Sheets.length} Lembar A4</b>
            </div>
          </div>
        </div>

        {/* If no students exist */}
        {allRegionStats.length === 0 ? (
          <div className="p-8 bg-neutral-50 rounded-xl border border-dashed border-neutral-300 text-center space-y-3">
            <div className="w-12 h-12 bg-neutral-100 text-neutral-400 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-neutral-800">Belum Ada Data Siswa di Sistem</h4>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Silakan tempel data spreadsheet di menu Input Data Excel atau muat data contoh untuk mulai mencetak.
            </p>
            <button
              type="button"
              onClick={onNavigateToInput}
              className="px-4 py-2 text-xs font-bold text-white bg-[#005BAC] hover:bg-[#00488B] rounded-xl transition shadow-xs cursor-pointer"
            >
              ← Buka Menu Input Data Excel
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Multi-Select Header Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center space-x-2 text-xs font-bold text-neutral-800">
                <Building2 className="w-4 h-4 text-[#005BAC]" />
                <span>Pilih Unit Operasi / Regional untuk Dicetak Bersamaan:</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={handleSelectAllRegions}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                    isAllSelected
                      ? 'bg-[#005BAC] text-white shadow-xs'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-300'
                  }`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Pilih Semua Unit ({allRegionStats.length})</span>
                </button>

                {!isAllSelected && !isNoneSelected && (
                  <button
                    type="button"
                    onClick={handleClearSelectedRegions}
                    className="px-2.5 py-1.5 text-xs font-semibold text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-xl border border-neutral-200 transition cursor-pointer"
                  >
                    Kosongkan
                  </button>
                )}
              </div>
            </div>

            {/* Multi-Region Checkbox Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {allRegionStats.map((r) => {
                const isChecked = isRegionActive(r.name);
                return (
                  <div
                    key={r.name}
                    onClick={() => handleToggleRegion(r.name)}
                    className={`flex items-center justify-between p-3 rounded-xl border-2 transition cursor-pointer select-none ${
                      isChecked
                        ? 'border-[#005BAC] bg-blue-50/70 shadow-xs ring-1 ring-[#005BAC]/20'
                        : 'border-neutral-200 hover:border-neutral-300 bg-neutral-50/40 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {}} // handled by parent div onClick
                        className="w-4 h-4 rounded text-[#005BAC] focus:ring-[#005BAC] cursor-pointer shrink-0"
                      />
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isChecked ? 'text-neutral-900' : 'text-neutral-600'}`}>
                          {r.name}
                        </div>
                        <div className="text-[11px] text-neutral-500 mt-0.5">
                          <b>{r.count}</b> Siswa • {r.schools.length} Sekolah
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleSelectOnlyRegion(r.name, e)}
                      title={`Hanya pilih ${r.name}`}
                      className="text-[10px] font-bold px-2 py-1 rounded-lg bg-white hover:bg-[#005BAC] text-neutral-600 hover:text-white border border-neutral-200 hover:border-[#005BAC] transition shrink-0 ml-2 shadow-2xs cursor-pointer"
                    >
                      Hanya Ini
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Active Selection Summary Bar */}
            {isNoneSelected ? (
              <div className="bg-amber-50 rounded-xl p-3.5 border border-amber-200 flex items-center justify-between gap-3 text-xs text-amber-900">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Tidak ada Unit Operasi yang dicentang. Silakan centang minimal satu unit di atas.</span>
                </div>
                <button
                  type="button"
                  onClick={handleSelectAllRegions}
                  className="px-3 py-1 font-bold bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition shrink-0 cursor-pointer"
                >
                  Centang Semua Unit
                </button>
              </div>
            ) : (
              <div className="bg-neutral-50 rounded-xl px-4 py-2.5 border border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-neutral-700">
                    Mencetak gabungan: <b className="text-neutral-900">{activeRegionCount} Unit Operasi Terpilih</b> (
                    <b className="text-[#005BAC]">{printableList.length} kartu siswa</b> • <b className="text-neutral-900">{a4Sheets.length} lembar kertas A4</b>)
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 font-medium">
                  {isAllSelected
                    ? '✓ Seluruh unit operasi dicetak bersamaan'
                    : '✓ Unit terpilih digabungkan berurutan dalam antrean cetak'}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ----------------- ACTION & PRINT TOOLBAR ----------------- */}
      {allRegionStats.length > 0 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
            {/* Left: View Mode Toggle & Cut Marks */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-1 border border-neutral-300 p-1 rounded-xl bg-neutral-100 text-xs">
                <button
                  type="button"
                  onClick={() => setViewMode('a4-sheets')}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
                    viewMode === 'a4-sheets'
                      ? 'bg-white text-[#005BAC] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Lembar A4 (2×2)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode('cards-grid')}
                  className={`inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
                    viewMode === 'cards-grid'
                      ? 'bg-white text-[#005BAC] shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>Grid Kartu A6 ({activeRegionStudents.length})</span>
                </button>
              </div>

              {/* Garis Potong Toggle */}
              <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-700 cursor-pointer select-none px-3 py-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 transition">
                <input
                  type="checkbox"
                  checked={orderConfig.showCutGuides}
                  onChange={(e) =>
                    onUpdateOrderConfig({ ...orderConfig, showCutGuides: e.target.checked })
                  }
                  className="rounded text-[#005BAC] focus:ring-[#005BAC] w-4 h-4 cursor-pointer"
                />
                <Scissors className="w-3.5 h-3.5 text-neutral-600" />
                <span>Garis Potong (Cut Marks)</span>
              </label>

              {/* Print Scope Selector */}
              <div className="inline-flex rounded-xl border border-neutral-300 p-0.5 bg-neutral-100 text-xs">
                <button
                  type="button"
                  onClick={() => setPrintScope('all')}
                  className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
                    printScope === 'all'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Semua Siswa ({activeRegionStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPrintScope('selected')}
                  className={`px-3 py-1.5 font-bold rounded-lg transition cursor-pointer ${
                    printScope === 'selected'
                      ? 'bg-white text-neutral-900 shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Hanya Dicentang ({checkedStudentsInActiveRegions.length})
                </button>
              </div>
            </div>

            {/* Right: Primary Print Action */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => onTriggerPrint(printScope, printableList)}
                disabled={printableList.length === 0}
                className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl font-black text-xs text-white bg-[#ED1C24] hover:bg-[#c9141b] active:scale-[0.98] shadow-md hover:shadow-lg transition cursor-pointer disabled:opacity-50"
              >
                <Printer className="w-4 h-4 text-white" />
                <span>
                  CETAK LEMBAR A4 SEKARANG ({printableList.length} Kartu / {a4Sheets.length} Lembar)
                </span>
              </button>
            </div>
          </div>

          {/* Subheader info & selection toggles */}
          <div className="flex flex-wrap items-center justify-between text-xs text-neutral-600 px-1">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                Total <b>{printableList.length} kartu A6</b> siap dicetak (
                <b>{a4Sheets.length} lembar</b> kertas A4).
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={
                  allActiveChecked
                    ? onDeselectAllStudentsInActiveRegions
                    : onSelectAllStudentsInActiveRegions
                }
                className="text-[#005BAC] font-bold hover:underline cursor-pointer"
              >
                {allActiveChecked ? 'Batal Centang Semua Siswa' : 'Centang Semua Siswa di Tampilan Ini'}
              </button>
            </div>
          </div>

          {/* ----------------- SUB-VIEW: A4 SHEETS PREVIEW ----------------- */}
          {viewMode === 'a4-sheets' && (
            <div className="flex flex-col items-center overflow-x-auto p-6 bg-neutral-200/60 rounded-2xl border border-neutral-300">
              {a4Sheets.length === 0 ? (
                <div className="p-8 text-center text-xs text-neutral-600">
                  Tidak ada kartu siswa untuk dicetak. Centang siswa terlebih dahulu jika menggunakan opsi &quot;Hanya Dicentang&quot;.
                </div>
              ) : (
                a4Sheets.map((sheetStudents, sheetIdx) => (
                  <div key={sheetIdx} className="mb-10 last:mb-0">
                    <div className="text-xs font-bold text-neutral-600 mb-2 flex justify-between items-center px-1">
                      <span>
                        Lembar A4 Ke-{sheetIdx + 1} dari {a4Sheets.length}
                      </span>
                      <span className="font-mono text-neutral-500">
                        Kartu {sheetIdx * 4 + 1} s/d{' '}
                        {Math.min((sheetIdx + 1) * 4, printableList.length)}
                      </span>
                    </div>

                    <A4PrintSheet
                      students={sheetStudents}
                      sheetIndex={sheetIdx}
                      totalSheets={a4Sheets.length}
                      orderConfig={orderConfig}
                      showCutGuides={orderConfig.showCutGuides}
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {/* ----------------- SUB-VIEW: CARDS GRID ----------------- */}
          {viewMode === 'cards-grid' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {activeRegionStudents.map((student) => {
                const isSelected = selectedStudentIds.has(student.id);
                return (
                  <div
                    key={student.id}
                    className={`flex flex-col bg-white rounded-xl shadow-xs border transition-all ${
                      isSelected
                        ? 'border-[#005BAC] ring-2 ring-[#005BAC]/20'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    {/* Card Header Bar */}
                    <div className="p-2.5 border-b border-neutral-200 flex items-center justify-between bg-neutral-50/80 rounded-t-xl text-xs">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggleSelectStudent(student.id)}
                          className="rounded text-[#005BAC] focus:ring-[#005BAC]"
                        />
                        <span className="font-mono font-bold text-neutral-900">
                          {student.code}
                        </span>
                      </label>

                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          onClick={() => onEditStudent(student)}
                          title="Edit Siswa"
                          className="p-1 text-neutral-600 hover:text-amber-700 hover:bg-amber-50 rounded transition cursor-pointer"
                        >
                          <span className="text-[11px] font-semibold">Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onTriggerPrint('single', student)}
                          title="Cetak Kartu Ini Saja"
                          className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onInspectStudent(student)}
                          title="Perbesar"
                          className="p-1 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-200 rounded transition cursor-pointer"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3 flex items-center justify-center bg-neutral-100/40 grow overflow-hidden">
                      <div className="w-full max-w-[100mm] transform scale-90 sm:scale-100 origin-top">
                        <A6Card student={student} orderConfig={orderConfig} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

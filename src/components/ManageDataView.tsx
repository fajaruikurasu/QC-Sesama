import React, { useState, useMemo } from 'react';
import { StudentData, DesignTheme } from '../types';
import { StudentTable } from './StudentTable';
import { THEME_CONFIGS } from '../utils/themeStyles';
import { 
  Building2, 
  UserPlus, 
  Search, 
  Trash2, 
  Filter, 
  Printer, 
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { getRegionStats } from '../utils/studentLogic';

interface ManageDataViewProps {
  students: StudentData[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteStudent: (id: string) => void;
  onDeleteSelected: () => void;
  onPreviewStudent: (student: StudentData) => void;
  onEditStudent: (student: StudentData) => void;
  onAddNewStudent: () => void;
  onNavigateToPreview: (region?: string) => void;
  onNavigateToInput: () => void;
  initialRegionFilter?: string;
  theme?: DesignTheme;
}

export const ManageDataView: React.FC<ManageDataViewProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDeleteStudent,
  onDeleteSelected,
  onPreviewStudent,
  onEditStudent,
  onAddNewStudent,
  onNavigateToPreview,
  onNavigateToInput,
  initialRegionFilter = 'all',
  theme = 'enterprise',
}) => {
  const themeCfg = THEME_CONFIGS[theme];
  const [filterRegion, setFilterRegion] = useState<string>(initialRegionFilter);

  const regionStats = useMemo(() => {
    return getRegionStats(students);
  }, [students]);

  // Quick stats calculations
  const statsSummary = useMemo(() => {
    const total = students.length;
    const sdCount = students.filter(
      (s) => (s.jenjang || '').toUpperCase() === 'SD' || (s.namaSekolah || '').toUpperCase().startsWith('SD')
    ).length;
    const smpCount = total - sdCount;
    const sheetsNeeded = Math.ceil(total / 4);
    return { total, sdCount, smpCount, sheetsNeeded };
  }, [students]);

  // Filter students based on region filter
  const displayedStudents = useMemo(() => {
    if (filterRegion === 'all') return students;
    return students.filter((s) => (s.regional || 'Tanpa Region').trim() === filterRegion);
  }, [students, filterRegion]);

  return (
    <div className="space-y-6">
      {/* ----------------- TOP TOOLBAR & STEP HEADER ----------------- */}
      <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-neutral-500">
                Pemeriksaan & Validasi Data Siswa
              </span>
            </div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight mt-1 flex items-center space-x-2">
              <span>Kelola & Pemeriksaan Data</span>
              <span className="text-xs bg-neutral-100 text-neutral-700 px-2.5 py-1 rounded-full font-bold border border-neutral-200">
                {displayedStudents.length} Siswa Terpilih
              </span>
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Periksa ukuran seragam (Baju, Rok/Celana, Sepatu), perbaiki identitas bila ada kesalahan, atau tambah siswa manual.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter Dropdown Region */}
            <div className="flex items-center space-x-2 bg-neutral-50 border border-neutral-300 rounded-xl px-3 py-2 text-xs shadow-2xs">
              <Building2 className="w-4 h-4 text-[#005BAC] shrink-0" />
              <span className="font-bold text-neutral-700 shrink-0">Unit Operasi:</span>
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="bg-transparent font-black text-[#005BAC] focus:outline-hidden text-xs cursor-pointer max-w-[220px] truncate"
              >
                <option value="all">Semua Unit ({students.length} Siswa)</option>
                {regionStats.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name} ({r.count} Siswa)
                  </option>
                ))}
              </select>
            </div>

            {/* Tombol Tambah Siswa */}
            <button
              type="button"
              onClick={onAddNewStudent}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-bold rounded-xl text-neutral-800 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 shadow-xs transition"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#005BAC]" />
              <span>+ Siswa Manual</span>
            </button>

            {/* Tombol Lanjut ke Cetak */}
            <button
              type="button"
              onClick={() => onNavigateToPreview(filterRegion)}
              className="inline-flex items-center space-x-2 px-5 py-2 text-xs font-black rounded-xl text-white bg-[#ED1C24] hover:bg-[#c9141b] active:scale-[0.98] shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <Printer className="w-4 h-4 text-white" />
              <span>Pratinjau & Cetak Lembar A4 →</span>
            </button>
          </div>
        </div>

        {/* 4 Mini KPI Cards for Data Overview */}
        {students.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200">
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Total Siswa</div>
              <div className="text-lg font-black text-neutral-900 mt-0.5">{statsSummary.total}</div>
              <div className="text-[10px] text-neutral-500">Semua data terverifikasi</div>
            </div>
            <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200">
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Jenjang Sekolah</div>
              <div className="text-lg font-black text-neutral-900 mt-0.5">
                <span className="text-[#ED1C24]">{statsSummary.sdCount} SD</span>
                <span className="text-neutral-400 mx-1.5">•</span>
                <span className="text-[#005BAC]">{statsSummary.smpCount} SMP</span>
              </div>
              <div className="text-[10px] text-neutral-500">Kombinasi jenjang</div>
            </div>
            <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200">
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Unit Operasi</div>
              <div className="text-lg font-black text-neutral-900 mt-0.5">{regionStats.length} Regional</div>
              <div className="text-[10px] text-neutral-500">Distribusi wilayah</div>
            </div>
            <div className="bg-neutral-50/80 rounded-xl p-3 border border-neutral-200">
              <div className="text-[10px] font-bold text-neutral-500 uppercase">Kertas A4 Siap Cetak</div>
              <div className="text-lg font-black text-[#005BAC] mt-0.5">{statsSummary.sheetsNeeded} Lembar</div>
              <div className="text-[10px] text-neutral-500">4 kartu A6 per lembar</div>
            </div>
          </div>
        )}
      </div>

      {/* ----------------- DATA TABLE CONTAINER ----------------- */}
      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-neutral-200 p-12 text-center shadow-xs">
          <div className="max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 bg-neutral-100 text-neutral-500 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-neutral-900">
              Belum Ada Data Siswa
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Anda belum memasukkan data siswa. Silakan buka Tab Input Data Excel untuk menempel data atau muat contoh.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onNavigateToInput}
                className={`px-4 py-2 text-xs font-bold rounded-lg shadow-xs transition inline-flex items-center space-x-1.5 ${themeCfg.primaryActionBtn}`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Buka Tab Input Data Excel</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <StudentTable
          students={displayedStudents}
          selectedIds={selectedIds}
          onToggleSelect={onToggleSelect}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          onDeleteStudent={onDeleteStudent}
          onDeleteSelected={onDeleteSelected}
          onPreviewStudent={onPreviewStudent}
          onEditStudent={onEditStudent}
          onPrintSelected={() => onNavigateToPreview(filterRegion)}
          theme={theme}
        />
      )}
    </div>
  );
};

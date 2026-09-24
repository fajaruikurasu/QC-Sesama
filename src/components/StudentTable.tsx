import React, { useState, useMemo } from 'react';
import { StudentData, DesignTheme } from '../types';
import { THEME_CONFIGS } from '../utils/themeStyles';
import { 
  Search, 
  Trash2, 
  CheckSquare, 
  Square, 
  Filter, 
  GraduationCap, 
  Eye, 
  UserCheck,
  Pencil,
  Building2,
  Printer
} from 'lucide-react';

interface StudentTableProps {
  students: StudentData[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteStudent: (id: string) => void;
  onDeleteSelected: () => void;
  onPreviewStudent: (student: StudentData) => void;
  onEditStudent: (student: StudentData) => void;
  onPrintSelected?: () => void;
  theme?: DesignTheme;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  selectedIds,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onDeleteStudent,
  onDeleteSelected,
  onPreviewStudent,
  onEditStudent,
  onPrintSelected,
  theme = 'enterprise',
}) => {
  const themeCfg = THEME_CONFIGS[theme];
  const [search, setSearch] = useState('');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [filterJenjang, setFilterJenjang] = useState<string>('all');
  const [filterGender, setFilterGender] = useState<string>('all');
  const [filterPramuka, setFilterPramuka] = useState<string>('all');

  // Unique regions from current student set
  const availableRegions = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.regional) set.add(s.regional.trim());
    });
    return Array.from(set).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        s.nama.toLowerCase().includes(q) ||
        s.namaSekolah.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.regional && s.regional.toLowerCase().includes(q));

      const matchRegion =
        filterRegion === 'all' ||
        (s.regional || '').trim() === filterRegion;

      const matchJenjang =
        filterJenjang === 'all' ||
        s.jenjang.toUpperCase() === filterJenjang.toUpperCase();

      const matchGender =
        filterGender === 'all' ||
        s.jenisKelamin.toUpperCase().startsWith(filterGender.toUpperCase());

      const matchPramuka =
        filterPramuka === 'all' ||
        s.siagaPenggalang.toLowerCase().includes(filterPramuka.toLowerCase());

      return matchSearch && matchRegion && matchJenjang && matchGender && matchPramuka;
    });
  }, [students, search, filterRegion, filterJenjang, filterGender, filterPramuka]);

  const allFilteredSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((s) => selectedIds.has(s.id));

  const handleToggleAllFiltered = () => {
    if (allFilteredSelected) {
      // Unselect only the filtered ones
      filteredStudents.forEach((st) => {
        if (selectedIds.has(st.id)) {
          onToggleSelect(st.id);
        }
      });
    } else {
      // Select all filtered ones
      filteredStudents.forEach((st) => {
        if (!selectedIds.has(st.id)) {
          onToggleSelect(st.id);
        }
      });
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-neutral-200 overflow-hidden">
      {/* Search & Filter Toolbar */}
      <div className="p-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-3 bg-neutral-50/50">
        <div className="flex items-center space-x-2 flex-1 min-w-[240px] max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama siswa, sekolah, region, atau kode..."
              className="w-full text-xs pl-9 pr-3 py-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Region Filter */}
          {availableRegions.length > 1 && (
            <div className="flex items-center space-x-1 text-xs">
              <Building2 className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="text-xs bg-white border border-neutral-300 rounded-md px-2 py-1.5 focus:outline-hidden max-w-[180px] font-medium"
              >
                <option value="all">Semua Region ({availableRegions.length})</option>
                {availableRegions.map((reg, idx) => (
                  <option key={idx} value={reg}>
                    {reg}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Jenjang Filter */}
          <div className="flex items-center space-x-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={filterJenjang}
              onChange={(e) => setFilterJenjang(e.target.value)}
              className="text-xs bg-white border border-neutral-300 rounded-md px-2 py-1.5 focus:outline-hidden"
            >
              <option value="all">Semua Jenjang</option>
              <option value="SD">SD</option>
              <option value="SMP">SMP</option>
            </select>
          </div>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="text-xs bg-white border border-neutral-300 rounded-md px-2 py-1.5 focus:outline-hidden"
          >
            <option value="all">Semua Gender</option>
            <option value="L">Putra (L)</option>
            <option value="P">Putri (P)</option>
          </select>

          {/* Pramuka Filter */}
          <select
            value={filterPramuka}
            onChange={(e) => setFilterPramuka(e.target.value)}
            className="text-xs bg-white border border-neutral-300 rounded-md px-2 py-1.5 focus:outline-hidden"
          >
            <option value="all">Semua Pramuka</option>
            <option value="siaga">Siaga</option>
            <option value="penggalang">Penggalang</option>
          </select>

          {/* Bulk Selection Actions */}
          <button
            type="button"
            onClick={handleToggleAllFiltered}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-md transition"
          >
            {allFilteredSelected ? (
              <>
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span>Batal Pilih</span>
              </>
            ) : (
              <>
                <Square className="w-3.5 h-3.5 text-neutral-500" />
                <span>Pilih Semua Terfilter</span>
              </>
            )}
          </button>

          {selectedIds.size > 0 && (
            <div className="flex items-center space-x-1.5 pl-2 border-l border-neutral-300">
              <span className="text-[11px] font-bold text-neutral-700 bg-neutral-200/80 px-2 py-1 rounded">
                {selectedIds.size} dipilih
              </span>

              {onPrintSelected && (
                <button
                  type="button"
                  onClick={onPrintSelected}
                  className="inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md shadow-xs transition"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Terpilih ({selectedIds.size})</span>
                </button>
              )}

              <button
                type="button"
                onClick={onDeleteSelected}
                title="Hapus baris siswa yang dicentang dari sistem"
                className="inline-flex items-center space-x-1 text-xs font-semibold px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Terpilih ({selectedIds.size})</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className={`font-semibold border-b ${themeCfg.tableHeaderBg}`}>
            <tr>
              <th className="p-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allFilteredSelected}
                  onChange={handleToggleAllFiltered}
                  className="rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                />
              </th>
              <th className="p-3">Kode Siswa</th>
              <th className="p-3">Nama Siswa</th>
              <th className="p-3">Unit Operasi / Region</th>
              <th className="p-3">Sekolah & Jenjang</th>
              <th className="p-3">Kelas & JK</th>
              <th className="p-3">Seragam Nasional (MP)</th>
              <th className="p-3">Seragam Pramuka (PP)</th>
              <th className="p-3">Sepatu</th>
              <th className="p-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="text-center py-12 text-neutral-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <GraduationCap className="w-8 h-8 text-neutral-300" />
                    <p className="text-sm font-medium">Tidak ada data siswa ditemukan.</p>
                    <p className="text-xs text-neutral-400">
                      Silakan sesuaikan pencarian atau klik tombol "Paste Excel" untuk menambahkan data.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((st) => {
                const isSelected = selectedIds.has(st.id);
                const isFemale = st.jenisKelamin.toUpperCase().startsWith('P');

                return (
                  <tr
                    key={st.id}
                    className={`hover:bg-neutral-50/80 transition-colors ${
                      isSelected ? 'bg-amber-50/40' : ''
                    }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(st.id)}
                        className="rounded text-neutral-900 focus:ring-neutral-900 cursor-pointer"
                      />
                    </td>
                    <td className="p-3 font-mono font-bold text-neutral-900">
                      {st.code}
                    </td>
                    <td className="p-3 font-semibold text-neutral-900">
                      <div className="flex items-center space-x-1.5">
                        <span>{st.nama}</span>
                        {isSelected && (
                          <UserCheck className="w-3.5 h-3.5 text-emerald-600 inline" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-neutral-700">
                      <div className="flex items-center space-x-1 max-w-[170px] truncate" title={st.regional}>
                        <Building2 className="w-3 h-3 text-neutral-400 shrink-0" />
                        <span className="text-[11px] font-medium truncate">{st.regional || '-'}</span>
                      </div>
                    </td>
                    <td className="p-3 text-neutral-700">
                      <span className="font-medium">{st.namaSekolah}</span>
                      <span className={`ml-1.5 inline-block text-[10px] px-1.5 py-0.5 rounded border ${
                        st.jenjang === 'SD' ? themeCfg.badgeSD : themeCfg.badgeSMP
                      }`}>
                        {st.jenjang}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-700">
                      <span>Kls {st.kelas}</span>
                      <span
                        className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isFemale
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {isFemale ? 'Putri' : 'Putra'}
                      </span>
                    </td>
                    <td className="p-3 text-neutral-600 text-[11px]">
                      <div>
                        Baju: <span className="font-semibold text-neutral-800">Uk. {st.ukBajuMP}</span> ({st.pjgBajuMP})
                      </div>
                      <div>
                        {st.rokCelanaMP}: <span className="font-semibold text-neutral-800">Uk. {st.ukBawahanMP}</span> ({st.pjgBawahanMP})
                      </div>
                    </td>
                    <td className="p-3 text-neutral-600 text-[11px]">
                      <div>
                        <span className="font-bold text-amber-800">{st.siagaPenggalang}</span>
                      </div>
                      <div>
                        Baju: <span className="font-semibold text-neutral-800">Uk. {st.ukBajuPP}</span> | Bawahan: <span className="font-semibold text-neutral-800">Uk. {st.ukBawahanPP}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-neutral-900">
                      No. {st.sepatu || '-'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          type="button"
                          onClick={() => onEditStudent(st)}
                          title="Edit Data Siswa"
                          className="p-1.5 text-neutral-600 hover:text-amber-700 hover:bg-amber-50 rounded-md transition"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onPreviewStudent(st)}
                          title="Lihat Kartu A6"
                          className="p-1.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteStudent(st.id)}
                          title="Hapus Siswa"
                          className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer info */}
      <div className="p-3 border-t border-neutral-200 bg-neutral-50/50 flex flex-wrap justify-between items-center text-xs text-neutral-500">
        <div>
          Menampilkan <span className="font-bold text-neutral-800">{filteredStudents.length}</span> dari{' '}
          <span className="font-bold text-neutral-800">{students.length}</span> total siswa.
        </div>
        <div>
          Terpilih untuk dicetak:{' '}
          <span className="font-bold text-neutral-900 bg-amber-100 px-2 py-0.5 rounded text-amber-900">
            {selectedIds.size} siswa
          </span>{' '}
          ({Math.ceil(selectedIds.size / 4)} lembar A4)
        </div>
      </div>
    </div>
  );
};

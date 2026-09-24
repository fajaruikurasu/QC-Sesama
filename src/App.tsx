import { useState, useEffect, useMemo } from 'react';
import { StudentData, OrderConfig, DesignTheme } from './types';
import { SAMPLE_STUDENTS, getRegionStats } from './utils/studentLogic';
import { THEME_CONFIGS } from './utils/themeStyles';
import { A4PrintSheet } from './components/A4PrintSheet';
import { InputExcelView } from './components/InputExcelView';
import { ManageDataView } from './components/ManageDataView';
import { PrintPreviewView } from './components/PrintPreviewView';
import { EditStudentModal } from './components/EditStudentModal';
import { SingleCardModal } from './components/SingleCardModal';
import { ConfirmDialog, ConfirmDialogConfig } from './components/ConfirmDialog';
import { api } from './services/api';
import {
  FileSpreadsheet,
  FileCheck2,
  ListFilter,
  Printer,
  Sparkles,
  RotateCcw,
  RefreshCw,
  CheckCircle2,
  ChevronRight,
  ShieldCheck,
  PackageCheck
} from 'lucide-react';

const LOCAL_STORAGE_KEY_STUDENTS = 'qc_generator_students_v3';
const LOCAL_STORAGE_KEY_CONFIG = 'qc_generator_config_v3';

export default function App() {
  // ----------------------------------------------------
  // Persistent Student Data & Configuration
  // ----------------------------------------------------
  const [students, setStudents] = useState<StudentData[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load students from localStorage', e);
    }
    return SAMPLE_STUDENTS;
  });

  const [orderConfig, setOrderConfig] = useState<OrderConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load orderConfig from localStorage', e);
    }
    return {
      namaPemesan: 'Regional 3 / Zona 10 / PHKT DOBS',
      nomorPO: 'PO-QC-2026-001',
      tanggal: new Date().toISOString().split('T')[0],
      namaPetugasQC: '',
      atkLayout: 'opsi-a',
      identityStyle: 'opsi-1',
      showCutGuides: true,
    };
  });

  // Cross-device server sync states (No Login Required!)
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string>('');

  // Selected student IDs (for targeted checkbox selection)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set<string>());

  // 3 Dedicated Work Tabs
  const [activeTab, setActiveTab] = useState<'input-data' | 'manage-data' | 'print-preview'>('input-data');

  // Filter for Manage tab when navigated from elsewhere
  const [manageRegionFilter, setManageRegionFilter] = useState<string>('all');

  // Selected regions in Tab 3 (Print Preview)
  const [selectedPreviewRegions, setSelectedPreviewRegions] = useState<string[]>([]);

  // Locked to Enterprise design theme as requested
  const currentTheme: DesignTheme = 'enterprise';
  const themeCfg = THEME_CONFIGS['enterprise'];

  // Modals
  const [editingStudent, setEditingStudent] = useState<StudentData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [inspectStudent, setInspectStudent] = useState<StudentData | null>(null);

  // Dedicated double confirmation dialog
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogConfig>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Dedicated explicit print targets
  const [customPrintStudents, setCustomPrintStudents] = useState<StudentData[] | null>(null);

  // Fetch from central server database on mount and periodically sync
  useEffect(() => {
    let isMounted = true;
    const initFetch = async () => {
      setSyncStatus('syncing');
      try {
        const res = await api.fetchAllData();
        if (res && isMounted) {
          if (Array.isArray(res.students) && res.students.length > 0) {
            setStudents(res.students);
          }
          if (res.orderConfig) {
            setOrderConfig(res.orderConfig);
          }
          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        } else {
          setSyncStatus('offline');
        }
      } catch {
        if (isMounted) setSyncStatus('offline');
      }
    };

    initFetch();

    // Background sync check every 15s so multiple devices stay up-to-date automatically
    const timer = setInterval(async () => {
      try {
        const res = await api.fetchAllData();
        if (res && isMounted) {
          setStudents((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(res.students)) {
              return res.students;
            }
            return prev;
          });
          setSyncStatus('synced');
          setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch {
        // Ignore background polling errors
      }
    }, 15000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  // Sync to localStorage as client-side backup
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.error('Failed to save students to localStorage', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(orderConfig));
    } catch (e) {
      console.error('Failed to save config to localStorage', e);
    }
  }, [orderConfig]);

  // Keep selectedIds valid when students list changes
  useEffect(() => {
    setSelectedIds((prev) => {
      const valid = new Set<string>();
      students.forEach((s) => {
        if (prev.has(s.id)) valid.add(s.id);
      });
      return valid;
    });
  }, [students]);

  // Reset custom print target after print dialog closes
  useEffect(() => {
    const handleAfterPrint = () => {
      setCustomPrintStudents(null);
    };
    window.addEventListener('afterprint', handleAfterPrint);
    return () => {
      window.removeEventListener('afterprint', handleAfterPrint);
    };
  }, []);

  // Available regions stats
  const regionStats = useMemo(() => {
    return getRegionStats(students);
  }, [students]);

  const existingRegionNames = useMemo(() => {
    return regionStats.map((r) => r.name);
  }, [regionStats]);

  // Manual refresh / sync from server
  const handleManualSync = async () => {
    setSyncStatus('syncing');
    const res = await api.fetchAllData();
    if (res) {
      setStudents(res.students);
      setOrderConfig(res.orderConfig);
      setSyncStatus('synced');
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    } else {
      setSyncStatus('offline');
    }
  };

  // ----------------------------------------------------
  // Handler Actions (Updated to sync with server database)
  // ----------------------------------------------------
  const handleSaveImportedData = async (imported: StudentData[], append: boolean) => {
    if (append) {
      const merged = [...students, ...imported];
      setStudents(merged);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        imported.forEach((s) => next.add(s.id));
        return next;
      });
      await api.saveStudents(imported, true);
    } else {
      setStudents(imported);
      setSelectedIds(new Set(imported.map((s) => s.id)));
      setSelectedPreviewRegions([]);
      await api.saveStudents(imported, false);
    }
    setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  const handleDeleteRegion = (regionName: string) => {
    const count = students.filter((s) => (s.regional || '').trim() === regionName).length;
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Hapus Unit Operasi',
      message: `Apakah Anda yakin ingin menghapus Unit Operasi "${regionName}" beserta seluruh ${count} data siswa di dalamnya?`,
      subMessage: 'Tindakan ini tidak dapat dibatalkan. Kartu siswa pada regional ini akan dihapus dari sistem.',
      confirmLabel: 'Ya, Hapus Unit Operasi',
      cancelLabel: 'Batal',
      confirmVariant: 'danger',
      icon: 'trash',
      onConfirm: async () => {
        setStudents((prev) => prev.filter((s) => (s.regional || '').trim() !== regionName));
        setSelectedPreviewRegions((prev) => prev.filter((r) => r !== regionName));
        await api.deleteRegion(regionName);
      },
    });
  };

  const handleClearAll = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Reset & Kosongkan Seluruh Data',
      message: `PERINGATAN: Semua data siswa (${students.length} siswa) di seluruh Unit Operasi akan dikosongkan dari sistem.`,
      subMessage: 'Tindakan ini akan mengosongkan seluruh memori kerja sistem saat ini.',
      confirmLabel: 'Ya, Kosongkan Semua',
      cancelLabel: 'Batal',
      confirmVariant: 'danger',
      icon: 'trash',
      onConfirm: async () => {
        setStudents([]);
        setSelectedIds(new Set());
        setSelectedPreviewRegions([]);
        await api.clearAllStudents();
      },
    });
  };

  const handleResetToSample = () => {
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Muat Data Contoh',
      message: 'Apakah Anda ingin memuat ulang 6 data siswa sampel dari 2 Unit Operasi (PHKT DOBS & PHKT BSB)?',
      subMessage: 'Data contoh akan menggantikan data siswa yang sedang aktif di sistem saat ini.',
      confirmLabel: 'Ya, Muat Data Contoh',
      cancelLabel: 'Batal',
      confirmVariant: 'warning',
      icon: 'refresh',
      onConfirm: async () => {
        const res = await api.resetToSample();
        if (res) {
          setStudents(res.students);
          setSelectedIds(new Set(res.students.map((s) => s.id)));
          setSelectedPreviewRegions([]);
          setOrderConfig(res.orderConfig);
        } else {
          setStudents(SAMPLE_STUDENTS);
          setSelectedIds(new Set(SAMPLE_STUDENTS.map((s) => s.id)));
          setSelectedPreviewRegions([]);
        }
      },
    });
  };

  // Student CRUD
  const handleOpenEditStudent = (student: StudentData) => {
    setEditingStudent(student);
    setIsEditModalOpen(true);
  };

  const handleAddNewStudent = () => {
    const newStudent: StudentData = {
      id: `std-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      code: '',
      regional: '',
      no: students.length + 1,
      namaSekolah: '',
      jenjang: '',
      nama: '',
      jenisKelamin: '',
      kelas: '',
      ukBajuMP: '',
      pjgBajuMP: '',
      ukBawahanMP: '',
      pjgBawahanMP: '',
      rokCelanaMP: '',
      siagaPenggalang: '',
      ukBajuPP: '',
      pjgBajuPP: '',
      ukBawahanPP: '',
      pjgBawahanPP: '',
      rokCelanaPP: '',
      sepatu: '',
    };
    setEditingStudent(newStudent);
    setIsEditModalOpen(true);
  };

  const handleSaveStudent = async (updated: StudentData) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === updated.id);
      if (exists) {
        return prev.map((s) => (s.id === updated.id ? updated : s));
      } else {
        return [updated, ...prev];
      }
    });
    setSelectedIds((prev) => new Set(prev).add(updated.id));
    setEditingStudent(null);
    setIsEditModalOpen(false);
    await api.updateStudent(updated);
  };

  const handleDeleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    const studentName = target?.nama || 'Siswa ini';
    const studentCode = target?.code || '';

    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Hapus Data Siswa',
      message: `Apakah Anda yakin ingin menghapus data siswa "${studentName}" (${studentCode}) dari sistem?`,
      subMessage: 'Tindakan ini tidak dapat dibatalkan. Kartu siswa akan dihapus dari antrean cetak.',
      confirmLabel: 'Ya, Hapus Data',
      cancelLabel: 'Batal',
      confirmVariant: 'danger',
      icon: 'trash',
      onConfirm: async () => {
        setStudents((prev) => prev.filter((s) => s.id !== id));
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        await api.deleteStudent(id);
      },
    });
  };

  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setConfirmDialog({
      isOpen: true,
      title: 'Konfirmasi Hapus Data Terpilih',
      message: `Apakah Anda yakin ingin menghapus ${selectedIds.size} data siswa yang dipilih sekaligus?`,
      subMessage: 'Semua siswa yang dicentang akan dihapus secara permanen dari sistem.',
      confirmLabel: `Ya, Hapus ${selectedIds.size} Siswa`,
      cancelLabel: 'Batal',
      confirmVariant: 'danger',
      icon: 'trash',
      onConfirm: async () => {
        const ids = Array.from(selectedIds);
        setStudents((prev) => prev.filter((s) => !selectedIds.has(s.id)));
        setSelectedIds(new Set());
        await api.deleteBulkStudents(ids);
      },
    });
  };

  const handleUpdateConfig = (newConfig: OrderConfig) => {
    setOrderConfig(newConfig);
    api.saveConfig(newConfig);
  };

  // Selection handlers in active preview regions
  const handleToggleSelectStudent = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSelectAllStudentsInActiveRegions = () => {
    const previewRegionSet = new Set(selectedPreviewRegions);
    const targetStudents =
      selectedPreviewRegions.length > 0
        ? students.filter((s) => previewRegionSet.has((s.regional || '').trim()))
        : students;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      targetStudents.forEach((s) => next.add(s.id));
      return next;
    });
  };

  const handleDeselectAllStudentsInActiveRegions = () => {
    const previewRegionSet = new Set(selectedPreviewRegions);
    const targetStudents =
      selectedPreviewRegions.length > 0
        ? students.filter((s) => previewRegionSet.has((s.regional || '').trim()))
        : students;

    setSelectedIds((prev) => {
      const next = new Set(prev);
      targetStudents.forEach((s) => next.delete(s.id));
      return next;
    });
  };

  // Navigation helpers
  const handleNavigateToManage = (regionFilter?: string) => {
    if (regionFilter) {
      setManageRegionFilter(regionFilter);
    } else {
      setManageRegionFilter('all');
    }
    setActiveTab('manage-data');
  };

  const handleNavigateToPreview = (regionToSelect?: string) => {
    if (regionToSelect === 'all') {
      setSelectedPreviewRegions(existingRegionNames);
    } else if (regionToSelect) {
      setSelectedPreviewRegions([regionToSelect]);
    } else {
      if (selectedPreviewRegions.length === 0) {
        setSelectedPreviewRegions(existingRegionNames);
      }
    }
    setActiveTab('print-preview');
  };

  // ----------------------------------------------------
  // Printing Execution
  // ----------------------------------------------------
  // Printable list calculation for print media
  const mediaPrintStudents = useMemo(() => {
    // If a dedicated print target is explicitly triggered
    if (customPrintStudents !== null) {
      return customPrintStudents;
    }

    // If regions are selected in preview tab, respect them
    if (selectedPreviewRegions.length > 0) {
      const set = new Set(selectedPreviewRegions);
      return students.filter((s) => set.has((s.regional || 'Tanpa Region').trim()));
    }

    // Default fallback: all students
    return students;
  }, [students, selectedPreviewRegions, customPrintStudents]);

  // Actual sheets sent to @media print
  const printSheetChunks = useMemo(() => {
    const chunks: StudentData[][] = [];
    for (let i = 0; i < mediaPrintStudents.length; i += 4) {
      chunks.push(mediaPrintStudents.slice(i, i + 4));
    }
    return chunks;
  }, [mediaPrintStudents]);

  const triggerPrint = (
    scope: 'all' | 'selected' | 'single',
    customListOrSingle?: StudentData[] | StudentData
  ) => {
    let targets: StudentData[] = [];

    if (Array.isArray(customListOrSingle)) {
      targets = customListOrSingle;
    } else if (customListOrSingle) {
      targets = [customListOrSingle];
    } else if (scope === 'selected' && selectedIds.size > 0) {
      targets = students.filter((s) => selectedIds.has(s.id));
    } else if (selectedPreviewRegions.length > 0) {
      const set = new Set(selectedPreviewRegions);
      targets = students.filter((s) => set.has((s.regional || 'Tanpa Region').trim()));
    } else {
      targets = students;
    }

    if (targets.length === 0) {
      targets = students;
    }

    setCustomPrintStudents(targets);

    // Give browser brief time to recalculate DOM with targets, then trigger print
    setTimeout(() => {
      try {
        window.focus();
        window.print();
      } catch (err) {
        console.error('Print trigger failed:', err);
      }
    }, 150);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans">
      {/* ----------------- PERTAMINA BRAND TRI-COLOR STRIPE ----------------- */}
      <div className={`no-print ${themeCfg.stripeClass}`} />

      {/* ----------------- TOP NAVBAR (NO-PRINT) ----------------- */}
      <header className="no-print bg-gradient-to-r from-[#002D59] via-[#00488B] to-[#005BAC] text-white border-b border-white/10 sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          {/* Brand Identity */}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/10 border border-white/20 rounded-xl text-white shadow-inner flex items-center justify-center">
              <PackageCheck className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-black tracking-tight text-white leading-tight">
                Label QC Seragam
              </h1>
              <p className="text-xs text-blue-100/90 font-medium">
                Pertamina Hulu Indonesia
              </p>
            </div>
          </div>

          {/* Quick Header Actions & Live Sync */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Database status and manual sync button */}
            <div className="flex items-center space-x-2 bg-black/25 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/20 text-xs">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  syncStatus === 'synced'
                    ? 'bg-emerald-400 ring-2 ring-emerald-400/40'
                    : syncStatus === 'syncing'
                    ? 'bg-amber-400 animate-ping'
                    : 'bg-red-400'
                }`}
              />
              <span className="text-xs font-semibold text-white/95">
                {syncStatus === 'synced'
                  ? 'Database Terhubung'
                  : syncStatus === 'syncing'
                  ? 'Menyinkronkan...'
                  : 'Mode Offline'}
              </span>
              {lastSyncTime && (
                <span className="text-[11px] text-blue-200 hidden sm:inline">
                  ({lastSyncTime})
                </span>
              )}
              <button
                type="button"
                onClick={handleManualSync}
                title="Segarkan data dari database server"
                className="p-1 text-white/80 hover:text-white rounded-lg transition ml-0.5 hover:bg-white/10"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    syncStatus === 'syncing' ? 'animate-spin text-amber-300' : ''
                  }`}
                />
              </button>
            </div>

            {/* Quick KPI badge */}
            <div className="text-xs text-white/95 bg-black/25 px-3 py-1.5 rounded-xl border border-white/20 flex items-center space-x-2">
              <span>Total:</span>
              <span className="font-black text-amber-300">{students.length} Siswa</span>
              <span>•</span>
              <span className="font-semibold text-blue-100">{regionStats.length} Region</span>
            </div>

            {/* Action buttons */}
            <button
              type="button"
              onClick={handleResetToSample}
              title="Muat data contoh multi-region untuk pengujian"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold text-white bg-white/15 hover:bg-white/25 rounded-xl border border-white/25 transition shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Muat Contoh</span>
            </button>

            {students.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                title="Kosongkan semua data dari sistem"
                className="inline-flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-red-200 hover:text-white hover:bg-red-600/30 rounded-xl border border-red-400/30 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ----------------- ENTERPRISE WORKSPACE NAVIGATION ----------------- */}
      <nav className="no-print bg-white border-b border-neutral-200 shadow-xs sticky top-[69px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3">
            {/* Tab 1: Input Data Excel */}
            <button
              type="button"
              onClick={() => setActiveTab('input-data')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                activeTab === 'input-data'
                  ? 'border-[#005BAC] bg-blue-50/80 shadow-xs ring-2 ring-[#005BAC]/20'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition ${
                    activeTab === 'input-data'
                      ? 'bg-[#005BAC] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold ${
                        activeTab === 'input-data' ? 'text-[#005BAC]' : 'text-neutral-900'
                      }`}
                    >
                      Input Data Excel
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    Tempel tabel spreadsheet data siswa
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  students.length > 0
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {students.length > 0 ? `${students.length} Siswa` : 'Kosong'}
              </span>
            </button>

            {/* Tab 2: Kelola & Pemeriksaan Data */}
            <button
              type="button"
              onClick={() => setActiveTab('manage-data')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                activeTab === 'manage-data'
                  ? 'border-[#005BAC] bg-blue-50/80 shadow-xs ring-2 ring-[#005BAC]/20'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition ${
                    activeTab === 'manage-data'
                      ? 'bg-[#005BAC] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <ListFilter className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold ${
                        activeTab === 'manage-data' ? 'text-[#005BAC]' : 'text-neutral-900'
                      }`}
                    >
                      Kelola & Pemeriksaan Data
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    Verifikasi ukuran seragam & edit siswa
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  students.length > 0
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {regionStats.length} Unit
              </span>
            </button>

            {/* Tab 3: Pratinjau & Cetak A4 */}
            <button
              type="button"
              onClick={() => setActiveTab('print-preview')}
              className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all text-left cursor-pointer ${
                activeTab === 'print-preview'
                  ? 'border-[#005BAC] bg-blue-50/80 shadow-xs ring-2 ring-[#005BAC]/20'
                  : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition ${
                    activeTab === 'print-preview'
                      ? 'bg-[#ED1C24] text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700'
                  }`}
                >
                  <Printer className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-xs font-bold ${
                        activeTab === 'print-preview' ? 'text-[#005BAC]' : 'text-neutral-900'
                      }`}
                    >
                      Pratinjau & Cetak Lembar A4
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-500 line-clamp-1">
                    Cetak multi-regional (4 kartu per lembar A4)
                  </p>
                </div>
              </div>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                  students.length > 0
                    ? 'bg-amber-100 text-amber-900 border border-amber-200 font-black'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {students.length > 0
                  ? `${Math.ceil(students.length / 4)} Lembar A4`
                  : 'Siap Cetak'}
              </span>
            </button>
          </div>
        </div>
      </nav>

      {/* ----------------- TAB CONTENT CONTAINER (SCREEN ONLY) ----------------- */}
      <main className="no-print max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* TAB 1: INPUT DATA EXCEL */}
        {activeTab === 'input-data' && (
          <InputExcelView
            existingStudents={students}
            onSaveData={handleSaveImportedData}
            onDeleteRegion={handleDeleteRegion}
            onClearAll={handleClearAll}
            onNavigateToManage={handleNavigateToManage}
            onNavigateToPreview={handleNavigateToPreview}
            theme={currentTheme}
          />
        )}

        {/* TAB 2: KELOLA & EDIT DATA */}
        {activeTab === 'manage-data' && (
          <ManageDataView
            students={students}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelectStudent}
            onSelectAll={() => setSelectedIds(new Set(students.map((s) => s.id)))}
            onDeselectAll={() => setSelectedIds(new Set())}
            onDeleteStudent={handleDeleteStudent}
            onDeleteSelected={handleDeleteSelected}
            onPreviewStudent={(st) => setInspectStudent(st)}
            onEditStudent={handleOpenEditStudent}
            onAddNewStudent={handleAddNewStudent}
            onNavigateToPreview={handleNavigateToPreview}
            onNavigateToInput={() => setActiveTab('input-data')}
            initialRegionFilter={manageRegionFilter}
            theme={currentTheme}
          />
        )}

        {/* TAB 3: PRATINJAU & CETAK A4 */}
        {activeTab === 'print-preview' && (
          <PrintPreviewView
            students={students}
            orderConfig={orderConfig}
            onUpdateOrderConfig={handleUpdateConfig}
            selectedPreviewRegions={selectedPreviewRegions}
            onSelectPreviewRegions={setSelectedPreviewRegions}
            selectedStudentIds={selectedIds}
            onToggleSelectStudent={handleToggleSelectStudent}
            onSelectAllStudentsInActiveRegions={handleSelectAllStudentsInActiveRegions}
            onDeselectAllStudentsInActiveRegions={handleDeselectAllStudentsInActiveRegions}
            onInspectStudent={(st) => setInspectStudent(st)}
            onEditStudent={handleOpenEditStudent}
            onTriggerPrint={triggerPrint}
            onNavigateToInput={() => setActiveTab('input-data')}
            theme={currentTheme}
          />
        )}
      </main>

      {/* ----------------- DEDICATED PRINT CONTAINER (MEDIA PRINT ONLY) ----------------- */}
      <div className="print-container w-full bg-white text-black p-0 m-0">
        {printSheetChunks.map((sheetStudents, sheetIdx) => (
          <A4PrintSheet
            key={sheetIdx}
            students={sheetStudents}
            sheetIndex={sheetIdx}
            totalSheets={printSheetChunks.length}
            orderConfig={orderConfig}
            showCutGuides={orderConfig.showCutGuides}
          />
        ))}
      </div>

      {/* ----------------- SHARED MODALS ----------------- */}
      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingStudent(null);
        }}
        student={editingStudent}
        onSave={handleSaveStudent}
        existingRegions={existingRegionNames}
      />

      {/* Single Student Card Inspection Modal */}
      <SingleCardModal
        student={inspectStudent}
        orderConfig={orderConfig}
        onClose={() => setInspectStudent(null)}
        onPrintSingle={(st) => triggerPrint('single', st)}
        onEditStudent={handleOpenEditStudent}
      />

      {/* Enterprise Double Confirmation Dialog */}
      <ConfirmDialog
        config={confirmDialog}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}

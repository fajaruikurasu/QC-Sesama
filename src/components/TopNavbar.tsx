import React from 'react';
import {
  Printer,
  Download,
  Save,
  ChevronUp,
  ChevronDown,
  RefreshCw,
  Database,
  Menu,
  Sparkles
} from 'lucide-react';

interface TopNavbarProps {
  isFormVisible: boolean;
  onToggleForm: () => void;
  onSaveHistory: () => void;
  onDownloadPDF: () => void;
  onPrintPDF: () => void;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncTime: string;
  onManualSync: () => void;
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  isFormVisible,
  onToggleForm,
  onSaveHistory,
  onDownloadPDF,
  onPrintPDF,
  syncStatus,
  lastSyncTime,
  onManualSync,
  onToggleSidebar,
  isSidebarCollapsed,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 px-4 sm:px-6 py-3 sticky top-0 z-20 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left Title Area */}
        <div className="flex items-center space-x-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
              title={isSidebarCollapsed ? 'Buka Sidebar' : 'Sembunyikan Sidebar'}
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">
              SESAMA LOGISTICS STUDIO
            </div>
            <div className="flex items-center space-x-2.5 flex-wrap">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                Generator Label Dus Kargo
              </h1>
              <span className="bg-red-50 text-[#ED1B24] border border-red-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                A4 PORTRAIT • 4 KOLI PER LEMBAR
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2 flex-wrap">
          {/* Database Live status indicator */}
          <div
            className="hidden xl:flex items-center space-x-1.5 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200 text-[11px] text-slate-600"
            title="Database terhubung otomatis antar-perangkat"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-red-500'
              }`}
            />
            <span className="font-semibold text-slate-700">
              {syncStatus === 'synced' ? 'Tersinkron' : syncStatus === 'syncing' ? 'Sinkron...' : 'Offline'}
            </span>
            <button
              type="button"
              onClick={onManualSync}
              className="p-0.5 hover:text-slate-900 rounded"
              title="Segarkan dari database"
            >
              <RefreshCw
                className={`w-3 h-3 ${syncStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`}
              />
            </button>
          </div>

          {/* Button 1: Toggle Form */}
          <button
            type="button"
            onClick={onToggleForm}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition"
          >
            {isFormVisible ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                <span>Sembunyikan Form</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                <span>Tampilkan Form</span>
              </>
            )}
          </button>

          {/* Button 2: Simpan Riwayat */}
          <button
            type="button"
            onClick={onSaveHistory}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition"
            title="Simpan perubahan saat ini ke database & riwayat"
          >
            <Save className="w-3.5 h-3.5 text-slate-600" />
            <span>Simpan Riwayat</span>
          </button>

          {/* Button 3: Unduh PDF */}
          <button
            type="button"
            onClick={onDownloadPDF}
            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#0070BA] hover:bg-[#005ba3] text-white rounded-lg text-xs font-bold shadow-xs transition"
            title="Simpan berkas lembar A4 ke PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh PDF</span>
          </button>

          {/* Button 4: Cetak Label Dus (PDF) */}
          <button
            type="button"
            onClick={onPrintPDF}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 bg-[#ED1B24] hover:bg-[#d4141d] text-white rounded-lg text-xs font-bold shadow-xs transition"
            title="Cetak langsung lembar A4 format 4 label per lembar"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Label Dus (PDF)</span>
          </button>
        </div>
      </div>
    </header>
  );
};

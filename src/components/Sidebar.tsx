import React from 'react';
import {
  FileBox,
  FileSpreadsheet,
  Truck,
  Download,
  Settings,
  Archive,
  History,
  Code2,
  ExternalLink,
  CheckCircle2,
  ChevronRight,
  Database
} from 'lucide-react';

export type ActiveSidebarMenu =
  | 'label-dus'
  | 'manifest-induk'
  | 'label-pengiriman'
  | 'template-excel'
  | 'master-preset'
  | 'penyimpanan-pdf'
  | 'riwayat-dokumen';

interface SidebarProps {
  activeMenu: ActiveSidebarMenu;
  onSelectMenu: (menu: ActiveSidebarMenu) => void;
  onOpenPresets: () => void;
  onDownloadTemplate: () => void;
  onOpenIframeModal: () => void;
  studentCount: number;
  regionCount: number;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu,
  onSelectMenu,
  onOpenPresets,
  onDownloadTemplate,
  onOpenIframeModal,
  studentCount,
  regionCount,
  collapsed = false,
}) => {
  return (
    <aside
      className={`bg-[#0B132B] text-slate-300 flex flex-col justify-between shrink-0 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-16' : 'w-64'
      } border-r border-slate-800/80`}
      style={{ minHeight: '100vh' }}
    >
      {/* Top Brand & Header */}
      <div>
        <div className="p-4 pb-2">
          {/* White Brand Card */}
          {!collapsed ? (
            <div className="bg-white rounded-lg p-2.5 px-3 shadow-md border border-slate-200/20 text-center">
              <div className="flex items-center justify-center space-x-2">
                {/* Pertamina style geometric flame/leaf logo */}
                <div className="flex items-center space-x-0.5">
                  <div className="w-2.5 h-6 bg-[#ED1B24] rounded-xs transform -skew-x-12" />
                  <div className="w-2.5 h-6 bg-[#00A651] rounded-xs transform -skew-x-12" />
                  <div className="w-2.5 h-6 bg-[#005BAA] rounded-xs transform -skew-x-12" />
                </div>
                <div className="text-left leading-none pl-1">
                  <div className="text-lg font-black tracking-wider text-slate-900 font-sans">
                    SESAMA
                  </div>
                  <div className="text-[8px] font-bold text-slate-500 tracking-wider">
                    PERTAMINA LOGISTICS
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg p-2 shadow-md text-center flex justify-center">
              <div className="flex items-center space-x-0.5">
                <div className="w-1.5 h-5 bg-[#ED1B24] rounded-xs transform -skew-x-12" />
                <div className="w-1.5 h-5 bg-[#00A651] rounded-xs transform -skew-x-12" />
                <div className="w-1.5 h-5 bg-[#005BAA] rounded-xs transform -skew-x-12" />
              </div>
            </div>
          )}

          {/* Subtitle tag & Live indicator */}
          {!collapsed && (
            <div className="mt-2.5 px-1 flex items-center justify-between text-[11px] font-bold">
              <span className="text-slate-300 tracking-wider flex items-center gap-1">
                <span className="text-[#00A651]">◆</span> LOGISTICS STUDIO
              </span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[9px] text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00A651] animate-pulse" />
                LIVE
              </span>
            </div>
          )}

          {/* Pertamina Signature 3-Color Triple Stripe */}
          <div className="mt-2.5 h-1 w-full flex rounded-full overflow-hidden shadow-xs">
            <div className="w-1/3 bg-[#ED1B24]" />
            <div className="w-1/3 bg-[#00A651]" />
            <div className="w-1/3 bg-[#005BAA]" />
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="p-3 space-y-4 text-xs">
          {/* SECTION 1: MENU DOKUMEN */}
          <div>
            {!collapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                Menu Dokumen
              </div>
            )}
            <div className="space-y-1">
              {/* Item 1: Label Dus Kargo */}
              <button
                type="button"
                onClick={() => onSelectMenu('label-dus')}
                className={`w-full flex items-center text-left p-2 rounded-lg transition group ${
                  activeMenu === 'label-dus'
                    ? 'bg-slate-800/90 text-white border-l-4 border-[#ED1B24] shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title="Label Dus Kargo (4 Koli / Lembar A4)"
              >
                <div
                  className={`p-1.5 rounded-md mr-2.5 ${
                    activeMenu === 'label-dus'
                      ? 'bg-[#ED1B24] text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <FileBox className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs leading-snug truncate">
                      Label Dus Kargo
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                      4 Koli / Lembar A4
                    </div>
                  </div>
                )}
              </button>

              {/* Item 2: Manifest Induk */}
              <button
                type="button"
                onClick={() => onSelectMenu('manifest-induk')}
                className={`w-full flex items-center text-left p-2 rounded-lg transition group ${
                  activeMenu === 'manifest-induk'
                    ? 'bg-slate-800/90 text-white border-l-4 border-[#005BAA] shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title="Manifest Induk (Rekapitulasi Distribusi)"
              >
                <div
                  className={`p-1.5 rounded-md mr-2.5 ${
                    activeMenu === 'manifest-induk'
                      ? 'bg-[#005BAA] text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs leading-snug truncate">
                      Manifest Induk
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                      Rekapitulasi Distribusi
                    </div>
                  </div>
                )}
              </button>

              {/* Item 3: Label Pengiriman */}
              <button
                type="button"
                onClick={() => onSelectMenu('label-pengiriman')}
                className={`w-full flex items-center text-left p-2 rounded-lg transition group ${
                  activeMenu === 'label-pengiriman'
                    ? 'bg-slate-800/90 text-white border-l-4 border-[#00A651] shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title="Label Pengiriman (A4 Landscape Kargo)"
              >
                <div
                  className={`p-1.5 rounded-md mr-2.5 ${
                    activeMenu === 'label-pengiriman'
                      ? 'bg-[#00A651] text-white'
                      : 'bg-slate-800 text-slate-400 group-hover:text-white'
                  }`}
                >
                  <Truck className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs leading-snug truncate">
                      Label Pengiriman
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                      A4 Landscape Kargo
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 2: FORMAT & TEMPLATE */}
          <div>
            {!collapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                Format & Template
              </div>
            )}
            <button
              type="button"
              onClick={onDownloadTemplate}
              className="w-full flex items-center text-left p-2 rounded-lg transition text-slate-300 hover:bg-slate-800/50 hover:text-white group"
              title="Unduh Format Input Data Excel"
            >
              <div className="p-1.5 rounded-md mr-2.5 bg-slate-800 text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Download className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs leading-snug truncate">
                    Template Excel
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                    Unduh Format Input Data
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* SECTION 3: MASTER DATA & PRESET */}
          <div>
            {!collapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                Master Data & Preset
              </div>
            )}
            <button
              type="button"
              onClick={onOpenPresets}
              className="w-full flex items-center text-left p-2 rounded-lg transition text-slate-300 hover:bg-slate-800/50 hover:text-white group"
              title="Master Preset Pemesan"
            >
              <div className="p-1.5 rounded-md mr-2.5 bg-slate-800 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                <Settings className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs leading-snug truncate">
                    Master Preset Pemesan
                  </div>
                  <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                    Auto-fill & Data Master
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* SECTION 4: PENYIMPANAN & ARSIP */}
          <div>
            {!collapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                Penyimpanan & Arsip
              </div>
            )}
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => onSelectMenu('penyimpanan-pdf')}
                className={`w-full flex items-center text-left p-2 rounded-lg transition group ${
                  activeMenu === 'penyimpanan-pdf'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title="Penyimpanan Database & PDF"
              >
                <div className="p-1.5 rounded-md mr-2.5 bg-slate-800 text-amber-400 group-hover:text-amber-300">
                  <Archive className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs leading-snug truncate">
                      Penyimpanan File PDF
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                      Simpan & Cetak Berkas PDF
                    </div>
                  </div>
                )}
              </button>

              <button
                type="button"
                onClick={() => onSelectMenu('riwayat-dokumen')}
                className={`w-full flex items-center text-left p-2 rounded-lg transition group ${
                  activeMenu === 'riwayat-dokumen'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
                title="Riwayat Dokumen"
              >
                <div className="p-1.5 rounded-md mr-2.5 bg-slate-800 text-amber-500 group-hover:text-amber-300">
                  <History className="w-4 h-4" />
                </div>
                {!collapsed && (
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs leading-snug truncate">
                      Riwayat Dokumen
                    </div>
                    <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                      Arsip Hasil Generator
                    </div>
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* SECTION 5: IFRAME EMBED (Untuk Hubungkan ke Web Utama) */}
          <div>
            {!collapsed && (
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-1.5">
                Integrasi Web
              </div>
            )}
            <button
              type="button"
              onClick={onOpenIframeModal}
              className="w-full flex items-center text-left p-2 rounded-lg transition bg-blue-950/40 hover:bg-blue-900/60 border border-blue-800/50 text-blue-200 group"
              title="Salin Kode Iframe untuk Web Utama"
            >
              <div className="p-1.5 rounded-md mr-2.5 bg-blue-900/80 text-blue-300 group-hover:text-white">
                <Code2 className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs leading-snug truncate text-white">
                    Integrasi Iframe
                  </div>
                  <div className="text-[10px] text-blue-300 leading-none mt-0.5">
                    Hubungkan ke Web Utama
                  </div>
                </div>
              )}
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Footer */}
      <div className="p-3 border-t border-slate-800/80">
        {!collapsed ? (
          <div className="bg-[#070D1E] rounded-md p-2.5 text-center border border-slate-800 text-[11px] text-slate-400">
            dibuat oleh <span className="font-bold text-white tracking-wider">イクラス</span>
          </div>
        ) : (
          <div className="text-center font-bold text-white text-[10px]">
            イクラス
          </div>
        )}
      </div>
    </aside>
  );
};

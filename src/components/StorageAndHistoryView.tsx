import React from 'react';
import { StudentData, OrderConfig } from '../types';
import {
  Archive,
  History,
  Database,
  Printer,
  Download,
  CheckCircle2,
  RefreshCw,
  FileSpreadsheet,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

interface StorageAndHistoryViewProps {
  viewType: 'storage' | 'history';
  students: StudentData[];
  orderConfig: OrderConfig;
  syncStatus: 'synced' | 'syncing' | 'offline';
  lastSyncTime: string;
  onManualSync: () => void;
  onTriggerPrint: () => void;
  onResetSample: () => void;
}

export const StorageAndHistoryView: React.FC<StorageAndHistoryViewProps> = ({
  viewType,
  students,
  orderConfig,
  syncStatus,
  lastSyncTime,
  onManualSync,
  onTriggerPrint,
  onResetSample,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div
            className={`p-2.5 rounded-lg text-white ${
              viewType === 'storage' ? 'bg-[#0070BA]' : 'bg-amber-600'
            }`}
          >
            {viewType === 'storage' ? (
              <Archive className="w-5 h-5" />
            ) : (
              <History className="w-5 h-5" />
            )}
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-800">
              {viewType === 'storage'
                ? 'Penyimpanan Database & Berkas PDF'
                : 'Riwayat Dokumen & Arsip Cetak'}
            </h2>
            <p className="text-xs text-slate-500">
              {viewType === 'storage'
                ? 'Kelola sinkronisasi otomatis antar-perangkat dan penyimpanan berkas kargo'
                : 'Arsip histori pembuatan label dus kargo dan kartu pemeriksaan seragam'}
            </p>
          </div>
        </div>

        {/* Sync Status Card */}
        <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-3">
            <span
              className={`w-3 h-3 rounded-full ${
                syncStatus === 'synced'
                  ? 'bg-emerald-500'
                  : syncStatus === 'syncing'
                  ? 'bg-amber-500 animate-ping'
                  : 'bg-red-500'
              }`}
            />
            <div>
              <div className="font-bold text-slate-800">
                Status Database Terpusat:{' '}
                {syncStatus === 'synced'
                  ? 'Aktif & Tersinkron'
                  : syncStatus === 'syncing'
                  ? 'Menyinkronkan...'
                  : 'Mode Offline'}
              </div>
              <div className="text-slate-500 text-[11px]">
                {lastSyncTime
                  ? `Sinkronisasi terakhir: ${lastSyncTime}`
                  : 'Belum ada rekaman sinkronisasi'}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onManualSync}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg shadow-2xs transition"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${syncStatus === 'syncing' ? 'animate-spin text-emerald-600' : ''}`}
              />
              <span>Sinkronkan Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot / Summary Records */}
      <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6 space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Ringkasan Berkas Aktif
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-slate-500 mb-1">Total Data Koli / Siswa</div>
            <div className="text-2xl font-black text-slate-900">{students.length}</div>
            <div className="text-[11px] text-slate-400 mt-1">
              {Math.ceil(students.length / 4)} Lembar A4 (4 koli/lembar)
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-slate-500 mb-1">Unit Operasi / Pemesan</div>
            <div className="text-sm font-bold text-slate-800 truncate">
              {orderConfig.namaPemesan || 'Belum Ditentukan'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Tema:{' '}
              <span className="font-semibold uppercase text-slate-700">
                {orderConfig.themeColor || 'Merah'}
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-lg p-3 bg-slate-50">
            <div className="text-slate-500 mb-1">Nomor PO & Dokumen</div>
            <div className="text-sm font-bold text-slate-800">
              {orderConfig.nomorPO || 'PO-QC-2026-001'}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Tgl: {orderConfig.tanggal || new Date().toISOString().split('T')[0]}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onTriggerPrint}
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#ED1B24] hover:bg-[#d4141d] text-white font-bold rounded-lg text-xs shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak Lembar A4 Langsung</span>
          </button>

          <button
            type="button"
            onClick={onResetSample}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Muat Data Contoh Pertamina</span>
          </button>
        </div>
      </div>
    </div>
  );
};

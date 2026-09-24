import React from 'react';
import { X, Table, CheckCircle2, Download } from 'lucide-react';
import { EXCEL_TEMPLATE_COLUMNS } from '../utils/excelTemplate';

interface ColumnOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadTemplate: () => void;
}

export const ColumnOrderModal: React.FC<ColumnOrderModalProps> = ({
  isOpen,
  onClose,
  onDownloadTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Table className="w-5 h-5 text-[#ED1B24]" />
            <h3 className="text-base font-bold text-slate-800">
              Urutan Standar 19 Kolom Excel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-lg p-3">
            <p className="font-semibold mb-1">
              📌 Sistem Cerdas Auto-Detect
            </p>
            <p className="text-amber-800">
              Bila kolom Excel Anda memiliki nama header yang sedikit berbeda, sistem tetap dapat mendeteksinya secara otomatis (misal: "Nama Siswa", "Nama Peserta", "L/P", "Gender"). Jika tanpa header, gunakan urutan standar di bawah ini:
            </p>
          </div>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-3 py-2 text-left w-12">No</th>
                  <th className="px-3 py-2 text-left">Nama Kolom</th>
                  <th className="px-3 py-2 text-left">Keterangan / Contoh Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                {EXCEL_TEMPLATE_COLUMNS.map((col, idx) => (
                  <tr key={col} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                    <td className="px-3 py-1.5 font-bold text-slate-500">{idx + 1}</td>
                    <td className="px-3 py-1.5 font-bold text-slate-800">{col}</td>
                    <td className="px-3 py-1.5 text-slate-600 font-sans text-xs">
                      {idx === 0 && 'Regional 3/Zona 10/ PHKT DOBS'}
                      {idx === 1 && '1, 2, 3, ... (Nomor urut)'}
                      {idx === 2 && 'SMP 5 Penajam, SDN 001 Sepaku'}
                      {idx === 3 && 'SD / SMP'}
                      {idx === 4 && 'Nama lengkap siswa'}
                      {idx === 5 && 'L (Laki-laki) atau P (Perempuan)'}
                      {idx === 6 && '1 sampai 9'}
                      {idx === 7 && 'Ukuran seragam nasional (e.g. 7, 8, 9, 10)'}
                      {idx === 8 && 'Panjang atau Pendek'}
                      {idx === 9 && 'Ukuran bawahan nasional (e.g. 8, 9, 10)'}
                      {idx === 10 && 'Panjang atau Pendek'}
                      {idx === 11 && 'Rok atau Celana'}
                      {idx === 12 && 'Siaga atau Penggalang'}
                      {idx === 13 && 'Ukuran baju pramuka (e.g. 9)'}
                      {idx === 14 && 'Panjang atau Pendek'}
                      {idx === 15 && 'Ukuran bawahan pramuka (e.g. 10)'}
                      {idx === 16 && 'Panjang atau Pendek'}
                      {idx === 17 && 'Rok atau Celana'}
                      {idx === 18 && 'Nomor sepatu (e.g. 38, 39, 40)'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onDownloadTemplate}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-xs flex items-center gap-1.5 shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Unduh File Excel Template (.xlsx)</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 text-white font-semibold rounded text-xs hover:bg-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

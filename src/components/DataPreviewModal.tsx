import React, { useMemo } from 'react';
import { StudentData } from '../types';
import { ValidationIssue } from '../utils/studentLogic';
import { X, AlertTriangle, CheckCircle2, ChevronRight, Save } from 'lucide-react';

interface DataPreviewModalProps {
  isOpen: boolean;
  students: StudentData[];
  validationIssues: ValidationIssue[];
  appendMode: boolean;
  existingCount: number;
  onConfirm: () => void;
  onClose: () => void;
}

// Fields to display as columns in the preview table
const COLUMNS: { key: keyof StudentData; label: string; width: string }[] = [
  { key: 'regional',        label: 'Unit Operasi',    width: 'min-w-[140px]' },
  { key: 'no',              label: 'No',              width: 'min-w-[36px]'  },
  { key: 'namaSekolah',     label: 'Sekolah',         width: 'min-w-[110px]' },
  { key: 'jenjang',         label: 'Jenjang',         width: 'min-w-[56px]'  },
  { key: 'nama',            label: 'Nama',            width: 'min-w-[130px]' },
  { key: 'jenisKelamin',    label: 'JK',              width: 'min-w-[36px]'  },
  { key: 'kelas',           label: 'Kelas',           width: 'min-w-[44px]'  },
  { key: 'ukBajuMP',        label: 'Uk.Baju MP',      width: 'min-w-[72px]'  },
  { key: 'pjgBajuMP',       label: 'Lengan MP',       width: 'min-w-[72px]'  },
  { key: 'ukBawahanMP',     label: 'Uk.Bwh MP',       width: 'min-w-[72px]'  },
  { key: 'pjgBawahanMP',    label: 'Pjg.Bwh MP',      width: 'min-w-[72px]'  },
  { key: 'rokCelanaMP',     label: 'RC MP',           width: 'min-w-[60px]'  },
  { key: 'siagaPenggalang', label: 'Pramuka',         width: 'min-w-[80px]'  },
  { key: 'ukBajuPP',        label: 'Uk.Baju PP',      width: 'min-w-[72px]'  },
  { key: 'pjgBajuPP',       label: 'Lengan PP',       width: 'min-w-[72px]'  },
  { key: 'ukBawahanPP',     label: 'Uk.Bwh PP',       width: 'min-w-[72px]'  },
  { key: 'pjgBawahanPP',    label: 'Pjg.Bwh PP',      width: 'min-w-[72px]'  },
  { key: 'rokCelanaPP',     label: 'RC PP',           width: 'min-w-[60px]'  },
  { key: 'sepatu',          label: 'Sepatu',          width: 'min-w-[56px]'  },
  { key: 'code',            label: 'Kode',            width: 'min-w-[80px]'  },
];

export const DataPreviewModal: React.FC<DataPreviewModalProps> = ({
  isOpen,
  students,
  validationIssues,
  appendMode,
  existingCount,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  const hasIssues = validationIssues.length > 0;

  // Build a set of (rowIndex, fieldKey) for fast highlight lookup
  const issueSet = useMemo(() => {
    const s = new Set<string>();
    validationIssues.forEach(issue => s.add(`${issue.rowIndex}-${issue.fieldKey}`));
    return s;
  }, [validationIssues]);

  // Rows that have at least one issue
  const rowsWithIssues = useMemo(() => {
    return new Set(validationIssues.map(i => i.rowIndex));
  }, [validationIssues]);

  const isHighlighted = (rowIndex: number, fieldKey: string) =>
    issueSet.has(`${rowIndex}-${fieldKey}`);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-[96vw] flex flex-col" style={{ maxHeight: '92vh' }}>

        {/* Header */}
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-black text-neutral-900">Preview Data Sebelum Disimpan</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Periksa {students.length} baris data berikut — pastikan semua kolom terbaca dengan benar.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Validation Banner */}
        {hasIssues ? (
          <div className="mx-5 mt-4 shrink-0 bg-amber-50 border border-amber-300 rounded-xl p-3">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-black text-amber-800 mb-1">
                  ⚠️ Terdeteksi {validationIssues.length} data yang perlu diperiksa
                </p>
                <div className="space-y-0.5 max-h-[100px] overflow-y-auto pr-1">
                  {validationIssues.map((issue, idx) => (
                    <p key={idx} className="text-[10.5px] text-amber-700">
                      <span className="font-bold">Baris {issue.rowIndex + 1}</span> — {issue.studentName} |{' '}
                      <span className="font-semibold">{issue.field}</span>: &quot;{issue.value}&quot; → {issue.reason}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-5 mt-4 shrink-0 bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-bold text-emerald-800">
              Semua data lolos validasi — tidak ada masalah format yang terdeteksi.
            </p>
          </div>
        )}

        {/* Scrollable Table */}
        <div className="flex-1 overflow-auto mx-5 mt-3 mb-1 border border-neutral-200 rounded-xl">
          <table className="w-full text-[10.5px] border-collapse">
            <thead className="sticky top-0 z-10 bg-neutral-100 border-b border-neutral-300">
              <tr>
                <th className="px-2 py-1.5 text-left font-black text-neutral-600 min-w-[28px] border-r border-neutral-200">#</th>
                {COLUMNS.map(col => (
                  <th
                    key={col.key}
                    className={`px-2 py-1.5 text-left font-black text-neutral-600 whitespace-nowrap border-r border-neutral-200 ${col.width}`}
                  >
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {students.map((student, rowIdx) => {
                const rowHasIssue = rowsWithIssues.has(rowIdx);
                return (
                  <tr
                    key={student.id || rowIdx}
                    className={`border-b border-neutral-100 ${rowHasIssue ? 'bg-amber-50/60' : 'hover:bg-neutral-50'}`}
                  >
                    <td className="px-2 py-1 text-neutral-400 font-mono border-r border-neutral-100">{rowIdx + 1}</td>
                    {COLUMNS.map(col => {
                      const val = String(student[col.key] ?? '');
                      const bad = isHighlighted(rowIdx, col.key);
                      return (
                        <td
                          key={col.key}
                          className={`px-2 py-1 border-r border-neutral-100 whitespace-nowrap ${
                            bad
                              ? 'bg-red-100 text-red-700 font-bold rounded'
                              : 'text-neutral-800'
                          }`}
                        >
                          {val || <span className="text-neutral-300 italic">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-4 border-t border-neutral-200 flex items-center justify-between shrink-0 bg-neutral-50 rounded-b-2xl">
          <div className="text-xs text-neutral-500">
            {appendMode
              ? `${students.length} baris baru akan ditambahkan ke ${existingCount} data yang ada.`
              : `${students.length} baris baru akan menggantikan ${existingCount} data yang ada.`}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 bg-white border border-neutral-300 rounded-xl hover:bg-neutral-100 transition"
            >
              ← Kembali & Perbaiki
            </button>
            <button
              onClick={onConfirm}
              className={`px-5 py-2 text-xs font-black text-white rounded-xl shadow-sm transition flex items-center space-x-1.5 ${
                hasIssues
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{hasIssues ? 'Tetap Simpan' : 'Konfirmasi Simpan'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

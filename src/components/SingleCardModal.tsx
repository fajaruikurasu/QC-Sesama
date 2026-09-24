import React from 'react';
import { StudentData, OrderConfig } from '../types';
import { A6Card } from './A6Card';
import { X, Printer, Pencil } from 'lucide-react';

interface SingleCardModalProps {
  student: StudentData | null;
  orderConfig: OrderConfig;
  onClose: () => void;
  onPrintSingle: (student: StudentData) => void;
  onEditStudent?: (student: StudentData) => void;
}

export const SingleCardModal: React.FC<SingleCardModalProps> = ({
  student,
  orderConfig,
  onClose,
  onPrintSingle,
  onEditStudent,
}) => {
  if (!student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Pertamina Tri-Color Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#ED1C24] via-[#43B02A] to-[#005BAC]" />

        <div className="bg-white px-5 py-3.5 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center space-x-2.5">
            <span className="font-mono text-xs font-bold bg-blue-50 text-[#005BAC] border border-blue-200 px-2 py-0.5 rounded-lg">
              {student.code}
            </span>
            <span className="text-sm font-bold text-neutral-900 truncate max-w-[280px]">
              Kartu QC: {student.nama}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 bg-neutral-100 flex flex-col items-center justify-center">
          <div className="shadow-lg rounded-lg overflow-hidden bg-white max-w-[105mm] w-full">
            <A6Card student={student} orderConfig={orderConfig} />
          </div>
        </div>

        <div className="bg-neutral-50 px-5 py-3.5 border-t border-neutral-200 flex justify-between items-center">
          <div className="text-xs text-neutral-500">
            Format: A6 (105mm × 148mm)
          </div>
          <div className="flex items-center space-x-2">
            {onEditStudent && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onEditStudent(student);
                }}
                className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 bg-white border border-neutral-300 rounded-xl transition flex items-center space-x-1 cursor-pointer"
              >
                <Pencil className="w-3.5 h-3.5 text-neutral-600" />
                <span>Edit</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 bg-white border border-neutral-300 rounded-xl transition cursor-pointer"
            >
              Tutup
            </button>
            <button
              type="button"
              onClick={() => onPrintSingle(student)}
              className="px-4 py-1.5 text-xs font-bold text-white bg-[#005BAC] hover:bg-[#00488B] rounded-xl shadow-xs transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak Kartu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

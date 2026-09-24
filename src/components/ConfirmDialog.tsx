import React from 'react';
import { AlertTriangle, Trash2, Save, RotateCcw, AlertCircle, X } from 'lucide-react';

export interface ConfirmDialogConfig {
  isOpen: boolean;
  title: string;
  message: string;
  subMessage?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: 'danger' | 'primary' | 'warning';
  icon?: 'trash' | 'save' | 'refresh' | 'alert';
  onConfirm: () => void;
  onCancel?: () => void;
}

interface ConfirmDialogProps {
  config: ConfirmDialogConfig;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ config, onClose }) => {
  if (!config.isOpen) return null;

  const handleCancel = () => {
    if (config.onCancel) config.onCancel();
    onClose();
  };

  const handleConfirm = () => {
    config.onConfirm();
    onClose();
  };

  const variant = config.confirmVariant || 'primary';
  const iconType = config.icon || (variant === 'danger' ? 'trash' : 'alert');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Pertamina Tri-Color Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#ED1C24] via-[#43B02A] to-[#005BAC]" />

        <div className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start space-x-3.5">
              {/* Icon Container */}
              <div
                className={`p-3 rounded-xl shrink-0 border ${
                  variant === 'danger'
                    ? 'bg-red-50 text-[#ED1C24] border-red-200'
                    : variant === 'warning'
                    ? 'bg-amber-50 text-amber-600 border-amber-200'
                    : 'bg-blue-50 text-[#005BAC] border-blue-200'
                }`}
              >
                {iconType === 'trash' && <Trash2 className="w-5 h-5" />}
                {iconType === 'save' && <Save className="w-5 h-5" />}
                {iconType === 'refresh' && <RotateCcw className="w-5 h-5" />}
                {iconType === 'alert' && <AlertTriangle className="w-5 h-5" />}
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900 tracking-tight">
                  {config.title}
                </h3>
                <p className="text-xs text-neutral-600 mt-1.5 leading-relaxed">
                  {config.message}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCancel}
              className="text-neutral-400 hover:text-neutral-600 p-1 rounded-lg transition shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {config.subMessage && (
            <div className="mt-4 p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] text-neutral-500 font-medium">
              {config.subMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-end space-x-2.5 pt-4 border-t border-neutral-100">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 bg-white border border-neutral-300 rounded-xl transition cursor-pointer"
            >
              {config.cancelLabel || 'Batal'}
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className={`px-5 py-2 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center space-x-1.5 text-white ${
                variant === 'danger'
                  ? 'bg-[#ED1C24] hover:bg-[#c9141b]'
                  : variant === 'warning'
                  ? 'bg-amber-600 hover:bg-amber-700'
                  : 'bg-[#005BAC] hover:bg-[#00488B]'
              }`}
            >
              <span>{config.confirmLabel || 'Lanjutkan'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

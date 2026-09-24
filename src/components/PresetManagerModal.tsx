import React, { useState } from 'react';
import { MasterPreset } from '../types';
import { X, Plus, Trash2, Check, Building2, MapPin, School } from 'lucide-react';

interface PresetManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  presets: MasterPreset[];
  onSavePresets: (presets: MasterPreset[]) => void;
  onSelectPreset: (preset: MasterPreset) => void;
}

export const PresetManagerModal: React.FC<PresetManagerModalProps> = ({
  isOpen,
  onClose,
  presets,
  onSavePresets,
  onSelectPreset,
}) => {
  const [list, setList] = useState<MasterPreset[]>(presets);
  const [newName, setNewName] = useState('');
  const [newPemesan, setNewPemesan] = useState('');
  const [newSekolah, setNewSekolah] = useState('');
  const [newWilayah, setNewWilayah] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleAdd = () => {
    if (!newName.trim() || !newPemesan.trim()) {
      setErrorMsg('Nama Label Preset dan Pemesan / Unit Operasi wajib diisi.');
      return;
    }

    const newPreset: MasterPreset = {
      id: `preset-${Date.now()}`,
      name: newName.trim(),
      pemesan: newPemesan.trim(),
      sekolah: newSekolah.trim(),
      wilayah: newWilayah.trim(),
    };

    const updated = [...list, newPreset];
    setList(updated);
    onSavePresets(updated);
    setNewName('');
    setNewPemesan('');
    setNewSekolah('');
    setNewWilayah('');
    setErrorMsg('');
  };

  const handleDelete = (id: string) => {
    const updated = list.filter((p) => p.id !== id);
    setList(updated);
    onSavePresets(updated);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#ED1B24]" />
            <h3 className="text-base font-bold text-slate-800">
              Kelola Master Preset Pemesan & Wilayah
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
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Add Form */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 space-y-3">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#ED1B24]" />
              <span>Tambah Preset Baru</span>
            </div>

            {errorMsg && (
              <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Label Preset: *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: PHKT DOBS 2026"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Pemesan / Unit Operasi: *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Regional 3 / Zona 10 / PHKT DOBS"
                  value={newPemesan}
                  onChange={(e) => setNewPemesan(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Sekolah Default (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SMP 5 Penajam"
                  value={newSekolah}
                  onChange={(e) => setNewSekolah(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Wilayah / Keterangan (Opsional):
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Kab. Penajam Paser Utara | Kaltim"
                  value={newWilayah}
                  onChange={(e) => setNewWilayah(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#ED1B24] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={handleAdd}
                className="px-4 py-1.5 bg-[#ED1B24] hover:bg-[#d4141d] text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Simpan Preset</span>
              </button>
            </div>
          </div>

          {/* Preset List */}
          <div>
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Daftar Preset Tersimpan ({list.length})
            </div>
            <div className="space-y-2">
              {list.map((preset) => (
                <div
                  key={preset.id}
                  className="p-3 border border-slate-200 rounded-lg hover:border-slate-300 bg-white flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm text-slate-800 truncate">
                      {preset.name}
                    </div>
                    <div className="text-xs text-slate-600 truncate mt-0.5">
                      🏢 {preset.pemesan}
                    </div>
                    <div className="text-[11px] text-slate-500 flex flex-wrap gap-x-3 mt-1">
                      {preset.sekolah && (
                        <span className="flex items-center gap-1">
                          <School className="w-3 h-3 text-slate-400" />
                          {preset.sekolah}
                        </span>
                      )}
                      {preset.wilayah && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {preset.wilayah}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectPreset(preset);
                        onClose();
                      }}
                      className="px-2.5 py-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Gunakan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(preset.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded transition"
                      title="Hapus preset"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-lg hover:bg-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { StudentData } from '../types';
import { X, Save, UserCog, AlertCircle, Building2 } from 'lucide-react';

interface EditStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: StudentData | null;
  onSave: (updated: StudentData) => void;
  existingRegions: string[];
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onSave,
  existingRegions,
}) => {
  const [formData, setFormData] = useState<StudentData | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({ ...student });
      setErrorMsg('');
    } else {
      setFormData(null);
    }
  }, [student]);

  if (!isOpen || !formData) return null;

  const handleChange = (field: keyof StudentData, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama.trim()) {
      setErrorMsg('Nama siswa tidak boleh kosong.');
      return;
    }
    if (!formData.namaSekolah.trim()) {
      setErrorMsg('Nama sekolah tidak boleh kosong.');
      return;
    }
    if (!formData.regional.trim()) {
      setErrorMsg('Unit Operasi / Regional tidak boleh kosong.');
      return;
    }

    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Pertamina Tri-Color Accent Line */}
        <div className="h-1 bg-gradient-to-r from-[#ED1C24] via-[#43B02A] to-[#005BAC]" />

        {/* Header */}
        <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-neutral-200">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-blue-50 text-[#005BAC] border border-blue-200 rounded-xl shadow-2xs">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-neutral-900 tracking-tight">Edit Data Siswa</h2>
              <p className="text-xs text-neutral-500">
                Ubah informasi siswa, ukuran seragam, atau sesuaikan Unit Operasi/Region.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1.5 rounded-xl text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            {errorMsg && (
              <div className="flex items-center space-x-2 text-xs text-red-600 bg-red-50 border border-red-200 p-2.5 rounded-lg">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Section 1: Regional & Identitas Utama */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="text-xs font-black uppercase text-neutral-800 flex items-center space-x-1.5">
                <Building2 className="w-4 h-4 text-neutral-600" />
                <span>Unit Operasi & Identitas Siswa</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Unit Operasi / Regional <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.regional}
                    onChange={(e) => handleChange('regional', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  >
                    <option value="" disabled>Pilih Unit Operasi...</option>
                    {existingRegions.map((reg, idx) => (
                      <option key={idx} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Kode Siswa & No Urut
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleChange('code', e.target.value)}
                      placeholder="Kode"
                      className="w-full text-xs p-2 font-mono font-bold bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                    <input
                      type="text"
                      value={formData.no}
                      onChange={(e) => handleChange('no', e.target.value)}
                      placeholder="No"
                      className="w-full text-xs p-2 text-center bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Nama Lengkap Siswa <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.nama}
                    onChange={(e) => handleChange('nama', e.target.value)}
                    className="w-full text-xs p-2 font-semibold bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={formData.jenisKelamin}
                    onChange={(e) => handleChange('jenisKelamin', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-bold"
                  >
                    <option value="" disabled>Pilih...</option>
                    <option value="L">L (Putra / Laki-laki)</option>
                    <option value="P">P (Putri / Perempuan)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Nama Sekolah <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.namaSekolah}
                    onChange={(e) => handleChange('namaSekolah', e.target.value)}
                    placeholder="Contoh: SMP 5 Penajam"
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Jenjang Sekolah
                  </label>
                  <select
                    value={formData.jenjang}
                    onChange={(e) => handleChange('jenjang', e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900 font-bold"
                  >
                    <option value="" disabled>Pilih...</option>
                    <option value="SD">SD</option>
                    <option value="SMP">SMP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    value={formData.kelas}
                    onChange={(e) => handleChange('kelas', e.target.value)}
                    placeholder="Contoh: 7"
                    className="w-full text-xs p-2 bg-white border border-neutral-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Seragam Nasional (MP) */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="text-xs font-black uppercase text-neutral-800">
                1. Seragam Nasional (MP)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Baju MP */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-700 block">Baju Nasional:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Ukuran Baju</label>
                      <input
                        type="text"
                        value={formData.ukBajuMP}
                        onChange={(e) => handleChange('ukBajuMP', e.target.value)}
                        placeholder="Contoh: 9"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Lengan</label>
                      <select
                        value={formData.pjgBajuMP}
                        onChange={(e) => handleChange('pjgBajuMP', e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      >
                        <option value="" disabled>Pilih...</option>
                        <option value="Panjang">Panjang</option>
                        <option value="Pendek">Pendek</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bawahan MP */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-700 block">Bawahan Nasional:</span>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Jenis</label>
                      <select
                        value={formData.rokCelanaMP}
                        onChange={(e) => handleChange('rokCelanaMP', e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      >
                        <option value="" disabled>Pilih...</option>
                        <option value="Rok">Rok</option>
                        <option value="Celana">Celana</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Ukuran</label>
                      <input
                        type="text"
                        value={formData.ukBawahanMP}
                        onChange={(e) => handleChange('ukBawahanMP', e.target.value)}
                        placeholder="Contoh: 10"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded focus:ring-1 focus:ring-neutral-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Panjang</label>
                      <select
                        value={formData.pjgBawahanMP}
                        onChange={(e) => handleChange('pjgBawahanMP', e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      >
                        <option value="" disabled>Pilih...</option>
                        <option value="Panjang">Panjang</option>
                        <option value="Pendek">Pendek</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Seragam Pramuka (PP) & Sepatu */}
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-neutral-800">
                  2. Seragam Pramuka (PP) & Sepatu
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] font-semibold text-neutral-600">Tingkat:</span>
                  <select
                    value={formData.siagaPenggalang}
                    onChange={(e) => handleChange('siagaPenggalang', e.target.value)}
                    className="text-xs p-1 font-bold border border-neutral-300 rounded bg-white"
                  >
                    <option value="" disabled>Pilih...</option>
                    <option value="Siaga">Siaga (SD Bawah)</option>
                    <option value="Penggalang">Penggalang (SD Atas / SMP)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* Baju PP */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-700 block">Baju Pramuka:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Ukuran Baju</label>
                      <input
                        type="text"
                        value={formData.ukBajuPP}
                        onChange={(e) => handleChange('ukBajuPP', e.target.value)}
                        placeholder="Contoh: 9"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Lengan</label>
                      <select
                        value={formData.pjgBajuPP}
                        onChange={(e) => handleChange('pjgBajuPP', e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      >
                        <option value="" disabled>Pilih...</option>
                        <option value="Panjang">Panjang</option>
                        <option value="Pendek">Pendek</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bawahan PP */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-700 block">Bawahan Pramuka:</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Jenis</label>
                      <select
                        value={formData.rokCelanaPP}
                        onChange={(e) => handleChange('rokCelanaPP', e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      >
                        <option value="" disabled>Pilih...</option>
                        <option value="Rok">Rok</option>
                        <option value="Celana">Celana</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Ukuran</label>
                      <input
                        type="text"
                        value={formData.ukBawahanPP}
                        onChange={(e) => handleChange('ukBawahanPP', e.target.value)}
                        placeholder="10"
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-neutral-500 mb-0.5">Panjang</label>
                      <select
                        value={formData.pjgBawahanPP}
                        onChange={(e) => handleChange('pjgBawahanPP', e.target.value)}
                        className="w-full text-xs p-1.5 border border-neutral-300 rounded"
                      >
                        <option value="" disabled>Pilih...</option>
                        <option value="Panjang">Panjang</option>
                        <option value="Pendek">Pendek</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Sepatu */}
                <div className="p-3 bg-white rounded-lg border border-neutral-200 space-y-2">
                  <span className="text-[11px] font-bold text-neutral-700 block">Perlengkapan Sepatu:</span>
                  <div>
                    <label className="block text-[10px] text-neutral-500 mb-0.5">Nomor Ukuran Sepatu</label>
                    <input
                      type="text"
                      value={formData.sepatu}
                      onChange={(e) => handleChange('sepatu', e.target.value)}
                      placeholder="Contoh: 38"
                      className="w-full text-xs p-1.5 font-bold font-mono border border-neutral-300 rounded"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-neutral-50 px-6 py-4 border-t border-neutral-200 flex justify-between items-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 bg-white border border-neutral-300 rounded-xl transition cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#005BAC] hover:bg-[#00488B] rounded-xl shadow-xs transition flex items-center space-x-2 cursor-pointer"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Simpan Perubahan Siswa</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

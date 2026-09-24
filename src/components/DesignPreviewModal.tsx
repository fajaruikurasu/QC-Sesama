import React from 'react';
import { DesignTheme } from '../types';
import { X, Check, Sparkles, Building2, Factory, Leaf } from 'lucide-react';
import enterpriseImg from '../assets/images/pertamina_enterprise_ui_1790157332368.jpg';
import qcImg from '../assets/images/pertamina_qc_ui_1790157345853.jpg';
import ecoImg from '../assets/images/pertamina_eco_ui_1790157357807.jpg';

interface DesignPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: DesignTheme;
  onSelectTheme: (theme: DesignTheme) => void;
}

export const DesignPreviewModal: React.FC<DesignPreviewModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  const designOptions = [
    {
      id: 'enterprise' as DesignTheme,
      title: 'Opsi 1: Pertamina Energy Enterprise',
      subtitle: 'Standar Korporat BUMN Pertamina • Biru Royal & Merah Presisi',
      badge: 'Rekomendasi Utama',
      badgeColor: 'bg-blue-600 text-white',
      icon: Building2,
      image: enterpriseImg,
      accentColors: ['#005BAC', '#ED1C24', '#84BD00'],
      description:
        'Tampilan sangat profesional dan mewah seperti portal digital Pertamina Hulu Energi. Menggunakan gradien biru royal Pertamina, aksen merah QC pada tombol aksi utama, dan kartu berbayang lembut.',
      features: [
        'Top bar biru gradien khas Pertamina dengan garis tri-warna ikonik',
        'Tombol aksi utama bernuansa Merah Pertamina (#ED1C24) berkarakter tegas',
        'Lencana jenjang SD (Merah) & SMP (Biru) yang serasi dengan identitas Pertamina',
        'Tabel dan kartu berlatar putih bersih dengan bayangan lembut berkelas',
      ],
    },
    {
      id: 'operational-qc' as DesignTheme,
      title: 'Opsi 2: Pertamina Operational QC',
      subtitle: 'Dashboard Industrial Lapangan • Kontras Tinggi & Tahan Silau',
      badge: 'Fokus Logistik',
      badgeColor: 'bg-slate-800 text-amber-300',
      icon: Factory,
      image: qcImg,
      accentColors: ['#0F172A', '#D71920', '#10B981'],
      description:
        'Dirancang khusus untuk tim lapangan, gudang logistik, dan pemeriksa QC seragam di unit operasi PHKT. Mengutamakan kontras tinggi, angka metrik tebal, dan keterbacaan super cepat.',
      features: [
        'Top bar Dark Slate Navy industrial dengan trim aksen merah & kuning hazard',
        'Stat card dengan angka tebal monospace untuk pemindaian cepat di lapangan',
        'Grid tabel tegas dengan pembatas kontras tinggi agar tidak salah baca',
        'Tombol taktis berukuran mantap untuk kemudahan klik di perangkat kerja',
      ],
    },
    {
      id: 'eco-modern' as DesignTheme,
      title: 'Opsi 3: Pertamina CSR Eco-Modern',
      subtitle: 'Humanis, Segar & Ramah • Gradien Biru Langit & Hijau CSR',
      badge: 'CSR & Edukasi',
      badgeColor: 'bg-emerald-600 text-white',
      icon: Leaf,
      image: ecoImg,
      accentColors: ['#84BD00', '#005BAC', '#00A896'],
      description:
        'Mengangkat misi sosial dan kepedulian CSR Pertamina Peduli Pendidikan. Memadukan warna hijau alam (#84BD00) dengan biru langit segar, sudut membulat modern, dan kenyamanan visual untuk sesi kerja panjang.',
      features: [
        'Banner atas bergradien segar Biru Pertamina dan Hijau Alam CSR',
        'Sudut kartu rounded-2xl yang luwes, bersahabat, dan tidak kaku',
        'Tag warna pastel lembut untuk ukuran seragam dan sepatu',
        'Sangat nyaman di mata untuk memeriksa dan menginput ratusan data siswa',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="relative bg-gradient-to-r from-[#003B73] via-[#005BAC] to-[#00488B] text-white p-6">
          <div className="h-1.5 w-full absolute top-0 left-0 bg-gradient-to-r from-[#ED1C24] via-[#84BD00] to-[#00A3E0]" />
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pilih Tampilan Desain Pertamina</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Pratinjau Opsi Desain UI Aplikasi
              </h2>
              <p className="text-xs sm:text-sm text-blue-100 max-w-2xl">
                Silakan pilih salah satu opsi di bawah ini. Anda dapat mengganti opsi kapan saja langsung dari header halaman aplikasi tanpa mengubah data maupun hasil cetak Anda.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-white/80 hover:text-white hover:bg-white/20 rounded-xl transition"
              title="Tutup"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Body: Cards of 3 Options */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto bg-neutral-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {designOptions.map((opt) => {
              const isSelected = currentTheme === opt.id;
              const Icon = opt.icon;

              return (
                <div
                  key={opt.id}
                  className={`flex flex-col bg-white rounded-2xl border-2 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
                    isSelected
                      ? 'border-[#005BAC] ring-4 ring-[#005BAC]/15 shadow-lg'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="relative aspect-video bg-neutral-100 overflow-hidden border-b border-neutral-100 group">
                    <img
                      src={opt.image}
                      alt={opt.title}
                      className="w-full h-full object-cover object-top transition duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs ${opt.badgeColor}`}>
                        {opt.badge}
                      </span>
                    </div>

                    {/* Color Dots */}
                    <div className="absolute bottom-2 right-2 flex items-center space-x-1 bg-black/60 backdrop-blur-xs px-2 py-1 rounded-full">
                      {opt.accentColors.map((color, cIdx) => (
                        <span
                          key={cIdx}
                          className="w-3 h-3 rounded-full border border-white/50"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>

                    {isSelected && (
                      <div className="absolute inset-0 bg-[#005BAC]/20 backdrop-blur-[1px] flex items-center justify-center">
                        <div className="bg-[#005BAC] text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-lg">
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Desain Sedang Aktif</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected
                              ? 'bg-[#005BAC] text-white'
                              : 'bg-neutral-100 text-neutral-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-neutral-900 leading-tight">
                          {opt.title}
                        </h3>
                      </div>
                      <p className="text-xs text-neutral-500 leading-relaxed">
                        {opt.description}
                      </p>

                      {/* Feature Bullets */}
                      <ul className="text-[11px] text-neutral-600 space-y-1.5 pt-2 border-t border-neutral-100">
                        {opt.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start space-x-1.5">
                            <span className="text-[#005BAC] font-bold mt-0.5">•</span>
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Select Action Button */}
                    <button
                      type="button"
                      onClick={() => {
                        onSelectTheme(opt.id);
                        onClose();
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-xs ${
                        isSelected
                          ? 'bg-neutral-900 text-white cursor-default'
                          : 'bg-[#005BAC] hover:bg-[#00488B] text-white active:scale-[0.98]'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Sedang Digunakan</span>
                        </>
                      ) : (
                        <>
                          <span>Pilih & Terapkan Desain Ini</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Guarantee Note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center space-x-3 text-xs text-blue-900">
            <div className="w-2.5 h-2.5 rounded-full bg-[#005BAC] shrink-0" />
            <div>
              <span className="font-bold">Keamanan Data & Hasil Cetak:</span> Mengganti opsi desain di atas <b>hanya mengubah estetika visual aplikasi</b>. Seluruh data siswa, nomor seri, konfigurasi PO, dan lembar cetak A4/A6 tetap 100% terjaga dan tidak berubah sama sekali.
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-white p-4 border-t border-neutral-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { StudentData, OrderConfig } from '../types';
import { generateStudentQCItems } from '../utils/studentLogic';

interface A6CardProps {
  student: StudentData;
  orderConfig: OrderConfig;
  className?: string;
  isPrintPreview?: boolean;
}

export const A6Card: React.FC<A6CardProps> = ({
  student,
  orderConfig,
  className = '',
}) => {
  const qcItems = generateStudentQCItems(student);
  
  const rawGender = (student.jenisKelamin || '').toUpperCase().trim();
  const isPutri = rawGender.startsWith('P') || rawGender.includes('PUTRI') || rawGender.includes('FEMALE');
  const genderLabel = isPutri ? 'PUTRI' : 'PUTRA';

  const jenjang = (student.jenjang || '').toUpperCase().trim();
  const isSMP = jenjang.includes('SMP') || jenjang.includes('MTS') || (parseInt(student.kelas, 10) >= 7);

  const rawPramuka = (student.siagaPenggalang || '').toLowerCase().trim();
  const isSiaga = rawPramuka.includes('siaga') || (!isSMP && parseInt(student.kelas, 10) <= 4);
  const pramukaLevel = isSiaga ? 'SIAGA' : 'PENGGALANG';

  // Theme color styling
  const themeBorderColor = '#000000';

  // ----------------------------------------------------
  // Split ATK Items into 2 Columns dynamically:
  // ----------------------------------------------------
  const halfAtk = Math.ceil(qcItems.atk.length / 2);
  const atkLeft = qcItems.atk.slice(0, halfAtk);
  const atkRight = qcItems.atk.slice(halfAtk);

  return (
    <div
      className={`a6-card bg-white text-black text-[9.5px] leading-tight font-sans rounded-lg p-2.5 flex flex-col justify-between select-none relative box-border ${className}`}
      style={{
        // A6 aspect ratio is ~ 105mm x 148mm
        width: '100%',
        maxWidth: '105mm',
        minHeight: '142mm',
        height: '100%',
        borderWidth: '2px',
        borderStyle: 'solid',
        borderColor: themeBorderColor,
      }}
    >

      {/* ----------------- 1. HEADER INFORMASI SISWA ----------------- */}
      <div className="border-b-2 border-black pb-1 mb-1.5">
        <div className="flex justify-between items-start gap-x-2">
          {/* Sisi Kiri: Logo + Baris 1 NAMA, Baris 2 SEKOLAH */}
          <div className="flex items-center flex-1 min-w-0 pr-1">
            {orderConfig.customLogoUrl && (
              <img
                src={orderConfig.customLogoUrl}
                alt="Header Logo"
                className="h-7 max-w-[65px] object-contain mr-1.5 shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              {/* Baris 1 Kiri: NAMA SISWA */}
              <div
                className="text-[12.5px] font-black tracking-tight leading-tight uppercase truncate"
                style={{ color: '#000000' }}
                title={student.nama}
              >
                {student.nama}
              </div>
              {/* Baris 2 Kiri: SEKOLAH */}
              <div className="text-[10px] font-bold text-neutral-900 leading-tight truncate mt-0.5" title={student.namaSekolah}>
                {student.namaSekolah || orderConfig.namaSekolahHeader || '-'}
              </div>
            </div>
          </div>

          {/* Sisi Kanan: Baris 1 Kotak Kelas, Putra/Putri, Siaga/Penggalang | Baris 2 Unit Operasi */}
          <div className="shrink-0 flex flex-col items-end">
            {/* Baris 1 Kanan: Badges Kelas, Gender, Pramuka (Siaga/Penggalang) */}
            <div className="flex items-center space-x-1 text-[7.5px] leading-tight">
              <span className="border border-black px-1.5 py-0.5 rounded font-black bg-neutral-100 text-black">
                Kelas {student.kelas || '-'}
              </span>
              <span className="border border-black px-1.5 py-0.5 rounded font-black bg-black text-white">
                {genderLabel}
              </span>
              <span className={`border px-1.5 py-0.5 rounded font-black shadow-2xs ${
                pramukaLevel === 'SIAGA'
                  ? 'border-[#14532d] bg-[#166534] text-white'
                  : 'border-[#7f1d1d] bg-[#991b1b] text-white'
              }`}>
                {pramukaLevel}
              </span>
            </div>

            {/* Baris 2 Kanan: UNIT OPERASI (Ukuran & gaya font sama persis dengan Sekolah) */}
            <div className="text-[10px] font-bold text-neutral-900 text-right leading-tight mt-0.5 truncate max-w-[195px]" title={student.regional || orderConfig.namaPemesan}>
              {student.regional || orderConfig.namaPemesan || '-'}
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- 2. SERAGAM NASIONAL ----------------- */}
      <div className="mb-1">
        <div className="flex justify-between items-baseline border-b border-black pb-0.5 mb-0.5">
          <span className="font-black text-[9px] uppercase tracking-wide">
            1. SERAGAM NASIONAL ({isSMP ? 'PUTIH / BIRU' : 'PUTIH / MERAH'})
          </span>
          <div className="flex text-[7.5px] font-bold text-neutral-700">
            <span className="w-14 text-center">STATUS QC</span>
            <span className="w-14 text-center">KODE REJECT</span>
          </div>
        </div>

        <div className="space-y-[1.5px]">
          {qcItems.nasional.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-[0.5px] text-[8px] leading-tight">
              <span className="font-semibold truncate pr-1 flex-1">{item.label}</span>
              <div className="flex items-center shrink-0">
                <span className="w-14 font-mono text-[8px] flex items-center justify-center space-x-1">
                  <span className="inline-block border border-black w-2.5 h-2.5 rounded-[2px] leading-none text-center bg-white"></span>
                  <span className="font-bold text-[7px] text-emerald-700">OK</span>
                  <span className="inline-block border border-black w-2.5 h-2.5 rounded-[2px] leading-none text-center ml-0.5 bg-white"></span>
                  <span className="font-bold text-[7px] text-rose-700">NG</span>
                </span>
                <span className="w-14 border-b border-dotted border-neutral-600 h-2.5 ml-1 block"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- 3. SERAGAM PRAMUKA ----------------- */}
      <div className="mb-1">
        <div className="flex justify-between items-baseline border-b border-black pb-0.5 mb-0.5">
          <span className="font-black text-[9px] uppercase tracking-wide">
            2. SERAGAM PRAMUKA ({pramukaLevel})
          </span>
          <div className="flex text-[7.5px] font-bold text-neutral-700">
            <span className="w-14 text-center">STATUS QC</span>
            <span className="w-14 text-center">KODE REJECT</span>
          </div>
        </div>

        <div className="space-y-[1.5px]">
          {qcItems.pramuka.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-[0.5px] text-[8px] leading-tight">
              <span className="font-semibold truncate pr-1 flex-1">{item.label}</span>
              <div className="flex items-center shrink-0">
                <span className="w-14 font-mono text-[8px] flex items-center justify-center space-x-1">
                  <span className="inline-block border border-black w-2.5 h-2.5 rounded-[2px] leading-none text-center bg-white"></span>
                  <span className="font-bold text-[7px] text-emerald-700">OK</span>
                  <span className="inline-block border border-black w-2.5 h-2.5 rounded-[2px] leading-none text-center ml-0.5 bg-white"></span>
                  <span className="font-bold text-[7px] text-rose-700">NG</span>
                </span>
                <span className="w-14 border-b border-dotted border-neutral-600 h-2.5 ml-1 block"></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- 4. PERLENGKAPAN SEKOLAH & ATK (2 KOLOM: HEADER DI ATAS TIAP KOLOM) ----------------- */}
      <div className="mb-1">
        {/* Baris Judul Murni */}
        <div className="border-b border-black pb-0.5 mb-1">
          <span className="font-black text-[9px] uppercase tracking-wide">
            3. PERLENGKAPAN SEKOLAH & ATK
          </span>
        </div>

        {/* 2 Kolom Datar dengan Header di Atas Item Tiap Kolom - Geser Kontrol ke Kanan agar Nama & Ukuran Sepatu Muat Penuh */}
        <div className="border border-neutral-400 rounded-[3px] p-1 bg-white">
          <div className="grid grid-cols-2 gap-x-2 divide-x divide-neutral-300 text-[8px] leading-tight">
            {/* Kolom Kiri */}
            <div className="pr-1">
              {/* Header Kolom Kiri */}
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-300 text-[6.5px] font-bold text-neutral-600 leading-none">
                <span>ITEM</span>
                <div className="flex items-center space-x-1 shrink-0">
                  <span className="w-[42px] text-center text-neutral-700">STATUS QC</span>
                  <span className="w-3.5 text-center text-neutral-700">REJ</span>
                </div>
              </div>

              {/* Item Kiri */}
              <div className="space-y-[1.5px]">
                {atkLeft.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-[0.5px]">
                    <span className="font-bold text-[8px] tracking-tight text-black flex-1 pr-1 truncate" title={item.label}>
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      <span className="w-[42px] font-mono text-[7px] flex items-center justify-center space-x-1">
                        <span className="inline-block border border-black w-2.5 h-2.5 shrink-0 rounded-[2px] bg-white"></span>
                        <span className="font-bold text-[7px] text-emerald-700">OK</span>
                        <span className="inline-block border border-black w-2.5 h-2.5 shrink-0 rounded-[2px] ml-0.5 bg-white"></span>
                        <span className="font-bold text-[7px] text-rose-700">NG</span>
                      </span>
                      <span className="w-3.5 border-b border-dotted border-black h-2 block"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="pl-1">
              {/* Header Kolom Kanan */}
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-300 text-[6.5px] font-bold text-neutral-600 leading-none">
                <span>ITEM</span>
                <div className="flex items-center space-x-1 shrink-0">
                  <span className="w-[42px] text-center text-neutral-700">STATUS QC</span>
                  <span className="w-3.5 text-center text-neutral-700">REJ</span>
                </div>
              </div>

              {/* Item Kanan */}
              <div className="space-y-[1.5px]">
                {atkRight.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-[0.5px]">
                    <span className="font-bold text-[8px] tracking-tight text-black flex-1 pr-1 truncate" title={item.label}>
                      {item.label}
                    </span>
                    <div className="flex items-center space-x-1 shrink-0">
                      <span className="w-[42px] font-mono text-[7px] flex items-center justify-center space-x-1">
                        <span className="inline-block border border-black w-2.5 h-2.5 shrink-0 rounded-[2px] bg-white"></span>
                        <span className="font-bold text-[7px] text-emerald-700">OK</span>
                        <span className="inline-block border border-black w-2.5 h-2.5 shrink-0 rounded-[2px] ml-0.5 bg-white"></span>
                        <span className="font-bold text-[7px] text-rose-700">NG</span>
                      </span>
                      <span className="w-3.5 border-b border-dotted border-black h-2 block"></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ----------------- 5. KODE DEFECT LEGEND (TABEL MATRIKS QC - PERMANEN) ----------------- */}
      <div className="border border-neutral-700 rounded-[2px] mb-1 bg-white overflow-hidden text-[6px] leading-tight">
        <div className="bg-neutral-100 border-b border-neutral-400 px-1.5 py-[1.5px] flex justify-between items-center text-[6.5px] font-black tracking-wider text-black">
          <span>KODE DEFECT (PANDUAN PEMERIKSAAN QC)</span>
          <span className="font-normal text-[5.5px] text-neutral-600">Tulis kode saat item NG/Reject</span>
        </div>
        <table className="w-full border-collapse text-left">
          <tbody>
            <tr className="border-b border-neutral-200">
              <td className="px-1.5 py-[2px] border-r border-neutral-200 w-1/4 whitespace-nowrap">
                <span className="font-black text-black">[S1]</span> Salah Jenis Item
              </td>
              <td className="px-1.5 py-[2px] border-r border-neutral-200 w-1/4 whitespace-nowrap">
                <span className="font-black text-black">[S2]</span> Salah Ukuran
              </td>
              <td className="px-1.5 py-[2px] border-r border-neutral-200 w-1/4 whitespace-nowrap">
                <span className="font-black text-black">[S3]</span> Salah Jenjang/Tkt
              </td>
              <td className="px-1.5 py-[2px] w-1/4 whitespace-nowrap">
                <span className="font-black text-black">[S4]</span> Salah Gender/Atr
              </td>
            </tr>
            <tr>
              <td className="px-1.5 py-[2px] border-r border-neutral-200 whitespace-nowrap">
                <span className="font-black text-black">[C1]</span> Cacat/Robek/Jahit
              </td>
              <td className="px-1.5 py-[2px] border-r border-neutral-200 whitespace-nowrap">
                <span className="font-black text-black">[C2]</span> Kotor/Bernoda
              </td>
              <td className="px-1.5 py-[2px] border-r border-neutral-200 whitespace-nowrap">
                <span className="font-black text-black">[K1]</span> Kurang/Tdk Dikirim
              </td>
              <td className="px-1.5 py-[2px] whitespace-nowrap">
                <span className="font-black text-black">[K2]</span> Kelebihan Kirim
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ----------------- 6. STATUS & PENANGANAN REWORK (OPSI 1 PERMANEN + AKSEN WARNA MENARIK) ----------------- */}
      <div className="border-t-2 border-black pt-1">
        <div className="text-[8px] font-black uppercase text-center tracking-wider mb-0.5 text-black">
          STATUS & PENANGANAN REWORK
        </div>

        {/* Status QC Awal Berwarna Menarik */}
        <div className="border border-neutral-700 rounded px-1.5 py-1 mb-1 bg-neutral-50/70">
          <div className="flex justify-between items-center text-[8px]">
            <div className="flex items-center space-x-2">
              <span className="font-black text-black">STATUS AWAL:</span>
              
              {/* Badge QC PASS Hijau */}
              <label className="flex items-center space-x-1 bg-emerald-50 border border-emerald-500 rounded px-1.5 py-0.5 shadow-2xs cursor-pointer">
                <span className="inline-block border-2 border-emerald-600 bg-white w-2.5 h-2.5 rounded-[2px]"></span>
                <span className="font-black text-emerald-800 text-[8px]">QC PASS</span>
              </label>

              {/* Badge REWORK / REJECT Merah */}
              <label className="flex items-center space-x-1 bg-rose-50 border border-rose-500 rounded px-1.5 py-0.5 shadow-2xs cursor-pointer">
                <span className="inline-block border-2 border-rose-600 bg-white w-2.5 h-2.5 rounded-[2px]"></span>
                <span className="font-black text-rose-800 text-[8px]">REWORK / REJECT</span>
              </label>
            </div>

            <div className="text-[7.5px] text-right flex items-center space-x-2 font-semibold text-neutral-800">
              <span>Petugas QC: <span className="inline-block border-b border-black w-14"></span></span>
              <span>Tgl: <span className="inline-block border-b border-black w-9"></span></span>
            </div>
          </div>
        </div>

        {/* Rework 1 & 2 dengan Petugas Mandiri (Judul 2 Baris & Posisi Kolom Petugas Sejajar Sempurna) */}
        <div className="space-y-1 text-[7.5px]">
          {/* 1. REWORK SERAGAM */}
          <div className="border border-neutral-300 rounded px-1.5 py-0.5 bg-white">
            <div className="flex justify-between items-center font-bold">
              {/* Kolom Judul (Fixed Width agar kolom Petugas Sejajar Sempurna) */}
              <div className="w-[128px] shrink-0 leading-tight">
                <span className="font-black text-black block">1. REWORK SERAGAM</span>
                <span className="text-[6.5px] font-bold text-neutral-600 block">
                  (Putih {isSMP ? 'Biru' : 'Merah'} / Pramuka)
                </span>
              </div>

              {/* Kolom Petugas, Tgl, Selesai (Posisi Horizontal Sejajar Sempurna dengan Rework 2) */}
              <div className="flex items-center space-x-2 shrink-0">
                <span>Petugas: <span className="inline-block border-b border-black w-14"></span></span>
                <span>Tgl: <span className="inline-block border-b border-black w-8"></span></span>
                <span className="flex items-center space-x-1 bg-emerald-50 border border-emerald-300 px-1 py-0.2 rounded text-emerald-900 font-bold">
                  <span className="inline-block border border-emerald-700 bg-white w-2 h-2 rounded-[1.5px]"></span>
                  <span>Selesai</span>
                </span>
              </div>
            </div>
            <div className="flex items-center text-neutral-600 mt-0.5">
              <span className="mr-1 text-black font-semibold">Catatan:</span>
              <span className="flex-1 border-b border-dotted border-black h-2 block"></span>
            </div>
          </div>

          {/* 2. REWORK PERLENGKAPAN */}
          <div className="border border-neutral-300 rounded px-1.5 py-0.5 bg-white">
            <div className="flex justify-between items-center font-bold">
              {/* Kolom Judul (Fixed Width agar kolom Petugas Sejajar Sempurna) */}
              <div className="w-[128px] shrink-0 leading-tight">
                <span className="font-black text-black block">2. REWORK PERLENGKAPAN</span>
                <span className="text-[6.5px] font-bold text-neutral-600 block">
                  Sepatu & ATK
                </span>
              </div>

              {/* Kolom Petugas, Tgl, Selesai (Posisi Horizontal Sejajar Sempurna dengan Rework 1) */}
              <div className="flex items-center space-x-2 shrink-0">
                <span>Petugas: <span className="inline-block border-b border-black w-14"></span></span>
                <span>Tgl: <span className="inline-block border-b border-black w-8"></span></span>
                <span className="flex items-center space-x-1 bg-emerald-50 border border-emerald-300 px-1 py-0.2 rounded text-emerald-900 font-bold">
                  <span className="inline-block border border-emerald-700 bg-white w-2 h-2 rounded-[1.5px]"></span>
                  <span>Selesai</span>
                </span>
              </div>
            </div>
            <div className="flex items-center text-neutral-600 mt-0.5">
              <span className="mr-1 text-black font-semibold">Catatan:</span>
              <span className="flex-1 border-b border-dotted border-black h-2 block"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

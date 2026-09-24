import React from 'react';
import { StudentData, OrderConfig } from '../types';
import { A6Card } from './A6Card';

interface A4PrintSheetProps {
  students: StudentData[]; // Up to 4 students per sheet
  sheetIndex: number;
  totalSheets: number;
  orderConfig: OrderConfig;
  showCutGuides?: boolean;
}

export const A4PrintSheet: React.FC<A4PrintSheetProps> = ({
  students,
  sheetIndex,
  totalSheets,
  orderConfig,
  showCutGuides = true,
}) => {
  // Pad array to 4 slots if fewer than 4 students on the last sheet
  const slots: (StudentData | null)[] = [
    students[0] || null,
    students[1] || null,
    students[2] || null,
    students[3] || null,
  ];

  return (
    <div
      className="a4-sheet bg-white text-black relative mx-auto my-6 print:m-0 shadow-xl print:shadow-none box-border flex flex-col justify-between"
      style={{
        width: '210mm',
        minHeight: '297mm',
        height: '297mm',
        padding: '5mm',
        pageBreakAfter: 'always',
        breakAfter: 'page',
      }}
    >
      {/* 2x2 Grid of A6 Cards */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full w-full relative">
        {/* Slot 0: Top-Left */}
        <div className="flex items-center justify-center p-1">
          {slots[0] ? (
            <A6Card student={slots[0]} orderConfig={orderConfig} />
          ) : (
            <div className="w-full h-full border border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-neutral-300 text-xs">
              Kosong
            </div>
          )}
        </div>

        {/* Slot 1: Top-Right */}
        <div className="flex items-center justify-center p-1">
          {slots[1] ? (
            <A6Card student={slots[1]} orderConfig={orderConfig} />
          ) : (
            <div className="w-full h-full border border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-neutral-300 text-xs">
              Kosong
            </div>
          )}
        </div>

        {/* Slot 2: Bottom-Left */}
        <div className="flex items-center justify-center p-1">
          {slots[2] ? (
            <A6Card student={slots[2]} orderConfig={orderConfig} />
          ) : (
            <div className="w-full h-full border border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-neutral-300 text-xs">
              Kosong
            </div>
          )}
        </div>

        {/* Slot 3: Bottom-Right */}
        <div className="flex items-center justify-center p-1">
          {slots[3] ? (
            <A6Card student={slots[3]} orderConfig={orderConfig} />
          ) : (
            <div className="w-full h-full border border-dashed border-neutral-300 rounded-lg flex items-center justify-center text-neutral-300 text-xs">
              Kosong
            </div>
          )}
        </div>

        {/* Cut lines overlay (Murni garis putus-putus tanpa icon gunting atau teks) */}
        {showCutGuides && (
          <>
            {/* Vertical Cut Guide */}
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              <div className="w-[1px] h-full border-r border-dashed border-neutral-400"></div>
            </div>

            {/* Horizontal Cut Guide */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <div className="h-[1px] w-full border-b border-dashed border-neutral-400"></div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

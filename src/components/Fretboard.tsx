import React, { useMemo } from 'react';
import { cn } from '../lib/utils';

interface FretboardProps {
  dots: {
    stringIdx: number;
    fretIdx: number;
    label: string;
    type: 'root' | 'scale' | 'both' | 'scaleA' | 'scaleB';
  }[];
  frets?: number;
}

const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21];

export function Fretboard({ dots, frets = 22 }: FretboardProps) {
  const strings = [0, 1, 2, 3, 4, 5]; // High E down to Low E
  const fretCols = Array.from({ length: frets + 1 }, (_, i) => i); // 0 to 22
  
  return (
    <div className="relative w-full max-w-6xl mx-auto overflow-x-auto pb-6">
      <div className="min-w-[1000px] bg-[#1c1c1e] rounded-xl p-6 shadow-2xl relative">
        <div className="relative flex">
          {/* Nut */}
          <div className="w-1.5 h-full absolute left-[40px] top-0 bg-[#d1d1d6] z-10 rounded-sm"></div>
          
          <div className="flex w-full relative h-[250px]">
            {/* Frets Grid */}
            <div className="absolute inset-0 flex ml-[40px]">
              {fretCols.slice(1).map((fret) => (
                <div key={fret} className="flex-1 border-r-2 border-[#3a3a3c] relative flex justify-center h-full">
                  {/* Fret marker dot */}
                  {FRET_MARKERS.includes(fret) && (
                    <div className="absolute top-[50%] -translate-y-1/2 flex flex-col gap-10 opacity-30 z-0">
                      {fret === 12 ? (
                         <>
                           <div className="w-4 h-4 rounded-full bg-[#f4f4f5]" />
                           <div className="w-4 h-4 rounded-full bg-[#f4f4f5]" />
                         </>
                      ) : (
                         <div className="w-4 h-4 rounded-full bg-[#f4f4f5]" />
                      )}
                    </div>
                  )}
                  {/* Fret number label */}
                  <div className="absolute -bottom-6 text-xs text-[#8e8e93] font-mono">{fret}</div>
                </div>
              ))}
            </div>

            {/* Strings */}
            <div className="absolute inset-0 flex flex-col justify-between py-[12px] z-10 pointer-events-none">
               {strings.map((str) => (
                 <div key={str} className="w-full h-[2px] bg-[#636366] shadow-sm relative z-0"></div>
               ))}
            </div>

            {/* Fret columns for dots placement */}
            <div className="absolute inset-0 flex z-20">
              <div className="w-[40px] h-full relative" /> {/* Fret 0 column */}
              {fretCols.slice(1).map((fret) => (
                <div key={fret} className="flex-1 h-full relative" />
              ))}
            </div>

            {/* Dots */}
            {dots.map((dot, i) => {
               // Calculate position
               // Strings are evenly spaced between py-[12px] padding within the 250px container
               const strH = 250 - 24; // 226px
               const yPos = 12 + (dot.stringIdx / 5) * strH;
               
               // X pos: Fret 0 is in the 40px left zone. 
               // Other frets are evenly distributed in the remaining width.
               
               return (
                 <div 
                   key={i}
                   className={cn(
                     "absolute w-[28px] h-[28px] rounded-full shadow-md flex items-center justify-center text-xs font-bold text-white z-30 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110",
                     dot.type === 'root' && "bg-[#F27D26] border-2 border-[#F27D26] text-black", // Brand Orange
                     dot.type === 'scale' && "bg-[#06B6D4] border border-[#06B6D4] text-black", 
                     dot.type === 'scaleA' && "bg-[#FF3B30] border border-[#FF3B30] text-white", // Red (Only in A)
                     dot.type === 'scaleB' && "bg-[#34C759] border border-[#34C759] text-black", // Green (Only in B)
                     dot.type === 'both' && "bg-[#06B6D4] border border-[#06B6D4] text-black" // Base (Common)
                   )}
                   style={{
                     top: `${yPos}px`,
                     // We use a custom style block because the right-positioning depends on the fret
                     left: dot.fretIdx === 0 
                        ? '20px' // Center of the 40px Fret 0 width
                        : `calc(40px + ((100% - 40px) / 22) * ${dot.fretIdx - 0.5})`
                   }}
                 >
                   {dot.label}
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

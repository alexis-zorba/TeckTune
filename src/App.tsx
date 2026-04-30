import { useState, useMemo, useEffect } from 'react';
import { Fretboard } from './components/Fretboard';
import { TheorySection } from './components/TheorySection';
import { NOTES, SCALES, STRING_TUNING, FRETS, getNoteAt, getInterval, INTERVAL_NAMES } from './lib/music';
import { Split, CircleDot, Play, Volume2 } from 'lucide-react';
import { cn } from './lib/utils';
import { playScale, playTone, setMasterVolume, SOUND_TYPES, SoundType } from './lib/audio';

export default function App() {
  const [mode, setMode] = useState<'single' | 'compare'>('single');
  const [root1, setRoot1] = useState(0); // C
  const [scale1, setScale1] = useState(SCALES[3].name); // Minor Pentatonic
  const [root2, setRoot2] = useState(0); // C
  const [scale2, setScale2] = useState(SCALES[5].name); // Mixolydian
  const [labelMode, setLabelMode] = useState<'interval' | 'note'>('interval');
  
  const [sound1, setSound1] = useState<SoundType>('acoustic');
  const [sound2, setSound2] = useState<SoundType>('epiano');
  const [volume, setVolume] = useState(0.5);

  useEffect(() => {
    setMasterVolume(volume);
  }, [volume]);

  const getScaleNotes = (root: number, intervals: number[]) => {
    return intervals.map(interval => (root + interval) % 12);
  };

  const scale1Obj = SCALES.find(s => s.name === scale1) || SCALES[0];
  const s1Notes = getScaleNotes(root1, scale1Obj.intervals);

  const scale2Obj = SCALES.find(s => s.name === scale2) || SCALES[0];
  const s2Notes = getScaleNotes(root2, scale2Obj.intervals);

  const dots = useMemo(() => {
    const calculatedDots = [];
    for (let stringIdx = 0; stringIdx < 6; stringIdx++) {
      const stringRoot = STRING_TUNING[stringIdx];
      for (let fretIdx = 0; fretIdx <= FRETS; fretIdx++) {
        const note = getNoteAt(stringRoot, fretIdx);
        
        const inS1 = s1Notes.includes(note);
        const inS2 = mode === 'compare' ? s2Notes.includes(note) : false;
        
        if (inS1 || inS2) {
          let type: 'root' | 'scale' | 'both' | 'scaleA' | 'scaleB' = 'scale';
          let label = labelMode === 'note' ? NOTES[note] : '';
          
          if (mode === 'single') {
            const isRoot = note === root1;
            type = isRoot ? 'root' : 'scale';
            if (labelMode === 'interval') {
              label = isRoot ? 'R' : INTERVAL_NAMES[getInterval(root1, note)];
            }
          } else {
            // Compare Mode
            if (inS1 && inS2) {
              type = note === root1 ? 'root' : 'both';
              // Base interval off Scale 1 root
              if (labelMode === 'interval') {
                label = note === root1 ? 'R' : INTERVAL_NAMES[getInterval(root1, note)];
              }
            } else if (inS1) {
              type = 'scaleA';
              if (labelMode === 'interval') {
                label = INTERVAL_NAMES[getInterval(root1, note)];
              }
            } else if (inS2) {
              type = 'scaleB';
              if (labelMode === 'interval') {
                label = INTERVAL_NAMES[getInterval(root2, note)];
              }
            }
          }
          
          calculatedDots.push({
            stringIdx,
            fretIdx,
            label,
            type,
          });
        }
      }
    }
    return calculatedDots;
  }, [root1, scale1Obj, root2, scale2Obj, mode, labelMode]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#e5e5e5] font-sans selection:bg-[#F27D26] selection:text-black pb-20">
      
      {/* Header */}
      <header className="px-8 py-6 border-b border-white/10 flex items-center justify-between sticky top-0 bg-[#050505]/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="TeckTune Logo" className="w-8 h-8" />
          <h1 className="text-xl font-bold tracking-tight">TeckTune</h1>
        </div>
        
        {/* Global Controls */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-[#151619] rounded-full px-4 py-1.5 border border-white/5">
            <Volume2 size={14} className="text-white/50" />
            <input 
              type="range" 
              min="0" max="1" step="0.01" 
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-24 accent-[#F27D26] cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5 bg-[#151619] rounded-full px-4 py-1.5 border border-white/5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E9299] mr-1">Tune :</span>
            {[
              { label: 'E', freq: 82.4069, title: '6th - Low E' },
              { label: 'A', freq: 110.0000, title: '5th - A' },
              { label: 'D', freq: 146.8324, title: '4th - D' },
              { label: 'G', freq: 195.9977, title: '3rd - G' },
              { label: 'B', freq: 246.9417, title: '2nd - B' },
              { label: 'E', freq: 329.6276, title: '1st - High E' }
            ].map(str => (
              <button
                key={str.title}
                onClick={() => playTone(str.freq, 4.0, 'acoustic')} 
                className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-[#2A2A2B] text-white/80 hover:bg-[#F27D26] hover:text-black transition-colors"
                title={str.title}
              >
                {str.label}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#151619] rounded-full p-1 border border-white/5">
            <button 
              onClick={() => setLabelMode('interval')}
              className={cn("px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-all", labelMode === 'interval' ? 'bg-[#3A3A3C] text-white shadow-sm' : 'text-white/50 hover:text-white/80')}
            >
              Intervals
            </button>
            <button 
              onClick={() => setLabelMode('note')}
              className={cn("px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wider transition-all", labelMode === 'note' ? 'bg-[#3A3A3C] text-white shadow-sm' : 'text-white/50 hover:text-white/80')}
            >
              Notes
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-6 pt-10 flex flex-col gap-12">
        
        {/* Top Controls Area */}
        <section className="grid lg:grid-cols-[1fr_auto_1fr] gap-6 items-center">
          
          {/* Scale 1 Card */}
          <div className={cn("p-6 rounded-2xl border bg-[#151619] transition-all relative group", mode === 'compare' ? 'border-[#4A4A4B]' : 'border-[#F27D26]/30 shadow-[0_0_40px_-15px_rgba(242,125,38,0.2)]')}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8E9299]">
                {mode === 'compare' ? 'Scale A (Base)' : 'Selected Scale'}
              </span>
              <div className="flex items-center gap-2">
                <select 
                  value={sound1}
                  onChange={(e) => setSound1(e.target.value as SoundType)}
                  className="bg-[#2A2A2B] text-xs border border-white/10 rounded-full px-3 py-1 outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                >
                  {SOUND_TYPES.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <button 
                  onClick={() => playScale(root1, scale1Obj.intervals, sound1)}
                  className="p-1.5 rounded-full bg-[#F27D26]/20 hover:bg-[#F27D26] text-[#F27D26] hover:text-black transition-colors"
                  title="Listen to Scale 1"
                >
                  <Play size={14} fill="currentColor" />
                </button>
                {mode === 'compare' && (
                  <div className="w-2 h-2 rounded-full bg-[#4A4A4B] ml-1" />
                )}
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Root Note</label>
                <select 
                  value={root1} 
                  onChange={e => setRoot1(Number(e.target.value))}
                  className="w-full bg-[#2A2A2B] border border-white/10 rounded-lg px-4 py-3 text-sm font-semibold outline-none focus:border-[#F27D26] transition-colors appearance-none"
                >
                  {NOTES.map((note, i) => (
                    <option key={i} value={i}>{note}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Scale Type</label>
                <select 
                  value={scale1} 
                  onChange={e => setScale1(e.target.value)}
                  className="w-full bg-[#2A2A2B] border border-white/10 rounded-lg px-4 py-3 text-sm font-semibold outline-none focus:border-[#F27D26] transition-colors appearance-none"
                >
                  {SCALES.map((s, i) => (
                    <option key={i} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <div className="mt-2.5 flex flex-wrap gap-1.5 h-[22px]">
                  {scale1Obj.styles.map(style => (
                    <span key={style} className="text-[9px] uppercase font-mono tracking-widest bg-white/5 text-white/60 px-2 py-0.5 rounded-sm border border-white/5">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mode Switcher */}
          <div className="flex flex-col items-center justify-center gap-3">
             <button
               onClick={() => setMode(mode === 'single' ? 'compare' : 'single')}
               className="w-14 h-14 rounded-full border border-white/10 bg-[#151619] flex items-center justify-center text-white/70 hover:text-white hover:border-white/30 hover:bg-[#2A2A2B] transition-all shadow-lg group relative"
               title={mode === 'single' ? "Enable Compare Mode" : "Return to Single Mode"}
             >
               {mode === 'single' ? <Split size={24} className="group-hover:text-[#F27D26] transition-colors" /> : <CircleDot size={24} className="group-hover:text-[#F27D26] text-[#F27D26] transition-colors" />}
             </button>
             <span className="text-[10px] uppercase font-mono tracking-widest text-[#8E9299]">
               {mode === 'single' ? 'Compare' : 'Active'}
             </span>
          </div>

          {/* Scale 2 Card (Compare Mode) */}
          <div className={cn("p-6 rounded-2xl border transition-all relative", mode === 'compare' ? 'bg-[#151619] border-[#4A4A4B]' : 'opacity-40 border-dashed border-white/10 grayscale pointer-events-none')}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-[#8E9299]">
                Scale B (Target)
              </span>
              {mode === 'compare' && (
                <div className="flex items-center gap-2">
                  <select 
                    value={sound2}
                    onChange={(e) => setSound2(e.target.value as SoundType)}
                    className="bg-[#2A2A2B] text-xs border border-white/10 rounded-full px-3 py-1 outline-none appearance-none cursor-pointer hover:border-white/30 transition-colors"
                  >
                    {SOUND_TYPES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => playScale(root2, scale2Obj.intervals, sound2)}
                    className="p-1.5 rounded-full bg-[#34C759]/20 hover:bg-[#34C759] text-[#34C759] hover:text-black transition-colors"
                    title="Listen to Scale 2"
                  >
                    <Play size={14} fill="currentColor" />
                  </button>
                  <div className="w-2 h-2 rounded-full bg-[#34C759] ml-1" />
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Root Note</label>
                <select 
                  value={root2} 
                  onChange={e => setRoot2(Number(e.target.value))}
                  className="w-full bg-[#2A2A2B] border border-white/10 rounded-lg px-4 py-3 text-sm font-semibold outline-none focus:border-[#34C759] transition-colors appearance-none"
                  disabled={mode === 'single'}
                >
                  {NOTES.map((note, i) => (
                    <option key={i} value={i}>{note}</option>
                  ))}
                </select>
              </div>
              <div className="flex-[2]">
                <label className="block text-xs uppercase tracking-wider text-white/50 mb-2">Scale Type</label>
                <select 
                  value={scale2} 
                  onChange={e => setScale2(e.target.value)}
                  className="w-full bg-[#2A2A2B] border border-white/10 rounded-lg px-4 py-3 text-sm font-semibold outline-none focus:border-[#34C759] transition-colors appearance-none"
                  disabled={mode === 'single'}
                >
                  {SCALES.map((s, i) => (
                    <option key={i} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <div className="mt-2.5 flex flex-wrap gap-1.5 h-[22px]">
                  {mode === 'compare' && scale2Obj.styles.map(style => (
                    <span key={style} className="text-[9px] uppercase font-mono tracking-widest bg-white/5 text-white/60 px-2 py-0.5 rounded-sm border border-white/5">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        </section>

        {/* Legend */}
        {mode === 'compare' ? (
          <div className="flex flex-wrap justify-center items-center gap-8 py-4 border-y border-white/5 mb-2 mt-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#F27D26] border-2 border-[#F27D26]" />
              <span className="text-sm font-medium">Root (A)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#06B6D4] border border-[#06B6D4]" />
              <span className="text-sm font-medium">In Both Scales</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#34C759] border border-[#34C759]" />
              <span className="text-sm font-medium text-white">Solo in Scale B <span className="opacity-50 text-xs ml-1">(Nuove note)</span></span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#FF3B30] border border-[#FF3B30]" />
              <span className="text-sm font-medium text-white">Solo in Scale A <span className="opacity-50 text-xs ml-1">(Note perse)</span></span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center items-center gap-8 py-4 border-y border-white/5 mb-2 mt-4">
             <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#F27D26] border-2 border-[#F27D26]" />
              <span className="text-sm font-medium">Root Note</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-[#06B6D4] border border-[#06B6D4]" />
              <span className="text-sm font-medium">Scale Note</span>
            </div>
          </div>
        )}

        {/* Fretboard Section */}
        <section>
          <Fretboard dots={dots} frets={22} />
        </section>

        <TheorySection />
        
      </main>
    </div>
  );
}


import { useState } from 'react';
import { cn } from '../lib/utils';
import { Library, Music4, Lightbulb, Guitar, BookOpen, Play } from 'lucide-react';
import { SCALES } from '../lib/music';
import { playScale } from '../lib/audio';
import { useTranslation } from '../i18n';

type Tab = 'styles' | 'scales' | 'improv' | 'guide';

const SCALE_GUIDE_KEY_MAP: Record<string, string> = {
  'Major (Ionian)': 'majorIonian',
  'Natural Minor (Aeolian)': 'naturalMinorAeolian',
  'Major Pentatonic': 'majorPentatonic',
  'Minor Pentatonic': 'minorPentatonic',
  'Blues': 'blues',
  'Mixolydian': 'mixolydian',
  'Dorian': 'dorian',
  'Phrygian': 'phrygian',
  'Lydian': 'lydian',
  'Locrian': 'locrian',
  'Harmonic Minor': 'harmonicMinor',
  'Melodic Minor': 'melodicMinor',
  'Lydian Dominant': 'lydianDominant',
  'Altered (Super Locrian)': 'altered',
  'Whole Tone': 'wholeTone',
  'Half-Whole Diminished': 'halfWholeDiminished',
  'Bebop Dominant': 'bebopDominant',
};

export function TheorySection() {
  const [activeTab, setActiveTab] = useState<Tab>('styles');
  const [openScale, setOpenScale] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const { t } = useTranslation();

  const guideGenres = Array.from(new Set(SCALES.flatMap((scale) => scale.styles)));
  const filteredGuideScales = selectedGenre === 'all'
    ? SCALES
    : SCALES.filter((scale) => scale.styles.includes(selectedGenre));

  const translateGenre = (genre: string) => {
    const key = `genres.${genre.toLowerCase()}`;
    const translated = t(key);
    return translated !== key ? translated : genre;
  };

  return (
    <section className="mt-16 border-t border-white/10 pt-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">{t('theory.title')}</h2>
        <p className="text-[#8E9299] max-w-2xl mx-auto">
          {t('theory.subtitle')}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab('styles')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
            activeTab === 'styles'
              ? "bg-[#F27D26] text-black shadow-[0_0_20px_rgba(242,125,38,0.4)]"
              : "bg-[#151619] text-[#8E9299] hover:bg-[#2A2A2B] hover:text-white border border-white/5"
          )}
        >
          <Music4 size={18} />
          {t('theory.tabs.styles')}
        </button>
        <button
          onClick={() => setActiveTab('scales')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
            activeTab === 'scales'
              ? "bg-[#06B6D4] text-black shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              : "bg-[#151619] text-[#8E9299] hover:bg-[#2A2A2B] hover:text-white border border-white/5"
          )}
        >
          <Library size={18} />
          {t('theory.tabs.scales')}
        </button>
        <button
          onClick={() => setActiveTab('improv')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
            activeTab === 'improv'
              ? "bg-[#AF52DE] text-white shadow-[0_0_20px_rgba(175,82,222,0.4)]"
              : "bg-[#151619] text-[#8E9299] hover:bg-[#2A2A2B] hover:text-white border border-white/5"
          )}
        >
          <Lightbulb size={18} />
          {t('theory.tabs.improv')}
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={cn(
            "flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300",
            activeTab === 'guide'
              ? "bg-[#10B981] text-black shadow-[0_0_20px_rgba(16,185,129,0.4)]"
              : "bg-[#151619] text-[#8E9299] hover:bg-[#2A2A2B] hover:text-white border border-white/5"
          )}
        >
          <BookOpen size={18} />
          {t('theory.tabs.guide')}
        </button>
      </div>

      <div className="bg-[#151619] border border-white/5 rounded-3xl p-8 md:p-12 min-h-[400px]">
        {activeTab === 'styles' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Guitar className="text-[#F27D26]" /> 
              {t('theory.styles.title')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">{t('theory.styles.bluesRock.title')}</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {t('theory.styles.bluesRock.desc')}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">{t('theory.styles.jazzFusion.title')}</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {t('theory.styles.jazzFusion.desc')}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">{t('theory.styles.metalHardRock.title')}</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {t('theory.styles.metalHardRock.desc')}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">{t('theory.styles.popClassical.title')}</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  {t('theory.styles.popClassical.desc')}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scales' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-2xl font-bold flex items-center gap-3">
              <Library className="text-[#06B6D4]" /> 
              {t('theory.scales.title')}
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  name: t('theory.scales.scaleNames.majorIonian'), 
                  mood: t('theory.scales.moods.majorIonian'), 
                  songs: ["Let It Be (The Beatles)", "Imagine (John Lennon)", "Don't Stop Believin' (Journey)", "Like a Rolling Stone (Bob Dylan)", "Good Vibrations (The Beach Boys)", "Baba O'Riley (The Who)", "Free Fallin' (Tom Petty)", "With or Without You (U2)", "Ode to Joy (Beethoven)", "Ob-La-Di, Ob-La-Da (The Beatles)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.dorian'), 
                  mood: t('theory.scales.moods.dorian'), 
                  songs: ["Oye Como Va (Santana)", "So What (Miles Davis)", "Eleanor Rigby (The Beatles)", "Scarborough Fair (Simon & Garfunkel)", "Mad World (Tears For Fears)", "Riders on the Storm (The Doors)", "Billie Jean (Michael Jackson - basso)", "Moondance (Van Morrison)", "The Thrill Is Gone (B.B. King)", "Light My Fire (The Doors - assolo)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.phrygian'), 
                  mood: t('theory.scales.moods.phrygian'), 
                  songs: ["Wherever I May Roam (Metallica)", "Symphony of Destruction (Megadeth)", "White Rabbit (Jefferson Airplane)", "Remember Tomorrow (Iron Maiden)", "London Calling (The Clash - intro)", "Set the Controls for the Heart of the Sun (Pink Floyd)", "The Sails of Charon (Scorpions)", "Know Your Enemy (Rage Against the Machine)", "War (Joe Satriani)", "Dirge for November (Opeth)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.lydian'), 
                  mood: t('theory.scales.moods.lydian'), 
                  songs: ["Flying In A Blue Dream (Joe Satriani)", "The Simpsons Theme (Danny Elfman)", "E.T. Theme (John Williams)", "Maria (West Side Story)", "Terminal Frost (Pink Floyd)", "Jane Says (Jane's Addiction)", "Oceans (Pearl Jam)", "Every Little Thing She Does Is Magic (The Police)", "Man on the Moon (R.E.M.)", "Freewill (Rush - assolo)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.mixolydian'), 
                  mood: t('theory.scales.moods.mixolydian'), 
                  songs: ["Sweet Child O' Mine (Guns N' Roses - assolo)", "Sweet Home Alabama (Lynyrd Skynyrd)", "Norwegian Wood (The Beatles)", "Hey Jude (The Beatles - coda finale)", "You Really Got Me (The Kinks)", "Sympathy for the Devil (The Rolling Stones)", "Dark Star (Grateful Dead)", "Clocks (Coldplay)", "Royals (Lorde)", "No Rain (Blind Melon)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.naturalMinorAeolian'), 
                  mood: t('theory.scales.moods.naturalMinorAeolian'), 
                  songs: ["Stairway to Heaven (Led Zeppelin - assolo)", "Losing My Religion (R.E.M.)", "Smells Like Teen Spirit (Nirvana)", "All Along the Watchtower (Jimi Hendrix)", "Ain't No Sunshine (Bill Withers)", "Dream On (Aerosmith)", "Sweet Dreams (Eurythmics)", "Hotel California (The Eagles)", "Comfortably Numb (Pink Floyd - assoli)", "Nothing Else Matters (Metallica)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.harmonicMinor'), 
                  mood: t('theory.scales.moods.harmonicMinor'), 
                  songs: ["Sultans of Swing (Dire Straits - arpeggio finale)", "Smooth (Santana)", "Hotel California (The Eagles - armonie finali)", "Far Beyond the Sun (Yngwie Malmsteen)", "Caprice No. 24 (Paganini)", "Miserlou (Dick Dale)", "Hava Nagila (Tradizionale)", "Innuendo (Queen - assolo flamenco)", "Diary of a Madman (Ozzy Osbourne)", "Black Magic Woman (Santana - elementi di assolo)"] 
                },
                { 
                  name: t('theory.scales.scaleNames.locrian'), 
                  mood: t('theory.scales.moods.locrian'), 
                  songs: ["Painkiller (Judas Priest - Riff principale)", "Juice (Steve Vai)", "Red (King Crimson)", "Army of Me (Björk)", "Dust to Dust (John Kirkpatrick)", "Yyz (Rush - intro riff)", "Enter Sandman (Metallica - elementi del riff)", "The Number of the Beast (Iron Maiden - riffing)", "Sign of the Cross (Iron Maiden)", "Prelude in B Minor (Chopin - sfumature locrie)"] 
                }
              ].map(item => (
                <div key={item.name} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#06B6D4]/50 transition-colors">
                  <h4 className="text-lg font-bold text-white mb-2">{item.name}</h4>
                  <p className="text-xs font-mono text-[#06B6D4] mb-3">{item.mood}</p>
                  <div className="text-sm text-white/70">
                    <span className="text-white/40 uppercase text-xs tracking-wider block mb-2">{t('theory.scales.referenceSongs')}</span>
                    <ul className="list-disc pl-4 space-y-1.5 marker:text-white/20">
                      {item.songs.map((song, idx) => (
                        <li key={idx} className="leading-snug">{song}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'improv' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-2xl font-bold flex items-center gap-3">
              <Lightbulb className="text-[#AF52DE]" /> 
              {t('theory.improv.title')}
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#AF52DE]/20 to-transparent border border-[#AF52DE]/30">
                    <h4 className="text-xl font-bold mb-3">{t('theory.improv.mixMajorMinor.title')}</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      {t('theory.improv.mixMajorMinor.desc')}
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed bg-black/30 p-4 rounded-lg">
                      <span className="block text-white mb-1">{t('theory.improv.mixMajorMinor.proTip')}</span>
                      {t('theory.improv.mixMajorMinor.proTipDesc')}
                    </p>
                  </div>
               </div>

               <div className="space-y-6">
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{t('theory.improv.chordScale.title')}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {t('theory.improv.chordScale.desc')}
                    </p>
                 </div>
                 
                 <hr className="border-white/10" />

                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">{t('theory.improv.passingNotes.title')}</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {t('theory.improv.passingNotes.desc')}
                    </p>
                 </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'guide' && (
          <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{t('guide.title')}</h3>
              <p className="text-white/60 text-sm">{t('guide.subtitle')}</p>
            </div>

            <div className="mb-6 flex flex-col gap-3">
              <div className="text-xs font-semibold uppercase tracking-wider text-white/50">
                {t('guide.filters.label')}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGenre('all');
                    setOpenScale(null);
                  }}
                  className={cn(
                    'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                    selectedGenre === 'all'
                      ? 'bg-[#F27D26] text-white border-[#F27D26]'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-[#F27D26]/50 hover:text-white'
                  )}
                >
                  {t('guide.filters.all')}
                </button>

                {guideGenres.map((genre) => (
                  <button
                    key={genre}
                    type="button"
                    onClick={() => {
                      setSelectedGenre(genre);
                      setOpenScale(null);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-full text-xs font-medium border transition-colors',
                      selectedGenre === genre
                        ? 'bg-[#F27D26] text-white border-[#F27D26]'
                        : 'bg-white/5 text-white/60 border-white/10 hover:border-[#F27D26]/50 hover:text-white'
                    )}
                  >
                    {translateGenre(genre)}
                  </button>
                ))}
              </div>
            </div>

            {filteredGuideScales.length === 0 ? (
              <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-white/60 text-sm text-center">
                {t('guide.filters.noResults')}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredGuideScales.map((scale) => {
                  const guideKey = SCALE_GUIDE_KEY_MAP[scale.name];
                  if (!guideKey) return null;
                  const isOpen = openScale === scale.name;

                  return (
                    <div
                      key={scale.name}
                      className="rounded-xl border border-white/10 overflow-hidden transition-all duration-300"
                    >
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenScale(isOpen ? null : scale.name)}
                          aria-expanded={isOpen}
                          className="w-full flex items-center justify-between px-5 py-4 bg-white/5 hover:bg-white/10 transition-colors text-left pr-24"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-wrap">
                            <span className="text-[#F27D26] font-semibold text-sm">
                              {t(`scales.${guideKey}`)}
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              {scale.styles.map((style) => (
                                <span
                                  key={style}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/50"
                                >
                                  {translateGenre(style)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className={`text-white/40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            void playScale(0, scale.intervals, 'acoustic');
                          }}
                          title={t('guide.playScale')}
                          aria-label={t('guide.playScaleAria', { scale: t(`scales.${guideKey}`) })}
                          className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-[#F27D26]/15 text-[#F27D26] hover:bg-[#F27D26] hover:text-white transition-colors"
                        >
                          <Play size={14} fill="currentColor" />
                        </button>
                      </div>

                      {isOpen && (
                        <div className="px-5 py-4 bg-white/[0.02] grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          {(['origin', 'character', 'theory', 'tips'] as const).map((field) => (
                            <div key={field} className="space-y-1">
                              <div className="text-xs font-semibold text-[#F27D26]/80 uppercase tracking-wider">
                                {t(`guide.labels.${field}`)}
                              </div>
                              <p className="text-white/70 text-sm leading-relaxed">
                                {t(`guide.scales.${guideKey}.${field}`)}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

import { useState } from 'react';
import { cn } from '../lib/utils';
import { Library, Music4, Lightbulb, Guitar } from 'lucide-react';

type Tab = 'styles' | 'scales' | 'improv';

export function TheorySection() {
  const [activeTab, setActiveTab] = useState<Tab>('styles');

  return (
    <section className="mt-16 border-t border-white/10 pt-16">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold tracking-tight mb-4">Guida Teorica alle Scale</h2>
        <p className="text-[#8E9299] max-w-2xl mx-auto">
          Scopri come le scale vengono utilizzate nei diversi generi, quali sono le loro sonorità
          caratteristiche e come applicarle nell'improvvisazione.
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
          Stili Musicali
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
          Scale e Canzoni
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
          Improvvisazione
        </button>
      </div>

      <div className="bg-[#151619] border border-white/5 rounded-3xl p-8 md:p-12 min-h-[400px]">
        {activeTab === 'styles' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <Guitar className="text-[#F27D26]" /> 
              Applicazione per Generi Musicali
            </h3>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">Blues & Rock</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  IL cuore del Blues è la <strong>Pentatonica Minore</strong> e la <strong>Scala Blues</strong> (con aggiunta della "blue note", b5). 
                  Nel Rock, l'<strong>Eolia (Minore Naturale)</strong> e la Pentatonica dominano. Spesso i chitarristi blues mescolano la 
                  Pentatonica Minore con la <strong>Misolidia</strong> o la Pentatonica Maggiore per creare un contrasto felice/triste tipico degli accordi di dominante (Es. accordi di 7a).
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">Jazz & Fusion</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  Il Jazz richiede scale per assecondare progressioni armoniche complesse (es. II-V-I). La <strong>Dorica</strong> è usatissima sugli accordi minori. 
                  Sui dominanti troviamo la <strong>Misolidia</strong>, o combinazioni tese come la <strong>Super Locria (Alterata)</strong>, la <strong>Lidia Dominante</strong> e la <strong>Semidiminuita/Diminuita</strong>.
                  La Fusion prende queste scale e le porta ad un'intensità ed un approccio ritmico "rock".
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">Metal & Hard Rock</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  L'aggressività è data dai semitoni vicini alla tonica (b2) e gradi "scuri". La <strong>Frigia</strong> e la <strong>Frigia Dominante</strong> 
                  sono un classico del metal, insieme alla <strong>Minore Armonica</strong> resa celebre dal metal neoclassico (Yngwie Malmsteen). 
                  La <strong>Locria</strong> si vede pesantemente in riff thrash/djent per il suo tritono intrinseco.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-[#F27D26]">Pop & Musica Classica</h4>
                <p className="text-white/70 text-sm leading-relaxed">
                  Pop e Classic Rock prosperano sulla <strong>Ionica (Maggiore)</strong> e l'<strong>Eolia (Minore)</strong>, in quanto generano 
                  melodie prevedibili e rassicuranti. La <strong>Lidia</strong> viene spesso usata per colonne sonore o passaggi "onirici", in quanto 
                  il 4° grado aumentato (#4) crea un'idea di "volo" o mistero risolto.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'scales' && (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <h3 className="text-2xl font-bold flex items-center gap-3">
              <Library className="text-[#06B6D4]" /> 
              Colori delle Scale e Brani Celebri
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { 
                  name: 'Ionica (Maggiore)', 
                  mood: 'Felice, Trionfante', 
                  songs: ["Let It Be (The Beatles)", "Imagine (John Lennon)", "Don't Stop Believin' (Journey)", "Like a Rolling Stone (Bob Dylan)", "Good Vibrations (The Beach Boys)", "Baba O'Riley (The Who)", "Free Fallin' (Tom Petty)", "With or Without You (U2)", "Ode to Joy (Beethoven)", "Ob-La-Di, Ob-La-Da (The Beatles)"] 
                },
                { 
                  name: 'Dorica', 
                  mood: 'Minore luminoso, Bluesy, Sofisticato', 
                  songs: ["Oye Como Va (Santana)", "So What (Miles Davis)", "Eleanor Rigby (The Beatles)", "Scarborough Fair (Simon & Garfunkel)", "Mad World (Tears For Fears)", "Riders on the Storm (The Doors)", "Billie Jean (Michael Jackson - basso)", "Moondance (Van Morrison)", "The Thrill Is Gone (B.B. King)", "Light My Fire (The Doors - assolo)"] 
                },
                { 
                  name: 'Frigia', 
                  mood: 'Oscuro, Spagnolo/Flamenco', 
                  songs: ["Wherever I May Roam (Metallica)", "Symphony of Destruction (Megadeth)", "White Rabbit (Jefferson Airplane)", "Remember Tomorrow (Iron Maiden)", "London Calling (The Clash - intro)", "Set the Controls for the Heart of the Sun (Pink Floyd)", "The Sails of Charon (Scorpions)", "Know Your Enemy (Rage Against the Machine)", "War (Joe Satriani)", "Dirge for November (Opeth)"] 
                },
                { 
                  name: 'Lidia', 
                  mood: 'Onirico, Fluttuante, Magico', 
                  songs: ["Flying In A Blue Dream (Joe Satriani)", "The Simpsons Theme (Danny Elfman)", "E.T. Theme (John Williams)", "Maria (West Side Story)", "Terminal Frost (Pink Floyd)", "Jane Says (Jane's Addiction)", "Oceans (Pearl Jam)", "Every Little Thing She Does Is Magic (The Police)", "Man on the Moon (R.E.M.)", "Freewill (Rush - assolo)"] 
                },
                { 
                  name: 'Misolidia', 
                  mood: "Maggiore bluesy, Rock 'n Roll", 
                  songs: ["Sweet Child O' Mine (Guns N' Roses - assolo)", "Sweet Home Alabama (Lynyrd Skynyrd)", "Norwegian Wood (The Beatles)", "Hey Jude (The Beatles - coda finale)", "You Really Got Me (The Kinks)", "Sympathy for the Devil (The Rolling Stones)", "Dark Star (Grateful Dead)", "Clocks (Coldplay)", "Royals (Lorde)", "No Rain (Blind Melon)"] 
                },
                { 
                  name: 'Eolia (Minore Nat.)', 
                  mood: 'Triste, Epico, Melanconico', 
                  songs: ["Stairway to Heaven (Led Zeppelin - assolo)", "Losing My Religion (R.E.M.)", "Smells Like Teen Spirit (Nirvana)", "All Along the Watchtower (Jimi Hendrix)", "Ain't No Sunshine (Bill Withers)", "Dream On (Aerosmith)", "Sweet Dreams (Eurythmics)", "Hotel California (The Eagles)", "Comfortably Numb (Pink Floyd - assoli)", "Nothing Else Matters (Metallica)"] 
                },
                { 
                  name: 'Minore Armonica', 
                  mood: 'Neoclassico, Mediorientale', 
                  songs: ["Sultans of Swing (Dire Straits - arpeggio finale)", "Smooth (Santana)", "Hotel California (The Eagles - armonie finali)", "Far Beyond the Sun (Yngwie Malmsteen)", "Caprice No. 24 (Paganini)", "Miserlou (Dick Dale)", "Hava Nagila (Tradizionale)", "Innuendo (Queen - assolo flamenco)", "Diary of a Madman (Ozzy Osbourne)", "Black Magic Woman (Santana - elementi di assolo)"] 
                },
                { 
                  name: 'Locria', 
                  mood: 'Teso, Irrisolto', 
                  songs: ["Painkiller (Judas Priest - Riff principale)", "Juice (Steve Vai)", "Red (King Crimson)", "Army of Me (Björk)", "Dust to Dust (John Kirkpatrick)", "Yyz (Rush - intro riff)", "Enter Sandman (Metallica - elementi del riff)", "The Number of the Beast (Iron Maiden - riffing)", "Sign of the Cross (Iron Maiden)", "Prelude in B Minor (Chopin - sfumature locrie)"] 
                }
              ].map(item => (
                <div key={item.name} className="p-5 rounded-xl bg-white/5 border border-white/10 hover:border-[#06B6D4]/50 transition-colors">
                  <h4 className="text-lg font-bold text-white mb-2">{item.name}</h4>
                  <p className="text-xs font-mono text-[#06B6D4] mb-3">{item.mood}</p>
                  <div className="text-sm text-white/70">
                    <span className="text-white/40 uppercase text-xs tracking-wider block mb-2">Brani di Riferimento:</span>
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
              Tecniche di Improvvisazione e Consigli
            </h3>

            <div className="grid md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-[#AF52DE]/20 to-transparent border border-[#AF52DE]/30">
                    <h4 className="text-xl font-bold mb-3">Mescolare Maggiore e Minore</h4>
                    <p className="text-white/80 text-sm leading-relaxed mb-4">
                      Una delle tecniche più iconiche del blues e del rock (stile B.B. King o Eric Clapton) 
                      è passare dalla Pentatonica Minore alla Pentatonica Maggiore <strong>mantenendo la stessa tonica</strong>. 
                    </p>
                    <p className="text-white/60 text-sm leading-relaxed bg-black/30 p-4 rounded-lg">
                      <span className="block text-white mb-1">💡 Pro Tip:</span>
                      Su un accordo di LA7 (A7), prova a suonare la Pentatonica Maggiore di LA (R, 2, 3, 5, 6) e, non appena senti il bisogno di inserire tensione e "blues", passa alla Pentatonica Minore di LA (R, b3, 4, 5, b7), specialmente evidenziando il bending dal b3 al 3.
                    </p>
                  </div>
               </div>

               <div className="space-y-6">
                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Suonare sui "Cambi" (Chord-Scale)</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Invece di usare una sola scala per tutta la canzone, visualizza l'accordo che sta suonando la ritmica in quel momento. 
                      Impostando in Compare Mode la scala della tonalità generale e l'arpeggio dell'accordo del momento, puoi individuare facilmente le <strong>Target Notes</strong> (Note Bersaglio) su cui fermare il tuo fraseggio.
                    </p>
                 </div>
                 
                 <hr className="border-white/10" />

                 <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Note di Passaggio (Cromatismo)</h4>
                    <p className="text-white/70 text-sm leading-relaxed">
                      Le scale contengono le note "giuste", ma sono i passaggi tra di esse che creano l'emozione. 
                      Scale come la Bebop Dominante aggiungono semplicemente un semitono di passaggio (la settima maggiore tra b7 e la fondamentale) 
                      in modo che, suonando crome fluide in battere, le note forti dell'accordo caschino sempre nel momento giusto del tempo.
                    </p>
                 </div>
               </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

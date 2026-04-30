export type SoundType = 
  | 'acoustic'
  | 'electric'
  | 'bass'
  | 'synth-lead'
  | 'epiano'
  | '8bit'
  | 'flute'
  | 'pad'
  | 'organ'
  | 'bell';

export const SOUND_TYPES: { id: SoundType; name: string }[] = [
  { id: 'acoustic', name: 'Acoustic Guitar' },
  { id: 'electric', name: 'Electric Muted' },
  { id: 'bass', name: 'Synth Bass' },
  { id: 'synth-lead', name: 'Synth Lead' },
  { id: 'epiano', name: 'Electric Piano' },
  { id: '8bit', name: '8-Bit Retro' },
  { id: 'flute', name: 'Flute' },
  { id: 'pad', name: 'Soft Pad' },
  { id: 'organ', name: 'Organ' },
  { id: 'bell', name: 'Crystal Bell' }
];

let audioCtx: AudioContext | null = null;
let masterGainNode: GainNode | null = null;
let currentVolume = 0.5;

let distortionCurve: Float32Array | null = null;
function getDistortionCurve(amount: number = 20) {
  if (distortionCurve) return distortionCurve;
  const n_samples = 44100;
  const curve = new Float32Array(n_samples);
  const deg = Math.PI / 180;
  for (let i = 0; i < n_samples; ++i) {
    const x = (i * 2) / n_samples - 1;
    curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
  }
  distortionCurve = curve;
  return curve;
}

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGainNode = audioCtx.createGain();
    // A soft compressor to avoid clipping on chords/overlaps
    const compressor = audioCtx.createDynamicsCompressor();
    compressor.threshold.value = -10;
    compressor.knee.value = 10;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.01;
    compressor.release.value = 0.15;
    
    masterGainNode.connect(compressor);
    compressor.connect(audioCtx.destination);
    masterGainNode.gain.value = currentVolume;
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

export function setMasterVolume(volume: number) {
  currentVolume = volume;
  if (masterGainNode && audioCtx) {
    masterGainNode.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.05);
  }
}

export function playTone(frequency: number, duration: number = 1.0, soundType: SoundType = 'acoustic', timeOffset: number = 0) {
  if (!audioCtx) initAudio();
  if (!audioCtx || !masterGainNode) return;

  const t = audioCtx.currentTime + timeOffset;

  // Note gain goes to master
  const masterGain = audioCtx.createGain();
  masterGain.connect(masterGainNode);

  if (soundType === '8bit') {
    // 8-bit retro needs to be short & staccato so notes don't bleed into cacophony
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.setValueAtTime(0.2, t + 0.01);
    masterGain.gain.setValueAtTime(0.2, t + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + 0.15); // Stops very fast

    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = frequency;
    osc.connect(masterGain);
    osc.start(t);
    osc.stop(t + 0.2);
    return;
  }

  if (soundType === 'synth-lead') {
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.3, t + 0.03);
    masterGain.gain.linearRampToValueAtTime(0.2, t + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 0.8);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 5, t);
    filter.frequency.exponentialRampToValueAtTime(frequency * 1.5, t + duration * 0.8);
    filter.connect(masterGain);

    [-4, 0, 4].forEach(detune => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      osc.connect(filter);
      
      // Vibrato
      if (detune === 0) {
        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 6;
        const lfoGain = audioCtx.createGain();
        lfoGain.gain.value = frequency * 0.015;
        lfo.connect(lfoGain);
        lfoGain.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + duration);
      }

      osc.start(t);
      osc.stop(t + duration);
    });
    return;
  }

  if (soundType === 'pad') {
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.25, t + 0.3); // Slow attack
    masterGain.gain.setValueAtTime(0.25, t + duration); // Sustain
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration + 1.0); // Slow release

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = frequency * 2;
    filter.connect(masterGain);

    [-8, 0, 8].forEach(detune => {
      const osc = audioCtx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.value = frequency;
      osc.detune.value = detune;
      osc.connect(filter);
      osc.start(t);
      osc.stop(t + duration + 1.0);
    });
    return;
  }

  if (soundType === 'organ') {
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.3, t + 0.02);
    masterGain.gain.setValueAtTime(0.3, t + duration - 0.05); // Full sustain
    masterGain.gain.linearRampToValueAtTime(0, t + duration); // Fast release

    // Additive synthesis for organ harmonics
    [1, 2, 3, 4].forEach((mult, i) => {
      const osc = audioCtx!.createOscillator(); // Non-null asserted
      osc.type = 'sine';
      osc.frequency.value = frequency * mult;
      const g = audioCtx!.createGain();
      g.gain.value = [0.5, 0.3, 0.15, 0.1][i];
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t);
      osc.stop(t + duration);
    });
    return;
  }

  if (soundType === 'flute') {
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.4, t + 0.1);
    masterGain.gain.setValueAtTime(0.4, t + duration - 0.1);
    masterGain.gain.linearRampToValueAtTime(0, t + duration);

    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency;
    
    // Subtle vibrato
    const lfo = audioCtx.createOscillator();
    lfo.frequency.value = 5.5;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 5;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    
    osc.connect(masterGain);
    
    // Breath noise
    const noiseSource = audioCtx.createBufferSource();
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    noiseSource.buffer = buffer;
    
    const noiseFilter = audioCtx.createBiquadFilter();
    noiseFilter.type = 'bandpass';
    noiseFilter.frequency.value = frequency * 2;
    noiseFilter.Q.value = 1.0;
    
    const nGain = audioCtx.createGain();
    nGain.gain.value = 0.08; // quiet breath
    
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(nGain);
    nGain.connect(masterGain);

    lfo.start(t);
    osc.start(t);
    noiseSource.start(t);
    lfo.stop(t + duration);
    osc.stop(t + duration);
    return;
  }
  
  if (soundType === 'bell') {
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.5, t + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 1.5);

    // FM synthesis approach for bell timbre
    [1, 2.78, 4.15].forEach((mult, i) => {
      const osc = audioCtx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = frequency * mult;
      const g = audioCtx!.createGain();
      g.gain.value = [0.5, 0.2, 0.1][i];
      osc.connect(g);
      g.connect(masterGain);
      osc.start(t);
      osc.stop(t + duration * 1.5);
    });
    return;
  }
  
  if (soundType === 'epiano') {
    masterGain.gain.setValueAtTime(0, t);
    masterGain.gain.linearRampToValueAtTime(0.5, t + 0.01);
    masterGain.gain.exponentialRampToValueAtTime(0.001, t + duration * 1.2);

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(frequency * 5, t);
    filter.frequency.exponentialRampToValueAtTime(frequency, t + 0.5);
    filter.connect(masterGain);

    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.value = frequency;
    
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = frequency * 2;
    
    // Tines (bell like transient)
    const osc3 = audioCtx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequency * 2.5; 
    const g3 = audioCtx.createGain();
    g3.gain.setValueAtTime(0.3, t);
    g3.gain.exponentialRampToValueAtTime(0.001, t + 0.2); // Very short
    osc3.connect(g3);
    g3.connect(filter);
    
    osc1.connect(filter);
    const g2 = audioCtx.createGain();
    g2.gain.value = 0.4;
    osc2.connect(g2);
    g2.connect(filter);

    osc1.start(t);
    osc2.start(t);
    osc3.start(t);
    osc1.stop(t + duration * 1.2);
    osc2.stop(t + duration * 1.2);
    osc3.stop(t + duration * 1.2);
    return;
  }

  // --- GUITARS & BASS (Acoustic, Electric, Synth Bass) ---
  const isBass = soundType === 'bass';
  const isElectric = soundType === 'electric';
  const freq = isBass ? frequency / 2 : frequency;

  // Envelope
  masterGain.gain.setValueAtTime(0, t);
  masterGain.gain.linearRampToValueAtTime(isBass ? 0.6 : 0.7, t + 0.015); // quick pick attack
  masterGain.gain.exponentialRampToValueAtTime(0.001, t + (isBass ? duration * 0.8 : duration * 1.5)); 

  // Realistic String Transient (Pluck)
  if (!isBass) {
    const pluckNoise = audioCtx.createBufferSource();
    const bSize = audioCtx.sampleRate * 0.02;
    const buf = audioCtx.createBuffer(1, bSize, audioCtx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
    pluckNoise.buffer = buf;
    
    const bpf = audioCtx.createBiquadFilter();
    bpf.type = "bandpass";
    bpf.frequency.value = freq * 3;
    bpf.Q.value = 0.5;
    
    const pGain = audioCtx.createGain();
    pGain.gain.setValueAtTime(isElectric ? 0.2 : 0.4, t);
    pGain.gain.exponentialRampToValueAtTime(0.01, t + 0.02);
    
    pluckNoise.connect(bpf);
    bpf.connect(pGain);
    pGain.connect(masterGain);
    pluckNoise.start(t);
  }

  // Body/String Tone
  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  // The filter closes over time representing string damping
  filter.frequency.setValueAtTime(freq * (isElectric ? 8 : (isBass ? 3 : 10)), t); 
  filter.frequency.exponentialRampToValueAtTime(freq * 1.5, t + duration * 0.5); 

  let outNode: AudioNode = filter;

  if (isElectric) {
    // Add crunch/distortion
    const waveshaper = audioCtx.createWaveShaper();
    waveshaper.curve = getDistortionCurve(10); // slight overdrive
    waveshaper.oversample = '4x';
    filter.connect(waveshaper);
    
    // Post EQ to calm the harsh fizz
    const postEq = audioCtx.createBiquadFilter();
    postEq.type = 'lowpass';
    postEq.frequency.value = 4000;
    waveshaper.connect(postEq);
    outNode = postEq;
  }
  
  outNode.connect(masterGain);

  const osc1 = audioCtx.createOscillator();
  osc1.type = isBass ? 'square' : 'sawtooth';
  osc1.frequency.value = freq;
  
  const osc2 = audioCtx.createOscillator();
  osc2.type = 'triangle';
  osc2.frequency.value = freq;
  const o2Gain = audioCtx.createGain();
  o2Gain.gain.value = isBass ? 1.0 : (isElectric ? 0.3 : 0.8);
  
  osc1.connect(filter);
  osc2.connect(o2Gain);
  o2Gain.connect(filter);

  // Small resonance for acoustic
  if (soundType === 'acoustic') {
    const reso = audioCtx.createGain();
    reso.gain.value = 0.5;
    osc2.connect(reso);
    reso.connect(masterGain); // clean triangle bypassing filter
  }

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + duration * 1.5);
  osc2.stop(t + duration * 1.5);
}

export function noteToFrequency(noteValue: number, octave: number = 3) {
  const midiNote = 12 * (octave + 1) + noteValue;
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

export async function playScale(rootNoteIndex: number, intervals: number[], soundType: SoundType = 'acoustic') {
  initAudio();
  let delay = 0;
  const NOTE_DURATION = 1.0;
  const GAP = 0.35; // Fast enough for fluid listening
  
  intervals.forEach(interval => {
    let note = rootNoteIndex + interval;
    let octave = 3; 
    while (note >= 12) {
      note -= 12;
      octave += 1;
    }
    const freq = noteToFrequency(note, octave);
    
    // We precision schedule everything via Web Audio (timeOffset)
    playTone(freq, NOTE_DURATION, soundType, delay);
    delay += GAP;
  });
  
  // High root
  let topNote = rootNoteIndex + 12;
  let topOctave = 3;
  while (topNote >= 12) {
      topNote -= 12;
      topOctave += 1;
  }
  
  playTone(noteToFrequency(topNote, topOctave), NOTE_DURATION + 1.0, soundType, delay);
}


/**
 * Premium Web Audio Synthesizer for EcoVerzz Onboarding
 * Synthesizes: ambient wind, flowing water hums, soft meditative piano chords, and custom interactive chimes
 */

class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private windGain: GainNode | null = null;
  private pianoInterval: any = null;
  private windInterval: any = null;
  private isPlaying: boolean = false;
  private muted: boolean = false;

  // Selected serene notes/chords (Pentatonic / Ambient scale)
  // C Major 7th, F Major 7th, A Minor 9th, G Major Sus4
  private chords = [
    [52, 55, 59, 64, 67], // E3, G3, B3, E4, G4 (Em7)
    [53, 57, 60, 64, 69], // F3, A3, C4, E4, A4 (Fmaj7)
    [52, 57, 60, 64, 67], // E3, A3, C4, E4, G4 (Am7)
    [55, 59, 62, 67, 71], // G3, B3, D4, G4, B4 (Gmaj)
  ];

  constructor() {
    // Lazy constructor
  }

  public init() {
    if (this.ctx) return;
    
    // Create audio context
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    this.ctx = new AudioContextClass();
    
    // Master Gain
    this.masterVolume = this.ctx.createGain();
    this.masterVolume.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterVolume.connect(this.ctx.destination);
    
    this.setupWind();
  }

  private setupWind() {
    if (!this.ctx || !this.masterVolume) return;

    try {
      // Create white noise buffer
      const bufferSize = 2 * this.ctx.sampleRate;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Noise Source
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      // Filter for wind effect
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);
      filter.Q.setValueAtTime(3.0, this.ctx.currentTime);

      // Gain Node for Wind
      this.windGain = this.ctx.createGain();
      this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      // Connections
      whiteNoise.connect(filter);
      filter.connect(this.windGain);
      this.windGain.connect(this.masterVolume);
      whiteNoise.start();

      // Modulation LFO (slow breeze sweep)
      this.windInterval = setInterval(() => {
        if (!this.ctx || this.muted) return;
        const now = this.ctx.currentTime;
        // Sweep filter cutoff between 250Hz and 800Hz
        const targetFreq = 250 + Math.random() * 550;
        filter.frequency.exponentialRampToValueAtTime(targetFreq, now + 3 + Math.random() * 4);
        
        // Random wind gusts
        const targetWindVol = 0.02 + Math.random() * 0.05;
        this.windGain?.gain.linearRampToValueAtTime(targetWindVol, now + 3 + Math.random() * 4);
      }, 5000);

    } catch (e) {
      console.warn("Could not setup wind noise synthesis", e);
    }
  }

  // Plays a beautiful soft sine piano note
  public playPianoNote(midiNote: number, delay = 0, duration = 3.5, velocity = 0.5) {
    if (!this.ctx || !this.masterVolume || this.muted) return;
    
    const now = this.ctx.currentTime + delay;
    const frequency = 440 * Math.pow(2, (midiNote - 69) / 12);
    
    // Core Oscillator
    const osc = this.ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(frequency, now);

    // Overtones for realistic depth (soft warm electric piano feel)
    const subOsc = this.ctx.createOscillator();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(frequency / 2, now); // sub-octave

    const overtone = this.ctx.createOscillator();
    overtone.type = "sine";
    overtone.frequency.setValueAtTime(frequency * 2, now); // double octave

    // Filter to make it warmer
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + duration);

    // Individual Note Gain
    const noteGain = this.ctx.createGain();
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(velocity * 0.2, now + 0.1); // soft attack
    noteGain.gain.exponentialRampToValueAtTime(0.001, now + duration); // slow release

    // Connect
    osc.connect(filter);
    subOsc.connect(filter);
    overtone.connect(filter);
    
    // Low velocity on overtones
    const overtoneGain = this.ctx.createGain();
    overtoneGain.gain.setValueAtTime(velocity * 0.02, now);
    overtone.connect(overtoneGain).connect(filter);

    filter.connect(noteGain);
    noteGain.connect(this.masterVolume);

    // Start & Stop
    osc.start(now);
    subOsc.start(now);
    overtone.start(now);
    
    osc.stop(now + duration + 0.5);
    subOsc.stop(now + duration + 0.5);
    overtone.stop(now + duration + 0.5);
  }

  // Start the background ambient track (wind + soft repeating piano progressions)
  public start() {
    this.init();
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    let chordIndex = 0;
    
    const playChordSequence = () => {
      if (!this.isPlaying || this.muted) return;
      const chord = this.chords[chordIndex];
      
      // Play notes staggered
      chord.forEach((note, i) => {
        const stagger = i * 0.4 + Math.random() * 0.2;
        const volume = 0.35 + Math.random() * 0.15;
        this.playPianoNote(note, stagger, 4.0, volume);
      });

      chordIndex = (chordIndex + 1) % this.chords.length;
    };

    // Play first chord immediately
    playChordSequence();

    // Loop chord progressions every 8 seconds
    this.pianoInterval = setInterval(playChordSequence, 8000);
  }

  // Stops background synthesizer
  public stop() {
    this.isPlaying = false;
    if (this.pianoInterval) {
      clearInterval(this.pianoInterval);
      this.pianoInterval = null;
    }
    if (this.windInterval) {
      clearInterval(this.windInterval);
      this.windInterval = null;
    }
  }

  // Toggle mute
  public toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.masterVolume && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterVolume.gain.linearRampToValueAtTime(this.muted ? 0 : 0.3, now + 0.5);
    }
    return this.muted;
  }

  public isMuted() {
    return this.muted;
  }

  // Custom visual feedback sounds
  public playWaterRipple() {
    if (!this.ctx || !this.masterVolume || this.muted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = "sine";
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.6); // liquid rising tone

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(this.masterVolume);
    
    osc.start(now);
    osc.stop(now + 0.7);
  }

  public playLeafRustle() {
    if (!this.ctx || !this.masterVolume || this.muted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const bandpass = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(1200 + Math.random() * 400, now);

    bandpass.type = "bandpass";
    bandpass.frequency.setValueAtTime(2000, now);
    bandpass.Q.setValueAtTime(1.5, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.03, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(bandpass).connect(gain).connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.5);
  }

  public playSuccessChime() {
    if (!this.ctx || !this.masterVolume || this.muted) return;
    const now = this.ctx.currentTime;

    // Arpeggio chords indicating level up
    const notes = [64, 67, 71, 76, 79]; // E5, G5, B5, E6, G6
    notes.forEach((note, index) => {
      const delay = index * 0.12;
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(440 * Math.pow(2, (note - 69) / 12), now + delay);

      gain.gain.setValueAtTime(0, now + delay);
      gain.gain.linearRampToValueAtTime(0.1, now + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.8);

      osc.connect(gain).connect(this.masterVolume!);
      osc.start(now + delay);
      osc.stop(now + delay + 1.0);
    });
  }

  public playTick() {
    if (!this.ctx || !this.masterVolume || this.muted) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.08);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain).connect(this.masterVolume);
    osc.start(now);
    osc.stop(now + 0.1);
  }
}

export const audioEngine = new AudioEngine();
export default audioEngine;

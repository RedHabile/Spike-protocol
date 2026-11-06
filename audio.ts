/**
 * Moteur audio synthétisé — Web Audio API.
 * Tous les effets sont générés procéduralement (oscillateurs + bruit filtré).
 */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private _muted = false;

  constructor() {
    this._muted = typeof localStorage !== "undefined" && localStorage.getItem("spike-muted") === "1";
  }

  get muted(): boolean {
    return this._muted;
  }

  toggleMute(): boolean {
    this._muted = !this._muted;
    try {
      localStorage.setItem("spike-muted", this._muted ? "1" : "0");
    } catch {
      /* stockage indisponible */
    }
    if (this.master) this.master.gain.value = this._muted ? 0 : 0.5;
    return this._muted;
  }

  /** Doit être appelé depuis un geste utilisateur. */
  unlock(): void {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : 0.5;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -18;
      comp.ratio.value = 6;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  private tone(opts: {
    type: OscillatorType;
    from: number;
    to?: number;
    dur: number;
    gain?: number;
    delay?: number;
  }): void {
    if (!this.ctx || !this.master || this._muted) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = opts.type;
    osc.frequency.setValueAtTime(Math.max(20, opts.from), t0);
    if (opts.to !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t0 + opts.dur);
    }
    const peak = opts.gain ?? 0.2;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    osc.connect(g);
    g.connect(this.master);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.05);
  }

  private noise(opts: { dur: number; gain?: number; from?: number; to?: number; delay?: number }): void {
    if (!this.ctx || !this.master || this._muted) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * opts.dur));
    const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(opts.from ?? 3200, t0);
    if (opts.to !== undefined) filter.frequency.exponentialRampToValueAtTime(Math.max(40, opts.to), t0 + opts.dur);
    const g = this.ctx.createGain();
    const peak = opts.gain ?? 0.25;
    g.gain.setValueAtTime(peak, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start(t0);
  }

  /** Impulsion verticale du joueur. */
  flap(): void {
    this.tone({ type: "square", from: 520, to: 880, dur: 0.09, gain: 0.08 });
    this.tone({ type: "sine", from: 240, to: 420, dur: 0.1, gain: 0.12 });
  }

  /** Rebond sur un mur. */
  bounce(): void {
    this.tone({ type: "sine", from: 160, to: 90, dur: 0.16, gain: 0.3 });
    this.noise({ dur: 0.05, gain: 0.06, from: 5000, to: 1200 });
  }

  /** Éclat de données collecté. */
  shard(): void {
    this.tone({ type: "triangle", from: 660, dur: 0.09, gain: 0.16 });
    this.tone({ type: "triangle", from: 990, dur: 0.12, gain: 0.16, delay: 0.07 });
    this.tone({ type: "triangle", from: 1320, dur: 0.16, gain: 0.12, delay: 0.14 });
  }

  /** Bonus ramassé. */
  powerup(): void {
    this.tone({ type: "sawtooth", from: 220, to: 880, dur: 0.3, gain: 0.1 });
    this.tone({ type: "sine", from: 440, to: 1760, dur: 0.32, gain: 0.1, delay: 0.02 });
  }

  /** Bouclier brisé. */
  shieldBreak(): void {
    this.noise({ dur: 0.28, gain: 0.32, from: 6000, to: 500 });
    this.tone({ type: "square", from: 700, to: 140, dur: 0.3, gain: 0.16 });
    this.tone({ type: "sine", from: 300, to: 120, dur: 0.34, gain: 0.2 });
  }

  /** Mort du joueur. */
  death(): void {
    this.noise({ dur: 0.5, gain: 0.4, from: 4000, to: 120 });
    this.tone({ type: "sawtooth", from: 320, to: 40, dur: 0.6, gain: 0.26 });
    this.tone({ type: "sine", from: 120, to: 30, dur: 0.7, gain: 0.3 });
  }

  /** Montée de niveau de menace. */
  threat(): void {
    this.tone({ type: "square", from: 392, dur: 0.09, gain: 0.1 });
    this.tone({ type: "square", from: 523, dur: 0.09, gain: 0.1, delay: 0.09 });
    this.tone({ type: "square", from: 784, dur: 0.2, gain: 0.12, delay: 0.18 });
  }

  /** Clic d'interface. */
  ui(): void {
    this.tone({ type: "square", from: 1200, to: 900, dur: 0.05, gain: 0.07 });
  }

  /** Fin de partie — jingle. */
  gameOverJingle(): void {
    this.tone({ type: "triangle", from: 523, dur: 0.14, gain: 0.12, delay: 0.2 });
    this.tone({ type: "triangle", from: 392, dur: 0.14, gain: 0.12, delay: 0.36 });
    this.tone({ type: "triangle", from: 262, dur: 0.3, gain: 0.14, delay: 0.52 });
  }
}

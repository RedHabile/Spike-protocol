/**
 * Synthèse audio réactive pour Spike Protocol.
 * Sons courts, enveloppes propres et démarrage audio différé jusqu'au déverrouillage
 * du navigateur afin d'éviter les effets qui arrivent en retard au premier input.
 */
export class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private noiseBuffer: AudioBuffer | null = null;
  private _muted = false;
  private pending: Array<() => void> = [];
  private resumePending = false;

  constructor() {
    this._muted = typeof localStorage !== "undefined" && localStorage.getItem("spike-muted") === "1";
  }

  get muted(): boolean { return this._muted; }

  toggleMute(): boolean {
    this._muted = !this._muted;
    try { localStorage.setItem("spike-muted", this._muted ? "1" : "0"); } catch { /* stockage indisponible */ }
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(this._muted ? 0 : 0.42, now, 0.025);
    }
    return this._muted;
  }

  /** À appeler dès le premier geste utilisateur, avant de jouer un effet. */
  unlock(): void {
    if (!this.ctx) {
      const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC({ latencyHint: "interactive" });
      this.master = this.ctx.createGain();
      this.master.gain.value = this._muted ? 0 : 0.42;
      const comp = this.ctx.createDynamicsCompressor();
      comp.threshold.value = -22;
      comp.knee.value = 18;
      comp.ratio.value = 4;
      comp.attack.value = 0.003;
      comp.release.value = 0.12;
      this.master.connect(comp);
      comp.connect(this.ctx.destination);

      // Un buffer de bruit réutilisable évite de fabriquer un nouveau buffer à chaque impact.
      this.noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate, this.ctx.sampleRate);
      const data = this.noiseBuffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    }
    this.resumeContext();
  }

  private resumeContext(): void {
    if (!this.ctx || this.ctx.state === "running" || this.resumePending) return;
    this.resumePending = true;
    void this.ctx.resume().catch(() => undefined).finally(() => {
      this.resumePending = false;
      if (this.ctx?.state === "running") {
        const queued = this.pending.splice(0);
        for (const play of queued) play();
      }
    });
  }

  private ready(play: () => void): boolean {
    if (!this.ctx || !this.master || this._muted) return false;
    if (this.ctx.state !== "running") {
      this.pending.push(play);
      this.resumeContext();
      return false;
    }
    return true;
  }

  private tone(opts: {
    type: OscillatorType; from: number; to?: number; dur: number;
    gain?: number; delay?: number; attack?: number; cutoff?: number;
  }): void {
    if (!this.ctx || !this.master || !this.ready(() => this.tone(opts))) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const osc = this.ctx.createOscillator();
    const amp = this.ctx.createGain();
    const peak = opts.gain ?? 0.16;
    const attack = opts.attack ?? 0.008;
    osc.type = opts.type;
    osc.frequency.setValueAtTime(Math.max(20, opts.from), t0);
    if (opts.to !== undefined) osc.frequency.exponentialRampToValueAtTime(Math.max(20, opts.to), t0 + opts.dur);
    let output: AudioNode = osc;
    if (opts.cutoff) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(opts.cutoff, t0);
      osc.connect(filter);
      output = filter;
    }
    output.connect(amp);
    amp.connect(this.master);
    amp.gain.setValueAtTime(0.0001, t0);
    amp.gain.exponentialRampToValueAtTime(peak, t0 + attack);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    osc.start(t0);
    osc.stop(t0 + opts.dur + 0.015);
  }

  private noise(opts: {
    dur: number; gain?: number; from?: number; to?: number; delay?: number;
    type?: BiquadFilterType;
  }): void {
    if (!this.ctx || !this.master || !this.noiseBuffer || !this.ready(() => this.noise(opts))) return;
    const t0 = this.ctx.currentTime + (opts.delay ?? 0);
    const src = this.ctx.createBufferSource();
    src.buffer = this.noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = opts.type ?? "lowpass";
    filter.frequency.setValueAtTime(opts.from ?? 3200, t0);
    if (opts.to !== undefined) filter.frequency.exponentialRampToValueAtTime(Math.max(50, opts.to), t0 + opts.dur);
    const amp = this.ctx.createGain();
    amp.gain.setValueAtTime(opts.gain ?? 0.16, t0);
    amp.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur);
    src.connect(filter);
    filter.connect(amp);
    amp.connect(this.master);
    src.start(t0);
    src.stop(t0 + opts.dur + 0.01);
  }

  /** Impulsion verticale : petit souffle puis impulsion brillante. */
  flap(): void {
    this.tone({ type: "sine", from: 190, to: 470, dur: 0.105, gain: 0.16 });
    this.tone({ type: "triangle", from: 620, to: 980, dur: 0.075, gain: 0.055, delay: 0.008 });
    this.noise({ dur: 0.045, gain: 0.035, from: 1800, to: 7000, type: "highpass" });
  }

  /** Rebond : impact grave et claquement très court. */
  bounce(): void {
    this.tone({ type: "sine", from: 210, to: 76, dur: 0.14, gain: 0.23 });
    this.tone({ type: "triangle", from: 460, to: 180, dur: 0.075, gain: 0.07 });
    this.noise({ dur: 0.055, gain: 0.09, from: 4200, to: 650, type: "bandpass" });
  }

  /** Collecte : note cristalline ascendante, plus nette et plus rapide. */
  shard(): void {
    this.tone({ type: "sine", from: 740, to: 980, dur: 0.105, gain: 0.13 });
    this.tone({ type: "triangle", from: 1110, to: 1480, dur: 0.13, gain: 0.095, delay: 0.045 });
    this.tone({ type: "sine", from: 1760, to: 1320, dur: 0.16, gain: 0.045, delay: 0.085 });
  }

  /** Bonus : montée en puissance avec une petite résolution harmonique. */
  powerup(): void {
    this.tone({ type: "sawtooth", from: 180, to: 720, dur: 0.24, gain: 0.065, cutoff: 1800 });
    this.tone({ type: "sine", from: 360, to: 1080, dur: 0.28, gain: 0.11, delay: 0.025 });
    this.tone({ type: "triangle", from: 720, to: 1440, dur: 0.19, gain: 0.07, delay: 0.13 });
  }

  /** Bouclier brisé : éclat métallique descendant. */
  shieldBreak(): void {
    this.noise({ dur: 0.24, gain: 0.2, from: 5200, to: 420, type: "bandpass" });
    this.tone({ type: "square", from: 880, to: 180, dur: 0.22, gain: 0.075, cutoff: 2400 });
    this.tone({ type: "sine", from: 330, to: 82, dur: 0.3, gain: 0.19 });
  }

  /** Fin de partie : impact sourd suivi d'une descente synthétique. */
  death(): void {
    this.noise({ dur: 0.42, gain: 0.22, from: 2600, to: 160, type: "lowpass" });
    this.tone({ type: "sawtooth", from: 260, to: 48, dur: 0.48, gain: 0.12, cutoff: 900 });
    this.tone({ type: "sine", from: 115, to: 38, dur: 0.62, gain: 0.22, delay: 0.025 });
  }

  /** Alerte de menace : trois impulsions courtes et tendues. */
  threat(): void {
    this.tone({ type: "sawtooth", from: 440, to: 390, dur: 0.075, gain: 0.07, cutoff: 1500 });
    this.tone({ type: "square", from: 590, to: 540, dur: 0.075, gain: 0.065, delay: 0.085 });
    this.tone({ type: "triangle", from: 880, to: 660, dur: 0.16, gain: 0.09, delay: 0.17 });
  }

  /** Clic d'interface : discret, sec et instantané. */
  ui(): void {
    this.tone({ type: "sine", from: 1050, to: 760, dur: 0.035, gain: 0.045, attack: 0.002 });
    this.tone({ type: "triangle", from: 1500, to: 1200, dur: 0.025, gain: 0.018, attack: 0.002 });
  }

  /** Jingle de fin : trois notes propres, sans délai de démarrage artificiel. */
  gameOverJingle(): void {
    this.tone({ type: "triangle", from: 494, to: 466, dur: 0.13, gain: 0.09, delay: 0.04 });
    this.tone({ type: "triangle", from: 370, to: 349, dur: 0.14, gain: 0.095, delay: 0.19 });
    this.tone({ type: "sine", from: 247, to: 185, dur: 0.28, gain: 0.12, delay: 0.36 });
  }
}

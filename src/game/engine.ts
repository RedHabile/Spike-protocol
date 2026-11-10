import { SoundEngine } from "./audio";

export type GameState = "menu" | "playing" | "paused" | "gameover";

export interface GameStats {
  score: number;
  best: number;
  newBest: boolean;
  shards: number;
  time: number;
  maxSpeed: number;
  level: number;
  rank: string;
  xpEarned: number;
}

type PowerType = "shield" | "slowmo" | "magnet";

export type SkinId = "classic"|"plasma"|"toxic"|"sunset"|"ice"|"void"|"cobalt"|"crimson"|"sandstorm"|"digital"|"carbon"|"royal"|"hazard"|"aurora"|"obsidian"|"titan"|"eclipse"|"inferno"|"overdrive"|"apex"|"warborn"|"headhunter"|"immortal"|"vanguard"|"overlord"|"spectral"|"nebula"|"prism"|"royalflare"|"deepsea"|"rosequartz"|"cyberpunk"|"goldrush"|"ghostwire"|"starlight"|"venomwave"|"frostbite"|"bloodmoon"|"neonviper"|"galaxy"|"chromatic"|"sunken"|"emberstorm"|"ultraviolet"|"hologram"|"singularity";
export type TrailId = "comet"|"lightning"|"embers"|"prism"|"glitch"|"aurora"|"void"|"stardust";
export const TRAILS:{id:TrailId;name:string;colors:string[];glow:string;style:"smooth"|"dash"|"spark"|"ribbon"}[]=[
{id:"comet",name:"COMÈTE",colors:["#fff","#67e8f9","#0891b2"],glow:"#22d3ee",style:"smooth"},
{id:"lightning",name:"ÉCLAIR",colors:["#fff","#fef08a","#eab308"],glow:"#facc15",style:"dash"},
{id:"embers",name:"BRAISES",colors:["#fef3c7","#fb923c","#dc2626"],glow:"#f97316",style:"spark"},
{id:"prism",name:"PRISME",colors:["#f0abfc","#38bdf8","#a3e635"],glow:"#c084fc",style:"ribbon"},
{id:"glitch",name:"GLITCH",colors:["#f0abfc","#ec4899","#22d3ee"],glow:"#e879f9",style:"dash"},
{id:"aurora",name:"AURORE",colors:["#ccfbf1","#2dd4bf","#8b5cf6"],glow:"#5eead4",style:"ribbon"},
{id:"void",name:"NÉANT",colors:["#e2e8f0","#818cf8","#312e81"],glow:"#818cf8",style:"smooth"},
{id:"stardust",name:"POUSSIÈRE D'ÉTOILES",colors:["#fff","#c4b5fd","#f9a8d4"],glow:"#c4b5fd",style:"spark"}
];
export const SKINS:{id:SkinId;name:string;unlock:number;bright:string;mid:string;dark:string;glow:string}[]=[
{id:"classic",name:"CYAN CORE",unlock:1,bright:"#fff",mid:"#a5f3fc",dark:"#0891b2",glow:"#22d3ee"},
{id:"plasma",name:"PLASMA",unlock:2,bright:"#fff",mid:"#f0abfc",dark:"#a21caf",glow:"#e879f9"},
{id:"toxic",name:"TOXIC",unlock:3,bright:"#f7fee7",mid:"#bef264",dark:"#4d7c0f",glow:"#a3e635"},
{id:"sunset",name:"SUNSET",unlock:4,bright:"#fff7ed",mid:"#fdba74",dark:"#c2410c",glow:"#fb923c"},
{id:"ice",name:"ICE",unlock:5,bright:"#fff",mid:"#bfdbfe",dark:"#2563eb",glow:"#60a5fa"},
{id:"void",name:"VOID",unlock:6,bright:"#f5f3ff",mid:"#c4b5fd",dark:"#6d28d9",glow:"#a78bfa"},
{id:"cobalt",name:"COBALT",unlock:7,bright:"#dbeafe",mid:"#60a5fa",dark:"#1e40af",glow:"#3b82f6"},
{id:"crimson",name:"CRIMSON",unlock:8,bright:"#ffe4e6",mid:"#fb7185",dark:"#881337",glow:"#f43f5e"},
{id:"sandstorm",name:"SANDSTORM",unlock:9,bright:"#fff7d6",mid:"#d6bd8b",dark:"#78613e",glow:"#eabf67"},
{id:"digital",name:"DIGITAL CAMO",unlock:10,bright:"#e0f2fe",mid:"#22d3ee",dark:"#164e63",glow:"#06b6d4"},
{id:"carbon",name:"CARBON",unlock:11,bright:"#f5f5f5",mid:"#737373",dark:"#171717",glow:"#a3a3a3"},
{id:"royal",name:"ROYAL",unlock:12,bright:"#f3e8ff",mid:"#c084fc",dark:"#581c87",glow:"#a855f7"},
{id:"hazard",name:"HAZARD",unlock:13,bright:"#fef9c3",mid:"#facc15",dark:"#713f12",glow:"#eab308"},
{id:"aurora",name:"AURORA",unlock:14,bright:"#ccfbf1",mid:"#5eead4",dark:"#115e59",glow:"#2dd4bf"},
{id:"obsidian",name:"OBSIDIAN",unlock:15,bright:"#ede9fe",mid:"#8b5cf6",dark:"#181025",glow:"#7c3aed"},
{id:"titan",name:"TITAN",unlock:16,bright:"#e0f2fe",mid:"#94a3b8",dark:"#334155",glow:"#64748b"},
{id:"eclipse",name:"ECLIPSE",unlock:17,bright:"#fef3c7",mid:"#f59e0b",dark:"#111827",glow:"#fbbf24"},
{id:"inferno",name:"INFERNO",unlock:18,bright:"#ffedd5",mid:"#f97316",dark:"#7c2d12",glow:"#ea580c"},
{id:"overdrive",name:"OVERDRIVE",unlock:19,bright:"#ecfccb",mid:"#84cc16",dark:"#365314",glow:"#a3e635"},
{id:"apex",name:"APEX",unlock:20,bright:"#fef3c7",mid:"#fbbf24",dark:"#713f12",glow:"#f59e0b"},
{id:"warborn",name:"WARBORN",unlock:0,bright:"#ffedd5",mid:"#f59e0b",dark:"#78350f",glow:"#d97706"},
{id:"headhunter",name:"HEADHUNTER",unlock:0,bright:"#ffe4e6",mid:"#fb7185",dark:"#4c0519",glow:"#e11d48"},
{id:"immortal",name:"IMMORTAL",unlock:0,bright:"#ecfeff",mid:"#22d3ee",dark:"#164e63",glow:"#0891b2"},
{id:"vanguard",name:"VANGUARD",unlock:0,bright:"#d9f99d",mid:"#4ade80",dark:"#14532d",glow:"#16a34a"},
{id:"overlord",name:"OVERLORD",unlock:0,bright:"#fee2e2",mid:"#dc2626",dark:"#450a0a",glow:"#b91c1c"},
{id:"spectral",name:"SPECTRAL",unlock:0,bright:"#ecfeff",mid:"#67e8f9",dark:"#164e63",glow:"#06b6d4"},
{id:"nebula",name:"NÉBULEUSE",unlock:0,bright:"#f0abfc",mid:"#a855f7",dark:"#1e1b4b",glow:"#c084fc"},
{id:"prism",name:"PRISMATIQUE",unlock:0,bright:"#fef08a",mid:"#38bdf8",dark:"#7c3aed",glow:"#67e8f9"},
{id:"royalflare",name:"FLAMME ROYALE",unlock:0,bright:"#fda4af",mid:"#f97316",dark:"#581c87",glow:"#fb7185"},
{id:"deepsea",name:"ABYSSE",unlock:0,bright:"#67e8f9",mid:"#0e7490",dark:"#082f49",glow:"#22d3ee"},
{id:"rosequartz",name:"QUARTZ ROSE",unlock:0,bright:"#fbcfe8",mid:"#e879f9",dark:"#831843",glow:"#f0abfc"},
{id:"cyberpunk",name:"CYBERPUNK",unlock:0,bright:"#f0abfc",mid:"#ec4899",dark:"#312e81",glow:"#e879f9"},
{id:"goldrush",name:"RUÉE D'OR",unlock:0,bright:"#fef3c7",mid:"#f59e0b",dark:"#78350f",glow:"#fbbf24"},
{id:"ghostwire",name:"FIL FANTÔME",unlock:0,bright:"#e0e7ff",mid:"#818cf8",dark:"#1e1b4b",glow:"#a5b4fc"},
{id:"starlight",name:"POUSSIÈRE D'ÉTOILES",unlock:0,bright:"#fef9c3",mid:"#c084fc",dark:"#312e81",glow:"#c4b5fd"},
{id:"venomwave",name:"VAGUE TOXIQUE",unlock:0,bright:"#d9f99d",mid:"#14b8a6",dark:"#064e3b",glow:"#2dd4bf"},
{id:"frostbite",name:"MORSURE GLACÉE",unlock:0,bright:"#e0f2fe",mid:"#38bdf8",dark:"#1e3a8a",glow:"#7dd3fc"},
{id:"bloodmoon",name:"LUNE SANGUINE",unlock:0,bright:"#fecaca",mid:"#dc2626",dark:"#450a0a",glow:"#ef4444"},
{id:"neonviper",name:"VIPÈRE NÉON",unlock:0,bright:"#d9f99d",mid:"#a3e635",dark:"#3f6212",glow:"#bef264"},
{id:"galaxy",name:"GALAXIE",unlock:0,bright:"#f5d0fe",mid:"#6366f1",dark:"#1e1b4b",glow:"#a78bfa"},
{id:"chromatic",name:"CHROMATIQUE",unlock:0,bright:"#fef08a",mid:"#f472b6",dark:"#2563eb",glow:"#e879f9"},
{id:"sunken",name:"CITÉ ENGLOUTIE",unlock:0,bright:"#a5f3fc",mid:"#0d9488",dark:"#134e4a",glow:"#5eead4"},
{id:"emberstorm",name:"TEMPÊTE DE BRAISE",unlock:0,bright:"#fed7aa",mid:"#ea580c",dark:"#7f1d1d",glow:"#fb923c"},
{id:"ultraviolet",name:"ULTRAVIOLET",unlock:0,bright:"#e9d5ff",mid:"#9333ea",dark:"#3b0764",glow:"#c084fc"},
{id:"hologram",name:"HOLOGRAMME",unlock:0,bright:"#cffafe",mid:"#a78bfa",dark:"#0f766e",glow:"#67e8f9"},
{id:"singularity",name:"SINGULARITÉ",unlock:0,bright:"#f5f3ff",mid:"#64748b",dark:"#111827",glow:"#c4b5fd"}];

export const SHOP_SKIN_IDS: SkinId[] = ["nebula","prism","royalflare","deepsea","rosequartz","cyberpunk","goldrush","ghostwire","starlight","venomwave","frostbite","bloodmoon","neonviper","galaxy","chromatic","sunken","emberstorm","ultraviolet","hologram","singularity"];

interface Spike {
  cy: number;
  len: number;
  wid: number;
  t: number; // âge (armement progressif)
}

interface Shard {
  x: number;
  y: number;
  rot: number;
  age: number;
  ttl: number;
}

interface PowerUp {
  x: number;
  y: number;
  type: PowerType;
  age: number;
  ttl: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  ttl: number;
  size: number;
  color: string;
  drag: number;
  grav: number;
}

interface FloatText {
  x: number;
  y: number;
  txt: string;
  age: number;
  ttl: number;
  color: string;
  size: number;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  chars: string[];
  drift: number;
}

const TAU = Math.PI * 2;
const rand = (a: number, b: number) => a + Math.random() * (b - a);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const GLYPHS = "01ΣΩ∆#%&$@!?<>/|=+*×¤§µ";
const THREAT_STEPS = [0, 8, 18, 32, 50, 72, 100, 135];
const BACKGROUND_THEMES = [
  { score: 0, top: "#020711", mid: "#071827", bottom: "#02040b", halo: "rgba(34,211,238,0.12)", grid: "rgba(103,232,249,0.08)", data: "34,211,238", style: "circuit" },
  { score: 10, top: "#160522", mid: "#351044", bottom: "#090313", halo: "rgba(232,60,255,0.20)", grid: "rgba(232,121,249,0.10)", data: "232,121,249", style: "stars" },
  { score: 25, top: "#071b08", mid: "#123b12", bottom: "#030b05", halo: "rgba(163,230,53,0.17)", grid: "rgba(190,242,100,0.09)", data: "190,242,100", style: "matrix" },
  { score: 50, top: "#2b0904", mid: "#57200a", bottom: "#100402", halo: "rgba(251,146,60,0.20)", grid: "rgba(251,146,60,0.08)", data: "251,146,60", style: "sun" },
  { score: 75, top: "#03152e", mid: "#082e52", bottom: "#020714", halo: "rgba(56,189,248,0.20)", grid: "rgba(147,197,253,0.10)", data: "147,197,253", style: "scan" },
  { score: 100, top: "#100526", mid: "#2a0b50", bottom: "#05020e", halo: "rgba(192,132,252,0.22)", grid: "rgba(196,181,253,0.10)", data: "196,181,253", style: "rings" },
] as const;

const rankFor = (score: number): string => {
  if (score >= 100) return "FANTÔME";
  if (score >= 50) return "NETRUNNER";
  if (score >= 25) return "PIRATE";
  if (score >= 10) return "OPÉRATEUR";
  return "RECRUE";
};

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private onState: (s: GameState, stats?: GameStats) => void;
  private sound = new SoundEngine();
  private raf = 0;
  private lastT = 0;
  private destroyed = false;

  private dpr = 1;
  private w = 0;
  private h = 0;
  private arena = { x: 0, y: 0, w: 0, h: 0 };
  private u = 1; // échelle verticale
  private uh = 1; // échelle HUD horizontale

  state: GameState = "menu";
  private score = 0;
  private best = 0;
  private newBest = false;
  private shardsCollected = 0;
  private playTime = 0;
  private maxSpeed = 0;
  private level = 0;
  private skinId: SkinId = "classic";
  private trailId: TrailId = "comet";

  private get skin() { return SKINS.find((s) => s.id === this.skinId) ?? SKINS[0]; }

  setSkin(id: SkinId): void { this.skinId = id; }
  setTrail(id: TrailId): void { this.trailId = id; }

  private bgTime = 0;
  private bgThemeIndex = 0;
  private previousBgThemeIndex = 0;
  private bgTransitionStart = 0;
  private glitchT = 0;
  private nextGlitch = 2.5;

  private player = {
    x: 0,
    y: 0,
    vy: 0,
    dir: 1,
    squash: 0,
    invuln: 0,
    shield: false,
    slowmoT: 0,
    magnetT: 0,
  };

  private spikesL: Spike[] = [];
  private spikesR: Spike[] = [];
  private shard: Shard | null = null;
  private shardTimer = 2.5;
  private powerups: PowerUp[] = [];
  private powerTimer = 11;
  private particles: Particle[] = [];
  private floats: FloatText[] = [];
  private trail: { x: number; y: number }[] = [];
  private drops: Drop[] = [];

  private shake = 0;
  private flash = { r: 0, g: 0, b: 0, a: 0 };
  private wallFlashL = 0;
  private wallFlashR = 0;

  private dead = false;
  private deadT = 0;

  constructor(canvas: HTMLCanvasElement, onState: (s: GameState, stats?: GameStats) => void) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D indisponible");
    this.ctx = ctx;
    this.onState = onState;

    try {
      this.best = Number(localStorage.getItem("spike-best") ?? 0) || 0;
    } catch {
      this.best = 0;
    }

    this.resize();
    window.addEventListener("resize", this.resize);
    window.addEventListener("keydown", this.onKey);
    canvas.addEventListener("pointerdown", this.onPointer);
    this.reset();
    this.lastT = performance.now();
    this.loop();
  }

  destroy(): void {
    this.destroyed = true;
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.resize);
    window.removeEventListener("keydown", this.onKey);
    this.canvas.removeEventListener("pointerdown", this.onPointer);
  }

  /* ─── Cycle de vie ─────────────────────────────────────────────── */

  start(): void {
    this.sound.unlock();
    this.sound.ui();
    this.reset();
    this.state = "playing";
    this.onState("playing");
  }

  toMenu(): void {
    this.sound.ui();
    this.reset();
    this.state = "menu";
    this.onState("menu");
  }

  togglePause(): void {
    if (this.state === "playing") {
      this.state = "paused";
      this.sound.ui();
      this.onState("paused");
    } else if (this.state === "paused") {
      this.state = "playing";
      this.sound.ui();
      this.onState("playing");
    }
  }

  toggleMute(): boolean {
    this.sound.unlock();
    return this.sound.toggleMute();
  }

  get isMuted(): boolean {
    return this.sound.muted;
  }

  private reset(): void {
    const { arena, u } = this;
    this.score = 0;
    this.newBest = false;
    this.shardsCollected = 0;
    this.playTime = 0;
    this.maxSpeed = 0;
    this.level = 0;
    this.player = {
      x: arena.x + arena.w / 2,
      y: arena.y + arena.h / 2,
      vy: 0,
      dir: Math.random() < 0.5 ? -1 : 1,
      squash: 0,
      invuln: 0,
      shield: false,
      slowmoT: 0,
      magnetT: 0,
    };
    this.spikesL = this.genWall();
    this.spikesR = this.genWall();
    this.shard = null;
    this.shardTimer = 3.2;
    this.powerups = [];
    this.powerTimer = 12;
    this.particles = [];
    this.floats = [];
    this.trail = [];
    this.shake = 0;
    this.flash.a = 0;
    this.dead = false;
    this.deadT = 0;
    void u;
  }

  /* ─── Entrées ──────────────────────────────────────────────────── */

  private onPointer = (e: PointerEvent): void => {
    e.preventDefault();
    this.sound.unlock();
    if (this.state === "playing") this.flap();
  };

  private onKey = (e: KeyboardEvent): void => {
    if (e.repeat) return;
    const code = e.code;
    if (code === "Space" || code === "ArrowUp" || code === "KeyW") {
      e.preventDefault();
      this.sound.unlock();
      if (this.state === "playing") this.flap();
      else if (this.state === "menu") this.start();
    } else if (code === "Escape" || code === "KeyP") {
      if (this.state === "playing" || this.state === "paused") this.togglePause();
    } else if (code === "Enter") {
      if (this.state === "gameover" || this.state === "menu") this.start();
    }
  };

  private flap(): void {
    const p = this.player;
    p.vy = -700 * this.u;
    p.squash = -0.35;
    this.sound.flap();
    this.burst(p.x, p.y + this.r(), 8, this.skin.glow, 140 * this.u, 0.4, 2.4 * this.u);
  }

  /* ─── Dimensions ───────────────────────────────────────────────── */

  private resize = (): void => {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.width = Math.floor(this.w * this.dpr);
    this.canvas.height = Math.floor(this.h * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    const margin = 16;
    const ah = Math.max(420, this.h - margin * 2);
    let aw = clamp(ah * 0.6, 280, 520);
    aw = Math.min(aw, this.w * 0.94);
    const ah2 = Math.min(this.h - margin * 2, aw / 0.52);
    const finalH = Math.min(ah, Math.max(ah2, ah * 0.9));
    this.arena = {
      x: (this.w - aw) / 2,
      y: (this.h - finalH) / 2,
      w: aw,
      h: finalH,
    };
    this.u = this.arena.h / 780;
    this.uh = this.arena.w / 460;

    // ruisseaux de données latéraux
    this.drops = [];
    const gx = 30;
    const countL = Math.max(0, Math.floor((this.arena.x - 30) / gx));
    const countR = countL;
    for (let i = 0; i < countL; i++) this.drops.push(this.makeDrop(this.arena.x - 34 - i * gx));
    for (let i = 0; i < countR; i++) this.drops.push(this.makeDrop(this.arena.x + this.arena.w + 34 + i * gx));

    // forcer la régénération spatiale
    this.spikesL = this.genWall();
    this.spikesR = this.genWall();
    const p = this.player;
    p.x = clamp(p.x, this.arena.x + 30, this.arena.x + this.arena.w - 30);
    p.y = clamp(p.y, this.arena.y + 40, this.arena.y + this.arena.h - 40);
  };

  private makeDrop(x: number): Drop {
    const chars: string[] = [];
    const n = Math.ceil(this.h / 24) + 2;
    for (let i = 0; i < n; i++) chars.push(GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
    return { x, y: rand(-this.h, 0), speed: rand(30, 90), chars, drift: rand(0, 10) };
  }

  private r(): number {
    return 13 * this.u;
  }

  private speed(): number {
    const s = (290 + this.score * 2.1) * (1 + this.level * 0.05);
    return Math.min(s, 580) * this.u;
  }

  /** Délai d'armement des pointes — plus long en début de partie. */
  private armTime(): number {
    return 0.28 + Math.max(0, 24 - this.score) * 0.007;
  }

  /* ─── Génération ───────────────────────────────────────────────── */

  private genWall(safeY?: number): Spike[] {
    const s = this.score;
    // courbe adoucie : +1 pointe tous les 8 points, début très léger
    const target = clamp(1 + Math.floor(s / 8) + (Math.random() < 0.45 ? 1 : 0), s < 3 ? 1 : 2, 8);
    const spikes: Spike[] = [];
    const { arena, u } = this;
    const corridor = 62 * u;
    let guard = 0;
    while (spikes.length < target && guard++ < 80) {
      const cy = rand(arena.y + 74 * u, arena.y + arena.h - 74 * u);
      // couloir de sécurité autour de l'altitude du joueur (anti mort instantanée)
      if (safeY !== undefined && Math.abs(cy - safeY) < corridor) continue;
      const ok = spikes.every((sp) => Math.abs(sp.cy - cy) > 34 * u);
      if (!ok) continue;
      spikes.push({ cy, len: rand(24, 33) * u, wid: 26 * u, t: 0 });
    }
    return spikes;
  }

  private spawnShard(): void {
    const { arena, u } = this;
    this.shard = {
      x: rand(arena.x + arena.w * 0.24, arena.x + arena.w * 0.76),
      y: rand(arena.y + 100 * u, arena.y + arena.h - 100 * u),
      rot: 0,
      age: 0,
      ttl: 7,
    };
  }

  private spawnPowerup(): void {
    const { arena, u } = this;
    const types: PowerType[] = ["shield", "slowmo", "magnet"];
    const type = types[Math.floor(Math.random() * types.length)];
    this.powerups.push({
      x: rand(arena.x + arena.w * 0.28, arena.x + arena.w * 0.72),
      y: rand(arena.y + 110 * u, arena.y + arena.h - 110 * u),
      type,
      age: 0,
      ttl: 9,
    });
  }

  /* ─── Effets ───────────────────────────────────────────────────── */

  private burst(
    x: number,
    y: number,
    n: number,
    color: string,
    speed: number,
    ttl: number,
    size: number,
    spread = TAU,
    baseAngle = 0,
  ): void {
    for (let i = 0; i < n; i++) {
      const a = baseAngle + rand(-spread / 2, spread / 2);
      const v = speed * rand(0.35, 1.15);
      this.particles.push({
        x,
        y,
        vx: Math.cos(a) * v,
        vy: Math.sin(a) * v,
        age: 0,
        ttl: ttl * rand(0.6, 1.3),
        size: size * rand(0.6, 1.4),
        color,
        drag: 2.6,
        grav: 260 * this.u,
      });
    }
    if (this.particles.length > 420) this.particles.splice(0, this.particles.length - 420);
  }

  private float(x: number, y: number, txt: string, color: string, size = 15): void {
    this.floats.push({ x, y, txt, age: 0, ttl: 1.1, color, size });
  }

  private circleRect(cx: number, cy: number, r: number, rx: number, ry: number, rw: number, rh: number): boolean {
    const nx = clamp(cx, rx, rx + rw);
    const ny = clamp(cy, ry, ry + rh);
    const dx = cx - nx;
    const dy = cy - ny;
    return dx * dx + dy * dy < r * r;
  }

  /* ─── Boucle ───────────────────────────────────────────────────── */

  private loop = (): void => {
    if (this.destroyed) return;
    const now = performance.now();
    const dt = clamp((now - this.lastT) / 1000, 0, 1 / 40);
    this.lastT = now;

    if (this.state !== "paused") {
      this.bgTime += dt;
      if (this.state === "playing") this.update(dt);
    }
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };

  private update(dt: number): void {
    const p = this.player;
    const { arena, u } = this;

    if (this.dead) {
      this.deadT += dt;
      this.stepFx(dt);
      if (this.deadT > 1.15) this.finalizeDeath();
      return;
    }

    this.playTime += dt;
    const slow = p.slowmoT > 0;
    const wdt = dt * (slow ? 0.55 : 1);

    p.slowmoT = Math.max(0, p.slowmoT - dt);
    p.magnetT = Math.max(0, p.magnetT - dt);
    p.invuln = Math.max(0, p.invuln - dt);

    // niveau de menace
    let lv = this.level;
    while (lv + 1 < THREAT_STEPS.length && this.score >= THREAT_STEPS[lv + 1]) lv++;
    if (lv > this.level) {
      this.level = lv;
      this.sound.threat();
      this.float(arena.x + arena.w / 2, arena.y + arena.h * 0.34, `NIVEAU DE MENACE 0${lv}`, "#f472b6", 20 * this.uh + 4);
      this.flash = { r: 244, g: 114, b: 182, a: 0.12 };
    }

    // physique joueur
    const spd = this.speed();
    this.maxSpeed = Math.max(this.maxSpeed, spd / u);
    p.vy = Math.min(p.vy + 2300 * u * wdt, 980 * u);
    p.y += p.vy * wdt;
    p.x += p.dir * spd * wdt;
    p.squash += (0 - p.squash) * Math.min(1, dt * 9);

    // traînée
    this.trail.push({ x: p.x, y: p.y });
    if (this.trail.length > 16) this.trail.shift();

    const r = this.r();

    // pointes latérales — armement
    for (const sp of this.spikesL) sp.t += wdt;
    for (const sp of this.spikesR) sp.t += wdt;

    // collisions pointes latérales
    if (p.invuln <= 0) {
      const arm = this.armTime();
      for (const sp of this.spikesL) {
        if (sp.t < arm) continue;
        if (this.circleRect(p.x, p.y, r * 0.92, arena.x, sp.cy - sp.wid * 0.32, sp.len * 0.72, sp.wid * 0.64)) {
          this.lethal("left");
          return;
        }
      }
      for (const sp of this.spikesR) {
        if (sp.t < arm) continue;
        if (
          this.circleRect(p.x, p.y, r * 0.92, arena.x + arena.w - sp.len * 0.72, sp.cy - sp.wid * 0.32, sp.len * 0.72, sp.wid * 0.64)
        ) {
          this.lethal("right");
          return;
        }
      }
    }

    // plafond / plancher
    const ceil = 15 * u;
    if (p.invuln <= 0 && (p.y - r <= arena.y + ceil * 0.6 || p.y + r >= arena.y + arena.h - ceil * 0.6)) {
      if (p.y - r <= arena.y + ceil * 0.6) this.lethal("top");
      else this.lethal("bottom");
      return;
    }

    // rebonds murs
    if (p.dir < 0 && p.x - r <= arena.x) this.bounce(1, arena.x + r);
    else if (p.dir > 0 && p.x + r >= arena.x + arena.w) this.bounce(-1, arena.x + arena.w - r);

    // éclat de données
    this.shardTimer -= wdt;
    if (!this.shard && this.shardTimer <= 0) this.spawnShard();
    if (this.shard) {
      const sh = this.shard;
      sh.age += wdt;
      sh.rot += dt * 2.4;
      if (p.magnetT > 0) {
        const dx = p.x - sh.x;
        const dy = p.y - sh.y;
        const d = Math.hypot(dx, dy);
        if (d < 260 * u && d > 1) {
          sh.x += (dx / d) * 320 * u * wdt;
          sh.y += (dy / d) * 320 * u * wdt;
        }
      }
      if (sh.age > sh.ttl) {
        this.shard = null;
        this.shardTimer = rand(2.4, 4.4);
      } else if (Math.hypot(p.x - sh.x, p.y - sh.y) < r + 12 * u) {
        this.shard = null;
        this.shardTimer = rand(2.6, 4.6);
        this.score += 3;
        this.shardsCollected++;
        this.sound.shard();
        this.burst(sh.x, sh.y, 16, "#fbbf24", 200 * u, 0.55, 3 * u);
        this.float(sh.x, sh.y - 10 * u, "+3", "#fbbf24", 18 * this.uh + 4);
        this.checkBest();
      }
    }

    // bonus
    this.powerTimer -= wdt;
    if (this.powerTimer <= 0 && this.powerups.length === 0) {
      this.spawnPowerup();
      this.powerTimer = rand(14, 21);
    }
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const pw = this.powerups[i];
      pw.age += wdt;
      if (p.magnetT > 0) {
        const dx = p.x - pw.x;
        const dy = p.y - pw.y;
        const d = Math.hypot(dx, dy);
        if (d < 240 * u && d > 1) {
          pw.x += (dx / d) * 300 * u * wdt;
          pw.y += (dy / d) * 300 * u * wdt;
        }
      }
      if (pw.age > pw.ttl) {
        this.powerups.splice(i, 1);
        continue;
      }
      if (Math.hypot(p.x - pw.x, p.y - pw.y) < r + 14 * u) {
        this.powerups.splice(i, 1);
        this.applyPower(pw.type);
      }
    }

    this.stepFx(dt);
  }

  private stepFx(dt: number): void {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.age += dt;
      if (pt.age > pt.ttl) {
        this.particles.splice(i, 1);
        continue;
      }
      const dragK = Math.max(0, 1 - pt.drag * dt);
      pt.vx *= dragK;
      pt.vy = pt.vy * dragK + pt.grav * dt;
      pt.x += pt.vx * dt;
      pt.y += pt.vy * dt;
    }
    for (let i = this.floats.length - 1; i >= 0; i--) {
      const f = this.floats[i];
      f.age += dt;
      f.y -= 34 * dt;
      if (f.age > f.ttl) this.floats.splice(i, 1);
    }
    this.shake = Math.max(0, this.shake - dt * 34);
    this.flash.a = Math.max(0, this.flash.a - dt * 1.6);
    this.wallFlashL = Math.max(0, this.wallFlashL - dt * 3);
    this.wallFlashR = Math.max(0, this.wallFlashR - dt * 3);
    this.glitchT = Math.max(0, this.glitchT - dt);
    this.nextGlitch -= dt;
    if (this.nextGlitch <= 0) {
      this.glitchT = 0.16;
      this.nextGlitch = rand(2.2, 4.6);
    }
  }

  private bounce(newDir: number, newX: number): void {
    const p = this.player;
    const { arena, u } = this;
    p.dir = newDir;
    p.x = newX;
    p.squash = 0.5;
    this.score++;
    this.sound.bounce();
    if (newDir === 1) this.wallFlashL = 1;
    else this.wallFlashR = 1;
    this.shake = Math.max(this.shake, 2.6);
    this.burst(newX === arena.x + this.r() ? arena.x : arena.x + arena.w, p.y, 7, "#22d3ee", 170 * u, 0.4, 2.2 * u, Math.PI * 0.8, newDir === 1 ? 0 : Math.PI);
    this.float(p.x + newDir * 20 * u, p.y - 14 * u, "+1", "#67e8f9", 14 * this.uh + 3);
    this.spikesL = this.genWall(p.y);
    this.spikesR = this.genWall(p.y);
    this.checkBest();
  }

  private checkBest(): void {
    if (this.score > this.best) {
      this.best = this.score;
      this.newBest = true;
      try {
        localStorage.setItem("spike-best", String(this.best));
      } catch {
        /* stockage indisponible */
      }
    }
  }

  private applyPower(type: PowerType): void {
    const p = this.player;
    this.sound.powerup();
    if (type === "shield") {
      p.shield = true;
      this.float(p.x, p.y - 30 * this.u, "BOUCLIER ACTIF", "#22d3ee", 15 * this.uh + 3);
      this.burst(p.x, p.y, 18, "#22d3ee", 190 * this.u, 0.5, 2.6 * this.u);
    } else if (type === "slowmo") {
      p.slowmoT = 6;
      this.float(p.x, p.y - 30 * this.u, "RALENTI TEMPOREL", "#a78bfa", 15 * this.uh + 3);
      this.burst(p.x, p.y, 18, "#a78bfa", 190 * this.u, 0.5, 2.6 * this.u);
    } else {
      p.magnetT = 8;
      this.float(p.x, p.y - 30 * this.u, "AIMANT À DONNÉES", "#fbbf24", 15 * this.uh + 3);
      this.burst(p.x, p.y, 18, "#fbbf24", 190 * this.u, 0.5, 2.6 * this.u);
    }
  }

  private lethal(side: "left" | "right" | "top" | "bottom"): void {
    const p = this.player;
    const { arena, u } = this;

    if (p.shield) {
      p.shield = false;
      p.invuln = 1.5;
      this.sound.shieldBreak();
      this.shake = 13;
      this.flash = { r: 34, g: 211, b: 238, a: 0.28 };
      this.burst(p.x, p.y, 26, "#67e8f9", 260 * u, 0.7, 3 * u);
      this.float(p.x, p.y - 30 * u, "BOUCLIER PERDU", "#fb7185", 16 * this.uh + 3);
      if (side === "left") {
        this.spikesL = [];
        p.dir = 1;
        p.x = arena.x + this.r() + 2;
        p.vy = -260 * u;
      } else if (side === "right") {
        this.spikesR = [];
        p.dir = -1;
        p.x = arena.x + arena.w - this.r() - 2;
        p.vy = -260 * u;
      } else if (side === "top") {
        p.y = arena.y + 26 * u;
        p.vy = Math.abs(p.vy) * 0.4 + 320 * u;
      } else {
        p.y = arena.y + arena.h - 26 * u;
        p.vy = -(Math.abs(p.vy) * 0.4 + 320 * u);
      }
      return;
    }

    // mort
    this.dead = true;
    this.deadT = 0;
    this.sound.death();
    this.shake = 22;
    this.flash = { r: 251, g: 113, b: 133, a: 0.5 };
    this.burst(p.x, p.y, 34, "#f472b6", 320 * u, 1, 3.4 * u);
    this.burst(p.x, p.y, 22, "#e2e8f0", 240 * u, 0.8, 2.4 * u);
    this.burst(p.x, p.y, 14, "#22d3ee", 180 * u, 0.7, 2.8 * u);
  }

  private finalizeDeath(): void {
    this.dead = false;
    this.state = "gameover";
    this.sound.gameOverJingle();
    const spd = Math.round(this.maxSpeed);
    const stats: GameStats = {
      score: this.score,
      best: this.best,
      newBest: this.newBest && this.score >= this.best && this.score > 0,
      shards: this.shardsCollected,
      time: this.playTime,
      maxSpeed: spd,
      level: this.level,
      rank: rankFor(this.score),
      xpEarned: 0,
    };
    this.onState("gameover", stats);
  }

  /* ═══ RENDU ═══════════════════════════════════════════════════════ */

  private render(): void {
    const { ctx, w, h, arena } = this;
    ctx.save();
    if (this.shake > 0.2) {
      const m = this.shake * 0.55;
      ctx.translate(rand(-m, m), rand(-m, m));
    }

    this.renderBackground();

    if (this.state !== "menu") {
      this.renderArena();
      this.renderCeilings();
      this.renderSpikes();
      this.renderItems();
      if (!this.dead && this.state !== "gameover") this.renderPlayer();
      this.renderParticles();
      this.renderFloats();
      if (this.state === "playing" || this.state === "paused" || this.dead || this.state === "gameover") this.renderHud();
    } else {
      this.renderMenuScene();
    }

    // flash plein écran
    if (this.flash.a > 0.005) {
      ctx.fillStyle = `rgba(${this.flash.r},${this.flash.g},${this.flash.b},${this.flash.a})`;
      ctx.fillRect(-20, -20, w + 40, h + 40);
    }

    // ralenti : liseré violet
    if (this.player.slowmoT > 0 && this.state === "playing") {
      const g = ctx.createRadialGradient(
        arena.x + arena.w / 2,
        arena.y + arena.h / 2,
        arena.h * 0.28,
        arena.x + arena.w / 2,
        arena.y + arena.h / 2,
        arena.h * 0.72,
      );
      g.addColorStop(0, "rgba(167,139,250,0)");
      g.addColorStop(1, "rgba(167,139,250,0.10)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
    }

    ctx.restore();
  }

  private renderBackground(): void {
    const { ctx, w, h } = this;
    const nextIndex = BACKGROUND_THEMES.reduce((best, item, index) => this.score >= item.score ? index : best, 0);
    if (nextIndex !== this.bgThemeIndex) {
      this.previousBgThemeIndex = this.bgThemeIndex;
      this.bgThemeIndex = nextIndex;
      this.bgTransitionStart = this.bgTime;
    }
    const progress = clamp((this.bgTime - this.bgTransitionStart) / 1.35, 0, 1);
    const theme = BACKGROUND_THEMES[this.bgThemeIndex];
    const previous = BACKGROUND_THEMES[this.previousBgThemeIndex];

    // Fondu entre les deux palettes.
    const drawBase = (palette: typeof BACKGROUND_THEMES[number], alpha: number) => {
      ctx.save();
      ctx.globalAlpha = alpha;
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, palette.top);
      gradient.addColorStop(0.55, palette.mid);
      gradient.addColorStop(1, palette.bottom);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);
      const halo = ctx.createRadialGradient(w / 2, h / 2, 40, w / 2, h / 2, Math.max(w, h) * 0.55);
      halo.addColorStop(0, palette.halo);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    };
    if (progress < 1) drawBase(previous, 1);
    drawBase(theme, progress);

    // Chaque palier possède son propre motif visuel.
    ctx.save();
    ctx.globalAlpha = progress;
    if (theme.style === "circuit") {
      ctx.strokeStyle = "rgba(34,211,238,0.17)";
      for (let x = 18; x < w; x += 92) {
        const y = (x * 1.73) % Math.max(1, h - 40) + 20;
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + 28, y); ctx.lineTo(x + 28, y + 34); ctx.lineTo(x + 58, y + 34); ctx.stroke();
        ctx.fillStyle = "rgba(103,232,249,0.35)"; ctx.fillRect(x + 25, y - 3, 6, 6);
      }
    } else if (theme.style === "stars") {
      for (let i = 0; i < 75; i++) {
        const x = (i * 137.5) % w, y = (i * 83.7) % h;
        const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(this.bgTime * 1.8 + i));
        ctx.fillStyle = `rgba(250,210,255,${twinkle * 0.65})`;
        ctx.beginPath(); ctx.arc(x, y, i % 9 === 0 ? 2 : 1, 0, TAU); ctx.fill();
      }
    } else if (theme.style === "matrix") {
      ctx.strokeStyle = "rgba(163,230,53,0.16)";
      for (let x = 12; x < w; x += 24) {
        const offset = (this.bgTime * (35 + (x % 5) * 8) + x * 11) % (h + 100);
        ctx.beginPath(); ctx.moveTo(x, offset - 90); ctx.lineTo(x, offset + 30); ctx.stroke();
      }
    } else if (theme.style === "sun") {
      const cx = w * 0.5, cy = h * 0.48, radius = Math.max(w, h) * 0.43;
      const sun = ctx.createRadialGradient(cx, cy, 8, cx, cy, radius);
      sun.addColorStop(0, "rgba(255,190,90,0.20)");
      sun.addColorStop(0.45, "rgba(249,115,22,0.07)");
      sun.addColorStop(1, "rgba(249,115,22,0)");
      ctx.fillStyle = sun; ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(251,146,60,0.16)";
      for (let i = 0; i < 12; i++) {
        const a = i * TAU / 12 + this.bgTime * 0.025;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius); ctx.stroke();
      }
    } else if (theme.style === "scan") {
      ctx.fillStyle = "rgba(125,211,252,0.08)";
      for (let y = (this.bgTime * 24) % 8; y < h; y += 8) ctx.fillRect(0, y, w, 1);
      ctx.strokeStyle = "rgba(56,189,248,0.18)";
      for (let x = -h; x < w + h; x += 42) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + h * 0.28, h); ctx.stroke();
      }
    } else if (theme.style === "rings") {
      const cx = w / 2, cy = h / 2;
      ctx.strokeStyle = "rgba(196,181,253,0.20)";
      for (let i = 0; i < 9; i++) {
        const radius = ((i * 58 + this.bgTime * 22) % (Math.max(w, h) * 0.7)) + 12;
        ctx.lineWidth = i % 3 === 0 ? 2 : 1;
        ctx.beginPath(); ctx.arc(cx, cy, radius, 0, TAU); ctx.stroke();
      }
    }
    ctx.restore();

    // Grille et flux de données de la nouvelle ambiance.
    ctx.save();
    ctx.globalAlpha = progress;
    const step = theme.style === "matrix" ? 28 : theme.style === "scan" ? 64 : 46;
    const off = (this.bgTime * (theme.style === "scan" ? 28 : 14)) % step;
    ctx.strokeStyle = theme.grid;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 0; x <= w; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, h); }
    for (let y = -step + off; y <= h + step; y += step) { ctx.moveTo(0, y); ctx.lineTo(w, y); }
    ctx.stroke();

    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = "center";
    for (const d of this.drops) {
      const spacing = 24;
      const head = ((this.bgTime * d.speed + d.drift * 100) % (this.h + 240)) - 120;
      for (let i = 0; i < d.chars.length; i++) {
        const y = i * spacing, dist = Math.abs(y - head);
        const flick = 0.5 + 0.5 * Math.sin(this.bgTime * 2 + i * 1.7 + d.drift);
        let a = 0.045 * flick;
        if (dist < spacing * 3) a = 0.28 * (1 - dist / (spacing * 3));
        if (a < 0.02) continue;
        ctx.fillStyle = `rgba(${theme.data},${a})`;
        ctx.fillText(d.chars[i], d.x, y);
      }
    }
    ctx.restore();

    if (this.glitchT > 0) {
      for (let i = 0; i < 3; i++) {
        const y = rand(0, this.h);
        ctx.fillStyle = i % 2 ? "rgba(244,114,182,0.05)" : theme.halo;
        ctx.fillRect(rand(-30, 0), y, this.w * rand(0.35, 1), rand(2, 9));
      }
    }
  }

  private renderArena(): void {
    const { ctx, arena, u } = this;

    // cadre
    ctx.strokeStyle = "rgba(34,211,238,0.4)";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "rgba(34,211,238,0.6)";
    ctx.shadowBlur = 14;
    ctx.strokeRect(arena.x, arena.y, arena.w, arena.h);
    ctx.shadowBlur = 0;

    // coins renforcés
    const c = 12 * u;
    ctx.strokeStyle = "rgba(103,232,249,0.9)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const corners: [number, number, number, number][] = [
      [arena.x, arena.y + c, 0, -c],
      [arena.x + arena.w - c, arena.y, c, 0],
      [arena.x + arena.w, arena.y + arena.h - c, 0, c],
      [arena.x + c, arena.y + arena.h, -c, 0],
    ];
    for (const [x, y, dx, dy] of corners) {
      ctx.moveTo(x, y);
      ctx.lineTo(x + dx + (dx === 0 ? c : 0), y + dy + (dy === 0 ? c : 0));
    }
    ctx.stroke();

    // flash de mur au rebond
    if (this.wallFlashL > 0.02) {
      ctx.fillStyle = `rgba(34,211,238,${this.wallFlashL * 0.22})`;
      ctx.fillRect(arena.x, arena.y, 5, arena.h);
    }
    if (this.wallFlashR > 0.02) {
      ctx.fillStyle = `rgba(34,211,238,${this.wallFlashR * 0.22})`;
      ctx.fillRect(arena.x + arena.w - 5, arena.y, 5, arena.h);
    }
  }

  private renderCeilings(): void {
    const { ctx, arena, u } = this;
    const step = 26 * u;
    const depth = 15 * u;
    ctx.fillStyle = "rgba(244,114,182,0.75)";
    ctx.strokeStyle = "rgba(244,114,182,0.9)";
    ctx.lineWidth = 1;
    const pulse = 0.85 + 0.15 * Math.sin(this.bgTime * 3);
    ctx.globalAlpha = pulse;
    for (let x = arena.x + 2; x < arena.x + arena.w - step; x += step) {
      // plafond ─ pointe vers le bas
      ctx.beginPath();
      ctx.moveTo(x, arena.y);
      ctx.lineTo(x + step / 2, arena.y + depth);
      ctx.lineTo(x + step, arena.y);
      ctx.closePath();
      ctx.fill();
      // plancher ─ pointe vers le haut
      ctx.beginPath();
      ctx.moveTo(x, arena.y + arena.h);
      ctx.lineTo(x + step / 2, arena.y + arena.h - depth);
      ctx.lineTo(x + step, arena.y + arena.h);
      ctx.closePath();
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private renderSpikes(): void {
    const { ctx, arena } = this;
    ctx.lineWidth = 1.2;
    for (const side of ["L", "R"] as const) {
      const list = side === "L" ? this.spikesL : this.spikesR;
      const armTime = this.armTime();
      for (const sp of list) {
        const arm = clamp(sp.t / armTime, 0, 1);
        const len = sp.len * (0.2 + 0.8 * arm);
        const baseX = side === "L" ? arena.x : arena.x + arena.w;
        const tipX = side === "L" ? baseX + len : baseX - len;
        const g = ctx.createLinearGradient(baseX, 0, tipX, 0);
        g.addColorStop(0, "rgba(190,24,93,0.55)");
        g.addColorStop(1, "rgba(244,114,182,0.95)");
        ctx.fillStyle = g;
        ctx.strokeStyle = "rgba(251,113,133,0.95)";
        ctx.shadowColor = "rgba(244,114,182,0.7)";
        ctx.shadowBlur = 10 * arm;
        ctx.globalAlpha = 0.35 + 0.65 * arm;
        ctx.beginPath();
        ctx.moveTo(baseX, sp.cy - sp.wid / 2);
        ctx.lineTo(tipX, sp.cy);
        ctx.lineTo(baseX, sp.cy + sp.wid / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      }
    }
  }

  private diamondPath(x: number, y: number, s: number): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x, y - s);
    ctx.lineTo(x + s, y);
    ctx.lineTo(x, y + s);
    ctx.lineTo(x - s, y);
    ctx.closePath();
  }

  private renderItems(): void {
    const { ctx, u } = this;

    if (this.shard) {
      const sh = this.shard;
      const blink = sh.ttl - sh.age < 2 ? (Math.sin(this.bgTime * 14) > 0 ? 1 : 0.25) : 1;
      const s = 10 * u * (1 + 0.12 * Math.sin(this.bgTime * 5));
      ctx.save();
      ctx.globalAlpha = blink;
      ctx.translate(sh.x, sh.y);
      ctx.rotate(sh.rot);
      ctx.shadowColor = "rgba(251,191,36,0.9)";
      ctx.shadowBlur = 16;
      const g = ctx.createLinearGradient(-s, -s, s, s);
      g.addColorStop(0, "#fde68a");
      g.addColorStop(1, "#f59e0b");
      ctx.fillStyle = g;
      this.diamondPath(0, 0, s);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(254,243,199,0.9)";
      ctx.lineWidth = 1;
      this.diamondPath(0, 0, s * 0.5);
      ctx.stroke();
      ctx.restore();
    }

    for (const pw of this.powerups) {
      const blink = pw.ttl - pw.age < 2 ? (Math.sin(this.bgTime * 14) > 0 ? 1 : 0.3) : 1;
      const bob = Math.sin(this.bgTime * 3 + pw.x) * 3 * u;
      const s = 15 * u;
      const color = pw.type === "shield" ? "#22d3ee" : pw.type === "slowmo" ? "#a78bfa" : "#fbbf24";
      ctx.save();
      ctx.globalAlpha = blink;
      ctx.translate(pw.x, pw.y + bob);
      ctx.rotate(this.bgTime * 0.8);
      ctx.strokeStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 14;
      ctx.lineWidth = 1.6;
      this.diamondPath(0, 0, s);
      ctx.stroke();
      ctx.rotate(-this.bgTime * 0.8);
      this.drawPowerIcon(pw.type, 0, 0, u);
      ctx.restore();
    }
  }

  private drawPowerIcon(type: PowerType, x: number, y: number, u: number): void {
    const { ctx } = this;
    const color = type === "shield" ? "#67e8f9" : type === "slowmo" ? "#c4b5fd" : "#fde68a";
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 2 * u;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (type === "shield") {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU - Math.PI / 2;
        const px = x + Math.cos(a) * 7.4 * u;
        const py = y + Math.sin(a) * 7.4 * u;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (type === "slowmo") {
      ctx.beginPath();
      ctx.moveTo(x - 6 * u, y - 7 * u);
      ctx.lineTo(x + 6 * u, y - 7 * u);
      ctx.lineTo(x, y - 0.5 * u);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 6 * u, y + 7 * u);
      ctx.lineTo(x + 6 * u, y + 7 * u);
      ctx.lineTo(x, y + 0.5 * u);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x, y + 3.6 * u, 1.3 * u, 0, TAU);
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(x, y - 1 * u, 6.4 * u, Math.PI, 0, false);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x - 6.4 * u, y - 1 * u);
      ctx.lineTo(x - 6.4 * u, y + 5 * u);
      ctx.moveTo(x + 6.4 * u, y - 1 * u);
      ctx.lineTo(x + 6.4 * u, y + 5 * u);
      ctx.stroke();
      ctx.fillRect(x - 8 * u, y + 5 * u, 3.2 * u, 3 * u);
      ctx.fillRect(x + 4.8 * u, y + 5 * u, 3.2 * u, 3 * u);
    }
  }

  private renderPlayer(): void {
    const { ctx, u } = this;
    const p = this.player;
    const r = this.r();

    // Traînée cosmétique équipée
    const effect = TRAILS.find(t => t.id === this.trailId) ?? TRAILS[0];
    if (this.trail.length > 1) {
      ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.shadowColor = effect.glow; ctx.shadowBlur = 12;
      for (let i = 1; i < this.trail.length; i++) {
        const a = i / this.trail.length, from = this.trail[i - 1], to = this.trail[i];
        if (effect.style === "dash" && i % 3 === 0) continue;
        ctx.globalAlpha = 0.12 + a * 0.78;
        ctx.strokeStyle = effect.colors[Math.min(effect.colors.length - 1, Math.floor((1-a) * effect.colors.length))];
        ctx.lineWidth = r * (effect.style === "ribbon" ? 1.8 : 1.25) * a;
        ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x, to.y); ctx.stroke();
        if (effect.style === "spark" && i % 3 === 0) { ctx.fillStyle = effect.colors[i % effect.colors.length]; ctx.beginPath(); ctx.arc(to.x,to.y,Math.max(1,r*0.13*a),0,TAU); ctx.fill(); }
        if (effect.style === "ribbon" && i % 2 === 0) { ctx.globalAlpha=a*0.3;ctx.lineWidth=r*2.5*a;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke(); }
      }
      ctx.restore();
    }

    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.scale(1 + p.squash * 0.55, 1 - p.squash * 0.55);

    if (p.invuln > 0 && Math.sin(this.bgTime * 30) > 0) ctx.globalAlpha = 0.35;

    // noyau
    ctx.shadowColor = this.skin.glow;
    ctx.shadowBlur = 22;
    const g = ctx.createRadialGradient(-r * 0.3, -r * 0.35, r * 0.1, 0, 0, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, this.skin.mid);
    g.addColorStop(1, this.skin.dark);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, TAU);
    ctx.fill();
    ctx.shadowBlur = 0;

    // anneau directionnel
    ctx.strokeStyle = this.skin.bright;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.55, p.dir > 0 ? -0.8 : Math.PI - 0.8, p.dir > 0 ? 0.8 : Math.PI + 0.8);
    ctx.stroke();

    // bouclier
    if (p.shield) {
      ctx.rotate(this.bgTime * 2.2);
      ctx.strokeStyle = this.skin.glow;
      ctx.shadowColor = this.skin.glow;
      ctx.shadowBlur = 10;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i / 6) * TAU;
        const px = Math.cos(a) * (r + 7 * u);
        const py = Math.sin(a) * (r + 7 * u);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  private renderParticles(): void {
    const { ctx } = this;
    for (const pt of this.particles) {
      const a = 1 - pt.age / pt.ttl;
      ctx.globalAlpha = a;
      ctx.fillStyle = pt.color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size * a + 0.4, 0, TAU);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  private renderFloats(): void {
    const { ctx } = this;
    ctx.textAlign = "center";
    for (const f of this.floats) {
      const a = 1 - f.age / f.ttl;
      ctx.globalAlpha = a;
      ctx.font = `700 ${f.size}px "Space Grotesk", sans-serif`;
      ctx.fillStyle = f.color;
      ctx.shadowColor = f.color;
      ctx.shadowBlur = 10;
      ctx.fillText(f.txt, f.x, f.y);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }

  private renderHud(): void {
    const { ctx, arena, uh, u } = this;
    const cx = arena.x + arena.w / 2;

    // score
    ctx.textAlign = "center";
    ctx.font = `800 ${Math.round(54 * uh)}px "Space Grotesk", sans-serif`;
    ctx.fillStyle = "rgba(226,232,240,0.96)";
    ctx.shadowColor = "rgba(34,211,238,0.75)";
    ctx.shadowBlur = 18;
    ctx.fillText(String(this.score), cx, arena.y + 82 * u + 34 * uh);
    ctx.shadowBlur = 0;
    ctx.font = `500 ${Math.round(10 * uh + 2)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = "rgba(103,232,249,0.75)";
    ctx.fillText("SCORE", cx, arena.y + 34 * u + 14);

    // barre de menace
    const segs = THREAT_STEPS.length - 1;
    const bw = 9 * uh;
    const gap = 3 * uh;
    const total = segs * bw + (segs - 1) * gap;
    for (let i = 0; i < segs; i++) {
      ctx.fillStyle = i < this.level ? "rgba(244,114,182,0.9)" : "rgba(148,163,184,0.2)";
      ctx.fillRect(cx - total / 2 + i * (bw + gap), arena.y + 100 * u + 36 * uh, bw, 2.4);
    }

    // éclats
    ctx.textAlign = "left";
    const sx = arena.x + 16 * u;
    const sy = arena.y + 32 * u;
    ctx.save();
    ctx.translate(sx, sy - 4);
    ctx.rotate(Math.PI / 4 * 0 + this.bgTime * 1.5);
    ctx.fillStyle = "#fbbf24";
    this.diamondPath(0, 0, 6 * u);
    ctx.fill();
    ctx.restore();
    ctx.font = `700 ${Math.round(13 * uh + 2)}px "JetBrains Mono", monospace`;
    ctx.fillStyle = "rgba(253,230,138,0.95)";
    ctx.fillText(`×${this.shardsCollected}`, sx + 14 * u, sy);

    // record
    ctx.textAlign = "right";
    ctx.fillStyle = this.newBest ? "rgba(251,191,36,0.95)" : "rgba(148,163,184,0.6)";
    ctx.fillText(`BEST ${this.best}`, arena.x + arena.w - 16 * u, sy);

    // minuteurs de bonus
    const chips: { label: string; frac: number; color: string }[] = [];
    const p = this.player;
    if (p.slowmoT > 0) chips.push({ label: "RALENTI", frac: p.slowmoT / 6, color: "#a78bfa" });
    if (p.magnetT > 0) chips.push({ label: "AIMANT", frac: p.magnetT / 8, color: "#fbbf24" });
    if (p.shield) chips.push({ label: "BOUCLIER", frac: 1, color: "#22d3ee" });
    ctx.textAlign = "left";
    chips.forEach((c, i) => {
      const cw = 96 * uh + 10;
      const ch = 20 * u + 6;
      const x = cx - (chips.length * (cw + 8) - 8) / 2 + i * (cw + 8);
      const y = arena.y + arena.h - ch - 30 * u;
      ctx.fillStyle = "rgba(10,15,28,0.75)";
      ctx.strokeStyle = "rgba(148,163,184,0.25)";
      ctx.lineWidth = 1;
      this.roundRect(x, y, cw, ch, 5);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = c.color;
      this.roundRect(x + 3, y + ch - 5, (cw - 6) * c.frac, 2.4, 1.2);
      ctx.fill();
      ctx.font = `700 ${Math.round(9 * uh + 2)}px "JetBrains Mono", monospace`;
      ctx.fillStyle = "rgba(226,232,240,0.9)";
      ctx.fillText(c.label, x + 8, y + ch / 2 + 1.5);
    });
  }

  private roundRect(x: number, y: number, w: number, h: number, r: number): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  private renderMenuScene(): void {
    const { ctx, arena, u } = this;
    this.renderArena();
    this.renderCeilings();

    // orbe de démonstration en apesanteur
    const t = this.bgTime;
    const px = arena.x + arena.w / 2 + Math.cos(t * 0.9) * arena.w * 0.22;
    const py = arena.y + arena.h / 2 + Math.sin(t * 1.3) * arena.h * 0.16;
    const r = 13 * u;
    ctx.shadowColor = this.skin.glow;
    ctx.shadowBlur = 20;
    const g = ctx.createRadialGradient(px - r * 0.3, py - r * 0.35, r * 0.1, px, py, r);
    g.addColorStop(0, "#ffffff");
    g.addColorStop(0.45, "#a5f3fc");
    g.addColorStop(1, "#0891b2");
    ctx.fillStyle = g;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, TAU);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    // pointes démo pulsantes
    for (const side of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const cy = arena.y + arena.h * (0.2 + i * 0.2) + Math.sin(t * 1.4 + i) * 10 * u;
        const len = (18 + 10 * (0.5 + 0.5 * Math.sin(t * 2 + i * 1.3))) * u;
        const baseX = side < 0 ? arena.x : arena.x + arena.w;
        ctx.fillStyle = "rgba(244,114,182,0.25)";
        ctx.beginPath();
        ctx.moveTo(baseX, cy - 12 * u);
        ctx.lineTo(baseX + side * -len, cy);
        ctx.lineTo(baseX, cy + 12 * u);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
}

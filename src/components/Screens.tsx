import { Cpu, Diamond, Home, Play, RotateCcw, Shield, Skull, Timer, TriangleAlert, Wind } from "lucide-react";
import { SKINS, type GameStats, type SkinId } from "../game/engine";

/* ─── Écran d'accueil ─────────────────────────────────────────────── */

export function StartScreen({ best, selectedSkin, onSelectSkin, onStart }: { best: number; selectedSkin: SkinId; onSelectSkin: (id: SkinId) => void; onStart: () => void }) {
  return (
    <div className="overlay-in absolute inset-0 z-30 flex items-center justify-center bg-[#05070d]/72 backdrop-blur-[6px]">
      <div className="flex w-full max-w-3xl flex-col items-center px-6 text-center">
        <div className="rise-in mb-5 flex items-center gap-2 font-mono text-[10px] tracking-[0.5em] text-cyan-300/70 sm:text-xs">
          <Cpu className="h-3.5 w-3.5" />
          <span>SYS.BRÈCHE // v2.0</span>
          <span className="blink-caret">▮</span>
        </div>

        <h1
          className="glitch rise-in font-display text-[13vw] leading-[0.9] font-bold tracking-tight text-slate-100 uppercase select-none sm:text-7xl md:text-8xl"
          data-text="SPIKE"
          style={{ animationDelay: "0.05s" }}
        >
          SPIKE
        </h1>
        <h1
          className="glitch rise-in neon-text-cyan font-display text-[11vw] leading-[1.05] font-bold tracking-[0.08em] text-cyan-300 uppercase select-none sm:text-6xl md:text-7xl"
          data-text="PROTOCOL"
          style={{ animationDelay: "0.12s" }}
        >
          PROTOCOL
        </h1>

        <p className="rise-in mt-5 max-w-md font-mono text-[11px] leading-relaxed tracking-wide text-slate-400 sm:text-xs" style={{ animationDelay: "0.2s" }}>
          Simulation de brèche murale. Pulsez entre les cloisons,
          <br className="hidden sm:block" /> évitez les pointes, siphonnez les éclats de données.
        </p>

        <div className="rise-in mt-7 grid w-full max-w-md grid-cols-3 gap-2 sm:gap-3" style={{ animationDelay: "0.28s" }}>
          {[
            { icon: Wind, label: "CLIC / ESPACE", sub: "impulsion" },
            { icon: Shield, label: "BONUS", sub: "bouclier · ralenti" },
            { icon: Diamond, label: "ÉCLATS", sub: "+3 points" },
          ].map((it) => (
            <div key={it.label} className="cyber-panel flex flex-col items-center gap-1.5 px-2 py-3.5">
              <it.icon className="h-4 w-4 text-cyan-300" />
              <span className="font-mono text-[9px] font-bold tracking-[0.14em] text-slate-200 sm:text-[10px]">{it.label}</span>
              <span className="font-mono text-[8px] tracking-[0.1em] text-slate-500 uppercase sm:text-[9px]">{it.sub}</span>
            </div>
          ))}
        </div>

        <div className="rise-in mt-6 w-full max-w-md" style={{ animationDelay: "0.32s" }}>
          <div className="mb-2 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-slate-400">
            <span>IDENTITÉS // SKINS</span>
            <span>{SKINS.filter((skin) => best >= skin.unlock).length}/{SKINS.length} DÉBLOQUÉS</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {SKINS.map((skin) => {
              const unlocked = best >= skin.unlock;
              const active = selectedSkin === skin.id;
              return (
                <button key={skin.id} type="button" disabled={!unlocked} onClick={() => onSelectSkin(skin.id)}
                  aria-label={unlocked ? `Choisir le skin ${skin.name}` : `Skin ${skin.name} verrouillé, record requis ${skin.unlock}`}
                  className={`relative flex min-h-[62px] flex-col items-center justify-center gap-1 border px-2 py-2 font-mono transition-all ${active ? "border-cyan-300 bg-cyan-300/10 shadow-[0_0_14px_rgba(34,211,238,0.16)]" : "border-slate-700/70 bg-slate-950/60"} ${unlocked ? "opacity-100" : "cursor-not-allowed opacity-45"}`}>
                  <span className="h-3 w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${skin.dark}, ${skin.mid}, ${skin.bright})`, boxShadow: `0 0 10px ${skin.glow}` }} />
                  <span className="text-[8px] font-bold tracking-[0.12em] text-slate-200">{skin.name}</span>
                  <span className="text-[7px] tracking-[0.1em] text-slate-500">{unlocked ? (active ? "ÉQUIPÉ" : "DISPONIBLE") : `RECORD ${skin.unlock}`}</span>
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={onStart} className="cyber-btn cyber-btn-primary rise-in mt-8 px-10 py-4 text-xs font-bold tracking-[0.3em] sm:px-14 sm:text-sm" style={{ animationDelay: "0.36s" }}>
          <span className="inline-flex items-center gap-3">
            <Play className="h-4 w-4 fill-current" />
            INITIALISER
          </span>
        </button>

        <div className="rise-in mt-6 flex items-center gap-6 font-mono text-[10px] tracking-[0.2em] text-slate-500" style={{ animationDelay: "0.44s" }}>
          <span>
            RECORD&nbsp;&nbsp;<span className="font-bold text-amber-300">{best}</span>
          </span>
          <span className="hidden sm:inline">ENTRÉE ↵ POUR DÉMARRER</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Écran de pause ──────────────────────────────────────────────── */

export function PauseScreen({ onResume, onQuit }: { onResume: () => void; onQuit: () => void }) {
  return (
    <div className="overlay-in absolute inset-0 z-30 flex items-center justify-center bg-[#05070d]/68 backdrop-blur-[5px]">
      <div className="cyber-panel flex w-[86vw] max-w-sm flex-col items-center px-8 py-9 text-center">
        <Timer className="pulse-glow mb-4 h-6 w-6 text-cyan-300" />
        <h2 className="font-display text-2xl font-bold tracking-[0.12em] text-slate-100 uppercase">Exécution suspendue</h2>
        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-slate-500">THREAD.ÉTAT = VEILLE</p>

        <button onClick={onResume} className="cyber-btn cyber-btn-primary mt-7 w-full px-6 py-3.5 text-xs font-bold tracking-[0.28em]">
          <span className="inline-flex items-center gap-2.5">
            <Play className="h-4 w-4 fill-current" /> REPRENDRE
          </span>
        </button>
        <button onClick={onQuit} className="cyber-btn cyber-btn-ghost mt-3 w-full px-6 py-3 text-xs font-bold tracking-[0.28em]">
          <span className="inline-flex items-center gap-2.5">
            <Home className="h-4 w-4" /> MENU PRINCIPAL
          </span>
        </button>
        <p className="mt-5 font-mono text-[9px] tracking-[0.2em] text-slate-600">ÉCHAP / P — REPRISE RAPIDE</p>
      </div>
    </div>
  );
}

/* ─── Écran de fin ────────────────────────────────────────────────── */

function StatCell({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 border border-slate-400/10 bg-slate-900/40 px-1 py-2.5">
      <span className={`font-display text-lg leading-none font-bold sm:text-xl ${accent ? "neon-text-cyan text-cyan-300" : "text-slate-200"}`}>{value}</span>
      <span className="font-mono text-[8px] tracking-[0.18em] text-slate-500 uppercase">{label}</span>
    </div>
  );
}

export function GameOverScreen({ stats, onRestart, onQuit }: { stats: GameStats; onRestart: () => void; onQuit: () => void }) {
  return (
    <div className="overlay-in absolute inset-0 z-30 flex items-center justify-center bg-[#0d0509]/72 backdrop-blur-[6px]">
      <div className="flex w-[90vw] max-w-md flex-col items-center px-2 text-center">
        <div className="rise-in flex items-center gap-2 font-mono text-[10px] tracking-[0.4em] text-rose-400/80">
          <TriangleAlert className="h-3.5 w-3.5" />
          <span>INTEGRITÉ 0%</span>
        </div>

        <h2 className="glitch neon-text-pink rise-in mt-3 font-display text-5xl font-bold tracking-[0.06em] text-rose-400 uppercase sm:text-6xl" data-text="SIGNAL PERDU" style={{ animationDelay: "0.08s" }}>
          SIGNAL PERDU
        </h2>

        {stats.newBest && (
          <div className="rise-in mt-4 border border-amber-300/40 bg-amber-300/10 px-4 py-1.5 font-mono text-[10px] font-bold tracking-[0.3em] text-amber-300" style={{ animationDelay: "0.16s" }}>
            ◆ NOUVEAU RECORD ◆
          </div>
        )}

        <div className="rise-in mt-6" style={{ animationDelay: "0.2s" }}>
          <div className="font-mono text-[9px] tracking-[0.4em] text-slate-500">SCORE FINAL</div>
          <div className="neon-text-cyan font-display text-7xl leading-none font-bold text-cyan-300 sm:text-8xl">{stats.score}</div>
        </div>

        <div className="cyber-panel rise-in mt-6 grid w-full grid-cols-4 gap-1.5 p-3" style={{ animationDelay: "0.28s" }}>
          <StatCell label="Record" value={String(stats.best)} />
          <StatCell label="Éclats" value={String(stats.shards)} />
          <StatCell label="Temps" value={`${stats.time.toFixed(1)}s`} />
          <StatCell label="V.max" value={String(stats.maxSpeed)} />
        </div>

        <div className="rise-in mt-4 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.26em]" style={{ animationDelay: "0.34s" }}>
          <Skull className="h-3.5 w-3.5 text-fuchsia-400" />
          <span className="text-slate-500">RANG&nbsp;:</span>
          <span className="font-bold text-fuchsia-300">{stats.rank}</span>
          <span className="text-slate-700">/</span>
          <span className="text-slate-500">MENACE NV.{stats.level}</span>
        </div>

        <div className="rise-in mt-7 flex w-full flex-col gap-3 sm:flex-row" style={{ animationDelay: "0.4s" }}>
          <button onClick={onRestart} className="cyber-btn cyber-btn-primary flex-1 px-6 py-3.5 text-xs font-bold tracking-[0.26em]">
            <span className="inline-flex items-center gap-2.5">
              <RotateCcw className="h-4 w-4" /> RÉINITIALISER
            </span>
          </button>
          <button onClick={onQuit} className="cyber-btn cyber-btn-ghost px-6 py-3 text-xs font-bold tracking-[0.26em]">
            <span className="inline-flex items-center gap-2.5">
              <Home className="h-4 w-4" /> MENU
            </span>
          </button>
        </div>

        <p className="rise-in mt-5 font-mono text-[9px] tracking-[0.2em] text-slate-600" style={{ animationDelay: "0.46s" }}>
          ENTRÉE ↵ — RELANCE RAPIDE
        </p>
      </div>
    </div>
  );
}

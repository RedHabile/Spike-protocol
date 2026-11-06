import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { GameEngine, type GameState, type GameStats } from "./game/engine";
import { GameOverScreen, PauseScreen, StartScreen } from "./components/Screens";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [uiState, setUiState] = useState<GameState>("menu");
  const [stats, setStats] = useState<GameStats | null>(null);
  const [muted, setMuted] = useState(false);
  const [best, setBest] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = new GameEngine(canvas, (state, s) => {
      setUiState(state);
      if (state === "gameover" && s) setStats(s);
      if (state === "menu") {
        try {
          setBest(Number(localStorage.getItem("spike-best") ?? 0) || 0);
        } catch {
          setBest(0);
        }
      }
    });
    engineRef.current = engine;
    setMuted(engine.isMuted);
    try {
      setBest(Number(localStorage.getItem("spike-best") ?? 0) || 0);
    } catch {
      /* stockage indisponible */
    }

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const handleStart = useCallback(() => engineRef.current?.start(), []);
  const handleResume = useCallback(() => engineRef.current?.togglePause(), []);
  const handleQuit = useCallback(() => engineRef.current?.toMenu(), []);
  const handleMute = useCallback(() => {
    const m = engineRef.current?.toggleMute();
    if (m !== undefined) setMuted(m);
  }, []);

  const playing = uiState === "playing";
  const showPauseBtn = uiState === "playing" || uiState === "paused";

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070d]">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full touch-none" />

      {/* Surcouches CRT */}
      <div className="crt-scanlines crt-flicker pointer-events-none absolute inset-0 z-10" />
      <div className="crt-vignette pointer-events-none absolute inset-0 z-10" />

      {/* Cadre décoratif d'écran */}
      <div className="pointer-events-none absolute inset-x-4 top-3 z-20 flex items-start justify-between font-mono text-[9px] tracking-[0.3em] text-slate-600 sm:text-[10px]">
        <span className="flex items-center gap-2">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${playing ? "bg-cyan-400 pulse-glow" : "bg-slate-600"}`} />
          SPIKE.PROTOCOL // NODE-77
        </span>
        <span className="hidden sm:inline">CANAL SÉCURISÉ — 60FPS</span>
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 flex items-end justify-between font-mono text-[9px] tracking-[0.3em] text-slate-600 sm:text-[10px]">
        <span className="hidden sm:inline">FLUX.CRYPTÉ ✓</span>
        <span>{playing ? "ESPACE / CLIC — IMPULSION" : "SYS PRÊT"}</span>
      </div>

      {/* Contrôles */}
      <div className="absolute top-8 right-4 z-40 flex gap-2 sm:top-9">
        {showPauseBtn && (
          <button
            onClick={handleResume}
            aria-label={uiState === "paused" ? "Reprendre" : "Pause"}
            className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center"
          >
            {uiState === "paused" ? <Play className="h-4 w-4 fill-current" /> : <Pause className="h-4 w-4" />}
          </button>
        )}
        <button
          onClick={handleMute}
          aria-label={muted ? "Activer le son" : "Couper le son"}
          className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      </div>

      {/* Écrans */}
      {uiState === "menu" && <StartScreen best={best} onStart={handleStart} />}
      {uiState === "paused" && <PauseScreen onResume={handleResume} onQuit={handleQuit} />}
      {uiState === "gameover" && stats && <GameOverScreen stats={stats} onRestart={handleStart} onQuit={handleQuit} />}
    </div>
  );
}

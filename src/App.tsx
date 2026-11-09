import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { GameEngine, type GameState, type GameStats, type SkinId } from "./game/engine";
import { GameOverScreen, PauseScreen, StartScreen } from "./components/Screens";
import { claimQuest, ensureDaily, loadProfile, questComplete, recordRun, remaining, saveProfile, type Profile, type QuestId } from "./game/progression";

function formatCountdown(ms:number){const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return [h,m,s].map(v=>String(v).padStart(2,"0")).join(":");}
export default function App(){
 const canvasRef=useRef<HTMLCanvasElement>(null),engineRef=useRef<GameEngine|null>(null);
 const [uiState,setUiState]=useState<GameState>("menu"),[stats,setStats]=useState<GameStats|null>(null),[muted,setMuted]=useState(false);
 const [profile,setProfile]=useState<Profile>(()=>loadProfile()),[clock,setClock]=useState(Date.now());
 const profileRef=useRef(profile);const updateProfile=(next:Profile)=>{profileRef.current=next;setProfile(next);saveProfile(next);};
 const selectedSkin=profile.equippedSkin;
 useEffect(()=>{const timer=setInterval(()=>{setClock(Date.now());const fresh=ensureDaily(profileRef.current);if(fresh!==profileRef.current)updateProfile(fresh);},1000);return()=>clearInterval(timer);},[]);
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;
  const engine=new GameEngine(canvas,(state,s)=>{
   setUiState(state);
   if(state==="gameover"&&s){const result=recordRun(profileRef.current,s);updateProfile(result.profile);setStats({...s,xpEarned:result.xpEarned});}
  });
  engineRef.current=engine;engine.setSkin(selectedSkin);setMuted(engine.isMuted);
  return()=>{engine.destroy();engineRef.current=null;};
 },[]);
 const handleStart=useCallback(()=>engineRef.current?.start(),[]);
 const handleSelectSkin=useCallback((id:SkinId)=>{if(!profileRef.current.unlockedSkins.includes(id))return;const next={...profileRef.current,equippedSkin:id};updateProfile(next);engineRef.current?.setSkin(id);},[]);
 const handleClaim=useCallback((id:QuestId)=>{const next=claimQuest(profileRef.current,id);updateProfile(next);},[]);
 const handleResume=useCallback(()=>engineRef.current?.togglePause(),[]);
 const handleQuit=useCallback(()=>engineRef.current?.toMenu(),[]);
 const handleMute=useCallback(()=>{const m=engineRef.current?.toggleMute();if(m!==undefined)setMuted(m);},[]);
 const playing=uiState==="playing",showPauseBtn=playing||uiState==="paused";
 const best=profile.best, countdown=formatCountdown(remaining(profile,clock));
 return <div className="relative h-full w-full overflow-hidden bg-[#05070d]"><canvas ref={canvasRef} className="absolute inset-0 block h-full w-full touch-none"/><div className="crt-scanlines crt-flicker pointer-events-none absolute inset-0 z-10"/><div className="crt-vignette pointer-events-none absolute inset-0 z-10"/><div className="pointer-events-none absolute inset-x-4 top-3 z-20 flex items-start justify-between font-mono text-[9px] tracking-[0.3em] text-slate-600 sm:text-[10px]"><span className="flex items-center gap-2"><span className={`inline-block h-1.5 w-1.5 rounded-full ${playing?"bg-cyan-400 pulse-glow":"bg-slate-600"}`}/>SPIKE.PROTOCOL // NODE-77</span><span className="hidden sm:inline">CANAL SÉCURISÉ — 60FPS</span></div><div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 flex items-end justify-between font-mono text-[9px] tracking-[0.3em] text-slate-600 sm:text-[10px]"><span className="hidden sm:inline">FLUX.CRYPTÉ ✓</span><span>{playing?"ESPACE / CLIC — IMPULSION":"SYS PRÊT"}</span></div><div className="absolute top-8 right-4 z-40 flex gap-2 sm:top-9">{showPauseBtn&&<button onClick={handleResume} aria-label={uiState==="paused"?"Reprendre":"Pause"} className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center">{uiState==="paused"?<Play className="h-4 w-4 fill-current"/>:<Pause className="h-4 w-4"/>}</button>}<button onClick={handleMute} aria-label={muted?"Activer le son":"Couper le son"} className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center">{muted?<VolumeX className="h-4 w-4"/>:<Volume2 className="h-4 w-4"/>}</button></div>{uiState==="menu"&&<StartScreen best={best} selectedSkin={selectedSkin} profile={profile} countdown={countdown} onSelectSkin={handleSelectSkin} onClaimQuest={handleClaim} onStart={handleStart}/ >}{uiState==="paused"&&<PauseScreen onResume={handleResume} onQuit={handleQuit}/ >}{uiState==="gameover"&&stats&&<GameOverScreen stats={stats} onRestart={handleStart} onQuit={handleQuit}/>}</div>;
}

import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { GameEngine, type GameState, type GameStats, type SkinId, type TrailId } from "./game/engine";
import { GameOverScreen, PauseScreen, StartScreen } from "./components/Screens";
import { buyShopSkin, buyShopTrail, claimQuest, createProfile, ensureDaily, loadProfile, recordRun, remaining, saveProfile, type Profile, type QuestId } from "./game/progression";
import { recordPlaytime, submitBestScore } from "./game/leaderboard";
import { restoreAccount, loadCloudProfile, saveCloudProfile, type AuthUser } from "./game/cloud";
import { AccountWidget } from "./components/Account";
import { AdminPanel } from "./components/Admin";

function formatCountdown(ms:number){const h=Math.floor(ms/3600000),m=Math.floor(ms%3600000/60000),s=Math.floor(ms%60000/1000);return [h,m,s].map(v=>String(v).padStart(2,"0")).join(":");}
export default function App(){
 const canvasRef=useRef<HTMLCanvasElement>(null),engineRef=useRef<GameEngine|null>(null);
 const [uiState,setUiState]=useState<GameState>("menu"),[stats,setStats]=useState<GameStats|null>(null),[muted,setMuted]=useState(false);
 const [profile,setProfile]=useState<Profile>(()=>loadProfile()),[clock,setClock]=useState(Date.now());
 const [account,setAccount]=useState<AuthUser|null>(null);
 const profileRef=useRef(profile),accountRef=useRef<AuthUser|null>(null),syncTimerRef=useRef<number|undefined>(undefined),playtimeStartedAt=useRef<number|null>(null);
 const updateProfile=(next:Profile)=>{profileRef.current=next;setProfile(next);saveProfile(next);const userId=accountRef.current?.id;if(userId){window.clearTimeout(syncTimerRef.current);syncTimerRef.current=window.setTimeout(()=>{void saveCloudProfile(userId,next).catch(error=>console.warn("Synchronisation Spike Protocol :",error));},500);}};
 const selectedSkin=profile.equippedSkin;
 const handleAuthenticated=useCallback(async(user:AuthUser)=>{accountRef.current=user;setAccount(user);window.clearTimeout(syncTimerRef.current);const remote=await loadCloudProfile(user.id);if(remote){try{localStorage.setItem("spike-profile-owner",user.id);}catch{}profileRef.current=remote;setProfile(remote);saveProfile(remote);engineRef.current?.setSkin(remote.equippedSkin);engineRef.current?.setTrail(remote.equippedTrail);}else{let owner:string|null=null;try{owner=localStorage.getItem("spike-profile-owner");}catch{}const startingProfile=owner&&owner!==user.id?createProfile():profileRef.current;profileRef.current=startingProfile;setProfile(startingProfile);saveProfile(startingProfile);try{localStorage.setItem("spike-profile-owner",user.id);}catch{}await saveCloudProfile(user.id,startingProfile);}},[]);
 const handleSignedOut=useCallback(()=>{window.clearTimeout(syncTimerRef.current);accountRef.current=null;setAccount(null);},[]);
 useEffect(()=>{let active=true;void restoreAccount().then(user=>{if(active&&user)return handleAuthenticated(user);}).catch(error=>console.warn("Restauration du compte Spike Protocol :",error));return()=>{active=false;};},[handleAuthenticated]);
 useEffect(()=>{const timer=setInterval(()=>{setClock(Date.now());const fresh=ensureDaily(profileRef.current);if(fresh!==profileRef.current)updateProfile(fresh);},1000);return()=>clearInterval(timer);},[]);
 useEffect(()=>{
  const canvas=canvasRef.current;if(!canvas)return;
  const engine=new GameEngine(canvas,(state,s)=>{
   setUiState(state);
   if(state==="gameover"&&s){const result=recordRun(profileRef.current,s);updateProfile(result.profile);void submitBestScore(s.score).catch(error=>console.warn("Classement Spike Protocol :",error));setStats({...s,xpEarned:result.xpEarned});}
  });
  engineRef.current=engine;engine.setSkin(selectedSkin);engine.setTrail(profile.equippedTrail);setMuted(engine.isMuted);
  return()=>{engine.destroy();engineRef.current=null;};
 },[]);
 const flushPlaytime=useCallback(()=>{const started=playtimeStartedAt.current;if(started===null)return;const seconds=Math.floor((Date.now()-started)/1000);if(seconds<1)return;playtimeStartedAt.current=Date.now();void recordPlaytime(seconds,accountRef.current?.id).catch(error=>console.warn("Temps de jeu Spike Protocol :",error));},[]);
 useEffect(()=>{if(uiState!=="playing")return;playtimeStartedAt.current=Date.now();const interval=window.setInterval(flushPlaytime,30000);const onPageHide=()=>flushPlaytime();window.addEventListener("pagehide",onPageHide);return()=>{window.clearInterval(interval);window.removeEventListener("pagehide",onPageHide);flushPlaytime();playtimeStartedAt.current=null;};},[uiState,flushPlaytime]);
 const handleStart=useCallback(()=>engineRef.current?.start(),[]);
 const handleSelectSkin=useCallback((id:SkinId)=>{if(!profileRef.current.unlockedSkins.includes(id))return;const next={...profileRef.current,equippedSkin:id};updateProfile(next);engineRef.current?.setSkin(id);},[]);
 const handleBuySkin=useCallback((id:SkinId)=>{const next=buyShopSkin(profileRef.current,id);if(next!==profileRef.current)updateProfile(next);},[]);
 const handleSelectTrail=useCallback((id:TrailId)=>{if(!profileRef.current.unlockedTrails.includes(id))return;const next={...profileRef.current,equippedTrail:id};updateProfile(next);engineRef.current?.setTrail(id);},[]);
 const handleBuyTrail=useCallback((id:TrailId)=>{const next=buyShopTrail(profileRef.current,id);if(next!==profileRef.current)updateProfile(next);},[]);
 const handleClaim=useCallback((id:QuestId)=>{const next=claimQuest(profileRef.current,id);updateProfile(next);},[]);
 const handleResume=useCallback(()=>engineRef.current?.togglePause(),[]);
 const handleQuit=useCallback(()=>engineRef.current?.toMenu(),[]);
 const handleMute=useCallback(()=>{const m=engineRef.current?.toggleMute();if(m!==undefined)setMuted(m);},[]);
 const playing=uiState==="playing",showPauseBtn=playing||uiState==="paused";
 const best=profile.best, countdown=formatCountdown(remaining(profile,clock));
 return <div className="relative h-full w-full overflow-hidden bg-[#05070d]"><canvas ref={canvasRef} className="absolute inset-0 block h-full w-full touch-none"/><div className="crt-scanlines crt-flicker pointer-events-none absolute inset-0 z-10"/><div className="crt-vignette pointer-events-none absolute inset-0 z-10"/><div className="pointer-events-none absolute inset-x-4 top-3 z-20 flex items-start justify-between font-mono text-[9px] tracking-[0.3em] text-slate-600 sm:text-[10px]"><span className="flex items-center gap-2"><span className={`inline-block h-1.5 w-1.5 rounded-full ${playing?"bg-cyan-400 pulse-glow":"bg-slate-600"}`}/>SPIKE.PROTOCOL // NODE-77</span><span className="hidden sm:inline">CANAL SÉCURISÉ — 60FPS</span></div><div className="pointer-events-none absolute inset-x-4 bottom-3 z-20 flex items-end justify-between font-mono text-[9px] tracking-[0.3em] text-slate-600 sm:text-[10px]"><span className="hidden sm:inline">FLUX.CRYPTÉ ✓</span><span>{playing?"ESPACE / CLIC — IMPULSION":"SYS PRÊT"}</span></div><div className="absolute top-8 right-4 z-40 flex gap-2 sm:top-9">{showPauseBtn&&<button onClick={handleResume} aria-label={uiState==="paused"?"Reprendre":"Pause"} className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center">{uiState==="paused"?<Play className="h-4 w-4 fill-current"/>:<Pause className="h-4 w-4"/>}</button>}<button onClick={handleMute} aria-label={muted?"Activer le son":"Couper le son"} className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center">{muted?<VolumeX className="h-4 w-4"/>:<Volume2 className="h-4 w-4"/>}</button></div>{uiState==="menu"&&<><AccountWidget user={account} onAuthenticated={handleAuthenticated} onSignedOut={handleSignedOut}/><AdminPanel user={account}/><StartScreen best={best} selectedSkin={selectedSkin} profile={profile} countdown={countdown} onSelectSkin={handleSelectSkin} onBuySkin={handleBuySkin} onSelectTrail={handleSelectTrail} onBuyTrail={handleBuyTrail} onClaimQuest={handleClaim} onStart={handleStart}/ ></>}{uiState==="paused"&&<PauseScreen onResume={handleResume} onQuit={handleQuit}/ >}{uiState==="gameover"&&stats&&<GameOverScreen stats={stats} onRestart={handleStart} onQuit={handleQuit}/>}</div>;
}

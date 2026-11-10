import { useState } from "react";
import { LogIn, LogOut, UserRound, X, Cloud, ShieldCheck } from "lucide-react";
import { signIn, signUp, signOut, resendConfirmationEmail, type AuthUser } from "../game/cloud";

export function AccountWidget({ user, onAuthenticated, onSignedOut }: {
  user:AuthUser|null;
  onAuthenticated:(user:AuthUser)=>Promise<void>;
  onSignedOut:()=>void;
}) {
  const [open,setOpen]=useState(false),[mode,setMode]=useState<"login"|"register">("login");
  const [email,setEmail]=useState(""),[password,setPassword]=useState("");
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
  const submit=async()=>{
    setBusy(true);setError("");setMessage("");
    try {
      if(mode==="login") { const account=await signIn(email,password); await onAuthenticated(account); setPassword(""); setMessage("Connexion réussie. Progression synchronisée."); }
      else { const result=await signUp(email,password); if(result.needsEmailConfirmation) {  setMessage("Compte créé ! Vérifie ta boîte mail. Tu peux renvoyer le mail de confirmation ci-dessous."); } else { await onAuthenticated(result.user); setPassword(""); setMessage("Compte créé et progression synchronisée."); } }
    } catch(e) { setError(e instanceof Error?e.message:"Une erreur est survenue."); }
    finally { setBusy(false); }
  };
  const resend=async()=>{setBusy(true);setError("");setMessage("");try{await resendConfirmationEmail(email);setMessage("Demande envoyée. Vérifie ta boîte mail et tes courriers indésirables.");}catch(e){setError(e instanceof Error?e.message:"Impossible de renvoyer le mail.");}finally{setBusy(false);}};
  const logout=async()=>{setBusy(true);setError("");try{await signOut();onSignedOut();setMessage("Déconnexion effectuée.");}catch(e){setError(e instanceof Error?e.message:"Déconnexion impossible.");}finally{setBusy(false);}};
  return <>
    <button onClick={()=>{setOpen(true);setError("");setMessage("");}} className="cyber-btn cyber-btn-ghost fixed right-3 top-16 z-50 sm:right-5 flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-wider sm:left-5 sm:top-5">
      {user?<Cloud className="h-3.5 w-3.5 text-emerald-300"/>:<UserRound className="h-3.5 w-3.5"/>}
      {user?"COMPTE CONNECTÉ":"COMPTE"}
    </button>
    {open&&<div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Compte Spike Protocol">
      <div className="cyber-panel w-full max-w-md border-cyan-400/40 p-5 sm:p-6">
        <div className="mb-5 flex items-start justify-between border-b border-cyan-400/20 pb-3">
          <div><div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-cyan-300"><ShieldCheck className="h-3.5 w-3.5"/>IDENTITÉ EN LIGNE</div><h2 className="mt-1 font-display text-2xl font-bold tracking-wider text-slate-100">MON COMPTE</h2></div>
          <button onClick={()=>setOpen(false)} aria-label="Fermer" className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center"><X className="h-4 w-4"/></button>
        </div>
        {user?<div className="space-y-4">
          <div className="border border-emerald-400/25 bg-emerald-400/5 p-4"><p className="font-mono text-[9px] tracking-widest text-emerald-300">SESSION ACTIVE</p><p className="mt-2 break-all font-mono text-sm text-slate-100">{user.email || "Compte joueur"}</p><p className="mt-2 font-mono text-[9px] leading-relaxed text-slate-400">Ta progression est associée à ce compte et peut être retrouvée sur tes autres appareils.</p></div>
          <button onClick={logout} disabled={busy} className="cyber-btn cyber-btn-ghost flex w-full items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] disabled:opacity-50"><LogOut className="h-4 w-4"/> {busy?"DÉCONNEXION...":"SE DÉCONNECTER"}</button>
        </div>:<div className="space-y-3">
          <div className="grid grid-cols-2 gap-2"><button onClick={()=>{setMode("login");setMessage("");setError("");}} className={`border px-3 py-2 font-mono text-[9px] tracking-wider ${mode==="login"?"border-cyan-300 bg-cyan-300/10 text-cyan-200":"border-slate-700 text-slate-500"}`}>CONNEXION</button><button onClick={()=>{setMode("register");setMessage("");setError("");}} className={`border px-3 py-2 font-mono text-[9px] tracking-wider ${mode==="register"?"border-cyan-300 bg-cyan-300/10 text-cyan-200":"border-slate-700 text-slate-500"}`}>CRÉER UN COMPTE</button></div>
          <label className="block font-mono text-[9px] tracking-widest text-slate-400">ADRESSE E-MAIL</label><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="toi@exemple.fr" className="w-full border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100 outline-none focus:border-cyan-300"/>
          <label className="block pt-1 font-mono text-[9px] tracking-widest text-slate-400">MOT DE PASSE</label><input type="password" autoComplete={mode==="login"?"current-password":"new-password"} value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")void submit();}} placeholder="8 caractères minimum" className="w-full border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100 outline-none focus:border-cyan-300"/>
          {mode==="register"&&<><p className="font-mono text-[8px] leading-relaxed text-slate-500">Utilise une adresse e-mail à laquelle tu as accès. Un e-mail de confirmation peut être demandé.</p><button type="button" onClick={()=>void resend()} disabled={busy||!email.trim()} className="w-full border border-cyan-400/30 px-3 py-2 font-mono text-[9px] tracking-wider text-cyan-200 disabled:opacity-40">{busy?"ENVOI...":"RENVOYER LE MAIL DE CONFIRMATION"}</button></>}
          <button onClick={()=>void submit()} disabled={busy||!email.trim()||password.length<8} className="cyber-btn cyber-btn-primary flex w-full items-center justify-center gap-2 px-4 py-3 font-mono text-[10px] disabled:opacity-50"><LogIn className="h-4 w-4"/>{busy?"VEUILLEZ PATIENTER...":mode==="login"?"SE CONNECTER":"CRÉER MON COMPTE"}</button>
        </div>}
        {error&&<p role="alert" className="mt-3 border border-rose-400/30 bg-rose-400/5 p-3 font-mono text-[9px] leading-relaxed text-rose-300">{error}</p>}
        {message&&<p role="status" className="mt-3 border border-cyan-400/20 bg-cyan-400/5 p-3 font-mono text-[9px] leading-relaxed text-cyan-200">{message}</p>}
        <p className="mt-4 border-t border-slate-800 pt-3 font-mono text-[8px] leading-relaxed text-slate-600">Ne partage jamais ton mot de passe. La session reste privée sur chaque appareil.</p>
      </div>
    </div>}
  </>;
}

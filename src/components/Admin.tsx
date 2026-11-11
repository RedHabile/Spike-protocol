import { useState } from "react";
import { LockKeyhole, X, ShieldCheck } from "lucide-react";
import { runAdminAction } from "../game/cloud";

const skins=["classic","plasma","toxic","sunset","ice","void","cobalt","crimson","sandstorm","digital","carbon","royal","hazard","aurora","obsidian","titan","eclipse","inferno","overdrive","apex","warborn","headhunter","immortal","vanguard","overlord","spectral","nebula","prism","royalflare","deepsea","rosequartz","cyberpunk","goldrush","ghostwire","starlight","venomwave","frostbite","bloodmoon","neonviper","galaxy","chromatic","sunken","emberstorm","ultraviolet","hologram","singularity"];

export function AdminPanel({user}:{user:{id:string;email?:string}|null}) {
 const [open,setOpen]=useState(false),[code,setCode]=useState(""),[email,setEmail]=useState(""),[kind,setKind]=useState<"credits"|"xp"|"skin_add"|"skin_remove">("credits"),[amount,setAmount]=useState("100"),[direction,setDirection]=useState<"add"|"remove">("add"),[skin,setSkin]=useState("plasma"),[busy,setBusy]=useState(false),[message,setMessage]=useState(""),[error,setError]=useState("");
 const submit=async()=>{
  setBusy(true);setMessage("");setError("");
  try {
   const operation=kind==="credits"||kind==="xp"?kind:kind;
   const result=await runAdminAction({code,email,operation,amount:kind==="credits"||kind==="xp"?(Number(amount)*(direction==="add"?1:-1)):undefined,skin:kind==="skin_add"||kind==="skin_remove"?skin:undefined});
   setMessage(`Modification enregistrée pour ${result.player}. XP : ${result.profile?.xp??"?"} · Crédits : ${result.profile?.credits??"?"}.`);
  } catch(e) { setError(e instanceof Error?e.message:"Action impossible."); }
  finally { setBusy(false); }
 };
 return <>
  <button onClick={()=>{setOpen(true);setError("");setMessage("");}} className="cyber-btn cyber-btn-ghost fixed right-3 top-[7.2rem] z-50 flex items-center gap-2 px-3 py-2 font-mono text-[9px] tracking-wider sm:right-5 sm:top-[4.3rem]"><LockKeyhole className="h-3.5 w-3.5 text-amber-300"/>ADMIN</button>
  {open&&<div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-label="Panneau administrateur">
   <div className="cyber-panel w-full max-w-md border-amber-300/40 p-5">
    <div className="mb-4 flex items-center justify-between border-b border-amber-300/20 pb-3"><div><div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-amber-300"><ShieldCheck className="h-3.5 w-3.5"/>ACCÈS RESTREINT</div><h2 className="mt-1 font-display text-2xl font-bold text-slate-100">ADMINISTRATEUR</h2></div><button onClick={()=>setOpen(false)} aria-label="Fermer" className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center"><X className="h-4 w-4"/></button></div>
    {!user?<p className="font-mono text-xs text-rose-300">Connecte-toi à ton compte joueur avant d'ouvrir le panneau admin.</p>:<div className="space-y-3">
     <label className="block font-mono text-[9px] tracking-widest text-slate-400">CODE ADMIN</label><input type="password" autoComplete="off" value={code} onChange={e=>setCode(e.target.value)} placeholder="Code secret" className="w-full border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100 outline-none focus:border-amber-300"/>
     <label className="block font-mono text-[9px] tracking-widest text-slate-400">E-MAIL DU JOUEUR</label><input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="joueur@exemple.fr" className="w-full border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100 outline-none focus:border-amber-300"/>
     <label className="block font-mono text-[9px] tracking-widest text-slate-400">ACTION</label><select value={kind} onChange={e=>setKind(e.target.value as typeof kind)} className="w-full border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100"><option value="credits">Modifier les crédits</option><option value="xp">Modifier l'XP</option><option value="skin_add">Débloquer un skin</option><option value="skin_remove">Retirer un skin</option></select>
     {(kind==="credits"||kind==="xp")?<div className="grid grid-cols-2 gap-2"><select value={direction} onChange={e=>setDirection(e.target.value as typeof direction)} className="border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100"><option value="add">Ajouter</option><option value="remove">Retirer</option></select><input type="number" min="1" max="100000" value={amount} onChange={e=>setAmount(e.target.value)} className="min-w-0 border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100"/></div>:<select value={skin} onChange={e=>setSkin(e.target.value)} className="w-full border border-slate-700 bg-slate-950 px-3 py-3 font-mono text-xs text-slate-100">{skins.map(id=><option key={id} value={id}>{id.toUpperCase()}</option>)}</select>}
     <button onClick={()=>void submit()} disabled={busy||!code||!email.trim()||((kind==="credits"||kind==="xp")&&(!Number.isInteger(Number(amount))||Number(amount)<1||Number(amount)>100000))} className="cyber-btn cyber-btn-primary w-full px-4 py-3 font-mono text-[10px] tracking-wider disabled:opacity-40">{busy?"TRAITEMENT...":"CONFIRMER LA MODIFICATION"}</button>
     {error&&<p role="alert" className="border border-rose-400/30 p-3 font-mono text-[9px] text-rose-300">{error}</p>}
     {message&&<p role="status" className="border border-emerald-400/30 p-3 font-mono text-[9px] text-emerald-200">{message}</p>}
     <p className="font-mono text-[8px] leading-relaxed text-slate-600">Les changements sont appliqués au profil cloud du joueur. Le code secret est vérifié côté serveur.</p>
    </div>}
   </div>
  </div>}
 </>;
}

import { useEffect, useState } from "react";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import type { SpikeUsernameWarning } from "../game/cloud";

export function UsernameWarningGate({ warning, onSubmit }: {
  warning: SpikeUsernameWarning;
  onSubmit: (name: string) => Promise<void>;
}) {
  const [seconds, setSeconds] = useState(5);
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const endAt = Date.now() + 5000;
    const timer = window.setInterval(() => {
      const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
      setSeconds(left);
      if (left === 0) window.clearInterval(timer);
    }, 100);
    return () => window.clearInterval(timer);
  }, []);

  const submit = async () => {
    setBusy(true);
    setError("");
    try {
      await onSubmit(name.trim());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossible d'enregistrer ce nouveau pseudo.");
    } finally {
      setBusy(false);
    }
  };

  return <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/95 p-4 backdrop-blur-md" role="alertdialog" aria-modal="true" aria-labelledby="username-warning-title">
    <div className="cyber-panel w-full max-w-lg border-amber-300/50 p-5 shadow-[0_0_40px_rgba(251,191,36,0.12)] sm:p-7">
      <div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-amber-300"><ShieldAlert className="h-4 w-4"/>AVERTISSEMENT ADMINISTRATIF</div>
      <h2 id="username-warning-title" className="mt-3 font-display text-2xl font-bold tracking-wider text-slate-100 sm:text-3xl">PSEUDONYME NON APPROPRIÉ</h2>
      <p className="mt-4 font-mono text-xs leading-relaxed text-slate-300">Ton pseudonyme ne respecte pas les règles de Spike Protocol. Tu dois le modifier avant de pouvoir accéder au jeu.</p>
      <div className="mt-4 border border-amber-300/20 bg-amber-300/5 p-3">
        <span className="block font-mono text-[8px] tracking-widest text-amber-300">MOTIF DE L'AVERTISSEMENT</span>
        <p className="mt-2 font-mono text-xs text-slate-100">{warning.reason}</p>
      </div>
      <div className="mt-5 flex items-center justify-center gap-3 border border-slate-700 bg-slate-950 p-3">
        {seconds > 0 ? <><span className="font-mono text-[9px] tracking-widest text-slate-400">LECTURE OBLIGATOIRE</span><strong className="font-display text-3xl tabular-nums text-amber-300">{seconds}s</strong></> : <><CheckCircle2 className="h-5 w-5 text-emerald-300"/><strong className="font-mono text-[10px] tracking-wider text-emerald-200">TU PEUX CONTINUER</strong></>}
      </div>
      <label className="mt-5 block font-mono text-[9px] tracking-widest text-cyan-200">CHOISIS UN NOUVEAU PSEUDO</label>
      <input autoFocus value={name} onChange={e=>{setName(e.target.value.slice(0,18));setError("");}} onKeyDown={e=>{if(e.key==="Enter"&&seconds===0&&!busy&&name.trim().length>=2)void submit();}} maxLength={18} minLength={2} placeholder="2 à 18 caractères" className="mt-2 w-full border border-cyan-400/30 bg-slate-950 px-3 py-3 font-mono text-sm text-slate-100 outline-none focus:border-cyan-300"/>
      <p className="mt-2 font-mono text-[8px] text-slate-500">Ton compte, tes crédits, ton XP et tes statistiques sont conservés. Ton ancien pseudo sera libéré.</p>
      {error&&<p role="alert" className="mt-3 border border-rose-400/30 p-3 font-mono text-[9px] text-rose-300">{error}</p>}
      <button onClick={()=>void submit()} disabled={seconds>0||busy||name.trim().length<2} className="cyber-btn cyber-btn-primary mt-4 w-full px-4 py-3 font-mono text-[10px] font-bold tracking-wider disabled:cursor-not-allowed disabled:opacity-40">{busy?"ENREGISTREMENT...":"VALIDER MON NOUVEAU PSEUDO"}</button>
    </div>
  </div>;
}

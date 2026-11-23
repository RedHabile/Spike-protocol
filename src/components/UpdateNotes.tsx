import { useState } from "react";
import { Newspaper, X, RefreshCw, CalendarDays } from "lucide-react";
import { loadLatestSpikeUpdate, type SpikeUpdateNote } from "../game/cloud";

function formatDate(value:string) {
  return new Intl.DateTimeFormat("fr-FR",{dateStyle:"long"}).format(new Date(value));
}

export function UpdateNotes() {
  const [open,setOpen]=useState(false);
  const [note,setNote]=useState<SpikeUpdateNote|null>(null);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const show=async()=>{
    setOpen(true);setLoading(true);setError("");
    try { setNote(await loadLatestSpikeUpdate()); }
    catch(e) { setError(e instanceof Error?e.message:"Impossible de charger les nouveautés."); }
    finally { setLoading(false); }
  };
  return <>
    <button onClick={()=>void show()} aria-label="Dernière mise à jour" title="Dernière mise à jour" className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center">
      <Newspaper className="h-4 w-4"/>
    </button>
    {open&&<div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="update-notes-title">
      <div className="cyber-panel flex max-h-[85vh] w-full max-w-xl flex-col border-cyan-400/40 p-4 sm:p-6">
        <div className="flex items-center justify-between border-b border-cyan-400/20 pb-3">
          <div><div className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] text-cyan-300"><Newspaper className="h-3.5 w-3.5"/>CENTRE DES NOUVEAUTÉS</div><h2 id="update-notes-title" className="mt-1 font-display text-2xl font-bold tracking-wider text-slate-100">MISE À JOUR</h2></div>
          <button onClick={()=>setOpen(false)} aria-label="Fermer" className="cyber-btn cyber-btn-ghost flex h-9 w-9 items-center justify-center"><X className="h-4 w-4"/></button>
        </div>
        {loading?<div className="flex items-center justify-center gap-2 py-12 font-mono text-xs text-cyan-200"><RefreshCw className="h-4 w-4 animate-spin"/>CHARGEMENT DES NOUVEAUTÉS...</div>:error?<p role="alert" className="mt-4 border border-rose-400/30 p-3 font-mono text-xs text-rose-300">{error}</p>:note?<div className="mt-5 min-h-0 overflow-y-auto">
          <div className="flex items-center gap-2 font-mono text-[9px] tracking-widest text-cyan-300"><CalendarDays className="h-3.5 w-3.5"/>{formatDate(note.created_at)}</div>
          <h3 className="mt-3 font-display text-xl font-bold tracking-wide text-white">{note.title}</h3>
          <div className="mt-4 whitespace-pre-wrap break-words font-mono text-xs leading-7 text-slate-300">{note.content}</div>
        </div>:<div className="py-12 text-center"><Newspaper className="mx-auto h-8 w-8 text-slate-600"/><p className="mt-3 font-mono text-xs text-slate-400">Aucune note de mise à jour publiée pour le moment.</p></div>}
        <p className="mt-5 border-t border-slate-800 pt-3 font-mono text-[8px] tracking-widest text-slate-600">SPIKE PROTOCOL // JOURNAL DES VERSIONS</p>
      </div>
    </div>}
  </>;
}

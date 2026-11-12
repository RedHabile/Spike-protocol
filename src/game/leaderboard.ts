export interface LeaderboardEntry { player_name: string; best_score: number; updated_at?: string; }
export interface PlaytimeEntry { player_name: string; total_seconds: number; updated_at?: string; }

const STORAGE_ID = "spike-player-id";
const STORAGE_NAME = "spike-player-name";
const env = (import.meta as ImportMeta & { env: { VITE_SUPABASE_URL?: string; VITE_SUPABASE_ANON_KEY?: string } }).env;
// Configuration publique du projet Supabase. La clé publishable est conçue pour être utilisée côté navigateur.
const url = (env.VITE_SUPABASE_URL || "https://rrhulffyvltogdbbagir.supabase.co").replace(/\/$/, "");
const key = env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyaHVsZmZ5dmx0b2dkYmJhZ2lyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQyOTgwOTksImV4cCI6MjEwOTg3NDA5OX0.Pmac0mgdsVlJRXapMIJg6YVCXLiMzJmHCKshtVmLhRA";
export const leaderboardConfigured = Boolean(url && key);

function playerId(): string {
  try {
    let id = localStorage.getItem(STORAGE_ID);
    if (!id) {
      id = typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = Math.random() * 16 | 0;
            return (c === "x" ? r : (r & 3 | 8)).toString(16);
          });
      localStorage.setItem(STORAGE_ID, id);
    }
    return id;
  } catch {
    return "00000000-0000-4000-8000-000000000001";
  }
}

export function getPlayerName(): string {
  try {
    return localStorage.getItem(STORAGE_NAME) || `OPÉRATEUR-${playerId().slice(0, 4).toUpperCase()}`;
  } catch {
    return "OPÉRATEUR";
  }
}

export function savePlayerName(name: string): void {
  const clean = name.trim().replace(/\s+/g, " ").slice(0, 18);
  if (clean.length < 2) throw new Error("Le pseudo doit contenir au moins 2 caractères.");
  try { localStorage.setItem(STORAGE_NAME, clean); } catch { /* stockage local indisponible */ }
}

function headers() {
  if (!url || !key) throw new Error("Classement non configuré.");
  return { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };
}

export async function loadLeaderboard(): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${url}/rest/v1/leaderboard?select=player_name,best_score,updated_at&order=best_score.desc&limit=100`, {
    headers: headers(),
  });
  if (!response.ok) throw new Error("Impossible de charger le classement.");
  return response.json() as Promise<LeaderboardEntry[]>;
}

export async function submitBestScore(score: number): Promise<void> {
  if (!leaderboardConfigured || !Number.isFinite(score) || score <= 0) return;
  const response = await fetch(`${url}/rest/v1/rpc/submit_spike_score`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      p_player_id: playerId(),
      p_player_name: getPlayerName(),
      p_score: Math.floor(score),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Envoi du score impossible.");
  }
}


export async function loadPlaytimeLeaderboard(): Promise<PlaytimeEntry[]> {
  const response = await fetch(`${url}/rest/v1/playtime_leaderboard?select=player_name,total_seconds,updated_at&order=total_seconds.desc&limit=100`, {
    headers: headers(),
  });
  if (!response.ok) throw new Error("Impossible de charger le classement du temps de jeu.");
  return response.json() as Promise<PlaytimeEntry[]>;
}

export async function recordPlaytime(seconds: number, accountId?: string): Promise<void> {
  const safeSeconds = Math.floor(seconds);
  if (!leaderboardConfigured || !Number.isFinite(safeSeconds) || safeSeconds < 1) return;
  const response = await fetch(`${url}/rest/v1/rpc/submit_spike_playtime`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({
      p_player_id: accountId || playerId(),
      p_player_name: getPlayerName(),
      p_seconds: Math.min(safeSeconds, 3600),
    }),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || "Enregistrement du temps de jeu impossible.");
  }
}

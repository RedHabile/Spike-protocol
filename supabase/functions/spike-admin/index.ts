import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const cors = {
  "Access-Control-Allow-Origin": "https://redhabile.github.io",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const skinIds = new Set(["classic","plasma","toxic","sunset","ice","void","cobalt","crimson","sandstorm","digital","carbon","royal","hazard","aurora","obsidian","titan","eclipse","inferno","overdrive","apex","warborn","headhunter","immortal","vanguard","overlord","spectral","nebula","prism","royalflare","deepsea","rosequartz","cyberpunk","goldrush","ghostwire","starlight","venomwave","frostbite","bloodmoon","neonviper","galaxy","chromatic","sunken","emberstorm","ultraviolet","hologram","singularity"]);
const trailIds = new Set(["comet","lightning","embers","prism","glitch","aurora","void","stardust","rainbow","toxicmist","pinknova","blueflame","sunflare","pixelstorm","moonlight","dragon","sakura","electric","arctic","golden","cyberstream","blackhole","dreamwave","lavacosmic"]);

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const respond = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });
  if (req.method !== "POST") return respond({ error: "Méthode non autorisée." }, 405);

  const projectUrl = Deno.env.get("SUPABASE_URL");
  const secretsRaw = Deno.env.get("SUPABASE_SECRET_KEYS");
  let serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
  if (!serviceKey && secretsRaw) {
    try { const secrets = JSON.parse(secretsRaw); serviceKey = secrets.default || Object.values(secrets)[0] as string || ""; } catch { /* secret absent */ }
  }
  const adminCode = Deno.env.get("SPIKE_ADMIN_CODE");
  if (!projectUrl || !serviceKey || !adminCode) return respond({ error: "Configuration admin incomplète. Ajoute SPIKE_ADMIN_CODE dans les secrets Edge Functions." }, 503);

  const auth = req.headers.get("Authorization") || "";
  if (!auth.startsWith("Bearer ")) return respond({ error: "Connexion joueur requise." }, 401);
  const token = auth.slice(7);
  const verify = await fetch(`${projectUrl}/auth/v1/user`, { headers: { apikey: serviceKey, Authorization: `Bearer ${token}` } });
  if (!verify.ok) return respond({ error: "Session invalide. Reconnecte-toi." }, 401);
  const caller = await verify.json();
  if (caller.email?.trim().toLowerCase() !== "ethan.ventre2411@gmail.com") return respond({ error: "Ce compte n’est pas autorisé à utiliser le mode admin." }, 403);

  let body: { code?: string; email?: string; operation?: string; amount?: number; skin?: string; trail?: string; reason?: string };
  try { body = await req.json(); } catch { return respond({ error: "Requête invalide." }, 400); }
  if (!body.code || body.code !== adminCode) return respond({ error: "Code admin incorrect." }, 403);
  const email = body.email?.trim().toLowerCase();
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return respond({ error: "Adresse e-mail invalide." }, 400);

  let target: { id: string; email?: string } | null = null;
  for (let page = 1; page <= 20 && !target; page++) {
    const list = await fetch(`${projectUrl}/auth/v1/admin/users?page=${page}&per_page=100`, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } });
    if (!list.ok) return respond({ error: "Impossible de consulter les comptes." }, 502);
    const data = await list.json();
    const users = Array.isArray(data.users) ? data.users : [];
    target = users.find((u: {id:string;email?:string}) => u.email?.toLowerCase() === email) || null;
    if (users.length < 100) break;
  }
  if (!target) return respond({ error: "Aucun compte trouvé avec cette adresse." }, 404);

  if (body.operation === "warning_create") {
    const reason = body.reason?.trim();
    if (!reason || reason.length < 4 || reason.length > 300) {
      return respond({ error: "Le motif doit contenir entre 4 et 300 caractères." }, 400);
    }
    const created = await fetch(`${projectUrl}/rest/v1/rpc/admin_create_spike_username_warning`, {
      method: "POST",
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_user_id: target.id, p_reason: reason }),
    });
    if (!created.ok) {
      const errorData = await created.json().catch(() => ({}));
      return respond({ error: errorData.message || errorData.details || "Enregistrement de l'avertissement impossible." }, 502);
    }
    const warning = await created.json();
    return respond({ success: true, player: target.email, operation: "warning_create", previousName: warning.previous_name });
  }

  const profileUrl = `${projectUrl}/rest/v1/player_profiles?user_id=eq.${encodeURIComponent(target.id)}`;
  const read = await fetch(`${profileUrl}&select=profile`, { headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}` } });
  if (!read.ok) return respond({ error: "Lecture du profil impossible." }, 502);
  const rows = await read.json();
  const profile = rows[0]?.profile;
  if (!profile || typeof profile !== "object") return respond({ error: "Ce joueur n'a pas encore de profil cloud." }, 404);

  if (body.operation === "xp_reset") {
    profile.xp = 0;
  } else if (body.operation === "credits" || body.operation === "xp") {
    const amount = body.amount;
    if (!Number.isSafeInteger(amount) || !amount || Math.abs(amount) > 100000) return respond({ error: "Montant invalide (1 à 100 000)." }, 400);
    const field = body.operation;
    profile[field] = Math.max(0, Math.min(100000000, (Number(profile[field]) || 0) + amount));
  } else if (body.operation === "reset_inventory") {
    profile.credits = 0;
    profile.unlockedSkins = ["classic"];
    profile.equippedSkin = "classic";
  } else if (body.operation === "skin_add" || body.operation === "skin_remove" || body.operation === "skin_all") {
    const skins = Array.isArray(profile.unlockedSkins) ? profile.unlockedSkins : ["classic"];
    if (body.operation === "skin_all") profile.unlockedSkins = [...skinIds];
    else if (!body.skin || !skinIds.has(body.skin)) return respond({ error: "Skin inconnu." }, 400);
    else if (body.operation === "skin_add") profile.unlockedSkins = [...new Set([...skins, body.skin])];
    else {
      if (body.skin === "classic") return respond({ error: "Le skin de base ne peut pas être retiré." }, 400);
      profile.unlockedSkins = skins.filter((id: string) => id !== body.skin);
      if (profile.equippedSkin === body.skin) profile.equippedSkin = "classic";
    }
  } else if (body.operation === "trail_add" || body.operation === "trail_remove" || body.operation === "trail_all") {
    const trails = Array.isArray(profile.unlockedTrails) ? profile.unlockedTrails : ["comet"];
    if (body.operation === "trail_all") profile.unlockedTrails = [...trailIds];
    else if (!body.trail || !trailIds.has(body.trail)) return respond({ error: "Traînée inconnue." }, 400);
    else if (body.operation === "trail_add") profile.unlockedTrails = [...new Set([...trails, body.trail])];
    else {
      if (body.trail === "comet") return respond({ error: "La traînée de base ne peut pas être retirée." }, 400);
      profile.unlockedTrails = trails.filter((id: string) => id !== body.trail);
      if (profile.equippedTrail === body.trail) profile.equippedTrail = "comet";
    }
  } else return respond({ error: "Opération inconnue." }, 400);

  const update = await fetch(profileUrl, {
    method: "PATCH",
    headers: { apikey: serviceKey, Authorization: `Bearer ${serviceKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ profile, updated_at: new Date().toISOString() }),
  });
  if (!update.ok) return respond({ error: "Enregistrement du profil impossible." }, 502);
  return respond({ success: true, player: target.email, operation: body.operation, profile: { xp: profile.xp, credits: profile.credits, unlockedSkins: profile.unlockedSkins, unlockedTrails: profile.unlockedTrails } });
});
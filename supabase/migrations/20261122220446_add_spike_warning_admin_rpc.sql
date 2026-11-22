create or replace function public.admin_create_spike_username_warning(
  p_user_id uuid,
  p_reason text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $function$
declare
  current_name text;
  new_warning_id uuid;
begin
  if current_setting('role', true) <> 'service_role' then
    raise exception 'Accès réservé au service de modération.';
  end if;
  if p_reason is null or char_length(btrim(p_reason)) < 4 or char_length(p_reason) > 300 then
    raise exception 'Le motif doit contenir entre 4 et 300 caractères.';
  end if;
  if exists (
    select 1 from public.spike_username_warnings
    where user_id = p_user_id and status = 'pending'
  ) then
    raise exception 'Ce joueur possède déjà un avertissement en attente de changement de pseudo.';
  end if;
  select player_name into current_name
  from public.spike_player_names
  where user_id = p_user_id;
  insert into public.spike_username_warnings(user_id, reason, previous_name, status)
  values (p_user_id, btrim(p_reason), current_name, 'pending')
  returning id into new_warning_id;
  return jsonb_build_object('id', new_warning_id, 'previous_name', current_name);
end;
$function$;

revoke all on function public.admin_create_spike_username_warning(uuid, text) from public, anon, authenticated;
grant execute on function public.admin_create_spike_username_warning(uuid, text) to service_role;

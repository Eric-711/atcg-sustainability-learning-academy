-- Run in Supabase SQL editor after creating a project.
-- Anonymous clients may INSERT only. No public read/update/delete permissions.
create table if not exists public.event_registrations (
 id uuid primary key default gen_random_uuid(),
 event_id text not null check (event_id in ('island','house','finale')),
 display_name text not null check (char_length(display_name) between 1 and 90),
 contact_email text check (contact_email is null or (char_length(contact_email) <= 254 and contact_email ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$')),
 created_at timestamptz not null default now()
);
alter table public.event_registrations enable row level security;
revoke all on public.event_registrations from anon, authenticated;
grant insert on public.event_registrations to anon, authenticated;
drop policy if exists "Public event registration insert" on public.event_registrations;
create policy "Public event registration insert" on public.event_registrations for insert to anon, authenticated with check (true);
-- Organizer reads must use authenticated backend / admin privileges, never service-role key in browser.
-- Add captcha, throttling and verified signup before public launch.

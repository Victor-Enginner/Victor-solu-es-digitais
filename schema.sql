-- Schema v2 - Victor AI Engineer (Soluções Digitais) | Supabase (PostgreSQL + Auth + RLS)
-- Cole tudo no Supabase > SQL Editor > New query > Run. Pode rodar mais de uma vez.

-- ============================================================
-- TABELAS
-- ============================================================

-- Parceiros: 1 linha por usuário do Supabase Auth (id = auth.users.id)
create table if not exists public.partners (
    id uuid primary key references auth.users(id) on delete cascade,
    name text not null default '',
    email text unique not null,
    whatsapp text not null default '',
    pix_key text not null default '',
    level integer not null default 1,
    created_at timestamptz not null default timezone('utc'::text, now())
);

-- Leads: empresas indicadas pelos parceiros
create table if not exists public.leads (
    id uuid primary key default gen_random_uuid(),
    partner_id uuid not null references public.partners(id) on delete cascade,
    company_name varchar(255) not null,
    city varchar(100) not null default 'Franca - SP',
    service_type varchar(100) not null,
    whatsapp varchar(50) not null,
    instagram varchar(100),
    status varchar(50) not null default 'pending',
    date varchar(20) not null,
    created_at timestamptz not null default timezone('utc'::text, now()),
    constraint leads_status_check check (status in ('pending', 'reviewing', 'closed_paid', 'rejected')),
    constraint leads_service_check check (service_type in ('site', 'google', 'automacao', 'chatbot'))
);

create index if not exists leads_partner_id_idx on public.leads (partner_id);

-- Administradores (quem pode ver tudo e mudar status). Ninguém lê essa tabela pela API.
create table if not exists public.admins (
    email text primary key
);

-- >>> TROQUE pelo e-mail com o qual você vai criar sua conta de admin no site <<<
insert into public.admins (email) values ('vitorborsari11@gmail.com')
on conflict do nothing;

-- ============================================================
-- FUNÇÕES
-- ============================================================

-- Admin = e-mail está em public.admins E foi confirmado no Auth (evita alguém
-- se cadastrar com o e-mail do admin sem ser dono dele).
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
    select exists (
        select 1
        from auth.users u
        join public.admins a on lower(a.email) = lower(u.email)
        where u.id = auth.uid()
          and u.email_confirmed_at is not null
    );
$$;

-- Cria a linha em partners automaticamente quando alguém se cadastra no Auth.
-- Os dados vêm do signUp({ options: { data: { name, whatsapp, pix_key } } }).
-- "level" nunca vem do cliente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.partners (id, name, email, whatsapp, pix_key)
    values (
        new.id,
        coalesce(new.raw_user_meta_data ->> 'name', ''),
        new.email,
        coalesce(new.raw_user_meta_data ->> 'whatsapp', ''),
        coalesce(new.raw_user_meta_data ->> 'pix_key', '')
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Nível do parceiro é calculado no servidor: 1 fechado = 2, 3 = 3, 5+ = 4.
create or replace function public.recalc_partner_level()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
    closed_count integer;
begin
    select count(*) into closed_count
    from public.leads
    where partner_id = new.partner_id and status = 'closed_paid';

    update public.partners
    set level = case
        when closed_count >= 5 then 4
        when closed_count >= 3 then 3
        when closed_count >= 1 then 2
        else 1
    end
    where id = new.partner_id;

    return new;
end;
$$;

drop trigger if exists leads_recalc_level on public.leads;
create trigger leads_recalc_level
    after insert or update of status on public.leads
    for each row execute function public.recalc_partner_level();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.partners enable row level security;
alter table public.leads enable row level security;
alter table public.admins enable row level security;  -- sem policies = ninguém acessa pela API

-- Limpa policies antigas (schema v1) para não ficarem duplicadas
drop policy if exists "Partners can view own profile" on public.partners;
drop policy if exists "Partners can view own leads" on public.leads;
drop policy if exists "Partners can insert own leads" on public.leads;
drop policy if exists "partners_select_own_or_admin" on public.partners;
drop policy if exists "leads_select_own_or_admin" on public.leads;
drop policy if exists "leads_insert_own" on public.leads;
drop policy if exists "leads_update_admin" on public.leads;

-- Parceiro lê só o próprio perfil; admin lê todos.
-- (Sem policy de UPDATE/INSERT/DELETE em partners: o cliente não consegue se dar nível 4.)
create policy "partners_select_own_or_admin"
    on public.partners for select
    using (id = auth.uid() or public.is_admin());

-- Parceiro lê só os próprios leads; admin lê todos.
create policy "leads_select_own_or_admin"
    on public.leads for select
    using (partner_id = auth.uid() or public.is_admin());

-- Parceiro só cria lead em seu nome e sempre como 'pending'.
create policy "leads_insert_own"
    on public.leads for insert
    with check (partner_id = auth.uid() and status = 'pending');

-- Só o admin muda status.
create policy "leads_update_admin"
    on public.leads for update
    using (public.is_admin())
    with check (public.is_admin());

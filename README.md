# Victor AI Engineer — Soluções Digitais

Plataforma de parceiros: quem indica empresas (leads) acompanha o status, o ranking e a comissão. Inclui painel admin, academy, simulador de comissão e notificações por e-mail (Resend) e WhatsApp.
Stack: **Next.js 16** (App Router, Turbopack) + TypeScript + Tailwind v4 + **Supabase** (Postgres, Auth, RLS).

## Instalar do zero (PC novo)

### 1. Requisitos
- **Node.js 20.9 ou mais novo** (nodejs.org) e **Git**
- Conta no **Supabase** (só para o modo real; veja o modo demonstração abaixo)

### 2. Baixar o código
```bash
git clone https://github.com/Victor-Enginner/Victor-solu-es-digitais.git
cd Victor-solu-es-digitais
npm install
```

### 3. Modo demonstração (sem configurar nada)
```bash
npm run dev      # http://localhost:3000
```
Sem as variáveis do Supabase, o site usa um banco falso no `localStorage` do navegador (`src/lib/db.ts`). Isso serve para mexer no visual, mas não guarda nada de verdade.

### 4. Modo real (Supabase)
1. Crie um projeto em supabase.com.
2. Abra **SQL Editor → New query**, cole o arquivo `schema.sql` inteiro e clique em **Run**. Pode rodar mais de uma vez.
   Antes de rodar, troque no `schema.sql` o e-mail do admin (linha do `insert into public.admins`) pelo seu.
3. Configure as variáveis:
   ```bash
   cp .env.example .env.local
   ```
   Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (Supabase → **Connect** ou Project Settings → API).
   **Nunca** coloque a chave `service_role` nem a senha do banco nesse arquivo.
4. Opcionais:
   - `RESEND_API_KEY` e `NOTIFY_EMAIL`: aviso por e-mail quando entra um lead.
   - `WHATSAPP_API_URL`, `WHATSAPP_API_TOKEN` e `ADMIN_WHATSAPP`: aviso por WhatsApp (Evolution API ou Z-API).
5. Rode `npm run dev` e crie sua conta em `/signup` com o mesmo e-mail que você pôs como admin.

### 5. Produção
```bash
npm run build && npm start
```
Na **Vercel**: importe o repositório e cadastre as mesmas variáveis do `.env.local` em *Settings → Environment Variables*. Ajuste `NEXT_PUBLIC_SITE_URL` para o domínio final.

## Onde fica cada coisa
- `src/app/`: páginas (`dashboard`, `admin`, `ranking`, `academy`, `audit`, `login`, `signup`) e a API `api/notify`
- `src/lib/db.ts`: acesso ao Supabase e o banco de demonstração
- `schema.sql`: tabelas, regras de acesso (RLS) e lista de admins
- `TODO.md`: roadmap

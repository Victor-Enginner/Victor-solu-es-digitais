-- Schema SQL para Banco de Dados da plataforma Victor AI Engineer (Soluções Digitais)
-- Banco sugerido: PostgreSQL / Supabase

-- Tabela de Parceiros (Alunos / Prospectores)
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    whatsapp VARCHAR(50) NOT NULL,
    pix_key VARCHAR(100) NOT NULL,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela de Leads Indicados (Empresas locais)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    partner_id UUID NOT NULL REFERENCES public.partners(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) DEFAULT 'Franca - SP' NOT NULL,
    service_type VARCHAR(100) NOT NULL, -- 'site', 'google', 'automacao', 'chatbot'
    whatsapp VARCHAR(50) NOT NULL,
    instagram VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' NOT NULL, -- 'pending', 'reviewing', 'closed_paid', 'rejected'
    date VARCHAR(20) NOT NULL, -- Data formatada (ex: '09/07/2026')
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar Row Level Security (RLS) se hospedado no Supabase para segurança
ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS
-- Permitir que parceiros leiam seu próprio perfil
CREATE POLICY "Partners can view own profile" 
    ON public.partners 
    FOR SELECT 
    USING (auth.uid() = id);

-- Permitir que parceiros criem e leiam seus próprios leads
CREATE POLICY "Partners can view own leads" 
    ON public.leads 
    FOR SELECT 
    USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert own leads" 
    ON public.leads 
    FOR INSERT 
    WITH CHECK (partner_id = auth.uid());

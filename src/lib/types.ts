// Tipos compartilhados entre banco, hooks e páginas.
// Fonte única de verdade para Partner e Lead no app inteiro.

export type LeadStatus = "pending" | "reviewing" | "closed_paid" | "rejected";

export type ServiceType = "site" | "google" | "automacao" | "chatbot";

export const SERVICE_LABELS: Record<ServiceType, string> = {
  site: "Sites & Landing Pages",
  google: "Google Meu Negócio",
  automacao: "Automações de WhatsApp",
  chatbot: "Agente de Inteligência Artificial",
};

/** Linha da tabela `partners` — camelCase e snake_case convivem entre mock e Supabase. */
export interface PartnerRow {
  id: string;
  name: string;
  email: string;
  whatsapp?: string;
  whatsapp_number?: string;
  pix_key?: string;
  pixKey?: string;
  level?: number;
  created_at?: string;
}

/** Linha crua da tabela `leads` (Supabase, snake_case). */
export interface LeadRow {
  id: string;
  partner_id: string;
  company_name: string;
  city: string;
  service_type: string;
  whatsapp: string;
  instagram?: string | null;
  status: LeadStatus;
  date: string;
  created_at: string;
  partners?: { name?: string; whatsapp?: string; pix_key?: string } | null;
}

/** Lead já normalizado em camelCase, como as páginas consomem.
 *  Os campos do parceiro vêm sempre preenchidos (com defaults) após normalizeLead(). */
export interface Lead {
  id: string;
  partner_id: string;
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  status: LeadStatus;
  date: string;
  created_at?: string;
  partnerName: string;
  partnerWhatsapp: string;
  pixKey: string;
}

/** Dados enviados pelo formulário de nova indicação. */
export interface LeadInput {
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
}

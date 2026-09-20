import { SITE_URL } from "./site-config";

export type LeadStatus = "pending" | "reviewing" | "closed_paid" | "rejected";

export interface NewLeadMessageData {
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  partnerName: string;
  partnerWhatsapp: string;
  pixKey: string;
}

/** Texto enviado ao Victor quando uma empresa nova é indicada. */
export function buildNewLeadMessage(lead: NewLeadMessageData): string {
  return (
    `🔔 *[Victor AI] Nova Empresa Indicada!*\n\n` +
    `🏢 *Empresa:* ${lead.companyName}\n` +
    `📍 *Cidade:* ${lead.city}\n` +
    `🛠️ *Serviço Sugerido:* ${lead.service}\n` +
    `📞 *WhatsApp Dono:* ${lead.whatsapp}\n` +
    `📸 *Instagram:* ${lead.instagram || "Não informado"}\n\n` +
    `👤 *Indicado por:* ${lead.partnerName}\n` +
    `📱 *WhatsApp Parceiro:* ${lead.partnerWhatsapp}\n` +
    `🔑 *Chave Pix:* ${lead.pixKey}\n\n` +
    `Painel administrativo:\n🔗 ${SITE_URL}/admin`
  );
}

/** Texto enviado ao parceiro quando o status da indicação muda. */
export function buildStatusMessage(
  partnerName: string,
  companyName: string,
  newStatus: LeadStatus
): string {
  const map: Record<LeadStatus, { label: string; note: string }> = {
    pending: {
      label: "⏳ Pendente",
      note: "Sua indicação foi recebida e está na fila para auditoria comercial inicial.",
    },
    reviewing: {
      label: "🔍 Em Análise Comercial",
      note: "Nossa equipe já entrou em contato com o cliente e está apresentando o orçamento de tecnologia.",
    },
    closed_paid: {
      label: "🎉 FECHADO & PAGO!",
      note: "Parabéns! O cliente assinou o contrato. Sua comissão Pix foi liberada. Confira seu extrato!",
    },
    rejected: {
      label: "❌ Desqualificado",
      note: "O contato recusou ou não tem interesse no momento. Continue buscando!",
    },
  };
  const { label, note } = map[newStatus];

  return (
    `🚀 *[Victor AI] Atualização de Status!*\n\n` +
    `Olá *${partnerName.split(" ")[0]}*,\n` +
    `Temos novidades sobre a empresa que você indicou:\n\n` +
    `🏢 *Empresa:* ${companyName}\n` +
    `📊 *Novo Status:* ${label}\n\n` +
    `📝 ${note}\n\n` +
    `Acompanhe seu progresso no painel:\n🔗 ${SITE_URL}/dashboard`
  );
}

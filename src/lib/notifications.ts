// Módulo de Notificações automáticas via WhatsApp (Evolution API / Z-API)
// Adapta-se automaticamente a chaves presentes ou simulação local

const apiURL = process.env.NEXT_PUBLIC_WHATSAPP_API_URL;
const apiToken = process.env.NEXT_PUBLIC_WHATSAPP_API_TOKEN;
const adminPhone = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "5516982141822"; // Padrão admin Victor

export const hasActiveWhatsAppAPI = !!(apiURL && apiToken);

/**
 * Envia uma mensagem de texto via WhatsApp (POST genérico compatível com gateways)
 */
export async function sendWhatsAppNotification(toPhoneNumber: string, message: string): Promise<boolean> {
  const cleanPhone = toPhoneNumber.replace(/\D/g, "");
  // Ensure country code is present (defaulting to Brazil code 55)
  const formattedPhone = cleanPhone.startsWith("55") ? cleanPhone : `55${cleanPhone}`;

  if (hasActiveWhatsAppAPI) {
    try {
      const response = await fetch(apiURL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": apiToken!, // header comum para Evolution API
          "Authorization": `Bearer ${apiToken}` // header fallback para Z-API
        },
        body: JSON.stringify({
          number: formattedPhone, // Evolution API
          phone: formattedPhone,  // Z-API fallback
          message: message,       // Z-API fallback
          textMessage: {
            text: message         // Evolution API
          }
        })
      });

      if (!response.ok) {
        console.error("Erro na resposta do gateway WhatsApp:", await response.text());
        return false;
      }
      return true;
    } catch (err) {
      console.error("Erro de rede ao conectar à API do WhatsApp:", err);
      return false;
    }
  } else {
    // ==========================================
    // EMULAÇÃO LOCAL (Exibição no Console)
    // ==========================================
    console.log(
      `%c[WHATSAPP MOCK ALERT] Enviado para: ${formattedPhone}\n----------------------------------------\n${message}\n----------------------------------------`,
      "background: #10B981; color: #white; padding: 4px; border-radius: 4px; font-weight: bold;"
    );
    return true;
  }
}

/**
 * Notifica o Victor (Admin) quando uma nova empresa for cadastrada
 */
export async function notifyAdminNewLead(lead: {
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  partnerName: string;
  partnerWhatsapp: string;
  pixKey: string;
}): Promise<void> {
  const message = `🔔 *[Victor AI] Nova Empresa Indicada!*\n\n` +
    `Um parceiro comercial acabou de cadastrar um lead.\n\n` +
    `🏢 *Empresa:* ${lead.companyName}\n` +
    `📍 *Cidade:* ${lead.city}\n` +
    `🛠️ *Serviço Sugerido:* ${lead.service}\n` +
    `📞 *WhatsApp Dono:* ${lead.whatsapp}\n` +
    `📸 *Instagram:* ${lead.instagram || "Não informado"}\n\n` +
    `👤 *Indicado por:* ${lead.partnerName}\n` +
    `📱 *WhatsApp Aluno:* ${lead.partnerWhatsapp}\n` +
    `🔑 *Chave Pix:* ${lead.pixKey}\n\n` +
    `Acesse o painel administrativo para auditar:\n` +
    `🔗 http://localhost:3000/admin`;

  await sendWhatsAppNotification(adminPhone, message);
}

/**
 * Notifica o Aluno/Parceiro quando o status comercial do lead dele mudar
 */
export async function notifyPartnerStatusChange(
  partnerName: string,
  partnerPhone: string,
  companyName: string,
  newStatus: "pending" | "reviewing" | "closed_paid" | "rejected"
): Promise<void> {
  let statusLabel = "Pendente";
  let statusNote = "";

  switch (newStatus) {
    case "pending":
      statusLabel = "⏳ Pendente";
      statusNote = "Sua indicação foi recebida e está na fila para auditoria comercial inicial.";
      break;
    case "reviewing":
      statusLabel = "🔍 Em Análise Comercial";
      statusNote = "Nossa equipe de vendas já entrou em contato com o cliente e está apresentando o orçamento de tecnologia.";
      break;
    case "closed_paid":
      statusLabel = "🎉 FECHADO & PAGO!";
      statusNote = "Parabéns! O cliente assinou o contrato. Sua comissão Pix foi liberada e transferida para sua conta. Confira seu extrato!";
      break;
    case "rejected":
      statusLabel = "❌ Desqualificado";
      statusNote = "Infelizmente o contato foi recusado ou o cliente não tem interesse em atualizar a tecnologia no momento. Continue buscando!";
      break;
  }

  const message = `🚀 *[Victor AI] Atualização de Status!*\n\n` +
    `Olá *${partnerName.split(" ")[0]}*,\n` +
    `Temos novidades sobre a empresa que você nos indicou:\n\n` +
    `🏢 *Empresa:* ${companyName}\n` +
    `📊 *Novo Status:* ${statusLabel}\n\n` +
    `📝 *Nota da equipe:* ${statusNote}\n\n` +
    `Acompanhe seu progresso e subida de nível no painel:\n` +
    `🔗 http://localhost:3000/dashboard`;

  await sendWhatsAppNotification(partnerPhone, message);
}

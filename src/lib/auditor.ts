// Módulo Auditor Comercial - Gera diagnósticos de maturidade digital
// Simula a consulta ao Google Places API ou lê dados estáticos baseados no lead

export interface AuditReport {
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  
  // Scores (0 to 100)
  scoreSEO: number;
  scoreWeb: number;
  scoreChat: number;
  overallScore: number;

  // Detailed Metrics
  mapsRegistered: boolean;
  mapsPhotosCount: number;
  mapsRating: number;
  hasWebsite: boolean;
  websiteResponsive: boolean;
  hasChatbot: boolean;
  averageResponseTimeText: string;

  // Diagnósticos
  issueDescription: string;
  solutionProposed: string;
}

export function generateAuditReport(lead: {
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
}): AuditReport {
  // Deterministic random generator based on company name length to keep scores stable per company
  const seed = lead.companyName.length;
  const getRandom = (min: number, max: number, offset = 0) => {
    const val = Math.sin(seed + offset) * 10000;
    const rand = val - Math.floor(val);
    return Math.floor(rand * (max - min + 1)) + min;
  };

  const serviceName = lead.service.toLowerCase();

  // 1. Google Maps SEO Local Metrics
  const needsGoogleSEO = serviceName.includes("google") || serviceName.includes("maps");
  const mapsRegistered = !needsGoogleSEO || getRandom(0, 10, 1) > 2; // mostly registered but poor SEO
  const mapsRating = mapsRegistered ? parseFloat((getRandom(32, 45, 2) / 10).toFixed(1)) : 0;
  const mapsPhotosCount = mapsRegistered ? getRandom(2, 8, 3) : 0;
  const scoreSEO = needsGoogleSEO 
    ? getRandom(15, 35, 4) 
    : (mapsRegistered ? getRandom(65, 85, 4) : 0);

  // 2. Web Presence Metrics (Sites/Landing Pages)
  const needsWebsite = serviceName.includes("site") || serviceName.includes("landing") || serviceName.includes("página");
  const hasWebsite = !needsWebsite; // if they ordered a site, they don't have one
  const websiteResponsive = hasWebsite ? getRandom(0, 10, 5) > 6 : false;
  const scoreWeb = needsWebsite 
    ? 0 
    : (hasWebsite ? (websiteResponsive ? getRandom(85, 95, 6) : getRandom(40, 60, 6)) : 0);

  // 3. Automations & AI Chatbot Metrics
  const needsChatbot = serviceName.includes("automação") || serviceName.includes("zap") || serviceName.includes("chatbot") || serviceName.includes("ia");
  const hasChatbot = !needsChatbot && getRandom(0, 10, 7) > 8; // very rare
  const scoreChat = needsChatbot 
    ? getRandom(10, 30, 8) 
    : (hasChatbot ? getRandom(80, 95, 8) : getRandom(35, 55, 8));
  
  const averageResponseTimeText = needsChatbot 
    ? "Média de 35 minutos (atendimento manual lento)" 
    : (hasChatbot ? "Instantâneo (menor que 1 min)" : "Média de 12 a 20 minutos");

  // Overall Score Calculation
  const overallScore = Math.round((scoreSEO + scoreWeb + scoreChat) / 3);

  // Custom descriptions based on the core issue
  let issueDescription = "";
  let solutionProposed = "";

  if (needsWebsite) {
    issueDescription = `A empresa *${lead.companyName}* não possui um site ou landing page indexada. Atualmente dependem exclusivamente de redes sociais ou links diretos de WhatsApp. Isso impede a captação de clientes orgânicos no Google, reduz a credibilidade e impede a execução de campanhas de tráfego pago qualificadas.`;
    solutionProposed = "Criação de uma Landing Page ultra-rápida e otimizada para conversão de vendas, com carregamento otimizado para celulares, links de contato integrados e tags de rastreamento de anúncios (Google Ads, Facebook Pixel).";
  } else if (needsGoogleSEO) {
    issueDescription = `O perfil do Google Maps da empresa está desatualizado, invisível ou inexistente. Ao pesquisar pelos serviços na região de ${lead.city}, a concorrência aparece no topo, gerando perda contínua de novos clientes qualificados que buscam ativamente por telefone ou rotas de rota no Google.`;
    solutionProposed = "Implementação de SEO Local avançado no Google Meu Negócio: otimização de palavras-chave, preenchimento estratégico de serviços, inserção de fotos profissionais de alta qualidade e técnicas para ranqueamento nas 3 primeiras posições do mapa local.";
  } else {
    issueDescription = `O atendimento ao cliente via WhatsApp da *${lead.companyName}* é 100% manual e descentralizado. Clientes que entram em contato fora do horário comercial ou durante picos de atendimento enfrentam atrasos médios de 30 minutos, resultando em perda de vendas e abandono de carrinho.`;
    solutionProposed = "Desenvolvimento de um Funil de Atendimento Inteligente no WhatsApp com integração de Chatbot de IA de linguagem natural ou roteamento automático de contatos para atendentes, operando 24 horas por dia, 7 dias por semana.";
  }

  return {
    companyName: lead.companyName,
    city: lead.city,
    service: lead.service,
    whatsapp: lead.whatsapp,
    instagram: lead.instagram,
    
    scoreSEO,
    scoreWeb,
    scoreChat,
    overallScore,

    mapsRegistered,
    mapsPhotosCount,
    mapsRating,
    hasWebsite,
    websiteResponsive,
    hasChatbot,
    averageResponseTimeText,

    issueDescription,
    solutionProposed
  };
}

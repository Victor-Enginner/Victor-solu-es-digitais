"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Search, DollarSign, Clock, CheckCircle2, AlertCircle, FileText, Send, Sparkles } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { getLeads, createLead, isRealDatabase } from "../../lib/db";
import { notifyPublicLead } from "../../lib/notifications";
import { whatsappLink } from "../../lib/site-config";

interface Lead {
  id: string;
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  partnerName: string;
  partnerWhatsapp: string;
  pixKey: string;
  status: "pending" | "reviewing" | "closed_paid" | "rejected";
  date: string;
}

export function Prospeccao() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  
  // Form fields
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("Franca - SP");
  const [service, setService] = useState("site");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [partnerWhatsapp, setPartnerWhatsapp] = useState("");
  const [pixKey, setPixKey] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [whatsappShareUrl, setWhatsappShareUrl] = useState("");

  // Sync logged-in partner details
  useEffect(() => {
    if (user) {
      setPartnerName(user.name);
      setPartnerWhatsapp(user.whatsapp);
      setPixKey(user.pixKey);
    }
  }, [user]);

  // Load leads from DB (or localStorage mock on mount)
  const fetchLeads = async () => {
    try {
      if (user) {
        const data = await getLeads(user.id);
        setLeads(data);
      } else {
        // Visitante sem conta: mostra só o que ele mesmo enviou neste navegador (nada de dados de exemplo).
        const cachedLeads = localStorage.getItem("victor_ai_partner_leads");
        const parsed: Lead[] = cachedLeads ? JSON.parse(cachedLeads) : [];
        setLeads(parsed.filter((l) => !String(l.id).startsWith("mock")));
      }
    } catch (err) {
      console.error("Erro ao buscar leads no formulário:", err);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !whatsapp || !partnerName || !partnerWhatsapp || !pixKey) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);

    const serviceLabelMap: Record<string, string> = {
      site: "Sites & Landing Pages",
      google: "Google Meu Negócio",
      automacao: "Automações de WhatsApp",
      chatbot: "Agente de Inteligência Artificial"
    };

    try {
      if (user) {
        // Logged-in submission directly to database
        await createLead(user.id, {
          companyName,
          city,
          service: serviceLabelMap[service] || service,
          whatsapp,
          instagram: instagram || undefined
        });
      } else {
        // Fallback local storage mock for non-logged-in visitors
        const newLead: Lead = {
          id: `lead_${Date.now()}`,
          companyName,
          city,
          service: serviceLabelMap[service] || service,
          whatsapp,
          instagram: instagram || undefined,
          partnerName,
          partnerWhatsapp,
          pixKey,
          status: "pending",
          date: new Date().toLocaleDateString("pt-BR")
        };

        const cachedLeads = localStorage.getItem("victor_ai_partner_leads");
        const currentLeadsList = cachedLeads ? JSON.parse(cachedLeads) : [];
        const updatedLeads = [newLead, ...currentLeadsList];
        localStorage.setItem("victor_ai_partner_leads", JSON.stringify(updatedLeads));

        // Avisa o Victor pelo servidor (WhatsApp/e-mail); se falhar, o botão do WhatsApp abaixo cobre.
        notifyPublicLead({
          companyName,
          city,
          service: serviceLabelMap[service] || service,
          whatsapp,
          instagram: instagram || undefined,
          partnerName,
          partnerWhatsapp,
          pixKey,
        }).catch((err) => console.error("Falha ao avisar o Victor:", err));
      }

      setWhatsappShareUrl(
        whatsappLink(
          `Olá Victor! Acabei de indicar uma empresa pelo site.

` +
          `Empresa: ${companyName}
Cidade: ${city}
Serviço: ${serviceLabelMap[service] || service}
` +
          `WhatsApp do dono: ${whatsapp}
Indicado por: ${partnerName}`
        )
      );

      setCompanyName("");
      setWhatsapp("");
      setInstagram("");

      setIsSubmitting(false);
      setShowSuccessToast(true);
      await fetchLeads();

      setTimeout(() => {
        setShowSuccessToast(false);
      }, 12000);
    } catch (err) {
      console.error("Erro ao registrar indicação:", err);
      setIsSubmitting(false);
    }
  };

  const getStatusDetails = (status: Lead["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendente",
          color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400",
          icon: Clock
        };
      case "reviewing":
        return {
          label: "Em Análise Comercial",
          color: "text-blue-600 bg-blue-500/10 border-blue-500/20 dark:text-blue-400",
          icon: Search
        };
      case "closed_paid":
        return {
          label: "Fechado & Pago!",
          color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-[#10B981] dark:bg-[#10B981]/10",
          icon: CheckCircle2
        };
      case "rejected":
        return {
          label: "Desqualificado",
          color: "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400",
          icon: AlertCircle
        };
    }
  };

  return (
    <section id="prospeccao" className="py-24 bg-brand-bg transition-colors duration-300 relative overflow-hidden border-t border-brand-blue/10">
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/5 to-transparent pointer-events-none" />

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 glass-panel border-[#10B981] p-4 rounded-xl shadow-2xl flex items-center gap-3 bg-brand-bg"
          >
            <div className="p-2 rounded-lg bg-[#10B981]/25 text-[#10B981]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-primary text-sm">Empresa Indicada com Sucesso!</h5>
              <p className="text-xs text-secondary">Nossa equipe analisará o lead e atualizará o painel.</p>
              {whatsappShareUrl && (
                <a
                  href={whatsappShareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-2 text-xs font-bold text-[#10B981] hover:underline"
                >
                  Avisar o Victor agora no WhatsApp →
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-full border border-brand-blue/15">
            Painel de Indicações
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-primary">
            Indique uma Empresa e Comece a Lucrar
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            Preencha os dados da empresa local que você identificou. Faremos uma auditoria detalhada e entraremos em contato. Você acompanha tudo em tempo real abaixo.
          </p>
        </div>

        {/* Prospeccao Form & Dashboard List Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Submission Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center gap-2 border-b border-brand-blue/10 pb-4">
                <PlusCircle className="w-5 h-5 text-[#0052FF]" />
                <h3 className="text-lg font-bold text-primary">Nova Indicação</h3>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                    Nome da Empresa / Estabelecimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    id="lead-company"
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Pizzaria Bella Italia"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                  />
                </div>

                {/* City & Service Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                      Cidade *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Ex: Franca - SP"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                      Serviço Foco *
                    </label>
                    <select
                      value={service}
                      id="lead-service"
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all appearance-none cursor-pointer"
                    >
                      <option value="site">Landing Page / Site</option>
                      <option value="google">Google Meu Negócio</option>
                      <option value="automacao">Automação Zap</option>
                      <option value="chatbot">Agente de IA</option>
                    </select>
                  </div>
                </div>

                {/* Contacts Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                      WhatsApp do Dono *
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ex: (16) 99999-9999"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                      Instagram / Link
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Ex: @bellaitalia"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                    />
                  </div>
                </div>

                <div className="border-t border-brand-blue/15 pt-4 mt-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                      Seus Dados (Para Receber Payout)
                    </span>
                    {user && (
                      <span className="text-[9px] text-[#10B981] bg-[#10B981]/15 px-2 py-0.5 rounded border border-[#10B981]/20 font-bold uppercase">
                        Perfil Ativo
                      </span>
                    )}
                  </div>

                  {/* Partner Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                      Seu Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      readOnly={!!user}
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Ex: Gabriel Souza"
                      className={`w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all ${
                        user ? "opacity-65 bg-slate-500/5 pointer-events-none select-none cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  {/* Payout Keys Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                        Seu WhatsApp *
                      </label>
                      <input
                        type="text"
                        required
                        readOnly={!!user}
                        value={partnerWhatsapp}
                        onChange={(e) => setPartnerWhatsapp(e.target.value)}
                        placeholder="Ex: (16) 99123-4567"
                        className={`w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all ${
                          user ? "opacity-65 bg-slate-500/5 pointer-events-none select-none cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-secondary uppercase tracking-wider block">
                        Chave Pix *
                      </label>
                      <input
                        type="text"
                        required
                        readOnly={!!user}
                        value={pixKey}
                        onChange={(e) => setPixKey(e.target.value)}
                        placeholder="CPF, celular ou email"
                        className={`w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all ${
                          user ? "opacity-65 bg-slate-500/5 pointer-events-none select-none cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl bg-[#0052FF] text-white font-bold text-sm hover:bg-[#1E6BFF] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,82,255,0.2)] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? "Enviando indicação..." : "Enviar Indicação Comercial"}</span>
                </button>
              </form>
            </div>
          </div>

          {/* Leads Tracking Dashboard (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0052FF]" /> Minhas Indicações Recentes
              </span>
              <span className="text-[10px] text-secondary">
                {user && isRealDatabase ? "Sincronizado com a sua conta" : "Salvo localmente no navegador"}
              </span>
            </div>

            {leads.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-secondary italic text-sm">
                Nenhuma indicação cadastrada ainda. Use o formulário ao lado para fazer seu primeiro registro!
              </div>
            ) : (
              <div className="space-y-3">
                {leads.map((lead) => {
                  const statusInfo = getStatusDetails(lead.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden"
                    >
                      <div className="space-y-2">
                        {/* Company Details */}
                        <div className="flex items-center gap-2.5">
                          <h4 className="font-bold text-primary text-base">
                            {lead.companyName}
                          </h4>
                          <span className="text-[10px] bg-brand-blue/5 border border-brand-blue/15 text-secondary px-2.5 py-0.5 rounded font-mono">
                            {lead.city}
                          </span>
                        </div>

                        {/* Service Focus & Date */}
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-secondary">
                          <span>Foco: <strong className="text-primary">{lead.service}</strong></span>
                          <span>•</span>
                          <span>Contato: <strong className="text-primary">{lead.whatsapp}</strong></span>
                          <span>•</span>
                          <span>Enviado em: <strong>{lead.date}</strong></span>
                        </div>

                        {/* Partner Details */}
                        <div className="text-[10px] text-secondary/60">
                          Indicador: {lead.partnerName} ({lead.partnerWhatsapp})
                        </div>
                      </div>

                      {/* Deal Status & Commission Payout Flag */}
                      <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto border-t sm:border-t-0 border-brand-blue/10 pt-3 sm:pt-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                        
                        {lead.status === "closed_paid" && (
                          <span className="text-[10px] text-emerald-600 dark:text-[#10B981] font-black uppercase flex items-center gap-0.5 bg-[#10B981]/5 px-2 py-0.5 rounded border border-[#10B981]/15">
                            <DollarSign className="w-3 h-3" /> Pix Enviado
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}

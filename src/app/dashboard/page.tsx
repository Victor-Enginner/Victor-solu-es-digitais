"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { getLeads, createLead, updatePartnerLevel } from "../../lib/db";
import { Logo } from "../../components/ui/logo";
import { 
  LogOut, Plus, RefreshCw, Send, CheckCircle2, 
  Search, Clock, AlertCircle, Award, DollarSign, 
  Sparkles, FileText, ArrowRight, User 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Lead {
  id: string;
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  status: "pending" | "reviewing" | "closed_paid" | "rejected";
  date: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, refreshUser } = useAuth();
  
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  
  // New Lead Form States
  const [showFormModal, setShowFormModal] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [city, setCity] = useState("Franca - SP");
  const [service, setService] = useState("site");
  const [whatsapp, setWhatsapp] = useState("");
  const [instagram, setInstagram] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const fetchUserData = async () => {
    if (!user) return;
    setLoadingLeads(true);
    try {
      const data = await getLeads(user.id);
      setLeads(data);
      // Check and update level
      const currentLevel = await updatePartnerLevel(user.id, data);
      if (currentLevel !== user.level) {
        await refreshUser();
      }
    } catch (err) {
      console.error("Erro ao carregar leads:", err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    } else if (user) {
      fetchUserData();
    }
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-primary">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#0052FF] animate-spin" />
          <span className="text-sm font-semibold italic">Verificando sessão...</span>
        </div>
      </div>
    );
  }

  // Commission Calculations
  const getCommissionValue = (serviceName: string) => {
    if (serviceName.includes("Site")) return 400;
    if (serviceName.includes("Google")) return 350;
    if (serviceName.includes("Automação") || serviceName.includes("Zap")) return 500;
    if (serviceName.includes("Agente") || serviceName.includes("Chatbot") || serviceName.includes("IA")) return 1000;
    return 400;
  };

  const totalLeads = leads.length;
  const closedLeads = leads.filter(l => l.status === "closed_paid").length;
  const pendingLeads = leads.filter(l => l.status === "pending" || l.status === "reviewing").length;
  
  const earnedCommission = leads
    .filter(l => l.status === "closed_paid")
    .reduce((acc, curr) => acc + getCommissionValue(curr.service), 0);

  const potentialCommission = leads
    .filter(l => l.status === "pending" || l.status === "reviewing")
    .reduce((acc, curr) => acc + getCommissionValue(curr.service), 0);

  // Gamification Level calculations
  const getLevelBadge = (level: number) => {
    switch (level) {
      case 1: return { name: "Iniciante", color: "text-slate-500 bg-slate-500/10 border-slate-500/20", target: 1 };
      case 2: return { name: "Promotor Local", color: "text-[#0052FF] bg-[#0052FF]/10 border-[#0052FF]/20", target: 3 };
      case 3: return { name: "Elite Franca", color: "text-purple-500 bg-purple-500/10 border-purple-500/20", target: 5 };
      case 4: return { name: "AI Partner Ninja", color: "text-yellow-500 bg-yellow-500/10 border-yellow-500/20", target: 999 };
      default: return { name: "Iniciante", color: "text-slate-500 bg-slate-500/10 border-slate-500/20", target: 1 };
    }
  };

  const levelInfo = getLevelBadge(user.level);
  const nextLevelInfo = getLevelBadge(user.level + 1);
  const progressPercent = Math.min((closedLeads / levelInfo.target) * 100, 100);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    
    if (!companyName || !whatsapp) {
      setFormError("Por favor, preencha o nome da empresa e o contato.");
      return;
    }

    setIsSubmitting(true);
    try {
      const serviceLabelMap: Record<string, string> = {
        site: "Sites & Landing Pages",
        google: "Google Meu Negócio",
        automacao: "Automações de WhatsApp",
        chatbot: "Agente de Inteligência Artificial"
      };

      await createLead(user.id, {
        companyName,
        city,
        service: serviceLabelMap[service] || service,
        whatsapp,
        instagram: instagram || undefined
      });

      // Reset
      setCompanyName("");
      setWhatsapp("");
      setInstagram("");
      setShowFormModal(false);
      
      // Refresh
      await fetchUserData();
    } catch (err: any) {
      setFormError(err.message || "Erro ao registrar indicação.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: Lead["status"]) => {
    switch (status) {
      case "pending":
        return {
          label: "Pendente",
          color: "text-yellow-600 bg-yellow-500/10 border-yellow-500/20 dark:text-yellow-400",
          icon: Clock
        };
      case "reviewing":
        return {
          label: "Em Análise",
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
          label: "Recusado",
          color: "text-red-600 bg-red-500/10 border-red-500/20 dark:text-red-400",
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-primary transition-colors duration-300">
      
      {/* Dashboard Header */}
      <header className="border-b border-brand-blue/10 bg-brand-bg/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            {/* Header Links */}
            <div className="flex items-center gap-3 mr-2 sm:mr-4">
              <Link 
                href="/academy" 
                className="text-xs font-bold text-secondary hover:text-primary transition-colors"
              >
                Manual & Scripts
              </Link>
              <span className="text-secondary/35 text-xs">|</span>
              <Link 
                href="/ranking" 
                className="text-xs font-bold text-secondary hover:text-brand-blue transition-colors flex items-center gap-1"
              >
                <span>Ranking</span>
              </Link>
            </div>

            {/* User Profile Summary */}
            <div className="hidden md:flex items-center gap-2.5 bg-brand-bg/50 border border-brand-blue/10 px-3.5 py-1.5 rounded-full">
              <User className="w-4 h-4 text-[#0052FF]" />
              <span className="text-xs font-bold truncate max-w-[120px]">{user.name}</span>
              <span className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full border ${levelInfo.color}`}>
                Nível {user.level}: {levelInfo.name}
              </span>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              className="p-2.5 rounded-full border border-red-500/10 hover:border-red-500/30 text-red-500 hover:bg-red-500/5 transition-all cursor-pointer"
              title="Sair da Conta"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Upper Dashboard Banner (Welcome + Level Progress) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Welcome User Block */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between relative overflow-hidden bg-[#0052FF]/5">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Sparkles className="w-32 h-32 text-[#0052FF]" />
            </div>
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-bold text-[#0052FF] uppercase tracking-widest block">Painel do Aluno</span>
              <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-primary">
                Olá, {user.name.split(" ")[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-secondary max-w-lg leading-relaxed">
                Continue auditando as empresas e comércios locais em Franca-SP. Lembre-se: comissões de setup são pagas via Pix em até 24h após o fechamento do contrato.
              </p>
            </div>

            <div className="pt-6 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 relative z-10">
              <button
                onClick={() => setShowFormModal(true)}
                className="py-3 px-6 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs transition-all shadow-[0_0_20px_rgba(0,82,255,0.2)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
                <span>Indicar Nova Empresa</span>
              </button>
              
              <button
                onClick={fetchUserData}
                className="py-3 px-6 rounded-xl bg-transparent border border-brand-blue/20 hover:bg-brand-blue/5 text-primary font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${loadingLeads ? "animate-spin" : ""}`} />
                <span>Atualizar Painel</span>
              </button>
            </div>
          </div>

          {/* Gamification Level Status Card */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <h4 className="text-sm font-bold text-primary">Progressão de Nível</h4>
              </div>
              <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded border ${levelInfo.color}`}>
                Nível {user.level}
              </span>
            </div>

            {/* Level target info */}
            <div className="space-y-1.5 my-4">
              <span className="text-xs text-secondary">
                {user.level === 4 ? (
                  "Parabéns! Você alcançou o nível máximo do programa."
                ) : (
                  <>
                    Faltam <strong className="text-primary">{levelInfo.target - closedLeads} contratos</strong> para você subir para o nível <strong>{user.level + 1} ({nextLevelInfo.name})</strong>.
                  </>
                )}
              </span>

              {/* Progress Bar */}
              <div className="w-full h-2.5 bg-brand-blue/10 rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-gradient-to-r from-brand-blue to-emerald-400 transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-secondary font-semibold">
                <span>Nível {user.level}: {levelInfo.name}</span>
                <span>{closedLeads}/{levelInfo.target} Fechados</span>
              </div>
            </div>

            <div className="text-[10px] text-secondary italic border-t border-brand-blue/10 pt-3">
              💡 Níveis maiores garantem bônus de Payout e convites para mentorias de vendas.
            </div>
          </div>

        </div>

        {/* Core Stats Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Leads */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-secondary">
              <FileText className="w-12 h-12" />
            </div>
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Indicações Totais</span>
            <h3 className="text-2xl sm:text-3xl font-black text-primary mt-1">
              {totalLeads}
            </h3>
            <p className="text-[10px] text-secondary mt-1">Empresas enviadas</p>
          </div>

          {/* Card 2: Closed Deals */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-emerald-500">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Contratos Fechados</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10B981] mt-1">
              {closedLeads}
            </h3>
            <p className="text-[10px] text-secondary mt-1">{pendingLeads} em andamento</p>
          </div>

          {/* Card 3: Realized Payout */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden bg-emerald-500/5">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-[#10B981]">
              <DollarSign className="w-12 h-12" />
            </div>
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Comissões Recebidas</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#10B981] mt-1">
              R$ {earnedCommission.toLocaleString("pt-BR")},00
            </h3>
            <p className="text-[10px] text-secondary mt-1">Valores pagos via Pix</p>
          </div>

          {/* Card 4: Potential Payout */}
          <div className="glass-panel p-5 rounded-2xl relative overflow-hidden bg-brand-blue/5">
            <div className="absolute top-0 right-0 p-3 opacity-5 text-[#0052FF]">
              <DollarSign className="w-12 h-12" />
            </div>
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Comissões em Análise</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0052FF] mt-1">
              R$ {potentialCommission.toLocaleString("pt-BR")},00
            </h3>
            <p className="text-[10px] text-secondary mt-1">Potencial de conversão</p>
          </div>
        </div>

        {/* Leads Table & Academy Side Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Leads Table Tracking (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-secondary uppercase tracking-widest flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#0052FF]" /> Acompanhamento de Indicações
              </span>
              <span className="text-[10px] text-secondary">
                Ordens recentes por data
              </span>
            </div>

            {loadingLeads ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-secondary italic text-sm flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#0052FF] animate-spin" />
                Carregando registros de banco de dados...
              </div>
            ) : leads.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-secondary italic text-sm">
                Nenhuma indicação cadastrada ainda. Clique em "Indicar Nova Empresa" para começar a ganhar!
              </div>
            ) : (
              <div className="space-y-3.5">
                {leads.map((lead) => {
                  const statusInfo = getStatusBadge(lead.status);
                  const StatusIcon = statusInfo.icon;
                  const comValue = getCommissionValue(lead.service);
                  
                  return (
                    <div
                      key={lead.id}
                      className="glass-panel p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden hover:border-brand-blue/30 transition-all duration-300"
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
                          <span>Serviço: <strong className="text-primary">{lead.service}</strong></span>
                          <span>•</span>
                          <span>WhatsApp: <strong className="text-primary">{lead.whatsapp}</strong></span>
                          {lead.instagram && (
                            <>
                              <span>•</span>
                              <span>Insta: <strong className="text-primary">{lead.instagram}</strong></span>
                            </>
                          )}
                        </div>
                        <div className="text-[10px] text-secondary/50 flex items-center gap-3">
                          <span>Data de Envio: {lead.date}</span>
                          <span>•</span>
                          <Link 
                            href={`/audit/${lead.id}`}
                            className="font-bold text-brand-blue hover:underline flex items-center gap-0.5"
                          >
                            <span>Visualizar Relatório de Auditoria</span>
                            <ArrowRight className="w-3 h-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Deal Status & Commission Payout Flag */}
                      <div className="flex flex-col items-end gap-1.5 w-full sm:w-auto border-t sm:border-t-0 border-brand-blue/10 pt-3 sm:pt-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${statusInfo.color}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusInfo.label}
                        </span>
                        
                        <span className="text-[10px] text-secondary font-bold">
                          Comissão: <strong className={lead.status === "closed_paid" ? "text-[#10B981]" : "text-primary"}>
                            R$ {comValue},00
                          </strong>
                        </span>
                        
                        {lead.status === "closed_paid" && (
                          <span className="text-[9px] text-emerald-600 dark:text-[#10B981] font-black uppercase flex items-center gap-0.5 bg-[#10B981]/5 px-2 py-0.5 rounded border border-[#10B981]/15">
                            <DollarSign className="w-2.5 h-2.5" /> Pix Paga
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Quick Academy & Support Hub (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Quick Tips Academy Card */}
            <div className="glass-panel p-6 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#0052FF]" />
                <h4 className="text-sm font-bold text-primary">Academy Rápida</h4>
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                Quer fechar sua primeira comissão ainda essa semana? Separamos 3 dicas de ouro de prospecção:
              </p>
              
              <ul className="space-y-3.5 text-xs text-secondary">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF] mt-1.5 flex-shrink-0" />
                  <span>Procure por **pizzarias locais no Instagram**. A maioria não tem site próprio e gasta fortunas com taxas de apps de delivery.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF] mt-1.5 flex-shrink-0" />
                  <span>Pesquise por **'mecanica em franca'** no Google Maps. A maioria das que aparecem na segunda página está implorando por otimização local SEO.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0052FF] mt-1.5 flex-shrink-0" />
                  <span>Envie uma mensagem no direct de **clínicas de estética**. Se demorarem mais de 10 minutos, ofereça a Automação de Agendamento.</span>
                </li>
              </ul>
              
              <Link 
                href="/academy"
                className="w-full mt-2 py-3 px-4 rounded-xl border border-brand-blue/15 hover:border-brand-blue/30 text-xs font-bold text-primary hover:text-[#0052FF] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Acessar Treinamento Completo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Direct Support Card */}
            <div className="glass-panel p-6 rounded-2xl space-y-3.5 bg-[#10B981]/5 border-[#10B981]/15">
              <h4 className="text-sm font-bold text-primary">Suporte ao Parceiro</h4>
              <p className="text-xs text-secondary leading-relaxed">
                Está com dúvidas sobre uma abordagem comercial ou quer acelerar a auditoria de uma indicação específica? Fale diretamente com o Victor no WhatsApp oficial de parcerias.
              </p>
              <a
                href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor,%20sou%20parceiro%20do%20portal%20e%20gostaria%20de%20tirar%20uma%20d%C3%BAvida%20sobre%20uma%20indica%C3%A7%C3%A3o!"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#10B981] to-emerald-600 text-white font-bold text-xs text-center flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-500/10"
              >
                <span>Suporte via WhatsApp</span>
              </a>
            </div>

          </div>

        </div>

      </main>

      {/* NEW LEAD FORM MODAL */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFormModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel rounded-2xl p-6 sm:p-8 max-w-md w-full relative z-10 shadow-2xl bg-brand-bg"
            >
              <div className="flex items-center gap-2 border-b border-brand-blue/10 pb-4 mb-6">
                <Plus className="w-5 h-5 text-[#0052FF]" />
                <h3 className="text-lg font-bold text-primary">Nova Indicação de Empresa</h3>
              </div>

              {formError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-semibold mb-4">
                  {formError}
                </div>
              )}

              <form onSubmit={handleCreateLead} className="space-y-4">
                {/* Company Name */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Nome da Empresa / Estabelecimento *
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Hamburgueria Big Burguer"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                  />
                </div>

                {/* City & Service Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
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
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      Serviço Sugerido *
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all appearance-none cursor-pointer"
                    >
                      <option value="site">Landing Page / Site</option>
                      <option value="google">Google Maps SEO</option>
                      <option value="automacao">Automação Zap</option>
                      <option value="chatbot">Agente de IA</option>
                    </select>
                  </div>
                </div>

                {/* Contact & Instagram */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      WhatsApp do Dono *
                    </label>
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ex: (16) 99887-7766"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                      Instagram / Link
                    </label>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Ex: @bigburguer"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl px-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                    />
                  </div>
                </div>

                {/* Modal actions */}
                <div className="flex items-center gap-3 pt-4 border-t border-brand-blue/10 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowFormModal(false)}
                    className="flex-1 py-3.5 rounded-xl border border-brand-blue/15 hover:border-brand-blue/30 text-xs font-bold text-primary hover:bg-brand-blue/5 transition-all cursor-pointer text-center"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? "Enviando..." : "Salvar Indicação"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

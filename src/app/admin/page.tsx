"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../hooks/useAuth";
import { getAllLeads, updateLeadStatus } from "../../lib/db";
import { Logo } from "../../components/ui/logo";
import { 
  LogOut, RefreshCw, CheckCircle2, Search, 
  Clock, AlertCircle, DollarSign, FileText, 
  ArrowRight, Shield, MessageSquare, ExternalLink, Users
} from "lucide-react";
import { motion } from "framer-motion";

interface AdminLead {
  id: string;
  partner_id: string;
  companyName: string;
  city: string;
  service: string;
  whatsapp: string;
  instagram?: string;
  status: "pending" | "reviewing" | "closed_paid" | "rejected";
  date: string;
  partnerName: string;
  partnerWhatsapp: string;
  pixKey: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<AdminLead[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const ADMIN_EMAIL = "vitorborsari11@gmail.com";

  const fetchAllData = async () => {
    setLoadingLeads(true);
    try {
      const data = await getAllLeads();
      setLeads(data);
      setFilteredLeads(data);
    } catch (err) {
      console.error("Erro ao carregar dados do admin:", err);
    } finally {
      setLoadingLeads(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        router.push("/dashboard");
      } else {
        fetchAllData();
      }
    }
  }, [user, authLoading]);

  // Apply filters whenever search, filter, or base leads change
  useEffect(() => {
    let result = leads;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        l => l.companyName.toLowerCase().includes(query) || 
             l.partnerName.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(l => l.status === statusFilter);
    }

    setFilteredLeads(result);
  }, [searchQuery, statusFilter, leads]);

  if (authLoading || !user || user.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-primary">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 text-[#0052FF] animate-spin" />
          <span className="text-sm font-semibold italic">Verificando credenciais de Administrador...</span>
        </div>
      </div>
    );
  }

  // Pricing constants (referral commission)
  const getCommissionValue = (serviceName: string) => {
    if (serviceName.includes("Site")) return 400;
    if (serviceName.includes("Google")) return 350;
    if (serviceName.includes("Automação") || serviceName.includes("Zap")) return 500;
    if (serviceName.includes("Agente") || serviceName.includes("Chatbot") || serviceName.includes("IA")) return 1000;
    return 400;
  };

  const handleStatusChange = async (leadId: string, newStatus: any) => {
    setUpdatingLeadId(leadId);
    try {
      await updateLeadStatus(leadId, newStatus);
      // Reload leads to sync values
      const updatedData = await getAllLeads();
      setLeads(updatedData);
    } catch (err) {
      alert("Erro ao atualizar status do lead.");
    } finally {
      setUpdatingLeadId(null);
    }
  };

  // Metric aggregates
  const totalLeads = leads.length;
  const closedCount = leads.filter(l => l.status === "closed_paid").length;
  const uniquePartners = new Set(leads.map(l => l.partnerName)).size;
  
  const paidCommissions = leads
    .filter(l => l.status === "closed_paid")
    .reduce((acc, curr) => acc + getCommissionValue(curr.service), 0);

  const pendingCommissions = leads
    .filter(l => l.status === "pending" || l.status === "reviewing")
    .reduce((acc, curr) => acc + getCommissionValue(curr.service), 0);

  const getStatusBadgeClass = (status: AdminLead["status"]) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
      case "reviewing": return "text-blue-600 bg-blue-500/10 border-blue-500/20";
      case "closed_paid": return "text-emerald-600 bg-emerald-500/10 border-emerald-500/20 dark:text-[#10B981] dark:bg-[#10B981]/10";
      case "rejected": return "text-red-600 bg-red-500/10 border-red-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-primary transition-colors duration-300">
      
      {/* Admin Header */}
      <header className="border-b border-brand-blue/10 bg-brand-bg/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xs bg-red-500/10 text-red-500 border border-red-500/20 font-bold px-2 py-0.5 rounded flex items-center gap-1">
              <Shield className="w-3 h-3" /> Painel Admin
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              Visualizar como Aluno
            </Link>
            
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
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-primary">
              Controle Geral de Indicações
            </h2>
            <p className="text-xs sm:text-sm text-secondary">
              Gerencie os contratos de Franca-SP e do Brasil e libere os pagamentos de comissão Pix para seus alunos.
            </p>
          </div>
          <button
            onClick={fetchAllData}
            className="w-max py-2.5 px-4 rounded-xl border border-brand-blue/15 hover:border-brand-blue/30 text-xs font-bold text-primary flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loadingLeads ? "animate-spin" : ""}`} />
            <span>Recarregar Dados</span>
          </button>
        </div>

        {/* Global Statistics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Stat 1: Total Leads */}
          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Indicações Gerais</span>
            <h3 className="text-2xl font-black text-primary mt-1">{totalLeads}</h3>
            <p className="text-[10px] text-secondary mt-1">Registradas na plataforma</p>
          </div>

          {/* Stat 2: Closed Deals */}
          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Contratos Fechados</span>
            <h3 className="text-2xl font-black text-[#10B981] mt-1">{closedCount}</h3>
            <p className="text-[10px] text-secondary mt-1">Negócios validados</p>
          </div>

          {/* Stat 3: Unique Partners */}
          <div className="glass-panel p-5 rounded-2xl">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Parceiros Ativos</span>
            <h3 className="text-2xl font-black text-[#0052FF] mt-1">{uniquePartners}</h3>
            <p className="text-[10px] text-secondary mt-1">Alunos divulgando</p>
          </div>

          {/* Stat 4: Paid Commissions */}
          <div className="glass-panel p-5 rounded-2xl bg-emerald-500/5">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Comissões Pagas</span>
            <h3 className="text-2xl font-black text-[#10B981] mt-1">R$ {paidCommissions.toLocaleString("pt-BR")},00</h3>
            <p className="text-[10px] text-secondary mt-1">Total transferido Pix</p>
          </div>

          {/* Stat 5: Pending Commissions */}
          <div className="glass-panel p-5 rounded-2xl bg-brand-blue/5">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Faturamento Pendente</span>
            <h3 className="text-2xl font-black text-[#0052FF] mt-1">R$ {pendingCommissions.toLocaleString("pt-BR")},00</h3>
            <p className="text-[10px] text-secondary mt-1">Aguardando fechamento</p>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="glass-panel p-4 rounded-xl flex flex-col md:flex-row items-center gap-4">
          {/* Search Input */}
          <div className="relative w-full md:flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar por empresa ou aluno..."
              className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg pl-9 pr-4 py-2.5 text-xs text-primary focus:outline-none focus:border-[#0052FF] transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-lg px-3 py-2.5 text-xs text-primary focus:outline-none focus:border-[#0052FF] transition-all cursor-pointer"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendentes</option>
              <option value="reviewing">Em Análise Comercial</option>
              <option value="closed_paid">Fechados & Pagos</option>
              <option value="rejected">Recusados</option>
            </select>
          </div>
        </div>

        {/* Leads Table Card */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-brand-blue/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-blue/10 bg-brand-bg/50 text-secondary uppercase font-bold tracking-wider">
                  <th className="px-6 py-4">Empresa / Cidade</th>
                  <th className="px-6 py-4">Serviço / Comissão</th>
                  <th className="px-6 py-4">Aluno Indicador</th>
                  <th className="px-6 py-4">Chave Pix / Contato</th>
                  <th className="px-6 py-4">Status Comercial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-blue/5">
                {loadingLeads ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-secondary italic">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 text-[#0052FF] animate-spin" />
                        Carregando registros de prospecção...
                      </div>
                    </td>
                  </tr>
                ) : filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-secondary italic">
                      Nenhum lead encontrado com os filtros atuais.
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => {
                    const commission = getCommissionValue(lead.service);
                    return (
                      <tr key={lead.id} className="hover:bg-brand-blue/5 transition-colors">
                        
                        {/* Company & Location */}
                        <td className="px-6 py-4 space-y-1">
                          <div className="font-bold text-primary text-sm flex items-center gap-1.5">
                            {lead.companyName}
                            {lead.instagram && (
                              <a 
                                href={`https://instagram.com/${lead.instagram.replace('@', '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-secondary hover:text-[#0052FF]"
                                title="Instagram do cliente"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                          <div className="text-[10px] text-secondary flex items-center gap-1.5">
                            <span className="font-mono">{lead.city}</span>
                            <span>•</span>
                            <span>Enviado: {lead.date}</span>
                            <span>•</span>
                            <Link 
                              href={`/audit/${lead.id}`}
                              className="font-bold text-brand-blue hover:underline flex items-center gap-0.5"
                              target="_blank"
                            >
                              <span>Relatório</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </Link>
                          </div>
                        </td>

                        {/* Service & Commission */}
                        <td className="px-6 py-4 space-y-1">
                          <div className="font-semibold text-primary">{lead.service}</div>
                          <div className="text-[10px] text-[#10B981] font-bold">
                            Comissão Pix: R$ {commission},00
                          </div>
                        </td>

                        {/* Partner Name */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-primary flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-[#0052FF]" />
                            {lead.partnerName}
                          </div>
                          <div className="text-[10px] text-secondary">Código: {lead.partner_id.substring(0, 8)}</div>
                        </td>

                        {/* Pix & WhatsApp */}
                        <td className="px-6 py-4 space-y-1">
                          <div className="font-semibold text-primary">Pix: {lead.pixKey}</div>
                          <div className="flex items-center gap-2">
                            <a
                              href={`https://wa.me/${lead.partnerWhatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-[#10B981] flex items-center gap-1 text-[10px]"
                            >
                              <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                              <span>{lead.partnerWhatsapp}</span>
                            </a>
                            <span>•</span>
                            <a
                              href={`https://wa.me/${lead.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-secondary hover:text-[#0052FF] text-[10px]"
                              title="WhatsApp do Cliente"
                            >
                              WhatsApp Cliente
                            </a>
                          </div>
                        </td>

                        {/* Status dropdown */}
                        <td className="px-6 py-4">
                          {updatingLeadId === lead.id ? (
                            <div className="flex items-center gap-1 text-secondary">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#0052FF]" />
                              <span>Salvando...</span>
                            </div>
                          ) : (
                            <select
                              value={lead.status}
                              onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                              className={`px-3 py-1.5 rounded-full border text-xs font-bold focus:outline-none cursor-pointer ${getStatusBadgeClass(lead.status)}`}
                            >
                              <option value="pending" className="bg-brand-bg text-primary">Pendente</option>
                              <option value="reviewing" className="bg-brand-bg text-primary">Em Análise Comercial</option>
                              <option value="closed_paid" className="bg-brand-bg text-primary">Fechado & Pago!</option>
                              <option value="rejected" className="bg-brand-bg text-primary">Recusado</option>
                            </select>
                          )}
                        </td>

                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

    </div>
  );
}

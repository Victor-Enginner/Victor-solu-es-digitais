"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getAllLeads } from "../../../lib/db";
import { generateAuditReport, AuditReport } from "../../../lib/auditor";
import { Logo } from "../../../components/ui/logo";
import { 
  ArrowLeft, Printer, ShieldAlert, Sparkles, 
  MapPin, CheckCircle, XCircle, HelpCircle, 
  MessageSquare, Star, Image, Globe, ShieldCheck 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AuditReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [report, setReport] = useState<AuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function loadReport() {
      try {
        const allLeads = await getAllLeads();
        const lead = allLeads.find(l => l.id === id);
        
        if (!lead) {
          setErrorMsg("Relatório de auditoria não encontrado.");
          return;
        }

        const reportData = generateAuditReport(lead);
        setReport(reportData);
      } catch (err) {
        console.error("Erro ao carregar auditoria:", err);
        setErrorMsg("Erro ao processar o relatório de auditoria.");
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      loadReport();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-primary">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold italic">Gerando relatório de maturidade...</span>
        </div>
      </div>
    );
  }

  if (errorMsg || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-primary px-4">
        <div className="glass-panel p-8 rounded-2xl max-w-md w-full text-center space-y-4">
          <ShieldAlert className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-bold">Algo deu errado</h3>
          <p className="text-xs text-secondary">{errorMsg || "Erro desconhecido."}</p>
          <button 
            onClick={() => router.push("/")}
            className="w-full py-2.5 rounded-xl bg-brand-blue text-white text-xs font-bold"
          >
            Voltar ao Início
          </button>
        </div>
      </div>
    );
  }

  // Determine score colors
  const getScoreColor = (score: number) => {
    if (score < 40) return "text-red-500 border-red-500/20 bg-red-500/5";
    if (score < 70) return "text-yellow-500 border-yellow-500/20 bg-yellow-500/5";
    return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5";
  };

  const getScoreProgressBarColor = (score: number) => {
    if (score < 40) return "bg-red-500";
    if (score < 70) return "bg-yellow-500";
    return "bg-[#10B981]";
  };

  return (
    <div className="min-h-screen bg-brand-bg text-primary transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:bg-white print:text-black">
      
      {/* Top Floating Actions (Hidden in print) */}
      <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center no-print">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button 
          onClick={() => window.print()}
          className="py-2.5 px-5 rounded-full bg-brand-blue text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,82,255,0.2)] hover:bg-brand-blue-hover"
        >
          <Printer className="w-4 h-4" />
          <span>Salvar Relatório em PDF</span>
        </button>
      </div>

      {/* Main Report Container */}
      <motion.article 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto glass-panel p-8 sm:p-12 rounded-3xl shadow-2xl relative overflow-hidden bg-brand-bg/90 print:border-none print:shadow-none print:p-0 print:rounded-none"
      >
        {/* Background glow in web, hidden in print */}
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-[#0052FF]/5 rounded-full blur-[100px] pointer-events-none no-print" />

        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-brand-blue/10 pb-8 mb-8 print:border-b-2 print:border-slate-300">
          <div>
            <Logo showText={true} />
            <h1 className="text-xl sm:text-2xl font-black font-display text-primary tracking-tight mt-4 print:text-slate-900">
              RELATÓRIO DE MATURIDADE DIGITAL
            </h1>
            <p className="text-xs text-secondary mt-1 print:text-slate-500">
              Análise técnica de posicionamento, tráfego e conversão.
            </p>
          </div>
          
          {/* Status Badge */}
          <div className="flex flex-col items-start sm:items-end">
            <span className="text-[10px] text-secondary uppercase font-bold tracking-wider">Maturidade Geral</span>
            <div className={`mt-1 text-2xl font-black font-display px-4 py-2 rounded-xl border flex items-center gap-2 ${getScoreColor(report.overallScore)}`}>
              <span>{report.overallScore}</span>
              <span className="text-xs font-semibold">/100</span>
            </div>
          </div>
        </div>

        {/* Client & Date Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-brand-blue/5 border border-brand-blue/10 p-5 rounded-2xl mb-8 print:bg-slate-50 print:border-slate-200 print:text-slate-900">
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider print:text-slate-500">Empresa Analisada</h3>
            <div className="font-bold text-primary text-base print:text-slate-950">{report.companyName}</div>
            <div className="text-xs text-secondary flex items-center gap-1 print:text-slate-600">
              <MapPin className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>{report.city}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-secondary uppercase tracking-wider print:text-slate-500">Contato Comercial</h3>
            <div className="text-xs text-primary font-semibold print:text-slate-900">Telefone: {report.whatsapp}</div>
            {report.instagram && (
              <div className="text-xs text-secondary print:text-slate-600">Instagram: {report.instagram}</div>
            )}
          </div>
        </div>

        {/* Detailed Scores Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Score 1: Local SEO */}
          <div className="border border-brand-blue/10 p-5 rounded-2xl flex flex-col justify-between space-y-4 print:border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-wider print:text-slate-500">SEO Local (Maps)</h4>
              <p className="text-[10px] text-secondary mt-1 leading-relaxed">Presença de buscas e rotas.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Nota</span>
                <span className={report.scoreSEO < 40 ? "text-red-500" : "text-[#0052FF]"}>{report.scoreSEO}/100</span>
              </div>
              <div className="w-full h-1.5 bg-brand-blue/10 rounded-full overflow-hidden">
                <div className={`h-full ${getScoreProgressBarColor(report.scoreSEO)}`} style={{ width: `${report.scoreSEO}%` }} />
              </div>
            </div>
          </div>

          {/* Score 2: Web Presence */}
          <div className="border border-brand-blue/10 p-5 rounded-2xl flex flex-col justify-between space-y-4 print:border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-wider print:text-slate-500">Presença Web</h4>
              <p className="text-[10px] text-secondary mt-1 leading-relaxed">Página e indexação própria.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Nota</span>
                <span className={report.scoreWeb < 40 ? "text-red-500" : "text-[#0052FF]"}>{report.scoreWeb}/100</span>
              </div>
              <div className="w-full h-1.5 bg-brand-blue/10 rounded-full overflow-hidden">
                <div className={`h-full ${getScoreProgressBarColor(report.scoreWeb)}`} style={{ width: `${report.scoreWeb}%` }} />
              </div>
            </div>
          </div>

          {/* Score 3: Conversation */}
          <div className="border border-brand-blue/10 p-5 rounded-2xl flex flex-col justify-between space-y-4 print:border-slate-200">
            <div>
              <h4 className="text-xs font-bold text-secondary uppercase tracking-wider print:text-slate-500">Atendimento (Zap)</h4>
              <p className="text-[10px] text-secondary mt-1 leading-relaxed">Automatização e agilidade.</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span>Nota</span>
                <span className={report.scoreChat < 40 ? "text-red-500" : "text-[#0052FF]"}>{report.scoreChat}/100</span>
              </div>
              <div className="w-full h-1.5 bg-brand-blue/10 rounded-full overflow-hidden">
                <div className={`h-full ${getScoreProgressBarColor(report.scoreChat)}`} style={{ width: `${report.scoreChat}%` }} />
              </div>
            </div>
          </div>

        </div>

        {/* Detailed Checkpoints & Diagnostics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8 items-start">
          
          {/* Left Checkpoints (5 cols) */}
          <div className="md:col-span-5 glass-panel p-6 rounded-2xl space-y-4 print:border-slate-200 print:text-slate-900">
            <h4 className="text-xs font-bold text-secondary uppercase tracking-wider print:text-slate-500">Pontos Auditados</h4>
            
            <div className="space-y-3.5 text-xs">
              {/* Point 1 */}
              <div className="flex items-center justify-between border-b border-brand-blue/5 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-secondary" /> Site Próprio
                </span>
                {report.hasWebsite ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Sim</span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Não</span>
                )}
              </div>

              {/* Point 2 */}
              <div className="flex items-center justify-between border-b border-brand-blue/5 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-secondary" /> Cadastro Google Maps
                </span>
                {report.mapsRegistered ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Sim</span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Não</span>
                )}
              </div>

              {/* Point 3 */}
              <div className="flex items-center justify-between border-b border-brand-blue/5 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <Image className="w-4 h-4 text-secondary" /> Fotos Otimizadas
                </span>
                {report.mapsPhotosCount > 15 ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Sim</span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Poucas ({report.mapsPhotosCount})</span>
                )}
              </div>

              {/* Point 4 */}
              <div className="flex items-center justify-between border-b border-brand-blue/5 pb-2.5">
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-secondary" /> Bot Ativo (WhatsApp)
                </span>
                {report.hasChatbot ? (
                  <span className="text-emerald-500 font-bold flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" /> Sim</span>
                ) : (
                  <span className="text-red-500 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Não</span>
                )}
              </div>

              {/* Point 5 */}
              <div className="flex flex-col gap-1">
                <span className="text-secondary">Tempo Médio Resposta:</span>
                <span className="font-semibold text-primary print:text-slate-900">{report.averageResponseTimeText}</span>
              </div>
            </div>
          </div>

          {/* Right Diagnostics (7 cols) */}
          <div className="md:col-span-7 space-y-6 print:text-slate-900">
            {/* Problema */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-red-500 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" /> Problema Crítico Identificado
              </h4>
              <p className="text-sm text-secondary leading-relaxed bg-red-500/5 border border-red-500/10 p-4 rounded-xl print:bg-white print:border-none print:p-0">
                {report.issueDescription}
              </p>
            </div>

            {/* Solução */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#0052FF] uppercase tracking-wider flex items-center gap-1.5 print:text-[#0052FF]">
                <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Upgrade Tecnológico Proposto (Victor AI)
              </h4>
              <p className="text-sm text-primary font-semibold leading-relaxed bg-[#0052FF]/5 border border-[#0052FF]/10 p-4 rounded-xl print:bg-white print:border-none print:p-0">
                {report.solutionProposed}
              </p>
            </div>
          </div>

        </div>

        {/* Footer Commercial Proposal Call */}
        <div className="border-t border-brand-blue/10 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 print:border-t-2 print:border-slate-300 print:text-slate-900 print:pt-4">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-sm font-bold text-primary print:text-slate-900">Victor AI Engineer • Soluções Digitais</h4>
            <p className="text-xs text-secondary max-w-md leading-relaxed">
              Queremos ajudar a sua empresa a alcançar nota máxima e aumentar o faturamento em Franca-SP. Entre em contato para ativar seu site ou chatbot.
            </p>
          </div>

          <a 
            href={`https://wa.me/5516982141822?text=Ol%C3%A1%20Victor,%20gostaria%20de%20conversar%20sobre%20o%20Relat%C3%B3rio%20de%20Maturidade%20da%20minha%20empresa:%20${encodeURIComponent(report.companyName)}!`}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-bold flex items-center gap-2 group cursor-pointer shadow-lg shadow-blue-500/20 no-print"
          >
            <MessageSquare className="w-4.5 h-4.5 text-[#10B981]" />
            <span>Falar com Especialista</span>
          </a>
        </div>

      </motion.article>

    </div>
  );
}

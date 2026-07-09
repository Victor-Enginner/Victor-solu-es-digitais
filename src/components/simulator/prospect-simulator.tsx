"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, ArrowRight, TrendingDown, DollarSign, Activity, Sparkles, Map } from "lucide-react";

interface BusinessOpportunity {
  id: string;
  name: string;
  type: string;
  opportunity: string;
  lossEstimate: string;
  proposedSolution: string;
  commissionOneTime: number;
  commissionRecurring: number;
  coordTop: string;
  coordLeft: string;
  details: string;
}

export function ProspectSimulator() {
  const opportunities: BusinessOpportunity[] = [
    {
      id: "opt1",
      name: "Pizzaria Bella Italia",
      type: "Alimentação / Delivery",
      opportunity: "Sem Site Próprio",
      lossEstimate: "R$ 4.500 - R$ 7.000 / mês (pagando taxas de 27% para aplicativos de terceiros)",
      proposedSolution: "Site institucional com cardápio digital integrado diretamente ao WhatsApp.",
      commissionOneTime: 400,
      commissionRecurring: 80,
      coordTop: "25%",
      coordLeft: "22%",
      details: "O restaurante depende 100% de apps de delivery. Um site próprio economizaria milhares de reais em taxas mensais e fidelizaria o cliente final."
    },
    {
      id: "opt2",
      name: "Clínica Sorriso Clean",
      type: "Saúde / Odontologia",
      opportunity: "Sem Google Meu Negócio",
      lossEstimate: "12 a 18 novos pacientes perdidos mensais (cerca de R$ 8.000 in faturamento)",
      proposedSolution: "Otimização de SEO local e posicionamento no topo do Google Maps.",
      commissionOneTime: 350,
      commissionRecurring: 0,
      coordTop: "42%",
      coordLeft: "68%",
      details: "Ao pesquisar 'dentista em Franca' no Google, a clínica não aparece nos resultados do mapa, perdendo pacientes com alta intenção de agendamento."
    },
    {
      id: "opt3",
      name: "Fashion Boutique",
      type: "Varejo / Moda",
      opportunity: "Sem Automação de WhatsApp",
      lossEstimate: "35% de abandono de carrinho e perda de vendas por atraso na resposta de direct",
      proposedSolution: "Chatbot de IA inteligente para atendimento 24/7 integrado com estoque.",
      commissionOneTime: 600,
      commissionRecurring: 120,
      coordTop: "68%",
      coordLeft: "38%",
      details: "A loja vende muito pelo Instagram, mas perde dezenas de vendas fora do horário comercial porque demoram horas para responder sobre tamanhos e estoque."
    },
    {
      id: "opt4",
      name: "Academia Giga Fit",
      type: "Bem-estar / Fitness",
      opportunity: "Pouca Presença Digital",
      lossEstimate: "Dificuldade de reter alunos e site desatualizado que não funciona em celulares",
      proposedSolution: "Landing page moderna focada em conversão para matrículas e planos anuais.",
      commissionOneTime: 500,
      commissionRecurring: 0,
      coordTop: "54%",
      coordLeft: "16%",
      details: "O site atual deles foi feito há 10 anos. Uma nova página otimizada ajudaria a rodar anúncios locais e encher as turmas nos horários de pico."
    },
    {
      id: "opt5",
      name: "Auto Precision",
      type: "Serviços / Mecânica",
      opportunity: "Gestão Manual de Agenda",
      lossEstimate: "R$ 2.000/mês devido a horários duplicados e esquecimento de clientes",
      proposedSolution: "Sistema web de agendamento integrado com lembretes automáticos via WhatsApp.",
      commissionOneTime: 750,
      commissionRecurring: 150,
      coordTop: "18%",
      coordLeft: "78%",
      details: "O agendamento de revisão dos carros é feito no papel. Com lembretes automatizados, a taxa de comparecimento aumenta em até 40%."
    }
  ];

  const [selectedId, setSelectedId] = useState<string>("opt1");
  const selectedOpportunity = opportunities.find((opt) => opt.id === selectedId) || opportunities[0];

  const handleIndicate = () => {
    const element = document.getElementById("prospeccao");
    if (element) {
      const formServiceInput = document.getElementById("lead-service") as HTMLSelectElement;
      const formCompanyInput = document.getElementById("lead-company") as HTMLInputElement;
      
      if (formServiceInput) {
        if (selectedOpportunity.opportunity.includes("Site")) {
          formServiceInput.value = "site";
        } else if (selectedOpportunity.opportunity.includes("Google")) {
          formServiceInput.value = "google";
        } else if (selectedOpportunity.opportunity.includes("Automação") || selectedOpportunity.opportunity.includes("Agenda")) {
          formServiceInput.value = "automacao";
        } else {
          formServiceInput.value = "site";
        }
      }
      
      if (formCompanyInput) {
        formCompanyInput.value = selectedOpportunity.name;
      }

      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section id="simulador" className="py-24 bg-brand-bg transition-colors duration-300 relative overflow-hidden border-t border-brand-blue/10">
      <div className="absolute inset-0 bg-gradient-to-tr from-[#0052FF]/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full flex items-center gap-1.5 w-max mx-auto border border-[#10B981]/20">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#10B981]" />
            Simulador de Prospecção Ativo
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-primary">
            Existe uma Empresa perto de você perdendo clientes AGORA!
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            Franca-SP está cheia de oportunidades ocultas. Clique nos pontos do simulador de mapa abaixo para identificar o problema de cada negócio e quanto você pode faturar ajudando a resolvê-lo.
          </p>
        </div>

        {/* Simulator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left: Interactive Map representation (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-secondary flex items-center gap-1.5 uppercase tracking-widest">
                <Map className="w-4 h-4 text-[#0052FF]" /> Franca - SP | Mapa de Oportunidades
              </span>
              <span className="text-[10px] bg-red-500/20 text-red-600 dark:text-red-400 font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse border border-red-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                5 Oportunidades Próximas
              </span>
            </div>

            {/* Simulated Map Board (Remains dark for tech/radar styling) */}
            <div className="relative flex-1 min-h-[350px] sm:min-h-[420px] rounded-2xl border border-brand-blue/15 overflow-hidden bg-[#070b19] cyber-grid shadow-2xl">
              
              {/* Street vectors (visual background) */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                {/* Horizontal Streets */}
                <div className="absolute top-[20%] left-0 right-0 h-[10px] bg-[#1E293B]" />
                <div className="absolute top-[50%] left-0 right-0 h-[15px] bg-[#1E293B]" />
                <div className="absolute top-[75%] left-0 right-0 h-[10px] bg-[#1E293B]" />
                {/* Vertical Streets */}
                <div className="absolute left-[30%] top-0 bottom-0 w-[12px] bg-[#1E293B]" />
                <div className="absolute left-[60%] top-0 bottom-0 w-[15px] bg-[#1E293B]" />
                {/* Diagonal Streets */}
                <div className="absolute top-0 left-0 w-[20px] h-[150%] bg-[#1E293B] rotate-45 transform origin-top-left" />
                <div className="absolute bottom-0 right-0 w-[15px] h-[150%] bg-[#1E293B] -rotate-45 transform origin-bottom-right" />
              </div>

              {/* Central Marker representing Victor AI agency headquarters */}
              <div className="absolute top-[48%] left-[48%] -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-12 h-12 rounded-full bg-[#0052FF]/30 animate-ping" />
                  <div className="w-8 h-8 rounded-full bg-[#0052FF] border-2 border-white flex items-center justify-center shadow-lg">
                    <span className="font-display font-black text-xs text-white">V</span>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1.5 whitespace-nowrap bg-black/90 border border-[#0052FF]/40 rounded px-2 py-0.5 text-[8px] font-bold text-white tracking-widest uppercase">
                  Victor AI HQ
                </div>
              </div>

              {/* Interactive opportunity pins */}
              {opportunities.map((opt) => {
                const isSelected = opt.id === selectedId;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedId(opt.id)}
                    style={{ top: opt.coordTop, left: opt.coordLeft }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20 cursor-pointer focus:outline-none"
                  >
                    <div className="relative flex items-center justify-center">
                      {/* Pulse Glow */}
                      <span className={`absolute w-8 h-8 rounded-full transition-transform duration-300 scale-150 ${
                        isSelected 
                          ? "bg-red-500/30 animate-ping" 
                          : "bg-[#0052FF]/20 group-hover/pin:scale-175 group-hover/pin:bg-red-500/10"
                      }`} />
                      
                      {/* Pin Circle */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                        isSelected
                          ? "bg-red-500 border-white scale-125 shadow-lg shadow-red-500/50"
                          : "bg-[#0B132B] border-[#0052FF] group-hover/pin:border-red-400 group-hover/pin:bg-red-950"
                      }`}>
                        <MapPin className={`w-2.5 h-2.5 ${isSelected ? "text-white" : "text-[#0052FF] group-hover/pin:text-red-400"}`} />
                      </div>

                      {/* Tooltip Label */}
                      <span className={`absolute bottom-full mb-1.5 bg-[#0B132B]/95 border text-[10px] font-bold px-2 py-0.5 rounded shadow-lg whitespace-nowrap transition-all duration-300 ${
                        isSelected 
                          ? "opacity-100 translate-y-0 border-red-500 text-white" 
                          : "opacity-0 translate-y-1 border-white/10 text-[#9CA3AF] group-hover/pin:opacity-100 group-hover/pin:translate-y-0"
                      }`}>
                        {opt.name} ({opt.opportunity})
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Info Panel detailing current opportunity (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedOpportunity.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-2xl p-6 flex flex-col justify-between h-full space-y-6"
              >
                <div className="space-y-4">
                  {/* Category and Title */}
                  <div className="flex items-center justify-between border-b border-brand-blue/10 pb-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#0052FF] uppercase tracking-wider">
                        {selectedOpportunity.type}
                      </span>
                      <h3 className="text-xl font-bold text-primary tracking-tight mt-0.5">
                        {selectedOpportunity.name}
                      </h3>
                    </div>
                    <span className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 font-bold px-2.5 py-1 rounded-full uppercase">
                      {selectedOpportunity.opportunity}
                    </span>
                  </div>

                  {/* Problem Description */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingDown className="w-3.5 h-3.5 text-red-500" /> Perda Financeira Estimada
                    </span>
                    <p className="text-sm text-red-700 dark:text-red-200 bg-red-500/5 border border-red-500/15 p-3 rounded-xl leading-relaxed">
                      {selectedOpportunity.lossEstimate}
                    </p>
                  </div>

                  {/* Proposed tech upgrade */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">
                      Solução Proposta (Victor AI)
                    </span>
                    <p className="text-sm text-primary leading-relaxed font-semibold">
                      {selectedOpportunity.proposedSolution}
                    </p>
                    <p className="text-xs text-secondary italic leading-relaxed pt-1 border-t border-brand-blue/10">
                      {selectedOpportunity.details}
                    </p>
                  </div>
                </div>

                {/* Comission earnings box */}
                <div className="space-y-4 pt-4 border-t border-brand-blue/10">
                  <span className="text-[11px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-[#10B981]" /> Sua Comissão pelo Fechamento
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#10B981]/5 border border-[#10B981]/15 p-3 rounded-xl">
                      <span className="text-[9px] text-secondary uppercase font-bold tracking-wider">Única (Setup)</span>
                      <h4 className="text-xl font-black text-[#10B981] mt-0.5">
                        R$ {selectedOpportunity.commissionOneTime},00
                      </h4>
                    </div>

                    <div className="bg-[#0052FF]/5 border border-[#0052FF]/15 p-3 rounded-xl">
                      <span className="text-[9px] text-secondary uppercase font-bold tracking-wider">Recorrente Mensal</span>
                      <h4 className="text-xl font-black text-[#0052FF] mt-0.5">
                        {selectedOpportunity.commissionRecurring > 0 
                          ? `R$ ${selectedOpportunity.commissionRecurring},00` 
                          : "N/A"}
                      </h4>
                    </div>
                  </div>

                  {/* Trigger referral button */}
                  <button
                    onClick={handleIndicate}
                    className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-[#0052FF] to-blue-600 text-white font-bold text-sm hover:from-[#1E6BFF] hover:to-blue-500 transition-all flex items-center justify-center gap-2 group cursor-pointer shadow-lg shadow-blue-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-300 group-hover:scale-110 transition-transform" />
                    <span>Quero Indicar esta Empresa</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, MessageSquare, CheckSquare, Award, ShieldCheck } from "lucide-react";

export function Onboarding() {
  const [activeTab, setActiveTab] = useState<number>(0);

  const tutorials = [
    {
      title: "Como Identificar: Empresas Sem Site",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      steps: [
        "Acesse o Instagram de empresas locais (restaurantes, lojas, clínicas, profissionais liberais).",
        "Olhe a biografia (Bio). Ela não tem nenhum link ou usa apenas um link direto para o WhatsApp?",
        "Pesquise o nome da empresa no Google. Ela não possui um site próprio, profissional e rápido?",
        "Se a empresa atende apenas por WhatsApp ou direct, ela é um lead perfeito para um Site/Landing Page."
      ],
      tip: "Sites próprios dão credibilidade e aumentam as vendas em até 45% se comparados a links diretos de WhatsApp."
    },
    {
      title: "Como Identificar: Sem Google Meu Negócio",
      icon: MapPin,
      color: "text-red-500",
      bg: "bg-red-500/10",
      steps: [
        "Abra o Google e pesquise por termos genéricos na sua cidade (ex: 'dentista em franca', 'pizzaria em franca').",
        "Role até os resultados do Google Maps e clique em 'Mais lugares'.",
        "Procure por empresas que aparecem a partir da 2ª página ou com notas muito baixas e sem fotos.",
        "Essas empresas estão invisíveis para quem busca ativamente comprar na cidade."
      ],
      tip: "Estar no Top 3 do Google Maps atrai até 70% das ligações e rotas de clientes locais."
    },
    {
      title: "Como Identificar: Sem Automação / Resposta Lenta",
      icon: MessageSquare,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
      steps: [
        "Envie uma mensagem simples no WhatsApp ou direct da empresa fingindo ser um cliente interessado.",
        "Se eles demorarem mais de 15 minutos para responder, ou se o atendimento for confuso e manual, há um gargalo.",
        "Muitas empresas perdem clientes por não terem um robô de triagem ou um sistema para organizar os pedidos.",
        "Esse negócio precisa de um Chatbot de IA ou de uma Automação de WhatsApp."
      ],
      tip: "Respostas enviadas em menos de 5 minutos aumentam as chances de fechamento de venda em até 9 vezes."
    }
  ];

  return (
    <section id="onboarding" className="py-24 bg-brand-bg transition-colors duration-300 relative overflow-hidden border-t border-brand-blue/10">
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-full border border-brand-blue/15 flex items-center gap-1 w-max mx-auto">
            <Award className="w-3.5 h-3.5" /> Hub de Aprendizado & Onboarding
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-primary">
            Aprenda a Auditar uma Empresa em 2 Minutos
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            Preparamos um guia rápido para você (ou seus alunos) aprender a identificar exatamente qual tecnologia uma empresa local precisa para vender mais.
          </p>
        </div>

        {/* Interactive Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Tabs Navigation (4 cols) */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-none">
            {tutorials.map((tut, idx) => {
              const Icon = tut.icon;
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  className={`flex-1 min-w-[240px] lg:w-full text-left p-4 rounded-xl border transition-all duration-300 flex items-center gap-4 cursor-pointer focus:outline-none ${
                    isActive
                      ? "bg-brand-bg border-[#0052FF] shadow-[0_0_20px_rgba(0,82,255,0.15)] dark:bg-[#0B132B]"
                      : "bg-brand-bg/50 border-brand-blue/10 hover:border-brand-blue/20 hover:bg-brand-bg dark:bg-[#0B132B]/30"
                  }`}
                >
                  <div className={`p-2.5 rounded-lg ${tut.bg} ${tut.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-primary leading-tight">
                      {tut.title.split(":")[1].trim()}
                    </h4>
                    <span className="text-[10px] text-secondary">
                      Clique para ver o guia
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Tab Content Display (8 cols) */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="glass-panel rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full space-y-6"
              >
                <div className="space-y-6">
                  {/* Tutorial Title */}
                  <div className="flex items-center gap-3 border-b border-brand-blue/10 pb-4">
                    <div className={`p-3 rounded-xl ${tutorials[activeTab].bg} ${tutorials[activeTab].color}`}>
                      {(() => {
                        const Icon = tutorials[activeTab].icon;
                        return <Icon className="w-6 h-6" />;
                      })()}
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-primary">
                      {tutorials[activeTab].title}
                    </h3>
                  </div>

                  {/* Steps Checklist */}
                  <div className="space-y-4">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                      Checklist de Auditoria (Passo a Passo)
                    </span>
                    <ul className="space-y-3">
                      {tutorials[activeTab].steps.map((step, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-secondary">
                          <CheckSquare className="w-4 h-4 text-[#0052FF] mt-0.5 flex-shrink-0" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Tip Box */}
                <div className="bg-[#0052FF]/5 border border-brand-blue/15 p-4 rounded-xl flex items-start gap-3 mt-4">
                  <ShieldCheck className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-xs font-bold text-primary block uppercase tracking-wider">
                      Dica de Ouro de Venda
                    </span>
                    <p className="text-xs text-secondary mt-1 leading-relaxed">
                      {tutorials[activeTab].tip}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
}

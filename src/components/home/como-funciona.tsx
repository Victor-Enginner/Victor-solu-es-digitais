"use client";

import { motion } from "framer-motion";
import { Search, Presentation, ShieldCheck, DollarSign } from "lucide-react";

export function ComoFunciona() {
  const steps = [
    {
      num: "01",
      title: "Você Encontra as Empresas",
      description: "Identifique negócios perto de você que não têm site, não aparecem no Google ou demoram para responder no WhatsApp.",
      icon: Search,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20"
    },
    {
      num: "02",
      title: "Nós Apresentamos a Solução",
      description: "Você nos envia a indicação pelo formulário. Nossa equipe entra em contato com o dono e apresenta a proposta de tecnologia.",
      icon: Presentation,
      color: "text-[#0052FF]",
      bg: "bg-[#0052FF]/10",
      border: "border-[#0052FF]/20"
    },
    {
      num: "03",
      title: "Elas Evoluem Digitalmente",
      description: "Criamos a Landing Page, a automação de vendas ou a Inteligência Artificial sob medida. O cliente passa a vender mais.",
      icon: ShieldCheck,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
      border: "border-[#10B981]/20"
    },
    {
      num: "04",
      title: "Você Recebe a Comissão",
      description: "Assim que o contrato é fechado, você recebe sua comissão direto no Pix. Ganhos recorrentes todo mês.",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
      border: "border-emerald-400/20"
    }
  ];

  return (
    <section id="como-funciona" className="py-24 bg-brand-bg transition-colors duration-300 relative overflow-hidden border-t border-brand-blue/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-full border border-brand-blue/15">
            Fluxo de Trabalho Simples
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-primary">
            Como Funciona o Nosso Modelo de Negócio?
          </h2>
          <p className="text-secondary text-base sm:text-lg">
            Você não precisa saber programar, programar é o nosso trabalho. Sua única missão é conectar quem precisa de tecnologia com quem sabe criar.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          
          {/* Connector Line for Desktop */}
          <div className="hidden lg:block absolute top-1/2 left-4 right-4 h-0.5 bg-gradient-to-r from-blue-500/10 via-[#0052FF]/20 to-emerald-500/10 -translate-y-12 z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between relative z-10"
              >
                <div className="space-y-4">
                  {/* Icon & Step Number */}
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${step.bg} ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-4xl font-black font-display opacity-10 dark:opacity-20 text-primary select-none">
                      {step.num}
                    </span>
                  </div>

                  {/* Text Content */}
                  <h3 className="text-lg font-bold text-primary tracking-tight pt-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Micro indicator */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-secondary/40">
                  <span>Passo {step.num}</span>
                  <div className="flex-1 h-[1px] bg-brand-blue/10" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

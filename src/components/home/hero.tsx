"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, MapPin, Sparkles, Laptop, ShieldCheck, DollarSign, Bot, Globe } from "lucide-react";
import { TextScramble } from "../ui/text-scramble";

export function Hero() {
  const scrollToSimulator = () => {
    const element = document.getElementById("simulador");
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen pt-28 pb-16 flex items-center justify-center overflow-hidden cyber-grid bg-brand-bg transition-colors duration-300">
      {/* Decorative blurred lighting spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#0052FF]/10 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-100" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] sm:w-[450px] h-[300px] sm:h-[450px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none opacity-50 dark:opacity-100" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 text-left space-y-6">
            
            {/* OPORTUNIDADE Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0052FF]/10 border border-[#0052FF]/20 text-primary font-medium text-xs tracking-wider uppercase"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0052FF] animate-pulse" />
              <span>Oportunidade de Trabalho Remoto</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold tracking-tight leading-[1.1] font-display text-primary"
            >
              SEU TRABALHO É <span className="text-[#0052FF]">ENCONTRAR EMPRESAS</span>.<br />
              O NOSSO É CONSTRUIR{" "}
              <span className="border-b-2 border-[#0052FF] inline-block min-w-[210px] sm:min-w-[280px] text-gradient-blue font-mono">
                <TextScramble text="TECNOLOGIA" />
              </span>
              .
            </motion.h1>

            {/* Paragraph Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg text-secondary max-w-2xl font-sans"
            >
              Indique negócios locais que precisam evoluir digitalmente (sem site, sem automação de WhatsApp ou sem presença digital). Nós fazemos a venda, criamos a tecnologia e <strong>você recebe comissões recorrentes</strong>.
            </motion.p>

            {/* Process Checklist (From image) */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-2 gap-4 border-y border-brand-blue/10 py-5 my-2"
            >
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-[#0052FF]/10 text-[#0052FF] mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">Você encontra</h4>
                  <p className="text-xs text-secondary">empresas que precisam de tecnologia.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-[#0052FF]/10 text-[#0052FF] mt-0.5">
                  <Laptop className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">Nós apresentamos</h4>
                  <p className="text-xs text-secondary">a solução ideal para o cliente.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-[#10B981]/10 text-[#10B981] mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">Elas evoluem</h4>
                  <p className="text-xs text-secondary">passando a vender muito mais.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-md bg-[#10B981]/10 text-[#10B981] mt-0.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primary">Você recebe</h4>
                  <p className="text-xs text-secondary">comissão a cada negócio fechado.</p>
                </div>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <button
                onClick={scrollToSimulator}
                className="relative group overflow-hidden px-8 py-4 rounded-xl bg-[#0052FF] text-white font-bold text-base hover:bg-[#1E6BFF] transition-all shadow-[0_0_30px_rgba(0,82,255,0.25)] hover:shadow-[0_0_35px_rgba(0,82,255,0.45)] cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Simular Ganhos</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <a
                href="https://wa.me/5516982141822?text=Ol%C3%A1%20Victor,%20gostaria%20de%20saber%20mais%20sobre%20como%20trabalhar%20prospectando%20empresas%20de%20casa!"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 rounded-xl bg-transparent border border-brand-blue/20 text-primary font-bold text-base hover:bg-brand-blue/5 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-[#10B981]" />
                <span>Chamar no WhatsApp</span>
              </a>
            </motion.div>

            {/* Local & Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex items-center gap-6 text-xs text-secondary pt-2"
            >
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#0052FF]" /> Foco em Franca, SP & Região (Expansão Nacional)
              </span>
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-[#10B981]" /> 100% Home Office / Flexível
              </span>
            </motion.div>
          </div>

          {/* Right Visual Column (Interactive Laptop & Dashboard) */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full max-w-[480px] lg:max-w-none relative group"
            >
              {/* Laptop screen glow */}
              <div className="absolute inset-0 bg-[#0052FF]/20 rounded-full blur-[80px] opacity-40 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* LAPTOP CONTAINER */}
              <div className="relative z-10 w-full">
                {/* Screen frame */}
                <div className="border-[8px] border-[#1e293b] rounded-t-2xl bg-black overflow-hidden shadow-2xl aspect-[16/10] relative">
                  
                  {/* Screen Content - Dashboard Mock (matches image 2) */}
                  <div className="w-full h-full bg-[#030712] p-3 text-white flex flex-col font-sans select-none overflow-hidden relative">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <span className="text-[9px] text-[#9CA3AF] font-mono tracking-wider">victor.ai/partner-panel</span>
                      <div className="w-4 h-4 rounded bg-white/5" />
                    </div>

                    {/* Dashboard grid inside screen */}
                    <div className="grid grid-cols-2 gap-2 flex-1 min-h-0">
                      
                      {/* Metric 1 */}
                      <div className="bg-[#0B132B]/60 p-2 rounded-lg flex flex-col justify-between border border-white/5">
                        <div>
                          <span className="text-[8px] text-[#9CA3AF] uppercase font-bold tracking-wider">Resumo de Projetos</span>
                          <h3 className="text-xl font-bold text-white mt-0.5">23</h3>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-[#10B981] font-semibold mt-1">
                          <span>+28% este mês</span>
                        </div>
                      </div>

                      {/* Metric 2 */}
                      <div className="bg-[#0B132B]/60 p-2 rounded-lg flex flex-col justify-between border border-white/5">
                        <div>
                          <span className="text-[8px] text-[#9CA3AF] uppercase font-bold tracking-wider">Clientes Atendidos</span>
                          <h3 className="text-xl font-bold text-[#0052FF] mt-0.5">18</h3>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] text-[#10B981] font-semibold mt-1">
                          <span>+35% este mês</span>
                        </div>
                      </div>

                      {/* Solutions list inside screen */}
                      <div className="col-span-2 bg-[#0B132B]/60 p-2 rounded-lg flex flex-col justify-center gap-1.5 border border-white/5 min-h-0 overflow-hidden">
                        <span className="text-[8px] text-[#9CA3AF] uppercase font-bold tracking-wider mb-0.5 block">Nossos Serviços Vendidos</span>
                        <div className="grid grid-cols-2 gap-1 text-[9px]">
                          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-1 rounded">
                            <Laptop className="w-3 h-3 text-[#0052FF]" />
                            <span className="truncate">Landing Pages</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-1 rounded">
                            <MessageSquare className="w-3 h-3 text-[#10B981]" />
                            <span className="truncate">Automação Zap</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-1 rounded">
                            <Laptop className="w-3 h-3 text-[#0052FF]" />
                            <span className="truncate">Sistemas Web</span>
                          </div>
                          <div className="flex items-center gap-1 bg-white/5 px-1.5 py-1 rounded">
                            <Bot className="w-3 h-3 text-purple-400" />
                            <span className="truncate">Chatbots IA</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keyboard Base */}
                <div className="h-[12px] bg-[#334155] rounded-b-xl border-t border-white/10 relative">
                  {/* Laptop hinge notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-[#1e293b]" />
                </div>
                {/* Desktop laptop reflection reflection */}
                <div className="h-[2px] w-[92%] mx-auto bg-white/10 opacity-30 blur-[1px] mt-0.5" />
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}

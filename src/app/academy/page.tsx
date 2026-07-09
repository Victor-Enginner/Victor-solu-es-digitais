"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../../components/ui/logo";
import { 
  ArrowLeft, Search, Copy, Check, Sparkles, 
  MessageSquare, HelpCircle, GraduationCap, Video, BookOpen 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LessonScript {
  title: string;
  niche: string;
  problem: string;
  pitch: string;
  scriptText: string;
  youtubeId?: string; // placeholder
}

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const lessons: LessonScript[] = [
    {
      title: "Hamburguerias: Abordagem para Delivery Próprio",
      niche: "Alimentação (Restaurantes, Pizzarias, Hamburguerias)",
      problem: "Sem Site e pagando taxas altas (27%+) em aplicativos de delivery",
      pitch: "Apresentar a economia instantânea de taxas ao usar um cardápio digital próprio integrado ao WhatsApp.",
      scriptText: "Olá, tudo bem?\n\nEstava olhando o Instagram de vocês e vi que os hambúrgueres parecem deliciosos! 🍔\n\nNotei que para fazer pedidos vocês direcionam direto para o WhatsApp manual ou usam aplicativos de terceiros que cobram taxas por pedido. Vocês já calcularam quanto deixam de lucro nesses aplicativos por mês?\n\nNós desenvolvemos cardápios digitais integrados ao WhatsApp que automatizam o pedido e não cobram comissão sobre as vendas. A pizzaria X aqui na região economizou mais de R$ 2.000 de taxas no primeiro mês.\n\nSe eu te enviar um relatório demonstrativo de 1 minuto de como ficaria o cardápio e a economia de vocês, você daria uma olhada?",
      youtubeId: "vid1"
    },
    {
      title: "Clínicas Médicas: Otimização de SEO no Google Maps",
      niche: "Saúde e Estética (Dentistas, Fisioterapeutas, Clínicas)",
      problem: "Sem ficha no Google Maps ou mal ranqueada (invisível nas pesquisas)",
      pitch: "Mostrar a perda de novos pacientes que pesquisam diariamente por profissionais locais no Google.",
      scriptText: "Olá, tudo bem?\n\nEstava pesquisando por consultórios de especialidade na região de Franca no Google e notei que a clínica de vocês não aparece na primeira página do mapa local. 🏥\n\nHoje em dia, a maioria das pessoas busca no Google antes de agendar uma consulta. Clínicas que estão no Top 3 do mapa recebem até 70% mais ligações e agendamentos diretos de novos pacientes.\n\nFizemos uma auditoria de posicionamento gratuita da clínica de vocês detalhando o que está impedindo vocês de aparecer no topo e como resolver isso.\n\nPosso te enviar esse PDF explicativo sem compromisso?",
      youtubeId: "vid2"
    },
    {
      title: "Lojas de Roupas: Atendimento Rápido e Chatbot de IA",
      niche: "Varejo e Moda (Lojas, Boutiques, Calçados)",
      problem: "Atraso no atendimento por Direct/WhatsApp e perda de vendas fora do expediente",
      pitch: "Oferecer triagem automatizada com inteligência artificial para responder dúvidas de catálogo 24/7.",
      scriptText: "Olá, tudo bem?\n\nSou consultor da agência Victor AI e notei que vocês têm peças lindas postadas no feed! 👗\n\nFiz um teste de resposta no Direct ontem à noite simulando uma compra e notei que muitas lojas acabam demorando algumas horas para responder sobre tamanhos, valores e estoque por conta da alta demanda manual. Estudos mostram que responder o cliente em menos de 5 minutos aumenta as vendas em até 9 vezes.\n\nNós criamos atendentes virtuais inteligentes no WhatsApp que respondem sobre estoque, frete e finalizam o pedido na hora, 24 horas por dia.\n\nGostaria de ver uma demonstração de 30 segundos no celular de como o robô atende de forma humana?",
      youtubeId: "vid3"
    },
    {
      title: "Contornando Objeções: 'Não tenho verba no momento'",
      niche: "Todos os nichos de negócios locais",
      problem: "O cliente demonstra interesse, mas alega falta de recursos financeiros",
      pitch: "Transformar a tecnologia em um investimento de retorno garantido (ROI) e não em custo.",
      scriptText: "Entendo perfeitamente, o caixa da empresa é sagrado. 💸\n\nMas deixa eu te fazer uma pergunta rápida: se nós colocarmos essa Landing Page no ar e ela te trouxer apenas 3 novos clientes no mês, o valor da comissão deles já não pagaria o investimento?\n\nNós não vendemos apenas um site, nós instalamos um gerador de novos negócios. Se continuarem sem site, a verba continuará curta porque os clientes continuarão indo para a concorrência que está visível no Google.\n\nPodemos fazer um parcelamento facilitado no boleto para que o próprio resultado das primeiras semanas pague o restante. O que acha de fazermos um teste?",
      youtubeId: "vid4"
    }
  ];

  const handleCopyScript = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-brand-bg text-primary transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#0052FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[300px] h-[300px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        
        {/* Navigation Top */}
        <div className="flex items-center justify-between">
          <Link 
            href="/dashboard" 
            className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para o Painel</span>
          </Link>
          <Logo />
        </div>

        {/* Intro Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3 py-6">
          <span className="text-xs font-bold uppercase tracking-widest text-[#0052FF] bg-[#0052FF]/10 px-3.5 py-1 rounded-full border border-brand-blue/15 flex items-center gap-1.5 w-max mx-auto">
            <GraduationCap className="w-4 h-4 text-[#0052FF]" />
            Escola de Negócios Victor AI
          </span>
          <h1 className="text-3xl font-black font-display tracking-tight text-primary">
            Manual de Prospecção & Scripts
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Aprenda a abordagem perfeita para cada nicho. Copie os roteiros testados abaixo, envie para os empresários locais e cadastre suas indicações.
          </p>
        </div>

        {/* Lesson Tabs Selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {lessons.map((lesson, idx) => {
            const isActive = activeTab === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`py-3 px-4 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer truncate ${
                  isActive
                    ? "bg-[#0052FF] border-[#0052FF] text-white shadow-md shadow-blue-500/20"
                    : "bg-brand-bg/50 border-brand-blue/10 text-secondary hover:text-primary hover:border-brand-blue/35"
                }`}
                title={lesson.title}
              >
                {lesson.title.split(":")[0]}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
          >
            {/* Left Script Display (7 cols) */}
            <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-brand-blue/10 pb-4">
                  <BookOpen className="w-5 h-5 text-[#0052FF]" />
                  <h3 className="text-base sm:text-lg font-bold text-primary">
                    {lessons[activeTab].title}
                  </h3>
                </div>

                {/* Info summary */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Nicho</span>
                    <p className="text-primary font-semibold">{lessons[activeTab].niche}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Problema</span>
                    <p className="text-primary font-semibold">{lessons[activeTab].problem}</p>
                  </div>
                  <div className="col-span-2 space-y-1 border-t border-brand-blue/5 pt-3">
                    <span className="text-secondary font-bold uppercase tracking-wider text-[10px]">Estratégia de Abordagem</span>
                    <p className="text-primary font-semibold">{lessons[activeTab].pitch}</p>
                  </div>
                </div>

                {/* Script Code Block */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">Script de Abordagem (Copia e Cola)</span>
                  <div className="bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl p-4 text-xs text-primary font-mono whitespace-pre-line leading-relaxed relative max-h-[250px] overflow-y-auto select-all">
                    {lessons[activeTab].scriptText}
                  </div>
                </div>
              </div>

              {/* Copy action */}
              <button
                onClick={() => handleCopyScript(lessons[activeTab].scriptText, activeTab)}
                className="w-full py-3.5 rounded-xl bg-brand-blue hover:bg-brand-blue-hover text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {copiedIndex === activeTab ? (
                  <>
                    <Check className="w-4.5 h-4.5 text-green-300" />
                    <span>Copiado para Área de Transferência!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4.5 h-4.5" />
                    <span>Copiar Roteiro de Texto</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Video Placeholder (4 cols) */}
            <div className="lg:col-span-4 glass-panel p-6 rounded-2xl flex flex-col justify-between h-full space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#10B981]" />
                  <h4 className="text-sm font-bold text-primary">Videoaula Rápida</h4>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  Assista a uma simulação prática de 2 minutos sobre como usar este script no dia a dia para quebrar resistências e conseguir o WhatsApp do dono da empresa.
                </p>
              </div>

              {/* Video Player Display Mock */}
              <div className="relative aspect-[16/10] bg-[#070b19] border border-brand-blue/15 rounded-xl overflow-hidden flex items-center justify-center group cursor-pointer">
                {/* Play Button Node */}
                <div className="w-12 h-12 rounded-full bg-brand-blue/90 border border-white/20 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110 z-10">
                  <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-[14px] border-l-white ml-1" />
                </div>
                {/* Visual Cover */}
                <div className="absolute inset-0 bg-[#0052FF]/10 mix-blend-overlay group-hover:opacity-40 transition-opacity" />
                <span className="absolute bottom-2 left-3 text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">Módulo {activeTab + 1} • 02:15</span>
              </div>

              <div className="text-[10px] text-secondary italic text-center border-t border-brand-blue/5 pt-4">
                💡 Alunos da Uni-FACEF possuem suporte prioritário para tirar dúvidas comerciais.
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </main>
  );
}

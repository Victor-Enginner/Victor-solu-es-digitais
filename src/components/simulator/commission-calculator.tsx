"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { DollarSign, ShieldAlert, Sparkles, TrendingUp, ArrowRight } from "lucide-react";

export function CommissionCalculator() {
  const [mounted, setMounted] = useState(false);

  // Sliders values
  const [sites, setSites] = useState(2);
  const [automations, setAutomations] = useState(1);
  const [systems, setSystems] = useState(0);
  const [chatbots, setChatbots] = useState(1);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pricing constants (referral commission)
  const SITE_ONETIME = 400;
  const SITE_RECURRING = 80;

  const AUTO_ONETIME = 500;
  const AUTO_RECURRING = 100;

  const SYSTEM_ONETIME = 800;
  const SYSTEM_RECURRING = 150;

  const CHATBOT_ONETIME = 1000;
  const CHATBOT_RECURRING = 200;

  // Calculate totals
  const totalOneTime = 
    sites * SITE_ONETIME + 
    automations * AUTO_ONETIME + 
    systems * SYSTEM_ONETIME + 
    chatbots * CHATBOT_ONETIME;

  const totalRecurring = 
    sites * SITE_RECURRING + 
    automations * AUTO_RECURRING + 
    systems * SYSTEM_RECURRING + 
    chatbots * CHATBOT_RECURRING;

  // Calculate cumulative recurring growth over 6 months
  const chartData = Array.from({ length: 6 }, (_, i) => {
    const monthNum = i + 1;
    return {
      name: `Mês ${monthNum}`,
      Recorrente: totalRecurring * monthNum,
      Setup: totalOneTime,
    };
  });

  const handleIndicateNow = () => {
    const element = document.getElementById("prospeccao");
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section id="servicos" className="py-24 bg-brand-bg transition-colors duration-300 relative overflow-hidden border-t border-brand-blue/10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-blue/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-full border border-[#0052FF]/15">
            Calculadora de Rendimentos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display text-primary">
            Simule Quanto Você Pode Ganhar por Mês
          </h2>
          <p className="text-secondary text-sm sm:text-base">
            Arrasta os sliders abaixo baseando-se em quantas empresas você acredita que consegue indicar e fechar contrato no mês. Veja a força do ganho recorrente acumulado.
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Sliders Container (6 cols) */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            
            {/* Sites / Landing Pages Slider */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-primary">Sites & Landing Pages</h4>
                  <p className="text-xs text-secondary">Para empresas locais sem site ou desatualizados</p>
                </div>
                <span className="text-2xl font-black font-display text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-lg">
                  {sites}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={sites}
                onChange={(e) => setSites(parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-blue/15 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
              />
              <div className="flex justify-between text-[10px] text-secondary font-semibold">
                <span>Comissão Setup: R$ {SITE_ONETIME}</span>
                <span>Recorrência: R$ {SITE_RECURRING}/mês</span>
              </div>
            </div>

            {/* Automations Slider */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-primary">Automações de WhatsApp</h4>
                  <p className="text-xs text-secondary">Triagem automática e funis de vendas inteligentes</p>
                </div>
                <span className="text-2xl font-black font-display text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-lg">
                  {automations}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={automations}
                onChange={(e) => setAutomations(parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-blue/15 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
              />
              <div className="flex justify-between text-[10px] text-secondary font-semibold">
                <span>Comissão Setup: R$ {AUTO_ONETIME}</span>
                <span>Recorrência: R$ {AUTO_RECURRING}/mês</span>
              </div>
            </div>

            {/* Systems / Dashboards Slider */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-primary">Sistemas Web & Dashboards</h4>
                  <p className="text-xs text-secondary">Para controle de estoque, agendamento e clientes</p>
                </div>
                <span className="text-2xl font-black font-display text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-lg">
                  {systems}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={systems}
                onChange={(e) => setSystems(parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-blue/15 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
              />
              <div className="flex justify-between text-[10px] text-secondary font-semibold">
                <span>Comissão Setup: R$ {SYSTEM_ONETIME}</span>
                <span>Recorrência: R$ {SYSTEM_RECURRING}/mês</span>
              </div>
            </div>

            {/* AI Chatbots Slider */}
            <div className="glass-panel p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-bold text-primary">Agentes de Inteligência Artificial</h4>
                  <p className="text-xs text-secondary">IA customizada para atendimento ou automação interna</p>
                </div>
                <span className="text-2xl font-black font-display text-[#0052FF] bg-[#0052FF]/10 px-3 py-1 rounded-lg">
                  {chatbots}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={chatbots}
                onChange={(e) => setChatbots(parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-blue/15 rounded-lg appearance-none cursor-pointer accent-[#0052FF]"
              />
              <div className="flex justify-between text-[10px] text-secondary font-semibold">
                <span>Comissão Setup: R$ {CHATBOT_ONETIME}</span>
                <span>Recorrência: R$ {CHATBOT_RECURRING}/mês</span>
              </div>
            </div>

          </div>

          {/* Results & Chart Container (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            
            {/* Totals Summary */}
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-panel p-5 rounded-2xl bg-[#0052FF]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5">
                  <DollarSign className="w-12 h-12 text-[#0052FF]" />
                </div>
                <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Ganhos Imediatos (Setup)</span>
                <h3 className="text-2xl sm:text-3xl font-black text-primary mt-1">
                  R$ {totalOneTime.toLocaleString("pt-BR")},00
                </h3>
                <p className="text-[10px] text-secondary mt-1.5">Pago via Pix no fechamento</p>
              </div>

              <div className="glass-panel p-5 rounded-2xl bg-[#10B981]/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-5">
                  <TrendingUp className="w-12 h-12 text-[#10B981]" />
                </div>
                <span className="text-[10px] text-secondary uppercase font-bold tracking-wider block">Recorrência Mensal</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#10B981] mt-1">
                  R$ {totalRecurring.toLocaleString("pt-BR")},00/mês
                </h3>
                <p className="text-[10px] text-secondary mt-1.5">Renda passiva acumulada</p>
              </div>
            </div>

            {/* Recharts Graphical accumulation (only client side) */}
            <div className="glass-panel p-6 rounded-2xl flex-1 flex flex-col justify-between min-h-[250px]">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Crescimento Acumulado (6 Meses)</h4>
                  <p className="text-[10px] text-secondary">Mantendo a quantidade de indicações ativas</p>
                </div>
                <span className="text-[10px] text-[#10B981] bg-[#10B981]/15 px-2.5 py-0.5 rounded border border-[#10B981]/20 font-bold uppercase">
                  Efeito Bola de Neve
                </span>
              </div>

              <div className="flex-1 w-full h-[180px] text-[10px]">
                {mounted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--grid-color)" />
                      <XAxis dataKey="name" stroke="var(--text-secondary)" tickLine={false} />
                      <YAxis stroke="var(--text-secondary)" tickLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: "var(--background)", 
                          borderColor: "var(--card-border)",
                          borderRadius: "8px",
                          color: "var(--text-primary)"
                        }} 
                      />
                      <Bar dataKey="Recorrente" fill="#10B981" radius={[4, 4, 0, 0]} name="Recorrência Acumulada (R$)" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-secondary italic">
                    Carregando simulação...
                  </div>
                )}
              </div>

              <div className="border-t border-brand-blue/15 pt-4 mt-2 flex items-center justify-between">
                <span className="text-[10px] text-secondary flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-yellow-500" /> Simulação baseada em contratos ativos.
                </span>
                <button
                  onClick={handleIndicateNow}
                  className="text-xs font-bold text-primary hover:text-[#0052FF] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  Indicar Agora <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

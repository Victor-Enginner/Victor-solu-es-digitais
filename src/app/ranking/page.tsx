"use client";

import { useState } from "react";
import Link from "next/link";
import { Logo } from "../../components/ui/logo";
import { ArrowLeft, Award, Trophy, Users, DollarSign, Calendar, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

interface RankEntry {
  position: number;
  name: string;
  institution: string;
  closedLeads: number;
  totalEarnings: number;
  avatarInitials: string;
}

export default function RankingPage() {
  const [activeTab, setActiveTab] = useState<"monthly" | "allTime">("monthly");

  const monthlyRankings: RankEntry[] = [
    { position: 1, name: "Gabriel Souza", institution: "Uni-FACEF (Franca)", closedLeads: 8, totalEarnings: 3850, avatarInitials: "GS" },
    { position: 2, name: "Mariana Alvez", institution: "Unesp (Franca)", closedLeads: 6, totalEarnings: 2900, avatarInitials: "MA" },
    { position: 3, name: "Rodrigo Lima", institution: "FDF (Franca)", closedLeads: 5, totalEarnings: 2450, avatarInitials: "RL" },
    { position: 4, name: "Beatriz Mota", institution: "Uni-FACEF (Franca)", closedLeads: 4, totalEarnings: 1800, avatarInitials: "BM" },
    { position: 5, name: "Thiago Pires", institution: "FATEC (Franca)", closedLeads: 3, totalEarnings: 1350, avatarInitials: "TP" }
  ];

  const allTimeRankings: RankEntry[] = [
    { position: 1, name: "Gabriel Souza", institution: "Uni-FACEF (Franca)", closedLeads: 24, totalEarnings: 11400, avatarInitials: "GS" },
    { position: 2, name: "Rodrigo Lima", institution: "FDF (Franca)", closedLeads: 18, totalEarnings: 8900, avatarInitials: "RL" },
    { position: 3, name: "Mariana Alvez", institution: "Unesp (Franca)", closedLeads: 15, totalEarnings: 7450, avatarInitials: "MA" },
    { position: 4, name: "Lucas Carvalho", institution: "USP (Ribeirão)", closedLeads: 12, totalEarnings: 5900, avatarInitials: "LC" },
    { position: 5, name: "Beatriz Mota", institution: "Uni-FACEF (Franca)", closedLeads: 9, totalEarnings: 4200, avatarInitials: "BM" }
  ];

  const currentRankings = activeTab === "monthly" ? monthlyRankings : allTimeRankings;

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
            <Trophy className="w-4 h-4 text-yellow-500 animate-bounce" />
            Leaderboard Geral de Parceiros
          </span>
          <h1 className="text-3xl font-black font-display tracking-tight text-primary">
            Ranking de Resultados Pix
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            Veja quais alunos de Franca-SP e do Brasil estão faturando mais alto e dominando o mercado de indicações digitais este mês!
          </p>
        </div>

        {/* Period Selector Tabs */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`py-2 px-6 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              activeTab === "monthly"
                ? "bg-[#0052FF] border-[#0052FF] text-white shadow-md shadow-blue-500/20"
                : "bg-brand-bg/50 border-brand-blue/10 text-secondary hover:text-primary hover:border-brand-blue/30"
            }`}
          >
            Faturamento do Mês
          </button>
          <button
            onClick={() => setActiveTab("allTime")}
            className={`py-2 px-6 rounded-full border text-xs font-bold transition-all cursor-pointer ${
              activeTab === "allTime"
                ? "bg-[#0052FF] border-[#0052FF] text-white shadow-md shadow-blue-500/20"
                : "bg-brand-bg/50 border-brand-blue/10 text-secondary hover:text-primary hover:border-brand-blue/30"
            }`}
          >
            Faturamento Geral (Histórico)
          </button>
        </div>

        {/* Podium Row (First 3 Positions) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-6">
          
          {/* Podium 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-between text-center relative order-2 md:order-1 h-[240px] md:h-[220px]"
          >
            <div className="absolute top-0 right-0 p-3">
              <span className="text-3xl font-black font-display text-slate-400 opacity-20">#2</span>
            </div>
            <div className="space-y-2 mt-4">
              <div className="w-12 h-12 rounded-full bg-slate-500/20 text-slate-500 flex items-center justify-center font-bold text-lg border-2 border-slate-400 mx-auto">
                {currentRankings[1]?.avatarInitials}
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">{currentRankings[1]?.name}</h3>
              <p className="text-[10px] text-secondary">{currentRankings[1]?.institution}</p>
            </div>
            <div className="bg-brand-blue/5 border border-brand-blue/10 py-1.5 px-4 rounded-xl mt-3">
              <span className="text-xs text-[#0052FF] font-black">R$ {currentRankings[1]?.totalEarnings.toLocaleString("pt-BR")},00</span>
            </div>
          </motion.div>

          {/* Podium 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-between text-center relative border-yellow-500/30 bg-yellow-500/5 order-1 md:order-2 h-[260px] md:h-[250px] shadow-xl shadow-yellow-500/5"
          >
            <div className="absolute top-0 right-0 p-3">
              <Trophy className="w-7 h-7 text-yellow-500" />
            </div>
            <div className="space-y-2 mt-4">
              <div className="w-14 h-14 rounded-full bg-yellow-500/20 text-yellow-600 flex items-center justify-center font-black text-xl border-2 border-yellow-500 mx-auto shadow-md">
                {currentRankings[0]?.avatarInitials}
              </div>
              <h3 className="font-black text-primary text-lg leading-tight">{currentRankings[0]?.name}</h3>
              <p className="text-xs text-secondary">{currentRankings[0]?.institution}</p>
            </div>
            <div className="bg-yellow-500/20 border border-yellow-500/30 py-2 px-6 rounded-xl mt-3">
              <span className="text-sm text-yellow-600 dark:text-yellow-400 font-black">R$ {currentRankings[0]?.totalEarnings.toLocaleString("pt-BR")},00</span>
            </div>
          </motion.div>

          {/* Podium 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-between text-center relative order-3 h-[220px] md:h-[200px]"
          >
            <div className="absolute top-0 right-0 p-3">
              <span className="text-3xl font-black font-display text-amber-700 opacity-20">#3</span>
            </div>
            <div className="space-y-2 mt-4">
              <div className="w-12 h-12 rounded-full bg-amber-700/20 text-amber-700 flex items-center justify-center font-bold text-lg border-2 border-amber-600 mx-auto">
                {currentRankings[2]?.avatarInitials}
              </div>
              <h3 className="font-bold text-primary text-base leading-tight">{currentRankings[2]?.name}</h3>
              <p className="text-[10px] text-secondary">{currentRankings[2]?.institution}</p>
            </div>
            <div className="bg-brand-blue/5 border border-brand-blue/10 py-1.5 px-4 rounded-xl mt-3">
              <span className="text-xs text-[#0052FF] font-black">R$ {currentRankings[2]?.totalEarnings.toLocaleString("pt-BR")},00</span>
            </div>
          </motion.div>

        </div>

        {/* General Leaderboard Table Card */}
        <div className="glass-panel rounded-2xl overflow-hidden border border-brand-blue/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-brand-blue/10 bg-brand-bg/50 text-secondary uppercase font-bold tracking-wider">
                  <th className="px-6 py-4 w-16">Pos</th>
                  <th className="px-6 py-4">Nome do Consultor</th>
                  <th className="px-6 py-4">Instituição de Ensino</th>
                  <th className="px-6 py-4 text-center">Leads Convertidos</th>
                  <th className="px-6 py-4 text-right">Ganhos Totais</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-blue/5">
                {currentRankings.map((rank) => (
                  <tr key={rank.position} className="hover:bg-brand-blue/5 transition-colors">
                    
                    {/* Position */}
                    <td className="px-6 py-4">
                      <span className={`font-black text-sm flex items-center justify-center w-6 h-6 rounded-full ${
                        rank.position === 1 ? "bg-yellow-500/25 text-yellow-600" :
                        rank.position === 2 ? "bg-slate-400/25 text-slate-500" :
                        rank.position === 3 ? "bg-amber-600/25 text-amber-700" : "text-secondary"
                      }`}>
                        {rank.position}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4 font-bold text-primary text-sm">
                      {rank.name}
                    </td>

                    {/* Institution */}
                    <td className="px-6 py-4 text-secondary">
                      {rank.institution}
                    </td>

                    {/* Leads Closed */}
                    <td className="px-6 py-4 text-center font-bold text-primary">
                      {rank.closedLeads}
                    </td>

                    {/* Payout */}
                    <td className="px-6 py-4 text-right font-black text-[#10B981] text-sm">
                      R$ {rank.totalEarnings.toLocaleString("pt-BR")},00
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}

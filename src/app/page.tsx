"use client";

import { Header } from "@/components/home/header";
import { Hero } from "@/components/home/hero";
import { ComoFunciona } from "@/components/home/como-funciona";
import { ProspectSimulator } from "@/components/simulator/prospect-simulator";
import { CommissionCalculator } from "@/components/simulator/commission-calculator";
import { Onboarding } from "@/components/home/onboarding";
import { Prospeccao } from "@/components/home/prospeccao";
import { Footer } from "@/components/home/footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ComoFunciona />
        <ProspectSimulator />
        <CommissionCalculator />
        <Onboarding />
        <Prospeccao />
      </main>
      <Footer />
    </div>
  );
}

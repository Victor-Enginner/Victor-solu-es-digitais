import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "./logo";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-brand-bg text-primary transition-colors duration-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Voltar para a Página Inicial</span>
          </Link>
          <Logo />
        </div>

        <header className="space-y-2 border-l-4 border-brand-blue pl-4">
          <h1 className="text-3xl font-black font-display tracking-tight">{title}</h1>
          <p className="text-xs text-secondary">Última atualização: {updated}</p>
        </header>

        <div className="space-y-6 text-sm leading-relaxed text-secondary [&_h2]:text-primary [&_h2]:text-base [&_h2]:font-bold [&_h2]:mb-2 [&_strong]:text-primary [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1">
          {children}
        </div>
      </div>
    </main>
  );
}

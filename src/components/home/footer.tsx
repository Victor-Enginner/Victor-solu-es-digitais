import React from "react";
import { Logo } from "../ui/logo";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

// Inline brand SVGs to replace removed Lucide brand icons
const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function Footer() {
  return (
    <footer className="bg-brand-bg transition-colors duration-300 border-t border-brand-blue/10 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Logo & Tagline */}
          <div className="md:col-span-2 space-y-4">
            <Logo />
            <p className="text-xs text-text-secondary max-w-sm leading-relaxed">
              Transformando empresas físicas em potências digitais através de desenvolvimento web sob medida, automações inteligentes de WhatsApp e agentes de Inteligência Artificial.
            </p>
          </div>

          {/* Col 2: Contatos */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-text-primary uppercase tracking-widest">Contato Comercial</h5>
            <ul className="space-y-2 text-xs text-text-secondary">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0052FF]" />
                <span>contato@victorai.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0052FF]" />
                <span>(16) 98214-1822</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0052FF]" />
                <span>Franca - SP | Brasil</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Redes Sociais */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-text-primary uppercase tracking-widest">Redes & Links</h5>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-brand-bg border border-brand-blue/10 text-text-secondary hover:text-[#0052FF] hover:border-[#0052FF] transition-all">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-brand-bg border border-brand-blue/10 text-text-secondary hover:text-[#0052FF] hover:border-[#0052FF] transition-all">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="https://wa.me/5516982141822" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-brand-bg border border-brand-blue/10 text-text-secondary hover:text-[#10B981] hover:border-[#10B981] transition-all">
                <MessageSquare className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[10px] text-text-secondary/50 leading-normal pt-1">
              Desenvolvido em parceria com a Victor AI Engineer.
            </p>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-brand-blue/10 pt-8 text-center flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-text-secondary">
            © {new Date().getFullYear()} Victor AI Engineer - Soluções Digitais. Todos os direitos reservados.
          </p>
          <div className="flex gap-4 text-[10px] text-text-secondary">
            <a href="#" className="hover:text-text-primary transition-colors">Termos de Uso</a>
            <span>•</span>
            <a href="#" className="hover:text-text-primary transition-colors">Políticas de Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

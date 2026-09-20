import React from "react";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { CONTACT_EMAIL, CONTACT_WHATSAPP_DISPLAY, whatsappLink } from "../../lib/site-config";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";

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
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-text-primary transition-colors">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#0052FF]" />
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">{CONTACT_WHATSAPP_DISPLAY}</a>
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
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" aria-label="Chamar no WhatsApp" className="p-2 rounded-lg bg-brand-bg border border-brand-blue/10 text-text-secondary hover:text-[#10B981] hover:border-[#10B981] transition-all">
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
            <Link href="/termos" className="hover:text-text-primary transition-colors">Termos de Uso</Link>
            <span>•</span>
            <Link href="/privacidade" className="hover:text-text-primary transition-colors">Política de Privacidade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

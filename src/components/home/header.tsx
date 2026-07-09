"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "../ui/logo";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, ArrowUpRight, Sun, Moon, User } from "lucide-react";

export function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Sync initial theme
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setTheme("light");
    }
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-brand-bg/85 backdrop-blur-md border-b border-brand-blue/10 py-3 shadow-md"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex-shrink-0 cursor-pointer focus:outline-none"
          >
            <Logo />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("como-funciona")}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Como Funciona
            </button>
            <button
              onClick={() => scrollToSection("simulador")}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Simulador
            </button>
            <button
              onClick={() => scrollToSection("servicos")}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Nossas Soluções
            </button>
            <button
              onClick={() => scrollToSection("prospeccao")}
              className="text-sm font-medium text-secondary hover:text-primary transition-colors cursor-pointer"
            >
              Quero Trabalhar
            </button>
          </nav>

          {/* Action CTA & Theme Switcher */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-brand-blue/10 hover:border-brand-blue/30 text-secondary hover:text-primary transition-all cursor-pointer bg-brand-bg/50"
              title={theme === "light" ? "Ativar Modo Escuro" : "Ativar Modo Claro"}
            >
              {theme === "light" ? <Moon className="w-4.5 h-4.5" /> : <Sun className="w-4.5 h-4.5 text-yellow-400" />}
            </button>

            {user ? (
              <div className="flex items-center gap-3.5">
                <span className="text-xs text-secondary hidden lg:inline-block">
                  Olá, <strong className="text-primary">{user.name.split(" ")[0]}</strong>
                </span>
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-full bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue-hover transition-colors shadow-[0_0_20px_rgba(0,82,255,0.25)] flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-4 h-4" />
                  Meu Painel
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-5">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
                >
                  Login Parceiro
                </Link>
                
                <button
                  onClick={() => scrollToSection("simulador")}
                  className="relative group overflow-hidden px-5 py-2.5 rounded-full bg-brand-blue text-white font-semibold text-sm hover:bg-brand-blue-hover transition-colors shadow-[0_0_20px_rgba(0,82,255,0.25)] hover:shadow-[0_0_25px_rgba(0,82,255,0.45)] cursor-pointer flex items-center gap-1.5"
                >
                  Simular Ganhos
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Actions */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-brand-blue/10 text-secondary hover:text-primary transition-all cursor-pointer"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-secondary hover:text-primary transition-colors focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-b border-brand-blue/15 absolute top-full left-0 right-0 py-6 px-4 flex flex-col gap-5 bg-brand-bg/95 backdrop-blur-lg">
          <button
            onClick={() => scrollToSection("como-funciona")}
            className="text-left text-base font-medium text-secondary hover:text-primary py-1 cursor-pointer"
          >
            Como Funciona
          </button>
          <button
            onClick={() => scrollToSection("simulador")}
            className="text-left text-base font-medium text-secondary hover:text-primary py-1 cursor-pointer"
          >
            Simulador
          </button>
          <button
            onClick={() => scrollToSection("servicos")}
            className="text-left text-base font-medium text-secondary hover:text-primary py-1 cursor-pointer"
          >
            Nossas Soluções
          </button>
          <button
            onClick={() => scrollToSection("prospeccao")}
            className="text-left text-base font-medium text-secondary hover:text-primary py-1 cursor-pointer"
          >
            Quero Trabalhar
          </button>
          
          {user ? (
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold text-center text-sm shadow-[0_0_15px_rgba(0,82,255,0.2)] flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <User className="w-4 h-4" />
              Acessar Meu Painel
            </Link>
          ) : (
            <div className="flex flex-col gap-4 border-t border-brand-blue/10 pt-4">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-left text-base font-medium text-secondary hover:text-primary py-1 cursor-pointer"
              >
                Login Parceiro
              </Link>
              <button
                onClick={() => scrollToSection("simulador")}
                className="w-full py-3 rounded-xl bg-brand-blue text-white font-semibold text-center text-sm shadow-[0_0_15px_rgba(0,82,255,0.2)] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                Simular Ganhos
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

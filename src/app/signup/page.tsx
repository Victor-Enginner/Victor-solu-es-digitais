"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../../components/ui/logo";
import { isRealDatabase } from "../../lib/db";
import { ArrowLeft, User, Mail, Phone, Key, Sparkles, Send, Lock, MailCheck } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { signup, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [pixKey, setPixKey] = useState("");
  const [password, setPassword] = useState("");
  const [needsConfirm, setNeedsConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If user is already logged in, redirect them
  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !whatsapp || !pixKey) {
      setErrorMsg("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (isRealDatabase && password.length < 8) {
      setErrorMsg("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const created = await signup(name, email, whatsapp, pixKey, password);
      if (created) {
        router.push("/dashboard");
      } else {
        // Supabase pediu confirmação de e-mail
        setNeedsConfirm(true);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ocorreu um erro ao criar a sua conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative py-12 px-4 sm:px-6 lg:px-8 cyber-grid bg-brand-bg transition-colors duration-300">
      {/* Background Lighting Spots */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#0052FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-[250px] h-[250px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        
        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-primary transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar para a Página Inicial</span>
        </Link>

        {/* Signup Form Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-panel p-8 rounded-2xl shadow-2xl relative overflow-hidden bg-brand-bg/80 backdrop-blur-md"
        >
          {/* Logo & Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex justify-center">
              <Logo showText={false} className="h-10" />
            </div>
            <h1 className="text-2xl font-black font-display text-primary tracking-tight">
              Torne-se um Parceiro Comercial
            </h1>
            <p className="text-xs text-secondary max-w-xs mx-auto">
              Cadastre-se para prospectar empresas, gerenciar indicações e acompanhar seus ganhos em tempo real.
            </p>
          </div>

          {/* Form (ou aviso de confirmação de e-mail) */}
          {needsConfirm ? (
            <div className="text-center space-y-3 py-4">
              <div className="flex justify-center">
                <MailCheck className="w-10 h-10 text-[#10B981]" />
              </div>
              <h2 className="text-lg font-black font-display text-primary">Confirme seu e-mail</h2>
              <p className="text-xs text-secondary leading-relaxed">
                Enviamos um link para <strong className="text-primary">{email}</strong>. Clique nele para ativar
                sua conta e depois faça login. Não chegou? Olhe a caixa de spam.
              </p>
              <Link
                href="/login"
                className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-brand-blue-hover transition-all"
              >
                Ir para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              {/* Error Message */}
              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl pl-10 pr-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                  Endereço de E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemplo@email.com"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl pl-10 pr-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                  Seu WhatsApp / Telefone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="Ex: (16) 99123-4567"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl pl-10 pr-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                  />
                </div>
              </div>

              {/* Pix Key */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                  Sua Chave Pix (Para Receber Comissões)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={pixKey}
                    onChange={(e) => setPixKey(e.target.value)}
                    placeholder="CPF, celular, e-mail ou aleatória"
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl pl-10 pr-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                  />
                </div>
              </div>


              {/* Senha (só com banco real) */}
              {isRealDatabase && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                    Crie uma Senha (mín. 8 caracteres)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-secondary">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[var(--bg-input)] border border-[var(--border-input)] rounded-xl pl-10 pr-4 py-3 text-sm text-primary focus:outline-none focus:border-[#0052FF] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-brand-blue-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,82,255,0.2)] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span>Criando conta...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Cadastrar e Entrar no Painel</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Login Footer */}
          <div className="border-t border-brand-blue/10 pt-5 mt-6 text-center text-xs text-secondary">
            <span>Já possui uma conta? </span>
            <Link 
              href="/login" 
              className="font-bold text-[#0052FF] hover:underline cursor-pointer"
            >
              Fazer Login
            </Link>
          </div>
        </motion.div>

        {/* Quick Tip Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-secondary text-center px-4">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>Contas de teste mockadas aceitam qualquer e-mail no login inicial.</span>
        </div>

      </div>
    </main>
  );
}

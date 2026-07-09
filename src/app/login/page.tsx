"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import { Logo } from "../../components/ui/logo";
import { ArrowLeft, Mail, LogIn, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // If user is already logged in, redirect them
  if (user) {
    router.push("/dashboard");
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!email) {
      setErrorMsg("Por favor, digite seu e-mail.");
      return;
    }

    setLoading(true);
    try {
      await login(email);
      router.push("/dashboard");
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao fazer login. Verifique as credenciais.");
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

        {/* Login Form Panel */}
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
              Acesse o seu Painel
            </h1>
            <p className="text-xs text-secondary max-w-xs mx-auto">
              Digite seu e-mail cadastrado para entrar no painel de acompanhamento de prospecção.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Error Message */}
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-semibold">
                {errorMsg}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                Seu Endereço de E-mail
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

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-brand-blue text-white font-bold text-sm hover:bg-brand-blue-hover transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(0,82,255,0.2)] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Acessando...</span>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar no Painel</span>
                </>
              )}
            </button>
          </form>

          {/* Signup Footer */}
          <div className="border-t border-brand-blue/10 pt-5 mt-6 text-center text-xs text-secondary">
            <span>Ainda não possui uma conta? </span>
            <Link 
              href="/signup" 
              className="font-bold text-[#0052FF] hover:underline cursor-pointer"
            >
              Criar Conta Grátis
            </Link>
          </div>
        </motion.div>

        {/* Quick Tip Badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-secondary text-center px-4">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>Experimente usar o e-mail mockado: <strong className="text-[#0052FF]">gabriel@email.com</strong></span>
        </div>

      </div>
    </main>
  );
}

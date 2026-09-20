"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { mockDb, supabase, isRealDatabase } from "../lib/db";

interface PartnerUser {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  pixKey: string;
  level: number;
  created_at: string;
}

interface AuthContextType {
  user: PartnerUser | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<PartnerUser>;
  /** Retorna null quando o Supabase exige confirmar o e-mail antes de entrar. */
  signup: (
    name: string,
    email: string,
    whatsapp: string,
    pixKey: string,
    password?: string
  ) => Promise<PartnerUser | null>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// A tabela usa snake_case (pix_key); o app usa camelCase (pixKey).
// Sem esse mapeamento o painel mostrava a chave Pix como "undefined" no modo real.
function toPartnerUser(row: any): PartnerUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    whatsapp: row.whatsapp,
    pixKey: row.pix_key ?? row.pixKey ?? "",
    level: row.level ?? 1,
    created_at: row.created_at,
  };
}

async function fetchPartnerProfile(userId: string): Promise<PartnerUser | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("partners")
    .select("*")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  return toPartnerUser(data);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PartnerUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user session on mount
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    async function initAuth() {
      try {
        if (isRealDatabase && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            setUser(await fetchPartnerProfile(session.user.id));
          }

          // Mantém o estado em sincronia (logout em outra aba, token expirado, confirmação de e-mail)
          const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
            if (!newSession?.user) {
              setUser(null);
              return;
            }
            // Não chamar o supabase direto aqui dentro (deadlock conhecido): adia para o próximo tick.
            setTimeout(async () => {
              setUser(await fetchPartnerProfile(newSession.user.id));
            }, 0);
          });
          unsubscribe = () => sub.subscription.unsubscribe();
        } else {
          // Mock Session
          const mockUser = await mockDb.getCurrentUser();
          if (mockUser) {
            setUser(mockUser);
          }
        }
      } catch (err) {
        console.error("Erro ao inicializar sessão auth:", err);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
    return () => unsubscribe?.();
  }, []);

  const login = async (email: string, password?: string): Promise<PartnerUser> => {
    setLoading(true);
    try {
      if (isRealDatabase && supabase) {
        if (!password) {
          throw new Error("Digite sua senha.");
        }

        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes("email not confirmed")) {
            throw new Error("Confirme seu e-mail antes de entrar. Enviamos um link para a sua caixa de entrada.");
          }
          throw new Error("E-mail ou senha incorretos.");
        }

        const profile = data.user ? await fetchPartnerProfile(data.user.id) : null;
        if (!profile) {
          throw new Error("Não encontramos o seu perfil de parceiro. Fale com o suporte.");
        }

        setUser(profile);
        return profile;
      } else {
        const mockUser = await mockDb.loginPartner(email);
        setUser(mockUser);
        return mockUser;
      }
    } catch (err: any) {
      throw new Error(err.message || "Erro ao realizar login.");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    name: string,
    email: string,
    whatsapp: string,
    pixKey: string,
    password?: string
  ): Promise<PartnerUser | null> => {
    setLoading(true);
    try {
      if (isRealDatabase && supabase) {
        if (!password || password.length < 8) {
          throw new Error("A senha precisa ter pelo menos 8 caracteres.");
        }

        // O trigger handle_new_user() (schema.sql) cria a linha em "partners" a partir desses metadados.
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name, whatsapp, pix_key: pixKey },
            emailRedirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
          },
        });

        if (error) {
          if (error.message.toLowerCase().includes("already registered")) {
            throw new Error("Este e-mail já está cadastrado.");
          }
          throw new Error(error.message);
        }

        // Com "Confirm email" ligado no Supabase não vem sessão: o parceiro precisa confirmar por e-mail.
        if (!data.session || !data.user) {
          return null;
        }

        const profile = await fetchPartnerProfile(data.user.id);
        if (profile) setUser(profile);
        return profile;
      } else {
        const mockUser = await mockDb.signupPartner({ name, email, whatsapp, pixKey });
        setUser(mockUser);
        return mockUser;
      }
    } catch (err: any) {
      throw new Error(err.message || "Erro ao cadastrar parceiro.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isRealDatabase && supabase) {
        await supabase.auth.signOut();
      } else {
        await mockDb.logout();
      }
      setUser(null);
    } catch (err) {
      console.error("Erro ao deslogar:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      if (user) {
        if (isRealDatabase && supabase) {
          const profile = await fetchPartnerProfile(user.id);
          if (profile) {
            setUser(profile);
          }
        } else {
          const mockUser = await mockDb.getCurrentUser();
          if (mockUser) {
            setUser(mockUser);
          }
        }
      }
    } catch (err) {
      console.error("Erro ao atualizar dados do usuário:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser utilizado dentro de um AuthProvider");
  }
  return context;
}

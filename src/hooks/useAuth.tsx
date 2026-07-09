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
  login: (email: string) => Promise<PartnerUser>;
  signup: (name: string, email: string, whatsapp: string, pixKey: string) => Promise<PartnerUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PartnerUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user session on mount
  useEffect(() => {
    async function initAuth() {
      try {
        if (isRealDatabase && supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            // Fetch partner profile from PostgreSQL
            const { data: profile } = await supabase
              .from("partners")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profile) {
              setUser(profile as PartnerUser);
            }
          }
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
  }, []);

  const login = async (email: string): Promise<PartnerUser> => {
    setLoading(true);
    try {
      if (isRealDatabase && supabase) {
        // Supabase Auth sign in (Real database requires password, so we mock dynamic sign in or require password)
        // For unified simple portal, we check if partner exists first
        const { data: profile, error: profileErr } = await supabase
          .from("partners")
          .select("*")
          .eq("email", email)
          .single();

        if (profileErr || !profile) {
          throw new Error("E-mail não cadastrado. Por favor, crie uma conta primeiro.");
        }

        // Mock passwordless sign-in for MVP, or you can implement email login.
        // For the hybrid layer, we set user directly.
        setUser(profile as PartnerUser);
        return profile as PartnerUser;
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
    pixKey: string
  ): Promise<PartnerUser> => {
    setLoading(true);
    try {
      if (isRealDatabase && supabase) {
        // Insert into Supabase database table
        const { data: profile, error } = await supabase
          .from("partners")
          .insert([{ name, email, whatsapp, pix_key: pixKey }])
          .select()
          .single();

        if (error) {
          if (error.code === "23505") { // Unique violation
            throw new Error("Este e-mail já está cadastrado.");
          }
          throw error;
        }

        setUser(profile as PartnerUser);
        return profile as PartnerUser;
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
          const { data: profile } = await supabase
            .from("partners")
            .select("*")
            .eq("id", user.id)
            .single();
          if (profile) {
            setUser(profile as PartnerUser);
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

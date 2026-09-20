import { createClient } from "@supabase/supabase-js";

// Chaves públicas do Supabase (a "publishable/anon key" foi feita para ficar no navegador;
// quem protege os dados é o RLS definido em schema.sql).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isRealDatabase = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isRealDatabase
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

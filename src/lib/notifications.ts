// Notificações (lado do navegador). O envio real de WhatsApp/e-mail acontece em /api/notify,
// no servidor, onde ficam os tokens. Nada secreto vai para o bundle público.
import { supabase } from "./supabase-client";
import type { NewLeadMessageData } from "./messages";

/** Modo demonstração: sem banco real só registra no console. */
export function logMockNotification(to: string, message: string) {
  console.log(
    `%c[NOTIFICAÇÃO SIMULADA] para: ${to}\n${message}`,
    "background:#10B981;color:#fff;padding:4px;border-radius:4px;font-weight:bold;"
  );
}

async function post(body: unknown, withAuth: boolean): Promise<void> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (withAuth && supabase) {
    const { data } = await supabase.auth.getSession();
    if (data.session?.access_token) {
      headers.Authorization = `Bearer ${data.session.access_token}`;
    }
  }

  const res = await fetch("/api/notify", {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    console.error("Falha ao notificar:", res.status, await res.text().catch(() => ""));
  }
}

/** Parceiro logado criou uma indicação: o servidor lê a indicação do banco e avisa o Victor. */
export function notifyLeadCreated(leadId: string) {
  return post({ kind: "lead", leadId }, true);
}

/** Visitante sem conta enviou o formulário da home: avisa o Victor com os dados enviados. */
export function notifyPublicLead(lead: NewLeadMessageData) {
  return post({ kind: "public-lead", lead }, false);
}

/** Admin mudou o status: o servidor avisa o parceiro dono da indicação. */
export function notifyStatusChanged(leadId: string) {
  return post({ kind: "status", leadId }, true);
}

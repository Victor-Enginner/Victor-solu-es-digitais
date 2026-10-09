import { supabase, isRealDatabase } from "./supabase-client";
import { logMockNotification, notifyLeadCreated, notifyStatusChanged } from "./notifications";
import { buildNewLeadMessage, buildStatusMessage } from "./messages";
import { CONTACT_WHATSAPP } from "./site-config";
import {
  type PartnerRow,
  type LeadRow,
  type Lead,
  type LeadInput,
  type LeadStatus,
  SERVICE_LABELS,
} from "./types";

export { supabase, isRealDatabase };

// ==========================================
// MOCK DATABASE ENGINE (localStorage Fallback)
// ==========================================
class MockDatabaseEngine {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    if (typeof window === "undefined") return defaultValue;
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  }

  private setStorageItem<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Partners CRUD
  async signupPartner(userData: { name: string; email: string; whatsapp: string; pixKey: string }): Promise<PartnerRow> {
    const partners = this.getStorageItem<PartnerRow[]>("victor_ai_partners", []);

    // Check if email already exists
    if (partners.some(p => p.email.toLowerCase() === userData.email.toLowerCase())) {
      throw new Error("Este e-mail já está cadastrado.");
    }

    const newPartner: PartnerRow = {
      id: `partner_${Date.now()}`,
      ...userData,
      pixKey: userData.pixKey,
      level: 1,
      created_at: new Date().toISOString()
    };

    partners.push(newPartner);
    this.setStorageItem("victor_ai_partners", partners);

    // Start session
    this.setStorageItem("victor_ai_session", newPartner);
    return newPartner;
  }

  async loginPartner(email: string): Promise<PartnerRow> {
    const partners = this.getStorageItem<PartnerRow[]>("victor_ai_partners", []);

    // Special Mock Admin user creation if not existing
    if (process.env.NODE_ENV !== "production" && email.toLowerCase() === "vitorborsari11@gmail.com") {
      let adminPartner = partners.find(p => p.email.toLowerCase() === email.toLowerCase());
      if (!adminPartner) {
        adminPartner = {
          id: "partner_admin",
          name: "Victor Admin",
          email: "vitorborsari11@gmail.com",
          whatsapp: "(16) 98214-1822",
          pixKey: "vitorborsari11@gmail.com",
          level: 4,
          created_at: new Date().toISOString()
        };
        partners.push(adminPartner);
        this.setStorageItem("victor_ai_partners", partners);
      }
      this.setStorageItem("victor_ai_session", adminPartner);
      return adminPartner;
    }

    const partner = partners.find(p => p.email.toLowerCase() === email.toLowerCase());

    if (!partner) {
      throw new Error("E-mail não cadastrado. Crie uma conta primeiro.");
    }

    // In mock mode, we accept any login if email matches
    this.setStorageItem("victor_ai_session", partner);
    return partner;
  }

  async getCurrentUser(): Promise<PartnerRow | null> {
    return this.getStorageItem<PartnerRow | null>("victor_ai_session", null);
  }

  async logout(): Promise<void> {
    if (typeof window === "undefined") return;
    localStorage.removeItem("victor_ai_session");
  }

  // Leads CRUD
  async getLeads(partnerId: string): Promise<Lead[]> {
    const allLeads = this.getStorageItem<LeadRow[]>("victor_ai_partner_leads", []);
    // Filter leads belonging to this partner
    return allLeads
      .filter(l => l.partner_id === partnerId || l.id === "mock1" || l.id === "mock2")
      .map(normalizeLead);
  }

  async createLead(partnerId: string, leadData: LeadInput): Promise<Lead> {
    const allLeads = this.getStorageItem<LeadRow[]>("victor_ai_partner_leads", []);
    const partners = this.getStorageItem<PartnerRow[]>("victor_ai_partners", []);
    const currentPartner = partners.find(p => p.id === partnerId);

    const newLead: LeadRow = {
      id: `lead_${Date.now()}`,
      partner_id: partnerId,
      company_name: leadData.companyName,
      city: leadData.city,
      service_type: serviceLabelToType(leadData.service),
      whatsapp: leadData.whatsapp,
      instagram: leadData.instagram || undefined,
      status: "pending",
      date: new Date().toLocaleDateString("pt-BR"),
      created_at: new Date().toISOString(),
      partners: currentPartner
        ? { name: currentPartner.name, whatsapp: currentPartner.whatsapp, pix_key: currentPartner.pixKey }
        : undefined
    };

    allLeads.unshift(newLead);
    this.setStorageItem("victor_ai_partner_leads", allLeads);

    logMockNotification(
      CONTACT_WHATSAPP,
      buildNewLeadMessage({
        companyName: newLead.company_name,
        city: newLead.city,
        service: SERVICE_LABELS[newLead.service_type as keyof typeof SERVICE_LABELS] ?? newLead.service_type,
        whatsapp: newLead.whatsapp,
        instagram: newLead.instagram || undefined,
        partnerName: newLead.partners?.name ?? "Parceiro Mock",
        partnerWhatsapp: newLead.partners?.whatsapp ?? "(16) 99123-4567",
        pixKey: newLead.partners?.pix_key ?? "payout@email.com"
      })
    );

    return normalizeLead(newLead);
  }

  async getAllLeads(): Promise<Lead[]> {
    const allLeads = this.getStorageItem<LeadRow[]>("victor_ai_partner_leads", []);
    const partners = this.getStorageItem<PartnerRow[]>("victor_ai_partners", []);

    // Join partner details
    return allLeads.map(l => {
      const partner = partners.find(p => p.id === l.partner_id);
      return normalizeLead({
        ...l,
        partners: partner
          ? { name: partner.name, whatsapp: partner.whatsapp, pix_key: partner.pixKey }
          : l.partners
      });
    });
  }

  async updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
    const allLeads = this.getStorageItem<LeadRow[]>("victor_ai_partner_leads", []);
    const partners = this.getStorageItem<PartnerRow[]>("victor_ai_partners", []);
    const leadIndex = allLeads.findIndex(l => l.id === leadId);

    if (leadIndex !== -1) {
      allLeads[leadIndex].status = status;
      this.setStorageItem("victor_ai_partner_leads", allLeads);

      const lead = allLeads[leadIndex];
      const partner = partners.find(p => p.id === lead.partner_id);

      logMockNotification(
        partner?.whatsapp ?? lead.partners?.whatsapp ?? CONTACT_WHATSAPP,
        buildStatusMessage(
          partner?.name ?? lead.partners?.name ?? "Parceiro",
          lead.company_name,
          status
        )
      );

      return normalizeLead(lead);
    }
    throw new Error("Lead não encontrado");
  }

  // Update mock levels based on successful closed leads
  async updatePartnerLevel(partnerId: string, leadsList: Lead[]): Promise<number> {
    const partners = this.getStorageItem<PartnerRow[]>("victor_ai_partners", []);
    const partnerIndex = partners.findIndex(p => p.id === partnerId);

    if (partnerIndex === -1) return 1;

    // 1 closed lead = level 2, 3 closed leads = level 3, 5+ = level 4
    const closedCount = leadsList.filter(l => l.status === "closed_paid").length;
    let newLevel = 1;
    if (closedCount >= 5) newLevel = 4;
    else if (closedCount >= 3) newLevel = 3;
    else if (closedCount >= 1) newLevel = 2;

    if (partners[partnerIndex].level !== newLevel) {
      partners[partnerIndex].level = newLevel;
      this.setStorageItem("victor_ai_partners", partners);
      // Update session as well
      const session = this.getStorageItem<PartnerRow | null>("victor_ai_session", null);
      if (session && session.id === partnerId) {
        session.level = newLevel;
        this.setStorageItem("victor_ai_session", session);
      }
    }

    return newLevel;
  }
}

export const mockDb = new MockDatabaseEngine();

// ==========================================
// HELPERS
// ==========================================

// Legado: o mock salvava o label completo em service_type. Aceitamos os dois formatos.
function serviceLabelToType(label: string): string {
  const found = Object.entries(SERVICE_LABELS).find(([, v]) => v === label);
  return found ? found[0] : label;
}

function toServiceLabel(serviceType: string): string {
  return SERVICE_LABELS[serviceType as keyof typeof SERVICE_LABELS] ?? serviceType;
}

function normalizeLead(l: LeadRow): Lead {
  return {
    id: l.id,
    partner_id: l.partner_id,
    companyName: l.company_name,
    city: l.city,
    service: toServiceLabel(l.service_type),
    whatsapp: l.whatsapp,      instagram: l.instagram || undefined,
    status: l.status,
    date: l.date,
    created_at: l.created_at,
    partnerName: l.partners?.name || "Parceiro",
    partnerWhatsapp: l.partners?.whatsapp || "N/A",
    pixKey: l.partners?.pix_key || "N/A"
  };
}

// ==========================================
// UNIFIED API INTERFACES
// ==========================================
export async function getLeads(partnerId: string): Promise<Lead[]> {
  if (isRealDatabase && supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("partner_id", partnerId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(l => normalizeLead(l as LeadRow));
  } else {
    return mockDb.getLeads(partnerId);
  }
}

export async function createLead(partnerId: string, leadData: LeadInput): Promise<Lead> {
  if (isRealDatabase && supabase) {
    const serviceTypeMap: Record<string, string> = {
      "Sites & Landing Pages": "site",
      "Google Meu Negócio": "google",
      "Automações de WhatsApp": "automacao",
      "Agente de Inteligência Artificial": "chatbot",
      site: "site",
      google: "google",
      automacao: "automacao",
      chatbot: "chatbot"
    };

    const { data, error } = await supabase
      .from("leads")
      .insert([{
        partner_id: partnerId,
        company_name: leadData.companyName,
        city: leadData.city,
        service_type: serviceTypeMap[leadData.service] || leadData.service,
        whatsapp: leadData.whatsapp,
        instagram: leadData.instagram,
        status: "pending",
        date: new Date().toLocaleDateString("pt-BR")
      }])
      .select()
      .single();

    if (error) throw error;

    // Aviso ao Victor (WhatsApp/e-mail) sai pelo servidor; falha aqui não desfaz a indicação.
    if (data?.id) {
      notifyLeadCreated(data.id).catch(err => console.error("Falha ao notificar nova indicação:", err));
    }

    return normalizeLead(data as LeadRow);
  } else {
    return mockDb.createLead(partnerId, leadData);
  }
}

export async function getAllLeads(): Promise<Lead[]> {
  if (isRealDatabase && supabase) {
    const { data, error } = await supabase
      .from("leads")
      .select("*, partners(name, whatsapp, pix_key)")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return (data || []).map(l => normalizeLead(l as LeadRow));
  } else {
    return mockDb.getAllLeads();
  }
}

export async function updateLeadStatus(leadId: string, status: LeadStatus): Promise<Lead> {
  if (isRealDatabase && supabase) {
    const { data, error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", leadId)
      .select()
      .single();

    if (error) throw error;

    notifyStatusChanged(leadId).catch(err => console.error("Falha ao notificar mudança de status:", err));

    return normalizeLead(data as LeadRow);
  } else {
    return mockDb.updateLeadStatus(leadId, status);
  }
}

export async function updatePartnerLevel(partnerId: string, leadsList: Lead[]): Promise<number> {
  if (isRealDatabase && supabase) {
    // O nível é calculado no banco (trigger recalc_partner_level em schema.sql); o cliente só lê.
    const { data, error } = await supabase
      .from("partners")
      .select("level")
      .eq("id", partnerId)
      .single();

    if (error) console.error("Erro ao ler nível do parceiro:", error);
    return data?.level ?? 1;
  } else {
    return mockDb.updatePartnerLevel(partnerId, leadsList);
  }
}

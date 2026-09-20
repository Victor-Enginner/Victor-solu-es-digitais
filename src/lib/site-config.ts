// Dados de contato e URLs do negócio num lugar só.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://victor-solu-es-digitais.vercel.app";

export const CONTACT_WHATSAPP = "5516982141822";
export const CONTACT_WHATSAPP_DISPLAY = "(16) 98214-1822";
export const CONTACT_EMAIL = "securitysuporte@proton.me";

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${CONTACT_WHATSAPP}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

import { normalizePhone } from "@/lib/utils/phone";

export function normalizeWhatsapp(phone: string): string {
  return normalizePhone(phone);
}

export function whatsappLink(phone: string, message?: string): string {
  const num = normalizeWhatsapp(phone);
  const base = `https://wa.me/${num}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export function vagaWhatsappMessage(titulo: string): string {
  return `Olá! Vi a vaga "${titulo}" no Freelas e Vagas de Design e tenho interesse.`;
}

export const STUDIO_CONTACTS = {
  email: "ikkoastudio@gmail.com",
  whatsapp: "+573001486762",
  whatsappDisplay: "+57 300 148 6762",
  instagram: "ikkoastudio",
  instagramUrl: "https://www.instagram.com/ikkoastudio",
} as const;

export function whatsappUrl(message: string) {
  const phone = STUDIO_CONTACTS.whatsapp.replace(/\D/g, "");
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

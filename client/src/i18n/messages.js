export const messages = {
  en: {
    bookNow: 'Book Now',
    contactUs: 'Contact Us',
    quoteEstimate: 'Get Estimate',
  },
  lg: {
    bookNow: 'Teekateeka Kati',
    contactUs: 'Tukwatagane',
    quoteEstimate: 'Funa Okubaliriza',
  },
};

export function translate(lang, key) {
  if (!key) return '';
  const bucket = messages[lang] || messages.en;
  return bucket[key] || messages.en[key] || key;
}

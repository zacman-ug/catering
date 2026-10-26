import { createContext, useContext, useMemo, useState } from 'react';
import { translate } from '../i18n/messages.js';

const I18nContext = createContext({ lang: 'en', t: (key) => key, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en');

  const value = useMemo(() => ({
    lang,
    setLang: (next) => {
      const safe = next === 'lg' ? 'lg' : 'en';
      localStorage.setItem('lang', safe);
      setLang(safe);
    },
    t: (key) => translate(lang, key),
  }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

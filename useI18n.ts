import { useState, useMemo, useCallback } from 'react';
import { Lang } from '../types';
import { i18nStrings } from '../constants';

const getInitialLang = (): Lang => {
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    return Object.values(Lang).includes(browserLang as Lang) ? (browserLang as Lang) : Lang.EN;
  }
  return Lang.EN;
};

export const useI18n = () => {
  const [lang, setLang] = useState<Lang>(getInitialLang());

  const setLanguage = useCallback((newLang: Lang) => {
    setLang(newLang);
  }, []);

  const t = useMemo(() => i18nStrings[lang], [lang]);

  return { lang, setLanguage, t };
};

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Theme, Language, PreferredRegion } from '@/types';

interface AppContextType {
  theme: Theme;
  language: Language;
  setLanguage: React.Dispatch<React.SetStateAction<Language>>;
  region: PreferredRegion;
  setRegion: React.Dispatch<React.SetStateAction<PreferredRegion>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
const PREFERRED_REGION_SET: ReadonlySet<PreferredRegion> = new Set(['GLOBAL', 'JAPAN', 'CN_MAINLAND', 'OVERSEAS']);

const isPreferredRegion = (value: string): value is PreferredRegion => PREFERRED_REGION_SET.has(value as PreferredRegion);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const theme: Theme = 'newspaper';
  
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('aya_lang');
    if (saved) return saved as Language;
    const browserLang = navigator.language.toLowerCase();
    if (browserLang.startsWith('ja')) return 'ja';
    if (browserLang.startsWith('zh')) return 'zh';
    return 'en';
  });

  const [region, setRegion] = useState<PreferredRegion>(() => {
    const saved = localStorage.getItem('aya_pref_region');
    if (saved && isPreferredRegion(saved)) return saved;
    const bLang = navigator.language.toLowerCase();
    if (bLang === 'zh-cn') return 'CN_MAINLAND';
    if (bLang.startsWith('ja')) return 'JAPAN';
    return 'OVERSEAS'; 
  });

  useEffect(() => {
    localStorage.setItem('aya_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('aya_pref_region', region);
  }, [region]);

  return (
    <AppContext.Provider value={{ theme, language, setLanguage, region, setRegion }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

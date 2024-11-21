import { useState, useEffect } from 'react';

export function useLanguage() {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    const browserLanguage = navigator.language.split('-')[0];
    return savedLanguage || (browserLanguage === 'fr' ? 'fr' : 'en');
  });

  useEffect(() => {
    localStorage.setItem('preferredLanguage', currentLanguage);
  }, [currentLanguage]);

  const setLanguage = (lang: string) => {
    if (lang !== currentLanguage) {
      setCurrentLanguage(lang);
      window.location.reload();
    }
  };

  return { currentLanguage, setLanguage };
}
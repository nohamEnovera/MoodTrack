import { en } from './en';
import { fr } from './fr';

// Validation des traductions en développement
const validateTranslations = () => {
  if (process.env.NODE_ENV === 'development') {
    const enKeys = Object.keys(en).sort();
    const frKeys = Object.keys(fr).sort();

    if (enKeys.length !== frKeys.length) {
      console.warn('Missing translations detected!');
      
      const missingInFr = enKeys.filter(key => !fr.hasOwnProperty(key));
      const missingInEn = frKeys.filter(key => !en.hasOwnProperty(key));

      if (missingInFr.length > 0) {
        console.warn('Missing in French:', missingInFr);
      }
      if (missingInEn.length > 0) {
        console.warn('Missing in English:', missingInEn);
      }
    }
  }
};

validateTranslations();

export const messages = {
  en,
  fr
} as const;
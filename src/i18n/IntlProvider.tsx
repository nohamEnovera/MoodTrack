import React from 'react';
import { IntlProvider as ReactIntlProvider } from 'react-intl';
import { messages } from './messages';
import { useLanguage } from '../hooks/useLanguage';

interface Props {
  children: React.ReactNode;
}

export function IntlProvider({ children }: Props) {
  const { currentLanguage } = useLanguage();
  const locale = currentLanguage || 'en';
  const translations = messages[locale as keyof typeof messages] || messages.en;

  return (
    <ReactIntlProvider
      messages={translations}
      locale={locale}
      defaultLocale="en"
      onError={(err) => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Missing translation:', err.message);
        }
      }}
    >
      {children}
    </ReactIntlProvider>
  );
}
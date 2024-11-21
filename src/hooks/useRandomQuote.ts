import { useIntl } from 'react-intl';
import { quotes } from '../data/quotes';

export function useRandomQuote() {
  const intl = useIntl();
  const quotesList = quotes[intl.locale as keyof typeof quotes] || quotes.en;
  const randomIndex = Math.floor(Math.random() * quotesList.length);
  return quotesList[randomIndex];
}
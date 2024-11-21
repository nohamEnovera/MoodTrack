import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { IntlProvider } from './i18n/IntlProvider';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <IntlProvider>
      <App />
    </IntlProvider>
  </StrictMode>
);
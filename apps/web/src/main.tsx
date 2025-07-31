import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@budmin/ui/styles.css';
import './index.css';
import './reset.css';
import './i18n';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

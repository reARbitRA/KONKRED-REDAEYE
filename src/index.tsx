import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { registerServiceWorker } from './registerServiceWorker';

import { APIKeyProvider } from './contexts/APIKeyContext';
import { LLMContextProvider } from './contexts/LLMContext';
import { SystemLogProvider } from './contexts/SystemLogContext';
import { ErrorBoundary } from './components/shared/ErrorBoundary';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <APIKeyProvider>
        <SystemLogProvider>
          <LLMContextProvider>
            <App />
          </LLMContextProvider>
        </SystemLogProvider>
      </APIKeyProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

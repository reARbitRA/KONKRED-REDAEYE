import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


import { APIKeyProvider } from './contexts/APIKeyContext';
import { LLMContextProvider } from './contexts/LLMContext';
import { SystemLogProvider } from './contexts/SystemLogContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <APIKeyProvider>
      <SystemLogProvider>
        <LLMContextProvider>
          <App />
        </LLMContextProvider>
      </SystemLogProvider>
    </APIKeyProvider>
  </React.StrictMode>
);

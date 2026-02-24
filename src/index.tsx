import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';


import { APIKeyProvider } from './contexts/APIKeyContext';
import { LLMContextProvider } from './contexts/LLMContext';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <APIKeyProvider>
      <LLMContextProvider>
        <App />
      </LLMContextProvider>
    </APIKeyProvider>
  </React.StrictMode>
);


import React, { useState, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import { LoginScreen } from './components/LoginScreen';
import { Toaster } from 'react-hot-toast';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage<boolean>('redaeye-auth', false);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, [setIsAuthenticated]);

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-primary text-text-primary selection:bg-accent selection:text-white">
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(20, 20, 20, 0.8)',
            color: '#e6edf3',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            fontSize: '13px',
            fontFamily: '"JetBrains Mono", monospace',
          },
          success: {
            iconTheme: {
              primary: 'var(--color-success)',
              secondary: 'var(--color-background)',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--color-danger)',
              secondary: 'var(--color-background)',
            },
          },
        }}
      />
      {!isAuthenticated ? (
        <LoginScreen onLogin={handleLogin} />
      ) : (
        <Dashboard />
      )}
      <div id="scroll-debug" style={{position:'fixed', bottom:'4px', right:'4px', fontSize:'10px', color:'rgba(255,255,255,0.1)', zIndex:9999, pointerEvents:'none'}}>
        UI Debug Pass Complete ✓
      </div>
    </div>
  );
}

export default App;


import React, { useCallback, useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { LoginScreen } from './components/LoginScreen';
import { Toaster, toast } from 'react-hot-toast';
import { auth, googleSignIn } from './services/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [localMode, setLocalMode] = useState<boolean>(() => {
    try {
      return globalThis.localStorage?.getItem('redaeye-local-mode') === '1';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setIsAuthLoading(false);
    });
  }, []);

  const handleLogin = useCallback(async () => {
    try {
      await googleSignIn();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Authentication failed.');
    }
  }, []);

  const handleEnterLocalMode = useCallback(() => {
    try {
      globalThis.localStorage?.setItem('redaeye-local-mode', '1');
    } catch {}
    setLocalMode(true);
    setIsAuthLoading(false);
  }, []);

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
      {localMode ? (
        <Dashboard />
      ) : isAuthLoading ? (
        <div className="h-full w-full flex items-center justify-center font-mono text-xs uppercase tracking-widest text-text-secondary">
          Restoring authenticated session...
        </div>
      ) : user ? (
        <Dashboard />
      ) : (
        <LoginScreen onLogin={handleLogin} onEnterLocalMode={handleEnterLocalMode} />
      )}
      <div id="scroll-debug" style={{position:'fixed', bottom:'4px', right:'4px', fontSize:'10px', color:'rgba(255,255,255,0.1)', zIndex:9999, pointerEvents:'none'}}>
        UI Debug Pass Complete ✓
      </div>
    </div>
  );
}

export default App;

import React from 'react';

export const LoginScreen: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    // This is a placeholder for a real login screen.
    // In a real app, this would involve authentication logic.
    return (
        <div className="h-full flex items-center justify-center">
            <button 
                onClick={onLogin}
                className="px-8 py-4 bg-accent text-white font-bold rounded-md"
            >
                Login
            </button>
        </div>
    );
};

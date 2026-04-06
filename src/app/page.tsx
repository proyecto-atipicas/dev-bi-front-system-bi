'use client';

import { useState } from 'react';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { API } from '@/lib/constants';
import { AppLauncherMenu } from '@/components/AppLauncherMenu';

export default function Page() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tokenInput, setTokenInput] = useState('');
  const [tokenError, setTokenError] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTokenError(false);
    const tokenToSend = (tokenInput ?? '').trim();
    try {
      const res = await fetch(API.login, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: tokenToSend }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setIsAuthenticated(true);
      } else {
        setTokenError(true);
      }
    } catch {
      setTokenError(true);
    }
  };

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: 'url(/fondo.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 border border-white/30">
          <div className="text-center mb-8">
            <img
              src="/appbi-stacked.svg"
              alt="LinkTIC Logo"
              className="h-30 w-auto mx-auto mb-4"
            />
            <p className="text-gray-500 text-sm mt-2">Ingrese el token de acceso para continuar</p>
          </div>

          <form onSubmit={handleTokenSubmit} className="space-y-4">
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showToken ? 'text' : 'password'}
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setTokenError(false);
                }}
                placeholder="Token de acceso"
                className={`w-full pl-10 pr-12 py-3 bg-gray-50 border rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  tokenError
                    ? 'border-red-400 focus:ring-red-200'
                    : 'border-gray-200 focus:ring-blue-200 focus:border-blue-400'
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowToken(!showToken)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showToken ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {tokenError && (
              <p className="text-red-500 text-sm text-center">Token incorrecto. Intente nuevamente.</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-colors"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    );
  }

  const handleLoggedOut = () => {
    setIsAuthenticated(false);
    setTokenInput('');
    setTokenError(false);
  };

  return <AppLauncherMenu onLogout={handleLoggedOut} />;
}

'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simular delay de autenticação
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        // Salvar no localStorage
        localStorage.setItem('admin_authenticated', 'true');
        localStorage.setItem('admin_login_time', Date.now().toString());
        
        // Redirecionar para admin
        router.push('/admin');
      } else {
        setError('Usuário ou senha incorretos');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-verde to-verde/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center">
              <Image
                src="/images/logo/logo.svg"
                alt="Casa Alvite Logo"
                width={40}
                height={40}
                className="brightness-0 saturate-100"
                style={{ filter: 'brightness(0) saturate(100%) invert(38%) sepia(12%) saturate(1088%) hue-rotate(56deg) brightness(93%) contrast(89%)' }}
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-cream mb-2">
            Área Administrativa
          </h1>
          <p className="text-cream/80">
            Casa Alvite - Faça login para continuar
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors"
                placeholder="Digite seu usuário"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-verde focus:border-verde transition-colors"
                placeholder="Digite sua senha"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-verde text-cream py-3 px-4 rounded-lg font-medium hover:bg-verde/90 focus:ring-2 focus:ring-verde focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-cream" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Informações de desenvolvimento */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p><strong>Desenvolvimento:</strong></p>
              <p>Usuário: <code className="bg-gray-100 px-1 rounded">admin</code></p>
              <p>Senha: <code className="bg-gray-100 px-1 rounded">admin</code></p>
            </div>
          </div>
        </div>

        {/* Link para voltar */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="text-cream/80 hover:text-cream transition-colors text-sm"
          >
            ← Voltar ao site
          </a>
        </div>
      </div>
    </div>
  );
} 
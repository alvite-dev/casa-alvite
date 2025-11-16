'use client'

import { useState } from 'react'

export default function EventSoldOut() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const scrollToMainHero = () => {
    const heroSection = document.getElementById('hero-section')
    if (heroSection) {
      heroSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          eventName: 'Café com Cerâmica'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao cadastrar email')
      }

      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Erro ao cadastrar email')
    }
  }

  return (
    <main id="hero-event-section" className="relative h-screen w-full overflow-hidden bg-cream">
      {/* Conteúdo centralizado do evento */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-8 pb-16 sm:pb-20 lg:pb-8">
        <div className="text-center space-y-8 sm:space-y-10 lg:space-y-12 max-w-4xl w-full">

          {/* Título Principal */}
          <div className="pb-2 sm:pb-4">
            <h1 className="font-instrument text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-cinza font-bold leading-tight">
              Café da Manhã<br />
              com Cerâmica
            </h1>
          </div>

          {/* Badge Esgotado - Grande e Rotacionado */}
          <div className="relative flex items-center justify-center">
            <div className="transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <div className="bg-terracotta/10 border-4 border-terracotta rounded-3xl px-8 sm:px-12 py-4 sm:py-6 shadow-2xl">
                <span className="font-junyper text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-terracotta font-bold block leading-none">
                  Esgotado!
                </span>
              </div>
            </div>
          </div>

          {/* Mensagem sobre próximo evento */}
          <div className="space-y-4">
            <p className="text-cinza/80 font-instrument text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Já estamos definindo a data do próximo evento!
            </p>
          </div>

          {/* Formulário de Email */}
          <div className="max-w-md mx-auto w-full">
            {status === 'success' ? (
              <div className="bg-verde/10 border-2 border-verde rounded-2xl p-6">
                <div className="flex items-center justify-center gap-2 text-verde">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="font-instrument font-semibold">
                    Email cadastrado com sucesso!
                  </p>
                </div>
                <p className="text-verde/80 font-instrument text-sm mt-2">
                  Você será avisado assim que tivermos novidades.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    required
                    disabled={status === 'loading'}
                    className="w-full px-6 py-4 rounded-2xl border-2 border-cinza/20 focus:border-verde focus:outline-none font-instrument text-base sm:text-lg text-cinza placeholder:text-cinza/40 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>

                {status === 'error' && (
                  <div className="bg-terracotta/10 border-2 border-terracotta rounded-2xl p-4">
                    <p className="text-terracotta font-instrument text-sm">
                      {errorMessage}
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-verde hover:bg-verde/90 text-cream font-instrument font-semibold text-sm sm:text-base px-8 h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'loading' ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cadastrando...
                    </span>
                  ) : (
                    'ME AVISE SOBRE O PRÓXIMO EVENTO'
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Botão para ver experiências regulares */}
          <div className="pt-4">
            <button
              onClick={scrollToMainHero}
              className="w-full sm:w-auto bg-transparent border-2 border-cinza/40 hover:border-cinza hover:bg-cinza hover:text-cream text-cinza font-instrument font-semibold text-sm sm:text-base px-8 sm:px-10 h-12 sm:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center mx-auto"
              type="button"
            >
              VER EXPERIÊNCIAS REGULARES
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

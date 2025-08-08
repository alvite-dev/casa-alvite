'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import AgendamentoSection from '@/components/AgendamentoSection'

export default function AgendamentoPage() {
  const router = useRouter()

  const handleVoltar = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header simples */}
      <header className="fixed top-0 left-0 right-0 z-40 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 bg-cream shadow-sm py-4">
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center p-1 sm:p-2">
              <Image
                src="/images/logo/logo.svg"
                alt="Casa Alvite Logo"
                width={64}
                height={64}
                className="w-full h-full"
                priority
              />
            </div>
            <h2 className="font-instrument font-medium text-sm sm:text-xl text-verde tracking-wide">
              CASA ALVITE
            </h2>
          </div>

          {/* Botão Voltar */}
          <button
            onClick={handleVoltar}
            className="flex items-center gap-2 bg-transparent border-2 border-verde hover:bg-verde hover:text-cream text-verde font-instrument font-semibold text-sm px-4 py-2 rounded-xl transition-all duration-200 uppercase tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            VOLTAR
          </button>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="pt-24">
        {/* Seção de Agendamento */}
        <AgendamentoSection />
      </main>
    </div>
  )
}
'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'

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
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Título da página */}
          <div className="text-center mb-12">
            <h1 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4">
              Agendar Experiência
            </h1>
            <p className="text-cinza text-lg leading-relaxed font-instrument max-w-2xl mx-auto">
              Vamos criar algo único juntos! Preencha as informações abaixo para agendar sua experiência na Casa Alvite.
            </p>
          </div>

          {/* Card principal */}
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-cinza/10">
            
            {/* Conteúdo temporário */}
            <div className="text-center space-y-8">
              
              {/* Ícone */}
              <div className="flex justify-center">
                <div className="w-20 h-20 bg-verde/10 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-verde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Texto principal */}
              <div className="space-y-4">
                <h2 className="font-instrument font-semibold text-2xl lg:text-3xl text-cinza">
                  Em Construção
                </h2>
                <p className="text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                  Esta página está sendo desenvolvida para oferecer a melhor experiência de agendamento.
                  <br />
                  Em breve você poderá escolher datas, horários e personalizar sua experiência conosco.
                </p>
              </div>

              {/* Botão de contato temporário */}
              <div className="pt-4">
                <a 
                  href="https://wa.me/5521991792065"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-amarelo border-2 border-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-base lg:text-lg px-8 py-4 rounded-2xl transition-all duration-200 uppercase tracking-wide"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  AGENDAR VIA WHATSAPP
                </a>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
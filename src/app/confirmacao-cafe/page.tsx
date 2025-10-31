'use client'

import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function ConfirmacaoCafePage() {
  return (
    <>
      <Header transparent={false} />
      
      <main className="min-h-screen bg-cream pt-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <section className="text-center mb-8">
            <div className="w-20 h-20 bg-verde/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-verde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-verde mb-4 font-junyper">
              Reserva Confirmada!
            </h1>
            <p className="text-xl text-cinza font-instrument">
              Sua vaga no Café da Manhã com Cerâmica está garantida
            </p>
          </section>

          {/* Detalhes do Evento */}
          <section className="mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-cinza/10">
              <h2 className="text-2xl font-bold text-cinza mb-6 font-junyper text-center">
                Detalhes do Evento
              </h2>
              
              <div className="space-y-6">
                {/* Informações do evento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-verde/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-verde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cinza font-instrument">Data</h3>
                      <p className="text-cinza/80 font-instrument">Sábado, 06 de Dezembro de 2025</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-roxo/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-roxo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cinza font-instrument">Horário</h3>
                      <p className="text-cinza/80 font-instrument">9h às 11h</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amarelo/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-amarelo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cinza font-instrument">Local</h3>
                      <p className="text-cinza/80 font-instrument">Vegan Vegan - Botafogo</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-cinza font-instrument">Valor</h3>
                      <p className="text-cinza/80 font-instrument">R$ 190,00</p>
                    </div>
                  </div>
                </div>
                
                {/* O que está incluído */}
                <div className="border-t border-cinza/10 pt-6">
                  <h3 className="font-semibold text-cinza font-instrument mb-4 flex items-center gap-2">
                    <svg className="w-5 h-5 text-verde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    O que está incluído
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-verde rounded-full"></div>
                      <span className="text-cinza/80 font-instrument text-sm">Modelagem da sua cumbuca</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-verde rounded-full"></div>
                      <span className="text-cinza/80 font-instrument text-sm">Buffet vegan completo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-verde rounded-full"></div>
                      <span className="text-cinza/80 font-instrument text-sm">Queima e finalização</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-verde rounded-full"></div>
                      <span className="text-cinza/80 font-instrument text-sm">Ambiente aconchegante</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Lembretes Importantes */}
          <section className="mb-8">
            <div className="bg-amarelo/10 rounded-3xl p-6 border border-amarelo/20">
              <h2 className="text-xl font-bold text-cinza mb-4 font-junyper flex items-center gap-2">
                <svg className="w-6 h-6 text-amarelo" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Lembretes Importantes
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-verde/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-verde" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <p className="text-cinza font-instrument text-sm">
                    <strong>Entraremos em contato por WhatsApp</strong> para confirmar seu nome e tirar dúvidas
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-verde/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-verde" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-cinza font-instrument text-sm">
                    <strong>Chegue pontualmente às 9h</strong> para aproveitar toda a experiência
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-verde/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-verde" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-cinza font-instrument text-sm">
                    <strong>Use roupas que podem sujar</strong> - trabalharemos com argila!
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-verde/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-verde" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-cinza font-instrument text-sm">
                    <strong>Traga fome e criatividade</strong> - será uma manhã especial!
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Localização */}
          <section className="mb-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-cinza/10">
              <h2 className="text-xl font-bold text-cinza mb-4 font-junyper flex items-center gap-2">
                <svg className="w-6 h-6 text-verde" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Localização do Evento
              </h2>
              
              <div className="text-center">
                <p className="text-cinza font-instrument mb-2">
                  <strong>Vegan Vegan</strong>
                </p>
                <p className="text-cinza/80 font-instrument text-sm mb-4">
                  R. Hans Staden, 30 - Botafogo<br />
                  Rio de Janeiro - RJ, 22281-060
                </p>
                
                <a
                  href="https://maps.google.com/?q=R.+Hans+Staden,+30+-+Botafogo,+Rio+de+Janeiro+-+RJ,+22281-060"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-verde hover:bg-verde/90 text-cream font-instrument font-medium text-sm px-4 py-2 rounded-xl transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  Ver no Google Maps
                </a>
              </div>
            </div>
          </section>

          {/* Botões de Ação */}
          <section className="text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/5521991792065"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-verde hover:bg-verde/90 text-cream font-instrument font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                Falar no WhatsApp
              </a>
              
              <a
                href="/"
                className="inline-flex items-center justify-center gap-2 bg-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold px-6 py-3 rounded-xl transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Voltar para Home
              </a>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </>
  )
}
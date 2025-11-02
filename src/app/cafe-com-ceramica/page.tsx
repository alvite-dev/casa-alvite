'use client'

import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function CafeComCeramicaPage() {
  return (
    <>
      <Header transparent={false} />

      <main className="pt-20" style={{ backgroundColor: '#DECFBC' }}>
        <div className="w-full flex flex-col lg:flex-row lg:gap-12 lg:px-24 lg:items-end">
          <div className="w-full lg:w-1/2">
            <Image
              src="/images/cafe-com-ceramica.png"
              alt="Café da Manhã com Cerâmica - Parte 1"
              width={1080}
              height={1920}
              className="w-full h-auto"
              priority
            />
          </div>
          <div className="w-full lg:w-1/2">
            <Image
              src="/images/cafe-com-ceramica-2.png"
              alt="Café da Manhã com Cerâmica - Parte 2"
              width={1080}
              height={1920}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Seções adicionais */}
        <div className="px-4 py-8 space-y-8">
          
          {/* CTA Reservar */}
          <section className="text-center">
            <a
              href="/reserva-cafe"
              className="inline-block bg-verde hover:bg-verde/90 text-cream font-instrument font-bold text-xl px-8 py-4 rounded-2xl transition-all duration-200 uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              GARANTA SUA VAGA
            </a>
            <p className="text-cinza/70 text-sm font-instrument mt-3">
              Pagamento seguro via MercadoPago
            </p>
          </section>
          
          {/* Como funciona o evento */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-cinza/10 shadow-sm">
            <div className="max-w-4xl mx-auto">
              <h2 className="font-junyper text-3xl sm:text-4xl text-cinza mb-8 text-center">
                Como funciona o evento
              </h2>
              
              <div className="prose prose-lg max-w-none lg:columns-2 lg:gap-24">
                <p className="text-cinza font-instrument text-base sm:text-lg leading-relaxed mb-4">
                  O <strong>Café da Manhã com Cerâmica</strong> é uma experiência única que combina gastronomia e arte em argila. Durante duas horas, você vai desfrutar de um delicioso buffet enquanto cria sua própria cumbuca personalizada.
                </p>
                
                <p className="text-cinza font-instrument text-base sm:text-lg leading-relaxed mb-4">
                  A manhã começa às 9h no <strong>Vegan Vegan</strong>, um dos restaurantes mais charmosos de Botafogo. Você será recebido com um buffet completo de café da manhã, com pães artesanais, geleias caseiras, frutas frescas, sucos naturais e muito mais.
                </p>
                
                <p className="text-cinza font-instrument text-base sm:text-lg leading-relaxed mb-4">
                  Enquanto saboreia as delícias, você trabalhará com argila para modelar sua própria cumbuca. Nossa equipe estará lá para te guiar durante todo o processo, desde a modelagem até os acabamentos finais. Não se preocupe se for sua primeira vez - a experiência é pensada para todos os níveis!
                </p>
                
                <p className="text-cinza font-instrument text-base sm:text-lg leading-relaxed">
                  Após a queima e finalização (que acontece depois do evento), sua cumbuca ficará pronta para retirada na Casa Alvite. É uma lembrança especial de uma manhã inesquecível, feita pelas suas próprias mãos.
                </p>
              </div>
            </div>
          </section>
          
          {/* Cards em 2 colunas no desktop */}
          <div className="flex flex-col lg:flex-row lg:gap-8 lg:items-start">
            
            {/* Política de Cancelamento */}
            <section className="w-full lg:w-1/2 bg-white rounded-3xl p-6 border border-cinza/10 shadow-sm mb-8 lg:mb-0">
              <div className="mb-4">
                <h2 className="font-junyper text-2xl sm:text-3xl text-cinza mb-3">
                  Política de Cancelamento
                </h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cinza/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-cinza" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                  <p className="text-cinza font-instrument text-sm leading-relaxed">
                    <strong>Não há reembolso</strong> em nenhuma circunstância
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-cinza/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-cinza" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                  </div>
                  <p className="text-cinza font-instrument text-sm leading-relaxed">
                    <strong>Transferência permitida:</strong> Você pode transferir seu ingresso para outra pessoa avisando a equipe da Casa Alvite pelo WhatsApp
                  </p>
                </div>
              </div>
            </section>

            {/* Localização e Mapa */}
            <section className="w-full lg:w-1/2 bg-white rounded-3xl p-6 border border-cinza/10 shadow-sm">
            <div className="mb-4">
              <h2 className="font-junyper text-2xl sm:text-3xl text-cinza mb-3">
                Localização
              </h2>
            </div>
            
            {/* Endereço */}
            <div className="mb-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cinza/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-cinza" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="font-instrument font-semibold text-cinza mb-1">
                    Vegan Vegan
                  </h3>
                  <p className="text-cinza font-instrument text-sm leading-relaxed">
                    R. Hans Staden, 30 - Botafogo<br />
                    Rio de Janeiro - RJ, 22281-060
                  </p>
                </div>
              </div>
            </div>
            
            {/* Mapa do Google Maps */}
            <div className="w-full h-48 rounded-2xl overflow-hidden border border-cinza/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3675.344!2d-43.183!3d-22.949!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x997f58a68b5b43%3A0x234567890abcdef!2sR.%20Hans%20Staden%2C%2030%20-%20Botafogo%2C%20Rio%20de%20Janeiro%20-%20RJ%2C%2022281-060!5e0!3m2!1spt-BR!2sbr!4v1698765432000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localização do Vegan Vegan"
              ></iframe>
            </div>
            
            {/* Botão para abrir no Google Maps */}
            <div className="mt-4">
              <a
                href="https://maps.google.com/?q=R.+Hans+Staden,+30+-+Botafogo,+Rio+de+Janeiro+-+RJ,+22281-060"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-cinza hover:bg-cinza/90 text-cream font-instrument font-medium text-sm px-4 py-2 rounded-xl transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
                Ver no Google Maps
              </a>
            </div>
          </section>
          
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
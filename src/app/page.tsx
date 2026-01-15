'use client'

import Image from 'next/image'
import { useState } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  // Estados para o FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  const scrollToHowItWorks = () => {
    const titleElement = document.getElementById('titulo-decorativo-rotacionado')
    if (titleElement) {
      const rect = titleElement.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const elementPosition = rect.top + scrollTop
      const offsetPosition = elementPosition - 120 // Ajuste para o header
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }




  return (
    <>
      <Header transparent={true} />

      {/* Hero Principal */}
      <main id="hero-section" className="relative h-screen w-full overflow-hidden">
        {/* Imagem de fundo que ocupa toda a viewport */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:bg-[url('/images/background-home.JPG')] bg-[url('/images/background-home-mobile.JPG')]"
        >
          {/* Overlay opcional para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-black/65"></div>
        </div>

        {/* Conteúdo centralizado */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-20 sm:pt-24">
          <div className="text-center space-y-16 sm:space-y-20 lg:space-y-28">
            {/* Título principal */}
            <h1 className="text-cream font-junyper text-6xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[10rem] font-medium tracking-wide leading-tight">
              Bebidinhas<br />
              Belisquetes<br />
              Barro
            </h1>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full sm:w-auto">
              <a
                href="https://wa.me/5521991792065"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-verde hover:bg-verde/90 text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                AGENDE SEU EVENTO
              </a>
              
              <button 
                onClick={scrollToHowItWorks}
                className="w-full sm:w-auto bg-transparent border-2 border-verde hover:bg-verde hover:text-cream text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
                type="button"
              >
                COMO FUNCIONA?
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Container para layout de duas colunas no desktop */}
      <section className="bg-cream w-full pt-12 sm:pt-16 lg:pt-12 relative overflow-hidden">
        
        {/* Blob amarelo decorativo */}
        <div className="absolute -right-16 bottom-20 w-80 h-80 lg:w-96 lg:h-96 z-0 pointer-events-none">
          <Image
            src="/images/blob-amarelo.svg"
            alt="Blob amarelo decorativo"
            width={384}
            height={384}
            className="w-full h-full object-contain opacity-70"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Layout responsivo: empilhado no mobile, duas colunas no desktop */}
          <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16">
            
            {/* Coluna Esquerda - Espaço Casa Alvite */}
            <div id="espaco-casa-alvite-section" className="lg:w-1/2">
              
              {/* Layout simplificado - Apenas imagem */}
              <div className="flex justify-center">
                
                {/* Imagem centralizada */}
                <div className="relative w-full max-w-lg">
                  
                  {/* Título decorativo */}
                  <div id="titulo-decorativo-rotacionado" className="relative mb-6 z-20 -mb-8">
                    <h2 className="font-junyper text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-verde font-normal leading-[70%] -rotate-[6.5deg] relative z-10 pl-14 -translate-y-2">
                      Cerâmica em <br />
                      qualquer lugar!
                    </h2>
                    <div className="absolute left-0 top-3 w-12 h-12 sm:w-16 sm:h-16 pointer-events-none z-0">
                      <Image
                        src="/images/estrela.svg"
                        alt="Estrela decorativa"
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  
                  <div id="imagem-espaco-casa-alvite" className="relative rounded-3xl overflow-hidden">
                    <Image
                      src="/images/event-vegan-vegan.JPG"
                      alt="Experiência de cerâmica no espaço Casa Alvite"
                      width={600}
                      height={800}
                      className="w-full h-[300px] lg:h-[450px] object-cover object-top"
                      priority
                    />
                    
                    {/* Decoração com forma orgânica */}
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 lg:w-20 lg:h-20">
                      <div className="w-full h-full bg-terracotta/20 rounded-full transform -rotate-12"></div>
                    </div>
                  </div>
                  
                  {/* Frases explicativas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 mt-4">
                    
                    {/* Frase 1 */}
                    <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                      Organizamos experiências exclusivas de modelagem e pintura em cerâmica para grupos.
Aqui, você cria algo único — só seu — em um encontro pensado só para vocês.
                    </p>
                    
                    {/* Frase 2 */}
                    <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                      Chame a Casa Alvite para celebrar aniversários, despedidas de solteira, encontros entre amigas e outras datas especiais :)
                    </p>
                    
                  </div>
                </div>
                
              </div>
            </div>

            {/* Coluna Direita - Como Funciona */}
            <div id="como-funciona-section" className="lg:w-1/2 pt-16 lg:pt-32">
              
              {/* Grid de 4 caixas */}
              <div className="grid grid-cols-1 gap-6 lg:gap-8">
                
                {/* Caixa 1 - Vinho */}
                <div id="card-oficina-amados" className="bg-roxo rounded-3xl p-4 lg:p-6 text-cream h-[120px] lg:h-[140px]">
                  {/* Layout Mobile - Horizontal */}
                  <div className="flex lg:hidden items-center justify-center gap-4 h-full">
                    <div className="w-[80px] h-[80px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/images/vaso.svg"
                        alt="Vaso de cerâmica"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide leading-tight text-left">
                        2 HORAS DE EXPERIÊNCIA COM SEUS AMADOS
                      </h3>
                    </div>
                  </div>
                  
                  {/* Layout Desktop - Horizontal (igual ao mobile) */}
                  <div className="hidden lg:flex items-center justify-center gap-4 h-full">
                    <div className="w-[80px] h-[80px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/images/vaso.svg"
                        alt="Vaso de cerâmica"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide leading-tight text-left">
                        2 HORAS DE EXPERIÊNCIA COM SEUS AMADOS
                      </h3>
                    </div>
                  </div>
                </div>
                
                {/* Caixa 2 - Amarela */}
                <div id="card-musica-bebidas" className="bg-amarelo rounded-3xl p-4 lg:p-6 text-cream h-[120px] lg:h-[140px]">
                  {/* Layout Mobile - Horizontal */}
                  <div className="flex lg:hidden items-center justify-center gap-4 h-full">
                    <div className="w-[90px] h-[90px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/images/ferramentas.svg"
                        alt="Ferramentas de cerâmica"
                        width={90}
                        height={90}
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide leading-tight text-left">
                        MÚSICA BOA, BEBIDINHA E BELISQUETES
                      </h3>
                    </div>
                  </div>
                  
                  {/* Layout Desktop - Horizontal (igual ao mobile) */}
                  <div className="hidden lg:flex items-center justify-center gap-4 h-full">
                    <div className="w-[90px] h-[90px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/images/ferramentas.svg"
                        alt="Ferramentas de cerâmica"
                        width={90}
                        height={90}
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide leading-tight text-left">
                        MÚSICA BOA, BEBIDINHA E BELISQUETES
                      </h3>
                    </div>
                  </div>
                </div>
                
                {/* Caixa 3 - Terracota */}
                <div id="card-barro-tintas" className="bg-terracotta rounded-3xl p-4 lg:p-6 text-cream h-[120px] lg:h-[140px]">
                  {/* Layout Mobile - Horizontal */}
                  <div className="flex lg:hidden items-center justify-center gap-4 h-full">
                    <div className="w-[80px] h-[80px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/images/cumbucas.svg"
                        alt="Cumbucas de cerâmica"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide leading-tight text-left">
                        BARRO, TINTAS E QUEIMAS INCLUSOS
                      </h3>
                    </div>
                  </div>
                  
                  {/* Layout Desktop - Horizontal (igual ao mobile) */}
                  <div className="hidden lg:flex items-center justify-center gap-4 h-full">
                    <div className="w-[80px] h-[80px] flex items-center justify-center flex-shrink-0">
                      <Image
                        src="/images/cumbucas.svg"
                        alt="Cumbucas de cerâmica"
                        width={80}
                        height={80}
                        className="w-full h-full object-contain opacity-90"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide leading-tight text-left">
                        BARRO, TINTAS E QUEIMAS INCLUSOS
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card Verde - Datas */}
                <div id="card-datas" className="bg-verde rounded-3xl p-8 lg:p-12 text-cream">

                    {/* Título com ícone */}
                    <div className="flex items-center gap-4 mb-8">
                      <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      <h3 className="text-4xl lg:text-5xl font-normal font-junyper leading-tight">
                        Datas
                      </h3>
                    </div>

                    {/* Lista de datas */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-instrument font-semibold text-xl text-left">EVENTOS DA CASA</span>
                        <span className="font-instrument text-xl font-medium text-cinza text-right">anúncios no instagram</span>
                      </div>
                      <div className="w-full h-px bg-cream/30"></div>
                      <div className="flex justify-between items-start gap-4">
                        <span className="font-instrument font-semibold text-xl text-left">SEU EVENTO EXCLUSIVO</span>
                        <span className="font-instrument text-xl font-medium text-cinza text-right">mande um whatsapp</span>
                      </div>
                    </div>
                  </div>
              </div>

            </div>

          </div>

        </div>
      </section>
      {/* Seção FAQ */}
      <section id="faq-section" className="bg-cream w-full pt-20 sm:pt-24 lg:pt-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header do FAQ */}
          <div className="text-center mb-12 lg:mb-16">
            {/* Ícone */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 lg:w-20 lg:h-20 flex items-center justify-center">
                <Image
                  src="/images/Question.svg"
                  alt="Ícone de pergunta"
                  width={80}
                  height={80}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            
            {/* Título */}
            <h2 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4">
              Perguntas Frequentes
            </h2>
            
            {/* Subtítulo */}
            <div className="space-y-2">
              <p className="text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                Caso tenha mais dúvidas, entre em contato conosco!
              </p>
            </div>
          </div>

          {/* Lista de FAQs */}
          <div className="space-y-4">
            
            {/* FAQ 1 */}
            <div className="bg-cream border border-cinza/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === 0 ? null : 0)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cinza/5 transition-colors duration-200"
              >
                <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide pr-4">
                  VOCÊS TÊM AULAS RECORRENTES?
                </span>
                <div className="flex-shrink-0">
                  {openFAQ === 0 ? (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              {openFAQ === 0 && (
                <div className="px-6 pb-6">
                  <div className="space-y-4 text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                    <p>
                      Não! Não somos um ateliê padrão e nem damos aulas regulares. Proporcionamos rolês com cerâmica, bebidas, belisquetes, música e conversa boa.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-cream border border-cinza/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cinza/5 transition-colors duration-200"
              >
                <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide pr-4">
                  VOCÊS TEM ESPAÇO PRÓPRIO PARA OS EVENTOS?
                </span>
                <div className="flex-shrink-0">
                  {openFAQ === 1 ? (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              {openFAQ === 1 && (
                <div className="px-6 pb-6">
                  <div className="space-y-4 text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                    <p>
                      Nossa Casa no Humaitá comporta pequenas comemorações de 2 a 6 pessoas.
                    </p>
                    <p>
                      Mas vamos em qualquer lugar que você desejar.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-cream border border-cinza/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cinza/5 transition-colors duration-200"
              >
                <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide pr-4">
                  E AS BEBIDINHAS E OS BELISQUETES?
                </span>
                <div className="flex-shrink-0">
                  {openFAQ === 3 ? (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              {openFAQ === 3 && (
                <div className="px-6 pb-6">
                  <div className="space-y-4 text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                    <p>
                      Os eventos que nós organizamos são feitos em restaurantes que se encarregam das gostosuras.
                    </p>
                    <p>
                      E no seu evento personalizado, focamos em cuidar da parte do barro.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-cream border border-cinza/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cinza/5 transition-colors duration-200"
              >
                <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide pr-4">
                  PRECISO TER FEITO CERÂMICA ANTES?
                </span>
                <div className="flex-shrink-0">
                  {openFAQ === 4 ? (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </div>
              </button>
              {openFAQ === 4 && (
                <div className="px-6 pb-6">
                  <div className="space-y-4 text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                    <p>
                      Não. A maioria vem pela primeira vez. E de todas as idades! Desde crianças até idosos.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
          
        </div>
      </section>

      {/* Seção Quem Somos */}
      <section id="quem-somos-section" className="bg-cream w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Título da seção - mobile apenas */}
          <div className="text-left mb-8 lg:hidden">
            <h2 className="text-4xl sm:text-5xl text-cinza font-normal mb-4">
              <span className="font-instrument-serif italic">Prazer, </span>
              <span className="font-junyper text-5xl sm:text-6xl text-roxo">Júlia</span>
              <span className="font-instrument-serif italic"> e </span>
              <span className="font-junyper text-5xl sm:text-6xl text-roxo">Bernardo</span>
            </h2>
          </div>

          {/* Layout de duas colunas no desktop */}
          <div className="flex flex-col lg:flex-row lg:gap-12 xl:gap-16 lg:items-start items-center">
            
            {/* Coluna Esquerda - Título + Texto (Desktop) / Ordem 2 (Mobile) */}
            <div className="lg:w-1/2 order-2 lg:order-1">

              {/* Título da seção - desktop apenas */}
              <div className="hidden lg:block text-left mb-8">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4 lg:mb-8">
                  <span className="font-instrument-serif italic">Prazer, </span>
                  <span className="font-junyper text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-roxo">Júlia</span>
                  <span className="font-instrument-serif italic"> e </span>
                  <span className="font-junyper text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-roxo">Bernardo</span>
                </h2>
              </div>

              {/* Frases explicativas */}
              <div className="space-y-6">
                
                {/* Frase 1 */}
                <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                  Sócios e parceiros, somos engenheiros de formação e ceramistas por paixão.
                </p>
                
                {/* Frase 2 */}
                <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                  Fundamos a Casa Alvite com o objetivo de apresentar a cerâmica de forma festiva, fora das aulas recorrentes dos ateliês tradicionais.
                </p>
                
                {/* Frase 3 */}
                <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                  Nome em homenagem ao vovô da Ju, que dizia que para a casa ser um lar, precisava ter objetos feitos com as próprias mãos.
                </p>
                
              </div>

            </div>
            
            {/* Coluna Direita - Imagem (Desktop) / Ordem 1 (Mobile) */}
            <div className="lg:w-1/2 order-1 lg:order-2 mb-8 lg:mb-0">
              
              {/* Imagem dos fundadores */}
              <div className="w-full lg:flex lg:justify-end">
                <div className="w-full lg:max-w-sm aspect-[5/4] lg:aspect-auto">
                  <Image
                    src="/images/ju-be.png"
                    alt="Júlia e Bernardo - Fundadores Casa Alvite"
                    width={400}
                    height={240}
                    className="w-full h-full lg:h-[520px] rounded-3xl object-cover object-center"
                    fill={false}
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />


      {/* Estilos do Calendário */}
      <style jsx global>{`
        /* Estilização minimalista para o calendário */
        .calendar-wrapper {
          display: flex;
          justify-content: center;
        }

        .minimal-calendar {
          width: 100%;
          max-width: 350px;
          background: transparent;
          border: none;
          font-family: inherit;
          line-height: 1.125em;
        }

        .minimal-calendar .react-calendar__navigation {
          display: flex;
          height: 50px;
          margin-bottom: 1.5em;
          background: transparent;
          border: none;
        }

        .minimal-calendar .react-calendar__navigation button {
          color: #40413E;
          min-width: 44px;
          background: none;
          border: none;
          font-size: 18px;
          font-weight: 400;
          cursor: pointer;
          font-family: 'Instrument Serif', serif;
        }

        .minimal-calendar .react-calendar__navigation button:hover {
          background-color: #f9fafb;
          border-radius: 8px;
        }

        .minimal-calendar .react-calendar__navigation button:disabled {
          background-color: transparent;
          color: #d1d5db;
          cursor: default;
        }

        .minimal-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 0.75em;
          color: #6b7280;
          padding: 0.75em 0 1em 0;
          border-bottom: 1px solid #f3f4f6;
          margin-bottom: 0.5em;
        }

        .minimal-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }

        .minimal-calendar .react-calendar__month-view__days__day {
          position: relative;
          padding: 0.75em;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9em;
          color: #374151;
          border-radius: 8px;
          margin: 1px;
          font-weight: 400;
        }

        .minimal-calendar .react-calendar__month-view__days__day:hover {
          background-color: #f9fafb;
        }

                 .minimal-calendar .react-calendar__month-view__days__day--active {
           background: #40413E !important;
           color: white !important;
           font-weight: 500;
         }

         .minimal-calendar .react-calendar__month-view__days__day--active:hover {
           background: #40413E !important;
         }

         .minimal-calendar .react-calendar__tile--disabled {
           background-color: transparent !important;
           color: #e5e7eb !important;
           cursor: not-allowed !important;
         }

         .minimal-calendar .react-calendar__tile--active {
           background: #40413E !important;
           color: white !important;
         }

         /* Data selecionada (diferente de ativa) */
         .minimal-calendar .react-calendar__tile--now {
           background: #f3f4f6 !important;
           color: #40413E !important;
           font-weight: 500;
         }

         .minimal-calendar .react-calendar__tile--now:hover {
           background: #e5e7eb !important;
         }

         /* Data selecionada pelo usuário */
         .minimal-calendar .react-calendar__tile--active.available-date {
           background: #D59146 !important;
           color: white !important;
           font-weight: 600;
         }

         .minimal-calendar .react-calendar__tile--active.available-date:hover {
           background: #D59146 !important;
         }

         .minimal-calendar .react-calendar__tile--active.available-date:after {
           display: none;
         }

        /* Datas com horários disponíveis */
        .minimal-calendar .available-date {
          background-color: #fef3c7 !important;
          color: #92400e !important;
          font-weight: 500;
          position: relative;
        }

        .minimal-calendar .available-date:hover {
          background-color: #fde68a !important;
        }

        .minimal-calendar .available-date:after {
          content: '';
          position: absolute;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: #D59146;
          border-radius: 50%;
        }

        .minimal-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #e5e7eb;
        }
      `}</style>
    </>
  )
} 
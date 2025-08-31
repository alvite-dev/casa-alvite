'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'



export default function Home() {
  // Estados para o FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)



  const scrollToNextSection = () => {
    const nextSection = document.getElementById('espaco-casa-alvite-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToHowItWorks = () => {
    const titleElement = document.getElementById('titulo-decorativo-rotacionado')
    if (titleElement) {
      const elementPosition = titleElement.offsetTop
      const offsetPosition = elementPosition - 150 // Ajuste para o header
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  const scrollToBookingSection = () => {
    const bookingSection = document.getElementById('booking-section')
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Funções auxiliares para o calendário
  const formatTime = (timeString: string | null) => {
    if (!timeString) return '';
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minutes} ${ampm}`;
    } catch {
      return timeString;
    }
  };




  return (
    <>
      <Header transparent={true} />

      <main id="hero-section" className="relative h-screen w-full overflow-hidden">
        {/* Imagem de fundo que ocupa toda a viewport */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat md:bg-[url('/images/background-home.JPG')] bg-[url('/images/background-home-mobile.JPG')]"
        >
          {/* Overlay opcional para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-black/60"></div>
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
                href="/agendamento"
                className="w-full sm:w-auto bg-verde hover:bg-verde/90 text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
              >
                AGENDAR EXPERIÊNCIA
              </a>
              
              <button 
                onClick={scrollToNextSection}
                className="w-full sm:w-auto bg-transparent border-2 border-cream hover:bg-cream hover:text-verde text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
                type="button"
              >
                COMO FUNCIONA?
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* CONTEÚDO PRESERVADO - O Espaço Casa Alvite (Para uso futuro) */}
      {/* 
        <div className="space-y-10">
          <div>
            <h3 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4">
              O espaço Casa Alvite
            </h3>
          </div>
          
          <div className="space-y-4">
            <p className="text-cinza text-base lg:text-lg leading-relaxed font-instrument">
              Se vocês curtem animais, nossas cachorras estarão presentes. Quem vem diz que elas deixam tudo ainda mais terapêutico e divertido.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/check-terracota.svg"
                  alt="Check"
                  width={20}
                  height={20}
                  className="w-full h-full"
                />
              </div>
              <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide">
                ESPAÇO ACOLHEDOR E INSPIRADOR
              </span>
            </div>
            
            <div className="w-full h-px bg-cinza/20"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/check.svg"
                  alt="Check"
                  width={20}
                  height={20}
                  className="w-full h-full"
                />
              </div>
              <span className="text-verde font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide">
                AMBIENTE CRIATIVO NO HUMAITÁ
              </span>
            </div>
            
            <div className="w-full h-px bg-cinza/20"></div>
            
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                <Image
                  src="/images/check-amarelo.svg"
                  alt="Check"
                  width={20}
                  height={20}
                  className="w-full h-full"
                />
              </div>
              <span className="text-amarelo font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide">
                GRUPOS PEQUENOS E INTIMISTAS
              </span>
            </div>
          </div>
          
          <div className="pt-4">
            <a 
              href="/agendamento"
              className="inline-flex items-center justify-center bg-amarelo border-2 border-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-base lg:text-lg px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide"
            >
              AGENDAR EXPERIÊNCIA
            </a>
          </div>
        </div>
      */}

      {/* Container para layout de duas colunas no desktop */}
      <section className="bg-cream w-full pt-24 sm:pt-28 lg:pt-20 relative overflow-hidden">
        
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
                      Experiencia só do<br />
                      seu grupo!
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
                      src="/images/experience-5.png"
                      alt="Experiência de cerâmica no espaço Casa Alvite"
                      width={600}
                      height={800}
                      className="w-full h-[400px] lg:h-[600px] object-cover object-top"
                      priority
                    />
                    
                    {/* Decoração com forma orgânica */}
                    <div className="absolute -bottom-6 -left-6 w-16 h-16 lg:w-20 lg:h-20">
                      <div className="w-full h-full bg-terracotta/20 rounded-full transform -rotate-12"></div>
                    </div>
                  </div>
                  
                  {/* Frases explicativas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 mt-8">
                    
                    {/* Frase 1 */}
                    <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                      Proporcionamos experiências exclusivas de modelagem e pintura em cerâmica
                    </p>
                    
                    {/* Frase 2 */}
                    <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                      Você constrói algo único e somente seu, num rolê só do seu grupo! <br />
                      Mais que bem-vindas comemorações de aniversários, dates etc. 🙂
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
                
                {/* Caixa 4 - Horários */}
                <div id="card-horarios" className="bg-verde rounded-3xl p-8 lg:p-12 text-cream">
                    
                    {/* Título com ícone */}
                    <div className="flex items-center gap-4 mb-8">
                      <svg className="w-10 h-10 lg:w-12 lg:h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12,6 12,12 16,14"/>
                      </svg>
                      <h3 className="text-4xl lg:text-5xl font-normal font-junyper leading-tight">
                        Horários
                      </h3>
                    </div>
                    
                    {/* Lista de horários simplificada */}
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="font-instrument font-semibold text-xl">SEGUNDA À SEXTA</span>
                                            <span className="font-instrument text-xl font-medium text-cinza">19H ÀS 21H</span>
                      </div>
                      <div className="w-full h-px bg-cream/30"></div>
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <span className="font-instrument font-semibold text-xl">SÁBADO</span>
                                            <span className="font-instrument text-xl font-medium italic text-cinza">A combinar</span>
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
                  A CASA ALVITE É UM ATELIÊ QUE DÁ AULAS DE CERÂMICA?
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
                      Não. Não somos um ateliê regular e nem damos aulas. Nosso foco são rolês com cerâmica + bebidas, belisquetes, música e conversa boa exclusivos para pequenos grupos.
                    </p>
                    <p>
                      Celebramos aniversários, dates, Happy Hour etc. Aqui no espaço da Casa Alvite ou eventos maiores externos.
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
                  VOCÊS FAZEM EVENTOS?
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
                      Sim! Celebramos aniversários, happy hours corporativos, despedidas de solteiro, festas infantis e muito mais.
                    </p>
                    <p>
                      Realizamos eventos tanto no nosso espaço acolhedor no Humaitá quanto no local de sua preferência, adaptando nossa experiência cerâmica às suas necessidades especiais.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-cream border border-cinza/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cinza/5 transition-colors duration-200"
              >
                <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide pr-4">
                  QUAIS HORÁRIOS DISPONÍVEIS?
                </span>
                <div className="flex-shrink-0">
                  {openFAQ === 2 ? (
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
              {openFAQ === 2 && (
                <div className="px-6 pb-6">
                  <div className="space-y-4 text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                    <p>
                      Temos um calendário completo de disponibilidade na nossa página de agendamento, onde você pode visualizar todos os horários livres em tempo real.
                    </p>
                    <p>
                      Acesse nossa página de agendamento para escolher o horário de sua preferência e garantir sua experiência única na Casa Alvite.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-cream border border-cinza/20 rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-cinza/5 transition-colors duration-200"
              >
                <span className="text-terracotta font-instrument font-semibold text-base lg:text-lg uppercase tracking-wide pr-4">
                  BEBIDAS E COMIDAS ESTÃO INCLUSOS?
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
                      Não fornecemos bebidas e comidas, mas vocês são muito bem-vindos para levar e criar um momento ainda mais agradável durante a experiência.
                    </p>
                    <p>
                      A experiência já inclui todo o barro, as tintas e as queimas profissionais. Vocês só precisam trazer a criatividade e o que desejarem para beber e beliscar!
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

          {/* Layout simplificado */}
          <div className="max-w-4xl mx-auto">
            
            {/* Conteúdo centralizado */}
            <div className="space-y-6">
              
              {/* Título da seção */}
              <div className="text-left">
                <h2 className="text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4 lg:mb-12">
                  <span className="font-instrument-serif italic">Prazer, </span>
                  <span className="font-junyper text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-roxo">Júlia</span>
                  <span className="font-instrument-serif italic"> e </span>
                  <span className="font-junyper text-5xl sm:text-6xl lg:text-7xl xl:text-8xl text-roxo">Bernardo</span>
                </h2>
              </div>
              
              {/* Imagem dos fundadores */}
              <div className="flex justify-center">
                <div className="w-full max-w-md">
                  <Image
                    src="/images/ju-be.png"
                    alt="Júlia e Bernardo - Fundadores Casa Alvite"
                    width={400}
                    height={240}
                    className="w-full h-[340px] sm:h-[280px] lg:h-[520px] rounded-3xl object-cover object-center"
                  />
                </div>
              </div>

              {/* Frases explicativas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                
                {/* Frase 1 */}
                <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                  Sócios e parceiros, somos engenheiros de formação e ceramistas por paixão.
                </p>
                
                {/* Frase 2 */}
                <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                  Fundamos a Casa Alvite com o objetivo de apresentar a cerâmica de forma festiva, fora das aulas recorrentes dos ateliês tradicionais. <br />
                  Nome em homenagem ao vovô da Ju, que dizia que para a casa ser um lar, precisava ter objetos feitos com as próprias mãos.
                </p>
                
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
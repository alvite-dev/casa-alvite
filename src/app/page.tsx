'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'



export default function Home() {
  // Estados para o FAQ
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)



  const scrollToNextSection = () => {
    const nextSection = document.getElementById('next-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToHowItWorks = () => {
    const howItWorksSection = document.getElementById('how-it-works-section')
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({ behavior: 'smooth' })
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

      <main className="relative h-screen w-full overflow-hidden">
        {/* Imagem de fundo que ocupa toda a viewport */}
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/images/background-home.png')",
          }}
        >
          {/* Overlay opcional para melhorar legibilidade do texto */}
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        {/* Conteúdo centralizado */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 pt-20 sm:pt-24">
          <div className="text-center space-y-16 sm:space-y-20 lg:space-y-28">
            {/* Título principal */}
            <h1 className="text-cream font-instrument-serif italic text-5xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-medium tracking-wide leading-tight">
              Barro, Bebidas e<br className="sm:hidden" />
              <span className="sm:block">Belisquetes</span>
            </h1>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center justify-center w-full sm:w-auto">
              <button 
                onClick={scrollToNextSection}
                className="w-full sm:w-auto bg-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
                type="button"
              >
                COMO FUNCIONA?
              </button>
              
              <a 
                href="/agendamento"
                className="w-full sm:w-auto bg-transparent border-2 border-cream hover:bg-cream hover:text-verde text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
              >
                AGENDAR EXPERIÊNCIA
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* Seção Quem Somos */}
      <section id="next-section" className="bg-cream w-full pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-20 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Layout com título e colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
            
            {/* Coluna Esquerda - Título, Texto e Contato */}
            <div className="space-y-6 lg:col-span-3">
              
              {/* Título da seção */}
              <div className="text-left">
                <h2 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4 lg:mb-12">
                  Quem somos?
                </h2>
              </div>
              
              {/* Caixa com texto principal */}
              <div className="bg-cream rounded-3xl p-6 lg:p-8 space-y-4 border border-cinza/10">
                <p className="text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                  Aqui você vive uma experiência exclusiva de modelagem e pintura em cerâmica, em um ambiente reservado só para o seu grupo. Traga quem ama, seus petiscos e bebidas, e aproveite duas horas de criatividade e muita conversa.
                </p>
                
                <p className="text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                  Aqui, não há certo ou errado: cada peça é única. Nossa equipe garante que você leve para casa uma lembrança cheia de significado.
                </p>
              </div>
              

            </div>
            
            {/* Coluna Direita - Horários e Botão */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Cartão de Horários */}
              <div className="bg-verde rounded-3xl p-8 lg:p-12 text-cream">
                
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
                                        <span className="font-instrument text-xl font-medium text-cinza">18H ÀS 20H</span>
                  </div>
                  <div className="w-full h-px bg-cream/30"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                    <span className="font-instrument font-semibold text-xl">SÁBADO E DOMINGO</span>
                                        <span className="font-instrument text-xl font-medium italic text-cinza">A combinar</span>
                  </div>
                </div>
              </div>
              
              {/* Botão de Agendamento */}
              <div className="flex justify-center lg:justify-start">
                <a 
                  href="/agendamento"
                  className="w-full bg-amarelo border-2 border-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-base lg:text-lg px-6 lg:px-8 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide flex items-center justify-center"
                >
                  AGENDAR EXPERIÊNCIA
                </a>
              </div>
              
            </div>
            
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section id="how-it-works-section" className="bg-cream w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header - Título e texto explicativo */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 lg:gap-12 mb-12 lg:mb-16">
            
            {/* Título */}
            <div className="lg:flex-shrink-0">
              <h2 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal">
                Como funciona
              </h2>
            </div>
            
            {/* Texto explicativo */}
            <div className="lg:max-w-lg lg:pt-4">
              <p className="text-cinza text-lg lg:text-xl leading-relaxed font-instrument">
                2 horas de criatividade e conexão em um ateliê acolhedor no Humaitá
              </p>
            </div>
          </div>
          
          {/* Linha divisória */}
          <div className="w-full h-px bg-cinza/20 mb-12 lg:mb-16"></div>
          
          {/* Grid de 3 caixas no topo */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12 lg:mb-16">
            
            {/* Caixa 1 - Verde */}
            <div className="bg-verde rounded-3xl p-4 lg:p-8 text-cream h-[150px] md:h-[380px]">
              {/* Layout Mobile - Horizontal */}
              <div className="flex md:hidden items-center justify-center gap-4 h-full">
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
                  <h3 className="font-instrument font-semibold text-base uppercase tracking-wide leading-tight text-left">
                    BARRO, TINTAS E<br />QUEIMAS INCLUSOS
                  </h3>
                </div>
              </div>
              
              {/* Layout Desktop - Vertical */}
              <div className="hidden md:flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-[200px] h-[200px] flex items-center justify-center">
                    <Image
                      src="/images/vaso.svg"
                      alt="Vaso de cerâmica"
                      width={300}
                      height={300}
                      className="w-full h-full object-contain opacity-90"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-instrument font-semibold text-xl uppercase tracking-wide leading-tight">
                    BARRO, TINTAS E<br />QUEIMAS INCLUSOS
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Caixa 2 - Amarela */}
            <div className="bg-amarelo rounded-3xl p-4 lg:p-8 text-cream h-[150px] md:h-[380px]">
              {/* Layout Mobile - Horizontal */}
              <div className="flex md:hidden items-center justify-center gap-4 h-full">
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
                  <h3 className="font-instrument font-semibold text-base uppercase tracking-wide leading-tight text-left">
                    2 HORAS DE OFICINA<br />COM SEUS AMADOS
                  </h3>
                </div>
              </div>
              
              {/* Layout Desktop - Vertical */}
              <div className="hidden md:flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-[220px] h-[220px] flex items-center justify-center">
                    <Image
                      src="/images/ferramentas.svg"
                      alt="Ferramentas de cerâmica"
                      width={350}
                      height={350}
                      className="w-full h-full object-contain opacity-90"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-instrument font-semibold text-xl uppercase tracking-wide leading-tight">
                    2 HORAS DE OFICINA<br />COM SEUS AMADOS
                  </h3>
                </div>
              </div>
            </div>
            
            {/* Caixa 3 - Terracota */}
            <div className="bg-terracotta rounded-3xl p-4 lg:p-8 text-cream h-[150px] md:h-[380px]">
              {/* Layout Mobile - Horizontal */}
              <div className="flex md:hidden items-center justify-center gap-4 h-full">
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
                  <h3 className="font-instrument font-semibold text-base uppercase tracking-wide leading-tight text-left">
                    MÚSICA BOA, BEBIDINHA<br />E BELISQUETES
                  </h3>
                </div>
              </div>
              
              {/* Layout Desktop - Vertical */}
              <div className="hidden md:flex flex-col items-center justify-center text-center space-y-4 h-full">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-[200px] h-[200px] flex items-center justify-center">
                    <Image
                      src="/images/cumbucas.svg"
                      alt="Cumbucas de cerâmica"
                      width={300}
                      height={300}
                      className="w-full h-full object-contain opacity-90"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-instrument font-semibold text-xl uppercase tracking-wide leading-tight">
                    MÚSICA BOA, BEBIDINHA<br />E BELISQUETES
                  </h3>
                </div>
              </div>
            </div>
          </div>
          
          {/* Caixa grande embaixo */}
          <div className="bg-verde rounded-3xl p-4 lg:p-6 text-cream h-[120px] md:h-[140px]">
            
            {/* Layout Mobile - Apenas texto */}
            <div className="flex md:hidden items-center justify-center h-full">
              <p className="font-instrument font-semibold text-sm uppercase tracking-wide leading-tight text-center">
                SUA ARTE PRONTA EM 30 DIAS COM QUEIMA E ESMALTAÇÃO PROFISSIONAL.<br />
                NO FINAL, COMBINAMOS A MELHOR FORMA DE ENTREGA
              </p>
            </div>
            
            {/* Layout Desktop - Com estrela */}
            <div className="hidden md:flex lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-8 h-full">
              
              {/* SVG da Estrela */}
              <div className="flex-shrink-0 flex justify-center lg:justify-start">
                <div className="w-[60px] h-[60px]">
                  <Image
                    src="/images/estrela.svg"
                    alt="Estrela dourada"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain opacity-90"
                  />
                </div>
              </div>
              
              {/* Texto */}
              <div className="flex-1 text-center lg:text-left flex items-center">
                <p className="font-instrument font-semibold text-lg lg:text-xl uppercase tracking-wide leading-tight">
                  SUA ARTE PRONTA EM 30 DIAS COM QUEIMA E ESMALTAÇÃO PROFISSIONAL.<br />
                  NO FINAL, COMBINAMOS A MELHOR FORMA DE ENTREGA
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </section>

      {/* Seção O Espaço Casa Alvite */}
      <section className="bg-cream w-full py-16 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Layout com duas colunas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Coluna Esquerda - Conteúdo */}
            <div className="space-y-10">
              
              {/* Título decorativo */}
              <div className="relative mb-6">
                <h2 className="font-junyper text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-verde font-normal leading-[70%] -rotate-[6.5deg] relative z-10 pl-14">
                  O espaço é só<br />
                  de vocês!
                </h2>
                <div className="absolute left-0 top-0 w-10 h-10 sm:w-12 sm:h-12 pointer-events-none z-0">
                  <Image
                    src="/images/estrela.svg"
                    alt="Estrela decorativa"
                    width={48}
                    height={48}
                    className="w-full h-full object-contain opacity-80"
                  />
                </div>
              </div>
              
              {/* Título da seção */}
              <div>
                <h3 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-4">
                  O espaço Casa Alvite
                </h3>
              </div>
              
              {/* Texto principal */}
              <div className="space-y-4">
                <p className="text-cinza text-base lg:text-lg leading-relaxed font-instrument">
                  Se vocês curtem animais, nossas cachorras estarão presentes. Quem vem diz que elas deixam tudo ainda mais terapêutico e divertido.
                </p>
              </div>
              
              {/* Lista de características */}
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
              
              {/* Botão */}
              <div className="pt-4">
                <a 
                  href="/agendamento"
                  className="inline-flex items-center justify-center bg-amarelo border-2 border-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-base lg:text-lg px-8 lg:px-10 h-12 lg:h-14 rounded-2xl transition-all duration-200 uppercase tracking-wide"
                >
                  AGENDAR EXPERIÊNCIA
                </a>
              </div>
              
            </div>
            
            {/* Coluna Direita - Imagem */}
            <div className="relative order-first lg:order-last">
              <div className="relative rounded-3xl overflow-hidden">
                <Image
                  src="/images/experience-5.png"
                  alt="Experiência de cerâmica no espaço Casa Alvite"
                  width={600}
                  height={800}
                  className="w-full h-[400px] lg:h-[600px] object-cover"
                  priority
                />
                
                {/* Decoração com forma orgânica */}
                <div className="absolute -bottom-6 -left-6 w-16 h-16 lg:w-20 lg:h-20">
                  <div className="w-full h-full bg-terracotta/20 rounded-full transform -rotate-12"></div>
                </div>
              </div>
            </div>
            
          </div>
          
        </div>
      </section>

      {/* Seção Galeria */}
      <section className="bg-cream w-full py-16 sm:py-20 lg:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Decorações de fundo */}
          
          <div className="relative z-10">
            
            {/* Grid de imagens - Desktop - Grade 6x6 Sem Sobreposição */}
            <div className="hidden lg:grid grid-cols-6 grid-rows-6 gap-4 h-[600px]">
              
              {/* Imagem 1 - Posição [1,1] 2x2 */}
              <div className="col-start-1 col-span-2 row-start-1 row-span-2">
                <div className="relative h-full rounded-3xl overflow-hidden group">
                  <Image
                    src="/images/experience-1.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Imagem 2 - Posição [3,1] 2x4 */}
              <div className="col-start-3 col-span-2 row-start-1 row-span-4">
                <div className="relative h-full rounded-3xl overflow-hidden group">
                  <Image
                    src="/images/experience-2.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Imagem 3 - Posição [5,1] 2x2 */}
              <div className="col-start-5 col-span-2 row-start-1 row-span-2">
                <div className="relative h-full rounded-3xl overflow-hidden group">
                  <Image
                    src="/images/experience-3.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Imagem 4 - Posição [1,3] 2x2 */}
              <div className="col-start-1 col-span-2 row-start-3 row-span-2">
                <div className="relative h-full rounded-3xl overflow-hidden group">
                  <Image
                    src="/images/experience-4.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Imagem 5 - Posição [5,3] 2x4 */}
              <div className="col-start-5 col-span-2 row-start-3 row-span-4">
                <div className="relative h-full rounded-3xl overflow-hidden group">
                  <Image
                    src="/images/experience-5.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={400}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
              {/* Imagem 6 - Posição [1,5] 4x2 */}
              <div className="col-start-1 col-span-4 row-start-5 row-span-2">
                <div className="relative h-full rounded-3xl overflow-hidden group">
                  <Image
                    src="/images/experience-6.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={800}
                    height={200}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>
              
            </div>
            
            {/* Grid simplificado - Tablet */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-4 h-[500px]">
              
              {/* Imagem 1 - Grande à esquerda */}
              <div className="row-span-2">
                <div className="relative h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/experience-6.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Imagem 2 - Superior direita */}
              <div className="row-span-1">
                <div className="relative h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/experience-2.png"
                    alt="Pessoas fazendo cerâmica"
                    width={400}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Imagem 3 - Inferior direita */}
              <div className="row-span-1">
                <div className="relative h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/experience-3.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
            </div>
            
            {/* Grid simplificado - Mobile (apenas 2 imagens) */}
            <div className="grid md:hidden grid-cols-1 gap-4 space-y-4">
              
              {/* Imagem 1 - Mobile */}
              <div className="h-[300px]">
                <div className="relative h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/experience-4.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Imagem 2 - Mobile */}
              <div className="h-[300px]">
                <div className="relative h-full rounded-3xl overflow-hidden">
                  <Image
                    src="/images/experience-3.png"
                    alt="Experiência de cerâmica Casa Alvite"
                    width={400}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
            </div>
            
          </div>
          
        </div>
      </section>

      {/* Seção FAQ */}
      <section className="bg-cream w-full py-16 sm:py-20 lg:py-24">
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
                Aqui algumas perguntas frequentes.
              </p>
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
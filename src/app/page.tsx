'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

// Tipos para o calendário
type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface AvailableSlot {
  experience_id: string;
  date: string;
  start_time: string;
  is_available: boolean;
}

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  
  // Estados para o agendamento
  const [selectedDate, setSelectedDate] = useState<Value>(null)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedPeople, setSelectedPeople] = useState<number>(2)
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const viewportHeight = window.innerHeight
      
      // Detecta se scrollou além da primeira seção (viewport)
      setIsScrolled(scrollPosition > viewportHeight * 0.8)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Buscar dados do Supabase
  useEffect(() => {
    async function fetchAvailableSlots() {
      try {
        setLoading(true);
        const response = await fetch('/api/available-slots');
        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }
        const data = await response.json();
        setAvailableSlots(data);
      } catch (err) {
        console.error('Erro ao buscar slots:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableSlots();
  }, []);

  const scrollToNextSection = () => {
    const nextSection = document.getElementById('next-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
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

  // ID da experiência de cerâmica
  const CERAMICS_EXPERIENCE_ID = '22a8e6c4-23fb-4fe0-b64d-e229c981b449';

  // Extrair datas que têm slots disponíveis para a experiência de cerâmica
  const availableDates = availableSlots
    .filter(slot => slot.experience_id === CERAMICS_EXPERIENCE_ID && slot.date && slot.is_available)
    .map(slot => {
      try {
        return new Date(slot.date);
      } catch {
        return null;
      }
    })
    .filter(date => date !== null) as Date[];

  // Verificar se uma data tem slots disponíveis
  const hasAvailableSlots = (date: Date) => {
    return availableDates.some(availableDate => 
      date.getFullYear() === availableDate.getFullYear() &&
      date.getMonth() === availableDate.getMonth() &&
      date.getDate() === availableDate.getDate()
    );
  };

  // Desabilitar datas passadas e sem slots disponíveis
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) return true;
      return !hasAvailableSlots(date);
    }
    return false;
  };

  // Classe CSS para datas disponíveis
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month' && hasAvailableSlots(date)) {
      return 'available-date';
    }
    return null;
  };

  // Obter horários da data selecionada para a experiência de cerâmica
  const getAvailableTimesForDate = () => {
    if (!(selectedDate instanceof Date)) return [];
    
    return availableSlots.filter(slot => {
      if (!slot.experience_id || slot.experience_id !== CERAMICS_EXPERIENCE_ID) return false;
      if (!slot.date || !slot.is_available) return false;
      try {
        const slotDate = new Date(slot.date);
        return slotDate.toDateString() === selectedDate.toDateString();
      } catch {
        return false;
      }
    });
  };

  // Calcular preço total
  const totalPrice = selectedPeople * 200;

  // Resetar seleções quando data ou horário mudarem
  const handleDateChange = (value: Value) => {
    setSelectedDate(value);
    setSelectedTime(''); // Reset horário quando data muda
    // Pessoas mantém o valor padrão (2)
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
  };

  // Obter horários da data selecionada com key único para forçar re-render
  const currentDateKey = selectedDate instanceof Date ? selectedDate.toDateString() : 'no-date';

  return (
    <>
      {/* Header Fixo */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 w-full px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled 
            ? 'bg-cream border-b border-verde/20 py-3 sm:py-4 lg:py-4' 
            : 'bg-transparent py-4 sm:py-6 lg:py-8'
        }`}
      >
        <div className="flex items-center justify-between">
          {/* Logo e Nome */}
          <div className="flex items-center gap-2 sm:gap-4">
            <a 
              href="/"
              className="w-12 h-12 sm:w-20 sm:h-20 lg:w-24 lg:h-24 flex items-center justify-center p-1 sm:p-2 cursor-pointer hover:opacity-80 transition-opacity duration-200"
              title="Casa Alvite - Home"
            >
              <Image
                src="/images/logo/logo.svg"
                alt="Casa Alvite Logo"
                width={96}
                height={96}
                className={`w-full h-full transition-all duration-300 ${
                  isScrolled ? 'brightness-0 saturate-100' : ''
                }`}
                style={isScrolled ? { filter: 'brightness(0) saturate(100%) invert(38%) sepia(12%) saturate(1088%) hue-rotate(56deg) brightness(93%) contrast(89%)' } : {}}
                priority
              />
            </a>
            <h2 className={`font-instrument font-medium text-sm sm:text-2xl lg:text-[30px] tracking-wide transition-colors duration-300 ${
              isScrolled ? 'text-verde' : 'text-cream'
            }`}>
              CASA ALVITE
            </h2>
          </div>

          {/* Ícones de Redes Sociais */}
          <div className="flex items-center gap-1 sm:gap-4 lg:gap-6">
            <a 
              href="https://wa.me/5521991792065" 
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-colors duration-300 cursor-pointer ${
                isScrolled 
                  ? 'text-verde hover:text-verde/80' 
                  : 'text-cream hover:text-cream/80'
              }`}
              title="WhatsApp"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
              </svg>
            </a>
            
            <a 
              href="https://instagram.com/casa.alvite" 
              target="_blank"
              rel="noopener noreferrer"
              className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex items-center justify-center transition-colors duration-300 cursor-pointer ${
                isScrolled 
                  ? 'text-verde hover:text-verde/80' 
                  : 'text-cream hover:text-cream/80'
              }`}
              title="Instagram"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-9 lg:h-9" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </div>
      </header>

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

            {/* Botão de Agendar */}
            <button 
              onClick={scrollToNextSection}
              className="bg-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-sm sm:text-base lg:text-lg px-6 sm:px-8 lg:px-10 h-12 sm:h-16 rounded-2xl sm:rounded-[28px] transition-all duration-200 uppercase tracking-wide"
              type="button"
            >
              AGENDAR EXPERIÊNCIA
            </button>
          </div>
        </div>
      </main>

      {/* Seção Experiência de Cerâmica */}
      <section id="next-section" className="min-h-screen bg-cream w-full relative overflow-hidden pt-20 sm:pt-24 lg:pt-8">
        {/* Layout Mobile: Igual à referência */}
        <div className="lg:hidden flex flex-col min-h-screen">
          {/* Imagem na parte superior - um pouco menor que a tela */}
          <div className="flex-1 relative px-4">
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <Image
                src="/images/experience-2.png"
                alt="Experiência de Cerâmica - Pessoas fazendo cerâmica"
                width={400}
                height={600}
                className="w-full h-full object-cover object-bottom"
                style={{ objectPosition: '50% 80%' }}
                priority
              />
            </div>
          </div>
          
          {/* Quadrado verde sobrepondo a parte inferior da imagem */}
          <div className="relative -mt-20 sm:-mt-24 z-10">
            <div className="bg-verde px-6 sm:px-8 pt-8 sm:pt-10 pb-8 sm:pb-12 space-y-6 sm:space-y-8">
              <h2 className="font-junyper text-4xl sm:text-5xl text-cream font-normal leading-tight">
                EXPERIÊNCIA DE CERÂMICA
              </h2>
              
              <p className="text-cream/90 text-base sm:text-lg leading-relaxed font-instrument">
                Aqui você vive uma experiência exclusiva de modelagem e pintura em cerâmica, em um ambiente reservado só para o seu grupo. Traga quem ama, seus petiscos e bebidas, e aproveite duas horas de criatividade e muita conversa.
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 sm:gap-8">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center text-cream font-instrument text-sm sm:text-base">
                    <span className="mr-2">—</span>
                    <span>2 a 5 pessoas</span>
                  </div>
                  <div className="flex items-center text-cream font-instrument text-sm sm:text-base">
                    <span className="mr-2">—</span>
                    <span>R$200 por pessoa</span>
                  </div>
                  <div className="flex items-center text-cream font-instrument text-sm sm:text-base">
                    <span className="mr-2">—</span>
                    <span>2 horas de experiência</span>
                  </div>
                </div>
                
                <button 
                  onClick={scrollToBookingSection}
                  className="bg-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-sm sm:text-base px-8 sm:px-10 h-12 sm:h-16 rounded-2xl transition-all duration-200 uppercase tracking-wide flex-shrink-0"
                  type="button"
                >
                  RESERVAR
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Desktop: Grid com distâncias equidistantes */}
        <div className="hidden lg:flex lg:items-center lg:justify-center lg:min-h-screen lg:px-8 xl:px-12">
          <div className="w-full max-w-7xl mx-auto flex items-center gap-8 xl:gap-12">
            
            {/* Quadrado verde - 2/3 da largura */}
            <div className="flex-[2]">
              <div className="bg-verde rounded-3xl p-10 xl:p-12 space-y-8 h-[500px] xl:h-[600px] flex flex-col justify-center">
                <h2 className="font-junyper text-5xl xl:text-6xl text-cream font-normal leading-tight">
                  EXPERIÊNCIA DE CERÂMICA
                </h2>
                
                <p className="text-cream/90 text-xl xl:text-2xl leading-relaxed font-instrument">
                  Aqui você vive uma experiência exclusiva de modelagem e pintura em cerâmica, em um ambiente reservado só para o seu grupo. Traga quem ama, seus petiscos e bebidas, e aproveite duas horas de criatividade e muita conversa.
                </p>
                
                                 <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 lg:gap-8">
                   <div className="space-y-4">
                     <div className="flex items-center text-cream font-instrument text-lg xl:text-xl">
                       <span className="mr-2">—</span>
                       <span>2 a 5 pessoas</span>
                     </div>
                     <div className="flex items-center text-cream font-instrument text-lg xl:text-xl">
                       <span className="mr-2">—</span>
                       <span>R$200 por pessoa</span>
                     </div>
                     <div className="flex items-center text-cream font-instrument text-lg xl:text-xl">
                       <span className="mr-2">—</span>
                       <span>2 horas de experiência</span>
                     </div>
                   </div>
                   
                   <button 
                     onClick={scrollToBookingSection}
                     className="bg-amarelo hover:bg-amarelo/90 text-cream font-instrument font-semibold text-lg xl:text-xl px-12 h-16 rounded-[28px] transition-all duration-200 uppercase tracking-wide flex-shrink-0"
                     type="button"
                   >
                     ESCOLHER DATA
                   </button>
                 </div>
              </div>
            </div>
            
            {/* Imagem - 1/3 da largura, mesma altura do quadrado */}
            <div className="flex-[1]">
                             <div className="h-[500px] xl:h-[600px] rounded-3xl overflow-hidden">
                 <Image
                   src="/images/experience-1.png"
                   alt="Experiência de Cerâmica - Pessoas fazendo cerâmica"
                   width={400}
                   height={600}
                   className="w-full h-full object-cover"
                   priority
                 />
               </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Seção de Agendamento */}
      <section id="booking-section" className="min-h-screen bg-cream w-full py-20 sm:py-24 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Título da seção */}
          <div className="text-left mb-12 lg:mb-16">
            <h2 className="font-instrument-serif italic text-3xl sm:text-4xl lg:text-5xl text-cinza font-normal mb-4">
              Selecione uma Data
            </h2>
            <p className="text-cinza/70 text-lg sm:text-xl font-instrument max-w-2xl">
              Escolha o dia, horário e número de pessoas para sua experiência
            </p>
          </div>

          {/* Layout Responsivo */}
          <div className="lg:grid lg:grid-cols-3 lg:gap-12 space-y-8 lg:space-y-0">
            
            {/* Coluna Esquerda - Calendário e Seleções */}
            <div className="lg:col-span-2 space-y-4">
              
                            {/* Calendário Duplo */}
              <div className="p-4 lg:p-6">
                {loading ? (
                   <div className="flex justify-center items-center h-64">
                     <div className="text-cinza text-lg">Carregando calendário...</div>
                   </div>
                ) : (
                   <>
                     {/* Mobile: Um calendário */}
                     <div className="md:hidden">
                       <div className="calendar-wrapper">
                         <Calendar
                           onChange={handleDateChange}
                           value={selectedDate}
                           locale="pt-BR"
                           tileDisabled={tileDisabled}
                           tileClassName={tileClassName}
                           className="minimal-calendar"
                           minDate={new Date()}
                           showNeighboringMonth={false}
                         />
                       </div>
                     </div>

                     {/* Desktop: Dois calendários */}
                     <div className="hidden md:grid md:grid-cols-2 gap-6">
                       {/* Mês Atual */}
                       <div className="calendar-wrapper">
                         <Calendar
                           onChange={handleDateChange}
                           value={selectedDate}
                           locale="pt-BR"
                           tileDisabled={tileDisabled}
                           tileClassName={tileClassName}
                           className="minimal-calendar"
                           minDate={new Date()}
                           showNeighboringMonth={false}
                         />
                       </div>
                       
                       {/* Próximo Mês */}
                       <div className="calendar-wrapper">
                         <Calendar
                           onChange={handleDateChange}
                           value={selectedDate}
                           locale="pt-BR"
                           tileDisabled={tileDisabled}
                           tileClassName={tileClassName}
                           className="minimal-calendar"
                           minDate={new Date()}
                           showNeighboringMonth={false}
                           activeStartDate={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)}
                         />
                       </div>
                     </div>

                     {/* Legenda */}
                     <div className="flex items-center justify-center gap-6 mt-6 text-sm">
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-amarelo"></div>
                         <span className="text-cinza">Disponível</span>
                       </div>
                       <div className="flex items-center gap-2">
                         <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                         <span className="text-cinza/80">Indisponível</span>
                       </div>
                     </div>
                   </>
                 )}
              </div>

                            {/* Seleção de Horário - Só aparece após selecionar data */}
              {selectedDate instanceof Date && getAvailableTimesForDate().length > 0 && (
                <div key={`times-${currentDateKey}`} className="p-4 lg:p-6">
                  <h3 className="text-xl lg:text-2xl font-instrument-serif italic font-normal text-cinza mb-4">
                    Selecione o horário
                  </h3>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {getAvailableTimesForDate().map((slot, index) => (
                      <button
                        key={`${currentDateKey}-${slot.experience_id}-${index}`}
                        onClick={() => handleTimeChange(slot.start_time)}
                        className={`py-3 px-4 rounded-xl border font-instrument font-medium transition-all duration-200 ${
                          selectedTime === slot.start_time
                            ? 'bg-amarelo border-amarelo text-cream'
                            : 'bg-transparent border-cinza/30 text-cinza hover:border-amarelo hover:bg-amarelo/10'
                        }`}
                      >
                        {formatTime(slot.start_time)}
                      </button>
                    ))}
                  </div>
                </div>
              )}

                            {/* Seleção de Quantidade - Só aparece após selecionar horário */}
              {selectedDate instanceof Date && selectedTime && (
                <div key={`people-${currentDateKey}-${selectedTime}`} className="p-4 lg:p-6">
                  <h3 className="text-xl lg:text-2xl font-instrument-serif italic font-normal text-cinza mb-4">
                    Número de pessoas
                  </h3>
                  
                  <div className="grid grid-cols-4 gap-3">
                    {[2, 3, 4, 5].map(num => (
                      <button
                        key={`${currentDateKey}-${selectedTime}-${num}`}
                        onClick={() => setSelectedPeople(num)}
                        className={`py-3 px-4 rounded-xl border font-instrument font-medium transition-all duration-200 ${
                          selectedPeople === num
                            ? 'bg-amarelo border-amarelo text-cream'
                            : 'bg-transparent border-cinza/30 text-cinza hover:border-amarelo hover:bg-amarelo/10'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coluna Direita - Resumo do Agendamento */}
            <div className="lg:col-span-1">
                             <div className="bg-verde rounded-3xl p-6 lg:p-8 space-y-6 sticky top-40">
                <h3 className="text-xl lg:text-2xl font-instrument font-semibold text-cream text-center">
                  DESCRIÇÃO DO<br />AGENDAMENTO
                </h3>
                
                <div className="space-y-4">
                  {/* Nome do Serviço */}
                  <div className="text-cream">
                    <div className="font-instrument font-medium text-sm text-cream/80 uppercase tracking-wide mb-1">
                      Serviço
                    </div>
                    <div className="font-junyper text-xl">
                      Experiência de Cerâmica
                    </div>
                  </div>

                  {/* Data Selecionada */}
                  <div className="text-cream">
                    <div className="font-instrument font-medium text-sm text-cream/80 uppercase tracking-wide mb-1">
                      Data
                    </div>
                    <div className="font-instrument text-lg">
                      {selectedDate instanceof Date 
                        ? selectedDate.toLocaleDateString('pt-BR', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })
                        : 'Nenhuma data selecionada'
                      }
                    </div>
                  </div>

                  {/* Horário Selecionado */}
                  <div className="text-cream">
                    <div className="font-instrument font-medium text-sm text-cream/80 uppercase tracking-wide mb-1">
                      Horário
                    </div>
                                         <div className="font-instrument text-lg">
                       {selectedTime ? formatTime(selectedTime) : 'Nenhum horário selecionado'}
                     </div>
                  </div>

                  {/* Quantidade de Pessoas */}
                  <div className="text-cream">
                    <div className="font-instrument font-medium text-sm text-cream/80 uppercase tracking-wide mb-1">
                      Pessoas
                    </div>
                    <div className="font-instrument text-lg">
                      {selectedPeople} {selectedPeople === 1 ? 'pessoa' : 'pessoas'}
                    </div>
                  </div>

                  {/* Preço Total */}
                  <div className="pt-4 border-t border-cream/20">
                    <div className="text-cream">
                      <div className="font-instrument font-medium text-sm text-cream/80 uppercase tracking-wide mb-1">
                        Total
                      </div>
                      <div className="font-junyper text-2xl lg:text-3xl">
                        R$ {totalPrice.toLocaleString('pt-BR')}
                      </div>
                      <div className="font-instrument text-sm text-cream/80 mt-1">
                        R$ 200 por pessoa
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Confirmar */}
                <button 
                  disabled={!selectedDate || !selectedTime}
                  className={`w-full h-12 lg:h-14 rounded-2xl font-instrument font-semibold text-sm lg:text-base uppercase tracking-wide transition-all duration-200 ${
                    selectedDate && selectedTime
                      ? 'bg-amarelo hover:bg-amarelo/90 text-cream cursor-pointer'
                      : 'bg-cream/20 text-cream/50 cursor-not-allowed'
                  }`}
                  type="button"
                >
                  Confirmar Agendamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-verde text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Logo e Nome */}
            <div className="flex items-center gap-3">
              <Image
                src="/images/logo/logo.svg"
                alt="Casa Alvite Logo"
                width={24}
                height={24}
                className="brightness-0 invert"
                priority
              />
              <h3 className="text-lg font-instrument font-medium tracking-wide">
                CASA ALVITE
              </h3>
            </div>

            {/* Contatos e Copyright */}
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-sm font-instrument">
                <a 
                  href="https://wa.me/5521991792065" 
                  className="text-cream/90 hover:text-amarelo transition-colors flex items-center gap-1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  📞 (21) 99179-2065
                </a>
                <a 
                  href="mailto:contato@alvite.com.br" 
                  className="text-cream/90 hover:text-amarelo transition-colors flex items-center gap-1"
                >
                  📧 contato@alvite.com.br
                </a>
              </div>
              
              {/* Copyright */}
              <p className="text-cream/80 text-sm font-instrument text-center">
                © 2025 Casa Alvite. Todos os direitos reservados.
              </p>
            </div>

            {/* Redes Sociais */}
            <div className="flex items-center gap-3">
              <a 
                href="https://wa.me/5521991792065" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-cream/10 rounded-full flex items-center justify-center text-cream hover:bg-amarelo hover:text-verde transition-all duration-200"
                title="WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              
              <a 
                href="https://instagram.com/casa.alvite" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-cream/10 rounded-full flex items-center justify-center text-cream hover:bg-amarelo hover:text-verde transition-all duration-200"
                title="Instagram"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
            
          </div>
        </div>
        
        {/* Imagem decorativa no final */}
        <div className="w-full">
          <Image
            src="/images/footer-ceramics.png"
            alt="Cerâmicas decorativas"
            width={1200}
            height={80}
            className="w-full h-16 sm:h-20 md:h-24 object-contain"
            priority={false}
          />
        </div>
      </footer>

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
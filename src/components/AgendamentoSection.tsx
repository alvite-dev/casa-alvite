'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AvailableSlot {
  id: string;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  max_capacity?: number | null;
  current_bookings?: number | null;
  created_at: string;
  updated_at?: string;
  experience_id?: string;
}

interface Experience {
  id: string;
  name: string;
  duration: string;
  price: number;
  created_at: string;
  updated_at?: string;
}

export default function AgendamentoSection() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);
  const [numberOfPeople, setNumberOfPeople] = useState<number>(2);
  const [experience, setExperience] = useState<Experience | null>(null);
  const [experienceLoading, setExperienceLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<number>(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    email: '',
    phone: ''
  });


  const refreshData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/available-slots', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      if (!response.ok) {
        throw new Error('Erro ao buscar dados');
      }
      const data = await response.json();
      console.log('Dados atualizados:', data);
      setAvailableSlots(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  // Buscar dados da experiência
  useEffect(() => {
    async function fetchExperience() {
      try {
        setExperienceLoading(true);
        const response = await fetch('/api/experiences', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar dados da experiência');
        }
        const data = await response.json();
        // Pega a primeira experiência por enquanto (pode ser modificado depois)
        if (data && data.length > 0) {
          setExperience(data[0]);
        }
      } catch (err) {
        console.error('Erro ao buscar experiência:', err);
      } finally {
        setExperienceLoading(false);
      }
    }

    fetchExperience();
  }, []);

  // Buscar dados do Supabase quando o componente carregar
  useEffect(() => {
    async function fetchAvailableSlots() {
      try {
        setLoading(true);
        const response = await fetch('/api/available-slots', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
        if (!response.ok) {
          throw new Error('Erro ao buscar dados');
        }
        const data = await response.json();
        console.log('Dados recebidos da API:', data);
        console.log('Total de slots:', data.length);
        setAvailableSlots(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    }

    fetchAvailableSlots();
  }, []);

  // Extrair todas as datas que têm slots (disponíveis ou não)
  const allDatesWithSlots = availableSlots
    .filter(slot => slot.date)
    .map(slot => {
      try {
        return new Date(slot.date!);
      } catch {
        return null;
      }
    })
    .filter(date => date !== null) as Date[];

  // Extrair apenas datas que têm slots disponíveis
  const availableDates = availableSlots
    .filter(slot => slot.date && slot.is_available)
    .map(slot => {
      try {
        return new Date(slot.date!);
      } catch {
        return null;
      }
    })
    .filter(date => date !== null) as Date[];

  // Log para debug
  console.log('Total de slots:', availableSlots.length);
  console.log('Datas com slots:', allDatesWithSlots.map(d => d.toISOString().split('T')[0]));
  console.log('Datas disponíveis:', availableDates.map(d => d.toISOString().split('T')[0]));

  // Função para verificar se uma data tem algum slot (disponível ou não)
  const hasAnySlots = (date: Date) => {
    return allDatesWithSlots.some(slotDate => 
      date.getFullYear() === slotDate.getFullYear() &&
      date.getMonth() === slotDate.getMonth() &&
      date.getDate() === slotDate.getDate()
    );
  };

  // Função para verificar se uma data tem slots disponíveis
  const hasAvailableSlots = (date: Date) => {
    return availableDates.some(availableDate => 
      date.getFullYear() === availableDate.getFullYear() &&
      date.getMonth() === availableDate.getMonth() &&
      date.getDate() === availableDate.getDate()
    );
  };

  // Função para desabilitar apenas datas passadas e datas sem nenhum slot
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      // Desabilitar datas passadas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) return true;
      
      // Desabilitar se não tem nenhum slot (nem disponível nem indisponível)
      return !hasAnySlots(date);
    }
    return false;
  };

  // Função para adicionar classes CSS customizadas
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const classes = [];
      
      // Adiciona classe para dias com horários disponíveis
      if (hasAvailableSlots(date)) {
        classes.push('available-date');
      }
      // Adiciona classe para dias com todos os horários indisponíveis
      else if (hasAnySlots(date) && !hasAvailableSlots(date)) {
        classes.push('unavailable-date');
      }
      
      // Mantém o dia selecionado sempre destacado
      if (selectedDate instanceof Date && 
          date.toDateString() === selectedDate.toDateString()) {
        classes.push('selected-date');
      }
      
      return classes.join(' ') || null;
    }
    return null;
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '--:--';
    return timeString.slice(0, 5); // Remove os segundos
  };

  const formatTimeRange = (startTime: string | null | undefined) => {
    if (!startTime) return '--:-- - --:--';
    const start = startTime.slice(0, 5);
    
    // Adiciona 2 horas ao horário de início
    const [hours, minutes] = start.split(':').map(Number);
    const endHours = (hours + 2) % 24;
    const end = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    
    return `${start} - ${end}`;
  };

  const formatDuration = (durationInMinutes: string | number | undefined) => {
    if (!durationInMinutes) return 'Carregando...';
    const minutes = typeof durationInMinutes === 'string' ? parseInt(durationInMinutes) : durationInMinutes;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} minutos de duração`;
    } else if (remainingMinutes === 0) {
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} de duração`;
    } else {
      return `${hours}h${remainingMinutes}min de duração`;
    }
  };

  // Obter todos os slots da data selecionada (disponíveis e indisponíveis)
  const allSlotsForSelectedDate = selectedDate instanceof Date ? 
    availableSlots.filter(slot => {
      if (!slot.date) return false;
      try {
        const slotDate = new Date(slot.date);
        return slotDate.toDateString() === selectedDate.toDateString();
      } catch {
        return false;
      }
    }) : [];

  // Obter apenas slots disponíveis da data selecionada
  const slotsForSelectedDate = allSlotsForSelectedDate.filter(slot => slot.is_available);

  const handleSlotSelection = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handlePeopleChange = (count: number) => {
    setNumberOfPeople(count);
  };

  const handleDateChange = (date: Value) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Limpa o slot selecionado quando muda a data
    setNumberOfPeople(2); // Reset para 2 pessoas quando muda a data
    // Remove step 1 from completed if changing date
    setCompletedSteps(prev => prev.filter(step => step !== 1));
  };

  const handleSlotSelectionWithAccordion = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handlePeopleChangeWithAccordion = (count: number) => {
    setNumberOfPeople(count);
  };

  const handleContinueStep1 = () => {
    if (selectedDate && selectedSlot) {
      if (!completedSteps.includes(1)) {
        setCompletedSteps(prev => [...prev, 1]);
      }
      setActiveAccordion(2);
    }
  };

  const handleContinueStep2 = () => {
    if (numberOfPeople >= 2) {
      if (!completedSteps.includes(2)) {
        setCompletedSteps(prev => [...prev, 2]);
      }
      setActiveAccordion(3);
    }
  };

  const handleContinueStep3 = () => {
    if (personalInfo.name && personalInfo.email && personalInfo.phone) {
      if (!completedSteps.includes(3)) {
        setCompletedSteps(prev => [...prev, 3]);
      }
      setActiveAccordion(0); // Close all accordions when done
    }
  };

  const handlePersonalInfoChange = (field: string, value: string) => {
    setPersonalInfo(prev => ({ ...prev, [field]: value }));
  };

  const toggleAccordion = (stepNumber: number) => {
    setActiveAccordion(activeAccordion === stepNumber ? 0 : stepNumber);
  };

  // Check if a step can be accessed
  const canAccessStep = (stepNumber: number) => {
    if (stepNumber === 1) return true;
    if (stepNumber === 2) return completedSteps.includes(1);
    if (stepNumber === 3) return completedSteps.includes(2);
    return false;
  };

  // Check if all steps are completed
  const allStepsCompleted = completedSteps.includes(1) && completedSteps.includes(2) && completedSteps.includes(3);

  const handleBooking = async () => {
    if (!selectedSlot || !(selectedDate instanceof Date) || !experience) return;
    
    setBookingLoading(true);
    setBookingMessage(null);
    
    try {
      // Verificar se o horário ainda está disponível
      const checkResponse = await fetch('/api/available-slots', {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      
      if (!checkResponse.ok) {
        throw new Error('Erro ao verificar disponibilidade');
      }
      
      const currentSlots = await checkResponse.json();
      const currentSlot = currentSlots.find((slot: AvailableSlot) => slot.id === selectedSlot.id);
      
      if (!currentSlot || !currentSlot.is_available) {
        setBookingMessage('❌ Este horário não está mais disponível. Por favor, escolha outro horário.');
        setAvailableSlots(currentSlots);
        setSelectedSlot(null);
        return;
      }
      
      // Criar a reserva
      const bookingData = {
        slot_id: selectedSlot.id,
        name: personalInfo.name,
        email: personalInfo.email,
        phone: personalInfo.phone,
        number_of_people: numberOfPeople
      };
      
      const bookingResponse = await fetch('/api/booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
      
      const result = await bookingResponse.json();
      
      if (!bookingResponse.ok) {
        throw new Error(result.error || 'Erro ao criar reserva');
      }
      
      // Sucesso! Redirecionar para página de confirmação
      router.push(`/confirmacao/${result.booking_id}`);
      
    } catch (error) {
      console.error('Erro ao criar reserva:', error);
      setBookingMessage(`❌ ${error instanceof Error ? error.message : 'Erro ao processar reserva. Tente novamente.'}`);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <section className="pb-12 bg-cream min-h-screen">
      <div className="container mx-auto px-8">

        {/* Header com título e texto à esquerda */}
        <div className="mb-16">
          <div className="max-w-2xl">
            <h1 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-6">
              Agende sua Experiência
            </h1>
            <p className="text-lg text-cinza font-instrument leading-relaxed">
              Escolha a data e horário perfeitos para sua experiência única na Casa Alvite. 
            </p>
          </div>
        </div>

        <div className="max-w-5xl">
          {loading && (
            <div className="flex items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde"></div>
              <span className="ml-4 text-gray-600">Carregando horários disponíveis...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-8">
              <strong>Ops!</strong> Houve um problema ao carregar os horários. Tente novamente mais tarde.
            </div>
          )}

          {!loading && !error && (
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
              {/* Área Principal - Accordion de Agendamento */}
              <div className="flex-1 lg:max-w-2xl">
                <div className="space-y-4">
                  {/* Accordion 1: Data e Horário */}
                  <div className="border border-cinza bg-cream/20 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleAccordion(1)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between bg-cream/30 hover:bg-cream/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {completedSteps.includes(1) ? (
                          <div className="w-6 h-6 bg-verde rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-cream border border-cinza/40 rounded-full flex items-center justify-center text-cinza text-sm font-semibold">
                            1
                          </div>
                        )}
                        <span className="text-lg font-medium text-cinza">Data e Horário</span>
                      </div>
                      <svg 
                        className={`w-5 h-5 text-cinza/60 transition-transform duration-200 ${
                          activeAccordion === 1 ? 'rotate-180' : ''
                        }`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {activeAccordion === 1 && (
                      <div className="px-6 py-6 border-t border-cinza/20 accordion-content">
                        {/* Calendário Minimalista */}
                        <div className="mb-8">
                          <h4 className="text-base font-medium text-cinza mb-4">
                            Escolha sua Data
                          </h4>
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
                              formatShortWeekday={(locale, date) => {
                                // Padrão: Domingo=0, Segunda=1, Terça=2, Quarta=3, Quinta=4, Sexta=5, Sábado=6
                                const days = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']; // Dom, Seg, Ter, Qua, Qui, Sex, Sab
                                return days[date.getDay()];
                              }}
                            />
                          </div>
                        </div>

                        {/* Horários Minimalistas - Só aparece após selecionar data */}
                        {selectedDate instanceof Date && hasAnySlots(selectedDate) && (
                          <div>
                            <h4 className="text-base font-medium text-cinza mb-4">
                              Escolha seu Horário
                            </h4>
                            
                            {allSlotsForSelectedDate.length > 0 ? (
                              <div className="space-y-3">
                                {allSlotsForSelectedDate.map(slot => (
                                  <button
                                    key={slot.id}
                                    onClick={() => slot.is_available ? handleSlotSelectionWithAccordion(slot) : null}
                                    disabled={!slot.is_available}
                                    className={`inline-block px-5 py-2.5 mr-2 mb-2 rounded-md border transition-all duration-200 text-sm font-medium ${
                                      !slot.is_available
                                        ? 'border-cinza/30 bg-cinza/10 text-cinza/50 cursor-not-allowed'
                                        : selectedSlot?.id === slot.id
                                        ? 'border-cinza bg-cinza text-cream'
                                        : 'border-cream bg-cream/30 text-cinza hover:border-cinza/50 hover:bg-cream/60'
                                    }`}
                                  >
                                    <span className={!slot.is_available ? 'line-through' : ''}>
                                      {formatTime(slot.start_time)}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <div className="py-8">
                                <p className="text-gray-500">
                                  Nenhum horário disponível para esta data
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  Escolha outra data no calendário
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Botão Continuar */}
                        {selectedDate && selectedSlot && (
                          <div className="mt-8 pt-6 border-t border-cinza/20">
                            <button
                              onClick={handleContinueStep1}
                              className="w-full py-3 px-4 bg-verde text-cream font-medium rounded-md hover:bg-verde/90 transition-colors text-sm"
                            >
                              Continuar para Participantes
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Accordion 2: Número de Participantes */}
                  <div className={`border rounded-xl overflow-hidden ${
                    canAccessStep(2) ? 'border-cinza bg-cream/20' : 'border-cinza/50 bg-cream/10'
                  }`}>
                    <button
                      onClick={() => canAccessStep(2) && toggleAccordion(2)}
                      className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                        canAccessStep(2) 
                          ? 'bg-cream/30 hover:bg-cream/50 cursor-pointer' 
                          : 'bg-cream/15 cursor-not-allowed opacity-60'
                      }`}
                      disabled={!canAccessStep(2)}
                    >
                      <div className="flex items-center gap-3">
                        {completedSteps.includes(2) ? (
                          <div className="w-6 h-6 bg-verde rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold ${
                            canAccessStep(2) 
                              ? 'bg-cream border-cinza/40 text-cinza' 
                              : 'bg-cream/50 border-cinza/20 text-cinza/40'
                          }`}>
                            2
                          </div>
                        )}
                        <span className={`text-lg font-medium ${canAccessStep(2) ? 'text-cinza' : 'text-cinza/40'}`}>
                          Número de Participantes
                        </span>
                      </div>
                      {canAccessStep(2) && (
                        <svg 
                          className={`w-5 h-5 text-cinza/60 transition-transform duration-200 ${
                            activeAccordion === 2 ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    
                    {activeAccordion === 2 && canAccessStep(2) && (
                      <div className="px-6 py-6 border-t border-cinza/20 accordion-content">
                        <h4 className="text-base font-medium text-cinza mb-4">
                          Quantas Pessoas?
                        </h4>
                        
                        <div className="flex items-center gap-4">
                          <label htmlFor="numberOfPeople" className="text-sm text-gray-600">
                            Pessoas:
                          </label>
                          <select
                            id="numberOfPeople"
                            value={numberOfPeople}
                            onChange={(e) => handlePeopleChangeWithAccordion(Number(e.target.value))}
                            className="px-3 py-2 border border-gray-300 bg-cream/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza font-medium"
                          >
                            <option value={2}>2 pessoas</option>
                            <option value={3}>3 pessoas</option>
                            <option value={4}>4 pessoas</option>
                            <option value={5}>5 pessoas</option>
                            <option value={6}>6 pessoas</option>
                          </select>
                        </div>
                        
                        {/* Botão Continuar */}
                        <div className="mt-8 pt-6 border-t border-cinza/20">
                          <button
                            onClick={handleContinueStep2}
                            className="w-full py-3 px-4 bg-verde text-cream font-medium rounded-md hover:bg-verde/90 transition-colors text-sm"
                          >
                            Continuar para Informações
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accordion 3: Informações Pessoais */}
                  <div className={`border rounded-xl overflow-hidden ${
                    canAccessStep(3) ? 'border-cinza bg-cream/20' : 'border-cinza/50 bg-cream/10'
                  }`}>
                    <button
                      onClick={() => canAccessStep(3) && toggleAccordion(3)}
                      className={`w-full px-6 py-4 text-left flex items-center justify-between transition-colors ${
                        canAccessStep(3) 
                          ? 'bg-cream/30 hover:bg-cream/50 cursor-pointer' 
                          : 'bg-cream/15 cursor-not-allowed opacity-60'
                      }`}
                      disabled={!canAccessStep(3)}
                    >
                      <div className="flex items-center gap-3">
                        {completedSteps.includes(3) ? (
                          <div className="w-6 h-6 bg-verde rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-cream" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        ) : (
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-sm font-semibold ${
                            canAccessStep(3) 
                              ? 'bg-cream border-cinza/40 text-cinza' 
                              : 'bg-cream/50 border-cinza/20 text-cinza/40'
                          }`}>
                            3
                          </div>
                        )}
                        <span className={`text-lg font-medium ${canAccessStep(3) ? 'text-cinza' : 'text-cinza/40'}`}>
                          Informações Pessoais
                        </span>
                      </div>
                      {canAccessStep(3) && (
                        <svg 
                          className={`w-5 h-5 text-cinza/60 transition-transform duration-200 ${
                            activeAccordion === 3 ? 'rotate-180' : ''
                          }`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      )}
                    </button>
                    
                    {activeAccordion === 3 && canAccessStep(3) && (
                      <div className="px-6 py-6 border-t border-cinza/20 accordion-content">
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-cinza mb-1">
                              Nome Completo*
                            </label>
                            <input
                              type="text"
                              id="name"
                              value={personalInfo.name}
                              onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                              className="w-full px-3 py-2 border border-cinza/30 bg-cream/30 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza placeholder-cinza/60"
                              placeholder="Digite seu nome completo"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-cinza mb-1">
                              E-mail*
                            </label>
                            <input
                              type="email"
                              id="email"
                              value={personalInfo.email}
                              onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                              className="w-full px-3 py-2 border border-cinza/30 bg-cream/30 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza placeholder-cinza/60"
                              placeholder="Digite seu e-mail"
                              required
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-cinza mb-1">
                              Telefone*
                            </label>
                            <input
                              type="tel"
                              id="phone"
                              value={personalInfo.phone}
                              onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                              className="w-full px-3 py-2 border border-cinza/30 bg-cream/30 rounded-md focus:outline-none focus:ring-2 focus:ring-verde focus:border-verde text-cinza placeholder-cinza/60"
                              placeholder="Digite seu telefone"
                              required
                            />
                          </div>
                        </div>
                        
                        {/* Botão Continuar */}
                        <div className="mt-8 pt-6 border-t border-cinza/20">
                          <button
                            onClick={handleContinueStep3}
                            disabled={!personalInfo.name || !personalInfo.email || !personalInfo.phone}
                            className={`w-full py-3 px-4 font-medium rounded-md transition-colors text-sm ${
                              personalInfo.name && personalInfo.email && personalInfo.phone
                                ? 'bg-verde text-cream hover:bg-verde/90'
                                : 'bg-cream/50 text-cinza/40 cursor-not-allowed border border-cinza/30'
                            }`}
                          >
                            Finalizar Informações
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Card de Resumo - Desktop */}
              <div className="hidden lg:block">
                <div className="sticky top-32 w-80">
                  <div className="bg-verde border border-verde rounded-2xl p-6 backdrop-blur-sm shadow-lg">
                    <h3 className="text-lg font-medium text-cream mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amarelo rounded-full"></span>
                      Resumo da Experiência
                    </h3>
                    
                    <div className="space-y-4">
                      {/* Nome da Experiência */}
                      <div className="pb-3 border-b border-cream/30">
                        <p className="text-sm text-cream/70 mb-1">Experiência</p>
                        <p className="text-base font-medium text-cream">{experience?.name || 'Carregando...'}</p>
                        <p className="text-xs text-cream/60 mt-1">{formatDuration(experience?.duration)}</p>
                      </div>

                      {/* Data */}
                      <div className="pb-3 border-b border-cream/30">
                        <p className="text-sm text-cream/70 mb-1">Data</p>
                        {selectedDate instanceof Date ? (
                          <p className="text-base font-medium text-cream">
                            {selectedDate.toLocaleDateString('pt-BR', { 
                              weekday: 'short', 
                              day: 'numeric', 
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        ) : (
                          <p className="text-sm text-cream/50 italic">Selecione uma data</p>
                        )}
                      </div>

                      {/* Horário */}
                      <div className="pb-3 border-b border-cream/30">
                        <p className="text-sm text-cream/70 mb-1">Horário</p>
                        {selectedSlot ? (
                          <p className="text-base font-medium text-cream">
                            {formatTimeRange(selectedSlot.start_time)}
                          </p>
                        ) : (
                          <p className="text-sm text-cream/50 italic">Selecione um horário</p>
                        )}
                      </div>

                      {/* Quantidade de Pessoas */}
                      {completedSteps.includes(2) && (
                        <div className="pb-3 border-b border-cream/30">
                          <p className="text-sm text-cream/70 mb-1">Pessoas</p>
                          <p className="text-base font-medium text-cream">
                            {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                          </p>
                        </div>
                      )}

                      {/* Informações Pessoais */}
                      {completedSteps.includes(3) && (
                        <div className="pb-3 border-b border-cream/30">
                          <p className="text-sm text-cream/70 mb-1">Contato</p>
                          <p className="text-base font-medium text-cream">{personalInfo.name}</p>
                          <p className="text-xs text-cream/60 mt-1">{personalInfo.email}</p>
                          <p className="text-xs text-cream/60">{personalInfo.phone}</p>
                        </div>
                      )}

                      {/* Valor */}
                      <div className="pb-3 border-b border-cream/30">
                        <p className="text-sm text-cream/70 mb-1">Valor</p>
                        {completedSteps.includes(2) ? (
                          <>
                            <p className="text-xl font-semibold text-cream">R$ {((experience?.price || 120) * numberOfPeople).toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-cream/60">
                              R$ {experience?.price || 120} × {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-semibold text-cream">R$ {experience?.price || 120}</p>
                            <p className="text-xs text-cream/60">por pessoa</p>
                          </>
                        )}
                      </div>

                      {/* Mensagem de Status */}
                      {bookingMessage && (
                        <div className={`p-3 rounded-md text-sm font-medium ${
                          bookingMessage.includes('✅') 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {bookingMessage}
                        </div>
                      )}

                      {/* Botão de Confirmação */}
                      {allStepsCompleted && (
                        <div className="pt-2">
                          <button
                            onClick={handleBooking}
                            disabled={bookingLoading}
                            className={`w-full py-3 px-6 rounded-md font-medium transition-colors text-sm shadow-sm ${
                              bookingLoading 
                                ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                : 'bg-amarelo text-cream hover:bg-amarelo/90'
                            }`}
                          >
                            {bookingLoading ? (
                              <div className="flex items-center justify-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cream"></div>
                                Verificando...
                              </div>
                            ) : (
                              'Confirmar Agendamento'
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card de Resumo - Mobile */}
          <div className="lg:hidden mt-12">
            <div className="bg-verde border border-verde rounded-2xl p-6 backdrop-blur-sm shadow-lg">
                                  <h3 className="text-lg font-medium text-cream mb-4 flex items-center gap-2">
                      <span className="w-2 h-2 bg-amarelo rounded-full"></span>
                      Resumo da Experiência
                    </h3>
              
              <div className="space-y-4">
                {/* Nome da Experiência */}
                <div className="pb-3 border-b border-cream/50">
                                          <p className="text-sm text-cream/70 mb-1">Experiência</p>
                        <p className="text-base font-medium text-cream">{experience?.name || 'Carregando...'}</p>
                        <p className="text-xs text-cream/60 mt-1">{formatDuration(experience?.duration)}</p>
                </div>

                {/* Data */}
                <div className="pb-3 border-b border-cream/50">
                                          <p className="text-sm text-cream/70 mb-1">Data</p>
                        {selectedDate instanceof Date ? (
                          <p className="text-base font-medium text-cream">
                      {selectedDate.toLocaleDateString('pt-BR', { 
                        weekday: 'short', 
                        day: 'numeric', 
                        month: 'short',
                        year: 'numeric'
                      })}
                    </p>
                                          ) : (
                          <p className="text-sm text-cream/50 italic">Selecione uma data</p>
                        )}
                </div>

                {/* Horário */}
                <div className="pb-3 border-b border-cream/50">
                                          <p className="text-sm text-cream/70 mb-1">Horário</p>
                        {selectedSlot ? (
                          <p className="text-base font-medium text-cream">
                      {formatTimeRange(selectedSlot.start_time)}
                    </p>
                                          ) : (
                          <p className="text-sm text-cream/50 italic">Selecione um horário</p>
                        )}
                </div>

                {/* Quantidade de Pessoas */}
                {completedSteps.includes(2) && (
                  <div className="pb-3 border-b border-cream/50">
                    <p className="text-sm text-cream/70 mb-1">Pessoas</p>
                    <p className="text-base font-medium text-cream">
                      {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                    </p>
                  </div>
                )}

                {/* Informações Pessoais */}
                {completedSteps.includes(3) && (
                  <div className="pb-3 border-b border-cream/50">
                    <p className="text-sm text-cream/70 mb-1">Contato</p>
                    <p className="text-base font-medium text-cream">{personalInfo.name}</p>
                    <p className="text-xs text-cream/60 mt-1">{personalInfo.email}</p>
                    <p className="text-xs text-cream/60">{personalInfo.phone}</p>
                  </div>
                )}

                {/* Valor */}
                <div className="pb-3 border-b border-cream/50">
                                          <p className="text-sm text-cream/70 mb-1">Valor</p>
                        {completedSteps.includes(2) ? (
                          <>
                            <p className="text-xl font-semibold text-cream">R$ {((experience?.price || 120) * numberOfPeople).toLocaleString('pt-BR')}</p>
                            <p className="text-xs text-cream/60">
                              R$ {experience?.price || 120} × {numberOfPeople} {numberOfPeople === 1 ? 'pessoa' : 'pessoas'}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xl font-semibold text-cream">R$ {experience?.price || 120}</p>
                            <p className="text-xs text-cream/60">por pessoa</p>
                          </>
                        )}
                </div>

                {/* Mensagem de Status */}
                {bookingMessage && (
                  <div className={`p-3 rounded-md text-sm font-medium ${
                    bookingMessage.includes('✅') 
                      ? 'bg-green-100 text-green-800 border border-green-200' 
                      : 'bg-red-100 text-red-800 border border-red-200'
                  }`}>
                    {bookingMessage}
                  </div>
                )}

                {/* Botão de Confirmação */}
                {allStepsCompleted && (
                  <div className="pt-2">
                    <button
                      onClick={handleBooking}
                      disabled={bookingLoading}
                      className={`w-full py-3 px-6 rounded-md font-medium transition-colors text-sm shadow-sm ${
                        bookingLoading 
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                          : 'bg-amarelo text-cream hover:bg-amarelo/90'
                      }`}
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cream"></div>
                          Verificando...
                        </div>
                      ) : (
                        'Confirmar Agendamento'
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>

      <style jsx global>{`
        /* Estilos para acordeão */
        .accordion-content {
          animation: accordionOpen 0.3s ease-out;
        }
        
        @keyframes accordionOpen {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Calendário ultra-minimalista integrado com a página */
        .calendar-wrapper {
          display: flex;
          justify-content: flex-start;
        }

        .minimal-calendar {
          width: 100%;
          max-width: 480px;
          background: #F4E8DA;
          border: 1px solid rgba(244, 232, 218, 0.5);
          border-radius: 12px;
          font-family: inherit;
          line-height: 1.125em;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .minimal-calendar .react-calendar__navigation {
          display: flex;
          height: 48px;
          margin-bottom: 0;
          background: transparent;
          border-bottom: 1px solid rgba(244, 232, 218, 0.8);
          border-radius: 12px 12px 0 0;
        }

        .minimal-calendar .react-calendar__navigation button {
          color: #40413E;
          min-width: 40px;
          background: none;
          border: none;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }

        .minimal-calendar .react-calendar__navigation button:hover {
          background-color: rgba(244, 232, 218, 0.6);
          border-radius: 8px;
        }

        .minimal-calendar .react-calendar__navigation button:disabled {
          background-color: transparent;
          color: rgba(64, 65, 62, 0.4);
          cursor: default;
        }

        .minimal-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 500;
          font-size: 0.75em;
          color: rgba(64, 65, 62, 0.7);
          padding: 0.8em 0;
          background: transparent;
        }

        .minimal-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.4em 0.2em;
          flex: 1 1 14.285714%;
          max-width: 14.285714%;
          text-align: center;
          box-sizing: border-box;
          margin: 0;
        }

        /* Grid dos dias - manter estrutura flex mas forçar larguras iguais */
        .minimal-calendar .react-calendar__month-view__days {
          display: flex !important;
          flex-wrap: wrap !important;
          width: 100% !important;
        }

        .minimal-calendar .react-calendar__month-view__weekdays {
          display: flex !important;
          width: 100% !important;
        }

        .minimal-calendar .react-calendar__month-view__days__day {
          position: relative;
          padding: 0.8em 0.2em;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9em;
          color: #40413E;
          border-radius: 8px;
          margin: 1px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1 1 calc(14.285714% - 2px); /* 100% / 7 colunas - margin */
          max-width: calc(14.285714% - 2px);
          box-sizing: border-box;
        }

        /* Espaçamento melhorado para mobile */
        @media (max-width: 640px) {
          .minimal-calendar .react-calendar__month-view__days__day {
            padding: 1em 0.3em;
            margin: 2px;
            min-height: 48px;
            font-size: 1em;
            flex: 1 1 calc(14.285714% - 4px); /* Ajusta para margin maior */
            max-width: calc(14.285714% - 4px);
          }

          .minimal-calendar .react-calendar__month-view__weekdays__weekday {
            padding: 0.6em 0.3em;
            font-size: 0.8em;
          }

          .minimal-calendar {
            max-width: 100%;
          }

          .minimal-calendar .react-calendar__navigation {
            height: 52px;
          }

          .minimal-calendar .react-calendar__navigation button {
            font-size: 16px;
            min-width: 44px;
          }
        }

        /* Dias de hoje em diante - cor mais escura e destacada */
        .minimal-calendar .react-calendar__month-view__days__day:not(.react-calendar__tile--disabled) {
          color: #2d2e2b;
          font-weight: 500;
        }

        .minimal-calendar .react-calendar__month-view__days__day:not(.react-calendar__tile--disabled):hover {
          background-color: rgba(244, 232, 218, 0.8);
          color: #1f201d;
        }

        .minimal-calendar .react-calendar__month-view__days__day:hover {
          background-color: rgba(244, 232, 218, 0.7);
        }

        /* Dia selecionado - cor cinza igual ao horário - múltiplos seletores */
        .minimal-calendar .react-calendar__tile--active,
        .minimal-calendar .react-calendar__month-view__days__day--active,
        .minimal-calendar .react-calendar__tile--hasActive,
        .minimal-calendar .react-calendar__tile--active:enabled:hover,
        .minimal-calendar .react-calendar__tile--active:enabled:focus {
          background: #40413E !important;
          background-color: #40413E !important;
          color: #F4E8DA !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }

        /* Classe customizada para dia selecionado - alta especificidade */
        .minimal-calendar .react-calendar__month-view__days .selected-date,
        .minimal-calendar .react-calendar__month-view__days__day.selected-date,
        .minimal-calendar .selected-date {
          background: #40413E !important;
          background-color: #40413E !important;
          color: #F4E8DA !important;
          border-radius: 8px !important;
          font-weight: 600 !important;
        }

        /* Manter o dia selecionado destacado sempre - todos os estados */
        .minimal-calendar .selected-date:hover,
        .minimal-calendar .selected-date:focus,
        .minimal-calendar .selected-date:active {
          background: #40413E !important;
          background-color: #40413E !important;
          color: #F4E8DA !important;
        }

        /* Dias do passado - estilo mais sutil */
        .minimal-calendar .react-calendar__tile--disabled {
          background-color: rgba(244, 232, 218, 0.6) !important;
          color: rgba(64, 65, 62, 0.4) !important;
          cursor: not-allowed !important;
          opacity: 0.7;
        }

        .minimal-calendar .react-calendar__month-view__days__day:disabled {
          background-color: rgba(244, 232, 218, 0.6) !important;
          color: rgba(64, 65, 62, 0.4) !important;
          cursor: not-allowed !important;
          opacity: 0.7;
        }

        /* Datas com horários disponíveis - estilo delicado */
        .minimal-calendar .available-date {
          background-color: rgba(106, 109, 81, 0.1) !important;
          color: #6A6D51 !important;
          border-radius: 8px;
          font-weight: 500;
          position: relative;
        }

        .minimal-calendar .available-date:hover {
          background-color: rgba(106, 109, 81, 0.2) !important;
        }

        .minimal-calendar .available-date::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: #6A6D51;
          border-radius: 50%;
          opacity: 0.6;
        }

        /* Datas com todos os horários indisponíveis - estilo sutil */
        .minimal-calendar .unavailable-date {
          background-color: rgba(64, 65, 62, 0.05) !important;
          color: rgba(64, 65, 62, 0.7) !important;
          border-radius: 8px;
          font-weight: 400;
          position: relative;
        }

        .minimal-calendar .unavailable-date:hover {
          background-color: rgba(64, 65, 62, 0.1) !important;
        }

        .minimal-calendar .unavailable-date::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: 50%;
          transform: translateX(-50%);
          width: 4px;
          height: 4px;
          background-color: rgba(64, 65, 62, 0.4);
          border-radius: 50%;
          opacity: 0.5;
        }

        .minimal-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: rgba(64, 65, 62, 0.25);
        }

        /* Transições delicadas */
        .minimal-calendar .react-calendar__month-view__days__day {
          transition: all 0.12s ease;
        }

        .minimal-calendar .react-calendar__navigation button {
          transition: all 0.12s ease;
        }
      `}</style>
    </section>
  );
}

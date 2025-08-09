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

export default function AgendamentoSection() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Value>(null);
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  const handleVoltar = () => {
    router.back();
  };

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

  // Extrair datas que têm slots disponíveis
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
  console.log('Slots disponíveis:', availableSlots.length);
  console.log('Datas disponíveis processadas:', availableDates.map(d => d.toISOString().split('T')[0]));

  // Função para verificar se uma data tem slots disponíveis
  const hasAvailableSlots = (date: Date) => {
    return availableDates.some(availableDate => 
      date.getFullYear() === availableDate.getFullYear() &&
      date.getMonth() === availableDate.getMonth() &&
      date.getDate() === availableDate.getDate()
    );
  };

  // Função para desabilitar datas passadas e sem slots disponíveis
  const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      // Desabilitar datas passadas
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (date < today) return true;
      
      // Desabilitar se não tem slots disponíveis
      return !hasAvailableSlots(date);
    }
    return false;
  };

  // Função para adicionar classes CSS customizadas
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      if (hasAvailableSlots(date)) {
        return 'available-date';
      }
    }
    return null;
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '--:--';
    return timeString.slice(0, 5); // Remove os segundos
  };

  // Obter slots da data selecionada
  const slotsForSelectedDate = selectedDate instanceof Date ? 
    availableSlots.filter(slot => {
      if (!slot.date || !slot.is_available) return false;
      try {
        const slotDate = new Date(slot.date);
        return slotDate.toDateString() === selectedDate.toDateString();
      } catch {
        return false;
      }
    }) : [];

  const handleSlotSelection = (slot: AvailableSlot) => {
    setSelectedSlot(slot);
  };

  const handleDateChange = (date: Value) => {
    setSelectedDate(date);
    setSelectedSlot(null); // Limpa o slot selecionado quando muda a data
  };

  const handleBooking = () => {
    if (selectedSlot && selectedDate instanceof Date) {
      // Aqui você pode implementar a lógica de reserva
      alert(`Agendamento selecionado:\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${formatTime(selectedSlot.start_time)} - ${formatTime(selectedSlot.end_time)}`);
    }
  };

  return (
    <section className="py-12 bg-cream min-h-screen">
      <div className="container mx-auto px-8">
        {/* Botões de Navegação */}
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={handleVoltar}
            className="flex items-center gap-2 bg-transparent text-verde font-instrument font-semibold text-sm hover:text-verde/80 transition-all duration-200 uppercase tracking-wide"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            VOLTAR
          </button>
          
          <button
            onClick={refreshData}
            disabled={loading}
            className="flex items-center gap-2 bg-amarelo text-cream font-instrument font-semibold text-xs px-3 py-1 rounded hover:bg-amarelo/90 transition-all duration-200 uppercase tracking-wide disabled:opacity-50"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? 'ATUALIZANDO...' : 'ATUALIZAR'}
          </button>
        </div>

        {/* Header com título e texto à esquerda */}
        <div className="mb-16">
          <div className="max-w-2xl">
            <h1 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-6">
              Agende sua Experiência
            </h1>
            <p className="text-lg text-cinza font-instrument leading-relaxed">
              Escolha a data e horário perfeitos para sua experiência única na Casa Alvite. 
              Nossos artesãos estão prontos para guiá-lo em uma jornada criativa inesquecível.
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
              {/* Área Principal - Calendário e Horários */}
              <div className="flex-1 lg:max-w-2xl">
                {/* Calendário Minimalista */}
                <div className="mb-8">
                  <h3 className="text-xl font-medium text-cinza mb-6">
                    Escolha sua Data
                  </h3>
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
                      formatShortWeekday={(locale, date) => ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][date.getDay()]}
                    />
                  </div>
                </div>

                {/* Horários Minimalistas - Só aparece após selecionar data */}
                {selectedDate instanceof Date && hasAvailableSlots(selectedDate) && (
                  <div>
                    <h3 className="text-xl font-medium text-cinza mb-6">
                      Horários Disponíveis para {selectedDate.toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long' 
                      })}
                    </h3>
                    
                    {slotsForSelectedDate.length > 0 ? (
                      <div className="space-y-3">
                        {slotsForSelectedDate.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotSelection(slot)}
                            className={`inline-block px-5 py-2.5 mr-2 mb-2 rounded-md border transition-all duration-200 text-sm font-medium ${
                              selectedSlot?.id === slot.id
                                ? 'border-cinza bg-cinza text-cream'
                                : 'border-cream bg-cream/30 text-cinza hover:border-cinza/50 hover:bg-cream/60'
                            }`}
                          >
                            {formatTime(slot.start_time)}
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
                        <p className="text-base font-medium text-cream">Cerâmica Criativa</p>
                        <p className="text-xs text-cream/60 mt-1">2-3 horas de duração</p>
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
                            {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                          </p>
                        ) : (
                          <p className="text-sm text-cream/50 italic">Selecione um horário</p>
                        )}
                      </div>

                      {/* Valor */}
                      <div className="pb-3 border-b border-cream/30">
                        <p className="text-sm text-cream/70 mb-1">Investimento</p>
                        <p className="text-xl font-semibold text-cream">R$ 120</p>
                        <p className="text-xs text-cream/60">por pessoa</p>
                      </div>

                      {/* Botão de Confirmação */}
                      {selectedSlot && selectedDate && (
                        <div className="pt-2">
                          <button
                            onClick={handleBooking}
                            className="w-full bg-amarelo text-cream py-3 px-6 rounded-md font-medium hover:bg-amarelo/90 transition-colors text-sm shadow-sm"
                          >
                            Confirmar Agendamento
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
                        <p className="text-base font-medium text-cream">Cerâmica Criativa</p>
                        <p className="text-xs text-cream/60 mt-1">2-3 horas de duração</p>
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
                      {formatTime(selectedSlot.start_time)} - {formatTime(selectedSlot.end_time)}
                    </p>
                                          ) : (
                          <p className="text-sm text-cream/50 italic">Selecione um horário</p>
                        )}
                </div>

                {/* Valor */}
                <div className="pb-3 border-b border-cream/50">
                                          <p className="text-sm text-cream/70 mb-1">Investimento</p>
                        <p className="text-xl font-semibold text-cream">R$ 120</p>
                        <p className="text-xs text-cream/60">por pessoa</p>
                </div>

                {/* Botão de Confirmação */}
                {selectedSlot && selectedDate && (
                  <div className="pt-2">
                    <button
                      onClick={handleBooking}
                      className="w-full bg-amarelo text-cream py-3 px-6 rounded-md font-medium hover:bg-amarelo/90 transition-colors text-sm shadow-sm"
                    >
                      Confirmar Agendamento
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>


      </div>

      <style jsx global>{`
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
          padding: 0.4em;
        }

        .minimal-calendar .react-calendar__month-view__days__day {
          position: relative;
          padding: 0.8em 0.5em;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9em;
          color: #40413E;
          border-radius: 8px;
          margin: 2px;
          min-height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .minimal-calendar .react-calendar__month-view__days__day:hover {
          background-color: rgba(244, 232, 218, 0.7);
        }

        .minimal-calendar .react-calendar__month-view__days__day--active {
          background: #40413E !important;
          color: #F4E8DA !important;
          border-radius: 8px;
        }

        .minimal-calendar .react-calendar__tile--disabled {
          background-color: transparent !important;
          color: rgba(64, 65, 62, 0.3) !important;
          cursor: not-allowed !important;
        }

        .minimal-calendar .react-calendar__tile--active {
          background: #40413E !important;
          color: #F4E8DA !important;
          border-radius: 8px;
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

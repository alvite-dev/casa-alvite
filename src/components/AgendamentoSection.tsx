'use client'

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface AvailableSlot {
  id: number;
  date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  max_capacity: number | null;
  current_bookings: number | null;
  created_at: string;
  updated_at: string;
}

export default function AgendamentoSection() {
  const [selectedDate, setSelectedDate] = useState<Value>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<AvailableSlot | null>(null);

  // Buscar dados do Supabase quando o componente carregar
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

  const handleBooking = () => {
    if (selectedSlot && selectedDate instanceof Date) {
      // Aqui você pode implementar a lógica de reserva
      alert(`Agendamento selecionado:\nData: ${selectedDate.toLocaleDateString('pt-BR')}\nHorário: ${formatTime(selectedSlot.start_time)} - ${formatTime(selectedSlot.end_time)}`);
    }
  };

  return (
    <section className="py-12 bg-cream min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="font-instrument-serif italic text-4xl sm:text-5xl lg:text-6xl text-cinza font-normal mb-6">
            Agende sua Experiência
          </h1>
          <p className="text-lg text-cinza max-w-3xl mx-auto font-instrument leading-relaxed">
            Escolha a data e horário perfeitos para sua experiência única na Casa Alvite. 
            Nossos artesãos estão prontos para guiá-lo em uma jornada criativa inesquecível.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde"></div>
              <span className="ml-4 text-gray-600 text-lg">Carregando horários disponíveis...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg mb-8 text-center">
              <strong>Ops!</strong> Houve um problema ao carregar os horários. Tente novamente mais tarde.
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Calendário */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold text-verde mb-6 text-center">
                  📅 Escolha sua Data
                </h3>
                <div className="calendar-wrapper">
                  <Calendar
                    onChange={setSelectedDate}
                    value={selectedDate}
                    locale="pt-BR"
                    tileDisabled={tileDisabled}
                    tileClassName={tileClassName}
                    className="custom-calendar-booking"
                    minDate={new Date()}
                    showNeighboringMonth={false}
                  />
                </div>
                
                {selectedDate instanceof Date && (
                  <div className="mt-6 p-4 bg-verde/5 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Data selecionada:</strong>
                    </p>
                    <p className="text-xl font-semibold text-verde">
                      {selectedDate.toLocaleDateString('pt-BR', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                )}
              </div>

              {/* Horários Disponíveis */}
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h3 className="text-2xl font-semibold text-verde mb-6 text-center">
                  ⏰ Horários Disponíveis
                </h3>
                
                {selectedDate instanceof Date ? (
                  <>
                    {slotsForSelectedDate.length > 0 ? (
                      <div className="space-y-3">
                        {slotsForSelectedDate.map(slot => (
                          <button
                            key={slot.id}
                            onClick={() => handleSlotSelection(slot)}
                            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 ${
                              selectedSlot?.id === slot.id
                                ? 'border-verde bg-verde text-white shadow-lg'
                                : 'border-gray-200 bg-gray-50 hover:border-verde/50 hover:bg-verde/5'
                            }`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-medium">
                                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                              </span>
                              <span className={`text-sm px-3 py-1 rounded-full ${
                                selectedSlot?.id === slot.id
                                  ? 'bg-white/20 text-white'
                                  : 'bg-green-100 text-green-700'
                              }`}>
                                Disponível
                              </span>
                            </div>
                          </button>
                        ))}
                        
                        {selectedSlot && (
                          <button
                            onClick={handleBooking}
                            className="w-full mt-6 bg-amarelo text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-amarelo/90 transition-colors shadow-lg"
                          >
                            Confirmar Agendamento
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">📅</div>
                        <p className="text-gray-500 text-lg">
                          Nenhum horário disponível para esta data
                        </p>
                        <p className="text-gray-400 text-sm mt-2">
                          Escolha outra data no calendário
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">👆</div>
                    <p className="text-gray-500 text-lg">
                      Selecione uma data no calendário
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      para ver os horários disponíveis
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Grid com Informações e Contato */}
        <div className="mt-16 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Informações Importantes */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-verde mb-6 text-center">
              ℹ️ Informações Importantes
            </h3>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-verde rounded-full mt-2"></div>
                  <p className="text-cinza font-instrument">
                    <strong>Duração:</strong> Cada experiência tem duração média de 2-3 horas
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-verde rounded-full mt-2"></div>
                  <p className="text-cinza font-instrument">
                    <strong>Grupo:</strong> Máximo de 6 pessoas por horário
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-verde rounded-full mt-2"></div>
                  <p className="text-cinza font-instrument">
                    <strong>Materiais:</strong> Todos inclusos na experiência
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amarelo rounded-full mt-2"></div>
                  <p className="text-cinza font-instrument">
                    <strong>Cancelamento:</strong> Até 24h antes sem custos
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-amarelo rounded-full mt-2"></div>
                  <p className="text-cinza font-instrument">
                    <strong>Idade:</strong> Experiências adaptadas para todas as idades
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-terracotta rounded-full mt-2"></div>
                  <p className="text-cinza font-instrument">
                    <strong>Local:</strong> Ateliê Casa Alvite, Humaitá - RJ
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contato Direto */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h3 className="text-2xl font-semibold text-verde mb-6 text-center">
              💬 Prefere falar conosco?
            </h3>
            <div className="space-y-6">
              <p className="text-cinza font-instrument text-center">
                Se preferir, entre em contato diretamente pelo WhatsApp para agendar sua experiência ou tirar dúvidas.
              </p>
              
              <div className="text-center">
                <a 
                  href="https://wa.me/5521991792065"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-instrument font-semibold text-lg px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  FALAR NO WHATSAPP
                </a>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="space-y-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-verde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <p className="text-cinza font-instrument">
                      <strong>(21) 99179-2065</strong>
                    </p>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5 text-verde" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-cinza font-instrument">
                      <strong>Seg a Dom • 9h às 18h</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        /* Estilização customizada para o calendário de agendamento */
        .calendar-wrapper {
          display: flex;
          justify-content: center;
        }

        .custom-calendar-booking {
          width: 100%;
          max-width: 400px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 16px;
          font-family: inherit;
          line-height: 1.125em;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .custom-calendar-booking .react-calendar__navigation {
          display: flex;
          height: 50px;
          margin-bottom: 1em;
          background: #7c9885;
          border-radius: 16px 16px 0 0;
        }

        .custom-calendar-booking .react-calendar__navigation button {
          color: #fff;
          min-width: 50px;
          background: none;
          border: none;
          font-size: 18px;
          font-weight: bold;
          cursor: pointer;
        }

        .custom-calendar-booking .react-calendar__navigation button:hover {
          background-color: rgba(255, 255, 255, 0.15);
          border-radius: 8px;
        }

        .custom-calendar-booking .react-calendar__navigation button:disabled {
          background-color: transparent;
          color: rgba(255, 255, 255, 0.5);
          cursor: default;
        }

        .custom-calendar-booking .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.8em;
          color: #7c9885;
          padding: 0.75em 0;
          background: #f8fffe;
        }

        .custom-calendar-booking .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }

        .custom-calendar-booking .react-calendar__month-view__days__day {
          position: relative;
          padding: 1em 0.5em;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1em;
          color: #374151;
          border-radius: 8px;
          margin: 2px;
        }

        .custom-calendar-booking .react-calendar__month-view__days__day:hover {
          background-color: #f3f4f6;
        }

        .custom-calendar-booking .react-calendar__month-view__days__day--active {
          background: #D4A853 !important;
          color: white !important;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(212, 168, 83, 0.3);
        }

        .custom-calendar-booking .react-calendar__month-view__days__day--active:hover {
          background: #c49a4a !important;
        }

        .custom-calendar-booking .react-calendar__tile--disabled {
          background-color: #f9fafb !important;
          color: #d1d5db !important;
          cursor: not-allowed !important;
        }

        .custom-calendar-booking .react-calendar__tile--active {
          background: #7c9885 !important;
          color: white !important;
          border-radius: 8px;
        }

        /* Datas com horários disponíveis */
        .custom-calendar-booking .available-date {
          background-color: #dcfce7 !important;
          color: #15803d !important;
          border-radius: 8px;
          font-weight: 600;
          border: 2px solid #bbf7d0;
        }

        .custom-calendar-booking .available-date:hover {
          background-color: #bbf7d0 !important;
          transform: scale(1.05);
          transition: all 0.2s ease;
        }

        .custom-calendar-booking .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }

        /* Animações suaves */
        .custom-calendar-booking .react-calendar__month-view__days__day {
          transition: all 0.2s ease;
        }

        .custom-calendar-booking .react-calendar__navigation button {
          transition: all 0.2s ease;
        }
      `}</style>
    </section>
  );
}

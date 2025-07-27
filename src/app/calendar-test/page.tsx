'use client'

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

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

export default function CalendarTestPage() {
  const [value, onChange] = useState<Value>(new Date());
  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '--/--/----';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch {
      return '--/--/----';
    }
  };

  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return '--:--';
    return timeString.slice(0, 5); // Remove os segundos
  };

  return (
    <div className="min-h-screen bg-cream p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-verde mb-8 text-center">
          🗓️ Teste do Calendário - Casa Alvite
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendário Simples */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-verde mb-4">
              📅 Calendário de Agendamento
            </h2>
            <div className="calendar-wrapper">
              <Calendar
                onChange={onChange}
                value={value}
                locale="pt-BR"
                tileDisabled={tileDisabled}
                tileClassName={tileClassName}
                className="custom-calendar"
                minDate={new Date()}
                showNeighboringMonth={false}
              />
            </div>
            
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Data selecionada:</strong> 
              </p>
              <p className="text-lg font-medium text-verde">
                {value instanceof Date ? value.toLocaleDateString('pt-BR') : 'Nenhuma data selecionada'}
              </p>
              
              {/* Mostrar slots da data selecionada */}
              {value instanceof Date && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Horários disponíveis:</strong>
                  </p>
                  {availableSlots
                    .filter(slot => {
                      if (!slot.date || !slot.is_available) return false;
                      try {
                        const slotDate = new Date(slot.date);
                        return slotDate.toDateString() === value.toDateString();
                      } catch {
                        return false;
                      }
                    })
                    .map(slot => (
                      <div key={slot.id} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                        <span className="text-sm">
                          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                        </span>
                        <span className="text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                          Disponível
                        </span>
                      </div>
                    ))}
                  {availableSlots.filter(slot => {
                    if (!slot.date || !slot.is_available) return false;
                    try {
                      const slotDate = new Date(slot.date);
                      return slotDate.toDateString() === value.toDateString();
                    } catch {
                      return false;
                    }
                  }).length === 0 && (
                    <p className="text-sm text-gray-500 italic">
                      Nenhum horário disponível para esta data
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Tabela de Available Slots */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-verde mb-4">
              📊 Horários Disponíveis
            </h2>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-verde"></div>
                <span className="ml-2 text-gray-600">Carregando dados...</span>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Erro:</strong> {error}
              </div>
            )}

            {!loading && !error && (
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Data</th>
                      <th className="px-3 py-2 text-left font-medium text-gray-500">Horário</th>
                      <th className="px-3 py-2 text-center font-medium text-gray-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {availableSlots.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-3 py-4 text-center text-gray-500 italic">
                          Nenhum horário disponível cadastrado
                        </td>
                      </tr>
                    ) : (
                      availableSlots
                        .filter(slot => slot.is_available)
                        .map((slot) => (
                          <tr key={slot.id} className="hover:bg-gray-50">
                            <td className="px-3 py-2 font-medium">
                              {formatDate(slot.date)}
                            </td>
                            <td className="px-3 py-2">
                              {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                            </td>
                            <td className="px-3 py-2 text-center">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Disponível
                              </span>
                            </td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
                
                {availableSlots.filter(slot => slot.is_available).length > 0 && (
                  <div className="mt-4 text-sm text-gray-500 text-center">
                    Total: {availableSlots.filter(slot => slot.is_available).length} horários disponíveis
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Legenda */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-verde mb-4">📋 Legenda</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-verde rounded"></div>
              <span className="text-sm">Data com horários disponíveis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-300 rounded"></div>
              <span className="text-sm">Data sem horários ou passada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-amarelo rounded"></div>
              <span className="text-sm">Data selecionada</span>
            </div>
          </div>
        </div>

        {/* Navegação */}
        <div className="mt-8 text-center">
          <a 
            href="/admin" 
            className="bg-verde text-cream px-6 py-3 rounded-lg hover:bg-verde/90 transition-colors mr-4"
          >
            ← Voltar ao Admin
          </a>
          <a 
            href="/" 
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            🏠 Voltar ao Início
          </a>
        </div>
      </div>

      <style jsx global>{`
        /* Estilização customizada para o calendário */
        .calendar-wrapper {
          display: flex;
          justify-content: center;
        }

        .custom-calendar {
          width: 100%;
          max-width: 350px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          font-family: inherit;
          line-height: 1.125em;
        }

        .custom-calendar .react-calendar__navigation {
          display: flex;
          height: 44px;
          margin-bottom: 1em;
          background: #7c9885;
          border-radius: 12px 12px 0 0;
        }

        .custom-calendar .react-calendar__navigation button {
          color: #fff;
          min-width: 44px;
          background: none;
          border: none;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
        }

        .custom-calendar .react-calendar__navigation button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .custom-calendar .react-calendar__navigation button:disabled {
          background-color: transparent;
          color: rgba(255, 255, 255, 0.5);
          cursor: default;
        }

        .custom-calendar .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.75em;
          color: #7c9885;
          padding: 0.5em 0;
        }

        .custom-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 0.5em;
        }

        .custom-calendar .react-calendar__month-view__days__day {
          position: relative;
          padding: 0.75em 0.5em;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.9em;
          color: #374151;
        }

        .custom-calendar .react-calendar__month-view__days__day:hover {
          background-color: #f3f4f6;
        }

        .custom-calendar .react-calendar__month-view__days__day--active {
          background: #D4A853 !important;
          color: white !important;
          border-radius: 6px;
        }

        .custom-calendar .react-calendar__month-view__days__day--active:hover {
          background: #c49a4a !important;
        }

        .custom-calendar .react-calendar__tile--disabled {
          background-color: #f3f4f6 !important;
          color: #9ca3af !important;
          cursor: not-allowed !important;
        }

        .custom-calendar .react-calendar__tile--active {
          background: #7c9885 !important;
          color: white !important;
          border-radius: 6px;
        }

        /* Datas com horários disponíveis */
        .custom-calendar .available-date {
          background-color: #dcfce7 !important;
          color: #15803d !important;
          border-radius: 6px;
          font-weight: 500;
        }

        .custom-calendar .available-date:hover {
          background-color: #bbf7d0 !important;
        }

        .custom-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }
      `}</style>
    </div>
  );
} 
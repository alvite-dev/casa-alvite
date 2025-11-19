'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createClient } from '@/utils/supabase/client';

type Slot = {
    id: string;
    date: string;
    start_time: string;
    is_available: boolean;
};

export default function ScheduleManager() {
    const [date, setDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(false);
    const [newTime, setNewTime] = useState('');
    const supabase = createClient();

    // Fetch slots for the selected date
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            const dateStr = format(date, 'yyyy-MM-dd');

            const { data, error } = await supabase
                .from('available_slots')
                .select('*')
                .eq('date', dateStr)
                .order('start_time');

            if (error) {
                console.error('Error fetching slots:', error);
            } else {
                setSlots(data || []);
            }
            setLoading(false);
        };

        fetchSlots();
    }, [date, supabase]);

    const handleAddSlot = async () => {
        if (!newTime) return;

        const dateStr = format(date, 'yyyy-MM-dd');

        const { data, error } = await supabase
            .from('available_slots')
            .insert([
                {
                    date: dateStr,
                    start_time: newTime,
                    is_available: true,
                    // Assuming experience_id is optional or we need to select it. 
                    // For now, let's assume it's null or handled by default.
                    // If the schema requires experience_id, we might need to fetch experiences first.
                }
            ])
            .select()
            .single();

        if (error) {
            alert('Erro ao adicionar horário: ' + error.message);
        } else {
            setSlots([...slots, data]);
            setNewTime('');
        }
    };

    const handleDeleteSlot = async (id: string) => {
        if (!confirm('Tem certeza que deseja remover este horário?')) return;

        const { error } = await supabase
            .from('available_slots')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao remover horário: ' + error.message);
        } else {
            setSlots(slots.filter(s => s.id !== id));
        }
    };

    const handleToggleAvailability = async (slot: Slot) => {
        const { data, error } = await supabase
            .from('available_slots')
            .update({ is_available: !slot.is_available })
            .eq('id', slot.id)
            .select()
            .single();

        if (error) {
            alert('Erro ao atualizar status: ' + error.message);
        } else {
            setSlots(slots.map(s => s.id === slot.id ? data : s));
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <h2 className="text-lg font-semibold mb-4">Selecione uma Data</h2>
                    <div className="calendar-wrapper">
                        <Calendar
                            onChange={(value) => setDate(value as Date)}
                            value={date}
                            locale="pt-BR"
                            className="w-full border-none"
                            tileClassName={({ date: tileDate }) => {
                                // Highlight today
                                if (format(tileDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')) {
                                    return 'bg-blue-50 text-blue-600 font-bold rounded-lg';
                                }
                                return '';
                            }}
                        />
                    </div>
                </div>
            </div>

            <div className="lg:col-span-1">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                    <h2 className="text-lg font-semibold mb-4">
                        Horários para {format(date, "dd 'de' MMMM", { locale: ptBR })}
                    </h2>

                    <div className="space-y-4">
                        {/* Add New Slot */}
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-verde focus:ring-verde"
                            />
                            <button
                                onClick={handleAddSlot}
                                disabled={!newTime}
                                className="bg-verde text-white px-4 py-2 rounded-lg hover:bg-verde-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Adicionar
                            </button>
                        </div>

                        {/* List Slots */}
                        <div className="space-y-2 mt-4">
                            {loading ? (
                                <p className="text-gray-500 text-center py-4">Carregando...</p>
                            ) : slots.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">Nenhum horário cadastrado.</p>
                            ) : (
                                slots.map((slot) => (
                                    <div
                                        key={slot.id}
                                        className={`flex items-center justify-between p-3 rounded-lg border ${slot.is_available ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`font-medium ${slot.is_available ? 'text-gray-900' : 'text-red-600'}`}>
                                                {slot.start_time.slice(0, 5)}
                                            </span>
                                            {!slot.is_available && (
                                                <span className="text-xs text-red-600 font-medium px-2 py-0.5 bg-red-100 rounded-full">
                                                    Bloqueado
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleAvailability(slot)}
                                                className={`p-1.5 rounded-md transition-colors ${slot.is_available
                                                        ? 'text-green-600 hover:bg-green-50'
                                                        : 'text-gray-400 hover:bg-gray-100'
                                                    }`}
                                                title={slot.is_available ? "Bloquear" : "Desbloquear"}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    {slot.is_available ? (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    ) : (
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                                    )}
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSlot(slot.id)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Excluir"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

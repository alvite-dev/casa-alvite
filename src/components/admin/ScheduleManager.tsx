'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { createBrowserClient } from '@/utils/supabase/client';
import 'react-calendar/dist/Calendar.css';
import BatchSlotCreator from './BatchSlotCreator';

interface Slot {
    id: string;
    date: string;
    start_time: string;
    is_available: boolean;
}

export default function ScheduleManager() {
    const [date, setDate] = useState<Date>(new Date());
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTime, setNewTime] = useState('');
    const [showBatchCreator, setShowBatchCreator] = useState(false);

    const supabase = createBrowserClient();

    const fetchSlots = async (selectedDate: Date) => {
        setLoading(true);
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

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

    useEffect(() => {
        fetchSlots(date);
    }, [date]);

    const handleAddSlot = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTime) return;

        const dateStr = format(date, 'yyyy-MM-dd');

        const { error } = await supabase
            .from('available_slots')
            .insert([
                { date: dateStr, start_time: newTime, is_available: true }
            ]);

        if (error) {
            console.error('Error adding slot:', error);
            alert('Erro ao adicionar horário');
        } else {
            setNewTime('');
            fetchSlots(date);
        }
    };

    const toggleSlotAvailability = async (slot: Slot) => {
        const { error } = await supabase
            .from('available_slots')
            .update({ is_available: !slot.is_available })
            .eq('id', slot.id);

        if (error) {
            console.error('Error updating slot:', error);
            alert('Erro ao atualizar horário');
        } else {
            fetchSlots(date);
        }
    };

    const deleteSlot = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este horário?')) return;

        const { error } = await supabase
            .from('available_slots')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting slot:', error);
            alert('Erro ao excluir horário');
        } else {
            fetchSlots(date);
        }
    };

    const handleBatchSuccess = () => {
        setShowBatchCreator(false);
        fetchSlots(date); // Refresh current view in case changes affected it
    };

    if (showBatchCreator) {
        return (
            <BatchSlotCreator
                onSuccess={handleBatchSuccess}
                onCancel={() => setShowBatchCreator(false)}
            />
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar Section */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold text-gray-900">Selecione uma Data</h2>
                        <button
                            onClick={() => setShowBatchCreator(true)}
                            className="text-sm text-verde hover:text-verde-dark font-medium flex items-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Criação em Lote
                        </button>
                    </div>
                    <Calendar
                        onChange={(value) => setDate(value as Date)}
                        value={date}
                        locale="pt-BR"
                        className="w-full border-none"
                        tileClassName={({ date: tileDate }) => {
                            // Optional: Add logic to highlight days with slots if we fetched all slots
                            return 'rounded-lg hover:bg-gray-50 focus:bg-verde focus:text-white';
                        }}
                    />
                </div>
            </div>

            {/* Slots Management Section */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-full">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Horários para {format(date, "d 'de' MMMM", { locale: ptBR })}
                    </h2>

                    {/* Add New Slot Form */}
                    <form onSubmit={handleAddSlot} className="mb-6">
                        <div className="flex gap-2">
                            <input
                                type="time"
                                value={newTime}
                                onChange={(e) => setNewTime(e.target.value)}
                                className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-verde focus:ring-verde"
                                required
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-verde text-white rounded-lg hover:bg-verde-dark transition-colors"
                            >
                                Adicionar
                            </button>
                        </div>
                    </form>

                    {/* Slots List */}
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-4 text-gray-500">Carregando...</div>
                        ) : slots.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                                Nenhum horário cadastrado para este dia.
                            </div>
                        ) : (
                            slots.map((slot) => (
                                <div
                                    key={slot.id}
                                    className={`flex items-center justify-between p-3 rounded-lg border ${slot.is_available
                                            ? 'bg-green-50 border-green-100'
                                            : 'bg-red-50 border-red-100'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`font-medium ${slot.is_available ? 'text-green-700' : 'text-red-700'
                                            }`}>
                                            {slot.start_time}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${slot.is_available
                                                ? 'bg-green-200 text-green-800'
                                                : 'bg-red-200 text-red-800'
                                            }`}>
                                            {slot.is_available ? 'Disponível' : 'Indisponível'}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => toggleSlotAvailability(slot)}
                                            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
                                            title={slot.is_available ? 'Bloquear' : 'Desbloquear'}
                                        >
                                            {slot.is_available ? (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                                </svg>
                                            ) : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => deleteSlot(slot.id)}
                                            className="p-1 text-red-500 hover:text-red-700 transition-colors"
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
    );
}

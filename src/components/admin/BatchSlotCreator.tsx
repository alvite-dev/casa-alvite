'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/utils/supabase/client';
import { addDays, format, parseISO } from 'date-fns';

const WEEKDAYS = [
    { id: 1, label: 'Segunda-feira' },
    { id: 2, label: 'Terça-feira' },
    { id: 3, label: 'Quarta-feira' },
    { id: 4, label: 'Quinta-feira' },
    { id: 5, label: 'Sexta-feira' },
    { id: 6, label: 'Sábado' },
    { id: 0, label: 'Domingo' },
];

interface BatchSlotCreatorProps {
    onSuccess: () => void;
    onCancel: () => void;
}

type DayConfig = {
    enabled: boolean;
    times: string[];
    newTime: string; // Helper for input state per day
};

type WeekConfig = {
    [key: number]: DayConfig;
};

export default function BatchSlotCreator({ onSuccess, onCancel }: BatchSlotCreatorProps) {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Initialize config for all days
    const [weekConfig, setWeekConfig] = useState<WeekConfig>(
        WEEKDAYS.reduce((acc, day) => ({
            ...acc,
            [day.id]: { enabled: false, times: [], newTime: '' }
        }), {})
    );

    const supabase = createBrowserClient();

    const toggleDay = (dayId: number) => {
        setWeekConfig(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], enabled: !prev[dayId].enabled }
        }));
    };

    const updateNewTime = (dayId: number, time: string) => {
        setWeekConfig(prev => ({
            ...prev,
            [dayId]: { ...prev[dayId], newTime: time }
        }));
    };

    const addTime = (dayId: number) => {
        const day = weekConfig[dayId];
        if (day.newTime && !day.times.includes(day.newTime)) {
            setWeekConfig(prev => ({
                ...prev,
                [dayId]: {
                    ...prev[dayId],
                    times: [...prev[dayId].times, day.newTime].sort(),
                    newTime: ''
                }
            }));
        }
    };

    const removeTime = (dayId: number, timeToRemove: string) => {
        setWeekConfig(prev => ({
            ...prev,
            [dayId]: {
                ...prev[dayId],
                times: prev[dayId].times.filter(t => t !== timeToRemove)
            }
        }));
    };

    const handleSubmit = async () => {
        if (!startDate || !endDate) {
            setMessage({ type: 'error', text: 'Selecione as datas de início e fim.' });
            return;
        }

        const hasEnabledDays = Object.values(weekConfig).some(d => d.enabled && d.times.length > 0);
        if (!hasEnabledDays) {
            setMessage({ type: 'error', text: 'Configure pelo menos um dia com horários.' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        try {
            const start = parseISO(startDate);
            const end = parseISO(endDate);
            const slotsToInsert = [];

            let current = start;
            while (current <= end) {
                const dayOfWeek = current.getDay();
                const config = weekConfig[dayOfWeek];

                if (config && config.enabled && config.times.length > 0) {
                    const dateStr = format(current, 'yyyy-MM-dd');

                    for (const time of config.times) {
                        slotsToInsert.push({
                            date: dateStr,
                            start_time: time,
                            is_available: true
                        });
                    }
                }
                current = addDays(current, 1);
            }

            if (slotsToInsert.length === 0) {
                setMessage({ type: 'error', text: 'Nenhum horário gerado com as configurações atuais.' });
                setIsSubmitting(false);
                return;
            }

            const { error } = await supabase
                .from('available_slots')
                .insert(slotsToInsert);

            if (error) throw error;

            setMessage({ type: 'success', text: `${slotsToInsert.length} horários criados com sucesso!` });
            setTimeout(() => {
                onSuccess();
            }, 1500);

        } catch (error) {
            console.error('Error creating batch slots:', error);
            setMessage({ type: 'error', text: 'Erro ao criar horários. Tente novamente.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h2 className="text-lg font-semibold text-gray-900">Criação de Horários em Lote</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-verde focus:ring-verde sm:text-sm"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-verde focus:ring-verde sm:text-sm"
                    />
                </div>
            </div>

            {/* Weekdays Configuration */}
            <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Configuração por Dia da Semana</label>
                <div className="space-y-3 border rounded-lg p-4 bg-gray-50">
                    {WEEKDAYS.map((day) => {
                        const config = weekConfig[day.id];
                        return (
                            <div key={day.id} className={`p-3 rounded-lg border transition-all ${config.enabled ? 'bg-white border-verde shadow-sm' : 'bg-gray-100 border-transparent opacity-75'
                                }`}>
                                <div className="flex items-center gap-3 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={config.enabled}
                                        onChange={() => toggleDay(day.id)}
                                        className="h-4 w-4 text-verde focus:ring-verde border-gray-300 rounded"
                                    />
                                    <span className={`font-medium ${config.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                        {day.label}
                                    </span>
                                </div>

                                {config.enabled && (
                                    <div className="pl-7 space-y-2">
                                        <div className="flex gap-2">
                                            <input
                                                type="time"
                                                value={config.newTime}
                                                onChange={(e) => updateNewTime(day.id, e.target.value)}
                                                className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-verde focus:ring-verde sm:text-sm"
                                            />
                                            <button
                                                onClick={() => addTime(day.id)}
                                                className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-xs font-medium uppercase tracking-wide"
                                            >
                                                Adicionar
                                            </button>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            {config.times.map((time) => (
                                                <span key={time} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {time}
                                                    <button
                                                        onClick={() => removeTime(day.id, time)}
                                                        className="ml-1.5 text-blue-400 hover:text-blue-600 focus:outline-none"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                            {config.times.length === 0 && (
                                                <span className="text-xs text-gray-400 italic">Adicione horários para este dia</span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Feedback Message */}
            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    }`}>
                    {message.text}
                </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde"
                >
                    Cancelar
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-verde hover:bg-verde-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Gerando...' : 'Gerar Horários'}
                </button>
            </div>
        </div>
    );
}

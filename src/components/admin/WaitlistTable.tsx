'use client';

import { useState } from 'react';

interface WaitlistItem {
    id: string;
    email: string;
    event_name: string;
    created_at: string;
}

export default function WaitlistTable({ initialData }: { initialData: WaitlistItem[] }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredData = initialData.filter((item) =>
        item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.event_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleExportCSV = () => {
        // Extract unique emails from filtered data
        const emails = Array.from(new Set(filteredData.map(item => item.email)));

        if (emails.length === 0) {
            alert('Nenhum email para exportar.');
            return;
        }

        // Create CSV content
        const csvContent = "data:text/csv;charset=utf-8,"
            + "email\n"
            + emails.join("\n");

        // Create download link
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `waitlist_emails_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);

        // Trigger download
        link.click();

        // Cleanup
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-4">
            {/* Search Bar and Export */}
            <div className="flex gap-4">
                <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-verde focus:border-verde sm:text-sm"
                        placeholder="Buscar por email ou evento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={handleExportCSV}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-verde hover:bg-verde-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verde transition-colors"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Exportar CSV
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Evento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data de Inscrição</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredData.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{item.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {item.event_name}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(item.created_at).toLocaleDateString('pt-BR', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </td>
                                </tr>
                            ))}
                            {filteredData.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        {searchTerm ? 'Nenhum resultado encontrado para sua busca.' : 'Nenhuma inscrição encontrada.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-sm text-gray-500 text-right">
                Mostrando {filteredData.length} de {initialData.length} resultados
            </div>
        </div>
    );
}

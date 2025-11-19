import { createServerClient } from '@/utils/supabase/server';
import BookingTable from '@/components/admin/BookingTable';

export const dynamic = 'force-dynamic';

export default async function BookingsPage() {
    const supabase = createServerClient();

    const { data: bookings, error } = await supabase
        .from('bookings')
        .select('*, available_slots(date, start_time)')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching bookings:', error);
        return <div>Erro ao carregar reservas.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
                    <p className="text-gray-500">Gerencie todas as reservas do sistema</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
                    Total: <strong>{bookings?.length || 0}</strong> reservas
                </div>
            </div>

            <BookingTable bookings={bookings || []} />
        </div>
    );
}

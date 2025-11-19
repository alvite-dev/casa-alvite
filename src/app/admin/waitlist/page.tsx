import { createServerClient } from '@/utils/supabase/server';
import WaitlistTable from '@/components/admin/WaitlistTable';

export const dynamic = 'force-dynamic';

export default async function WaitlistPage() {
    const supabase = createServerClient();

    const { data: waitlist, error } = await supabase
        .from('event_waitlist')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching waitlist:', error);
        return <div>Erro ao carregar lista de espera.</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Lista de Espera</h1>
                    <p className="text-gray-500">Gerencie os interessados em eventos</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600">
                    Total: <strong>{waitlist?.length || 0}</strong> inscritos
                </div>
            </div>

            <WaitlistTable initialData={waitlist || []} />
        </div>
    );
}

import ScheduleManager from '@/components/admin/ScheduleManager';

export default function SchedulePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Banco de Horários</h1>
                <p className="text-gray-500">Gerencie a disponibilidade para agendamentos</p>
            </div>

            <ScheduleManager />
        </div>
    );
}

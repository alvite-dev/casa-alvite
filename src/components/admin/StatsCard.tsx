import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: 'blue' | 'green' | 'purple' | 'orange';
    description?: string;
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
    },
    green: {
        bg: 'bg-green-100',
        text: 'text-green-600',
    },
    purple: {
        bg: 'bg-purple-100',
        text: 'text-purple-600',
    },
    orange: {
        bg: 'bg-orange-100',
        text: 'text-orange-600',
    },
};

export default function StatsCard({ title, value, icon, color, description }: StatsCardProps) {
    const colors = colorClasses[color];

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <div className="flex items-center">
                <div className={`p-3 rounded-lg ${colors.bg}`}>
                    <div className={`w-6 h-6 ${colors.text}`}>
                        {icon}
                    </div>
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {description && (
                        <p className="text-xs text-gray-500 mt-1">{description}</p>
                    )}
                </div>
            </div>
        </div>
    );
}

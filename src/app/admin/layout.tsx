'use client';

import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/admin/login';

    return (
        <div className="min-h-screen bg-gray-50">
            {!isLoginPage && <AdminSidebar />}
            <div className={!isLoginPage ? "pl-64" : ""}>
                <main className={!isLoginPage ? "p-8" : ""}>
                    {children}
                </main>
            </div>
        </div>
    );
}

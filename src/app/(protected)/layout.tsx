'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProtectedLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [loading, isAuthenticated, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden bg-gray-50">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                    {children}
                </main>
            </div>
        </div>
    );
}

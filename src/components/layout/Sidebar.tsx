'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    LayoutDashboard,
    Users,
    User as UserIcon,
    Package,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Hammer,
    Headphones,
    Wallet,
    Star,
    Activity,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import api from '@/lib/api';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/client', icon: Users },
    { name: 'Profissionais', href: '/professional', icon: UserIcon },
    { name: 'Serviços', href: '/services', icon: Package },
    { name: 'Pagamentos', href: '/payments', icon: CreditCard },
    { name: 'Saques', href: '/withdrawals', icon: Wallet },
    { name: 'Orçamentos', href: '/quotes', icon: FileText },
    { name: 'Avaliações', href: '/reviews', icon: Star },
    { name: 'Suporte', href: '/support', icon: Headphones },
    { name: 'Monitoramento', href: '/logs', icon: Activity },
    { name: 'Configurações', href: '/settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [openTickets, setOpenTickets] = useState(0);

    useEffect(() => {
        const fetchOpenCount = async () => {
            try {
                const res = await api.get('/support/admin/all?status=open&limit=1');
                setOpenTickets(res.data.data.pagination.total || 0);
            } catch {
                // silently ignore
            }
        };
        fetchOpenCount();
        const interval = setInterval(fetchOpenCount, 60_000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col w-64 shrink-0 bg-white border-r border-gray-200 text-gray-600 h-full">
            <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200 shrink-0">
                <div className="bg-primary-600 p-2 rounded-lg shadow-sm">
                    <Hammer className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight text-gray-900 leading-none">Conecta</span>
                    <span className="font-bold text-lg tracking-tight text-primary-600 leading-none">Marceneiro</span>
                </div>
            </div>
            <nav className="flex-1 min-h-0 overflow-y-auto px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
                    const isSupport = item.href === '/support';
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={clsx(
                                'flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors',
                                isActive
                                    ? 'bg-primary-50 text-primary-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5 mr-3", isActive ? "text-primary-600" : "text-gray-400")} />
                            <span className="flex-1">{item.name}</span>
                            {isSupport && openTickets > 0 && (
                                <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                    {openTickets > 99 ? '99+' : openTickets}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-200 shrink-0">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start px-4"
                >
                    <LogOut className="w-5 h-5 mr-3 text-gray-400" />
                    Sair
                </Button>
            </div>
        </div>
    );
}

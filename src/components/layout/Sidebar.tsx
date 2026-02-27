import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    User as UserIcon,
    Package,
    CreditCard,
    FileText,
    Settings,
    LogOut,
    Hammer
} from 'lucide-react';
import clsx from 'clsx';

const navItems = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clientes', href: '/client', icon: Users },
    { name: 'Profissionais', href: '/professional', icon: UserIcon },
    { name: 'Serviços', href: '/services', icon: Package },
    { name: 'Pagamentos', href: '/payments', icon: CreditCard },
    { name: 'Orçamentos', href: '/quotes', icon: FileText },
    { name: 'Configurações', href: '/settings', icon: Settings },
];

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

export function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <div className="flex flex-col w-64 bg-white border-r border-gray-200 text-gray-600 min-h-screen">
            <div className="flex items-center gap-3 h-16 px-6 border-b border-gray-200">
                <div className="bg-primary-600 p-2 rounded-lg shadow-sm">
                    <Hammer className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="font-bold text-lg tracking-tight text-gray-900 leading-none">Conecta</span>
                    <span className="font-bold text-lg tracking-tight text-primary-600 leading-none">Marceneiro</span>
                </div>
            </div>
            <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
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
                            <item.icon className={clsx("w-5 h-5 mr-3", isActive ? "text-primary-600" : "text-gray-400 group-hover:text-gray-500")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t border-gray-200">
                <Button
                    variant="ghost"
                    onClick={logout}
                    className="w-full justify-start px-4"
                >
                    <LogOut className="w-5 h-5 mr-3 text-gray-400 group-hover:text-gray-500" />
                    Sair
                </Button>
            </div>
        </div>
    );
}

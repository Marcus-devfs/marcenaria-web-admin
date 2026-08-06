'use client';

import { useEffect, useState } from 'react';
import { adminService, ActivityLog, Pagination } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Search, Activity } from 'lucide-react';

const ACTION_LABELS: Record<string, string> = {
    login: 'Login',
    login_failed: 'Login falhou',
    register: 'Cadastro',
    service_created: 'Serviço criado',
    quote_created: 'Orçamento criado',
    quote_accepted: 'Orçamento aceito',
    quote_rejected: 'Orçamento rejeitado',
    payment_completed: 'Pagamento confirmado',
    withdrawal_requested: 'Saque solicitado',
};

const ACTION_COLORS: Record<string, string> = {
    login: 'bg-gray-100 text-gray-700',
    login_failed: 'bg-red-100 text-red-700',
    register: 'bg-blue-100 text-blue-700',
    service_created: 'bg-indigo-100 text-indigo-700',
    quote_created: 'bg-purple-100 text-purple-700',
    quote_accepted: 'bg-green-100 text-green-700',
    quote_rejected: 'bg-red-100 text-red-700',
    payment_completed: 'bg-emerald-100 text-emerald-700',
    withdrawal_requested: 'bg-amber-100 text-amber-700',
};

function ActionBadge({ action }: { action: string }) {
    return (
        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${ACTION_COLORS[action] || 'bg-gray-100 text-gray-700'}`}>
            {ACTION_LABELS[action] || action}
        </span>
    );
}

function formatMetadata(metadata?: Record<string, unknown>): string {
    if (!metadata || Object.keys(metadata).length === 0) return '—';
    return Object.entries(metadata)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' · ');
}

export default function LogsPage() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [actions, setActions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [actionFilter, setActionFilter] = useState('');
    const [search, setSearch] = useState('');
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        adminService.getLogActions().then(setActions).catch(() => {});
    }, []);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const data = await adminService.getLogs(page, 20, {
                action: actionFilter || undefined,
                search: search || undefined,
            });
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Erro ao carregar logs', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page, actionFilter, search]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        setSearch(searchInput.trim());
    };

    return (
        <div className="space-y-6">
            <div>
                <Text variant="h3" className="text-gray-900">Monitoramento de Logs</Text>
                <Text variant="body" className="text-gray-500">
                    Acompanhe logins, cadastros, serviços, orçamentos, pagamentos e saques em tempo real.
                </Text>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
                    <Input
                        placeholder="Buscar por nome ou e-mail..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        leftElement={<Search className="w-4 h-4" />}
                    />
                    <Button type="submit" variant="secondary">Buscar</Button>
                </form>
                <div className="sm:w-64">
                    <Select
                        value={actionFilter}
                        onChange={(e) => {
                            setPage(1);
                            setActionFilter(e.target.value);
                        }}
                        options={[
                            { value: '', label: 'Todas as ações' },
                            ...actions.map((a) => ({ value: a, label: ACTION_LABELS[a] || a })),
                        ]}
                    />
                </div>
            </div>

            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Data/Hora</th>
                                <th className="px-6 py-3">Ação</th>
                                <th className="px-6 py-3">Usuário</th>
                                <th className="px-6 py-3">Detalhes</th>
                                <th className="px-6 py-3">IP</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-40" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                    </tr>
                                ))
                            ) : logs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        <Activity className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                                        Nenhum evento encontrado.
                                    </td>
                                </tr>
                            ) : (
                                logs.map((log) => (
                                    <tr key={log._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                            {format(new Date(log.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <ActionBadge action={log.action} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{log.userName || '—'}</div>
                                            <div className="text-gray-500 text-xs">{log.userEmail || ''}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={formatMetadata(log.metadata)}>
                                            {formatMetadata(log.metadata)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{log.ip || '—'}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            Página {pagination.page} de {pagination.pages} ({pagination.total} eventos)
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page >= pagination.pages}
                                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                            >
                                Próxima
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

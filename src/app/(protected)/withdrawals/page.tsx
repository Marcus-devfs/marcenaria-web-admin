'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminService, Withdrawal, Pagination } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowUpRight, Wallet } from 'lucide-react';

const STATUS_OPTIONS = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'processed', label: 'Processado' },
    { value: 'rejected', label: 'Rejeitado' },
];

const STATUS_BADGE: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-700',
    processed: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
};

const STATUS_LABEL: Record<string, string> = {
    pending: 'Pendente',
    processed: 'Processado',
    rejected: 'Rejeitado',
};

export default function WithdrawalsPage() {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            setLoading(true);
            try {
                const data = await adminService.getWithdrawals(page, 10, status);
                setWithdrawals(data.withdrawals);
                setPagination(data.pagination);
            } catch (err) {
                console.error('Erro ao carregar saques', err);
            } finally {
                setLoading(false);
            }
        };
        fetchWithdrawals();
    }, [page, status]);

    const getProfessional = (w: Withdrawal) => {
        if (typeof w.professionalId === 'object' && w.professionalId) {
            return w.professionalId;
        }
        return null;
    };

    return (
        <div className="space-y-6">
            <div>
                <Text variant="h3" className="text-gray-900">Saques</Text>
                <Text variant="body" className="text-gray-500">
                    Histórico de saques solicitados pelos profissionais.
                </Text>
            </div>

            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="w-48">
                        <Select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            {STATUS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Profissional</th>
                                <th className="px-6 py-3">Valor</th>
                                <th className="px-6 py-3">Tipo</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-12" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                        <td className="px-6 py-4" />
                                    </tr>
                                ))
                            ) : withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <Wallet className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                        <Text variant="muted">Nenhum saque encontrado.</Text>
                                    </td>
                                </tr>
                            ) : withdrawals.map((w) => {
                                const pro = getProfessional(w);
                                return (
                                    <tr key={w._id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4">
                                            <Text variant="body" className="font-medium text-gray-900">
                                                {pro?.name || '—'}
                                            </Text>
                                            <Text variant="small" className="text-gray-500">{pro?.email}</Text>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {formatCurrency(w.amount)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">{w.transferType}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[w.status]}`}>
                                                {STATUS_LABEL[w.status] || w.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(new Date(w.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {pro?._id && (
                                                <Link href={`/professional/${pro._id}`}>
                                                    <Button variant="ghost" size="sm" className="text-primary-600">
                                                        <ArrowUpRight className="w-4 h-4" />
                                                    </Button>
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <Text variant="small" className="text-gray-500">
                            Página {pagination.page} de {pagination.pages}
                        </Text>
                        <div className="flex gap-2">
                            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                                Anterior
                            </Button>
                            <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage((p) => p + 1)}>
                                Próxima
                            </Button>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    );
}

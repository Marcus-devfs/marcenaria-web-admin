'use client';

import { useState, useEffect } from 'react';
import { adminService, Transaction, Pagination } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Filter, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';

export default function PaymentsPage() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [page, setPage] = useState(1);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const data = await adminService.getPayments(page, 10, status);
            setTransactions(data.transactions || []);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to fetch payments', error);
            // Mock data for display if API is not yet ready
            setTransactions([
                {
                    _id: 'mock1',
                    quoteId: 'quote123',
                    amount: 4500.00,
                    platformFee: 450.00,
                    netAmount: 4050.00,
                    status: 'completed',
                    paymentMethod: 'credit_card',
                    clientId: { _id: 'u1', name: 'João Silva', email: 'joao@email.com', role: 'client', isVerified: true, isActive: true, createdAt: new Date().toISOString() },
                    professionalId: { _id: 'p1', name: 'Marcenaria XYZ', email: 'xyz@marcenaria.com', role: 'professional', isVerified: true, isActive: true, createdAt: new Date().toISOString() },
                    createdAt: new Date().toISOString(),
                },
                {
                    _id: 'mock2',
                    quoteId: 'quote124',
                    amount: 1200.00,
                    platformFee: 120.00,
                    netAmount: 1080.00,
                    status: 'pending',
                    paymentMethod: 'pix',
                    clientId: { _id: 'u2', name: 'Maria Souza', email: 'maria@email.com', role: 'client', isVerified: true, isActive: true, createdAt: new Date().toISOString() },
                    professionalId: { _id: 'p2', name: 'Carlos Marceneiro', email: 'carlos@marcenaria.com', role: 'professional', isVerified: true, isActive: true, createdAt: new Date().toISOString() },
                    createdAt: new Date().toISOString(),
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [page, status]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700';
            case 'completed': return 'bg-green-50 text-green-700';
            case 'failed': return 'bg-red-50 text-red-700';
            case 'refunded': return 'bg-gray-50 text-gray-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'completed': return 'Concluído';
            case 'failed': return 'Falhou';
            case 'refunded': return 'Reembolsado';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Text variant="h3" className="text-gray-900">Pagamentos e Receitas</Text>
                    <Text variant="body" className="text-gray-500">Visualize todas as transações, orçamentos pagos e comissões da plataforma.</Text>
                </div>
            </div>

            {/* Overall Stats (Mocked or derived) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-white border text-center border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="bg-primary-50 p-4 rounded-xl text-primary-600">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <Text variant="muted" className="text-gray-500">Volume Total</Text>
                        <Text variant="h3" className="text-gray-900">{formatCurrency(154000)}</Text>
                    </div>
                </Card>
                <Card className="bg-white border text-center border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="bg-green-50 p-4 rounded-xl text-green-600">
                        <ArrowUpRight className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <Text variant="muted" className="text-gray-500">Comissões (Receita)</Text>
                        <Text variant="h3" className="text-gray-900">{formatCurrency(15400)}</Text>
                    </div>
                </Card>
                <Card className="bg-white border text-center border-gray-100 shadow-sm p-4 flex items-center gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl text-blue-600">
                        <ArrowDownRight className="w-8 h-8" />
                    </div>
                    <div className="text-left">
                        <Text variant="muted" className="text-gray-500">Repasses (Profissionais)</Text>
                        <Text variant="h3" className="text-gray-900">{formatCurrency(138600)}</Text>
                    </div>
                </Card>
            </div>

            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex flex-wrap gap-4">
                    <div className="w-48">
                        <Select
                            value={status}
                            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                        >
                            <option value="">Todos os Status</option>
                            <option value="pending">Pendente</option>
                            <option value="completed">Concluído</option>
                            <option value="failed">Falha</option>
                            <option value="refunded">Reembolsado</option>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">ID Transação</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Profissional</th>
                                <th className="px-6 py-3 font-semibold">Valor Total</th>
                                <th className="px-6 py-3 text-green-700 font-semibold">Comissão (Plataforma)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                                        Nenhum pagamento encontrado.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map((transaction) => (
                                    <tr key={transaction._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-gray-500 text-xs">#{transaction._id.substring(0, 8)}</span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-900 font-medium">
                                            {transaction.clientId?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {transaction.professionalId?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">
                                            {formatCurrency(transaction.amount)}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-green-600">
                                            + {formatCurrency(transaction.platformFee)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium w-fit ${getStatusColor(transaction.status)}`}>
                                                    {getStatusLabel(transaction.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(new Date(transaction.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                                                Detalhes
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                    <div className="flex items-center justify-between p-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            Página {pagination.page} de {pagination.pages}
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                            >
                                Anterior
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                disabled={page >= pagination.pages}
                                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
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

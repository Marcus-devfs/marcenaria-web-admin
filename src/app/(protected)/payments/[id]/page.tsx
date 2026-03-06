'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminService, Transaction } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    ArrowLeft,
    Calendar,
    User as UserIcon,
    DollarSign,
    CreditCard,
    CheckCircle2,
    AlertCircle,
    Clock,
    ArrowUpRight,
    ArrowDownRight,
    Briefcase
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function PaymentDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayment = async () => {
            try {
                const data = await adminService.getPaymentById(id as string);
                console.log(data);
                setTransaction(data);
            } catch (error) {
                console.error('Failed to fetch payment details', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPayment();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="text-center py-12">
                <Text variant="h4" className="text-gray-900">Pagamento não encontrado</Text>
                <Button variant="secondary" onClick={() => router.back()} className="mt-4">
                    Voltar
                </Button>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'Pendente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock };
            case 'completed': return { label: 'Concluído', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 };
            case 'failed': return { label: 'Falhou', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle };
            case 'refunded': return { label: 'Reembolsado', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertCircle };
            default: return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertCircle };
        }
    };

    const getMethodLabel = (method: string) => {
        switch (method) {
            case 'credit_card': return 'Cartão de Crédito';
            case 'pix': return 'PIX';
            case 'bank_transfer': return 'Transferência Bancária';
            default: return method;
        }
    };

    const statusInfo = getStatusInfo(transaction.status);
    const StatusIcon = statusInfo.icon;

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => router.back()}
                    className="w-fit -ml-2 text-gray-500 hover:text-gray-700"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Voltar para Pagamentos
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Text variant="h3" className="text-gray-900">Transação #{transaction._id.substring(0, 8)}</Text>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {statusInfo.label}
                            </span>
                        </div>
                        <Text variant="body" className="text-gray-500 flex items-center gap-2">
                            Referência Asaas: <span className="font-mono text-xs">{transaction.transactionId || 'N/A'}</span>
                        </Text>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="p-4 bg-gray-900 text-white">
                            <Text variant="small" className="text-gray-400 font-bold uppercase tracking-wider mb-1">Valor Total</Text>
                            <Text variant="h4" className="text-white font-bold">{formatCurrency(transaction.amount)}</Text>
                        </Card>
                        <Card className="p-4 bg-white border border-green-100">
                            <Text variant="small" className="text-green-600 font-bold uppercase tracking-wider mb-1">Comissão App</Text>
                            <Text variant="h4" className="text-green-700 font-bold">+ {formatCurrency(transaction.appFee || transaction.platformFee || 0)}</Text>
                        </Card>
                        <Card className="p-4 bg-white border border-blue-100">
                            <Text variant="small" className="text-blue-600 font-bold uppercase tracking-wider mb-1">Líquido Profissional</Text>
                            <Text variant="h4" className="text-blue-700 font-bold">{formatCurrency(transaction.netAmount || 0)}</Text>
                        </Card>
                    </div>

                    {/* Transaction Details */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <CreditCard className="w-5 h-5 text-gray-400" />
                            <Text variant="h5" className="text-gray-900">Detalhes do Pagamento</Text>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                            <div className="space-y-1">
                                <Text variant="small" className="text-gray-400 font-medium">Método de Pagamento</Text>
                                <Text variant="body" className="text-gray-900 font-medium capitalize">{getMethodLabel(transaction.paymentMethod)}</Text>
                            </div>
                            <div className="space-y-1">
                                <Text variant="small" className="text-gray-400 font-medium">Data da Transação</Text>
                                <Text variant="body" className="text-gray-900 font-medium">
                                    {format(new Date(transaction.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                </Text>
                            </div>
                            <div className="space-y-1">
                                <Text variant="small" className="text-gray-400 font-medium">Data de Disponibilidade</Text>
                                <Text variant="body" className="text-gray-900 font-medium">
                                    {transaction.availableAt ? format(new Date(transaction.availableAt), "dd/MM/yyyy", { locale: ptBR }) : 'Imediato'}
                                </Text>
                            </div>
                            <div className="space-y-1">
                                <Text variant="small" className="text-gray-400 font-medium">Taxas de Checkout (Gateway)</Text>
                                <Text variant="body" className="text-gray-900 font-medium">
                                    {transaction.gatewayFee ? formatCurrency(transaction.gatewayFee) : 'N/A'}
                                </Text>
                            </div>
                        </div>
                    </Card>

                    {/* vinculated Service/Quote */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Briefcase className="w-5 h-5 text-gray-400" />
                            <Text variant="h5" className="text-gray-900">Vínculo com Serviço</Text>
                        </div>

                        {transaction.quoteId && typeof transaction.quoteId === 'object' ? (
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <Text variant="body" className="text-gray-900 font-bold">{transaction.quoteId.title}</Text>
                                    <Text variant="small" className="text-gray-500">ID Orçamento: {transaction.quoteId._id}</Text>
                                </div>
                                <Link href={`/quotes/${transaction.quoteId._id}`}>
                                    <Button variant="secondary" size="sm">Ver Orçamento</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between">
                                <Text variant="body" className="text-gray-500 italic">ID do Orçamento: {String(transaction.quoteId)}</Text>
                                <Link href={`/quotes/${String(transaction.quoteId)}`}>
                                    <Button variant="secondary" size="sm">Ver Orçamento</Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Sidebar - Parties */}
                <div className="space-y-6">
                    {/* Client Card */}
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                {transaction.clientId?.name?.substring(0, 2).toUpperCase() || 'CL'}
                            </div>
                            <div>
                                <Text variant="body" className="font-bold text-gray-900">{transaction.clientId?.name}</Text>
                                <Text variant="small" className="text-gray-500">Pagador (Cliente)</Text>
                            </div>
                        </div>
                        <Link href={`/client/${transaction.clientId?._id}`}>
                            <Button variant="ghost" className="w-full text-primary-600 justify-start px-0">
                                <ArrowUpRight className="w-4 h-4 mr-2" /> Ver Perfil
                            </Button>
                        </Link>
                    </Card>

                    {/* Professional Card */}
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">
                                {transaction.professionalId?.name?.substring(0, 2).toUpperCase() || 'PR'}
                            </div>
                            <div>
                                <Text variant="body" className="font-bold text-gray-900">{transaction.professionalId?.name}</Text>
                                <Text variant="small" className="text-gray-500">Beneficiário (Profissional)</Text>
                            </div>
                        </div>
                        <Link href={`/professional/${transaction.professionalId?._id}`}>
                            <Button variant="ghost" className="w-full text-green-600 justify-start px-0">
                                <ArrowUpRight className="w-4 h-4 mr-2" /> Ver Perfil
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

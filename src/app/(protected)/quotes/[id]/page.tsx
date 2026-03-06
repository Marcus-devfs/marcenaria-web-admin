'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminService, Quote } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    ArrowLeft,
    Calendar,
    User as UserIcon,
    MapPin,
    Clock,
    DollarSign,
    AlertCircle,
    CheckCircle2,
    FileText,
    ExternalLink,
    CreditCard
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function QuoteDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [quote, setQuote] = useState<Quote | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuote = async () => {
            try {
                const data = await adminService.getQuoteById(id as string);
                setQuote(data);
            } catch (error) {
                console.error('Failed to fetch quote details', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchQuote();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!quote) {
        return (
            <div className="text-center py-12">
                <Text variant="h4" className="text-gray-900">Orçamento não encontrado</Text>
                <Button variant="secondary" onClick={() => router.back()} className="mt-4">
                    Voltar
                </Button>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'Pendente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock };
            case 'accepted': return { label: 'Aceito', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 };
            case 'rejected': return { label: 'Rejeitado', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle };
            case 'expired': return { label: 'Expirado', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: Clock };
            default: return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertCircle };
        }
    };

    const getPaymentStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'Pagamento Pendente', color: 'text-yellow-600' };
            case 'paid': return { label: 'Pago', color: 'text-green-600' };
            case 'refunded': return { label: 'Reembolsado', color: 'text-red-600' };
            default: return { label: status, color: 'text-gray-600' };
        }
    };

    const statusInfo = getStatusInfo(quote.status);
    const paymentStatusInfo = getPaymentStatusInfo(quote.paymentStatus);
    const StatusIcon = statusInfo.icon;

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

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
                    Voltar para Orçamentos
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Text variant="h3" className="text-gray-900">{quote.title}</Text>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {statusInfo.label}
                            </span>
                        </div>
                        <Text variant="body" className="text-gray-500 flex items-center gap-2">
                            ID: <span className="font-mono text-xs">{quote._id}</span>
                        </Text>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className="text-right">
                            <Text variant="small" className="text-gray-400 uppercase font-bold tracking-wider">Total do Orçamento</Text>
                            <Text variant="h4" className="text-primary-700">{formatCurrency(quote.totalPrice)}</Text>
                        </div>
                        <div className="p-3 bg-primary-50 rounded-lg text-primary-600">
                            <DollarSign className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Summary Card */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <Text variant="h5" className="text-gray-900">Resumo do Orçamento</Text>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <Text variant="small" className="text-gray-400 font-bold mb-1 uppercase tracking-wider">Descrição Adicional</Text>
                                <Text variant="body" className="text-gray-600">
                                    {quote.description || "Nenhuma descrição adicional fornecida."}
                                </Text>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded text-gray-400">
                                        <Calendar className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <Text variant="small" className="text-gray-400 font-medium">Válido até</Text>
                                        <Text variant="body" className="text-gray-900 font-medium font-mono">
                                            {format(new Date(quote.validUntil), "dd/MM/yyyy", { locale: ptBR })}
                                        </Text>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-50 rounded text-gray-400">
                                        <CreditCard className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <Text variant="small" className="text-gray-400 font-medium">Status do Pagamento</Text>
                                        <Text variant="body" className={`font-semibold ${paymentStatusInfo.color}`}>
                                            {paymentStatusInfo.label}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Service Reference */}
                    <Card className="p-6 space-y-4 border-l-4 border-l-primary-500 overflow-hidden relative">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <Text variant="small" className="text-primary-600 font-bold uppercase tracking-wider">Referente ao Serviço</Text>
                                <Text variant="h5" className="text-gray-900 truncate pr-8">{quote.serviceId.title}</Text>
                            </div>
                            <Link href={`/services/${quote.serviceId._id}`}>
                                <Button variant="ghost" size="sm" className="text-primary-600">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Ver Serviço
                                </Button>
                            </Link>
                        </div>
                        <Text variant="small" className="text-gray-500 capitalize">{quote.serviceId.category}</Text>
                    </Card>

                    {/* Items Breakdown (Materials and Labor) */}
                    {(quote as any).materials?.length > 0 && (
                        <Card className="overflow-hidden border-gray-100">
                            <div className="p-4 bg-gray-50 border-b border-gray-100">
                                <Text variant="h5" className="text-gray-900">Materiais</Text>
                            </div>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white text-gray-400 uppercase font-bold text-[10px] tracking-widest border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3 text-center">Qtd</th>
                                        <th className="px-6 py-3 text-right">Preço Unit.</th>
                                        <th className="px-6 py-3 text-right">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {(quote as any).materials.map((item: any, idx: number) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                                            <td className="px-6 py-4 text-center text-gray-600">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    )}

                    {(quote as any).labor && (
                        <Card className="p-6 flex flex-col md:flex-row justify-between items-center bg-primary-50/50 border-primary-100">
                            <div>
                                <Text variant="h5" className="text-gray-900">Mão de Obra</Text>
                                <Text variant="body" className="text-gray-500">Valor total pelo serviço profissional</Text>
                            </div>
                            <div className="text-right mt-4 md:mt-0">
                                <Text variant="h4" className="text-primary-700">{formatCurrency((quote as any).labor.total || (quote as any).labor.hours * (quote as any).labor.pricePerHour)}</Text>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Professional Info */}
                    <Card className="p-6 space-y-6">
                        <div className="pb-4 border-b border-gray-100 text-center">
                            <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                {quote.professionalId.name.substring(0, 2).toUpperCase()}
                            </div>
                            <Text variant="h5" className="text-gray-900">{quote.professionalId.name}</Text>
                            <Text variant="small" className="text-gray-500">Profissional Solicitante</Text>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded text-gray-400">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <Text variant="small" className="text-gray-400 font-medium">E-mail</Text>
                                    <Text variant="body" className="text-gray-900 text-sm truncate">{quote.professionalId.email}</Text>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <Text variant="small" className="text-gray-400 font-medium">Telefone</Text>
                                    <Text variant="body" className="text-gray-900 text-sm">{quote.professionalId.phone || 'N/A'}</Text>
                                </div>
                            </div>
                        </div>

                        <Link href={`/professional/${quote.professionalId._id}`}>
                            <Button variant="secondary" className="w-full mt-2">
                                Ver Perfil do Profissional
                            </Button>
                        </Link>
                    </Card>

                    {/* Client Info Reference */}
                    <Card className="p-6 space-y-6 bg-gray-50/50 border-gray-100">
                        <div className="pb-4 border-b border-gray-100 text-center">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-xl font-bold mx-auto mb-3">
                                {quote.clientId.name.substring(0, 2).toUpperCase()}
                            </div>
                            <Text variant="h5" className="text-gray-900">{quote.clientId.name}</Text>
                            <Text variant="small" className="text-gray-500">Cliente Destinatário</Text>
                        </div>

                        <Link href={`/client/${quote.clientId._id}`}>
                            <Button variant="ghost" className="w-full text-gray-600 hover:text-gray-900">
                                Ver Perfil do Cliente
                            </Button>
                        </Link>
                    </Card>
                </div>
            </div>
        </div>
    );
}

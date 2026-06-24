'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { adminService, Service } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    ArrowLeft,
    Calendar,
    User as UserIcon,
    MapPin,
    Clock,
    Tag,
    AlertCircle,
    CheckCircle2,
    Briefcase,
    Image as ImageIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function ServiceDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [cancelReason, setCancelReason] = useState('');
    const [cancelling, setCancelling] = useState(false);
    const [cancelError, setCancelError] = useState('');
    const [showCancelForm, setShowCancelForm] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const data = await adminService.getServiceById(id as string);
                setService(data);
            } catch (error) {
                console.error('Failed to fetch service details', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchService();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="text-center py-12">
                <Text variant="h4" className="text-gray-900">Serviço não encontrado</Text>
                <Button variant="secondary" onClick={() => router.back()} className="mt-4">
                    Voltar
                </Button>
            </div>
        );
    }

    const getStatusInfo = (status: string) => {
        switch (status) {
            case 'pending': return { label: 'Pendente', color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: Clock };
            case 'accepted': return { label: 'Aceito', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: CheckCircle2 };
            case 'in_progress': return { label: 'Em Andamento', color: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Briefcase };
            case 'completed': return { label: 'Concluído', color: 'bg-green-50 text-green-700 border-green-200', icon: CheckCircle2 };
            case 'cancelled': return { label: 'Cancelado', color: 'bg-red-50 text-red-700 border-red-200', icon: AlertCircle };
            default: return { label: status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: AlertCircle };
        }
    };

    const statusInfo = getStatusInfo(service.status);
    const StatusIcon = statusInfo.icon;

    const canCancel = service.status !== 'completed' && service.status !== 'cancelled';

    const handleCancel = async () => {
        if (!service) return;
        const confirmed = window.confirm('Tem certeza que deseja cancelar este serviço?');
        if (!confirmed) return;

        setCancelling(true);
        setCancelError('');
        try {
            const updated = await adminService.cancelService(
                service._id,
                cancelReason.trim() || undefined
            );
            setService(updated);
            setShowCancelForm(false);
        } catch (err: any) {
            setCancelError(err.response?.data?.message || 'Falha ao cancelar serviço.');
        } finally {
            setCancelling(false);
        }
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
                    Voltar para Serviços
                </Button>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <Text variant="h3" className="text-gray-900">{service.title}</Text>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
                                <StatusIcon className="w-4 h-4" />
                                {statusInfo.label}
                            </span>
                        </div>
                        <Text variant="body" className="text-gray-500 flex items-center gap-2">
                            ID: <span className="font-mono text-xs">{service._id}</span>
                        </Text>
                    </div>
                    {canCancel && (
                        <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setShowCancelForm((v) => !v)}
                        >
                            Cancelar serviço
                        </Button>
                    )}
                </div>
                {showCancelForm && canCancel && (
                    <Card className="p-4 border border-red-100 bg-red-50/50 space-y-3">
                        <Text variant="body" className="text-gray-900 font-medium">Cancelamento administrativo</Text>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            placeholder="Motivo do cancelamento (opcional)..."
                            rows={2}
                            className="w-full resize-none border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        />
                        {cancelError && <Text variant="small" className="text-red-600">{cancelError}</Text>}
                        <div className="flex gap-2">
                            <Button variant="danger" size="sm" onClick={handleCancel} disabled={cancelling}>
                                {cancelling ? 'Processando...' : 'Confirmar cancelamento'}
                            </Button>
                            <Button variant="secondary" size="sm" onClick={() => setShowCancelForm(false)}>
                                Voltar
                            </Button>
                        </div>
                    </Card>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <Card className="p-6 space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Text variant="h5" className="text-gray-900">Descrição do Problema</Text>
                        </div>
                        <Text variant="body" className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                            {service.description}
                        </Text>
                    </Card>

                    {/* Service Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="p-4 flex items-start gap-4">
                            <div className="p-2 bg-primary-50 rounded-lg text-primary-600">
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <Text variant="small" className="text-gray-400 uppercase font-bold tracking-wider mb-1">Categoria</Text>
                                <Text variant="body" className="text-gray-900 font-medium capitalize">{service.category}</Text>
                            </div>
                        </Card>

                        <Card className="p-4 flex items-start gap-4">
                            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                                <Calendar className="w-5 h-5" />
                            </div>
                            <div>
                                <Text variant="small" className="text-gray-400 uppercase font-bold tracking-wider mb-1">Postado em</Text>
                                <Text variant="body" className="text-gray-900 font-medium">
                                    {format(new Date(service.createdAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                </Text>
                            </div>
                        </Card>
                    </div>

                    {/* Timeline / Progress */}
                    <Card className="p-6 space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <Text variant="h5" className="text-gray-900">Linha do Tempo do Serviço</Text>
                        </div>

                        <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                            <div className="relative">
                                <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary-600 border-2 border-white ring-4 ring-primary-50"></div>
                                <div className="flex flex-col">
                                    <Text variant="body" className="text-gray-900 font-semibold">Solicitação Criada</Text>
                                    <Text variant="small" className="text-gray-500">
                                        {format(new Date(service.createdAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                    </Text>
                                </div>
                            </div>

                            {service.routeStartedAt && (
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-500 border-2 border-white"></div>
                                    <div className="flex flex-col">
                                        <Text variant="body" className="text-gray-900 font-semibold">Início do Deslocamento</Text>
                                        <Text variant="small" className="text-gray-500">
                                            {format(new Date(service.routeStartedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </Text>
                                    </div>
                                </div>
                            )}

                            {service.arrivedAt && (
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white"></div>
                                    <div className="flex flex-col">
                                        <Text variant="body" className="text-gray-900 font-semibold">Chegada ao Local</Text>
                                        <Text variant="small" className="text-gray-500">
                                            {format(new Date(service.arrivedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </Text>
                                    </div>
                                </div>
                            )}

                            {service.serviceStartedAt && (
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-yellow-500 border-2 border-white"></div>
                                    <div className="flex flex-col">
                                        <Text variant="body" className="text-gray-900 font-semibold">Início do Serviço</Text>
                                        <Text variant="small" className="text-gray-500">
                                            {format(new Date(service.serviceStartedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </Text>
                                    </div>
                                </div>
                            )}

                            {service.status === 'completed' && service.updatedAt && (
                                <div className="relative">
                                    <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                                    <div className="flex flex-col">
                                        <Text variant="body" className="text-gray-900 font-semibold">Serviço Concluído</Text>
                                        <Text variant="small" className="text-gray-500">
                                            {format(new Date(service.updatedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                        </Text>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Photos Gallery */}
                    {service.images && service.images.length > 0 && (
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <ImageIcon className="w-5 h-5 text-gray-400" />
                                <Text variant="h5" className="text-gray-900">Fotos do Serviço</Text>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {service.images.map((img, idx) => {
                                    const imgUrl = img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL}${img}`;
                                    return (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-gray-100 hover:opacity-90 cursor-pointer transition-opacity group relative">
                                            <img src={imgUrl} alt={`Service ${idx + 1}`} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <ImageIcon className="text-white w-6 h-6" />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* Accepted Quote Info */}
                    {service.acceptedQuote && (
                        <Card className="p-6 space-y-6 border-l-4 border-l-green-500">
                            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-green-600" />
                                    <Text variant="h5" className="text-gray-900">Orçamento Aceito</Text>
                                </div>
                                <Link href={`/quotes/${service.acceptedQuote._id}`}>
                                    <Button variant="ghost" size="sm" className="text-primary-600">
                                        Ver Orçamento Completo
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <Text variant="small" className="text-gray-400 font-bold uppercase tracking-wider mb-1">Valor Total</Text>
                                        <Text variant="h4" className="text-primary-700 font-bold">
                                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.acceptedQuote.totalPrice)}
                                        </Text>
                                    </div>

                                    {service.acceptedQuote.materials && service.acceptedQuote.materials.length > 0 && (
                                        <div>
                                            <Text variant="small" className="text-gray-400 font-bold uppercase tracking-wider mb-2">Materiais Principais</Text>
                                            <div className="flex flex-wrap gap-2">
                                                {service.acceptedQuote.materials.map((m: any, i: number) => (
                                                    <span key={i} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">
                                                        {m.name} ({m.quantity})
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="bg-green-50/50 p-4 rounded-xl border border-green-100 flex flex-col justify-center">
                                    <div className="flex items-center gap-2 mb-2 text-green-700">
                                        <CheckCircle2 className="w-5 h-5" />
                                        <Text variant="body" className="font-semibold">Serviço em Execução</Text>
                                    </div>
                                    <Text variant="small" className="text-green-600">
                                        O cliente já aprovou este orçamento e o valor total de {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.acceptedQuote.totalPrice)} foi acordado.
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    )}

                    {/* Address Card */}
                    {service.address && (
                        <Card className="p-6 space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                                <MapPin className="w-5 h-5 text-gray-400" />
                                <Text variant="h5" className="text-gray-900">Local do Serviço</Text>
                            </div>
                            <div className="space-y-1">
                                <Text variant="body" className="text-gray-900 font-medium">
                                    {service.address.street}, {service.address.number}
                                </Text>
                                <Text variant="body" className="text-gray-600">
                                    {service.address.neighborhood} - {service.address.city}, {service.address.state}
                                </Text>
                                <Text variant="small" className="text-gray-400">
                                    CEP: {service.address.zipCode}
                                </Text>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-8">
                    {/* Client Info */}
                    <Card className="p-6 space-y-6">
                        <div className="pb-4 border-b border-gray-100 text-center">
                            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 text-2xl font-bold mx-auto mb-3">
                                {service.clientId.name.substring(0, 2).toUpperCase()}
                            </div>
                            <Text variant="h5" className="text-gray-900">{service.clientId.name}</Text>
                            <Text variant="small" className="text-gray-500">Cliente Requisitante</Text>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded text-gray-400">
                                    <UserIcon className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <Text variant="small" className="text-gray-400 font-medium">E-mail</Text>
                                    <Text variant="body" className="text-gray-900 text-sm truncate">{service.clientId.email}</Text>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gray-50 rounded text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div className="flex flex-col">
                                    <Text variant="small" className="text-gray-400 font-medium">Telefone</Text>
                                    <Text variant="body" className="text-gray-900 text-sm">{service.clientId.phone || 'N/A'}</Text>
                                </div>
                            </div>
                        </div>

                        <Link href={`/client/${service.clientId._id}`}>
                            <Button variant="secondary" className="w-full mt-2">
                                Ver Perfil do Cliente
                            </Button>
                        </Link>
                    </Card>

                    {/* Professional Info (if assigned) */}
                    {service.professionalId && (
                        <Card className="p-6 space-y-6 bg-primary-50/30 border-primary-100">
                            <div className="pb-4 border-b border-primary-100 text-center">
                                <div className="w-16 h-16 bg-primary-600 rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
                                    {service.professionalId.name.substring(0, 2).toUpperCase()}
                                </div>
                                <Text variant="h5" className="text-gray-900">{service.professionalId.name}</Text>
                                <Text variant="small" className="text-primary-600 font-medium">Profissional Alocado</Text>
                            </div>

                            <Link href={`/professional/${service.professionalId._id}`}>
                                <Button className="w-full">
                                    Ver Perfil do Profissional
                                </Button>
                            </Link>
                        </Card>
                    )}

                    {/* Budget Information */}
                    {service.budget && (
                        <Card className="p-6 bg-gray-900 text-white space-y-4">
                            <Text variant="h5" className="text-white">Orçamento Sugerido</Text>
                            <div className="flex justify-between items-end">
                                <div>
                                    <Text variant="small" className="text-gray-400 uppercase font-bold tracking-wider">Mínimo</Text>
                                    <Text variant="h5" className="text-white">
                                        {service.budget.min ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.budget.min) : 'N/A'}
                                    </Text>
                                </div>
                                <div className="text-right">
                                    <Text variant="small" className="text-gray-400 uppercase font-bold tracking-wider">Máximo</Text>
                                    <Text variant="h5" className="text-white">
                                        {service.budget.max ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.budget.max) : 'N/A'}
                                    </Text>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

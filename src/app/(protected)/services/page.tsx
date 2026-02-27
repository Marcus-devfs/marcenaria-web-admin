'use client';

import { useState, useEffect } from 'react';
import { adminService, Service, Pagination } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Search, Filter, PenTool, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const [category, setCategory] = useState('');
    const [page, setPage] = useState(1);

    const fetchServices = async () => {
        setLoading(true);
        try {
            const data = await adminService.getServices(page, 10, status, category);
            setServices(data.services);
            setPagination(data.pagination);
        } catch (error) {
            console.error('Failed to fetch services', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, [page, status, category]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-50 text-yellow-700';
            case 'accepted': return 'bg-blue-50 text-blue-700';
            case 'in_progress': return 'bg-indigo-50 text-indigo-700';
            case 'completed': return 'bg-green-50 text-green-700';
            case 'cancelled': return 'bg-red-50 text-red-700';
            default: return 'bg-gray-50 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendente';
            case 'accepted': return 'Aceito';
            case 'in_progress': return 'Em Andamento';
            case 'completed': return 'Concluído';
            case 'cancelled': return 'Cancelado';
            default: return status;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Text variant="h3" className="text-gray-900">Serviços</Text>
                    <Text variant="body" className="text-gray-500">Gerencie os pedidos de serviço da plataforma.</Text>
                </div>
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
                            <option value="accepted">Aceito</option>
                            <option value="in_progress">Em Andamento</option>
                            <option value="completed">Concluído</option>
                            <option value="cancelled">Cancelado</option>
                        </Select>
                    </div>

                    <div className="w-48">
                        <Select
                            value={category}
                            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                        >
                            <option value="">Todas as Categorias</option>
                            <option value="moveis">Móveis</option>
                            <option value="reparos">Reparos</option>
                            <option value="instalacao">Instalação</option>
                            <option value="portas">Portas</option>
                            <option value="janelas">Janelas</option>
                        </Select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Serviço</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Profissional</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24"></div></td>
                                        <td className="px-6 py-4"></td>
                                    </tr>
                                ))
                            ) : services.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                        Nenhum serviço encontrado.
                                    </td>
                                </tr>
                            ) : (
                                services.map((service) => (
                                    <tr key={service._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{service.title}</span>
                                                <span className="text-xs text-gray-500 capitalize">{service.category}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {service.clientId?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {service.professionalId?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}>
                                                {getStatusLabel(service.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(new Date(service.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
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

'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Text } from '@/components/ui/Text';
import { Card } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { MessageCircle } from 'lucide-react';

interface SupportTicket {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
    };
    subject: string;
    status: 'open' | 'in_progress' | 'closed';
    messages: {
        senderId: string;
        senderRole: 'user' | 'admin';
        message: string;
        createdAt: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

const STATUS_OPTIONS = [
    { value: '', label: 'Todos os status' },
    { value: 'open', label: 'Abertos' },
    { value: 'in_progress', label: 'Em andamento' },
    { value: 'closed', label: 'Encerrados' },
];

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    open: { label: 'Aberto', className: 'bg-blue-50 text-blue-700' },
    in_progress: { label: 'Em andamento', className: 'bg-yellow-50 text-yellow-700' },
    closed: { label: 'Encerrado', className: 'bg-gray-100 text-gray-600' },
};

export default function SupportPage() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: '20' });
            if (statusFilter) params.set('status', statusFilter);
            const res = await api.get(`/support/admin/all?${params}`);
            setTickets(res.data.data.tickets);
            setTotalPages(res.data.data.pagination.pages || 1);
        } catch (err) {
            console.error('Erro ao carregar tickets de suporte', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [page, statusFilter]);

    return (
        <div className="space-y-6">
            <div>
                <Text variant="h3" className="text-gray-900">Suporte</Text>
                <Text variant="body" className="text-gray-500">Gerencie os tickets de suporte dos usuários.</Text>
            </div>

            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                    <div className="w-48">
                        <Select
                            value={statusFilter}
                            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
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
                                <th className="px-6 py-3">Usuário</th>
                                <th className="px-6 py-3">Assunto</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Mensagens</th>
                                <th className="px-6 py-3">Atualizado em</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-48" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-8" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16 ml-auto" /></td>
                                    </tr>
                                ))
                            ) : tickets.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                        <Text variant="muted">Nenhum ticket encontrado.</Text>
                                    </td>
                                </tr>
                            ) : tickets.map((ticket) => {
                                const badge = STATUS_BADGE[ticket.status];
                                const lastMessage = ticket.messages[ticket.messages.length - 1];
                                return (
                                    <tr key={ticket._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div>
                                                <Text variant="body" className="font-medium text-gray-900">
                                                    {ticket.userId?.name || '—'}
                                                </Text>
                                                <Text variant="small" className="text-gray-500">
                                                    {ticket.userId?.email}
                                                </Text>
                                                <span className="text-xs text-gray-400 capitalize">
                                                    {ticket.userId?.role === 'client' ? 'Cliente' : 'Profissional'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Text variant="body" className="text-gray-800 max-w-xs truncate">
                                                {ticket.subject}
                                            </Text>
                                            {lastMessage && (
                                                <Text variant="small" className="text-gray-400 truncate max-w-xs">
                                                    {lastMessage.senderRole === 'admin' ? 'Você: ' : 'Usuário: '}
                                                    {lastMessage.message}
                                                </Text>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.className}`}>
                                                {badge.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Text variant="body" className="text-gray-700">{ticket.messages.length}</Text>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Text variant="small" className="text-gray-500">
                                                {new Date(ticket.updatedAt).toLocaleDateString('pt-BR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </Text>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                href={`/support/${ticket._id}`}
                                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                                            >
                                                Responder
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                        >
                            Anterior
                        </button>
                        <Text variant="small" className="text-gray-600">
                            {page} / {totalPages}
                        </Text>
                        <button
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            className="px-3 py-1 text-sm rounded border border-gray-200 disabled:opacity-40 hover:bg-gray-50"
                        >
                            Próximo
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}

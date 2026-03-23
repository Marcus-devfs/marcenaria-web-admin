'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Send, User, Headphones, XCircle, RotateCcw } from 'lucide-react';

interface SupportMessage {
    senderId: string;
    senderRole: 'user' | 'admin';
    message: string;
    createdAt: string;
}

interface SupportTicket {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        role: string;
    };
    subject: string;
    status: 'open' | 'in_progress' | 'closed';
    messages: SupportMessage[];
    createdAt: string;
    updatedAt: string;
}

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
    open: { label: 'Aberto', className: 'bg-blue-50 text-blue-700' },
    in_progress: { label: 'Em andamento', className: 'bg-yellow-50 text-yellow-700' },
    closed: { label: 'Encerrado', className: 'bg-gray-100 text-gray-600' },
};

export default function SupportTicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchTicket = async () => {
        try {
            const res = await api.get(`/support/admin/${id}`);
            setTicket(res.data.data.ticket);
        } catch (err) {
            console.error('Erro ao carregar ticket', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [ticket?.messages]);

    const handleReply = async () => {
        if (!reply.trim() || !ticket) return;
        setSending(true);
        try {
            const res = await api.post(`/support/admin/${ticket._id}/reply`, { message: reply.trim() });
            setTicket(res.data.data.ticket);
            setReply('');
        } catch (err) {
            console.error('Erro ao enviar resposta', err);
        } finally {
            setSending(false);
        }
    };

    const handleStatusChange = async (status: string) => {
        if (!ticket) return;
        setUpdatingStatus(true);
        try {
            const res = await api.patch(`/support/admin/${ticket._id}/status`, { status });
            setTicket(res.data.data.ticket);
        } catch (err) {
            console.error('Erro ao atualizar status', err);
        } finally {
            setUpdatingStatus(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="text-center py-16">
                <Text variant="muted">Ticket não encontrado.</Text>
            </div>
        );
    }

    const badge = STATUS_BADGE[ticket.status];

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div className="flex-1">
                    <Text variant="h4" className="text-gray-900">{ticket.subject}</Text>
                    <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                        </span>
                        <Text variant="small" className="text-gray-400">
                            {ticket.userId?.name} ({ticket.userId?.role === 'client' ? 'Cliente' : 'Profissional'})
                        </Text>
                    </div>
                </div>
                {ticket.status === 'closed' ? (
                    <button
                        onClick={() => handleStatusChange('open')}
                        disabled={updatingStatus}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 border border-blue-200 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-60"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {updatingStatus ? 'Aguarde...' : 'Reabrir'}
                    </button>
                ) : (
                    <button
                        onClick={() => handleStatusChange('closed')}
                        disabled={updatingStatus}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 border border-red-200 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
                    >
                        <XCircle className="w-4 h-4" />
                        {updatingStatus ? 'Aguarde...' : 'Encerrar chamado'}
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="bg-white border border-gray-100 shadow-sm rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <Text variant="small" className="text-gray-500">
                        {ticket.messages.length} mensagem{ticket.messages.length !== 1 ? 's' : ''}
                    </Text>
                </div>

                <div className="p-4 space-y-4 max-h-[480px] overflow-y-auto">
                    {ticket.messages.map((msg, index) => {
                        const isAdmin = msg.senderRole === 'admin';
                        return (
                            <div key={index} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] ${isAdmin ? 'items-end' : 'items-start'} flex flex-col`}>
                                    <div className={`flex items-center gap-1.5 mb-1 ${isAdmin ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isAdmin ? 'bg-primary-100' : 'bg-gray-100'}`}>
                                            {isAdmin
                                                ? <Headphones className="w-3.5 h-3.5 text-primary-600" />
                                                : <User className="w-3.5 h-3.5 text-gray-500" />
                                            }
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {isAdmin ? 'Suporte' : ticket.userId?.name}
                                        </span>
                                    </div>
                                    <div className={`px-4 py-3 rounded-2xl text-sm ${
                                        isAdmin
                                            ? 'bg-primary-600 text-white rounded-tr-sm'
                                            : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}>
                                        {msg.message}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1">
                                        {new Date(msg.createdAt).toLocaleString('pt-BR', {
                                            day: '2-digit',
                                            month: 'short',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Reply input */}
                {ticket.status === 'closed' ? (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
                        <Text variant="small" className="text-gray-500">
                            Ticket encerrado. Altere o status para responder novamente.
                        </Text>
                    </div>
                ) : (
                    <div className="p-4 border-t border-gray-100 flex gap-3 items-end">
                        <textarea
                            value={reply}
                            onChange={(e) => setReply(e.target.value)}
                            placeholder="Digite sua resposta..."
                            rows={3}
                            className="flex-1 resize-none border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleReply();
                            }}
                        />
                        <Button
                            onClick={handleReply}
                            disabled={sending || !reply.trim()}
                            className="flex items-center gap-2 h-10"
                        >
                            <Send className="w-4 h-4" />
                            {sending ? 'Enviando...' : 'Responder'}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

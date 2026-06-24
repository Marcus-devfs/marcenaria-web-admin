'use client';

import { useEffect, useState } from 'react';
import { adminService, AdminReview, Pagination } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Star, Trash2 } from 'lucide-react';

export default function ReviewsPage() {
    const [reviews, setReviews] = useState<AdminReview[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [page, setPage] = useState(1);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const data = await adminService.getReviews(page, 10);
            setReviews(data.reviews);
            setPagination(data.pagination);
        } catch (err) {
            console.error('Erro ao carregar avaliações', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [page]);

    const handleDelete = async (id: string) => {
        if (!confirm('Remover esta avaliação? Esta ação não pode ser desfeita.')) return;

        setDeletingId(id);
        try {
            await adminService.deleteReview(id);
            await fetchReviews();
        } catch (err) {
            console.error('Erro ao remover avaliação', err);
            alert('Não foi possível remover a avaliação.');
        } finally {
            setDeletingId(null);
        }
    };

    const renderStars = (rating: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`}
                />
            ))}
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <Text variant="h3" className="text-gray-900">Avaliações</Text>
                <Text variant="body" className="text-gray-500">
                    Modere avaliações de clientes sobre profissionais.
                </Text>
            </div>

            <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-600 font-medium">
                            <tr>
                                <th className="px-6 py-3">Serviço</th>
                                <th className="px-6 py-3">Cliente</th>
                                <th className="px-6 py-3">Profissional</th>
                                <th className="px-6 py-3">Nota</th>
                                <th className="px-6 py-3">Comentário</th>
                                <th className="px-6 py-3">Data</th>
                                <th className="px-6 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-32" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-28" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-20" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-48" /></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-24" /></td>
                                        <td className="px-6 py-4" />
                                    </tr>
                                ))
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                        Nenhuma avaliação encontrada.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => (
                                    <tr key={review._id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {(review.serviceId as { title?: string })?.title || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {review.client?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {review.professional?.name || '—'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {renderStars(review.rating)}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate">
                                            {review.comment || '—'}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {format(new Date(review.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                disabled={deletingId === review._id}
                                                onClick={() => handleDelete(review._id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

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

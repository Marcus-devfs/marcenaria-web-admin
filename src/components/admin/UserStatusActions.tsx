'use client';

import { useState } from 'react';
import { adminService, User } from '@/services/adminService';
import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Ban, CheckCircle } from 'lucide-react';

interface UserStatusActionsProps {
    user: User;
    onUpdated: (user: User) => void;
}

export function UserStatusActions({ user, onUpdated }: UserStatusActionsProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleToggle = async () => {
        const action = user.isActive ? 'desativar' : 'reativar';
        const confirmed = window.confirm(
            `Tem certeza que deseja ${action} a conta de ${user.name}?`
        );
        if (!confirmed) return;

        setLoading(true);
        setError('');
        try {
            const updated = user.isActive
                ? await adminService.deactivateUser(user._id)
                : await adminService.reactivateUser(user._id);
            onUpdated(updated);
        } catch (err: any) {
            setError(err.response?.data?.message || `Falha ao ${action} usuário.`);
        } finally {
            setLoading(false);
        }
    };

    if (user.role === 'admin') {
        return null;
    }

    return (
        <div className="flex flex-col items-end gap-2">
            {error && (
                <Text variant="small" className="text-red-600 max-w-xs text-right">{error}</Text>
            )}
            <Button
                variant={user.isActive ? 'danger' : 'primary'}
                size="sm"
                onClick={handleToggle}
                disabled={loading}
                className="flex items-center gap-2"
            >
                {user.isActive ? (
                    <>
                        <Ban className="w-4 h-4" />
                        {loading ? 'Aguarde...' : 'Desativar conta'}
                    </>
                ) : (
                    <>
                        <CheckCircle className="w-4 h-4" />
                        {loading ? 'Aguarde...' : 'Reativar conta'}
                    </>
                )}
            </Button>
        </div>
    );
}

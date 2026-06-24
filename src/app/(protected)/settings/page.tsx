'use client';

import { useState } from 'react';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Shield, Save } from 'lucide-react';
import { adminService } from '@/services/adminService';

export default function SettingsPage() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async () => {
        setMessage('');
        setError('');

        if (newPassword !== confirmPassword) {
            setError('A confirmação da senha não confere.');
            return;
        }

        if (newPassword.length < 6) {
            setError('A nova senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsSaving(true);
        try {
            await adminService.changePassword(currentPassword, newPassword);
            setMessage('Senha atualizada com sucesso.');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Falha ao atualizar senha.');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <Text variant="h3" className="text-gray-900">Configurações</Text>
                <Text variant="body" className="text-gray-500">
                    Gerencie a segurança da sua conta administrativa.
                </Text>
            </div>

            <Card className="p-6">
                <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
                    <Shield className="w-5 h-5 text-primary-600" />
                    <Text variant="h5" className="text-gray-900">Alterar senha</Text>
                </div>

                <div className="space-y-4 max-w-md">
                    <Input
                        label="Senha atual"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                    />
                    <Input
                        label="Nova senha"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mín. 6 caracteres, maiúscula, minúscula e número"
                        helperText="Use letras maiúsculas, minúsculas e um número."
                    />
                    <Input
                        label="Confirmar nova senha"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a nova senha"
                    />

                    {error && (
                        <Text variant="small" className="text-red-600">{error}</Text>
                    )}
                    {message && (
                        <Text variant="small" className="text-green-600">{message}</Text>
                    )}

                    <Button
                        onClick={handleChangePassword}
                        disabled={isSaving || !currentPassword || !newPassword || !confirmPassword}
                        className="flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        {isSaving ? 'Salvando...' : 'Atualizar senha'}
                    </Button>
                </div>
            </Card>

            <Card className="p-6 bg-gray-50 border border-gray-100">
                <Text variant="body" className="text-gray-600">
                    Dica: troque a senha padrão antes de colocar o painel no ar. Use uma senha forte e exclusiva para o administrador.
                </Text>
            </Card>
        </div>
    );
}

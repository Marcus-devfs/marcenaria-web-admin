'use client';

import { useState } from 'react';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Building, Settings, Bell, Shield, Wallet, Save } from 'lucide-react';
import { clsx } from 'clsx';

const TABS = [
    { id: 'general', name: 'Geral', icon: Building },
    { id: 'financial', name: 'Financeiro', icon: Wallet },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('general');
    const [isSaving, setIsSaving] = useState(false);

    // Mock form states
    const [generalData, setGeneralData] = useState({
        platformName: 'Marcenaria App',
        supportEmail: 'suporte@marcenariapp.com.br',
        supportPhone: '(11) 99999-9999',
        autoApproveProfessionals: false,
    });

    const [financialData, setFinancialData] = useState({
        platformFeePercentage: 15,
        minWithdrawalAmount: 50,
        currency: 'BRL',
    });

    const [notificationsData, setNotificationsData] = useState({
        emailOnNewUser: true,
        emailOnNewService: true,
        emailOnDispute: true,
        weeklyReport: false,
    });

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));
        setIsSaving(false);
        // You would typically show a toast here
        alert('Configurações salvas com sucesso!');
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <Text variant="h3" className="text-gray-900">Configurações</Text>
                    <Text variant="body" className="text-gray-500">Gerencie as configurações globais da plataforma.</Text>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center gap-2"
                >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar Navigation */}
                <Card className="p-2 h-fit md:w-64 shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {TABS.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={clsx(
                                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors',
                                    activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                )}
                            >
                                <tab.icon className={clsx(
                                    'w-5 h-5 mr-3 shrink-0',
                                    activeTab === tab.id ? 'text-primary-700' : 'text-gray-400'
                                )} />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </Card>

                {/* Content Area */}
                <div className="flex-1">
                    {activeTab === 'general' && (
                        <Card className="p-6">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Text variant="h5" className="text-gray-900">Informações Gerais</Text>
                                <Text variant="small" className="text-gray-500">Configurações básicas da plataforma e contato.</Text>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        label="Nome da Plataforma"
                                        type="text"
                                        value={generalData.platformName}
                                        onChange={(e) => setGeneralData({ ...generalData, platformName: e.target.value })}
                                    />
                                    <Input
                                        label="E-mail de Suporte"
                                        type="email"
                                        value={generalData.supportEmail}
                                        onChange={(e) => setGeneralData({ ...generalData, supportEmail: e.target.value })}
                                    />
                                    <Input
                                        label="Telefone de Contato"
                                        type="text"
                                        value={generalData.supportPhone}
                                        onChange={(e) => setGeneralData({ ...generalData, supportPhone: e.target.value })}
                                    />
                                </div>

                                <div className="pt-4 mt-6 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">Aprovação Automática</h4>
                                            <p className="text-sm text-gray-500">Aprovar profissionais automaticamente após o cadastro.</p>
                                        </div>
                                        <button
                                            type="button"
                                            className={clsx(
                                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none',
                                                generalData.autoApproveProfessionals ? 'bg-primary-600' : 'bg-gray-200'
                                            )}
                                            onClick={() => setGeneralData({ ...generalData, autoApproveProfessionals: !generalData.autoApproveProfessionals })}
                                        >
                                            <span
                                                className={clsx(
                                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
                                                    generalData.autoApproveProfessionals ? 'translate-x-5' : 'translate-x-0'
                                                )}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'financial' && (
                        <Card className="p-6">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Text variant="h5" className="text-gray-900">Configurações Financeiras</Text>
                                <Text variant="small" className="text-gray-500">Taxas, comissões e regras de pagamento.</Text>
                            </div>

                            <div className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <Input
                                        label="Taxa da Plataforma (%)"
                                        type="number"
                                        rightElement={<span className="text-gray-500 sm:text-sm">%</span>}
                                        helperText="Porcentagem cobrada sobre cada serviço concluído."
                                        value={financialData.platformFeePercentage}
                                        onChange={(e) => setFinancialData({ ...financialData, platformFeePercentage: Number(e.target.value) })}
                                    />
                                    <Input
                                        label="Saque Mínimo (R$)"
                                        type="number"
                                        leftElement={<span className="text-gray-500 sm:text-sm">R$</span>}
                                        value={financialData.minWithdrawalAmount}
                                        onChange={(e) => setFinancialData({ ...financialData, minWithdrawalAmount: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card className="p-6">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Text variant="h5" className="text-gray-900">Preferências de Notificação</Text>
                                <Text variant="small" className="text-gray-500">Escolha quais eventos disparam e-mails para os administradores.</Text>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { id: 'emailOnNewUser', label: 'Novos Cadastros', desc: 'Receber e-mail quando um novo cliente ou profissional se cadastrar.' },
                                    { id: 'emailOnNewService', label: 'Novos Serviços', desc: 'Receber alerta para novos pedidos de serviço na plataforma.' },
                                    { id: 'emailOnDispute', label: 'Disputas e Problemas', desc: 'Notificar imediatamente quando houver tickets de suporte urgentes.' },
                                    { id: 'weeklyReport', label: 'Relatório Semanal', desc: 'Receber um resumo financeiro e de métricas toda segunda-feira.' },
                                ].map((item) => (
                                    <div key={item.id} className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id={item.id}
                                                type="checkbox"
                                                checked={notificationsData[item.id as keyof typeof notificationsData]}
                                                onChange={(e) => setNotificationsData({ ...notificationsData, [item.id]: e.target.checked })}
                                                className="focus:ring-primary-500 h-4 w-4 text-primary-600 border-gray-300 rounded cursor-pointer"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor={item.id} className="font-medium text-gray-700 cursor-pointer">{item.label}</label>
                                            <p className="text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {activeTab === 'security' && (
                        <Card className="p-6">
                            <div className="mb-6 border-b border-gray-100 pb-4">
                                <Text variant="h5" className="text-gray-900">Segurança</Text>
                                <Text variant="small" className="text-gray-500">Gerencie sua senha e acessos.</Text>
                            </div>

                            <div className="space-y-5 max-w-sm">
                                <Input
                                    label="Senha Atual"
                                    type="password"
                                    placeholder="••••••••"
                                />
                                <Input
                                    label="Nova Senha"
                                    type="password"
                                    placeholder="Min. 8 caracteres"
                                />
                                <Input
                                    label="Confirmar Nova Senha"
                                    type="password"
                                    placeholder="Repita a nova senha"
                                />
                                <Button className="w-full mt-4" variant="secondary">
                                    Atualizar Senha
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

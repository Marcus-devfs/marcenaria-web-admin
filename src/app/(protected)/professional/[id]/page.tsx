'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { adminService, User, Address, Service } from '@/services/adminService';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import {
    ArrowLeft,
    Mail,
    Phone,
    MapPin,
    Calendar,
    CheckCircle,
    XCircle,
    User as UserIcon,
    ShieldCheck,
    CreditCard,
    Award,
    Briefcase,
    Clock,
    ArrowUpRight
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export default function ProfessionalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [professional, setProfessional] = useState<User | null>(null);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    console.log('services: ', services);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!id) return;
            try {
                const data = await adminService.getUserById(id as string);
                setProfessional(data.user);
                setAddresses(data.addresses);

                const history = await adminService.getUserServices(id as string, 'professional');
                setServices(history);
            } catch (error) {
                console.error('Failed to fetch professional details', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!professional) {
        return (
            <div className="text-center py-12">
                <Text variant="h4">Profissional não encontrado</Text>
                <Button onClick={() => router.back()} className="mt-4">Voltar</Button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <Text variant="h3" className="text-gray-900">{professional.name}</Text>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${professional.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {professional.isActive ? 'Ativo' : 'Inativo'}
                            </span>
                        </div>
                        <Text variant="body" className="text-gray-500">Detalhes do perfil profissional</Text>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">Editar Perfil</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Info Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="p-6 bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="h-24 w-24 rounded-full bg-primary-50 flex items-center justify-center text-primary-700 font-bold text-2xl border-4 border-white shadow-sm uppercase">
                                {professional.name.substring(0, 2)}
                            </div>
                            <div>
                                <Text variant="h4" className="text-gray-900">{professional.name}</Text>
                                <Text variant="small" className="text-gray-500 uppercase tracking-wider font-semibold">Profissional</Text>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="text-sm truncate">{professional.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">{professional.phone || 'Não informado'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="h-4 w-4 text-gray-400" />
                                <span className="text-sm">Parceiro desde {format(new Date(professional.createdAt), 'MMMM yyyy', { locale: ptBR })}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <ShieldCheck className={`h-4 w-4 ${professional.isVerified ? 'text-green-500' : 'text-gray-300'}`} />
                                <span className="text-sm">{professional.isVerified ? 'Conta Verificada' : 'Aguardando Verificação'}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="h-5 w-5 text-primary-600" />
                            <Text variant="h4" className="text-gray-900">Integração Asaas</Text>
                        </div>

                        {professional.asaasAccountId ? (
                            <div className="space-y-4">
                                <div className="p-3 bg-green-50 border border-green-100 rounded-lg flex items-center gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    <div>
                                        <p className="text-sm font-medium text-green-800">Conta Recebedora Integrada</p>
                                        <p className="text-xs text-green-600">ID: {professional.asaasAccountId}</p>
                                    </div>
                                </div>
                                <Text variant="small" className="text-gray-500">
                                    Este profissional já pode receber pagamentos via plataforma.
                                </Text>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="p-3 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-3">
                                    <XCircle className="h-5 w-5 text-yellow-600" />
                                    <div>
                                        <p className="text-sm font-medium text-yellow-800">Integração Pendente</p>
                                        <p className="text-xs text-yellow-600">Aguardando dados financeiros</p>
                                    </div>
                                </div>
                                <Text variant="small" className="text-gray-500">
                                    O profissional precisa completar o perfil financeiro para ativar o recebimento.
                                </Text>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Professional Info Case we have it */}
                    {/* Case the professional has a bio or specialties we could show here */}

                    <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-gray-400" />
                                <Text variant="h4" className="text-gray-900">Endereço de Atendimento</Text>
                            </div>
                        </div>

                        <div className="p-6">
                            {addresses.length === 0 ? (
                                <div className="text-center py-8">
                                    <MapPin className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                    <Text variant="body" className="text-gray-500">Nenhum endereço cadastrado por este profissional.</Text>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <div
                                            key={address._id}
                                            className={`p-4 rounded-xl border transition-all ${address.isDefault ? 'bg-primary-50/30 border-primary-100' : 'bg-gray-50 border-gray-100'}`}
                                        >
                                            <div className="flex justify-between items-start mb-2">
                                                <Text variant="h4" className={`text-sm ${address.isDefault ? 'text-primary-900' : 'text-gray-900'}`}>{address.title}</Text>
                                                {address.isDefault && (
                                                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary-600 text-white px-1.5 py-0.5 rounded">Principal</span>
                                                )}
                                            </div>
                                            <Text variant="small" className="text-gray-600 block">
                                                {address.street}, {address.number}
                                            </Text>
                                            {address.complement && (
                                                <Text variant="small" className="text-gray-500 block italic">{address.complement}</Text>
                                            )}
                                            <Text variant="small" className="text-gray-600 block">
                                                {address.neighborhood} - {address.city}/{address.state}
                                            </Text>
                                            <Text variant="small" className="text-gray-500 block mt-1">{address.zipCode}</Text>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card className="bg-white border border-gray-100 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Briefcase className="h-5 w-5 text-gray-400" />
                                <Text variant="h4" className="text-gray-900">Histórico de Serviços Atraídos</Text>
                            </div>
                            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                {services.length} {services.length === 1 ? 'serviço' : 'serviços'}
                            </span>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {services.length === 0 ? (
                                <div className="p-12 text-center">
                                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <Text variant="h4" className="text-gray-400">Nenhum serviço encontrado</Text>
                                    <Text variant="small" className="text-gray-400 max-w-xs mx-auto mt-2">
                                        Este profissional ainda não realizou nenhum serviço através da plataforma.
                                    </Text>
                                </div>
                            ) : (
                                services.map((service) => (
                                    <div key={service._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                                <Briefcase className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <Text variant="h4" className="text-sm font-bold text-gray-900">{service.title}</Text>
                                                    <span className={`text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${service.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        service.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                        {service.status === 'completed' ? 'Concluído' :
                                                            service.status === 'in_progress' ? 'Em Andamento' :
                                                                service.status === 'accepted' ? 'Aceito' : 'Pendente'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <Text variant="xsmall" className="text-gray-500 flex items-center gap-1">
                                                        <UserIcon className="h-3 w-3" />
                                                        {service.clientId?.name}
                                                    </Text>
                                                    <Text variant="xsmall" className="text-gray-400">•</Text>
                                                    <Text variant="xsmall" className="text-gray-500">
                                                        {format(new Date(service.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right flex items-center gap-6">
                                            <div className="hidden md:block">
                                                {service.acceptedQuote ? (
                                                    <Text variant="h4" className="text-primary-600">
                                                        {formatCurrency(service.acceptedQuote.totalPrice)}
                                                    </Text>
                                                ) : service.budget && (
                                                    <Text variant="h4" className="text-primary-600">
                                                        {formatCurrency(service.budget.min || 0)} - {formatCurrency(service.budget.max || 0)}
                                                    </Text>
                                                )}
                                                <Text variant="xsmall" className="text-gray-400 font-bold mt-0.5">
                                                    {service.category}
                                                </Text>
                                            </div>
                                            <Link href={`/services/${service._id}`}>
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-primary-100 hover:text-primary-600">
                                                    <ArrowUpRight className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>

                    <Card className="p-12 border border-dashed border-gray-200 bg-gray-50/30 flex flex-col items-center justify-center text-center">
                        <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4 text-gray-400">
                            <Award className="h-6 w-6" />
                        </div>
                        <Text variant="h4" className="text-gray-400">Especialidades e Portfólio</Text>
                        <Text variant="small" className="text-gray-400 max-w-xs mt-2">
                            A visualização detalhada de portfólio e avaliações será implementada na próxima fase.
                        </Text>
                    </Card>
                </div>
            </div>
        </div>
    );
}

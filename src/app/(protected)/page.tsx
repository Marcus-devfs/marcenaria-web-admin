'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services/adminService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Users, Briefcase, DollarSign, FileText, Star } from 'lucide-react';

import { Text } from '@/components/ui/Text';



export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
        setError('Falha ao carregar estatísticas. Verifique se a API está rodando.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 bg-gray-50 p-6 min-h-full animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6"></div>

        {/* Overview Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 shadow-sm rounded-xl p-4 h-[104px]">
              <div className="flex items-center h-full">
                <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4 flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-24"></div>
                  <div className="h-5 bg-gray-200 rounded w-16"></div>
                  <div className="h-2 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Sections Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 shadow-sm rounded-xl p-6 h-[252px]">
              <div className="h-5 bg-gray-200 rounded w-1/3 mb-6"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="flex justify-between items-center border-b border-gray-50 pb-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-4 bg-gray-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-primary-600 bg-primary-50 p-4 rounded-md">
          <Text>{error}</Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 p-6 min-h-full">
      <Text variant="h3" className="text-gray-900">Dashboard Geral</Text>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total de Usuários"
          value={stats?.users.total || 0}
          icon={Users}
          color="blue"
          subtext={`${stats?.users.professionals} Profissionais`}
        />
        {/* ... other StatCards ... */}
        <StatCard
          title="Serviços"
          value={stats?.services.total || 0}
          icon={Briefcase}
          color="green"
          subtext={`${stats?.services.byStatus.completed || 0} Concluídos`}
        />
        <StatCard
          title="Receita Total"
          value={formatCurrency(stats?.financials.totalRevenue || 0)}
          icon={DollarSign}
          color="yellow"
          subtext={`${stats?.financials.totalTransactions || 0} Transações`}
        />
        <StatCard
          title="Orçamentos"
          value={stats?.quotes.total || 0}
          icon={FileText}
          color="purple"
          subtext={`${stats?.quotes.byStatus.accepted || 0} Aceitos`}
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Distribuição de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <Text variant="body" className="text-gray-600">Profissionais</Text>
                <Text variant="small" className="text-gray-900">{stats?.users.professionals}</Text>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <Text variant="body" className="text-gray-600">Clientes</Text>
                <Text variant="small" className="text-gray-900">{stats?.users.clients}</Text>
              </div>
              <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                <Text variant="body" className="text-gray-600">Verificados</Text>
                <Text variant="small" className="text-green-600">{stats?.users.verified}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text variant="body" className="text-gray-600">Admins</Text>
                <Text variant="small" className="text-gray-900">{stats?.users.admins}</Text>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Service Categories (Placeholder for Chart) */}
        <Card className="bg-white border border-gray-100 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900">Serviços por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(stats?.services.byCategory || {}).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                  <Text variant="body" className="text-gray-600 capitalize">{category.replace('_', ' ')}</Text>
                  <Text variant="small" className="text-gray-900">{count}</Text>
                </div>
              ))}
              {Object.keys(stats?.services.byCategory || {}).length === 0 && (
                <Text variant="muted" className="text-center py-4">Nenhum serviço registrado</Text>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, subtext }: any) {
  const colorClasses = {
    blue: 'bg-primary-50 text-primary-700',
    green: 'bg-primary-50 text-primary-700',
    yellow: 'bg-primary-50 text-primary-700',
    purple: 'bg-primary-50 text-primary-700',
  };

  return (
    <Card className="bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center p-4">
        <div className={`p-3 rounded-full ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="ml-4">
          <Text variant="muted" className="text-gray-500">{title}</Text>
          <Text variant="h4" className="text-gray-900">{value}</Text>
          {subtext && <Text variant="small" className="text-gray-400 mt-1">{subtext}</Text>}
        </div>
      </div>
    </Card>
  );
}

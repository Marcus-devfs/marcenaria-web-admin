'use client';

import { useEffect, useState } from 'react';
import { adminService, DashboardStats } from '@/services/adminService';
import { Card } from '@/components/ui/Card';
import { Text } from '@/components/ui/Text';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  Briefcase,
  DollarSign,
  FileText,
  AlertCircle,
  Star,
  ArrowRight,
  Headphones,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { HorizontalBarChart } from '@/components/ui/HorizontalBarChart';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { LucideIcon } from 'lucide-react';

const SERVICE_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  accepted: 'Aceito',
  in_progress: 'Em andamento',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  completed: 'Concluído',
  failed: 'Falhou',
  refunded: 'Reembolsado',
};

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openTickets, setOpenTickets] = useState(0);

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

    api.get('/support/admin/all?status=open&limit=1')
      .then((res) => setOpenTickets(res.data.data.pagination.total || 0))
      .catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg h-28" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-100 rounded-lg h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Card className="border border-red-200 bg-red-50 text-red-700 p-6 max-w-md text-center">
          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-red-500" />
          <Text>{error}</Text>
        </Card>
      </div>
    );
  }

  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <Text variant="h3" className="text-gray-900">Dashboard</Text>
          <Text variant="muted" className="capitalize mt-1">{today}</Text>
        </div>
        {openTickets === 0 ? (
          <span className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            Tudo em ordem
          </span>
        ) : null}
      </div>

      {/* Alerta de tickets */}
      {openTickets > 0 && (
        <Link href="/support">
          <Card className="border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-red-800">
                  {openTickets === 1
                    ? '1 ticket de suporte aguardando resposta'
                    : `${openTickets} tickets de suporte aguardando resposta`}
                </p>
              </div>
              <span className="text-red-600 text-sm font-semibold shrink-0">Ver →</span>
            </div>
          </Card>
        </Link>
      )}

      {/* KPIs — mesmo padrão da página de Pagamentos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Usuários"
          value={String(stats?.users.total || 0)}
          subtext={`${stats?.users.professionals || 0} profissionais · ${stats?.users.clients || 0} clientes`}
          icon={Users}
          iconBg="bg-blue-50 text-blue-600"
          href="/client"
        />
        <StatCard
          title="Serviços"
          value={String(stats?.services.total || 0)}
          subtext={`${stats?.services.byStatus.completed || 0} concluídos`}
          icon={Briefcase}
          iconBg="bg-green-50 text-green-600"
          href="/services"
        />
        <StatCard
          title="Receita total"
          value={formatCurrency(stats?.financials.totalRevenue || 0)}
          subtext={`${stats?.financials.totalTransactions || 0} transações`}
          icon={DollarSign}
          iconBg="bg-amber-50 text-amber-600"
          href="/payments"
        />
        <StatCard
          title="Orçamentos"
          value={String(stats?.quotes.total || 0)}
          subtext={`${stats?.quotes.byStatus.accepted || 0} aceitos`}
          icon={FileText}
          iconBg="bg-purple-50 text-purple-600"
          href="/quotes"
        />
      </div>

      {/* Resumo financeiro + usuários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md" style={{ backgroundColor: '#7F1D1D', color: '#FFFFFF' }}>
          <p style={{ color: '#FECACA', fontSize: '0.875rem', fontWeight: 500, marginBottom: '4px' }}>
            Receita acumulada
          </p>
          <p style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '16px' }}>
            {formatCurrency(stats?.financials.totalRevenue || 0)}
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTop: '1px solid #991B1B' }}>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.financials.totalTransactions || 0}</p>
              <p style={{ color: '#FCA5A5', fontSize: '0.75rem', marginTop: '4px' }}>Transações</p>
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.financials.byStatus.completed || 0}</p>
              <p style={{ color: '#FCA5A5', fontSize: '0.75rem', marginTop: '4px' }}>Concluídas</p>
            </div>
            <div>
              <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{stats?.financials.byStatus.pending || 0}</p>
              <p style={{ color: '#FCA5A5', fontSize: '0.75rem', marginTop: '4px' }}>Pendentes</p>
            </div>
          </div>
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <Text variant="h5" className="text-gray-900 mb-4">Resumo de usuários</Text>
          <div className="space-y-3">
            <SummaryRow label="Profissionais" value={stats?.users.professionals || 0} />
            <SummaryRow label="Clientes" value={stats?.users.clients || 0} />
            <SummaryRow label="Verificados" value={stats?.users.verified || 0} />
            <SummaryRow label="Admins" value={stats?.users.admins || 0} />
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500 flex items-center gap-1.5">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              {stats?.reviews.total || 0} avaliações
            </span>
            <span className="text-sm font-semibold text-gray-900">
              Média {(stats?.reviews.averageRating || 0).toFixed(1)}
            </span>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-100 shadow-sm">
          <Text variant="h5" className="text-gray-900 mb-1">Serviços por status</Text>
          <Text variant="muted" className="mb-4 block">Distribuição atual</Text>
          <HorizontalBarChart
            data={stats?.services.byStatus || {}}
            formatLabel={(key) => SERVICE_STATUS_LABELS[key] || key.replace(/_/g, ' ')}
          />
        </Card>

        <Card className="bg-white border border-gray-100 shadow-sm">
          <Text variant="h5" className="text-gray-900 mb-1">Pagamentos por status</Text>
          <Text variant="muted" className="mb-4 block">Situação das transações</Text>
          <HorizontalBarChart
            data={stats?.financials.byStatus || {}}
            formatLabel={(key) => PAYMENT_STATUS_LABELS[key] || key}
          />
        </Card>
      </div>

      <Card className="bg-white border border-gray-100 shadow-sm">
        <Text variant="h5" className="text-gray-900 mb-1">Serviços por categoria</Text>
        <Text variant="muted" className="mb-4 block">Tipos mais solicitados</Text>
        <HorizontalBarChart
          data={stats?.services.byCategory || {}}
          formatLabel={(key) => key.replace(/_/g, ' ')}
        />
      </Card>

      {/* Acesso rápido */}
      <div>
        <Text variant="small" className="text-gray-500 uppercase tracking-wide mb-3 block">
          Acesso rápido
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink href="/client" icon={Users} label="Clientes" />
          <QuickLink href="/payments" icon={Wallet} label="Pagamentos" />
          <QuickLink href="/support" icon={Headphones} label="Suporte" />
          <QuickLink href="/reviews" icon={Star} label="Avaliações" />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  iconBg,
  href,
}: {
  title: string;
  value: string;
  subtext: string;
  icon: LucideIcon;
  iconBg: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl shrink-0 ${iconBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <Text variant="muted" className="text-gray-500">{title}</Text>
            <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
            <Text variant="xsmall" className="text-gray-400 mt-0.5 block truncate">{subtext}</Text>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  );
}

function QuickLink({ href, icon: Icon, label }: { href: string; icon: LucideIcon; label: string }) {
  return (
    <Link href={href}>
      <Card className="bg-white border border-gray-100 shadow-sm hover:border-primary-200 hover:shadow-md transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gray-50">
              <Icon className="w-4 h-4 text-gray-600" />
            </div>
            <span className="font-medium text-gray-900 text-sm">{label}</span>
          </div>
          <ArrowRight className="w-4 h-4 text-gray-300" />
        </div>
      </Card>
    </Link>
  );
}

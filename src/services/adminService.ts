import api from '@/lib/api';

export interface DashboardStats {
    users: {
        total: number;
        verified: number;
        clients: number;
        professionals: number;
        admins: number;
    };
    services: {
        total: number;
        byStatus: Record<string, number>;
        byCategory: Record<string, number>;
    };
    financials: {
        totalRevenue: number;
        totalTransactions: number;
        byStatus: Record<string, number>;
    };
    quotes: {
        total: number;
        byStatus: Record<string, number>;
    };
    reviews: {
        total: number;
        averageRating: number;
    };
}

export const adminService = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const response = await api.get('/admin/dashboard');
        return response.data.data;
    },
};

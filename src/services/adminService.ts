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

    getClients: async (page = 1, limit = 10, search = ''): Promise<{ users: User[]; pagination: Pagination }> => {
        const response = await api.get('/users', {
            params: { page, limit, role: 'client', search }
        });
        return response.data.data;
    },

    getProfessionals: async (page = 1, limit = 10, search = ''): Promise<{ users: User[]; pagination: Pagination }> => {
        const response = await api.get('/users', {
            params: { page, limit, role: 'professional', search }
        });
        return response.data.data;
    },
};

export interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'client' | 'professional' | 'admin';
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    avatar?: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

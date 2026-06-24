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

    getServices: async (page = 1, limit = 10, status = '', category = ''): Promise<{ services: Service[]; pagination: Pagination }> => {
        const response = await api.get('/admin/services', {
            params: { page, limit, status, category }
        });
        return response.data.data;
    },
    getQuotes: async (page = 1, limit = 10, status = ''): Promise<{ quotes: Quote[]; pagination: Pagination }> => {
        const response = await api.get('/admin/quotes', {
            params: { page, limit, status }
        });
        return response.data.data;
    },
    getPayments: async (page = 1, limit = 10, status = ''): Promise<{ transactions: Transaction[]; pagination: Pagination }> => {
        const response = await api.get('/admin/payments', {
            params: { page, limit, status }
        });

        return {
            transactions: response.data.data.payments,
            pagination: {
                page: response.data.data.page,
                limit: response.data.data.limit,
                total: response.data.data.total,
                pages: response.data.data.pages
            }
        };
    },
    getPaymentOverviewStats: async (): Promise<any> => {
        const response = await api.get('/admin/payments/stats');
        return response.data.data;
    },

    getPaymentById: async (id: string): Promise<Transaction> => {
        const response = await api.get(`/admin/payments/${id}`);
        return response.data.data.payment;
    },

    getUserById: async (id: string): Promise<{ user: User; addresses: any[] }> => {
        const response = await api.get(`/users/${id}`);
        return response.data.data;
    },

    getServiceById: async (id: string): Promise<Service> => {
        const response = await api.get(`/admin/services/${id}`);
        return response.data.data;
    },

    getQuoteById: async (id: string): Promise<Quote> => {
        const response = await api.get(`/admin/quotes/${id}`);
        return response.data.data;
    },

    getUserQuotes: async (id: string): Promise<Quote[]> => {
        const response = await api.get(`/admin/users/${id}/quotes`);
        return response.data.data;
    },

    getUserServices: async (id: string, role: string): Promise<Service[]> => {
        const response = await api.get(`/admin/users/${id}/services`, { params: { role } });
        return response.data.data;
    },

    deactivateUser: async (id: string): Promise<User> => {
        const response = await api.patch(`/users/${id}/deactivate`);
        return response.data.data.user;
    },

    reactivateUser: async (id: string): Promise<User> => {
        const response = await api.patch(`/users/${id}/reactivate`);
        return response.data.data.user;
    },

    refundPayment: async (id: string, reason: string): Promise<Transaction> => {
        const response = await api.post(`/admin/payments/${id}/refund`, { reason });
        return response.data.data.payment;
    },

    cancelService: async (id: string, reason?: string): Promise<Service> => {
        const response = await api.patch(`/admin/services/${id}/cancel`, { reason });
        return response.data.data;
    },

    getWithdrawals: async (page = 1, limit = 10, status = ''): Promise<{ withdrawals: Withdrawal[]; pagination: Pagination }> => {
        const response = await api.get('/admin/withdrawals', {
            params: { page, limit, status: status || undefined },
        });
        return response.data.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.post('/auth/change-password', { currentPassword, newPassword });
    },

    getReviews: async (page = 1, limit = 10): Promise<{ reviews: AdminReview[]; pagination: Pagination }> => {
        const response = await api.get('/admin/reviews', { params: { page, limit } });
        const data = response.data.data;
        return {
            reviews: data.reviews,
            pagination: {
                page: data.page,
                limit: data.limit,
                total: data.total,
                pages: data.pages,
            },
        };
    },

    deleteReview: async (id: string): Promise<void> => {
        await api.delete(`/admin/reviews/${id}`);
    },
};

export interface Service {
    _id: string;
    title: string;
    description: string;
    category: string;
    status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
    clientId: User;
    professionalId?: User;
    budget: {
        min?: number;
        max?: number;
    };
    address?: Address;
    createdAt: string;
    images?: string[];
    routeStartedAt?: string;
    arrivedAt?: string;
    serviceStartedAt?: string;
    updatedAt?: string;
    acceptedQuote?: Quote;
}

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
    asaasCustomerId?: string;
    asaasAccountId?: string;
}

export interface Address {
    _id: string;
    userId: string;
    title: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
    createdAt: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    pages: number;
}

export interface Quote {
    _id: string;
    title: string;
    description?: string;
    totalPrice: number;
    status: 'pending' | 'accepted' | 'rejected' | 'expired';
    paymentStatus: 'pending' | 'paid' | 'refunded';
    validUntil: string;
    createdAt: string;
    clientId: User;
    professionalId: User;
    serviceId: {
        _id: string;
        title: string;
        category: string;
    };
    materials?: Array<{
        name: string;
        quantity: number;
        unit: string;
        price: number;
    }>;
    labor?: {
        description: string;
        hours?: number;
        pricePerHour?: number;
        total: number;
    };
}

export interface Transaction {
    _id: string;
    quoteId: string | Quote;
    amount: number;
    appFee: number;
    platformFee?: number; // legacy frontend name
    netAmount: number;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    paymentMethod: string;
    clientId: User;
    professionalId: User;
    createdAt: string;
    transactionId?: string;
    availableAt?: string;
    gatewayFee?: number;
}

export interface AdminReview {
    _id: string;
    rating: number;
    comment?: string;
    createdAt: string;
    client?: { name: string; email: string };
    professional?: { name: string; email: string };
    serviceId?: { _id: string; title: string; category?: string };
}

export interface Withdrawal {
    _id: string;
    professionalId: User | string;
    amount: number;
    fee: number;
    netAmount: number;
    transferType: 'PIX' | 'TED';
    status: 'pending' | 'processed' | 'rejected';
    pixKey?: string;
    asaasTransferId?: string;
    asaasStatus?: string;
    createdAt: string;
    processedAt?: string;
}

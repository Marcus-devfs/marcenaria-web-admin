'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/api';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { Hammer, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await api.post('/auth/login', { email, password });
            const { user, tokens } = response.data.data;

            if (user.role !== 'admin') {
                setError('Acesso negado. Apenas administradores podem acessar este painel.');
                return;
            }

            login(tokens.accessToken, user);
        } catch (err: any) {
            console.error('Login failed', err);
            setError(err.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            {/* Branding Section (Left) */}
            <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-900/40 via-gray-900 to-gray-900 z-0"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shadow-primary-900/20">
                            <Hammer className="h-8 w-8 text-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-bold text-2xl tracking-tight text-white leading-none">Conecta</span>
                            <span className="font-bold text-2xl tracking-tight text-primary-500 leading-none">Marceneiro</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 max-w-lg">
                    <h1 className="text-4xl font-bold mb-6 leading-tight">
                        Gestão completa para <br />
                        <span className="text-primary-500">marcenarias modernas.</span>
                    </h1>
                    <p className="text-gray-400 text-lg leading-relaxed">
                        Administre serviços, usuários e pagamentos em um único lugar.
                        A ferramenta definitiva para o sucesso do seu negócio.
                    </p>
                </div>

                <div className="relative z-10 text-sm text-gray-500">
                    © {new Date().getFullYear()} M&F Planejados. Todos os direitos reservados.
                </div>
            </div>

            {/* Login Form Section (Right) */}
            <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <div className="lg:hidden flex justify-center mb-6">
                            <div className="bg-primary-600 p-3 rounded-xl inline-block">
                                <Hammer className="h-8 w-8 text-white" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Painel Administrativo</h2>
                        <p className="mt-2 text-gray-500">Entre com suas credenciais para acessar.</p>
                    </div>

                    {error && (
                        <div className="bg-primary-50 text-primary-700 p-4 rounded-lg text-sm flex items-center border border-primary-100 animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900">Email Corporativo</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                placeholder="nome@empresa.com"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-semibold text-gray-900">Senha</label>
                                <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline">
                                    Esqueceu a senha?
                                </a>
                            </div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-12 text-base shadow-lg shadow-primary-600/20 hover:shadow-primary-600/30 transition-all bg-primary-600 hover:bg-primary-700 text-white"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Autenticando...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Entrar no Painel</span>
                                    <ArrowRight className="w-4 h-4" />
                                </div>
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

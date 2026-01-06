
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.successMessage) {
            setSuccessMessage(location.state.successMessage);
            // Clear location state to prevent message from showing on refresh
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark font-display p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-border-color dark:border-gray-700">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                         <div className="w-12 h-12 flex items-center justify-center text-primary bg-primary/10 rounded-xl">
                            <span className="material-symbols-outlined text-3xl">trending_up</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white">Bienvenido a DPH</h1>
                    <p className="text-text-muted dark:text-gray-400">Inicia sesión para ver tu dashboard.</p>
                </div>
                
                {successMessage && (
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-lg text-center text-sm text-green-700 dark:text-green-300">
                        {successMessage}
                    </div>
                )}
                
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="text-sm font-medium text-text-main dark:text-gray-300">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="tu@email.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-text-main dark:text-gray-300">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="••••••••"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Iniciando...' : 'Iniciar Sesión'}
                        </button>
                    </div>
                </form>
                <p className="text-center text-sm text-text-muted dark:text-gray-400">
                    ¿No tienes una cuenta?{' '}
                    <Link to="/register" className="font-medium text-primary hover:underline">
                        Regístrate
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;

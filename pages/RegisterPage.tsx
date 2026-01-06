
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return;
        }
        setError(null);
        setLoading(true);
        try {
            await register({ name, email, password });
            navigate('/login', { state: { successMessage: '¡Cuenta creada con éxito! Por favor, inicia sesión.' } });
        } catch (err: any) {
            setError(err.message || 'Error al registrar la cuenta.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background-light dark:bg-background-dark font-display p-4">
            <div className="w-full max-w-md p-8 space-y-8 bg-surface-light dark:bg-surface-dark rounded-2xl shadow-lg border border-border-color dark:border-gray-700">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                         <div className="w-12 h-12 flex items-center justify-center text-primary bg-primary/10 rounded-xl">
                            <span className="material-symbols-outlined text-3xl">person_add</span>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-text-main dark:text-white">Crear una Cuenta</h1>
                    <p className="text-text-muted dark:text-gray-400">Únete a DPH para empezar a crecer.</p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-text-main dark:text-gray-300">
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Tu nombre"
                        />
                    </div>
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
                            autoComplete="new-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-2 block w-full px-4 py-3 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 text-center">{error}</p>}
                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed">
                            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
                        </button>
                    </div>
                </form>
                 <p className="text-center text-sm text-text-muted dark:text-gray-400">
                    ¿Ya tienes una cuenta?{' '}
                    <Link to="/login" className="font-medium text-primary hover:underline">
                        Inicia Sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;

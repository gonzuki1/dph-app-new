
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavItem: React.FC<{ to: string; icon: string; label: string }> = ({ to, icon, label }) => (
    <NavLink 
        to={to} 
        end={to === "/"}
        className={({ isActive }) => 
            `flex items-center gap-3 px-4 py-3 rounded-lg group transition-all ${
                isActive ? 'sidebar-active' : 'hover:bg-neutral-light/50 dark:hover:bg-gray-800 text-text-muted'
            }`
        }
    >
        <span className="material-symbols-outlined group-hover:text-primary transition-colors text-xl">{icon}</span>
        <p className="text-sm font-medium group-hover:text-text-main dark:group-hover:text-white">{label}</p>
    </NavLink>
);

const Sidebar: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 flex-shrink-0 border-r border-border-color dark:border-gray-800 bg-surface-light dark:bg-surface-dark hidden md:flex flex-col h-full">
            <div className="p-6 flex flex-col gap-6 h-full">
                {/* User Profile */}
                <div className="flex items-center gap-3 pb-6 border-b border-border-color dark:border-gray-700">
                    <div className="bg-primary/20 text-primary rounded-full size-12 flex items-center justify-center font-bold text-xl shadow-sm ring-2 ring-primary/20">
                        {user?.name.charAt(0)}
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-text-main dark:text-white text-base font-bold leading-tight">{user?.name}</h1>
                        <p className="text-text-muted text-xs font-medium">{user?.title}</p>
                    </div>
                </div>
                {/* Navigation */}
                <nav className="flex flex-col gap-2 flex-1">
                    <NavItem to="/" icon="dashboard" label="Panel Principal" />
                    <NavItem to="/career" icon="work" label="Carrera" />
                    <NavItem to="/calendar" icon="calendar_month" label="Calendario" />
                    <NavItem to="/habits" icon="check_circle" label="Hábitos" />
                    <NavItem to="/sales-payments" icon="payments" label="Control de Pagos" />
                    <NavItem to="/earnings" icon="calculate" label="Calculadora de Ganancia" />
                    <a 
                        href="https://t.me/academiaDPH" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-500 transition-all group"
                    >
                        <span className="material-symbols-outlined group-hover:text-blue-600 transition-colors text-xl">send</span>
                        <p className="text-sm font-bold group-hover:text-blue-600">Canal Telegram</p>
                    </a>
                </nav>
                {/* Settings & Logout */}
                <div className="mt-auto flex flex-col gap-2">
                    <NavItem to="/settings" icon="settings" label="Configuración" />
                     <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all group">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <p className="text-sm font-medium">Cerrar Sesión</p>
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;

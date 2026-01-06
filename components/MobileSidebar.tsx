
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface MobileSidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const MobileNavItem: React.FC<{ to: string; icon: string; label: string; onClick: () => void }> = ({ to, icon, label, onClick }) => (
    <NavLink
        to={to}
        end={to === "/"}
        onClick={onClick}
        className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive 
                ? 'sidebar-active' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-text-muted'
            }`
        }
    >
        <span className="material-symbols-outlined">{icon}</span>
        <p className="text-sm">{label}</p>
    </NavLink>
);

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, setIsOpen }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!isOpen) return null;
    
    const closeSidebar = () => setIsOpen(false);

    const handleLogout = () => {
        closeSidebar();
        logout();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/50 md:hidden" onClick={closeSidebar}>
            <div className="w-64 bg-surface-light dark:bg-surface-dark h-full p-6 flex flex-col gap-6" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center pb-6 border-b border-border-color dark:border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 text-primary rounded-full size-10 flex items-center justify-center font-bold">
                           {user?.name.charAt(0)}
                        </div>
                        <span className="font-bold">{user?.name}</span>
                    </div>
                    <button onClick={closeSidebar}><span className="material-symbols-outlined">close</span></button>
                </div>
                <nav className="flex flex-col gap-2 flex-1">
                    <MobileNavItem to="/" icon="dashboard" label="Panel Principal" onClick={closeSidebar} />
                    <MobileNavItem to="/career" icon="work" label="Carrera" onClick={closeSidebar} />
                    <MobileNavItem to="/calendar" icon="calendar_month" label="Calendario" onClick={closeSidebar} />
                    <MobileNavItem to="/habits" icon="check_circle" label="Hábitos" onClick={closeSidebar} />
                    <MobileNavItem to="/sales-payments" icon="payments" label="Control de Pagos" onClick={closeSidebar} />
                    <MobileNavItem to="/earnings" icon="calculate" label="Calculadora de Ganancia" onClick={closeSidebar} />
                    <a 
                        href="https://t.me/academiaDPH" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    >
                        <span className="material-symbols-outlined">send</span>
                        <p className="text-sm font-bold">Canal Telegram</p>
                    </a>
                    <MobileNavItem to="/settings" icon="settings" label="Configuración" onClick={closeSidebar} />
                </nav>
                 <div className="mt-auto">
                     <button onClick={handleLogout} className="flex w-full items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all group">
                        <span className="material-symbols-outlined text-xl">logout</span>
                        <p className="text-sm font-medium">Cerrar Sesión</p>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileSidebar;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';
import StatCard from '../components/StatCard';
import GoalProgress from '../components/GoalProgress';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

const DashboardPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const { userData, loading, updateStat, updateWeeklyStat } = useUserData();

    if (loading || !userData) {
         return (
            <div className="flex items-center justify-center h-screen w-full bg-background-light dark:bg-background-dark">
                <div className="flex items-center gap-2 text-text-muted">
                    <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
                    <span className="font-bold">Sincronizando tus avances...</span>
                </div>
            </div>
        );
    }
    
    const { stats, weeklyStats, goals } = userData;

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200 flex h-screen w-full overflow-hidden">
            <Sidebar />
            <MobileSidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />

            <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
                <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/20 text-primary rounded-full size-8 flex items-center justify-center font-bold">{user?.name.charAt(0)}</div>
                        <span className="font-bold text-sm">{user?.name}</span>
                    </div>
                    <button className="text-text-main dark:text-white" onClick={() => setMobileMenuOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10 flex flex-col gap-8">
                    <header className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Hola, {user?.name.split(' ')[0]} 👋</h1>
                            <p className="text-text-muted dark:text-gray-400 text-base font-normal">Resumen de tu actividad hoy, <span className="text-text-main dark:text-white font-semibold">{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</span>.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 dark:bg-primary/20 rounded-full border border-primary/20 text-xs font-bold text-blue-800 dark:text-blue-300">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            EN LÍNEA
                        </div>
                    </header>

                    {/* DAILY STATS (INTERACTIVE) */}
                    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard icon="contacts" title="Contactos" value={stats.contacts} goal={goals.daily.contacts} period="Diario" onIncrement={() => updateStat('contacts', 1)} onDecrement={() => updateStat('contacts', -1)} />
                        <StatCard icon="calendar_month" title="Citas" value={stats.appointments} goal={goals.daily.appointments} period="Diario" onIncrement={() => updateStat('appointments', 1)} onDecrement={() => updateStat('appointments', -1)} />
                        <StatCard icon="present_to_all" title="Demos" value={stats.demos} goal={goals.daily.demos} period="Diario" onIncrement={() => updateStat('demos', 1)} onDecrement={() => updateStat('demos', -1)} />
                        <StatCard icon="handshake" title="Cierres" value={stats.closes} goal={goals.daily.closes} period="Diario" onIncrement={() => updateStat('closes', 1)} onDecrement={() => updateStat('closes', -1)} />
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* WEEKLY PROGRESS (INTERACTIVE) */}
                        <section className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm p-6 md:p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-bold text-text-main dark:text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-primary">flag</span>
                                    Progreso de Metas Semanales
                                </h2>
                                <span className="text-xs font-black text-text-muted uppercase tracking-widest">Semana Actual</span>
                            </div>
                            <div className="flex flex-col gap-10">
                                <GoalProgress 
                                    title="Ventas de Autos" 
                                    description="Meta crítica para bonificación" 
                                    value={weeklyStats.carSales} 
                                    goal={goals.weekly.carSales} 
                                    onIncrement={() => updateWeeklyStat('carSales', 1)}
                                    onDecrement={() => updateWeeklyStat('carSales', -1)}
                                />
                                <GoalProgress 
                                    title="Ventas de Motos" 
                                    description="Producto secundario" 
                                    value={weeklyStats.motorcycleSales} 
                                    goal={goals.weekly.motorcycleSales} 
                                    onIncrement={() => updateWeeklyStat('motorcycleSales', 1)}
                                    onDecrement={() => updateWeeklyStat('motorcycleSales', -1)}
                                />
                                <GoalProgress 
                                    title="Invitados Calificados" 
                                    description="Meta de prospección" 
                                    value={weeklyStats.qualifiedGuests} 
                                    goal={goals.weekly.qualifiedGuests} 
                                    onIncrement={() => updateWeeklyStat('qualifiedGuests', 1)}
                                    onDecrement={() => updateWeeklyStat('qualifiedGuests', -1)}
                                />
                            </div>
                        </section>

                        <div className="flex flex-col gap-6">
                            <section className="bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-6 flex flex-col justify-between text-white relative overflow-hidden border border-gray-700">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3 text-primary">
                                        <span className="material-symbols-outlined animate-pulse">bolt</span>
                                        <span className="text-xs font-bold uppercase tracking-wider">Acción Prioritaria</span>
                                    </div>
                                    <h3 className="text-xl font-bold leading-tight mb-2">Mantén el ritmo de prospección.</h3>
                                    <p className="text-gray-400 text-sm">Cada contacto cuenta para alcanzar tu meta semanal. ¡No te detengas!</p>
                                </div>
                                <Link 
                                    to="/calendar" 
                                    state={{ selectToday: true }}
                                    className="mt-6 w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all transform hover:translate-y-[-2px] shadow-[0_4px_14px_0_rgba(59,130,246,0.39)]"
                                >
                                    <span>Ver Agenda de Hoy</span>
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </section>

                            <section className="bg-white dark:bg-white/5 rounded-xl border border-blue-200 dark:border-blue-900 shadow-sm p-6 relative overflow-hidden">
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-3 text-blue-500">
                                        <span className="material-symbols-outlined">groups</span>
                                        <span className="text-xs font-black uppercase tracking-widest">Comunidad DPH</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-text-main dark:text-white mb-2">Únete a la Academia DPH</h3>
                                    <p className="text-text-muted text-xs mb-6">Recibe tips diarios, noticias y materiales exclusivos directamente en Telegram.</p>
                                    <a 
                                        href="https://t.me/academiaDPH" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="w-full bg-[#0088cc] hover:bg-[#0077b5] text-white font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <span className="material-symbols-outlined text-sm">send</span>
                                        <span>Seguir Canal</span>
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardPage;

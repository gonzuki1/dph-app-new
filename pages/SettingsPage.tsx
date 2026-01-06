
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { Goals } from '../types';

const GoalInput: React.FC<{ label: string, value: number, onChange: (val: number) => void }> = ({ label, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-text-muted dark:text-gray-400">{label}</label>
        <input 
            type="number"
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
            className="mt-1 block w-full px-4 py-3 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
    </div>
);

const SettingsPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const { userData, updateGoal, loading } = useUserData();

    if (loading || !userData) {
        return <div>Cargando...</div>;
    }

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
                    <header>
                        <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Configuración de Metas</h1>
                        <p className="text-text-muted dark:text-gray-400 text-base font-normal">Personaliza tus objetivos para que se ajusten a tu ambición.</p>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Metas Diarias</h2>
                            <div className="space-y-4">
                                <GoalInput label="Contactos" value={userData.goals.daily.contacts} onChange={(val) => updateGoal('daily', 'contacts', val)} />
                                <GoalInput label="Citas" value={userData.goals.daily.appointments} onChange={(val) => updateGoal('daily', 'appointments', val)} />
                                <GoalInput label="Demos" value={userData.goals.daily.demos} onChange={(val) => updateGoal('daily', 'demos', val)} />
                                <GoalInput label="Cierres" value={userData.goals.daily.closes} onChange={(val) => updateGoal('daily', 'closes', val)} />
                            </div>
                        </section>

                        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm p-6">
                            <h2 className="text-xl font-bold mb-4">Metas Semanales</h2>
                            <div className="space-y-4">
                                <GoalInput label="Ventas de Autos" value={userData.goals.weekly.carSales} onChange={(val) => updateGoal('weekly', 'carSales', val)} />
                                <GoalInput label="Ventas de Motos" value={userData.goals.weekly.motorcycleSales} onChange={(val) => updateGoal('weekly', 'motorcycleSales', val)} />
                                <GoalInput label="Invitados Calificados" value={userData.goals.weekly.qualifiedGuests} onChange={(val) => updateGoal('weekly', 'qualifiedGuests', val)} />
                            </div>
                        </section>
                    </div>
                     <div className="bg-primary/10 border border-primary/20 text-primary-dark dark:text-primary-light p-4 rounded-lg flex items-start gap-3">
                        <span className="material-symbols-outlined mt-1">info</span>
                        <p className="text-sm font-medium">Tus cambios se guardan automáticamente a medida que los realizas.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SettingsPage;

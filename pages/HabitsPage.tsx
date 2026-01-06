
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';
import HabitsTracker from '../components/HabitsTracker';
import { useAuth } from '../context/AuthContext';

const HabitsPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200 flex h-screen w-full overflow-hidden">
            <Sidebar />
            <MobileSidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />

            <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                     <div className="flex items-center gap-3">
                        <div className="bg-primary/20 text-primary rounded-full size-8 flex items-center justify-center font-bold">
                           {user?.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sm">{user?.name}</span>
                    </div>
                    <button className="text-text-main dark:text-white" onClick={() => setMobileMenuOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10 flex flex-col gap-8">
                     {/* Page Heading */}
                    <header className="flex flex-wrap justify-between items-end gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Mis Hábitos Diarios</h1>
                            <p className="text-text-muted dark:text-gray-400 text-base font-normal">Construye la consistencia para alcanzar tus metas.</p>
                        </div>
                    </header>
                    <HabitsTracker />
                </div>
            </main>
        </div>
    );
};

export default HabitsPage;


import React from 'react';
import { Link } from 'react-router-dom';
import CareerHeader from '../components/CareerHeader';
import Roadmap from '../components/Roadmap';

const CareerPage: React.FC = () => {
    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-neutral-dark dark:text-white antialiased overflow-x-hidden min-h-screen flex flex-col">
            <CareerHeader />

            <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Page Heading */}
                <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border-color dark:border-white/10">
                    <div className="space-y-2 max-w-2xl">
                        <div className="flex items-center gap-2 text-primary font-medium text-sm uppercase tracking-wider mb-1">
                            <span className="material-symbols-outlined text-lg">route</span>
                            <span>Tu Mapa de Éxito</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-neutral-dark dark:text-white leading-tight">Tu Plan de Carrera y Desarrollo</h2>
                        <p className="text-secondary-text dark:text-gray-400 text-lg">Visualiza tu camino hacia el éxito en 6 meses. Completa objetivos para desbloquear nuevas fases y recompensas.</p>
                    </div>
                    <div className="flex gap-3">
                        <Link 
                            to="/calendar" 
                            state={{ selectToday: true }}
                            className="h-11 px-6 rounded-xl bg-neutral-light dark:bg-white/10 hover:bg-neutral-200 dark:hover:bg-white/20 text-neutral-dark dark:text-white font-bold text-sm transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-lg">calendar_today</span>
                            Ver Tareas de Hoy
                        </Link>
                    </div>
                </section>

                {/* Stats Overview */}
                <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-white/5 rounded-xl border border-border-color dark:border-white/10 p-4 sm:p-6 flex flex-col gap-1 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-neutral-dark dark:text-white">badge</span>
                        </div>
                        <p className="text-sm font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wide">Nivel Actual</p>
                        <div className="flex items-end gap-2">
                            <span className="text-2xl font-bold text-neutral-dark dark:text-white">Vendedor Junior</span>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 w-fit px-2 py-1 rounded">
                            <span className="material-symbols-outlined text-sm">trending_up</span>
                            <span>Top 15% del equipo</span>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-xl border border-border-color dark:border-white/10 p-4 sm:p-6 flex flex-col gap-1 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <span className="material-symbols-outlined text-6xl text-neutral-dark dark:text-white">donut_large</span>
                        </div>
                        <p className="text-sm font-medium text-secondary-text dark:text-gray-400 uppercase tracking-wide">Progreso General</p>
                        <div className="flex items-end gap-2">
                            <span className="text-4xl font-bold text-neutral-dark dark:text-white">35%</span>
                            <span className="text-sm text-secondary-text dark:text-gray-400 mb-1">completado</span>
                        </div>
                        <div className="w-full bg-neutral-light dark:bg-white/10 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-primary h-full rounded-full" style={{width: '35%'}}></div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-white/5 rounded-xl border-2 border-primary/50 dark:border-primary/50 p-4 sm:p-6 flex flex-col gap-1 shadow-sm relative overflow-hidden bg-gradient-to-br from-white to-primary/5 dark:from-white/5 dark:to-primary/10">
                        <div className="absolute top-0 right-0 p-4 text-primary opacity-20">
                            <span className="material-symbols-outlined text-6xl">flag</span>
                        </div>
                        <p className="text-sm font-medium text-primary uppercase tracking-wide">Fase Activa</p>
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-neutral-dark dark:text-white leading-tight">Mes 2: Crecimiento</span>
                            <span className="text-sm text-secondary-text dark:text-gray-400 mt-1">En Curso - 12 días restantes</span>
                        </div>
                        <button className="mt-4 text-sm font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors">
                            Continuar Actividades
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </button>
                    </div>
                </section>
                
                <Roadmap />

            </main>
        </div>
    );
};

export default CareerPage;

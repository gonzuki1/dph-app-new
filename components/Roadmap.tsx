
import React, { useState, useMemo } from 'react';
import { RoadmapStep, RoadmapChallenge } from '../types';
import { useUserData } from '../context/UserDataContext';

const roadmapData: RoadmapStep[] = [
    { 
        month: 1, title: 'Mes 1', description: 'Fundación y Hábitos', status: 'completed', icon: 'check',
        challenges: [
            { id: 'm1-c1', text: 'Realizar 50 contactos iniciales', completed: false, category: 'venta' },
            { id: 'm1-c2', text: 'Completar curso de bienvenida DPH', completed: false, category: 'formacion' },
            { id: 'm1-c3', text: 'Registro diario perfecto en CRM (1 semana)', completed: false, category: 'habito' }
        ]
    },
    { 
        month: 2, title: 'Mes 2', description: 'Crecimiento Individual', status: 'active', icon: 'hourglass_top',
        challenges: [
            { id: 'm2-c1', text: 'Lograr 15 ventas nuevas', completed: false, category: 'venta' },
            { id: 'm2-c2', text: 'Mantener retención > 90%', completed: false, category: 'habito' },
            { id: 'm2-c3', text: 'Lectura de 1 libro de ventas recomendado', completed: false, category: 'formacion' }
        ]
    },
    { 
        month: 3, title: 'Mes 3', description: 'Construcción de Equipo', status: 'locked', icon: 'groups',
        challenges: [
            { id: 'm3-c1', text: 'Traer 2 referidos calificados', completed: false, category: 'venta' },
            { id: 'm3-c2', text: 'Asistir a 3 cierres de compañeros', completed: false, category: 'formacion' },
            { id: 'm3-c3', text: 'Liderar 1 reunión de equipo semanal', completed: false, category: 'habito' }
        ]
    },
    { 
        month: 4, title: 'Mes 4', description: 'Ascenso a Supervisor', status: 'locked', icon: 'military_tech',
        challenges: [
            { id: 'm4-c1', text: 'Alcanzar bono de productividad Master', completed: false, category: 'venta' },
            { id: 'm4-c2', text: 'Certificación en Liderazgo DPH', completed: false, category: 'formacion' },
            { id: 'm4-c3', text: 'Mentoría a 1 vendedor nuevo', completed: false, category: 'habito' }
        ]
    },
    { month: 5, title: 'Mes 5', description: 'Consolidación', status: 'locked', icon: 'verified', challenges: [] },
    { month: 6, title: 'Mes 6', description: 'Multiplicación', status: 'locked', icon: 'rocket_launch', challenges: [] }
];

const Roadmap: React.FC = () => {
    const { userData, toggleRoadmapChallenge } = useUserData();
    const [selectedMonth, setSelectedMonth] = useState<number>(2);

    const activeStep = useMemo(() => 
        roadmapData.find(s => s.month === selectedMonth) || roadmapData[1]
    , [selectedMonth]);

    const isChallengeCompleted = (id: string) => userData?.roadmapProgress?.[id] || false;

    const renderChallenge = (challenge: RoadmapChallenge) => {
        const completed = isChallengeCompleted(challenge.id);
        return (
            <div 
                key={challenge.id}
                onClick={() => toggleRoadmapChallenge(challenge.id)}
                className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer group
                    ${completed 
                        ? 'bg-primary/5 border-primary/20 opacity-80' 
                        : 'bg-background-light dark:bg-white/5 border-border-color dark:border-white/10 hover:border-primary/30'}
                `}
            >
                <div className={`mt-0.5 size-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${completed ? 'bg-primary border-primary text-white' : 'border-border-color dark:border-white/20 group-hover:border-primary/50'}
                `}>
                    {completed && <span className="material-symbols-outlined text-[14px] font-bold">check</span>}
                </div>
                <div className="flex flex-col">
                    <span className={`text-sm font-medium ${completed ? 'line-through text-text-muted' : 'text-neutral-dark dark:text-gray-200'}`}>
                        {challenge.text}
                    </span>
                    <span className="text-[10px] font-black uppercase text-text-muted mt-1 tracking-wider">
                        {challenge.category}
                    </span>
                </div>
            </div>
        );
    };

    const getStatusStyle = (step: RoadmapStep) => {
        const isSelected = selectedMonth === step.month;
        if (step.status === 'completed') return { icon: 'bg-primary text-white', text: 'text-primary', line: 'bg-primary' };
        if (step.status === 'active') return { icon: isSelected ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-neutral-dark dark:bg-white text-primary border-2 border-primary', text: 'text-primary', line: 'bg-neutral-light dark:bg-white/10' };
        return { icon: isSelected ? 'bg-primary/50 text-white' : 'bg-neutral-light dark:bg-white/10 text-text-muted', text: 'text-text-muted', line: 'bg-neutral-light dark:bg-white/10' };
    };

    return (
        <section className="bg-white dark:bg-white/5 rounded-2xl border border-border-color dark:border-white/10 p-4 sm:p-8 shadow-sm">
            <div className="flex flex-col gap-2 mb-10">
                <h3 className="text-xl font-bold text-neutral-dark dark:text-white">Mapa de Trayectoria Interactiva</h3>
                <p className="text-secondary-text dark:text-gray-400 text-sm">Selecciona una fase para gestionar tus retos y objetivos.</p>
            </div>

            {/* Timeline */}
            <div className="relative mb-12">
                <div className="hidden lg:flex justify-between items-center relative px-4">
                    <div className="absolute top-7 left-0 w-full h-1 bg-neutral-light dark:bg-white/10 -z-10 rounded-full"></div>
                    {roadmapData.map((step) => {
                        const style = getStatusStyle(step);
                        return (
                            <button 
                                key={step.month} 
                                onClick={() => setSelectedMonth(step.month)}
                                className="flex flex-col items-center gap-3 group outline-none"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 z-10 
                                    ${style.icon} ${selectedMonth === step.month ? 'ring-4 ring-primary/20' : 'hover:scale-105'}
                                `}>
                                    <span className="material-symbols-outlined text-2xl font-bold">
                                        {step.status === 'completed' ? 'check' : step.icon}
                                    </span>
                                </div>
                                <div className="text-center">
                                    <h4 className={`text-xs font-black uppercase tracking-tighter ${selectedMonth === step.month ? 'text-primary' : 'text-text-muted'}`}>
                                        {step.title}
                                    </h4>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Mobile version */}
                <div className="lg:hidden flex overflow-x-auto pb-4 gap-6 no-scrollbar">
                    {roadmapData.map((step) => {
                         const style = getStatusStyle(step);
                         return (
                            <button 
                                key={step.month} 
                                onClick={() => setSelectedMonth(step.month)}
                                className="flex flex-col items-center gap-2 min-w-[80px]"
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${style.icon}`}>
                                    <span className="material-symbols-outlined text-xl">{step.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase">{step.title}</span>
                            </button>
                         );
                    })}
                </div>
            </div>

            {/* Details View */}
            <div className="pt-8 border-t border-border-color dark:border-white/10 animate-fade-in-up">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-primary text-xs font-black uppercase tracking-widest">Fase Seleccionada</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase
                                ${activeStep.status === 'completed' ? 'bg-green-100 text-green-700' : 
                                  activeStep.status === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}
                            `}>
                                {activeStep.status === 'completed' ? 'Completado' : 
                                 activeStep.status === 'active' ? 'En Curso' : 'Bloqueado'}
                            </span>
                        </div>
                        <h3 className="text-2xl font-black text-neutral-dark dark:text-white">{activeStep.title}: {activeStep.description}</h3>
                    </div>
                </div>

                {activeStep.challenges && activeStep.challenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Challenges List */}
                        <div className="md:col-span-2 space-y-4">
                            <h4 className="text-xs font-black text-text-muted uppercase tracking-widest mb-4">Retos de este Mes</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {activeStep.challenges.map(renderChallenge)}
                            </div>
                        </div>

                        {/* Reward Card */}
                        <div className={`p-6 rounded-2xl border flex flex-col justify-between transition-all relative overflow-hidden
                            ${activeStep.challenges.every(c => isChallengeCompleted(c.id)) 
                                ? 'bg-gradient-to-br from-primary to-blue-700 border-primary text-white shadow-xl scale-[1.02]' 
                                : 'bg-neutral-light dark:bg-white/5 border-border-color dark:border-white/10 text-neutral-dark dark:text-white'}
                        `}>
                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md
                                        ${activeStep.challenges.every(c => isChallengeCompleted(c.id)) ? 'bg-white text-primary' : 'bg-primary text-white'}
                                    `}>
                                        <span className="material-symbols-outlined">emoji_events</span>
                                    </div>
                                    <h4 className="font-bold">Recompensa</h4>
                                </div>
                                <p className="text-sm opacity-80 mb-6">Al completar todos los retos de esta fase desbloquearás beneficios exclusivos.</p>
                                
                                <div className={`p-4 rounded-xl flex items-center gap-3 mb-4
                                    ${activeStep.challenges.every(c => isChallengeCompleted(c.id)) ? 'bg-white/20' : 'bg-white dark:bg-black/20'}
                                `}>
                                    <span className="material-symbols-outlined text-3xl text-yellow-500">workspace_premium</span>
                                    <div>
                                        <p className="font-bold text-sm">Bonificación Nivel {activeStep.month}</p>
                                        <p className="text-[10px] opacity-70 uppercase font-bold tracking-widest">Insignia Especial</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-4">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Progreso Fase</span>
                                    <span className="text-sm font-black">
                                        {activeStep.challenges.filter(c => isChallengeCompleted(c.id)).length} / {activeStep.challenges.length}
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full transition-all duration-700 ${activeStep.challenges.every(c => isChallengeCompleted(c.id)) ? 'bg-white' : 'bg-primary'}`}
                                        style={{ width: `${(activeStep.challenges.filter(c => isChallengeCompleted(c.id)).length / activeStep.challenges.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12 bg-neutral-light dark:bg-white/5 rounded-2xl border-2 border-dashed border-border-color dark:border-white/10">
                        <span className="material-symbols-outlined text-4xl text-text-muted mb-2">lock</span>
                        <p className="text-text-muted font-medium">Contenido aún no disponible para esta fase avanzada.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Roadmap;

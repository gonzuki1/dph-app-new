
import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';

const EarningsCalculatorPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const { userData, updateWeeklyStat } = useUserData();

    // Configuración de montos oficiales
    const BONO_ASISTENCIA_DIARIO = 250;
    const COMISION_CARRO = 300;
    const COMISION_MOTO_RETROACTIVA = 600;

    if (!userData) return null;

    const { weeklyStats, salesRecords } = userData;
    const attendedDays = weeklyStats.attendedDays || [];

    // Lógica de fechas del ciclo (Viernes a Jueves)
    const getWorkCycleDates = useMemo(() => {
        const now = new Date();
        const day = now.getDay(); // 0: Dom, 1: Lun, ... 5: Vie, 6: Sáb
        
        // El ciclo de pago actual comenzó el último viernes
        // Si hoy es viernes (5), el ciclo empezó hoy (diff 0)
        // Si hoy es sábado (6), empezó ayer (diff 1)
        // Si hoy es jueves (4), empezó hace 6 días (diff 6)
        const daysSinceFriday = (day + 2) % 7;
        
        const cycleStart = new Date(now);
        cycleStart.setDate(now.getDate() - daysSinceFriday);
        cycleStart.setHours(0, 0, 0, 0);

        const cycleDates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(cycleStart);
            date.setDate(cycleStart.getDate() + i);
            cycleDates.push({
                iso: date.toISOString().split('T')[0],
                label: date.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }),
                fullDate: date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
            });
        }
        return cycleDates;
    }, []);

    // Lógica: Contar ventas "Pagadas" (en verde) de la tabla
    const paidSales = useMemo(() => {
        return salesRecords.filter(record => record.status === 'paid');
    }, [salesRecords]);

    const paidCarsCount = paidSales.filter(s => s.vehicleType === 'car').length;
    const paidMotosCount = paidSales.filter(s => s.vehicleType === 'motorcycle').length;

    // Cálculos basados en asistencia diaria y ventas PAGADAS
    const carEarnings = paidCarsCount * COMISION_CARRO;
    const motoRetroactiveEarnings = paidMotosCount * COMISION_MOTO_RETROACTIVA;
    const attendanceEarnings = attendedDays.length * BONO_ASISTENCIA_DIARIO;
    
    const weeklyTotal = carEarnings + attendanceEarnings;
    const retroactivoTotal = motoRetroactiveEarnings;

    const cycleDates = getWorkCycleDates;

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

                <div className="max-w-4xl mx-auto w-full p-4 md:p-8 lg:p-10 flex flex-col gap-8">
                    <header className="flex flex-col gap-2 text-center md:text-left">
                        <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Calculadora de Ganancia</h1>
                        <p className="text-text-muted dark:text-gray-400 text-base">Proyección de cobro basada en asistencia diaria y cierres.</p>
                    </header>

                    {/* Dashboard de Ganancias */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                <span className="material-symbols-outlined text-8xl">payments</span>
                            </div>
                            <div className="relative z-10">
                                <span className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Pago Estimado Viernes</span>
                                <div className="flex items-baseline gap-2">
                                    <h2 className="text-5xl font-black mt-2 mb-6">${weeklyTotal.toLocaleString()}</h2>
                                    <span className="text-sm opacity-70">USD</span>
                                </div>
                                <div className="flex items-center gap-4 text-sm font-bold bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-md">
                                    <span className="material-symbols-outlined text-sm">event</span>
                                    Ciclo: {cycleDates[0].fullDate} - {cycleDates[6].fullDate}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-white/5 border border-border-color dark:border-white/10 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted dark:text-gray-400">Total Retroactivo (Motos Pagadas)</span>
                                <h3 className="text-3xl font-black text-amber-500 mt-2">${retroactivoTotal.toLocaleString()}</h3>
                                <p className="text-xs text-text-muted mt-2 font-medium">Bonificación retroactiva de <span className="text-emerald-500 font-bold">{paidMotosCount} unidades</span>.</p>
                            </div>
                            <div className="mt-6 flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-amber-400">
                                <span className="material-symbols-outlined text-sm">info</span>
                                Pago diferido según estado de tabla.
                            </div>
                        </div>
                    </div>

                    {/* Registro de Asistencia Diaria */}
                    <section className="bg-white dark:bg-white/5 border border-border-color dark:border-white/10 rounded-3xl p-8 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                            <div>
                                <h3 className="text-xl font-bold flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary">how_to_reg</span>
                                    Registro de Asistencia Diaria
                                </h3>
                                <p className="text-xs text-text-muted mt-1">Marca los días que asististe para sumar <span className="text-emerald-500 font-bold">${BONO_ASISTENCIA_DIARIO}</span> por día.</p>
                            </div>
                            <div className="bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-2xl font-black text-sm border border-emerald-500/20">
                                Acumulado: ${attendanceEarnings}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                            {cycleDates.map((day) => {
                                const isAttended = attendedDays.includes(day.iso);
                                return (
                                    <button
                                        key={day.iso}
                                        onClick={() => updateWeeklyStat('attendedDays', day.iso)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2
                                            ${isAttended 
                                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400' 
                                                : 'bg-neutral-light/50 dark:bg-gray-800/50 border-transparent text-text-muted opacity-60 hover:opacity-100'}
                                        `}
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-tighter">{day.label}</span>
                                        <span className={`material-symbols-outlined text-2xl transition-transform ${isAttended ? 'scale-110' : ''}`}>
                                            {isAttended ? 'task_alt' : 'circle'}
                                        </span>
                                        <span className="text-[10px] font-bold">${isAttended ? BONO_ASISTENCIA_DIARIO : 0}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Desglose de Operación Sincronizado */}
                    <div className="bg-white dark:bg-white/5 border border-border-color dark:border-white/10 rounded-3xl p-8 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h4 className="text-[10px] font-black uppercase text-text-muted tracking-[0.2em]">Resumen de Nómina</h4>
                            <span className="text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2 py-1 rounded">Corte: Jueves 23:59</span>
                        </div>
                        
                        <div className="space-y-5">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-text-muted text-sm">event_available</span>
                                    <span className="text-sm font-medium">Asistencia ({attendedDays.length} días x ${BONO_ASISTENCIA_DIARIO})</span>
                                </div>
                                <span className={`font-bold ${attendedDays.length > 0 ? 'text-emerald-500' : 'text-text-muted'}`}>+ ${attendanceEarnings}</span>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-text-muted text-sm">directions_car</span>
                                    <span className="text-sm font-medium">Autos Pagados ({paidCarsCount} x ${COMISION_CARRO})</span>
                                </div>
                                <span className="font-bold text-emerald-500">+ ${carEarnings}</span>
                            </div>

                            <div className="pt-6 border-t border-border-color dark:border-white/10 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-lg font-black">Cobro Estimado Viernes</span>
                                    <span className="text-[10px] text-text-muted uppercase font-bold">Base Semanal</span>
                                </div>
                                <span className="text-3xl font-black text-emerald-500">${weeklyTotal}</span>
                            </div>

                            <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl flex justify-between items-center mt-4">
                                <div className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-amber-500">motorcycle</span>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-amber-600">Retroactivo Motos Pagadas</span>
                                        <span className="text-[10px] text-amber-500/70">{paidMotosCount} x ${COMISION_MOTO_RETROACTIVA}</span>
                                    </div>
                                </div>
                                <span className="text-xl font-black text-amber-500">+ ${retroactivoTotal}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                        <span className="material-symbols-outlined text-blue-500 mt-0.5">help_outline</span>
                        <div className="flex flex-col gap-1">
                            <p className="text-xs text-blue-800 dark:text-blue-300 font-bold uppercase tracking-wider">Acerca del Ciclo DPH</p>
                            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
                                El ciclo actual comenzó el <strong>Viernes {cycleDates[0].fullDate}</strong> y cierra este <strong>Jueves {cycleDates[6].fullDate}</strong>. 
                                La asistencia diaria se registra automáticamente en tu historial semanal.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default EarningsCalculatorPage;

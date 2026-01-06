
import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCalendar } from '../context/CalendarContext';
import { CalendarEvent } from '../types';

const EventBadge: React.FC<{event: CalendarEvent}> = ({ event }) => {
    const { deleteEvent } = useCalendar();
    const typeClasses = {
        'Cita': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
        'Demo': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
        'Cierre': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
    };
    
    return (
        <div className={`flex items-center justify-between gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${typeClasses[event.type] || ''} group/badge`}>
            <span className="truncate">{event.title}</span>
            <button 
                onClick={(e) => { e.stopPropagation(); deleteEvent(event.id); }} 
                className="opacity-0 group-hover/badge:opacity-100 hover:text-red-500 transition-opacity"
            >
                <span className="material-symbols-outlined text-[12px]">close</span>
            </button>
        </div>
    );
};

const Calendar: React.FC = () => {
    const { events, addEvent } = useCalendar();
    const location = useLocation();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<string | null>(null);
    const [newTitle, setNewTitle] = useState('');
    const [newType, setNewType] = useState<CalendarEvent['type']>('Cita');

    // Efecto para auto-seleccionar hoy si venimos del Dashboard
    useEffect(() => {
        if (location.state?.selectToday) {
            const todayStr = new Date().toISOString().split('T')[0];
            setSelectedDay(todayStr);
            setCurrentDate(new Date()); // Aseguramos que el calendario esté en el mes actual
        }
    }, [location.state]);

    const changeMonth = (amount: number) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + amount);
            return newDate;
        });
    };
    
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay(); 
    const daysInMonth = endOfMonth.getDate();
    
    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedDay && newTitle.trim()) {
            addEvent({
                date: selectedDay,
                title: newTitle.trim(),
                type: newType
            });
            setNewTitle('');
            setSelectedDay(null);
        }
    };

    const days = useMemo(() => {
        const result = [];
        const today = new Date().toISOString().split('T')[0];

        // Previous month filler
        for (let i = 0; i < startDay; i++) {
            result.push(<div key={`prev-${i}`} className="border-r border-b border-border-color dark:border-gray-700 bg-neutral-light/30 dark:bg-gray-800/20"></div>);
        }

        // Current month
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
            const dateString = date.toISOString().split('T')[0];
            const dayEvents = events.filter(e => e.date === dateString);
            const isToday = dateString === today;
            const isSelected = selectedDay === dateString;

            result.push(
                <div 
                    key={i} 
                    onClick={() => setSelectedDay(dateString)}
                    className={`border-r border-b border-border-color dark:border-gray-700 p-1.5 min-h-[110px] flex flex-col cursor-pointer transition-colors relative group
                        ${isSelected ? 'bg-primary/5' : 'hover:bg-neutral-light/50 dark:hover:bg-gray-800/30'}
                    `}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full transition-colors
                            ${isToday ? 'bg-primary text-white' : 'text-text-main dark:text-gray-300'}
                        `}>
                            {i}
                        </span>
                        <span className="material-symbols-outlined text-primary text-[16px] opacity-0 group-hover:opacity-100">add</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-y-auto max-h-[70px]">
                        {dayEvents.map(event => (
                            <EventBadge key={event.id} event={event} />
                        ))}
                    </div>
                </div>
            );
        }

        // Next month filler
        const totalCells = Math.ceil((startDay + daysInMonth) / 7) * 7;
        for (let i = result.length; i < totalCells; i++) {
            result.push(<div key={`next-${i}`} className="border-r border-b border-border-color dark:border-gray-700 bg-neutral-light/30 dark:bg-gray-800/20"></div>);
        }
        return result;
    }, [currentDate, events, selectedDay]);

    const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Calendar Grid */}
            <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-border-color dark:border-gray-700">
                    <h2 className="text-xl font-black text-text-main dark:text-white uppercase tracking-tight">
                        {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button onClick={() => changeMonth(-1)} className="p-2 rounded-lg hover:bg-neutral-light dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined">chevron_left</span>
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold uppercase hover:bg-neutral-light dark:hover:bg-gray-700 rounded-md">Hoy</button>
                        <button onClick={() => changeMonth(1)} className="p-2 rounded-lg hover:bg-neutral-light dark:hover:bg-gray-700 transition-colors">
                            <span className="material-symbols-outlined">chevron_right</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-7 bg-neutral-light/20 dark:bg-gray-900/10">
                    {weekDays.map(day => (
                        <div key={day} className="text-center font-black text-[10px] p-2 border-r border-b border-border-color dark:border-gray-700 text-text-muted uppercase tracking-widest">
                            {day}
                        </div>
                    ))}
                    {days}
                </div>
            </div>

            {/* Sidebar / Modal for Adding Event */}
            {selectedDay && (
                <div className="w-full lg:w-80 animate-fade-in-up">
                    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-primary/30 shadow-lg p-6 sticky top-24">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-black text-text-main dark:text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-primary">add_task</span>
                                Tareas del Día
                            </h3>
                            <button onClick={() => setSelectedDay(null)} className="text-text-muted hover:text-text-main">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                        <p className="text-xs text-text-muted mb-6 font-bold uppercase">Fecha: {new Date(selectedDay).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                        
                        <div className="mb-6">
                           <h4 className="text-[10px] font-black uppercase text-text-muted mb-2 tracking-wider">Actividades Registradas</h4>
                           <div className="space-y-2">
                               {events.filter(e => e.date === selectedDay).length > 0 ? (
                                   events.filter(e => e.date === selectedDay).map(event => (
                                       <div key={event.id} className="p-3 bg-neutral-light dark:bg-gray-800 rounded-lg flex items-center justify-between group/item">
                                           <div className="flex items-center gap-2">
                                               <span className={`w-2 h-2 rounded-full ${
                                                   event.type === 'Cita' ? 'bg-blue-500' : 
                                                   event.type === 'Demo' ? 'bg-purple-500' : 'bg-green-500'
                                               }`}></span>
                                               <span className="text-sm font-medium">{event.title}</span>
                                           </div>
                                           <button 
                                                onClick={() => useCalendar().deleteEvent(event.id)}
                                                className="text-text-muted hover:text-red-500 transition-colors opacity-0 group-hover/item:opacity-100"
                                            >
                                               <span className="material-symbols-outlined text-sm">delete</span>
                                           </button>
                                       </div>
                                   ))
                               ) : (
                                   <p className="text-xs text-text-muted italic">No hay tareas para este día.</p>
                               )}
                           </div>
                        </div>

                        <div className="border-t border-border-color dark:border-gray-700 pt-4">
                            <h4 className="text-[10px] font-black uppercase text-text-muted mb-3 tracking-wider">Nueva Tarea</h4>
                            <form onSubmit={handleAddEvent} className="space-y-4">
                                <div>
                                    <input 
                                        autoFocus
                                        type="text" 
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        placeholder="Título de la actividad..."
                                        className="w-full px-4 py-2.5 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {(['Cita', 'Demo', 'Cierre'] as const).map(type => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setNewType(type)}
                                                className={`py-2 text-[10px] font-black uppercase rounded-lg border-2 transition-all
                                                    ${newType === type 
                                                        ? 'border-primary bg-primary/10 text-primary' 
                                                        : 'border-transparent bg-neutral-light dark:bg-gray-800 text-text-muted'}
                                                `}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={!newTitle.trim()}
                                    className="w-full bg-primary hover:bg-primary-hover text-white font-black uppercase text-xs py-3 rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50"
                                >
                                    Añadir Tarea
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Calendar;

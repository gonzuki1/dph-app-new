
import React, { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitsContext';
import { Habit } from '../types';

const HabitItem: React.FC<{ habit: Habit }> = ({ habit }) => {
    const { toggleHabit, deleteHabit } = useHabits();

    return (
        <div className="flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark/50 rounded-lg border border-border-color dark:border-gray-700/50 hover:border-primary/50 transition-colors group">
            <div className="flex items-center gap-4">
                <input
                    type="checkbox"
                    id={`habit-${habit.id}`}
                    checked={habit.completed}
                    onChange={() => toggleHabit(habit.id)}
                    className="hidden"
                />
                <label
                    htmlFor={`habit-${habit.id}`}
                    className={`w-6 h-6 rounded-md border-2 flex-shrink-0 cursor-pointer flex items-center justify-center transition-all ${
                        habit.completed 
                            ? 'bg-primary border-primary' 
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-primary/70'
                    }`}
                >
                    {habit.completed && <span className="material-symbols-outlined text-white text-base">check</span>}
                </label>
                <span className={`font-medium ${habit.completed ? 'line-through text-text-muted dark:text-gray-500' : 'text-text-main dark:text-white'}`}>
                    {habit.text}
                </span>
            </div>
            <button 
                onClick={() => deleteHabit(habit.id)}
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 p-1.5 rounded-full transition-opacity"
                aria-label="Eliminar hábito"
            >
                <span className="material-symbols-outlined text-xl">delete</span>
            </button>
        </div>
    );
};

const HabitsTracker: React.FC = () => {
    const { habits, addHabit } = useHabits();
    const [newHabitText, setNewHabitText] = useState('');

    const handleAddHabit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newHabitText.trim()) {
            addHabit(newHabitText.trim());
            setNewHabitText('');
        }
    };

    const completedCount = useMemo(() => habits.filter(h => h.completed).length, [habits]);
    const totalCount = habits.length;
    const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-6">
            <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm p-6">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-text-main dark:text-white">Progreso de Hoy</h3>
                    <span className="font-bold text-primary">{completedCount} / {totalCount} Completados</span>
                </div>
                 <div className="h-3 w-full bg-neutral-light dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
            </section>
            
            <section className="space-y-3">
                {habits.length > 0 ? (
                    habits.map(habit => <HabitItem key={habit.id} habit={habit} />)
                ) : (
                    <div className="text-center py-10 px-4 border-2 border-dashed border-border-color dark:border-gray-700 rounded-lg">
                        <span className="material-symbols-outlined text-5xl text-text-muted mx-auto">check_circle</span>
                        <h4 className="mt-2 text-lg font-semibold text-text-main dark:text-white">No hay hábitos todavía</h4>
                        <p className="mt-1 text-sm text-text-muted">Añade tu primer hábito para empezar a construir tu rutina.</p>
                    </div>
                )}
            </section>

            <section>
                <form onSubmit={handleAddHabit} className="flex items-center gap-3">
                    <input
                        type="text"
                        value={newHabitText}
                        onChange={(e) => setNewHabitText(e.target.value)}
                        placeholder="Ej: Leer 10 páginas..."
                        className="flex-grow px-4 py-3 bg-surface-light dark:bg-surface-dark border border-border-color dark:border-gray-600 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        type="submit"
                        className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                        disabled={!newHabitText.trim()}
                    >
                        <span className="material-symbols-outlined">add</span>
                        <span className="hidden sm:inline">Añadir</span>
                    </button>
                </form>
            </section>
        </div>
    );
};

export default HabitsTracker;

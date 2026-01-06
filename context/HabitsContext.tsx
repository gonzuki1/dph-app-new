
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Habit } from '../types';
import { useAuth } from './AuthContext';

interface HabitsContextType {
    habits: Habit[];
    addHabit: (text: string) => void;
    toggleHabit: (id: number) => void;
    deleteHabit: (id: number) => void;
}

const HabitsContext = createContext<HabitsContextType | undefined>(undefined);

const getTodayDateString = () => new Date().toISOString().split('T')[0];

export const HabitsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [habits, setHabits] = useState<Habit[]>([]);

    const getHabitsKey = useCallback(() => user ? `dph-habits-${user.email}` : null, [user]);
    const getCompletionsKey = useCallback(() => user ? `dph-habits-completed-${user.email}` : null, [user]);

    useEffect(() => {
        const habitsKey = getHabitsKey();
        const completionsKey = getCompletionsKey();
        if (!habitsKey || !completionsKey) {
            setHabits([]);
            return;
        };

        const storedHabits: Omit<Habit, 'completed'>[] = JSON.parse(localStorage.getItem(habitsKey) || '[]');
        const storedCompletions: Record<string, number[]> = JSON.parse(localStorage.getItem(completionsKey) || '{}');
        const todayCompletions = storedCompletions[getTodayDateString()] || [];

        const initialHabits = storedHabits.map(habit => ({
            ...habit,
            completed: todayCompletions.includes(habit.id),
        }));
        setHabits(initialHabits);
    }, [user, getHabitsKey, getCompletionsKey]);

    const saveHabits = (updatedHabits: Omit<Habit, 'completed'>[]) => {
        const habitsKey = getHabitsKey();
        if (habitsKey) {
            localStorage.setItem(habitsKey, JSON.stringify(updatedHabits));
        }
    };
    
    const saveCompletions = (updatedHabits: Habit[]) => {
        const completionsKey = getCompletionsKey();
        if (completionsKey) {
            const todayCompletions = updatedHabits.filter(h => h.completed).map(h => h.id);
            const allCompletions: Record<string, number[]> = JSON.parse(localStorage.getItem(completionsKey) || '{}');
            allCompletions[getTodayDateString()] = todayCompletions;
            localStorage.setItem(completionsKey, JSON.stringify(allCompletions));
        }
    };

    const addHabit = (text: string) => {
        setHabits(prev => {
            const newHabit: Habit = { id: Date.now(), text, completed: false };
            const updatedHabits = [...prev, newHabit];
            saveHabits(updatedHabits.map(({completed, ...rest}) => rest));
            return updatedHabits;
        });
    };

    const toggleHabit = (id: number) => {
        setHabits(prev => {
            const updatedHabits = prev.map(habit =>
                habit.id === id ? { ...habit, completed: !habit.completed } : habit
            );
            saveCompletions(updatedHabits);
            return updatedHabits;
        });
    };

    const deleteHabit = (id: number) => {
        setHabits(prev => {
            const updatedHabits = prev.filter(habit => habit.id !== id);
            saveHabits(updatedHabits.map(({completed, ...rest}) => rest));
            saveCompletions(updatedHabits);
            return updatedHabits;
        });
    };

    return (
        <HabitsContext.Provider value={{ habits, addHabit, toggleHabit, deleteHabit }}>
            {children}
        </HabitsContext.Provider>
    );
};

export const useHabits = (): HabitsContextType => {
    const context = useContext(HabitsContext);
    if (context === undefined) {
        throw new Error('useHabits must be used within a HabitsProvider');
    }
    return context;
};

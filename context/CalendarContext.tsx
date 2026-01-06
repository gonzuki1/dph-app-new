
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { CalendarEvent } from '../types';
import { useAuth } from './AuthContext';

interface CalendarContextType {
    events: CalendarEvent[];
    addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
    deleteEvent: (id: string) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);

    const getStorageKey = useCallback(() => user ? `dph-calendar-${user.email}` : null, [user]);

    useEffect(() => {
        const key = getStorageKey();
        if (key) {
            const stored = localStorage.getItem(key);
            if (stored) {
                setEvents(JSON.parse(stored));
            } else {
                setEvents([]);
            }
        } else {
            setEvents([]);
        }
    }, [user, getStorageKey]);

    const addEvent = (event: Omit<CalendarEvent, 'id'>) => {
        const key = getStorageKey();
        if (!key) return;
        
        const newEvent = { ...event, id: Math.random().toString(36).substr(2, 9) };
        const updated = [...events, newEvent];
        setEvents(updated);
        localStorage.setItem(key, JSON.stringify(updated));
    };

    const deleteEvent = (id: string) => {
        const key = getStorageKey();
        if (!key) return;
        
        const updated = events.filter(e => e.id !== id);
        setEvents(updated);
        localStorage.setItem(key, JSON.stringify(updated));
    };

    return (
        <CalendarContext.Provider value={{ events, addEvent, deleteEvent }}>
            {children}
        </CalendarContext.Provider>
    );
};

export const useCalendar = () => {
    const context = useContext(CalendarContext);
    if (!context) throw new Error('useCalendar must be used within CalendarProvider');
    return context;
};

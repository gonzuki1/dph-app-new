
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { UserData, Goals, DailyStats, WeeklyStats, SaleRecord, SaleStatus } from '../types';
import { useAuth } from './AuthContext';

interface UserDataContextType {
    userData: UserData | null;
    loading: boolean;
    updateGoal: (type: 'daily' | 'weekly', key: string, value: number) => void;
    updateStat: (key: keyof DailyStats, change: number) => void;
    updateWeeklyStat: (key: keyof WeeklyStats, change: number | string) => void;
    toggleRoadmapChallenge: (challengeId: string) => void;
    addSaleRecord: (sale: Omit<SaleRecord, 'id'>) => void;
    updateSaleStatus: (id: string, status: SaleStatus) => void;
    deleteSaleRecord: (id: string) => void;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const defaultGoals: Goals = {
    daily: { contacts: 20, appointments: 5, demos: 2, closes: 1 },
    weekly: { carSales: 4, motorcycleSales: 1, qualifiedGuests: 1, attendedDays: [] }
};

const defaultDailyStats: DailyStats = {
    contacts: 0, appointments: 0, demos: 0, closes: 0
};

const defaultWeeklyStats: WeeklyStats = {
    carSales: 0, motorcycleSales: 0, qualifiedGuests: 0, attendedDays: []
};

export const UserDataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const loadUserData = useCallback(() => {
        setLoading(true);
        if (user) {
            try {
                const storedData = localStorage.getItem(`dph-data-${user.email}`);
                if (storedData) {
                    const data: UserData = JSON.parse(storedData);
                    
                    if (!data.weeklyStats) data.weeklyStats = { ...defaultWeeklyStats };
                    if (!data.weeklyStats.attendedDays) data.weeklyStats.attendedDays = [];
                    if (!data.roadmapProgress) data.roadmapProgress = {};
                    if (!data.salesRecords) data.salesRecords = [];
                    
                    if (data.lastUpdated !== getTodayDateString()) {
                        data.stats = { ...defaultDailyStats };
                        data.lastUpdated = getTodayDateString();
                        localStorage.setItem(`dph-data-${user.email}`, JSON.stringify(data));
                    }
                    setUserData(data);
                } else {
                    const newUserData: UserData = {
                        stats: { ...defaultDailyStats },
                        weeklyStats: { ...defaultWeeklyStats },
                        goals: { ...defaultGoals },
                        roadmapProgress: {},
                        salesRecords: [],
                        lastUpdated: getTodayDateString(),
                    };
                    localStorage.setItem(`dph-data-${user.email}`, JSON.stringify(newUserData));
                    setUserData(newUserData);
                }
            } catch (error) {
                console.error("Failed to load user data", error);
            }
        } else {
            setUserData(null);
        }
        setLoading(false);
    }, [user]);

    useEffect(() => {
        loadUserData();
    }, [loadUserData]);

    const saveData = (data: UserData) => {
        if (user) {
            localStorage.setItem(`dph-data-${user.email}`, JSON.stringify(data));
            setUserData({ ...data });
        }
    };
    
    const updateGoal = (type: 'daily' | 'weekly', key: string, value: number) => {
        if (userData) {
            const newUserData = { ...userData };
            (newUserData.goals[type] as any)[key] = value;
            saveData(newUserData);
        }
    };

    const updateStat = (key: keyof DailyStats, change: number) => {
        if (userData) {
            const newUserData = { ...userData };
            newUserData.stats[key] = Math.max(0, newUserData.stats[key] + change);
            saveData(newUserData);
        }
    };

    const updateWeeklyStat = (key: keyof WeeklyStats, change: number | string) => {
        if (userData) {
            const newUserData = { ...userData };
            if (key === 'attendedDays') {
                const date = change as string;
                const currentDays = newUserData.weeklyStats.attendedDays || [];
                if (currentDays.includes(date)) {
                    newUserData.weeklyStats.attendedDays = currentDays.filter(d => d !== date);
                } else {
                    newUserData.weeklyStats.attendedDays = [...currentDays, date];
                }
            } else {
                (newUserData.weeklyStats as any)[key] = Math.max(0, (newUserData.weeklyStats as any)[key] + (change as number));
            }
            saveData(newUserData);
        }
    };

    const toggleRoadmapChallenge = (challengeId: string) => {
        if (userData) {
            const newUserData = { ...userData };
            newUserData.roadmapProgress[challengeId] = !newUserData.roadmapProgress[challengeId];
            saveData(newUserData);
        }
    };

    const addSaleRecord = (sale: Omit<SaleRecord, 'id'>) => {
        if (userData) {
            const newUserData = { ...userData };
            const newSale = { ...sale, id: Math.random().toString(36).substr(2, 9) };
            newUserData.salesRecords = [newSale, ...newUserData.salesRecords];
            saveData(newUserData);
        }
    };

    const updateSaleStatus = (id: string, status: SaleStatus) => {
        if (userData) {
            const newUserData = { ...userData };
            newUserData.salesRecords = newUserData.salesRecords.map(sale => 
                sale.id === id ? { ...sale, status } : sale
            );
            saveData(newUserData);
        }
    };

    const deleteSaleRecord = (id: string) => {
        if (userData) {
            const newUserData = { ...userData };
            newUserData.salesRecords = newUserData.salesRecords.filter(sale => sale.id !== id);
            saveData(newUserData);
        }
    };

    return (
        <UserDataContext.Provider value={{ 
            userData, loading, updateGoal, updateStat, updateWeeklyStat, 
            toggleRoadmapChallenge, addSaleRecord, updateSaleStatus, deleteSaleRecord 
        }}>
            {children}
        </UserDataContext.Provider>
    );
};

export const useUserData = (): UserDataContextType => {
    const context = useContext(UserDataContext);
    if (context === undefined) {
        throw new Error('useUserData must be used within a UserDataProvider');
    }
    return context;
};

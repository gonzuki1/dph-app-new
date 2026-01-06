
import React from 'react';
import { StatCardProps } from '../types';

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, goal, period, onIncrement, onDecrement }) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    
    return (
        <div className="bg-surface-light dark:bg-surface-dark rounded-xl p-5 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col gap-3 group hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-2 text-text-muted">
                    <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    <span className="text-sm font-medium">{title}</span>
                </div>
                <span className="text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-1 rounded">{period}</span>
            </div>
            <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-text-main dark:text-white">{value}</span>
                <span className="text-lg text-text-muted">/ {goal}</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${percentage > 100 ? 100 : percentage}%` }}></div>
            </div>
            <div className="flex items-center justify-between mt-2">
                <button 
                    onClick={onDecrement} 
                    className="size-8 flex items-center justify-center rounded-lg bg-neutral-light/70 hover:bg-neutral-light dark:bg-gray-700/50 dark:hover:bg-gray-700 transition-colors"
                    aria-label={`Disminuir ${title}`}
                >
                    <span className="material-symbols-outlined text-base">remove</span>
                </button>
                 <p className="text-xs text-text-muted font-medium">{Math.round(percentage)}% Completado</p>
                <button 
                    onClick={onIncrement}
                    className="size-8 flex items-center justify-center rounded-lg bg-primary/20 hover:bg-primary/30 text-primary transition-colors"
                    aria-label={`Aumentar ${title}`}
                >
                    <span className="material-symbols-outlined text-base">add</span>
                </button>
            </div>
        </div>
    );
};

export default StatCard;

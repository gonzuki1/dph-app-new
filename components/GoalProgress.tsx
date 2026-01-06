
import React from 'react';
import { GoalProgressProps } from '../types';

const GoalProgress: React.FC<GoalProgressProps> = ({ 
    title, 
    description, 
    value, 
    goal, 
    isCompleted = false,
    onIncrement,
    onDecrement 
}) => {
    const percentage = goal > 0 ? (value / goal) * 100 : 0;
    const isActuallyCompleted = value >= goal && goal > 0;
    
    return (
        <div className="flex flex-col gap-3 group/goal">
            <div className="flex justify-between items-end">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-text-main dark:text-white">{title}</span>
                    <span className={`text-xs ${isActuallyCompleted ? 'text-primary font-bold' : 'text-text-muted'}`}>{description}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-2">
                        {onDecrement && (
                            <button 
                                onClick={onDecrement}
                                className="size-6 flex items-center justify-center rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xs">remove</span>
                            </button>
                        )}
                        <span className={`text-sm font-black ${isActuallyCompleted ? 'text-primary' : 'text-text-main dark:text-white'}`}>
                            {value} <span className="text-text-muted font-normal">/ {goal}</span>
                        </span>
                        {onIncrement && (
                            <button 
                                onClick={onIncrement}
                                className="size-6 flex items-center justify-center rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                                <span className="material-symbols-outlined text-xs">add</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="h-2.5 w-full bg-neutral-light dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${isActuallyCompleted ? 'bg-primary shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-primary'}`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                ></div>
            </div>
            {isActuallyCompleted && (
                <div className="flex items-center gap-1 animate-fade-in-up">
                    <span className="material-symbols-outlined text-primary text-xs font-bold">verified</span>
                    <span className="text-[10px] font-black text-primary uppercase tracking-tighter">¡Meta Alcanzada!</span>
                </div>
            )}
        </div>
    );
};

export default GoalProgress;

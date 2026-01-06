
import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CareerHeader: React.FC = () => {
    const { user } = useAuth();
    return (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-border-color dark:border-white/10 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center text-primary bg-primary/10 rounded-md">
                        <span className="material-symbols-outlined">trending_up</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight text-neutral-dark dark:text-white">DPH Career Tracker</h1>
                </Link>
                <nav className="hidden md:flex items-center gap-8">
                    <NavLink to="/" end className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>Dashboard</NavLink>
                    <NavLink to="/career" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>Mi Carrera</NavLink>
                    <NavLink to="/calendar" className={({isActive}) => `text-sm font-medium transition-colors ${isActive ? 'text-primary' : 'hover:text-primary'}`}>Calendario</NavLink>
                </nav>
                <div className="flex items-center gap-4">
                    <button className="hidden sm:flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-white transition-transform hover:scale-105">
                        Perfil
                    </button>
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border-2 border-primary/20">
                         {user?.name.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default CareerHeader;


import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RegisteredUser, User, RegisterCredentials } from '../types';

interface AuthContextType {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);

    // Effect to load the logged-in user session on app start
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('dph-user-session');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Failed to parse user session from localStorage", error);
            localStorage.removeItem('dph-user-session');
        }
    }, []);

    const login = async (email: string, pass: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const storedUsers: RegisteredUser[] = JSON.parse(localStorage.getItem('dph-users') || '[]');
                const foundUser = storedUsers.find(u => u.email === email && u.password === pass);
                
                if (foundUser) {
                    const sessionUser: User = {
                        name: foundUser.name,
                        title: foundUser.title,
                        email: foundUser.email,
                    };
                    localStorage.setItem('dph-user-session', JSON.stringify(sessionUser));
                    setUser(sessionUser);
                    resolve();
                } else {
                    reject(new Error('Credenciales inválidas. Por favor, inténtalo de nuevo.'));
                }
            }, 500);
        });
    };
    
    const register = async (credentials: RegisterCredentials): Promise<void> => {
        return new Promise((resolve, reject) => {
             setTimeout(() => {
                const storedUsers: RegisteredUser[] = JSON.parse(localStorage.getItem('dph-users') || '[]');
                const userExists = storedUsers.some(u => u.email === credentials.email);

                if (userExists) {
                    reject(new Error('Ya existe una cuenta con este correo electrónico.'));
                    return;
                }
                
                // In a real app, password should be hashed before saving.
                const newUser: RegisteredUser = {
                    ...credentials,
                    title: 'Vendedor' // Default title for new users
                };
                
                const updatedUsers = [...storedUsers, newUser];
                localStorage.setItem('dph-users', JSON.stringify(updatedUsers));
                resolve();
             }, 500);
        });
    };

    const logout = () => {
        localStorage.removeItem('dph-user-session');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

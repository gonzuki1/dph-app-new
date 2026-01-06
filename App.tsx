
import React from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CareerPage from './pages/CareerPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CalendarPage from './pages/CalendarPage';
import HabitsPage from './pages/HabitsPage';
import SettingsPage from './pages/SettingsPage';
import SalesPaymentsPage from './pages/SalesPaymentsPage';
import EarningsCalculatorPage from './pages/EarningsCalculatorPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HabitsProvider } from './context/HabitsContext';
import { UserDataProvider } from './context/UserDataContext';
import { CalendarProvider } from './context/CalendarContext';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <UserDataProvider>
                <CalendarProvider>
                    <HabitsProvider>
                        <HashRouter>
                            <Routes>
                                <Route path="/login" element={<LoginPage />} />
                                <Route path="/register" element={<RegisterPage />} />
                                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                                <Route path="/career" element={<ProtectedRoute><CareerPage /></ProtectedRoute>} />
                                <Route path="/calendar" element={<ProtectedRoute><CalendarPage /></ProtectedRoute>} />
                                <Route path="/habits" element={<ProtectedRoute><HabitsPage /></ProtectedRoute>} />
                                <Route path="/sales-payments" element={<ProtectedRoute><SalesPaymentsPage /></ProtectedRoute>} />
                                <Route path="/earnings" element={<ProtectedRoute><EarningsCalculatorPage /></ProtectedRoute>} />
                                <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                            </Routes>
                        </HashRouter>
                    </HabitsProvider>
                </CalendarProvider>
            </UserDataProvider>
        </AuthProvider>
    );
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default App;

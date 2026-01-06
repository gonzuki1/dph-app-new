
import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MobileSidebar from '../components/MobileSidebar';
import { useAuth } from '../context/AuthContext';
import { useUserData } from '../context/UserDataContext';
import { SaleStatus } from '../types';

const SalesPaymentsPage: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { user } = useAuth();
    const { userData, addSaleRecord, updateSaleStatus, deleteSaleRecord } = useUserData();

    const [form, setForm] = useState({
        customerName: '',
        phone: '',
        vehicleType: 'car' as 'car' | 'motorcycle',
        status: 'pending' as SaleStatus,
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.customerName && form.phone) {
            addSaleRecord({
                customerName: form.customerName,
                phone: form.phone,
                vehicleType: form.vehicleType,
                status: form.status,
                date: form.date
            });
            setForm({
                customerName: '',
                phone: '',
                vehicleType: 'car',
                status: 'pending',
                date: new Date().toISOString().split('T')[0]
            });
        }
    };

    const getStatusColor = (status: SaleStatus) => {
        switch (status) {
            case 'paid': return 'bg-emerald-500';
            case 'pending': return 'bg-amber-500';
            case 'cancelled': return 'bg-rose-500';
            default: return 'bg-gray-500';
        }
    };

    const getStatusLabel = (status: SaleStatus) => {
        switch (status) {
            case 'paid': return 'Pagada';
            case 'pending': return 'Pendiente';
            case 'cancelled': return 'Cancelada';
            default: return 'Desconocido';
        }
    };

    return (
        <div className="font-display bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-200 flex h-screen w-full overflow-hidden">
            <Sidebar />
            <MobileSidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />

            <main className="flex-1 flex flex-col h-full overflow-y-auto relative">
                {/* Mobile Header */}
                <div className="md:hidden flex items-center justify-between p-4 bg-surface-light dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 sticky top-0 z-20">
                     <div className="flex items-center gap-3">
                        <div className="bg-primary/20 text-primary rounded-full size-8 flex items-center justify-center font-bold">
                           {user?.name.charAt(0)}
                        </div>
                        <span className="font-bold text-sm">{user?.name}</span>
                    </div>
                    <button className="text-text-main dark:text-white" onClick={() => setMobileMenuOpen(true)}>
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                </div>

                <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:p-10 flex flex-col gap-8">
                    <header>
                        <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Control de Pagos de Ventas</h1>
                        <p className="text-text-muted dark:text-gray-400 text-base font-normal">Gestiona el flujo de caja y estado de tus ventas de autos y motos.</p>
                    </header>

                    {/* Formulario de registro */}
                    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm p-6">
                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-primary">add_circle</span>
                            Nuevo Registro de Venta
                        </h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                            <div>
                                <label className="block text-[10px] font-black uppercase text-text-muted mb-1 tracking-widest">Cliente</label>
                                <input 
                                    type="text" 
                                    required
                                    value={form.customerName}
                                    onChange={e => setForm({...form, customerName: e.target.value})}
                                    placeholder="Nombre completo"
                                    className="w-full px-4 py-2 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-text-muted mb-1 tracking-widest">Teléfono</label>
                                <input 
                                    type="tel" 
                                    required
                                    value={form.phone}
                                    onChange={e => setForm({...form, phone: e.target.value})}
                                    placeholder="Número de contacto"
                                    className="w-full px-4 py-2 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-text-muted mb-1 tracking-widest">Vehículo</label>
                                <select 
                                    value={form.vehicleType}
                                    onChange={e => setForm({...form, vehicleType: e.target.value as any})}
                                    className="w-full px-4 py-2 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                >
                                    <option value="car">🚗 Auto</option>
                                    <option value="motorcycle">🏍️ Moto</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase text-text-muted mb-1 tracking-widest">Fecha</label>
                                <input 
                                    type="date" 
                                    value={form.date}
                                    onChange={e => setForm({...form, date: e.target.value})}
                                    className="w-full px-4 py-2 bg-neutral-light dark:bg-gray-800 border border-border-color dark:border-gray-600 rounded-lg text-sm"
                                />
                            </div>
                            <button 
                                type="submit"
                                className="w-full bg-primary hover:bg-primary-hover text-white font-black uppercase text-xs py-2.5 rounded-lg shadow-md transition-all active:scale-95"
                            >
                                Registrar Venta
                            </button>
                        </form>
                    </section>

                    {/* Tabla de registros */}
                    <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-border-color dark:border-gray-700 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-neutral-light/50 dark:bg-gray-900/20 border-b border-border-color dark:border-gray-700">
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Fecha</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Cliente</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Contacto</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Tipo</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest">Estado de Pago</th>
                                        <th className="px-6 py-4 text-[10px] font-black uppercase text-text-muted tracking-widest text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userData?.salesRecords && userData.salesRecords.length > 0 ? (
                                        userData.salesRecords.map((sale) => (
                                            <tr key={sale.id} className="border-b border-border-color dark:border-gray-700 hover:bg-neutral-light/30 dark:hover:bg-gray-800/20 transition-colors group">
                                                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">{sale.date}</td>
                                                <td className="px-6 py-4 text-sm font-bold">{sale.customerName}</td>
                                                <td className="px-6 py-4 text-sm text-text-muted dark:text-gray-400">{sale.phone}</td>
                                                <td className="px-6 py-4 text-sm">
                                                    {sale.vehicleType === 'car' ? (
                                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">directions_car</span> Auto</span>
                                                    ) : (
                                                        <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">motorcycle</span> Moto</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex bg-neutral-light dark:bg-gray-800 p-1 rounded-lg">
                                                            {(['paid', 'pending', 'cancelled'] as SaleStatus[]).map((status) => (
                                                                <button
                                                                    key={status}
                                                                    onClick={() => updateSaleStatus(sale.id, status)}
                                                                    title={getStatusLabel(status)}
                                                                    className={`w-6 h-6 rounded-md transition-all ${
                                                                        sale.status === status 
                                                                        ? `${getStatusColor(status)} shadow-lg scale-110` 
                                                                        : 'bg-transparent grayscale opacity-30 hover:opacity-100 hover:grayscale-0'
                                                                    }`}
                                                                ></button>
                                                            ))}
                                                        </div>
                                                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                                            sale.status === 'paid' ? 'text-emerald-500 bg-emerald-500/10' :
                                                            sale.status === 'pending' ? 'text-amber-500 bg-amber-500/10' : 'text-rose-500 bg-rose-500/10'
                                                        }`}>
                                                            {getStatusLabel(sale.status)}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => deleteSaleRecord(sale.id)}
                                                        className="text-text-muted hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <span className="material-symbols-outlined">delete</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-20 text-center">
                                                <span className="material-symbols-outlined text-4xl text-text-muted mb-2">payments</span>
                                                <p className="text-text-muted font-medium">No hay registros de ventas todavía.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
};

export default SalesPaymentsPage;

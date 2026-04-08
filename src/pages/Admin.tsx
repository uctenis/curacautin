import { useState } from 'react';
import { useData, RESOURCE_LABELS } from '../context/DataContext';
import { format, startOfMonth, addMonths, subMonths, startOfWeek, addDays, isSameMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, Calendar, Settings as SettingsIcon, Package, Check, X, ShieldCheck, Lock, LogIn, ChevronLeft, ChevronRight, Search, Download, DollarSign, Clock, AlertCircle } from 'lucide-react';

const Admin = () => {
    const { bookings, settings, updateSettings, confirmBooking, cancelBooking, toggleBlockDate, blockedDates } = useData();
    const [activeTab, setActiveTab] = useState<'bookings' | 'settings' | 'blocked'>('bookings');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'cancelled'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [blockMonth, setBlockMonth] = useState(startOfMonth(new Date()));

    // Simple Admin Auth
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return sessionStorage.getItem('uct_admin_auth') === 'true';
    });
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState(false);

    // Settings local state
    const [maxSitePicnic, setMaxSitePicnic] = useState(settings.maxSitePicnicPerDay);
    const [maxSiteCamping, setMaxSiteCamping] = useState(settings.maxSiteCampingPerDay);
    const [maxCabin4, setMaxCabin4] = useState(settings.maxCabin4PerDay);
    const [maxCabin6, setMaxCabin6] = useState(settings.maxCabin6PerDay);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Predefined admin password or from env
        const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'uctadmin2026';
        if (password === ADMIN_PASS) {
            setIsAuthenticated(true);
            sessionStorage.setItem('uct_admin_auth', 'true');
            setAuthError(false);
        } else {
            setAuthError(true);
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('uct_admin_auth');
    };

    const handleSaveSettings = () => {
        updateSettings({
            maxSitePicnicPerDay: maxSitePicnic,
            maxSiteCampingPerDay: maxSiteCamping,
            maxCabin4PerDay: maxCabin4,
            maxCabin6PerDay: maxCabin6,
        });
        alert('Configuración actualizada correctamente');
    };

    const exportToCSV = () => {
        const headers = ['ID', 'Fecha Solicitud', 'Nombre', 'Email', 'Contacto', 'Tipo', 'Llegada', 'Salida', 'Invitados', 'Precio Total', 'Estado'];
        const rows = bookings.map(b => [
            b.id,
            b.createdAt ? format(b.createdAt, 'dd/MM/yyyy HH:mm') : 'N/A',
            b.name,
            b.email,
            b.contact,
            RESOURCE_LABELS[b.type],
            format(b.startDate, 'dd/MM/yyyy'),
            format(b.endDate, 'dd/MM/yyyy'),
            b.guests,
            b.totalPrice,
            b.status
        ]);
        
        let csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n" 
            + rows.map(e => e.join(",")).join("\n");
            
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reservas_uct_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Stats calculations
    const stats = {
        total: bookings.length,
        pending: bookings.filter(b => b.status === 'pending').length,
        confirmed: bookings.filter(b => b.status === 'confirmed').length,
        totalRevenue: bookings.filter(b => b.status === 'confirmed').reduce((acc, b) => acc + b.totalPrice, 0)
    };

    // --- Login Screen ---
    if (!isAuthenticated) {
        return (
            <div className="container flex items-center justify-center" style={{ minHeight: '80vh' }}>
                <div className="card animate-fade-in" style={{ padding: '3rem', maxWidth: '400px', width: '100%', textAlign: 'center', borderTop: '6px solid var(--c-primary)' }}>
                    <div style={{ backgroundColor: '#f1f5f9', width: '70px', height: '70px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                        <Lock size={32} color="var(--c-primary)" />
                    </div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: '0.5rem' }}>Acceso Admin</h2>
                    <p style={{ color: 'var(--c-text-light)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                        Ingrese la contraseña de administrador para gestionar las reservas y parámetros.
                    </p>

                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <div style={{ position: 'relative' }}>
                            <input
                                type="password"
                                className="input"
                                placeholder="Contraseña"
                                required
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                style={{ textAlign: 'center', fontSize: '1rem', letterSpacing: '0.2rem', borderColor: authError ? '#ef4444' : 'var(--c-border)' }}
                            />
                            {authError && <p style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 600 }}>Contraseña incorrecta. Intente de nuevo.</p>}
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ padding: '1rem', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 700 }}>
                            <LogIn size={20} /> Entrar al Panel
                        </button>
                    </form>
                    <p style={{ fontSize: '0.75rem', color: 'var(--c-text-light)', marginTop: '2rem', opacity: 0.6 }}>
                        Solo personal autorizado por Rectoría UCT.
                    </p>
                </div>
            </div>
        );
    }

    // --- Admin Dashboard Content ---
    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 0' }}>
            <div className="container">
                <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-4">
                        <div style={{ backgroundColor: 'var(--c-primary)', padding: '0.75rem', borderRadius: '1rem', color: 'white' }}>
                            <ShieldCheck size={32} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, margin: 0 }}>Panel de Control Escalerilla</h1>
                            <p style={{ color: 'var(--c-text-light)', fontSize: '0.9rem', margin: 0 }}>Gestión Institucional de Reservas 2026</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button onClick={exportToCSV} className="btn btn-outline" style={{ borderRadius: '50px', padding: '0.6rem 1.5rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Download size={18} /> Exportar CSV
                        </button>
                        <button onClick={handleLogout} className="btn-secondary" style={{ borderRadius: '50px', padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 700, border: 'none', cursor: 'pointer', color: 'white' }}>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-6 mb-10">
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                        <div className="flex justify-between items-start mb-2">
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Total Solicitudes</span>
                            <Users size={18} color="#3b82f6" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stats.total}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #f59e0b' }}>
                        <div className="flex justify-between items-start mb-2">
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Pendientes</span>
                            <Clock size={18} color="#f59e0b" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stats.pending}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #10b981' }}>
                        <div className="flex justify-between items-start mb-2">
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Confirmadas</span>
                            <Check size={18} color="#10b981" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>{stats.confirmed}</div>
                    </div>
                    <div className="card" style={{ padding: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                        <div className="flex justify-between items-start mb-2">
                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ingresos (Conf.)</span>
                            <DollarSign size={18} color="#8b5cf6" />
                        </div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 900 }}>${stats.totalRevenue.toLocaleString('es-CL')}</div>
                    </div>
                </div>

                <div className="grid gap-8" style={{ gridTemplateColumns: '260px 1fr' }}>
                    {/* Sidebar Nav */}
                    <div className="flex flex-col gap-2">
                        <button
                            className={`admin-nav-item ${activeTab === 'bookings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('bookings')}
                        >
                            <Users size={18} /> Gestionar Reservas
                        </button>
                        <button
                            className={`admin-nav-item ${activeTab === 'blocked' ? 'active' : ''}`}
                            onClick={() => setActiveTab('blocked')}
                        >
                            <Calendar size={18} /> Bloqueo de Fechas
                        </button>
                        <button
                            className={`admin-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <SettingsIcon size={18} /> Parámetros y Cupos
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="card" style={{ padding: '2.5rem', minHeight: '60vh' }}>
                        {activeTab === 'bookings' && (
                            <div>
                                <h2 className="mb-6 flex items-center gap-3"><Users /> Solicitudes de Reserva</h2>
                                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                                    <div className="flex gap-2">
                                        <button className={`btn-icon ${filterStatus === 'all' ? 'active-filter' : ''}`} onClick={() => setFilterStatus('all')}>Todas</button>
                                        <button className={`btn-icon ${filterStatus === 'pending' ? 'active-filter' : ''}`} onClick={() => setFilterStatus('pending')}>Pendientes</button>
                                        <button className={`btn-icon ${filterStatus === 'confirmed' ? 'active-filter' : ''}`} onClick={() => setFilterStatus('confirmed')}>Confirmadas</button>
                                        <button className={`btn-icon ${filterStatus === 'cancelled' ? 'active-filter' : ''}`} onClick={() => setFilterStatus('cancelled')}>Canceladas</button>
                                    </div>
                                    <div style={{ position: 'relative', width: '300px' }}>
                                        <Search size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} />
                                        <input 
                                            type="text" 
                                            className="input" 
                                            placeholder="Buscar funcionario o email..." 
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            style={{ paddingLeft: '2.5rem', borderRadius: '50px', fontSize: '0.9rem' }}
                                        />
                                    </div>
                                </div>
                                {bookings.filter(b => filterStatus === 'all' || b.status === filterStatus).length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
                                        <Package size={48} style={{ margin: '0 auto 1rem' }} />
                                        <p>No hay solicitudes de reserva para este filtro.</p>
                                    </div>
                                ) : (
                                    <div style={{ overflowX: 'auto' }}>
                                        <table className="admin-table">
                                            <thead>
                                                <tr>
                                                    <th>Fecha Solicitud</th>
                                                    <th>Titular</th>
                                                    <th>Instalación</th>
                                                    <th>Estadía</th>
                                                    <th>Total</th>
                                                    <th>Estado</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {[...bookings]
                                                    .filter(b => (filterStatus === 'all' || b.status === filterStatus) && 
                                                        (b.name.toLowerCase().includes(searchQuery.toLowerCase()) || b.email.toLowerCase().includes(searchQuery.toLowerCase())))
                                                    .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
                                                    .map(b => (
                                                        <tr key={b.id}>
                                                            <td style={{ fontSize: '0.8rem' }}>{b.createdAt ? format(b.createdAt, 'dd MMM', { locale: es }) : 'N/A'}</td>
                                                            <td><strong>{b.name}</strong><br /><span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{b.email}</span></td>
                                                            <td><span className="badge badge-blue">{RESOURCE_LABELS[b.type]}</span></td>
                                                            <td style={{ fontSize: '0.85rem' }}>
                                                                {format(b.startDate, 'dd MMM', { locale: es })} - {format(b.endDate, 'dd MMM', { locale: es })}
                                                            </td>
                                                            <td><strong>${b.totalPrice.toLocaleString('es-CL')}</strong></td>
                                                            <td>
                                                                <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : b.status === 'cancelled' ? 'badge-red' : 'badge-yellow'}`} style={b.status === 'cancelled' ? { backgroundColor: '#fee2e2', color: '#991b1b' } : {}}>
                                                                    {b.status === 'confirmed' ? 'Confirmada' : b.status === 'cancelled' ? 'Cancelada' : 'Pendiente'}
                                                                </span>
                                                            </td>
                                                            <td className="flex gap-2">
                                                                {b.status === 'pending' && (
                                                                    <button onClick={() => confirmBooking(b.id)} className="btn-icon text-success" title="Confirmar"><Check size={18} /></button>
                                                                )}
                                                                {b.status !== 'cancelled' && (
                                                                    <button onClick={() => { if (window.confirm('¿Desea cancelar esta reserva?')) cancelBooking(b.id); }} className="btn-icon text-danger" title="Cancelar"><X size={18} /></button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'blocked' && (
                            <div>
                                <div className="flex justify-between items-center mb-6">
                                    <button onClick={() => setBlockMonth(subMonths(blockMonth, 1))} className="btn-icon"><ChevronLeft size={16} /></button>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'capitalize' }}>{format(blockMonth, 'MMMM yyyy', { locale: es })}</span>
                                    <button onClick={() => setBlockMonth(addMonths(blockMonth, 1))} className="btn-icon"><ChevronRight size={16} /></button>
                                </div>

                                <div className="calendar-grid mb-8" style={{ border: '1px solid #e2e8f0', borderRadius: '1rem', overflow: 'hidden', padding: '1rem', backgroundColor: 'white' }}>
                                    {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map(d => (
                                        <div key={d} className="calendar-day-header" style={{ color: '#94a3b8', fontSize: '0.75rem', paddingBottom: '0.75rem' }}>{d}</div>
                                    ))}
                                    {(() => {
                                        const monthStart = startOfMonth(blockMonth);
                                        const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
                                        const daysInCalendar = 42; // 6 rows
                                        return Array.from({ length: daysInCalendar }).map((_, i) => {
                                            const d = addDays(startDate, i);
                                            const isBlocked = blockedDates.some(bd => bd.toDateString() === d.toDateString());
                                            const isCurrentMonth = isSameMonth(d, blockMonth);
                                            
                                            return (
                                                <div
                                                    key={i}
                                                    onClick={() => {
                                                        console.log("Day clicked:", d.toDateString());
                                                        toggleBlockDate(d);
                                                    }}
                                                    className={`calendar-day ${isBlocked ? 'booked' : ''}`}
                                                    style={{
                                                        height: '65px',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        border: '1px solid #f1f5f9',
                                                        margin: '2px',
                                                        borderRadius: '0.5rem',
                                                        opacity: isCurrentMonth ? 1 : 0.2,
                                                        backgroundColor: isBlocked ? '#fef2f2' : 'white',
                                                        color: isBlocked ? '#ef4444' : 'inherit',
                                                        position: 'relative',
                                                        userSelect: 'none',
                                                        transition: 'all 0.1s ease',
                                                        zIndex: 1
                                                    }}
                                                >
                                                    <span style={{ fontSize: '1rem', fontWeight: 700 }}>{d.getDate()}</span>
                                                    {isBlocked && <span style={{ fontSize: '0.6rem', fontWeight: 800 }}>BLOQUEADO</span>}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>

                                <div className="card bg-blue-50 border-blue-100 p-4 mb-6">
                                    <h4 className="flex items-center gap-2 text-blue-800 text-sm mb-2"><AlertCircle size={16} /> Instrucciones de Bloqueo</h4>
                                    <p className="text-xs text-blue-700 leading-relaxed">
                                        Haz clic en cualquier día del calendario para <strong>Bloquear</strong> (rojo) o <strong>Desbloquear</strong> (blanco). 
                                        Los días bloqueados no permiten nuevas reservas de ningún tipo de instalación.
                                    </p>
                                </div>

                                {blockedDates.length > 0 && (
                                    <div>
                                        <h3 className="text-sm font-bold mb-3">Días Bloqueados Actualmente ({blockedDates.length})</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {[...blockedDates].sort((a,b) => a.getTime() - b.getTime()).map(d => (
                                                <span key={d.toISOString()} className="badge badge-red" style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    {format(d, "d 'de' MMMM", { locale: es })}
                                                    <X size={12} style={{ cursor: 'pointer' }} onClick={() => toggleBlockDate(d)} />
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div style={{ maxWidth: '600px' }}>
                                <h2 className="mb-6 flex items-center gap-3"><SettingsIcon /> Parámetros y Cupos</h2>
                                <div className="flex flex-col gap-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="label">Cupos – Sitio Picnic / Día</label>
                                            <input type="number" className="input" value={maxSitePicnic} onChange={e => setMaxSitePicnic(parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="label">Cupos – Sitio Camping / Día</label>
                                            <input type="number" className="input" value={maxSiteCamping} onChange={e => setMaxSiteCamping(parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="label">Cupos – Cabañas 3 pers. / Día</label>
                                            <input type="number" className="input" value={maxCabin4} onChange={e => setMaxCabin4(parseInt(e.target.value))} />
                                        </div>
                                        <div>
                                            <label className="label">Cupos – Cabañas 5 pers. / Día</label>
                                            <input type="number" className="input" value={maxCabin6} onChange={e => setMaxCabin6(parseInt(e.target.value))} />
                                        </div>
                                    </div>
                                    <div style={{ backgroundColor: '#f0fdf4', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #bbf7d0', marginTop: '1rem' }}>
                                        <p style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, margin: 0 }}>
                                            ⚠️ Estos cambios se aplican globalmente y afectan la disponibilidad en tiempo real para todos los funcionarios.
                                        </p>
                                    </div>
                                    <button className="btn btn-secondary mt-2 py-4 rounded-xl font-bold text-lg" onClick={handleSaveSettings}>
                                        Guardar Parámetros de Recinto
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .admin-nav-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem 1.25rem;
                    border-radius: 0.75rem;
                    border: none;
                    background: none;
                    color: #64748b;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: left;
                }
                .admin-nav-item:hover {
                    background-color: #f1f5f9;
                    color: var(--c-primary);
                }
                .admin-nav-item.active {
                    background-color: var(--c-primary);
                    color: white;
                }
                .active-filter {
                    background-color: var(--c-primary) !important;
                    color: white !important;
                    border-color: var(--c-primary) !important;
                }
                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.9rem;
                }
                .admin-table th {
                    text-align: left;
                    padding: 1rem;
                    border-bottom: 2px solid #f1f5f9;
                    color: #64748b;
                }
                .admin-table td {
                    padding: 1rem;
                    border-bottom: 1px solid #f1f5f9;
                }
                .text-success { color: #10b981; }
                .text-danger { color: #ef4444; }
            `}</style>
        </div>
    );
};

export default Admin;

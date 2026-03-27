import { useState } from 'react';
import { useData, RESOURCE_LABELS } from '../context/DataContext';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Users, Calendar, Settings as SettingsIcon, Package, Check, X, ShieldCheck, Lock, LogIn } from 'lucide-react';

const Admin = () => {
    const { bookings, settings, updateSettings, confirmBooking, cancelBooking, toggleBlockDate, blockedDates } = useData();
    const [activeTab, setActiveTab] = useState<'bookings' | 'settings' | 'blocked'>('bookings');
    
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
        // Predefined admin password
        if (password === 'uctadmin2026') {
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
                            <LogIn size={20}/> Entrar al Panel
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
                    <button onClick={handleLogout} className="btn btn-outline" style={{ borderColor: 'var(--c-primary)', color: 'var(--c-primary)', borderRadius: '50px', padding: '0.6rem 1.5rem', fontSize: '0.9rem', fontWeight: 700 }}>
                        Cerrar Sesión
                    </button>
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
                                {bookings.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '4rem 0', opacity: 0.5 }}>
                                        <Package size={48} style={{ margin: '0 auto 1rem' }} />
                                        <p>No hay solicitudes de reserva registradas.</p>
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
                                                {[...bookings].reverse().map(b => (
                                                    <tr key={b.id}>
                                                        <td style={{ fontSize: '0.8rem' }}>Hoy</td>
                                                        <td><strong>{b.name}</strong><br/><span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{b.email}</span></td>
                                                        <td><span className="badge badge-blue">{RESOURCE_LABELS[b.type]}</span></td>
                                                        <td style={{ fontSize: '0.85rem' }}>
                                                            {format(b.startDate, 'dd MMM', { locale: es })} - {format(b.endDate, 'dd MMM', { locale: es })}
                                                        </td>
                                                        <td><strong>${b.totalPrice.toLocaleString('es-CL')}</strong></td>
                                                        <td>
                                                            <span className={`badge ${b.status === 'confirmed' ? 'badge-green' : 'badge-yellow'}`}>
                                                                {b.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
                                                            </span>
                                                        </td>
                                                        <td className="flex gap-2">
                                                            {b.status === 'pending' && (
                                                                <button onClick={() => confirmBooking(b.id)} className="btn-icon text-success" title="Confirmar"><Check size={18}/></button>
                                                            )}
                                                            <button onClick={() => cancelBooking(b.id)} className="btn-icon text-danger" title="Eliminar"><X size={18}/></button>
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
                                <h2 className="mb-6 flex items-center gap-3"><Calendar /> Bloqueo de Recinto</h2>
                                <p className="text-light mb-6">Bloquee fechas específicas para mantenimiento o cierre total del recinto (No se podrán hacer reservas en estos días).</p>
                                <div className="grid grid-cols-4 gap-4">
                                    {/* Mocking a simple month view logic for blocking */}
                                    {[...Array(30)].map((_, i) => {
                                        const d = new Date(2026, 3, i + 1); // Abril 2026 example
                                        const isBlocked = blockedDates.some(bd => bd.toDateString() === d.toDateString());
                                        return (
                                            <div 
                                                key={i} 
                                                onClick={() => toggleBlockDate(d)}
                                                style={{
                                                    padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--c-border)',
                                                    textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s',
                                                    backgroundColor: isBlocked ? '#fee2e2' : 'white',
                                                    color: isBlocked ? '#ef4444' : 'inherit',
                                                    borderColor: isBlocked ? '#ef4444' : 'var(--c-border)'
                                                }}
                                            >
                                                <div style={{ fontSize: '0.75rem', opacity: 0.6 }}>Abril</div>
                                                <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>{i + 1}</div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: 700 }}>{isBlocked ? 'BLOQUEADO' : 'LIBRE'}</div>
                                            </div>
                                        );
                                    })}
                                </div>
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

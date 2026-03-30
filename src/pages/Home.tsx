import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, AlertTriangle, Sun, Snowflake, FileText, BadgePercent, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100%', overflowX: 'hidden' }}>
            {/* ── HERO ── */}
            <section style={{
                position: 'relative', 
                height: '82vh',
                display: 'flex', 
                alignItems: 'flex-start', 
                justifyContent: 'center',
                overflow: 'hidden', 
                color: 'white',
                paddingTop: '18vh'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
                }}>
                    <iframe
                        src="https://www.youtube.com/embed/AKZD7162QcE?autoplay=1&mute=1&loop=1&playlist=AKZD7162QcE&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widget_indicator=0"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100vw',
                            height: '56.25vw', 
                            minHeight: '100vh',
                            minWidth: '177.77vh', 
                            transform: 'translate(-50%, -50%)',
                            objectFit: 'cover',
                        }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                        title="Background Video"
                    />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,40,25,0.6) 0%, rgba(10,40,25,0.75) 100%)', zIndex: 1 }} />
                
                {/* Restaurada clase 'container' para PC */}
                <div className="container text-center px-4" style={{ zIndex: 10, position: 'relative' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 8vw, 3.8rem)', color: 'white', marginBottom: '1rem', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                        Centro Recreacional UCT
                    </h1>
                    <p style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', maxWidth: '620px', margin: '0 auto 2.5rem', opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
                        Cabañas, sitios de camping y picnic a orillas del Río Cautín en Curacautín.<br className="hidden md:block" />
                        <strong>Exclusivo para funcionarios UCT y su grupo familiar.</strong>
                    </p>
                    {/* Botones responsivos */}
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button 
                            onClick={() => navigate('/reservar')}
                            className="btn btn-secondary" 
                            style={{ 
                                padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', 
                                boxShadow: '0 4px 15px rgba(26,91,156,0.4)', cursor: 'pointer',
                                border: 'none', fontWeight: 600
                            }}
                        >
                            Reservar Ahora
                        </button>
                        <a href="#tarifas" className="btn btn-outline" style={{
                            color: 'white', borderColor: 'rgba(255,255,255,0.7)', padding: '1rem 2.5rem',
                            fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.1)',
                            backdropFilter: 'blur(5px)', borderRadius: '50px', textDecoration: 'none'
                        }}>
                            Ver Tarifas
                        </a>
                    </div>
                </div>
            </section>

            {/* ── INSTALACIONES ── */}
            {/* Restaurada clase 'container' */}
            <section className="container mx-auto" style={{ padding: '5rem 1.5rem' }}>
                <h2 className="text-center" style={{ fontSize: 'clamp(1.8rem, 5vw, 2.2rem)', marginBottom: '0.5rem' }}>
                    Nuestras Instalaciones
                </h2>
                <p className="text-center text-light" style={{ marginBottom: '3.5rem', fontSize: '1.05rem' }}>
                    Tres tipos de alojamiento rodeados de naturaleza.
                </p>

                {/* GRID Responsivo recuperado */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginBottom: '2.5rem' }}>
                    {/* Camping */}
                    <div className="card flex flex-col overflow-hidden">
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "camping_graphic.jpg"} alt="Sitio de Camping" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span className="badge badge-green" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Camping / Picnic</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1 }}>
                            <h3>Sitio de Camping / Picnic</h3>
                            <p className="text-light" style={{ fontSize: '0.95rem', margin: '1rem 0' }}>Áreas verdes, quinchos, mesas y servicios higiénicos.</p>
                            {/* Restaurada clase 'price-duo' */}
                            <div className="price-duo flex flex-wrap gap-2">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB $15.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA $20.000</div>
                            </div>
                        </div>
                    </div>

                    {/* Cabaña 3p */}
                    <div className="card flex flex-col overflow-hidden">
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "cabana_graphic.jpg"} alt="Cabaña 3p" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span className="badge badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Máx. 3 pers.</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1 }}>
                            <h3>Cabaña (3 personas)</h3>
                            <p className="text-light" style={{ fontSize: '0.95rem', margin: '1rem 0' }}>Equipada con cocina y baño privado. Ideal para grupos pequeños.</p>
                            <div className="price-duo flex flex-wrap gap-2">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB $30.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA $45.000</div>
                            </div>
                        </div>
                    </div>

                    {/* Cabaña 5p */}
                    <div className="card flex flex-col overflow-hidden">
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "cabana_graphic.jpg"} alt="Cabaña 5p" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span className="badge badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Máx. 5 pers.</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1 }}>
                            <h3>Cabaña Familiar (5 personas)</h3>
                            <p className="text-light" style={{ fontSize: '0.95rem', margin: '1rem 0' }}>Nuestra cabaña más amplia y cómoda para la familia.</p>
                            <div className="price-duo flex flex-wrap gap-2">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB $40.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA $60.000</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── TARIFAS ── */}
            <section id="tarifas" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #0f2921 0%, #1a4a3a 60%, #123f33 100%)' }}>
                <div className="container mx-auto px-4">
                    <h2 className="text-center" style={{ fontSize: '2.2rem', color: 'white', marginBottom: '2.5rem' }}>Tarifas Oficiales 2026</h2>
                    {/* Scroll lateral solo en móvil recuperado */}
                    <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem' }}>
                        <table className="tariff-table" style={{ minWidth: '700px', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Servicio</th>
                                    <th><div className="flex items-center justify-center gap-2"><Snowflake size={16}/>TB</div></th>
                                    <th><div className="flex items-center justify-center gap-2"><Sun size={16}/>TA</div></th>
                                    <th style={{ textAlign: 'left' }}>Incluye</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Sitio Picnic</strong></td>
                                    <td className="text-center">$15.000</td>
                                    <td className="text-center">$20.000</td>
                                    <td>Áreas verdes, quinchos, acceso piscina</td>
                                </tr>
                                {/* Resto de la tabla igual... */}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Restaurada sección de iconos de Tarifas */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                            <Sun size={28} color="#e5922d" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, color: '#e5922d' }}>Temporada Alta</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                            <Snowflake size={28} color="#60a5fa" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, color: '#60a5fa' }}>Temporada Baja</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center' }}>
                            <BadgePercent size={28} color="#4ade80" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, color: '#4ade80' }}>Descto. Funcionarios</div>
                        </div>
                    </div>

                    {/* Restaurados botones finales */}
                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
                        <button onClick={() => navigate('/reservar')} className="btn btn-secondary" style={{ padding: '0.9rem 2.5rem', borderRadius: '50px', display: 'inline-flex', alignItems: 'center', gap: '0.8rem', fontWeight: 600 }}>
                            <ArrowRight size={20} /> Ir a Reservar
                        </button>
                        <a href={import.meta.env.BASE_URL + "reglamento.pdf"} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.9rem 2.5rem', borderRadius: '50px', color: 'white', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FileText size={20} /> Reglamento PDF
                        </a>
                    </div>
                </div>
            </section>

            {/* ── NORMATIVAS ── */}
            <section id="normativas" style={{ backgroundColor: 'var(--c-primary)', color: 'white', padding: '4rem 0' }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-10">
                        <ShieldCheck size={40} color="var(--c-secondary)" style={{ marginBottom: '0.75rem' }} />
                        <h2 className="text-center" style={{ fontSize: '2rem' }}>Normas de Convivencia</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', color: 'white' }}>
                            <h3 style={{ color: 'var(--c-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={18} /> Uso y Horarios
                            </h3>
                            <ul className="rules-list space-y-2 opacity-90 text-sm">
                                <li>• Acceso recinto: 09:00 – 20:30 hrs.</li>
                                <li>• Check-in cabañas 15:00. Check-out 10:30 AM.</li>
                            </ul>
                        </div>
                        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', color: 'white' }}>
                            <h3 style={{ color: 'var(--c-secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertTriangle size={18} /> Restricciones
                            </h3>
                            <ul className="rules-list space-y-2 opacity-90 text-sm">
                                <li>• Uso exclusivo para titular y familia directa.</li>
                                <li>• Prohibido ingreso de mascotas.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

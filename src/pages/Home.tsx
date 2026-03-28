import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, AlertTriangle, Sun, Snowflake, FileText, BadgePercent, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div>
            {/* ── HERO ── */}
            <section style={{
                position: 'relative', height: '82vh',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                overflow: 'hidden', color: 'white',
                paddingTop: '18vh' // Moved UP as requested
            }}>
                <div style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
                }}>
                    <iframe
                        src="https://www.youtube.com/embed/eFfDKI8nyt4?autoplay=1&mute=1&loop=1&playlist=eFfDKI8nyt4&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1"
                        style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100vw',
                            height: '56.25vw', // 16:9 ratio
                            minHeight: '100vh',
                            minWidth: '177.77vh', // 16:9 ratio
                            transform: 'translate(-50%, -50%)',
                        }}
                        frameBorder="0"
                        allow="autoplay; encrypted-media"
                    />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,40,25,0.6) 0%, rgba(10,40,25,0.75) 100%)', zIndex: 1 }} />
                <div className="container text-center" style={{ zIndex: 10, position: 'relative' }}>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'white', marginBottom: '1rem', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                        Centro Recreacional UCT
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '620px', margin: '0 auto 2.5rem', opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
                        Cabañas, sitios de camping y picnic a orillas del Río Cautín en Curacautín.<br />
                        <strong>Exclusivo para funcionarios UCT y su grupo familiar.</strong>
                    </p>
                    <div className="flex justify-center gap-4">
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
            <section className="container" style={{ padding: '5rem 1.5rem' }}>
                <h2 className="text-center" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>
                    Nuestras Instalaciones
                </h2>
                <p className="text-center text-light" style={{ marginBottom: '3.5rem', fontSize: '1.05rem' }}>
                    Tres tipos de alojamiento rodeados de naturaleza. Todos incluyen acceso a la piscina del recinto.
                </p>

                <div className="grid grid-cols-3 gap-8" style={{ marginBottom: '2.5rem' }}>
                    {/* Sitio de Camping / Picnic */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "camping_graphic.jpg"} alt="Sitio de Camping o Picnic" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
                            <span className="badge badge-green" style={{ position: 'absolute', top: '1rem', right: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>Uso por el día / Camping</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Sitio de Camping / Picnic</h3>
                            <p className="text-light" style={{ marginBottom: '1.25rem', flex: 1, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Áreas verdes, quinchos, mesas y servicios higiénicos. El sitio camping incluye derecho a pernoctar con carpa.
                            </p>
                            <div className="price-duo">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB desde $15.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA desde $20.000</div>
                            </div>
                        </div>
                    </div>

                    {/* Cabaña 3 pax */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "cabana_graphic.jpg"} alt="Cabaña para 3 personas" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
                            <span className="badge badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>Máx. 3 pers.</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Cabaña (3 personas)</h3>
                            <p className="text-light" style={{ marginBottom: '1.25rem', flex: 1, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Diseño integrado al paisaje nativo. Equipada con camas, cocina y baño privado. deal para grupos pequeños.
                            </p>
                            <div className="price-duo">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB $30.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA $45.000</div>
                            </div>
                        </div>
                    </div>

                    {/* Cabaña Familiar 5 pax */}
                    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "cabana_graphic.jpg"} alt="Cabaña familiar para 5 personas" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')} />
                            <span className="badge badge-blue" style={{ position: 'absolute', top: '1rem', right: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>Máx. 5 pers.</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <h3 style={{ marginBottom: '0.5rem' }}>Cabaña Familiar (5 personas)</h3>
                            <p className="text-light" style={{ marginBottom: '1.25rem', flex: 1, fontSize: '0.95rem', lineHeight: 1.6 }}>
                                Nuestra cabaña más amplia y cómoda. Perfecta para el grupo familiar con toda la comodidad del hogar.
                            </p>
                            <div className="price-duo">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB $40.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA $60.000</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Piscina Banner */}
                <div style={{
                    borderRadius: '1rem', overflow: 'hidden', position: 'relative', height: '320px',
                    boxShadow: 'var(--shadow-xl)'
                }}>
                    <img src={import.meta.env.BASE_URL + "piscina_real.jpg"} alt="Piscina del Centro Recreacional" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to right, rgba(10,40,55,0.7) 0%, rgba(10,40,55,0.2) 60%, transparent 100%)',
                        display: 'flex', alignItems: 'center', padding: '3rem'
                    }}>
                        <div>
                            <span className="badge badge-green" style={{ marginBottom: '1rem', display: 'inline-flex' }}>✓ Incluido en todas las reservas</span>
                            <h3 style={{ color: 'white', fontSize: '2.5rem', marginBottom: '0.5rem', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Piscina Exclusiva</h3>
                            <p style={{ color: 'rgba(255,255,255,0.95)', maxWidth: '420px', fontSize: '1.1rem', lineHeight: 1.5 }}>
                                Disfruta de un entorno único con acceso gratuito a nuestra piscina para todos los funcionarios y su familia.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAPA ── */}
            <section style={{ padding: '0 0 5rem 0', backgroundColor: '#f3f6f8' }}>
                <div className="container flex flex-col items-center" style={{ paddingTop: '5rem' }}>
                    <h2 className="text-center" style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--c-primary)' }}>
                        Ubicación del Recinto
                    </h2>
                    <p className="text-center text-light" style={{ maxWidth: '600px', marginBottom: '2rem', fontSize: '1rem' }}>
                        Ven a disfrutar de la tranquilidad a orillas del Río Cautín en Curacautín.
                    </p>
                    <div style={{ width: '100%', maxWidth: '900px', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '4px solid white', marginBottom: '2rem' }}>
                        <img src={import.meta.env.BASE_URL + "MAPA DETALLE CURACAUTIN 01.jpg"} alt="Mapa del Centro Recreacional" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <a href="https://maps.app.goo.gl/z2ShfYeo88rcqCgc7" target="_blank" rel="noreferrer"
                        className="btn btn-primary"
                        style={{ padding: '0.85rem 2.5rem', fontSize: '1.1rem', backgroundColor: '#1a5b9c', borderRadius: '50px', boxShadow: '0 4px 10px rgba(0,0,0,0.2)', textDecoration: 'none' }}>
                        📍 Ver en Google Maps
                    </a>
                </div>
            </section>

            {/* ── TARIFAS ── */}
            <section id="tarifas" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #0f2921 0%, #1a4a3a 60%, #123f33 100%)' }}>
                <div className="container">
                    <div className="flex flex-col items-center" style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.2rem', color: 'white', marginBottom: '0.5rem' }}>Tarifas Oficiales 2026</h2>
                        <p style={{ opacity: 0.75, color: 'white', textAlign: 'center', maxWidth: '560px', fontSize: '0.95rem' }}>
                            Precios aprobados por el Reglamento de Administración y Uso del Recinto.
                        </p>
                    </div>

                    <div style={{ overflowX: 'auto', marginBottom: '2.5rem' }}>
                        <table className="tariff-table">
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Servicio</th>
                                    <th><div className="flex items-center justify-center gap-2"><Snowflake size={16}/>Temporada Baja</div></th>
                                    <th><div className="flex items-center justify-center gap-2"><Sun size={16}/>Temporada Alta</div></th>
                                    <th style={{ textAlign: 'left' }}>Incluye</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Sitio Picnic</strong></td>
                                    <td className="text-center"><span className="price-cell-low">$15.000</span></td>
                                    <td className="text-center"><span className="price-cell-high">$20.000</span></td>
                                    <td style={{ fontSize: '0.88rem' }}>Áreas verdes, quinchos, acceso piscina</td>
                                </tr>
                                <tr>
                                    <td><strong>Sitio Camping</strong> <span style={{ fontSize: '0.82rem', opacity: 0.65 }}>(máx. 6 pers.)</span></td>
                                    <td className="text-center"><span className="price-cell-low">$20.000</span></td>
                                    <td className="text-center"><span className="price-cell-high">$30.000</span></td>
                                    <td style={{ fontSize: '0.88rem' }}>Derecho a carpa y pernoctar, servicios higiénicos</td>
                                </tr>
                                <tr>
                                    <td><strong>Cabaña (3 personas)</strong></td>
                                    <td className="text-center"><span className="price-cell-low">$30.000</span></td>
                                    <td className="text-center"><span className="price-cell-high">$45.000</span></td>
                                    <td style={{ fontSize: '0.88rem' }}>Cabaña equipada, cocina, baño, mayor confort</td>
                                </tr>
                                <tr>
                                    <td><strong>Cabaña Familiar (5 personas)</strong></td>
                                    <td className="text-center"><span className="price-cell-low">$40.000</span></td>
                                    <td className="text-center"><span className="price-cell-high">$60.000</span></td>
                                    <td style={{ fontSize: '0.88rem' }}>Cabaña amplia ideal para el grupo familiar</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-3 gap-6" style={{ marginBottom: '2.5rem' }}>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <Sun size={28} color="#e5922d" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, color: '#e5922d', marginBottom: '0.25rem' }}>Temporada Alta</div>
                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Verano, Vacaciones Invierno y Feriados Chile</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <Snowflake size={28} color="#60a5fa" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, color: '#60a5fa', marginBottom: '0.25rem' }}>Temporada Baja</div>
                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Resto del año · Tarifas base liberadas</div>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
                            <BadgePercent size={28} color="#4ade80" style={{ marginBottom: '0.5rem' }} />
                            <div style={{ fontWeight: 700, color: '#4ade80', marginBottom: '0.25rem' }}>Descto. Funcionarios</div>
                            <div style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem' }}>Hasta 20% adicional según tramo sueldo base</div>
                        </div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <button 
                            onClick={() => navigate('/reservar')}
                            className="btn btn-secondary" 
                            style={{ 
                                padding: '0.9rem 2.5rem', borderRadius: '50px', fontSize: '1.05rem', 
                                display: 'inline-flex', alignItems: 'center', gap: '0.8rem', 
                                boxShadow: '0 4px 15px rgba(26,91,156,0.4)', border: 'none', cursor: 'pointer',
                                fontWeight: 600
                            }}
                        >
                            <ArrowRight size={20} /> Ir a Reservar
                        </button>
                        <a href={import.meta.env.BASE_URL + "reglamento_centro_recreacional.pdf"} target="_blank" rel="noreferrer" className="btn" style={{
                            padding: '0.9rem 2.5rem', borderRadius: '50px', fontSize: '1.05rem',
                            background: 'rgba(255,255,255,0.1)', color: 'white',
                            border: '1px solid rgba(255,255,255,0.25)', display: 'inline-flex',
                            alignItems: 'center', gap: '0.5rem', backdropFilter: 'blur(5px)', textDecoration: 'none'
                        }}>
                            <FileText size={20} /> Reglamento PDF
                        </a>
                    </div>
                </div>
            </section>

            {/* ── NORMATIVAS ── */}
            <section id="normativas" style={{ backgroundColor: 'var(--c-primary)', color: 'white', padding: '4rem 0' }}>
                <div className="container">
                    <div className="flex flex-col items-center" style={{ marginBottom: '2.5rem' }}>
                        <ShieldCheck size={40} color="var(--c-secondary)" style={{ marginBottom: '0.75rem' }} />
                        <h2 style={{ fontSize: '2rem', color: 'white' }}>Normas de Convivencia</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ color: 'var(--c-secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={18} /> Uso y Horarios
                                </h3>
                                <ul className="rules-list">
                                    <li><span className="rules-list-icon">▪</span><div>Acceso recinto: <strong>09:00 – 20:30 hrs</strong>. Check-in cabañas 15:00.</div></li>
                                    <li><span className="rules-list-icon">▪</span><div>Reservar con <strong>antelación mínima de 48 hrs</strong>.</div></li>
                                    <li><span className="rules-list-icon">▪</span><div>Máximo <strong>2 reservas mensuales</strong> por titular.</div></li>
                                    <li><span className="rules-list-icon">▪</span><div>Entregas de llaves cabañas: <strong>10:30 de la mañana</strong>.</div></li>
                                </ul>
                            </div>
                        </div>
                        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                            <div style={{ padding: '2rem' }}>
                                <h3 style={{ color: 'var(--c-secondary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <AlertTriangle size={18} /> Restricciones
                                </h3>
                                <ul className="rules-list">
                                    <li><span className="rules-list-icon">▪</span><div>Uso exclusivo para <strong>titular y familia directa</strong>.</div></li>
                                    <li><span className="rules-list-icon">▪</span><div>Prohibido ingreso de <strong>mascotas</strong> de cualquier tipo.</div></li>
                                    <li><span className="rules-list-icon">▪</span><div>Resguardar el <strong>silencio</strong> y ambiente del recinto.</div></li>
                                    <li><span className="rules-list-icon">▪</span><div>Cuidado de infraestructura y retiro de basuras personales.</div></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

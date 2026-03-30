import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock, AlertTriangle, Sun, Snowflake, FileText, BadgePercent, ArrowRight } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{ width: '100%', overflowX: 'hidden' }}>
            {/* ── HERO ── */}
            <section style={{
                position: 'relative', height: '82vh',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                overflow: 'hidden', color: 'white',
                paddingTop: '18vh'
            }}>
                <div style={{
                    position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', overflow: 'hidden'
                }}>
                    <iframe
                        src="https://www.youtube.com/embed/AKZD7162QcE?autoplay=1&mute=1&loop=1&playlist=AKZD7162QcE&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&enablejsapi=1&widget_indicator=0"
                        style={{
                            position: 'absolute', top: '50%', left: '50%',
                            width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh',
                            transform: 'translate(-50%, -50%)', objectFit: 'cover',
                        }}
                        frameBorder="0" allow="autoplay; encrypted-media" title="Background Video"
                    />
                </div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,40,25,0.6) 0%, rgba(10,40,25,0.75) 100%)', zIndex: 1 }} />
                <div className="container text-center" style={{ zIndex: 10, position: 'relative', padding: '0 1rem' }}>
                    <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', color: 'white', marginBottom: '1rem', lineHeight: 1.2, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                        Centro Recreacional UCT
                    </h1>
                    <p style={{ fontSize: '1.25rem', maxWidth: '620px', margin: '0 auto 2.5rem', opacity: 0.9, fontWeight: 400, lineHeight: 1.6 }}>
                        Cabañas, sitios de camping y picnic a orillas del Río Cautín en Curacautín.<br className="hidden md:block" />
                        <strong>Exclusivo para funcionarios UCT y su grupo familiar.</strong>
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button onClick={() => navigate('/reservar')} className="btn btn-secondary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '50px', cursor: 'pointer', border: 'none', fontWeight: 600 }}>
                            Reservar Ahora
                        </button>
                        <a href="#tarifas" className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.7)', padding: '1rem 2.5rem', fontSize: '1.1rem', backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(5px)', borderRadius: '50px', textDecoration: 'none' }}>
                            Ver Tarifas
                        </a>
                    </div>
                </div>
            </section>

            {/* ── INSTALACIONES ── */}
            <section className="container mx-auto" style={{ padding: '5rem 1.5rem' }}>
                <h2 className="text-center" style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Nuestras Instalaciones</h2>
                <p className="text-center text-light" style={{ marginBottom: '3.5rem', fontSize: '1.05rem' }}>
                    Tres tipos de alojamiento rodeados de naturaleza. Todos incluyen acceso a la piscina del recinto.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8" style={{ marginBottom: '2.5rem' }}>
                    {/* Camping */}
                    <div className="card flex flex-col overflow-hidden">
                        <div style={{ position: 'relative', overflow: 'hidden', height: '240px' }}>
                            <img src={import.meta.env.BASE_URL + "camping_graphic.jpg"} alt="Camping" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <span className="badge badge-green" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>Uso por el día / Camping</span>
                        </div>
                        <div style={{ padding: '1.75rem', flex: 1 }}>
                            <h3>Sitio de Camping / Picnic</h3>
                            <p className="text-light" style={{ margin: '1rem 0' }}>Áreas verdes, quinchos, mesas y servicios higiénicos.</p>
                            <div className="price-duo flex flex-wrap gap-2">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB desde $15.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA desde $20.000</div>
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
                            <p className="text-light" style={{ margin: '1rem 0' }}>Diseño integrado al paisaje nativo. Cocina y baño privado.</p>
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
                            <p className="text-light" style={{ margin: '1rem 0' }}>Nuestra cabaña más amplia y cómoda para el grupo familiar.</p>
                            <div className="price-duo flex flex-wrap gap-2">
                                <div className="price-tag price-low"><Snowflake size={13} /> TB $40.000</div>
                                <div className="price-tag price-high"><Sun size={13} /> TA $60.000</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Piscina Banner Responsivo */}
                <div style={{ borderRadius: '1rem', overflow: 'hidden', position: 'relative', minHeight: '320px', boxShadow: 'var(--shadow-xl)' }}>
                    <img src={import.meta.env.BASE_URL + "piscina_real.jpg"} alt="Piscina" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,40,55,0.8), transparent)', display: 'flex', alignItems: 'center', padding: '2rem' }}>
                        <div style={{ maxWidth: '450px', color: 'white' }}>
                            <span className="badge badge-green" style={{ marginBottom: '1rem', display: 'inline-block' }}>✓ Incluido</span>
                            <h3 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Piscina Exclusiva</h3>
                            <p>Acceso gratuito para todos los funcionarios y su familia.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── MAPA ── */}
            <section style={{ padding: '5rem 0', backgroundColor: '#f3f6f8' }}>
                <div className="container mx-auto px-4 flex flex-col items-center">
                    <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--c-primary)' }}>Ubicación del Recinto</h2>
                    <div style={{ width: '100%', maxWidth: '900px', borderRadius: '1rem', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', border: '4px solid white', marginBottom: '2rem' }}>
                        <img src={import.meta.env.BASE_URL + "MAPA DETALLE CURACAUTIN 01.jpg"} alt="Mapa" style={{ width: '100%', height: 'auto', display: 'block' }} />
                    </div>
                    <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-primary" style={{ padding: '0.85rem 2.5rem', backgroundColor: '#1a5b9c', borderRadius: '50px', color: 'white', textDecoration: 'none' }}>📍 Ver en Google Maps</a>
                </div>
            </section>

            {/* ── TARIFAS ── */}
            <section id="tarifas" style={{ padding: '5rem 0', background: 'linear-gradient(135deg, #0f2921 0%, #1a4a3a 60%, #123f33 100%)' }}>
                <div className="container mx-auto px-4">
                    <h2 className="text-center text-white mb-10" style={{ fontSize: '2.2rem' }}>Tarifas Oficiales 2026</h2>
                    <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: '1rem', marginBottom: '3rem' }}>
                        <table className="tariff-table" style={{ minWidth: '750px', width: '100%' }}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Servicio</th>
                                    <th>Temporada Baja</th>
                                    <th>Temporada Alta</th>
                                    <th style={{ textAlign: 'left' }}>Incluye</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td><strong>Sitio Picnic</strong></td><td className="text-center">$15.000</td><td className="text-center">$20.000</td><td>Áreas verdes, quinchos, piscina</td></tr>
                                <tr><td><strong>Sitio Camping</strong></td><td className="text-center">$20.000</td><td className="text-center">$30.000</td><td>Derecho a carpa y pernoctar</td></tr>
                                <tr><td><strong>Cabaña (3 pers)</strong></td><td className="text-center">$30.000</td><td className="text-center">$45.000</td><td>Equipada, cocina, baño</td></tr>
                                <tr><td><strong>Cabaña (5 pers)</strong></td><td className="text-center">$40.000</td><td className="text-center">$60.000</td><td>Familiar amplia</td></tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
                            <Sun size={28} color="#e5922d" className="mx-auto mb-2" />
                            <div style={{ fontWeight: 700, color: '#e5922d' }}>Temporada Alta</div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Verano y Feriados</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
                            <Snowflake size={28} color="#60a5fa" className="mx-auto mb-2" />
                            <div style={{ fontWeight: 700, color: '#60a5fa' }}>Temporada Baja</div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Resto del año</p>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.5rem', textAlign: 'center', color: 'white' }}>
                            <BadgePercent size={28} color="#4ade80" className="mx-auto mb-2" />
                            <div style={{ fontWeight: 700, color: '#4ade80' }}>Dcto. Funcionarios</div>
                            <p style={{ fontSize: '0.85rem', opacity: 0.7 }}>Según tramo sueldo base</p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
                        <button onClick={() => navigate('/reservar')} className="btn btn-secondary" style={{ padding: '0.9rem 2.5rem', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '0.8rem', fontWeight: 600 }}>
                            <ArrowRight size={20} /> Ir a Reservar
                        </button>
                        <a href={import.meta.env.BASE_URL + "reglamento.pdf"} target="_blank" rel="noreferrer" className="btn btn-outline" style={{ padding: '0.9rem 2.5rem', borderRadius: '50px', color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid white' }}>
                            <FileText size={20} /> Reglamento PDF
                        </a>
                    </div>
                </div>
            </section>

            {/* ── NORMATIVAS ── */}
            <section id="normativas" style={{ backgroundColor: 'var(--c-primary)', color: 'white', padding: '4rem 0' }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col items-center mb-10 text-center">
                        <ShieldCheck size={40} color="var(--c-secondary)" className="mb-2" />
                        <h2 style={{ fontSize: '2rem' }}>Normas de Convivencia</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', color: 'white' }}>
                            <h3 className="flex items-center gap-2" style={{ color: 'var(--c-secondary)', marginBottom: '1rem' }}><Clock size={18} /> Uso y Horarios</h3>
                            <ul style={{ opacity: 0.9, fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
                                <li>• Acceso recinto: 09:00 – 20:30 hrs.</li>
                                <li>• Check-in cabañas 15:00. Check-out 10:30 AM.</li>
                            </ul>
                        </div>
                        <div className="card" style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '2rem', color: 'white' }}>
                            <h3 className="flex items-center gap-2" style={{ color: 'var(--c-secondary)', marginBottom: '1rem' }}><AlertTriangle size={18} /> Restricciones</h3>
                            <ul style={{ opacity: 0.9, fontSize: '0.9rem', listStyle: 'none', padding: 0 }}>
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

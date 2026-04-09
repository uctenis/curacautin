import { Mail } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'var(--c-primary)', color: 'white', padding: '4rem 0 2rem', marginTop: 'auto' }}>
            <div className="container grid grid-cols-2 gap-8" style={{ paddingBottom: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div>
                    <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>Reservas UCT</h3>
                    <p style={{ opacity: 0.8, maxWidth: '400px', marginBottom: '2rem' }}>
                        Tu espacio de descanso y conexión con la naturaleza. Sitios de camping equipados y cabañas acogedoras para disfrutar en familia.
                    </p>
                </div>
                    <div className="flex flex-col gap-4">
                        <h4 style={{ color: 'var(--c-secondary)' }}>Contacto e Información</h4>
                        <a 
                            href="https://wa.me/56452205415" 
                            target="_blank" 
                            rel="noreferrer" 
                            className="flex items-center gap-2 text-light" 
                            style={{ opacity: 0.9, textDecoration: 'none', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#25D366' }}>
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-7.6 8.38 8.38 0 0 1 3.8.9L22 4l-1.5 6.5z"></path>
                                <path d="M10.5 12h.01"></path>
                                <path d="M12.5 14h.01"></path>
                                <path d="M8.5 14h.01"></path>
                            </svg>
                            <span style={{ color: 'white' }}>+56 45 2205415 (WhatsApp)</span>
                        </a>
                        <a 
                            href="mailto:reservas@uct.cl?subject=Consulta%20Reserva%20Centro%20Recreacional%20UCT" 
                            className="flex items-center gap-2 text-light" 
                            style={{ opacity: 0.9, textDecoration: 'none', transition: 'transform 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'translateX(5px)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'translateX(0)'}
                        >
                            <Mail size={18} color="var(--c-secondary)" />
                            <span style={{ color: 'white' }}>reservas@uct.cl</span>
                        </a>
                        <p style={{ opacity: 0.7, fontSize: '0.9rem', marginTop: '1rem' }}>
                            Horario de respuestas: 8:30 hrs a 17:30 hrs (Días hábiles)
                        </p>
                    </div>
            </div>
            <div className="container text-center" style={{ paddingTop: '2rem', opacity: 0.6, fontSize: '0.9rem' }}>
                &copy; {new Date().getFullYear()} Universidad Católica de Temuco. Todos los derechos reservados.
            </div>
        </footer>
    );
};

export default Footer;

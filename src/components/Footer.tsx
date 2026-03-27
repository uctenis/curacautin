import { Phone, Mail } from 'lucide-react';

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
                    <div className="flex items-center gap-2 text-light" style={{ opacity: 0.9 }}>
                        <Phone size={18} color="var(--c-secondary)" />
                        <span>+56 45 2205415 (WhatsApp)</span>
                    </div>
                    <div className="flex items-center gap-2 text-light" style={{ opacity: 0.9 }}>
                        <Mail size={18} color="var(--c-secondary)" />
                        <span>reservas@uct.cl</span>
                    </div>
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

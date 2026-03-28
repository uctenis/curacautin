import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

const Navbar = () => {
    return (
        <nav style={{ background: 'var(--c-primary)', padding: '1.2rem 0', position: 'sticky', top: 0, zIndex: 50, borderBottom: '1px solid rgba(255,255,255,0.1)', boxShadow: 'var(--shadow-lg)' }}>
            <div className="container flex items-center justify-between">
                <Link to="/" className="flex items-center gap-4" style={{ color: 'white', fontWeight: 800, fontSize: '1.4rem', letterSpacing: '-0.02em', textDecoration: 'none' }}>
                    <img src={import.meta.env.BASE_URL + "logo_uct.png"} alt="UCT Logo" style={{ height: '55px', width: 'auto', filter: 'brightness(1.1)' }} />
                    <span style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem', color: 'white' }}>Centro Recreacional UCT</span>
                </Link>
                <div className="flex gap-8 items-center">
                    <Link to="/" style={{ color: 'white', fontWeight: 600, opacity: 0.9, textDecoration: 'none', fontSize: '1.05rem' }}>Inicio</Link>
                    {/* Fixed path to /reservar */}
                    <Link to="/reservar" className="btn btn-secondary" style={{ padding: '0.75rem 2rem', borderRadius: '50px', fontWeight: 700, fontSize: '1rem', textDecoration: 'none' }}>
                        Reservar Ahora
                    </Link>
                    <Link to="/admin" style={{ color: 'white', opacity: 0.6, padding: '0.6rem', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex' }}>
                        <Settings size={20} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

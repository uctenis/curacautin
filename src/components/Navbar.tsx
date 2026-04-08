import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react'; // Eliminado 'Menu' para evitar error de TypeScript

const Navbar = () => {
    return (
        <nav style={{
            background: 'var(--c-primary)',
            padding: '1rem 0',
            position: 'sticky',
            top: 0,
            zIndex: 50,
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            boxShadow: 'var(--shadow-lg)',
            width: '100%'
        }}>
            <div className="container flex items-center justify-between px-4 mx-auto">
                {/* LOGO Y NOMBRE */}
                <Link to="/" className="flex items-center gap-2 md:gap-4" style={{ color: 'white', fontWeight: 800, textDecoration: 'none' }}>
                    <img
                        src={import.meta.env.BASE_URL + "logo_uct.png"}
                        alt="UCT Logo"
                        style={{ height: '40px', width: 'auto', filter: 'brightness(1.1)' }}
                        className="md:h-[55px]"
                    />
                    <span className="hidden-mobile" style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem', fontSize: '1.1rem' }}>
                        Centro Recreacional UCT
                    </span>
                </Link>

                {/* BOTONES */}
                <div className="flex gap-4 md:gap-10 items-center">
                    <Link
                        to="/"
                        className="hidden md:block"
                        style={{ color: 'white', fontWeight: 600, opacity: 0.9, textDecoration: 'none', fontSize: '0.95rem', transition: 'opacity 0.2s' }}
                    >
                        Inicio
                    </Link>

                    <Link
                        to="/reservar"
                        className="btn btn-secondary"
                        style={{
                            padding: '0.5rem 1.5rem',
                            borderRadius: '50px',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                        }}
                    >
                        Reservar
                    </Link>

                    <Link
                        to="/admin"
                        title="Administración"
                        style={{
                            color: 'white',
                            opacity: 0.6,
                            padding: '0.6rem',
                            borderRadius: '50%',
                            background: 'rgba(255,255,255,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            transition: 'all 0.2s'
                        }}
                    >
                        <Settings size={18} />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

import { Link } from 'react-router-dom';
import { Settings, Menu } from 'lucide-react'; // Añadí Menu por si quieres un icono de hamburguesa luego

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
                {/* LOGO Y NOMBRE: En celular ocultamos el texto largo para ahorrar espacio */}
                <Link to="/" className="flex items-center gap-2 md:gap-4" style={{ color: 'white', fontWeight: 800, textDecoration: 'none' }}>
                    <img 
                        src={import.meta.env.BASE_URL + "logo_uct.png"} 
                        alt="UCT Logo" 
                        style={{ height: '40px', width: 'auto', filter: 'brightness(1.1)' }} 
                        className="md:h-[55px]" // Más grande en PC, más chico en móvil
                    />
                    <span className="hidden sm:block" style={{ borderLeft: '1px solid rgba(255,255,255,0.3)', paddingLeft: '1rem', fontSize: '1.1rem' }}>
                        Centro Recreacional UCT
                    </span>
                </Link>

                {/* BOTONES: Ajustamos el gap y el tamaño del botón para que quepan */}
                <div className="flex gap-3 md:gap-8 items-center">
                    <Link 
                        to="/" 
                        className="hidden md:block" // Ocultamos "Inicio" en celular para dar aire
                        style={{ color: 'white', fontWeight: 600, opacity: 0.9, textDecoration: 'none', fontSize: '1.05rem' }}
                    >
                        Inicio
                    </Link>
                    
                    <Link 
                        to="/reservar" 
                        className="btn btn-secondary text-sm md:text-base" 
                        style={{ 
                            padding: '0.5rem 1.2rem', // Padding más pequeño en móvil
                            borderRadius: '50px', 
                            fontWeight: 700, 
                            textDecoration: 'none',
                            whiteSpace: 'nowrap' // Evita que el texto se parta en dos líneas
                        }}
                    >
                        Reservar
                    </Link>

                    <Link 
                        to="/admin" 
                        style={{ 
                            color: 'white', 
                            opacity: 0.6, 
                            padding: '0.5rem', 
                            borderRadius: '50%', 
                            background: 'rgba(255,255,255,0.1)', 
                            display: 'flex' 
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

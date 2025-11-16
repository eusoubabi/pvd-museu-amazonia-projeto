// Em src/components/Navbar/Navbar.tsx

// Importamos o Link para lidar com a navegação interna
import { Link } from 'react-router-dom';
import './Navbar.css';

// Usaremos 'Link' do react-router-dom para navegar
export const Navbar = () => {
    return (
        <nav className="navbar">
            
            <div className="navbar-left">
                {/* ATUALIZE AQUI: Mude de /icon.jpg para /icon.png */}
                <img src="/icon.png" alt="Logo Museum" className="navbar-logo" /> 
                <Link to="/home">HOME</Link> {/* Usando Link para HOME */}
                <Link to="#">AGENDA</Link>
                <Link to="#">SOBRE</Link>
                <Link to="#">CONTATO</Link>
            </div>

            <div className="navbar-right">
                <Link to="/carrinho" className="navbar-cart">
                    {/* Aqui vai o ícone do carrinho, se houver */}
                </Link>
                
                {/* CORREÇÃO AQUI: Substituímos o <button> por <Link> */}
                <Link to="/login" className="navbar-login-btn">
                    LOGIN
                </Link>
            </div>

        </nav>
    );
}
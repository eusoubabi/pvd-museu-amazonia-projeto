import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';
import { useEffect, useState } from 'react';

export const Navbar = () => {
    const [isLogged, setIsLogged] = useState(false);

    const location = useLocation();

    useEffect(() => {
        // Verifica se há sessão mockada
        const logged = localStorage.getItem("isLogged") === "true";
        setIsLogged(logged);
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <img
  src={`${import.meta.env.BASE_URL}icon.png`}
  alt="Logo Museum"
  className="navbar-logo"
/>
 
                <Link to="/home">HOME</Link>
                <Link to="#">AGENDA</Link>
                <Link to="#">SOBRE</Link>
                <Link to="#">CONTATO</Link>
            </div>

            <div className="navbar-right">
                
                {/* CARRINHO */}
                <Link to="/carrinho" className="navbar-cart"></Link>

                {/* MOSTRAR LOGIN APENAS SE NÃO ESTIVER LOGADO */}
                {!isLogged && (
                    <Link to="/login" className="navbar-login-btn">
                        LOGIN
                    </Link>
                )}

                {/* MOSTRAR LOGOUT SE ESTIVER LOGADO */}
                {isLogged && (
                    <button
                        className="navbar-logout-btn"
                        onClick={() => {
                            localStorage.setItem("isLogged", "false");
                            window.location.href = "/home";
                        }}
                    >
                        SAIR
                    </button>
                )}
            </div>
        </nav>
    );
}

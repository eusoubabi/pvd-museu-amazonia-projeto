// Em src/components/Navbar/Navbar.tsx

import './Navbar.css';

// Usaremos 'Links' do react-router-dom para navegar
export const Navbar = () => {
  return (
    <nav className="navbar">
      
      <div className="navbar-left">
        {/* ATUALIZE AQUI: Mude de /icon.jpg para /icon.png */}
        <img src="/icon.png" alt="Logo Museum" className="navbar-logo" /> 
        <a href="/Home">HOME</a>
        <a href="#">AGENDA</a>
        <a href="#">SOBRE</a>
        <a href="#">CONTATO</a>
      </div>

      <div className="navbar-right">
        
        <a href="#" className="navbar-cart">
          {/* ATUALIZE AQUI: Mude de /icon-car.avif para /icon-car.png */}
          <img src="/icon-car.png" alt="Logo Carrinho" className="navbar-icon-car" />
          MEU CARRINHO
        </a>
        <button className="navbar-login-btn">
          LOGIN
        </button>
      </div>

    </nav>
  );
}
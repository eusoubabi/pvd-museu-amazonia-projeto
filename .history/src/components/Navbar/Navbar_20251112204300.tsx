import './Navbar.css';

// Usaremos 'Links' do react-router-dom para navegar
// (Mas, por enquanto, pode ser 'a' href="#" também)
export const Navbar = () => {
  return (
    <nav className="navbar">
      
      <div className="navbar-left">
        {/* Seu ícone está na pasta 'public', então podemos usar /icon.jpg */}
        <img src="/icon.jpg" alt="Logo Museum" className="navbar-logo" /> 
        <a href="/Home">HOME</a>
        <a href="#">AGENDA</a>
        <a href="#">SOBRE</a>
        <a href="#">CONTATO</a>
      </div>

      <div className="navbar-right">
        
        <a href="#" className="navbar-cart">
          <img src="/icon-car.avif" alt="Logo Carrinho" className="navbar-icon-car" />
          MEU CARRINHO
        </a>
        <button className="navbar-login-btn">
          LOGIN
        </button>
      </div>

    </nav>
  );
}
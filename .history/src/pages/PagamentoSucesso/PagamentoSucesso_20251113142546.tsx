import { Link } from 'react-router-dom';
import './PagamentoSucesso.css';

export const PagamentoSucesso = () => {
  // No futuro, o ID viria da resposta do backend
  const fakePedidoId = '7867'; 

  return (
    <div className="success-container">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h2>Seu pedido foi realizado com sucesso!</h2>
        <p>Pedido#{fakePedidoId}</p>
        <Link to={`/pedido/${fakePedidoId}`} className="hero-btn">
          Meus Ingressos
        </Link>
      </div>
    </div>
  );
};
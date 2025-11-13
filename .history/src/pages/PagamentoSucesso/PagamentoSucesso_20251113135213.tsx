import { Link, useLocation } from 'react-router-dom';
import './PagamentoSucesso.css';

export const PagamentoSucesso = () => {
  // No futuro, o ID viria da resposta do backend
  const fakePedidoId = '7867'; 
  
  // Captura o estado passado pelo navigate
  const location = useLocation();
  const emailEnviado = location.state?.email || 'o endereço de e-mail cadastrado';

  return (
    <div className="success-container">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h2>Seu pedido foi realizado com sucesso!</h2>
        <p>Pedido#{fakePedidoId}</p>
        
        {/* Nova mensagem de confirmação de envio */}
        <p className="email-message">
          Seus ingressos digitais foram enviados para: **{emailEnviado}**
        </p>

        <Link to={`/pedido/${fakePedidoId}`} className="hero-btn">
          Meus Ingressos
        </Link>
      </div>
    </div>
  );
};
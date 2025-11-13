// DEPOIS: src/pages/PagamentoSucesso/PagamentoSucesso.tsx

import { Link } from 'react-router-dom';
import './PagamentoSucesso.css';

// Gera um ID de 4 dígitos aleatórios.
const generateUniqueOrderId = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const PagamentoSucesso = () => {
  // 1. Gera o ID único no momento em que a página de sucesso é carregada.
  //    (Em um ambiente real, o ID viria do backend na resposta do pagamento.)
  const fakePedidoId = generateUniqueOrderId(); 

  return (
    <div className="success-container">
      <div className="success-box">
        <div className="success-icon">✓</div>
        <h2>Seu pedido foi realizado com sucesso!</h2>
        <p>Pedido#{fakePedidoId}</p> {/* Agora será um número diferente */}
        <Link to={`/pedido/${fakePedidoId}`} className="hero-btn">
          Meus Ingressos
        </Link>
      </div>
    </div>
  );
};
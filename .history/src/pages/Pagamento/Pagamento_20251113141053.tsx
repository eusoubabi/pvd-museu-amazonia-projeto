import { useCartStore } from '../../store/cartStore';
import './Pagamento.css';
import { useNavigate } from 'react-router-dom';

export const Pagamento = () => {
  // Pega os itens do carrinho e a função para limpá-lo
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();

  // Calcula o valor total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // 1. (Futuro) Enviar dados do formulário (pessoais + cartão) para o Backend
    // 2. (Futuro) Se o backend retornar sucesso...
    
    // 3. (AGORA) Limpar o carrinho
    clearCart(); // <-- Esta linha garante que o carrinho é esvaziado após o 'pagamento'
    
    // 4. (AGORA) Redirecionar para a página de sucesso
    navigate('/pagamento/sucesso');
  };

  return (
    <div className="payment-container">
      <div className="payment-form-side">
        <h2>Finalizar Compra</h2>
        <form onSubmit={handlePayment} className="payment-form">

          {/* === CADASTRO ANTES DA COMPRA === */}
          <fieldset className="personal-details">
            <legend>Seus Dados</legend>
            
            <label htmlFor="full-name">Nome Completo</label>
            <input type="text" id="full-name" required />
            
            <label htmlFor="email">E-mail</label>
            <input type="email" id="email" required />
            
            <label htmlFor="phone">Telefone</label>
            <input type="text" id="phone" placeholder="(92) 99999-9999" required />
          </fieldset>
          
          {/* === DADOS DE PAGAMENTO === */}
          <fieldset className="payment-details">
            <legend>Pagamento (Cartão de Crédito)</legend>
            
            <label htmlFor="card-name">Nome no Cartão</label>
            <input type="text" id="card-name" required />

            <label htmlFor="card-number">Número do Cartão</label>
            <input type="text" id="card-number" placeholder="0000 0000 0000 0000" required />
            
            <div className="form-row">
              <div>
                <label htmlFor="card-validity">Validade</label>
                <input type="text" id="card-validity" placeholder="MM/AA" required />
              </div>
              <div>
                <label htmlFor="card-cvv">CVV</label>
                <input type="text" id="card-cvv" placeholder="123" required />
              </div>
            </div>
          </fieldset>
          
          {/* Botão de Envio */}
          <button type="submit" className="payment-submit-btn">
            Finalizar pagamento (R$ {total.toFixed(2)})
          </button>
        </form>
      </div>

      {/* RESUMO DO PEDIDOP */}
      <div className="payment-summary-side">
        <h3>Resumo do Pedido</h3>
        {cartItems.map(item => (
          <div className="summary-item" key={item.id}>
            <span>{item.quantity}x {item.name}</span>
            <span>R$ {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="summary-row total-row">
            <span>Total a Pagar</span>
            <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
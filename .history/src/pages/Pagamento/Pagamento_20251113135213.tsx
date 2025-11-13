import { useCartStore } from '../../store/cartStore';
import './Pagamento.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react'; // Importação do useState

export const Pagamento = () => {
  const { cartItems, clearCart } = useCartStore();
  const navigate = useNavigate();
  // Estado para capturar o e-mail
  const [email, setEmail] = useState(''); 

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // 1. (Futuro) Enviar dados do formulário (pessoais + cartão) para o Backend
    // 2. (Futuro) Se o backend retornar sucesso...
    
    // 3. (Agora) Limpar o carrinho
    clearCart();
    
    // 4. (Agora) Redirecionar para a página de sucesso, passando o e-mail
    navigate('/pagamento/sucesso', { state: { email } });
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
            {/* Input de E-mail atualizado para capturar o valor */}
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            
            <label htmlFor="cpf">CPF</label>
            <input type="text" id="cpf" required />
          </fieldset>

          {/* === DADOS DE PAGAMENTO === */}
          <fieldset className="payment-details">
            <legend>Pagamento</legend>
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
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
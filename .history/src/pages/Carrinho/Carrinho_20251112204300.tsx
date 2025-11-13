import { useCartStore } from '../../store/cartStore';
import './Carrinho.css';
import { Link } from 'react-router-dom';

export const Carrinho = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCartStore();

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const total = subtotal; // Adicionar taxas/descontos aqui se houver

  if (cartItems.length === 0) {
    return (
      <div className="cart-container cart-empty">
        <h2>Seu carrinho está vazio.</h2>
        <Link to="/ingressos/comprar/catalogo" className="hero-btn">
          Comprar Ingressos
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Meu Carrinho</h2>
      <div className="cart-content">
        <div className="cart-items-list">
          {/* Cabeçalho */}
          <div className="cart-item-header">
            <div>Ingressos</div>
            <div>Quantidade</div>
            <div>Total</div>
          </div>
          {/* Itens */}
          {cartItems.map(item => (
            <div className="cart-item" key={item.id}>
              <div className="cart-item-details">
                <img src="/icon.jpg" alt="ícone" />
                <div>
                  <p className="item-name">{item.name}</p>
                  <button onClick={() => removeFromCart(item.id)} className="remove-btn">
                    Remover
                  </button>
                </div>
              </div>
              <div className="cart-item-quantity">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <div className="cart-item-total">
                R$ {(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          {/* Cupom de desconto (como no design) */}
          <label htmlFor="cupom">Cupom de desconto</label>
          <div className="cupom-input">
            <input type="text" id="cupom" />
            <button>OK</button>
          </div>
          
          <div className="summary-row">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2)}</span>
          </div>
          <div className="summary-row total-row">
            <span>Total</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>
          
          <Link to="/pagamento" className="checkout-btn">
            FECHAR PEDIDO
          </Link>
        </div>
      </div>
    </div>
  );
};
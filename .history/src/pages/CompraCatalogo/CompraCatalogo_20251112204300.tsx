import { useCartStore } from '../../store/cartStore';
import './CompraCatalogo.css';
import { useNavigate } from 'react-router-dom';

// Dados que viriam do Backend
const TICKET_TYPES = [
  {
    id: 'gratuito',
    name: 'Gratuito',
    price: 0.00,
    description: 'Acesso ao Museu',
    features: ['Crianças até 6 anos', 'Idosos a partir de 60 anos', 'PCD com laudo']
  },
  {
    id: 'inteira',
    name: 'Inteira',
    price: 20.00,
    description: 'Acesso ao Museu',
    features: ['Visitação Turística', 'Inteira']
  },
  {
    id: 'meia',
    name: 'Meia Entrada',
    price: 10.00,
    description: 'Acesso ao Museu',
    features: ['Estudante', 'Residentes']
  }
];

export const CompraCatalogo = () => {
  const { addToCart } = useCartStore();
  const navigate = useNavigate();

  const handleAddToCart = (ticket: typeof TICKET_TYPES[0]) => {
    addToCart({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price
    });
  };

  return (
    <div className="catalogo-container">
      <h2>Garanta sua experiência no Museu de Arte de Manaus</h2>
      
      <div className="ticket-grid">
        {TICKET_TYPES.map(ticket => (
          <div className="ticket-card" key={ticket.id}>
            <h3>{ticket.name}</h3>

            <p className="ticket-description">{ticket.description}</p>

            <p className="ticket-price">R$ {ticket.price.toFixed(2)}</p>

            <ul className="ticket-features">
              {ticket.features.map(feature => <li key={feature}>{feature}</li>)}
            </ul>
            <button 
              className="ticket-buy-btn" 
              onClick={() => handleAddToCart(ticket)}>
              Comprar
            </button>
          </div>
        ))}
      </div>
      
      <button 
        className="hero-btn" 
        onClick={() => navigate('/carrinho')}
        style={{ marginTop: '2rem' }}>
        Ir para o Carrinho
      </button>
    </div>
  );
};
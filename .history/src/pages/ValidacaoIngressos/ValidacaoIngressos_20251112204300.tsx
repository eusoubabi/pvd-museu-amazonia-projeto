import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// Dados que viriam do Backend usando o 'id'
const FAKE_TICKET_DATA = [
  { id: 1, name: 'Inteira', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12345' },
  { id: 2, name: 'Inteira', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12346' },
  { id: 3, name: 'Meia Entrada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12347' },
];

export const ValidacaoIngressos = () => {
  const { id } = useParams(); // Pega o 'id' da URL (ex: 7867)

  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{id}</h3>
      <p>Apresente os ingressos abaixo na entrada do museu.</p>

      <div className="tickets-grid">
        {FAKE_TICKET_DATA.map(ticket => (
          <div className="ticket-qr-card" key={ticket.id}>
            <img src="/icon.jpg" alt="Logo" className="ticket-logo" />
            <div className="ticket-info">
              <p><strong>Museu de Artes Manaus</strong></p>
              <p>Data: 24 Set 2025 - 09:00</p>
              <p>Ingresso: {ticket.name}</p>
            </div>
            <img src={ticket.qrCode} alt="QR Code" className="ticket-qrcode" />
            <p className="ticket-id-small">Pedido#{id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
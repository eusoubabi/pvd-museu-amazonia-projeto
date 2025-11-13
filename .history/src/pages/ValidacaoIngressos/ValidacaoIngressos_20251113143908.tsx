import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// --- Ajuste da Logo: Caminho de exemplo ---
// Certifique-se de que o caminho '../../assets/icon.jpg' seja o caminho REAL da sua logo.
import museumLogo from '../../assets/icon.png'; 

// Dados de exemplo (continuam os mesmos por enquanto)
const FAKE_TICKET_DATA = [
  { id: 1, name: 'Inteira', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12345' },
  { id: 2, name: 'Inteira', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12346' },
  { id: 3, name: 'Meia Entrada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12347' },
];

export const ValidacaoIngressos = () => {
  const { id } = useParams();
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{id}</h3>
      <p>Apresente os ingressos abaixo na entrada do museu.</p>
      
      <button 
        onClick={handlePrint} 
        className="print-btn"
      >
        IMPRIMIR / SALVAR PDF
      </button>

      <div className="tickets-grid">
        {FAKE_TICKET_DATA.map(ticket => (
          <div className="ticket-qr-card" key={ticket.id}>
            
            {/* LOGO: Usando o import */}
            <p className="ticket-museum-name">MUSEU DE ARTES MANAUS</p>
            <hr className="ticket-divider"/>
            
            <img 
                src={museumLogo} 
                alt="Logo Museu" 
                className="ticket-logo"
            />
            
            <div className="ticket-info">
                {/* ASTERISCOS REMOVIDOS E SUBSTITUÍDOS POR <strong> */}
                <p className="ticket-type"><strong>Ingresso:</strong> {ticket.name}</p> 
                <p><strong>Data:</strong> 15/07/2025</p>
                <p><strong>Local:</strong> Museu de Artes</p>
            </div>

            <img 
                src={ticket.qrCode} 
                alt="QR Code" 
                className="ticket-qrcode"
            />
            
            <p className="ticket-id-small">ID do Ingresso: {id}-{ticket.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
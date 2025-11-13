import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// *** IMPORT DA LOGO REMOVIDO PARA USAR O CAMINHO PÚBLICO "/icon.jpg" ***

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
            
            <p className="ticket-museum-name">MUSEU DE ARTES MANAUS</p>
            <hr className="ticket-divider"/>
            
            <img 
                // *** CORREÇÃO: Usando o caminho público (como no Navbar.tsx) ***
                src="/icon.png" 
                alt="Logo Museu" 
                className="ticket-logo"
            />
            
            <div className="ticket-info">
                {/* ASTERISCOS RESOLVIDOS com <strong> */}
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
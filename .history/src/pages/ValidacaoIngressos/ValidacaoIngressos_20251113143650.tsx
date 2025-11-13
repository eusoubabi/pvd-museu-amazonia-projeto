import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// Dados que viriam do Backend usando o 'id'
// MANTENHA ESTES DADOS FAKES
const FAKE_TICKET_DATA = [
  { id: 1, name: 'Inteira', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12345' },
  { id: 2, name: 'Inteira', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12346' },
  { id: 3, name: 'Meia Entrada', qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket-12347' },
];

export const ValidacaoIngressos = () => {
  const { id } = useParams(); // Pega o 'id' da URL (ex: 7867)
  
  // NOVA FUNÇÃO
  const handlePrint = () => {
    // A função nativa que abre a caixa de diálogo de impressão/salvar PDF
    window.print();
  };

  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{id}</h3>
      <p>Apresente os ingressos abaixo na entrada do museu.</p>
      
      {/* NOVO BOTÃO DE IMPRIMIR/SALVAR PDF */}
      <button 
        onClick={handlePrint} 
        className="print-btn" // Nova classe CSS
      >
        IMPRIMIR / SALVAR PDF
      </button>

      <div className="tickets-grid">
        {FAKE_TICKET_DATA.map(ticket => (
          <div className="ticket-qr-card" key={ticket.id}>
            {/* ... o restante do seu cartão de ingresso ... */}
            <p style={{ color: '#0c4a36', fontWeight: 'bold' }}>MUSEU DE MANAUS</p>
            <hr style={{ border: '1px dashed #ddd', margin: '0.75rem 0' }}/>
            
            <img 
                src={"/icon.png"} 
                alt="Logo Museu" 
                className="ticket-logo"
            />
            
            <div className="ticket-info">
                <p style={{ color: '#0c4a36', margin: '0.5rem 0 1.5rem 0' }}>**{ticket.name}**</p>
                <p style={{ color: '#555' }}>**Data:** 15/07/2025</p>
                <p style={{ color: '#555' }}>**Local:** Museu de Artes</p>
            </div>

            {/* Este é o QR Code real vindo de uma API (porém fake no momento) */}
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
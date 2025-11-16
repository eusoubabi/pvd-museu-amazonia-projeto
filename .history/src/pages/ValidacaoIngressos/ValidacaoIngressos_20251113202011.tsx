import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// MOCK DE DADOS PARA SIMULAR PEDIDOS E SEUS INGRESSOS
export const FAKE_ORDER_DATA = [

  {
    id: '7867', // Pedido 1: Três Ingressos
    comprador: 'Ana Carolina Silva',
    data: '15/07/2025',
    ingressos: [
      { id: 'A1', name: 'Inteira', qrCodeData: 'Pedido-7867-Ingresso-A1' },
      { id: 'A2', name: 'Meia Entrada (Estudante)', qrCodeData: 'Pedido-7867-Ingresso-A2' },
      { id: 'A3', name: 'Inteira', qrCodeData: 'Pedido-7867-Ingresso-A3' },
    ],
  },
  {
    id: '1234', // Pedido 2: Um Ingresso (Idoso)
    comprador: 'João Batista Ferreira',
    data: '16/07/2025',
    ingressos: [
      { id: 'B1', name: 'Gratuito (Idoso)', qrCodeData: 'Pedido-1234-Ingresso-B1' },
    ],
  },
  {
    id: '5555', // Pedido 3: Dois Ingressos Meia
    comprador: 'Maria Eduarda Santos',
    data: '20/07/2025',
    ingressos: [
      { id: 'C1', name: 'Meia Entrada (Professor)', qrCodeData: 'Pedido-5555-Ingresso-C1' },
      { id: 'C2', name: 'Meia Entrada (Professor)', qrCodeData: 'Pedido-5555-Ingresso-C2' },
    ],
  },
  {
    id: '9900', // Pedido 4: Quatro Ingressos Inteira
    comprador: 'Pedro Henrique Costa',
    data: '10/08/2025',
    ingressos: [
      { id: 'D1', name: 'Inteira', qrCodeData: 'Pedido-9900-Ingresso-D1' },
      { id: 'D2', name: 'Inteira', qrCodeData: 'Pedido-9900-Ingresso-D2' },
      { id: 'D3', name: 'Inteira', qrCodeData: 'Pedido-9900-Ingresso-D3' },
      { id: 'D4', name: 'Inteira', qrCodeData: 'Pedido-9900-Ingresso-D4' },
    ],
  },
];

// Função utilitária para gerar QR Code
const generateQrCodeUrl = (data: string) => 
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;


export const ValidacaoIngressos = () => {
  const { id } = useParams();
  
  // LÓGICA: ENCONTRAR O PEDIDO CORRETO
  const order = FAKE_ORDER_DATA.find(order => order.id === id);

  if (!order) {
    return (
        <div className="validacao-container" style={{ textAlign: 'center' }}>
            <h2>❌ Pedido Não Encontrado</h2>
            <p>O ID de pedido <strong>#{id}</strong> não corresponde a nenhum ingresso.</p>
            <p>Tente os IDs: <strong>7867</strong>, <strong>1234</strong>, <strong>5555</strong> ou <strong>9900</strong></p>
        </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{order.id}</h3>
      <p>Comprador: <strong>{order.comprador}</strong></p>
      <p>Apresente os <strong>{order.ingressos.length}</strong> ingressos abaixo na entrada do museu.</p>
      
      <button 
        onClick={handlePrint} 
        className="print-btn"
      >
        IMPRIMIR / SALVAR PDF
      </button>

      <div className="tickets-grid">
        {/* Itera sobre a lista de ingressos DENTRO do pedido */}
        {order.ingressos.map(ticket => (
          <div className="ticket-qr-card" key={ticket.id}>
            
            <p className="ticket-museum-name">MUSEU DE ARTES MANAUS</p>
            <hr className="ticket-divider"/>
            
            <img
  src={`${import.meta.env.BASE_URL}icon.png`}
  alt="Logo Museu"
  className="ticket-logo"
/>

            
            <div className="ticket-info">
                <p className="ticket-type"><strong>Ingresso:</strong> {ticket.name}</p> 
                <p><strong>Data:</strong> {order.data}</p>
                <p><strong>Local:</strong> Museu de Artes</p>
            </div>

            <img 
                src={generateQrCodeUrl(ticket.qrCodeData)} 
                alt="QR Code" 
                className="ticket-qrcode"
            />
            
            <p className="ticket-id-small">ID do Ingresso: {order.id}-{ticket.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
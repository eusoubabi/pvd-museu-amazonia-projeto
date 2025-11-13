import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// Importação da logo (mantida como o caminho público para evitar o erro do Vite)
import museumLogo from '/icon.png'; 

// 1. *** MOCK DE DADOS REESTRUTURADO (SIMULANDO VÁRIOS PEDIDOS) ***
const FAKE_ORDER_DATA = [
  {
    id: '7867', // ID que virá da URL: /pedido/7867
    ingressos: [
      { id: 'A1', name: 'Inteira', qrCodeData: 'Pedido-7867-Ingresso-A1' },
      { id: 'A2', name: 'Meia Entrada (Estudante)', qrCodeData: 'Pedido-7867-Ingresso-A2' },
      { id: 'A3', name: 'Inteira', qrCodeData: 'Pedido-7867-Ingresso-A3' },
    ],
  },
  {
    id: '1234', // Outro ID de exemplo: /pedido/1234
    ingressos: [
      { id: 'B1', name: 'Gratuito (Idoso)', qrCodeData: 'Pedido-1234-Ingresso-B1' },
    ],
  },
  // Adicione mais mocks de pedidos se precisar
];

// Função utilitária para gerar QR Code
const generateQrCodeUrl = (data: string) => 
    `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(data)}`;


export const ValidacaoIngressos = () => {
  const { id } = useParams();
  
  // 2. *** LÓGICA: ENCONTRAR O PEDIDO CORRETO ***
  const order = FAKE_ORDER_DATA.find(order => order.id === id);

  if (!order) {
    return (
        <div className="validacao-container" style={{ textAlign: 'center' }}>
            <h2>❌ Pedido Não Encontrado</h2>
            <p>O ID de pedido **#{id}** não corresponde a nenhum ingresso.</p>
        </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  // 3. O restante do JSX usa agora `order.ingressos`
  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{order.id}</h3> {/* Usando order.id real */}
      <p>Apresente os **{order.ingressos.length}** ingressos abaixo na entrada do museu.</p>
      
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
                src={museumLogo} 
                alt="Logo Museu" 
                className="ticket-logo"
            />
            
            <div className="ticket-info">
                <p className="ticket-type"><strong>Ingresso:</strong> {ticket.name}</p> 
                <p><strong>Data:</strong> 15/07/2025</p>
                <p><strong>Local:</strong> Museu de Artes</p>
            </div>

            <img 
                // Usando a função para gerar a URL do QR Code
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
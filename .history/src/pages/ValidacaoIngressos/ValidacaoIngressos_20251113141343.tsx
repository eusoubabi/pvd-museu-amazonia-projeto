import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// 1. Mock Data de pedidos (Simulando um 'banco de dados' para a validação)
// O ID '7867' virá da rota /pedido/:id
const MOCK_ORDER_DATA = {
  '7867': [
    { type: 'Inteira', quantity: 2, price: 20.00 },
    { type: 'Meia Entrada', quantity: 1, price: 10.00 },
  ],
  // Adicione mais IDs de pedido válidos para testes de validação (ex: na página ValidarIngresso)
  '1000': [
      { type: 'Gratuito', quantity: 4, price: 0.00 },
  ]
};

// Estrutura de Ticket final
interface Ticket {
    id: number;
    name: string;
    qrCode: string; // URL do QR Code
}

// 2. Função para gerar a lista de tickets (como se fosse o backend)
const generateTickets = (orderId: string): Ticket[] => {
    // Pega o pedido no mock data. Se não existir, retorna array vazio.
    const items = MOCK_ORDER_DATA[orderId as keyof typeof MOCK_ORDER_DATA] || [];
    const ticketList: Ticket[] = [];
    let ticketCounter = 1;

    items.forEach(item => {
        for (let i = 0; i < item.quantity; i++) {
            // Cria um código de validação único: PedidoID-TicketID (ex: 7867-1, 7867-2, ...)
            const uniqueTicketCode = `${orderId}-${ticketCounter}`; 
            
            ticketList.push({
                id: ticketCounter,
                name: item.type,
                // URL que gera a imagem do QR Code a partir do código único
                qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uniqueTicketCode}`, 
            });
            ticketCounter++;
        }
    });

    return ticketList;
}

export const ValidacaoIngressos = () => {
  const { id } = useParams(); // Pega o 'id' da URL (ex: 7867)

  // 3. Gerar os ingressos para o ID do pedido
  const TICKET_DATA = id ? generateTickets(id) : [];
  const isValidOrder = TICKET_DATA.length > 0;

  // Se o pedido não existir (não estiver no MOCK_ORDER_DATA)
  if (!isValidOrder) {
      return (
          <div className="validacao-container">
              <h2>Pedido Não Encontrado</h2>
              <p>O ID do pedido **#{id}** não foi encontrado. Por favor, verifique o número digitado.</p>
          </div>
      )
  }

  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{id}</h3>
      <p>Apresente os **{TICKET_DATA.length} ingressos** abaixo na entrada do museu.</p>

      <div className="tickets-grid">
        {TICKET_DATA.map(ticket => (
          <div className="ticket-qr-card" key={ticket.id}>
            <p className="ticket-name">Ingresso: **{ticket.name}**</p>
            <p className="ticket-info">Data: 15/02/2026</p>
            
            {/* === NOVO: O QR CODE ESTÁ AQUI === */}
            <img 
              src={ticket.qrCode} 
              alt={`QR Code para ${ticket.name}`} 
              className="ticket-qrcode" 
            />
            
            <p className="ticket-id-small">Cód. Validação: {id}-{ticket.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
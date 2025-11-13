// DEPOIS: src/pages/ValidacaoIngressos/ValidacaoIngressos.tsx

import { useParams } from 'react-router-dom';
import './ValidacaoIngressos.css';

// 1. Função para gerar uma lista de ingressos com base no ID do Pedido
const generateTickets = (orderId: string) => {
  // Simula os itens do pedido (Aqui você precisaria do carrinho, mas simularemos 3 itens)
  const items = [
    { name: 'Inteira', quantity: 2 },
    { name: 'Meia Entrada', quantity: 1 },
  ];

  let ticketList = [];
  let ticketCounter = 1;

  for (const item of items) {
    for (let i = 0; i < item.quantity; i++) {
      // 2. Cria um código único para CADA ingresso
      const uniqueTicketCode = `${orderId}-${ticketCounter}`; 
      
      ticketList.push({
        id: ticketCounter,
        name: item.name,
        // 3. O QR Code usa o código único para ser diferente em cada ingresso
        qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${uniqueTicketCode}`, 
      });
      ticketCounter++;
    }
  }
  return ticketList;
};

export const ValidacaoIngressos = () => {
  const { id } = useParams<{ id: string }>(); // Pega o ID da URL

  // Gera a lista de ingressos usando o ID do Pedido
  const TICKET_DATA = generateTickets(id || '0000'); // Garante um valor padrão

  return (
    <div className="validacao-container">
      <h2>Validação de Ingressos</h2>
      <h3>Pedido #{id}</h3>
      <p>Apresente os ingressos abaixo na entrada do museu.</p>

      <div className="tickets-grid">
        {TICKET_DATA.map(ticket => (
          <div className="ticket-qr-card" key={ticket.id}>
            {/* ... restante do JSX ... */}
            <p className="ticket-info">Ingresso: **{ticket.name}**</p>
            <p className="ticket-info">Data: 15/02/2026</p>
            
            <p className="ticket-id-small">Cód. Validação: {id}-{ticket.id}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
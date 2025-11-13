import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ValidacaoIngressos.css';

// MOCK DE DADOS: IDs de Pedido válidos para teste
// Estes devem ser os mesmos IDs usados no mock de ValidacaoIngressos.tsx
const VALID_ORDER_IDS = ['7867', '1000']; 

export const ValidarIngresso = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // NOVO: Estado para a mensagem de erro
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa a mensagem de erro anterior

    const idToValidate = pedidoId.trim();

    if (!idToValidate) {
        setErrorMessage('Por favor, digite o ID do seu pedido.');
        return;
    }
    
    // 1. **Implementação da Busca (Mock)**: Verifica se o ID do pedido é válido
    if (VALID_ORDER_IDS.includes(idToValidate)) {
      // 2. Se for válido, navega para a página de ingressos
      navigate(`/pedido/${idToValidate}`);
    } else {
      // 3. Se não for válido, exibe uma mensagem de erro
      setErrorMessage(`O pedido **#${idToValidate}** não foi encontrado. Verifique o número e tente novamente.`);
    }
  };

  return (
    <div className="validation-container">
      <form onSubmit={handleSubmit} className="validation-form">
        <h2>Validar Meus Ingressos</h2>
        <p>Digite o ID do seu pedido para ver seus ingressos.</p>
        
        <label htmlFor="pedidoId">ID do Pedido</label>
        <input
          type="text"
          id="pedidoId"
          value={pedidoId}
          onChange={(e) => setPedidoId(e.target.value)}
          placeholder="Ex: 7867"
        />
        
        {/* === NOVO: Exibe a mensagem de erro (se houver) === */}
        {errorMessage && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{errorMessage}</p>}
        
        <button type="submit" className="validation-btn">Buscar Pedido</button>
      </form>
    </div>
  );
};
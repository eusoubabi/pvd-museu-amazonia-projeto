import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ValidarIngresso.css';

// MOCK DE DADOS: IDs de Pedido válidos para teste, SINCRONIZADOS
const VALID_ORDER_IDS = ['7867', '1234', '5555', '9900']; 

export const ValidarIngresso = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Limpa a mensagem de erro anterior

    const idToValidate = pedidoId.trim();

    if (!idToValidate) {
        setErrorMessage('Por favor, digite o ID do seu pedido.');
        return;
    }
    
    // Se for válido, navega para a página de ingressos (/pedido/:id)
    if (VALID_ORDER_IDS.includes(idToValidate)) {
      navigate(`/pedido/${idToValidate}`);
    } else {
      // CORRIGIDO: Mensagem de erro sem asteriscos
      setErrorMessage(`O pedido #${idToValidate} não foi encontrado. Verifique o número e tente novamente.`);
    }
  };

  return (
    // Removi a estilização que centralizava o box no seu componente anterior.
    // Presumo que o seu CSS (.validation-container) já trata o posicionamento
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
        
        {/* CORRIGIDO: Exibe a mensagem de erro */}
        {/* Você pode querer estilizar essa mensagem no seu ValidarIngresso.css */}
        {errorMessage && <p style={{ color: 'red', fontWeight: 'bold' }}>{errorMessage}</p>}
        
        <button type="submit" className="validation-btn">Buscar Pedido</button>
      </form>
      
      {/* REMOVIDO: A linha que exibia os códigos mocados para teste */}
    </div>
  );
};
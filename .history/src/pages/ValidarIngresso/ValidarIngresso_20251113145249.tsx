import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ValidarIngresso.css';

// *** CORREÇÃO: SINCRONIZANDO COM TODOS OS IDs DO FAKE_ORDER_DATA (7867, 1234, 5555, 9900) ***
const VALID_ORDER_IDS = ['7867', '1234', '5555', '9900']; 

export const ValidarIngresso = () => {
  const [pedidoId, setPedidoId] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); 
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const idToValidate = pedidoId.trim();

    if (!idToValidate) {
        setErrorMessage('Por favor, digite o ID do seu pedido.');
        return;
    }
    
    // 1. Implementação da Busca (Mock)
    if (VALID_ORDER_IDS.includes(idToValidate)) {
      // 2. Se for válido, navega para a página de ingressos
      navigate(`/pedido/${idToValidate}`);
    } else {
      // 3. Se não for válido, exibe uma mensagem de erro
      setErrorMessage(`O pedido #${idToValidate} não foi encontrado. Verifique o número e tente novamente.`);
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
        
        {/* === Exibe a mensagem de erro (se houver) === */}
        {errorMessage && <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{errorMessage}</p>}
        
        <button type="submit" className="validation-btn">Buscar Pedido</button>
      </form>
      
      <p style={{textAlign: 'center', marginTop: '1.5rem', color: '#777'}}>
        Códigos MOCADOS para teste: <strong>{VALID_ORDER_IDS.join(', ')}</strong>
      </p>
    </div>
  );
};
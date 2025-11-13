import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ValidarIngresso.css';

export const ValidarIngresso = () => {
  const [pedidoId, setPedidoId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // No projeto real, você faria uma busca na API.
    // Aqui, vamos apenas navegar para a página do pedido.
    if (pedidoId) {
      navigate(`/pedido/${pedidoId}`);
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
        
        <button type="submit" className="validation-btn">Buscar Pedido</button>
      </form>
    </div>
  );
};
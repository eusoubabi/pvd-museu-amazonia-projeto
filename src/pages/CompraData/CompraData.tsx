import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import './CompraData.css'; 
// Importamos 'isBefore' e 'startOfDay' para garantir que datas passadas sejam desabilitadas
import { isBefore, startOfDay } from 'date-fns'; 

import heroBackgroundImage from '../../assets/Hero/teatro.jpg';

type CalendarValue = Date | null;

// Obtém o início do dia de hoje (meia-noite) para comparação
const today = startOfDay(new Date());

export const CompraData = () => {
  // Inicializamos com o dia de hoje
  const [date, setDate] = useState<CalendarValue>(new Date()); 
  const navigate = useNavigate();

  const handleDateChange = (value: any) => {
    const newDate = startOfDay(value as Date);
    
    // CORREÇÃO 3: Se a data selecionada for antes de hoje (inclusive), definimos como null.
    // Isso garante que o botão seja desativado imediatamente se o usuário clicar em uma data passada.
    if (isBefore(newDate, today)) {
        setDate(null);
    } else {
        setDate(newDate);
    }
  };
  
  // Função que o react-calendar usa para desabilitar dias.
  const tileDisabled = ({ date, view }: { date: Date, view: string }) => {
    // CORREÇÃO 1: Desabilita apenas na view de "mês" e se a data for anterior ou igual a hoje.
    if (view === 'month') {
        // startOfDay garante que a comparação seja feita corretamente, ignorando o horário
        return isBefore(date, today);
    }
    return false;
  };


  const handleSelectDate = () => {
    // CORREÇÃO 2: Verificação final de segurança antes de navegar.
    if (date && !isBefore(date, today)) {
        navigate('/ingressos/comprar/catalogo');
    } else {
        // Caso o usuário tente de alguma forma selecionar uma data passada
        alert('Por favor, selecione uma data futura.');
        setDate(null); // Desativa o botão
    }
  };

  return (
    <div 
      className="compra-data-container" 
      style={{ backgroundImage: `url(${heroBackgroundImage})` }}
    >
      <div className="compra-data-content">
        <div className="compra-data-content-wrapper"> 
          <div className="compra-data-info">
            <h2>INGRESSOS</h2>
            <h3>Benefícios dos Ingressos</h3>
            <ul>
              <li>Acesso a todas as exposições em cartaz.</li>
              <li>Descontos para estudantes, professores e idosos.</li>
              <li>Ingressos digitais enviados por e-mail/WhatsApp.</li>
            </ul>
          </div>
          <div className="compra-data-calendar">
            <Calendar
              onChange={handleDateChange}
              value={date}
              locale="pt-BR"
              tileDisabled={tileDisabled} // <-- VALIDAÇÃO REFORÇADA
            />
            <button 
              className="hero-btn" 
              onClick={handleSelectDate}
              // O botão só é ativado se 'date' não for null
              disabled={!date} 
            >
              SELECIONAR DATA
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilo padrão
import './CompraData.css'; // Nosso estilo customizado

// Importe a mesma imagem do Hero
import heroBackgroundImage from '../../assets/Hero/teatro.jpg';

type CalendarValue = Date | null;

export const CompraData = () => {
  const [date, setDate] = useState<CalendarValue>(new Date());
  const navigate = useNavigate();

  const handleDateChange = (value: any) => {
    setDate(value as CalendarValue);
  };

  const handleSelectDate = () => {
    // No futuro, você pode passar a data na URL ou salvar no Contexto.
    // Por enquanto, vamos apenas para a próxima página.
    navigate('/ingressos/comprar/catalogo');
  };

  return (
    <div 
      className="compra-data-container" 
      style={{ backgroundImage: `url(${heroBackgroundImage})` }}
    >
      <div className="compra-data-content">
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
          />
          <button onClick={handleSelectDate} className="hero-btn">
            Selecionar Dia
          </button>
        </div>
      </div>
    </div>
  );
};
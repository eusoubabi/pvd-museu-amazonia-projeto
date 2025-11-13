import './WeeklySchedule.css';
import scheduleImage from '../../assets/Programacao/img-interior.jpg';

const getWeekSchedule = () => {
  const schedule = [];
  const today = new Date(); // Pega a data de hoje
  const dayAbbreviations = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'];

  // 1. Encontra a Segunda-feira desta semana
  // (Se hoje é Domingo(0), volta 6 dias. Se for Terça(2), volta 1 dia)
  const currentDayIndex = today.getDay();
  const diffToMonday = currentDayIndex === 0 ? 6 : currentDayIndex - 1;
  const monday = new Date(today);
  monday.setDate(today.getDate() - diffToMonday);

  // 2. Gera os 6 dias (SEG-SÁB) a partir da Segunda-feira
  for (let i = 0; i < 6; i++) {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);

    const abbreviation = dayAbbreviations[currentDay.getDay()];
    const number = currentDay.getDate();

    // 3. Verifica se este dia é "hoje"
    const isToday = currentDay.getDate() === today.getDate() &&
                    currentDay.getMonth() === today.getMonth() &&
                    currentDay.getFullYear() === today.getFullYear();

    schedule.push({ abbreviation, number, isToday });
  }
  return schedule;
};

export const WeeklySchedule = () => {
  // função para pegar os dias
  const weekDays = getWeekSchedule();

  return (
    <section className="schedule-section">
      
      {/* Coluna da Esquerda (Clendario) */}
      <div className="schedule-content">
        <h2 className="schedule-title">MUSEUM</h2>
        <h3 className="schedule-subtitle">Conheça a programação da semana</h3>
        
        <button className="schedule-button">PROGRAMAÇÃO</button>

        <div className="schedule-days">
          {weekDays.map(day => (
            <span 
              key={day.abbreviation}
              // classe 'today' dia atual
              className={day.isToday ? 'day-item today' : 'day-item'}
            >
              {day.abbreviation} {day.number}
            </span>
          ))}
        </div>
      </div>

      {/* Coluna da Direita (Imagem) */}
      <div className="schedule-image-container">
        <img src={scheduleImage} alt="Programação do Museu" />
      </div>

    </section>
  );
};
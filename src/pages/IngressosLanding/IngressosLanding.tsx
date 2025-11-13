import './IngressosLanding.css';
import {Link} from 'react-router-dom'

export const IngressosLanding = () => {
  return (
    <div className="landing-container">
      <h2>Ingressos</h2>
      <p>Escolha uma opção para continuar</p>
      <div className="landing-choices">
        <Link to="/ingressos/comprar/data" className="landing-card">
          <h3>Comprar Ingressos</h3>
          <p>Selecione a data e garanta sua entrada.</p>
        </Link>
        <Link to="/ingressos/validar" className="landing-card">
          <h3>Validar Meus Ingressos</h3>
          <p>Já comprou? Acesse seus ingressos aqui.</p>
        </Link>
      </div>
    </div>
  );
};
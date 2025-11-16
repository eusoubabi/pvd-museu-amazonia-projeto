import { Link } from "react-router-dom";
import { Clock, BarChart3 } from "lucide-react";
import "./PortalColaborador.css";

export const PortalColaborador = () => {
  return (
    <div className="portal-container">
      <h1 className="portal-title">Portal do Colaborador</h1>

      <p className="portal-subtitle">
        Selecione uma das opções abaixo para continuar
      </p>

      <div className="portal-cards">
        <Link to="/ponto-eletronico" className="portal-card">
          <Clock size={40} />
          <span>Bater Ponto</span>
        </Link>

        <Link to="/dashboard-vendas" className="portal-card">
          <BarChart3 size={40} />
          <span>Dashboard de Vendas</span>
        </Link>
      </div>
    </div>
  );
};

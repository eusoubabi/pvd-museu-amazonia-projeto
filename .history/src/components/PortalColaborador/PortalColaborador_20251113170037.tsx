import { Link } from 'react-router-dom';
import { Clock, BarChart3 } from 'lucide-react';

export const PortalColaborador = () => {
  return (
    <div className="p-8 max-w-xl mx-auto">
      <h2 className="text-3xl font-bold text-indigo-700 mb-6">
        Portal do Colaborador
      </h2>

      <div className="space-y-4">

        <Link
          to="/ponto-eletronico"
          className="flex items-center p-4 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
        >
          <Clock className="w-6 h-6 mr-3" />
          <span className="text-lg font-semibold">Bater Ponto</span>
        </Link>

        <Link
          to="/dashboard-vendas"
          className="flex items-center p-4 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
        >
          <BarChart3 className="w-6 h-6 mr-3" />
          <span className="text-lg font-semibold">Dashboard de Vendas</span>
        </Link>

      </div>
    </div>
  );
};

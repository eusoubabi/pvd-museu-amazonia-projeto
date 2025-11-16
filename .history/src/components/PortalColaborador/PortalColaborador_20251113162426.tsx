import React, { useState } from 'react';
import { PontoEletronico } from '../PontoEletronico/PontoEletronico';
import { DashboardVendas } from '../../components/DashboardVendas/DashboardVendas'; // Vamos criar este
import { Settings } from 'lucide-react'; // Importando um ícone do lucide-react
import './PortalColaborador.css';

// Enum para gerenciar as abas de navegação
type ActiveTab = 'Ponto' | 'Vendas' | 'Configuracoes';

export const PortalColaborador: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ActiveTab>('Ponto');

    // Função para renderizar o conteúdo da aba ativa
    const renderContent = () => {
        switch (activeTab) {
            case 'Ponto':
                return <PontoEletronico />;
            case 'Vendas':
                // DashboardVendas será atualizado para usar Firestore
                return <DashboardVendas />;
            case 'Configuracoes':
                return <div className="p-8 text-center text-gray-500">Funcionalidade de Configurações em desenvolvimento...</div>;
            default:
                return <PontoEletronico />;
        }
    };

    const NavItem: React.FC<{ tab: ActiveTab; icon: React.ReactNode; label: string }> = ({ tab, icon, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`nav-item ${activeTab === tab ? 'nav-item-active' : ''}`}
            aria-label={label}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <div className="portal-layout">
            {/* Sidebar de Navegação */}
            <aside className="portal-sidebar">
                <div className="logo-section">
                    <span className="font-bold text-lg text-white">HR-Portal</span>
                </div>
                <nav className="flex flex-col space-y-2 mt-8">
                    <NavItem 
                        tab="Ponto" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>} 
                        label="Ponto Eletrônico" 
                    />
                    <NavItem 
                        tab="Vendas" 
                        icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 3-3 3 3m-4-3V7a1 1 0 00-1-1h-4a1 1 0 00-1 1v2m-6 0h2v4a1 1 0 01-1 1H7a1 1 0 01-1-1v-4zM7 16h10"></path></svg>} 
                        label="Dashboard de Vendas" 
                    />
                    <NavItem 
                        tab="Configuracoes" 
                        icon={<Settings className="w-6 h-6" />} 
                        label="Configurações" 
                    />
                </nav>
                <div className="sidebar-footer">
                    <p className="text-sm">Desenvolvido por Gemini</p>
                </div>
            </aside>

            {/* Área Principal de Conteúdo */}
            <main className="portal-main-content">
                {renderContent()}
            </main>
        </div>
    );
};
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from "react";

import { Home } from './pages/home/Home'
import { Navbar } from './components/Navbar/Navbar'
import { Login } from './pages/Login/Login'

// IMPORTAÇÃO CORRETA (default)
import { PortalColaborador } from "./components/PortalColaborador/PortalColaborador";

// Lazy loading
const PontoEletronico = lazy(() =>
  import("./components/PontoEletronico/PontoEletronico")
);

const DashboardVendas = lazy(() =>
  import("./components/DashboardVendas/DashboardVendas")
);

// Ingressos
import { IngressosLanding } from './pages/IngressosLanding/IngressosLanding';
import { ValidarIngresso } from './pages/ValidarIngresso/ValidarIngresso';
import { CompraData } from './pages/CompraData/CompraData';
import { CompraCatalogo } from './pages/CompraCatalogo/CompraCatalogo';
import { Carrinho } from './pages/Carrinho/Carrinho';
import { Pagamento } from './pages/Pagamento/Pagamento';
import { PagamentoSucesso } from './pages/PagamentoSucesso/PagamentoSucesso';
import { ValidacaoIngressos } from './pages/ValidacaoIngressos/ValidacaoIngressos';

export const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Navbar />

            <Suspense fallback={<p>Carregando...</p>}>
                <Routes>

                    <Route path='/home' element={<Home />} />
                    <Route path='/login' element={<Login />} />

                    {/* Fluxo Ingressos */}
                    <Route path='/ingressos' element={<IngressosLanding />} />
                    <Route path='/ingressos/validar' element={<ValidarIngresso />} />
                    <Route path='/pedido/:id' element={<ValidacaoIngressos />} />
                    <Route path='/ingressos/comprar/data' element={<CompraData />} />
                    <Route path='/ingressos/comprar/catalogo' element={<CompraCatalogo />} />
                    <Route path='/carrinho' element={<Carrinho />} />
                    <Route path='/pagamento' element={<Pagamento />} />
                    <Route path='/pagamento/sucesso' element={<PagamentoSucesso />} />

                    {/* Portal Colaborador */}
                    <Route path='/portal-colaborador' element={<PortalColaborador />} />

                    {/* Ponto Eletrônico — Lazy */}
                    <Route path="/ponto-eletronico" element={<PontoEletronico />} />

                    {/* Dashboard Vendas — Lazy */}
                    <Route path="/dashboard-vendas" element={<DashboardVendas />} />

                    {/* Rota padrão */}
                    <Route path='*' element={<Navigate to="/home" />} />

                </Routes>
            </Suspense>
        </BrowserRouter>
    )
}

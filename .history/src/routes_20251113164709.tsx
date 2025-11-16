import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Navbar } from './components/Navbar/Navbar'

// Paginas de Autenticação
import { Login } from './pages/Login/Login'; // <--- IMPORTADO AQUI
import { PortalColaborador } from './components/PortalColaborador/PortalColaborador';
//Paginas Vendas/Ingressos
import { IngressosLanding } from './pages/IngressosLanding/IngressosLanding';
import { ValidarIngresso } from './pages/ValidarIngresso/ValidarIngresso';
import { CompraData } from './pages/CompraData/CompraData';
import { CompraCatalogo } from './pages/CompraCatalogo/CompraCatalogo';
import { Carrinho } from './pages/Carrinho/Carrinho';
import { Pagamento } from './pages/Pagamento/Pagamento';
import { PagamentoSucesso } from './pages/PagamentoSucesso/PagamentoSucesso';
import { ValidacaoIngressos } from './pages/ValidacaoIngressos/ValidacaoIngressos';
import { PontoEletronico } from './PontoEletronico'; 
import { DashboardVendas } from './DashboardVendas';

export const AppRoutes = () => {

    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path='/home' element={<Home />} />
                
                {/* Rota de Login */}
                <Route path='/login' element={<Login />} />

                {/* Fluxo Principal (Home e Ingressos) */}
                <Route path='/ingressos' element={<IngressosLanding/>} />

                {/* Fluxo de Validação */}
                <Route path='/ingressos/validar' element={<ValidarIngresso />} />
                <Route path='/pedido/:id' element={<ValidacaoIngressos />} /> {/* Rota dinâmica */}

                {/* Fluxo de Compra */}
                <Route path='/ingressos/comprar/data' element={<CompraData />} />
                <Route path='/ingressos/comprar/catalogo' element={<CompraCatalogo />} />
                <Route path='/carrinho' element={<Carrinho />} />
                <Route path='/pagamento' element={<Pagamento />} />
                <Route path='/pagamento/sucesso' element={<PagamentoSucesso />} />
                <Route path='/portal-colaborador' element={<PortalColaborador />} />
                <Route path="/ponto-eletronico" element={<PontoEletronico />} />
                <Route path="/dashboard-vendas" element={<DashboardVendas />} />
                
                {/* Redirecionamento padrão (MANTIDO) */}
                <Route path='*' element={<Navigate to="/home" />} />
            </Routes>
        </BrowserRouter>
    )
}
import "./DashboardVendas.css";

import React, { useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { DollarSign, TrendingUp, Target, User } from "lucide-react";
import { FAKE_ORDER_DATA } from "../../pages/ValidacaoIngressos/ValidacaoIngressos";

// ====== VALORES DE INGRESSO MOCK ======
const getTicketValue = (ticketName: string): number => {
    if (ticketName.includes("Gratuito")) return 0;
    if (ticketName.includes("Meia")) return 20;
    return 40;
};

const DashboardVendas: React.FC = () => {

    // =============================
    // TRANSFORMAR INGRESSOS EM VENDAS
    // =============================
    const allSales = useMemo(() => {
        const list: { id: string; descricao: string; valor: number; timestamp: Date }[] = [];

        FAKE_ORDER_DATA.forEach(order => {
            order.ingressos.forEach(ticket => {
                const value = getTicketValue(ticket.name);

                list.push({
                    id: `${order.id}-${ticket.id}`,
                    descricao: `${ticket.name} - ${order.comprador}`,
                    valor: value,
                    timestamp: new Date(order.data.split("/").reverse().join("-"))
                });
            });
        });

        return list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, []);

    // =============================
    // CÁLCULOS DO DASHBOARD
    // =============================
    const { totalMesAtual, progressoMeta, dadosGrafico } = useMemo(() => {
        const now = new Date();
        const mesAtual = now.getMonth();
        const anoAtual = now.getFullYear();

        let totalMesAtual = 0;
        const agrupado: Record<string, number> = {};

        allSales.forEach(sale => {
            const m = sale.timestamp.getMonth();
            const y = sale.timestamp.getFullYear();

            if (m === mesAtual && y === anoAtual) {
                totalMesAtual += sale.valor;
            }

            const label = `${sale.timestamp.getMonth() + 1}/${sale.timestamp.getFullYear()}`;
            agrupado[label] = (agrupado[label] || 0) + sale.valor;
        });

        const dadosGrafico = Object.keys(agrupado).map(k => ({
            name: k,
            total: agrupado[k]
        }));

        const progressoMeta = Math.min(100, Math.round((totalMesAtual / 15000) * 100));

        return { totalMesAtual, progressoMeta, dadosGrafico };
    }, [allSales]);


    // =============================
    // COMPONENTE DE KPI
    // =============================
    const KpiCard = ({
        icon: Icon,
        title,
        value,
        bg
    }: {
        icon: React.ElementType;
        title: string;
        value: string;
        bg: string;
    }) => (
        <div className={`kpi-card kpi-${bg}`}>
            <div>
                <p className="kpi-title">{title}</p>
                <p className="kpi-value">{value}</p>
            </div>
            <Icon className="kpi-icon" />
        </div>
    );


    // =============================
    // RENDER
    // =============================
    return (
        <div className="dashboard-container">

            <h1 className="dashboard-title">Dashboard de Vendas</h1>

            {/* KPIs */}
            <div className="dashboard-cards-grid">
                <KpiCard
                    icon={DollarSign}
                    title="Vendas no Mês"
                    value={`R$ ${totalMesAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    bg="green"
                />

                <KpiCard
                    icon={Target}
                    title="Progresso da Meta"
                    value={`${progressoMeta}%`}
                    bg="blue"
                />

                <KpiCard
                    icon={TrendingUp}
                    title="Meta Mensal"
                    value="R$ 15.000,00"
                    bg="orange"
                />

                <KpiCard
                    icon={User}
                    title="Ranking Geral"
                    value="#3 (Mock)"
                    bg="purple"
                />
            </div>

            {/* GRÁFICO */}
            <div className="dashboard-chart-container">
                <h2 className="dashboard-chart-title">Vendas por Mês</h2>

                <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                        <LineChart data={dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="total"
                                stroke="#22c55e"
                                strokeWidth={3}
                                dot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* LISTA DE ÚLTIMAS VENDAS */}
            <div className="dashboard-table-wrapper">
                <h2 className="dashboard-chart-title">Últimas Vendas</h2>

                {allSales.length === 0 ? (
                    <p className="text-gray-500">Nenhuma venda encontrada.</p>
                ) : (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Descrição</th>
                                <th>Valor</th>
                                <th>Data</th>
                            </tr>
                        </thead>

                        <tbody>
                            {allSales.slice(0, 5).map(sale => (
                                <tr key={sale.id}>
                                    <td>{sale.descricao}</td>
                                    <td>R$ {sale.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                                    <td>{sale.timestamp.toLocaleDateString("pt-BR")}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

        </div>
    );
};

export default DashboardVendas;

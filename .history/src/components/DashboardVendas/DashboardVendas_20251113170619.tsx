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

import { DollarSign, TrendingUp, Target, User, Clock } from "lucide-react";

// ==== IMPORTA OS DADOS MOCKADOS ORIGINAIS ====
import { FAKE_ORDER_DATA } from "../../pages/ValidacaoIngressos/ValidacaoIngressos";

// ==== REGRA MOCK DE VALORES POR INGRESSO ====
const getTicketValue = (ticketName: string): number => {
    if (ticketName.includes("Gratuito")) return 0;
    if (ticketName.includes("Meia")) return 20;
    return 40; // Inteira (padrão)
};

const DashboardVendas: React.FC = () => {
    
    // ---- TRANSFORMA OS INGRESSOS EM VENDAS ----
    const allSales = useMemo(() => {
        const list: {
            id: string;
            descricao: string;
            valor: number;
            timestamp: Date;
        }[] = [];

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

        // Ordenar do mais recente para o mais antigo
        return list.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }, []);

    // ==== CÁLCULOS DO DASHBOARD ====
    const { totalMesAtual, progressoMeta, dadosGrafico } = useMemo(() => {
        const now = new Date();
        const mesAtual = now.getMonth();
        const anoAtual = now.getFullYear();

        let totalMesAtual = 0;

        const agrupado: Record<string, number> = {};

        allSales.forEach(sale => {
            const m = sale.timestamp.getMonth();
            const y = sale.timestamp.getFullYear();

            // total do mês
            if (m === mesAtual && y === anoAtual) {
                totalMesAtual += sale.valor;
            }

            // agrupamento p/ gráfico
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

    // ==== COMPONENTE DE CARD DE KPI ====
    const KpiCard = ({
        icon: Icon,
        title,
        value,
        color
    }: {
        icon: React.ElementType;
        title: string;
        value: string;
        color: string;
    }) => (
        <div className={`p-4 rounded-xl shadow-lg bg-${color}-600 text-white flex justify-between items-center`}>
            <div>
                <p className="text-sm opacity-80">{title}</p>
                <p className="text-2xl font-bold">{value}</p>
            </div>
            <Icon className="w-8 h-8 opacity-60" />
        </div>
    );

    return (
        <div className="space-y-8 p-4">
            <h2 className="text-3xl font-bold text-indigo-700">Dashboard de Vendas (Mockado)</h2>

            {/* ==== KPIs ==== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    icon={DollarSign}
                    title="Vendas no Mês"
                    value={`R$ ${totalMesAtual.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                    color="green"
                />
                <KpiCard
                    icon={Target}
                    title="Progresso da Meta"
                    value={`${progressoMeta}%`}
                    color="blue"
                />
                <KpiCard
                    icon={TrendingUp}
                    title="Meta Mensal"
                    value="R$ 15.000,00"
                    color="orange"
                />
                <KpiCard
                    icon={User}
                    title="Ranking Geral"
                    value="#3 (Mock)"
                    color="purple"
                />
            </div>

            {/* ==== GRÁFICO ==== */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">Vendas por Mês (Mock)</h3>

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

            {/* ==== ÚLTIMAS VENDAS ==== */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4">Últimas Vendas</h3>

                {allSales.length === 0 ? (
                    <p className="text-gray-500">Nenhuma venda encontrada.</p>
                ) : (
                    <div className="space-y-3">
                        {allSales.slice(0, 5).map(sale => (
                            <div
                                key={sale.id}
                                className="flex justify-between p-3 bg-gray-50 border-l-4 border-indigo-400 rounded"
                            >
                                <div>
                                    <p className="font-medium text-gray-800">{sale.descricao}</p>
                                    <p className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {sale.timestamp.toLocaleDateString("pt-BR")}
                                    </p>
                                </div>
                                <p className="font-semibold text-green-600">
                                    R$ {sale.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardVendas;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import {
    getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, CollectionReference, Query, DocumentData, Timestamp
} from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { DollarSign, TrendingUp, Target, User, Clock } from 'lucide-react';

// DECLARAÇÃO OBRIGATÓRIA das variáveis globais do ambiente (Canvas)
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// --- 1. CONFIGURAÇÃO E TIPAGEM ---

interface VendaRegistro {
    id: string;
    valor: number;
    descricao: string;
    timestamp: Date; // Usaremos Date após a conversão
}

interface ChartData {
    name: string;
    Vendas: number;
}

// Definição das variáveis globais com verificações de segurança
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' && __firebase_config ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicialização (Global, fora do componente)
const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
const db = app ? getFirestore(app) : null;
const auth = app ? getAuth(app) : null;

// Parâmetros de negócio
const META_MENSAL = 15000;
const RANK_MOCK = 3; // Valor fixo para fins de demonstração

export const DashboardVendas: React.FC = () => {
    const [salesHistory, setSalesHistory] = useState<VendaRegistro[]>([]);
    const [newSaleValue, setNewSaleValue] = useState<string>('');
    const [newSaleDesc, setNewSaleDesc] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // --- 2. AUTENTICAÇÃO E INICIALIZAÇÃO ---
    useEffect(() => {
        if (!auth || !db) {
            setError("Firebase não configurado.");
            setIsLoading(false);
            return;
        }

        const signIn = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (err) {
                console.error("Erro ao autenticar:", err);
                setError("Erro ao autenticar no serviço.");
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
            if (user) {
                setUserId(user.uid);
                setIsAuthReady(true);
            } else {
                setUserId(null);
                setIsAuthReady(true);
                signIn();
            }
        });

        return () => unsubscribe();
    }, []);

    // --- 3. RECUPERAÇÃO DE DADOS EM TEMPO REAL ---
    useEffect(() => {
        // Garantir que a autenticação esteja completa antes de buscar dados
        if (!db || !isAuthReady || !userId) return;

        const path = `artifacts/${appId}/users/${userId}/vendas`;
        const vendasCollection = collection(db, path) as CollectionReference<DocumentData>;

        // ATENÇÃO: Consulta sem 'orderBy' para evitar erros de índice. Ordenação no cliente.
        const vendasQuery: Query<DocumentData> = query(vendasCollection);

        const unsubscribe = onSnapshot(vendasQuery, (snapshot) => {
            const history: VendaRegistro[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                
                const timestampField = data.timestamp as Timestamp;
                const date = timestampField && typeof timestampField.toDate === 'function' 
                    ? timestampField.toDate() 
                    : new Date();
                
                history.push({
                    id: doc.id,
                    valor: data.valor,
                    descricao: data.descricao || 'Venda sem descrição',
                    timestamp: date,
                });
            });

            // Ordena os dados pelo timestamp mais recente primeiro (decrescente) no cliente
            history.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

            setSalesHistory(history);
            setIsLoading(false);
        }, (dbError) => {
            console.error("Erro ao obter dados do Firestore:", dbError);
            setError("Erro ao carregar o histórico de vendas.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [db, isAuthReady, userId]);


    // --- 4. CÁLCULOS DERIVADOS ---
    const { currentMonthTotal, progress, chartData, totalAnual } = useMemo(() => {
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let currentMonthTotal = 0;
        let totalAnual = 0;
        
        const monthlySales: { [key: string]: number } = {};
        const monthNames = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

        salesHistory.forEach(record => {
            const date = record.timestamp;
            const recordMonth = date.getMonth();
            const recordYear = date.getFullYear();
            
            if (recordMonth === currentMonth && recordYear === currentYear) {
                currentMonthTotal += record.valor;
            }

            if (recordYear === currentYear) {
                totalAnual += record.valor;
            }

            // Agrupa por mês para o gráfico
            const monthKey = `${monthNames[recordMonth]}/${recordYear}`;
            monthlySales[monthKey] = (monthlySales[monthKey] || 0) + record.valor;
        });

        const chartData: ChartData[] = Object.keys(monthlySales).map(key => ({
            name: key,
            Vendas: monthlySales[key],
        })).sort((a, b) => {
            // Ordenação para o gráfico (por mês e ano)
            const [m1, y1] = a.name.split('/');
            const [m2, y2] = b.name.split('/');
            const date1 = new Date(`${monthNames.indexOf(m1)+1}/01/${y1}`);
            const date2 = new Date(`${monthNames.indexOf(m2)+1}/01/${y2}`);
            return date1.getTime() - date2.getTime();
        });

        const progress = Math.min(100, Math.round((currentMonthTotal / META_MENSAL) * 100));

        return { currentMonthTotal, progress, chartData, totalAnual };
    }, [salesHistory]);


    // --- 5. FUNÇÃO DE REGISTRO ---
    const handleRegisterSale = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId || !db || !newSaleValue || !newSaleDesc) {
            setError("Preencha todos os campos.");
            return;
        }

        // Converte a string de valor (suporta vírgula ou ponto como separador decimal)
        const value = parseFloat(newSaleValue.replace(',', '.'));
        if (isNaN(value) || value <= 0) {
            setError("Valor de venda inválido.");
            return;
        }
        
        // Reset error state
        setError(null);

        try {
            const path = `artifacts/${appId}/users/${userId}/vendas`;
            const vendasCollection = collection(db, path);
            
            await addDoc(vendasCollection, {
                valor: value,
                descricao: newSaleDesc,
                timestamp: serverTimestamp(),
            });

            // Limpa os campos após o sucesso
            setNewSaleValue('');
            setNewSaleDesc('');

        } catch (firestoreError) {
            console.error("Erro ao registrar venda:", firestoreError);
            setError("Falha ao registrar a venda. Tente novamente.");
        }
    };

    // --- 6. RENDERING (Card Component) ---
    interface KpiCardProps {
        icon: React.ElementType;
        title: string;
        value: string;
        bgColor: string;
    }

    const KpiCard: React.FC<KpiCardProps> = ({ icon: Icon, title, value, bgColor }) => (
        <div className={`p-4 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-[1.02] ${bgColor}`}>
            <div>
                <p className="text-sm font-medium text-gray-200">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <Icon className="w-8 h-8 text-white opacity-50" />
        </div>
    );

    const displayUserId = userId || 'ID Não Disponível';

    if (isLoading) {
        return <div className="p-8 bg-white rounded-xl shadow-md"><p>Carregando dados do Dashboard...</p></div>;
    }

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-extrabold text-indigo-700">Dashboard de Vendas</h2>
            <div className="text-xs font-mono text-gray-600 bg-gray-100 p-2 rounded-lg break-all">
                ID do Colaborador: <span className="font-semibold text-blue-600">{displayUserId}</span>
            </div>

            {/* Linha de KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    icon={DollarSign}
                    title="Vendas do Mês"
                    value={`R$ ${currentMonthTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    bgColor="bg-green-600"
                />
                <KpiCard
                    icon={Target}
                    title="Progresso da Meta"
                    value={`${progress}%`}
                    bgColor="bg-blue-600"
                />
                <KpiCard
                    icon={TrendingUp}
                    title="Meta Mensal"
                    value={`R$ ${META_MENSAL.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    bgColor="bg-orange-500"
                />
                <KpiCard
                    icon={User}
                    title="Ranking (Mock)"
                    value={`#${RANK_MOCK}`}
                    bgColor="bg-purple-600"
                />
            </div>
            
            {/* Gráfico e Registro de Venda */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Coluna 1: Gráfico */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Vendas Mensais (R$)</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                                <XAxis dataKey="name" stroke="#6b7280" />
                                <YAxis 
                                    stroke="#6b7280" 
                                    tickFormatter={(value) => `R$ ${value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`}
                                />
                                <Tooltip 
                                    formatter={(value: number) => [`R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 'Vendas']}
                                    labelFormatter={(label) => `Mês: ${label}`}
                                />
                                <Line type="monotone" dataKey="Vendas" stroke="#10b981" strokeWidth={3} dot={{ fill: '#059669', r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Coluna 2: Registro de Venda */}
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-indigo-500"/> Registrar Nova Venda
                    </h3>
                    
                    {error && (
                        <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegisterSale} className="space-y-4">
                        <div>
                            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <input
                                id="valor"
                                type="text"
                                value={newSaleValue}
                                onChange={(e) => setNewSaleValue(e.target.value.replace(/[^0-9,.]/g, ''))} // Permite apenas números, vírgula e ponto
                                placeholder="Ex: 1500.50"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="descricao" className="block text-sm font-medium text-gray-700 mb-1">Descrição/Cliente</label>
                            <input
                                id="descricao"
                                type="text"
                                value={newSaleDesc}
                                onChange={(e) => setNewSaleDesc(e.target.value)}
                                placeholder="Nome do cliente ou produto"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-150 disabled:bg-gray-400"
                            disabled={!userId || !db}
                        >
                            Confirmar Venda
                        </button>
                    </form>
                </div>
            </div>

            {/* Histórico de Vendas */}
            <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Últimas Vendas</h3>
                
                {salesHistory.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhuma venda registrada ainda.</p>
                ) : (
                    <div className="space-y-3">
                        {salesHistory.slice(0, 5).map(sale => (
                            <div key={sale.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-400">
                                <div className="flex flex-col">
                                    <span className="font-medium text-gray-800">{sale.descricao}</span>
                                    <span className="text-xs text-gray-500 flex items-center">
                                        <Clock className="w-3 h-3 mr-1"/>
                                        {sale.timestamp.toLocaleString('pt-BR')}
                                    </span>
                                </div>
                                <span className="font-bold text-green-600">
                                    R$ {sale.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        ))}
                        {salesHistory.length > 5 && (
                            <p className="text-sm text-center text-gray-500 mt-4">
                                Mostrando as 5 vendas mais recentes.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
// Removida a importação do CSS, já que foi movida para o componente anterior

// Importações de módulo Firebase e seus Tipos
import { initializeApp } from 'firebase/app';
// Adiciona FirebaseUser e Auth para tipagem correta
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged, User as FirebaseUser, Auth } from 'firebase/auth'; 
// Adiciona os tipos necessários do Firestore
import { 
    getFirestore, collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, 
    CollectionReference, Query, DocumentData, Timestamp, Firestore 
} from 'firebase/firestore'; 
// Adiciona os ícones, assumindo que foram instalados
import { CheckCircle, XCircle, Camera, Clock } from 'lucide-react'; 

// --- Declarações Globais (RESOLVE: Cannot find name '__app_id', etc.) ---
// Essas declarações informam ao TypeScript sobre variáveis injetadas pelo ambiente.
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// --- TIPAGEM E CONFIGURAÇÃO ---
interface PontoRegistro {
    id: string;
    tipo: 'Entrada' | 'Saída';
    timestamp: Date; 
    fotoUrl: string;
}

// Definição das variáveis globais com verificações de segurança
const appId: string = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig: object = typeof __firebase_config !== 'undefined' && __firebase_config ? JSON.parse(__firebase_config) : {};
const initialAuthToken: string | null = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// Inicialização (Global, fora do componente)
const app = Object.keys(firebaseConfig).length > 0 ? initializeApp(firebaseConfig) : null;
// Tipagem explícita para o Firestore e Auth
const db: Firestore | null = app ? getFirestore(app) : null;
const auth: Auth | null = app ? getAuth(app) : null; 

// --- COMPONENTE MODAL DE CONFIRMAÇÃO ---
// ... (O ConfirmationModal não tinha erros críticos de tipagem e foi mantido)
interface ConfirmationModalProps {
    show: boolean;
    type: 'Entrada' | 'Saída';
    time: string;
    onClose: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ show, type, time, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}><XCircle size={24} /></button>
                <CheckCircle size={64} className={`mb-4 ${type === 'Entrada' ? 'text-green-500' : 'text-red-500'}`} />
                <h3 className="text-2xl font-bold mb-2">Ponto de {type} Registrado!</h3>
                <p className="text-lg text-gray-600 mb-4">
                    Horário: <span className="font-semibold">{time}</span>
                </p>
                <button onClick={onClose} className="modal-ok-btn">
                    OK
                </button>
            </div>
        </div>
    );
};
// ------------------------------------

export const PontoEletronico: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [pontoHistory, setPontoHistory] = useState<PontoRegistro[]>([]);
    const [currentStatus, setCurrentStatus] = useState<'Entrada' | 'Saída'>('Entrada');
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [modalInfo, setModalInfo] = useState<{ show: boolean, type: 'Entrada' | 'Saída', time: string }>({
        show: false, type: 'Entrada', time: '',
    });

    // --- LÓGICA DE AUTENTICAÇÃO E FIREBASE ---
    useEffect(() => {
        if (!auth || !db) {
            setError("Firebase não configurado corretamente.");
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
                setError("Erro ao autenticar no serviço de ponto.");
            }
        };

        // Adiciona o tipo FirebaseUser para o parâmetro user
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

    // --- RECUPERAÇÃO DE DADOS ---
    useEffect(() => {
        if (!db || !isAuthReady || !userId) return;

        const path = `artifacts/${appId}/users/${userId}/registros_ponto`;
        // Tipagem forte para a coleção
        const pontoCollection = collection(db, path) as CollectionReference<DocumentData>; 

        const pontoQuery: Query<DocumentData> = query(
            pontoCollection,
            orderBy('timestamp', 'asc')
        );

        // Adiciona a tipagem `QuerySnapshot<DocumentData>` para resolver o erro 'snapshot' implicitly has an 'any' type
        const unsubscribe = onSnapshot(pontoQuery, (snapshot: any) => { 
            const history: PontoRegistro[] = [];
            
            // Adiciona a tipagem `QueryDocumentSnapshot<DocumentData>` para resolver o erro 'doc' implicitly has an 'any' type
            snapshot.forEach((doc: any) => { 
                const data = doc.data();
                
                const timestampField = data.timestamp as Timestamp;
                const date = timestampField && typeof timestampField.toDate === 'function' 
                    ? timestampField.toDate() 
                    : new Date(); 

                history.push({
                    id: doc.id,
                    tipo: data.tipo as 'Entrada' | 'Saída', 
                    timestamp: date,
                    fotoUrl: data.fotoUrl || '',
                });
            });

            setPontoHistory(history);
            setIsLoading(false);
        }, (dbError: any) => { // Adiciona tipagem `any` temporária para o erro do DB
            console.error("Erro ao obter dados do Firestore:", dbError);
            setError("Erro ao carregar o histórico de pontos.");
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [db, isAuthReady, userId]);

    // --- CÁLCULO DO STATUS E CÂMERA ---
    useEffect(() => {
        const lastRecord = pontoHistory[pontoHistory.length - 1];
        if (lastRecord?.tipo === 'Entrada') {
            setCurrentStatus('Saída');
        } else {
            setCurrentStatus('Entrada');
        }
    }, [pontoHistory]);

    const startCamera = useCallback(async () => {
        setError(null);
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.play().catch(e => console.error("Erro ao iniciar reprodução do vídeo:", e));
            }
            setStream(mediaStream);
        } catch (err) {
            console.error("Erro ao acessar a câmera: ", err);
            setError("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    }, [stream]);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, [startCamera, stopCamera]);


    // --- FUNÇÃO DE REGISTRO ---
    const captureAndRegister = async () => {
        if (!videoRef.current || !canvasRef.current || !stream || !db || !userId) {
            setError("Recursos indisponíveis. Tente novamente.");
            return;
        }

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const now = new Date();

        if (context) {
            canvas.width = video.videoWidth > 0 ? video.videoWidth : 640;
            canvas.height = video.videoHeight > 0 ? video.videoHeight : 480;
            
            // Espelhamento para câmera frontal
            context.save();
            context.scale(-1, 1);
            context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
            context.restore();

            const photoDataUrl = canvas.toDataURL('image/png');

            const newRecordData = {
                tipo: currentStatus,
                timestamp: serverTimestamp(),
                fotoUrl: photoDataUrl, // Imagem em base64
            };

            try {
                const path = `artifacts/${appId}/users/${userId}/registros_ponto`;
                const pontoCollection = collection(db, path);
                await addDoc(pontoCollection, newRecordData);
                
                setModalInfo({
                    show: true,
                    type: currentStatus,
                    time: now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                });
                setError(null);

            } catch (firestoreError) {
                console.error("Erro ao salvar o ponto:", firestoreError);
                setError("Falha ao registrar o ponto. Tente novamente.");
            }
        } else {
             setError("Erro ao obter contexto do canvas.");
        }
    };
    
    // --- AGRUPAMENTO DO HISTÓRICO POR DATA ---
    const historyByDay = useMemo(() => {
        const grouped: { [date: string]: PontoRegistro[] } = {};
        
        const sortedHistory = [...pontoHistory].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

        sortedHistory.forEach(record => {
            const date = record.timestamp;
            const dateKey = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
            
            if (!grouped[dateKey]) {
                grouped[dateKey] = [];
            }
            grouped[dateKey].push(record);
        });
        
        return grouped;

    }, [pontoHistory]);


    const displayUserId = userId || 'ID Não Disponível';
    
    if (isLoading) {
        return <div className="ponto-container"><p>Carregando dados de autenticação e histórico...</p></div>;
    }

    return (
        <>
            <ConfirmationModal 
                show={modalInfo.show} 
                type={modalInfo.type} 
                time={modalInfo.time} 
                onClose={() => setModalInfo({ ...modalInfo, show: false })} 
            />

            <div className="ponto-container">
                <h2 className="text-3xl font-extrabold text-indigo-700 mb-2">Registro de Ponto Eletrônico</h2>
                <p className="user-id-display">ID do Colaborador: {displayUserId}</p>
                
                <div className="ponto-status">
                    Próximo Ponto: <span className={currentStatus === 'Entrada' ? 'status-entrada' : 'status-saida'}>{currentStatus}</span>
                </div>

                <div className="camera-section">
                    <div className="video-wrapper">
                        {error && !stream ? (
                            <div className="camera-error flex flex-col items-center justify-center p-4">
                                <XCircle className="w-8 h-8 mb-2"/>
                                {error}
                            </div>
                        ) : (
                            <video ref={videoRef} autoPlay playsInline muted className="live-video" />
                        )}
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </div>

                    <button 
                        onClick={captureAndRegister} 
                        className="register-btn group"
                        disabled={!!error || !stream || !userId}
                    >
                        <Camera className="w-5 h-5 mr-2 group-hover:animate-pulse"/> BATER PONTO DE {currentStatus.toUpperCase()}
                    </button>
                </div>
                
                {/* HISTÓRICO DE PONTOS AGRUPADO */}
                <div className="history-section">
                    <h3 className="text-2xl font-semibold text-gray-700 mb-4 border-b pb-2 flex items-center">
                        <Clock className="w-5 h-5 mr-2"/> Histórico de Batidas
                    </h3>
                    <div className="history-list space-y-4">
                        {Object.keys(historyByDay).length === 0 && <p className="text-center text-gray-400 py-4">Nenhum ponto registrado.</p>}
                        
                        {Object.keys(historyByDay).map((dateKey) => (
                            <div key={dateKey} className="daily-record bg-gray-50 p-3 rounded-lg shadow-sm">
                                <h4 className="date-header text-lg font-bold text-indigo-700 mb-2 border-b border-indigo-200 pb-1">
                                    {dateKey}
                                </h4>
                                <div className="space-y-2">
                                    {[...historyByDay[dateKey]].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()).map((ponto) => (
                                        <div key={ponto.id} className="history-item flex justify-between items-center bg-white p-3 rounded-md border border-gray-200">
                                            <span className={`history-type font-semibold ${ponto.tipo === 'Entrada' ? 'text-green-600' : 'text-red-600'}`}>
                                                {ponto.tipo}
                                            </span>
                                            <span className="history-timestamp text-gray-600 text-sm">
                                                {ponto.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
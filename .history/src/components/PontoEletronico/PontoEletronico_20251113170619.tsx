import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';

// Firebase core
import { initializeApp } from 'firebase/app';

// Importação correta com type-only (por causa do verbatimModuleSyntax)
import {
    getAuth,
    signInAnonymously,
    signInWithCustomToken,
    onAuthStateChanged
} from 'firebase/auth';
import type { User as FirebaseUser, Auth } from 'firebase/auth';

import {
    getFirestore,
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    serverTimestamp,
} from 'firebase/firestore';
import type {
    CollectionReference,
    Query,
    DocumentData,
    Timestamp,
    Firestore
} from 'firebase/firestore';

import { CheckCircle, XCircle, Camera, Clock } from 'lucide-react';

// Declarações globais
declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

// Tipos
interface PontoRegistro {
    id: string;
    tipo: 'Entrada' | 'Saída';
    timestamp: Date;
    fotoUrl: string;
}

const appId: string = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken: string | null =
    typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

// Modal
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
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <XCircle size={24} />
                </button>

                <CheckCircle
                    size={64}
                    className={`mb-4 ${type === 'Entrada' ? 'text-green-500' : 'text-red-500'}`}
                />

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

// -------- COMPONENTE PRINCIPAL ---------

const PontoEletronico: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [pontoHistory, setPontoHistory] = useState<PontoRegistro[]>([]);
    const [currentStatus, setCurrentStatus] = useState<'Entrada' | 'Saída'>('Entrada');
    const [error, setError] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const [modalInfo, setModalInfo] = useState({
        show: false,
        type: 'Entrada' as 'Entrada' | 'Saída',
        time: '',
    });

    useEffect(() => {
        const signIn = async () => {
            try {
                if (initialAuthToken) {
                    await signInWithCustomToken(auth, initialAuthToken);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (err) {
                console.error("Erro ao autenticar:", err);
                setError("Erro ao autenticar.");
            }
        };

        const unsub = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
            if (user) {
                setUserId(user.uid);
                setIsAuthReady(true);
            } else {
                setIsAuthReady(true);
                signIn();
            }
        });

        return () => unsub();
    }, []);

    useEffect(() => {
        if (!isAuthReady || !userId) return;

        const path = `artifacts/${appId}/users/${userId}/registros_ponto`;
        const ref = collection(db, path) as CollectionReference<DocumentData>;
        const q: Query<DocumentData> = query(ref, orderBy("timestamp", "asc"));

        return onSnapshot(
            q,
            (snap) => {
                const arr: PontoRegistro[] = [];

                snap.forEach((doc: any) => {
                    const d = doc.data();
                    const ts = d.timestamp as Timestamp;

                    arr.push({
                        id: doc.id,
                        tipo: d.tipo,
                        timestamp: ts?.toDate() ?? new Date(),
                        fotoUrl: d.fotoUrl || "",
                    });
                });

                setPontoHistory(arr);
                setIsLoading(false);
            },
            (err) => {
                console.error(err);
                setError("Erro ao carregar dados.");
            }
        );
    }, [isAuthReady, userId]);

    useEffect(() => {
        const last = pontoHistory[pontoHistory.length - 1];
        setCurrentStatus(last?.tipo === "Entrada" ? "Saída" : "Entrada");
    }, [pontoHistory]);

    const startCamera = useCallback(async () => {
        try {
            const media = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = media;
                await videoRef.current.play();
            }
            setStream(media);
        } catch (err) {
            setError("Erro ao acessar câmera.");
        }
    }, []);

    useEffect(() => {
        startCamera();
        return () => stream?.getTracks().forEach((t) => t.stop());
    }, [startCamera]);

    const captureAndRegister = async () => {
        if (!videoRef.current || !canvasRef.current || !userId) return;

        const ctx = canvasRef.current.getContext("2d");
        if (!ctx) return;

        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;

        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, -canvasRef.current.width, 0);
        ctx.restore();

        const photo = canvasRef.current.toDataURL("image/png");

        const path = `artifacts/${appId}/users/${userId}/registros_ponto`;
        await addDoc(collection(db, path), {
            tipo: currentStatus,
            timestamp: serverTimestamp(),
            fotoUrl: photo,
        });

        setModalInfo({
            show: true,
            type: currentStatus,
            time: new Date().toLocaleTimeString("pt-BR"),
        });
    };

    const historyByDay = useMemo(() => {
        const groups: Record<string, PontoRegistro[]> = {};

        pontoHistory.forEach((item) => {
            const key = item.timestamp.toLocaleDateString("pt-BR");
            if (!groups[key]) groups[key] = [];
            groups[key].push(item);
        });

        return groups;
    }, [pontoHistory]);

    if (isLoading) return <p>Carregando...</p>;

    return (
        <>
            <ConfirmationModal
                show={modalInfo.show}
                type={modalInfo.type}
                time={modalInfo.time}
                onClose={() => setModalInfo({ ...modalInfo, show: false })}
            />

            <div className="ponto-container">
                <h2 className="text-3xl font-bold text-indigo-700">Registro de Ponto</h2>
                <p className="user-id-display">ID: {userId}</p>

                <div className="ponto-status">
                    Próximo ponto:
                    <span className={currentStatus === "Entrada" ? "status-entrada" : "status-saida"}>
                        {currentStatus}
                    </span>
                </div>

                <div className="camera-section">
                    <div className="video-wrapper">
                        <video ref={videoRef} autoPlay playsInline muted className="live-video" />
                        <canvas ref={canvasRef} style={{ display: "none" }} />
                    </div>

                    <button onClick={captureAndRegister} className="register-btn">
                        <Camera className="w-5 h-5 mr-2" /> Bater ponto de {currentStatus}
                    </button>
                </div>

                <div className="history-section">
                    <h3 className="text-xl font-bold mb-3">Histórico</h3>

                    {Object.keys(historyByDay).map((day) => (
                        <div key={day} className="daily-record p-3 rounded-lg bg-gray-50">
                            <h4 className="font-bold text-indigo-600 mb-2">{day}</h4>

                            {historyByDay[day].map((h) => (
                                <div key={h.id} className="flex justify-between bg-white p-3 mb-2 rounded shadow">
                                    <span>{h.tipo}</span>
                                    <span>{h.timestamp.toLocaleTimeString("pt-BR")}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default PontoEletronico;

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
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
  serverTimestamp
} from 'firebase/firestore';

import type {
  CollectionReference,
  Query,
  DocumentData,
  Timestamp,
  Firestore
} from 'firebase/firestore';

import { CheckCircle, XCircle, Camera } from 'lucide-react';

import "./PontoEletronico.css";

declare const __app_id: string | undefined;
declare const __firebase_config: string | undefined;
declare const __initial_auth_token: string | undefined;

interface PontoRegistro {
  id: string;
  tipo: "Entrada" | "Saída";
  timestamp: Date;
  fotoUrl: string;
}

const appId = __app_id ?? "default-app-id";
const firebaseConfig = __firebase_config ? JSON.parse(__firebase_config) : {};
const initialAuthToken = __initial_auth_token ?? null;

const app = initializeApp(firebaseConfig);
const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);

const ConfirmationModal = ({ show, type, time, onClose }: any) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <XCircle size={24} />
        </button>

        <CheckCircle
          size={64}
          className={`mb-4 ${type === "Entrada" ? "text-green-500" : "text-red-500"}`}
        />

        <h3 className="text-2xl font-bold mb-2">Ponto de {type} Registrado!</h3>
        <p className="text-lg text-gray-600 mb-4">
          Horário: <span className="font-semibold">{time}</span>
        </p>

        <button onClick={onClose} className="modal-ok-btn">OK</button>
      </div>
    </div>
  );
};


const PontoEletronico: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [pontoHistory, setPontoHistory] = useState<PontoRegistro[]>([]);
  const [currentStatus, setCurrentStatus] = useState<"Entrada" | "Saída">("Entrada");
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  const [modalInfo, setModalInfo] = useState({
    show: false,
    type: "Entrada" as "Entrada" | "Saída",
    time: ""
  });

  // Autenticação
  useEffect(() => {
    const doSignIn = async () => {
      if (initialAuthToken) {
        await signInWithCustomToken(auth, initialAuthToken);
      } else {
        await signInAnonymously(auth);
      }
    };

    const unsub = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        setUserId(user.uid);
        setIsAuthReady(true);
      } else {
        setIsAuthReady(true);
        doSignIn();
      }
    });

    return () => unsub();
  }, []);

  // Banco de dados
  useEffect(() => {
    if (!isAuthReady || !userId) return;

    const path = `artifacts/${appId}/users/${userId}/registros_ponto`;
    const ref = collection(db, path) as CollectionReference<DocumentData>;
    const q: Query<DocumentData> = query(ref, orderBy("timestamp", "asc"));

    return onSnapshot(q, (snap) => {
      const arr: PontoRegistro[] = [];

      snap.forEach((doc: any) => {
        const d = doc.data();
        const ts = d.timestamp as Timestamp;

        arr.push({
          id: doc.id,
          tipo: d.tipo,
          timestamp: ts?.toDate() ?? new Date(),
          fotoUrl: d.fotoUrl
        });
      });

      setPontoHistory(arr);
    });
  }, [isAuthReady, userId]);

  // Definir status automático
  useEffect(() => {
    const last = pontoHistory[pontoHistory.length - 1];
    setCurrentStatus(last?.tipo === "Entrada" ? "Saída" : "Entrada");
  }, [pontoHistory]);

  // Iniciar câmera
  const startCamera = useCallback(async () => {
    const media = await navigator.mediaDevices.getUserMedia({ video: true });

    if (videoRef.current) {
      videoRef.current.srcObject = media;
      await videoRef.current.play();
    }

    setStream(media);
  }, []);

  useEffect(() => {
    startCamera();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, [startCamera]);

  const captureAndRegister = async () => {
    if (!canvasRef.current || !videoRef.current || !userId) return;

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
      fotoUrl: photo
    });

    setModalInfo({
      show: true,
      type: currentStatus,
      time: new Date().toLocaleTimeString("pt-BR")
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

  return (
    <>
      <ConfirmationModal
        show={modalInfo.show}
        type={modalInfo.type}
        time={modalInfo.time}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
      />

      <div className="ponto-container">
        <h2 className="page-title">Registro de Ponto</h2>

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

          <button className="register-btn" onClick={captureAndRegister}>
            <Camera size={22} />
            Registrar {currentStatus}
          </button>
        </div>

        <div className="history-section">
          <h3 className="history-title">Histórico</h3>

          {Object.keys(historyByDay).map((day) => (
            <div key={day} className="daily-record">
              <h4 className="history-day">{day}</h4>

              {historyByDay[day].map((h) => (
                <div key={h.id} className="history-item">
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

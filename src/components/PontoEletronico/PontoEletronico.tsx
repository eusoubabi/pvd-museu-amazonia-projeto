import React, { useState, useEffect, useRef, useCallback } from "react";
import { Camera, CheckCircle, XCircle } from "lucide-react";
import "./PontoEletronico.css";

// Tipo do registro
interface PontoRegistro {
  id: string;
  tipo: "Entrada" | "Saída";
  timestamp: string;
  foto: string;
}

// Modal
const ConfirmationModal = ({
  show,
  type,
  time,
  onClose
}: {
  show: boolean;
  type: "Entrada" | "Saída";
  time: string;
  onClose: () => void;
}) => {
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
          Horário: <strong>{time}</strong>
        </p>

        <button onClick={onClose} className="modal-ok-btn">
          OK
        </button>
      </div>
    </div>
  );
};

// Componente principal MOCKADO
const PontoEletronico: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentStatus, setCurrentStatus] = useState<"Entrada" | "Saída">("Entrada");
  const [history, setHistory] = useState<PontoRegistro[]>([]);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    type: "Entrada" as "Entrada" | "Saída",
    time: ""
  });

  // Carregar histórico do localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ponto-history");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  // Salvar quando atualizar
  useEffect(() => {
    localStorage.setItem("ponto-history", JSON.stringify(history));
  }, [history]);

  // Lógica Entrada → Saída → Entrada...
  useEffect(() => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setCurrentStatus(last.tipo === "Entrada" ? "Saída" : "Entrada");
  }, [history]);

  // Iniciar câmera
  const startCamera = useCallback(async () => {
    try {
      const media = await navigator.mediaDevices.getUserMedia({ video: true });

      if (videoRef.current) {
        videoRef.current.srcObject = media;
        await videoRef.current.play();
      }
    } catch (e) {
      console.error("Erro ao acessar câmera:", e);
    }
  }, []);

  useEffect(() => {
    startCamera();
  }, [startCamera]);

  // Registrar ponto (mock)
  const captureAndRegister = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;

    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, -canvasRef.current.width, 0);
    ctx.restore();

    const photo = canvasRef.current.toDataURL("image/png");
    const timestamp = new Date().toISOString();

    const registro: PontoRegistro = {
      id: timestamp,
      tipo: currentStatus,
      timestamp,
      foto: photo
    };

    setHistory((prev) => [...prev, registro]);

    setModalInfo({
      show: true,
      type: currentStatus,
      time: new Date(timestamp).toLocaleTimeString("pt-BR")
    });
  };

  return (
    <>
      <ConfirmationModal
        show={modalInfo.show}
        type={modalInfo.type}
        time={modalInfo.time}
        onClose={() => setModalInfo({ ...modalInfo, show: false })}
      />

      <div className="ponto-container">
        <h2 className="text-3xl font-bold text-indigo-700">Registro de Ponto </h2>

        <div className="ponto-status">
          Próximo ponto:
          <span className={currentStatus === "Entrada" ? "status-entrada" : "status-saida"}>
            {currentStatus}
          </span>
        </div>

        <div className="camera-section">
          <video ref={videoRef} autoPlay playsInline muted className="live-video" />
          <canvas ref={canvasRef} hidden />

          <button className="register-btn" onClick={captureAndRegister}>
            <Camera className="w-5 h-5 mr-2" />
            Registrar {currentStatus}
          </button>
        </div>

        <div className="history-section">
          <h3 className="text-xl font-bold mb-3">Histórico</h3>

          {history.map((h) => (
            <div key={h.id} className="history-item">
              <div>
                <p className="font-medium">{h.tipo}</p>
                <p className="text-sm text-gray-500">
                  {new Date(h.timestamp).toLocaleString("pt-BR")}
                </p>
              </div>
              <img src={h.foto} className="history-photo" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PontoEletronico;

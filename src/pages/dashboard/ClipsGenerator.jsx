import { useState, useEffect } from 'react';
import { UploadCloud, Wand2, Scissors, Smartphone, CheckCircle } from 'lucide-react';
import './Clips.css';

export default function ClipsGenerator() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let interval;
    if (isProcessing && progress < 100) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= 98) {
            clearInterval(interval);
            setIsProcessing(false);
            setIsDone(true);
            return 100;
          }
          return p + Math.floor(Math.random() * 15) + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isProcessing, progress]);

  const handleProcess = () => {
    setIsProcessing(true);
    setProgress(0);
    setIsDone(false);
  };

  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>Gerar Clipes (IA)</h1>
          <p>Transforme vídeos brutos em cortes virais automaticamente.</p>
        </div>
      </header>
      
      <div className="view-content clips-layout">
        <div className="ai-workspace glass-panel">
          
          <div className="upload-zone">
            <UploadCloud size={48} className="upload-icon" />
            <h3>Fazer upload de arquivo bruto (.mp4)</h3>
            <p>Arraste seu vídeo longo ou podcast aqui</p>
            <button className="upload-btn">Selecionar Arquivo</button>
          </div>

          <div className="ai-options">
            <h3 className="options-title">Opções de Tratamento IA</h3>
            <div className="options-grid">
              <button className="option-btn active">
                <Wand2 size={18} />
                Aplicar Auto-Color Grading
              </button>
              <button className="option-btn active">
                <Scissors size={18} />
                Cortes Dinâmicos
              </button>
              <button className="option-btn active">
                <Smartphone size={18} />
                Formato 9:16 (Reels/TikTok)
              </button>
            </div>
          </div>

          <div className="action-zone">
            {!isProcessing && !isDone && (
              <button className="process-btn" onClick={handleProcess}>
                <Wand2 size={20} className="pulse-icon" />
                Processar Vídeo
              </button>
            )}

            {isProcessing && (
              <div className="progress-container">
                <div className="progress-bar-bg">
                  <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
                <p>Processando IA... {progress}%</p>
              </div>
            )}

            {isDone && (
              <div className="success-message">
                <CheckCircle size={24} color="#10b981" />
                <p>Clipe gerado e enviado para o Agendador com sucesso!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

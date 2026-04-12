import { useState } from 'react';
import { UploadCloud, Wand2, Scissors, Smartphone, CheckCircle, Send, Loader, AlertCircle, Link } from 'lucide-react';
import './Clips.css';

const BACKEND_URL = 'https://iceolab-backend.onrender.com';

export default function ClipsGenerator() {
  // ── Estado: Publicador de Reels ─────────────────────────────────────
  const [videoUrl, setVideoUrl]     = useState('');
  const [caption, setCaption]       = useState('');
  const [posting, setPosting]       = useState(false);
  const [postResult, setPostResult] = useState(null); // { success, post_id, message } ou { error, detail }
  const [postStep, setPostStep]     = useState('');   // texto do passo atual

  const handlePublish = async () => {
    if (!videoUrl.trim()) return;

    setPosting(true);
    setPostResult(null);
    setPostStep('Enviando para o backend...');

    try {
      setPostStep('Criando container de mídia na Meta...');
      const res = await fetch(`${BACKEND_URL}/api/reels/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: videoUrl.trim(), caption })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setPostResult({ success: true, ...data });
        setPostStep('');
      } else {
        setPostResult({ success: false, ...data });
        setPostStep('');
      }
    } catch (err) {
      setPostResult({ success: false, error: 'Erro de conexão com o backend.', detail: { message: err.message } });
      setPostStep('');
    } finally {
      setPosting(false);
    }
  };

  const handleReset = () => {
    setVideoUrl('');
    setCaption('');
    setPostResult(null);
    setPostStep('');
  };

  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>Publicar Reel</h1>
          <p>Cole o link do seu vídeo e publique direto no Instagram.</p>
        </div>
      </header>

      <div className="view-content clips-layout">
        <div className="ai-workspace glass-panel">

          {/* ── Seção: Link do vídeo ──────────────────────────── */}
          <div className="reel-form-section">
            <label className="reel-label">
              <Link size={16} />
              Link do Vídeo (URL pública e direta)
            </label>
            <input
              type="url"
              className="reel-input"
              placeholder="https://seuservidor.com/video.mp4"
              value={videoUrl}
              onChange={e => setVideoUrl(e.target.value)}
              disabled={posting}
            />
            <p className="reel-hint">
              ⚠️ A URL precisa ser de download direto (sem login). Google Drive não funciona — use Dropbox, S3, Cloudinary, etc.
            </p>
          </div>

          {/* ── Seção: Legenda ───────────────────────────────── */}
          <div className="reel-form-section">
            <label className="reel-label">
              <Wand2 size={16} />
              Legenda
            </label>
            <textarea
              className="reel-textarea"
              placeholder="Escreva sua legenda aqui... Use hashtags para alcançar mais pessoas! 🚀"
              value={caption}
              onChange={e => setCaption(e.target.value)}
              disabled={posting}
              rows={4}
            />
            <p className="reel-char-count">{caption.length}/2200</p>
          </div>

          {/* ── Seção: Opções visuais (decorativas) ─────────── */}
          <div className="ai-options">
            <h3 className="options-title">Configurações do Reel</h3>
            <div className="options-grid">
              <div className="option-btn active">
                <Scissors size={18} />
                Formato 9:16 (Reels)
              </div>
              <div className="option-btn active">
                <Smartphone size={18} />
                Publicação Imediata
              </div>
              <div className="option-btn active">
                <UploadCloud size={18} />
                Via Instagram API
              </div>
            </div>
          </div>

          {/* ── Botão de publicação / estado ────────────────── */}
          <div className="action-zone">

            {!postResult && (
              <button
                className="process-btn"
                onClick={handlePublish}
                disabled={posting || !videoUrl.trim()}
                style={{ opacity: !videoUrl.trim() ? 0.5 : 1 }}
              >
                {posting ? (
                  <>
                    <Loader size={20} style={{ animation: 'spin 1s linear infinite' }} />
                    {postStep || 'Publicando...'}
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Publicar Reel no Instagram
                  </>
                )}
              </button>
            )}

            {posting && (
              <div className="posting-steps">
                <div className="step active">① Criando container de mídia</div>
                <div className="step">② Aguardando processamento da Meta (~1min)</div>
                <div className="step">③ Publicando no perfil</div>
              </div>
            )}

            {postResult?.success && (
              <div className="result-card success-card">
                <CheckCircle size={28} />
                <div>
                  <p className="result-title">Reel publicado com sucesso! 🎉</p>
                  <p className="result-sub">Conta: @{postResult.username}</p>
                  <p className="result-sub">Post ID: <code>{postResult.post_id}</code></p>
                </div>
                <button className="reset-btn" onClick={handleReset}>Publicar outro</button>
              </div>
            )}

            {postResult && !postResult.success && (
              <div className="result-card error-card">
                <AlertCircle size={28} />
                <div>
                  <p className="result-title">Falha ao publicar</p>
                  <p className="result-sub">{postResult.error}</p>
                  {postResult.detail?.error?.message && (
                    <p className="result-detail">Meta: {postResult.detail.error.message}</p>
                  )}
                </div>
                <button className="reset-btn" onClick={handleReset}>Tentar novamente</button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

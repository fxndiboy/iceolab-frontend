import { useState, useRef, useCallback } from 'react';
import {
  FlaskConical, FolderOpen, Upload, Send, CheckCircle,
  AlertCircle, Loader, Trash2, Film, X
} from 'lucide-react';
import './Clips.css';

const BACKEND_URL = 'https://iceolab-backend.onrender.com';

// Status de cada vídeo: idle → uploading → ready → posting → posted | error
function formatSize(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function ReelsLab() {
  const [videos, setVideos] = useState([]);
  const folderInputRef = useRef();

  // ── Helpers de estado ────────────────────────────────────────────────
  const updateVideo = useCallback((id, patch) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));
  }, []);

  const removeVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));

  // ── Seleção de pasta ─────────────────────────────────────────────────
  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files).filter(f =>
      f.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(f.name)
    );
    if (!files.length) return;

    const newVideos = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
      previewUrl: URL.createObjectURL(file),
      status: 'idle',   // idle | uploading | ready | posting | posted | error
      uploadProgress: 0,
      publicUrl: null,
      postId: null,
      caption: '',
      errorMsg: null,
    }));

    setVideos(prev => [...prev, ...newVideos]);
    e.target.value = '';
  };

  // ── Upload individual → Supabase Storage ─────────────────────────────
  const handleUpload = async (video) => {
    updateVideo(video.id, { status: 'uploading', errorMsg: null });

    const formData = new FormData();
    formData.append('video', video.file);

    try {
      // XMLHttpRequest para acompanhar o progresso de upload
      const publicUrl = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${BACKEND_URL}/api/videos/upload`);

        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            const pct = Math.round((e.loaded / e.total) * 100);
            updateVideo(video.id, { uploadProgress: pct });
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            resolve(data.url);
          } else {
            try {
              const err = JSON.parse(xhr.responseText);
              reject(new Error(err.error || 'Erro no upload'));
            } catch { reject(new Error('Erro desconhecido')); }
          }
        };
        xhr.onerror = () => reject(new Error('Sem conexão com o backend.'));
        xhr.send(formData);
      });

      updateVideo(video.id, { status: 'ready', publicUrl, uploadProgress: 100 });
    } catch (err) {
      updateVideo(video.id, { status: 'error', errorMsg: err.message });
    }
  };

  // ── Upload de todos pendentes ─────────────────────────────────────────
  const handleUploadAll = () => {
    videos.filter(v => v.status === 'idle').forEach(v => handleUpload(v));
  };

  // ── Postagem no Instagram ────────────────────────────────────────────
  const handlePost = async (video) => {
    if (!video.publicUrl) return;
    updateVideo(video.id, { status: 'posting', errorMsg: null });

    try {
      const res = await fetch(`${BACKEND_URL}/api/reels/post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ video_url: video.publicUrl, caption: video.caption })
      });
      const data = await res.json();

      if (res.ok && data.success) {
        updateVideo(video.id, { status: 'posted', postId: data.post_id });
      } else {
        const msg = data.detail?.error?.message || data.error || 'Erro ao postar';
        updateVideo(video.id, { status: 'error', errorMsg: msg });
      }
    } catch (err) {
      updateVideo(video.id, { status: 'error', errorMsg: err.message });
    }
  };

  const idleCount     = videos.filter(v => v.status === 'idle').length;
  const readyCount    = videos.filter(v => v.status === 'ready').length;
  const postedCount   = videos.filter(v => v.status === 'posted').length;

  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>
            <FlaskConical size={28} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--primary-color)' }} />
            Laboratório de Reels
          </h1>
          <p>Selecione uma pasta do seu Mac e publique vídeos diretamente no Instagram.</p>
        </div>

        {videos.length > 0 && (
          <div className="lab-stats">
            <span className="stat-badge idle">{idleCount} aguardando</span>
            <span className="stat-badge ready">{readyCount} prontos</span>
            <span className="stat-badge posted">{postedCount} publicados</span>
          </div>
        )}
      </header>

      <div className="view-content lab-layout">

        {/* ── Zona de Seleção ──────────────────────────────────────── */}
        {videos.length === 0 ? (
          <div
            className="lab-drop-zone glass-panel"
            onClick={() => folderInputRef.current?.click()}
          >
            <div className="lab-drop-icon">
              <FolderOpen size={56} />
            </div>
            <h2>Selecionar Pasta de Vídeos</h2>
            <p>Clique aqui para escolher uma pasta do seu Mac.<br />Todos os arquivos de vídeo serão detectados automaticamente.</p>
            <button className="select-folder-btn">
              <FolderOpen size={18} />
              Escolher Pasta
            </button>

            <input
              ref={folderInputRef}
              type="file"
              webkitdirectory="true"
              mozdirectory="true"
              multiple
              accept="video/*,.mp4,.mov,.avi,.mkv,.webm"
              style={{ display: 'none' }}
              onChange={handleFolderSelect}
            />
          </div>
        ) : (
          <div className="lab-workspace">

            {/* Toolbar */}
            <div className="lab-toolbar glass-panel">
              <button
                className="toolbar-btn secondary"
                onClick={() => folderInputRef.current?.click()}
              >
                <FolderOpen size={16} />
                Adicionar Pasta
              </button>
              {idleCount > 0 && (
                <button className="toolbar-btn primary" onClick={handleUploadAll}>
                  <Upload size={16} />
                  Fazer Upload de Todos ({idleCount})
                </button>
              )}

              <input
                ref={folderInputRef}
                type="file"
                webkitdirectory="true"
                mozdirectory="true"
                multiple
                accept="video/*,.mp4,.mov,.avi,.mkv,.webm"
                style={{ display: 'none' }}
                onChange={handleFolderSelect}
              />
            </div>

            {/* Grid de vídeos */}
            <div className="videos-grid">
              {videos.map(video => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onUpload={() => handleUpload(video)}
                  onPost={() => handlePost(video)}
                  onRemove={() => removeVideo(video.id)}
                  onCaptionChange={(val) => updateVideo(video.id, { caption: val })}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Componente individual de cada vídeo ──────────────────────────────────
function VideoCard({ video, onUpload, onPost, onRemove, onCaptionChange }) {
  const { name, size, previewUrl, status, uploadProgress, caption, postId, errorMsg } = video;

  const statusConfig = {
    idle:      { label: 'Aguardando upload', color: '#94a3b8' },
    uploading: { label: 'Fazendo upload...', color: '#a78bfa' },
    ready:     { label: 'Pronto para postar', color: '#34d399' },
    posting:   { label: 'Publicando...', color: '#f59e0b' },
    posted:    { label: 'Publicado! ✓', color: '#10b981' },
    error:     { label: 'Erro', color: '#f87171' },
  };

  const cfg = statusConfig[status];

  return (
    <div className={`video-card glass-panel ${status}`}>

      {/* Preview */}
      <div className="video-preview-wrap">
        <video
          src={previewUrl}
          className="video-thumb"
          muted
          playsInline
          onMouseEnter={e => e.target.play()}
          onMouseLeave={e => { e.target.pause(); e.target.currentTime = 0; }}
        />
        <div className="video-badge" style={{ background: cfg.color }}>
          {(status === 'uploading' || status === 'posting')
            ? <Loader size={10} style={{ animation: 'spin 1s linear infinite' }} />
            : <Film size={10} />
          }
          {cfg.label}
        </div>
        <button className="remove-btn" onClick={onRemove} title="Remover">
          <X size={14} />
        </button>
      </div>

      {/* Info */}
      <div className="video-card-body">
        <p className="video-name" title={name}>{name}</p>
        <p className="video-size">{formatSize(size)}</p>

        {/* Barra de upload */}
        {status === 'uploading' && (
          <div className="upload-progress-bar">
            <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {/* Legenda */}
        {(status === 'ready' || status === 'error') && (
          <textarea
            className="reel-textarea caption-mini"
            placeholder="Legenda (opcional)..."
            value={caption}
            onChange={e => onCaptionChange(e.target.value)}
            rows={2}
          />
        )}

        {/* Erro */}
        {status === 'error' && errorMsg && (
          <p className="card-error">
            <AlertCircle size={12} /> {errorMsg}
          </p>
        )}

        {/* Post ID */}
        {status === 'posted' && postId && (
          <p className="card-post-id">Post ID: <code>{postId}</code></p>
        )}

        {/* Botões de ação */}
        <div className="video-card-actions">
          {status === 'idle' && (
            <button className="card-btn upload" onClick={onUpload}>
              <Upload size={14} /> Upload
            </button>
          )}
          {status === 'ready' && (
            <button className="card-btn post" onClick={onPost}>
              <Send size={14} /> Postar no Instagram
            </button>
          )}
          {status === 'error' && (
            <button className="card-btn upload" onClick={onUpload}>
              <Upload size={14} /> Tentar novamente
            </button>
          )}
          {status === 'posted' && (
            <span className="card-done">
              <CheckCircle size={14} /> Publicado!
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useCallback, useEffect } from 'react';
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
  const [waking, setWaking] = useState(false);
  const folderInputRef = useRef();

  // ── Carrega vídeos já no Supabase ao montar ──
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/videos`)
      .then(r => r.json())
      .then(({ videos: cloud }) => {
        if (!cloud?.length) return;
        setVideos(cloud.map(f => {
          const parts = f.fullPath.split('/');
          const folder = parts.length > 1 ? parts[0] : '';
          return {
            id: `cloud-${f.fullPath}`,
            file: null,
            name: f.name,
            folder: folder,
            fullPath: f.fullPath,
            size: f.size,
            previewUrl: null,
            status: 'ready',
            uploadProgress: 100,
            publicUrl: f.url,
            postId: null,
            caption: '',
            errorMsg: null,
          };
        }));
      })
      .catch(() => {});
  }, []);

  // ── Helpers de estado ────────────────────────────────────────────────
  const updateVideo = useCallback((id, patch) => {
    setVideos(prev => prev.map(v => v.id === id ? { ...v, ...patch } : v));
  }, []);

  const removeVideo = (id) => setVideos(prev => prev.filter(v => v.id !== id));

  const handleReset = async () => {
    if (!window.confirm("⚠️ ATENÇÃO: Isso apagará TODOS os vídeos do storage e o histórico de agendamentos. Deseja continuar?")) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/videos/reset`);
      const data = await res.json();
      
      if (res.ok && data.success) {
        setVideos([]);
        localStorage.removeItem('iceolab_schedule_history');
        alert("Laboratório limpo com sucesso!");
      } else {
        alert("Falha ao resetar: " + (data.error || data.message || "Erro desconhecido"));
      }
    } catch (e) {
      alert("Erro de conexão ao resetar: " + e.message);
    }
  };

  // ── Seleção de pasta ──────────────────────────────────────────────────
  const handleFolderSelect = (e) => {
    const files = Array.from(e.target.files).filter(f =>
      f.type.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm)$/i.test(f.name)
    );
    if (!files.length) return;

    setVideos(prev => {
      const existingNames = new Set(prev.map(v => v.name));
      const newCards = files
        .filter(f => !existingNames.has(f.name))
        .map(file => {
          let folder = '';
          if (file.webkitRelativePath) {
            const parts = file.webkitRelativePath.split('/');
            if (parts.length > 1) folder = parts[0];
          }
          return {
            id: `${Date.now()}-${Math.random()}`,
            file,
            folder,
            name: file.name,
            size: file.size,
            previewUrl: URL.createObjectURL(file),
            status: 'idle',
            uploadProgress: 0,
            publicUrl: null,
            postId: null,
            caption: '',
            errorMsg: null,
          };
        });
      return [...prev, ...newCards];
    });
    e.target.value = '';
  };


  // ── Upload individual → Supabase Storage ─────────────────────────────
  const handleUpload = async (video) => {
    updateVideo(video.id, { status: 'uploading', errorMsg: null });

    const formData = new FormData();
    formData.append('video', video.file);
    if (video.folder) {
      formData.append('folder', video.folder);
    }

    try {
      const publicUrl = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${BACKEND_URL}/api/videos/upload`);
        xhr.timeout = 300000;

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
        xhr.ontimeout = () => reject(new Error('Timeout — tente um vídeo menor.'));
        xhr.onerror   = () => reject(new Error('Sem conexão.'));
        xhr.send(formData);
      });

      updateVideo(video.id, { status: 'ready', publicUrl, uploadProgress: 100 });
    } catch (err) {
      updateVideo(video.id, { status: 'error', errorMsg: err.message });
    }
  };

  const handleUploadAll = async () => {
    const pending = videos.filter(v => v.status === 'idle');
    if (!pending.length) return;
    setWaking(true);
    try { await fetch(`${BACKEND_URL}/api/accounts`); } catch (_) {}
    setWaking(false);
    for (const v of pending) {
      await handleUpload(v);
    }
  };

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

  // ── Agrupamento por divisão (pasta) ──────────────────────────────────
  const groupedVideos = videos.reduce((acc, v) => {
    const folder = v.folder || 'Principal (Raiz)';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(v);
    return acc;
  }, {});

  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>
            <FlaskConical size={28} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--primary-color)' }} />
            Laboratório de Reels
          </h1>
          <p>Selecione pastas do seu Mac e organize seus vídeos por divisões.</p>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {videos.length > 0 && (
            <div className="lab-stats">
              <span className="stat-badge idle">{idleCount} aguardando</span>
              <span className="stat-badge ready">{readyCount} prontos</span>
              <span className="stat-badge posted">{postedCount} publicados</span>
            </div>
          )}
          
          <button className="toolbar-btn secondary danger sm" onClick={handleReset} title="Apagar tudo e começar do zero">
            <Trash2 size={14} /> Resetar Lab
          </button>
        </div>
      </header>

      <div className="view-content lab-layout">
        {videos.length === 0 ? (
          <div
            className="lab-drop-zone glass-panel"
            onClick={() => folderInputRef.current?.click()}
          >
            <div className="lab-drop-icon">
              <FolderOpen size={56} />
            </div>
            <h2>Selecionar Pasta de Vídeos</h2>
            <p>Clique aqui para escolher uma pasta do seu Mac.<br />A pasta será usada como a "Divisão" deste conjunto de vídeos.</p>
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
            <div className="lab-toolbar glass-panel">
              <button
                className="toolbar-btn secondary"
                onClick={() => folderInputRef.current?.click()}
              >
                <FolderOpen size={16} />
                Adicionar Outra Pasta
              </button>
              {(idleCount > 0 || waking) && (
                <button className="toolbar-btn primary" onClick={handleUploadAll} disabled={waking}>
                  {waking
                    ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Acordando servidor...</>
                    : <><Upload size={16} /> Fazer Upload de Todos ({idleCount})</>
                  }
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

            <div className="lab-divisions">
              {Object.entries(groupedVideos).map(([folder, items]) => (
                <div key={folder} className="division-section">
                  <div className="division-header">
                    <FolderOpen size={16} />
                    <h3>Divisão: {folder}</h3>
                    <span className="division-count">{items.length} vídeos</span>
                  </div>
                  <div className="videos-grid">
                    {items.map(video => (
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
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function VideoCard({ video, onUpload, onPost, onRemove, onCaptionChange }) {
  const { name, size, previewUrl, publicUrl, status, uploadProgress, caption, postId, errorMsg } = video;
  const videoSrc = previewUrl || publicUrl;

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
      <div className="video-preview-wrap">
        <video
          src={videoSrc}
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

      <div className="video-card-body">
        <p className="video-name" title={name}>{name}</p>
        <p className="video-size">{formatSize(size)}</p>

        {status === 'uploading' && (
          <div className="upload-progress-bar">
            <div className="upload-progress-fill" style={{ width: `${uploadProgress}%` }} />
          </div>
        )}

        {(status === 'ready' || status === 'error') && (
          <textarea
            className="reel-textarea caption-mini"
            placeholder="Legenda (opcional)..."
            value={caption}
            onChange={e => onCaptionChange(e.target.value)}
            rows={2}
          />
        )}

        {status === 'error' && errorMsg && (
          <p className="card-error">
            <AlertCircle size={12} /> {errorMsg}
          </p>
        )}

        {status === 'posted' && postId && (
          <p className="card-post-id">Post ID: <code>{postId}</code></p>
        )}

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

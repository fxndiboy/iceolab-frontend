import { useState, useEffect } from 'react';
import {
  Calendar, Shuffle, CheckSquare, Square, ChevronRight,
  ChevronLeft, Clock, Zap, Send, CheckCircle, Loader,
  Film, AlertCircle, Sparkles
} from 'lucide-react';
import './Scheduler.css';

const BACKEND_URL = 'https://iceolab-backend.onrender.com';

function fmt(bytes) {
  if (!bytes) return '';
  return bytes < 1048576 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1048576).toFixed(1)} MB`;
}

function scheduleTime(baseMs, offsetMin) {
  const d = new Date(baseMs + offsetMin * 60000);
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

export default function Scheduler() {
  // ── Wizard state ────────────────────────────────────────
  const [step, setStep]             = useState(1);
  const [videos, setVideos]          = useState([]);
  const [accounts, setAccounts]      = useState([]);
  const [loading, setLoading]        = useState(true);
  const [loadErr, setLoadErr]        = useState(null);
  const [selected, setSelected]      = useState([]);
  const [captions, setCaptions]      = useState({});
  const [selectedAccount, setSelectedAccount] = useState(null);

  // Step 3 config
  const [postMode, setPostMode]       = useState('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [intervalMode, setIntervalMode] = useState('fixed');
  const [intervalMin, setIntervalMin] = useState(10);
  const [intervalMax, setIntervalMax] = useState(15);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]         = useState(null);

  // ── Carrega vídeos do Supabase Storage ──────────────────
  useEffect(() => {
    Promise.all([
      fetch(`${BACKEND_URL}/api/videos`).then(r => r.json()),
      fetch(`${BACKEND_URL}/api/accounts`).then(r => r.json())
    ])
      .then(([vData, aData]) => {
        setVideos(vData.videos || []);
        setAccounts(aData.accounts || []);
        if (aData.accounts?.length === 1) setSelectedAccount(aData.accounts[0]);
      })
      .catch(e => setLoadErr(e.message))
      .finally(() => setLoading(false));
  }, []);

  // ── Seleção ──────────────────────────────────────────────
  const toggleVideo = (video) => {
    setSelected(prev =>
      prev.find(v => v.url === video.url)
        ? prev.filter(v => v.url !== video.url)
        : [...prev, video]
    );
  };

  const selectRandom = (n = 10) => {
    const shuffled = [...videos].sort(() => Math.random() - 0.5);
    setSelected(shuffled.slice(0, Math.min(n, videos.length)));
  };

  // ── Preview da fila ──────────────────────────────────────
  const buildQueuePreview = () => {
    const baseMs = postMode === 'now' ? Date.now() : new Date(scheduledAt).getTime() || Date.now();
    let acc = 0;
    return selected.map((v, idx) => {
      const gap = idx === 0 ? 0 : (intervalMode === 'humanize'
        ? Math.floor(Math.random() * (intervalMax - intervalMin + 1)) + intervalMin
        : intervalMin);
      acc += gap;
      return { name: v.name, time: scheduleTime(baseMs, acc), delay: acc };
    });
  };

  // ── Submissão ────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    const items = selected.map(v => ({
      url: v.url,
      name: v.name,
      caption: captions[v.url] || ''
    }));

    try {
      const res = await fetch(`${BACKEND_URL}/api/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          postNow: postMode === 'now',
          scheduledAt,
          intervalMode,
          intervalMin: Number(intervalMin),
          intervalMax: Number(intervalMax),
          account_id: selectedAccount?.id
        })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      setResult({ error: e.message });
    } finally {
      setSubmitting(false);
    }
  };

  const reset = () => {
    setStep(1); setSelected([]); setCaptions({});
    setPostMode('now'); setScheduledAt('');
    setIntervalMode('fixed'); setIntervalMin(10); setIntervalMax(15);
    setSelectedAccount(accounts.length === 1 ? accounts[0] : null);
    setResult(null);
  };

  // ── Resultado final ──────────────────────────────────────
  if (result) {
    return (
      <div className="view-container">
        <div className="view-content">
          <div className="sched-result glass-panel">
            {result.success ? (
              <>
                <CheckCircle size={48} color="#10b981" />
                <h2>Agendamento confirmado!</h2>
                <p>{result.total} Reels enfileirados com sucesso.</p>
                <div className="queue-summary">
                  {result.queue?.map((item, i) => (
                    <div key={i} className="queue-row">
                      <span className="queue-index">#{item.index}</span>
                      <span className="queue-name">{item.name}</span>
                      <span className="queue-time">
                        {item.delay_min === 0 ? 'Agora' : `+${item.delay_min} min`}
                      </span>
                    </div>
                  ))}
                </div>
                <button className="sched-btn primary" onClick={reset}>
                  Novo Agendamento
                </button>
              </>
            ) : (
              <>
                <AlertCircle size={48} color="#f87171" />
                <h2>Erro ao agendar</h2>
                <p>{result.error}</p>
                <button className="sched-btn secondary" onClick={() => setResult(null)}>
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1><Calendar size={26} style={{ verticalAlign: 'middle', marginRight: 10, color: 'var(--primary-color)' }} />Agendador</h1>
          <p>Selecione, escreva legendas e agende seus Reels.</p>
        </div>
      </header>

      {/* Stepper */}
      <div className="wizard-stepper">
        {['Selecionar Reels', 'Legendas', 'Agendar'].map((label, i) => (
          <div key={i} className={`wizard-step ${step === i + 1 ? 'active' : step > i + 1 ? 'done' : ''}`}>
            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{label}</span>
            {i < 2 && <div className="step-line" />}
          </div>
        ))}
      </div>

      <div className="view-content">

        {/* ══ STEP 1: Selecionar ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="wizard-card glass-panel">
            <div className="wizard-card-header">
              <h2>Selecionar Reels</h2>
              <div className="step1-actions">
                <span className="selected-badge">{selected.length} selecionados</span>
                <button className="sched-btn secondary sm" onClick={() => selectRandom(10)}>
                  <Shuffle size={14} /> 10 Aleatórios
                </button>
                {selected.length > 0 && (
                  <button className="sched-btn secondary sm" onClick={() => setSelected([])}>
                    Limpar
                  </button>
                )}
              </div>
            </div>

            {loading && (
              <div className="sched-loader">
                <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                <p>Carregando vídeos...</p>
              </div>
            )}

            {loadErr && (
              <div className="sched-error">
                <AlertCircle size={18} /> {loadErr}
              </div>
            )}

            {!loading && videos.length === 0 && !loadErr && (
              <div className="sched-empty">
                <Film size={40} />
                <p>Nenhum vídeo no Lab de Reels ainda.<br />Suba vídeos primeiro pelo Lab!</p>
              </div>
            )}

            {!loading && videos.length > 0 && (
              <div className="video-select-grid">
                {videos.map((video) => {
                  const isSelected = selected.some(v => v.url === video.url);
                  return (
                    <div
                      key={video.url}
                      className={`video-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleVideo(video)}
                    >
                      <div className="vs-check">
                        {isSelected ? <CheckSquare size={18} color="var(--primary-color)" /> : <Square size={18} />}
                      </div>
                      <div className="vs-icon"><Film size={20} /></div>
                      <div className="vs-info">
                        <p className="vs-name" title={video.name}>{video.name.replace(/^\d+-/, '')}</p>
                        <p className="vs-size">{fmt(video.size)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="wizard-nav">
              <span />
              <button
                className="sched-btn primary"
                disabled={selected.length === 0}
                onClick={() => setStep(2)}
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 2: Legendas ════════════════════════════════════════ */}
        {step === 2 && (
          <div className="wizard-card glass-panel">
            <div className="wizard-card-header">
              <h2>Definir Legendas</h2>
              <span className="selected-badge">{selected.length} vídeos</span>
            </div>

            <div className="captions-list">
              {selected.map((video, i) => (
                <div key={video.url} className="caption-item">
                  <div className="caption-item-header">
                    <div className="caption-num">#{i + 1}</div>
                    <div className="caption-file-icon"><Film size={16} /></div>
                    <p className="caption-name">{video.name.replace(/^\d+-/, '')}</p>
                  </div>
                  <textarea
                    className="caption-textarea"
                    placeholder="Escreva a legenda aqui... Use hashtags! 🚀"
                    value={captions[video.url] || ''}
                    onChange={e => setCaptions(prev => ({ ...prev, [video.url]: e.target.value }))}
                    rows={3}
                  />
                  <p className="caption-char">{(captions[video.url] || '').length}/2200</p>
                </div>
              ))}
            </div>

            <div className="wizard-nav">
              <button className="sched-btn secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={16} /> Voltar
              </button>
              <button className="sched-btn primary" onClick={() => setStep(3)}>
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* ══ STEP 3: Agendar ═════════════════════════════════════════ */}
        {step === 3 && (
          <div className="wizard-card glass-panel step3-layout">

            <div className="step3-left">
              <div className="wizard-card-header">
                <h2>Configurar Agendamento</h2>
              </div>

            {/* Conta para Postagem */}
              <div className="config-section">
                <h3 className="config-label"><Send size={16} /> Postar como</h3>
                {accounts.length === 0 ? (
                  <p className="sched-error" style={{fontSize:'0.82rem'}}>
                    <AlertCircle size={14} /> Nenhuma conta conectada. Conecte uma em Configurações.
                  </p>
                ) : (
                  <div className="account-selector">
                    {accounts.map(acc => (
                      <div
                        key={acc.id}
                        className={`account-chip ${selectedAccount?.id === acc.id ? 'active' : ''}`}
                        onClick={() => setSelectedAccount(acc)}
                      >
                        <div className="chip-avatar">
                          {acc.profile_picture
                            ? <img src={acc.profile_picture} alt={acc.instagram_username} />
                            : acc.instagram_username?.[0]?.toUpperCase()
                          }
                        </div>
                        <span>@{acc.instagram_username}</span>
                        {selectedAccount?.id === acc.id && <CheckCircle size={14} color="#10b981" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quando postar */}
              <div className="config-section">
                <h3 className="config-label"><Clock size={16} /> Quando postar</h3>
                <div className="radio-group">
                  <label className={`radio-card ${postMode === 'now' ? 'active' : ''}`}>
                    <input type="radio" value="now" checked={postMode === 'now'} onChange={() => setPostMode('now')} />
                    <Send size={16} /> Postar Agora
                  </label>
                  <label className={`radio-card ${postMode === 'scheduled' ? 'active' : ''}`}>
                    <input type="radio" value="scheduled" checked={postMode === 'scheduled'} onChange={() => setPostMode('scheduled')} />
                    <Calendar size={16} /> Agendar Data/Hora
                  </label>
                </div>
                {postMode === 'scheduled' && (
                  <input
                    type="datetime-local"
                    className="datetime-input"
                    value={scheduledAt}
                    onChange={e => setScheduledAt(e.target.value)}
                  />
                )}
              </div>

              {/* Intervalo */}
              <div className="config-section">
                <h3 className="config-label"><Zap size={16} /> Intervalo entre posts</h3>
                <div className="radio-group">
                  <label className={`radio-card ${intervalMode === 'fixed' ? 'active' : ''}`}>
                    <input type="radio" value="fixed" checked={intervalMode === 'fixed'} onChange={() => setIntervalMode('fixed')} />
                    <Clock size={16} /> Intervalo Fixo
                  </label>
                  <label className={`radio-card ${intervalMode === 'humanize' ? 'active' : ''}`}>
                    <input type="radio" value="humanize" checked={intervalMode === 'humanize'} onChange={() => setIntervalMode('humanize')} />
                    <Sparkles size={16} /> Humanizador
                  </label>
                </div>

                {intervalMode === 'fixed' ? (
                  <div className="slider-group">
                    <div className="slider-row">
                      <span>Intervalo</span>
                      <strong>{intervalMin} min</strong>
                    </div>
                    <input type="range" min={5} max={15} value={intervalMin}
                      onChange={e => setIntervalMin(Number(e.target.value))}
                      className="interval-slider" />
                    <div className="slider-labels"><span>5 min</span><span>15 min</span></div>
                  </div>
                ) : (
                  <div className="slider-group">
                    <p className="humanize-desc">
                      <Sparkles size={14} /> Intervalo aleatório entre <strong>{intervalMin}</strong> e <strong>{intervalMax}</strong> minutos — simula comportamento humano.
                    </p>
                    <div className="slider-row"><span>Mínimo</span><strong>{intervalMin} min</strong></div>
                    <input type="range" min={5} max={intervalMax} value={intervalMin}
                      onChange={e => setIntervalMin(Number(e.target.value))} className="interval-slider" />
                    <div className="slider-row" style={{ marginTop: '1rem' }}><span>Máximo</span><strong>{intervalMax} min</strong></div>
                    <input type="range" min={intervalMin} max={15} value={intervalMax}
                      onChange={e => setIntervalMax(Number(e.target.value))} className="interval-slider" />
                    <div className="slider-labels"><span>5 min</span><span>15 min</span></div>
                  </div>
                )}
              </div>
            </div>

            {/* Preview da fila */}
            <div className="step3-right">
              <h3 className="config-label">Preview da Fila</h3>
              <div className="queue-preview">
                {buildQueuePreview().map((item, i) => (
                  <div key={i} className="queue-preview-row">
                    <div className="qp-num">#{i + 1}</div>
                    <div className="qp-name">{item.name.replace(/^\d+-/, '')}</div>
                    <div className="qp-time">
                      <Clock size={11} />
                      {postMode === 'now' ? (item.delay === 0 ? 'Agora' : `+${item.delay} min`) : item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav */}
            <div className="wizard-nav full-width">
              <button className="sched-btn secondary" onClick={() => setStep(2)}>
                <ChevronLeft size={16} /> Voltar
              </button>
              <button
                className="sched-btn primary large"
                onClick={handleSubmit}
                disabled={submitting || !selectedAccount || (postMode === 'scheduled' && !scheduledAt)}
              >
                {submitting
                  ? <><Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> Agendando...</>
                  : <><Send size={18} /> Confirmar e Agendar {selected.length} Reels</>
                }
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

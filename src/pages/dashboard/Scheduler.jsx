import { useState } from 'react';
import { Plus, Calendar, Video, X } from 'lucide-react';
import './Scheduler.css';

export default function Scheduler() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fake calendar days array (just 35 slots to simulate a month view)
  const days = Array.from({ length: 35 }, (_, i) => i + 1);

  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>Agendador</h1>
          <p>Organize suas postagens e mantenha a consistência.</p>
        </div>
        <button className="button-primary new-post-btn" onClick={() => setIsModalOpen(true)}>
          <Plus size={20} style={{ marginRight: '8px' }}/>
          Novo Agendamento
        </button>
      </header>
      
      <div className="view-content scheduler-layout">
        <div className="calendar-section glass-panel">
          <div className="calendar-header">
            <h3>Novembro 2026</h3>
            <div className="calendar-nav">
              <button>&lt;</button>
              <button>Hoje</button>
              <button>&gt;</button>
            </div>
          </div>
          
          <div className="calendar-grid">
            <div className="weekday">Dom</div>
            <div className="weekday">Seg</div>
            <div className="weekday">Ter</div>
            <div className="weekday">Qua</div>
            <div className="weekday">Qui</div>
            <div className="weekday">Sex</div>
            <div className="weekday">Sab</div>
            
            {days.map(day => {
              // Creating some fake dots for scheduled posts
              const hasPost = day === 5 || day === 12 || day === 18;
              const isToday = day === 12;
              return (
                <div key={day} className={`calendar-day ${isToday ? 'today' : ''}`}>
                  <span className="day-number">{day > 30 ? day - 30 : day}</span>
                  {hasPost && <div className="post-dot"></div>}
                </div>
              );
            })}
          </div>
        </div>

        <div className="ready-videos glass-panel">
          <h3>Vídeos Prontos</h3>
          <div className="videos-list">
            <div className="video-item">
              <div className="video-thumb">
                <Video size={24} />
              </div>
              <div className="video-info">
                <h4>Podcast Ep. 42 - Corte 1</h4>
                <p>Gerado há 2h</p>
              </div>
            </div>
            <div className="video-item">
              <div className="video-thumb">
                <Video size={24} />
              </div>
              <div className="video-info">
                <h4>Vlog Viagem - Reel</h4>
                <p>Gerado há 5h</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel">
            <div className="modal-header">
              <h2>Novo Agendamento</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Selecionar Vídeo</label>
                <select className="form-input">
                  <option>Podcast Ep. 42 - Corte 1</option>
                  <option>Vlog Viagem - Reel</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Legenda</label>
                <textarea className="form-input" rows="4" placeholder="Escreva a legenda incrível aqui..."></textarea>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Data</label>
                  <input type="date" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Hora</label>
                  <input type="time" className="form-input" />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancelar</button>
              <button className="button-primary" onClick={() => setIsModalOpen(false)}>Agendar Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

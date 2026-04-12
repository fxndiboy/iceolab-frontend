import './Overview.css';

export default function Overview() {
  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>Visão Geral</h1>
          <p>Métricas de crescimento e conteúdo em um só lugar.</p>
        </div>
        <div className="user-profile">
          <div className="avatar">A</div>
          <span>Admin User</span>
        </div>
      </header>
      
      <div className="view-content">
        <div className="metrics-grid">
          <div className="metric-card glass-panel">
            <h3>Postagens Agendadas</h3>
            <p className="metric-value">0</p>
          </div>
          <div className="metric-card glass-panel">
            <h3>Contas Conectadas</h3>
            <p className="metric-value">0</p>
          </div>
          <div className="metric-card glass-panel">
            <h3>Alcance Potencial</h3>
            <p className="metric-value">-</p>
          </div>
        </div>

        <div className="chart-section glass-panel">
          <h3 className="section-title">Engajamento Semanal</h3>
          
          <div className="fake-chart-container">
            {/* Fake CSS Bar Chart */}
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '30%' }}></div>
              <span>Seg</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '50%' }}></div>
              <span>Ter</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '80%' }}></div>
              <span>Qua</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '65%' }}></div>
              <span>Qui</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar highlight-bar" style={{ height: '95%' }}></div>
              <span>Sex</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '40%' }}></div>
              <span>Sab</span>
            </div>
            <div className="bar-wrapper">
              <div className="bar" style={{ height: '55%' }}></div>
              <span>Dom</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

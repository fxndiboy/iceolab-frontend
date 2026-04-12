import { Smartphone, Save } from 'lucide-react';
import './Settings.css';
export default function Settings() {
  return (
    <div className="view-container">
      <header className="page-header">
        <div className="header-greeting">
          <h1>Configurações</h1>
          <p>Ajuste suas preferências e conexões.</p>
        </div>
        <button className="button-primary">
          <Save size={18} style={{ marginRight: '8px' }} />
          Salvar Alterações
        </button>
      </header>
      
      <div className="view-content settings-layout">
        <div className="settings-section glass-panel">
          <h3 className="section-title">Perfil do Usuário</h3>
          
          <div className="settings-form">
            <div className="form-group">
              <label>Nome Completo</label>
              <input type="text" className="form-input" defaultValue="Admin User" />
            </div>
            <div className="form-group">
              <label>E-mail Corporativo</label>
              <input type="email" className="form-input" defaultValue="admin@iceolab.com" />
            </div>
          </div>
        </div>

        <div className="settings-section glass-panel integrations-panel">
          <div className="integration-header">
            <h3 className="section-title" style={{ marginBottom: '0.5rem' }}>Integrações</h3>
            <p className="integration-desc">Conecte suas redes sociais para habilitar o agendamento.</p>
          </div>
          
          <div className="integration-cards">
            <div className="integration-card active-integration">
              <div className="card-info">
                <span className="integration-status connected">Conectado</span>
                <h4>Instagram Profissional</h4>
                <p>@minhaconta.oficial</p>
              </div>
              <button className="disconnect-btn">Desconectar</button>
            </div>

            <div className="integration-card connect-new">
              <div className="card-info">
                <h4>Adicionar Conta</h4>
                <p>Conecte uma nova conta para gerenciar seu conteúdo.</p>
              </div>
              <button className="connect-ig-btn">
                <Smartphone size={20} />
                Conectar Instagram Profissional
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

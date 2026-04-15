import { useState, useEffect } from 'react';
import { Smartphone, Save, CheckCircle, Loader } from 'lucide-react';
import './Settings.css';

const BACKEND_URL = 'https://iceolab-backend.onrender.com';

export default function Settings() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/accounts`);
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch (err) {
      console.error('Erro ao buscar contas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (id, username) => {
    if (!window.confirm(`Deseja realmente desconectar a conta @${username}?`)) return;
    
    try {
      const res = await fetch(`${BACKEND_URL}/api/accounts/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(prev => prev.filter(acc => acc.id !== id));
      } else {
        alert("Erro ao desconectar: " + data.error);
      }
    } catch (err) {
      alert("Erro de conexão ao desconectar.");
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
            <p className="integration-desc">Contas Instagram conectadas ao Ice-O Lab.</p>
          </div>

          <div className="integration-cards">
            {/* Contas reais vindas do Supabase */}
            {loading ? (
              <div className="integration-card" style={{ justifyContent: 'center', gap: '0.5rem' }}>
                <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} />
                <span>Carregando contas...</span>
              </div>
            ) : (
              accounts.map((account) => (
                <div key={account.id} className="integration-card active-integration">
                  <div className="card-info">
                    <span className="integration-status connected">
                      <CheckCircle size={12} style={{ marginRight: '4px' }} />
                      Conectado
                    </span>
                    <h4>Instagram Profissional</h4>
                    <p>@{account.instagram_username}</p>
                  </div>
                  <button 
                    className="disconnect-btn" 
                    onClick={() => handleDisconnect(account.id, account.instagram_username)}
                  >
                    Desconectar
                  </button>
                </div>
              ))
            )}

            {/* Botão para adicionar nova conta */}
            <div className="integration-card connect-new">
              <div className="card-info">
                <h4>Adicionar Conta</h4>
                <p>Conecte uma nova conta para gerenciar seu conteúdo.</p>
              </div>
              <button
                className="connect-ig-btn"
                onClick={() => window.location.href = `${BACKEND_URL}/api/auth/meta`}
              >
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

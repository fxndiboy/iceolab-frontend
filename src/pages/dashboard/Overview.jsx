import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Overview.css';

const BACKEND_URL = 'https://iceolab-backend.onrender.com';

export default function Overview() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  useEffect(() => {
    // Se voltou do OAuth com sucesso, limpa a URL e refaz o fetch
    const params = new URLSearchParams(location.search);
    if (params.get('status') === 'success') {
      navigate('/dashboard', { replace: true });
    }
    fetchAccounts();
  }, [location.search]);

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
            <p className="metric-value">
              {loading ? '...' : accounts.length}
            </p>
          </div>
          <div className="metric-card glass-panel">
            <h3>Alcance Potencial</h3>
            <p className="metric-value">-</p>
          </div>
        </div>

        {/* Cards das contas conectadas */}
        {accounts.length > 0 && (
          <div className="accounts-section glass-panel">
            <h3 className="section-title">Contas Instagram Conectadas</h3>
            <div className="accounts-grid">
              {accounts.map((account) => (
                <div key={account.id} className="account-card">
                  <div className="account-avatar">
                    {account.profile_picture
                      ? <img src={account.profile_picture} alt={account.instagram_username} />
                      : <span>{account.instagram_username?.[0]?.toUpperCase()}</span>
                    }
                  </div>
                  <div className="account-info">
                    <p className="account-username">@{account.instagram_username}</p>
                    <span className="account-badge">● Ativo</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="chart-section glass-panel">
          <h3 className="section-title">Engajamento Semanal</h3>
          <div className="fake-chart-container">
            <div className="bar-wrapper"><div className="bar" style={{ height: '30%' }}></div><span>Seg</span></div>
            <div className="bar-wrapper"><div className="bar" style={{ height: '50%' }}></div><span>Ter</span></div>
            <div className="bar-wrapper"><div className="bar" style={{ height: '80%' }}></div><span>Qua</span></div>
            <div className="bar-wrapper"><div className="bar" style={{ height: '65%' }}></div><span>Qui</span></div>
            <div className="bar-wrapper"><div className="bar highlight-bar" style={{ height: '95%' }}></div><span>Sex</span></div>
            <div className="bar-wrapper"><div className="bar" style={{ height: '40%' }}></div><span>Sab</span></div>
            <div className="bar-wrapper"><div className="bar" style={{ height: '55%' }}></div><span>Dom</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

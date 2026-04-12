import { Link } from 'react-router-dom';
import { Sparkles, CalendarClock, Smartphone } from 'lucide-react';
import Footer from '../components/Footer';
import './Home.css';

export default function Home() {
  return (
    <div className="page-container">
      <main className="main-content">
        <section className="hero-section">
          <div className="container hero-content">
            <div className="hero-badge glass-panel">
              <Sparkles size={16} className="badge-icon" />
              <span>A nova era da automação no Instagram</span>
            </div>
            
            <h1 className="hero-title">
              Escale sua presença com o <span>IceoLab</span>
            </h1>
            
            <p className="hero-subtitle">
              Uma plataforma avançada de agendamento e automação de conteúdo para Instagram. Otimize seu tempo, engaje seu público e cresça de forma inteligente.
            </p>
            
            <div className="hero-actions">
              <Link to="/dashboard" className="button-primary login-btn">
                <Smartphone size={20} style={{ marginRight: '8px' }}/>
                Login / Dashboard
              </Link>
            </div>
          </div>
          
          <div className="hero-illustration">
            <div className="illustration-card glass-panel">
              <CalendarClock size={48} color="var(--primary-color)" />
              <p>Agendamentos Inteligentes</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

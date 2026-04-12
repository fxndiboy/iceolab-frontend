import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>IceoLab</h3>
          <p>Potencializando seu agendamento e automação de conteúdo para Instagram.</p>
        </div>
        <div className="footer-links">
          <h4>Legal</h4>
          <Link to="/termos-de-uso">Termos de Uso</Link>
          <Link to="/politica-de-privacidade">Política de Privacidade</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} IceoLab. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
}

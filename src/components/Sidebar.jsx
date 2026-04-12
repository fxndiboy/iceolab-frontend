import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FlaskConical, Clock, Settings, LogOut, Hexagon } from 'lucide-react';
import './Sidebar.css';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Hexagon size={28} className="sidebar-logo" />
        <h2>IceoLab</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <NavLink to="/dashboard" end>
              <LayoutDashboard size={20} />
              <span>Visão Geral</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/clips">
              <FlaskConical size={20} />
              <span>Lab de Reels</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/scheduler">
              <Clock size={20} />
              <span>Agendador</span>
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/dashboard/settings">
              <Settings size={20} />
              <span>Configurações</span>
            </NavLink>
          </li>
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <Link to="/" className="logout-link">
          <LogOut size={20} />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  );
}

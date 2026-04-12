import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import './Dashboard.css';

export default function DashboardShell() {
  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        {/* The active child route is rendered here */}
        <Outlet />
      </main>
    </div>
  );
}

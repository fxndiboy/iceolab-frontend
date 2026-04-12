import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import DashboardShell from './pages/Dashboard';
import Overview from './pages/dashboard/Overview';
import ClipsGenerator from './pages/dashboard/ClipsGenerator';
import Scheduler from './pages/dashboard/Scheduler';
import Settings from './pages/dashboard/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/termos-de-uso" element={<Terms />} />
        <Route path="/politica-de-privacidade" element={<Privacy />} />
        
        {/* Dashboard Nested Routes */}
        <Route path="/dashboard" element={<DashboardShell />}>
          <Route index element={<Overview />} />
          <Route path="clips" element={<ClipsGenerator />} />
          <Route path="scheduler" element={<Scheduler />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

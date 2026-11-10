import { NavLink, Route, Routes } from 'react-router-dom';
import { ListChecks, Megaphone } from 'lucide-react';
import ReportPage from './ReportPage';
import UnresolvedPage from './UnresolvedPage';
import './App.css';

function App() {
  return (
    <div className="app">
      <main className="app-main">
        <Routes>
          <Route path="/" element={<ReportPage />} />
          <Route path="/unresolved" element={<UnresolvedPage />} />
        </Routes>
      </main>

      <nav className="app-nav">
        <NavLink to="/" end className="app-nav__link">
          <Megaphone size={20} aria-hidden="true" />
          Report
        </NavLink>
        <NavLink to="/unresolved" className="app-nav__link">
          <ListChecks size={20} aria-hidden="true" />
          Unresolved
        </NavLink>
      </nav>
    </div>
  );
}

export default App;

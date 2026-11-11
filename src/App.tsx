import { NavLink, Route, Routes } from 'react-router-dom';
import { ListChecks, Megaphone, RotateCw } from 'lucide-react';
import ReportPage from './ReportPage';
import UnresolvedPage from './UnresolvedPage';
import { reloadApp } from './reloadApp';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <button
          type="button"
          className="reload-button"
          onClick={() => reloadApp()}
          aria-label="Reload app"
          title="Reload app"
        >
          <RotateCw size={20} aria-hidden="true" />
        </button>
      </header>

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

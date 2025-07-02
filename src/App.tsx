import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import NewPage from './pages/NewPage';
import CalculatorPage from './pages/CalculatorPage';
import PRLPage from './pages/PRLPage';
import PRLControlPage from './pages/PRLControlPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#282c34' }}>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/">
          Dashboard
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/new">
          New Page
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/prl">
          PRL Map
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/prl-control">
          PRL Control
        </Link>
        <Link style={{ color: '#fff' }} to="/calc">
          Calculator
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewPage />} />
        <Route path="/prl" element={<PRLPage />} />
        <Route path="/prl-control" element={<PRLControlPage />} />
        <Route path="/calc" element={<CalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

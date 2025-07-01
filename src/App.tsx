import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import NewPage from './pages/NewPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#282c34' }}>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/">
          Dashboard
        </Link>
        <Link style={{ color: '#fff' }} to="/new">
          New Page
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

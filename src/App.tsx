import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import NewPage from './pages/NewPage';
import CalculatorPage from './pages/CalculatorPage';
import PRLPage from './pages/PRLPage';
import PRLControlPage from './pages/PRLControlPage';
import RouteLintPage from './pages/RouteLintPage';
import WebcamPage from './pages/WebcamPage';
import GreenScreenPage from './pages/GreenScreenPage';
import VPTPage from './pages/VPTPage';
import TrainCabPage from './pages/TrainCabPage';
import ReceiptPage from './pages/ReceiptPage';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
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
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/routelint">
          RouteLint
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/webcam">
          Webcam
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/green">
          Green Screen
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/vpt">
          VPT Sim
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/cab">
          Cab View
        </Link>
        <Link style={{ color: '#fff', marginRight: '1rem' }} to="/receipt">
          Receipt OCR
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
        <Route path="/routelint" element={<RouteLintPage />} />
        <Route path="/webcam" element={<WebcamPage />} />
        <Route path="/green" element={<GreenScreenPage />} />
        <Route path="/vpt" element={<VPTPage />} />
        <Route path="/cab" element={<TrainCabPage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
        <Route path="/calc" element={<CalculatorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

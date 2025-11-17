import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import Customize from './pages/Customize.tsx';
import Success from './pages/Success.tsx';
import Cancel from './pages/Cancel.tsx';
import Impressum from './pages/Impressum.tsx';
import Datenschutz from './pages/Datenschutz.tsx';
import AGB from './pages/AGB.tsx';
import Widerruf from './pages/Widerruf.tsx';
import Admin from './pages/Admin.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/success" element={<Success />} />
        <Route path="/cancel" element={<Cancel />} />
        <Route path="/impressum" element={<Impressum />} />
        <Route path="/datenschutz" element={<Datenschutz />} />
        <Route path="/agb" element={<AGB />} />
        <Route path="/widerruf" element={<Widerruf />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);

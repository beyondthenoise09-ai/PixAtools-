
import React from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import PassportMaker from './pages/PassportMaker';
import BgRemover from './pages/BgRemover';
import Enhancer from './pages/Enhancer';
import Converter from './pages/Converter';
import Compressor from './pages/Compressor';
import Resizer from './pages/Resizer';
import Cropper from './pages/Cropper';
import PdfMaker from './pages/PdfMaker';
import RecentFiles from './pages/RecentFiles';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col max-w-lg mx-auto shadow-xl ring-1 ring-gray-200">
        <Header />
        <main className="flex-1 pb-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/passport" element={<PassportMaker />} />
            <Route path="/bg-remover" element={<BgRemover />} />
            <Route path="/enhance" element={<Enhancer />} />
            <Route path="/convert" element={<Converter />} />
            <Route path="/compress" element={<Compressor />} />
            <Route path="/resize" element={<Resizer />} />
            <Route path="/crop" element={<Cropper />} />
            <Route path="/pdf" element={<PdfMaker />} />
            <Route path="/recent" element={<RecentFiles />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  );
};

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
          <span className="text-xl font-bold">P</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none text-gray-900 tracking-tight">PixAtools</h1>
          <p className="text-[10px] text-gray-500 uppercase font-semibold tracking-widest">Smart Image Utilities</p>
        </div>
      </div>
      
      {!isHome && (
        <button 
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      )}
    </header>
  );
};

export default App;

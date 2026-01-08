
import React, { useState, useEffect } from 'react';
import { ImageFile } from '../types';
import { clearHistory, downloadImage } from '../services/imageUtils';

const RecentFiles: React.FC = () => {
  const [history, setHistory] = useState<ImageFile[]>([]);

  useEffect(() => {
    const data = localStorage.getItem('pixatools_history');
    if (data) {
      setHistory(JSON.parse(data));
    }
  }, []);

  const handleClear = () => {
    if (confirm('Clear all local history?')) {
      clearHistory();
      setHistory([]);
    }
  };

  return (
    <div className="p-5 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Recent Files</h2>
          <p className="text-gray-500 text-xs">Saved privately on your device</p>
        </div>
        {history.length > 0 && (
          <button 
            onClick={handleClear}
            className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:bg-red-50 px-2 py-1 rounded transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
          <div className="text-4xl mb-4 opacity-20">📂</div>
          <p className="text-gray-400 text-sm font-medium">No files yet. Start editing!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {history.map(item => (
            <div 
              key={item.id}
              className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 group hover:border-blue-200 transition-colors"
            >
              <img src={item.dataUrl} className="w-14 h-14 rounded-xl object-cover bg-gray-50 shadow-inner" />
              <div className="flex-1 overflow-hidden">
                <p className="font-bold text-sm truncate text-gray-800">{item.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] text-gray-400 font-medium">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                  <span className="text-[10px] text-blue-500 font-bold uppercase">
                    {item.type.split('/')[1]}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => downloadImage(item.dataUrl, item.name)}
                className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentFiles;

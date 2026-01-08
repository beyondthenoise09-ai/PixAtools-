
import React, { useState } from 'react';
import { fileToBase64, resizeImage, downloadImage, saveToHistory } from '../services/imageUtils';

const Resizer: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });
  const [originalDims, setOriginalDims] = useState({ w: 0, h: 0 });
  const [lockAspect, setLockAspect] = useState(true);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const img = new Image();
      img.src = base64;
      img.onload = () => {
        setOriginal(base64);
        setDims({ w: img.width, h: img.height });
        setOriginalDims({ w: img.width, h: img.height });
      };
    }
  };

  const handleWChange = (val: number) => {
    if (lockAspect) {
      const ratio = originalDims.h / originalDims.w;
      setDims({ w: val, h: Math.round(val * ratio) });
    } else {
      setDims({ ...dims, w: val });
    }
  };

  const handleResize = async () => {
    if (!original) return;
    const result = await resizeImage(original, dims.w, dims.h);
    downloadImage(result, `resized-${dims.w}x${dims.h}.jpg`);
    saveToHistory(result, 'Resized Image', 'image/jpeg');
    setOriginal(null);
  };

  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Resize Image</h2>
        <p className="text-gray-500 text-sm">Change dimensions precisely</p>
      </div>

      {!original ? (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">📐</div>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Upload to Resize
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Width (px)</label>
              <input 
                type="number" 
                value={dims.w} 
                onChange={(e) => handleWChange(parseInt(e.target.value) || 0)}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase mb-2 block">Height (px)</label>
              <input 
                type="number" 
                value={dims.h} 
                onChange={(e) => setDims({ ...dims, h: parseInt(e.target.value) || 0 })}
                disabled={lockAspect}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-bold text-blue-600 outline-none focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={lockAspect} 
              onChange={() => setLockAspect(!lockAspect)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-600">Lock Aspect Ratio</span>
          </label>

          <button 
            onClick={handleResize}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Apply Resize & Save
          </button>
        </div>
      )}
    </div>
  );
};

export default Resizer;

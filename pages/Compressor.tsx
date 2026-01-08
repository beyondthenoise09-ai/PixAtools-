
import React, { useState } from 'react';
import { fileToBase64, resizeImage, downloadImage, saveToHistory } from '../services/imageUtils';

const Compressor: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [quality, setQuality] = useState(0.5);
  const [processing, setProcessing] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      setOriginal(base64);
    }
  };

  const handleCompress = async () => {
    if (!original) return;
    setProcessing(true);
    const img = new Image();
    img.src = original;
    img.onload = async () => {
      const result = await resizeImage(original, img.width, img.height, 'image/jpeg', quality);
      downloadImage(result, `compressed-${Date.now()}.jpg`);
      saveToHistory(result, 'Compressed Image', 'image/jpeg');
      setProcessing(false);
      setOriginal(null);
    };
  };

  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Compress Image</h2>
        <p className="text-gray-500 text-sm">Reduce size, keep quality</p>
      </div>

      {!original ? (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">🗜️</div>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Choose Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-8">
          <div className="relative h-48 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100">
             <img src={original} className="w-full h-full object-contain" />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-end">
               <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quality Level</label>
               <span className="text-lg font-bold text-blue-600">{Math.round(quality * 100)}%</span>
            </div>
            <input 
              type="range" min="0.1" max="1.0" step="0.05" value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase">
              <span>High Size</span>
              <span>Light Weight</span>
            </div>
          </div>

          <button 
            onClick={handleCompress}
            disabled={processing}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {processing ? 'Processing...' : 'Compress & Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Compressor;

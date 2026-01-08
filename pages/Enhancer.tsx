
import React, { useState } from 'react';
import { enhancePhoto, checkUsageLimit } from '../services/geminiService';
import { fileToBase64, downloadImage, saveToHistory } from '../services/imageUtils';

const Enhancer: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginal(await fileToBase64(file));
    setResult(null);
    setError(null);
  };

  const handleEnhance = async () => {
    if (!original) return;
    setProcessing(true);
    try {
      if (!checkUsageLimit()) {
        setError("AI Limit reached.");
        return;
      }
      const enhanced = await enhancePhoto(original);
      setResult(enhanced);
      saveToHistory(enhanced, 'Enhanced Photo', 'image/jpeg');
    } catch (err: any) {
      setError("AI Service busy. Try again later.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Enhancer</h2>
        <p className="text-gray-500 text-sm">Smart auto-fix in one tap</p>
      </div>

      {!original ? (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">🪄</div>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Pick a Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="relative rounded-2xl overflow-hidden aspect-square bg-gray-50">
               <img src={result || original} className="w-full h-full object-contain" />
               {processing && (
                 <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center flex-col gap-2">
                    <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Enhancing...</span>
                 </div>
               )}
            </div>
          </div>

          {!result && !processing && (
            <button 
              onClick={handleEnhance}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Enhance Now
            </button>
          )}

          {result && (
            <div className="flex gap-3">
              <button 
                onClick={() => setOriginal(null)}
                className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
              >
                Reset
              </button>
              <button 
                onClick={() => downloadImage(result, 'enhanced.jpg')}
                className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Download
              </button>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-medium text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default Enhancer;

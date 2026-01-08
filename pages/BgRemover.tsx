
import React, { useState } from 'react';
import { removeBackground, checkUsageLimit } from '../services/geminiService';
import { fileToBase64, downloadImage, saveToHistory } from '../services/imageUtils';

const BgRemover: React.FC = () => {
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProcessing(true);
    setResult(null);

    try {
      const base64 = await fileToBase64(file);
      if (!checkUsageLimit()) {
        setError("Daily limit reached.");
        return;
      }
      const cutout = await removeBackground(base64);
      setResult(cutout);
      saveToHistory(cutout, 'Cutout', 'image/png');
    } catch (err: any) {
      setError(err.message || "Processing failed.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="p-5 flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Background Remover</h2>
        <p className="text-gray-500 text-sm">Transparent PNG in one tap</p>
      </div>

      {!result && !processing && (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">✨</div>
          <p className="font-bold text-gray-700">Drop Image to Remove BG</p>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Select Image
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      )}

      {processing && (
        <div className="bg-white p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500">Isolating subject...</p>
        </div>
      )}

      {result && (
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
            <img src={result} className="max-h-80 object-contain" />
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setResult(null)}
              className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              Start New
            </button>
            <button 
              onClick={() => downloadImage(result, 'cutout.png')}
              className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Download PNG
            </button>
          </div>
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

export default BgRemover;

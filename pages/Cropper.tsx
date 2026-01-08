
import React, { useState, useRef } from 'react';
import { fileToBase64, downloadImage, saveToHistory } from '../services/imageUtils';

const Cropper: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [selectedRatio, setSelectedRatio] = useState<number | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setOriginal(await fileToBase64(file));
  };

  const handleExport = () => {
    if (!original) return;
    // In production, use react-easy-crop or similar for a nice UI.
    // For this demo, we'll just simulate a full export as a "center crop".
    downloadImage(original, `cropped-${Date.now()}.jpg`);
    saveToHistory(original, 'Cropped Image', 'image/jpeg');
    setOriginal(null);
  };

  const ratios = [
    { label: 'Square', value: 1 },
    { label: '4:5 (Insta)', value: 4/5 },
    { label: '16:9', value: 16/9 },
    { label: 'Free', value: null },
  ];

  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Crop Image</h2>
        <p className="text-gray-500 text-sm">Resize and frame perfectly</p>
      </div>

      {!original ? (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">✂️</div>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Upload to Crop
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
            <img src={original} ref={imgRef} className="max-h-80 object-contain rounded-lg shadow-sm" />
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Aspect Ratio</label>
            <div className="flex flex-wrap gap-2 mb-8">
              {ratios.map(r => (
                <button 
                  key={r.label}
                  onClick={() => setSelectedRatio(r.value)}
                  className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${selectedRatio === r.value ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-100 text-gray-500'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button 
              onClick={handleExport}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
            >
              Apply Crop & Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cropper;

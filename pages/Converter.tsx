
import React, { useState } from 'react';
import { fileToBase64, resizeImage, downloadImage, saveToHistory } from '../services/imageUtils';

const Converter: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name.split('.')[0]);
    const base64 = await fileToBase64(file);
    setOriginal(base64);
  };

  const handleConvert = async () => {
    if (!original) return;
    
    // Simple way to get width/height: load onto an Image
    const img = new Image();
    img.src = original;
    img.onload = async () => {
      const result = await resizeImage(original, img.width, img.height, format, 1.0);
      const ext = format.split('/')[1];
      downloadImage(result, `${fileName}-pixatools.${ext}`);
      saveToHistory(result, fileName, format);
      setOriginal(null);
    };
  };

  return (
    <div className="p-5 flex flex-col gap-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Format Converter</h2>
        <p className="text-gray-500 text-sm">JPG • PNG • WEBP</p>
      </div>

      {!original ? (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">🔄</div>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Choose Image
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <img src={original} className="w-20 h-20 object-cover rounded-xl" />
            <div className="flex-1 overflow-hidden">
              <p className="font-bold text-sm truncate">{fileName}</p>
              <p className="text-xs text-gray-400">Ready for conversion</p>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Convert To</label>
            <div className="grid grid-cols-3 gap-2">
              {['image/jpeg', 'image/png', 'image/webp'].map((f) => (
                <button 
                  key={f}
                  onClick={() => setFormat(f as any)}
                  className={`py-2 px-1 rounded-xl border text-[10px] font-bold transition-all ${format === f ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'}`}
                >
                  {f.split('/')[1].toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleConvert}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Convert & Download
          </button>
        </div>
      )}
    </div>
  );
};

export default Converter;

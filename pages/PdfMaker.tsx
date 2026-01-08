
import React, { useState } from 'react';
import { fileToBase64, saveToHistory } from '../services/imageUtils';

// Note: In a real environment, you'd use jspdf. 
// For this standalone demo, we will simulate the behavior or provide a simplified version.
const PdfMaker: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);
  const [generating, setGenerating] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const base64s = await Promise.all(files.map(f => fileToBase64(f)));
    setImages(prev => [...prev, ...base64s]);
  };

  const handleRemove = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    setGenerating(true);
    // In actual production: use jspdf to add each image as a page.
    setTimeout(() => {
      alert("PDF Generation complete! (Simulation)");
      setGenerating(false);
      setImages([]);
    }, 1500);
  };

  return (
    <div className="p-5 flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Image to PDF</h2>
        <p className="text-gray-500 text-sm">Combine photos into one document</p>
      </div>

      <div className="border-2 border-dashed border-gray-200 rounded-3xl p-6 flex flex-col items-center justify-center bg-white gap-3 transition-all hover:border-blue-300">
        <div className="text-2xl opacity-40">📄</div>
        <label className="cursor-pointer text-blue-600 text-sm font-bold active:scale-95 transition-transform">
          Add More Images
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Pages ({images.length})</label>
            <div className="grid grid-cols-3 gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                  <img src={img} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => handleRemove(idx)}
                    className="absolute top-1 right-1 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center text-red-500 shadow-sm"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/40 text-[8px] text-white px-1.5 rounded-full font-bold">
                    P{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={generating}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform disabled:opacity-50"
          >
            {generating ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      )}
    </div>
  );
};

export default PdfMaker;

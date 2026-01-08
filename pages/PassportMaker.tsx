
import React, { useState, useRef, useEffect } from 'react';
import { removeBackground, checkUsageLimit } from '../services/geminiService.ts';
import { fileToBase64, downloadImage, saveToHistory } from '../services/imageUtils.ts';
import { PASSPORT_SIZES, BG_COLORS } from '../constants.ts';
import { PassportSize } from '../types.ts';

const PassportMaker: React.FC = () => {
  const [original, setOriginal] = useState<string | null>(null);
  const [cutout, setCutout] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [selectedSize, setSelectedSize] = useState<PassportSize>(PASSPORT_SIZES[0]);
  const [bgColor, setBgColor] = useState(BG_COLORS[0].value);
  const [error, setError] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setProcessing(true);

    try {
      const base64 = await fileToBase64(file);
      setOriginal(base64);

      if (!checkUsageLimit()) {
        setError("Daily AI limit reached. Please try again tomorrow.");
        setProcessing(false);
        return;
      }

      const result = await removeBackground(base64);
      setCutout(result);
    } catch (err: any) {
      setError(err.message || "Failed to process image.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (cutout && canvasRef.current) {
      drawPassport();
    }
  }, [cutout, selectedSize, bgColor]);

  const drawPassport = () => {
    const canvas = canvasRef.current;
    if (!canvas || !cutout) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPI = 300;
    const mmToIn = 1 / 25.4;
    const widthPx = Math.round(selectedSize.widthMm * mmToIn * DPI);
    const heightPx = Math.round(selectedSize.heightMm * mmToIn * DPI);

    canvas.width = widthPx;
    canvas.height = heightPx;

    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, widthPx, heightPx);

    const img = new Image();
    img.src = cutout;
    img.onload = () => {
      const imgAspect = img.width / img.height;
      let drawH = heightPx * 1.1; 
      let drawW = drawH * imgAspect;
      let drawX = (widthPx - drawW) / 2;
      let drawY = heightPx * 0.1; 

      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(0,0, widthPx, heightPx);
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    downloadImage(dataUrl, `pixatools-passport-${Date.now()}.jpg`);
    saveToHistory(dataUrl, 'Passport Photo', 'image/jpeg');
  };

  return (
    <div className="p-5 flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Passport Maker</h2>
        <p className="text-gray-500 text-sm">Professional IDs in seconds</p>
      </div>

      {!original ? (
        <div className="border-2 border-dashed border-gray-200 rounded-3xl p-10 flex flex-col items-center justify-center bg-white gap-4 transition-all hover:border-blue-300">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-3xl">📸</div>
          <div className="text-center">
            <p className="font-bold text-gray-700">Take or Upload Photo</p>
            <p className="text-xs text-gray-400">Frontal view, neutral expression</p>
          </div>
          <label className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform">
            Select Photo
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col items-center">
            <div className="mb-4 relative group">
              {processing ? (
                <div className="w-64 h-80 bg-gray-50 rounded-lg flex flex-col items-center justify-center gap-3 animate-pulse">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest">AI working...</p>
                </div>
              ) : (
                <canvas 
                  ref={canvasRef} 
                  className="w-64 h-auto shadow-2xl rounded-sm border border-gray-200 bg-white"
                />
              )}
            </div>
            
            <div className="w-full flex justify-center gap-2 mb-4">
              <button onClick={() => setOriginal(null)} className="text-xs text-gray-400 font-medium">Retake Photo</button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-6">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Size Preset</label>
              <div className="grid grid-cols-2 gap-2">
                {PASSPORT_SIZES.map(size => (
                  <button 
                    key={size.name}
                    onClick={() => setSelectedSize(size)}
                    className={`text-[11px] font-semibold py-2 px-3 rounded-xl border transition-all ${selectedSize.name === size.name ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 text-gray-500'}`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-3">Background Color</label>
              <div className="flex flex-wrap gap-3">
                {BG_COLORS.map(color => (
                  <button 
                    key={color.name}
                    onClick={() => setBgColor(color.value)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${bgColor === color.value ? 'border-blue-600 scale-110 shadow-lg' : 'border-gray-100'}`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
                <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs text-gray-400 overflow-hidden relative">
                  🎨
                  <input 
                    type="color" 
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                    onChange={(e) => setBgColor(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              disabled={processing || !!error}
              onClick={handleDownload}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-100 active:scale-95 transition-transform disabled:opacity-50"
            >
              Download Result (300 DPI)
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-medium text-center border border-red-100">
          {error}
        </div>
      )}
    </div>
  );
};

export default PassportMaker;

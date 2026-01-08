
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const resizeImage = async (
  base64: string, 
  width: number, 
  height: number, 
  format: 'image/jpeg' | 'image/png' | 'image/webp' = 'image/jpeg',
  quality: number = 0.9
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(base64);
      
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL(format, quality));
    };
  });
};

export const saveToHistory = (dataUrl: string, name: string, type: string) => {
  const historyStr = localStorage.getItem('pixatools_history');
  const history = historyStr ? JSON.parse(historyStr) : [];
  
  const newItem = {
    id: Date.now().toString(),
    name: name || 'Untitled',
    dataUrl,
    timestamp: Date.now(),
    type,
    size: Math.round(dataUrl.length * 0.75) // estimate
  };
  
  const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20
  localStorage.setItem('pixatools_history', JSON.stringify(updatedHistory));
};

export const clearHistory = () => {
  localStorage.removeItem('pixatools_history');
};

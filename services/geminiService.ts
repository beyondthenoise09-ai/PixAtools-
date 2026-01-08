
import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Checks and updates daily usage limits
 */
export const checkUsageLimit = (): boolean => {
  const statsJson = localStorage.getItem('pixatools_usage');
  const now = Date.now();
  const resetPeriod = 24 * 60 * 60 * 1000; // 24 hours

  let stats = statsJson ? JSON.parse(statsJson) : { aiCalls: 0, lastReset: now };

  if (now - stats.lastReset > resetPeriod) {
    stats = { aiCalls: 0, lastReset: now };
  }

  if (stats.aiCalls >= 5) { // Hardcoded 5 for simplicity
    return false;
  }

  stats.aiCalls += 1;
  localStorage.setItem('pixatools_usage', JSON.stringify(stats));
  return true;
};

/**
 * Removes background using Gemini Flash Image model
 */
export const removeBackground = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  // We use the image editing model
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1] || base64Image,
            mimeType: 'image/png',
          },
        },
        {
          text: 'Remove the background of this image. Keep only the main person/subject and make the background completely transparent. Return the result as a PNG image.',
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to remove background");
};

/**
 * Enhances photo quality
 */
export const enhancePhoto = async (base64Image: string): Promise<string> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Image.split(',')[1] || base64Image,
            mimeType: 'image/png',
          },
        },
        {
          text: 'Enhance this photo: improve brightness, sharpness, and color balance subtly. Professional studio quality look.',
        },
      ],
    },
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  
  throw new Error("Failed to enhance photo");
};

import Tesseract from 'tesseract.js';

export const performOCR = async (imageFile: File | string) => {
  const result = await Tesseract.recognize(imageFile, 'eng');
  const text = result.data.text;
  
  // Regex to extract numbers near keywords
  const findValue = (key: string, unit: string) => {
    const regex = new RegExp(`${key}\\s*(\\d+)\\s*${unit}`, 'i');
    const match = text.match(regex);
    return match ? parseInt(match[1]) : 0;
  };
  
  return {
    sodium: findValue('Sodium', 'mg'),
    sugar: findValue('Sugar', 'g'),
    potassium: findValue('Potassium', 'mg'),
  };
};
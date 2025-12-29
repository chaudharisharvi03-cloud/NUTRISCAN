'use client'

import { useState } from 'react';
import { performOCR } from '../utils/ocrScanner';
import { evaluateSafety } from '../utils/healthLogic';

export default function NutriScan() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const data = await performOCR(file);
    const evaluation = evaluateSafety(data);
    setResult({ ...data, ...evaluation });
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-6 font-sans">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">Nutri-Scan 🩺</h1>
      <p className="text-gray-600 mb-8">Scan labels for instant health safety checks.</p>

      <div className="bg-gray-50 border-2 border-dashed border-blue-200 rounded-xl p-10 text-center">
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleUpload} 
          className="hidden" 
          id="upload" 
        />
        <label 
          htmlFor="upload" 
          className="cursor-pointer bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
        >
          {loading ? 'Analyzing...' : '📷 Scan Nutrition Label'}
        </label>
      </div>

      {result && (
        <div className={`mt-8 p-6 rounded-2xl shadow-lg ${
          result.isSafe 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        } border-2`}>
          <h2 className="text-2xl font-bold mb-4">
            {result.isSafe ? '✅ Safe to Consume' : '⚠️ Use Caution'}
          </h2>
          
          <div className="space-y-2 mb-4">
            <p>Sodium: <strong>{result.sodium}mg</strong></p>
            <p>Sugar: <strong>{result.sugar}g</strong></p>
            <p>Potassium: <strong>{result.potassium}mg</strong></p>
          </div>

          {result.issues.map((issue: string) => (
            <div key={issue} className="text-red-600 font-medium text-sm">
              ❗ {issue}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
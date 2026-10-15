import React, { useState } from 'react';
import { AlignLeft, Sparkles, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateExecutiveSummaryWithAI } from '../../services/aiService';
import { AIInspirationBanner } from '../AIInspirationBanner';

interface SummaryEditorProps {
  summary: string;
  targetJob: string;
  topSkills: string[];
  onChange: (value: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({
  summary,
  targetJob,
  topSkills,
  onChange,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const wordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOptimal = wordCount >= 35 && wordCount <= 90;

  const handleAIOptimize = async () => {
    setIsGenerating(true);
    try {
      const res = await generateExecutiveSummaryWithAI(
        summary,
        targetJob || 'Puesto Ejecutivo',
        topSkills,
        '5+'
      );
      if (res.summary) {
        onChange(res.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-blue-900" />
            2. Resumen Profesional Ejecutivo (Executive Summary)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Un párrafo lineal de 3-4 oraciones que sintetiza tu propuesta de valor y palabras clave primarias.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAIOptimize}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto"
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{isGenerating ? 'Generando...' : 'Optimizar con IA'}</span>
        </button>
      </div>

      {/* Professional Inspiration & Authenticity Banner */}
      <AIInspirationBanner />

      <div className="relative">
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe tu resumen ejecutivo o haz clic en 'Optimizar con IA' para que el motor ATS lo redacte en base a tu vacante objetivo..."
          className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-800 leading-relaxed"
        />

        {/* Word count meter */}
        <div className="mt-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            {isOptimal ? (
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Longitud Óptima para ATS ({wordCount} palabras)
              </span>
            ) : (
              <span className="text-amber-700 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                {wordCount < 35 ? `Muy breve (${wordCount} palabras, ideal: 40-85)` : `Demasiado extenso (${wordCount} palabras)`}
              </span>
            )}
          </div>
          <span className="text-slate-400 text-[11px]">Rango recomendado: 40 - 85 palabras</span>
        </div>
      </div>
    </div>
  );
};

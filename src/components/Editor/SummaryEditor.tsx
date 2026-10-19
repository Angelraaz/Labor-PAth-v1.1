import React, { useState } from 'react';
import { AlignLeft, Sparkles, RefreshCw, CheckCircle2, AlertCircle, Wand2 } from 'lucide-react';
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
  const [selectedStyle, setSelectedStyle] = useState<'balance' | 'results' | 'operational'>('results');

  const wordCount = summary ? summary.trim().split(/\s+/).filter(Boolean).length : 0;
  const isOptimal = wordCount >= 35 && wordCount <= 90;

  const handleAIOptimize = async (styleOverride?: string) => {
    setIsGenerating(true);
    try {
      const role = targetJob || 'Puesto Profesional';
      const res = await generateExecutiveSummaryWithAI(
        summary,
        role,
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <AlignLeft className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            2. Resumen Profesional Ejecutivo (Executive Summary)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Párrafo lineal de 3-4 oraciones que sintetiza tu experiencia, competencias clave y propuesta de valor.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleAIOptimize()}
          disabled={isGenerating}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          {isGenerating ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{isGenerating ? 'Redactando con IA...' : 'Redactar con IA Inteligente'}</span>
        </button>
      </div>

      {/* Professional Inspiration & Authenticity Banner */}
      <AIInspirationBanner />

      <div className="relative">
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`Escribe tu resumen ejecutivo o presiona 'Redactar con IA Inteligente' para que el motor ATS lo calibre a tu puesto de "${targetJob || 'tu profesión'}"...`}
          className="w-full p-3.5 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white dark:placeholder-slate-500 leading-relaxed transition-all"
        />

        {/* Word count meter */}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5">
            {isOptimal ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Longitud Óptima para ATS ({wordCount} palabras)
              </span>
            ) : (
              <span className="text-amber-700 dark:text-amber-400 font-medium flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                {wordCount < 35 ? `Muy breve (${wordCount} palabras, ideal: 40-85)` : `Demasiado extenso (${wordCount} palabras)`}
              </span>
            )}
          </div>
          <span className="text-slate-400 dark:text-slate-500 text-[11px]">Rango recomendado: 40 - 85 palabras</span>
        </div>
      </div>
    </div>
  );
};

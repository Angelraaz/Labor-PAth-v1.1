import React, { useState } from 'react';
import { Sparkles, Check, Copy, ArrowRight, X, TrendingUp, Award, Cpu, RefreshCw } from 'lucide-react';
import { optimizeBulletWithAI, BulletOptimizationResponse } from '../services/aiService';
import { AIInspirationBanner } from './AIInspirationBanner';

interface BulletOptimizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  rawBullet: string;
  targetJob: string;
  missingKeywords: string[];
  onApply: (optimizedText: string) => void;
}

export const BulletOptimizerModal: React.FC<BulletOptimizerModalProps> = ({
  isOpen,
  onClose,
  rawBullet,
  targetJob,
  missingKeywords,
  onApply,
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BulletOptimizationResponse | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  React.useEffect(() => {
    if (isOpen && rawBullet) {
      handleGenerate();
    } else {
      setResult(null);
    }
  }, [isOpen, rawBullet]);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await optimizeBulletWithAI(
        rawBullet,
        targetJob,
        missingKeywords.slice(0, 3)
      );
      setResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-base text-white">Optimizador de Logros (Fórmula Google XYZ)</h3>
              <p className="text-xs text-slate-300">
                Logré [X], medido a través de [Y], mediante la ejecución de [Z]
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Original Bullet */}
          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Texto Original:
            </span>
            <p className="text-sm text-slate-700 italic">"{rawBullet}"</p>
          </div>

          {/* Inspiration & Authenticity Banner */}
          <AIInspirationBanner />

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <RefreshCw className="w-8 h-8 text-blue-900 animate-spin" />
              <p className="text-sm font-medium text-slate-700">
                Calibrando impacto cuantificable con el motor ATS de Gemini...
              </p>
              <p className="text-xs text-slate-400 max-w-xs">
                Inyectando verbos de acción en pasado, métricas porcentuales y palabras clave de la vacante.
              </p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Recommended Top Choice */}
              <div className="p-4 rounded-xl border-2 border-emerald-500/80 bg-emerald-50/40 relative">
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    <Award className="w-3.5 h-3.5" /> Recomendación Élite ATS
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(result.recommended, -1)}
                      className="text-xs text-slate-600 hover:text-slate-900 px-2 py-1 rounded bg-white border border-slate-200 hover:bg-slate-100 transition-colors flex items-center gap-1"
                    >
                      {copiedIndex === -1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedIndex === -1 ? 'Copiado' : 'Copiar'}
                    </button>
                    <button
                      onClick={() => onApply(result.recommended)}
                      className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-3 py-1 rounded shadow-xs transition-colors flex items-center gap-1"
                    >
                      Aplicar al CV <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-800 font-medium leading-relaxed">
                  {result.recommended}
                </p>
              </div>

              {/* Variations */}
              {result.variations && result.variations.length > 0 && (
                <div className="space-y-2.5">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                    Variaciones Estratégicas:
                  </span>
                  {result.variations.map((v, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-semibold text-blue-900 flex items-center gap-1">
                          {i === 0 ? <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> : <Cpu className="w-3.5 h-3.5 text-blue-600" />}
                          {v.type}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleCopy(v.text, i)}
                            className="text-xs text-slate-500 hover:text-slate-800 px-2 py-0.5 rounded hover:bg-slate-100 transition-colors flex items-center gap-1"
                          >
                            {copiedIndex === i ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            {copiedIndex === i ? 'Copiado' : 'Copiar'}
                          </button>
                          <button
                            onClick={() => onApply(v.text)}
                            className="text-xs font-medium text-blue-900 hover:text-blue-950 hover:underline px-1.5 py-0.5"
                          >
                            Usar esta versión
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">{v.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-slate-500">
              No se pudo generar la optimización. Haz clic en reintentar.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="text-xs text-slate-700 hover:text-slate-900 font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Regenerar otras variaciones
          </button>
          <button
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-1.5 rounded-lg hover:bg-slate-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

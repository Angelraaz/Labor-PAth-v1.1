import React, { useState, useEffect } from 'react';
import { Lightbulb, Cpu, FileText, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

const TIPS = [
  "💡 Regla de Oro ATS: Utiliza un formato monocolumna limpio sin tablas ni gráficos ocultos para que Workday y Taleo indexen tu información al 100%.",
  "🔍 Parsing Inteligente: El sistema extrae automáticamente la jerga técnica, maquinaria y herramientas exactas de la oferta laboral.",
  "📈 Método Google XYZ: Redacta tus logros pasados como 'Logré [X], medido a través de [Y] (%, $, volumen), mediante [Z] (herramienta o procedimiento).'",
  "⭐ Currículum Maestro vs. Adaptado: Mantén un currículum maestro con toda tu historia, pero adapta tu versión final a máximo 2 páginas para la oferta específica.",
  "✍️ Cuidado Ortográfico: Los verbos en pretérito en primera persona requieren tilde gráfica (diseñé, lideré, optimicé, gestioné, audité)."
];

export const ProfessionalTicker: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-900/90 dark:bg-slate-900 text-blue-200 border-y border-slate-800 py-2 px-3 sm:px-6 text-xs no-print overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-5 h-5 rounded-md bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400 animate-pulse transition-all duration-700" />
          </div>
          <div className="truncate font-medium text-[11px] sm:text-xs text-slate-200 transition-all duration-500">
            {TIPS[currentTipIndex]}
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 shrink-0 text-[10px] text-slate-400 font-mono">
          <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">Versión 1.8</span>
          <span className="text-emerald-400 font-bold">• ATS Optimizado</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Lightbulb, Sparkles, FileText, Cpu, CheckCircle2, ChevronRight, X } from 'lucide-react';

const STAR_ATS_TIPS = [
  {
    title: "Método STAR en Experiencia",
    text: "Estructura tus logros con Situación, Tarea, Acción y Resultado. Demuestra cómo resolviste un desafío operativo concreto del sector.",
    icon: Sparkles,
    tag: "Metodología STAR"
  },
  {
    title: "Regla de Oro: Máximo 2 Páginas",
    text: "Un currículum adaptado nunca debe exceder las 2 páginas (1 página si tienes <5 años de experiencia). Los reclutadores leen en segundos.",
    icon: FileText,
    tag: "Extensión Ideal"
  },
  {
    title: "Cómo el Parsing ATS Lee tu CV",
    text: "Los algoritmos de Workday y Taleo escanean de arriba a abajo buscando jerga técnica exacta, sin tablas, cuadros de texto ni imágenes flotantes.",
    icon: Cpu,
    tag: "Motor ATS"
  }
];

export const StarAndAtsBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % STAR_ATS_TIPS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  if (dismissed) return null;

  const currentTip = STAR_ATS_TIPS[currentIndex];
  const IconComponent = currentTip.icon;

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white rounded-xl p-3 sm:p-4 shadow-lg border border-blue-800/60 no-print mb-4 relative overflow-hidden">
      {/* Background glow subtle effect */}
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          {/* Bombillo que prende y se apaga (suave parpadeo) */}
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
            <Lightbulb className="w-5 h-5 text-amber-400 animate-pulse transition-all duration-1000" style={{ filter: 'drop-shadow(0 0 6px rgba(251, 191, 36, 0.6))' }} />
          </div>

          <div className="min-w-0 space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
                {currentTip.title}
              </span>
              <span className="bg-blue-500/30 text-blue-300 border border-blue-400/40 text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                {currentTip.tag}
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentTip.text}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="hidden sm:flex items-center gap-1">
            {STAR_ATS_TIPS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  currentIndex === idx ? 'bg-amber-400 w-4' : 'bg-slate-700 hover:bg-slate-600'
                }`}
                title={`Ver consejo ${idx + 1}`}
              />
            ))}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="Cerrar aviso"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

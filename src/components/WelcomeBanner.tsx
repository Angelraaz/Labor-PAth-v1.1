import React from 'react';
import { Target, Sparkles, ShieldCheck, CheckCircle2, ChevronRight, FileCheck } from 'lucide-react';
import { JobTarget } from '../types/ats';

interface WelcomeBannerProps {
  currentTarget: JobTarget;
  onOpenTargetModal: () => void;
  overallScore: number;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  currentTarget,
  onOpenTargetModal,
  overallScore
}) => {
  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-2xl p-6 shadow-md border border-slate-800 relative overflow-hidden no-print mb-6">
      {/* Decorative subtle background accents */}
      <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.12),transparent_70%)] pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Motor de Optimización ATS Corporativo Activo</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Bienvenido a Labor Path
          </h1>

          <p className="text-slate-300 text-sm leading-relaxed">
            Tu centro de comando para construir un currículum ejecutivo <strong>100% inmune al descarte automático de los ATS</strong> (Workday, Taleo, Greenhouse). Analizamos en tiempo real la compatibilidad de palabras clave, cuantificación de logros y jerarquía lineal.
          </p>

          <div className="pt-1 flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Columna única garantizada
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fórmula Google XYZ integrada
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Guardado automático en tiempo real
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" /> Auditoría LinkedIn Recruiter integrada
            </span>
          </div>
        </div>

        {/* Target role callout card */}
        <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 flex flex-col justify-between shrink-0 min-w-[280px]">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
              <span className="uppercase tracking-wider font-semibold text-emerald-400">
                Puesto Objetivo Actual
              </span>
              <span className="text-[11px] font-mono bg-emerald-950/80 px-2 py-0.5 rounded text-emerald-300">
                {overallScore}% Match
              </span>
            </div>
            <p className="font-bold text-white text-base truncate">
              {currentTarget.title || '¿Cuál es tu puesto objetivo?'}
            </p>
            <p className="text-xs text-slate-300 truncate mt-0.5">
              {currentTarget.company ? `Empresa: ${currentTarget.company}` : 'Calibrado con estándares del sector'}
            </p>
          </div>

          <button
            onClick={onOpenTargetModal}
            className="mt-4 w-full py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <Target className="w-4 h-4 text-slate-950" />
            <span>{currentTarget.title ? 'Modificar Vacante / Requisitos' : 'Definir Puesto Objetivo'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

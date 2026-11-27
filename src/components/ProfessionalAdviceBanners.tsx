import React, { useState } from 'react';
import { Lightbulb, FileText, CheckCircle2, X, Award, ChevronDown, ChevronUp } from 'lucide-react';

export const ProfessionalAdviceBanners: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-xl p-3 sm:p-4 shadow-md mb-4 no-print border border-blue-700/50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center shrink-0">
            <Lightbulb className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-2">
              <span>💡 Consejos de Reclutamiento Senior y Valor Diferencial (ATS Master)</span>
              <span className="bg-emerald-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded uppercase">
                Recomendado
              </span>
            </h4>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
              Optimiza tu currículum aplicando la regla de las 2 páginas, el currículum maestro y un valor diferencial cuantificable.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-200 hover:text-white bg-blue-800/60 hover:bg-blue-800 px-2 py-1 rounded flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? 'Ocultar' : 'Ver Guía'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            title="Cerrar banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3.5 pt-3 border-t border-blue-700/40 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Card 1: Master Resume vs 2 Pages */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
            <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span>Currículum Maestro vs. Máx 2 Páginas</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Mantén un <strong className="text-white">Currículum Maestro</strong> con todo tu historial laboral, cursos y proyectos de años (sin importar su extensión). Sin embargo, para cada vacante específica, genera un currículum <strong className="text-white">adaptado de máximo 2 hojas</strong> (1 hoja si tienes menos de 5 años de experiencia). Los reclutadores descartan hojas excesivas.
            </p>
          </div>

          {/* Card 2: Valor Diferencial y Ejemplo XYZ */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 mb-1">
              <Award className="w-3.5 h-3.5" />
              <span>Valor Diferencial con Ejemplo XYZ</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed mb-1.5">
              Destaca tu impacto único mediante la fórmula <strong className="text-white">Logró X, medido a través de Y, mediante Z</strong>.
            </p>
            <div className="bg-slate-900/90 p-2 rounded text-[10px] space-y-1 font-mono border border-slate-700">
              <div className="text-red-300">❌ Evita: &quot;Hacía ventas y reportes operativos.&quot;</div>
              <div className="text-emerald-300">✓ Ideal: &quot;Optimicé un 35% el ciclo de ventas B2B mediante prospección en CRM HubSpot y negociación de contratos clave.&quot;</div>
            </div>
          </div>

          {/* Card 3: Ortografía y ATS */}
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-lg p-3">
            <div className="flex items-center gap-1.5 font-bold text-blue-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Vigilancia Ortográfica y ATS</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Cuidado crítico con las tildes diacríticas en verbos en pretérito en primera persona (<strong className="text-white">diseñé, lideré, optimicé, gestioné, audité</strong>). Un error gramatical reduce drásticamente la puntuación ATS y la confianza del reclutador ejecutivo.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

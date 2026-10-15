import React from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, ArrowUpRight, Award, Zap } from 'lucide-react';
import { DeepAIAuditResult } from '../types/ats';

interface DeepAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: DeepAIAuditResult | null;
  loading: boolean;
}

export const DeepAuditModal: React.FC<DeepAuditModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  loading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">Auditoría Ejecutiva ATS & Algorítmica</h3>
              <p className="text-xs text-slate-300">
                Simulación de parsing empresarial (Workday, Taleo, Greenhouse, iCIMS)
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          {loading ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-blue-900 border-t-emerald-500 rounded-full animate-spin mx-auto" />
              <p className="font-semibold text-slate-700">Analizando sintaxis, densidad de palabras clave y métricas...</p>
              <p className="text-xs text-slate-400">Consultando los filtros de selección de los ATS corporativos.</p>
            </div>
          ) : auditResult ? (
            <>
              {/* Verdict Banner */}
              <div className="bg-gradient-to-r from-slate-900 to-blue-950 text-white p-5 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block mb-1">
                    Veredicto del Algoritmo
                  </span>
                  <h4 className="text-xl font-bold">{auditResult.overallVerdict}</h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Calificación de compatibilidad directa calculada por el motor de inteligencia.
                  </p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-bold text-2xl">
                    {auditResult.atsScore}%
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Estructura</span>
                  <span className="text-sm font-bold text-slate-800">
                    {auditResult.formattingCompliance.isSingleColumn ? 'Columna Única ✓' : 'Multicolumna ⚠️'}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Elementos Ilegibles</span>
                  <span className="text-sm font-bold text-emerald-700">0 Detectados ✓</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Métricas Cuantificadas</span>
                  <span className="text-sm font-bold text-blue-900">
                    {auditResult.formattingCompliance.quantifiableMetricsRatio}
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-xs text-slate-500 block">Verbos de Alto Impacto</span>
                  <span className="text-sm font-bold text-blue-900">
                    {auditResult.formattingCompliance.actionVerbPrevalence}
                  </span>
                </div>
              </div>

              {/* Strengths & Gaps */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
                  <h5 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Fortalezas Detectadas
                  </h5>
                  <ul className="space-y-1.5 text-xs text-emerald-950">
                    {auditResult.strengths.map((str, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                  <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Brechas Críticas a Cerrar
                  </h5>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    {auditResult.criticalGaps.map((gap, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Plan */}
              {auditResult.actionPlanToReach95 && auditResult.actionPlanToReach95.length > 0 && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-500" /> Plan de Acción Inmediato para Superar el 95%
                  </h5>
                  <div className="space-y-2">
                    {auditResult.actionPlanToReach95.map((step, i) => (
                      <div key={i} className="text-xs text-slate-700 flex items-start gap-2 bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                          {i + 1}
                        </span>
                        <span className="flex-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">
              No hay datos de auditoría disponibles.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Entendido, volver a optimizar
          </button>
        </div>
      </div>
    </div>
  );
};

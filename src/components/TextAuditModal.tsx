import React, { useState } from 'react';
import {
  CheckCheck,
  X,
  Sparkles,
  AlertTriangle,
  Check,
  RefreshCw,
  SpellCheck,
  ArrowRight,
  ShieldCheck,
  FileText,
  CheckCircle2,
  ThumbsUp
} from 'lucide-react';
import { TextAuditResult, TextAuditIssue, CVData } from '../types/ats';

interface TextAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: TextAuditResult | null;
  loading: boolean;
  onReScan: () => void;
  onApplySingleCorrection: (issue: TextAuditIssue) => void;
  onApplyAllCorrections: (issues: TextAuditIssue[]) => void;
}

export const TextAuditModal: React.FC<TextAuditModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  loading,
  onReScan,
  onApplySingleCorrection,
  onApplyAllCorrections,
}) => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'ortografía' | 'gramática' | 'estilo_redacción'>('all');

  if (!isOpen) return null;

  const handleApply = (issue: TextAuditIssue) => {
    onApplySingleCorrection(issue);
    setAppliedIds((prev) => new Set(prev).add(issue.id));
  };

  const handleApplyAll = () => {
    if (!auditResult?.issues) return;
    const remaining = auditResult.issues.filter(i => !appliedIds.has(i.id));
    onApplyAllCorrections(remaining);
    const allIds = new Set(auditResult.issues.map(i => i.id));
    setAppliedIds(allIds);
  };

  const filteredIssues = (auditResult?.issues || []).filter(issue => {
    if (filterType === 'all') return true;
    return issue.errorType === filterType;
  });

  const getBadgeStyle = (type: TextAuditIssue['errorType']) => {
    switch (type) {
      case 'ortografía':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'gramática':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'estilo_redacción':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getTypeLabel = (type: TextAuditIssue['errorType']) => {
    switch (type) {
      case 'ortografía': return 'Ortografía & Tildes';
      case 'gramática': return 'Gramática';
      case 'estilo_redacción': return 'Estilo & Claridad';
      default: return type;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-700 text-white shadow-inner">
              <SpellCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Revisión de Errores & Auditor de Texto</h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  IA Lingüística
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Detección inteligente de acentos, concordancia gramatical y vicios de redacción ejecutiva.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Banner */}
        {auditResult && !loading && (
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center font-black text-blue-900 text-sm">
                  {auditResult.healthScore}%
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                    Salud Lingüística del CV
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {auditResult.issues.length === 0
                      ? 'Sin errores detectados'
                      : `${auditResult.issues.length} observación(es) encontrada(s)`}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onReScan}
                className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Volver a Escanear</span>
              </button>

              {auditResult.issues.length > 0 && auditResult.issues.some(i => !appliedIds.has(i.id)) && (
                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Aplicar Todas las Correcciones</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Filters */}
        {auditResult && auditResult.issues.length > 0 && !loading && (
          <div className="px-6 py-2 border-b border-slate-200 bg-white flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-1">
              Filtrar por:
            </span>
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterType === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Todos ({auditResult.issues.length})
            </button>
            <button
              onClick={() => setFilterType('ortografía')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterType === 'ortografía'
                  ? 'bg-rose-700 text-white'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
              }`}
            >
              Ortografía & Tildes ({auditResult.issues.filter(i => i.errorType === 'ortografía').length})
            </button>
            <button
              onClick={() => setFilterType('gramática')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterType === 'gramática'
                  ? 'bg-blue-800 text-white'
                  : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
              }`}
            >
              Gramática ({auditResult.issues.filter(i => i.errorType === 'gramática').length})
            </button>
            <button
              onClick={() => setFilterType('estilo_redacción')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                filterType === 'estilo_redacción'
                  ? 'bg-amber-700 text-white'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100'
              }`}
            >
              Estilo Ejecutivo ({auditResult.issues.filter(i => i.errorType === 'estilo_redacción').length})
            </button>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-800 flex-1">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
              <p className="font-bold text-sm text-slate-800">
                Escaneando ortografía, concordancia y estilo con el motor de IA...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Revisando tildes diacríticas, tiempos verbales y patrones de redacción ejecutiva en todo tu CV.
              </p>
            </div>
          ) : auditResult && filteredIssues.length > 0 ? (
            <div className="space-y-4">
              {filteredIssues.map((issue) => {
                const isApplied = appliedIds.has(issue.id);

                return (
                  <div
                    key={issue.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isApplied
                        ? 'bg-emerald-50/40 border-emerald-300 opacity-90'
                        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyle(issue.errorType)}`}>
                          {getTypeLabel(issue.errorType)}
                        </span>
                        <span className="text-xs font-bold text-slate-900">
                          {issue.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {issue.targetSection === 'summary' ? 'Resumen Ejecutivo' : issue.targetSection === 'experience' ? `Puesto ${(issue.expIndex ?? 0) + 1}` : 'Título'}
                        </span>

                        <button
                          type="button"
                          disabled={isApplied}
                          onClick={() => handleApply(issue)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                            isApplied
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-blue-900 hover:bg-blue-950 text-white shadow-xs'
                          }`}
                        >
                          {isApplied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span>¡Corregido!</span>
                            </>
                          ) : (
                            <>
                              <span>Aplicar Corrección</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Comparison Box */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                      {/* Original text */}
                      <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200 text-xs text-rose-950">
                        <span className="text-[10px] font-bold uppercase text-rose-700 block mb-1">
                          Texto Original:
                        </span>
                        <p className="line-through opacity-85 leading-relaxed font-sans">
                          {issue.originalText}
                        </p>
                      </div>

                      {/* Suggested text */}
                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950">
                        <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">
                          Texto Corregido Sugerido:
                        </span>
                        <p className="font-medium leading-relaxed font-sans">
                          {issue.suggestedText}
                        </p>
                      </div>
                    </div>

                    {/* Explanation */}
                    <p className="text-[11px] text-slate-600 mt-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80 leading-relaxed">
                      💡 <strong>Por qué corregir:</strong> {issue.explanation}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : auditResult && auditResult.issues.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-base text-slate-900">
                ¡Tu currículum tiene una redacción impecable!
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                No se detectaron faltas ortográficas, tildes omitidas ni problemas de concordancia. Tu perfil proyecta un estándar lingüístico de nivel ejecutivo.
              </p>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500">
              Presiona "Volver a Escanear" para iniciar la auditoría de texto.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {appliedIds.size} de {auditResult?.issues.length || 0} correcciones aplicadas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800 transition-colors"
          >
            Cerrar Auditor
          </button>
        </div>
      </div>
    </div>
  );
};

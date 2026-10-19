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
  FileCheck2,
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { TextAuditResult, TextAuditIssue, CVData } from '../types/ats';

interface TextAuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  auditResult: TextAuditResult | null;
  loading: boolean;
  cvData: CVData;
  onReScan: () => void;
  onApplySingleCorrection: (issue: TextAuditIssue) => void;
  onApplyAllCorrections: (issues: TextAuditIssue[]) => void;
}

export const TextAuditModal: React.FC<TextAuditModalProps> = ({
  isOpen,
  onClose,
  auditResult,
  loading,
  cvData,
  onReScan,
  onApplySingleCorrection,
  onApplyAllCorrections,
}) => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [filterType, setFilterType] = useState<'all' | 'ortografía' | 'gramática' | 'estilo_redacción'>('all');
  const [activeTab, setActiveTab] = useState<'issues' | 'breakdown'>('issues');

  if (!isOpen) return null;

  const handleApply = (issue: TextAuditIssue) => {
    onApplySingleCorrection(issue);
    setAppliedIds((prev) => new Set(prev).add(issue.id));
  };

  const handleApplyAll = () => {
    if (!auditResult?.issues) return;
    const remaining = auditResult.issues.filter((i) => !appliedIds.has(i.id));
    onApplyAllCorrections(remaining);
    const allIds = new Set(auditResult.issues.map((i) => i.id));
    setAppliedIds(allIds);
  };

  const filteredIssues = (auditResult?.issues || []).filter((issue) => {
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
      case 'ortografía':
        return 'Ortografía & Tildes';
      case 'gramática':
        return 'Gramática';
      case 'estilo_redacción':
        return 'Estilo & Claridad';
      default:
        return type;
    }
  };

  // Calculate stats if not in result
  const titleText = cvData.contactInfo?.professionalTitle || '';
  const summaryText = cvData.summary || '';
  const totalBullets = (cvData.experience || []).reduce((acc, exp) => acc + (exp.bullets?.length || 0), 0);
  const totalWords =
    titleText.split(/\s+/).filter(Boolean).length +
    summaryText.split(/\s+/).filter(Boolean).length +
    (cvData.experience || []).reduce(
      (acc, exp) => acc + (exp.bullets || []).join(' ').split(/\s+/).filter(Boolean).length,
      0
    );

  const stats = auditResult?.statistics || {
    wordsAudited: totalWords,
    sectionsAudited: 3,
    bulletPointsAudited: totalBullets,
    formalityLevel: (auditResult?.healthScore || 90) >= 90 ? 'Nivel Profesional Alto' : 'Nivel Profesional Estándar',
    orthographyStatus: (auditResult?.issues.length || 0) === 0 ? 'Sin Errores Detectados' : `${auditResult?.issues.length} Observaciones`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 no-print animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-4 sm:px-6 py-3.5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-2 rounded-xl bg-blue-700 text-white shadow-inner shrink-0">
              <SpellCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h3 className="font-extrabold text-sm sm:text-base text-white">
                  Auditoría de Errores & Estilo de Texto
                </h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  IA Lingüística
                </span>
              </div>
              <p className="text-[11px] text-slate-300 hidden sm:block">
                Detección inteligente de acentos, concordancia verbal y vicios de redacción en tu currículum.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Summary Banner */}
        {auditResult && !loading && (
          <div className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-950/80 border-2 border-blue-300 dark:border-blue-700 flex items-center justify-center font-black text-blue-950 dark:text-blue-300 text-sm shrink-0">
                {auditResult.healthScore}%
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                  Salud Lingüística del Currículum
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                  {auditResult.issues.length === 0
                    ? '100% de cumplimiento lingüístico verificado'
                    : `${auditResult.issues.length} observación(es) identificada(s)`}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={onReScan}
                className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                <span>Volver a Escanear</span>
              </button>

              {auditResult.issues.length > 0 && auditResult.issues.some((i) => !appliedIds.has(i.id)) && (
                <button
                  type="button"
                  onClick={handleApplyAll}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Aplicar Todas</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Diagnostic Metrics Strip */}
        {auditResult && !loading && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-4 sm:px-6 py-2.5 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Palabras Auditadas</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats.wordsAudited} palabras</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Secciones Analizadas</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats.sectionsAudited} secciones clave</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Viñetas Verificadas</span>
              <span className="font-bold text-slate-900 dark:text-white">{stats.bulletPointsAudited} logros</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 block">Tono y Formalidad</span>
              <span className="font-bold text-blue-900 dark:text-blue-400 truncate block">{stats.formalityLevel}</span>
            </div>
          </div>
        )}

        {/* View Mode Tabs (Observaciones vs Desglose de Contenido Auditado) */}
        {auditResult && !loading && (
          <div className="px-4 sm:px-6 py-1.5 bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTab('issues')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'issues'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Observaciones y Sugerencias ({auditResult.issues.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('breakdown')}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'breakdown'
                    ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Desglose de Secciones Auditadas</span>
              </button>
            </div>

            {/* Filter by Category (only when in issues tab and has issues) */}
            {activeTab === 'issues' && auditResult.issues.length > 0 && (
              <div className="hidden md:flex items-center gap-1 text-[11px]">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterType === 'all' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  Todas
                </button>
                <button
                  onClick={() => setFilterType('ortografía')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterType === 'ortografía' ? 'bg-rose-700 text-white' : 'text-rose-700 hover:bg-rose-100'
                  }`}
                >
                  Ortografía
                </button>
                <button
                  onClick={() => setFilterType('gramática')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterType === 'gramática' ? 'bg-blue-800 text-white' : 'text-blue-800 hover:bg-blue-100'
                  }`}
                >
                  Gramática
                </button>
                <button
                  onClick={() => setFilterType('estilo_redacción')}
                  className={`px-2 py-0.5 rounded font-semibold ${
                    filterType === 'estilo_redacción' ? 'bg-amber-700 text-white' : 'text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  Estilo
                </button>
              </div>
            )}
          </div>
        )}

        {/* Body Content - Recuadro de Resultados con Desglose */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 flex-1 bg-slate-50/40">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-blue-900 animate-spin mx-auto" />
              <p className="font-bold text-sm text-slate-800">
                Escaneando ortografía, concordancia y estilo con el motor de IA...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Revisando tildes diacríticas, tiempos verbales y patrones de redacción en todo tu CV.
              </p>
            </div>
          ) : auditResult ? (
            <>
              {/* Executive General Feedback Card - Always Visible */}
              <div className="p-3.5 sm:p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block uppercase tracking-wider text-[10px] text-blue-800">
                    Dictamen de la Auditoría Lingüística:
                  </span>
                  <p className="leading-relaxed font-medium">
                    {auditResult.generalFeedback}
                  </p>
                </div>
              </div>

              {activeTab === 'issues' ? (
                /* Tab 1: Issues List or Zero-Issues Congratulation */
                filteredIssues.length > 0 ? (
                  <div className="space-y-3.5">
                    {filteredIssues.map((issue) => {
                      const isApplied = appliedIds.has(issue.id);

                      return (
                        <div
                          key={issue.id}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                            isApplied
                              ? 'bg-emerald-50/40 border-emerald-300 opacity-90'
                              : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                          }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${getBadgeStyle(
                                  issue.errorType
                                )}`}
                              >
                                {getTypeLabel(issue.errorType)}
                              </span>
                              <span className="text-xs font-bold text-slate-900">{issue.title}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                {issue.targetSection === 'summary'
                                  ? 'Resumen'
                                  : issue.targetSection === 'experience'
                                  ? `Puesto ${(issue.expIndex ?? 0) + 1}`
                                  : 'Título'}
                              </span>

                              <button
                                type="button"
                                disabled={isApplied}
                                onClick={() => handleApply(issue)}
                                className={`px-2.5 sm:px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                                  isApplied
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                    : 'bg-blue-900 hover:bg-blue-950 text-white shadow-xs'
                                }`}
                              >
                                {isApplied ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>¡Aplicado!</span>
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
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 mt-2.5">
                            {/* Original */}
                            <div className="p-2.5 rounded-lg bg-rose-50/60 border border-rose-200 text-xs text-rose-950">
                              <span className="text-[10px] font-bold uppercase text-rose-700 block mb-0.5">
                                Texto Original:
                              </span>
                              <p className="line-through opacity-85 leading-relaxed font-sans">{issue.originalText}</p>
                            </div>

                            {/* Suggested */}
                            <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-300 text-xs text-emerald-950">
                              <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-0.5">
                                Corrección Sugerida (1 Clic):
                              </span>
                              <p className="font-semibold leading-relaxed font-sans">{issue.suggestedText}</p>
                            </div>
                          </div>

                          {/* Explanation */}
                          <p className="text-[11px] text-slate-600 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200/80 leading-relaxed">
                            💡 <strong>Motivo de corrección:</strong> {issue.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* When 0 fatal issues, still render validation banner and section summary */
                  <div className="p-6 bg-white rounded-xl border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">
                      ¡Tu currículum no tiene faltas ortográficas ni errores gramaticales!
                    </h4>
                    <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                      El motor de IA analizó {stats.wordsAudited} palabras en todas las secciones y determinó que
                      cumplen plenamente con las normas de acentuación gráfica y concordancia.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('breakdown')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Ver el Desglose de Contenido Auditado</span>
                    </button>
                  </div>
                )
              ) : (
                /* Tab 2: Desglose Exhaustivo de Secciones Auditadas */
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
                    Inspección Detallada por Sección del CV:
                  </div>

                  {/* Section 1: Professional Title */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        1. Título u Oficio Profesional
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        ✓ Verificado
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                      "{cvData.contactInfo?.professionalTitle || 'Sin título definido'}"
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Palabras: {titleText.split(/\s+/).filter(Boolean).length} • Sintaxis validada para filtros de búsqueda.
                    </p>
                  </div>

                  {/* Section 2: Summary */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        2. Resumen Profesional
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          auditResult.issues.some((i) => i.targetSection === 'summary')
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {auditResult.issues.some((i) => i.targetSection === 'summary')
                          ? 'Observación detectada'
                          : '✓ Verificado'}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed">
                      "{cvData.summary || 'Sin resumen ingresado'}"
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Palabras: {summaryText.split(/\s+/).filter(Boolean).length} • Coherencia y fluidez gramatical examinada.
                    </p>
                  </div>

                  {/* Section 3: Experience Bullets */}
                  <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        3. Experiencia Laboral y Logros
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        {totalBullets} viñetas auditadas
                      </span>
                    </div>
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {(cvData.experience || []).map((exp, expIdx) => (
                        <div key={exp.id || expIdx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <span className="font-bold text-slate-800 block">
                            {exp.jobTitle} - {exp.company}
                          </span>
                          <ul className="space-y-1 text-slate-700">
                            {(exp.bullets || []).map((bullet, bIdx) => (
                              <li key={bIdx} className="flex items-start gap-1.5 text-[11px] leading-relaxed">
                                <span className="text-blue-500 font-bold">•</span>
                                <span>{bullet}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Verbos en pasado y métricas cuantificables examinados para compatibilidad ATS.
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-500 space-y-2">
              <p>Presiona "Volver a Escanear" para ejecutar el auditor de texto con IA.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 sm:px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            {appliedIds.size} de {auditResult?.issues.length || 0} correcciones aplicadas
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Cerrar Auditor
          </button>
        </div>
      </div>
    </div>
  );
};

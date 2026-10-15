import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  TrendingUp,
  Cpu,
  Layers,
  Zap,
  Plus,
  HelpCircle,
  FileCheck2,
  ChevronRight,
  Info
} from 'lucide-react';
import { ATSAnalysisResult, MissingKeyword, StructuralViolation } from '../types/ats';

interface ATSScorePanelProps {
  analysis: ATSAnalysisResult;
  onAddMissingKeyword: (kw: MissingKeyword) => void;
  onRunDeepAudit: () => void;
  targetJobTitle: string;
}

export const ATSScorePanel: React.FC<ATSScorePanelProps> = ({
  analysis,
  onAddMissingKeyword,
  onRunDeepAudit,
  targetJobTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'keywords' | 'metrics' | 'structure' | 'tips'>('keywords');

  const { overallScore, breakdown, matchedKeywords, missingKeywords, detectedMetrics, detectedActionVerbs, violations, recommendations } = analysis;

  // Determine score status badge & color
  const getScoreProfile = (score: number) => {
    if (score >= 85) {
      return {
        label: 'Nivel Élite ATS (Garantiza Filtro)',
        sub: 'Supera el percentil 90 de candidatos en Workday y Taleo.',
        color: 'text-emerald-500',
        stroke: '#10B981',
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        ringBg: 'stroke-emerald-100',
      };
    }
    if (score >= 70) {
      return {
        label: 'Aprobado para ATS (Pase Probable)',
        sub: 'Buen emparejamiento, optimiza algunas métricas para asegurar entrevista.',
        color: 'text-blue-900',
        stroke: '#1E3A8A',
        bg: 'bg-blue-50 text-blue-900 border-blue-200',
        ringBg: 'stroke-blue-100',
      };
    }
    if (score >= 50) {
      return {
        label: 'Requiere Optimización (Riesgo Medio)',
        sub: 'Faltan palabras clave críticas o evidencia cuantificada de resultados.',
        color: 'text-amber-500',
        stroke: '#F59E0B',
        bg: 'bg-amber-50 text-amber-900 border-amber-300',
        ringBg: 'stroke-amber-100',
      };
    }
    return {
      label: 'En Riesgo de Descarte Automático',
      sub: 'Baja densidad de palabras clave o formato vulnerable a rechazo.',
      color: 'text-rose-500',
      stroke: '#F43F5E',
      bg: 'bg-rose-50 text-rose-900 border-rose-300',
      ringBg: 'stroke-rose-100',
    };
  };

  const profile = getScoreProfile(overallScore);

  // Circular progress calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col no-print sticky top-20">
      {/* Top Header */}
      <div className="bg-slate-900 px-5 py-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white">Panel de Control ATS en Tiempo Real</h3>
            <p className="text-[11px] text-slate-300">
              Evaluando compatibilidad contra: <span className="text-emerald-400 font-medium truncate max-w-[150px] inline-block align-bottom">{targetJobTitle}</span>
            </p>
          </div>
        </div>

        <button
          onClick={onRunDeepAudit}
          className="px-2.5 py-1 bg-blue-700 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
          title="Ejecutar simulación exhaustiva de recruiter con Gemini"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Auditoría IA</span>
        </button>
      </div>

      {/* Main Score Radial Gauge & Status */}
      <div className="p-5 border-b border-slate-100 bg-gradient-to-b from-slate-50/70 to-white flex items-center gap-5">
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 128 128">
            <circle
              cx="64"
              cy="64"
              r={radius}
              className={`${profile.ringBg} stroke-slate-200 fill-none`}
              strokeWidth="9"
            />
            <circle
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={profile.stroke}
              strokeWidth="9"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-700 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-black text-slate-900 leading-none tracking-tight">
              {overallScore}%
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
              ATS MATCH
            </span>
          </div>
        </div>

        <div className="space-y-1.5 flex-1">
          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold border ${profile.bg}`}>
            {profile.label}
          </span>
          <p className="text-xs text-slate-600 leading-snug">
            {profile.sub}
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
            <span>Palabras CV: <strong>{analysis.wordCount}</strong></span>
            <span>•</span>
            <span>Viñetas: <strong>{analysis.bulletCount}</strong></span>
          </div>
        </div>
      </div>

      {/* 4 Score Breakdown Bars */}
      <div className="p-5 bg-white space-y-3 border-b border-slate-100">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Desglose Ponderado del Algoritmo:
        </span>

        {/* 1. Palabras Clave (40%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-700 font-semibold flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-900" />
              Alineación de Palabras Clave (40%)
            </span>
            <span className="font-bold text-slate-900">{breakdown.keywordMatch}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-900 rounded-full transition-all duration-500"
              style={{ width: `${breakdown.keywordMatch}%` }}
            />
          </div>
        </div>

        {/* 2. Métricas Cuantificables (25%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-700 font-semibold flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              Evidencia Cuantificada (25%)
            </span>
            <span className="font-bold text-slate-900">{breakdown.quantifiableMetrics}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${breakdown.quantifiableMetrics}%` }}
            />
          </div>
        </div>

        {/* 3. Verbos de Acción (15%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-700 font-semibold flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              Verbos de Acción en Pasado (15%)
            </span>
            <span className="font-bold text-slate-900">{breakdown.actionVerbs}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${breakdown.actionVerbs}%` }}
            />
          </div>
        </div>

        {/* 4. Estructura & Cumplimiento (20%) */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-700 font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-700" />
              Formato Lineal Monocolumna (20%)
            </span>
            <span className="font-bold text-slate-900">{breakdown.structuralCompliance}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-700 rounded-full transition-all duration-500"
              style={{ width: `${breakdown.structuralCompliance}%` }}
            />
          </div>
        </div>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
        <button
          onClick={() => setActiveTab('keywords')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'keywords'
              ? 'border-blue-900 text-blue-950 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Palabras Clave ({matchedKeywords.length}/{matchedKeywords.length + missingKeywords.length})
        </button>
        <button
          onClick={() => setActiveTab('structure')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'structure'
              ? 'border-blue-900 text-blue-950 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Reglas ATS ({violations.filter(v => v.isCompliant).length}/{violations.length})
        </button>
        <button
          onClick={() => setActiveTab('tips')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors cursor-pointer ${
            activeTab === 'tips'
              ? 'border-blue-900 text-blue-950 bg-white'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          Mejoras ({recommendations.length})
        </button>
      </div>

      {/* Tab Contents */}
      <div className="p-4 overflow-y-auto max-h-[350px] space-y-4 text-xs">
        {/* Tab 1: Keywords */}
        {activeTab === 'keywords' && (
          <div className="space-y-4">
            {/* Missing Keywords */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-bold text-amber-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Faltantes ({missingKeywords.length}) — Agrégalas con un clic:
                </span>
              </div>
              {missingKeywords.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingKeywords.map((kw, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => onAddMissingKeyword(kw)}
                      className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300 rounded-md font-medium text-[11px] flex items-center gap-1 transition-all hover:scale-102 cursor-pointer shadow-2xs"
                      title="Haz clic para agregar a Habilidades"
                    >
                      <Plus className="w-3 h-3 text-amber-700" />
                      <span>{kw.word}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-700 text-xs italic bg-emerald-50 p-2 rounded border border-emerald-200">
                  ✓ ¡Excelente! Todas las competencias principales de la vacante están presentes en tu CV.
                </p>
              )}
            </div>

            {/* Matched Keywords */}
            <div className="pt-2 border-t border-slate-100">
              <span className="font-bold text-emerald-900 uppercase tracking-wider text-[11px] flex items-center gap-1 mb-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Coincidencias Validadas ({matchedKeywords.length}):
              </span>
              <div className="flex flex-wrap gap-1.5">
                {matchedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-emerald-50 text-emerald-950 border border-emerald-200 rounded-md font-medium text-[11px] flex items-center gap-1"
                  >
                    <span>{kw.word}</span>
                    <span className="text-[9px] text-emerald-700 bg-emerald-100 px-1 rounded-full">
                      x{kw.frequencyInCV}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Structural Rules */}
        {activeTab === 'structure' && (
          <div className="space-y-2.5">
            {violations.map((rule) => (
              <div
                key={rule.id}
                className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                  rule.isCompliant
                    ? 'bg-emerald-50/40 border-emerald-200'
                    : 'bg-amber-50/50 border-amber-200'
                }`}
              >
                {rule.isCompliant ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className={`font-bold text-xs ${rule.isCompliant ? 'text-emerald-950' : 'text-amber-950'}`}>
                      {rule.title}
                    </p>
                    <span className={`text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded ${
                      rule.isCompliant ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rule.isCompliant ? 'PASA' : 'REVISAR'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{rule.description}</p>
                  {!rule.isCompliant && (
                    <p className="text-[11px] text-amber-800 font-medium mt-1">
                      Solución: {rule.solution}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Tactical Tips to 95% */}
        {activeTab === 'tips' && (
          <div className="space-y-2.5">
            <div className="p-3 bg-blue-50/70 rounded-xl border border-blue-200 flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-900 mt-0.5 shrink-0" />
              <p className="text-[11px] text-blue-950 leading-relaxed">
                Los sistemas ATS utilizan análisis semántico y frecuencia inversa de documentos (TF-IDF). Sigue estas instrucciones para asegurar tu lugar en las primeras posiciones:
              </p>
            </div>

            {recommendations.map((rec, i) => (
              <div
                key={i}
                className="p-3 bg-white rounded-xl border border-slate-200 flex items-start gap-2.5 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <p className="text-slate-700 text-xs leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
          Formato Single-Column Certificado
        </span>
        <button
          onClick={onRunDeepAudit}
          className="text-blue-900 font-bold hover:underline flex items-center gap-1"
        >
          Ver reporte completo <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};

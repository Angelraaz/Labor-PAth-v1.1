import React, { useState } from 'react';
import {
  FileDown,
  Sparkles,
  Check,
  ChevronDown,
  Layers,
  FileText,
  Code2,
  Share2,
  Target,
  FolderOpen,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { CVData, JobTarget } from '../types/ats';
import { exportToPDF, exportPlainText, exportJSON, exportMarkdown } from '../services/exportService';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

interface HeaderProps {
  cvData: CVData;
  currentTarget: JobTarget;
  overallScore: number;
  lastSaved: Date;
  onSelectSample: (sampleId: string) => void;
  onOpenTargetModal: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cvData,
  currentTarget,
  overallScore,
  lastSaved,
  onSelectSample,
  onOpenTargetModal,
  onImportJSON
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500 text-white border-emerald-600';
    if (score >= 60) return 'bg-amber-500 text-white border-amber-600';
    return 'bg-rose-500 text-white border-rose-600';
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Target */}
        <div className="flex items-center gap-2 sm:gap-6 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-inner shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">Labor Path</span>
                <span className="hidden min-[420px]:inline-block text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  ATS Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Optimizador & Motor de Compatibilidad
              </p>
            </div>
          </div>

          {/* Desktop Target Position Pill */}
          <button
            onClick={onOpenTargetModal}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors group cursor-pointer"
            title="Haz clic para modificar la vacante objetivo"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span className="max-w-[180px] lg:max-w-[220px] truncate font-medium">
              {currentTarget.title || 'Definir puesto objetivo'}
            </span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </button>

          {/* Mobile Target Badge Button */}
          <button
            onClick={onOpenTargetModal}
            className="flex md:hidden items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs text-slate-200 transition-colors"
            title="Modificar puesto objetivo"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Auto-save status */}
          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 pr-2 border-r border-slate-700">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Autoguardado</span>
            <span className="font-mono text-[11px] text-slate-400">
              {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          {/* Sample profiles dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowPresetsMenu(!showPresetsMenu);
                setShowExportMenu(false);
              }}
              className="px-2 sm:px-2.5 py-1.5 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-medium flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer select-none"
              title="Cargar perfiles de prueba"
            >
              <FolderOpen className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden sm:inline">Ejemplos</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showPresetsMenu && (
              <div className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-1.5rem)] bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                  Cargar perfil empresarial de prueba:
                </div>
                {SAMPLE_PROFILES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => {
                      onSelectSample(sample.id);
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 hover:bg-blue-50 text-slate-700 hover:text-blue-900 transition-colors block cursor-pointer"
                  >
                    <p className="font-semibold text-xs">{sample.roleTitle}</p>
                    <p className="text-[10px] text-slate-500 truncate">{sample.jobTarget.company}</p>
                  </button>
                ))}
                <div className="border-t border-slate-100 pt-1 mt-1 px-3">
                  <label className="flex items-center gap-1.5 py-2 text-slate-600 hover:text-slate-900 cursor-pointer">
                    <Code2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Importar Payload JSON...</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        onImportJSON(e);
                        setShowPresetsMenu(false);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Main Primary CTA: Descargar CV Optimizado (PDF) */}
          <div className="relative inline-flex items-stretch h-8 rounded-lg shadow-xs shrink-0">
            <button
              onClick={exportToPDF}
              className="h-full px-2 sm:px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-l-lg flex items-center gap-1.5 transition-colors cursor-pointer select-none whitespace-nowrap"
              title="Descargar CV en formato PDF de columna única 100% optimizado para ATS"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span>
                Descargar <span className="hidden sm:inline">CV Optimizado</span><span className="sm:hidden">CV</span>
              </span>
            </button>

            {/* Split dropdown for other formats */}
            <button
              onClick={() => {
                setShowExportMenu(!showExportMenu);
                setShowPresetsMenu(false);
              }}
              className="h-full px-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-r-lg border-l border-emerald-800/80 flex items-center justify-center transition-colors cursor-pointer shrink-0 select-none"
              title="Más formatos de exportación"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white text-slate-900 rounded-xl shadow-xl border border-slate-200 py-1.5 z-50 animate-fade-in text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-100">
                  Formatos de Exportación ATS:
                </div>
                <button
                  onClick={() => {
                    exportToPDF();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Printer className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="font-semibold text-slate-900">PDF ATS Monocolumna</p>
                    <p className="text-[10px] text-slate-500">Impresión vectorizada limpia</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportPlainText(cvData);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Texto Plano ATS (.txt)</p>
                    <p className="text-[10px] text-slate-500">Ideal para portales legacy</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportJSON(cvData);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Code2 className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Payload JSON Estructurado</p>
                    <p className="text-[10px] text-slate-500">Para APIs o respaldo</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportMarkdown(cvData);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                >
                  <Share2 className="w-4 h-4 text-purple-600" />
                  <div>
                    <p className="font-semibold text-slate-900">Markdown (.md)</p>
                    <p className="text-[10px] text-slate-500">Para GitHub o Notion</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

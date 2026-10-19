import React, { useState } from 'react';
import { Target, Sparkles, X, Briefcase, Building, FileText, ArrowRight } from 'lucide-react';
import { JobTarget } from '../types/ats';
import { parseJobDescriptionWithAI } from '../services/aiService';

interface JobTargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTarget: JobTarget;
  onSaveTarget: (target: JobTarget) => void;
}

export const JobTargetModal: React.FC<JobTargetModalProps> = ({
  isOpen,
  onClose,
  currentTarget,
  onSaveTarget,
}) => {
  const [title, setTitle] = useState(currentTarget.title);
  const [company, setCompany] = useState(currentTarget.company || '');
  const [rawDescription, setRawDescription] = useState(currentTarget.rawDescription);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleAnalyzeAndSave = async () => {
    setIsAnalyzing(true);
    try {
      const extracted = await parseJobDescriptionWithAI(title, rawDescription);
      onSaveTarget({
        title,
        company,
        rawDescription,
        extractedEntities: extracted,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-2 sm:p-4 no-print animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh] text-slate-900 dark:text-slate-100 transition-colors">
        {/* Header */}
        <div className="bg-slate-900 dark:bg-slate-950 px-4 py-3 sm:px-6 sm:py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <div className="p-1.5 sm:p-2 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0">
              <Target className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-sm sm:text-base text-white truncate">Puesto Objetivo & Vacante</h3>
              <p className="text-[11px] sm:text-xs text-slate-300 truncate">
                Calibración de palabras clave y motor ATS adaptado a tu profesión u oficio.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-slate-800 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-slate-800 dark:text-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Puesto Objetivo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Mecánico Automotriz / Auxiliar Contable / Encargado de Tienda"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white font-medium"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
                Empresa o Industria (Opcional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ej. Taller Diésel / Despacho Corporativo / Grupo Comercial"
                  className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Descripción / Requisitos de la Oferta Laboral
              </label>
              <span className="text-[11px] text-slate-400 hidden sm:inline">
                Pega el texto de la vacante o perfil buscado
              </span>
            </div>
            <textarea
              rows={5}
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              placeholder="Pega aquí la descripción completa del puesto, requisitos del oficio, herramientas requeridas y responsabilidades clave..."
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 font-mono text-slate-800 dark:text-slate-100 leading-relaxed"
            />
          </div>

          <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3 rounded-lg border border-blue-200 dark:border-blue-800 flex items-start gap-2 text-xs text-blue-950 dark:text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-900 dark:text-blue-400 mt-0.5 shrink-0" />
            <p>
              Al hacer clic en <strong>"Analizar y Calibrar Motor ATS"</strong>, la IA adaptará las palabras clave y el vocabulario técnico de forma 100% multidisciplinaria a tu oficio o profesión.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-950 px-4 py-3 sm:px-6 sm:py-3.5 border-t border-slate-200 dark:border-slate-800 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2 sm:gap-0">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium px-4 py-2.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-center min-h-[42px] flex items-center justify-center cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAnalyzeAndSave}
            disabled={isAnalyzing || !title.trim()}
            className="text-xs font-semibold text-white bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 dark:hover:bg-blue-500 disabled:opacity-50 px-5 py-2.5 rounded-lg shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[44px]"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Extrayendo Entidades ATS...</span>
              </>
            ) : (
              <>
                <span>Analizar y Calibrar Motor ATS</span> <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

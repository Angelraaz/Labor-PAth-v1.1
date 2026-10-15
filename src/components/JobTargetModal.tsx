import React, { useState } from 'react';
import { Target, X, Sparkles, Building, Briefcase, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { JobTarget } from '../types/ats';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';
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

  React.useEffect(() => {
    setTitle(currentTarget.title);
    setCompany(currentTarget.company || '');
    setRawDescription(currentTarget.rawDescription);
  }, [currentTarget, isOpen]);

  if (!isOpen) return null;

  const handleAnalyzeAndSave = async () => {
    if (!title.trim()) return;
    setIsAnalyzing(true);
    try {
      const extracted = await parseJobDescriptionWithAI(title, rawDescription);
      onSaveTarget({
        title,
        company,
        rawDescription,
        extractedEntities: extracted
      });
      onClose();
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_PROFILES.find(s => s.id === sampleId);
    if (sample) {
      setTitle(sample.jobTarget.title);
      setCompany(sample.jobTarget.company || '');
      setRawDescription(sample.jobTarget.rawDescription);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 no-print animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Configurar Puesto Objetivo & Vacante</h3>
              <p className="text-xs text-slate-300">
                El motor ATS calibrará las palabras clave y el puntaje de compatibilidad contra este perfil.
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

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-800">
          {/* Quick presets */}
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              O selecciona un ejemplo empresarial listo para probar:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {SAMPLE_PROFILES.map((sample) => (
                <button
                  key={sample.id}
                  type="button"
                  onClick={() => handleLoadSample(sample.id)}
                  className="text-left p-2.5 rounded-lg border border-slate-200 hover:border-blue-900 hover:bg-blue-50/50 transition-all text-xs"
                >
                  <p className="font-semibold text-slate-900 truncate">{sample.roleTitle}</p>
                  <p className="text-[11px] text-slate-500 truncate">{sample.jobTarget.company}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Puesto Objetivo <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="ej. Senior Full Stack Engineer"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Empresa o Industria (Opcional)
              </label>
              <div className="relative">
                <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="ej. Fintech Global / Banca Digital"
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
                />
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Descripción / Requisitos de la Oferta Laboral
              </label>
              <span className="text-[11px] text-slate-400">
                Pega el texto de LinkedIn, Indeed, etc.
              </span>
            </div>
            <textarea
              rows={8}
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              placeholder="Pega aquí la descripción completa del puesto, requisitos técnicos, experiencia esperada y responsabilidades..."
              className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white font-mono text-slate-800 leading-relaxed"
            />
          </div>

          <div className="bg-blue-50/70 p-3 rounded-lg border border-blue-200 flex items-start gap-2 text-xs text-blue-950">
            <Sparkles className="w-4 h-4 text-blue-900 mt-0.5 shrink-0" />
            <p>
              Al hacer clic en <strong>"Analizar y Calibrar Motor ATS"</strong>, el sistema extraerá automáticamente las competencias técnicas, metodologías y verbos clave para calcular tu porcentaje de compatibilidad en tiempo real.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-600 hover:text-slate-900 font-medium px-4 py-2 rounded-lg hover:bg-slate-200"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAnalyzeAndSave}
            disabled={isAnalyzing || !title.trim()}
            className="text-xs font-semibold text-white bg-blue-900 hover:bg-blue-950 disabled:opacity-50 px-5 py-2.5 rounded-lg shadow-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Extrayendo Entidades ATS...
              </>
            ) : (
              <>
                Analizar y Calibrar Motor ATS <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExperienceItem } from '../../types/ats';
import { checkBulletStartsActionVerb, detectMetricsInText } from '../../services/atsScoringEngine';
import { BulletOptimizerModal } from '../BulletOptimizerModal';

interface ExperienceEditorProps {
  experience: ExperienceItem[];
  targetJob: string;
  missingKeywords: string[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experience,
  targetJob,
  missingKeywords,
  onChange,
}) => {
  // Modal state for optimizing a bullet
  const [activeModalBullet, setActiveModalBullet] = useState<{
    expIndex: number;
    bulletIndex: number;
    text: string;
  } | null>(null);

  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: 'Presente',
      current: true,
      bullets: [
        'Lideré la ejecución de actividades operativas y de control de calidad, incrementando la productividad en un 25% y reduciendo tiempos de entrega.'
      ]
    };
    const updated = [newItem, ...experience];
    onChange(updated);
    setExpandedIndex(0);
  };

  const removeExperience = (index: number) => {
    const updated = experience.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExpField = (index: number, field: keyof ExperienceItem, value: any) => {
    const updated = [...experience];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange(updated);
  };

  const updateBullet = (expIndex: number, bulletIndex: number, text: string) => {
    const updated = [...experience];
    const bullets = [...updated[expIndex].bullets];
    bullets[bulletIndex] = text;
    updated[expIndex].bullets = bullets;
    onChange(updated);
  };

  const addBullet = (expIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets.push('');
    onChange(updated);
  };

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    const updated = [...experience];
    updated[expIndex].bullets = updated[expIndex].bullets.filter((_, i) => i !== bulletIndex);
    onChange(updated);
  };

  const moveBullet = (expIndex: number, bulletIndex: number, direction: 'up' | 'down') => {
    const updated = [...experience];
    const bullets = [...updated[expIndex].bullets];
    const targetIdx = direction === 'up' ? bulletIndex - 1 : bulletIndex + 1;
    if (targetIdx < 0 || targetIdx >= bullets.length) return;
    const temp = bullets[bulletIndex];
    bullets[bulletIndex] = bullets[targetIdx];
    bullets[targetIdx] = temp;
    updated[expIndex].bullets = bullets;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            3. Experiencia Laboral Cuantificable (Fórmula XYZ)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Los algoritmos ATS priorizan viñetas que inician con verbos en pasado y respaldan resultados con números (%, $, escala).
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Puesto</span>
        </button>
      </div>

      <div className="space-y-3.5">
        {experience.map((exp, expIdx) => {
          const isExpanded = expandedIndex === expIdx;

          return (
            <div
              key={exp.id || expIdx}
              className="border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 shadow-xs overflow-hidden transition-all"
            >
              {/* Job Header Bar */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? -1 : expIdx)}
                className="p-3.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer border-b border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {exp.jobTitle || 'Nuevo Puesto'} {exp.company ? `— ${exp.company}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {exp.startDate || 'Inicio'} - {exp.current ? 'Presente' : (exp.endDate || 'Fin')} | {exp.bullets.length} viñetas
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeExperience(expIdx);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                    title="Eliminar este puesto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button type="button" className="p-1 text-slate-400">
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Job Details & Bullets Form */}
              {isExpanded && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Puesto / Cargo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateExpField(expIdx, 'jobTitle', e.target.value)}
                        placeholder="ej. Supervisor de Operaciones / Mecánico / Auxiliar Administrativo"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white dark:placeholder-slate-500 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Empresa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExpField(expIdx, 'company', e.target.value)}
                        placeholder="ej. Grupo Industrial / Taller Central / Corporativo Servicios"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white dark:placeholder-slate-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExpField(expIdx, 'location', e.target.value)}
                        placeholder="ej. Remoto / Ciudad de México"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-800 text-slate-900 dark:text-white dark:placeholder-slate-500"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Fecha Inicio
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => updateExpField(expIdx, 'startDate', e.target.value)}
                          placeholder="ej. Ene 2021"
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Fecha Fin
                        </label>
                        <input
                          type="text"
                          disabled={exp.current}
                          value={exp.current ? 'Presente' : exp.endDate}
                          onChange={(e) => updateExpField(expIdx, 'endDate', e.target.value)}
                          placeholder="ej. Dic 2023"
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="sm:col-span-4 flex items-center gap-2 pt-1">
                      <input
                        type="checkbox"
                        id={`curr_${expIdx}`}
                        checked={exp.current}
                        onChange={(e) => {
                          const isCurr = e.target.checked;
                          updateExpField(expIdx, 'current', isCurr);
                          if (isCurr) {
                            updateExpField(expIdx, 'endDate', 'Presente');
                          }
                        }}
                        className="rounded border-slate-300 dark:border-slate-700 text-blue-900 dark:text-blue-500 focus:ring-blue-900"
                      />
                      <label htmlFor={`curr_${expIdx}`} className="text-xs text-slate-700 dark:text-slate-300 select-none cursor-pointer">
                        Actualmente trabajo en este puesto
                      </label>
                    </div>
                  </div>

                  {/* Bullet points section */}
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                        Logros Cuantificables (Viñetas de Impacto)
                      </label>
                      <button
                        type="button"
                        onClick={() => addBullet(expIdx)}
                        className="text-[11px] font-semibold text-blue-900 dark:text-blue-400 hover:text-blue-950 dark:hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" /> Añadir viñeta
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {exp.bullets.map((bullet, bulletIdx) => {
                        const verbCheck = checkBulletStartsActionVerb(bullet);
                        const metrics = detectMetricsInText(bullet);

                        return (
                          <div
                            key={bulletIdx}
                            className="p-3 bg-slate-50/70 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-slate-400 dark:text-slate-500 font-bold text-xs mt-1.5 select-none">
                                •
                              </span>
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={(e) => updateBullet(expIdx, bulletIdx, e.target.value)}
                                placeholder="Escribe tu logro iniciando con un verbo en pasado y agregando métricas numéricas..."
                                className="flex-1 p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-800 dark:text-slate-100 dark:placeholder-slate-500 leading-relaxed"
                              />
                            </div>

                            {/* Bullet Diagnostic Bar & Actions */}
                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              {/* Diagnostic Badges */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {verbCheck.startsWithVerb ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-medium text-[10px]">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Verbo: "{verbCheck.verb}"
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px]">
                                    ⚠️ Inicia con verbo en pasado
                                  </span>
                                )}

                                {metrics.length > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-medium text-[10px]">
                                    <TrendingUp className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                    Métrica: {metrics.map(m => m.text).join(', ')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px]">
                                    Sin métrica (%, $, núm)
                                  </span>
                                )}
                              </div>

                              {/* Action buttons */}
                              <div className="flex items-center gap-1 ml-auto">
                                <button
                                  type="button"
                                  onClick={() =>
                                    setActiveModalBullet({
                                      expIndex: expIdx,
                                      bulletIndex: bulletIdx,
                                      text: bullet
                                    })
                                  }
                                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                                  title="Optimizar con Fórmula Google XYZ usando IA"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-300" />
                                  <span>Optimizar con IA</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveBullet(expIdx, bulletIdx, 'up')}
                                  disabled={bulletIdx === 0}
                                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                                  title="Subir viñeta"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveBullet(expIdx, bulletIdx, 'down')}
                                  disabled={bulletIdx === exp.bullets.length - 1}
                                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 rounded hover:bg-slate-200 dark:hover:bg-slate-700"
                                  title="Bajar viñeta"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeBullet(expIdx, bulletIdx)}
                                  className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/40"
                                  title="Eliminar viñeta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Bullet Optimizer Modal */}
      {activeModalBullet && (
        <BulletOptimizerModal
          isOpen={!!activeModalBullet}
          onClose={() => setActiveModalBullet(null)}
          rawBullet={activeModalBullet.text}
          targetJob={targetJob}
          missingKeywords={missingKeywords}
          onApply={(optimized) => {
            updateBullet(activeModalBullet.expIndex, activeModalBullet.bulletIndex, optimized);
            setActiveModalBullet(null);
          }}
        />
      )}
    </div>
  );
};

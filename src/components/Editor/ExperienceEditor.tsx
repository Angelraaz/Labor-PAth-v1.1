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
  Building,
  Calendar,
  MapPin,
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
        'Lideré la implementación de proyectos clave, incrementando la productividad en un 25% y reduciendo tiempos de entrega.'
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
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-blue-900" />
            3. Experiencia Laboral Cuantificable (Fórmula XYZ)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
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
              className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden transition-all"
            >
              {/* Job Header Bar */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? -1 : expIdx)}
                className="p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer border-b border-slate-200"
              >
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-900 flex items-center justify-center shrink-0">
                    <Briefcase className="w-3.5 h-3.5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {exp.jobTitle || 'Nuevo Puesto'} {exp.company ? `— ${exp.company}` : ''}
                    </p>
                    <p className="text-[11px] text-slate-500">
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
                    className="p-1 text-slate-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
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
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Puesto / Cargo <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.jobTitle}
                        onChange={(e) => updateExpField(expIdx, 'jobTitle', e.target.value)}
                        placeholder="ej. Senior Full Stack Engineer"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900 font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Empresa <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) => updateExpField(expIdx, 'company', e.target.value)}
                        placeholder="ej. FinTech Global Solutions"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) => updateExpField(expIdx, 'location', e.target.value)}
                        placeholder="ej. Remoto / Ciudad de México"
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
                      />
                    </div>

                    <div className="sm:col-span-2 flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                          Periodo
                        </label>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => updateExpField(expIdx, 'startDate', e.target.value)}
                            placeholder="2021"
                            className="w-1/2 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                          />
                          <span className="text-slate-400 text-xs">-</span>
                          <input
                            type="text"
                            disabled={exp.current}
                            value={exp.current ? 'Presente' : exp.endDate}
                            onChange={(e) => updateExpField(expIdx, 'endDate', e.target.value)}
                            placeholder="Presente"
                            className="w-1/2 px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 disabled:opacity-60"
                          />
                        </div>
                      </div>
                      <label className="flex items-center gap-1.5 mt-5 text-[11px] text-slate-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={exp.current}
                          onChange={(e) => updateExpField(expIdx, 'current', e.target.checked)}
                          className="rounded text-blue-900 focus:ring-blue-900"
                        />
                        <span>Actual</span>
                      </label>
                    </div>
                  </div>

                  {/* Bullet points section */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                        Logros Cuantificables (Viñetas de Impacto)
                      </label>
                      <button
                        type="button"
                        onClick={() => addBullet(expIdx)}
                        className="text-[11px] font-semibold text-blue-900 hover:text-blue-950 flex items-center gap-1"
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
                            className="p-3 bg-slate-50/70 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex items-start gap-2">
                              <span className="text-slate-400 font-bold text-xs mt-1.5 select-none">
                                •
                              </span>
                              <textarea
                                rows={2}
                                value={bullet}
                                onChange={(e) => updateBullet(expIdx, bulletIdx, e.target.value)}
                                placeholder="Escribe tu logro iniciando con un verbo en pasado y agregando métricas numéricas..."
                                className="flex-1 p-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-800 leading-relaxed"
                              />
                            </div>

                            {/* Bullet Diagnostic Bar & Actions */}
                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                              {/* Diagnostic Badges */}
                              <div className="flex flex-wrap items-center gap-1.5">
                                {verbCheck.startsWithVerb ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-medium text-[10px]">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verbo: "{verbCheck.verb}"
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px]">
                                    ⚠️ Inicia con verbo en pasado
                                  </span>
                                )}

                                {metrics.length > 0 ? (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-medium text-[10px]">
                                    <TrendingUp className="w-3 h-3 text-blue-600" />
                                    Métrica: {metrics.map(m => m.text).join(', ')}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px]">
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
                                  className="px-2 py-1 bg-blue-900 hover:bg-blue-950 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Optimizar con Fórmula Google XYZ usando IA"
                                >
                                  <Sparkles className="w-3 h-3 text-amber-300" />
                                  <span>Optimizar XYZ</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => moveBullet(expIdx, bulletIdx, 'up')}
                                  disabled={bulletIdx === 0}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                                  title="Subir viñeta"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moveBullet(expIdx, bulletIdx, 'down')}
                                  disabled={bulletIdx === exp.bullets.length - 1}
                                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-200"
                                  title="Bajar viñeta"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeBullet(expIdx, bulletIdx)}
                                  className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
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

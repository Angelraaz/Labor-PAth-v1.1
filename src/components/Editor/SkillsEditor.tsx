import React, { useState } from 'react';
import { Cpu, Wrench, GitFork, Languages, Plus, X, Sparkles, RefreshCw, Check } from 'lucide-react';
import { SkillsData, MissingKeyword } from '../../types/ats';
import { suggestSkillsWithAI } from '../../services/aiService';

interface SkillsEditorProps {
  skills: SkillsData;
  missingKeywords: MissingKeyword[];
  targetJobTitle?: string;
  onChange: (updated: SkillsData) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  missingKeywords,
  targetJobTitle = 'Profesional',
  onChange,
}) => {
  const [techInput, setTechInput] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [methodInput, setMethodInput] = useState('');
  const [langInput, setLangInput] = useState('');

  // AI Suggestions state
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [suggestedSkills, setSuggestedSkills] = useState<{
    technical: string[];
    tools: string[];
    methodologies: string[];
  } | null>(null);

  const addSkill = (category: keyof SkillsData, value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const currentList = skills[category] || [];
    if (!currentList.some(item => item.toLowerCase() === trimmed.toLowerCase())) {
      onChange({
        ...skills,
        [category]: [...currentList, trimmed],
      });
    }
  };

  const removeSkill = (category: keyof SkillsData, index: number) => {
    const currentList = skills[category] || [];
    onChange({
      ...skills,
      [category]: currentList.filter((_, i) => i !== index),
    });
  };

  const handleAddMissingKeyword = (kw: MissingKeyword) => {
    const targetCategory: keyof SkillsData =
      kw.category === 'tools' ? 'tools' :
      kw.category === 'methodology' ? 'methodologies' : 'technical';

    addSkill(targetCategory, kw.word);
  };

  const handleFetchAISuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const res = await suggestSkillsWithAI(targetJobTitle);
      setSuggestedSkills(res);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAddAllSuggested = () => {
    if (!suggestedSkills) return;
    const updated = { ...skills };

    suggestedSkills.technical?.forEach((s) => {
      if (!updated.technical.some(e => e.toLowerCase() === s.toLowerCase())) {
        updated.technical = [...updated.technical, s];
      }
    });

    suggestedSkills.tools?.forEach((t) => {
      if (!updated.tools.some(e => e.toLowerCase() === t.toLowerCase())) {
        updated.tools = [...updated.tools, t];
      }
    });

    suggestedSkills.methodologies?.forEach((m) => {
      if (!updated.methodologies.some(e => e.toLowerCase() === m.toLowerCase())) {
        updated.methodologies = [...updated.methodologies, m];
      }
    });

    onChange(updated);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-900 dark:text-blue-400" />
            4. Competencias, Herramientas y Palabras Clave
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Los algoritmos ATS indexan listas lineales de competencias. Adaptadas específicamente a tu oficio o profesión.
          </p>
        </div>

        {/* AI Skill Suggestion Trigger */}
        <button
          type="button"
          onClick={handleFetchAISuggestions}
          disabled={isLoadingSuggestions}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs disabled:opacity-50 transition-all cursor-pointer self-start sm:self-auto shrink-0"
        >
          {isLoadingSuggestions ? (
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          )}
          <span>{isLoadingSuggestions ? 'Analizando oficio...' : 'Sugerir Habilidades con IA'}</span>
        </button>
      </div>

      {/* AI Suggested Skills Banner */}
      {suggestedSkills && (
        <div className="p-4 bg-indigo-50/90 dark:bg-indigo-950/40 rounded-xl border border-indigo-200 dark:border-indigo-800 space-y-3 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-bold text-indigo-950 dark:text-indigo-200">
                Sugerencias de IA para: <strong className="text-indigo-900 dark:text-indigo-300">{targetJobTitle}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddAllSuggested}
              className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 hover:text-indigo-950 bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md border border-indigo-300 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
            >
              + Añadir todas
            </button>
          </div>

          <p className="text-[11px] text-indigo-900 dark:text-indigo-300">
            Toca cualquiera de estas competencias para integrarla automáticamente a tu currículum:
          </p>

          <div className="flex flex-wrap gap-1.5">
            {suggestedSkills.technical?.map((skill, idx) => {
              const alreadyHas = skills.technical.some(s => s.toLowerCase() === skill.toLowerCase());
              return (
                <button
                  key={`tech-${idx}`}
                  type="button"
                  onClick={() => addSkill('technical', skill)}
                  disabled={alreadyHas}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium flex items-center gap-1 transition-all ${
                    alreadyHas
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 opacity-80 cursor-default'
                      : 'bg-white dark:bg-slate-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-300 dark:border-indigo-700 text-indigo-950 dark:text-indigo-200 shadow-2xs hover:scale-102 cursor-pointer'
                  }`}
                >
                  {alreadyHas ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Plus className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />}
                  <span>{skill}</span>
                </button>
              );
            })}

            {suggestedSkills.tools?.map((tool, idx) => {
              const alreadyHas = skills.tools.some(s => s.toLowerCase() === tool.toLowerCase());
              return (
                <button
                  key={`tool-${idx}`}
                  type="button"
                  onClick={() => addSkill('tools', tool)}
                  disabled={alreadyHas}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium flex items-center gap-1 transition-all ${
                    alreadyHas
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 opacity-80 cursor-default'
                      : 'bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-2xs hover:scale-102 cursor-pointer'
                  }`}
                >
                  {alreadyHas ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Plus className="w-3 h-3 text-slate-600 dark:text-slate-400" />}
                  <span>{tool}</span>
                </button>
              );
            })}

            {suggestedSkills.methodologies?.map((method, idx) => {
              const alreadyHas = skills.methodologies.some(s => s.toLowerCase() === method.toLowerCase());
              return (
                <button
                  key={`method-${idx}`}
                  type="button"
                  onClick={() => addSkill('methodologies', method)}
                  disabled={alreadyHas}
                  className={`px-2.5 py-1 text-xs rounded-full font-medium flex items-center gap-1 transition-all ${
                    alreadyHas
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 opacity-80 cursor-default'
                      : 'bg-white dark:bg-slate-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 shadow-2xs hover:scale-102 cursor-pointer'
                  }`}
                >
                  {alreadyHas ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Plus className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                  <span>{method}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Missing Keywords Quick Insertion Tray */}
      {missingKeywords.length > 0 && (
        <div className="p-3.5 bg-amber-50/80 dark:bg-amber-950/30 rounded-xl border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-1.5 mb-1.5 text-xs font-bold text-amber-900 dark:text-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Palabras Clave Faltantes en tu CV (Detectadas en la Vacante):</span>
          </div>
          <p className="text-[11px] text-amber-800 dark:text-amber-400/90 mb-2">
            Haz clic en cualquiera de estas palabras clave para integrarla inmediatamente a tu perfil y elevar tu puntaje ATS:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.slice(0, 10).map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddMissingKeyword(kw)}
                className="px-2.5 py-1 bg-white dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-300 text-xs rounded-full font-medium flex items-center gap-1 shadow-2xs hover:scale-102 transition-all cursor-pointer"
                title={`Añadir "${kw.word}" a habilidades`}
              >
                <Plus className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                <span>{kw.word}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category 1: Technical Skills */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-900 dark:text-blue-400" />
          Habilidades Técnicas / Especialidades del Oficio
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill('technical', techInput);
                setTechInput('');
              }
            }}
            placeholder="ej. Diagnóstico electromecánico, Patronaje industrial, Conciliación contable, Ventas consultivas..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('technical', techInput);
              setTechInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.technical?.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-blue-50 dark:bg-blue-950/60 text-blue-900 dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill('technical', i)}
                className="text-blue-400 hover:text-blue-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category 2: Tools & Equipment */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-slate-700 dark:text-slate-400" />
          Herramientas, Maquinaria, Software y Equipos
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={toolsInput}
            onChange={(e) => setToolsInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill('tools', toolsInput);
                setToolsInput('');
              }
            }}
            placeholder="ej. Scanner OBD-II, Máquina Overlock, Excel avanzado, ERP SAP, Torno CNC, Autoclave..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('tools', toolsInput);
              setToolsInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.tools?.map((tool, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-slate-200/80 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {tool}
              <button
                type="button"
                onClick={() => removeSkill('tools', i)}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category 3: Methodologies & Protocols */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" />
          Normativas, Metodologías y Estándares de Trabajo
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={methodInput}
            onChange={(e) => setMethodInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill('methodologies', methodInput);
                setMethodInput('');
              }
            }}
            placeholder="ej. 5S, NOM de seguridad laboral, Control de merma, ISO 9001, Bioseguridad, Conciliación..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('methodologies', methodInput);
              setMethodInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.methodologies?.map((m, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {m}
              <button
                type="button"
                onClick={() => removeSkill('methodologies', i)}
                className="text-emerald-500 hover:text-emerald-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category 4: Languages */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
          Idiomas
        </label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addSkill('languages', langInput);
                setLangInput('');
              }
            }}
            placeholder="ej. Español (Nativo), Inglés (Intermedio laboral)..."
            className="flex-1 px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('languages', langInput);
              setLangInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.languages?.map((lang, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-purple-50 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeSkill('languages', i)}
                className="text-purple-400 hover:text-purple-900 dark:hover:text-white cursor-pointer"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

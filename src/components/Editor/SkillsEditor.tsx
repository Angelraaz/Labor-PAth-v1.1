import React, { useState } from 'react';
import { Cpu, Wrench, GitFork, Languages, Plus, X, Sparkles } from 'lucide-react';
import { SkillsData, MissingKeyword } from '../../types/ats';

interface SkillsEditorProps {
  skills: SkillsData;
  missingKeywords: MissingKeyword[];
  onChange: (updated: SkillsData) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({
  skills,
  missingKeywords,
  onChange,
}) => {
  const [techInput, setTechInput] = useState('');
  const [toolsInput, setToolsInput] = useState('');
  const [methodInput, setMethodInput] = useState('');
  const [langInput, setLangInput] = useState('');

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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blue-900" />
          4. Habilidades Clave y Palabras Clave de la Vacante
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Los filtros ATS indexan listas lineales de competencias técnicas. Evita barras de porcentaje visuales o gráficos que ningún ATS puede leer.
        </p>
      </div>

      {/* Missing Keywords Quick Insertion Tray */}
      {missingKeywords.length > 0 && (
        <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Palabras Clave Faltantes en tu CV (Detectadas en la Vacante):</span>
          </div>
          <p className="text-[11px] text-amber-800 mb-2.5">
            Haz clic en cualquiera de estas palabras clave para integrarla inmediatamente a tu perfil y elevar tu puntaje ATS:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {missingKeywords.slice(0, 10).map((kw, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleAddMissingKeyword(kw)}
                className="px-2.5 py-1 bg-white hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs rounded-full font-medium flex items-center gap-1 shadow-2xs hover:scale-102 transition-all cursor-pointer"
                title={`Añadir "${kw.word}" a habilidades`}
              >
                <Plus className="w-3 h-3 text-amber-700" />
                <span>{kw.word}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category 1: Technical Skills */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-blue-900" />
          Habilidades Técnicas / Especialidades
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
            placeholder="ej. React, TypeScript, Microservicios, PostgreSQL (presiona Enter)..."
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('technical', techInput);
              setTechInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.technical?.map((skill, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-blue-50 text-blue-900 border border-blue-200 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill('technical', i)}
                className="text-blue-400 hover:text-blue-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category 2: Tools & Platforms */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Wrench className="w-3.5 h-3.5 text-slate-700" />
          Herramientas, Software y Plataformas Cloud
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
            placeholder="ej. AWS, Docker, Kubernetes, Git, Jira, Power BI..."
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('tools', toolsInput);
              setToolsInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.tools?.map((tool, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-slate-200/80 text-slate-800 border border-slate-300 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {tool}
              <button
                type="button"
                onClick={() => removeSkill('tools', i)}
                className="text-slate-500 hover:text-slate-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category 3: Methodologies & Frameworks */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <GitFork className="w-3.5 h-3.5 text-emerald-700" />
          Metodologías, Procesos y Marcos de Trabajo
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
            placeholder="ej. Agile, Scrum, CI/CD, TDD, DevOps, OKRs..."
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('methodologies', methodInput);
              setMethodInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.methodologies?.map((m, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {m}
              <button
                type="button"
                onClick={() => removeSkill('methodologies', i)}
                className="text-emerald-500 hover:text-emerald-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Category 4: Languages */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
        <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <Languages className="w-3.5 h-3.5 text-purple-700" />
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
            placeholder="ej. Español (Nativo), Inglés (C1 Profesional)..."
            className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 text-slate-900"
          />
          <button
            type="button"
            onClick={() => {
              addSkill('languages', langInput);
              setLangInput('');
            }}
            className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Añadir
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills.languages?.map((lang, i) => (
            <span
              key={i}
              className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-200 rounded-md text-xs font-medium flex items-center gap-1.5"
            >
              {lang}
              <button
                type="button"
                onClick={() => removeSkill('languages', i)}
                className="text-purple-400 hover:text-purple-900"
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

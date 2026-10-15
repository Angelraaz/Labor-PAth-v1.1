import React, { useState, useEffect } from 'react';
import { CVData, JobTarget, LinkedInOptimizationResult, LinkedInChecklistItem } from '../types/ats';
import { optimizeLinkedInWithAI } from '../services/aiService';
import {
  Sparkles,
  Copy,
  Check,
  CheckCircle2,
  Circle,
  AlertTriangle,
  Award,
  Layers,
  Search,
  ExternalLink,
  RefreshCw,
  User,
  Briefcase,
  ChevronRight,
  TrendingUp,
  Cpu,
  Eye,
  Info
} from 'lucide-react';
import { AIInspirationBanner } from './AIInspirationBanner';

interface LinkedInOptimizerProps {
  cvData: CVData;
  currentTarget: JobTarget;
}

const DEFAULT_CHECKLIST: LinkedInChecklistItem[] = [
  // Headline
  {
    id: 'hl_title',
    label: 'El titular contiene el puesto objetivo exacto al inicio',
    impact: 'crítico',
    tip: 'El algoritmo de LinkedIn Recruiter asigna máxima relevancia a las primeras 3 palabras del titular.',
    category: 'headline'
  },
  {
    id: 'hl_skills',
    label: 'Incluye entre 2 y 4 competencias técnicas de alta demanda',
    impact: 'alto',
    tip: 'Ejemplo: React • TypeScript • Node.js • AWS. Ayuda a aparecer en búsquedas booleanas.',
    category: 'headline'
  },
  {
    id: 'hl_metrics',
    label: 'Muestra una propuesta de valor o logro cuantificable',
    impact: 'alto',
    tip: 'Evita descripciones pasivas; añade métricas como "+35% de eficiencia" o "Escalando sistemas a 2M+ usuarios".',
    category: 'headline'
  },
  {
    id: 'hl_nobuzz',
    label: 'Libre de palabras vacías o clichés no indexables',
    impact: 'medio',
    tip: 'Elimina términos como "Ninja", "Guru", "Entusiasta" o "Buscando activamente" (usa el marco Open To Work oficial).',
    category: 'headline'
  },
  // About
  {
    id: 'ab_hook',
    label: 'Gancho magnético en las primeras 3 líneas antes del "Ver más"',
    impact: 'crítico',
    tip: 'En móvil solo se ven 2 o 3 líneas antes de que el usuario decida si hace clic en "...ver más".',
    category: 'about'
  },
  {
    id: 'ab_metrics',
    label: 'Al menos 2 logros profesionales con datos numéricos (%, $, escala)',
    impact: 'alto',
    tip: 'Respaldar tu trayectoria con números concretos aumenta la tasa de contacto de reclutadores en un 40%.',
    category: 'about'
  },
  {
    id: 'ab_keyword_block',
    label: 'Bloque estructurado de Especialidades y Tecnologías para SEO',
    impact: 'crítico',
    tip: 'Facilita la indexación del motor de búsqueda de LinkedIn agrupando todas las tecnologías clave.',
    category: 'about'
  },
  {
    id: 'ab_cta',
    label: 'Llamado a la acción (CTA) y correo de contacto visible',
    impact: 'medio',
    tip: 'Indica a los reclutadores cómo prefieres ser contactado y qué tipo de proyectos o roles te interesan.',
    category: 'about'
  },
  // Experience
  {
    id: 'exp_first_line',
    label: 'Primera viñeta de cada puesto optimizada para lectura en smartphone',
    impact: 'alto',
    tip: 'La mayoría de los reclutadores leen LinkedIn en el móvil; la primera viñeta debe ser tu mayor logro.',
    category: 'experience'
  },
  {
    id: 'exp_skills_tagged',
    label: 'Aptitudes del puesto etiquetadas en cada experiencia (Skills tag)',
    impact: 'alto',
    tip: 'LinkedIn permite asociar hasta 5 habilidades directamente a cada rol en tu historial.',
    category: 'experience'
  },
  {
    id: 'exp_media',
    label: 'Enlaces a GitHub, demos o proyectos reales adjuntos como contenido multimedia',
    impact: 'medio',
    tip: 'Los perfiles con enlaces multimedia reciben 3x más visualizaciones de perfil.',
    category: 'experience'
  },
  // Search & General
  {
    id: 'gen_url',
    label: 'URL personalizada de LinkedIn limpia (sin números aleatorios)',
    impact: 'medio',
    tip: 'Configura tu URL como linkedin.com/in/nombre-apellido para mejorar la presencia en Google.',
    category: 'search'
  }
];

export const LinkedInOptimizer: React.FC<LinkedInOptimizerProps> = ({
  cvData,
  currentTarget,
}) => {
  const [activeTab, setActiveTab] = useState<'headline' | 'about' | 'experience' | 'search'>('headline');
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('laborpath_linkedin_checklist');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return {
      hl_title: true,
      hl_skills: true,
      ab_hook: true,
      ab_keyword_block: true,
      gen_url: true,
    };
  });

  const [aiData, setAiData] = useState<LinkedInOptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedHeadlineIndex, setSelectedHeadlineIndex] = useState(0);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Auto-fetch or generate initial data
  useEffect(() => {
    fetchRecommendations();
  }, [currentTarget.title]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await optimizeLinkedInWithAI(cvData, currentTarget);
      setAiData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCheck = (id: string) => {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    try {
      localStorage.setItem('laborpath_linkedin_checklist', JSON.stringify(updated));
    } catch (e) {
      // ignore
    }
  };

  const handleCopy = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedItem(identifier);
    setTimeout(() => setCopiedItem(null), 2000);
  };

  // Checklist score calculation
  const totalItems = DEFAULT_CHECKLIST.length;
  const completedItems = DEFAULT_CHECKLIST.filter(item => checklist[item.id]).length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);

  const getProfileRank = (percentage: number) => {
    if (percentage >= 85) return { label: 'Perfil Estelar / All-Star (Máxima Visibilidad)', color: 'text-emerald-600 bg-emerald-50 border-emerald-300' };
    if (percentage >= 60) return { label: 'Perfil Avanzado (Competitivo)', color: 'text-blue-900 bg-blue-50 border-blue-200' };
    return { label: 'Perfil Básico (Requiere Optimización)', color: 'text-amber-800 bg-amber-50 border-amber-300' };
  };

  const rank = getProfileRank(completionPercentage);

  return (
    <div className="space-y-6">
      {/* Top Banner & Audit Score */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold">
              <span className="font-bold text-blue-400">in</span>
              <span>Auditoría de Perfil & Algoritmo Recruiter</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Optimización de LinkedIn para "{currentTarget.title}"
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              El 87% de los reclutadores corporativos contrastan el CV con LinkedIn. Sincroniza tu <strong>Titular</strong>, sección <strong>Acerca de</strong> y <strong>Experiencia</strong> con las palabras clave de la vacante para maximizar tu tasa de contacto.
            </p>
          </div>

          {/* All-Star Progress Box */}
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/15 min-w-[260px] flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="text-slate-300 font-semibold uppercase tracking-wider text-[11px]">
                  Fuerza del Perfil
                </span>
                <span className="text-emerald-400 font-bold text-sm">
                  {completionPercentage}%
                </span>
              </div>
              <div className="w-full h-2.5 bg-slate-800/80 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold border ${rank.color}`}>
                {rank.label}
              </span>
            </div>

            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
              <span>{completedItems} de {totalItems} requisitos listos</span>
              <button
                onClick={fetchRecommendations}
                disabled={loading}
                className="text-emerald-300 hover:text-emerald-200 font-semibold flex items-center gap-1 transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Generando...' : 'Regenerar IA'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main LinkedIn Workspace */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveTab('headline')}
            className={`flex-1 py-3 px-4 text-center border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'headline'
                ? 'border-blue-900 text-blue-950 bg-white shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-blue-900" />
            <span>1. Titular (Headline)</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-3 px-4 text-center border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'about'
                ? 'border-blue-900 text-blue-950 bg-white shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>2. Sección "Acerca de" (About)</span>
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`flex-1 py-3 px-4 text-center border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'experience'
                ? 'border-blue-900 text-blue-950 bg-white shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Briefcase className="w-4 h-4 text-slate-700" />
            <span>3. Experiencia para Móvil</span>
          </button>

          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 py-3 px-4 text-center border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
              activeTab === 'search'
                ? 'border-blue-900 text-blue-950 bg-white shadow-2xs'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Search className="w-4 h-4 text-blue-700" />
            <span>4. SEO & Palabras Clave</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6">
          {/* Inspiration and Authenticity Banner */}
          <AIInspirationBanner className="mb-6" />

          {/* TAB 1: HEADLINE OPTIMIZATION */}
          {activeTab === 'headline' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-900 text-xs flex items-center justify-center font-bold">1</span>
                  Optimización del Titular (Headline) de LinkedIn
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tu titular es el factor #1 de posicionamiento en el buscador de LinkedIn Recruiter. Tienes hasta <strong>220 caracteres</strong> para comunicar tu puesto, tus herramientas clave y el impacto de tu trabajo.
                </p>
              </div>

              {/* Simulated LinkedIn Search Result Card */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2.5">
                  Previsualización en Resultados de Búsqueda de LinkedIn:
                </span>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-slate-900 text-white font-black text-xl flex items-center justify-center shrink-0 border-2 border-emerald-500">
                    {cvData.contactInfo.fullName ? cvData.contactInfo.fullName.slice(0, 2).toUpperCase() : 'LP'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 hover:text-blue-900 cursor-pointer">
                        {cvData.contactInfo.fullName || 'Tu Nombre'}
                      </h4>
                      <span className="text-[11px] text-slate-400 font-medium">• 1.er</span>
                    </div>
                    <p className="text-xs text-slate-800 font-medium mt-0.5 line-clamp-2 leading-snug">
                      {aiData?.headlines[selectedHeadlineIndex]?.text || cvData.contactInfo.professionalTitle || currentTarget.title}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {cvData.contactInfo.location || 'México (o Remoto)'} • Más de 500 contactos
                    </p>
                  </div>
                </div>
              </div>

              {/* Generated Variations */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Sugerencias Generadas por el Motor (Selecciona o Copia):
                  </span>
                  <span className="text-xs text-slate-500">
                    Límite recomendado: 180 - 220 caracteres
                  </span>
                </div>

                {loading ? (
                  <div className="py-8 text-center space-y-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-blue-900 mx-auto" />
                    <p className="text-xs text-slate-600 font-medium">Calibrando titulares con alta tasa de respuesta...</p>
                  </div>
                ) : aiData?.headlines ? (
                  <div className="space-y-3">
                    {aiData.headlines.map((hl, idx) => {
                      const isSelected = selectedHeadlineIndex === idx;
                      return (
                        <div
                          key={idx}
                          onClick={() => setSelectedHeadlineIndex(idx)}
                          className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? 'border-blue-900 bg-blue-50/40 shadow-xs'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                                Opción {idx + 1}: {hl.type}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                ({hl.text.length}/220 caracteres)
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopy(hl.text, `hl_${idx}`);
                              }}
                              className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-700 flex items-center gap-1.5 shadow-2xs transition-colors"
                            >
                              {copiedItem === `hl_${idx}` ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">¡Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                                  <span>Copiar Titular</span>
                                </>
                              )}
                            </button>
                          </div>

                          <p className="text-xs sm:text-sm font-semibold text-slate-900 leading-snug">
                            {hl.text}
                          </p>

                          <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                            <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span><strong>Por qué funciona:</strong> {hl.whyItWorks}</span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </div>

              {/* Headline Interactive Checklist */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  Checklist de Validación del Titular:
                </span>
                <div className="space-y-2">
                  {DEFAULT_CHECKLIST.filter(item => item.category === 'headline').map(item => {
                    const isChecked = checklist[item.id] || false;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <button type="button" className="mt-0.5 shrink-0 text-emerald-600">
                          {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-400" />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                              {item.label}
                            </p>
                            <span className="text-[10px] uppercase font-semibold text-slate-500">
                              Impacto {item.impact}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.tip}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ABOUT SECTION */}
          {activeTab === 'about' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-900 text-xs flex items-center justify-center font-bold">2</span>
                    Sección "Acerca de" (About) Estratégica
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Diseñada con la estructura dorada: <strong>Gancho inicial</strong>, <strong>Hitos cuantificados</strong>, <strong>Nube de palabras clave para SEO</strong> y <strong>Llamado a la acción (CTA)</strong>.
                  </p>
                </div>

                {aiData?.aboutSection?.fullText && (
                  <button
                    onClick={() => handleCopy(aiData.aboutSection.fullText, 'about_full')}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    {copiedItem === 'about_full' ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>¡Texto Completo Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Todo el "Acerca de"</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {loading ? (
                <div className="py-12 text-center space-y-2">
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-600 mx-auto" />
                  <p className="text-xs text-slate-600 font-medium">Estructurando narrativa profesional con palabras clave...</p>
                </div>
              ) : aiData?.aboutSection ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left: Section Breakdown */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* Part 1: Hook */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-blue-900" />
                          1. Gancho Inicial (Visible antes del "Ver más"):
                        </span>
                        <button
                          onClick={() => handleCopy(aiData.aboutSection.hook, 'ab_hook')}
                          className="text-[11px] text-blue-900 font-semibold hover:underline"
                        >
                          {copiedItem === 'ab_hook' ? 'Copiado' : 'Copiar parte'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                        {aiData.aboutSection.hook}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        💡 Este es el texto que define si el reclutador expande tu perfil o pasa al siguiente.
                      </span>
                    </div>

                    {/* Part 2: Body & Achievements */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                          2. Trayectoria & Logros Cuantificados:
                        </span>
                        <button
                          onClick={() => handleCopy(aiData.aboutSection.body, 'ab_body')}
                          className="text-[11px] text-blue-900 font-semibold hover:underline"
                        >
                          {copiedItem === 'ab_body' ? 'Copiado' : 'Copiar parte'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-line">
                        {aiData.aboutSection.body}
                      </p>
                    </div>

                    {/* Part 3: Keyword cloud */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5 text-purple-700" />
                          3. Nube de Tecnologías & SEO de Búsqueda:
                        </span>
                        <button
                          onClick={() => handleCopy(aiData.aboutSection.keywordCloud, 'ab_cloud')}
                          className="text-[11px] text-blue-900 font-semibold hover:underline"
                        >
                          {copiedItem === 'ab_cloud' ? 'Copiado' : 'Copiar parte'}
                        </button>
                      </div>
                      <div className="text-xs font-mono text-slate-800 bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-line leading-relaxed">
                        {aiData.aboutSection.keywordCloud}
                      </div>
                    </div>

                    {/* Part 4: CTA */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                          4. Llamado a la Acción (CTA) & Contacto:
                        </span>
                        <button
                          onClick={() => handleCopy(aiData.aboutSection.callToAction, 'ab_cta')}
                          className="text-[11px] text-blue-900 font-semibold hover:underline"
                        >
                          {copiedItem === 'ab_cta' ? 'Copiado' : 'Copiar parte'}
                        </button>
                      </div>
                      <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {aiData.aboutSection.callToAction}
                      </p>
                    </div>
                  </div>

                  {/* Right: Full Preview & Checklist */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900 text-white p-4 rounded-xl">
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                        Texto Completo Ensamblado:
                      </span>
                      <textarea
                        readOnly
                        rows={12}
                        value={aiData.aboutSection.fullText}
                        className="w-full text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-200 leading-relaxed font-sans focus:outline-none resize-none"
                      />
                      <button
                        onClick={() => handleCopy(aiData.aboutSection.fullText, 'about_full_box')}
                        className="mt-3 w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedItem === 'about_full_box' ? '¡Copiado al Portapapeles!' : 'Copiar Todo el Texto'}</span>
                      </button>
                    </div>

                    {/* Checklist */}
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                        Validación del "Acerca de":
                      </span>
                      {DEFAULT_CHECKLIST.filter(item => item.category === 'about').map(item => {
                        const isChecked = checklist[item.id] || false;
                        return (
                          <div
                            key={item.id}
                            onClick={() => toggleCheck(item.id)}
                            className={`p-2.5 rounded-lg border flex items-start gap-2.5 cursor-pointer text-xs transition-colors ${
                              isChecked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-slate-200'
                            }`}
                          >
                            <button type="button" className="mt-0.5 shrink-0 text-emerald-600">
                              {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-400" />}
                            </button>
                            <div>
                              <p className={`font-semibold ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-800'}`}>
                                {item.label}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{item.tip}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* TAB 3: EXPERIENCE OPTIMIZATION */}
          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                  Adaptación de Experiencia para Lectura en LinkedIn
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  En LinkedIn la experiencia debe ser más visual, legible y fácil de escanear en pantallas de smartphones que en un PDF estático.
                </p>
              </div>

              {/* Actionable Tips Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-900" />
                    Regla de las Primeras 2 Líneas
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    LinkedIn colapsa las descripciones de los puestos en smartphones. Coloca siempre tu viñeta de mayor impacto cuantitativo (ej. <em>"Reduje costos en 40%..."</em>) en la primera posición.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4 text-emerald-700" />
                    Etiquetado de Aptitudes (Skills Tag)
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Al editar cada puesto en LinkedIn, utiliza el campo <strong>"Aptitudes vinculadas"</strong> para seleccionar hasta 5 competencias (ej. React, AWS, Agile). Esto triplica la relevancia del puesto en búsquedas.
                  </p>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200">
                  <h4 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-purple-700" />
                    Contenido Multimedia & Enlaces
                  </h4>
                  <p className="text-xs text-slate-700 leading-relaxed">
                    Añade capturas, enlaces a GitHub o dashboards en la sección "Contenido multimedia" de cada puesto para dar credibilidad visual instantánea.
                  </p>
                </div>
              </div>

              {/* Tips from AI engine */}
              {aiData?.experienceTips && aiData.experienceTips.length > 0 && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-1">
                    Recomendaciones Específicas para tu Experiencia:
                  </span>
                  <div className="space-y-2">
                    {aiData.experienceTips.map((tip, i) => (
                      <div key={i} className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-slate-200 flex items-start gap-2">
                        <span className="font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded text-[10px]">
                          {i + 1}
                        </span>
                        <span className="flex-1 leading-relaxed">{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience Checklist */}
              <div className="pt-2 border-t border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  Checklist de Experiencia:
                </span>
                <div className="space-y-2">
                  {DEFAULT_CHECKLIST.filter(item => item.category === 'experience').map(item => {
                    const isChecked = checklist[item.id] || false;
                    return (
                      <div
                        key={item.id}
                        onClick={() => toggleCheck(item.id)}
                        className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                          isChecked ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <button type="button" className="mt-0.5 shrink-0 text-emerald-600">
                          {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-400" />}
                        </button>
                        <div className="flex-1">
                          <p className={`text-xs font-bold ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                            {item.label}
                          </p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{item.tip}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEO & RECRUITER KEYWORDS */}
          {activeTab === 'search' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-900 text-white text-xs flex items-center justify-center font-bold">4</span>
                  Auditoría de SEO & Búsquedas en LinkedIn Recruiter
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Los reclutadores no leen perfiles uno a uno: utilizan filtros y búsquedas booleanas. Estas son las palabras clave prioritarias que deben estar en tu perfil para aparecer en sus primeros resultados:
                </p>
              </div>

              {/* Essential keywords table */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-3">
                  Términos de Búsqueda Críticos para "{currentTarget.title}":
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {aiData?.recruiterSearchKeywords?.map((kw, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs"
                    >
                      <span className="text-xs font-bold text-slate-900">{kw.keyword}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        kw.importance === 'crítico'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {kw.importance}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Profile Optimization Checklist */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
                  Checklist Final de Visibilidad:
                </span>
                {DEFAULT_CHECKLIST.filter(item => item.category === 'search').map(item => {
                  const isChecked = checklist[item.id] || false;
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggleCheck(item.id)}
                      className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors ${
                        isChecked ? 'bg-emerald-50/40 border-emerald-200' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <button type="button" className="mt-0.5 shrink-0 text-emerald-600">
                        {isChecked ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4 text-slate-400" />}
                      </button>
                      <div className="flex-1">
                        <p className={`text-xs font-bold ${isChecked ? 'text-emerald-950 line-through opacity-80' : 'text-slate-900'}`}>
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.tip}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CVData, JobTarget, MissingKeyword, DeepAIAuditResult } from './types/ats';
import { SAMPLE_PROFILES } from './data/sampleProfiles';
import { calculateATSScore } from './services/atsScoringEngine';
import { Header } from './components/Header';
import { WelcomeBanner } from './components/WelcomeBanner';
import { JobTargetModal } from './components/JobTargetModal';
import { DeepAuditModal } from './components/DeepAuditModal';
import { ResumePreview } from './components/ResumePreview';
import { TextAuditModal } from './components/TextAuditModal';
import { ContactInfoForm } from './components/Editor/ContactInfoForm';
import { SummaryEditor } from './components/Editor/SummaryEditor';
import { ExperienceEditor } from './components/Editor/ExperienceEditor';
import { SkillsEditor } from './components/Editor/SkillsEditor';
import { EducationEditor } from './components/Editor/EducationEditor';
import { runDeepAIAudit, auditTextSpellingWithAI } from './services/aiService';
import { TextAuditResult, TextAuditIssue } from './types/ats';
import {
  User,
  AlignLeft,
  Briefcase,
  Cpu,
  GraduationCap,
  Eye,
  FileEdit,
  Printer,
  Sparkles,
  SpellCheck,
  Mail
} from 'lucide-react';
import { exportToPDF } from './services/exportService';

const STORAGE_KEY_CV = 'atspass_cv_v1';
const STORAGE_KEY_TARGET = 'atspass_target_v1';
const THEME_STORAGE_KEY = 'atspass_theme';

export default function App() {
  const defaultSample = SAMPLE_PROFILES[0];

  // Theme Mode (Claro / Oscuro)
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(THEME_STORAGE_KEY, 'light');
      }
    } catch (e) {
      console.warn('Failed to save theme preference:', e);
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CV) || localStorage.getItem('laborpath_cv_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return defaultSample.cvData;
  });

  const [currentTarget, setCurrentTarget] = useState<JobTarget>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TARGET) || localStorage.getItem('laborpath_target_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return defaultSample.jobTarget;
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [activeStep, setActiveStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'editor' | 'preview'>('editor');

  // Modals state
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isDeepAuditOpen, setIsDeepAuditOpen] = useState(false);
  const [deepAuditLoading, setDeepAuditLoading] = useState(false);
  const [deepAuditResult, setDeepAuditResult] = useState<DeepAIAuditResult | null>(null);

  // Text Audit (Spelling, Grammar & ATS Structure) state
  const [isTextAuditOpen, setIsTextAuditOpen] = useState(false);
  const [textAuditLoading, setTextAuditLoading] = useState(false);
  const [textAuditResult, setTextAuditResult] = useState<TextAuditResult | null>(null);

  // Auto-save effect
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY_CV, JSON.stringify(cvData));
        localStorage.setItem(STORAGE_KEY_TARGET, JSON.stringify(currentTarget));
        setLastSaved(new Date());
      } catch (err) {
        console.warn('Failed to save to localStorage:', err);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [cvData, currentTarget]);

  // Real-time ATS Calculation
  const atsAnalysis = useMemo(() => {
    return calculateATSScore(cvData, currentTarget);
  }, [cvData, currentTarget]);

  // Add missing keyword directly to Skills
  const handleAddMissingKeyword = (kw: MissingKeyword) => {
    const targetCat = kw.category === 'tools' ? 'tools' : kw.category === 'methodology' ? 'methodologies' : 'technical';
    const list = cvData.skills[targetCat] || [];
    if (!list.some((s) => s.toLowerCase() === kw.word.toLowerCase())) {
      setCvData({
        ...cvData,
        skills: {
          ...cvData.skills,
          [targetCat]: [...list, kw.word],
        },
      });
    }
  };

  // Handle Import JSON
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.contactInfo && parsed.experience) {
          setCvData(parsed);
          alert('¡Currículum importado exitosamente en ATSPASS!');
        } else {
          alert('El archivo JSON no tiene la estructura requerida de ATSPASS.');
        }
      } catch (err) {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Trigger Deep AI Audit
  const handleRunDeepAudit = async () => {
    setIsDeepAuditOpen(true);
    setDeepAuditLoading(true);
    try {
      const result = await runDeepAIAudit(cvData, currentTarget);
      setDeepAuditResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setDeepAuditLoading(false);
    }
  };

  // Trigger Text & Spelling Audit (Used by the bottom purple button)
  const handleRunTextAudit = async () => {
    setIsTextAuditOpen(true);
    setTextAuditLoading(true);
    try {
      const result = await auditTextSpellingWithAI(cvData);
      setTextAuditResult(result);
    } catch (e) {
      console.error(e);
    } finally {
      setTextAuditLoading(false);
    }
  };

  // Apply single text correction with 1 click
  const handleApplySingleCorrection = (issue: TextAuditIssue) => {
    setCvData((prev) => {
      const updated = { ...prev };
      if (issue.targetSection === 'summary') {
        updated.summary = issue.suggestedText;
      } else if (issue.targetSection === 'title') {
        updated.contactInfo = {
          ...updated.contactInfo,
          professionalTitle: issue.suggestedText,
        };
      } else if (
        issue.targetSection === 'experience' &&
        typeof issue.expIndex === 'number' &&
        typeof issue.bulletIndex === 'number'
      ) {
        const newExp = [...updated.experience];
        if (newExp[issue.expIndex] && newExp[issue.expIndex].bullets) {
          const newBullets = [...newExp[issue.expIndex].bullets];
          newBullets[issue.bulletIndex] = issue.suggestedText;
          newExp[issue.expIndex] = {
            ...newExp[issue.expIndex],
            bullets: newBullets,
          };
          updated.experience = newExp;
        }
      }
      return updated;
    });
  };

  // Apply all corrections
  const handleApplyAllCorrections = (issues: TextAuditIssue[]) => {
    issues.forEach((issue) => handleApplySingleCorrection(issue));
  };

  const steps = [
    { id: 'contact', title: '1. Contacto', icon: User },
    { id: 'summary', title: '2. Resumen', icon: AlignLeft },
    { id: 'experience', title: '3. Experiencia', icon: Briefcase },
    { id: 'skills', title: '4. Habilidades', icon: Cpu },
    { id: 'education', title: '5. Educación', icon: GraduationCap },
  ];

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      isDarkMode
        ? 'dark bg-slate-950 text-slate-100 selection:bg-blue-900 selection:text-blue-100'
        : 'bg-slate-50 text-slate-900 selection:bg-blue-100 selection:text-blue-900'
    }`}>
      {/* Top Corporate Executive Header with Theme Toggle & Sugerencias button */}
      <Header
        cvData={cvData}
        currentTarget={currentTarget}
        isDarkMode={isDarkMode}
        onToggleTheme={toggleTheme}
        onImportJSON={handleImportJSON}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6">
        {/* Welcome & Motivational Onboarding Banner */}
        <WelcomeBanner
          currentTarget={currentTarget}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          overallScore={atsAnalysis.overallScore}
        />

        {/* View Mode Switcher & Actions Bar (Clean, uncluttered & responsive) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 no-print">
          {/* Editor vs Document Preview Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/90 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('editor')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <FileEdit className="w-4 h-4 text-blue-900 dark:text-blue-400 shrink-0" />
              <span>Editor de CV</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Vista Previa ATS</span>
            </button>
          </div>

          {/* Action buttons: EL BOTON MORADO DE ABAJO SE MANTIENE ("Auditar con IA") y Descargar CV */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Botón Morado / Índigo Inferior ("Auditar con IA"): MANTENIDO SEGÚN INSTRUCCIÓN */}
            <button
              type="button"
              onClick={handleRunTextAudit}
              className="flex-1 sm:flex-initial px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              title="Escanear y auditar ortografía, coherencia, acentos y estándares ATS con IA"
            >
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span>Auditar con IA</span>
              <span className="text-[10px] uppercase font-bold bg-indigo-500/80 px-1.5 py-0.5 rounded-full">
                Smart
              </span>
            </button>

            {/* Descargar CV */}
            <button
              type="button"
              onClick={exportToPDF}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" />
              <span className="hidden sm:inline">Descargar CV</span>
              <span className="sm:hidden">Descargar</span>
            </button>
          </div>
        </div>

        {/* Workspace Container (Centered, spacious & 100% responsive) */}
        <div className="w-full space-y-6">
          {viewMode === 'editor' ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-4 sm:p-7 space-y-6 transition-colors">
              {/* Stepper Tabs */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-3.5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex overflow-x-auto gap-1.5 no-scrollbar w-full pb-1 sm:pb-0">
                  {steps.map((st, idx) => {
                    const Icon = st.icon;
                    const isActive = activeStep === idx;
                    return (
                      <button
                        key={st.id}
                        onClick={() => setActiveStep(idx)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                          isActive
                            ? 'bg-blue-900 dark:bg-blue-600 text-white shadow-xs'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" />
                        <span>{st.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step Form Rendering */}
              {activeStep === 0 && (
                <ContactInfoForm
                  contact={cvData.contactInfo}
                  onChange={(updated) => setCvData({ ...cvData, contactInfo: updated })}
                />
              )}

              {activeStep === 1 && (
                <SummaryEditor
                  summary={cvData.summary}
                  targetJob={currentTarget.title}
                  topSkills={[
                    ...(cvData.skills.technical || []),
                    ...(cvData.skills.tools || []),
                  ]}
                  onChange={(val) => setCvData({ ...cvData, summary: val })}
                />
              )}

              {activeStep === 2 && (
                <ExperienceEditor
                  experience={cvData.experience}
                  targetJob={currentTarget.title}
                  missingKeywords={atsAnalysis.missingKeywords.map((m) => m.word)}
                  onChange={(updated) => setCvData({ ...cvData, experience: updated })}
                />
              )}

              {activeStep === 3 && (
                <SkillsEditor
                  skills={cvData.skills}
                  missingKeywords={atsAnalysis.missingKeywords}
                  targetJobTitle={currentTarget.title}
                  onChange={(updated) => setCvData({ ...cvData, skills: updated })}
                />
              )}

              {activeStep === 4 && (
                <EducationEditor
                  education={cvData.education}
                  certifications={cvData.certifications}
                  onEducationChange={(updated) => setCvData({ ...cvData, education: updated })}
                  onCertificationsChange={(updated) =>
                    setCvData({ ...cvData, certifications: updated })
                  }
                />
              )}

              {/* Step Navigation Controls */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
                <button
                  disabled={activeStep === 0}
                  onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 sm:px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-40 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  ← Anterior
                </button>

                <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Paso {activeStep + 1} de {steps.length}
                </div>

                {activeStep < steps.length - 1 ? (
                  <button
                    onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    onClick={() => setViewMode('preview')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Ver CV Final</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <ResumePreview
              cvData={cvData}
              matchedKeywords={atsAnalysis.matchedKeywords}
              detectedMetrics={atsAnalysis.detectedMetrics}
            />
          )}
        </div>
      </main>

      {/* Footer with ATSPASS, Versión 1.2, and Sugerencias button */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 px-4 text-center no-print mt-auto transition-colors">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium tracking-wide">
          AJRC Servicios | Derechos reservados | Versión 1.2 | Código abierto
        </p>
        <div className="mt-1.5 flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <Mail className="w-3.5 h-3.5 text-blue-500" />
          <span>Sugerencias:</span>
          <a
            href="mailto:AJRC.SERVICIOS@GMAIL.COM?subject=Sugerencia%20para%20ATSPASS"
            className="text-blue-600 dark:text-blue-400 hover:underline font-mono text-[11px] font-semibold"
          >
            AJRC.SERVICIOS@GMAIL.COM
          </a>
        </div>
      </footer>

      {/* Target Job Configuration Modal */}
      <JobTargetModal
        isOpen={isTargetModalOpen}
        onClose={() => setIsTargetModalOpen(false)}
        currentTarget={currentTarget}
        onSaveTarget={(target) => setCurrentTarget(target)}
      />

      {/* Deep AI Recruiter Audit Modal */}
      <DeepAuditModal
        isOpen={isDeepAuditOpen}
        onClose={() => setIsDeepAuditOpen(false)}
        auditResult={deepAuditResult}
        loading={deepAuditLoading}
      />

      {/* Text & Spelling Audit Modal */}
      <TextAuditModal
        isOpen={isTextAuditOpen}
        onClose={() => setIsTextAuditOpen(false)}
        auditResult={textAuditResult}
        loading={textAuditLoading}
        cvData={cvData}
        onReScan={handleRunTextAudit}
        onApplySingleCorrection={handleApplySingleCorrection}
        onApplyAllCorrections={handleApplyAllCorrections}
      />
    </div>
  );
}

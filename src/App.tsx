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
import { ATSScorePanel } from './components/ATSScorePanel';
import { ResumePreview } from './components/ResumePreview';
import { LinkedInOptimizer } from './components/LinkedInOptimizer';
import { TutorialCV } from './components/TutorialCV';
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
  RotateCcw,
  ShieldCheck,
  Check,
  SpellCheck
} from 'lucide-react';
import { exportToPDF } from './services/exportService';

const STORAGE_KEY_CV = 'laborpath_cv_v1';
const STORAGE_KEY_TARGET = 'laborpath_target_v1';

export default function App() {
  // Load initial data from localStorage or default to Sample Profile 1 (Tech Lead / Full Stack)
  const defaultSample = SAMPLE_PROFILES[0];

  const [cvData, setCvData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CV);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return defaultSample.cvData;
  });

  const [currentTarget, setCurrentTarget] = useState<JobTarget>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TARGET);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
    return defaultSample.jobTarget;
  });

  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [activeStep, setActiveStep] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'editor' | 'preview' | 'linkedin' | 'tutorial'>('editor');

  // Modals state
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isDeepAuditOpen, setIsDeepAuditOpen] = useState(false);
  const [deepAuditLoading, setDeepAuditLoading] = useState(false);
  const [deepAuditResult, setDeepAuditResult] = useState<DeepAIAuditResult | null>(null);

  // Text Audit (Spelling & Style) state
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

  // Handle switching preset profile
  const handleSelectSample = (sampleId: string) => {
    const sample = SAMPLE_PROFILES.find((s) => s.id === sampleId);
    if (sample) {
      setCvData(sample.cvData);
      setCurrentTarget(sample.jobTarget);
      setActiveStep(0);
    }
  };

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
          alert('¡Currículum importado exitosamente!');
        } else {
          alert('El archivo JSON no tiene la estructura requerida de Labor Path.');
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

  // Trigger Text & Spelling Audit
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
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Corporate Executive Header */}
      <Header
        cvData={cvData}
        currentTarget={currentTarget}
        overallScore={atsAnalysis.overallScore}
        lastSaved={lastSaved}
        onSelectSample={handleSelectSample}
        onOpenTargetModal={() => setIsTargetModalOpen(true)}
        onImportJSON={handleImportJSON}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome & Motivational Onboarding Banner */}
        <WelcomeBanner
          currentTarget={currentTarget}
          onOpenTargetModal={() => setIsTargetModalOpen(true)}
          overallScore={atsAnalysis.overallScore}
        />

        {/* View Mode Switcher & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 no-print">
          {/* Editor vs Document Preview vs LinkedIn Optimizer Toggle */}
          <div className="inline-flex p-1 rounded-xl bg-slate-200/80 border border-slate-300">
            <button
              onClick={() => setViewMode('editor')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === 'editor'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <FileEdit className="w-4 h-4 text-blue-900" />
              <span>Editor Guiado por Pasos</span>
            </button>
            <button
              onClick={() => setViewMode('preview')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === 'preview'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Eye className="w-4 h-4 text-emerald-600" />
              <span>Vista Previa del Documento ATS</span>
            </button>
            <button
              onClick={() => setViewMode('linkedin')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === 'linkedin'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Optimizar LinkedIn</span>
              <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                viewMode === 'linkedin' ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-900'
              }`}>
                Pro
              </span>
            </button>
            <button
              onClick={() => setViewMode('tutorial')}
              className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                viewMode === 'tutorial'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span>Tutorial CV</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSelectSample(SAMPLE_PROFILES[0].id)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Restablecer al perfil predeterminado"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Restablecer Ejemplo</span>
            </button>

            <button
              onClick={exportToPDF}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Descargar CV Optimizado</span>
            </button>
          </div>
        </div>

        {/* 2-Column Conceptual Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Editor or Preview (approx 65% width) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            {viewMode === 'editor' ? (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
                {/* Stepper Tabs & Revisión de Errores Action */}
                <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex overflow-x-auto gap-1.5 no-scrollbar">
                    {steps.map((st, idx) => {
                      const Icon = st.icon;
                      const isActive = activeStep === idx;
                      return (
                        <button
                          key={st.id}
                          onClick={() => setActiveStep(idx)}
                          className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                            isActive
                              ? 'bg-blue-900 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{st.title}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Revisión de Errores (Auditor de Texto) */}
                  <button
                    type="button"
                    onClick={handleRunTextAudit}
                    className="px-3.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-950 border border-indigo-200 text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer shrink-0"
                    title="Escanear ortografía, acentos, gramática y estilo de redacción con IA"
                  >
                    <SpellCheck className="w-4 h-4 text-indigo-600" />
                    <span>Revisión de Errores</span>
                    <span className="text-[10px] bg-indigo-200 text-indigo-900 font-bold px-1.5 py-0.2 rounded-full">
                      IA
                    </span>
                  </button>
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
                <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                  <button
                    disabled={activeStep === 0}
                    onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 disabled:opacity-40 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    ← Paso Anterior
                  </button>

                  <div className="text-[11px] text-slate-400">
                    Paso {activeStep + 1} de {steps.length}
                  </div>

                  {activeStep < steps.length - 1 ? (
                    <button
                      onClick={() => setActiveStep((prev) => Math.min(steps.length - 1, prev + 1))}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                    >
                      Siguiente Paso →
                    </button>
                  ) : (
                    <button
                      onClick={() => setViewMode('preview')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Ver Documento Final
                    </button>
                  )}
                </div>
              </div>
            ) : viewMode === 'preview' ? (
              <ResumePreview
                cvData={cvData}
                matchedKeywords={atsAnalysis.matchedKeywords}
                detectedMetrics={atsAnalysis.detectedMetrics}
              />
            ) : viewMode === 'linkedin' ? (
              <LinkedInOptimizer
                cvData={cvData}
                currentTarget={currentTarget}
              />
            ) : (
              <TutorialCV onGoToEditor={() => setViewMode('editor')} />
            )}
          </div>

          {/* Right Column: ATS Control Center & Real-Time Diagnostics (approx 35% width) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <ATSScorePanel
              analysis={atsAnalysis}
              onAddMissingKeyword={handleAddMissingKeyword}
              onRunDeepAudit={handleRunDeepAudit}
              targetJobTitle={currentTarget.title}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-4 px-4 text-center no-print mt-auto">
        <p className="text-xs text-slate-500 font-medium tracking-wide">
          Hecho por Angel Raaz AJRC Servicios | Derechos reservados | Código abierto
        </p>
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
        onReScan={handleRunTextAudit}
        onApplySingleCorrection={handleApplySingleCorrection}
        onApplyAllCorrections={handleApplyAllCorrections}
      />
    </div>
  );
}

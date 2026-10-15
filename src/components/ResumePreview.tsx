import React, { useState } from 'react';
import { CVData, KeywordMatch, DetectedMetric } from '../types/ats';
import { Eye, Printer, Sparkles, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';
import { exportToPDF, exportPlainText } from '../services/exportService';

interface ResumePreviewProps {
  cvData: CVData;
  matchedKeywords: KeywordMatch[];
  detectedMetrics: DetectedMetric[];
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({
  cvData,
  matchedKeywords,
  detectedMetrics,
}) => {
  const [inspectMode, setInspectMode] = useState(false);

  // Helper to highlight keywords and metrics if in inspect mode
  const renderTextWithHighlights = (text: string) => {
    if (!inspectMode || !text) return text;

    // Build regex for matched keywords and metrics
    const keywordWords = matchedKeywords.map(k => k.word).filter(Boolean);
    const metricTexts = detectedMetrics.map(m => m.text).filter(Boolean);

    // If empty, return raw text
    if (keywordWords.length === 0 && metricTexts.length === 0) return text;

    // Highlight metrics first (blue) then keywords (green)
    const combinedTokens = [
      ...metricTexts.map(t => ({ token: t, type: 'metric' })),
      ...keywordWords.map(t => ({ token: t, type: 'keyword' }))
    ].sort((a, b) => b.token.length - a.token.length);

    // Escape regex characters
    const pattern = new RegExp(
      `\\b(${combinedTokens.map(c => c.token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`,
      'gi'
    );

    const parts = text.split(pattern);

    return parts.map((part, index) => {
      if (!part) return null;
      const lower = part.toLowerCase();

      const isMetric = metricTexts.some(m => m.toLowerCase() === lower);
      if (isMetric) {
        return (
          <mark
            key={index}
            className="bg-blue-100 text-blue-950 px-1 py-0.2 rounded font-semibold border-b border-blue-300"
            title="Métrica cuantificable detectada"
          >
            {part}
          </mark>
        );
      }

      const isKeyword = keywordWords.some(k => k.toLowerCase() === lower);
      if (isKeyword) {
        return (
          <mark
            key={index}
            className="bg-emerald-100 text-emerald-950 px-1 py-0.2 rounded font-semibold border-b border-emerald-300"
            title="Palabra clave coincidente de la vacante"
          >
            {part}
          </mark>
        );
      }

      return part;
    });
  };

  return (
    <div className="space-y-4">
      {/* Top Preview Controls Bar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-xs no-print">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Vista Previa del Documento (A4 Monocolumna ATS)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Inspect Mode */}
          <button
            type="button"
            onClick={() => setInspectMode(!inspectMode)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              inspectMode
                ? 'bg-emerald-500 text-slate-950 shadow-xs'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{inspectMode ? 'Modo Inspección Activo' : 'Inspeccionar Palabras Clave'}</span>
          </button>

          <button
            type="button"
            onClick={exportToPDF}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir / Guardar PDF</span>
          </button>
        </div>
      </div>

      {inspectMode && (
        <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center gap-4 no-print animate-fade-in">
          <span className="font-semibold flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Leyenda del Analizador ATS:
          </span>
          <span className="inline-flex items-center gap-1 bg-emerald-200/80 px-2 py-0.5 rounded text-emerald-950 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600" /> Palabra clave de la vacante
          </span>
          <span className="inline-flex items-center gap-1 bg-blue-200/80 px-2 py-0.5 rounded text-blue-950 font-medium">
            <span className="w-2 h-2 rounded-full bg-blue-600" /> Métrica cuantificable (%, $, núm)
          </span>
        </div>
      )}

      {/* Actual Printable ATS Resume Container */}
      <div className="resume-printable-document bg-white border border-slate-300 rounded-xl shadow-lg p-8 sm:p-12 max-w-4xl mx-auto font-sans text-slate-900 leading-normal selection:bg-blue-100">
        {/* Header / Contact Info */}
        <div className="border-b-2 border-slate-900 pb-4 mb-5 text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 uppercase">
            {cvData.contactInfo.fullName || 'TU NOMBRE COMPLETO'}
          </h1>
          <p className="text-base font-bold text-slate-700 mt-1 uppercase tracking-wide">
            {cvData.contactInfo.professionalTitle || 'TÍTULO PROFESIONAL EJECUTIVO'}
          </p>

          <div className="mt-2 text-xs text-slate-600 flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1">
            {cvData.contactInfo.email && (
              <span>{cvData.contactInfo.email}</span>
            )}
            {cvData.contactInfo.phone && (
              <>
                <span className="text-slate-400 select-none">•</span>
                <span>{cvData.contactInfo.phone}</span>
              </>
            )}
            {cvData.contactInfo.location && (
              <>
                <span className="text-slate-400 select-none">•</span>
                <span>{cvData.contactInfo.location}</span>
              </>
            )}
            {cvData.contactInfo.linkedin && (
              <>
                <span className="text-slate-400 select-none">•</span>
                <span>{cvData.contactInfo.linkedin}</span>
              </>
            )}
            {cvData.contactInfo.portfolioOrGithub && (
              <>
                <span className="text-slate-400 select-none">•</span>
                <span>{cvData.contactInfo.portfolioOrGithub}</span>
              </>
            )}
          </div>
        </div>

        {/* Section 1: Professional Summary */}
        {cvData.summary && (
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              RESUMEN PROFESIONAL
            </h2>
            <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed text-justify">
              {renderTextWithHighlights(cvData.summary)}
            </p>
          </div>
        )}

        {/* Section 2: Work Experience */}
        {cvData.experience && cvData.experience.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3">
              EXPERIENCIA LABORAL
            </h2>
            <div className="space-y-4">
              {cvData.experience.map((exp, idx) => (
                <div key={exp.id || idx} className="experience-block">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1">
                    <div>
                      <span className="text-xs sm:text-[13px] font-bold text-slate-950">
                        {exp.jobTitle || 'Puesto'}
                      </span>
                      {exp.company && (
                        <span className="text-xs sm:text-[13px] text-slate-700 font-semibold">
                          {' '}— {exp.company}
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] font-medium text-slate-600">
                      <span>{exp.startDate || 'Inicio'} – {exp.current ? 'Presente' : (exp.endDate || 'Fin')}</span>
                      {exp.location && <span> | {exp.location}</span>}
                    </div>
                  </div>

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-1 text-xs sm:text-[12.5px] text-slate-800 leading-relaxed mt-1">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx}>
                          {renderTextWithHighlights(bullet)}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Core Skills */}
        {((cvData.skills.technical?.length || 0) + (cvData.skills.tools?.length || 0) + (cvData.skills.methodologies?.length || 0) > 0) && (
          <div className="mb-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              HABILIDADES Y COMPETENCIAS TÉCNICAS
            </h2>
            <div className="space-y-1 text-xs sm:text-[12.5px] text-slate-800">
              {cvData.skills.technical?.length > 0 && (
                <div>
                  <strong className="font-bold text-slate-950">Competencias Clave:</strong>{' '}
                  {cvData.skills.technical.map((skill, sIdx) => (
                    <span key={sIdx}>
                      {renderTextWithHighlights(skill)}
                      {sIdx < cvData.skills.technical.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {cvData.skills.tools?.length > 0 && (
                <div>
                  <strong className="font-bold text-slate-950">Herramientas & Software:</strong>{' '}
                  {cvData.skills.tools.map((tool, tIdx) => (
                    <span key={tIdx}>
                      {renderTextWithHighlights(tool)}
                      {tIdx < cvData.skills.tools.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {cvData.skills.methodologies?.length > 0 && (
                <div>
                  <strong className="font-bold text-slate-950">Metodologías:</strong>{' '}
                  {cvData.skills.methodologies.map((m, mIdx) => (
                    <span key={mIdx}>
                      {renderTextWithHighlights(m)}
                      {mIdx < cvData.skills.methodologies.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              )}
              {cvData.skills.languages?.length > 0 && (
                <div>
                  <strong className="font-bold text-slate-950">Idiomas:</strong>{' '}
                  {cvData.skills.languages.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Section 4: Education */}
        {cvData.education && cvData.education.length > 0 && (
          <div className="mb-6 education-block">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              EDUCACIÓN
            </h2>
            <div className="space-y-2">
              {cvData.education.map((edu, idx) => (
                <div key={edu.id || idx} className="flex flex-col sm:flex-row sm:items-baseline justify-between text-xs sm:text-[12.5px]">
                  <div>
                    <span className="font-bold text-slate-950">{edu.degree}</span>
                    {edu.institution && (
                      <span className="text-slate-700"> — {edu.institution}</span>
                    )}
                    {edu.details && (
                      <p className="text-[11px] text-slate-600 mt-0.5 italic">{edu.details}</p>
                    )}
                  </div>
                  <div className="text-[11px] font-medium text-slate-600 shrink-0">
                    {edu.graduationYear} {edu.location ? `| ${edu.location}` : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Certifications */}
        {cvData.certifications && cvData.certifications.length > 0 && (
          <div className="education-block">
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
              CERTIFICACIONES Y LICENCIAS
            </h2>
            <div className="space-y-1 text-xs sm:text-[12.5px] text-slate-800">
              {cvData.certifications.map((cert, idx) => (
                <div key={cert.id || idx} className="flex items-baseline justify-between">
                  <div>
                    <span className="font-bold text-slate-950">{cert.name}</span>
                    {cert.issuer && <span className="text-slate-700"> — {cert.issuer}</span>}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

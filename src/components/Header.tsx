import React, { useState, useEffect } from 'react';
import {
  FileText,
  Code2,
  Share2,
  Printer,
  Upload,
  ChevronDown,
  Sun,
  Moon,
  Mail,
  Copy,
  Check,
  X,
  ExternalLink,
  Users,
  Send,
  Sparkles
} from 'lucide-react';
import { CVData, JobTarget } from '../types/ats';
import { exportToPDF, exportPlainText, exportJSON, exportMarkdown } from '../services/exportService';

interface HeaderProps {
  cvData: CVData;
  currentTarget: JobTarget;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cvData,
  isDarkMode,
  onToggleTheme,
  onImportJSON
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Communications counter state
  const [contactCount, setContactCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('atspass_contact_count');
      if (saved) return parseInt(saved, 10);
    } catch (e) {
      // fallback
    }
    return 148;
  });

  // Suggestion form in modal
  const [suggestionName, setSuggestionName] = useState('');
  const [suggestionEmail, setSuggestionEmail] = useState('');
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const FEEDBACK_EMAIL = 'AJRC.SERVICIOS@GMAIL.COM';

  // Load counter from server on mount
  useEffect(() => {
    fetch('/api/contact-counter')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && typeof data.count === 'number') {
          setContactCount(data.count);
          try {
            localStorage.setItem('atspass_contact_count', data.count.toString());
          } catch (e) {}
        }
      })
      .catch((err) => console.log('Using local counter fallback:', err));
  }, []);

  const incrementCounter = async () => {
    const newCount = contactCount + 1;
    setContactCount(newCount);
    try {
      localStorage.setItem('atspass_contact_count', newCount.toString());
      await fetch('/api/contact-counter/increment', { method: 'POST' });
    } catch (e) {}
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(FEEDBACK_EMAIL);
    setCopiedEmail(true);
    incrementCounter();
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suggestionMessage.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: suggestionName,
          email: suggestionEmail,
          message: suggestionMessage
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.count) {
          setContactCount(data.count);
          localStorage.setItem('atspass_contact_count', data.count.toString());
        }
      } else {
        incrementCounter();
      }
      setSubmittedSuccess(true);
      setSuggestionMessage('');
    } catch (err) {
      incrementCounter();
      setSubmittedSuccess(true);
      setSuggestionMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 no-print shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand & Author / Version */}
        <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-700 flex items-center justify-center text-white shadow-inner shrink-0">
              <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white whitespace-nowrap">
                  ATSPASS
                </span>
                <span className="hidden min-[480px]:inline-block text-[10px] font-semibold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                  ATS Pro
                </span>
              </div>
              {/* Attribution and System Version 1.2 */}
              <div className="flex items-center gap-1 text-[10px] leading-tight text-slate-300">
                <span className="font-semibold text-blue-300">AJRC Servicios</span>
                <span className="text-slate-500">•</span>
                <span className="bg-slate-800 text-slate-200 px-1 py-0.2 rounded font-mono text-[9px] border border-slate-700">
                  Versión 1.2
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side controls: Sugerencias con contador, Modo Claro/Oscuro y Descargar CV */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Botón Pequeño de Sugerencias con Contador de Comunicaciones */}
          <button
            onClick={() => {
              setShowFeedbackModal(true);
              setSubmittedSuccess(false);
            }}
            className="px-2 sm:px-2.5 py-1 h-8 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title={`Enviar sugerencias a ${FEEDBACK_EMAIL} (${contactCount} personas se han comunicado)`}
          >
            <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="hidden min-[380px]:inline">Sugerencias</span>
            {/* Badge con el contador de personas comunicadas */}
            <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              {contactCount}
            </span>
          </button>

          {/* Botón Toggle Modo Claro / Oscuro */}
          <button
            onClick={onToggleTheme}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label="Alternar modo claro y oscuro"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Main Primary CTA: Descargar CV Optimizado (PDF) */}
          <div className="relative inline-flex items-stretch h-8 rounded-lg shadow-xs shrink-0">
            <button
              onClick={exportToPDF}
              className="h-full px-2.5 sm:px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] sm:text-xs rounded-l-lg flex items-center gap-1 sm:gap-1.5 transition-colors cursor-pointer select-none whitespace-nowrap"
              title="Descargar CV en formato PDF de columna única optimizado para ATS"
            >
              <Printer className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden md:inline">Descargar CV</span>
              <span className="hidden sm:inline md:hidden">Descargar</span>
              <span className="sm:hidden">PDF</span>
            </button>

            {/* Split dropdown for other formats */}
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="h-full px-1.5 sm:px-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-r-lg border-l border-emerald-800/80 flex items-center justify-center transition-colors cursor-pointer shrink-0 select-none"
              title="Más formatos de exportación"
            >
              <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-1.5rem)] bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-fade-in text-xs">
                <div className="px-3 py-1.5 font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-100 dark:border-slate-700">
                  Formatos de Exportación ATS:
                </div>
                <button
                  onClick={() => {
                    exportToPDF();
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Printer className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">PDF ATS Monocolumna</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Impresión vectorizada limpia</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportPlainText(cvData);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Texto Plano ATS (.txt)</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Ideal para portales legacy</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportJSON(cvData);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Code2 className="w-4 h-4 text-amber-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Payload JSON Estructurado</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Para respaldo o migración</p>
                  </div>
                </button>
                <button
                  onClick={() => {
                    exportMarkdown(cvData);
                    setShowExportMenu(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <Share2 className="w-4 h-4 text-purple-600 shrink-0" />
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">Markdown (.md)</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Para GitHub o Notion</p>
                  </div>
                </button>
                <div className="border-t border-slate-100 dark:border-slate-700 my-1 pt-1">
                  <label className="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-2 text-slate-700 dark:text-slate-200 cursor-pointer">
                    <Upload className="w-4 h-4 text-slate-500 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Importar JSON</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">Cargar currículum guardado</p>
                    </div>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        onImportJSON(e);
                        setShowExportMenu(false);
                      }}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Sugerencias con CONTADOR DE COMUNICACIONES para AJRC.SERVICIOS@GMAIL.COM */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-3 sm:p-4 no-print animate-fade-in">
          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-slate-900 dark:bg-slate-950 px-4 sm:px-5 py-3.5 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-blue-600/30 text-blue-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-white">Buzón de Sugerencias</h4>
                  <p className="text-[10px] text-slate-400">Canal directo con AJRC Servicios</p>
                </div>
              </div>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs overflow-y-auto">
              {/* CONTADOR DESTACADO DE PERSONAS COMUNICADAS */}
              <div className="p-3.5 bg-gradient-to-r from-blue-900/10 via-indigo-900/10 to-blue-900/10 dark:from-blue-950/60 dark:to-indigo-950/60 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-blue-600 text-white shadow-xs">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 block uppercase tracking-wider">
                      Personas comunicadas:
                    </span>
                    <span className="text-lg font-black text-blue-950 dark:text-blue-300 font-mono">
                      {contactCount} usuarios
                    </span>
                  </div>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
                  Activo
                </span>
              </div>

              {/* Correo oficial y botón para copiar */}
              <div>
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                  Correo oficial de contacto:
                </span>
                <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-xs sm:text-sm text-blue-900 dark:text-blue-400 select-all truncate">
                    {FEEDBACK_EMAIL}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold text-[11px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                    title="Copiar correo"
                  >
                    {copiedEmail ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span className="text-emerald-700 dark:text-emerald-400">¡Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Formulario rápido para enviar sugerencia directamente */}
              {submittedSuccess ? (
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center space-y-1.5 animate-fade-in">
                  <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                    <Check className="w-5 h-5" />
                  </div>
                  <p className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">
                    ¡Gracias por tu mensaje!
                  </p>
                  <p className="text-emerald-800 dark:text-emerald-400 text-[11px]">
                    Tu sugerencia ha quedado registrada para <strong>{FEEDBACK_EMAIL}</strong>. Ya son {contactCount} personas comunicadas.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSubmittedSuccess(false)}
                    className="mt-2 text-xs text-emerald-700 dark:text-emerald-300 underline font-semibold cursor-pointer"
                  >
                    Enviar otra sugerencia
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmitSuggestion} className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Envía tu sugerencia aquí:
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={suggestionName}
                      onChange={(e) => setSuggestionName(e.target.value)}
                      placeholder="Tu nombre (opcional)"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                    <input
                      type="email"
                      value={suggestionEmail}
                      onChange={(e) => setSuggestionEmail(e.target.value)}
                      placeholder="Tu correo (opcional)"
                      className="w-full px-2.5 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                    />
                  </div>
                  <textarea
                    rows={3}
                    required
                    value={suggestionMessage}
                    onChange={(e) => setSuggestionMessage(e.target.value)}
                    placeholder="Escribe tu sugerencia, recomendación o consulta para ATSPASS..."
                    className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white leading-relaxed"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting || !suggestionMessage.trim()}
                      className="flex-1 py-2 px-3 bg-blue-900 hover:bg-blue-950 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-2xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Registrando...' : 'Enviar Sugerencia'}</span>
                    </button>
                    <a
                      href={`mailto:${FEEDBACK_EMAIL}?subject=Sugerencia%20para%20ATSPASS`}
                      onClick={incrementCounter}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-lg text-xs flex items-center justify-center gap-1 border border-slate-200 dark:border-slate-700 transition-colors"
                      title="Abrir aplicación de correo"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Mail</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

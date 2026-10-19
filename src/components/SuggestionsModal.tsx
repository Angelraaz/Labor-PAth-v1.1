import React, { useState } from 'react';
import { Mail, Copy, Check, ExternalLink, X, MessageSquare, Send } from 'lucide-react';

interface SuggestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionsModal: React.FC<SuggestionsModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const email = 'ajrc.servicios@gmail.com';

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(
    'Sugerencias para ATSPASS'
  )}&body=${encodeURIComponent(
    'Hola equipo de AJRC Servicios,\n\nQuisiera compartir la siguiente sugerencia o comentario sobre la plataforma ATSPASS:\n\n'
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in no-print">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transition-all text-slate-900 dark:text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="suggestions-title"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h3 id="suggestions-title" className="text-sm font-bold">
                Buzón de Sugerencias
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                AJRC Servicios • ATSPASS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Cerrar modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Tu opinión es clave para seguir mejorando ATSPASS. Puedes escribirnos directamente tus dudas, sugerencias o reportes a nuestro correo de soporte y desarrollo:
          </p>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="font-mono font-semibold text-slate-900 dark:text-white truncate select-all">
                {email}
              </span>
            </div>
            <button
              onClick={handleCopy}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-650'
              }`}
              title="Copiar correo al portapapeles"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-1 flex flex-col sm:flex-row gap-2">
            <a
              href={mailtoUrl}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-900 hover:bg-blue-800 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-bold flex items-center justify-center gap-2 text-center transition-colors cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Abrir mi aplicación de correo</span>
            </a>
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors cursor-pointer text-center"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

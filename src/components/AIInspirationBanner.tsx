import React from 'react';
import { Lightbulb } from 'lucide-react';

interface AIInspirationBannerProps {
  className?: string;
  variant?: 'subtle' | 'card';
}

export const AIInspirationBanner: React.FC<AIInspirationBannerProps> = ({
  className = '',
  variant = 'card'
}) => {
  return (
    <div
      role="note"
      aria-label="Recomendación de autenticidad"
      className={`p-3.5 rounded-xl border flex items-start gap-3 transition-colors ${
        variant === 'card'
          ? 'bg-amber-50/70 border-amber-200/80 text-amber-950 shadow-2xs'
          : 'bg-amber-50/50 border-amber-200 text-amber-950'
      } ${className}`}
    >
      <div className="p-1.5 rounded-lg bg-amber-100 text-amber-700 shrink-0 mt-0.5 shadow-2xs">
        <Lightbulb className="w-4 h-4 text-amber-600" />
      </div>
      <div className="flex-1 text-xs leading-relaxed">
        <p className="font-medium text-amber-950">
          Utiliza estas sugerencias como inspiración y guía para adaptarlas a tu perfil. Se recomienda personalizar el contenido y no copiar y pegar directamente para mantener tu autenticidad
        </p>
      </div>
    </div>
  );
};

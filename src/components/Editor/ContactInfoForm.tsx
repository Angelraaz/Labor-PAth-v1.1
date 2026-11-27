import React from 'react';
import { ContactInfo } from '../../types/ats';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface ContactInfoFormProps {
  contact: ContactInfo;
  onChange: (updated: ContactInfo) => void;
}

export const ContactInfoForm: React.FC<ContactInfoFormProps> = ({ contact, onChange }) => {
  const updateField = (field: keyof ContactInfo, value: string) => {
    onChange({
      ...contact,
      [field]: value,
    });
  };

  // Check required fields
  const missingRequired = !contact.fullName || !contact.professionalTitle || !contact.email || !contact.phone || !contact.location;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-900 dark:text-blue-400" />
          1. Datos de Contacto e Identidad Profesional
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Los campos marcados con <span className="text-red-500 font-bold">*</span> son obligatorios para garantizar la validez del ATS. LinkedIn y Sitio Web son estrictamente opcionales.
        </p>
      </div>

      {missingRequired && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 px-3 py-2 rounded-lg text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600 dark:text-amber-400" />
          <span>Atención: Hay campos obligatorios pendientes de completar para asegurar la conformidad ATS de tu currículum.</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={contact.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="ej. Carlos Eduardo Ramírez"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors ${
                !contact.fullName ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Título Profesional u Oficio <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={contact.professionalTitle}
              onChange={(e) => updateField('professionalTitle', e.target.value)}
              placeholder="ej. Supervisor de Operaciones / Mecánico / Administrador"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors font-medium ${
                !contact.professionalTitle ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              required
              value={contact.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="ej. carlos.ramirez@correo.com"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors ${
                !contact.email ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Teléfono Móvil <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              required
              value={contact.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="ej. +52 55 1234 5678"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors ${
                !contact.phone ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Ubicación (Ciudad, País) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              required
              value={contact.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="ej. Ciudad de México, México"
              className={`w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors ${
                !contact.location ? 'border-red-300 dark:border-red-800' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Fotografía de Perfil (Opcional - URL de imagen)
          </label>
          <div className="relative">
            <ImageIcon className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.photoUrl || ''}
              onChange={(e) => updateField('photoUrl', e.target.value)}
              placeholder="ej. https://images.unsplash.com/... o enlace de foto"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Perfil Profesional / LinkedIn (Opcional)
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.linkedin || ''}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="ej. linkedin.com/in/carlos-ramirez"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Sitio Web / Enlace a Trabajos (Opcional)
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.portfolioOrGithub || ''}
              onChange={(e) => updateField('portfolioOrGithub', e.target.value)}
              placeholder="ej. www.carlosramirez.com"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 dark:focus:ring-blue-500 text-slate-900 dark:text-white dark:placeholder-slate-500 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

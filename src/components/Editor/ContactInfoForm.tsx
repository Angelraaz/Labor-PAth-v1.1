import React from 'react';
import { ContactInfo } from '../../types/ats';
import { User, Mail, Phone, MapPin, Linkedin, Globe, Briefcase } from 'lucide-react';

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

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4 text-blue-900" />
          1. Datos de Contacto e Identidad Profesional
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Los ATS requieren encabezados claros sin campos ocultos ni tablas para indexar tus datos de contacto.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.fullName}
              onChange={(e) => updateField('fullName', e.target.value)}
              placeholder="ej. Carlos Eduardo Ramírez"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Título Profesional Ejecutivo <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.professionalTitle}
              onChange={(e) => updateField('professionalTitle', e.target.value)}
              placeholder="ej. Senior Full Stack Engineer & Tech Lead"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Correo Electrónico <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="email"
              value={contact.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="ej. nombre@profesional.com"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Teléfono Móvil <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="tel"
              value={contact.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              placeholder="ej. +52 55 1234 5678"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Ubicación (Ciudad, País) <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.location}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="ej. Ciudad de México, México (o Remoto)"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Perfil de LinkedIn (URL limpia)
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.linkedin}
              onChange={(e) => updateField('linkedin', e.target.value)}
              placeholder="ej. linkedin.com/in/tu-perfil"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            GitHub / Portafolio / Sitio Web
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={contact.portfolioOrGithub}
              onChange={(e) => updateField('portfolioOrGithub', e.target.value)}
              placeholder="ej. github.com/tu-usuario o mi-portafolio.com"
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:bg-white text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

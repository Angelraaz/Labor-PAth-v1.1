import React from 'react';
import { GraduationCap, Award, Plus, Trash2 } from 'lucide-react';
import { EducationItem, CertificationItem } from '../../types/ats';

interface EducationEditorProps {
  education: EducationItem[];
  certifications: CertificationItem[];
  onEducationChange: (updated: EducationItem[]) => void;
  onCertificationsChange: (updated: CertificationItem[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({
  education,
  certifications,
  onEducationChange,
  onCertificationsChange,
}) => {
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      graduationYear: new Date().getFullYear().toString(),
      details: ''
    };
    onEducationChange([...education, newItem]);
  };

  const removeEducation = (index: number) => {
    onEducationChange(education.filter((_, i) => i !== index));
  };

  const updateEduField = (index: number, field: keyof EducationItem, value: string) => {
    const updated = [...education];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onEducationChange(updated);
  };

  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert_${Date.now()}`,
      name: '',
      issuer: '',
      year: new Date().getFullYear().toString()
    };
    onCertificationsChange([...certifications, newItem]);
  };

  const removeCertification = (index: number) => {
    onCertificationsChange(certifications.filter((_, i) => i !== index));
  };

  const updateCertField = (index: number, field: keyof CertificationItem, value: string) => {
    const updated = [...certifications];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onCertificationsChange(updated);
  };

  return (
    <div className="space-y-6">
      {/* Education Block */}
      <div className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-900" />
              5. Formación Académica (Education)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Los ATS buscan títulos de grado, instituciones y año de graduación.
            </p>
          </div>
          <button
            type="button"
            onClick={addEducation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Grado</span>
          </button>
        </div>

        <div className="space-y-3">
          {education.map((edu, idx) => (
            <div
              key={edu.id || idx}
              className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 relative group"
            >
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                title="Eliminar este registro"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Título Obtenido / Grado Académico
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEduField(idx, 'degree', e.target.value)}
                    placeholder="ej. Licenciatura en Administración / Ingeniería de Software"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Universidad o Institución
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEduField(idx, 'institution', e.target.value)}
                    placeholder="ej. Universidad Nacional Autónoma de México"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Año de Graduación
                    </label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => updateEduField(idx, 'graduationYear', e.target.value)}
                      placeholder="2020"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEduField(idx, 'location', e.target.value)}
                      placeholder="Ciudad, País"
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Detalles Adicionales / Menciones de Honor (Opcional)
                  </label>
                  <input
                    type="text"
                    value={edu.details || ''}
                    onChange={(e) => updateEduField(idx, 'details', e.target.value)}
                    placeholder="ej. Mención honorífica, promedio sobresaliente o tesis destacada"
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Block */}
      <div className="space-y-3.5 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
              6. Certificaciones y Licencias Profesionales
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Las certificaciones de la industria (AWS, Scrum, PMP, Microsoft, etc.) suman puntos clave en el filtro ATS.
            </p>
          </div>
          <button
            type="button"
            onClick={addCertification}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Certificación</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id || idx}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-1">
                <input
                  type="text"
                  value={cert.name}
                  onChange={(e) => updateCertField(idx, 'name', e.target.value)}
                  placeholder="Nombre de la certificación (ej. AWS Certified Solutions Architect)"
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 font-medium sm:col-span-2"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => updateCertField(idx, 'issuer', e.target.value)}
                    placeholder="Emisor (ej. AWS, PMI)"
                    className="w-2/3 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                  <input
                    type="text"
                    value={cert.year}
                    onChange={(e) => updateCertField(idx, 'year', e.target.value)}
                    placeholder="Año"
                    className="w-1/3 px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeCertification(idx)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                title="Eliminar certificación"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

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
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-900 dark:text-blue-400" />
              5. Formación Académica (Education)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
              className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 relative group"
            >
              <button
                type="button"
                onClick={() => removeEducation(idx)}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Eliminar este registro"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Título Obtenido / Grado Académico
                  </label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => updateEduField(idx, 'degree', e.target.value)}
                    placeholder="ej. Licenciatura en Administración / Carrera Técnica Automotriz / Bachillerato"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Universidad o Institución
                  </label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => updateEduField(idx, 'institution', e.target.value)}
                    placeholder="ej. Universidad Nacional / Instituto Tecnológico"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Año de Graduación
                    </label>
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={(e) => updateEduField(idx, 'graduationYear', e.target.value)}
                      placeholder="2020"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ubicación
                    </label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEduField(idx, 'location', e.target.value)}
                      placeholder="ej. CDMX"
                      className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Block */}
      <div className="space-y-3.5 pt-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              Certificaciones, Cursos y Licencias
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Certificaciones oficiales, cédulas, carnets o diplomas técnicos.
            </p>
          </div>
          <button
            type="button"
            onClick={addCertification}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-900 dark:bg-blue-600 hover:bg-blue-950 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Añadir Certificación</span>
          </button>
        </div>

        <div className="space-y-3">
          {certifications.map((cert, idx) => (
            <div
              key={cert.id || idx}
              className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 relative group"
            >
              <button
                type="button"
                onClick={() => removeCertification(idx)}
                className="absolute right-3 top-3 p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                title="Eliminar esta certificación"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pr-8">
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nombre de la Certificación o Licencia
                  </label>
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => updateCertField(idx, 'name', e.target.value)}
                    placeholder="ej. Certificación en Diagnóstico OBD-II / Scrum Master / Excel Financiero"
                    className="w-full px-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Emisor / Año
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertField(idx, 'issuer', e.target.value)}
                      placeholder="Emisor"
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500"
                    />
                    <input
                      type="text"
                      value={cert.year}
                      onChange={(e) => updateCertField(idx, 'year', e.target.value)}
                      placeholder="Año"
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white dark:placeholder-slate-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

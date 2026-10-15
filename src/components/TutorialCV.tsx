import React, { useState } from 'react';
import {
  GraduationCap,
  Briefcase,
  User,
  AlignLeft,
  Cpu,
  Award,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  FileText,
  Lightbulb,
  Check,
  ChevronRight,
  Target
} from 'lucide-react';

interface TutorialCVProps {
  onGoToEditor: () => void;
}

export const TutorialCV: React.FC<TutorialCVProps> = ({ onGoToEditor }) => {
  const [activeTopic, setActiveTopic] = useState<'anatomy' | 'contact' | 'summary' | 'star' | 'skills' | 'education' | 'myths'>('star');

  const topics = [
    { id: 'anatomy', title: '1. Anatomía ATS', icon: FileText, tag: 'Estructura' },
    { id: 'contact', title: '2. Contacto', icon: User, tag: 'Identidad' },
    { id: 'summary', title: '3. Resumen', icon: AlignLeft, tag: 'Fórmula' },
    { id: 'star', title: '4. Método STAR & XYZ', icon: TrendingUp, tag: 'Experiencia' },
    { id: 'skills', title: '5. Habilidades', icon: Cpu, tag: 'Keywords' },
    { id: 'education', title: '6. Educación', icon: GraduationCap, tag: 'Grados' },
    { id: 'myths', title: '7. Mitos & Errores', icon: AlertTriangle, tag: 'Peligros' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold">
            <GraduationCap className="w-4 h-4 text-emerald-400" />
            <span>Guía de Ingeniería de Currículums Ejecutivos</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Cómo Crear un Currículum Perfecto para Superar los Filtros ATS
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Más del <strong>75% de los currículums son descartados automáticamente</strong> por los sistemas ATS (Workday, Taleo, Greenhouse, iCIMS) antes de que un reclutador humano los lea. Esta guía visual te enseña la arquitectura exacta, la redacción con el método STAR y la fórmula Google XYZ para garantizar entrevistas.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={onGoToEditor}
              className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-sm flex items-center gap-2 transition-all cursor-pointer"
            >
              <span>Aplicar al Editor de Labor Path</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Guide Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Stepper / Tabs */}
        <div className="border-b border-slate-200 bg-slate-50 flex overflow-x-auto gap-1 p-2 no-scrollbar">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = activeTopic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id as any)}
                className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-200 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-500'}`} />
                <span>{t.title}</span>
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="p-6 sm:p-8 text-slate-800">
          {/* TOPIC 1: ANATOMIA ATS */}
          {activeTopic === 'anatomy' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                  Módulo 1: Fundamentos Técnicos
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  La Regla de Oro: Estructura Lineal Monocolumna
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Los ATS son programas informáticos que analizan el texto de tu CV de arriba a abajo y de izquierda a derecha. Cualquier elemento gráfico complejo confunde al algoritmo y provoca el descarte automático.
                </p>
              </div>

              {/* Visual Dos & Don'ts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl border-2 border-emerald-300 bg-emerald-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Dile SÍ a (Estándar ATS Exitoso):</span>
                  </div>
                  <ul className="space-y-2 text-xs text-emerald-950 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Diseño monocolumna:</strong> Todo el contenido fluye en un solo eje vertical continuo.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Encabezados estándar:</strong> "Experiencia Laboral", "Educación", "Habilidades Técnicas".</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Tipografías del sistema:</strong> Inter, Arial, Calibri, Roboto o Times New Roman (tamaño 10-12pt).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Formato PDF nativo o DOCX:</strong> Con texto vectorizado seleccionable (no imágenes escaneadas).</span>
                    </li>
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border-2 border-rose-300 bg-rose-50/50 space-y-3">
                  <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
                    <XCircle className="w-5 h-5 text-rose-600" />
                    <span>Dile NO a (Causas de Descarte Inmediato):</span>
                  </div>
                  <ul className="space-y-2 text-xs text-rose-950 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Plantillas Canva multicolumna:</strong> Los lectores ATS mezclan el texto de ambas columnas en frases ilegibles.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Tablas complejas o cuadros de texto flotantes:</strong> El 80% de los ATS saltan por completo las cajas flotantes.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Barras de nivel o estrellas gráficas:</strong> Un gráfico no tiene valor de texto ni palabra clave.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-600 font-bold">✕</span>
                      <span><strong>Fotografía personal:</strong> En EE.UU. y empresas globales viola políticas antidiscriminación (EEO).</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 2: CONTACTO */}
          {activeTopic === 'contact' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                  Módulo 2: Encabezado e Identidad
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Qué Datos de Contacto Incluir y Cuáles Omitir
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  El encabezado debe ser minimalista, sin encabezados de pie de página de Word (header/footer) donde los ATS suelen perder información.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Información Obligatoria
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    <li>• <strong>Nombre completo:</strong> En tamaño grande (18-24pt) y negrita.</li>
                    <li>• <strong>Título profesional específico:</strong> Alineado al puesto al que aspiras (ej. <em>Senior Full Stack Engineer</em>).</li>
                    <li>• <strong>Correo profesional:</strong> Evita apodos (ej. <em>nombre.apellido@email.com</em>).</li>
                    <li>• <strong>Teléfono móvil con código de país:</strong> ej. +52 55...</li>
                    <li>• <strong>Ubicación:</strong> Ciudad, País (o indicar <em>Remoto</em>). No hace falta dirección postal exacta.</li>
                    <li>• <strong>Enlace a LinkedIn:</strong> URL limpia sin caracteres aleatorios al final.</li>
                    <li>• <strong>GitHub o Portafolio:</strong> Si el puesto es técnico o de diseño.</li>
                  </ul>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-2">
                  <h4 className="font-bold text-xs text-amber-900 uppercase tracking-wider flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" /> Datos Prohibidos / Obsoletos
                  </h4>
                  <ul className="space-y-1.5 text-xs text-amber-950">
                    <li>✕ <strong>Fotografía personal:</strong> A menos que sea requisito explícito en tu país para modelos/actuación.</li>
                    <li>✕ <strong>Fecha de nacimiento / Edad:</strong> Provoca sesgos inconscientes.</li>
                    <li>✕ <strong>Estado civil o número de hijos:</strong> Datos totalmente privados.</li>
                    <li>✕ <strong>Dirección de calle exacta:</strong> Riesgo de privacidad innecesario.</li>
                    <li>✕ <strong>Números de pasaporte o identificación oficial:</strong> No se solicitan en fase de filtro.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 3: RESUMEN PROFESIONAL */}
          {activeTopic === 'summary' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                  Módulo 3: La Propuesta de Valor
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  La Fórmula de las 3-4 Oraciones para el Resumen Ejecutivo
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  El objetivo profesional obsoleto (<em>"Deseo desarrollarme en una empresa líder..."</em>) ya no se utiliza. Debe reemplazarse por un <strong>Resumen Ejecutivo de Alto Impacto</strong> de entre 40 y 80 palabras.
                </p>
              </div>

              {/* 4-Sentence Formula */}
              <div className="space-y-3">
                <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                  <span className="font-bold text-blue-950 uppercase tracking-wider block mb-1">
                    Oración 1: Identidad Profesional & Años de Experiencia
                  </span>
                  <p className="text-slate-800">
                    Define quién eres, cuántos años de trayectoria tienes y tu área central de especialización.
                    <br /><span className="text-slate-500 italic">Ejemplo: "Senior Full Stack Engineer con más de 7 años de experiencia construyendo arquitecturas cloud escalables..."</span>
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <span className="font-bold text-emerald-950 uppercase tracking-wider block mb-1">
                    Oración 2: Competencias Clave Alineadas a la Vacante (Keywords)
                  </span>
                  <p className="text-slate-800">
                    Menciona directamente las 3 o 4 tecnologías, metodologías o herramientas primordiales que busca el empleador.
                    <br /><span className="text-slate-500 italic">Ejemplo: "Especialista en React, TypeScript, microservicios en Node.js y despliegues en AWS bajo metodologías Agile/Scrum..."</span>
                  </p>
                </div>

                <div className="p-3.5 bg-purple-50 rounded-xl border border-purple-200 text-xs">
                  <span className="font-bold text-purple-950 uppercase tracking-wider block mb-1">
                    Oración 3-4: Mayor Logro Cuantificado & Aporte de Valor
                  </span>
                  <p className="text-slate-800">
                    Tu logro más contundente con evidencia numérica (%, $, tiempo ahorrado, escala de usuarios).
                    <br /><span className="text-slate-500 italic">Ejemplo: "Historial comprobado de optimización de latencia en un 38% y liderazgo de squads de alto rendimiento orientados al negocio."</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 4: METODO STAR & XYZ (HERO TOPIC) */}
          {activeTopic === 'star' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  Módulo 4: El Núcleo de Selección
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Método STAR & la Fórmula Google XYZ para Viñetas Irresistibles
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Los reclutadores y los ATS no buscan listas de tareas repetitivas ("Hacer reportes", "Desarrollar código"). Buscan <strong>logros medibles donde demuestres cómo generaste valor</strong> para la organización.
                </p>
              </div>

              {/* STAR Framework Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-base flex items-center justify-center mb-2">
                    S
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-blue-300">Situación</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    ¿Cuál era el contexto, el problema o el cuello de botella que enfrentaba la empresa?
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black text-base flex items-center justify-center mb-2">
                    T
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-purple-300">Tarea</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    ¿Cuál era tu responsabilidad específica para resolver esa situación?
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black text-base flex items-center justify-center mb-2">
                    A
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-300">Acción</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    ¿Qué medidas tomaste? Inicia siempre con un <strong>verbo de poder en pasado</strong>.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 text-white rounded-xl shadow-xs">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center mb-2">
                    R
                  </div>
                  <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">Resultado</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                    ¿Cuál fue el impacto cuantificable medido en números, porcentajes o dólares?
                  </p>
                </div>
              </div>

              {/* Google XYZ Formula Card */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 rounded-2xl">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider block mb-1">
                  La Fórmula Google XYZ (Estándar de Oro en Tech):
                </span>
                <p className="text-base sm:text-lg font-extrabold text-white">
                  "Logré [X], medido a través de [Y], mediante la ejecución de [Z]"
                </p>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  • <strong>[X]:</strong> El objetivo o resultado de negocio alcanzado.<br />
                  • <strong>[Y]:</strong> La métrica o evidencia cuantitativa (ej. un 35% de mejora, $150K USD ahorrados, 2M de usuarios).<br />
                  • <strong>[Z]:</strong> Las tecnologías, herramientas o estrategias que implementaste para conseguirlo.
                </p>
              </div>

              {/* Before vs After Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Tabla Comparativa: Antes (Descartado) vs Después (Élite ATS)
                </h4>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50 text-rose-950 border border-rose-200">
                      <span className="font-bold text-rose-700 block text-[10px] uppercase mb-1">
                        ✕ Antes (Débil y Genérico):
                      </span>
                      <p className="line-through opacity-85">
                        "Encargado del backend y bases de datos de la empresa."
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
                      <span className="font-bold text-emerald-700 block text-[10px] uppercase mb-1">
                        ✓ Después (Fórmula XYZ):
                      </span>
                      <p className="font-medium">
                        "Arquitecté e implementé microservicios en Node.js y PostgreSQL, reduciendo los tiempos de consulta en un 42% para más de 1.2M de usuarios activos."
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-2.5 rounded-lg bg-rose-50 text-rose-950 border border-rose-200">
                      <span className="font-bold text-rose-700 block text-[10px] uppercase mb-1">
                        ✕ Antes (Débil y Genérico):
                      </span>
                      <p className="line-through opacity-85">
                        "Responsable de gestionar reuniones y proyectos ágiles."
                      </p>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-950 border border-emerald-200">
                      <span className="font-bold text-emerald-700 block text-[10px] uppercase mb-1">
                        ✓ Después (Fórmula XYZ):
                      </span>
                      <p className="font-medium">
                        "Lideré ceremonias Scrum para 3 squads multidisciplinarios (18 ingenieros), acelerando la velocidad de entrega en un 30% dentro de plazos estrictos."
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Power Verbs Cheat Sheet */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Banco de Verbos de Poder en Pasado:
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs">
                  {['Lideré', 'Arquitecté', 'Diseñé', 'Implementé', 'Optimicé', 'Reduje', 'Incrementé', 'Automaticé', 'Escalé', 'Consolidé', 'Negocié', 'Reestructuré', 'Transformé', 'Desarrollé', 'Coordiné'].map((verb, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-blue-100 text-blue-900 rounded font-semibold text-[11px]">
                      {verb}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 5: HABILIDADES */}
          {activeTopic === 'skills' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                  Módulo 5: Algoritmos de Indexación
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Cómo Categorizar Habilidades para Coincidencia Exacta
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Los ATS calculan un puntaje de relevancia (score de compatibilidad) basado en la coincidencia exacta de los términos que el reclutador especificó en la vacante.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-blue-900 uppercase tracking-wider">
                    1. Competencias Técnicas
                  </h4>
                  <p className="text-xs text-slate-600">
                    Lenguajes, conceptos de arquitectura y especialidades nucleares.
                  </p>
                  <p className="text-xs font-mono text-slate-800 bg-white p-2 rounded border border-slate-200">
                    React, TypeScript, Node.js, Microservicios, PostgreSQL, REST APIs
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider">
                    2. Herramientas & Cloud
                  </h4>
                  <p className="text-xs text-slate-600">
                    Software de gestión, proveedores de nube y plataformas utilizadas.
                  </p>
                  <p className="text-xs font-mono text-slate-800 bg-white p-2 rounded border border-slate-200">
                    AWS, Docker, Kubernetes, Git, Jira, Power BI, Redis
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-xs text-purple-900 uppercase tracking-wider">
                    3. Metodologías
                  </h4>
                  <p className="text-xs text-slate-600">
                    Procesos de trabajo y marcos de gobernanza y calidad.
                  </p>
                  <p className="text-xs font-mono text-slate-800 bg-white p-2 rounded border border-slate-200">
                    Agile, Scrum, CI/CD, TDD, DevOps, OKRs, Clean Architecture
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 6: EDUCACION */}
          {activeTopic === 'education' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider block mb-1">
                  Módulo 6: Formación y Credenciales
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Ubicación Estratégica de Educación y Certificaciones
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  ¿La educación va arriba o abajo? Depende 100% de tus años de experiencia laboral.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200 space-y-2">
                  <h4 className="font-bold text-blue-950 uppercase tracking-wider">
                    Candidato Senior (+3 años de experiencia):
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Ubica la educación <strong>al final de tu currículum</strong>, después de la Experiencia Laboral y Habilidades. Lo que más valoran los empleadores a este nivel es tu historial de impacto cuantificado.
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-emerald-950 uppercase tracking-wider">
                    Recién Graduado o Junior (-2 años de experiencia):
                  </h4>
                  <p className="text-slate-700 leading-relaxed">
                    Puedes colocar la educación <strong>inmediatamente después del Resumen</strong>, resaltando proyectos universitarios destacados, promedio sobresaliente o premios académicos.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 7: MITOS & ERRORES */}
          {activeTopic === 'myths' && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
                  Módulo 7: Trampas Peligrosas
                </span>
                <h3 className="text-xl font-black text-slate-900">
                  Mitos y Prácticas que Provocan el Bloqueo de tu CV
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  Circulan muchos "hacks" en redes sociales que en la práctica empresarial garantizan que tu postulación sea descartada por fraude o error de parseo.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-950">
                  <h4 className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Mito #1: "Poner palabras clave en texto blanco invisible al final del PDF"
                  </h4>
                  <p className="leading-relaxed">
                    <strong>La Realidad:</strong> Los ATS modernos extraen el texto crudo sin renderizar estilos visuales. Si el reclutador ve una lista de 50 palabras inconexas en el perfil parseado, el sistema clasifica el currículum como intento de manipulación y lo descarta de por vida en esa empresa.
                  </p>
                </div>

                <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-950">
                  <h4 className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Mito #2: "Las plantillas bonitas de diseño en Canva tienen ventaja"
                  </h4>
                  <p className="leading-relaxed">
                    <strong>La Realidad:</strong> Canva crea archivos PDF que a menudo guardan el texto como bloques gráficos SVG o capas desordenadas. El ATS ve un documento vacío o con caracteres desordenados ("Ingeniero Software México 2023 React").
                  </p>
                </div>

                <div className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 text-xs text-rose-950">
                  <h4 className="font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                    <XCircle className="w-4 h-4 text-rose-600" />
                    Mito #3: "Debes enviar el mismo CV a todas las empresas"
                  </h4>
                  <p className="leading-relaxed">
                    <strong>La Realidad:</strong> Cada empresa calibra su ATS con requisitos específicos. Calibrar tu CV con las palabras clave exactas de cada vacante eleva tu tasa de respuesta de un 2% a más de un 25%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA to Editor */}
        <div className="bg-slate-50 p-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Labor Path garantiza que tu documento cumple con el 100% de estas normas.</span>
          </div>

          <button
            onClick={onGoToEditor}
            className="w-full sm:w-auto py-2.5 px-5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Target className="w-4 h-4" />
            <span>Ir al Editor y Optimizar mi Currículum</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

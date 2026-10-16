import { CVData, JobTarget } from '../types/ats';

export interface SampleBundle {
  id: string;
  name: string;
  roleTitle: string;
  category: 'Administración' | 'Oficios & Mecánica' | 'Textil & Confección' | 'Salud' | 'Ventas & Comercial' | 'Tecnología & Software';
  description: string;
  jobTarget: JobTarget;
  cvData: CVData;
}

export const SAMPLE_PROFILES: SampleBundle[] = [
  {
    id: 'admin_assistant',
    name: 'Asistente Administrativo y Contable',
    roleTitle: 'Asistente Administrativo y Contable',
    category: 'Administración',
    description: 'Gestión documental, facturación CFDI/SAT, conciliaciones bancarias, cuentas por cobrar y archivo.',
    jobTarget: {
      title: 'Asistente Administrativo y Contable',
      company: 'Consorcio Comercial & Servicios',
      rawDescription: `Buscamos Asistente Administrativo y Contable para integrarse a nuestro equipo operativo.
Requisitos:
- Más de 3 años de experiencia en administración de oficina, facturación electrónica CFDI (SAT) y archivo documental.
- Manejo de conciliaciones bancarias, control de caja chica y seguimiento a cuentas por pagar y por cobrar.
- Dominio intermedio-avanzado de Microsoft Excel (tablas dinámicas, fórmulas lógicas, conciliaciones).
- Manejo de sistemas ERP contables (Aspel, SAP o Contpaqi).
- Excelente trato a clientes y proveedores, puntualidad y organización rigurosa.`,
      extractedEntities: {
        technicalSkills: ['Facturación Electrónica SAT', 'CFDI 4.0', 'Conciliaciones Bancarias', 'Cuentas por Cobrar', 'Cuentas por Pagar', 'Arqueo de Caja Chica', 'Control de Inventarios', 'Gestión Documental'],
        toolsAndSoftware: ['Microsoft Excel Avanzado', 'Aspel SAE / COI', 'SAP ERP', 'Portal SAT', 'Google Workspace'],
        methodologies: ['Control Interno Administrativo', 'Archivo Físico y Digital', '5S en Oficina', 'Atención a Proveedores'],
        actionVerbs: ['Gestioné', 'Facturé', 'Concilié', 'Elaboré', 'Optimicé', 'Coordiné', 'Tramité'],
        softSkills: ['Organización Rigurosa', 'Atención al Detalle', 'Comunicación Asertiva', 'Resolución de Conflictos'],
        certificationsAndEducation: ['Licenciatura en Administración / Contabilidad o Técnico Superior'],
        seniorityLevel: 'Mid'
      }
    },
    cvData: {
      id: 'cv_admin_assistant',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Mariana Flores Valenzuela',
        professionalTitle: 'Asistente Administrativo y Contable',
        email: 'mariana.flores.admin@email.com',
        phone: '+52 55 5892 4110',
        location: 'Ciudad de México, México',
        linkedin: 'linkedin.com/in/mariana-flores-admin'
      },
      summary: 'Asistente Administrativo y Contable con más de 4 años de experiencia coordinando operaciones de oficina, facturación electrónica CFDI 4.0 y conciliaciones bancarias. Experta en Microsoft Excel y sistemas Aspel. Historial comprobado de reducción de cartera vencida en un 28% y arqueos de caja con 99.8% de precisión.',
      experience: [
        {
          id: 'exp_adm_1',
          jobTitle: 'Asistente Administrativo y de Cuentas',
          company: 'Distribuidora Logística Central',
          location: 'Ciudad de México',
          startDate: '2022',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Gestioné la facturación electrónica mensual de más de 480 clientes en Aspel y portal SAT, cumpliendo al 100% con los plazos fiscales vigentes.',
            'Ejecuté conciliaciones bancarias diarias y arqueos de caja chica con un índice de precisión del 99.8% sobre un flujo de $60,000 MXN semanales.',
            'Optimicé el proceso de cobranza y seguimiento a clientes, reduciendo la cartera vencida en un 28% durante los primeros 6 meses.',
            'Digitalicé el expediente de más de 250 proveedores y contratos, disminuyendo el tiempo de localización de documentos de 25 minutos a 2 minutos.'
          ]
        },
        {
          id: 'exp_adm_2',
          jobTitle: 'Auxiliar Administrativo y de Recepción',
          company: 'Servicios Corporativos del Valle',
          location: 'Naucalpan, Estado de México',
          startDate: '2020',
          endDate: '2022',
          current: false,
          bullets: [
            'Elaboré reportes semanales de gastos e ingresos en Excel utilizando tablas dinámicas y cruces de bases de datos.',
            'Atendí un promedio de 60 llamadas y solicitudes diarias de proveedores y clientes con un índice de satisfacción del 96%.',
            'Coordiné compras de insumos y consumibles de oficina logrando un ahorro del 14% mediante negociación con proveedores locales.'
          ]
        }
      ],
      skills: {
        technical: ['Facturación SAT CFDI 4.0', 'Conciliaciones Bancarias', 'Cuentas por Cobrar', 'Cuentas por Pagar', 'Arqueo de Caja', 'Control Documental'],
        tools: ['Excel (Tablas Dinámicas y BuscarV)', 'Aspel COI / SAE', 'Portal SAT', 'Google Sheets', 'Outlook'],
        methodologies: ['Control Interno', 'Gestión de Archivo', 'Atención a Proveedores', '5S'],
        languages: ['Español (Nativo)', 'Inglés (Básico / Comprensión)']
      },
      education: [
        {
          id: 'edu_adm_1',
          degree: 'Licenciatura en Administración de Empresas',
          institution: 'Universidad Autónoma Metropolitana (UAM)',
          location: 'Ciudad de México',
          graduationYear: '2020',
          details: 'Enfoque en Gestión de Procesos Administrativos y Contabilidad Básica.'
        }
      ],
      certifications: [
        {
          id: 'cert_adm_1',
          name: 'Certificación en Facturación CFDI 4.0 y Portal SAT',
          issuer: 'Colegio de Contadores Públicos',
          year: '2023'
        },
        {
          id: 'cert_adm_2',
          name: 'Excel Intermedio-Avanzado para Negocios',
          issuer: 'Instituto de Especialización Administrativa',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'mecanico_automotriz',
    name: 'Técnico Mecánico Automotriz',
    roleTitle: 'Técnico Mecánico Automotriz y Mantenimiento de Flotillas',
    category: 'Oficios & Mecánica',
    description: 'Diagnóstico por escáner OBD-II, motores gasolina/diésel, frenos ABS, suspensión y mantenimiento preventivo.',
    jobTarget: {
      title: 'Técnico Mecánico Automotriz y Mantenimiento de Flotillas',
      company: 'Taller de Servicio y Mantenimiento Diésel',
      rawDescription: `Se solicita Mecánico Automotriz especializado en mantenimiento preventivo y correctivo para flotillas comerciales.
Requisitos:
- Experiencia de 4+ años en diagnóstico computarizado con escáner OBD-II (Launch, Autel o Snap-on).
- Mantenimiento general de motores a gasolina y diésel ligero, cambios de distribución y afinaciones mayores.
- Reparación de sistemas de frenos (ABS, discos, tambores) y sistemas de suspensión y dirección.
- Cumplimiento de normas de seguridad e higiene en taller mecánico y manejo adecuado de residuos peligrosos.
- Licencia de conducir vigente y capacidad de trabajo en equipo.`,
      extractedEntities: {
        technicalSkills: ['Diagnóstico OBD-II', 'Afinación Mayor y Menor', 'Motores Gasolina y Diésel', 'Sistema de Frenos ABS', 'Suspensión y Dirección', 'Transmisiones', 'Mantenimiento Preventivo Planificado', 'Alineación y Balanceo'],
        toolsAndSoftware: ['Escáner Automotriz Autel / Launch', 'Multímetro Automotriz', 'Torquímetro', 'Elevador Hidráulico', 'Compresor Neumático'],
        methodologies: ['Normas de Seguridad Industrial NOM', 'Manejo de Residuos Peligrosos', 'Bitácoras de Mantenimiento', 'Checklist de Inspección de 50 Puntos'],
        actionVerbs: ['Diagnostiqué', 'Reparé', 'Reemplacé', 'Ajusté', 'Inspeccioné', 'Calibré', 'Previne'],
        softSkills: ['Diagnóstico Analítico', 'Responsabilidad', 'Trabajo Seguro', 'Orientación al Cliente'],
        certificationsAndEducation: ['Carrera Técnica en Mecánica Automotriz o Autotrónica'],
        seniorityLevel: 'Técnico Especializado'
      }
    },
    cvData: {
      id: 'cv_mecanico_automotriz',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Roberto Aguilar Sandoval',
        professionalTitle: 'Técnico Mecánico Automotriz y Diagnóstico',
        email: 'roberto.aguilar.mecanica@email.com',
        phone: '+52 55 7654 3210',
        location: 'Toluca, Estado de México',
        linkedin: 'linkedin.com/in/roberto-aguilar-mecanico'
      },
      summary: 'Técnico Mecánico Automotriz con más de 5 años de trayectoria en diagnóstico computarizado con escáner OBD-II, reparación de motores y mantenimiento preventivo de flotillas. Especialista en sistemas de frenos ABS, suspensión y transmisiones. Historial de reducción de fallas mecánicas en ruta en un 38% y mantenimiento de más de 600 vehículos anuales.',
      experience: [
        {
          id: 'exp_mec_1',
          jobTitle: 'Mecánico Encargado de Flotillas',
          company: 'Transportes y Logística Mexiquense',
          location: 'Toluca, Edo. Méx.',
          startDate: '2021',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Gestioné el mantenimiento preventivo y correctivo de una flotilla de 42 unidades (Nissan Urvan, Ford Transit y camionetas de 3.5 tons), reduciendo fallas en carretera en un 38%.',
            'Realicé diagnósticos computarizados con escáner Autel Maxisys en más de 20 vehículos semanales, disminuyendo el tiempo de detección de averías de 3 horas a 45 minutos.',
            'Reconstruí y afiné 35 motores de combustión interna garantizando cero garantías por fallas de armado en los últimos 24 meses.',
            'Supervisé el cumplimiento de la bitácora de servicios de 50 puntos y control de refacciones, ahorrando un 16% en costos de recambios no programados.'
          ]
        },
        {
          id: 'exp_mec_2',
          jobTitle: 'Técnico Mecánico de Servicio Rápido',
          company: 'Centro de Servicio Automotriz Los Laureles',
          location: 'Toluca, Edo. Méx.',
          startDate: '2019',
          endDate: '2021',
          current: false,
          bullets: [
            'Ejecuté servicios de afinación mayor, cambio de bandas de distribución y frenos ABS en más de 12 vehículos semanales.',
            'Realicé pruebas de compresión de cilindros, presión de bomba de gasolina y purga de circuitos hidráulicos.',
            'Apliqué protocolos de seguridad industrial y disposición responsable de aceites y solventes usados conforme a normativa ambiental.'
          ]
        }
      ],
      skills: {
        technical: ['Diagnóstico Escáner OBD-II', 'Reparación de Motores', 'Frenos ABS e Hidráulicos', 'Suspensión y Amortiguadores', 'Sistema Eléctrico Automotriz', 'Afinación Mayor'],
        tools: ['Escáner Autel / Launch', 'Torquímetro', 'Multímetro Automotriz', 'Pistola Neumática', 'Gatos Hidráulicos'],
        methodologies: ['Mantenimiento Preventivo (MPP)', 'Checklist de Seguridad', 'Control de Garantías', 'Normas Ambientales'],
        languages: ['Español (Nativo)']
      },
      education: [
        {
          id: 'edu_mec_1',
          degree: 'Técnico Profesional en Mantenimiento Automotriz',
          institution: 'CONALEP Plantel Toluca',
          location: 'Toluca, México',
          graduationYear: '2019',
          details: 'Especialidad en Sistemas de Inyección Electrónica y Frenos ABS.'
        }
      ],
      certifications: [
        {
          id: 'cert_mec_1',
          name: 'Certificación en Diagnóstico Electrónico Automotriz OBD-II',
          issuer: 'Centro Nacional de Capacitación Automotriz (CENCA)',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'costurera_confeccion',
    name: 'Costurera Industrial y Patronista',
    roleTitle: 'Costurera Industrial y Confeccionista Textil',
    category: 'Textil & Confección',
    description: 'Patronaje industrial, corte y confección en serie, manejo de máquina recta, overlock y collareta.',
    jobTarget: {
      title: 'Costurera Industrial y Confeccionista Textil',
      company: 'Taller de Confección & Maquila Textil',
      rawDescription: `Se solicita Costurera Industrial y Confeccionista con amplia experiencia en producción en serie.
Requisitos:
- 3+ años en manejo de máquinas de costura industrial (máquina recta, overlock de 4 y 5 hilos, collareta/recubridora).
- Ensamble de prendas completas: playeras, camisas, pantalones y uniformes corporativos.
- Dominio en corte de tela, interpretación de moldes y patronaje básico/intermedio.
- Alto sentido de calidad: costuras derechas, acabados limpios y cumplimiento de cuotas de producción diaria.
- Capacidad para resolver atascos menores y mantenimiento preventivo de máquinas (cambio de agujas, lubricación).`,
      extractedEntities: {
        technicalSkills: ['Confección de Prendas en Serie', 'Manejo de Máquina Recta Industrial', 'Overlock 4 y 5 Hilos', 'Collareta / Recubridora', 'Corte y Trazado de Telas', 'Patronaje y Escalado', 'Ensamble de Cuellos y Cierres', 'Control de Calidad de Puntadas'],
        toolsAndSoftware: ['Máquina Recta Brother/Juki', 'Overlock Industrial', 'Collareta', 'Cortadora Circular', 'Cinta Métrica y Reglas de Patronaje'],
        methodologies: ['Producción en Línea', 'Control de Cero Defectos', 'Aprovechamiento Textil (Reducción de Merma)', 'Mantenimiento Preventivo de Maquinaria'],
        actionVerbs: ['Confeccioné', 'Corté', 'Ensamblé', 'Patroné', 'Optimicé', 'Inspeccioné', 'Cosí'],
        softSkills: ['Destreza Manual', 'Atención al Detalle', 'Velocidad y Precisión', 'Trabajo en Equipo'],
        certificationsAndEducation: ['Carrera Técnica o Diploma en Diseño y Confección Textil'],
        seniorityLevel: 'Oficio Especializado'
      }
    },
    cvData: {
      id: 'cv_costurera_confeccion',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Elena Martínez Pineda',
        professionalTitle: 'Costurera Industrial y Confeccionista Textil',
        email: 'elena.martinez.costura@email.com',
        phone: '+52 55 6543 2109',
        location: 'Puebla, Puebla, México',
        linkedin: 'linkedin.com/in/elena-martinez-confeccion'
      },
      summary: 'Costurera Industrial y Patronista con más de 6 años de experiencia en manufactura textil y confección de prendas en serie. Dominio experto de máquinas industriales recta, overlock y collareta. Historial de superación de metas de producción en un 22% con un índice de merma textil menor al 2.5% y acabados de alta calidad.',
      experience: [
        {
          id: 'exp_cos_1',
          jobTitle: 'Costurera Industrial de Muestra y Producción',
          company: 'Confecciones Textiles de Puebla',
          location: 'Puebla, Pue.',
          startDate: '2021',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Confeccioné un promedio de 160 prendas diarias (uniformes industriales, playeras polo y camisas de vestir) con cero rechazos en inspección final.',
            'Operé con alta destreza máquinas industriales recta, overlock de 5 hilos y collareta, realizando costuras francesas, dobladillos invisibles y pespuntes dobles.',
            'Optimicé el tendido y corte de lienzos textiles, reduciendo la merma y desperdicio de tela en un 18% anual.',
            'Elaboré prendas de muestra inicial a partir de fichas técnicas para aprobación de clientes corporativos antes del corte masivo.'
          ]
        },
        {
          id: 'exp_cos_2',
          jobTitle: 'Operaria de Costura y Confección',
          company: 'Taller de Confección La Providencia',
          location: 'Tehuacán, Puebla',
          startDate: '2018',
          endDate: '2021',
          current: false,
          bullets: [
            'Ensamblé piezas críticas de prendas (pegado de cuellos camiseros, colocación de cierres invisibles y ojales).',
            'Realicé mantenimiento preventivo diario a las máquinas asignadas (limpieza de pelusa, enhebrado de tensiones y lubricación de cabezales).',
            'Cumplí sistemáticamente con las cuotas diarias de producción con un 99.2% de puntadas sin salto ni arrugamiento.'
          ]
        }
      ],
      skills: {
        technical: ['Confección en Serie', 'Manejo de Overlock y Recta Industrial', 'Patronaje y Escalado', 'Corte de Telas', 'Colocación de Cierres y Cuellos', 'Control de Tensión de Hilos'],
        tools: ['Máquinas Juki / Brother / Singer Industrial', 'Cortadora Eléctrica', 'Plancha de Vapor Industrial', 'Guías y Aditamentos de Costura'],
        methodologies: ['Producción Continua', 'Control de Cero Defectos', 'Reducción de Merma Textil', 'Seguridad en Taller'],
        languages: ['Español (Nativo)']
      },
      education: [
        {
          id: 'edu_cos_1',
          degree: 'Diploma Técnico en Corte, Patronaje y Confección Industrial',
          institution: 'Centro de Capacitación para el Trabajo Industrial (CECATI)',
          location: 'Puebla, México',
          graduationYear: '2018',
          details: 'Especialización en Patronaje Femenino y Operación de Maquinaria Pesada Textil.'
        }
      ],
      certifications: [
        {
          id: 'cert_cos_1',
          name: 'Certificación en Operación de Maquinaria Textil Industrial',
          issuer: 'Cámara Nacional de la Industria del Vestido (CANAIVE)',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'enfermera_clinica',
    name: 'Enfermera General y Cuidados Clínicos',
    roleTitle: 'Enfermera General y Cuidados Clínicos Hospitalarios',
    category: 'Salud',
    description: 'Triaje de pacientes, administración parenteral de fármacos, signos vitales y bioseguridad clínica.',
    jobTarget: {
      title: 'Enfermera General y Cuidados Clínicos Hospitalarios',
      company: 'Hospital San José & Red Hospitalaria',
      rawDescription: `Buscamos Enfermero/a General para área de hospitalización y urgencias.
Requisitos:
- Título y cédula profesional en Enfermería.
- Mínimo 3 años de experiencia en hospitalización de adultos, urgencias o medicina interna.
- Manejo de accesos venosos periféricos, administración de medicamentos bajo la regla de los correctos y toma de signos vitales.
- Manejo de expediente clínico electrónico (ECE) y cumplimiento estricto de la NOM-004 y NOM-016.
- Compromiso con las Metas Internacionales de Seguridad del Paciente y trato humanizado.`,
      extractedEntities: {
        technicalSkills: ['Atención Integral al Paciente', 'Administración de Medicamentos Parenterales', 'Canalización de Vías Venosas', 'Monitoreo de Signos Vitales', 'Curación de Heridas Quirúrgicas', 'Triaje en Urgencias', 'Expediente Clínico Electrónico', 'Manejo de Bombas de Infusión'],
        toolsAndSoftware: ['Monitor de Signos Vitales', 'Electrocardiógrafo', 'Bomba de Infusión Braun/Baxter', 'Glucómetro', 'Software de Expediente Electrónico'],
        methodologies: ['Metas Internacionales de Seguridad del Paciente', 'Proceso de Atención de Enfermería (PAE)', 'Control de Infecciones Intrahospitalarias', 'NOM-004-SSA3'],
        actionVerbs: ['Administré', 'Monitoricé', 'Canalicé', 'Evalué', 'Asistí', 'Registré', 'Curé'],
        softSkills: ['Empatía y Trato Digno', 'Trabajo bajo Presión', 'Ética Profesional', 'Comunicación Interdisciplinaria'],
        certificationsAndEducation: ['Licenciatura en Enfermería (Título y Cédula)'],
        seniorityLevel: 'Profesional Clínico'
      }
    },
    cvData: {
      id: 'cv_enfermera_clinica',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Lic. Claudia Hernández Becerra',
        professionalTitle: 'Enfermera General y Cuidados Hospitalarios',
        email: 'claudia.hernandez.enfermeria@email.com',
        phone: '+52 55 8765 4321',
        location: 'Guadalajara, Jalisco, México',
        linkedin: 'linkedin.com/in/claudia-hernandez-enfermera'
      },
      summary: 'Licenciada en Enfermería con más de 4 años de experiencia en hospitalización y medicina interna. Especialista en administración segura de medicamentos, canalización de vías periféricas y protocolos de bioseguridad. Condecorada por excelencia en el apego a las Metas Internacionales de Seguridad del Paciente y trato humanizado.',
      experience: [
        {
          id: 'exp_enf_1',
          jobTitle: 'Enfermera General de Hospitalización',
          company: 'Hospital Metropolitano de Guadalajara',
          location: 'Guadalajara, Jal.',
          startDate: '2021',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Atendí y monitoricé a un promedio de 22 pacientes por turno en piso de hospitalización, garantizando 100% de apego a los 10 correctos de administración de medicamentos.',
            'Instalé y mantuve accesos venosos periféricos con una tasa de éxito al primer intento del 94%, minimizando el dolor y riesgo de flebitis.',
            'Registré oportunamente la evolución clínica, signos vitales y balances de líquidos en el Expediente Clínico Electrónico cumpliendo la NOM-004.',
            'Capacité a familiares y pacientes en cuidados postoperatorios y manejo de heridas en casa, reduciendo reingresos por infecciones en un 19%.'
          ]
        },
        {
          id: 'exp_enf_2',
          jobTitle: 'Enfermera Asistencial de Urgencias',
          company: 'Clínica Médica de Especialidades',
          location: 'Zapopan, Jalisco',
          startDate: '2019',
          endDate: '2021',
          current: false,
          bullets: [
            'Realicé clasificación de triaje clínico de urgencias en más de 35 pacientes diarios según el sistema Manchester.',
            'Asistí a médicos especialistas en procedimientos invasivos, toma de electrocardiogramas y colocación de sondas nasogástricas y vesicales.',
            'Mantuve el carro rojo de reanimación cardiopulmonar con inventario y caducidades al 100% verificado por turno.'
          ]
        }
      ],
      skills: {
        technical: ['Administración Parenteral de Medicamentos', 'Canalización de Vías Venosas', 'Triaje Hospitalario', 'Monitoreo de Signos Vitales', 'Curación de Heridas', 'Reanimación Cardiopulmonar (BLS)'],
        tools: ['Monitores Multiparámetros', 'Bombas de Infusión', 'Electrocardiógrafo', 'Expediente Electrónico ECE', 'Glucómetro'],
        methodologies: ['Metas de Seguridad del Paciente', 'PAE (Proceso de Enfermería)', 'Técnicas Asépticas', 'NOM-004'],
        languages: ['Español (Nativo)', 'Inglés (Básico Clínico)']
      },
      education: [
        {
          id: 'edu_enf_1',
          degree: 'Licenciatura en Enfermería',
          institution: 'Universidad de Guadalajara (UdeG)',
          location: 'Guadalajara, México',
          graduationYear: '2019',
          details: 'Servicio social concluido en Hospital Civil de Guadalajara con mención honorífica.'
        }
      ],
      certifications: [
        {
          id: 'cert_enf_1',
          name: 'Soporte Vital Básico (BLS - Basic Life Support)',
          issuer: 'American Heart Association (AHA)',
          year: '2023'
        },
        {
          id: 'cert_enf_2',
          name: 'Certificación en Control de Infecciones y Bioseguridad',
          issuer: 'Colegio de Profesionales de Enfermería',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'ventas_comercial',
    name: 'Ejecutivo de Ventas y Cuentas Clave',
    roleTitle: 'Ejecutivo de Ventas B2B y Cuentas Comerciales',
    category: 'Ventas & Comercial',
    description: 'Prospección comercial, cierre de ventas, cotizaciones, cumplimiento de cuotas y CRM comercial.',
    jobTarget: {
      title: 'Ejecutivo de Ventas B2B y Cuentas Comerciales',
      company: 'Soluciones Industriales & Distribución',
      rawDescription: `Buscamos Ejecutivo de Ventas con experiencia en negociación comercial y apertura de mercado.
Requisitos:
- 3+ años en ventas consultivas B2B o atención a cuentas clave corporativas.
- Prospección activa, elaboración de propuestas económicas, cotizaciones y cierre de contratos.
- Cumplimiento comprobado de cuota de ventas mensual y anual.
- Manejo de CRM comercial (HubSpot, Salesforce o Zoho) y seguimiento de embudo de ventas.
- Negociación persuasiva, excelente dicción y orientación orientada a comisiones y metas de facturación.`,
      extractedEntities: {
        technicalSkills: ['Ventas Consultivas B2B', 'Prospección en Frío', 'Negociación Comercial', 'Cierre de Contratos', 'Elaboración de Cotizaciones', 'Gestión de Embudo de Ventas (Pipeline)', 'Fidelización de Clientes', 'Análisis de Rentabilidad'],
        toolsAndSoftware: ['CRM HubSpot / Salesforce', 'Microsoft Excel Comercial', 'WhatsApp Business', 'ERP Comercial'],
        methodologies: ['Metodología SPIN Selling', 'Venta Consultiva', 'Servicio Postventa', 'KPIs Comerciales'],
        actionVerbs: ['Generé', 'Cerré', 'Negocié', 'Incrementé', 'Prospecté', 'Fidelicé', 'Presenté'],
        softSkills: ['Persuasión y Negociación', 'Resiliencia Comercial', 'Comunicación de Alto Impacto', 'Orientación a Resultados'],
        certificationsAndEducation: ['Licenciatura en Mercadotecnia / Administración o afín'],
        seniorityLevel: 'Mid-Senior'
      }
    },
    cvData: {
      id: 'cv_ventas_comercial',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Jorge Luis Morales Peralta',
        professionalTitle: 'Ejecutivo de Ventas y Cuentas Clave B2B',
        email: 'jorge.morales.ventas@email.com',
        phone: '+52 55 4321 0987',
        location: 'Querétaro, Querétaro, México',
        linkedin: 'linkedin.com/in/jorge-morales-ventas'
      },
      summary: 'Ejecutivo de Ventas B2B con más de 5 años de trayectoria en prospección, negociación y cierre de cuentas clave. Experto en venta consultiva y manejo de CRM HubSpot. Historial comprobado de cumplimiento del 120% de cuotas de facturación anual y captación de más de 30 cuentas corporativas de alto volumen.',
      experience: [
        {
          id: 'exp_ven_1',
          jobTitle: 'Ejecutivo de Cuentas Corporativas B2B',
          company: 'Suministros Comerciales del Bajío',
          location: 'Querétaro, Qro.',
          startDate: '2021',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Superé la cuota asignada durante 7 trimestres consecutivos promediando un 122% de cumplimiento y generando $3.2M MXN en facturación anual.',
            'Prospecté y cerré contratos anuales de suministro con 28 nuevas cuentas industriales en el corredor automotriz y manufacturero.',
            'Optimicé el ciclo de cierre comercial de 45 a 21 días mediante la estructuración de propuestas de valor y seguimiento puntual en CRM HubSpot.',
            'Incrementé el ticket promedio de compra en un 26% mediante estrategias de venta cruzada (upselling) y paquetes de servicio integral.'
          ]
        },
        {
          id: 'exp_ven_2',
          jobTitle: 'Representante de Ventas y Atención al Cliente',
          company: 'Comercializadora Industrial Querétaro',
          location: 'Querétaro, Qro.',
          startDate: '2019',
          endDate: '2021',
          current: false,
          bullets: [
            'Gestioné una cartera de más de 65 clientes activos con una tasa de retención y recompra del 93%.',
            'Elaboré más de 40 cotizaciones técnicas mensuales garantizando márgenes brutos de ganancia superiores al 30%.',
            'Resolví incidencias postventa y tiempos de entrega alcanzando una calificación de satisfacción de clientes del 98%.'
          ]
        }
      ],
      skills: {
        technical: ['Ventas B2B', 'Prospección Comercial', 'Cierre de Contratos', 'Negociación Estratégica', 'Gestión de Cuentas Clave', 'Pronóstico de Ventas (Forecast)'],
        tools: ['HubSpot CRM', 'Salesforce', 'Excel Comercial (Cotizadores)', 'WhatsApp Business', 'ERP de Pedidos'],
        methodologies: ['SPIN Selling', 'Venta Consultiva', 'Gestión de Pipeline', 'Servicio Postventa'],
        languages: ['Español (Nativo)', 'Inglés (Intermedio de Negocios)']
      },
      education: [
        {
          id: 'edu_ven_1',
          degree: 'Licenciatura en Mercadotecnia y Comercialización',
          institution: 'Universidad Autónoma de Querétaro (UAQ)',
          location: 'Querétaro, México',
          graduationYear: '2019',
          details: 'Especialización en Estrategia de Ventas y Relaciones Comerciales.'
        }
      ],
      certifications: [
        {
          id: 'cert_ven_1',
          name: 'Certificación en Ventas Inbound y Gestión de Pipeline',
          issuer: 'HubSpot Academy',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'fullstack_lead',
    name: 'Senior Full Stack Engineer',
    roleTitle: 'Senior Full Stack Engineer & Tech Lead',
    category: 'Tecnología & Software',
    description: 'Arquitectura cloud, microservicios, React, Node.js, PostgreSQL y escalabilidad de software.',
    jobTarget: {
      title: 'Senior Full Stack Engineer',
      company: 'Fintech Global Solutions',
      rawDescription: `Buscamos un Senior Full Stack Engineer para liderar la evolución de nuestra plataforma financiera transaccional de alto tráfico.
Requisitos:
- Más de 6 años de experiencia desarrollando aplicaciones web con React, TypeScript y Node.js.
- Dominio de microservicios, bases de datos PostgreSQL y entornos Cloud (AWS o GCP).
- Práctica en metodologías Agile/Scrum, testing automatizado (TDD, Jest).
- Capacidad para liderar equipos técnicos y optimizar tiempos de respuesta.`,
      extractedEntities: {
        technicalSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Microservicios', 'Docker', 'Kubernetes', 'CI/CD'],
        toolsAndSoftware: ['AWS', 'Git', 'Jest', 'Docker', 'Kubernetes'],
        methodologies: ['Agile', 'Scrum', 'CI/CD', 'TDD', 'DevOps'],
        actionVerbs: ['Lideré', 'Arquitecté', 'Optimicé', 'Implementé', 'Reduje'],
        softSkills: ['Liderazgo Técnico', 'Resolución de Problemas'],
        certificationsAndEducation: ['Ingeniería en Sistemas / Computación'],
        seniorityLevel: 'Senior / Tech Lead'
      }
    },
    cvData: {
      id: 'cv_fullstack_lead',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Alejandro Morales Mendoza',
        professionalTitle: 'Senior Full Stack Engineer & Tech Lead',
        email: 'alejandro.morales.dev@email.com',
        phone: '+52 55 4123 8900',
        location: 'Ciudad de México, México (Remoto)',
        linkedin: 'linkedin.com/in/alejandro-morales-tech'
      },
      summary: 'Senior Full Stack Engineer con 7+ años de trayectoria diseñando y desplegando sistemas distribuidos y plataformas web de alta disponibilidad. Especialista en React, TypeScript, Node.js y arquitecturas cloud en AWS. Historial comprobado de optimización de latencia en un 42% y liderazgo de squads ágiles orientados a negocio.',
      experience: [
        {
          id: 'exp_1',
          jobTitle: 'Tech Lead & Senior Full Stack Engineer',
          company: 'Krea Financial Technologies',
          location: 'Remoto / CDMX',
          startDate: '2022',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Arquitecté e implementé una plataforma transaccional basada en microservicios utilizando React, TypeScript y Node.js, procesando más de 1.8 millones de transacciones mensuales con 99.98% de disponibilidad.',
            'Reduje la latencia de respuesta de los servicios críticos en un 38% mediante la implementación de capas de caché distribuido en Redis y optimización de queries complejas en PostgreSQL.',
            'Lideré un squad ágil de 8 ingenieros de software, acelerando el ciclo de entrega de despliegues en un 45% a través de pipelines de CI/CD automatizados en AWS y Docker.'
          ]
        }
      ],
      skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Microservicios', 'REST APIs'],
        tools: ['AWS', 'Docker', 'Kubernetes', 'Git', 'Jest'],
        methodologies: ['Agile', 'Scrum', 'CI/CD', 'DevOps'],
        languages: ['Español (Nativo)', 'Inglés (C1 Profesional)']
      },
      education: [
        {
          id: 'edu_1',
          degree: 'Ingeniería en Sistemas Computacionales',
          institution: 'Instituto Politécnico Nacional (IPN)',
          location: 'Ciudad de México, México',
          graduationYear: '2018',
          details: 'Especialización en Sistemas Distribuidos.'
        }
      ],
      certifications: [
        {
          id: 'cert_1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          year: '2023'
        }
      ]
    }
  }
];

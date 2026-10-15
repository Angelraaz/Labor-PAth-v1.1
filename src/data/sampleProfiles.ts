import { CVData, JobTarget } from '../types/ats';

export interface SampleBundle {
  id: string;
  name: string;
  roleTitle: string;
  description: string;
  jobTarget: JobTarget;
  cvData: CVData;
}

export const SAMPLE_PROFILES: SampleBundle[] = [
  {
    id: 'fullstack_lead',
    name: 'Tech Lead / Senior Full Stack Engineer',
    roleTitle: 'Senior Full Stack Engineer & Tech Lead',
    description: 'Perfil de ingeniería de software con arquitectura cloud, microservicios, React, Node.js y métricas de escala.',
    jobTarget: {
      title: 'Senior Full Stack Engineer',
      company: 'Fintech Global Solutions',
      rawDescription: `Buscamos un Senior Full Stack Engineer para liderar la evolución de nuestra plataforma financiera transaccional de alto tráfico.

Requisitos Principales:
- Más de 6 años de experiencia desarrollando aplicaciones web escalables con React, TypeScript y Node.js.
- Dominio profundo de arquitectura de microservicios, bases de datos PostgreSQL y MongoDB.
- Experiencia comprobada con entornos Cloud (AWS o GCP), Docker, Kubernetes y pipelines CI/CD.
- Sólida práctica en metodologías Agile/Scrum, testing automatizado (TDD, Jest, Cypress).
- Capacidad para liderar equipos técnicos, optimizar tiempos de respuesta y garantizar alta disponibilidad (99.99%).
- Deseable experiencia con Kafka, Redis y estándares de seguridad financiera.`,
      extractedEntities: {
        technicalSkills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'Microservicios', 'Docker', 'Kubernetes', 'CI/CD', 'TDD', 'Kafka', 'Redis'],
        toolsAndSoftware: ['AWS', 'GCP', 'Git', 'GitHub', 'Jest', 'Cypress', 'Docker', 'Kubernetes'],
        methodologies: ['Agile', 'Scrum', 'Microservicios', 'CI/CD', 'TDD', 'DevOps'],
        actionVerbs: ['Lideré', 'Arquitecté', 'Optimicé', 'Implementé', 'Reduje', 'Escalé', 'Automaticé'],
        softSkills: ['Liderazgo Técnico', 'Mentoría', 'Comunicación Asertiva', 'Resolución de Problemas'],
        certificationsAndEducation: ['Ingeniería en Sistemas / Computación', 'Certificación AWS Solutions Architect'],
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
        linkedin: 'linkedin.com/in/alejandro-morales-tech',
        portfolioOrGithub: 'github.com/amorales-lead'
      },
      summary: 'Senior Full Stack Engineer con 7+ años de trayectoria diseñando y desplegando sistemas distribuidos y plataformas web de alta disponibilidad. Especialista en React, TypeScript, Node.js y arquitecturas cloud en AWS. Historial comprobado de optimización de latencia en un 42% y liderazgo de squads ágiles multidisciplinarios orientados a métricas de negocio.',
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
            'Lideré un squad ágil de 8 ingenieros de software, acelerando el ciclo de entrega de despliegues en un 45% a través de pipelines de CI/CD automatizados en AWS y Docker.',
            'Automaticé la suite de pruebas unitarias y de integración con Jest y Cypress, elevando la cobertura de código del 55% al 92%.'
          ]
        },
        {
          id: 'exp_2',
          jobTitle: 'Full Stack Software Engineer',
          company: 'Nexus Software Studio',
          location: 'Guadalajara, México',
          startDate: '2019',
          endDate: '2022',
          current: false,
          bullets: [
            'Desarrollé paneles web interactivos de gestión de clientes con React, Redux y Node.js, aumentando la retención de usuarios activos en un 28% durante el primer semestre.',
            'Diseñé e integré 14 APIs RESTful seguras con PostgreSQL y MongoDB, reduciendo los tiempos de integración de socios comerciales de 3 semanas a solo 4 días.',
            'Optimicé el rendimiento frontend (Core Web Vitals) reduciendo el tiempo de carga inicial en un 40% mediante lazy loading y code splitting.'
          ]
        }
      ],
      skills: {
        technical: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'MongoDB', 'Microservicios', 'REST APIs', 'GraphQL', 'Redis', 'Kafka'],
        tools: ['AWS', 'Docker', 'Kubernetes', 'Git', 'GitHub Actions', 'Jest', 'Cypress', 'Linux'],
        methodologies: ['Agile', 'Scrum', 'CI/CD', 'TDD', 'DevOps', 'Arquitectura Limpia'],
        languages: ['Español (Nativo)', 'Inglés (C1 Profesional)']
      },
      education: [
        {
          id: 'edu_1',
          degree: 'Ingeniería en Sistemas Computacionales',
          institution: 'Instituto Politécnico Nacional (IPN)',
          location: 'Ciudad de México, México',
          graduationYear: '2018',
          details: 'Mención honorífica por proyecto de titulación en arquitecturas distribuidas.'
        }
      ],
      certifications: [
        {
          id: 'cert_1',
          name: 'AWS Certified Solutions Architect – Associate',
          issuer: 'Amazon Web Services',
          year: '2023'
        },
        {
          id: 'cert_2',
          name: 'Certified Scrum Master (CSM)',
          issuer: 'Scrum Alliance',
          year: '2022'
        }
      ]
    }
  },
  {
    id: 'product_manager',
    name: 'Senior Product Manager / Project Manager',
    roleTitle: 'Senior Product & Project Manager',
    description: 'Gestión estratégica de productos digitales, marcos Agile/Scrum, liderazgo de roadmaps y presupuestos.',
    jobTarget: {
      title: 'Senior Product Manager',
      company: 'Enterprise SaaS Innovations',
      rawDescription: `Estamos buscando un Senior Product Manager para liderar el ciclo de vida de nuestras soluciones B2B SaaS de análisis empresarial.

Responsabilidades y Requisitos:
- Más de 5 años gestionando productos digitales con metodologías Agile y marcos Scrum.
- Capacidad demostrada para construir y ejecutar Roadmaps de producto alineados a OKRs corporativos.
- Manejo de presupuestos de proyectos superiores a $1M USD y gestión estratégica de múltiples stakeholders.
- Análisis exhaustivo de métricas de producto, KPIs, retención, Churn, NPS y embudos de conversión.
- Dominio de herramientas de gestión como Jira, Confluence y plataformas analíticas (Tableau, Google Analytics).
- Fuertes habilidades de comunicación, liderazgo de equipos multidisciplinarios y orientación a resultados cuantificables.`,
      extractedEntities: {
        technicalSkills: ['Product Management', 'Roadmap', 'OKRs', 'KPIs', 'B2B SaaS', 'Embudos de Conversión', 'Análisis de Churn', 'Presupuesto'],
        toolsAndSoftware: ['Jira', 'Confluence', 'Tableau', 'Google Analytics', 'Figma', 'Excel'],
        methodologies: ['Agile', 'Scrum', 'Kanban', 'Design Thinking', 'Lean Startup'],
        actionVerbs: ['Lideré', 'Incrementé', 'Gestioné', 'Definí', 'Optimicé', 'Reduje', 'Coordiné'],
        softSkills: ['Gestión de Stakeholders', 'Negociación Estratégica', 'Liderazgo de Equipos', 'Pensamiento Crítico'],
        certificationsAndEducation: ['Licenciatura en Administración / Ingeniería', 'Certificación PMP o Scrum Product Owner'],
        seniorityLevel: 'Senior'
      }
    },
    cvData: {
      id: 'cv_product_manager',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Valeria Sotomayor Cruz',
        professionalTitle: 'Senior Product & Project Manager',
        email: 'valeria.sotomayor.pm@email.com',
        phone: '+52 55 9876 5432',
        location: 'Monterrey, Nuevo León, México',
        linkedin: 'linkedin.com/in/valeria-sotomayor-pm',
        portfolioOrGithub: 'valeriasotomayor.portfolio.site'
      },
      summary: 'Senior Product Manager con más de 6 años de experiencia impulsando el crecimiento de productos B2B SaaS de alto impacto. Experta en definición de Roadmaps estratégicos, alineación de OKRs y metodologías Agile/Scrum. Historial probado de incremento del 34% en el ARR y optimización de retención de clientes gestionando presupuestos superiores a $1.5M USD.',
      experience: [
        {
          id: 'exp_pm_1',
          jobTitle: 'Senior Product Manager',
          company: 'OmniCloud Technologies',
          location: 'Monterrey, México',
          startDate: '2021',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Lideré el roadmap y ciclo de vida de la suite B2B SaaS, logrando un incremento del 38% en los ingresos recurrentes anuales (ARR) en 18 meses.',
            'Gestioné un presupuesto de producto de $1.4M USD y coordiné a 3 equipos multidisciplinarios (18 ingenieros, diseñadores y analistas de datos).',
            'Reduje la tasa de abandono (Churn) del 4.2% al 1.9% implementando un sistema predictivo de onboarding de clientes guiado por KPIs en Jira y Tableau.',
            'Alineé los OKRs estratégicos con la alta dirección y stakeholders clave, superando las metas de adopción en un 125% anual.'
          ]
        },
        {
          id: 'exp_pm_2',
          jobTitle: 'Product Owner & Project Manager',
          company: 'Nova Digital Solutions',
          location: 'San Pedro, México',
          startDate: '2018',
          endDate: '2021',
          current: false,
          bullets: [
            'Definí historias de usuario y backlog de producto en Jira para 4 lanzamientos consecutivos, entregando el 100% de las funcionalidades dentro del plazo y presupuesto.',
            'Incrementé el Net Promoter Score (NPS) de 42 a 68 puntos mediante iteraciones quincenales basadas en retroalimentación directa de clientes.',
            'Optimicé la velocidad del equipo de desarrollo en un 30% implementando ceremonias Scrum estandarizadas y gestión visual en Kanban.'
          ]
        }
      ],
      skills: {
        technical: ['Product Management', 'Roadmap Estratégico', 'OKRs', 'KPIs', 'Métricas SaaS', 'ARR & Churn', 'Pruebas A/B'],
        tools: ['Jira', 'Confluence', 'Tableau', 'Google Analytics', 'Figma', 'Slack', 'Excel Avanzado'],
        methodologies: ['Agile', 'Scrum', 'Kanban', 'Design Thinking', 'Lean Startup'],
        languages: ['Español (Nativo)', 'Inglés (C2 Bilingüe)']
      },
      education: [
        {
          id: 'edu_pm_1',
          degree: 'Licenciatura en Administración de Empresas y Tecnologías',
          institution: 'Tecnológico de Monterrey (ITESM)',
          location: 'Monterrey, México',
          graduationYear: '2017',
          details: 'Especialidad en Innovación Tecnológica y Gestión de Proyectos.'
        }
      ],
      certifications: [
        {
          id: 'cert_pm_1',
          name: 'Professional Scrum Product Owner (PSPO II)',
          issuer: 'Scrum.org',
          year: '2022'
        },
        {
          id: 'cert_pm_2',
          name: 'Project Management Professional (PMP)',
          issuer: 'Project Management Institute (PMI)',
          year: '2021'
        }
      ]
    }
  },
  {
    id: 'data_analyst',
    name: 'Data & Business Intelligence Analyst',
    roleTitle: 'Senior Data & BI Analyst',
    description: 'Modelado de datos, SQL, Python, Power BI, Tableau y generación de dashboards predictivos.',
    jobTarget: {
      title: 'Senior Data & BI Analyst',
      company: 'Global Retail Intelligence',
      rawDescription: `Buscamos un Senior Data Analyst con sólida experiencia en Business Intelligence para transformar datos complejos en decisiones de negocio de alto impacto.

Requisitos Clave:
- Mínimo 4 años de experiencia en análisis de datos, modelado relacional y queries complejas en SQL (PostgreSQL, BigQuery, Snowflake).
- Dominio avanzado de Python (Pandas, NumPy) para manipulación de datasets y automatización ETL.
- Creación de dashboards ejecutivos en Power BI o Tableau con modelos semánticos robustos.
- Experiencia en optimización de inventarios, pronósticos de demanda y análisis de rentabilidad.
- Fuertes habilidades analíticas y capacidad para presentar hallazgos a comités directivos.`,
      extractedEntities: {
        technicalSkills: ['SQL', 'Python', 'Pandas', 'NumPy', 'ETL', 'Modelado de Datos', 'BigQuery', 'Snowflake', 'PostgreSQL', 'Pronósticos de Demanda'],
        toolsAndSoftware: ['Power BI', 'Tableau', 'Excel Avanzado', 'Git', 'BigQuery', 'Snowflake'],
        methodologies: ['Business Intelligence', 'ETL Pipelines', 'Data Governance', 'Agile Data'],
        actionVerbs: ['Analicé', 'Desarrollé', 'Automaticé', 'Optimicé', 'Diseñé', 'Generé', 'Identifiqué'],
        softSkills: ['Pensamiento Analítico', 'Presentación Ejecutiva', 'Storytelling con Datos'],
        certificationsAndEducation: ['Licenciatura en Actuaría / Matemáticas / Datos', 'Microsoft Certified Data Analyst'],
        seniorityLevel: 'Senior'
      }
    },
    cvData: {
      id: 'cv_data_analyst',
      lastUpdated: new Date().toISOString(),
      contactInfo: {
        fullName: 'Carlos Eduardo Ramírez Ruiz',
        professionalTitle: 'Senior Data & Business Intelligence Analyst',
        email: 'carlos.ramirez.data@email.com',
        phone: '+52 55 3344 5566',
        location: 'Querétaro, México (Remoto)',
        linkedin: 'linkedin.com/in/carlos-ramirez-data',
        portfolioOrGithub: 'github.com/carlosdata-bi'
      },
      summary: 'Senior Data & BI Analyst con 5+ años de experiencia construyendo soluciones analíticas end-to-end, pipelines ETL y tableros predictivos. Experto en SQL, Python (Pandas), BigQuery y Power BI. Historial comprobado de automatización de reportes generando un ahorro de 18 horas semanales y detección de eficiencias operativas por $450K USD.',
      experience: [
        {
          id: 'exp_data_1',
          jobTitle: 'Senior Business Intelligence Analyst',
          company: 'Retail Analytics Corp',
          location: 'Querétaro, México',
          startDate: '2021',
          endDate: 'Presente',
          current: true,
          bullets: [
            'Diseñé y desarrollé 12 tableros ejecutivos en Power BI y BigQuery consumidos por más de 120 líderes de negocio, acelerando la toma de decisiones en un 60%.',
            'Automaticé pipelines de extracción y transformación de datos (ETL) con Python y SQL, eliminando 18 horas semanales de procesamiento manual repetitivo.',
            'Identifiqué patrones de merma y sobreinventario en la cadena de suministro, generando un ahorro operativo cuantificado en $450K USD anuales.',
            'Optimicé queries analíticas complejas en Snowflake reduciendo el costo de cómputo en un 32% y el tiempo de ejecución de 45 a 8 minutos.'
          ]
        },
        {
          id: 'exp_data_2',
          jobTitle: 'Data Analyst Jr. / Mid',
          company: 'DataInsights Consulting',
          location: 'Ciudad de México',
          startDate: '2019',
          endDate: '2021',
          current: false,
          bullets: [
            'Construí modelos de regresión y segmentación de clientes en Python (Pandas, Scikit-learn), incrementando la conversión de campañas comerciales en un 22%.',
            'Gestioné la calidad y gobernanza de bases de datos relacionales en PostgreSQL con más de 8 millones de registros limpios y validados.'
          ]
        }
      ],
      skills: {
        technical: ['SQL Avanzado', 'Python', 'Pandas', 'NumPy', 'Modelado Relacional', 'ETL', 'BigQuery', 'Snowflake', 'PostgreSQL'],
        tools: ['Power BI', 'Tableau', 'Excel DAX', 'Git', 'Jupyter Notebooks'],
        methodologies: ['Business Intelligence', 'Gobernanza de Datos', 'Data Warehousing'],
        languages: ['Español (Nativo)', 'Inglés (B2 Intermedio Avanzado)']
      },
      education: [
        {
          id: 'edu_data_1',
          degree: 'Licenciatura en Actuaría y Ciencia de Datos',
          institution: 'Universidad Nacional Autónoma de México (UNAM)',
          location: 'Ciudad de México',
          graduationYear: '2018',
          details: 'Especialización en Métodos Estadísticos y Modelos Predictivos.'
        }
      ],
      certifications: [
        {
          id: 'cert_data_1',
          name: 'Microsoft Certified: Power BI Data Analyst Associate (PL-300)',
          issuer: 'Microsoft',
          year: '2023'
        }
      ]
    }
  }
];

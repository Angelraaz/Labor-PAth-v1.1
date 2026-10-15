import { CVData, JobTarget, ATSAnalysisResult, KeywordMatch, MissingKeyword, DetectedMetric, StructuralViolation, ExtractedEntities } from '../types/ats';

// Comprehensive dictionary of high-impact action verbs (ES & EN)
export const POWER_ACTION_VERBS = [
  // Spanish
  'diseñé', 'implementé', 'lideré', 'desarrollé', 'optimicé', 'reduje', 'incrementé', 'aumenté',
  'gestioné', 'coordiné', 'arquitecté', 'automaticé', 'escalé', 'transformé', 'reestructuré',
  'negocié', 'ejecuté', 'generé', 'supervisé', 'consolidé', 'analicé', 'resolví', 'capacité',
  'establecí', 'alcancé', 'superé', 'disminuí', 'ahorré', 'integré', 'administré', 'creé',
  'diseñar', 'implementar', 'liderar', 'desarrollar', 'optimizar', 'reducir', 'incrementar',
  // English
  'spearheaded', 'engineered', 'architected', 'orchestrated', 'implemented', 'designed',
  'optimized', 'accelerated', 'scaled', 'reduced', 'increased', 'developed', 'delivered',
  'automated', 'transformed', 'negotiated', 'streamlined', 'generated', 'managed', 'launched',
  'mentored', 'executed', 'built', 'resolved', 'championed', 'drove', 'saved', 'achieved'
];

// Common technical and functional skill keywords across industries
export const COMMON_SKILLS_DICTIONARY = [
  // Tech & Software
  'javascript', 'typescript', 'react', 'next.js', 'node.js', 'python', 'java', 'c#', '.net', 'sql',
  'postgresql', 'mongodb', 'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'ci/cd', 'git', 'github',
  'rest api', 'graphql', 'microservicios', 'microservices', 'html', 'css', 'tailwind', 'redux',
  'express', 'linux', 'testing', 'jest', 'cypress', 'tdd', 'nosql', 'redis', 'devops', 'kafka',
  // Management & Methodologies
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'okrs', 'kpis', 'roadmap', 'pmp', 'prince2',
  'presupuesto', 'budget', 'stakeholders', 'liderazgo', 'leadership', 'scrum master', 'product management',
  // Data & Analytics
  'excel', 'power bi', 'tableau', 'etl', 'pandas', 'numpy', 'machine learning', 'data analysis',
  'análisis de datos', 'business intelligence', 'big data', 'snowflake', 'spark', 'r', 'data modeling',
  // Marketing & Sales
  'seo', 'sem', 'google analytics', 'crm', 'salesforce', 'hubspot', 'inbound marketing', 'roi',
  'conversion rate', 'tasa de conversión', 'cac', 'ltv', 'growth hacking', 'email marketing',
  // Finance & Operations
  'finanzas', 'estados financieros', 'sap', 'auditoría', 'pronósticos', 'cash flow', 'contabilidad',
  'compliance', 'gestión de riesgos', 'erp', 'cadena de suministro', 'supply chain'
];

/**
 * Fallback / Client-side extraction of entities from raw job description
 */
export function extractJobEntitiesLocally(text: string): ExtractedEntities {
  if (!text) {
    return {
      technicalSkills: [],
      toolsAndSoftware: [],
      methodologies: [],
      actionVerbs: [],
      softSkills: [],
      certificationsAndEducation: [],
      seniorityLevel: 'Mid-Senior'
    };
  }

  const lower = text.toLowerCase();
  const matchedSkills: string[] = [];

  COMMON_SKILLS_DICTIONARY.forEach((skill) => {
    // Regex word boundary matching
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(lower)) {
      matchedSkills.push(skill);
    }
  });

  // Extract common action verbs
  const matchedVerbs: string[] = [];
  POWER_ACTION_VERBS.forEach((verb) => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(lower) && !matchedVerbs.includes(verb)) {
      matchedVerbs.push(verb);
    }
  });

  // Distribute matched skills into logical buckets
  const tools = matchedSkills.filter(s =>
    ['docker', 'kubernetes', 'aws', 'gcp', 'azure', 'git', 'jira', 'confluence', 'excel', 'power bi', 'tableau', 'sap', 'salesforce', 'hubspot', 'snowflake'].includes(s)
  );

  const methodologies = matchedSkills.filter(s =>
    ['agile', 'scrum', 'kanban', 'ci/cd', 'tdd', 'okrs', 'kpis', 'roadmap', 'pmp', 'devops', 'microservicios', 'microservices'].includes(s)
  );

  const technical = matchedSkills.filter(s => !tools.includes(s) && !methodologies.includes(s));

  // Determine seniority
  let seniority = 'Mid-Senior';
  if (/junior|trainee|entry|inicial/i.test(lower)) seniority = 'Junior';
  else if (/lead|principal|staff|director|gerente|head/i.test(lower)) seniority = 'Lead / Director';
  else if (/senior|sr\.|avanzado/i.test(lower)) seniority = 'Senior';

  return {
    technicalSkills: technical.slice(0, 15),
    toolsAndSoftware: tools.slice(0, 10),
    methodologies: methodologies.slice(0, 8),
    actionVerbs: matchedVerbs.slice(0, 8),
    softSkills: ['Comunicación Asertiva', 'Liderazgo de Equipos', 'Resolución de Problemas', 'Gestión de Stakeholders'],
    certificationsAndEducation: ['Licenciatura / Ingeniería', 'Certificaciones en el área'],
    seniorityLevel: seniority
  };
}

/**
 * Metric extraction regexes for quantified accomplishments
 */
const METRIC_PATTERNS = [
  /\b\d+(\.\d+)?%\b/g, // 30%, 4.5%
  /\$\s*\d+([,\.]\d+)?\s*(k|m|b|mil|millones)?\b/gi, // $150k, $2.5M
  /\b\d+(\.\d+)?\s*(k|m|b|mil|millones)\b/gi, // 500k, 2 millones
  /\b\d+\s*x\b/gi, // 2x, 5x
  /\b\d+\+?\s*(usuarios|users|clientes|clients|transacciones|transactions|proyectos|projects|desarrolladores|developers|ingenieros|engineers|horas|hours|días|days|leads)\b/gi
];

export function detectMetricsInText(text: string): DetectedMetric[] {
  const metrics: DetectedMetric[] = [];
  if (!text) return metrics;

  METRIC_PATTERNS.forEach((pattern) => {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const matchText = match[0];
      const index = match.index;
      // Extract small context around match
      const start = Math.max(0, index - 20);
      const end = Math.min(text.length, index + matchText.length + 20);
      const context = text.substring(start, end).trim();

      let type: DetectedMetric['type'] = 'numeric';
      if (matchText.includes('%')) type = 'percentage';
      else if (matchText.includes('$')) type = 'currency';
      else if (/x$/i.test(matchText)) type = 'multiplier';

      // Avoid duplicates
      if (!metrics.some(m => m.text.toLowerCase() === matchText.toLowerCase())) {
        metrics.push({
          text: matchText,
          context: `...${context}...`,
          type
        });
      }
    }
  });

  return metrics;
}

/**
 * Checks if a bullet point starts with a recognized power action verb
 */
export function checkBulletStartsActionVerb(bullet: string): { startsWithVerb: boolean; verb?: string } {
  const trimmed = bullet.trim();
  const firstWordMatch = trimmed.match(/^[a-záéíóúñ]+/i);
  if (!firstWordMatch) return { startsWithVerb: false };

  const firstWord = firstWordMatch[0].toLowerCase();
  const found = POWER_ACTION_VERBS.find(v => v.toLowerCase() === firstWord);

  return {
    startsWithVerb: !!found,
    verb: found
  };
}

/**
 * Main ATS Scoring and Audit Engine
 */
export function calculateATSScore(cv: CVData, target: JobTarget): ATSAnalysisResult {
  // Aggregate CV text by sections for contextual keyword weighting
  const summaryText = (cv.summary || '').toLowerCase();

  const experienceBullets = cv.experience.flatMap(e => e.bullets || []);
  const experienceText = (
    cv.experience.map(e => `${e.jobTitle} ${e.company} ${e.bullets.join(' ')}`).join(' ')
  ).toLowerCase();

  const skillsText = [
    ...(cv.skills.technical || []),
    ...(cv.skills.tools || []),
    ...(cv.skills.methodologies || []),
    ...(cv.skills.languages || [])
  ].join(' ').toLowerCase();

  const educationText = cv.education.map(ed => `${ed.degree} ${ed.institution} ${ed.details || ''}`).join(' ').toLowerCase();
  const certText = cv.certifications.map(c => `${c.name} ${c.issuer}`).join(' ').toLowerCase();

  const fullCVText = `${summaryText} ${experienceText} ${skillsText} ${educationText} ${certText}`;

  // Word count & bullet metrics
  const words = fullCVText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;
  const bulletCount = experienceBullets.length;

  // 1. KEYWORD ANALYSIS
  const allTargetKeywords = Array.from(new Set([
    ...(target.extractedEntities.technicalSkills || []),
    ...(target.extractedEntities.toolsAndSoftware || []),
    ...(target.extractedEntities.methodologies || []),
    ...(target.extractedEntities.softSkills || [])
  ])).filter(k => k && k.trim().length > 1);

  const matchedKeywords: KeywordMatch[] = [];
  const missingKeywords: MissingKeyword[] = [];

  let weightedKeywordPoints = 0;
  const totalTargetKeywords = Math.max(1, allTargetKeywords.length);

  allTargetKeywords.forEach((kw) => {
    const cleanKw = kw.trim();
    const escaped = cleanKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi');

    const inSummary = regex.test(summaryText);
    const inExp = regex.test(experienceText);
    const inSkills = regex.test(skillsText);

    const matches = fullCVText.match(regex);
    const freq = matches ? matches.length : 0;

    const category: KeywordMatch['category'] =
      target.extractedEntities.toolsAndSoftware?.includes(cleanKw) ? 'tools' :
      target.extractedEntities.methodologies?.includes(cleanKw) ? 'methodology' :
      target.extractedEntities.softSkills?.includes(cleanKw) ? 'soft' : 'technical';

    if (freq > 0) {
      const foundIn: Array<'summary' | 'experience' | 'skills'> = [];
      if (inSummary) foundIn.push('summary');
      if (inExp) foundIn.push('experience');
      if (inSkills) foundIn.push('skills');

      matchedKeywords.push({
        word: cleanKw,
        category,
        frequencyInCV: freq,
        foundIn
      });

      // Experience carries 1.5x weight in enterprise ATS algorithms
      const weight = inExp ? 1.5 : (inSummary && inSkills ? 1.2 : 1.0);
      weightedKeywordPoints += weight;
    } else {
      missingKeywords.push({
        word: cleanKw,
        category,
        importance: category === 'technical' || category === 'tools' ? 'high' : 'medium'
      });
    }
  });

  // Calculate Keyword Match Score (0 - 100)
  const rawKeywordScore = Math.min(100, Math.round((weightedKeywordPoints / (totalTargetKeywords * 1.2)) * 100));
  const keywordMatchScore = Math.max(15, rawKeywordScore); // minimum baseline if profile has data

  // 2. QUANTIFIABLE METRICS (25%)
  const allDetectedMetrics: DetectedMetric[] = [];
  let bulletsWithMetrics = 0;

  experienceBullets.forEach(bullet => {
    const metricsInBullet = detectMetricsInText(bullet);
    if (metricsInBullet.length > 0) {
      bulletsWithMetrics++;
      allDetectedMetrics.push(...metricsInBullet);
    }
  });

  const bulletMetricsRatio = bulletCount > 0 ? (bulletsWithMetrics / bulletCount) : 0;
  // Ideal ratio: at least 70% of bullets contain quantified metrics
  const quantifiableScore = Math.min(100, Math.round((bulletMetricsRatio / 0.70) * 100));

  // 3. ACTION VERBS SCORE (15%)
  let bulletsStartingWithVerb = 0;
  const detectedActionVerbs: string[] = [];

  experienceBullets.forEach(bullet => {
    const check = checkBulletStartsActionVerb(bullet);
    if (check.startsWithVerb) {
      bulletsStartingWithVerb++;
      if (check.verb && !detectedActionVerbs.includes(check.verb)) {
        detectedActionVerbs.push(check.verb);
      }
    }
  });

  const verbRatio = bulletCount > 0 ? (bulletsStartingWithVerb / bulletCount) : 0;
  // Ideal: at least 75% of bullets start with a strong action verb
  const actionVerbScore = Math.min(100, Math.round((verbRatio / 0.75) * 100));

  // 4. STRUCTURAL & ATS COMPLIANCE (20%)
  const violations: StructuralViolation[] = [];

  // Check Contact Info completeness
  const contact = cv.contactInfo;
  const hasContactInfo = Boolean(contact.fullName && contact.email && contact.phone && contact.location);
  violations.push({
    id: 'contact_completeness',
    level: hasContactInfo ? 'info' : 'critical',
    title: 'Datos de Contacto Esenciales',
    description: hasContactInfo
      ? 'Nombre, correo, teléfono y ubicación correctamente estructurados.'
      : 'Faltan campos críticos en los datos de contacto (Email, Teléfono o Ubicación).',
    solution: 'Completa todos los campos de contacto en la primera sección.',
    isCompliant: hasContactInfo
  });

  // Check Single Column & Linear ATS Layout
  violations.push({
    id: 'single_column_format',
    level: 'info',
    title: 'Estructura Lineal de Columna Única (ATS-Proof)',
    description: 'El diseño del documento es 100% lineal sin tablas anidadas, columnas múltiples ni gráficos ilegibles.',
    solution: 'Mantén la estructura lineal garantizada por Labor Path.',
    isCompliant: true
  });

  // Check Summary length
  const summaryWords = cv.summary ? cv.summary.trim().split(/\s+/).length : 0;
  const isSummaryIdeal = summaryWords >= 35 && summaryWords <= 95;
  violations.push({
    id: 'summary_length',
    level: isSummaryIdeal ? 'info' : 'warning',
    title: 'Longitud del Resumen Ejecutivo',
    description: isSummaryIdeal
      ? `Resumen conciso y de alto impacto (${summaryWords} palabras, rango ideal: 35-90).`
      : `El resumen actual tiene ${summaryWords} palabras. Un resumen ATS óptimo tiene entre 35 y 90 palabras concisas.`,
    solution: 'Usa el botón de optimización con IA para generar un resumen ejecutivo calibrado.',
    isCompliant: isSummaryIdeal
  });

  // Check Experience bullets count
  const hasAdequateBullets = cv.experience.length > 0 && cv.experience.every(e => e.bullets && e.bullets.length >= 2);
  violations.push({
    id: 'bullet_density',
    level: hasAdequateBullets ? 'info' : 'warning',
    title: 'Densidad de Logros por Puesto',
    description: hasAdequateBullets
      ? 'Cada experiencia laboral cuenta con al menos 2 viñetas orientadas a resultados.'
      : 'Hay puestos con menos de 2 logros descritos o viñetas vacías.',
    solution: 'Añade entre 3 y 5 viñetas descriptivas por puesto relevante.',
    isCompliant: hasAdequateBullets
  });

  // Check Quantifiable metrics presence
  const hasEnoughMetrics = bulletMetricsRatio >= 0.5;
  violations.push({
    id: 'metrics_presence',
    level: hasEnoughMetrics ? 'info' : 'warning',
    title: 'Evidencia Cuantitativa (KPIs, %, $)',
    description: hasEnoughMetrics
      ? `${Math.round(bulletMetricsRatio * 100)}% de tus viñetas incluyen números medibles.`
      : 'Menos del 50% de tus viñetas incluyen datos numéricos (%, dólares, usuarios, tiempo).',
    solution: 'Aplica la fórmula Google XYZ: [Logré X, medido con Y, mediante Z].',
    isCompliant: hasEnoughMetrics
  });

  // Check Skills count
  const totalSkillsCount = (cv.skills.technical?.length || 0) + (cv.skills.tools?.length || 0) + (cv.skills.methodologies?.length || 0);
  const hasAdequateSkills = totalSkillsCount >= 6 && totalSkillsCount <= 25;
  violations.push({
    id: 'skills_count',
    level: hasAdequateSkills ? 'info' : 'warning',
    title: 'Sección de Habilidades Clave',
    description: hasAdequateSkills
      ? `Tienes ${totalSkillsCount} habilidades categorizadas.`
      : `Tienes ${totalSkillsCount} habilidades. Lo ideal para filtros ATS son entre 8 y 20 habilidades específicas.`,
    solution: 'Agrega las palabras clave faltantes sugeridas por el motor ATS.',
    isCompliant: hasAdequateSkills
  });

  const compliantCount = violations.filter(v => v.isCompliant).length;
  const structuralScore = Math.round((compliantCount / violations.length) * 100);

  // 5. OVERALL COMPOSITE ATS SCORE (0 - 100)
  // Weights: Keyword 40%, Metrics 25%, Verbs 15%, Structure 20%
  const compositeScore = Math.round(
    (keywordMatchScore * 0.40) +
    (quantifiableScore * 0.25) +
    (actionVerbScore * 0.15) +
    (structuralScore * 0.20)
  );

  const overallScore = Math.max(0, Math.min(100, compositeScore));

  // 6. ACTIONABLE RECOMMENDATIONS
  const recommendations: string[] = [];

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 3).map(m => `"${m.word}"`).join(', ');
    recommendations.push(`Incorpora las palabras clave prioritarias de la vacante: ${topMissing} en tus logros laborales.`);
  }

  if (bulletMetricsRatio < 0.6) {
    recommendations.push('Aumenta el impacto cuantificable: incluye porcentajes de mejora, volúmenes de proyectos o ahorros en tus logros.');
  }

  if (actionVerbScore < 70) {
    recommendations.push('Comienza cada viñeta con un verbo de acción en pasado fuerte (ej: Lideré, Implementé, Optimicé, Reduje).');
  }

  if (!isSummaryIdeal) {
    recommendations.push('Ajusta tu resumen ejecutivo a un párrafo conciso de entre 50 y 80 palabras enfocado en la propuesta de valor.');
  }

  if (recommendations.length === 0) {
    recommendations.push('¡Excelente perfil! Tu currículum cumple con los estándares más rigurosos de los ATS empresariales.');
  }

  return {
    overallScore,
    breakdown: {
      keywordMatch: keywordMatchScore,
      quantifiableMetrics: quantifiableScore,
      actionVerbs: actionVerbScore,
      structuralCompliance: structuralScore
    },
    matchedKeywords,
    missingKeywords,
    detectedMetrics: allDetectedMetrics,
    detectedActionVerbs,
    violations,
    recommendations,
    wordCount,
    bulletCount,
    bulletMetricsRatio
  };
}

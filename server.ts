import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Shared Gemini client setup using recommended pattern
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Master Senior HR & ATS Optimization System Prompt
const SENIOR_HR_SYSTEM_INSTRUCTION = `Eres un Experto Senior en Recursos Humanos, Reclutamiento Ejecutivo y Optimización de Algoritmos ATS (Applicant Tracking Systems como Workday, Taleo, Greenhouse, iCIMS, Lever).

DIRECTIVAS DEL SISTEMA Y REGLAS ESTRICTAS DE REDACCIÓN:
1. PROHIBICIÓN ESTRICTA DE CLICHÉS GENÉRICOS:
   Queda terminantemente prohibido utilizar o tolerar clichés vacíos y adjetivos subjetivos sin sustento, tales como:
   "apasionado", "proactivo", "trabajador en equipo dinámico", "orientado a resultados", "altamente motivado", "capacidad de adaptación", "pensamiento fuera de la caja", "entusiasta", "responsable", "comprometido".
   Ningún reclutador senior ni algoritmo ATS valora adjetivos subjetivos; todo debe demostrarse mediante hechos y métricas.

2. MÉTODO GOOGLE XYZ (LOGROS CUANTIFICABLES OBLIGATORIOS):
   Toda sugerencia de redacción de experiencia y viñetas DEBE estructurarse de manera obligatoria bajo la fórmula de logros cuantificables XYZ de Google:
   "Logré [X], medido a través de [Y] (métrica porcentual %, monetaria $, reducción de tiempos o volumen cuantificable), mediante [Z] (acción técnica concreta, herramienta o proceso específico)."

3. VERBOS DE ACCIÓN FUERTES:
   Todas las oraciones y viñetas deben comenzar con un verbo de acción fuerte, contundente y decisivo en tiempo pasado (pretérito perfecto simple en primera persona o pretérito ejecutivo: p. ej., "Optimicé", "Implementé", "Confeccioné", "Diagnosticó", "Audité", "Negocié", "Reduje", "Facturé", "Supervisé", "Reorganicé", "Instalé", "Coordiné").
   Prohíbe estrictamente frases pasivas o débiles como "encargado de", "responsable de", "hice", "apoyo en".

4. JERGA TÉCNICA EXACTA DEL PUESTO U OFICIO OBJETIVO:
   Utiliza de forma obligatoria la jerga técnica, herramientas, maquinaria, software, normativas de calidad y metodologías operativas exactas que correspondan al puesto, oficio o profesión objetivo introducido por el usuario (sea mecánica automotriz, soldadura, confección textil, auxiliar administrativo, enfermería clínica, operaciones logísticas, etc.).
   Nunca asumas informática o desarrollo de software a menos que el usuario indique explícitamente una vacante de TI/programación.`;

// API Routes for ATS & AI Intelligence
app.post('/api/ai/extract-job-entities', async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(400).json({ error: 'jobDescription is required' });
      return;
    }

    const prompt = `Actúa como Director Senior de Recursos Humanos y Arquitecto de Algoritmos ATS.
Analiza esta oferta laboral para la posición u oficio "${jobTitle || 'Puesto Objetivo'}".

REGLAS DE FILTRADO TÉCNICO:
1. Adapta el análisis estrictamente al oficio, sector o profesión indicada (automotriz, textil, administrativo, salud, comercio, manufactura, etc.).
2. PROHIBIDO extraer o incluir clichés genéricos vacíos ("proactivo", "apasionado", "trabajo en equipo dinámico").
3. Extrae la jerga técnica exacta, maquinaria, herramientas operativas y verbos de acción fuertes del sector.

Oferta laboral:
"""${jobDescription.slice(0, 4000)}"""

Extrae en formato JSON estricto:
{
  "technicalSkills": ["competencia técnica específica del oficio 1", "..."],
  "toolsAndSoftware": ["maquinaria, instrumental, equipo físico o software exacto del oficio", "..."],
  "methodologies": ["normativas, estándares de calidad o protocolos operativos (e.g. 5S, NOM, ISO, bioseguridad, conciliaciones)", "..."],
  "actionVerbs": ["verbos de acción fuertes del sector (e.g. Diagnosticar, Confeccionar, Auditar, Negociar)", "..."],
  "softSkills": ["cualidades operativas concretas (e.g. puntualidad en entregas, atención a detalles técnicos)", "..."],
  "certificationsAndEducation": ["licencias de oficio, diplomas técnicos o grados requeridos", "..."],
  "seniorityLevel": "Operativo / Técnico / Mid / Senior / Jefe de Área"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/extract-job-entities:', error);
    res.status(500).json({ error: error.message || 'Error parsing job description' });
  }
});

app.post('/api/ai/optimize-bullet', async (req: Request, res: Response) => {
  try {
    const { rawBullet, targetJob, keywordsToIncorporate, language = 'es' } = req.body;
    if (!rawBullet) {
      res.status(400).json({ error: 'rawBullet is required' });
      return;
    }

    const prompt = `Actúa como Director Senior de Recursos Humanos y Experto en Optimización ATS.
Reescribe esta viñeta de experiencia laboral para el puesto u oficio "${targetJob || 'Puesto Profesional'}".

DIRECTIVAS OBLIGATORIAS:
1. PROHIBICIÓN ESTRICTA DE CLICHÉS GENÉRICOS: Prohibido incluir palabras como "apasionado", "proactivo", "trabajador en equipo dinámico", "responsable", "motivado".
2. MÉTODO XYZ DE GOOGLE: Redacta obligatoriamente con la estructura "Logré [X], medido a través de [Y] (con métricas cuantificables %, $, tiempo o volumen), mediante [Z] (técnica, herramienta o procedimiento)".
3. VERBOS DE ACCIÓN FUERTES: Inicia obligatoriamente con un verbo de acción fuerte y contundente en tiempo pasado (e.g., Confeccioné, Reparé, Diagnosticó, Facturé, Concilié, Negocié, Optimicé, Reduje, Incrementé, Coordiné). Prohibido "encargado de" o "hice".
4. JERGA TÉCNICA EXACTA DEL OFICIO: Usa exclusivamente el vocabulario técnico, instrumental y métricas reales del oficio de "${targetJob}". No uses términos de programación o nube a menos que el puesto sea estrictamente de desarrollo de software.

Palabras clave a incorporar naturalmente: ${keywordsToIncorporate ? JSON.stringify(keywordsToIncorporate) : 'Ninguna'}
Viñeta original: "${rawBullet}"
Idioma objetivo: ${language === 'en' ? 'English' : 'Spanish'}

Genera 3 variaciones basadas en logros cuantificables:
- variation1: "Métricas y Rendimiento Operativo" (Enfoque en números, reducción de merma/tiempo o volumen)
- variation2: "Responsabilidad y Control de Calidad" (Enfoque en normas, supervisión y estándares del sector)
- variation3: "Técnica y Estándares del Oficio" (Enfoque en herramientas especializadas, instrumental y procedimientos)

Retorna ÚNICAMENTE un JSON válido:
{
  "recommended": "la mejor versión optimizada con fórmula XYZ, verbo fuerte y jerga técnica",
  "variations": [
    { "type": "Métricas y Rendimiento Operativo", "text": "..." },
    { "type": "Responsabilidad y Control de Calidad", "text": "..." },
    { "type": "Técnica y Estándares del Oficio", "text": "..." }
  ],
  "metricsIncluded": ["e.g. 28%", "e.g. 150 piezas/turno"],
  "actionVerb": "e.g. Diagnosticó"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/optimize-bullet:', error);
    res.status(500).json({ error: error.message || 'Error optimizing bullet point' });
  }
});

app.post('/api/ai/generate-summary', async (req: Request, res: Response) => {
  try {
    const { currentSummary, targetJob, topSkills, yearsOfExperience, language = 'es' } = req.body;

    const prompt = `Actúa como Director Senior de Recursos Humanos y Especialista de Alto Nivel en Motores ATS.
Crea o perfecciona un Resumen Profesional Ejecutivo (3 a 4 oraciones) para el puesto u oficio "${targetJob}".

DIRECTIVAS OBLIGATORIAS:
1. PROHIBICIÓN ESTRICTA DE CLICHÉS GENÉRICOS: Prohibido estrictamente usar "apasionado", "proactivo", "trabajador en equipo dinámico", "orientado a resultados", "altamente motivado", "pensamiento fuera de la caja".
2. LOGROS CUANTIFICABLES (MÉTODO XYZ): Incluye logros medibles verificables con porcentajes (%), reducciones de tiempo o volumen de operación.
3. JERGA TÉCNICA EXACTA DEL PUESTO U OFICIO: Usa la terminología técnica, herramientas, maquinaria o software propios de "${targetJob}".
4. VERBOS DE ACCIÓN FUERTES: Usa verbos de impacto que denoten dominio profesional y liderazgo técnico.
5. LONGITUD: 3 a 4 oraciones directas (50-80 palabras). Formato lineal de párrafo único.

Borrador actual: "${currentSummary || 'Sin borrador'}"
Habilidades técnicas clave: ${topSkills ? topSkills.join(', ') : 'Competencias del sector'}
Años de experiencia: ${yearsOfExperience || '5+'}
Idioma: ${language === 'en' ? 'English' : 'Spanish'}

Retorna ÚNICAMENTE JSON:
{
  "summary": "Párrafo profesional optimizado sin clichés, con logros cuantificables y jerga técnica exacta...",
  "highlightedKeywords": ["palabraClave1", "palabraClave2"],
  "wordCount": 65
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/generate-summary:', error);
    res.status(500).json({ error: error.message || 'Error generating summary' });
  }
});

app.post('/api/ai/deep-ats-audit', async (req: Request, res: Response) => {
  try {
    const { cvData, jobTarget } = req.body;

    const prompt = `Actúa como Director Senior de Recursos Humanos y Auditor Principal de Algoritmos ATS (Workday, Taleo, Greenhouse).
Realiza una auditoría exhaustiva técnica y cualitativa de este currículum contra el puesto objetivo "${jobTarget?.title || 'Puesto Objetivo'}".

CRITERIOS DE AUDITORÍA:
1. Detección y penalización de clichés genéricos ("apasionado", "proactivo", "trabajador en equipo dinámico").
2. Cumplimiento de la fórmula de logros cuantificables XYZ de Google (porcentajes, métricas monetarias, volumen de piezas o clientes).
3. Prevalencia de verbos de acción fuertes en tiempo pasado.
4. Presencia de la jerga técnica exacta del oficio u ocupación.

Puesto Objetivo:
Título: ${jobTarget?.title || 'No especificado'}
Descripción: ${jobTarget?.rawDescription?.slice(0, 1500) || 'No especificado'}

Payload del Currículum:
${JSON.stringify(cvData, null, 2).slice(0, 3500)}

Retorna en formato JSON estricto:
{
  "overallVerdict": "Alta Compatibilidad ATS / Requiere Cuantificación / En Riesgo por Clichés",
  "atsScore": 88,
  "strengths": ["...", "..."],
  "criticalGaps": ["...", "..."],
  "keywordRecommendations": [
    { "keyword": "...", "reason": "...", "suggestedPlacement": "Habilidades / Experiencia" }
  ],
  "formattingCompliance": {
    "isSingleColumn": true,
    "hasUnreadableElements": false,
    "quantifiableMetricsRatio": "80%",
    "actionVerbPrevalence": "90%"
  },
  "actionPlanToReach95": [
    "Paso 1: ...",
    "Paso 2: ...",
    "Paso 3: ..."
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/deep-ats-audit:', error);
    res.status(500).json({ error: error.message || 'Error auditing ATS resume' });
  }
});

app.post('/api/ai/suggest-skills', async (req: Request, res: Response) => {
  try {
    const { jobTitle } = req.body;
    if (!jobTitle) {
      res.status(400).json({ error: 'jobTitle is required' });
      return;
    }

    const prompt = `Actúa como Director Senior de Recursos Humanos y Auditor de Algoritmos ATS.
Para el puesto u oficio objetivo: "${jobTitle}", proporciona las competencias técnicas, maquinaria/herramientas exactas y normativas operativas que buscan los empleadores del sector.
REGLA: Prohibido clichés blandos como "proactivo" o "trabajo en equipo". Incluye exclusivamente la jerga técnica concreta del oficio.

Retorna ÚNICAMENTE JSON:
{
  "technical": ["Habilidad o competencia técnica del oficio 1", "Competencia 2", "Competencia 3", "Competencia 4", "Competencia 5", "Competencia 6"],
  "tools": ["Herramienta especializada, instrumental, maquinaria o software 1", "Herramienta 2", "Herramienta 3", "Herramienta 4"],
  "methodologies": ["Norma de calidad, protocolo de seguridad o metodología operativa 1", "Procedimiento 2", "Estándar 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.25,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/suggest-skills:', error);
    res.status(500).json({ error: error.message || 'Error suggesting skills' });
  }
});

// Contador persistente de comunicaciones y buzón de sugerencias
let contactCount = 148;
const storedSuggestions: Array<{ name?: string; email?: string; message: string; date: string }> = [];

app.get('/api/contact-counter', (_req: Request, res: Response) => {
  res.json({ count: contactCount });
});

app.post('/api/contact-counter/increment', (_req: Request, res: Response) => {
  contactCount += 1;
  res.json({ count: contactCount });
});

app.post('/api/suggestions', (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  contactCount += 1;
  storedSuggestions.push({
    name: name || 'Anónimo',
    email: email || '',
    message: message || '',
    date: new Date().toISOString()
  });
  console.log(`[NUEVA COMUNICACIÓN REGISTRADA PARA AJRC.SERVICIOS@GMAIL.COM]:`, { name, email, message, total: contactCount });
  res.json({ success: true, count: contactCount });
});

app.post('/api/ai/optimize-linkedin', async (req: Request, res: Response) => {
  try {
    const { cvData, jobTarget } = req.body;

    const targetTitle = jobTarget?.title || cvData?.contactInfo?.professionalTitle || 'Profesional';
    const skillsList = [
      ...(jobTarget?.extractedEntities?.technicalSkills || []),
      ...(jobTarget?.extractedEntities?.toolsAndSoftware || []),
      ...(cvData?.skills?.technical || []),
      ...(cvData?.skills?.tools || []),
    ].slice(0, 15).join(', ');

    const prompt = `Act as an elite LinkedIn profile strategist, personal branding coach, and senior recruiter across all industries and trades (administration, mechanics, healthcare, textile, commerce, logistics, tech).
Analyze this candidate's background and the target role "${targetTitle}".
Generate high-conversion, recruiter-optimized LinkedIn profile components in Spanish.

CRITICAL MULTIDISCIPLINARY RULE:
Adapt strictly to the real trade or profession of "${targetTitle}".
DO NOT inject IT, programming, cloud, or software jargon unless the candidate is explicitly in computer science or software engineering.
- If administrative: highlight billing, CFDI, reconciliations, office operations, organization.
- If mechanic: highlight vehicle diagnostics, fleet preventative maintenance, engine repair, reliability.
- If seamstress/tailor: highlight garment craftsmanship, pattern drafting, industrial sewing machinery, zero defects, textile efficiency.
- If healthcare: highlight patient care, clinical triage, medication administration, biosecurity protocols.
- If sales: highlight B2B negotiation, commercial pipelines, quota achievement, customer retention.

Candidate Info:
- Name: ${cvData?.contactInfo?.fullName || 'Candidate'}
- Current Title: ${cvData?.contactInfo?.professionalTitle || targetTitle}
- Summary: ${cvData?.summary || ''}
- Top Skills: ${skillsList}
- Key Experiences: ${JSON.stringify(cvData?.experience?.slice(0, 2) || [], null, 2)}

Target Job:
- Title: ${targetTitle}
- Company: ${jobTarget?.company || 'Empresas Líderes del Sector'}
- Target Keywords: ${JSON.stringify(jobTarget?.extractedEntities || {})}

Generate a JSON object with:
1. "headlines": Array of 3 distinct, high-impact headlines (strictly under 220 characters each) tailored to this specific trade:
   - Type 1: "Palabras Clave & Impacto" (Role | Core Specialty & Tools | Measurable Result)
   - Type 2: "Propuesta de Valor Profesional" (Solving operational problems with specific trade competence)
   - Type 3: "Especialista del Sector" (Role specialized in X • Key Metric • Core Skills)
   Include: "type", "text", "characterCount", "whyItWorks"
2. "aboutSection":
   - "hook": Compelling first 2 lines (before "ver más" fold) that grab recruiter attention
   - "body": 2-3 narrative paragraphs describing trajectory, mission, and major quantified milestones in this trade
   - "keywordCloud": "🎯 Especialidades y Competencias Clave: [Keyword1] • [Keyword2] • ..."
   - "callToAction": Professional invitation for networking, employment opportunities, or business collaborations
   - "fullText": The complete assembled About section ready to copy-paste
3. "experienceTips": Array of 3-4 actionable tips to adapt their resume bullets specifically for LinkedIn in this industry.
4. "recruiterSearchKeywords": Array of 8-10 essential keywords recruiters search in LinkedIn Recruiter for this exact role, with an "importance" ("crítico" | "alto").

Return ONLY valid JSON matching this schema:
{
  "headlines": [
    {
      "type": "Palabras Clave & Impacto",
      "text": "...",
      "characterCount": 185,
      "whyItWorks": "..."
    }
  ],
  "aboutSection": {
    "hook": "...",
    "body": "...",
    "keywordCloud": "...",
    "callToAction": "...",
    "fullText": "..."
  },
  "experienceTips": [
    "..."
  ],
  "recruiterSearchKeywords": [
    { "keyword": "...", "importance": "crítico" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.3,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/optimize-linkedin:', error);
    res.status(500).json({ error: error.message || 'Error optimizing LinkedIn profile' });
  }
});

app.post('/api/ai/audit-text-spelling', async (req: Request, res: Response) => {
  try {
    const { cvData } = req.body;
    if (!cvData) {
      res.status(400).json({ error: 'cvData is required' });
      return;
    }

    const payloadToAudit = {
      title: cvData.contactInfo?.professionalTitle || '',
      summary: cvData.summary || '',
      experience: (cvData.experience || []).map((exp: any, expIdx: number) => ({
        expIndex: expIdx,
        jobTitle: exp.jobTitle,
        company: exp.company,
        bullets: (exp.bullets || []).map((b: string, bIdx: number) => ({
          bulletIndex: bIdx,
          text: b
        }))
      }))
    };

    const prompt = `Actúa como Director Senior de Recursos Humanos, Editor Ejecutivo de CVs y Auditor Especialista en ATS.
Realiza una auditoría lingüística, ortográfica y estilística exhaustiva de este currículum:
1. Ortografía y acentuación (tildes faltantes o erróneas, erratas tipográficas, mayúsculas correctas según la RAE).
2. Gramática y concordancia (género, número, concordancia verbal y tiempos en pretérito para logros pasados).
3. PROHIBICIÓN Y ELIMINACIÓN DE CLICHÉS GENÉRICOS:
   Detecta obligatoriamente y penaliza el uso de clichés vacíos ("apasionado", "proactivo", "trabajador en equipo dinámico", "motivado", "responsable"). Clasifícalos como "estilo_redacción" y reemplázalos por redacciones contundentes basadas en logros y competencias comprobables.
4. VERBOS DE ACCIÓN FUERTES Y MÉTODO XYZ:
   Detecta frases pasivas o débiles como "encargado de", "responsable de", "hice" o viñetas sin impacto. Proporciona en "suggestedText" una versión estructurada bajo el método XYZ de Google con verbos de acción fuertes y métricas cuantificables (%, $, tiempo o volumen).
5. JERGA TÉCNICA DEL OFICIO:
   Asegura que el vocabulario y las correcciones utilicen los términos y herramientas exactos del puesto u oficio correspondiente.

Texto a auditar:
` + JSON.stringify(payloadToAudit, null, 2) + `

Instrucciones:
- Identifica de forma proactiva oportunidades de mejora lingüística y de impacto profesional.
- Para cada problema detectado, proporciona:
  * "id": string único (p. ej. "err_1")
  * "targetSection": "summary" | "experience" | "title"
  * "expIndex": number o null
  * "bulletIndex": number o null
  * "originalText": el texto o fragmento original
  * "suggestedText": la versión optimizada completa, con verbo de acción fuerte, sin clichés y con estructura de logro XYZ, lista para aplicar con 1 clic
  * "errorType": "ortografía" | "gramática" | "estilo_redacción"
  * "title": título corto descriptivo (e.g. "Eliminación de cliché genérico", "Verbo de acción fuerte XYZ")
  * "explanation": explicación ejecutiva en español de por qué este cambio eleva el puntaje ATS y la impresión del reclutador.

Retorna ÚNICAMENTE un objeto JSON válido con este esquema:
{
  "healthScore": 92,
  "totalIssues": 2,
  "statistics": {
    "wordsAudited": 180,
    "sectionsAudited": 3,
    "bulletPointsAudited": 6,
    "formalityLevel": "Nivel Profesional Alto",
    "orthographyStatus": "Aprobado con sugerencias estilísticas"
  },
  "generalFeedback": "Diagnóstico Ejecutivo: El currículum presenta solidez estructural...",
  "inspectedSections": [
    {
      "sectionName": "Título Profesional",
      "analyzedText": "...",
      "status": "impecable",
      "wordsCount": 5,
      "observations": "Título descriptivo con jerga técnica precisa."
    },
    {
      "sectionName": "Resumen Ejecutivo",
      "analyzedText": "...",
      "status": "optimizado",
      "wordsCount": 65,
      "observations": "Párrafo contundente sin clichés subjetivos y con métricas comprobables."
    },
    {
      "sectionName": "Experiencia Laboral",
      "analyzedText": "...",
      "status": "optimizado",
      "wordsCount": 110,
      "observations": "Viñetas formuladas con verbos de acción en tiempo pasado bajo método XYZ."
    }
  ],
  "issues": [
    {
      "id": "err_1",
      "targetSection": "experience",
      "expIndex": 0,
      "bulletIndex": 0,
      "originalText": "...",
      "suggestedText": "...",
      "errorType": "estilo_redacción",
      "title": "Verbo de acción de alto impacto",
      "explanation": "..."
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: SENIOR_HR_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/audit-text-spelling:', error);
    res.status(500).json({ error: error.message || 'Error auditing text spelling' });
  }
});

// Setup Vite middlewares for development or serve dist for production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ATSPASS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

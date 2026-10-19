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

// API Routes for ATS & AI Intelligence
app.post('/api/ai/extract-job-entities', async (req: Request, res: Response) => {
  try {
    const { jobTitle, jobDescription } = req.body;
    if (!jobDescription || typeof jobDescription !== 'string') {
      res.status(400).json({ error: 'jobDescription is required' });
      return;
    }

    const prompt = `Act as an enterprise ATS (Applicant Tracking System) parser and senior recruiter across ALL industries, trades, and professions (administration, automotive mechanics, textile & tailoring, healthcare & nursing, sales & commerce, logistics, manufacturing, education, engineering, technology, etc.).

CRITICAL MULTIDISCIPLINARY RULE:
Analyze this job posting for the position "${jobTitle || 'Target Position'}".
Adapt strictly and exclusively to the specific trade, sector, and industry indicated in this job title and description.
DO NOT assume or insert computer science, programming, cloud, or IT terminology unless the target position is explicitly a software development or IT role.
- If the role is a mechanic: extract mechanical diagnosis, OBD-II scanner, engines, brakes, industrial safety norms, preventative maintenance.
- If the role is in tailoring/seamstress: extract industrial sewing machines, pattern drafting, fabric cutting, garment assembly, textile quality.
- If the role is administrative: extract CFDI/SAT electronic billing, bank reconciliations, office management, accounts payable/receivable, Excel, ERP.
- If the role is healthcare: extract triage, clinical patient care, vital signs, medication administration, biosecurity norms.

Extract the core ATS entities in strict JSON format:
1. technicalSkills: core industry or trade competencies specific to this exact field.
2. toolsAndSoftware: physical machinery, specialized tools, diagnostic instruments, office software, or trade equipment used in this profession.
3. methodologies: industry operating standards, quality controls, safety protocols (e.g., 5S, NOM, bioseguridad, control de merma, conciliación contable).
4. actionVerbs: key impact action verbs emphasized in this trade.
5. softSkills: interpersonal and workplace qualities.
6. certificationsAndEducation: trade licenses, diplomas, or degrees required/preferred.
7. seniorityLevel: estimated seniority (Técnico / Operativo / Junior / Mid / Senior / Jefe de Área).

Job Description:
"""${jobDescription.slice(0, 4000)}"""

Return ONLY a valid JSON object matching this structure:
{
  "technicalSkills": ["..."],
  "toolsAndSoftware": ["..."],
  "methodologies": ["..."],
  "actionVerbs": ["..."],
  "softSkills": ["..."],
  "certificationsAndEducation": ["..."],
  "seniorityLevel": "Mid"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
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

    const prompt = `Act as an expert resume writer and ATS optimization specialist across multidisciplinary trades and professions (crafts, administration, mechanical, nursing, textile, sales, operations, technology).
Rewrite this work experience bullet point following the Google XYZ formula:
"Accomplished [X] as measured by [Y] by doing [Z]"
(in Spanish: "Logré [X], medido a través de [Y], mediante [Z]").

Target Role: ${targetJob || 'Professional Position'}
Keywords to weave in naturally: ${keywordsToIncorporate ? JSON.stringify(keywordsToIncorporate) : 'None specified'}
Original Bullet: "${rawBullet}"
Target Language: ${language === 'en' ? 'English' : 'Spanish'}

CRITICAL MULTIDISCIPLINARY RULE:
Strictly adapt the vocabulary, action verbs, and metrics to the specific sector and trade of the target role ("${targetJob}").
DO NOT inject IT, programming, software, or cloud terms unless the role is strictly in software development!
Use realistic metrics belonging to this specific trade (e.g. vehículos reparados por semana, reducción de merma textil en %, reducción de cartera vencida en %, precisión en arqueos de caja, satisfacción de pacientes o clientes, piezas confeccionadas por turno).

Rules:
1. Start with a decisive, high-impact past-tense action verb fitting this exact trade (e.g., Confeccioné, Reparé, Diagnosticó, Facturé, Concilié, Atendí, Gestioné, Optimicé, Reduje, Incrementé).
2. Incorporate realistic, quantified operational metrics (%, unidades, tiempo ahorrado, montos monetarios o volumen de atención).
3. Ensure 100% single-sentence, ATS-friendly linear syntax without emojis or asterisks.
4. Provide 3 variations:
   - variation1: Métricas y Rendimiento Operativo (Focus on numbers, savings, or volume)
   - variation2: Responsabilidad y Eficiencia (Focus on process control and reliability)
   - variation3: Técnica y Estándares del Oficio (Focus on tools, equipment, and quality standards)

Return ONLY a valid JSON object:
{
  "recommended": "the single best overall version",
  "variations": [
    { "type": "Métricas y Rendimiento Operativo", "text": "..." },
    { "type": "Responsabilidad y Eficiencia", "text": "..." },
    { "type": "Técnica y Estándares del Oficio", "text": "..." }
  ],
  "metricsIncluded": ["e.g. 28%", "e.g. 150 piezas"],
  "actionVerb": "e.g. Confeccioné"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
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

    const prompt = `Act as an executive recruiter and ATS resume specialist across multidisciplinary industries.
Create or optimize a 3 to 4-sentence Executive Summary (Resumen Profesional) for a resume targeting the role "${targetJob}".

CRITICAL MULTIDISCIPLINARY RULE:
Adapt strictly to the specific trade, industry, or profession of "${targetJob}".
DO NOT assume technology or software development unless the target role is explicitly in computer science or IT.
Information:
- Current summary/draft: "${currentSummary || 'None provided'}"
- Top skills to highlight: ${topSkills ? topSkills.join(', ') : 'Relevant industry competencies'}
- Seniority/Experience: ${yearsOfExperience || 'Mid-Senior'}
- Target Language: ${language === 'en' ? 'English' : 'Spanish'}

ATS Requirements:
1. Exactly 3 to 4 sentences (approx 50-80 words).
2. Sentence 1: Professional identity in this trade/industry, total years of experience, core area of specialization.
3. Sentence 2: Key trade competencies, machinery/tools, and quality or operating methodologies for this specific profession.
4. Sentence 3-4: Major career accomplishment with quantifiable impact and value brought to the employer/organization.
5. Strictly ATS single-paragraph format. No bullet points.

Return ONLY a valid JSON object:
{
  "summary": "The optimized professional summary text...",
  "highlightedKeywords": ["keyword1", "keyword2"],
  "wordCount": 65
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
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

    const prompt = `You are the lead engineering architect of an enterprise ATS parser (like Taleo, Workday, Greenhouse, iCIMS).
Perform an exhaustive technical audit of this candidate CV payload against the target job requirements.

Target Job:
Title: ${jobTarget?.title || 'Not specified'}
Job Description snippet: ${jobTarget?.rawDescription?.slice(0, 1500) || 'Not specified'}

Candidate CV Payload:
${JSON.stringify(cvData, null, 2).slice(0, 3500)}

Analyze and return strict JSON:
{
  "overallVerdict": "High Compatibility / Needs Optimization / At Risk",
  "atsScore": 88,
  "strengths": ["...", "..."],
  "criticalGaps": ["...", "..."],
  "keywordRecommendations": [
    { "keyword": "...", "reason": "...", "suggestedPlacement": "Skills / Experience" }
  ],
  "formattingCompliance": {
    "isSingleColumn": true,
    "hasUnreadableElements": false,
    "quantifiableMetricsRatio": "75%",
    "actionVerbPrevalence": "85%"
  },
  "actionPlanToReach95": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ..."
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
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

    const prompt = `Act as an expert recruiter and ATS analyzer.
For the job position or trade: "${jobTitle}", provide the top industry-specific skills, tools/machinery, and operational methodologies that ATS systems and recruiters scan for.
CRITICAL: Adapt strictly to this specific trade or profession (whether it's mechanic, seamstress, driver, administrative assistant, nurse, sales, chef, engineer, teacher, etc.). Do NOT assume software engineering unless the job is explicitly in IT.

Return ONLY a valid JSON object:
{
  "technical": ["Habilidad/Competencia 1", "Habilidad 2", "Habilidad 3", "Habilidad 4", "Habilidad 5", "Habilidad 6"],
  "tools": ["Herramienta/Equipo/Software 1", "Herramienta 2", "Herramienta 3", "Herramienta 4"],
  "methodologies": ["Metodología/Norma/Procedimiento 1", "Norma 2", "Protocolo 3"]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.3,
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

    const prompt = `Act as an expert copyeditor, executive Spanish linguist, and senior resume editor across all professional disciplines.
Perform an in-depth linguistic and stylistic audit of this candidate resume text:
1. Orthographic and spelling mistakes (missing or misplaced tildes/accents, typos, capitalization of job titles vs common nouns).
2. Grammatical errors (subject-verb agreement, gender/number concordance, tense consistency in past accomplishments).
3. Executive style & clarity issues (weak generic phrasing like "encargado de" or "hice", punctuation consistency, conciseness).

Candidate Text to Audit:
` + JSON.stringify(payloadToAudit, null, 2) + `

Instructions:
- Even when the text has high quality, identify subtle linguistic refinements to elevate the professional prestige.
- Provide a full analysis breakdown with statistics and inspected sections so the user sees a complete report of the analyzed content.
- For each specific issue, provide:
  * "id": unique string (e.g. "err_1")
  * "targetSection": "summary" | "experience" | "title"
  * "expIndex": number or null
  * "bulletIndex": number or null
  * "originalText": the exact sentence or bullet text
  * "suggestedText": the complete improved replacement text ready to apply with 1 click
  * "errorType": "ortografía" | "gramática" | "estilo_redacción"
  * "title": short descriptive title
  * "explanation": clear explanation in Spanish of why this change improves the CV.

Return ONLY a valid JSON object matching this schema:
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
  "generalFeedback": "Diagnóstico Lingüístico: El currículum presenta una redacción clara y profesional...",
  "inspectedSections": [
    {
      "sectionName": "Título Profesional",
      "analyzedText": "...",
      "status": "impecable",
      "wordsCount": 5,
      "observations": "Título descriptivo y bien delimitado sintácticamente."
    },
    {
      "sectionName": "Resumen Ejecutivo",
      "analyzedText": "...",
      "status": "optimizado",
      "wordsCount": 65,
      "observations": "Párrafo coherente con presencia de métricas y vocabulario técnico adecuado."
    },
    {
      "sectionName": "Experiencia Laboral",
      "analyzedText": "...",
      "status": "optimizado",
      "wordsCount": 110,
      "observations": "Viñetas estructuradas con verbos de acción en tiempo pasado."
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

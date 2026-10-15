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

    const prompt = `Act as an enterprise ATS (Applicant Tracking System) parser and senior recruiter.
Analyze this job posting for the position "${jobTitle || 'Target Position'}".
Extract the core ATS entities in strict JSON format:
1. technicalSkills: array of technical competencies, programming languages, architectures, engineering concepts.
2. toolsAndSoftware: array of tools, software, platforms, cloud providers, ERP/CRM, libraries.
3. methodologies: frameworks and processes (e.g., Agile, Scrum, CI/CD, ITIL, OKRs, Lean).
4. actionVerbs: key impact verbs emphasized or desired in this role.
5. softSkills: leadership, communication, stakeholder management, problem solving.
6. certificationsAndEducation: degrees or certifications mentioned as required/preferred.
7. seniorityLevel: estimated seniority (Junior, Mid, Senior, Lead, Director).

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
  "seniorityLevel": "Senior"
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

    const prompt = `Act as a senior executive resume writer and ATS optimization specialist.
Rewrite this work experience bullet point following the gold standard Google XYZ formula:
"Accomplished [X] as measured by [Y] by doing [Z]"
(or in Spanish: "Logré [X], medido a través de [Y], mediante [Z]").

Target Role: ${targetJob || 'Professional Position'}
Keywords to weave in naturally (if appropriate): ${keywordsToIncorporate ? JSON.stringify(keywordsToIncorporate) : 'None specified'}
Original Bullet: "${rawBullet}"
Target Language: ${language === 'en' ? 'English' : 'Spanish'}

Rules:
1. Start with a decisive, high-impact past-tense action verb (e.g., Diseñé, Implementé, Lideré, Reduje, Incrementé, Optimicé / Engineered, Spearheaded, Reduced, Accelerated).
2. Incorporate realistic, quantified business impact metrics (e.g., %, $, tiempo ahorrado, escala de usuarios, volumen de transacciones) if missing or vague.
3. Ensure 100% single-sentence, ATS-friendly linear syntax without emojis, asterisks, or graphics.
4. Provide 3 variations:
   - variation1: Quantified & metric-heavy (Focus on scale, efficiency and numerical ROI)
   - variation2: Leadership & strategic execution (Focus on team impact, architectural or organizational scope)
   - variation3: Technical & methodology precision (Focus on tools, stacks, and process compliance)

Return ONLY a valid JSON object:
{
  "recommended": "the single best overall version",
  "variations": [
    { "type": "Métricas y Rendimiento", "text": "..." },
    { "type": "Liderazgo y Estrategia", "text": "..." },
    { "type": "Técnico y Metodológico", "text": "..." }
  ],
  "metricsIncluded": ["e.g. 35%", "e.g. $120K USD"],
  "actionVerb": "e.g. Lideré"
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

    const prompt = `Act as an executive recruiter and ATS algorithm engineer.
Create or optimize a 3 to 4-sentence Executive Summary (Resumen Profesional) for a resume targeting the role "${targetJob}".
Information:
- Current summary/draft: "${currentSummary || 'None provided'}"
- Top skills to highlight: ${topSkills ? topSkills.join(', ') : 'Relevant industry competencies'}
- Seniority/Experience: ${yearsOfExperience || 'Mid-Senior'}
- Target Language: ${language === 'en' ? 'English' : 'Spanish'}

ATS Requirements:
1. Exactly 3 to 4 sentences (approx 50-80 words).
2. Sentence 1: Professional identity, total years of experience, core domain of specialization.
3. Sentence 2: Key technical competencies, tools, and methodologies aligned with the target position.
4. Sentence 3-4: Major career accomplishment with quantifiable impact and value brought to the organization.
5. Strictly ATS single-paragraph format. No bullet points, no buzzwords without substance.

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

    const prompt = `Act as an elite LinkedIn profile strategist, executive branding coach, and top tech recruiter.
Analyze this candidate's background and the target role "${targetTitle}".
Generate high-conversion, recruiter-optimized LinkedIn profile components in Spanish.

Candidate Info:
- Name: ${cvData?.contactInfo?.fullName || 'Candidate'}
- Current Title: ${cvData?.contactInfo?.professionalTitle || targetTitle}
- Summary: ${cvData?.summary || ''}
- Top Skills: ${skillsList}
- Key Experiences: ${JSON.stringify(cvData?.experience?.slice(0, 2) || [], null, 2)}

Target Job:
- Title: ${targetTitle}
- Company: ${jobTarget?.company || 'Top Tier Companies'}
- Target Keywords: ${JSON.stringify(jobTarget?.extractedEntities || {})}

Generate a JSON object with:
1. "headlines": Array of 3 distinct, high-impact headlines (strictly under 220 characters each):
   - Type 1: "Keyword & Impact" (Role | Core Stack | Measurable Result)
   - Type 2: "Executive Value Proposition" (Helping companies solve X with Y)
   - Type 3: "Strategic Specialist" (Role specialized in X • Key Metric • Core Skills)
   Include: "type", "text", "characterCount", "whyItWorks"
2. "aboutSection":
   - "hook": Compelling first 2 lines (before "ver más" fold) that grab recruiter attention
   - "body": 2-3 narrative paragraphs describing trajectory, mission, and major quantified milestones
   - "keywordCloud": "🎯 Especialidades y Tecnologías Clave: [Keyword1] • [Keyword2] • ..."
   - "callToAction": Professional invitation for networking, roles, or speaking engagements
   - "fullText": The complete assembled About section ready to copy-paste
3. "experienceTips": Array of 3-4 actionable tips to adapt their resume bullets specifically for LinkedIn (mobile readability, media attachments, skills tagging).
4. "recruiterSearchKeywords": Array of 8-10 essential keywords recruiters search in LinkedIn Recruiter for this role, with an "importance" ("crítico" | "alto").

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

    const prompt = `Act as an expert copyeditor, executive Spanish linguist, and senior resume editor.
Perform an in-depth audit of this resume text for:
1. Orthographic and spelling mistakes (including missing or misplaced tildes/accents, capitalization, typos).
2. Grammatical errors (subject-verb agreement, gender/number concordance, tense consistency).
3. Redaction and executive style issues (passive voice, weak generic phrasing like "encargado de" or "hice", informal wording, punctuation inconsistency).

Candidate Text:
${JSON.stringify(payloadToAudit, null, 2)}

Instructions:
- Carefully locate each real issue. If the text has no critical errors, find subtle stylistic improvements to make the phrasing more commanding and polished.
- For each issue, provide:
  * "id": unique string
  * "targetSection": "summary" or "experience" or "title"
  * "expIndex": number (if experience, otherwise null)
  * "bulletIndex": number (if experience bullet, otherwise null)
  * "originalText": the exact sentence or bullet text containing the issue
  * "suggestedText": the full corrected sentence or bullet point ready to replace the original with 1 click
  * "errorType": "ortografía" or "gramática" or "estilo_redacción"
  * "title": short name of the issue (e.g., "Acentuación en verbo en pasado", "Voz pasiva débil", "Concordancia de número")
  * "explanation": clear, educational explanation in Spanish of why the change improves the text.

Return ONLY a valid JSON object matching this schema:
{
  "healthScore": 88,
  "totalIssues": 2,
  "issues": [
    {
      "id": "err_1",
      "targetSection": "experience",
      "expIndex": 0,
      "bulletIndex": 0,
      "originalText": "...",
      "suggestedText": "...",
      "errorType": "ortografía",
      "title": "...",
      "explanation": "..."
    }
  ],
  "generalFeedback": "..."
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
    console.log(`Labor Path ATS server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

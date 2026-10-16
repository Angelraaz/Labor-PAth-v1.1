export interface ContactInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolioOrGithub?: string;
}

export interface ExperienceItem {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  details?: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface SkillsData {
  technical: string[];
  tools: string[];
  methodologies: string[];
  languages: string[];
}

export interface CVData {
  id: string;
  lastUpdated: string;
  contactInfo: ContactInfo;
  summary: string;
  experience: ExperienceItem[];
  skills: SkillsData;
  education: EducationItem[];
  certifications: CertificationItem[];
}

export interface ExtractedEntities {
  technicalSkills: string[];
  toolsAndSoftware: string[];
  methodologies: string[];
  actionVerbs: string[];
  softSkills: string[];
  certificationsAndEducation?: string[];
  seniorityLevel?: string;
}

export interface JobTarget {
  title: string;
  company?: string;
  rawDescription: string;
  extractedEntities: ExtractedEntities;
}

export interface KeywordMatch {
  word: string;
  category: 'technical' | 'tools' | 'methodology' | 'soft' | 'general';
  frequencyInCV: number;
  foundIn: Array<'summary' | 'experience' | 'skills'>;
}

export interface MissingKeyword {
  word: string;
  category: 'technical' | 'tools' | 'methodology' | 'soft' | 'general';
  importance: 'high' | 'medium';
}

export interface DetectedMetric {
  text: string;
  context: string;
  type: 'percentage' | 'currency' | 'numeric' | 'multiplier';
}

export interface StructuralViolation {
  id: string;
  level: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  solution: string;
  isCompliant: boolean;
}

export interface ATSAnalysisResult {
  overallScore: number;
  breakdown: {
    keywordMatch: number;      // 0 - 100 (Weight: 40%)
    quantifiableMetrics: number; // 0 - 100 (Weight: 25%)
    actionVerbs: number;       // 0 - 100 (Weight: 15%)
    structuralCompliance: number; // 0 - 100 (Weight: 20%)
  };
  matchedKeywords: KeywordMatch[];
  missingKeywords: MissingKeyword[];
  detectedMetrics: DetectedMetric[];
  detectedActionVerbs: string[];
  violations: StructuralViolation[];
  recommendations: string[];
  wordCount: number;
  bulletCount: number;
  bulletMetricsRatio: number;
}

export interface DeepAIAuditResult {
  overallVerdict: string;
  atsScore: number;
  strengths: string[];
  criticalGaps: string[];
  keywordRecommendations: Array<{
    keyword: string;
    reason: string;
    suggestedPlacement: string;
  }>;
  formattingCompliance: {
    isSingleColumn: boolean;
    hasUnreadableElements: boolean;
    quantifiableMetricsRatio: string;
    actionVerbPrevalence: string;
  };
  actionPlanToReach95: string[];
}

export interface LinkedInHeadline {
  type: string;
  text: string;
  characterCount: number;
  whyItWorks: string;
}

export interface LinkedInAbout {
  hook: string;
  body: string;
  keywordCloud: string;
  callToAction: string;
  fullText: string;
}

export interface LinkedInOptimizationResult {
  headlines: LinkedInHeadline[];
  aboutSection: LinkedInAbout;
  experienceTips: string[];
  recruiterSearchKeywords: Array<{
    keyword: string;
    importance: 'crítico' | 'alto';
  }>;
}

export interface LinkedInChecklistItem {
  id: string;
  label: string;
  impact: 'crítico' | 'alto' | 'medio';
  tip: string;
  category: 'headline' | 'about' | 'experience' | 'search';
}

export interface TextAuditIssue {
  id: string;
  targetSection: 'summary' | 'experience' | 'title';
  expIndex?: number;
  bulletIndex?: number;
  originalText: string;
  suggestedText: string;
  errorType: 'ortografía' | 'gramática' | 'estilo_redacción';
  title: string;
  explanation: string;
}

export interface TextAuditSectionBreakdown {
  sectionName: string;
  analyzedText: string;
  status: 'impecable' | 'optimizado' | 'con_observaciones';
  wordsCount: number;
  observations: string;
}

export interface TextAuditStatistics {
  wordsAudited: number;
  sectionsAudited: number;
  bulletPointsAudited: number;
  formalityLevel: string;
  orthographyStatus: string;
}

export interface TextAuditResult {
  healthScore: number;
  totalIssues: number;
  issues: TextAuditIssue[];
  generalFeedback: string;
  statistics?: TextAuditStatistics;
  inspectedSections?: TextAuditSectionBreakdown[];
}



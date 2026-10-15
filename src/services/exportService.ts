import { CVData } from '../types/ats';

/**
 * Triggers the native browser print dialogue configured with strict ATS print styles
 */
export function exportToPDF(): void {
  // Ensure the page title matches the candidate name during print for default file naming
  window.print();
}

/**
 * Formats CVData into 100% ATS-Compliant Plain Text (.txt)
 * Enterprise ATS parsers love this linear format with standard headers.
 */
export function generatePlainTextATS(cv: CVData): string {
  const divider = '------------------------------------------------------------';
  const sectionDivider = '============================================================';

  let text = '';

  // Contact Info
  text += `${cv.contactInfo.fullName.toUpperCase()}\n`;
  text += `${cv.contactInfo.professionalTitle}\n`;
  const contactLine = [
    cv.contactInfo.email,
    cv.contactInfo.phone,
    cv.contactInfo.location,
    cv.contactInfo.linkedin,
    cv.contactInfo.portfolioOrGithub
  ].filter(Boolean).join(' | ');
  text += `${contactLine}\n\n`;

  // Professional Summary
  if (cv.summary) {
    text += `${sectionDivider}\nPROFESSIONAL SUMMARY\n${sectionDivider}\n`;
    text += `${cv.summary.trim()}\n\n`;
  }

  // Work Experience
  if (cv.experience && cv.experience.length > 0) {
    text += `${sectionDivider}\nPROFESSIONAL EXPERIENCE\n${sectionDivider}\n`;
    cv.experience.forEach(exp => {
      text += `\n${exp.jobTitle.toUpperCase()} | ${exp.company}\n`;
      text += `${exp.location} | ${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`;
      text += `${divider}\n`;
      exp.bullets.forEach(bullet => {
        if (bullet.trim()) {
          text += `* ${bullet.trim()}\n`;
        }
      });
    });
    text += '\n';
  }

  // Core Skills
  const hasSkills = (cv.skills.technical?.length || 0) + (cv.skills.tools?.length || 0) + (cv.skills.methodologies?.length || 0) > 0;
  if (hasSkills) {
    text += `${sectionDivider}\nCORE SKILLS & COMPETENCIES\n${sectionDivider}\n`;
    if (cv.skills.technical?.length) {
      text += `* Technical Skills: ${cv.skills.technical.join(', ')}\n`;
    }
    if (cv.skills.tools?.length) {
      text += `* Tools & Platforms: ${cv.skills.tools.join(', ')}\n`;
    }
    if (cv.skills.methodologies?.length) {
      text += `* Methodologies & Frameworks: ${cv.skills.methodologies.join(', ')}\n`;
    }
    if (cv.skills.languages?.length) {
      text += `* Languages: ${cv.skills.languages.join(', ')}\n`;
    }
    text += '\n';
  }

  // Education
  if (cv.education && cv.education.length > 0) {
    text += `${sectionDivider}\nEDUCATION\n${sectionDivider}\n`;
    cv.education.forEach(edu => {
      text += `\n${edu.degree}\n`;
      text += `${edu.institution} - ${edu.location} (${edu.graduationYear})\n`;
      if (edu.details) {
        text += `* ${edu.details}\n`;
      }
    });
    text += '\n';
  }

  // Certifications
  if (cv.certifications && cv.certifications.length > 0) {
    text += `${sectionDivider}\nCERTIFICATIONS & LICENSES\n${sectionDivider}\n`;
    cv.certifications.forEach(cert => {
      text += `* ${cert.name} - ${cert.issuer} (${cert.year})\n`;
    });
    text += '\n';
  }

  return text;
}

/**
 * Downloads a string file directly to the client
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports formatted plain text
 */
export function exportPlainText(cv: CVData): void {
  const text = generatePlainTextATS(cv);
  const filename = `${cv.contactInfo.fullName.replace(/\s+/g, '_')}_CV_ATS.txt`;
  downloadFile(text, filename, 'text/plain;charset=utf-8');
}

/**
 * Exports JSON payload
 */
export function exportJSON(cv: CVData): void {
  const jsonStr = JSON.stringify(cv, null, 2);
  const filename = `${cv.contactInfo.fullName.replace(/\s+/g, '_')}_LaborPath_Payload.json`;
  downloadFile(jsonStr, filename, 'application/json');
}

/**
 * Exports Markdown (.md)
 */
export function exportMarkdown(cv: CVData): void {
  let md = `# ${cv.contactInfo.fullName}\n\n`;
  md += `**${cv.contactInfo.professionalTitle}**\n\n`;
  md += `${cv.contactInfo.email} | ${cv.contactInfo.phone} | ${cv.contactInfo.location}\n\n`;
  if (cv.contactInfo.linkedin || cv.contactInfo.portfolioOrGithub) {
    md += `${cv.contactInfo.linkedin} | ${cv.contactInfo.portfolioOrGithub}\n\n`;
  }

  if (cv.summary) {
    md += `## Resumen Profesional\n\n${cv.summary}\n\n`;
  }

  if (cv.experience.length) {
    md += `## Experiencia Laboral\n\n`;
    cv.experience.forEach(exp => {
      md += `### ${exp.jobTitle} - ${exp.company}\n`;
      md += `*${exp.location} | ${exp.startDate} - ${exp.current ? 'Presente' : exp.endDate}*\n\n`;
      exp.bullets.forEach(b => {
        md += `- ${b}\n`;
      });
      md += '\n';
    });
  }

  md += `## Habilidades Clave\n\n`;
  if (cv.skills.technical?.length) md += `- **Habilidades Técnicas:** ${cv.skills.technical.join(', ')}\n`;
  if (cv.skills.tools?.length) md += `- **Herramientas & Software:** ${cv.skills.tools.join(', ')}\n`;
  if (cv.skills.methodologies?.length) md += `- **Metodologías:** ${cv.skills.methodologies.join(', ')}\n`;
  if (cv.skills.languages?.length) md += `- **Idiomas:** ${cv.skills.languages.join(', ')}\n`;
  md += '\n';

  if (cv.education.length) {
    md += `## Educación\n\n`;
    cv.education.forEach(edu => {
      md += `### ${edu.degree}\n`;
      md += `*${edu.institution} (${edu.graduationYear})*\n`;
      if (edu.details) md += `- ${edu.details}\n`;
      md += '\n';
    });
  }

  if (cv.certifications.length) {
    md += `## Certificaciones\n\n`;
    cv.certifications.forEach(cert => {
      md += `- **${cert.name}** - ${cert.issuer} (${cert.year})\n`;
    });
    md += '\n';
  }

  const filename = `${cv.contactInfo.fullName.replace(/\s+/g, '_')}_CV.md`;
  downloadFile(md, filename, 'text/markdown;charset=utf-8');
}

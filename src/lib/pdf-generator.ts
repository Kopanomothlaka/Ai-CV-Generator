import jsPDF from "jspdf";

export interface CVData {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary: string;
  skills: string[];
  experience: {
    title: string;
    company: string;
    duration: string;
    achievements: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  certifications?: string[];
}

export function generateCVPdf(data: CVData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 0;

  // Beautiful color palette
  const colors = {
    primary: [30, 80, 85] as [number, number, number],      // Deep teal
    secondary: [45, 110, 115] as [number, number, number],  // Lighter teal
    text: [25, 35, 45] as [number, number, number],         // Dark slate
    muted: [100, 115, 130] as [number, number, number],     // Gray
    accent: [240, 245, 250] as [number, number, number],    // Light background
  };

  // Add header banner
  doc.setFillColor(...colors.primary);
  doc.rect(0, 0, pageWidth, 45, "F");

  // Decorative accent line
  doc.setFillColor(...colors.secondary);
  doc.rect(0, 45, pageWidth, 3, "F");

  // Name in header
  y = 22;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.setTextColor(255, 255, 255);
  doc.text(data.name.toUpperCase(), margin, y);

  // Title/tagline
  y = 35;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(220, 230, 235);
  const tagline = data.experience?.[0]?.title || "Professional";
  doc.text(tagline, margin, y);

  // Contact info on right side of header
  const contactY = 22;
  doc.setFontSize(9);
  doc.setTextColor(200, 215, 220);
  const contactInfo: string[] = [];
  if (data.email) contactInfo.push(data.email);
  if (data.phone) contactInfo.push(data.phone);
  if (data.location) contactInfo.push(data.location);
  if (data.linkedin) contactInfo.push(data.linkedin);
  
  contactInfo.forEach((info, idx) => {
    doc.text(info, pageWidth - margin, contactY + (idx * 5), { align: "right" });
  });

  y = 58;

  // Helper functions
  const checkPageBreak = (neededSpace: number) => {
    if (y + neededSpace > pageHeight - 25) {
      doc.addPage();
      y = 25;
      return true;
    }
    return false;
  };

  const addSectionHeader = (title: string) => {
    checkPageBreak(20);
    y += 6;
    
    // Section title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...colors.primary);
    doc.text(title.toUpperCase(), margin, y);
    
    // Underline
    y += 2;
    doc.setDrawColor(...colors.secondary);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 45, y);
    y += 8;
  };

  const addParagraph = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    const lines = doc.splitTextToSize(text, contentWidth);
    checkPageBreak(lines.length * 5);
    doc.text(lines, margin, y);
    y += lines.length * 5 + 3;
  };

  const addBulletPoint = (text: string, indent = 0) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    
    const bulletX = margin + indent + 3;
    const textX = margin + indent + 8;
    const maxWidth = contentWidth - indent - 8;
    
    const lines = doc.splitTextToSize(text, maxWidth);
    checkPageBreak(lines.length * 5);
    
    // Bullet dot
    doc.setFillColor(...colors.secondary);
    doc.circle(bulletX, y - 1.2, 1, "F");
    
    doc.text(lines, textX, y);
    y += lines.length * 5 + 1;
  };

  // Professional Summary
  if (data.summary) {
    addSectionHeader("Professional Summary");
    
    // Add subtle background
    const summaryLines = doc.splitTextToSize(data.summary, contentWidth - 10);
    const summaryHeight = summaryLines.length * 5 + 8;
    checkPageBreak(summaryHeight);
    
    doc.setFillColor(...colors.accent);
    doc.roundedRect(margin - 2, y - 4, contentWidth + 4, summaryHeight, 2, 2, "F");
    
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.text(summaryLines, margin + 3, y);
    y += summaryHeight + 2;
  }

  // Skills Section - Two column layout
  if (data.skills && data.skills.length > 0) {
    addSectionHeader("Core Competencies");
    
    const midPoint = Math.ceil(data.skills.length / 2);
    const leftSkills = data.skills.slice(0, midPoint);
    const rightSkills = data.skills.slice(midPoint);
    const startY = y;
    
    // Left column
    leftSkills.forEach((skill) => {
      checkPageBreak(6);
      doc.setFillColor(...colors.secondary);
      doc.circle(margin + 3, y - 1.2, 1.2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      doc.text(skill, margin + 8, y);
      y += 6;
    });
    
    // Right column
    let rightY = startY;
    const rightX = pageWidth / 2 + 5;
    rightSkills.forEach((skill) => {
      doc.setFillColor(...colors.secondary);
      doc.circle(rightX + 3, rightY - 1.2, 1.2, "F");
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      doc.text(skill, rightX + 8, rightY);
      rightY += 6;
    });
    
    y = Math.max(y, rightY) + 2;
  }

  // Experience Section
  if (data.experience && data.experience.length > 0) {
    addSectionHeader("Professional Experience");
    
    data.experience.forEach((exp, index) => {
      checkPageBreak(25);
      
      // Job title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...colors.text);
      doc.text(exp.title, margin, y);
      
      // Duration on right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text(exp.duration, pageWidth - margin, y, { align: "right" });
      y += 5;
      
      // Company
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...colors.secondary);
      doc.text(exp.company, margin, y);
      y += 7;
      
      // Achievements
      exp.achievements.forEach((achievement) => {
        addBulletPoint(achievement);
      });
      
      if (index < data.experience.length - 1) {
        y += 5;
      }
    });
  }

  // Education Section
  if (data.education && data.education.length > 0) {
    addSectionHeader("Education");
    
    data.education.forEach((edu) => {
      checkPageBreak(15);
      
      // Degree
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.text);
      doc.text(edu.degree, margin, y);
      
      // Year on right
      if (edu.year) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.muted);
        doc.text(edu.year, pageWidth - margin, y, { align: "right" });
      }
      y += 5;
      
      // Institution
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...colors.secondary);
      doc.text(edu.institution, margin, y);
      y += 8;
    });
  }

  // Certifications Section
  if (data.certifications && data.certifications.length > 0) {
    addSectionHeader("Certifications");
    
    data.certifications.forEach((cert) => {
      addBulletPoint(cert);
    });
  }

  // Footer decoration
  doc.setFillColor(...colors.primary);
  doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

  return doc;
}

export function downloadCV(data: CVData, filename = "resume.pdf") {
  const doc = generateCVPdf(data);
  doc.save(filename);
}

// Parse CV content from AI response
export function parseCVFromText(text: string): CVData | null {
  try {
    // Look for name in the content
    const nameMatch = text.match(/^#?\s*\*?\*?([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)\*?\*?/m);
    const name = nameMatch ? nameMatch[1].replace(/\*/g, '').trim() : "Professional";

    // Extract email
    const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
    const email = emailMatch ? emailMatch[0] : undefined;

    // Extract phone
    const phoneMatch = text.match(/\+?[\d\s\-().]{10,}/);
    const phone = phoneMatch ? phoneMatch[0].trim() : undefined;

    // Extract summary
    const summaryMatch = text.match(/(?:Professional\s*Summary|Summary|Profile|About)[:\s]*\n?([\s\S]*?)(?=\n(?:Skills|Core|Experience|Education|Certifications|Technical)|$)/i);
    let summary = "";
    if (summaryMatch) {
      summary = summaryMatch[1]
        .replace(/\*+/g, '')
        .replace(/#+/g, '')
        .replace(/\n+/g, ' ')
        .trim()
        .slice(0, 600);
    }

    // Extract skills
    const skillsMatch = text.match(/(?:Skills|Technical Skills|Key Skills|Core Competencies)[:\s]*\n?([\s\S]*?)(?=\n(?:Experience|Education|Certifications|Professional Experience)|$)/i);
    let skills: string[] = [];
    if (skillsMatch) {
      const skillsText = skillsMatch[1];
      skills = skillsText
        .split(/[•\-*,\n|]/)
        .map(s => s.replace(/\*+/g, '').replace(/#+/g, '').trim())
        .filter(s => s.length > 1 && s.length < 50 && !s.includes(':'));
    }

    // Extract experience
    const experienceMatch = text.match(/(?:Experience|Work Experience|Professional Experience)[:\s]*\n?([\s\S]*?)(?=\n(?:Education|Certifications|Skills|References)|$)/i);
    const experience: CVData["experience"] = [];
    if (experienceMatch) {
      const expText = experienceMatch[1];
      const expBlocks = expText.split(/\n(?=\*\*|###)/);
      
      expBlocks.forEach(block => {
        if (block.trim().length < 20) return;
        
        const titleMatch = block.match(/\*\*(.+?)\*\*/) || block.match(/###\s*(.+)/);
        const companyMatch = block.match(/(?:at\s+|@\s*|\|\s*|,\s*)([^|\n(]+?)(?:\s*\(|\s*\||$)/i);
        const durationMatch = block.match(/\(([^)]+)\)/) || block.match(/(\d{4}\s*[-–]\s*(?:\d{4}|Present|Current))/i);
        
        const achievements = block
          .split(/\n/)
          .filter(line => line.match(/^[\s]*[•\-*]\s+/))
          .map(a => a.replace(/^[\s]*[•\-*]\s+/, '').replace(/\*+/g, '').trim())
          .filter(a => a.length > 15);
        
        if ((titleMatch || achievements.length > 0) && achievements.length > 0) {
          experience.push({
            title: titleMatch ? titleMatch[1].replace(/\*/g, '').trim() : "Position",
            company: companyMatch ? companyMatch[1].trim() : "Company",
            duration: durationMatch ? durationMatch[1].trim() : "Present",
            achievements: achievements.slice(0, 6),
          });
        }
      });
    }

    // Extract education
    const educationMatch = text.match(/(?:Education)[:\s]*\n?([\s\S]*?)(?=\n(?:Certifications|Skills|Experience|References)|$)/i);
    const education: CVData["education"] = [];
    if (educationMatch) {
      const eduText = educationMatch[1];
      const degreeMatch = eduText.match(/\*\*(.+?)\*\*/) || eduText.match(/([A-Z][^,\n]+(?:Degree|Bachelor|Master|PhD|MBA|BS|BA|MS|MA)[^,\n]*)/i);
      const institutionMatch = eduText.match(/(?:from|at|,)\s*([^,\n(]+)/i);
      const yearMatch = eduText.match(/(\d{4})/);
      
      if (degreeMatch) {
        education.push({
          degree: degreeMatch[1].replace(/\*/g, '').trim(),
          institution: institutionMatch ? institutionMatch[1].trim() : "University",
          year: yearMatch ? yearMatch[1] : "",
        });
      }
    }

    // Extract certifications
    const certMatch = text.match(/(?:Certifications?)[:\s]*\n?([\s\S]*?)(?=\n(?:Skills|Experience|Education|References)|$)/i);
    let certifications: string[] = [];
    if (certMatch) {
      certifications = certMatch[1]
        .split(/\n/)
        .filter(line => line.match(/^[\s]*[•\-*]\s+/) || line.match(/^[A-Z]/))
        .map(c => c.replace(/^[\s]*[•\-*]\s+/, '').replace(/\*+/g, '').trim())
        .filter(c => c.length > 5 && c.length < 100);
    }

    // Only return if we have meaningful content
    if (summary || skills.length > 0 || experience.length > 0) {
      return {
        name,
        email,
        phone,
        summary,
        skills: skills.slice(0, 15),
        experience: experience.slice(0, 5),
        education,
        certifications: certifications.slice(0, 5),
      };
    }

    return null;
  } catch (error) {
    console.error("Error parsing CV:", error);
    return null;
  }
}

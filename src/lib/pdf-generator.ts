import jsPDF from "jspdf";

export interface CVData {
  name: string;
  email?: string;
  phone?: string;
  location?: string;
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
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 25;

  // Colors
  const primaryColor: [number, number, number] = [45, 106, 108]; // Teal
  const textColor: [number, number, number] = [30, 41, 59]; // Slate
  const mutedColor: [number, number, number] = [100, 116, 139];

  // Helper functions
  const addSection = (title: string) => {
    if (y > 260) {
      doc.addPage();
      y = 25;
    }
    y += 8;
    doc.setFillColor(...primaryColor);
    doc.rect(margin, y, contentWidth, 0.5, "F");
    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text(title.toUpperCase(), margin, y);
    y += 8;
    doc.setTextColor(...textColor);
  };

  const addText = (text: string, isBold = false, fontSize = 10) => {
    if (y > 275) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * (fontSize * 0.4) + 2;
  };

  const addBullet = (text: string) => {
    if (y > 275) {
      doc.addPage();
      y = 25;
    }
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("•", margin + 2, y);
    const lines = doc.splitTextToSize(text, contentWidth - 10);
    doc.text(lines, margin + 8, y);
    y += lines.length * 4 + 2;
  };

  // Header - Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(...primaryColor);
  doc.text(data.name, pageWidth / 2, y, { align: "center" });
  y += 10;

  // Contact Info
  const contactParts: string[] = [];
  if (data.email) contactParts.push(data.email);
  if (data.phone) contactParts.push(data.phone);
  if (data.location) contactParts.push(data.location);
  
  if (contactParts.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...mutedColor);
    doc.text(contactParts.join("  |  "), pageWidth / 2, y, { align: "center" });
    y += 8;
  }

  // Professional Summary
  if (data.summary) {
    addSection("Professional Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const summaryLines = doc.splitTextToSize(data.summary, contentWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 4 + 4;
  }

  // Skills
  if (data.skills && data.skills.length > 0) {
    addSection("Skills");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    const skillsText = data.skills.join("  •  ");
    const skillLines = doc.splitTextToSize(skillsText, contentWidth);
    doc.text(skillLines, margin, y);
    y += skillLines.length * 4 + 4;
  }

  // Experience
  if (data.experience && data.experience.length > 0) {
    addSection("Professional Experience");
    data.experience.forEach((exp) => {
      if (y > 260) {
        doc.addPage();
        y = 25;
      }
      // Title and Company
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...textColor);
      doc.text(exp.title, margin, y);
      
      // Duration on right
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...mutedColor);
      doc.text(exp.duration, pageWidth - margin, y, { align: "right" });
      y += 5;

      // Company
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.setTextColor(...mutedColor);
      doc.text(exp.company, margin, y);
      y += 6;

      // Achievements
      doc.setTextColor(...textColor);
      exp.achievements.forEach((achievement) => {
        addBullet(achievement);
      });
      y += 4;
    });
  }

  // Education
  if (data.education && data.education.length > 0) {
    addSection("Education");
    data.education.forEach((edu) => {
      if (y > 270) {
        doc.addPage();
        y = 25;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...textColor);
      doc.text(edu.degree, margin, y);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...mutedColor);
      doc.text(edu.year, pageWidth - margin, y, { align: "right" });
      y += 5;

      doc.setFont("helvetica", "italic");
      doc.text(edu.institution, margin, y);
      y += 8;
    });
  }

  // Certifications
  if (data.certifications && data.certifications.length > 0) {
    addSection("Certifications");
    data.certifications.forEach((cert) => {
      addBullet(cert);
    });
  }

  return doc;
}

export function downloadCV(data: CVData, filename = "resume.pdf") {
  const doc = generateCVPdf(data);
  doc.save(filename);
}

// Parse CV content from AI response
export function parseCVFromText(text: string): CVData | null {
  try {
    // Look for structured CV content
    const nameMatch = text.match(/^#?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+)+)/m);
    const name = nameMatch ? nameMatch[1].trim() : "Your Name";

    // Extract summary
    const summaryMatch = text.match(/(?:Professional\s*Summary|Summary|Profile)[:\s]*\n?([\s\S]*?)(?=\n(?:Skills|Experience|Education|Certifications)|$)/i);
    const summary = summaryMatch ? summaryMatch[1].trim().replace(/^\*+|\*+$/g, '').replace(/\n+/g, ' ').slice(0, 500) : "";

    // Extract skills
    const skillsMatch = text.match(/(?:Skills|Technical Skills|Key Skills)[:\s]*\n?([\s\S]*?)(?=\n(?:Experience|Education|Certifications|Professional)|$)/i);
    let skills: string[] = [];
    if (skillsMatch) {
      const skillsText = skillsMatch[1];
      skills = skillsText
        .split(/[•\-,\n]/)
        .map(s => s.replace(/\*+/g, '').trim())
        .filter(s => s.length > 0 && s.length < 50);
    }

    // Extract experience
    const experienceMatch = text.match(/(?:Experience|Work Experience|Professional Experience)[:\s]*\n?([\s\S]*?)(?=\n(?:Education|Certifications|Skills)|$)/i);
    const experience: CVData["experience"] = [];
    if (experienceMatch) {
      const expLines = experienceMatch[1].split(/\n(?=\*\*|#{2,3})/);
      expLines.forEach(block => {
        const titleMatch = block.match(/\*\*(.+?)\*\*/);
        const companyMatch = block.match(/(?:at|@|,)\s*(.+?)(?:\(|\||–|-|$)/i);
        const achievements = block
          .split(/[•\-]\s+/)
          .slice(1)
          .map(a => a.replace(/\*+/g, '').trim())
          .filter(a => a.length > 10);
        
        if (titleMatch || achievements.length > 0) {
          experience.push({
            title: titleMatch ? titleMatch[1].trim() : "Position",
            company: companyMatch ? companyMatch[1].trim() : "Company",
            duration: "Present",
            achievements: achievements.slice(0, 5),
          });
        }
      });
    }

    // Extract education
    const educationMatch = text.match(/(?:Education)[:\s]*\n?([\s\S]*?)(?=\n(?:Certifications|Skills|Experience)|$)/i);
    const education: CVData["education"] = [];
    if (educationMatch) {
      const eduText = educationMatch[1];
      const degreeMatch = eduText.match(/\*\*(.+?)\*\*/);
      const institutionMatch = eduText.match(/(?:at|from|,)\s*(.+?)(?:\(|\||–|-|\n|$)/i);
      
      if (degreeMatch) {
        education.push({
          degree: degreeMatch[1].trim(),
          institution: institutionMatch ? institutionMatch[1].trim() : "University",
          year: "",
        });
      }
    }

    // Only return if we have meaningful content
    if (summary || skills.length > 0 || experience.length > 0) {
      return {
        name,
        summary,
        skills: skills.slice(0, 15),
        experience: experience.slice(0, 5),
        education,
      };
    }

    return null;
  } catch (error) {
    console.error("Error parsing CV:", error);
    return null;
  }
}

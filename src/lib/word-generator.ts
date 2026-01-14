import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, Table, TableRow, TableCell, WidthType } from "docx";
import { saveAs } from "file-saver";
import { CVData } from "./pdf-generator";

export async function generateCVWord(data: CVData): Promise<Blob> {
  const primaryColor = "1E5055"; // Deep teal

  const doc = new Document({
    styles: {
      default: {
        heading1: {
          run: {
            size: 56,
            bold: true,
            color: primaryColor,
          },
        },
        heading2: {
          run: {
            size: 24,
            bold: true,
            color: primaryColor,
          },
          paragraph: {
            spacing: { before: 300, after: 100 },
          },
        },
      },
    },
    sections: [
      {
        properties: {},
        children: [
          // Name
          new Paragraph({
            children: [
              new TextRun({
                text: data.name.toUpperCase(),
                bold: true,
                size: 56,
                color: primaryColor,
              }),
            ],
            spacing: { after: 100 },
          }),

          // Contact Info
          new Paragraph({
            children: [
              ...(data.email ? [new TextRun({ text: data.email, size: 20, color: "666666" }), new TextRun({ text: "  •  ", size: 20, color: "AAAAAA" })] : []),
              ...(data.phone ? [new TextRun({ text: data.phone, size: 20, color: "666666" }), new TextRun({ text: "  •  ", size: 20, color: "AAAAAA" })] : []),
              ...(data.location ? [new TextRun({ text: data.location, size: 20, color: "666666" })] : []),
            ],
            spacing: { after: 300 },
          }),

          // Summary Section
          ...(data.summary ? [
            createSectionHeader("PROFESSIONAL SUMMARY"),
            new Paragraph({
              children: [
                new TextRun({
                  text: data.summary,
                  size: 22,
                  italics: true,
                }),
              ],
              spacing: { after: 200 },
            }),
          ] : []),

          // Skills Section
          ...(data.skills && data.skills.length > 0 ? [
            createSectionHeader("CORE COMPETENCIES"),
            new Paragraph({
              children: data.skills.map((skill, index) => 
                new TextRun({
                  text: index < data.skills.length - 1 ? `${skill}  •  ` : skill,
                  size: 22,
                })
              ),
              spacing: { after: 200 },
            }),
          ] : []),

          // Experience Section
          ...(data.experience && data.experience.length > 0 ? [
            createSectionHeader("PROFESSIONAL EXPERIENCE"),
            ...data.experience.flatMap((exp) => [
              new Paragraph({
                children: [
                  new TextRun({
                    text: exp.title,
                    bold: true,
                    size: 24,
                  }),
                  new TextRun({
                    text: `  |  ${exp.company}`,
                    size: 22,
                    color: primaryColor,
                  }),
                  new TextRun({
                    text: `  (${exp.duration})`,
                    size: 20,
                    color: "888888",
                  }),
                ],
                spacing: { before: 150, after: 80 },
              }),
              ...exp.achievements.map((achievement) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: `•  ${achievement}`,
                      size: 22,
                    }),
                  ],
                  indent: { left: 360 },
                  spacing: { after: 60 },
                })
              ),
            ]),
          ] : []),

          // Education Section
          ...(data.education && data.education.length > 0 ? [
            createSectionHeader("EDUCATION"),
            ...data.education.map((edu) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: edu.degree,
                    bold: true,
                    size: 22,
                  }),
                  new TextRun({
                    text: `  |  ${edu.institution}`,
                    size: 22,
                    color: primaryColor,
                  }),
                  ...(edu.year ? [new TextRun({
                    text: `  (${edu.year})`,
                    size: 20,
                    color: "888888",
                  })] : []),
                ],
                spacing: { after: 80 },
              })
            ),
          ] : []),

          // Certifications Section
          ...(data.certifications && data.certifications.length > 0 ? [
            createSectionHeader("CERTIFICATIONS"),
            ...data.certifications.map((cert) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: `•  ${cert}`,
                    size: 22,
                  }),
                ],
                indent: { left: 360 },
                spacing: { after: 60 },
              })
            ),
          ] : []),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}

function createSectionHeader(title: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: title,
        bold: true,
        size: 26,
        color: "1E5055",
      }),
    ],
    border: {
      bottom: {
        color: "2D6E73",
        space: 1,
        style: BorderStyle.SINGLE,
        size: 12,
      },
    },
    spacing: { before: 300, after: 150 },
  });
}

export async function downloadCVAsWord(data: CVData, filename = "resume.docx") {
  const blob = await generateCVWord(data);
  saveAs(blob, filename);
}

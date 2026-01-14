import { CVData } from "@/lib/pdf-generator";
import { User, Mail, Phone, MapPin, Linkedin, Briefcase, GraduationCap, Award, Lightbulb } from "lucide-react";

interface CVPreviewProps {
  data: CVData | null;
}

export function CVPreview({ data }: CVPreviewProps) {
  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-8 text-muted-foreground">
        <div className="w-16 h-16 rounded-full bg-accent/50 flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-muted-foreground/50" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">Your CV Preview</h3>
        <p className="text-sm max-w-xs">
          Start chatting with the AI assistant to build your CV. It will appear here in real-time as you provide your information.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="bg-white text-slate-800 min-h-full shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 to-teal-600 text-white p-6">
          <h1 className="text-2xl font-bold tracking-wide">{data.name.toUpperCase()}</h1>
          {data.experience?.[0]?.title && (
            <p className="text-teal-100 text-sm mt-1">{data.experience[0].title}</p>
          )}
          
          {/* Contact Info */}
          <div className="flex flex-wrap gap-3 mt-4 text-xs text-teal-100">
            {data.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3" />
                {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {data.phone}
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {data.location}
              </span>
            )}
            {data.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3" />
                {data.linkedin}
              </span>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Summary */}
          {data.summary && (
            <section>
              <SectionHeader icon={<Lightbulb className="w-4 h-4" />} title="Professional Summary" />
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg italic">
                {data.summary}
              </p>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <SectionHeader icon={<Award className="w-4 h-4" />} title="Core Competencies" />
              <div className="flex flex-wrap gap-2">
                {data.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-teal-50 text-teal-700 text-xs rounded-md border border-teal-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <SectionHeader icon={<Briefcase className="w-4 h-4" />} title="Professional Experience" />
              <div className="space-y-4">
                {data.experience.map((exp, idx) => (
                  <div key={idx} className="border-l-2 border-teal-200 pl-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm text-slate-800">{exp.title}</h4>
                      <span className="text-xs text-slate-500">{exp.duration}</span>
                    </div>
                    <p className="text-sm text-teal-600 italic">{exp.company}</p>
                    {exp.achievements.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {exp.achievements.map((achievement, aIdx) => (
                          <li key={aIdx} className="text-xs text-slate-600 flex gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <SectionHeader icon={<GraduationCap className="w-4 h-4" />} title="Education" />
              <div className="space-y-2">
                {data.education.map((edu, idx) => (
                  <div key={idx} className="border-l-2 border-teal-200 pl-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-semibold text-sm text-slate-800">{edu.degree}</h4>
                      {edu.year && <span className="text-xs text-slate-500">{edu.year}</span>}
                    </div>
                    <p className="text-sm text-teal-600 italic">{edu.institution}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <SectionHeader icon={<Award className="w-4 h-4" />} title="Certifications" />
              <ul className="space-y-1">
                {data.certifications.map((cert, idx) => (
                  <li key={idx} className="text-xs text-slate-600 flex gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 flex-shrink-0" />
                    {cert}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="h-2 bg-gradient-to-r from-teal-700 to-teal-600" />
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-teal-600">{icon}</span>
      <h3 className="text-sm font-bold text-teal-700 uppercase tracking-wide">{title}</h3>
      <div className="flex-1 h-px bg-teal-200" />
    </div>
  );
}

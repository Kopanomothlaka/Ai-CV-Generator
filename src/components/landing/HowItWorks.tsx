import { Upload, MessageSquare, Download } from "lucide-react";

const steps = [
  {
    icon: <Upload className="w-6 h-6" />,
    step: "01",
    title: "Upload Job Description",
    description: "Paste or upload the job posting you're targeting. Our AI analyzes requirements, skills, and keywords.",
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    step: "02", 
    title: "Answer Questions",
    description: "Chat with our AI assistant to share your experience, skills, and achievements at your own pace.",
  },
  {
    icon: <Download className="w-6 h-6" />,
    step: "03",
    title: "Get Your CV",
    description: "Receive a professionally formatted, ATS-optimized CV tailored specifically for your target role.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Three simple steps to your perfect CV
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-[60%] w-full h-px bg-border" />
              )}
              
              <div className="relative bg-card rounded-2xl p-8 border border-border/50 shadow-soft">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl hero-gradient flex items-center justify-center text-primary-foreground">
                    {item.icon}
                  </div>
                  <span className="text-4xl font-display font-bold text-primary/20">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

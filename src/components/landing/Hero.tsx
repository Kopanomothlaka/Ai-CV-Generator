import { FileText, Sparkles, Target } from "lucide-react";

export function Hero() {
  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 subtle-gradient" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="max-w-3xl mx-auto text-center mb-16 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 text-accent-foreground text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered CV Generation
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-6 leading-tight">
            Craft Your Perfect CV in{" "}
            <span className="text-primary">Minutes</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload a job description, answer a few questions, and let AI create a 
            tailored, ATS-optimized resume that gets you noticed.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
          <FeatureCard
            icon={<FileText className="w-6 h-6" />}
            title="Smart Analysis"
            description="AI extracts key requirements from any job description"
          />
          <FeatureCard
            icon={<Target className="w-6 h-6" />}
            title="ATS Optimized"
            description="Keyword-rich CVs that pass automated screening"
          />
          <FeatureCard
            icon={<Sparkles className="w-6 h-6" />}
            title="Personalized"
            description="Tailored content based on your unique experience"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl bg-card border border-border/50 shadow-soft hover:shadow-card transition-all duration-300 animate-fade-up">
      <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

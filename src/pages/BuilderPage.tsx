import { Header } from "@/components/landing/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Footer } from "@/components/landing/Footer";
import { FileText, Sparkles, Shield, Zap, FileDown } from "lucide-react";

const BuilderPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 py-8 lg:py-12">
        <div className="container">
          {/* Page Header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 text-accent-foreground text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              AI-Powered CV Creation
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-3">
              Build Your Perfect CV
            </h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Chat with our AI assistant to create a tailored, ATS-optimized resume
            </p>
          </div>

          {/* Features Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <FeaturePill icon={<FileText className="w-3.5 h-3.5" />} text="Professional Format" />
            <FeaturePill icon={<Shield className="w-3.5 h-3.5" />} text="ATS Optimized" />
            <FeaturePill icon={<Zap className="w-3.5 h-3.5" />} text="Instant PDF & Word Export" />
            <FeaturePill icon={<FileDown className="w-3.5 h-3.5" />} text="Download Anytime" />
          </div>

          {/* Chat Interface - Full Width */}
          <div className="max-w-4xl mx-auto">
            <ChatInterface />
          </div>
          {/* Tips Section */}
          <div className="max-w-2xl mx-auto mt-12 text-center">
            <h3 className="font-semibold text-foreground mb-4">💡 Tips for Best Results</h3>
            <div className="grid sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <strong className="text-foreground block mb-1">Be Specific</strong>
                Include exact numbers and achievements
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <strong className="text-foreground block mb-1">Use Keywords</strong>
                Match terms from the job description
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50">
                <strong className="text-foreground block mb-1">Say "Create my CV"</strong>
                When you're ready to generate
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

function FeaturePill({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
      {icon}
      {text}
    </div>
  );
}

export default BuilderPage;

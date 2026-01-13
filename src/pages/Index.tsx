import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />

        {/* CTA Section */}
        <section className="py-16 bg-card/50">
          <div className="container text-center">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-4">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Start creating your professional CV in minutes with our AI-powered assistant
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Link to="/builder">
                <Button size="lg" className="gap-2 hero-gradient border-0 text-primary-foreground hover:opacity-90 px-8">
                  Start Building Your CV
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Free to use
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                No signup required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                Instant PDF download
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

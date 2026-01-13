import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <Hero />
        
        <section id="features" className="py-12 pb-20">
          <div className="container max-w-4xl">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
                Start Building Your CV
              </h2>
              <p className="text-muted-foreground">
                Chat with our AI assistant to create your tailored resume
              </p>
            </div>
            <ChatInterface />
          </div>
        </section>

        <HowItWorks />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

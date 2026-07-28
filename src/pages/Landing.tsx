import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { Lightbulb, Target, Rocket, ArrowRight } from "lucide-react";

const LandingSkeleton = () => (
  <div className="w-full flex flex-col items-center">
    {/* Hero Skeleton */}
    <section className="relative w-full py-24 md:py-32 lg:py-40 flex justify-center text-center px-4 min-h-[600px] z-10">
      <div className="w-full max-w-4xl space-y-8 glass-panel p-10 md:p-14 rounded-[40px] flex flex-col items-center">
        <div className="w-64 h-8 rounded-full bg-foreground/10 dark:bg-white/10 animate-pulse mb-4"></div>
        <div className="w-full max-w-3xl h-20 md:h-24 bg-foreground/10 dark:bg-white/10 rounded-2xl animate-pulse"></div>
        <div className="w-3/4 max-w-2xl h-10 bg-foreground/10 dark:bg-white/10 rounded-xl animate-pulse mt-4"></div>
        <div className="flex flex-col sm:flex-row gap-6 pt-6 w-full justify-center mt-4">
          <div className="w-48 h-14 bg-foreground/10 dark:bg-white/10 rounded-full animate-pulse"></div>
          <div className="w-48 h-14 bg-foreground/10 dark:bg-white/10 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>

    {/* Features Skeleton */}
    <section className="relative w-full py-24 px-4 border-t border-foreground/10 dark:border-white/10 z-10">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-16 space-y-4 flex flex-col items-center">
          <div className="w-80 h-10 bg-foreground/10 dark:bg-white/10 rounded-xl animate-pulse"></div>
          <div className="w-full max-w-2xl h-6 bg-foreground/10 dark:bg-white/10 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="glass-panel p-8 rounded-[28px] h-full flex flex-col border-0">
              <div className="w-14 h-14 rounded-2xl bg-foreground/10 dark:bg-white/10 animate-pulse mb-6"></div>
              <div className="w-40 h-6 bg-foreground/10 dark:bg-white/10 animate-pulse rounded-md mb-4"></div>
              <div className="w-full h-24 bg-foreground/10 dark:bg-white/10 animate-pulse rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export function Landing() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let vantaEffect: any;
    const initVanta = () => {
      if ((window as any).VANTA && vantaRef.current) {
        vantaEffect = (window as any).VANTA.GLOBE({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x5b4aa6,
          size: 1.10,
          backgroundColor: 0x000000,
          backgroundColorAlpha: 0
        });
      }
      // Give a tiny delay for vanta to render its first frame to avoid flashing
      setTimeout(() => setIsLoading(false), 150);
    };

    // Since scripts might load asynchronously in React, we might need to wait or check
    if ((window as any).VANTA) {
       initVanta();
    } else {
       // simple polling if not loaded yet
       const timer = setInterval(() => {
         if ((window as any).VANTA) {
           clearInterval(timer);
           initVanta();
         }
       }, 100);
       setTimeout(() => {
         clearInterval(timer);
         setIsLoading(false);
       }, 2000); // stop polling after 2s and show page anyway
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div className="flex-1 flex flex-col items-center relative overflow-hidden bg-transparent w-full">
      {/* Vanta Background Container */}
      <div ref={vantaRef} className="absolute inset-0 z-0 min-h-[600px] h-[800px] w-full" />
      
      {isLoading ? (
        <div className="relative z-10 w-full flex-1">
          <LandingSkeleton />
        </div>
      ) : (
        <div className="relative z-10 w-full flex flex-col items-center flex-1 animate-in fade-in duration-500">
          {/* Hero Section */}
          <section className="relative w-full py-24 md:py-32 lg:py-40 flex justify-center text-center px-4 overflow-hidden min-h-[600px] bg-transparent z-10">
            <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 glass-panel p-10 md:p-14 rounded-[40px]">
          <div className="inline-flex items-center rounded-full border border-foreground/10 dark:border-white/30 bg-surface/50 dark:bg-white/10 px-4 py-1.5 text-sm font-medium text-foreground dark:text-white shadow-sm backdrop-blur-md mb-4">
            <span>Imagine. Innovate. Impact.</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground dark:text-white balance-text leading-[1.1] drop-shadow-md">
            Turn rough ideas into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-200 dark:to-indigo-200">competition-ready</span> projects.
          </h1>
          <p className="text-xl text-foreground/80 dark:text-white/90 max-w-2xl mx-auto balance-text leading-relaxed font-light">
            BloopLabs is an AI-powered innovation platform that helps students frame, validate, and structure their ideas into polished submissions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
            <Link to="/new">
              <button className="glass-button px-8 py-4 rounded-full text-lg font-medium flex items-center gap-2 group shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]">
                Start Building Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/dashboard">
              <button className="glass-button px-8 py-4 rounded-full text-lg font-medium bg-foreground/5 hover:bg-foreground/10 dark:bg-white/5 dark:hover:bg-white/10 shadow-sm">
                View Dashboard
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative w-full py-24 px-4 border-t border-white/10 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground dark:text-white drop-shadow-sm">Everything you need to innovate</h2>
            <p className="text-lg text-foreground/80 dark:text-white/80 max-w-2xl mx-auto font-light">
              From the initial spark to the final pitch, BloopLabs guides you through every step of the scientific and creative process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-panel p-8 rounded-[28px] h-full flex flex-col transition-all hover:-translate-y-2 duration-300 border border-white/10 dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-white/20 flex items-center justify-center text-primary dark:text-white mb-6 shadow-sm backdrop-blur-md">
                <Lightbulb size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3 drop-shadow-sm">AI Research</h3>
              <p className="text-foreground/80 dark:text-white/80 leading-relaxed font-light">
                Describe your rough concept in plain English. Our AI analyzes its feasibility, uniqueness, and potential impact instantly.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-[28px] h-full flex flex-col transition-all hover:-translate-y-2 duration-300 border border-white/10 dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-white/20 flex items-center justify-center text-primary dark:text-white mb-6 shadow-sm backdrop-blur-md">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3 drop-shadow-sm">Project Builder</h3>
              <p className="text-foreground/80 dark:text-white/80 leading-relaxed font-light">
                Automatically generate structured problem statements, methodologies, material lists, and expected outcomes formatted for science fairs.
              </p>
            </div>

            <div className="glass-panel p-8 rounded-[28px] h-full flex flex-col transition-all hover:-translate-y-2 duration-300 border border-white/10 dark:border-white/10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 dark:bg-white/20 flex items-center justify-center text-primary dark:text-white mb-6 shadow-sm backdrop-blur-md">
                <Rocket size={28} />
              </div>
              <h3 className="text-xl font-semibold text-foreground dark:text-white mb-3 drop-shadow-sm">Innovation Mentor</h3>
              <p className="text-foreground/80 dark:text-white/80 leading-relaxed font-light">
                Get actionable suggestions on how to improve your idea, make it more competitive, and pitch it effectively to judges or teachers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="about" className="relative w-full py-24 px-4 z-10 text-foreground dark:text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight drop-shadow-sm">How it works</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-foreground/10 dark:bg-white/20 text-foreground dark:text-white font-semibold flex items-center justify-center shrink-0 backdrop-blur-md shadow-sm">1</div>
                  <div className="w-0.5 h-full bg-foreground/10 dark:bg-white/20 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h3 className="text-xl font-semibold mb-2">Describe your idea</h3>
                  <p className="text-foreground/80 dark:text-white/80 font-light">Answer a few simple questions about your concept, target audience, and grade level.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold flex items-center justify-center shrink-0 shadow-sm backdrop-blur-md">2</div>
                  <div className="w-0.5 h-full bg-foreground/10 dark:bg-white/20 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h3 className="text-xl font-semibold mb-2">AI improves it</h3>
                  <p className="text-foreground/80 dark:text-white/80 font-light">Our engine structures your idea, writes professional problem statements, and suggests materials.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-foreground/10 dark:bg-white/20 text-foreground dark:text-white font-semibold flex items-center justify-center shrink-0 backdrop-blur-md shadow-sm">3</div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Export & Submit</h3>
                  <p className="text-foreground/80 dark:text-white/80 font-light">Review your polished project brief, edit as needed, and export it ready for your competition or assignment.</p>
                </div>
              </div>
            </div>
            
            <Link to="/new" className="inline-block mt-4">
              <button className="glass-button px-6 py-3 rounded-full text-base font-medium">Try it now</button>
            </Link>
          </div>
          
          <div className="flex-1 w-full max-w-lg aspect-square glass-panel rounded-3xl p-8 relative overflow-hidden shadow-sm">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
             <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
             
             <div className="relative h-full flex flex-col gap-4 z-10">
                <div className="w-3/4 h-8 bg-foreground/10 dark:bg-white/20 rounded-lg animate-pulse backdrop-blur-sm"></div>
                <div className="w-full h-24 bg-surface/50 dark:bg-white/10 rounded-xl mt-4 backdrop-blur-sm border border-foreground/10 dark:border-white/10"></div>
                
                <div className="mt-8 space-y-4">
                  <div className="w-1/2 h-6 bg-foreground/10 dark:bg-white/20 rounded-md backdrop-blur-sm"></div>
                  <div className="w-full h-12 bg-surface/50 dark:bg-white/10 rounded-lg backdrop-blur-sm border border-foreground/10 dark:border-white/10"></div>
                  <div className="w-5/6 h-12 bg-surface/50 dark:bg-white/10 rounded-lg backdrop-blur-sm border border-foreground/10 dark:border-white/10"></div>
                  <div className="w-full h-12 bg-surface/50 dark:bg-white/10 rounded-lg backdrop-blur-sm border border-foreground/10 dark:border-white/10"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-12 px-4 border-t border-foreground/10 dark:border-white/10 z-10 bg-surface/50 dark:bg-slate-950/50 backdrop-blur-lg pb-32 md:pb-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-foreground dark:text-white tracking-tight">BloopLabs</h3>
            <p className="text-foreground/60 dark:text-white/60 text-sm font-light">Empowering students to build competition-ready projects with AI.</p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-foreground/60 dark:text-white/60 font-light">
              <li><Link to="/mentor" className="hover:text-foreground dark:hover:text-white transition-colors">AI Tools</Link></li>
              <li><Link to="/export" className="hover:text-foreground dark:hover:text-white transition-colors">Export Center</Link></li>
              <li><Link to="/dashboard" className="hover:text-foreground dark:hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-foreground/60 dark:text-white/60 font-light">
              <li><Link to="/help" className="hover:text-foreground dark:hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/help" className="hover:text-foreground dark:hover:text-white transition-colors">Tutorials</Link></li>
              <li><Link to="/contact" className="hover:text-foreground dark:hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground dark:text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-foreground/60 dark:text-white/60 font-light">
              <li><Link to="/legal#privacy" className="hover:text-foreground dark:hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal#terms" className="hover:text-foreground dark:hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/legal#cookie" className="hover:text-foreground dark:hover:text-white transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-foreground/10 dark:border-white/10 text-center text-sm text-foreground/40 dark:text-white/40 font-light">
          &copy; {new Date().getFullYear()} BloopLabs. All rights reserved.
        </div>
      </footer>
        </div>
      )}
    </div>
  );
}

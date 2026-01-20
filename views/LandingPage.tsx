
import React from 'react';
import { Dna, ArrowRight, ShieldCheck, Zap, BrainCircuit, Search } from 'lucide-react';

interface LandingPageProps {
  onEnterDashboard: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md z-50 border-b border-slate-100 px-6 lg:px-20 flex items-center justify-between">
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity group"
          title="Go to Home"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
            <Dna className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-slate-900 tracking-tight">GenomicsXAI</span>
        </button>
        <button 
          onClick={onEnterDashboard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 px-6 rounded-xl transition-all duration-300 shadow-lg shadow-indigo-200 flex items-center gap-2"
        >
          Open Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 lg:px-20 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold border border-indigo-100">
              <Zap className="w-4 h-4" />
              Next-Gen Genomic Intelligence
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1]">
              Demystifying Genomics with <span className="text-indigo-600">Explainable AI</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
              Our system bridges the gap between complex genomic data and human-understandable insights, 
              empowering researchers with transparent, high-fidelity analysis pipelines.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button onClick={onEnterDashboard} className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-xl">
                Get Started Now
              </button>
              <button className="bg-white hover:bg-slate-50 text-slate-900 font-bold py-4 px-8 rounded-2xl border-2 border-slate-100 transition-all">
                Read Whitepaper
              </button>
            </div>
          </div>
          <div className="relative animate-in fade-in zoom-in duration-1000">
             <div className="absolute -inset-4 bg-indigo-500/10 rounded-[3rem] blur-3xl"></div>
             <img 
               src="https://picsum.photos/seed/science/800/600" 
               className="relative rounded-[2rem] shadow-2xl border border-slate-200 transform lg:rotate-2 hover:rotate-0 transition-transform duration-500" 
               alt="AI visualization"
             />
          </div>
        </div>
      </section>

      {/* XAI Section */}
      <section className="py-24 bg-slate-50 px-6 lg:px-20 border-y border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Understanding XAI in Genomics</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We don't just provide answers; we show you the evidence behind every discovery.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="text-blue-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">What is XAI?</h3>
              <p className="text-slate-600 leading-relaxed">
                Explainable Artificial Intelligence (XAI) is a set of tools and frameworks that help human researchers understand and interpret predictions made by machine learning models. In genomics, this means visualizing why a specific gene was flagged.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Search className="text-indigo-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">How it Works</h3>
              <p className="text-slate-600 leading-relaxed">
                Our platform uses SHAP and LIME values to attribute feature importance across single-cell datasets. By mapping model decisions back to biological pathways, we provide a clear audit trail for clinical validation.
              </p>
            </div>

            <div className="bg-white p-10 rounded-3xl shadow-sm border border-slate-200 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-emerald-600 w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">How to Use</h3>
              <p className="text-slate-600 leading-relaxed">
                Simply upload your raw genomic files (FASTQ/BAM) and select your study focus. Our automated pipeline runs the analysis and provides an interactive "Insight Map" that explains every classification result.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-20 text-center text-slate-400 text-sm">
        <p>© 2024 GenomicsXAI. Advancing Human-Centered Bio-Intelligence.</p>
      </footer>
    </div>
  );
};

export default LandingPage;

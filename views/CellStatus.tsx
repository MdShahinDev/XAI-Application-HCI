
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Zap, 
  Info, 
  Loader2, 
  Brain, 
  ChevronRight,
  HeartPulse,
  Thermometer,
  ZapOff
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface StatusMetric {
  id: string;
  label: string;
  value: string;
  subValue: string;
  status: 'optimal' | 'warning' | 'critical';
  icon: any;
}

interface CellStatusProps {
  onBack: () => void;
}

const CellStatus: React.FC<CellStatusProps> = ({ onBack }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [reasoning, setReasoning] = useState<string | null>(null);

  const metrics: StatusMetric[] = [
    { 
      id: 'viability', 
      label: 'Overall Viability', 
      value: '94.2%', 
      subValue: '+2.1% from baseline', 
      status: 'optimal',
      icon: HeartPulse
    },
    { 
      id: 'mitochondrial', 
      label: 'Mito-Content', 
      value: '4.8%', 
      subValue: 'Normal respiratory profile', 
      status: 'optimal',
      icon: Thermometer
    },
    { 
      id: 'stress', 
      label: 'Stress Markers', 
      value: 'Moderate', 
      subValue: 'Cluster 3 elevation', 
      status: 'warning',
      icon: Zap
    },
    { 
      id: 'dropout', 
      label: 'Dropout Rate', 
      value: '12%', 
      subValue: 'Standard for 10x Genomics', 
      status: 'optimal',
      icon: ZapOff
    }
  ];

  const formatText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/^\s*[\*\-]\s+/gm, '• ').trim();
  };

  const fetchAIReasoning = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: "Analyze the experiment status. DO NOT use markdown symbols like asterisks for bolding or lists. Use plain, professional text only.",
        config: {
          systemInstruction: "You are an expert bioinformatician. Provide high-quality technical status reasoning. AVOID ALL MARKDOWN SYMBOLS like asterisks. Use standard professional punctuation and spacing."
        }
      });
      setReasoning(formatText(response.text || "Diagnostic reasoning unavailable."));
    } catch (e) {
      setReasoning("Error generating diagnostic reasoning. Please verify system connection.");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    fetchAIReasoning();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cell Status & Health Diagnostics</h1>
          <p className="text-slate-500 font-medium">Experiment: Single Cell Lung Adenocarcinoma (R-1024)</p>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100 uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4" /> Healthy Population
              </div>
              <h2 className="text-4xl font-black text-slate-900">Stable <span className="text-indigo-600">State</span></h2>
              <p className="text-slate-500 leading-relaxed">
                The overall transcriptomic integrity is high. Most cell populations exhibit normal metabolic activity with minimal artifactual stress signatures.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em]">Quick Metrics</h3>
              <div className="grid grid-cols-2 gap-4">
                {metrics.map((m) => (
                  <div key={m.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2">
                      <m.icon className={`w-4 h-4 ${m.status === 'optimal' ? 'text-emerald-500' : 'text-amber-500'}`} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{m.label}</span>
                    </div>
                    <p className="text-xl font-bold text-slate-900">{m.value}</p>
                    <p className="text-[9px] text-slate-400 mt-1">{m.subValue}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-[2rem] p-8 lg:p-10 shadow-2xl relative overflow-hidden flex flex-col min-h-[450px]">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="w-48 h-48 text-white" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">AI Status Reasoning</h3>
                  </div>
                  {isGenerating && <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />}
                </div>

                <div className="flex-1 space-y-6">
                  {isGenerating ? (
                    <div className="space-y-4 opacity-50">
                      <div className="h-4 bg-white/10 rounded w-full animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-[90%] animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-[95%] animate-pulse" />
                      <div className="h-4 bg-white/10 rounded w-[85%] animate-pulse" />
                    </div>
                  ) : (
                    <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                      <p className="whitespace-pre-wrap">{reasoning}</p>
                    </div>
                  )}

                  {!isGenerating && (
                    <div className="grid md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-white/5">
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase mb-1">Warning Flag</p>
                          <p className="text-[11px] text-slate-400">Cluster 3 shows specific enrichment of heat-shock proteins (HSPA1A), indicating focal stress.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="text-xs font-bold text-white uppercase mb-1">Quality Control</p>
                          <p className="text-[11px] text-slate-400">Low doublet detection probability (0.02) ensures population purity for this experiment.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8">
                  <button 
                    onClick={fetchAIReasoning}
                    className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 group"
                  >
                    Refresh Diagnostic Analysis
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-4">
        <span className="text-xs text-slate-400 italic">Last Updated: Today at 02:45 PM</span>
        <button className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-all border border-slate-200">
          Export Health Report
        </button>
      </div>
    </div>
  );
};

export default CellStatus;

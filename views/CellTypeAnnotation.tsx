
import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Tags, 
  MapPin, 
  Dna, 
  Brain, 
  Search, 
  ChevronRight, 
  Loader2, 
  Sparkles,
  Layers,
  Info,
  CheckCircle2,
  Fingerprint,
  Activity,
  BarChart3
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Annotation {
  id: string;
  cluster: string;
  cellType: string;
  organ: string;
  markerGene: string;
  confidence: number;
  features: { name: string; impact: number }[];
}

interface CellTypeAnnotationProps {
  onBack: () => void;
}

const CellTypeAnnotation: React.FC<CellTypeAnnotationProps> = ({ onBack }) => {
  const [selectedAnnotation, setSelectedAnnotation] = useState<Annotation | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<{ bio: string; model: string } | null>(null);

  const annotations: Annotation[] = [
    { 
      id: '1', cluster: 'Cluster 0', cellType: 'Alveolar Type II', organ: 'Lung', markerGene: 'SFTPC', confidence: 0.98,
      features: [{ name: 'SFTPC', impact: 95 }, { name: 'SFTPA1', impact: 82 }, { name: 'ABCA3', impact: 78 }, { name: 'LAMP3', impact: 65 }]
    },
    { 
      id: '2', cluster: 'Cluster 1', cellType: 'Ciliated Cells', organ: 'Lung', markerGene: 'CAPS', confidence: 0.94,
      features: [{ name: 'CAPS', impact: 92 }, { name: 'FOXJ1', impact: 88 }, { name: 'TP73', impact: 74 }, { name: 'SNTN', impact: 61 }]
    },
    { 
      id: '3', cluster: 'Cluster 2', cellType: 'Myeloid / Macrophages', organ: 'Lung', markerGene: 'MARCO', confidence: 0.91,
      features: [{ name: 'MARCO', impact: 89 }, { name: 'CD68', impact: 84 }, { name: 'LYZ', impact: 79 }, { name: 'CD163', impact: 72 }]
    },
    { 
      id: '4', cluster: 'Cluster 3', cellType: 'Fibroblasts', organ: 'Lung', markerGene: 'COL1A1', confidence: 0.89,
      features: [{ name: 'COL1A1', impact: 91 }, { name: 'DCN', impact: 85 }, { name: 'LUM', impact: 80 }, { name: 'PDGFRA', impact: 76 }]
    },
    { 
      id: '5', cluster: 'Cluster 4', cellType: 'T-Lymphocytes', organ: 'Lung', markerGene: 'CD3E', confidence: 0.96,
      features: [{ name: 'CD3E', impact: 97 }, { name: 'CD2', impact: 89 }, { name: 'TRAC', impact: 84 }, { name: 'CD247', impact: 81 }]
    }
  ];

  const formatText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/^\s*[\*\-]\s+/gm, '• ').trim();
  };

  const fetchExplanation = async (annotation: Annotation) => {
    setIsGenerating(true);
    setAiExplanation(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain the classification of Cluster ${annotation.cluster}. DO NOT use markdown symbols like asterisks for bolding or lists. Use plain, professional text only. Structure with 'BIOLOGICAL_EVIDENCE' and 'MODEL_INFERENCE' tags.`,
        config: {
          systemInstruction: "You are a lead computational biologist. Provide distinct explanations. AVOID ALL MARKDOWN SYMBOLS like asterisks. Use standard professional typography only."
        }
      });

      const fullText = response.text || "";
      const [bioPart, modelPart] = fullText.split('MODEL_INFERENCE');
      setAiExplanation({ 
        bio: formatText(bioPart.replace('BIOLOGICAL_EVIDENCE', '')), 
        model: formatText(modelPart || "Model inference details pending...") 
      });
    } catch (e) {
      setAiExplanation({ bio: "AI service error.", model: "Could not retrieve inference logic." });
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (annotations.length > 0 && !selectedAnnotation) {
      const initial = annotations[0];
      setSelectedAnnotation(initial);
      fetchExplanation(initial);
    }
  }, []);

  const handleSelect = (anno: Annotation) => {
    setSelectedAnnotation(anno);
    fetchExplanation(anno);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
        >
          <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Cell Type Annotation</h1>
          <p className="text-slate-500 font-medium">Pipeline: Automated Transcriptomic Mapping & XAI Reasoning</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Clusters
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-bold">5 TOTAL</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
              {annotations.map((anno) => (
                <button
                  key={anno.id}
                  onClick={() => handleSelect(anno)}
                  className={`w-full p-5 text-left transition-all flex items-center justify-between group ${
                    selectedAnnotation?.id === anno.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="space-y-1">
                    <p className={`text-sm font-bold transition-colors ${
                      selectedAnnotation?.id === anno.id ? 'text-indigo-600' : 'text-slate-900'
                    }`}>
                      {anno.cluster}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{anno.cellType}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${
                    selectedAnnotation?.id === anno.id ? 'text-indigo-600 translate-x-1' : 'text-slate-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          {selectedAnnotation ? (
            <>
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 lg:p-10">
                <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-full md:w-1/3 p-8 bg-slate-900 rounded-[2rem] text-white space-y-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                      <Fingerprint className="w-24 h-24" />
                    </div>
                    <div className="space-y-1 relative z-10">
                      <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Identified As</p>
                      <h2 className="text-3xl font-black leading-tight">{selectedAnnotation.cellType}</h2>
                    </div>
                    <div className="space-y-4 pt-4 border-t border-white/10 relative z-10">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-rose-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Organ Origin</p>
                          <p className="text-sm font-bold">{selectedAnnotation.organ}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Dna className="w-4 h-4 text-indigo-400" />
                        <div>
                          <p className="text-[9px] font-bold text-slate-500 uppercase">Primary Marker</p>
                          <p className="text-sm font-bold text-indigo-300">{selectedAnnotation.markerGene}</p>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                       <div className="flex justify-between items-end mb-2">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Model Confidence</span>
                         <span className="text-xl font-black text-emerald-400">{(selectedAnnotation.confidence * 100).toFixed(0)}%</span>
                       </div>
                       <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                         <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${selectedAnnotation.confidence * 100}%` }}></div>
                       </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight">Feature Influence Scores</h3>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      The AI model attributes classification weight across the following top-ranked genes from the cluster's expression profile.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedAnnotation.features.map((feat) => (
                        <div key={feat.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-all">
                          <div className="space-y-1">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">{feat.name}</span>
                            <div className="w-24 h-1 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500" style={{ width: `${feat.impact}%` }}></div>
                            </div>
                          </div>
                          <span className="text-sm font-bold text-slate-700">{feat.impact}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100">
                      <Activity className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 tracking-tight">Biological Evidence</h3>
                  </div>
                  <div className="min-h-[160px]">
                    {isGenerating ? (
                      <div className="space-y-3 opacity-50 animate-pulse">
                        <div className="h-4 bg-slate-100 rounded w-full"></div>
                        <div className="h-4 bg-slate-100 rounded w-[90%]"></div>
                        <div className="h-4 bg-slate-100 rounded w-[95%]"></div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-600 leading-relaxed">
                         <p className="font-bold text-slate-900 mb-2">Why {selectedAnnotation.markerGene}?</p>
                         <p className="whitespace-pre-wrap">{aiExplanation?.bio}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] shadow-xl p-8 space-y-6 relative overflow-hidden text-white">
                  <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                    <Brain className="w-32 h-32" />
                  </div>
                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center border border-indigo-500/20">
                      <Sparkles className="w-5 h-5 text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-tight">How AI Predicts</h3>
                  </div>
                  <div className="min-h-[160px] relative z-10">
                    {isGenerating ? (
                      <div className="space-y-3 opacity-50 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-full"></div>
                        <div className="h-4 bg-white/10 rounded w-[90%]"></div>
                        <div className="h-4 bg-white/10 rounded w-[95%]"></div>
                      </div>
                    ) : (
                      <div className="text-sm text-slate-300 leading-relaxed">
                        <p className="font-bold text-indigo-400 mb-2">Computational Methodology</p>
                        <p className="whitespace-pre-wrap">{aiExplanation?.model}</p>
                      </div>
                    )}
                  </div>
                  {!isGenerating && (
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-widest relative z-10">
                      <span>Model: ScanVI v2.1</span>
                      <span className="flex items-center gap-1"><Search className="w-3 h-3" /> Latent Space Mapping</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                 <div className="flex items-center gap-2 text-xs text-slate-400">
                   <Info className="w-4 h-4" />
                   Verification: Cell Ontology (CL) Mapped
                 </div>
                 <div className="flex gap-3">
                   <button className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl text-sm hover:bg-slate-50 transition-all">
                     Verify Manually
                   </button>
                   <button className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                     Approve Annotation
                   </button>
                 </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-20 text-center space-y-4">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
              <p className="text-slate-500 font-medium tracking-tight">Running automated cluster annotation engine...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CellTypeAnnotation;

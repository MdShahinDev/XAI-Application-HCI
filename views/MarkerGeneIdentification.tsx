
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Brain, 
  Network, 
  BarChart3, 
  Info, 
  ChevronLeft, 
  Loader2, 
  Sparkles,
  Eye,
  Download,
  Users,
  Search,
  Share2,
  ExternalLink,
  GitMerge,
  Dna
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Gene {
  name: string;
  score: number;
}

interface UmapPoint {
  id: string;
  x: number;
  y: number;
  color: string;
  cluster: number;
  geneName: string;
}

interface Pathway {
  name: string;
  relevance: number;
  id: string;
}

interface MarkerGeneIdentificationProps {
  onBack: () => void;
}

const MarkerGeneIdentification: React.FC<MarkerGeneIdentificationProps> = ({ onBack }) => {
  const [activeSubTab, setActiveSubTab] = useState<'Explainability' | 'Pathway Map' | 'Visualization'>('Explainability');
  const [selectedGene, setSelectedGene] = useState<Gene | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [pathwayAnalysis, setPathwayAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState<{ point: UmapPoint; mouseX: number; mouseY: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const genes: Gene[] = [
    { name: 'TP53', score: 92 },
    { name: 'EGFR', score: 85 },
    { name: 'BRCA1', score: 78 },
    { name: 'MYC', score: 72 },
    { name: 'VEGFA', score: 65 }
  ];

  const mockPathways: Pathway[] = [
    { id: '1', name: 'Apoptosis Signaling Pathway', relevance: 98 },
    { id: '2', name: 'Cell Cycle Control', relevance: 85 },
    { id: '3', name: 'DNA Damage Response', relevance: 92 },
    { id: '4', name: 'PI3K/Akt/mTOR Signaling', relevance: 74 }
  ];

  const clusterGenes = ['TP53', 'EGFR', 'BRCA1', 'MYC', 'VEGFA', 'CD4', 'CD8A', 'ERBB2', 'KRAS', 'ALK', 'MET', 'ROS1'];

  const umapPoints = useMemo(() => {
    const clusters = [
      { color: '#3b82f6', count: 40, centerX: 30, centerY: 70 },
      { color: '#a855f7', count: 45, centerX: 60, centerY: 40 },
      { color: '#f59e0b', count: 35, centerX: 40, centerY: 30 },
      { color: '#10b981', count: 50, centerX: 70, centerY: 60 }
    ];

    return clusters.flatMap((c, clusterIdx) => 
      Array.from({ length: c.count }).map((_, i) => ({
        id: `${clusterIdx}-${i}`,
        x: c.centerX + (Math.random() - 0.5) * 35,
        y: c.centerY + (Math.random() - 0.5) * 35,
        color: c.color,
        cluster: clusterIdx,
        geneName: clusterGenes[Math.floor(Math.random() * clusterGenes.length)]
      }))
    );
  }, []);

  const formatText = (text: string) => {
    return text.replace(/\*\*/g, '').replace(/^\s*[\*\-]\s+/gm, '• ').trim();
  };

  const handleGeneClick = async (gene: Gene) => {
    setSelectedGene(gene);
    setExplanation(null);
    setPathwayAnalysis(null);
    setIsGenerating(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      // We fetch both explanations if possible, or just the relevant one for the current tab
      const prompt = activeSubTab === 'Explainability' 
        ? `Provide a highly technical XAI explanation for why gene ${gene.name} is a primary driver. NO MARKDOWN.` 
        : `Explain the canonical biological pathways influenced by ${gene.name} in the context of cancer. NO MARKDOWN.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "You are a specialized computational biologist. Avoid all markdown formatting symbols like asterisks. Use standard professional typography."
        }
      });
      
      const formatted = formatText(response.text || "No insights available.");
      if (activeSubTab === 'Explainability') setExplanation(formatted);
      else setPathwayAnalysis(formatted);

    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (selectedGene) handleGeneClick(selectedGene);
  }, [activeSubTab]);

  const handlePointHover = (e: React.MouseEvent, point: UmapPoint) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setHoveredPoint({
        point: point,
        mouseX: e.clientX - rect.left,
        mouseY: e.clientY - rect.top
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white rounded-full transition-all border border-transparent hover:border-slate-200"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Single Cell Lung Adenocarcinoma</h1>
            <p className="text-slate-500 font-medium">R-1024 • Experiment Details</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-1 rounded-2xl flex shadow-sm">
          {['Explainability', 'Pathway Map', 'Visualization'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSubTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                activeSubTab === tab 
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab === 'Explainability' && <Brain className="w-4 h-4" />}
              {tab === 'Pathway Map' && <Network className="w-4 h-4" />}
              {tab === 'Visualization' && <BarChart3 className="w-4 h-4" />}
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeSubTab === 'Explainability' ? (
        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-8 flex flex-col">
            <div className="flex items-start justify-between mb-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-slate-900">Feature Importance</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-[10px] font-bold rounded uppercase tracking-widest border border-slate-200">Task 1</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">
                  The following genes were identified as the primary drivers for the classification of this sample. 
                  Click a bar to explore deep biological explanations.
                </p>
              </div>
            </div>

            <div className="space-y-6 flex-1 pr-4">
              {genes.map((gene) => (
                <button 
                  key={gene.name}
                  onClick={() => handleGeneClick(gene)}
                  className={`w-full group text-left space-y-2 focus:outline-none transition-all ${selectedGene?.name === gene.name ? 'scale-[1.02]' : ''}`}
                >
                  <div className="flex justify-between items-end mb-1">
                    <span className={`text-sm font-bold tracking-wide transition-colors ${selectedGene?.name === gene.name ? 'text-indigo-600' : 'text-slate-500'}`}>
                      {gene.name}
                    </span>
                  </div>
                  <div className="relative h-12 bg-slate-50 rounded-lg overflow-hidden border border-slate-100 group-hover:border-indigo-200 transition-all">
                    <div 
                      className={`h-full transition-all duration-1000 ease-out flex items-center px-4 ${
                        selectedGene?.name === gene.name ? 'bg-indigo-600/20' : 'bg-slate-400/30'
                      }`}
                      style={{ width: `${gene.score}%` }}
                    >
                      <div className={`h-full w-1 absolute left-0 ${selectedGene?.name === gene.name ? 'bg-indigo-600' : 'bg-slate-400'}`}></div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium italic">
              <span>Ranked by SHAP Global Attribution</span>
              <Info className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col relative">
            <div className="absolute top-8 right-8 opacity-10">
              <Brain className="w-32 h-32 text-white" />
            </div>

            <div className="relative z-10 p-10 flex-1 flex flex-col">
              {!selectedGene ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center">
                    <ChevronLeft className="w-8 h-8 text-slate-500" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-white">No Feature Selected</h4>
                    <p className="text-slate-400 max-w-[240px]">Select a ranked gene to explore its functional relevance.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 h-full flex flex-col">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl font-black text-white">{selectedGene.name}</span>
                      <div className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded-full text-xs font-bold border border-indigo-500/30 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> HIGH RELEVANCE
                      </div>
                    </div>
                    <p className="text-slate-400 text-sm font-medium tracking-wide">AI-IDENTIFIED BIOMARKER CANDIDATE</p>
                  </div>

                  <div className="flex-1 space-y-6">
                    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-slate-300 font-bold uppercase tracking-wider text-xs">Biological Reasoning</h5>
                        {isGenerating && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                      </div>
                      
                      <div className="text-slate-100 text-sm leading-relaxed min-h-[100px]">
                        {isGenerating ? (
                          <div className="space-y-3 opacity-50">
                            <div className="h-4 bg-white/10 rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-[90%] animate-pulse"></div>
                            <div className="h-4 bg-white/10 rounded w-[95%] animate-pulse"></div>
                          </div>
                        ) : (
                          <p className="whitespace-pre-wrap">{explanation}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Impact Score</p>
                        <p className="text-xl font-bold text-white">{selectedGene.score}%</p>
                      </div>
                      <div className="bg-white/5 border border-white/10 p-4 rounded-xl">
                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Certainty</p>
                        <p className="text-xl font-bold text-emerald-400">High</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto pt-6 border-t border-white/5">
                    <button 
                       onClick={() => setActiveSubTab('Pathway Map')}
                       className="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                    >
                      Open Full Pathway Discovery
                      <Network className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : activeSubTab === 'Pathway Map' ? (
        <div className="space-y-6 animate-in fade-in duration-500">
           <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column: Pathway Network Visual */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col min-h-[600px] relative overflow-hidden">
                <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-slate-900">Biological Connectivity</h3>
                    <p className="text-slate-500 text-sm">Interactive Gene-Pathway-Functional interaction network.</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                        <Share2 className="w-4 h-4" />
                     </button>
                     <button className="p-2 bg-slate-50 rounded-lg text-slate-400 hover:text-indigo-600 transition-colors">
                        <Download className="w-4 h-4" />
                     </button>
                  </div>
                </div>

                {/* Network SVG Viewport */}
                <div className="flex-1 bg-slate-50/50 rounded-3xl border border-slate-100 relative flex items-center justify-center overflow-hidden group">
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
                   
                   <svg className="w-full h-full relative z-10" viewBox="0 0 800 500">
                      {/* Connections */}
                      <g className="opacity-20">
                         <line x1="400" y1="250" x2="200" y2="150" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                         <line x1="400" y1="250" x2="600" y2="150" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                         <line x1="400" y1="250" x2="400" y2="100" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                         <line x1="400" y1="250" x2="200" y2="350" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                         <line x1="400" y1="250" x2="600" y2="350" stroke="#4f46e5" strokeWidth="2" strokeDasharray="5,5" />
                      </g>

                      {/* Functional Nodes */}
                      <circle cx="200" cy="150" r="12" fill="#e2e8f0" />
                      <circle cx="600" cy="150" r="12" fill="#e2e8f0" />
                      <circle cx="400" cy="100" r="12" fill="#e2e8f0" />
                      <circle cx="200" cy="350" r="12" fill="#e2e8f0" />
                      <circle cx="600" cy="350" r="12" fill="#e2e8f0" />

                      {/* Main Gene Node */}
                      <g className="cursor-pointer hover:scale-110 transition-transform duration-300 origin-center">
                        <circle cx="400" cy="250" r="45" fill="#4f46e5" className="animate-pulse duration-[3000ms]" />
                        <circle cx="400" cy="250" r="35" fill="white" fillOpacity="0.2" />
                        <text x="400" y="255" textAnchor="middle" fill="white" className="text-sm font-black tracking-widest">{selectedGene?.name || 'GENE'}</text>
                      </g>

                      {/* Labels */}
                      <text x="200" y="180" textAnchor="middle" fill="#64748b" className="text-[10px] font-bold">DNA REPAIR</text>
                      <text x="600" y="180" textAnchor="middle" fill="#64748b" className="text-[10px] font-bold">APOPTOSIS</text>
                      <text x="400" y="130" textAnchor="middle" fill="#64748b" className="text-[10px] font-bold">CELL CYCLE</text>
                      <text x="200" y="380" textAnchor="middle" fill="#64748b" className="text-[10px] font-bold">METABOLISM</text>
                      <text x="600" y="380" textAnchor="middle" fill="#64748b" className="text-[10px] font-bold">ANGIOGENESIS</text>
                   </svg>

                   <div className="absolute bottom-6 right-6 flex items-center gap-4">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Primary Hub
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                         <span className="w-2 h-2 rounded-full bg-slate-300"></span> Function
                      </div>
                   </div>
                </div>
              </div>

              {/* Right Column: AI Analysis & Pathway List */}
              <div className="space-y-6">
                 {/* AI Intelligence Card */}
                 <div className="bg-slate-900 rounded-[2.5rem] shadow-xl p-8 text-white space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                       <GitMerge className="w-32 h-32" />
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                       <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                          <Brain className="w-6 h-6 text-indigo-400" />
                       </div>
                       <h3 className="text-xl font-bold tracking-tight">Pathway Insights</h3>
                    </div>

                    <div className="min-h-[200px] relative z-10">
                       {isGenerating ? (
                          <div className="space-y-3 opacity-50 animate-pulse">
                             <div className="h-4 bg-white/10 rounded w-full"></div>
                             <div className="h-4 bg-white/10 rounded w-[90%]"></div>
                             <div className="h-4 bg-white/10 rounded w-[95%]"></div>
                          </div>
                       ) : (
                          <div className="text-sm text-slate-300 leading-relaxed">
                             <p className="font-bold text-indigo-400 mb-2 uppercase tracking-widest text-[10px]">Model Evaluation</p>
                             <p className="whitespace-pre-wrap">{pathwayAnalysis || "Select a marker gene to generate specific pathway connectivity insights."}</p>
                          </div>
                       )}
                    </div>
                 </div>

                 {/* Canonical Pathways List */}
                 <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                       <h4 className="text-sm font-bold text-slate-900">Enriched Pathways</h4>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Source: KEGG / Reactome</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                       {mockPathways.map((path) => (
                          <div key={path.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                             <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-800">{path.name}</p>
                                <div className="flex items-center gap-2">
                                   <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500" style={{ width: `${path.relevance}%` }}></div>
                                   </div>
                                   <span className="text-[9px] text-slate-400 font-bold">{path.relevance}% MATCH</span>
                                </div>
                             </div>
                             <button className="text-slate-300 group-hover:text-indigo-600 transition-colors">
                                <ExternalLink className="w-4 h-4" />
                             </button>
                          </div>
                       ))}
                    </div>
                    <button className="w-full py-4 text-xs font-bold text-indigo-600 hover:bg-indigo-50 transition-colors border-t border-slate-50">
                       View Comprehensive Enrichment Table
                    </button>
                 </div>
              </div>
           </div>
        </div>
      ) : activeSubTab === 'Visualization' ? (
        <div className="space-y-6">
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-slate-900">Guided Visualization</h2>
              <p className="text-slate-500 text-sm">Dimensionality reduction (UMAP) of single-cell populations.</p>
            </div>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
              <Eye className="w-4 h-4" />
              Enable Focus Mode
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            <div 
              ref={containerRef}
              className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8 flex flex-col min-h-[600px] relative"
            >
              <div className="flex gap-4 mb-8">
                {[
                  { label: 'Cluster 0', color: 'bg-blue-500' },
                  { label: 'Cluster 1', color: 'bg-purple-500' },
                  { label: 'Cluster 2', color: 'bg-orange-500' },
                  { label: 'Cluster 3', color: 'bg-emerald-500' }
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-100 bg-white text-xs font-bold text-slate-600 shadow-sm">
                    <span className={`w-2 h-2 rounded-full ${item.color}`} />
                    {item.label}
                  </div>
                ))}
              </div>

              {hoveredPoint && (
                <div 
                  className="absolute z-50 pointer-events-none bg-slate-900/95 text-white p-3 rounded-xl shadow-2xl border border-white/10 animate-in fade-in zoom-in duration-150 backdrop-blur-sm"
                  style={{ 
                    left: hoveredPoint.mouseX + 15, 
                    top: hoveredPoint.mouseY - 45,
                    transform: 'translateY(-50%)' 
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: hoveredPoint.point.color }} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cluster {hoveredPoint.point.cluster}</span>
                  </div>
                  <div className="text-sm font-bold">{hoveredPoint.point.geneName}</div>
                </div>
              )}

              <div className="flex-1 relative border border-slate-50 rounded-2xl bg-slate-50/30 overflow-hidden">
                <div className="absolute inset-0 grid grid-cols-4 grid-rows-4">
                  {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-slate-200/50 border-dashed" />
                  ))}
                </div>

                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {umapPoints.map((point) => (
                    <circle
                      key={point.id}
                      cx={point.x}
                      cy={point.y}
                      r="0.8"
                      fill={point.color}
                      className="opacity-70 hover:opacity-100 cursor-pointer transition-all duration-200"
                      onMouseEnter={(e) => handlePointHover(e, point)}
                      onMouseMove={(e) => handlePointHover(e, point)}
                      onMouseLeave={() => setHoveredPoint(null)}
                    />
                  ))}
                </svg>

                <div className="absolute bottom-4 left-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest">UMAP_1</div>
                <div className="absolute top-4 left-4 text-[10px] font-bold text-slate-300 uppercase tracking-widest origin-left -rotate-90 translate-y-12">UMAP_2</div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-slate-900 rounded-[2rem] p-8 shadow-xl text-white space-y-8">
                <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-lg font-bold">Annotation Guide</h3>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Spatial Focus</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Cells in the highlighted region demonstrate significant upregulation of hypoxia-related markers.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em]">Biological Context</p>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Cluster analysis suggests a transition state between epithelial and mesenchymal phenotypes.
                    </p>
                  </div>
                </div>

                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-sm font-bold flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Explore Markers
                </button>
              </div>

              <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-4">
                <h4 className="text-sm font-bold text-slate-900 px-2">Export Analysis</h4>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl transition-all border border-slate-100">
                    <Download className="w-4 h-4" />
                    Download PDF Report
                  </button>
                  <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-bold rounded-xl transition-all border border-indigo-100">
                    <Users className="w-4 h-4" />
                    Collaborate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center min-h-[500px] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
            <BarChart3 className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">{activeSubTab} Loading...</h3>
          <p className="text-slate-500 max-w-sm">Generating high-fidelity visualization for the current experiment context. This might take a few seconds.</p>
          <div className="w-64 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 w-1/3 animate-pulse origin-left"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarkerGeneIdentification;

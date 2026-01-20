
import React, { useState } from 'react';
import { 
  Upload, 
  File, 
  ChevronRight, 
  PlayCircle, 
  Database, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Experiment } from '../types';

interface DashboardHomeProps {
  onNavigateToMarkers?: () => void;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ onNavigateToMarkers }) => {
  const [isDragging, setIsDragging] = useState(false);

  const stats = [
    { label: 'Active Runs', value: '12', icon: PlayCircle, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Total Datasets', value: '148', icon: Database, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'AI Models', value: '7', icon: Cpu, color: 'text-orange-600', bg: 'bg-orange-50' }
  ];

  const recentExperiments: Experiment[] = [
    { id: '1', name: 'Single Cell Lung Adenocarcinoma', date: '2 hours ago', status: 'Completed', type: 'Single Cell RNA-seq' },
    { id: '2', name: 'Cardiac Fibrosis Pathway Analysis', date: '5 hours ago', status: 'Processing', type: 'Spatial Transcriptomics' },
    { id: '3', name: 'Neuro-Degenerative Gene Network', date: '1 day ago', status: 'Completed', type: 'Bulk RNA-seq' },
    { id: '4', name: 'Glioblastoma Microenvironment Mapping', date: '2 days ago', status: 'Failed', type: 'Multi-omics' },
    { id: '5', name: 'Immunotherapy Response Markers', date: '3 days ago', status: 'Completed', type: 'Epigenomics' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">Welcome Back, Researcher Group</h1>
        <p className="text-slate-500 text-lg">Your automated genomic analysis pipeline is ready.</p>
      </div>

      {/* Upload System */}
      <div 
        className={`relative border-2 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center text-center gap-4 ${
          isDragging ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]' : 'border-slate-200 bg-white hover:border-indigo-300'
        }`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); }}
      >
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
          <Upload className="w-8 h-8 text-slate-400" />
        </div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-900">Upload Genomic Data</p>
          <p className="text-slate-500">Drag and drop FASTQ, BAM or CSV files (Max 2GB)</p>
        </div>
        <input 
          type="file" 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={(e) => console.log('File selected:', e.target.files?.[0]?.name)} 
        />
        <button className="mt-2 bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-medium shadow-sm hover:bg-indigo-700 transition-colors">
          Browse Files
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Experiments */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-900">Recent Experiments</h3>
          <button className="text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">View All Experiments</button>
        </div>
        <div className="divide-y divide-slate-100">
          {recentExperiments.map((exp) => (
            <div 
              key={exp.id} 
              onClick={() => exp.id === '1' && onNavigateToMarkers?.()}
              className="p-6 hover:bg-slate-50 transition-all flex items-center justify-between group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <File className="w-5 h-5 text-slate-500" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{exp.name}</p>
                  <p className="text-xs text-slate-400">{exp.type} • {exp.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  {exp.status === 'Completed' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  {exp.status === 'Processing' && <Clock className="w-4 h-4 text-indigo-500 animate-pulse" />}
                  {exp.status === 'Failed' && <AlertCircle className="w-4 h-4 text-red-500" />}
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    exp.status === 'Completed' ? 'text-emerald-600' :
                    exp.status === 'Processing' ? 'text-indigo-600' :
                    'text-red-600'
                  }`}>
                    {exp.status}
                  </span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transform group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;

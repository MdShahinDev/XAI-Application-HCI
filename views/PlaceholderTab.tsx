
import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderTabProps {
  title: string;
}

const PlaceholderTab: React.FC<PlaceholderTabProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mb-4">
        <Construction className="w-10 h-10 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">{title} Pipeline</h2>
      <p className="text-slate-500 max-w-md">
        This high-fidelity prototype module is currently under active development. 
        Advanced genomic visualization tools for {title} will be available in the next iteration.
      </p>
      <button className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:bg-slate-800 transition-all">
        Notify When Ready
      </button>
    </div>
  );
};

export default PlaceholderTab;


import React from 'react';
import { DashboardTab } from '../types';
import { 
  LayoutDashboard, 
  Dna, 
  Tags, 
  Activity, 
  MessageSquareText,
  LogOut,
  Microscope
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  activeTab, 
  onTabChange,
  onLogout
}) => {
  const menuItems = [
    { id: DashboardTab.DASHBOARD, icon: LayoutDashboard },
    { id: DashboardTab.MARKER_GENE, icon: Microscope },
    { id: DashboardTab.CELL_TYPE, icon: Tags },
    { id: DashboardTab.CELL_STATUS, icon: Activity },
    { id: DashboardTab.ASK_AI, icon: MessageSquareText }
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
        <button 
          onClick={onLogout}
          className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity text-left w-full group"
          title="Go to Home"
        >
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Dna className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">GenomicsXAI</span>
        </button>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'}`} />
              {item.id}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-500 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout System
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-slate-50">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-slate-800">{activeTab}</h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                System Online
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden">
              <img src="https://picsum.photos/seed/researcher/100/100" alt="Profile" />
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;

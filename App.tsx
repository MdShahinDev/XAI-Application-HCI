
import React, { useState } from 'react';
import { View, DashboardTab } from './types';
import LandingPage from './views/LandingPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './views/DashboardHome';
import AskAI from './views/AskAI';
import PlaceholderTab from './views/PlaceholderTab';
import MarkerGeneIdentification from './views/MarkerGeneIdentification';
import CellStatus from './views/CellStatus';
import CellTypeAnnotation from './views/CellTypeAnnotation';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.DASHBOARD);

  const navigateToDashboard = () => setCurrentView(View.DASHBOARD);
  const navigateToLanding = () => setCurrentView(View.LANDING);

  if (currentView === View.LANDING) {
    return <LandingPage onEnterDashboard={navigateToDashboard} />;
  }

  return (
    <DashboardLayout 
      activeTab={activeTab} 
      onTabChange={setActiveTab}
      onLogout={navigateToLanding}
    >
      {activeTab === DashboardTab.DASHBOARD && <DashboardHome onNavigateToMarkers={() => setActiveTab(DashboardTab.MARKER_GENE)} />}
      {activeTab === DashboardTab.MARKER_GENE && <MarkerGeneIdentification onBack={() => setActiveTab(DashboardTab.DASHBOARD)} />}
      {activeTab === DashboardTab.CELL_STATUS && <CellStatus onBack={() => setActiveTab(DashboardTab.DASHBOARD)} />}
      {activeTab === DashboardTab.CELL_TYPE && <CellTypeAnnotation onBack={() => setActiveTab(DashboardTab.DASHBOARD)} />}
      {activeTab === DashboardTab.ASK_AI && <AskAI />}
      {activeTab !== DashboardTab.DASHBOARD && 
       activeTab !== DashboardTab.MARKER_GENE && 
       activeTab !== DashboardTab.CELL_STATUS &&
       activeTab !== DashboardTab.CELL_TYPE &&
       activeTab !== DashboardTab.ASK_AI && (
        <PlaceholderTab title={activeTab} />
      )}
    </DashboardLayout>
  );
};

export default App;
